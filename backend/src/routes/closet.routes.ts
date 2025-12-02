import { Router, Response } from 'express';
import multer from 'multer';
import { query } from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import storageService from '../services/storage.service';
import geminiService from '../services/gemini.service';
import { ClothingItem } from '../types';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// Get all clothing items for user
router.get('/items', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const result = await query(
      `SELECT * FROM clothing_items
       WHERE user_id = $1 AND is_active = true
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({ items: result.rows });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ error: 'Failed to fetch clothing items' });
  }
});

// Get specific clothing item
router.get('/items/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const itemId = req.params.id;

    const result = await query(
      'SELECT * FROM clothing_items WHERE id = $1 AND user_id = $2',
      [itemId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ item: result.rows[0] });
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// Upload and process photos
router.post('/upload', authenticate, upload.array('photos', 10), async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Create upload session
    const sessionResult = await query(
      `INSERT INTO upload_sessions (user_id, status, photo_urls)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [userId, 'processing', []]
    );

    const sessionId = sessionResult.rows[0].id;

    // Process images in background (don't wait)
    processImages(userId!, files, sessionId).catch(console.error);

    res.json({
      message: 'Upload started',
      session_id: sessionId,
      files_count: files.length,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload photos' });
  }
});

// Helper function to process images
async function processImages(userId: string, files: Express.Multer.File[], sessionId: string) {
  try {
    const uploadedUrls: string[] = [];
    let itemsExtracted = 0;

    for (const file of files) {
      try {
        // Upload to S3
        const imageUrl = await storageService.uploadImage(file, userId);
        uploadedUrls.push(imageUrl);

        // Analyze with Gemini
        const base64Image = storageService.bufferToBase64(file.buffer);
        const items = await geminiService.analyzeClothing(base64Image);

        // Save items to database
        for (const item of items) {
          await query(
            `INSERT INTO clothing_items (
              user_id, image_url, item_type, color_primary, color_secondary,
              style, pattern, weather_suitability, formality_level, ai_description
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
              userId,
              imageUrl,
              item.item_type,
              item.color_primary,
              item.color_secondary,
              item.style,
              item.pattern,
              JSON.stringify(item.weather_suitability),
              item.formality_level,
              item.description,
            ]
          );
          itemsExtracted++;
        }
      } catch (error) {
        console.error('Error processing individual file:', error);
      }
    }

    // Update session
    await query(
      `UPDATE upload_sessions
       SET status = $1, photo_urls = $2, items_extracted = $3, completed_at = NOW()
       WHERE id = $4`,
      ['completed', uploadedUrls, itemsExtracted, sessionId]
    );
  } catch (error) {
    console.error('Process images error:', error);
    await query(
      `UPDATE upload_sessions
       SET status = $1, error_message = $2, completed_at = NOW()
       WHERE id = $3`,
      ['failed', (error as Error).message, sessionId]
    );
  }
}

// Check upload session status
router.get('/upload/:sessionId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const sessionId = req.params.sessionId;

    const result = await query(
      'SELECT * FROM upload_sessions WHERE id = $1 AND user_id = $2',
      [sessionId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ session: result.rows[0] });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// Update clothing item
router.put('/items/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const itemId = req.params.id;
    const updates = req.body;

    // Build update query dynamically
    const allowedFields = [
      'item_type',
      'color_primary',
      'color_secondary',
      'style',
      'pattern',
      'formality_level',
      'weather_suitability',
      'is_active',
    ];

    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramIndex = 1;

    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = $${paramIndex}`);
        updateValues.push(
          key === 'weather_suitability' ? JSON.stringify(updates[key]) : updates[key]
        );
        paramIndex++;
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updateValues.push(itemId, userId);

    const result = await query(
      `UPDATE clothing_items
       SET ${updateFields.join(', ')}
       WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
       RETURNING *`,
      updateValues
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ item: result.rows[0] });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Delete clothing item
router.delete('/items/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const itemId = req.params.id;

    // Get item to delete image from S3
    const itemResult = await query(
      'SELECT image_url FROM clothing_items WHERE id = $1 AND user_id = $2',
      [itemId, userId]
    );

    if (itemResult.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Soft delete (set is_active to false)
    await query(
      'UPDATE clothing_items SET is_active = false WHERE id = $1',
      [itemId]
    );

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

export default router;
