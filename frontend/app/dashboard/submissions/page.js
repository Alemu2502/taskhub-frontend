'use client';

import { useEffect, useState } from "react";
import { adminAPI } from "../../../lib/api";
import toast from "react-hot-toast";
import Link from "next/link";

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 25, 50, 75, 100];

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getAllSubmissions();
      setSubmissions(res.data.data || []);
    } catch {
      toast.error("Failed to load submissions");
    }
    setLoading(false);
  };

  const handleReview = async (id, status) => {
    try {
      await adminAPI.updateSubmission(id, { status });
      toast.success(`Marked as ${status}`);
      fetchSubmissions();
    } catch {
      toast.error("Could not update submission");
    }
  };

  function getStatusColor(status) {
    switch (status) {
      case 'approved': return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case 'rejected': return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      case 'pending': return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default: return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300";
    }
  }

  const pagedSubmissions = submissions.slice(0, pageSize);

  return (
    <div className="max-w-6xl mx-auto pt-3 pb-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Job Submissions</h1>
      <div className="rounded-lg overflow-x-auto shadow border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900">
        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-800 border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="py-3 px-4 text-left border-r border-gray-300 dark:border-gray-800">FullName</th>
              <th className="py-3 px-4 text-left border-r border-gray-300 dark:border-gray-800">Job</th>
              <th className="py-3 px-4 text-left border-r border-gray-300 dark:border-gray-800">Proof</th>
              <th className="py-3 px-4 text-left border-r border-gray-300 dark:border-gray-800">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagedSubmissions.map(sub => (
              <tr key={sub._id} className="border-t border-gray-300 dark:border-gray-800">
                <td className="py-2 px-4 border-r border-gray-300 dark:border-gray-800">{sub.user?.fullName || "N/A"}</td>
                <td className="py-2 px-4 border-r border-gray-300 dark:border-gray-800">
                  {sub.job?._id ? (
                    <Link href={`/dashboard/jobs/${sub.job._id}`}>
                      <span className="underline text-blue-600">{sub.job.title || "N/A"}</span>
                    </Link>
                  ) : "N/A"}
                </td>
                <td className="py-2 px-4 border-r border-gray-300 dark:border-gray-800">
                  {sub.proofImage ? (
                    <a
                      href={
                        sub.proofImage.startsWith('http')
                          ? sub.proofImage
                          : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${sub.proofImage}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-blue-600"
                    >View Proof</a>
                  ) : (
                    <span className="text-gray-400">No proof</span>
                  )}
                </td>
                <td className={`py-2 px-4 border-r border-gray-300 dark:border-gray-800 capitalize`}>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(sub.status)}`}>
                    {sub.status}
                  </span>
                </td>
                <td className="py-2 px-4">
                  {sub.status === "pending" ? (
                    <>
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                        onClick={() => handleReview(sub._id, "approved")}
                      >Approve</button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={() => handleReview(sub._id, "rejected")}
                      >Reject</button>
                    </>
                  ) : (
                    <span className="text-gray-500">Reviewed</span>
                  )}
                </td>
              </tr>
            ))}
            {!pagedSubmissions.length && (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-10">No submissions found.</td>
              </tr>
            )}
          </tbody>
        </table>
        {submissions.length > 5 && (
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
