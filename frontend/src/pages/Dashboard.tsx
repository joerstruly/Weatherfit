import React, { useState, useEffect } from 'react';
import { ArrowPathIcon, HeartIcon, HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import api from '../services/api';
import { Outfit } from '../types';

const Dashboard: React.FC = () => {
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOutfit();
  }, []);

  const loadOutfit = async () => {
    try {
      setLoading(true);
      const data = await api.getDailyOutfit();
      setOutfit(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load outfit');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    try {
      setRegenerating(true);
      const data = await api.regenerateOutfit();
      setOutfit(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate new outfit');
    } finally {
      setRegenerating(false);
    }
  };

  const handleFeedback = async (feedback: string) => {
    if (!outfit) return;
    try {
      await api.submitOutfitFeedback(outfit.id, feedback);
      setOutfit({ ...outfit, feedback: feedback as any });
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!outfit) {
    return null;
  }

  const getWeatherIcon = (main: string) => {
    const icons: { [key: string]: string } = {
      Clear: '☀️',
      Clouds: '☁️',
      Rain: '🌧️',
      Snow: '❄️',
      Thunderstorm: '⛈️',
      Drizzle: '🌦️',
      Mist: '🌫️',
    };
    return icons[main] || '🌤️';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Today's Outfit</h1>
        <div className="flex items-center gap-2 text-gray-600">
          <span className="text-2xl">{getWeatherIcon(outfit.weather.main)}</span>
          <span className="text-lg">
            {outfit.weather.temperature}°F - {outfit.weather.description}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {outfit.items.map((item) => (
            <div key={item.id} className="text-center">
              <img
                src={item.image_url}
                alt={item.item_type}
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
              <p className="text-sm font-medium text-gray-900 capitalize">{item.item_type}</p>
              <p className="text-xs text-gray-500">{item.color_primary}</p>
            </div>
          ))}
        </div>

        <div className="bg-primary-50 rounded-lg p-4 mb-6">
          <p className="text-sm font-medium text-primary-900 mb-1">Why this outfit?</p>
          <p className="text-sm text-primary-700">{outfit.reasoning}</p>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            <ArrowPathIcon className={`w-5 h-5 ${regenerating ? 'animate-spin' : ''}`} />
            {regenerating ? 'Generating...' : 'Try Another'}
          </button>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">How do you feel about this outfit?</p>
          <div className="flex gap-2">
            <button
              onClick={() => handleFeedback('loved')}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg border ${
                outfit.feedback === 'loved'
                  ? 'bg-red-100 border-red-300 text-red-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {outfit.feedback === 'loved' ? (
                <HeartSolidIcon className="w-5 h-5" />
              ) : (
                <HeartIcon className="w-5 h-5" />
              )}
              <span className="text-sm">Love it</span>
            </button>
            <button
              onClick={() => handleFeedback('liked')}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg border ${
                outfit.feedback === 'liked'
                  ? 'bg-green-100 border-green-300 text-green-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <HandThumbUpIcon className="w-5 h-5" />
              <span className="text-sm">Like it</span>
            </button>
            <button
              onClick={() => handleFeedback('disliked')}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg border ${
                outfit.feedback === 'disliked'
                  ? 'bg-gray-100 border-gray-300 text-gray-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <HandThumbDownIcon className="w-5 h-5" />
              <span className="text-sm">Not for me</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
