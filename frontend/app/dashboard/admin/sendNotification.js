'use client';

import { useEffect, useState } from 'react';
import SendNotification from '../../admin/sendNotification'; // Your component
import { getAllUsers } from '../../lib/api'; // You must implement an API or use your own

export default function AdminNotificationPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers().then((users) => {
      setUsers(users || []);
      setLoading(false);
    });
  }, []);

  // Ideally, add a check here to redirect if not admin

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Send Notification to Users</h1>
      {loading ? (
        <div>Loading users...</div>
      ) : (
        <SendNotification users={users} />
      )}
    </div>
  );
}
