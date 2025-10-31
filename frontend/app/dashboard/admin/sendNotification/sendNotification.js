import { useState } from "react";
import { sendNotification } from "../../../../lib/api";

export default function SendNotification({ users }) {
  const [message, setMessage] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    setSending(true);
    await sendNotification({
      userIds: selectedUsers.length === 0 || selectedUsers.length === users.length
        ? ["all"]
        : selectedUsers,
      message,
      link: ""
    });
    setSending(false);
    setMessage("");
    setSelectedUsers([]);
    alert("Notification sent!");
  };

  // Dropdown with multi-select; Select All works if you select all options.
  return (
    <div className="p-6 bg-white dark:bg-gray-800 border rounded">
      <label className="block mb-2 font-bold">Notification Message</label>
      <textarea className="w-full border mb-2 p-2" rows={3} value={message} onChange={e => setMessage(e.target.value)} />

      <label className="block mb-2 font-bold">Send To</label>
      <select
        multiple
        className="w-full border mb-2 p-2"
        value={selectedUsers}
        onChange={e => {
          const values = Array.from(e.target.selectedOptions, o => o.value);
          setSelectedUsers(values);
        }}
        size={Math.min(users.length, 10)}
      >
        {users.map(u => (
          <option key={u._id} value={u._id}>{u.email}</option>
        ))}
      </select>
      <div className="text-xs mb-2">Select no user or all users to notify everyone</div>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={sending || !message}
        onClick={handleSend}
      >
        {sending ? "Sending..." : "Send Notification"}
      </button>
    </div>
  );
}
