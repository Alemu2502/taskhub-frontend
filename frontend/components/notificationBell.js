import { useState, useEffect } from "react";
import { getMyNotifications, markNotificationRead } from "../lib/api";

export default function NotificationBell({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (userId) {
      getMyNotifications(userId).then(setNotifications);
    }
  }, [userId]);

  // Unread count
  const unread = notifications.filter(n => !n.readBy.includes(userId)).length;

  const handleNotificationClick = async (notifId) => {
    await markNotificationRead(notifId, userId);
    // Mark local as read
    setNotifications(prev =>
      prev.map(n =>
        n._id === notifId
          ? { ...n, readBy: [...n.readBy, userId] }
          : n
      )
    );
    setShowDropdown(true);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={() => setShowDropdown(d => !d)} style={{ position: 'relative' }}>
        🔔
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: 0, right: 0,
            background: 'red', color: 'white',
            borderRadius: '50%', padding: '0 7px', fontSize: '14px'
          }}>
            {unread}
          </span>
        )}
      </button>
      {showDropdown && (
        <div className="notification-dropdown" style={{
          position: 'absolute', right: 0, top: '100%',
          background: 'white', border: '1px solid #ccc',
          width: '300px', zIndex: 99
        }}>
          {notifications.length === 0 ? (
            <div className="p-4 text-gray-500">No notifications</div>
          ) : (
            notifications.map(n => (
              <div
                key={n._id}
                style={{
                  padding: 10,
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                  background: n.readBy.includes(userId) ? "#f9f9f9" : "#e6f7ff",
                  fontWeight: n.readBy.includes(userId) ? "normal" : "bold"
                }}
                onClick={() => handleNotificationClick(n._id)}
              >
                {n.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
