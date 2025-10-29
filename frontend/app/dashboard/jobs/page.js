'use client';

import { useState, useEffect } from "react";
import { jobsAPI } from "../../../lib/api.js";
import JobCard from "../../../components/JobCard";
import toast from "react-hot-toast";

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

export default function BrowseJobs() {
  const [allJobs, setAllJobs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [platform, setPlatform] = useState('all');
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  useEffect(() => { fetchJobs(); }, []);
  useEffect(() => { filterAndSortJobs(); }, [platform, sort, appliedSearch, allJobs]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobsAPI.getJobs({ limit: 200 });
      setAllJobs(res.data.data || []);
    } catch {
      toast.error("Failed to load jobs");
    }
    setLoading(false);
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Browse Available Jobs</h1>
      {/* Single row filter bar */}
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
        <div>Loading...</div>
      ) : jobs.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-6">No jobs found.</div>
      )}
    </div>
  );
}
