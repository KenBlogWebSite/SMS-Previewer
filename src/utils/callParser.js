/**
 * 通话记录XML解析工具类
 * 用于解析SMS Backup & Restore导出的通话记录XML文件
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
 * 验证通话记录XML文件
 * @param {File} file - 上传的文件
 * @returns {boolean} - 是否为有效的通话记录备份文件
 */
export function validateCallFile(file) {
  // 检查文件扩展名
  if (!file.name.toLowerCase().endsWith('.xml')) {
    const error = new Error(`文件 ${file.name} 不是有效的XML文件，请上传.xml格式文件`);
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
  if (!file.name.toLowerCase().includes('call')) {
    window.dispatchEvent(new CustomEvent('show-info', { 
      detail: { message: `警告: 文件 ${file.name} 可能不是标准的通话记录备份文件` }
    }));
  }
  
  return true;
}

/**
 * 解析XML文件内容
 * @param {File} file - 上传的XML文件
 * @returns {Promise<Object>} - 解析后的通话记录数据和元数据
 */
export async function parseCallXMLFile(file) {
  try {
    // 先验证文件
    validateCallFile(file);
    
    // 使用 Worker 进行异步解析以提高性能
    if (window.Worker) {
      return new Promise((resolve, reject) => {
        // 读取文件内容
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const text = e.target.result;
            
            // 检查文件内容是否为空
            if (!text || text.trim() === '') {
              const error = new Error(`文件 ${file.name} 内容为空`);
              showErrorToast(error.message);
              reject(error);
              return;
            }
            
            // 使用内置解析器直接解析
            const result = await parseCallXMLContent(text, file);
            resolve(result);
          } catch (error) {
            showErrorToast(`解析失败: ${error.message}`);
            reject(error);
          }
        };
        reader.onerror = () => {
          const error = new Error(`读取文件 ${file.name} 失败`);
          showErrorToast(error.message);
          reject(error);
        };
        reader.readAsText(file);
      });
    } else {
      // 不支持 Worker 的回退方案
      // 读取文件内容
      const text = await file.text();
      
      // 检查文件内容是否为空
      if (!text || text.trim() === '') {
        const error = new Error(`文件 ${file.name} 内容为空`);
        showErrorToast(error.message);
        throw error;
      }
      
      return parseCallXMLContent(text, file);
    }
  } catch (error) {
    console.error('解析XML文件失败:', error);
    showErrorToast(`无法解析通话记录文件: ${error.message}`);
    throw error;
  }
}

/**
 * 解析通话记录XML内容
 * @param {string} text - XML文本内容
 * @param {File} file - 原始文件对象
 * @returns {Object} - 解析结果
 */
export async function parseCallXMLContent(text, file) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(text, 'text/xml');
  
  // 检查解析错误
  const parseError = xmlDoc.getElementsByTagName('parsererror');
  if (parseError.length > 0) {
    const error = new Error(`文件 ${file.name} 不是有效的XML格式`);
    showErrorToast(error.message);
    throw error;
  }
  
  // 检查是否为通话记录备份文件
  const rootElement = xmlDoc.documentElement;
  if (!rootElement || rootElement.tagName !== 'calls') {
    const error = new Error(`文件 ${file.name} 不是有效的通话记录备份文件`);
    showErrorToast(error.message);
    throw error;
  }
  
  // 获取根元素的统计信息
  const callsElement = xmlDoc.documentElement;
  const totalCount = callsElement.getAttribute('count');
  const backupDate = new Date(parseInt(callsElement.getAttribute('backup_date')));
  
  // 解析所有通话记录
  const callElements = xmlDoc.getElementsByTagName('call');
  
  // 检查是否有通话记录
  if (callElements.length === 0) {
    const error = new Error(`文件 ${file.name} 中未找到通话记录`);
    showErrorToast(error.message);
    throw error;
  }
  
  // 使用更高效的方法解析大量元素
  const calls = [];
  const length = callElements.length;
  
  // 批量处理以提高性能
  const BATCH_SIZE = 500;
  for (let i = 0; i < length; i += BATCH_SIZE) {
    const endIdx = Math.min(i + BATCH_SIZE, length);
    for (let j = i; j < endIdx; j++) {
      const call = callElements[j];
      calls.push({
        number: call.getAttribute('number'),
        duration: parseInt(call.getAttribute('duration') || '0'),
        date: new Date(parseInt(call.getAttribute('date'))),
        type: parseInt(call.getAttribute('type')),
        presentation: parseInt(call.getAttribute('presentation') || '0'),
        subscriptionId: call.getAttribute('subscription_id'),
        postDialDigits: call.getAttribute('post_dial_digits'),
        subscriptionComponentName: call.getAttribute('subscription_component_name'),
        readableDate: call.getAttribute('readable_date'),
        contactName: call.getAttribute('contact_name') || call.getAttribute('number')
      });
    }
    
    // 允许浏览器渲染线程执行其他任务
    if (i + BATCH_SIZE < length) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  return {
    calls,
    metadata: {
      totalCount: parseInt(totalCount),
      backupDate,
      fileName: file.name,
      fileSize: file.size
    }
  };
}

