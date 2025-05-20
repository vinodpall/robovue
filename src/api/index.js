import axios from 'axios'

// 从环境变量获取API地址
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 添加请求拦截器
api.interceptors.request.use(
  config => {
    // 可以在这里添加token等认证信息
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
api.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    // 统一错误处理
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权处理
          break
        case 403:
          // 禁止访问处理
          break
        case 404:
          // 资源不存在处理
          break
        case 500:
          // 服务器错误处理
          break
      }
    }
    return Promise.reject(error)
  }
)

// 机器人相关接口
export const robotApi = {
  list: () => api.get('/robots'),
  create: (data) => api.post('/robots', data),
  update: (id, data) => api.put(`/robots/${id}`, data),
  delete: (id) => api.delete(`/robots/${id}`)
}

// 视频相关接口
export const videoApi = {
  list: () => api.get('/videos'),
  create: (data) => api.post('/videos', data),
  update: (id, data) => api.put(`/videos/${id}`, data),
  delete: (id) => api.delete(`/videos/${id}`),
  upload: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/videos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 300000
    })
  }
}

// 企业相关接口
export const companyApi = {
  list: () => api.get('/companies'),
  create: (data) => api.post('/companies', data),
  update: (id, data) => api.put(`/companies/${id}`, data),
  delete: (id) => api.delete(`/companies/${id}`),
  uploadLogo: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/companies/upload-logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

// 数据类型相关接口
export const dataTypeApi = {
  list: () => api.get('/data-types'),
  create: (data) => api.post('/data-types', data),
  update: (id, data) => api.put(`/data-types/${id}`, data),
  delete: (id) => api.delete(`/data-types/${id}`)
}

// 系统设置相关接口
export const settingsApi = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data)
}

export default api 