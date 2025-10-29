'use client';

import { useState, useEffect } from 'react';
import { userAPI } from '../../../lib/api';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiGlobe } from 'react-icons/fi';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    country: '',
    mobile: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      const userData = response.data.data;
      setUser(userData);
      setFormData({
        fullName: userData.fullName,
        email: userData.email,
        country: userData.country || '',
        mobile: userData.mobile
      });
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await userAPI.updateProfile(formData);
      toast.success(response.data.message);
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Account Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account information
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">
                <FiUser className="inline mr-2" />
                FullName
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="input-field bg-gray-100 dark:bg-gray-700"
                required
                disabled
                
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                fullName cannot be changed
              </p>
            </div>

            <div>
              <label className="label">
                <FiMail className="inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field bg-gray-100 dark:bg-gray-700"
                disabled
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Email cannot be changed
              </p>
            </div>

            <div>
              <label className="label">
                <FiGlobe className="inline mr-2" />
                Country
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select Country</option>
                <option value="Ethiopia">Ethiopia</option>
                <option value="Kenya">Kenya</option>
                <option value="Uganda">Uganda</option>
                <option value="Tanzania">Tanzania</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Ghana">Ghana</option>
                <option value="South Africa">South Africa</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="label">
                <FiPhone className="inline mr-2" />
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="input-field"
                placeholder="+251 xxx xxx xxx"
                required
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary w-full"
              >
                {saving ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Account Info */}
        {user && (
        <div className="card mt-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Account Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Account Status</span>
              <span className={`font-medium ${user.isVerified ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                {user.isVerified ? '✓ Verified' : 'Pending Verification'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Member Since</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">User ID</span>
              <span className="font-medium text-gray-900 dark:text-white font-mono text-xs">
                {user._id}
              </span>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
