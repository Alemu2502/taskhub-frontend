import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const userId = getUserIdFromCookie();
    if (userId) {
      getMyNotifications(userId).then((notifications) => {
        setUnread(
          notifications.filter((n) => !n.readBy?.includes(userId)).length
        );
      });
    }
  }, []);

  return (
    <button
      onClick={() => router.push("/notifications")}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
        text-gray-700 dark:text-gray-300
        hover:bg-gray-100 dark:hover:bg-gray-700
        font-medium w-full relative
      `}
    >
      <span className="relative">
        <FiBell size={20} />
        {unread > 0 && (
          <span
            className={`
              absolute -top-2 -right-2 min-w-[20px] h-[20px] rounded-full 
              bg-red-500 text-white text-xs font-bold flex items-center justify-center
              px-1.5`
            }
          >
            {unread}
          </span>
        )}
      </span>
      <span>Notification</span>
    </button>
  );
}
