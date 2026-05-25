import axios from 'axios'

const BASE_URL = 'http://localhost:8080/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth Service
export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
}

// User Service
export const userService = {
  getAllUsers: () => api.get('/users'),
  getAllEmployees: () => api.get('/users/employees'),
  getUserById: (id) => api.get(`/users/${id}`),
}

// Task Service
export const taskService = {
  createTask: (data) => api.post('/tasks', data),
  getAllTasks: () => api.get('/tasks'),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  getTasksByEmployee: (userId) => api.get(`/tasks/employee/${userId}`),
  updateTaskStatus: (id, status) => api.put(`/tasks/${id}/status`, { status }),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  getTaskStats: () => api.get('/tasks/stats'),
}

export default api
