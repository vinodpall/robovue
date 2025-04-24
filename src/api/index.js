import axios from 'axios'

// 从环境变量或配置文件中获取API地址
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000
})

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
      }
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