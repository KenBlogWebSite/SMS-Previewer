// 服务器API接口管理

// 服务器基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

// SMS相关接口
export const smsApi = {
  // 获取短信列表
  getMessages: async (params) => {
    const response = await fetch(`${API_BASE_URL}/api/sms/messages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return await response.json()
  },

  // 获取联系人列表
  getContacts: async () => {
    const response = await fetch(`${API_BASE_URL}/api/sms/contacts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return await response.json()
  },

  // 导出短信记录
  exportMessages: async (params) => {
    const response = await fetch(`${API_BASE_URL}/api/sms/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
    return await response.blob()
  }
}

// 通话记录相关接口
export const callsApi = {
  // 获取通话记录列表
  getCalls: async (params) => {
    const response = await fetch(`${API_BASE_URL}/api/calls/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return await response.json()
  },

  // 获取联系人列表
  getContacts: async () => {
    const response = await fetch(`${API_BASE_URL}/api/calls/contacts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return await response.json()
  },

  // 导出通话记录
  exportCalls: async (params) => {
    const response = await fetch(`${API_BASE_URL}/api/calls/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
    return await response.blob()
  }
}