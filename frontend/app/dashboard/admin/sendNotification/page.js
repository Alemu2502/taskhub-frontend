'use client';

import { useEffect, useState } from "react";
import SendNotification from "./sendNotification";
import { getAllUsers } from "../../../../lib/api";

export default function AdminNotificationPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers().then((data) => {
      setUsers(data || []);
      setLoading(false);
    });
  }, []);

  // Optional: admin auth check

  return (
    <div className="max-w-xl mx-auto mt-12">
      <h1 className="text-2xl font-bold mb-6">Send Notification to User(s)</h1>
      {loading ? (
        <div>Loading users...</div>
      ) : (
        <SendNotification users={users} />
      )}
    </div>
  );
}
