import { useState } from "react";
import { sendNotification } from "../../../../lib/api";

// Toast UI - inline version, no config needed
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
  const [selectedUsers, setSelectedUsers] = useState(["all"]); // default is All Users
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });

  const userOptions = [{ _id: "all", email: "All Users" }, ...users];

  const handleSend = async () => {
    setSending(true);
    try {
      const userIds = selectedUsers.includes("all") ? ["all"] : selectedUsers;
      await sendNotification({ userIds, message, link: "" });
      setToast({ message: "Notification sent successfully!", type: "success" });
      setMessage("");
      setSelectedUsers(["all"]);
    } catch {
      setToast({ message: "Failed to send notification.", type: "error" });
    }
    setSending(false);
    setTimeout(() => setToast({ message: "" }), 2500);
  };

  return (
    <>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "" })} />
      <div className="border max-w-2xl mx-auto text-gray-800 text-bold  bg-white p-8 rounded-2xl shadow mt-10 mb-10">
        <label className="block mb-2 font-bold">Notification Message</label>
        <textarea
          className="w-full border mb-2 p-2"
          rows={3}
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <label className="block mb-2 font-bold">Send To</label>
        <select
          multiple
          className="w-full border mb-2 p-2"
          value={selectedUsers}
          onChange={e => {
            const values = Array.from(e.target.selectedOptions, o => o.value);
            // If All Users selected, ignore others
            if (values.includes("all")) setSelectedUsers(["all"]);
            else setSelectedUsers(values);
          }}
          size={Math.min(userOptions.length, 10)}
        >
          {userOptions.map(u => (
            <option key={u._id} value={u._id}>
              {u.email}
            </option>
          ))}
        </select>
        <div className="text-xs mb-2">
          By default "All Users" is selected.<br />
          To send to some, deselect "All Users" and pick others.
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
