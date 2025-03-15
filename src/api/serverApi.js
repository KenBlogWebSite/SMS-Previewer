// 服务器API接口管理

// 服务器基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

/**
 * 通用请求处理函数
 * @param {string} url - API端点
 * @param {string} method - 请求方法 (GET, POST, PUT, DELETE)
 * @param {Object} data - 请求数据
 * @param {boolean} isBlob - 是否返回二进制数据
 * @returns {Promise<any>} 响应数据
 */
async function apiRequest(url, method = 'GET', data = null, isBlob = false) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': isBlob ? 'application/octet-stream' : 'application/json'
      },
      credentials: 'include' // 包含跨域请求的凭证
    }

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data)
    }

    const response = await fetch(`${API_BASE_URL}${url}`, options)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `请求失败: ${response.status} ${response.statusText}`)
    }

    return isBlob ? await response.blob() : await response.json()
  } catch (error) {
    console.error(`API请求错误 (${url}):`, error)
    throw error
  }
}

// SMS相关接口
export const smsApi = {
  // 获取短信列表
  getMessages: async (params = {}) => {
    const queryParams = new URLSearchParams()
    if (params.contact) queryParams.append('contact', params.contact)
    if (params.startDate) queryParams.append('startDate', params.startDate)
    if (params.endDate) queryParams.append('endDate', params.endDate)
    if (params.type) queryParams.append('type', params.type)
    if (params.keyword) queryParams.append('keyword', params.keyword)
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : ''
    return apiRequest(`/api/sms/messages${query}`)
  },

  // 获取联系人列表
  getContacts: async () => {
    return apiRequest('/api/sms/contacts')
  },

  // 上传短信记录XML文件
  uploadXmlFile: async (file) => {
    if (!file || !(file instanceof File)) {
      throw new Error('请提供有效的文件')
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${API_BASE_URL}/api/sms/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `上传失败: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('上传短信记录文件错误:', error)
      throw error
    }
  },

  // 导出短信记录
  exportMessages: async (params = {}) => {
    return apiRequest('/api/sms/export', 'POST', params, true)
  }
}

// 通话记录相关接口
export const callsApi = {
  // 获取通话记录列表
  getCalls: async (params = {}) => {
    const queryParams = new URLSearchParams()
    if (params.contact) queryParams.append('contact', params.contact)
    if (params.startDate) queryParams.append('startDate', params.startDate)
    if (params.endDate) queryParams.append('endDate', params.endDate)
    if (params.type) queryParams.append('type', params.type)
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : ''
    return apiRequest(`/api/calls/list${query}`)
  },

  // 获取联系人列表
  getContacts: async () => {
    return apiRequest('/api/calls/contacts')
  },

  // 上传通话记录XML文件
  uploadXmlFile: async (file) => {
    if (!file || !(file instanceof File)) {
      throw new Error('请提供有效的文件')
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${API_BASE_URL}/api/calls/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `上传失败: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('上传通话记录文件错误:', error)
      throw error
    }
  },

  // 导出通话记录
  exportCalls: async (params = {}) => {
    return apiRequest('/api/calls/export', 'POST', params, true)
  }
}