import cron from 'node-cron';
import { query } from '../config/database';
import geminiService from './gemini.service';
import weatherService from './weather.service';
import notificationService from './notification.service';
import { ClothingItem } from '../types';

export class SchedulerService {
  start() {
    // Run every hour to check for users who need outfit notifications
    cron.schedule('0 * * * *', async () => {
      console.log('Running outfit notification scheduler...');
      await this.sendDailyOutfits();
    });

    console.log('✅ Scheduler service started');
  }

  async sendDailyOutfits() {
    try {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();

      // Get users who should receive notifications at this hour
      const usersResult = await query(
        `SELECT id, email, zip_code, fcm_token, notification_time
         FROM users
         WHERE notification_enabled = true
           AND fcm_token IS NOT NULL
           AND zip_code IS NOT NULL
           AND EXTRACT(HOUR FROM notification_time) = $1`,
        [currentHour]
      );

      console.log(`Found ${usersResult.rows.length} users for notification`);

      for (const user of usersResult.rows) {
        try {
          // Check if outfit already exists for today
          const today = new Date().toISOString().split('T')[0];
          const existingOutfit = await query(
            `SELECT id FROM outfit_history
             WHERE user_id = $1 AND outfit_date = $2`,
            [user.id, today]
          );

          let outfitId: string;

          if (existingOutfit.rows.length > 0) {
            outfitId = existingOutfit.rows[0].id;
          } else {
            // Generate outfit for user
            const weather = await weatherService.getWeatherByZipCode(user.zip_code);

            const itemsResult = await query(
              'SELECT * FROM clothing_items WHERE user_id = $1 AND is_active = true',
              [user.id]
            );

            if (itemsResult.rows.length < 3) {
              console.log(`User ${user.email} doesn't have enough items`);
              continue;
            }

            // Get recent outfits
            const recentOutfits = await query(
              `SELECT clothing_items FROM outfit_history
               WHERE user_id = $1 AND outfit_date >= CURRENT_DATE - INTERVAL '7 days'`,
              [user.id]
            );

            const recentItems = recentOutfits.rows.map((o) => o.clothing_items);

            const recommendation = await geminiService.generateOutfitRecommendation(
              itemsResult.rows as ClothingItem[],
              weather,
              recentItems
            );

            const saveResult = await query(
              `INSERT INTO outfit_history (user_id, outfit_date, clothing_items, weather_conditions, reasoning)
               VALUES ($1, $2, $3, $4, $5)
               RETURNING id`,
              [user.id, today, recommendation.outfit, JSON.stringify(weather), recommendation.reasoning]
            );

            outfitId = saveResult.rows[0].id;
          }

          // Send notification
          const weather = await weatherService.getWeatherByZipCode(user.zip_code);
          await notificationService.sendOutfitNotification(user.fcm_token, outfitId, {
            temperature: weather.temperature,
            description: weather.description,
          });

          console.log(`✅ Sent notification to ${user.email}`);
        } catch (error) {
          console.error(`Failed to send notification to ${user.email}:`, error);
        }
      }
    } catch (error) {
      console.error('Scheduler error:', error);
    }
  }
}

export default new SchedulerService();
