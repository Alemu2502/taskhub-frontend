'use client';

import { useState, useEffect } from 'react';
import { userAPI } from '../../lib/api';
import { getUser } from '../../lib/auth';
import toast from 'react-hot-toast';
import { FiDollarSign, FiCheckCircle, FiClock, FiXCircle, FiTrendingUp } from 'react-icons/fi';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userObj = getUser();
    setUser(userObj);

    // Only fetch user stats if not admin
    if (userObj && userObj.role !== 'admin') {
      fetchStats();
    } else {
      setLoading(false); // Done loading immediately for admin
    }
  }, []);

  const fetchStats = async () => {
    try {
      const response = await userAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      toast.error('Failed to load statistics');
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  // Show a message for admin users (no stats/overview for them)
  if (user && user.role === 'admin') {
    return null;
  }

  // User dashboard overview (for non-admin)
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's your earning overview
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : stats ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card shadow bg-gradient-to-br from-blue-600 to-blue-400 text-white border-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold opacity-90 tracking-wide">Current Balance</h3>
                  <FiDollarSign size={28} className="opacity-80" />
                </div>
                <p className="text-4xl font-bold mb-1 drop-shadow">
                  ${stats?.wallet?.balance?.toFixed(2) ?? '0.00'}
                </p>
                <p className="text-xs opacity-80">Available for withdrawal</p>
              </div>
              <div className="card border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Earned</h3>
                  <FiTrendingUp size={24} className="text-green-500" />
                </div>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  ${stats?.wallet?.totalEarned?.toFixed(2) ?? '0.00'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">All time earnings</p>
              </div>
              <div className="card border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Approved Jobs</h3>
                  <FiCheckCircle size={24} className="text-green-500" />
                </div>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                  {stats?.applications?.approved ?? 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Successfully completed</p>
              </div>
              <div className="card border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Pending</h3>
                  <FiClock size={24} className="text-yellow-500" />
                </div>
                <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">
                  {stats?.applications?.pending ?? 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Under review</p>
              </div>
            </div>

            {/* Application Summary */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Application Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <FiClock className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Total Applications</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {stats?.applications?.total ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <FiCheckCircle className="text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Approved</span>
                  </div>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    {stats?.applications?.approved ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                      <FiClock className="text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Pending</span>
                  </div>
                  <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                    {stats?.applications?.pending ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                      <FiXCircle className="text-red-600 dark:text-red-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Rejected</span>
                  </div>
                  <span className="text-xl font-bold text-red-600 dark:text-red-400">
                    {stats?.applications?.rejected ?? 0}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-10 text-lg text-red-500 font-semibold">
            Failed to load statistics.
          </div>
        )}
      </div>
    </div>
  );
}
