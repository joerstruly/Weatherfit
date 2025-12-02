import axios from 'axios';
import { WeatherConditions } from '../types';

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

interface WeatherCache {
  [key: string]: {
    data: WeatherConditions;
    timestamp: number;
  };
}

export class WeatherService {
  private cache: WeatherCache = {};
  private CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

  async getWeatherByZipCode(zipCode: string): Promise<WeatherConditions> {
    // Check cache first
    const cacheKey = `zip_${zipCode}`;
    const cached = this.cache[cacheKey];

    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log('Returning cached weather data');
      return cached.data;
    }

    try {
      const response = await axios.get(`${WEATHER_BASE_URL}/weather`, {
        params: {
          zip: `${zipCode},US`,
          appid: WEATHER_API_KEY,
          units: 'imperial', // Fahrenheit
        },
      });

      const weatherData: WeatherConditions = {
        temperature: Math.round(response.data.main.temp),
        feels_like: Math.round(response.data.main.feels_like),
        temp_min: Math.round(response.data.main.temp_min),
        temp_max: Math.round(response.data.main.temp_max),
        humidity: response.data.main.humidity,
        description: response.data.weather[0].description,
        main: response.data.weather[0].main,
        wind_speed: response.data.wind?.speed,
      };

      // Cache the result
      this.cache[cacheKey] = {
        data: weatherData,
        timestamp: Date.now(),
      };

      return weatherData;
    } catch (error) {
      console.error('Weather API error:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  async getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherConditions> {
    const cacheKey = `coords_${lat}_${lon}`;
    const cached = this.cache[cacheKey];

    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const response = await axios.get(`${WEATHER_BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: WEATHER_API_KEY,
          units: 'imperial',
        },
      });

      const weatherData: WeatherConditions = {
        temperature: Math.round(response.data.main.temp),
        feels_like: Math.round(response.data.main.feels_like),
        temp_min: Math.round(response.data.main.temp_min),
        temp_max: Math.round(response.data.main.temp_max),
        humidity: response.data.main.humidity,
        description: response.data.weather[0].description,
        main: response.data.weather[0].main,
        wind_speed: response.data.wind?.speed,
      };

      this.cache[cacheKey] = {
        data: weatherData,
        timestamp: Date.now(),
      };

      return weatherData;
    } catch (error) {
      console.error('Weather API error:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  async getForecast(zipCode: string, days: number = 5): Promise<WeatherConditions[]> {
    try {
      const response = await axios.get(`${WEATHER_BASE_URL}/forecast`, {
        params: {
          zip: `${zipCode},US`,
          appid: WEATHER_API_KEY,
          units: 'imperial',
          cnt: days * 8, // API returns 3-hour intervals, so 8 per day
        },
      });

      // Group by day and take the midday forecast
      const forecasts: WeatherConditions[] = [];
      for (let i = 0; i < response.data.list.length; i += 8) {
        const item = response.data.list[i + 4] || response.data.list[i]; // Try to get ~noon forecast
        forecasts.push({
          temperature: Math.round(item.main.temp),
          feels_like: Math.round(item.main.feels_like),
          temp_min: Math.round(item.main.temp_min),
          temp_max: Math.round(item.main.temp_max),
          humidity: item.main.humidity,
          description: item.weather[0].description,
          main: item.weather[0].main,
          precipitation_probability: item.pop ? Math.round(item.pop * 100) : 0,
          wind_speed: item.wind?.speed,
        });
      }

      return forecasts;
    } catch (error) {
      console.error('Weather forecast API error:', error);
      throw new Error('Failed to fetch weather forecast');
    }
  }
}

export default new WeatherService();
