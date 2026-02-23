// frontend/src/utils/api.js
// Production-grade API client with token refresh and request queuing

import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://savlinks-test-g445.onrender.com'

// ─── Axios Instance ──────────────────────────────────────────────────
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false
})

// ─── Token Refresh Queue ─────────────────────────────────────────────
// Prevents multiple simultaneous token refreshes
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })
  failedQueue = []
}

async function attemptTokenRefresh() {
  try {
    // Dynamically import to avoid circular dependencies
    const { AuthService } = await import('../auth/services/auth.service')
    const newToken = await AuthService.getIdToken(true)
    
    if (newToken) {
      localStorage.setItem('savlink_token', newToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      return newToken
    }
    return null
  } catch (error) {
    console.error('[API] Token refresh failed:', error)
    return null
  }
}

// ─── Request Interceptor ─────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Attach token
    const token = localStorage.getItem('savlink_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add request ID for tracking
    config._requestId = Math.random().toString(36).substring(2, 9)
    config._startTime = Date.now()

    // Add cache-busting for GET requests
    if (config.method === 'get') {
      config.params = { ...config.params, _t: Date.now() }
    }

    if (import.meta.env.DEV) {
      console.log(`🔄 [${config._requestId}] ${config.method?.toUpperCase()} ${config.url}`)
    }

    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response Interceptor ────────────────────────────────────────────
api.interceptors.response.use(
  (response) => {
    const duration = Date.now() - (response.config._startTime || Date.now())
    
    if (import.meta.env.DEV) {
      const status = duration > 3000 ? '🐌' : '✅'
      console.log(`${status} [${response.config._requestId}] ${response.config.url} (${duration}ms)`)
    }

    // Normalize response
    return {
      success: true,
      data: response.data,
      status: response.status
    }
  },
  async (error) => {
    const originalRequest = error.config

    // ── Handle 401: Token refresh + retry ──
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        }).catch(err => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const newToken = await attemptTokenRefresh()
        
        if (newToken) {
          processQueue(null, newToken)
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest)
        } else {
          processQueue(new Error('Token refresh failed'), null)
          handleAuthFailure()
          return createErrorResponse('Session expired. Please sign in again.', 401)
        }
      } catch (refreshError) {
        processQueue(refreshError, null)
        handleAuthFailure()
        return createErrorResponse('Session expired. Please sign in again.', 401)
      } finally {
        isRefreshing = false
      }
    }

    // ── Handle other errors ──
    return handleApiError(error)
  }
)

// ─── Error Handling ──────────────────────────────────────────────────
function handleApiError(error) {
  let message = 'An unexpected error occurred'
  let status = 0

  if (error.response) {
    status = error.response.status
    message = error.response.data?.error || error.response.data?.message || `Error ${status}`

    const errorMap = {
      400: message,
      403: 'You do not have permission for this action',
      404: 'Resource not found',
      409: 'Conflict: Resource already exists',
      422: message || 'Invalid data provided',
      429: 'Too many requests. Please slow down.',
      500: 'Server error. Please try again later.',
      502: 'Server is temporarily unavailable.',
      503: 'Service is under maintenance.',
      504: 'Request timed out. Please try again.'
    }

    message = errorMap[status] || message

    // Show toast for user-relevant errors (not 401, 404)
    if (![401, 404].includes(status)) {
      toast.error(message)
    }
  } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    message = 'Request timed out. Please try again.'
    toast.error(message)
  } else if (error.request) {
    message = 'Network error. Please check your connection.'
    toast.error(message)
  }

  return {
    success: false,
    error: message,
    status,
    data: null
  }
}

function handleAuthFailure() {
  localStorage.removeItem('savlink_token')
  localStorage.removeItem('savlink_user')
  delete api.defaults.headers.common['Authorization']
  
  // Notify app of auth failure
  window.dispatchEvent(new CustomEvent('auth:session-expired', { 
    detail: { reason: 'api_401' } 
  }))
}

function createErrorResponse(message, status) {
  return { success: false, error: message, status, data: null }
}

// ─── API Service ─────────────────────────────────────────────────────
const apiService = {
  get:    (url, params = {})   => api.get(url, { params }),
  post:   (url, data = {})     => api.post(url, data),
  put:    (url, data = {})     => api.put(url, data),
  patch:  (url, data = {})     => api.patch(url, data),
  delete: (url, data)          => api.delete(url, data ? { data } : undefined),

  upload: (url, formData, onProgress) => {
    return api.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000, // 2 min for uploads
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total))
        }
      }
    })
  },

  // Token management (used by AuthContext)
  setAuthToken(token) {
    if (token) {
      localStorage.setItem('savlink_token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  },

  removeAuthToken() {
    localStorage.removeItem('savlink_token')
    delete api.defaults.headers.common['Authorization']
  },

  getAuthToken() {
    return localStorage.getItem('savlink_token')
  },

  isAuthenticated() {
    return !!localStorage.getItem('savlink_token')
  },

  getBaseUrl() {
    return API_BASE_URL
  }
}

export default apiService
export { api }