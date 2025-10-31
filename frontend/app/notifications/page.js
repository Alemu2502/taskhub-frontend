"use client";
import { useEffect, useState } from "react";
import { getMyNotifications, markNotificationRead } from "../lib/api";

export default function NotificationsPage() {
  // CHANGE THIS LINE! Replace with your actual auth/user fetch logic
  const userId = typeof window !== "undefined" && window.localStorage.getItem("userId");

  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    if (userId) {
      getMyNotifications(userId).then((data) => setNotifications(data));
    }
  }, [userId]);

  return (
    <div style={{ padding: 20 }}>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul>
          {notifications.map((n) => (
            <li key={n.id} style={{ margin: "10px 0", padding: "10px", background: "#f7f7f7" }}>
              <span>{n.message || n.text}</span>
              {!n.readBy.includes(userId) && (
                <button
                  style={{ marginLeft: 10 }}
                  onClick={() => markNotificationRead(n.id, userId)}
                >
                  Mark as read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
