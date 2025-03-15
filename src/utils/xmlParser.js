/**
 * XML解析工具类
 * 用于解析SMS Backup & Restore导出的XML文件
 */

/**
 * 显示错误提示
 * @param {string} message - 错误信息
 */
function showErrorToast(message) {
  window.dispatchEvent(new CustomEvent('show-error', { 
    detail: { message }
  }));
}

/**
 * 验证XML文件格式
 * @param {File} file - 上传的文件
 * @returns {boolean} - 是否为有效的SMS备份文件
 */
export function validateSMSFile(file) {
  // 检查文件扩展名
  if (!file.name.toLowerCase().endsWith('.xml')) {
    const error = new Error(`文件 ${file.name} 不是XML文件，请上传正确的备份文件`);
    showErrorToast(error.message);
    throw error;
  }
  
  // 检查文件大小
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
  if (file.size > MAX_FILE_SIZE) {
    const error = new Error(`文件 ${file.name} 过大，请上传小于100MB的文件`);
    showErrorToast(error.message);
    throw error;
  }
  
  // 检查文件名格式（可选）
  if (!file.name.toLowerCase().includes('sms')) {
    window.dispatchEvent(new CustomEvent('show-info', { 
      detail: { message: `警告: 文件 ${file.name} 可能不是标准的SMS备份文件` }
    }));
  }
  
  return true;
}

/**
 * 解析XML文件内容
 * @param {File} file - 上传的XML文件
 * @returns {Promise<Object>} - 解析后的短信数据和元数据
 */
export async function parseXMLFile(file) {
  try {
    // 先验证文件
    validateSMSFile(file);
    
    // 读取文件内容
    const text = await file.text();
    
    // 检查文件内容是否为空
    if (!text || text.trim() === '') {
      const error = new Error(`文件 ${file.name} 内容为空`);
      showErrorToast(error.message);
      throw error;
    }
    
    return parseXMLContent(text, file);
  } catch (error) {
    console.error('解析XML文件失败:', error);
    showErrorToast(`无法解析XML文件: ${error.message}`);
    throw error;
  }
}

/**
 * 解析XML内容
 * @param {string} text - XML文本内容
 * @param {File} file - 原始文件对象
 * @returns {Object} - 解析结果
 */
export function parseXMLContent(text, file) {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    
    // 检查解析错误
    const parseError = xmlDoc.getElementsByTagName('parsererror');
    if (parseError.length > 0) {
      const error = new Error(`文件 ${file ? file.name : '未知文件'} 不是有效的XML格式`);
      showErrorToast(error.message);
      throw error;
    }
    
    // 检查是否为SMS备份文件
    const rootElement = xmlDoc.documentElement;
    if (!rootElement || rootElement.tagName !== 'smses') {
      const error = new Error(`文件 ${file ? file.name : '未知文件'} 不是有效的短信备份文件`);
      showErrorToast(error.message);
      throw error;
    }
    
    // 获取根元素的统计信息
    const smsesElement = xmlDoc.documentElement;
    const totalCount = smsesElement.getAttribute('count');
    const backupDate = new Date(parseInt(smsesElement.getAttribute('backup_date') || '0'));
    
    // 解析所有短信记录
    const smsElements = xmlDoc.getElementsByTagName('sms');
    
    // 检查是否有短信记录
    if (smsElements.length === 0) {
      const error = new Error(`文件 ${file ? file.name : '未知文件'} 中未找到短信记录`);
      showErrorToast(error.message);
      throw error;
    }
    
    // 使用更高效的方法解析大量元素
    const messages = [];
    const length = smsElements.length;
    
    // 批量处理以提高性能
    for (let i = 0; i < length; i++) {
      const sms = smsElements[i];
      if (!sms) continue;
      
      try {
        const dateStr = sms.getAttribute('date');
        const date = dateStr ? new Date(parseInt(dateStr)) : new Date();
        
        messages.push({
          address: sms.getAttribute('address') || '',
          date: date,
          type: parseInt(sms.getAttribute('type') || '1'),
          subject: sms.getAttribute('subject') || '',
          body: sms.getAttribute('body') || '',
          toa: sms.getAttribute('toa') || '',
          sc_toa: sms.getAttribute('sc_toa') || '',
          service_center: sms.getAttribute('service_center') || '',
          read: parseInt(sms.getAttribute('read') || '0'),
          status: parseInt(sms.getAttribute('status') || '0'),
          readable_date: sms.getAttribute('readable_date') || '',
          contactName: sms.getAttribute('contact_name') || '(Unknown)'
        });
      } catch (err) {
        console.error('解析短信元素时出错:', err);
        // 继续处理下一条短信
      }
    }

    return {
      messages,
      metadata: {
        totalCount: parseInt(totalCount || '0'),
        backupDate,
        fileName: file ? file.name : '未知文件',
        fileSize: file ? file.size : 0
      }
    };
  } catch (error) {
    console.error('解析XML内容失败:', error);
    showErrorToast(`解析XML内容失败: ${error.message}`);
    throw error;
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
      return '接收';
    case 2:
      return '发送';
    case 3:
      return '草稿';
    case 4:
      return '发件箱';
    case 5:
      return '失败';
    case 6:
      return '排队';
    default:
      return '未知';
  }
}

