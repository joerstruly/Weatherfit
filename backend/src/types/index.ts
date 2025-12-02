export interface User {
  id: string;
  email: string;
  password_hash: string;
  name?: string;
  location?: string;
  zip_code?: string;
  notification_time: string;
  timezone: string;
  notification_enabled: boolean;
  fcm_token?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ClothingItem {
  id: string;
  user_id: string;
  image_url: string;
  item_type: string;
  color_primary?: string;
  color_secondary?: string;
  style?: string;
  pattern?: string;
  weather_suitability?: WeatherSuitability;
  formality_level?: number;
  ai_description?: string;
  is_active: boolean;
  created_at: Date;
}

export interface WeatherSuitability {
  warm: boolean;   // above 75°F
  cool: boolean;   // 50-75°F
  cold: boolean;   // below 50°F
  rainy: boolean;
}

export interface OutfitHistory {
  id: string;
  user_id: string;
  outfit_date: Date;
  clothing_items: string[];
  weather_conditions?: WeatherConditions;
  was_worn?: boolean;
  user_feedback?: 'loved' | 'liked' | 'neutral' | 'disliked';
  reasoning?: string;
  created_at: Date;
}

export interface WeatherConditions {
  temperature: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  description: string;
  main: string;
  precipitation_probability?: number;
  wind_speed?: number;
}

export interface UploadSession {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  photo_urls: string[];
  items_extracted: number;
  error_message?: string;
  created_at: Date;
  completed_at?: Date;
}

export interface GeminiClothingAnalysis {
  item_type: string;
  color_primary: string;
  color_secondary?: string;
  pattern: string;
  style: string;
  formality_level: number;
  weather_suitability: WeatherSuitability;
  description: string;
}

export interface OutfitRecommendation {
  outfit: string[]; // Array of clothing item IDs
  reasoning: string;
  weather: WeatherConditions;
}

export interface AuthRequest {
  email: string;
  password: string;
  name?: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
}
