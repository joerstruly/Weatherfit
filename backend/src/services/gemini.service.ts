import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiClothingAnalysis, ClothingItem, OutfitRecommendation, WeatherConditions } from '../types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  async analyzeClothing(imageBase64: string): Promise<GeminiClothingAnalysis[]> {
    try {
      const prompt = `Analyze this image and identify all visible clothing items. For each item, provide:

1. Item Type: (shirt, t-shirt, blouse, pants, jeans, shorts, skirt, dress, jacket, coat, sweater, hoodie, shoes, sneakers, boots, accessories)
2. Primary Color: (specific color name)
3. Secondary Color: (if applicable, otherwise null)
4. Pattern: (solid, striped, plaid, floral, geometric, polka dot, etc.)
5. Style: (casual, formal, business casual, sporty, bohemian, preppy, etc.)
6. Formality Level: (1-5, where 1 is very casual like gym wear and 5 is very formal like suits/gowns)
7. Weather Suitability:
   - Warm weather (above 75°F): true/false
   - Cool weather (50-75°F): true/false
   - Cold weather (below 50°F): true/false
   - Rainy weather (water-resistant): true/false
8. Brief Description: (2-3 sentence description)

Return results in JSON format as an array of clothing items. Each item should follow this structure:
{
  "item_type": "string",
  "color_primary": "string",
  "color_secondary": "string or null",
  "pattern": "string",
  "style": "string",
  "formality_level": number,
  "weather_suitability": {
    "warm": boolean,
    "cool": boolean,
    "cold": boolean,
    "rainy": boolean
  },
  "description": "string"
}

Only return the JSON array, no additional text.`;

      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64,
          },
        },
      ]);

      const response = result.response.text();

      // Extract JSON from response (remove markdown code blocks if present)
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const items: GeminiClothingAnalysis[] = JSON.parse(jsonMatch[0]);
      return items;
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to analyze clothing image');
    }
  }

  async generateOutfitRecommendation(
    clothingItems: ClothingItem[],
    weather: WeatherConditions,
    recentOutfits: string[][] = [],
    userStyle: string = 'balanced'
  ): Promise<OutfitRecommendation> {
    try {
      const prompt = `Given the following information, create a coordinated outfit recommendation:

WEATHER CONDITIONS:
- Temperature: ${weather.temperature}°F (feels like ${weather.feels_like}°F)
- Conditions: ${weather.description}
- Humidity: ${weather.humidity}%
${weather.precipitation_probability ? `- Precipitation chance: ${weather.precipitation_probability}%` : ''}

AVAILABLE CLOTHING ITEMS:
${JSON.stringify(clothingItems, null, 2)}

RECENT OUTFITS (to avoid repetition):
${JSON.stringify(recentOutfits, null, 2)}

USER STYLE PREFERENCE: ${userStyle}

Create an outfit recommendation that:
1. Is appropriate for the weather conditions
2. Has coordinating colors and styles
3. Includes at minimum: one top, one bottom, and shoes (add jacket/accessories if weather appropriate)
4. Hasn't been worn in the recent outfits list
5. Matches the user's style preference

Return in JSON format:
{
  "outfit": ["item_id_1", "item_id_2", "item_id_3", ...],
  "reasoning": "Brief explanation (2-3 sentences) of why this outfit works for today's weather and style"
}

Only return the JSON object, no additional text.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const recommendation = JSON.parse(jsonMatch[0]);

      return {
        outfit: recommendation.outfit,
        reasoning: recommendation.reasoning,
        weather: weather,
      };
    } catch (error) {
      console.error('Gemini outfit generation error:', error);
      throw new Error('Failed to generate outfit recommendation');
    }
  }
}

export default new GeminiService();
