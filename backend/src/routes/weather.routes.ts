import { Router, Response } from 'express';
import { query } from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import weatherService from '../services/weather.service';

const router = Router();

// Get current weather for user's location
router.get('/current', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    // Get user's zip code
    const result = await query('SELECT zip_code FROM users WHERE id = $1', [userId]);

    if (result.rows.length === 0 || !result.rows[0].zip_code) {
      return res.status(400).json({ error: 'Please set your zip code in profile settings' });
    }

    const zipCode = result.rows[0].zip_code;
    const weather = await weatherService.getWeatherByZipCode(zipCode);

    res.json({ weather });
  } catch (error) {
    console.error('Get weather error:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Get weather forecast
router.get('/forecast', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const days = parseInt(req.query.days as string) || 5;

    const result = await query('SELECT zip_code FROM users WHERE id = $1', [userId]);

    if (result.rows.length === 0 || !result.rows[0].zip_code) {
      return res.status(400).json({ error: 'Please set your zip code in profile settings' });
    }

    const zipCode = result.rows[0].zip_code;
    const forecast = await weatherService.getForecast(zipCode, days);

    res.json({ forecast });
  } catch (error) {
    console.error('Get forecast error:', error);
    res.status(500).json({ error: 'Failed to fetch weather forecast' });
  }
});

export default router;
