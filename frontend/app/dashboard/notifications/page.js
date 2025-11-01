"use client";
import { useEffect, useState } from "react";
import { getMyNotifications, markNotificationRead } from "../../../lib/api";
import Link from "next/link";

// Util: get time in ms for 7d
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export default function NotificationsPage() {
  const [userId, setUserId] = useState(null);
  const [userObj, setUserObj] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hovered, setHovered] = useState(null);

  // User fetch and debug
  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserObj(user);
        const finalId = user._id || user.id;
        setUserId(finalId || null);
        if (!finalId) setError("User found, but id key missing.");
      } else {
        setError("Not logged in — no user in localStorage.");
      }
    } catch (e) {
      setError("Could not parse user from localStorage.");
    }
    setLoading(false);
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
      .catch((err) => {
        setError("Could not fetch notifications.");
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
      alert("Failed to mark as read!");
    }
  };

  // --- FILTERING HERE ---
  const now = Date.now();
  const visibleNotifications = notifications.filter((n) => {
    const isRead = n.readBy?.includes(userId);
    // Unread: always show
    if (!isRead) return true;
    // Read: Only show if read less than 7d ago
    // If you have n.readAt, use it; else fallback to updatedAt/createdAt
    const readAt = n.readAt?.[userId] || n.updatedAt || n.createdAt;
    return now - new Date(readAt).getTime() < SEVEN_DAYS;
  });
  // --- END FILTERING ---

  return (
    <div>
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
      <div className="space-y-6">
        {loading ? (
          <div className="py-10 text-center text-lg font-medium text-gray-700 dark:text-gray-200">
            Loading notifications...
          </div>
        ) : error ? (
          <div className="bg-white border border-red-400 rounded-xl py-8 px-6 text-red-600 dark:text-red-400 text-center shadow">
            <b>{error}</b>
            <div className="mt-3 text-xs text-gray-600 dark:text-gray-400 break-all">
              user: {typeof window !== "undefined" && localStorage.getItem("user")}
            </div>
          </div>
        ) : visibleNotifications.length === 0 ? (
          <div className="text-gray-600 dark:text-gray-300 text-center py-8">
            No notifications (only unread or read in last 7 days are shown).
          </div>
        ) : (
          <ul>
            {visibleNotifications.map((n) => {
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
  );
}
