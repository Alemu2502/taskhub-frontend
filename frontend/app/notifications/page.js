"use client";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { getMyNotifications, markNotificationRead } from "../../lib/api";

// Utility: Pull userId from JWT in cookies
function getUserIdFromCookie() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/token=([^;]+)/);
  if (!match) return null;
  try {
    const decoded = jwt_decode(match[1]);
    return decoded.userId || decoded.id || decoded._id; // update for your JWT
  } catch {
    return null;
  }
}

export default function NotificationsPage() {
  const [userId, setUserId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    setUserId(getUserIdFromCookie());
  }, []);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      getMyNotifications(userId).then((data) => {
        setNotifications(data || []);
        setLoading(false);
      });
    }
  }, [userId]);

  const handleMarkRead = async (id) => {
    await markNotificationRead(id, userId);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id)
        ? { ...n, readBy: [...(n.readBy || []), userId] }
        : n
      )
    );
  };

  return (
    <div style={{
      padding: "32px",
      maxWidth: "540px",
      margin: "30px auto",
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 3px 12px rgba(20,40,110,.09)"
    }}>
      {loading ? (
        <div>Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {notifications.map((n) => {
            const isRead = n.readBy?.includes(userId);
            const isHovered = hovered === n._id;
            return (
              <li
                key={n._id}
                style={{
                  margin: "12px 0",
                  padding: "17px 20px",
                  borderRadius: "8px",
                  background: isRead
                    ? (isHovered ? "#e0ebf8" : "#f7f7f7")
                    : (isHovered ? "#cfe3f5" : "#e5f2fd"),
                  fontWeight: isRead ? 400 : 600,
                  transition: "background .16s, box-shadow .13s",
                  cursor: "pointer",
                  boxShadow: "0 1px 4px rgba(52,110,200,.04)"
                }}
                onMouseEnter={() => setHovered(n._id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => {
                  if (!isRead) handleMarkRead(n._id);
                }}
              >
                <span>{n.message}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
