'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authAPI } from '../../../lib/api';
import { setAuth } from '../../../lib/auth';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    // console.log('🔐 FRONTEND LOGIN ATTEMPT');
    // console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    // console.log('📧 Email:', formData.email);
    // console.log('🔒 Password length:', formData.password.length);
    // console.log('⏰ Timestamp:', new Date().toISOString());

    try {
     // console.log('📡 Sending login request to API...');
      const response = await authAPI.login(formData);
      
      // console.log('📥 Response received:', {
      //   status: response.status,
      //   success: response.data?.success,
      //   message: response.data?.message,
      // });
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        
        //console.log('✅ Login successful!');
        // console.log('👤 User:', {
        //   id: user.id,
        //   // username: user.username,
        //   email: user.email,
        //   role: user.role,
        // });
        // console.log('🎫 Token received:', token ? 'Yes' : 'No');
        
        // Store auth data
        //console.log('💾 Storing auth data...');
        setAuth(token, user);
       // console.log('✅ Auth data stored in localStorage');
        
        // Check if actually stored
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        //console.log('🔍 Verification - Token in localStorage:', storedToken ? 'Yes' : 'No');
        //console.log('🔍 Verification - User in localStorage:', storedUser ? 'Yes' : 'No');
        
        // if (storedToken) {
        //   console.log('🔍 Token preview:', storedToken.substring(0, 20) + '...');
        // }
        // if (storedUser) {
        //   console.log('🔍 Stored user:', JSON.parse(storedUser).username);
        // }
        
        toast.success('Login successful! Redirecting...');
        
        console.log('🔄 Redirecting to /dashboard in 500ms...');
        // Force redirect after short delay
        setTimeout(() => {
          //console.log('🚀 Executing redirect now...');
          //console.log('🚀 Target URL: /dashboard');
          window.location.href = '/dashboard';
        }, 500);
      } else {
        console.log('❌ Login failed:', response.data.message);
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      // console.error('❌ LOGIN ERROR');
      // console.error('Error object:', error);
      // console.error('Response data:', error.response?.data);
      // console.error('Response status:', error.response?.status);
      // console.error('Error message:', error.message);
      
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
     // console.log('📢 Showing error to user:', errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      // console.log('🏁 Login attempt finished');
      // console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-bold text-primary-600 dark:text-primary-400">
            UseTaskHub
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Login to continue earning
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">
                <FiMail className="inline mr-2" />
                Email
              </label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter email or username"
                required
              />
            </div>

            <div>
              <label className="label">
                <FiLock className="inline mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pr-10"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </div>

              <Link href="/auth/reset-password" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Don't have an account? </span>
            <Link href="/auth/register" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
