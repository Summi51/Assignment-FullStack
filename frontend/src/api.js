import axios from 'axios'

// In production (Vercel) the frontend and backend are served from the same
// domain via a rewrite, so requests to "/api/..." work without a base URL.
// For local development, fall back to the backend dev server.
const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001' : '')

const api = axios.create({ baseURL: BASE_URL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
