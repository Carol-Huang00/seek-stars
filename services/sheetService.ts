import { UserRecord } from '../types';

// ⚠️在此处填入您的飞书(Lark)自动化 Webhook URL
// 格式通常为: https://www.feishu.cn/flow/api/v1/webhook/trigger/...
const WEBHOOK_URL = 'https://milesight.feishu.cn/base/automation/webhook/event/GDY6ax2yrwIl5FhXD9QchJuXnsg'; 

// 生成或获取唯一的设备ID
const getUniqueDeviceId = (): string => {
  const STORAGE_KEY = 'star_destiny_device_uuid';
  let uuid = localStorage.getItem(STORAGE_KEY);
  
  if (!uuid) {
    // 生成一个随机ID: dev_时间戳_随机数
    uuid = `dev_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`;
    localStorage.setItem(STORAGE_KEY, uuid);
  }
  
  return uuid;
};

export const saveToBackend = async (record: UserRecord, constellationName: string) => {
  if (!WEBHOOK_URL) {
    console.log('后台存储未配置: 请在 services/sheetService.ts 中填入飞书 Webhook URL');
    return;
  }

  try {
    const uniqueId = getUniqueDeviceId();
    
    // 构造数据: 结合唯一ID和UserAgent
    // 格式如: [dev_kx3a_9z2] Mozilla/5.0...
    const fullDeviceInfo = `[${uniqueId}] ${navigator.userAgent}`;

    // 使用 URLSearchParams 构造 application/x-www-form-urlencoded 数据
    // 这比 JSON 更容易被飞书 Webhook 的"获取最近数据"功能正确解析为独立字段
    const formData = new URLSearchParams();
    formData.append('timestamp', new Date(record.timestamp).toLocaleString('zh-CN'));
    formData.append('birthDate', record.birthDate);
    formData.append('constellation', constellationName);
    formData.append('device', fullDeviceInfo);
    
    // 如果有用户名，也发送
    if (record.userName) {
      formData.append('userName', record.userName);
    }
    // 如果有工号，也发送
    if (record.employeeId) {
      formData.append('employeeId', record.employeeId);
    }

    // 使用 fetch 发送
    // mode: 'no-cors' 允许跨域发送请求（虽然无法读取响应，但数据能到达）
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors', 
      headers: {
        'Content-Type': 'text/plain', // 避免触发浏览器的 CORS 预检
      },
      body: formData,
    });

    console.log('已触发数据上传');
  } catch (error) {
    console.error('上传触发失败:', error);
  }
};