import { useState, useEffect } from "react";
import { getMyNotifications, markNotificationRead } from "../lib/api";

export default function NotificationBell({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => { if (userId) fetchNotifications(); }, [userId]);
  const fetchNotifications = async () => {
    const res = await getMyNotifications(userId);
    setNotifications(res);
  };

  const unreadCount = notifications.filter(
    n => !n.readBy?.includes(userId)
  ).length;

  const handleRead = async id => {
    await markNotificationRead(id, userId);
    fetchNotifications();
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(v => !v)}>
        <svg width={28} height={28}><circle cx="14" cy="14" r="12" fill="#4285F4" /></svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 text-xs bg-red-600 text-white rounded-full flex items-center justify-center">{unreadCount}</span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg max-h-96 overflow-auto z-40">
          <div className="p-2 font-bold border-b">Notifications</div>
          {notifications.length === 0 ? (
            <div className="p-4 text-gray-500">No notifications</div>
          ) : (
            notifications.map(n => (
              <div key={n._id}
                className={`p-3 border-b ${!n.readBy?.includes(userId) ? "bg-blue-50" : ""} cursor-pointer`}
                onClick={() => handleRead(n._id)}
              >
                {n.message}
                {n.link && (
                  <a className="ml-2 text-blue-600 underline" href={n.link}>View</a>
                )}
                {!n.readBy?.includes(userId) && <span className="ml-1 text-xs text-blue-600">(unread)</span>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
