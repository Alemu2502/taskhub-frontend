'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { blogsAPI, adminAPI } from '../../../lib/api';
import toast from 'react-hot-toast';

export default function BlogDetails() {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    checkUserAndFetchBlog();
  }, [params.slug]);

  const checkUserAndFetchBlog = async () => {
    try {
      // Get user info
      const userToken = localStorage.getItem('token');
      if (userToken) {
        try {
          const userResponse = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${userToken}` }
          });
          const userData = await userResponse.json();
          setUser(userData.data);
        } catch (err) {
          console.log('User not authenticated');
        }
      }
      
      await fetchBlog();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchBlog = async () => {
    setLoading(true);
    try {
      let response;
      
      // Admin can see all blogs (published + drafts), users only published
      if (user?.role === 'admin') {
        // Try admin endpoint first for full access
        try {
          response = await adminAPI.getBlogBySlug(params.slug);
        } catch {
          // Fallback to public endpoint
          response = await blogsAPI.getBlog(params.slug);
        }
      } else {
        response = await blogsAPI.getBlog(params.slug);
      }
      
      setBlog(response.data.data);
    } catch (error) {
      toast.error('Blog not found');
      router.push('/blogs');
    } finally {
      setLoading(false);
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

  if (!blog) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="card text-center max-w-md mx-auto">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">Blog not found</p>
            <button 
              onClick={() => router.push('/blogs')} 
              className="btn-primary"
            >
              Back to Blogs
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Admin Controls */}
          {user?.role === 'admin' && (
            <div className="mb-6 flex gap-2">
              <button
                onClick={() => router.push(`/dashboard/blogs/edit/${blog._id}`)}
                className="btn-secondary text-sm"
              >
                Edit Blog
              </button>
              <span className={`px-2 py-1 text-xs rounded ${
                blog.isPublished 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {blog.isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
          )}

          <article className="card">
            {blog.coverImage && (
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}
            
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {blog.title}
            </h1>
            
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-6 border-b pb-4">
              By {blog.author?.username || 'Admin'} • {new Date(blog.createdAt).toLocaleDateString()}
              {blog.readTime && <span> • {blog.readTime} min read</span>}
            </div>
            
            <div 
              className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </article>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <button 
              onClick={() => router.push('/blogs')} 
              className="btn-secondary"
            >
              ← Back to All Blogs
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}


