'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import JobCard from '../../components/JobCard';
import { jobsAPI } from '../../lib/api';
import toast from 'react-hot-toast';

const PLATFORMS = [
  { value: 'all', label: 'All Platforms' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'telegram', label: 'Telegram' },
];

const SORTS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'low-to-high', label: 'Price: Low to High' },
  { value: 'high-to-low', label: 'Price: High to Low' },
];

export default function Jobs() {
  const [allJobs, setAllJobs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [platform, setPlatform] = useState('all');
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  // Initial load/all-filters load jobs
  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line
  }, []);

  // Filter platform & sort instantly when UI dropdowns change
  useEffect(() => {
    filterAndSortJobs();
    // eslint-disable-next-line
  }, [platform, sort, appliedSearch, allJobs]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // Always get all jobs from backend for full local control
      const params = { limit: 200 };
      const response = await jobsAPI.getJobs(params);
      setAllJobs(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  // Handles filtering and sorting locally and rapidly
  const filterAndSortJobs = () => {
    let filtered = allJobs;

    // Platform
    if (platform !== 'all') {
      filtered = filtered.filter(job => (job.platform || '').toLowerCase() === platform);
    }

    // Search
    if (appliedSearch) {
      const q = appliedSearch.trim().toLowerCase();
      filtered = filtered.filter(job =>
        (job.title && job.title.toLowerCase().includes(q)) ||
        (job.instructions && job.instructions.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sort === 'low-to-high') {
      filtered = [...filtered].sort((a, b) => a.reward - b.reward);
    } else if (sort === 'high-to-low') {
      filtered = [...filtered].sort((a, b) => b.reward - a.reward);
    } else {
      filtered = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setJobs(filtered);
  };

  // UI handlers
  const handlePlatformChange = (e) => setPlatform(e.target.value);
  const handleSortChange = (e) => setSort(e.target.value);
  const handleSearchInput = (e) => setSearch(e.target.value);
  const handleApplyFilters = (e) => {
    e.preventDefault();
    setAppliedSearch(search);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Browse Available Jobs
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Find jobs that match your interests and start earning
            </p>
          </div>
          {/* Filters */}
          <form 
            onSubmit={handleApplyFilters}
            className="card mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col md:flex-row gap-4 md:gap-8 items-end"
          >
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-1">Platform</label>
              <select
                className="input-field"
                value={platform}
                onChange={handlePlatformChange}
              >
                {PLATFORMS.map(p => (<option key={p.value} value={p.value}>{p.label}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-1">Sort By</label>
              <select
                className="input-field"
                value={sort}
                onChange={handleSortChange}
              >
                {SORTS.map(s => (<option key={s.value} value={s.value}>{s.label}</option>))}
              </select>
            </div>
            <div className="flex-1 min-w-[200px] w-full">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-1">Search</label>
              <input
                type="text"
                className="input-field w-full"
                placeholder="Type to search title or keyword…"
                value={search}
                onChange={handleSearchInput}
              />
            </div>
            <button type="submit" className="btn-primary w-full md:w-auto mt-3 md:mt-0">
              Apply
            </button>
          </form>
          {/* Jobs Grid */}
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
          ) : jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No jobs found
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
