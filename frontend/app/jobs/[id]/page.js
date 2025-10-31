'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { jobsAPI } from '../../../lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function JobDetails() {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proofFile, setProofFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proofText, setProofText] = useState('');
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    async function fetchJob() {
      try {
        const response = await jobsAPI.getJobById(params.id);
        setJob(response.data.data);
      } catch (error) {
        toast.error('Failed to load job details');
        router.push('/jobs');
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [params.id, router]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    setProofFile(file);
  };

  const handleApply = async () => {
    if (!proofFile) {
      toast.error('Proof of completion is required');
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('proof', proofFile);
    formData.append('comment', proofText);
    try {
      await jobsAPI.applyJob(params.id, formData);
      toast.success('Submission sent! Wait for review.');
      router.push('/dashboard/jobs');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-red-500">Job not found</div>
        <Footer />
      </>
    );
  }

  const categories = job.category
    ? Array.isArray(job.category) ? job.category : [job.category]
    : [];
  const image = job.image || '/images/job-default.jpg';
  const totalSlots = typeof job.totalSlots === "number" ? job.totalSlots : Number(job.totalSlots) || 0;
  const filledSlots = typeof job.filledSlots === "number" ? job.filledSlots : Number(job.filledSlots) || 0;
  const availableVacancy = Math.max(0, totalSlots - filledSlots);

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-10">
        <div>
          {/* Categories */}
          <div className="mb-4 flex flex-wrap gap-2">
            {categories.map((cat, idx) => (
              <span key={idx} className="inline-block px-3 py-1 text-xs font-medium bg-primary-100 text-primary-600 rounded-xl">
                {cat}
              </span>
            ))}
          </div>
          {/* Title */}
          <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
          {/* Description */}
          <div className="prose mb-6 text-lg text-gray-800" dangerouslySetInnerHTML={{ __html: job.description }} />
          {/* Instructions Block */}
          {job.instructions && (
            <div className="bg-primary-50 border-l-8 border-primary-400 px-7 py-6 rounded-2xl mb-8 shadow text-base max-w-2xl mx-auto">
              <h2 className="font-bold text-primary-700 text-2xl mb-4 text-center">Instructions</h2>
              <div className="prose text-primary-900 break-words" style={{ whiteSpace: "pre-line" }} dangerouslySetInnerHTML={{ __html: job.instructions }} />
            </div>
          )}
          {/* Proof/Submission */}
          <div className="bg-gray-100 py-5 px-6 rounded-xl mt-8">
            <h2 className="text-lg font-semibold mb-3">Enter the Required Proof of Job Finished:</h2>
            <textarea
              value={proofText}
              onChange={e => setProofText(e.target.value)}
              placeholder="Enter proof, comment, or URL"
              className="w-full min-h-[70px] border bg-white rounded mb-4 p-2"
            />
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleFileChange}
              className="mb-2"
            />
            <div className="text-xs text-gray-500 mb-3">
              Allowed File Extensions: jpeg, png, jpg
            </div>
            <button
              className="btn-primary w-full"
              onClick={handleApply}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Requesting...' : 'Request For Complete'}
            </button>
          </div>
        </div>
        {/* Right Sidebar Info */}
        <div className="bg-white rounded-xl border shadow-sm p-6 min-w-[250px]">
          <div className="mb-3 flex gap-2 flex-wrap">
            {categories.map((cat, idx) => (
              <span
                key={idx}
                className="inline-block px-3 py-1 text-xs font-semibold bg-primary-100 text-primary-600 rounded-xl"
              >
                {cat}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 mb-4">
            <img src={image} alt={job.title} className="w-14 h-14 rounded object-cover bg-gray-200"/>
            <div>
              <div className="font-bold text-primary-600 text-[12px]">Job ID:</div>
              <div className="text-xs text-gray-700">{job._id}</div>
              {job.createdBy?.fullname && (
                <div className="text-xs text-gray-500 mt-1">
                  posted by <span className="font-semibold">{job.createdBy.fullname}</span>
                </div>
              )}
            </div>
          </div>
          <div className="py-3 border-b">
            <span className="text-primary-600 font-bold text-lg">${job.reward?.toFixed?.(2) ?? job.reward}</span>
          </div>
          <div className="flex items-center gap-2 py-3 border-b">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M8 2V4M12 2V4M3 8H17M5 6H15C16.1046 6 17 6.89543 17 8V16C17 17.1046 16.1046 18 15 18H5C3.89543 18 3 17.1046 3 16V8C3 6.89543 3.89543 6 5 6Z" stroke="#059669" strokeWidth="1.2"/></svg>
            <div>
              <div className="text-xs text-gray-400 leading-tight">Published Date</div>
              <div className="text-sm font-bold text-[#059669]">
                {job.createdAt ? format(new Date(job.createdAt), 'MMM dd, yyyy hh:mm a').toUpperCase() : '-'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 py-3 border-b">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M10 10C12.2091 10 14 8.20914 14 6C14 3.79086 12.2091 2 10 2C7.79086 2 6 3.79086 6 6C6 8.20914 7.79086 10 10 10ZM10 10V18" stroke="#ef4444" strokeWidth="1.2"/></svg>
            <div>
              <div className="text-xs text-gray-400 leading-tight">This Job Vacancy</div>
              <div className="text-sm font-semibold text-[#ef4444]">{totalSlots}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 py-3">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M10 10C10 11.1046 9.10457 12 8 12C6.89543 12 6 11.1046 6 10C6 8.89543 6.89543 8 8 8C9.10457 8 10 8.89543 10 10ZM14 8C15.1046 8 16 8.89543 16 10C16 11.1046 15.1046 12 14 12C12.8954 12 12 11.1046 12 10C12 8.89543 12.8954 8 14 8Z" stroke="#16a34a" strokeWidth="1.2"/></svg>
            <div>
              <div className="text-xs text-gray-400 leading-tight">Available Job Vacancy</div>
              <div className="text-sm font-semibold text-[#16a34a]">{availableVacancy}</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
