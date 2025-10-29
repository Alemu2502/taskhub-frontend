'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { adminAPI } from '../../../lib/api';
import toast from 'react-hot-toast';

// Utility to generate a URL-friendly slug from the title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')         // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '')             // Remove starting/ending hyphens
    .replace(/--+/g, '-');               // Replace multiple hyphens with one
}

const categories = [
  { value: '', label: 'Select category' },
  { value: 'tips', label: 'Tips' },
  { value: 'news', label: 'News' },
  { value: 'guide', label: 'Guide' },
  { value: 'update', label: 'Update' },
  { value: 'announcement', label: 'Announcement' }
];

export default function CreateBlog() {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminAPI.createBlog({
        title,
        slug: generateSlug(title),
        excerpt,
        category,
        content,
        status: 'draft'
      });
      toast.success('Blog created!');
      router.push('/blogs');
    } catch (error) {
      toast.error('Failed to create blog: ' + (error?.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Create Blog Post</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">Title</label>
              <input
                type="text"
                className="input-field w-full"
                maxLength={200}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">Excerpt (short summary, max 300 chars)</label>
              <textarea
                className="input-field w-full h-16"
                maxLength={300}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">Category</label>
              <select
                className="input-field w-full"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">Content (supports HTML)</label>
              <textarea
                className="input-field w-full h-40"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Blog'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
