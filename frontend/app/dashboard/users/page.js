'use client';

import { useEffect, useState } from 'react';
import { adminAPI } from '../../../lib/api';
import toast from 'react-hot-toast';

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 25, 50, 75, 100];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banModal, setBanModal] = useState(null);
  const [banReason, setBanReason] = useState('');
  const [roleEdit, setRoleEdit] = useState(null);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getAllUsers();
      setUsers(res.data.data);
    } catch (e) {
      toast.error('Failed to load users');
    }
    setLoading(false);
  };

  const handleBanToggle = async (user, isBanned) => {
    try {
      await adminAPI.banUser(user._id, { isBanned, banReason: isBanned ? banReason : '' });
      toast.success(isBanned ? 'User banned' : 'User unbanned');
      setBanModal(null); setBanReason('');
      fetchUsers();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Ban error');
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await adminAPI.deleteUser(user._id);
      toast.success('User deleted');
      fetchUsers();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleChangeRole = async (user, role) => {
    try {
      await adminAPI.changeUserRole(user._id, { role });
      toast.success('Role updated');
      setRoleEdit(null);
      fetchUsers();
    } catch {
      toast.error('Failed to change role');
    }
  };

  const pagedUsers = users.slice(0, pageSize);

  if (loading) return <div className="p-8">Loading users...</div>;
  return (
    <div className="max-w-5xl mx-auto pt-3 pb-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Manage Users</h1>
      <div className="rounded-lg overflow-x-auto shadow border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900">
        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-800 border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="py-3 px-4 text-left border-r border-gray-300 dark:border-gray-800">FullName</th>
              <th className="py-3 px-4 text-left border-r border-gray-300 dark:border-gray-800">Email</th>
              <th className="py-3 px-4 text-left border-r border-gray-300 dark:border-gray-800">Role</th>
              <th className="py-3 px-4 text-left border-r border-gray-300 dark:border-gray-800">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagedUsers.map((u) => (
              <tr key={u._id} className="border-t border-gray-300 dark:border-gray-800">
                <td className="py-2 px-4 border-r border-gray-300 dark:border-gray-800">{u.fullName}</td>
                <td className="py-2 px-4 border-r border-gray-300 dark:border-gray-800">{u.email}</td>
                <td className="py-2 px-4 border-r border-gray-300 dark:border-gray-800">
                  {roleEdit === u._id
                    ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={u.role}
                          onChange={e => handleChangeRole(u, e.target.value)}
                          className="border px-2 py-1 rounded dark:bg-gray-800 dark:text-white"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button className="text-sm underline text-gray-600 dark:text-gray-300" onClick={() => setRoleEdit(null)}>Cancel</button>
                      </div>
                    )
                    : (
                      <span className="inline-flex items-center gap-2">
                        {u.role}
                        <button className="text-sm underline text-blue-600 ml-2" onClick={() => setRoleEdit(u._id)}>Edit</button>
                      </span>
                    )
                  }
                </td>
                <td className="py-2 px-4 border-r border-gray-300 dark:border-gray-800">
                  {u.isBanned
                    ? <span className="text-sm text-red-500 font-semibold">Banned</span>
                    : <span className="text-sm text-green-600 font-semibold">Active</span>
                  }
                </td>
                <td className="py-2 px-4">
                  {u.role !== 'admin' && (
                    <div className="flex gap-3">
                      {u.isBanned ? (
                        <button
                          onClick={() => handleBanToggle(u, false)}
                          className="text-green-600 underline"
                        >Unban</button>
                      ) : (
                        <button
                          onClick={() => setBanModal(u)}
                          className="text-red-600 underline"
                        >Ban</button>
                      )}
                      <button
                        className="text-red-600 underline"
                        onClick={() => handleDelete(u)}
                      >Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length > 5 && (
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
      {banModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 max-w-sm w-full border dark:border-gray-700">
            <h2 className="text-xl font-bold mb-3 text-red-700 dark:text-red-400">
              Ban User: <span>{banModal.username}</span>
            </h2>
            <textarea
              className="border rounded p-2 w-full mb-4 dark:bg-gray-900 dark:text-white"
              placeholder="Ban reason..."
              value={banReason}
              onChange={e => setBanReason(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => handleBanToggle(banModal, true)}
                className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={!banReason}
              >Ban</button>
              <button
                onClick={() => { setBanModal(null); setBanReason(''); }}
                className="border px-4 py-2 rounded"
              >Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
