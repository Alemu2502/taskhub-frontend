'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import { adminAPI } from '../../../../lib/api';
import toast from 'react-hot-toast';

export default function EditBlog() {
  const params = useParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
    // eslint-disable-next-line
  }, [params.id]);

  const fetchBlog = async () => {
    try {
      const response = await adminAPI.getBlogBySlug(params.id);
      const blog = response.data.data;
      setTitle(blog.title);
      setContent(blog.content);
      setIsPublished(blog.isPublished);
    } catch {
      toast.error('Failed to load blog');
      router.push('/blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminAPI.updateBlog(params.id, { title, content, isPublished });
      toast.success('Blog updated!');
      router.push('/blogs');
    } catch {
      toast.error('Failed to update blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Edit Blog Post</h1>
          {loading ? (
            <div>Loading…</div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">Title</label>
                <input
                  type="text"
                  className="input-field w-full"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
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
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="publish"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                />
                <label htmlFor="publish" className="text-gray-700 dark:text-gray-200">
                  Publish
                </label>
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Updating...' : 'Update Blog'}
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