/**
 * 格式化通话类型
 * @param {number} type - 通话类型代码
 * @returns {string} - 格式化后的类型描述
 */
export function formatCallType(type) {
  switch (type) {
    case 1:
      return '来电未接';
    case 2:
      return '去电';
    case 3:
      return '来电已接';
    case 4:
      return '语音信箱';
    case 5:
      return '拒接';
    case 6:
      return '清单信息';
    default:
      return '未知';
  }
}

/**
 * 格式化通话时长
 * @param {number} duration - 通话时长（秒）
 * @returns {string} - 格式化后的时长字符串
 */
export function formatDuration(duration) {
  if (!duration || duration === 0) return '未接通';
  
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;
  
  const parts = [];
  if (hours > 0) parts.push(`${hours}小时`);
  if (minutes > 0) parts.push(`${minutes}分钟`);
  if (seconds > 0) parts.push(`${seconds}秒`);
  
  return parts.length > 0 ? parts.join('') : '0秒';
}

/**
 * 分析通话记录统计数据
 * @param {Array} calls - 通话记录数组
 * @returns {Object} - 统计结果
 */
export function analyzeCallStats(calls) {
  if (!calls || !Array.isArray(calls) || calls.length === 0) {
    return {
      totalCount: 0,
      totalDuration: 0,
      incomingCount: 0,
      outgoingCount: 0,
      missedCount: 0,
      contacts: [],
      averageDuration: 0,
      frequentContacts: [],
      longestContacts: []
    };
  }

  // 初始化统计对象
  const stats = {
    totalCount: calls.length,
    totalDuration: 0,
    incomingCount: 0,
    outgoingCount: 0,
    missedCount: 0,
    contacts: {},
    dateRange: {
      start: new Date(8640000000000000), // 最大日期
      end: new Date(-8640000000000000)   // 最小日期
    }
  };

  // 遍历通话记录进行统计
  calls.forEach(call => {
    // 累计总通话时长
    stats.totalDuration += call.duration || 0;
    
    // 统计通话类型
    switch (call.type) {
      case 1: // 未接来电
        stats.missedCount++;
        break;
      case 2: // 去电
        stats.outgoingCount++;
        break;
      case 3: // 已接来电
        stats.incomingCount++;
        break;
    }

    // 统计联系人
    const contactName = call.contactName || call.number;
    if (!stats.contacts[contactName]) {
      stats.contacts[contactName] = {
        name: contactName,
        totalCount: 0,
        totalDuration: 0,
        incomingCount: 0,
        outgoingCount: 0,
        missedCount: 0,
        lastDate: null
      };
    }

    const contact = stats.contacts[contactName];
    contact.totalCount++;
    contact.totalDuration += call.duration || 0;
    
    switch (call.type) {
      case 1: // 未接来电
        contact.missedCount++;
        break;
      case 2: // 去电
        contact.outgoingCount++;
        break;
      case 3: // 已接来电
        contact.incomingCount++;
        break;
    }

    // 更新日期范围
    if (call.date) {
      if (call.date < stats.dateRange.start) {
        stats.dateRange.start = call.date;
      }
      if (call.date > stats.dateRange.end) {
        stats.dateRange.end = call.date;
      }
      
      // 更新联系人最后通话日期
      if (!contact.lastDate || call.date > contact.lastDate) {
        contact.lastDate = call.date;
      }
    }
  });

  // 计算平均通话时长
  stats.averageDuration = stats.totalDuration / (stats.totalCount - stats.missedCount || 1);

  // 转换联系人对象为数组
  const contactsArray = Object.values(stats.contacts);
  
  // 按通话次数排序的联系人
  stats.frequentContacts = contactsArray
    .sort((a, b) => b.totalCount - a.totalCount)
    .slice(0, 10);

  // 按通话时长排序的联系人
  stats.longestContacts = contactsArray
    .sort((a, b) => b.totalDuration - a.totalDuration)
    .slice(0, 10);

  // 计算总天数
  const daysDiff = Math.ceil(
    (stats.dateRange.end - stats.dateRange.start) / (1000 * 60 * 60 * 24)
  );
  stats.daysSpan = daysDiff > 0 ? daysDiff : 1;
  
  // 计算每日平均通话次数
  stats.averagePerDay = stats.totalCount / stats.daysSpan;

  return stats;
}