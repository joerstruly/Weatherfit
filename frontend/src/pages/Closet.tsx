import React, { useState, useEffect, useRef } from 'react';
import { CameraIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import api from '../services/api';
import { ClothingItem, UploadSession } from '../types';

const Closet: React.FC = () => {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadSession, setUploadSession] = useState<UploadSession | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    if (uploadSession && uploadSession.status === 'processing') {
      const interval = setInterval(async () => {
        try {
          const session = await api.getUploadSession(uploadSession.id);
          setUploadSession(session);
          if (session.status === 'completed' || session.status === 'failed') {
            clearInterval(interval);
            if (session.status === 'completed') {
              loadItems();
            }
          }
        } catch (error) {
          console.error('Failed to check upload status:', error);
          clearInterval(interval);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [uploadSession]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await api.getClothingItems();
      setItems(data);
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files).slice(0, 10);

    try {
      setUploading(true);
      const response = await api.uploadPhotos(fileArray);
      const session = await api.getUploadSession(response.session_id);
      setUploadSession(session);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to upload photos');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to remove this item?')) return;

    try {
      await api.deleteClothingItem(itemId);
      setItems(items.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">My Closet</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Add Clothing Items</h2>
          <p className="text-sm text-gray-600 mb-4">
            Upload photos of your closet, drawers, or individual clothing items. Our AI will automatically
            identify and catalog them.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || uploadSession?.status === 'processing'}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            <PhotoIcon className="w-5 h-5" />
            {uploading || uploadSession?.status === 'processing' ? 'Processing...' : 'Upload Photos'}
          </button>

          {uploadSession && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-900">
                Upload Status: <span className="capitalize">{uploadSession.status}</span>
              </p>
              {uploadSession.status === 'processing' && (
                <p className="text-sm text-blue-700 mt-1">
                  Analyzing your photos... This may take a minute.
                </p>
              )}
              {uploadSession.status === 'completed' && (
                <p className="text-sm text-blue-700 mt-1">
                  Successfully extracted {uploadSession.items_extracted} items!
                </p>
              )}
              {uploadSession.status === 'failed' && (
                <p className="text-sm text-red-700 mt-1">
                  {uploadSession.error_message || 'Upload failed'}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <CameraIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No clothing items yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by uploading photos of your closet
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden group relative">
              <img
                src={item.image_url}
                alt={item.item_type}
                className="w-full h-48 object-cover"
              />
              <div className="p-3">
                <p className="font-medium text-gray-900 capitalize">{item.item_type}</p>
                <p className="text-sm text-gray-500">{item.color_primary}</p>
                {item.style && (
                  <p className="text-xs text-gray-400 capitalize">{item.style}</p>
                )}
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Closet;
