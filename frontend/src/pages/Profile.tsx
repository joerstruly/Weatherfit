import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { requestNotificationPermission } from '../services/firebase';
import api from '../services/api';

const Profile: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [zipCode, setZipCode] = useState(user?.zip_code || '');
  const [notificationTime, setNotificationTime] = useState(user?.notification_time || '07:00');
  const [notificationEnabled, setNotificationEnabled] = useState(user?.notification_enabled ?? true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setZipCode(user.zip_code || '');
      setNotificationTime(user.notification_time || '07:00');
      setNotificationEnabled(user.notification_enabled ?? true);
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await updateUser({ name, zip_code: zipCode });
      setMessage('Profile updated successfully!');
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationSettings = async () => {
    setSaving(true);
    setMessage('');

    try {
      let fcmToken = null;
      if (notificationEnabled) {
        fcmToken = await requestNotificationPermission();
        if (!fcmToken) {
          setMessage('Failed to enable notifications. Please check browser permissions.');
          setSaving(false);
          return;
        }
      }

      await api.updateNotificationSettings({
        notification_time: notificationTime,
        notification_enabled: notificationEnabled,
        fcm_token: fcmToken || undefined,
      });

      setMessage('Notification settings updated!');
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Failed to update notification settings');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('success') || message.includes('updated')
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Personal Information</h2>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              maxLength={5}
              pattern="[0-9]{5}"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="12345"
            />
            <p className="mt-1 text-sm text-gray-500">Required for weather-based recommendations</p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Notification Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="notificationEnabled"
              checked={notificationEnabled}
              onChange={(e) => setNotificationEnabled(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="notificationEnabled" className="ml-2 block text-sm text-gray-900">
              Enable daily outfit notifications
            </label>
          </div>

          {notificationEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notification Time
              </label>
              <input
                type="time"
                value={notificationTime}
                onChange={(e) => setNotificationTime(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          )}

          <button
            onClick={handleNotificationSettings}
            disabled={saving}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Update Notifications'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Account Actions</h2>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
