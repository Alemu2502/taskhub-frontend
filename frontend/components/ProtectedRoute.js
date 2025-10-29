'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../lib/auth';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
    }
  }, [router]);

  if (!isAuthenticated()) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
