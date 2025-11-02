'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import JobCard from '../components/JobCard';
import { jobsAPI } from '../lib/api';
import { FiArrowRight, FiDollarSign, FiUsers, FiTrendingUp } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await jobsAPI.getJobs({ limit: 8 });
      setJobs(response.data.data);
    } catch (error) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Watch Videos And Engage<br />
              <span className="text-primary-600 dark:text-primary-400">to Start Earning</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Join UseTaskHub and turn your online engagement into earnings! Watch YouTube, TikTok, 
              and Facebook videos or follow social media accounts to accumulate rewards. Withdraw easily when you reach $1.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register" className="btn-primary text-lg px-8 py-4">
                Get Started Now
              </Link>
              <Link href="/jobs" className="btn-outline text-lg px-8 py-4">
                Browse Jobs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 mb-4">
                <FiDollarSign size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">Easy Earnings</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Earn money by watching videos and engaging with content. Withdraw when you reach $1 minimum.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 mb-4">
                <FiUsers size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">Growing Community</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Join thousands of users already earning. No software needed—just simple, secure engagement.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 mb-4">
                <FiTrendingUp size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">Track Progress</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor your earnings in real-time. Transparent wallet system with detailed transaction history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Jobs */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold dark:text-white">Latest Job Posts</h2>
            <Link href="/jobs" className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-2">
              View All <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                  <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 dark:bg-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Start Earning Now!
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Sign up today to start earning money effortlessly by engaging with videos and social media content.
          </p>
          <Link href="/auth/register" className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition">
            Get Started Now
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
