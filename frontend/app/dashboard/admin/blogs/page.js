'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminAPI } from '../../../lib/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getAllBlogs();
      setBlogs(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id, type) => {
    try {
      if (type === 'publish') {
        await adminAPI.publishBlog(id);
        toast.success("Blog published!");
      }
      if (type === 'unpublish') {
        await adminAPI.unpublishBlog(id);
        toast.success("Blog unpublished!");
      }
      if (type === 'delete') {
        await adminAPI.deleteBlog(id);
        toast.success("Blog deleted!");
      }
      fetchBlogs();
    } catch {
      toast.error('Action failed!');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Blogs</h1>
        <Link 
          href="/dashboard/admin/blogs/create"
          className="btn-primary"
        >
          + Add Blog
        </Link>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        blogs.length === 0 ? (
          <div className="text-center text-lg text-gray-400 py-12">No blogs found</div>
        ) : (
          <table className="min-w-full bg-white dark:bg-gray-800 shadow rounded mb-4">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-sm text-gray-600 dark:text-gray-300">Title</th>
                <th className="px-4 py-2 text-left text-sm text-gray-600 dark:text-gray-300">Category</th>
                <th className="px-4 py-2 text-left text-sm text-gray-600 dark:text-gray-300">Status</th>
                <th className="px-4 py-2 text-left text-sm text-gray-600 dark:text-gray-300">Date</th>
                <th className="px-4 py-2 text-left text-sm text-gray-600 dark:text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map(blog => (
                <tr key={blog._id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-2 font-semibold">{blog.title}</td>
                  <td className="px-4 py-2">{blog.category}</td>
                  <td className="px-4 py-2 capitalize">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${blog.status === 'published' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <Link href={`/dashboard/admin/blogs/edit/${blog._id}`} className="btn-secondary text-xs">Edit</Link>
                    {blog.status === 'draft' ? (
                      <button onClick={() => handleStatus(blog._id, 'publish')} className="btn-success text-xs">Publish</button>
                    ) : (
                      <button onClick={() => handleStatus(blog._id, 'unpublish')} className="btn-warning text-xs">Unpublish</button>
                    )}
                    <button onClick={() => handleStatus(blog._id, 'delete')} className="btn-danger text-xs">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
}
