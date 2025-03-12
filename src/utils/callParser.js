/**
 * 通话记录XML解析工具类
 * 用于解析SMS Backup & Restore导出的通话记录XML文件
 */

/**
 * 解析XML文件内容
 * @param {File} file - 上传的XML文件
 * @returns {Promise<Array>} - 解析后的通话记录数据数组
 */
export async function parseCallXMLFile(file) {
  try {
    const text = await file.text()
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(text, 'text/xml')
    
    // 获取根元素的统计信息
    const callsElement = xmlDoc.documentElement
    const totalCount = callsElement.getAttribute('count')
    const backupDate = new Date(parseInt(callsElement.getAttribute('backup_date')))
    
    // 解析所有通话记录
    const callElements = xmlDoc.getElementsByTagName('call')
    const calls = Array.from(callElements).map(call => ({
      number: call.getAttribute('number'),
      duration: parseInt(call.getAttribute('duration')),
      date: new Date(parseInt(call.getAttribute('date'))),
      type: parseInt(call.getAttribute('type')),
      presentation: parseInt(call.getAttribute('presentation')),
      subscriptionId: call.getAttribute('subscription_id'),
      postDialDigits: call.getAttribute('post_dial_digits'),
      subscriptionComponentName: call.getAttribute('subscription_component_name'),
      readableDate: call.getAttribute('readable_date'),
      contactName: call.getAttribute('contact_name')
    }))

    return {
      calls,
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
 * 格式化通话类型
 * @param {number} type - 通话类型代码
 * @returns {string} - 格式化后的类型描述
 */
export function formatCallType(type) {
  switch (type) {
    case 1:
      return '来电未接'
    case 2:
      return '去电'
    case 3:
      return '来电已接'
    case 4:
      return '语音信箱'
    case 5:
      return '拒接'
    case 6:
      return '清单信息'
    default:
      return '未知'
  }
}

/**
 * 格式化通话时长
 * @param {number} duration - 通话时长（秒）
 * @returns {string} - 格式化后的时长字符串
 */
export function formatDuration(duration) {
  if (duration === 0) return '未接通'
  
  const hours = Math.floor(duration / 3600)
  const minutes = Math.floor((duration % 3600) / 60)
  const seconds = duration % 60
  
  const parts = []
  if (hours > 0) parts.push(`${hours}小时`)
  if (minutes > 0) parts.push(`${minutes}分钟`)
  if (seconds > 0) parts.push(`${seconds}秒`)
  
  return parts.join('')
}