'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function VerifyEmail() {
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const res = await fetch(`${API}/api/auth/verify-email/${token}`);
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message);
        toast.success('Email verified successfully!');
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Verification failed');
        toast.error('Verification failed');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Verification failed');
      toast.error('Verification failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-bold text-primary-600 dark:text-primary-400">
            TaskHub
          </Link>
        </div>
        <div className="card text-center">
          {status === 'verifying' && (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold mb-2 dark:text-white">Verifying Email</h2>
              <p className="text-gray-600 dark:text-gray-400">Please wait...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <FiCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-green-600 dark:text-green-400">Email Verified!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Redirecting to login...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <FiXCircle className="text-red-500 text-6xl mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-red-600 dark:text-red-400">Verification Failed</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
              <Link href="/auth/login" className="btn-primary inline-block">
                Go to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
