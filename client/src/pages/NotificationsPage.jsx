import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const NotificationsPage = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        const response = await api.get('/notifications');
        setNotifications(response.data);
      } catch (error) {
        console.error('Error loading notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const getTypeIcon = (type) => {
    const icons = {
      academic: '📚',
      financial: '💰',
      system: '⚙️',
      general: '💬',
    };
    return icons[type] || '📢';
  };

  const getTypeColor = (type) => {
    const colors = {
      academic: 'bg-blue-100 text-blue-700',
      financial: 'bg-amber-100 text-amber-700',
      system: 'bg-gray-100 text-gray-700',
      general: 'bg-purple-100 text-purple-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const filteredNotifications =
    filter === 'all'
      ? notifications
      : filter === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications.filter((n) => n.type === filter);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-violet-700 rounded-xl shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Notifications 🔔</h1>
        <p className="text-violet-100">Stay updated with important announcements and messages</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            filter === 'all'
              ? 'bg-violet-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-violet-400'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            filter === 'unread'
              ? 'bg-red-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-red-400'
          }`}
        >
          Unread ({notifications.filter((n) => !n.read).length})
        </button>
        <button
          onClick={() => setFilter('academic')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            filter === 'academic'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
          }`}
        >
          Academic
        </button>
        <button
          onClick={() => setFilter('financial')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            filter === 'financial'
              ? 'bg-amber-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-amber-400'
          }`}
        >
          Financial
        </button>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500 text-lg">🔄 Loading notifications...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-xl shadow-lg border transition-all hover:shadow-xl ${
                  !notification.read ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`text-3xl p-3 rounded-lg ${getTypeColor(notification.type)}`}>
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-800">{notification.title}</h3>
                          {!notification.read && (
                            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                              NEW
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 mb-2">{notification.message}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(notification.date).toLocaleDateString()} ·{' '}
                          {new Date(notification.date).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                      getTypeColor(notification.type)
                    }`}>
                      {notification.type}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-5xl mb-4">✨</p>
              <p className="text-gray-500 text-lg">No notifications to display</p>
              <p className="text-gray-400 text-sm mt-2">You're all caught up!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
