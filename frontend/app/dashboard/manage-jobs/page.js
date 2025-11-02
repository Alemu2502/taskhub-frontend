'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminAPI } from "../../../lib/api.js";
import toast from "react-hot-toast";

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 25, 50, 75, 100];

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(5); // Default to 5

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getAllJobs();
      setJobs(res.data.data);
    } catch {
      toast.error('Failed to load jobs');
    }
    setLoading(false);
  };

  const handleDelete = async (job) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await adminAPI.deleteJob(job._id);
      toast.success('Job deleted');
      fetchJobs();
    } catch {
      toast.error('Delete failed');
    }
  };

  function ConReward({ reward }) {
    return (
      <span className="text-green-600 dark:text-green-300 font-semibold">
      ${reward}
      </span>
    );
  }

  const pagedJobs = jobs.slice(0, pageSize);

  return (
    <div className="max-w-5xl mx-auto pt-3 pb-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Jobs</h1>
        <Link href="/dashboard/jobs/new" className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition">+ New Job</Link>
      </div>
      {loading ? <div>Loading...</div> : (
        <div className="rounded-lg overflow-x-auto shadow border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-800 border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="py-3 px-4 border-r border-gray-300 dark:border-gray-800 text-left">Title</th>
                <th className="py-3 px-4 border-r border-gray-300 dark:border-gray-800 text-left">Platform</th>
                <th className="py-3 px-4 border-r border-gray-300 dark:border-gray-800 text-left">Reward</th>
                <th className="py-3 px-4 border-r border-gray-300 dark:border-gray-800 text-left">Slots</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedJobs.map(job => (
                <tr key={job._id} className="border-t border-gray-300 dark:border-gray-800">
                  <td className="py-2 px-4 border-r border-gray-300 dark:border-gray-800 font-bold">{job.title}</td>
                  <td className="py-2 px-4 border-r border-gray-300 dark:border-gray-800">{job.platform}</td>
                  <td className="py-2 px-4 border-r border-gray-300 dark:border-gray-800">
                    <ConReward reward={job.reward} />
                  </td>
                  <td className="py-2 px-4 border-r border-gray-300 dark:border-gray-800">{job.totalSlots}</td>
                  <td className="py-2 px-4">
                    <div className="flex gap-3">
                      <Link
                        href={`/dashboard/jobs/${job._id}`}
                        className="underline text-blue-600"
                      >Edit</Link>
                      <button
                        className="underline text-red-600"
                        onClick={() => handleDelete(job)}
                      >Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!pagedJobs.length && (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-6">No jobs found.</td>
                </tr>
              )}
            </tbody>
          </table>
          {jobs.length > 5 && (
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
      )}
    </div>
  );
}
