'use client';
import { useEffect, useState } from 'react';

export default function NotificationSidebar({ userId }) {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`/api/notifications?user=${userId}`)
      .then(res => res.json())
      .then(data => setNotifications(data.notifications || []))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, [userId]);

  if (!visible) return null;

  return (
    <aside className="fixed top-20 left-0 z-40 w-72 max-h-[80vh] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-xl rounded-tr-lg rounded-br-lg p-4 flex flex-col gap-4 transition-all">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-lg text-blue-700">Notifications</span>
        <button onClick={() => setVisible(false)} className="text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition text-xl">
          &times;
        </button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3">
        {loading
          ? (<span className="text-gray-400 text-sm">Loading...</span>)
          : notifications.length === 0
          ? (<span className="text-gray-400 text-sm">No notifications.</span>)
          : notifications.map(n => (
              <a
                key={n.id}
                href={n.link}
                className="block rounded-lg px-3 py-2 bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-50 hover:bg-blue-100 dark:hover:bg-blue-900 transition"
              >
                <span className="font-medium">{n.message}</span>
                <div className="text-xs text-gray-500 mt-1">{new Date(n.date).toLocaleString()}</div>
              </a>
          ))}
      </div>
    </aside>
  );
}
