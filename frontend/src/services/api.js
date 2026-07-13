import axios from 'axios';
import toast from 'react-hot-toast';

// Base axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }
    return Promise.reject(error);
  }
);

export default api;

// ============== Auth Services ==============
export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

// ============== Dashboard Services ==============
export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
};

// ============== Resume Services ==============
export const resumeService = {
  upload: (formData) => api.post('/resumes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getMyResumes: () => api.get('/resumes/my'),
  getById: (id) => api.get(`/resumes/${id}`),
};

// ============== Interview Services ==============
export const interviewService = {
  generateQuestions: (category, difficulty, count = 10) =>
    api.get(`/interview/questions?category=${category}&difficulty=${difficulty}&count=${count}`),
};

// ============== Chat Services ==============
export const chatService = {
  sendMessage: (data) => api.post('/chat/message', data),
  getHistory: (sessionId) => api.get(`/chat/history/${sessionId}`),
};

// ============== Test Services ==============
export const testService = {
  getQuestions: (category, difficulty, count = 10) =>
    api.get(`/tests/questions?category=${category}&difficulty=${difficulty}&count=${count}`),
  submitTest: (data) => api.post('/tests/submit', data),
  getMyResults: () => api.get('/tests/my-results'),
};

// ============== Admin Services ==============
export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getQuestions: () => api.get('/admin/questions'),
  addQuestion: (data) => api.post('/admin/questions', data),
  updateQuestion: (id, data) => api.put(`/admin/questions/${id}`, data),
  deleteQuestion: (id) => api.delete(`/admin/questions/${id}`),
  getResumes: () => api.get('/admin/resumes'),
  getResults: () => api.get('/admin/results'),
};
