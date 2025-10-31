'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getAuth, clearAuth } from '../../lib/auth';
import { authAPI } from '../../lib/api';
import {
  FiMenu,
  FiX,
  FiHome,
  FiBriefcase,
  FiSettings,
  FiLogOut,
  FiSun,
  FiMoon,
  FiUsers,
  FiDollarSign,
  FiBarChart2,
  FiFileText,
  FiCreditCard,
  FiBell
} from 'react-icons/fi';
import NotificationBell from '../../components/notificationBell'; // <----- add this line

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  // Redirect admin from "/dashboard" to "/dashboard/users"
  useEffect(() => {
    const auth = getAuth();
    if (!auth) {
      router.push('/auth/login');
      return;
    }
    setUser(auth.user);

    // Admin default redirect
    if (
      auth.user &&
      auth.user.role === 'admin' &&
      (pathname === '/dashboard' || pathname === '/dashboard/')
    ) {
      router.replace('/dashboard/users');
    }

    if (typeof window !== 'undefined') {
      const isDark = localStorage.getItem('darkMode') === 'true';
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, [router, pathname]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', newMode.toString());
    }
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    clearAuth();
    router.push('/auth/login');
  };

  const userNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Browse Jobs', href: '/dashboard/jobs', icon: FiBriefcase },
    { name: 'Wallet', href: '/dashboard/wallet', icon: FiCreditCard },
    { name: 'Settings', href: '/dashboard/settings', icon: FiSettings },
  ];

  // Hide "Admin Dashboard" completely for admin
  const adminNavigation = [
    { name: 'Manage Users', href: '/dashboard/users', icon: FiUsers },
    { name: 'Manage Jobs', href: '/dashboard/manage-jobs', icon: FiBriefcase },
    { name: 'Submissions', href: '/dashboard/submissions', icon: FiFileText },
    { name: 'Withdrawals', href: '/dashboard/withdrawals', icon: FiDollarSign },
    { name: 'Send Notifications', href: '/dashboard/admin/sendNotification', icon: FiBell }
  ];

  const navigation = user?.role === 'admin' ? adminNavigation : userNavigation;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navbar */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Menu Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
              <Link href="/dashboard" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                TaskHub
              </Link>
              {user.role === 'admin' && (
                <span className="px-3 py-1 text-xs font-semibold bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-full">
                  Admin
                </span>
              )}
            </div>
            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900 dark:text-white">{user.fullName}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full pt-20 pb-4 overflow-y-auto">
          <div className="px-3 space-y-1">
            {/* Home Link (at top, no margin) */}
            <Link
              href="/"
              className="flex items-center gap-3 font-semibold text-lg px-4 py-3 rounded-lg text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20"
              onClick={() => setSidebarOpen(false)}
            >
              <FiHome size={20} />
              <span>Home</span>
            </Link>

            {/* Sidebar Navigation */}
            {navigation.map((item, idx) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
            
              if (item.name === 'Wallet') {
                return (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.name}</span>
                    </Link>
                    {/* NotificationBell right after Wallet */}
                   
                      <NotificationBell  sidebar/>
                      
                    
                  </div>
                );
              }
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Logout Button (consistent styling) */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold mt-4"
            >
              <FiLogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:pl-64 pt-16">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
