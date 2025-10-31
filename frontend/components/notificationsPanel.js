'use client';

import { useEffect, useState } from 'react';
import { getMyNotifications, markNotificationRead } from '../lib/api';

export default function NotificationsPanel({ onClose }) {
  const [userId, setUserId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const finalId = user._id || user.id;
        setUserId(finalId);
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError('');
    getMyNotifications(userId)
      .then((data) => {
        setNotifications(data || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not fetch notifications.');
        setLoading(false);
      });
  }, [userId]);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id, userId);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, readBy: [...(n.readBy || []), userId] } : n
        )
      );
    } catch (e) {
      alert('Failed to mark as read!');
    }
  };

  return (
    <section
      className="w-full max-w-xl mx-auto sm:mx-0 bg-white dark:bg-gray-800 rounded-xl shadow p-6"
      style={{ minWidth: 300 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-primary-600 dark:text-primary-400">
          Notifications
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="bg-gray-200 dark:bg-gray-700 rounded px-3 py-1 text-xs font-semibold"
          >
            Close
          </button>
        )}
      </div>
      <div className="space-y-4">
        {loading ? (
          <div>Loading notifications...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="text-gray-500">No notifications yet.</div>
        ) : (
          <ul>
            {notifications.map((n) => {
              const isRead = n.readBy?.includes(userId);
              const isHovered = hovered === n._id;
              return (
                <li
                  key={n._id}
                  className={`flex items-center justify-between group mb-3 rounded-lg cursor-pointer transition-colors px-6 py-5 font-medium text-gray-800 dark:text-gray-100
                    ${isRead
                      ? isHovered
                        ? 'bg-blue-100 dark:bg-blue-900/70'
                        : 'bg-gray-100 dark:bg-gray-700'
                      : isHovered
                      ? 'bg-blue-200 dark:bg-blue-900/80'
                      : 'bg-blue-50 dark:bg-primary-900/30'}
                  `}
                  onMouseEnter={() => setHovered(n._id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => {
                    if (!isRead) handleMarkRead(n._id);
                  }}
                >
                  <span>{n.message}</span>
                  {!isRead && (
                    <span className="ml-3 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full group-hover:bg-blue-600">
                      New
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
