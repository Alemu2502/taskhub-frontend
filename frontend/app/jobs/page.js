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

const PAGE_SIZE = 12; 

export default function Jobs() {
  const [allJobs, setAllJobs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [platform, setPlatform] = useState('all');
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { fetchJobs(); }, []);
  useEffect(() => { filterAndSortJobs(); }, [platform, sort, appliedSearch, allJobs]);
  useEffect(() => { setCurrentPage(1); }, [platform, sort, appliedSearch]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = { limit: 200 };
      const response = await jobsAPI.getJobs(params);
      setAllJobs(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortJobs = () => {
    let filtered = allJobs;
    if (platform !== 'all') {
      filtered = filtered.filter(job => (job.platform || '').toLowerCase() === platform);
    }
    if (appliedSearch) {
      const q = appliedSearch.trim().toLowerCase();
      filtered = filtered.filter(job =>
        (job.title && job.title.toLowerCase().includes(q)) ||
        (job.instructions && job.instructions.toLowerCase().includes(q))
      );
    }
    if (sort === 'low-to-high') {
      filtered = [...filtered].sort((a, b) => a.reward - b.reward);
    } else if (sort === 'high-to-low') {
      filtered = [...filtered].sort((a, b) => b.reward - a.reward);
    } else {
      filtered = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    setJobs(filtered);
  };

  const handlePlatformChange = (e) => setPlatform(e.target.value);
  const handleSortChange = (e) => setSort(e.target.value);
  const handleSearchInput = (e) => setSearch(e.target.value);
  const handleApplyFilters = (e) => {
    e.preventDefault();
    setAppliedSearch(search);
  };

  // Pagination logic
  const totalPages = Math.ceil(jobs.length / PAGE_SIZE);
  const paginatedJobs = jobs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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
          {/* Fully Responsive Filter Bar */}
          <form 
            onSubmit={handleApplyFilters}
            className="flex flex-row flex-wrap items-end gap-4 bg-white p-6 mb-8 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex-1 min-w-[160px]">
              <label className="block text-sm font-medium text-gray-900 mb-1">Platform</label>
              <select
                className="input-field w-full"
                value={platform}
                onChange={handlePlatformChange}
              >
                {PLATFORMS.map(p => (<option key={p.value} value={p.value}>{p.label}</option>))}
              </select>
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className="block text-sm font-medium text-gray-900 mb-1">Sort By</label>
              <select
                className="input-field w-full"
                value={sort}
                onChange={handleSortChange}
              >
                {SORTS.map(s => (<option key={s.value} value={s.value}>{s.label}</option>))}
              </select>
            </div>
            <div className="flex-1 min-w-[240px]">
              <label className="block text-sm font-medium text-gray-900 mb-1">Search</label>
              <input
                type="text"
                className="input-field w-full"
                placeholder="Type to search title or keyword..."
                value={search}
                onChange={handleSearchInput}
              />
            </div>
            <button 
              type="submit" 
              className="h-12 w-full md:w-auto rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 text-sm mt-5 md:mt-0"
              style={{ whiteSpace: 'nowrap' }}
            >Apply</button>
          </form>
          {/* Jobs grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(PAGE_SIZE)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                  <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : paginatedJobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {paginatedJobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
              {/* Pagination controls */}
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  className="px-3 py-1 rounded border bg-gray-200 text-gray-700 disabled:opacity-50"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  type="button"
                >
                  Prev
                </button>
                <span className="mx-2 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="px-3 py-1 rounded border bg-gray-200 text-gray-700 disabled:opacity-50"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  type="button"
                >
                  Next
                </button>
              </div>
            </>
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
