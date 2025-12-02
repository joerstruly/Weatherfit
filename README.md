# Weatherfit - AI Outfit Recommendation App

An intelligent web application that uses AI to catalog your clothing from photos and recommends daily outfits based on weather conditions.

## Features

- **AI-Powered Clothing Catalog**: Upload photos of your closet and let Google Gemini 2.0 Flash identify and categorize your clothing items
- **Weather-Based Recommendations**: Get daily outfit suggestions optimized for current weather conditions
- **Smart Outfit Generation**: AI considers color coordination, style matching, and recent outfit history
- **Push Notifications**: Receive daily outfit notifications at your preferred time
- **Progressive Web App**: Install on your phone for a native app experience
- **Photo Management**: Easy upload and management of clothing items

## Technology Stack

### Backend
- **Node.js** with **Express** and **TypeScript**
- **PostgreSQL** for data storage
- **Google Gemini 2.0 Flash** for AI-powered clothing analysis and outfit generation
- **OpenWeatherMap API** for weather data
- **AWS S3** for image storage
- **Firebase Cloud Messaging** for push notifications
- **JWT** authentication

### Frontend
- **React** with **TypeScript**
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **PWA** support with offline capabilities

## Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ installed
- **PostgreSQL** 14+ installed and running
- **AWS Account** (for S3 image storage)
- **Google Gemini API Key** (get one at https://makersuite.google.com/app/apikey)
- **OpenWeatherMap API Key** (free tier at https://openweathermap.org/api)
- **Firebase Project** (optional, for push notifications)

## Quick Start

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd Weatherfit
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your API keys and configuration
nano .env
```

#### Configure Environment Variables

Edit `backend/.env`:

```env
# Server
PORT=3001
NODE_ENV=development

# Database (update with your PostgreSQL credentials)
DATABASE_URL=postgresql://username:password@localhost:5432/weatherfit

# JWT Secret (generate a secure random string)
JWT_SECRET=your_secure_random_string_here
JWT_EXPIRES_IN=7d

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# OpenWeatherMap API
WEATHER_API_KEY=your_openweather_api_key_here

# AWS S3
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key

# Firebase (optional, for notifications)
FCM_PROJECT_ID=your_project_id
FCM_PRIVATE_KEY=your_private_key
FCM_CLIENT_EMAIL=your_client_email

# CORS
FRONTEND_URL=http://localhost:3000
```

#### Create Database and Run Migrations

```bash
# Create PostgreSQL database
createdb weatherfit

# Run migrations
npm run migrate

# Start development server
npm run dev
```

The backend API will be available at `http://localhost:3001`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

#### Configure Frontend Environment

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:3001

# Firebase (optional, for notifications)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_VAPID_KEY=your_vapid_key
```

#### Start Frontend Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Usage Guide

### First Time Setup

1. **Create Account**: Sign up with your email, password, and zip code
2. **Upload Photos**: Navigate to "Closet" and upload photos of your clothing
3. **Wait for Processing**: The AI will analyze your photos (usually takes 10-30 seconds)
4. **View Your Closet**: See all cataloged clothing items
5. **Get Outfit Recommendation**: Go to "Today" to see your daily outfit

### Daily Usage

1. **Check Today's Outfit**: View AI-generated outfit recommendation
2. **Provide Feedback**: Like/love/dislike outfits to improve future recommendations
3. **Regenerate**: Don't like the suggestion? Click "Try Another" for alternatives
4. **Enable Notifications**: Set up push notifications in Profile settings

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Closet Management
- `GET /api/closet/items` - Get all clothing items
- `POST /api/closet/upload` - Upload photos
- `GET /api/closet/upload/:sessionId` - Check upload status
- `PUT /api/closet/items/:id` - Update item
- `DELETE /api/closet/items/:id` - Delete item

### Outfit Recommendations
- `GET /api/outfit/daily` - Get today's outfit
- `POST /api/outfit/regenerate` - Generate new outfit
- `POST /api/outfit/feedback` - Submit feedback
- `GET /api/outfit/history` - Get outfit history

### User & Weather
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/notification-time` - Update notification settings
- `GET /api/weather/current` - Get current weather

## Development

### Backend Development

```bash
cd backend

# Development with auto-reload
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run migrations
npm run migrate
```

### Frontend Development

```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Backend Deployment (Railway/Render/Fly.io)

1. Create a new project on your platform
2. Connect your GitHub repository
3. Set environment variables in the platform dashboard
4. The platform will automatically:
   - Install dependencies
   - Run migrations
   - Start the server

### Frontend Deployment (Vercel/Netlify)

1. Connect your GitHub repository
2. Set build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
3. Add environment variables
4. Deploy

### Database Hosting

Use **Supabase**, **Neon**, or **Railway** for PostgreSQL hosting.

## Troubleshooting

### Common Issues

**Issue**: "Failed to analyze clothing"
- **Solution**: Ensure Gemini API key is valid and has quota remaining
- Check image format (JPEG/PNG) and size (<10MB)

**Issue**: "Failed to fetch weather data"
- **Solution**: Verify OpenWeatherMap API key is active
- Ensure zip code is valid US zip code

**Issue**: Database connection errors
- **Solution**: Check DATABASE_URL format
- Ensure PostgreSQL is running
- Verify database exists

**Issue**: S3 upload failures
- **Solution**: Verify AWS credentials
- Check bucket permissions
- Ensure bucket exists in specified region

## Architecture

### Data Flow

1. **User uploads photos** → Frontend sends to backend API
2. **Backend stores in S3** → Gets image URLs
3. **Gemini analyzes images** → Extracts clothing data
4. **Items saved to PostgreSQL** → Available in user's closet
5. **Daily scheduler runs** → Fetches weather data
6. **Gemini generates outfit** → Based on items + weather
7. **Push notification sent** → User receives outfit

### Security

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens for authentication
- Rate limiting on API endpoints
- Input validation and sanitization
- HTTPS required in production
- S3 objects are private with signed URLs

## Cost Estimate

For 100 active users/month:

- **Gemini API**: ~$5-10
- **Weather API**: Free
- **S3 Storage**: ~$2-5
- **Database**: ~$5-15
- **Push Notifications**: Free
- **Total**: ~$12-30/month

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License

## Support

For issues or questions:
- Create an issue on GitHub
- Check existing documentation
- Review API error messages

## Roadmap

- [ ] Laundry tracking
- [ ] Calendar event integration
- [ ] Social outfit sharing
- [ ] Shopping recommendations
- [ ] Style analytics
- [ ] Multiple weather locations
- [ ] Outfit planning for trips

---

Built with ❤️ using Google Gemini 2.0 Flash
