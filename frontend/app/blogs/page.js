'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import BlogCard from '../../components/BlogCard';
import { blogsAPI, adminAPI } from '../../lib/api';
import toast from 'react-hot-toast';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [roleChecked, setRoleChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkRoleAndFetch = async () => {
      let admin = false;
      try {
        const userStr = typeof window !== 'undefined' && window.localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user && user.role === 'admin') admin = true;
        }
      } catch {}
      setIsAdmin(admin);
      setRoleChecked(true);
      await fetchBlogs(admin);
    };
    checkRoleAndFetch();
  }, []);

  const fetchBlogs = async (admin = false) => {
    setLoading(true);
    try {
      let response;
      if (admin) {
        // Admin: backend must return ALL blogs, not just published!
        response = await adminAPI.getAllBlogs({ limit: 50 });
      } else {
        // User/guest: backend returns only published blogs
        response = await blogsAPI.getBlogs({ limit: 50 });
      }
      setBlogs(response.data.data || []);
    } catch {
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (blog) => {
    try {
      await adminAPI.updateBlog(blog._id, {
        status: blog.status === 'published' ? 'draft' : 'published'
      });
      toast.success(blog.status === 'published' ? 'Blog unpublished' : 'Blog published');
      await fetchBlogs(true);
    } catch {
      toast.error('Failed to update blog');
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      await adminAPI.deleteBlog(blogId);
      toast.success('Blog deleted');
      await fetchBlogs(true);
    } catch {
      toast.error('Failed to delete blog');
    }
  };

  // === KEY: DO NOT FILTER FOR ADMIN ===
  // Admin sees all; users/guests see only published
  const visibleBlogs = isAdmin
    ? blogs
    : blogs.filter(blog => blog.status === 'published');

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Blog & Resources
                  {isAdmin && (
                    <span className="ml-3 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Admin View
                    </span>
                  )}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {isAdmin
                    ? 'Create, publish, unpublish, and delete blogs for your platform'
                    : 'Learn tips, tricks, and updates about earning online'
                  }
                </p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => router.push('/blogs/create')}
                  className="mt-4 md:mt-0 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                >
                  <span className="text-lg">+</span>
                  New Blog
                </button>
              )}
            </div>
          </div>
          {!roleChecked || loading ? (
            <div>Loading...</div>
          ) : visibleBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className="relative group hover:shadow-xl bg-white rounded-lg border dark:bg-gray-900 dark:border-gray-800 mb-6 p-4 flex flex-col"
                >
                  <BlogCard blog={blog} />
                  {isAdmin && (
                    <div className="flex flex-row flex-wrap gap-2 mt-4 self-end">
                      <span className={`px-3 py-1 text-xs rounded-lg font-semibold border ${blog.status === 'published'
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                        }`}>
                        {blog.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                      <button
                        onClick={() => handleStatusToggle(blog)}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg shadow transition
                          ${blog.status === 'published'
                            ? 'bg-yellow-400 text-white hover:bg-yellow-500'
                            : 'bg-green-500 text-white hover:bg-green-600'
                          }`}
                      >
                        {blog.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => router.push(`/blogs/edit/${blog._id}`)}
                        className="px-3 py-1 text-xs font-semibold bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(blog._id)}
                        className="px-3 py-1 text-xs font-semibold bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="card max-w-md mx-auto">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {isAdmin ? 'No blogs yet' : 'No published blogs yet'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {isAdmin
                    ? 'Create your first blog post to manage and publish it.'
                    : 'Check back soon for tips and insights.'
                  }
                </p>
                {isAdmin && (
                  <button
                    onClick={() => router.push('/blogs/create')}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Create First Blog
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
