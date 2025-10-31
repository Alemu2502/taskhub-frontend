import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getMyNotifications } from "../lib/api";
import { FiBell } from "react-icons/fi";
import jwt_decode from "jwt-decode";

// Utility to get userId from JWT cookie
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
  const router = useRouter();
  const pathname = usePathname();
  const [unread, setUnread] = useState(0);

  // LIVE AUTO-REFRESH
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
    intervalId = setInterval(fetchAndCount, 10000); // 10s auto-refresh
    return () => clearInterval(intervalId);
  }, []);

  const isActive = pathname && pathname.startsWith("/dashboard/notifications");

  return (
    <button
      onClick={() => router.push("/dashboard/notifications")}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full font-medium relative
        ${
          isActive
            ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        }
      `}
      style={{ outline: "none", border: "none", background: "none" }}
    >
      <FiBell size={20} />
      <span className="relative">
        Notification
        {unread > 0 && (
          <span
            className={`
              absolute -top-3 left-20 min-w-[20px] h-[20px]
              rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center px-1.5 animate-pulse
            `}
          >
            {unread}
          </span>
        )}
      </span>
    </button>
  );
}
