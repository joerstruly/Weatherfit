import { Router, Response } from 'express';
import { query } from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import geminiService from '../services/gemini.service';
import weatherService from '../services/weather.service';
import { ClothingItem } from '../types';

const router = Router();

// Get today's outfit recommendation
router.get('/daily', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    // Get user's zip code
    const userResult = await query('SELECT zip_code FROM users WHERE id = $1', [userId]);

    if (userResult.rows.length === 0 || !userResult.rows[0].zip_code) {
      return res.status(400).json({ error: 'Please set your zip code in profile settings' });
    }

    const zipCode = userResult.rows[0].zip_code;

    // Check if outfit already exists for today
    const today = new Date().toISOString().split('T')[0];
    const existingOutfit = await query(
      `SELECT * FROM outfit_history
       WHERE user_id = $1 AND outfit_date = $2
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId, today]
    );

    if (existingOutfit.rows.length > 0) {
      // Return existing outfit with items
      const outfit = existingOutfit.rows[0];
      const itemsResult = await query(
        `SELECT * FROM clothing_items WHERE id = ANY($1)`,
        [outfit.clothing_items]
      );

      return res.json({
        outfit: {
          id: outfit.id,
          date: outfit.outfit_date,
          items: itemsResult.rows,
          weather: outfit.weather_conditions,
          reasoning: outfit.reasoning,
          was_worn: outfit.was_worn,
          feedback: outfit.user_feedback,
        },
      });
    }

    // Generate new outfit
    const weather = await weatherService.getWeatherByZipCode(zipCode);

    // Get all active clothing items
    const itemsResult = await query(
      'SELECT * FROM clothing_items WHERE user_id = $1 AND is_active = true',
      [userId]
    );

    if (itemsResult.rows.length < 3) {
      return res.status(400).json({
        error: 'Not enough clothing items. Please upload more photos of your closet.',
      });
    }

    // Get recent outfits to avoid repetition
    const recentOutfits = await query(
      `SELECT clothing_items FROM outfit_history
       WHERE user_id = $1 AND outfit_date >= CURRENT_DATE - INTERVAL '7 days'
       ORDER BY outfit_date DESC`,
      [userId]
    );

    const recentItems = recentOutfits.rows.map((o) => o.clothing_items);

    // Generate recommendation
    const recommendation = await geminiService.generateOutfitRecommendation(
      itemsResult.rows as ClothingItem[],
      weather,
      recentItems
    );

    // Save to database
    const saveResult = await query(
      `INSERT INTO outfit_history (user_id, outfit_date, clothing_items, weather_conditions, reasoning)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        userId,
        today,
        recommendation.outfit,
        JSON.stringify(weather),
        recommendation.reasoning,
      ]
    );

    const savedOutfit = saveResult.rows[0];

    // Get full item details
    const outfitItemsResult = await query(
      `SELECT * FROM clothing_items WHERE id = ANY($1)`,
      [recommendation.outfit]
    );

    res.json({
      outfit: {
        id: savedOutfit.id,
        date: savedOutfit.outfit_date,
        items: outfitItemsResult.rows,
        weather: weather,
        reasoning: recommendation.reasoning,
      },
    });
  } catch (error) {
    console.error('Generate outfit error:', error);
    res.status(500).json({ error: 'Failed to generate outfit recommendation' });
  }
});

// Regenerate outfit (get alternative)
router.post('/regenerate', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    // Get user's zip code
    const userResult = await query('SELECT zip_code FROM users WHERE id = $1', [userId]);

    if (userResult.rows.length === 0 || !userResult.rows[0].zip_code) {
      return res.status(400).json({ error: 'Please set your zip code in profile settings' });
    }

    const zipCode = userResult.rows[0].zip_code;
    const weather = await weatherService.getWeatherByZipCode(zipCode);

    // Get all active clothing items
    const itemsResult = await query(
      'SELECT * FROM clothing_items WHERE user_id = $1 AND is_active = true',
      [userId]
    );

    // Get ALL outfits from today to avoid regenerating the same ones
    const today = new Date().toISOString().split('T')[0];
    const todayOutfits = await query(
      `SELECT clothing_items FROM outfit_history
       WHERE user_id = $1 AND outfit_date = $2`,
      [userId, today]
    );

    // Also include recent week's outfits
    const recentOutfits = await query(
      `SELECT clothing_items FROM outfit_history
       WHERE user_id = $1 AND outfit_date >= CURRENT_DATE - INTERVAL '7 days'
       ORDER BY outfit_date DESC`,
      [userId]
    );

    const avoidItems = [...todayOutfits.rows, ...recentOutfits.rows].map((o) => o.clothing_items);

    // Generate new recommendation
    const recommendation = await geminiService.generateOutfitRecommendation(
      itemsResult.rows as ClothingItem[],
      weather,
      avoidItems
    );

    // Save to database
    const saveResult = await query(
      `INSERT INTO outfit_history (user_id, outfit_date, clothing_items, weather_conditions, reasoning)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        userId,
        today,
        recommendation.outfit,
        JSON.stringify(weather),
        recommendation.reasoning,
      ]
    );

    const savedOutfit = saveResult.rows[0];

    // Get full item details
    const outfitItemsResult = await query(
      `SELECT * FROM clothing_items WHERE id = ANY($1)`,
      [recommendation.outfit]
    );

    res.json({
      outfit: {
        id: savedOutfit.id,
        date: savedOutfit.outfit_date,
        items: outfitItemsResult.rows,
        weather: weather,
        reasoning: recommendation.reasoning,
      },
    });
  } catch (error) {
    console.error('Regenerate outfit error:', error);
    res.status(500).json({ error: 'Failed to regenerate outfit' });
  }
});

// Submit feedback on outfit
router.post('/feedback', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { outfit_id, feedback, was_worn } = req.body;

    if (!outfit_id) {
      return res.status(400).json({ error: 'outfit_id is required' });
    }

    // Validate feedback
    const validFeedback = ['loved', 'liked', 'neutral', 'disliked'];
    if (feedback && !validFeedback.includes(feedback)) {
      return res.status(400).json({ error: 'Invalid feedback value' });
    }

    // Update outfit
    const result = await query(
      `UPDATE outfit_history
       SET user_feedback = $1, was_worn = $2
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [feedback || null, was_worn !== undefined ? was_worn : null, outfit_id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Outfit not found' });
    }

    res.json({ message: 'Feedback submitted', outfit: result.rows[0] });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Get outfit history
router.get('/history', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const limit = parseInt(req.query.limit as string) || 30;
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await query(
      `SELECT * FROM outfit_history
       WHERE user_id = $1
       ORDER BY outfit_date DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    // For each outfit, get the clothing items
    const outfitsWithItems = await Promise.all(
      result.rows.map(async (outfit) => {
        const itemsResult = await query(
          `SELECT * FROM clothing_items WHERE id = ANY($1)`,
          [outfit.clothing_items]
        );
        return {
          ...outfit,
          items: itemsResult.rows,
        };
      })
    );

    res.json({ outfits: outfitsWithItems });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to fetch outfit history' });
  }
});

export default router;
