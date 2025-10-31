import { useState } from "react";
import { sendNotification } from "../../../../lib/api";

function Toast({ message, type = "success", onClose }) {
  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 24,
        right: 24,
        zIndex: 9999,
        background: type === "success" ? "#3CB371" : "#fa3d3d",
        color: "#fff",
        borderRadius: 7,
        padding: "14px 18px",
        fontWeight: "bold",
        boxShadow: "0 4px 20px rgba(0,0,0,0.13)",
        minWidth: 250,
        textAlign: "center"
      }}
      onClick={onClose}
    >
      {message}
    </div>
  );
}

export default function SendNotification({ users = [] }) {
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState("all"); // "all" is default
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });

  const userOptions = [{ _id: "all", email: "All Users" }, ...users];

  const handleSend = async () => {
    setSending(true);
    try {
      const userIds = selectedUser === "all" ? ["all"] : [selectedUser];
      await sendNotification({ userIds, message, link: "" });
      setToast({ message: "Notification sent successfully!", type: "success" });
      setMessage("");
      setSelectedUser("all");
    } catch {
      setToast({ message: "Failed to send notification.", type: "error" });
    }
    setSending(false);
    setTimeout(() => setToast({ message: "" }), 2500);
  };

  return (
    <>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "" })} />
      <div className="p-6 bg-white border rounded">
        <label className="block mb-2 font-bold">Notification Message</label>
        <textarea
          className="w-full border mb-2 p-2"
          rows={3}
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <label className="block mb-2 font-bold">Send To</label>
        <select
          className="w-full border mb-2 p-2"
          value={selectedUser}
          onChange={e => setSelectedUser(e.target.value)}
        >
          {userOptions.map(u => (
            <option key={u._id} value={u._id}>
              {u.email}
            </option>
          ))}
        </select>
        <div className="text-xs mb-2">
          Pick “All Users” to notify everyone, or a single user to target just one.
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={sending || !message}
          onClick={handleSend}
        >
          {sending ? "Sending..." : "Send Notification"}
        </button>
      </div>
    </>
  );
}
