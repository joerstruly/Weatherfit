import admin from 'firebase-admin';

// Initialize Firebase Admin
if (process.env.FCM_PROJECT_ID && process.env.FCM_PRIVATE_KEY && process.env.FCM_CLIENT_EMAIL) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FCM_PROJECT_ID,
      privateKey: process.env.FCM_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FCM_CLIENT_EMAIL,
    }),
  });
}

export class NotificationService {
  async sendOutfitNotification(
    fcmToken: string,
    outfitId: string,
    weather: { temperature: number; description: string }
  ): Promise<void> {
    try {
      const message = {
        token: fcmToken,
        notification: {
          title: '☀️ Your outfit for today',
          body: `Perfect for ${weather.temperature}°F and ${weather.description}! Tap to see your look.`,
        },
        data: {
          type: 'daily_outfit',
          outfit_id: outfitId,
          weather: weather.description,
        },
      };

      await admin.messaging().send(message);
      console.log('Notification sent successfully');
    } catch (error) {
      console.error('FCM send error:', error);
      // Don't throw error - notifications are not critical
    }
  }

  async sendMultipleNotifications(
    notifications: Array<{ fcmToken: string; outfitId: string; weather: any }>
  ): Promise<void> {
    const promises = notifications.map((notif) =>
      this.sendOutfitNotification(notif.fcmToken, notif.outfitId, notif.weather)
    );

    await Promise.allSettled(promises);
  }
}

export default new NotificationService();
