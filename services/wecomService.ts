// 企业微信后端服务
import axios from 'axios';

interface WeComConfig {
  corpId: string;
  corpSecret: string;
  agentId: string;
}

// 从环境变量获取配置
const WECHAT_WORK_CONFIG: WeComConfig = {
  corpId: process.env.WECOM_CORP_ID || '',
  corpSecret: process.env.WECOM_CORP_SECRET || '',
  agentId: process.env.WECOM_AGENT_ID || '',
};

// 获取企业微信访问令牌
export const getWeComAccessToken = async (): Promise<string> => {
  try {
    const response = await axios.get(
      `https://qyapi.weixin.qq.com/cgi-bin/gettoken`,
      {
        params: {
          corpid: WECHAT_WORK_CONFIG.corpId,
          corpsecret: WECHAT_WORK_CONFIG.corpSecret,
        },
      }
    );

    if (response.data.errcode === 0) {
      return response.data.access_token;
    } else {
      throw new Error(`获取access_token失败: ${response.data.errmsg}`);
    }
  } catch (error) {
    console.error('获取企业微信访问令牌失败:', error);
    throw error;
  }
};

// 根据授权码获取用户信息
export const getWeComUserId = async (code: string): Promise<string> => {
  try {
    const accessToken = await getWeComAccessToken();
    
    const response = await axios.get(
      `https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo`,
      {
        params: {
          access_token: accessToken,
          code: code,
        },
      }
    );

    if (response.data.errcode === 0) {
      return response.data.UserId;
    } else {
      throw new Error(`获取用户ID失败: ${response.data.errmsg}`);
    }
  } catch (error) {
    console.error('获取企业微信用户ID失败:', error);
    throw error;
  }
};

// 获取用户详细信息
export const getWeComUserDetail = async (userId: string): Promise<any> => {
  try {
    const accessToken = await getWeComAccessToken();
    
    const response = await axios.get(
      `https://qyapi.weixin.qq.com/cgi-bin/user/get`,
      {
        params: {
          access_token: accessToken,
          userid: userId,
        },
      }
    );

    if (response.data.errcode === 0) {
      return response.data;
    } else {
      throw new Error(`获取用户详情失败: ${response.data.errmsg}`);
    }
  } catch (error) {
    console.error('获取企业微信用户详情失败:', error);
    throw error;
  }
};

// 获取部门列表
export const getWeComDepartments = async (id?: number): Promise<any[]> => {
  try {
    const accessToken = await getWeComAccessToken();
    
    const response = await axios.get(
      `https://qyapi.weixin.qq.com/cgi-bin/department/list`,
      {
        params: {
          access_token: accessToken,
          id: id || '',
        },
      }
    );

    if (response.data.errcode === 0) {
      return response.data.department;
    } else {
      throw new Error(`获取部门列表失败: ${response.data.errmsg}`);
    }
  } catch (error) {
    console.error('获取企业微信部门列表失败:', error);
    throw error;
  }
};

// 获取特定部门信息
export const getWeComDepartmentInfo = async (departmentId: number): Promise<any> => {
  try {
    const departments = await getWeComDepartments();
    const findDepartment = (deps: any[], targetId: number): any => {
      for (const dept of deps) {
        if (dept.id === targetId) {
          return dept;
        }
        if (dept.children) {
          const found = findDepartment(dept.children, targetId);
          if (found) return found;
        }
      }
      return null;
    };
    
    return findDepartment(departments, departmentId);
  } catch (error) {
    console.error('获取企业微信部门信息失败:', error);
    throw error;
  }
};