import axios, { AxiosInstance } from 'axios';
import { AuthResponse, User, ClothingItem, Outfit, WeatherConditions, UploadSession } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class APIService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle auth errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth
  async signup(email: string, password: string, name?: string, zip_code?: string): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/signup', {
      email,
      password,
      name,
      zip_code,
    });
    return response.data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.post('/auth/logout');
    localStorage.removeItem('token');
  }

  // User
  async getProfile(): Promise<User> {
    const response = await this.api.get<{ user: User }>('/user/profile');
    return response.data.user;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await this.api.put<{ user: User }>('/user/profile', data);
    return response.data.user;
  }

  async updateNotificationSettings(settings: {
    notification_time?: string;
    notification_enabled?: boolean;
    fcm_token?: string;
  }): Promise<any> {
    const response = await this.api.put('/user/notification-time', settings);
    return response.data.settings;
  }

  // Closet
  async getClothingItems(): Promise<ClothingItem[]> {
    const response = await this.api.get<{ items: ClothingItem[] }>('/closet/items');
    return response.data.items;
  }

  async uploadPhotos(files: File[]): Promise<{ session_id: string; files_count: number }> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('photos', file);
    });

    const response = await this.api.post('/closet/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getUploadSession(sessionId: string): Promise<UploadSession> {
    const response = await this.api.get<{ session: UploadSession }>(`/closet/upload/${sessionId}`);
    return response.data.session;
  }

  async updateClothingItem(itemId: string, updates: Partial<ClothingItem>): Promise<ClothingItem> {
    const response = await this.api.put<{ item: ClothingItem }>(`/closet/items/${itemId}`, updates);
    return response.data.item;
  }

  async deleteClothingItem(itemId: string): Promise<void> {
    await this.api.delete(`/closet/items/${itemId}`);
  }

  // Outfit
  async getDailyOutfit(): Promise<Outfit> {
    const response = await this.api.get<{ outfit: Outfit }>('/outfit/daily');
    return response.data.outfit;
  }

  async regenerateOutfit(): Promise<Outfit> {
    const response = await this.api.post<{ outfit: Outfit }>('/outfit/regenerate');
    return response.data.outfit;
  }

  async submitOutfitFeedback(
    outfitId: string,
    feedback?: string,
    wasWorn?: boolean
  ): Promise<void> {
    await this.api.post('/outfit/feedback', {
      outfit_id: outfitId,
      feedback,
      was_worn: wasWorn,
    });
  }

  async getOutfitHistory(limit = 30, offset = 0): Promise<Outfit[]> {
    const response = await this.api.get<{ outfits: Outfit[] }>('/outfit/history', {
      params: { limit, offset },
    });
    return response.data.outfits;
  }

  // Weather
  async getCurrentWeather(): Promise<WeatherConditions> {
    const response = await this.api.get<{ weather: WeatherConditions }>('/weather/current');
    return response.data.weather;
  }

  async getWeatherForecast(days = 5): Promise<WeatherConditions[]> {
    const response = await this.api.get<{ forecast: WeatherConditions[] }>('/weather/forecast', {
      params: { days },
    });
    return response.data.forecast;
  }
}

export default new APIService();
