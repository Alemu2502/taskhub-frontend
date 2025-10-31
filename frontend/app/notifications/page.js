"use client";
import { useEffect, useState } from "react";
import { getMyNotifications, markNotificationRead } from "../../lib/api";
import Link from "next/link";

export default function NotificationsPage() {
  const [userId, setUserId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      if (!user || !user._id) {
        setError("Not logged in.");
        setLoading(false);
        return;
      }
      setUserId(user._id);
    } catch (err) {
      setError("Not logged in.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError("");
    getMyNotifications(userId)
      .then((data) => {
        setNotifications(data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not fetch notifications.");
        setLoading(false);
      });
  }, [userId]);

  const handleMarkRead = async (id) => {
    await markNotificationRead(id, userId);
    setNotifications((prev) =>
      prev.map((n) =>
        n._id === id ? { ...n, readBy: [...(n.readBy || []), userId] } : n
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-bold text-primary-600 dark:text-primary-400">
            TaskHub
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Your Notifications
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Stay updated with the latest alerts
          </p>
        </div>
        <div className="card p-0">
          <div className="space-y-6">
            {loading ? (
              <div className="py-10 text-center text-lg font-medium text-gray-700 dark:text-gray-200">
                Loading notifications...
              </div>
            ) : error ? (
              <div className="text-red-600 dark:text-red-400 text-center py-8">{error}</div>
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
                        ${isRead
                        ? isHovered
                          ? "bg-blue-100 dark:bg-blue-900/70"
                          : "bg-gray-100 dark:bg-gray-700"
                        : isHovered
                          ? "bg-blue-200 dark:bg-blue-900/80"
                          : "bg-blue-50 dark:bg-primary-900/30"}
                      `}
                      onMouseEnter={() => setHovered(n._id)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => { if (!isRead) handleMarkRead(n._id); }}
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
  );
}
