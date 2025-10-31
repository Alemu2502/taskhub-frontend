'use client';

import { useState, useEffect } from 'react';
import { userAPI } from '../../../lib/api';
import toast from 'react-hot-toast';

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 25, 50, 75, 100];

export default function WalletPage() {
  const [wallet, setWallet] = useState({
    balance: 0,
    totalEarned: 0,
    totalWithdrawn: 0,
  });
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawData, setWithdrawData] = useState({
    amount: '',
    method: 'telebirr',
    address: '',
  });
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    fetchWallet();
    fetchWithdrawals();
  }, []);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getProfile();
      const walletData = response.data?.data?.wallet || {
        balance: 0,
        totalEarned: 0,
        totalWithdrawn: 0,
      };
      setWallet(walletData);
    } catch (error) {
      console.error('Failed to fetch wallet:', error);
      toast.error('Failed to load wallet data');
      setWallet({
        balance: 0,
        totalEarned: 0,
        totalWithdrawn: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const res = await userAPI.getWithdrawals();
      setWithdrawals(res.data.data || []);
    } catch {
      setWithdrawals([]);
    }
  };

  function validateAddress() {
    const { method, address } = withdrawData;
    if (method === 'telebirr') {
      return /^\+2519\d{8}$/.test(address.trim());
    }
    if (method === 'cbe') {
      return /^1000\d{9}$/.test(address.trim());
    }
    if (method === 'bep20') {
      return /^0x[a-fA-F0-9]{40}$/.test(address.trim());
    }
    return false;
  }

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawData.amount);

    if (amount < 1) {
      toast.error('Minimum withdrawal amount is $1.00');
      return;
    }

    if (amount > wallet.balance) {
      toast.error('Insufficient balance');
      return;
    }

    // No need for BEP20 early bailout now, handled by disabling submit

    if (!validateAddress() && withdrawData.method !== 'bep20') {
      if (withdrawData.method === 'telebirr') {
        toast.error('Telebirr number must be in the format +2519XXXXXXXX');
      } else if (withdrawData.method === 'cbe') {
        toast.error('CBE account must be 13 digits and start with 1000');
      } else {
        toast.error('Invalid account information');
      }
      return;
    }

    toast.loading('Processing withdrawal...');
    try {
      await userAPI.requestWithdrawal({
        amount: withdrawData.amount,
        method: withdrawData.method,
        accountDetails: withdrawData.address,
      });
      toast.dismiss();
      toast.success('Withdrawal request submitted successfully');
      setShowWithdrawModal(false);
      setWithdrawData({ amount: '', method: 'telebirr', address: '' });
      fetchWallet();
      fetchWithdrawals();
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Failed to submit withdrawal request');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading wallet...</p>
        </div>
      </div>
    );
  }

  const pagedWithdrawals = withdrawals.slice(0, pageSize);

  return (
    <div className="space-y-6 pt-3">
      <h1 className="text-2xl font-bold text-blue-700">Wallet</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card card__body">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-blue-700">Current Balance</h3>
          </div>
          <p className="text-4xl font-bold mb-4 text-blue-900">${(wallet?.balance || 0).toFixed(2)}</p>
          <button
            onClick={() => setShowWithdrawModal(true)}
            disabled={(wallet?.balance || 0) < 1}
            className="btn-primary w-full"
          >
            Withdraw
          </button>
        </div>
        <div className="card card__body">
          <h3 className="text-lg font-medium mb-2 text-blue-700">Total Earned</h3>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400">
            ${(wallet?.totalEarned || 0).toFixed(2)}
          </p>
        </div>
        <div className="card card__body">
          <h3 className="text-lg font-medium mb-2 text-blue-700">Total Withdrawn</h3>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            ${(wallet?.totalWithdrawn || 0).toFixed(2)}
          </p>
        </div>
      </div>
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full">
            <div className="card__body">
              <h2 className="text-xl font-bold mb-4 text-blue-700">Request Withdrawal</h2>
              <form onSubmit={handleWithdraw} className="space-y-4">
                <div>
                  <label className="label text-blue-700">Amount (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max={wallet?.balance || 0}
                    value={withdrawData.amount}
                    onChange={(e) =>
                      setWithdrawData({ ...withdrawData, amount: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Available: ${(wallet?.balance || 0).toFixed(2)} | Minimum: $1.00
                  </p>
                </div>
                <div>
                  <label className="label text-blue-700">Withdrawal Method</label>
                  <select
                    value={withdrawData.method}
                    onChange={(e) =>
                      setWithdrawData({ ...withdrawData, method: e.target.value, address: '' })
                    }
                    className="input-field"
                    required
                  >
                    <option value="bep20">BEP20 (USDT)</option>
                    <option value="telebirr">Telebirr</option>
                    <option value="cbe">CBE Bank</option>
                  </select>
                </div>
                {withdrawData.method === 'bep20' ? (
                  <div className="p-3 mb-2 rounded bg-yellow-50 border border-yellow-300 text-yellow-800 font-medium text-sm flex items-center gap-2">
                    <svg className="inline-block mr-2" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="10" fill="#FDE68A" />
                      <path d="M10 5V11" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="10" cy="14" r="1" fill="#D97706" />
                    </svg>
                    Sorry, withdrawal via BEP20 is temporarily unavailable.
                    <span className="font-semibold ml-1">Please choose Telebirr or CBE Bank.</span>
                    <br />
                    <span className="block text-xs text-yellow-700 mt-1">
                      <b>Reason:</b> Due to service issues, BEP20 payouts are paused for your security and compliance.
                    </span>
                  </div>
                ) : (
                  <div>
                    <label className="label text-blue-700">
                      {withdrawData.method === 'telebirr'
                        ? 'Telebirr Number'
                        : 'Bank Account Number'}
                    </label>
                    <input
                      type="text"
                      value={withdrawData.address}
                      onChange={(e) =>
                        setWithdrawData({ ...withdrawData, address: e.target.value })
                      }
                      className="input-field"
                      required
                      placeholder={
                        withdrawData.method === 'telebirr' ? '+2519...' : '1000...'
                      }
                    />
                    {withdrawData.method === 'telebirr' &&
                      withdrawData.address &&
                      !/^\+2519\d{8}$/.test(withdrawData.address) && (
                        <div className="text-xs text-red-600 mt-1">Format must be +2519XXXXXXXX</div>
                      )}
                    {withdrawData.method === 'cbe' &&
                      withdrawData.address &&
                      !/^1000\d{9}$/.test(withdrawData.address) && (
                        <div className="text-xs text-red-600 mt-1">CBE must start with 1000 and be 13 digits</div>
                      )}
                  </div>
                )}
                {withdrawData.method !== 'bep20' && (
                  <div className="text-xs text-yellow-800 bg-yellow-50 px-2 py-1 rounded border border-yellow-200">
                    <b>Reminder:</b> Name on your Telebirr or CBE account must exactly match your TaskHub account name to prevent payout delays.
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                    disabled={withdrawData.method === 'bep20'}
                  >
                    Submit Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowWithdrawModal(false)}
                    className="btn--secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="card">
        <div className="card__body">
          <h2 className="text-xl font-bold mb-4 text-blue-700">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 border-b border-r text-left font-semibold text-blue-700 whitespace-nowrap">Amount</th>
                  <th className="py-3 px-4 border-b border-r text-left font-semibold text-blue-700 whitespace-nowrap">Method</th>
                  <th className="py-3 px-4 border-b border-r text-left font-semibold text-blue-700 whitespace-nowrap">Account / Details</th>
                  <th className="py-3 px-4 border-b border-r text-left font-semibold text-blue-700 whitespace-nowrap">Status</th>
                  <th className="py-3 px-4 border-b border-r text-left font-semibold text-blue-700 whitespace-nowrap">Requested At</th>
                  <th className="py-3 px-4 border-b text-left font-semibold text-blue-700 whitespace-nowrap">Processed At</th>
                </tr>
              </thead>
              <tbody>
                {pagedWithdrawals.length > 0 ? (
                  pagedWithdrawals.map((w, index) => (
                    <tr
                      key={w._id}
                      className={`hover:bg-blue-50 transition ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="py-3 px-4 border-b border-r font-semibold text-blue-900">${w.amount}</td>
                      <td className="py-3 px-4 border-b border-r text-blue-800 font-semibold capitalize">{w.method}</td>
                      <td className="py-3 px-4 border-b border-r text-gray-600">{w.accountDetails}</td>
                      <td className="py-3 px-4 border-b border-r capitalize font-semibold">
                        <span
                          className={
                            'px-2 py-1 rounded text-xs font-bold border ' +
                            (w.status === 'completed'
                              ? 'bg-green-100 text-green-800 border-green-300'
                              : w.status === 'rejected'
                              ? 'bg-red-100 text-red-700 border-red-300'
                              : w.status === 'processing'
                              ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                              : 'bg-blue-100 text-blue-700 border-blue-300')
                          }
                        >
                          {w.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 border-b border-r text-blue-800">
                        {w.requestedAt ? new Date(w.requestedAt).toLocaleString() : '-'}
                      </td>
                      <td className="py-3 px-4 border-b text-blue-800">
                        {w.processedAt ? new Date(w.processedAt).toLocaleString() : '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-gray-400 py-10">
                      No transactions yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {withdrawals.length > 5 && (
              <div className="flex justify-end items-center py-3 px-6 gap-2">
                <label htmlFor="page-size-select" className="text-sm text-gray-700 dark:text-gray-200">
                  Rows to show:
                </label>
                <select
                  id="page-size-select"
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                >
                  {PAGE_SIZE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
