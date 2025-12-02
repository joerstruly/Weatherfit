export interface User {
  id: string;
  email: string;
  name?: string;
  location?: string;
  zip_code?: string;
  notification_time?: string;
  timezone?: string;
  notification_enabled?: boolean;
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
  created_at: string;
}

export interface WeatherSuitability {
  warm: boolean;
  cool: boolean;
  cold: boolean;
  rainy: boolean;
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

export interface Outfit {
  id: string;
  date: string;
  items: ClothingItem[];
  weather: WeatherConditions;
  reasoning: string;
  was_worn?: boolean;
  feedback?: 'loved' | 'liked' | 'neutral' | 'disliked';
}

export interface UploadSession {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  photo_urls: string[];
  items_extracted: number;
  error_message?: string;
  created_at: string;
  completed_at?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}