/**
 * 格式化日期时间
 * @param {Date} date - 日期对象
 * @param {boolean} includeTime - 是否包含时间
 * @returns {string} - 格式化后的日期时间字符串
 */
export function formatDateTime(date, includeTime = true) {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '未知时间';
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  if (!includeTime) {
    return `${year}-${month}-${day}`;
  }
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * 批量处理多个XML文件
 * @param {File[]} files - 文件数组
 * @param {Function} progressCallback - 进度回调函数
 * @returns {Promise<Object>} - 合并后的解析结果
 */
export async function batchProcessXMLFiles(files, progressCallback) {
  if (!files || files.length === 0) {
    throw new Error('没有选择文件');
  }
  
  const results = [];
  let totalMessages = 0;
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    try {
      // 更新进度
      if (progressCallback) {
        progressCallback({
          current: i + 1,
          total: files.length,
          fileName: file.name,
          percentage: Math.round(((i + 1) / files.length) * 100)
        });
      }
      
      // 解析当前文件
      const result = await parseXMLFile(file);
      results.push(result);
      totalMessages += result.messages.length;
    } catch (error) {
      console.error(`处理文件 ${file.name} 时出错:`, error);
      // 继续处理下一个文件
    }
  }
  
  // 合并所有结果
  const allMessages = results.flatMap(result => result.messages);
  
  return {
    messages: allMessages,
    metadata: {
      totalCount: totalMessages,
      fileCount: results.length,
      backupDate: new Date()
    }
  };
}

/**
 * 分析短信统计数据
 * @param {Array} messages - 短信消息数组
 * @returns {Object} - 统计结果
 */
export function analyzeMessageStats(messages) {
  if (!messages || messages.length === 0) {
    return {
      totalCount: 0,
      sentCount: 0,
      receivedCount: 0,
      contactCount: 0,
      earliestDate: null,
      latestDate: null,
      averageLength: 0,
      byMonth: [],
      byContact: [],
      byType: []
    };
  }
  
  // 基本统计
  let sentCount = 0;
  let receivedCount = 0;
  let totalLength = 0;
  let earliestDate = new Date();
  let latestDate = new Date(0);
  
  // 按联系人和月份分组
  const contactMap = new Map();
  const monthMap = new Map();
  const typeMap = new Map();
  
  messages.forEach(message => {
    // 计算发送和接收数量
    if (message.type === 2) {
      sentCount++;
    } else if (message.type === 1) {
      receivedCount++;
    }
    
    // 计算消息长度
    const bodyLength = message.body ? message.body.length : 0;
    totalLength += bodyLength;
    
    // 更新日期范围
    if (message.date && message.date instanceof Date && !isNaN(message.date.getTime())) {
      if (message.date < earliestDate) {
        earliestDate = message.date;
      }
      if (message.date > latestDate) {
        latestDate = message.date;
      }
      
      // 按月份统计
      const monthKey = `${message.date.getFullYear()}-${String(message.date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, { month: monthKey, count: 0, sent: 0, received: 0 });
      }
      const monthData = monthMap.get(monthKey);
      monthData.count++;
      if (message.type === 2) {
        monthData.sent++;
      } else if (message.type === 1) {
        monthData.received++;
      }
    }
    
    // 按联系人统计
    const contactName = message.contactName || message.address || '未知';
    if (!contactMap.has(contactName)) {
      contactMap.set(contactName, { 
        name: contactName, 
        count: 0, 
        sent: 0, 
        received: 0,
        lastDate: null
      });
    }
    const contactData = contactMap.get(contactName);
    contactData.count++;
    if (message.type === 2) {
      contactData.sent++;
    } else if (message.type === 1) {
      contactData.received++;
    }
    if (message.date && (!contactData.lastDate || message.date > contactData.lastDate)) {
      contactData.lastDate = message.date;
    }
    
    // 按类型统计
    const typeKey = formatMessageType(message.type);
    if (!typeMap.has(typeKey)) {
      typeMap.set(typeKey, { type: typeKey, count: 0 });
    }
    typeMap.get(typeKey).count++;
  });
  
  // 转换为数组并排序
  const byMonth = Array.from(monthMap.values())
    .sort((a, b) => a.month.localeCompare(b.month));
    
  const byContact = Array.from(contactMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 20); // 只返回前20个联系人
    
  const byType = Array.from(typeMap.values())
    .sort((a, b) => b.count - a.count);
  
  return {
    totalCount: messages.length,
    sentCount,
    receivedCount,
    contactCount: contactMap.size,
    earliestDate: earliestDate.getTime() === new Date().getTime() ? null : earliestDate,
    latestDate: latestDate.getTime() === new Date(0).getTime() ? null : latestDate,
    averageLength: Math.round(totalLength / messages.length),
    byMonth,
    byContact,
    byType
  };
}