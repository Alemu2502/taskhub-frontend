import { useState, useEffect } from "react";
import { getMyNotifications } from "../lib/api";
import { useRouter } from "next/navigation";

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
    <div
      onClick={() => router.push("/notifications")}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        background: "none",
        border: "none",
        cursor: "pointer",
        position: "relative"
      }}
      aria-label="View notifications"
      tabIndex={0} 
      role="button"
    >
      <span style={{ fontSize: "22px" }}>🔔</span>
      {unread > 0 && (
        <span style={{
          position: 'absolute', top: 0, right: 0,
          background: 'red', color: 'white',
          borderRadius: '50%', padding: '0 7px', fontSize: '14px'
        }}>
          {unread}
        </span>
      )}
      <span style={{ fontWeight: 500, color: "#232323", fontSize: "15px" }}>
        Notification
      </span>
    </div>
  );
}
