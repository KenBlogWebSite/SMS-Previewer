/**
 * XML解析工具类
 * 用于解析SMS Backup & Restore导出的XML文件
 */

/**
 * 解析XML文件内容
 * @param {File} file - 上传的XML文件
 * @returns {Promise<Array>} - 解析后的短信数据数组
 */
export async function parseXMLFile(file) {
  try {
    const text = await file.text()
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(text, 'text/xml')
    
    // 获取根元素的统计信息
    const smsesElement = xmlDoc.documentElement
    const totalCount = smsesElement.getAttribute('count')
    const backupDate = new Date(parseInt(smsesElement.getAttribute('backup_date')))
    
    // 解析所有短信记录
    const smsElements = xmlDoc.getElementsByTagName('sms')
    const messages = Array.from(smsElements).map(sms => ({
      protocol: sms.getAttribute('protocol'),
      address: sms.getAttribute('address'),
      date: new Date(parseInt(sms.getAttribute('date'))),
      type: parseInt(sms.getAttribute('type')),
      body: sms.getAttribute('body'),
      read: sms.getAttribute('read') === '1',
      status: parseInt(sms.getAttribute('status')),
      locked: sms.getAttribute('locked') === '1',
      contactName: sms.getAttribute('contact_name'),
      serviceCenter: sms.getAttribute('service_center')
    }))

    return {
      messages,
      metadata: {
        totalCount: parseInt(totalCount),
        backupDate
      }
    }
  } catch (error) {
    console.error('解析XML文件失败:', error)
    throw new Error('无法解析XML文件，请确保文件格式正确')
  }
}

/**
 * 格式化短信类型
 * @param {number} type - 短信类型代码
 * @returns {string} - 格式化后的类型描述
 */
export function formatMessageType(type) {
  switch (type) {
    case 1:
      return '接收'
    case 2:
      return '发送'
    case 3:
      return '草稿'
    default:
      return '未知'
  }
}

/**
 * 格式化日期时间
 * @param {Date} date - 日期对象
 * @returns {string} - 格式化后的日期时间字符串
 */
export function formatDateTime(date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date)
}