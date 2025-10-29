'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import toast from 'react-hot-toast';
import { FiMail, FiUser } from 'react-icons/fi';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ''}/api/contact`,
      {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );
    const data = await res.json();
    if (data.success) {
      toast.success('Your message has been sent!');
      setFormData({ name: '', email: '', message: '' });
    } else {
      toast.error(data.message || 'Failed to send message.');
    }
  } catch {
    toast.error('Failed to send message.');
  }
  setLoading(false);
};


  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Contact Us
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              We'd love to hear from you! Fill out the form and we'll respond soon.
            </p>
          </div>

          <div className="card shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="label">
                  <FiUser className="inline mr-2" />
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div>
                <label className="label">
                  <FiMail className="inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="label">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="input-field"
                  rows="5"
                  placeholder="Type your message..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
