'use client';

import { useEffect, useState } from "react";
import { adminAPI } from "../../../lib/api";
import toast from "react-hot-toast";
import Link from "next/link";

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 25, 50, 75, 100];

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => { fetchWithdrawals(); }, []);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getAllWithdrawals();
      setWithdrawals(res.data.data || []);
    } catch {
      toast.error("Failed to load withdrawals");
    }
    setLoading(false);
  };

  const handleUpdate = async (id, status) => {
    try {
      await adminAPI.updateWithdrawal(id, { status });
      toast.success(`Marked as ${status}`);
      fetchWithdrawals();
    } catch {
      toast.error("Action failed");
    }
  };

  function getStatusChip(status) {
    switch (status) {
      case "completed":
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold text-sm dark:bg-green-900 dark:text-green-200 capitalize">Completed</span>;
      case "rejected":
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold text-sm dark:bg-red-900 dark:text-red-200 capitalize">Rejected</span>;
      case "processing":
        return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold text-sm dark:bg-blue-900 dark:text-blue-200 capitalize">Processing</span>;
      case "pending":
      default:
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-semibold text-sm dark:bg-yellow-900 dark:text-yellow-200 capitalize">Pending</span>;
    }
  }

  function UsdAmount({ amount }) {
    return (
      <span className="text-green-600 dark:text-green-300 font-semibold">
        ${parseFloat(amount).toFixed(2)}
      </span>
    );
  }

  const pagedWithdrawals = withdrawals.slice(0, pageSize);

  return (
    <div className="max-w-6xl mx-auto pt-3 pb-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Withdrawal Requests</h1>
      <div className="rounded-lg overflow-x-auto shadow border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
            <tr>
              <th className="py-3 px-4 text-left border-r border-gray-200 dark:border-gray-800">FullName</th>
              <th className="py-3 px-4 text-left border-r border-gray-200 dark:border-gray-800">Amount</th>
              <th className="py-3 px-4 text-left border-r border-gray-200 dark:border-gray-800">Account / Details</th>
              <th className="py-3 px-4 text-left border-r border-gray-200 dark:border-gray-800">Status</th>
              <th className="py-3 px-4 text-left border-r border-gray-200 dark:border-gray-800">Requested At</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagedWithdrawals.map(w => (
              <tr key={w._id} className="border-t border-gray-200 dark:border-gray-800">
                <td className="py-2 px-4 border-r border-gray-200 dark:border-gray-800">{w.user?.fullName || "N/A"}</td>
                <td className="py-2 px-4 border-r border-gray-200 dark:border-gray-800">
                  <UsdAmount amount={w.amount} />
                </td>
                <td className="py-2 px-4 border-r border-gray-200 dark:border-gray-800">{w.accountDetails || '—'}</td>
                <td className="py-2 px-4 border-r border-gray-200 dark:border-gray-800">{getStatusChip(w.status)}</td>
                <td className="py-2 px-4 border-r border-gray-200 dark:border-gray-800">{w.requestedAt ? new Date(w.requestedAt).toLocaleString() : "-"}</td>
                <td className="py-2 px-4">
                  {["pending", "processing"].includes(w.status) ? (
                    <select
                      className="border rounded px-2 py-1 bg-white dark:bg-gray-800"
                      value=""
                      onChange={e => {
                        if (!e.target.value) return;
                        handleUpdate(w._id, e.target.value);
                      }}
                    >
                      <option value="" disabled>Change...</option>
                      {w.status !== "processing" && <option value="processing">Mark Processing</option>}
                      <option value="completed">Mark Completed</option>
                      <option value="rejected">Mark Rejected</option>
                    </select>
                  ) : (
                    <span className="text-gray-500 font-semibold">Reviewed</span>
                  )}
                </td>
              </tr>
            ))}
            {!pagedWithdrawals.length && (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-10">No withdrawals found.</td>
              </tr>
            )}
          </tbody>
        </table>
        {withdrawals.length > 5 && (
          <div className="flex justify-end items-center py-3 px-6 gap-2">
            <label htmlFor="page-size-select" className="text-sm text-gray-700 dark:text-gray-200">Rows to show:</label>
            <select
              id="page-size-select"
              value={pageSize}
              onChange={e => setPageSize(Number(e.target.value))}
              className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            >
              {PAGE_SIZE_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
