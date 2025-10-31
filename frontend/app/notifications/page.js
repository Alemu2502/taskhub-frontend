'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getMyNotifications, markNotificationRead } from '../../lib/api';

export default function NotificationsPage() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [userObj, setUserObj] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserObj(user);
        const finalId = user._id || user.id;
        if (finalId) {
          setUserId(finalId);
        } else {
          setError('User found, but id key missing.');
        }
      } else {
        setError('Not logged in — no user in localStorage.');
      }
    } catch (e) {
      setError('Could not parse user from localStorage.');
    }
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col lg:flex-row">
      {/* Sidebar/header will be injected by your DashboardLayout */}
      <div className="flex-1 flex justify-center items-start px-2 py-10">
        <div className="w-full max-w-lg">
          {/* Header and Back to Dashboard */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              Notifications
            </h2>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-4 py-2 rounded-lg text-sm shadow transition"
            >
              Back to Dashboard
            </button>
          </div>
          <div className="rounded-xl shadow bg-white dark:bg-gray-800 p-0">
            <div className="space-y-6 p-4">
              {loading ? (
                <div className="py-10 text-center text-lg font-medium text-gray-700 dark:text-gray-200">
                  Loading notifications...
                </div>
              ) : error ? (
                <div className="bg-white border border-red-400 rounded-xl py-8 px-6 text-red-600 dark:text-red-400 text-center shadow">
                  <b>{error}</b>
                  <div className="mt-3 text-xs text-gray-600 dark:text-gray-400 break-all">
                    user: {localStorage.getItem('user')}
                  </div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-gray-600 dark:text-gray-300 text-center py-8">
                  No notifications yet.
                </div>
              ) : (
                <ul>
                  {notifications.map((n) => {
                    const isRead = n.readBy?.includes(userId);
                    const isHovered = hovered === n._id;
                    return (
                      <li
                        key={n._id}
                        className={`
                          flex items-center justify-between group mb-3
                          rounded-lg cursor-pointer transition-colors px-6 py-5
                          font-medium text-gray-800 dark:text-gray-100
                          ${
                            isRead
                              ? isHovered
                                ? 'bg-blue-100 dark:bg-blue-900/70'
                                : 'bg-gray-100 dark:bg-gray-700'
                              : isHovered
                              ? 'bg-blue-200 dark:bg-blue-900/80'
                              : 'bg-blue-50 dark:bg-primary-900/30'
                          }
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
          </div>
        </div>
      </div>
    </div>
  );
}
