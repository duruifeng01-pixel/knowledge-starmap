import axios from 'axios'

// API 基础地址 - 开发环境使用 localhost，生产环境使用服务器地址
const API_BASE = import.meta.env.VITE_API_BASE || 'http://159.223.41.247:3000/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 - 添加 JWT token
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

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default api

// API 方法
export const authAPI = {
  register: (data) => api.post('/users/register', data),
  getMe: () => api.get('/users/me')
}

export const taskAPI = {
  getAll: () => api.get('/tasks'),
  getOne: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  updateStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status })
}

export const knowledgeAPI = {
  getFramework: () => api.get('/knowledge/framework')
}

export const contentAPI = {
  fetch: (url, apiKey) => api.post('/content/fetch', { url }, {
    headers: { 'X-API-Key': apiKey }
  })
}

export const discussionAPI = {
  submitAnswer: (taskId, step, answer) => api.post(`/discussions/${taskId}/answer`, { step, answer })
}
