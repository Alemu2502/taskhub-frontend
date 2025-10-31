'use client';
import { useState, useEffect } from "react";
import { getMyNotifications } from "../lib/api";
import { FiBell } from "react-icons/fi";
import jwt_decode from "jwt-decode";

function getUserIdFromCookie() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/token=([^;]+)/);
  if (!match) return null;
  try {
    const decoded = jwt_decode(match[1]);
    return decoded.userId || decoded.id || decoded._id;
  } catch {
    return null;
  }
}

export default function NotificationBell() {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let intervalId;
    const userId = getUserIdFromCookie();
    async function fetchAndCount() {
      if (userId) {
        const notifications = await getMyNotifications(userId);
        setUnread(
          notifications.filter((n) => !n.readBy?.includes(userId)).length
        );
      }
    }
    fetchAndCount();
    intervalId = setInterval(fetchAndCount, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <span className="relative flex items-center gap-3">
      <FiBell size={20} />
      <span>Notification</span>
      {unread > 0 && (
        <span className="absolute left-24 -top-2 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center px-1.5 animate-pulse">
          {unread}
        </span>
      )}
    </span>
  );
}
