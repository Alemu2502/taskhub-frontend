// NotificationBell.js
import { useState, useEffect } from "react";
import { getMyNotifications, markNotificationRead } from "../lib/api";
import { useRouter } from 'next/router';

export default function NotificationBell({ userId }) {
  const [unread, setUnread] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      getMyNotifications(userId).then(notifications => {
        setUnread(notifications.filter(n => !n.readBy.includes(userId)).length);
      });
    }
  }, [userId]);

  return (
    <button
      onClick={() => router.push("/notifications")} 
      style={{ position: 'relative', background: "none", border: "none" }}
      aria-label="View notifications"
    >
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
  );
}
