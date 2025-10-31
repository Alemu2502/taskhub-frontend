import axios from 'axios';

// Create axios instance
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth header token injection
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---- AUTH API ----
export const authAPI = {
  register: (data) => instance.post('/api/auth/register', data),
  login: async (data) => {
    const res = await instance.post('/api/auth/login', data);
    if (res.data.success && res.data.data.token) {
      localStorage.setItem('token', res.data.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
      instance.defaults.headers.common['Authorization'] = `Bearer ${res.data.data.token}`;
    }
    return res;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete instance.defaults.headers.common['Authorization'];
  },
  getMe: () => instance.get('/api/auth/me'),
};


export const jobsAPI = {
  // Flexible: accepts params for filtering: { limit, sort, search, category } etc
  getAllJobs: (params) => instance.get('/api/jobs', { params }),
  getJobs: (params) => instance.get('/api/jobs', { params }), // Alias, use either
  getJobById: (id) => instance.get(`/api/jobs/${id}`),
  submitJob: (jobId, data) => instance.post(`/api/jobs/${jobId}/submit`, data),

  // The key method for file upload proof
  applyJob: (jobId, formData) =>
    instance.post(`/api/jobs/${jobId}/apply`, formData, {
      headers: {
        // Do NOT set 'Content-Type' here for FormData, let axios/browser handle it
        'Content-Type': 'multipart/form-data',
      },
    }),
};

// Regular user API for blogs (public endpoints)
export const blogsAPI = {
  getAll: (params) => instance.get('/api/blogs', { params }),
  getById: (id) => instance.get(`/api/blogs/${id}`),
  getBlogs: (params) => instance.get('/api/blogs', { params }),
  getBlog: (slug) => instance.get(`/api/blogs/${slug}`),

};

export const userAPI = {
  getProfile: () => instance.get('/api/user/profile'),
  updateProfile: (data) => instance.put('/api/user/profile', data),
  getSubmissions: () => instance.get('/api/user/submissions'),
  getWithdrawals: () => instance.get('/api/user/withdrawals'),
  requestWithdrawal: (data) => instance.post('/api/user/withdraw', data),
  getStats: () => instance.get('/api/user/stats'), // <-- PROPER ENDPOINT FOR USER DASH
};


// ---- ADMIN API ----
export const adminAPI = {

// Blog management
  getAllBlogs: (params) => instance.get('/api/admin/blogs', { params }),
  getBlogBySlug: (slug) => instance.get(`/api/admin/blogs/${slug}`),
  updateBlog: (id, data) => instance.put(`/api/admin/blogs/${id}`, data),
  deleteBlog: (id) => instance.delete(`/api/admin/blogs/${id}`),
 createBlog: (data) => instance.post('/api/admin/blogs', data),

  getStats: () => instance.get('/api/admin/stats'),

  getAllUsers: () => instance.get('/api/admin/users'),
  banUser: (userId, data) => instance.put(`/api/admin/users/${userId}/ban`, data),
  deleteUser: (userId) => instance.delete(`/api/admin/users/${userId}`),
  changeUserRole: (userId, data) => instance.put(`/api/admin/users/${userId}/role`, data),

  getAllSubmissions: () => instance.get('/api/admin/applications'),
  updateSubmission: (submissionId, data) => instance.put(`/api/admin/applications/${submissionId}`, data),

  getAllWithdrawals: () => instance.get('/api/admin/withdrawals'),
  updateWithdrawal: (withdrawalId, data) => instance.put(`/api/admin/withdrawals/${withdrawalId}`, data),

  getAllJobs: () => instance.get('/api/admin/jobs'),
  getJobById: (id) => instance.get(`/api/admin/jobs/${id}`), // For admin editing
  createJob: (data) => instance.post('/api/admin/jobs', data),
  updateJob: (jobId, data) => instance.put(`/api/admin/jobs/${jobId}`, data),
  deleteJob: (jobId) => instance.delete(`/api/admin/jobs/${jobId}`),


};


export async function getMyNotifications(userId) {
  return fetch(`/api/notifications?userId=${userId}`).then(r => r.json());
}

export async function markNotificationRead(id, userId) {
  return fetch(`/api/notifications/${id}/read`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ userId }),
  });
}

export async function sendNotification({ userIds, message, link }) {
  return fetch("/api/notifications", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ userIds, message, link }),
  });
}


export async function getAllUsers() {
  return fetch('/api/user').then(res => res.json());
}


export default instance;
