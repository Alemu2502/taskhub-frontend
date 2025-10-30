'use client';
import React, { useEffect, useState } from "react";

export default function ReferralSection() {
  const [profile, setProfile] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const defaultVisible = 5;

  const registrationPath = "/auth/register";

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const profileRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        const profileData = await profileRes.json();
        if (profileData?.success && profileData?.data) setProfile(profileData.data);

        const referralRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/referrals`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        const referralData = await referralRes.json();
        setReferrals(referralData.data || []);
      } catch (e) {
        setProfile(null);
        setReferrals([]);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const referralCode = profile?.referralCode || '';
  const referralUrl = referralCode && typeof window !== "undefined"
    ? `${window.location.origin}${registrationPath}?ref=${referralCode}`
    : "";

  const completedCount = referrals.filter(u => u.isVerified && u.referralBonusPaid).length;
  const pendingCount = referrals.filter(u => u.isVerified && !u.referralBonusPaid).length;
  const notVerifiedCount = referrals.filter(u => !u.isVerified).length;
  const completedEarnings = completedCount * 0.01;

  const handleCopy = (text, what) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (what === "code") {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 1200);
    } else if (what === "link") {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 1200);
    }
  };

  // Dropdown logic
  const visibleReferrals = showAll ? referrals : referrals.slice(0, defaultVisible);

  return (
    <section className="mb-8">
      <div className="rounded-xl w-full p-7 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-lg mx-auto">
        <h2 className="font-bold text-2xl mb-6 text-primary-700 dark:text-primary-300 flex items-center gap-1">
          💎 Referral Program
        </h2>
        {loading ? (
          <div className="my-4 text-gray-400">Loading...</div>
        ) : (
        <>
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-end mb-4 w-full">
          <div className="flex-0 flex flex-col gap-2 min-w-[160px]">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Your Referral Code</span>
            <div className="flex items-center gap-2">
              <code className="px-3 py-1 rounded text-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 font-mono">{referralCode}</code>
              <button
                type="button"
                className="px-2 py-1 rounded bg-blue-500 text-white text-xs active:bg-blue-800"
                onClick={() => handleCopy(referralCode, "code")}
                disabled={!referralCode}
              >{copiedCode ? "Copied!" : "Copy"}</button>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-2 md:items-end w-full">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Your Invite Link</span>
            <div className="flex gap-2 w-full md:w-[80%]">
              <input
                readOnly
                className="rounded px-2 py-1 border w-full bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-blue-700 focus:outline-none"
                value={referralUrl}
                onClick={e => e.target.select()}
              />
              <button
                type="button"
                className="px-2 py-1 rounded bg-green-500 text-white text-xs active:bg-green-800"
                onClick={() => handleCopy(referralUrl, "link")}
                disabled={!referralUrl}
              >{copiedLink ? "Copied!" : "Copy"}</button>
            </div>
          </div>
        </div>
        <p className="mb-6 text-sm text-gray-700 dark:text-gray-300 mt-2">
          Share your invite link and earn <b className="text-green-600 dark:text-green-400">$0.01</b> for each invited user who completes their first task!
        </p>
        <div className="flex flex-wrap gap-6 mb-6">
          <div className="flex flex-col items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-md min-w-[90px]">
            <span className="font-bold text-2xl text-blue-700 dark:text-blue-300">{completedCount}</span>
            <span className="text-xs text-blue-800 dark:text-blue-200">Completed</span>
          </div>
          <div className="flex flex-col items-center px-4 py-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-md min-w-[90px]">
            <span className="font-bold text-2xl text-yellow-700 dark:text-yellow-100">{pendingCount}</span>
            <span className="text-xs text-yellow-800 dark:text-yellow-100">Active</span>
          </div>
          <div className="flex flex-col items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md min-w-[90px]">
            <span className="font-bold text-2xl text-gray-600 dark:text-gray-300">{notVerifiedCount}</span>
            <span className="text-xs text-gray-700 dark:text-gray-400">Not Verified</span>
          </div>
          <div className="flex flex-col items-center px-4 py-2 bg-green-50 dark:bg-green-900/30 rounded-md min-w-[90px]">
            <span className="font-bold text-2xl text-green-600">${completedEarnings.toFixed(2)}</span>
            <span className="text-xs text-green-800 dark:text-green-300">Total Earned</span>
          </div>
        </div>
        {/* Dropdown invited users */}
        <div>
          <h4 className="font-semibold text-lg mb-2">Your Invited Users</h4>
          <div className="overflow-x-auto w-full">
            <table className="min-w-full text-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="py-2 px-4 text-left font-semibold">Name</th>
                  <th className="py-2 px-4 text-left font-semibold">Status</th>
                  <th className="py-2 px-4 text-left font-semibold">Referral Reward</th>
                </tr>
              </thead>
              <tbody>
                {referrals.length === 0
                  ? (<tr><td colSpan={3} className="py-3 px-4 text-center text-gray-400">No invited users yet.</td></tr>)
                  : visibleReferrals.map(u => (
                    <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                      <td className="py-2 px-4">{u.fullName}</td>
                      <td className="py-2 px-4">{u.isVerified ? (
                        <span className="text-green-700 font-bold">✔ Verified</span>
                      ) : (
                        <span className="text-gray-500">Not Verified</span>
                      )}</td>
                      <td className="py-2 px-4">
                        {u.referralBonusPaid
                          ? <span className="text-green-600 font-semibold">$0.01 (paid)</span>
                          : u.isVerified
                            ? <span className="text-yellow-600 font-semibold">Pending</span>
                            : <span className="text-gray-400">N/A</span>
                        }
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
            {/* Only show toggle if more than defaultVisible */}
            {referrals.length > defaultVisible && (
              <button
                className="mt-3 text-xs text-blue-700 underline mx-auto block"
                onClick={() => setShowAll(v => !v)}
              >
                {showAll ? "Show Less" : `Show All (${referrals.length})`}
              </button>
            )}
          </div>
        </div>
        </>
        )}
      </div>
    </section>
  );
}
