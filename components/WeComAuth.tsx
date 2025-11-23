import React, { useState, useEffect } from 'react';
import { wechatWorkAuthFlow, isWeChatWork } from '../utils/wecomAuth';
import { UserRecord } from '../types';

interface WeComUserInfo {
  name: string;
  departmentNames: string[];
  department: number[];
  position: string;
  avatar: string;
}

interface WeComAuthProps {
  onAuthSuccess: (userInfo: WeComUserInfo) => void;
  onAuthError?: (error: string) => void;
}

const WeComAuth: React.FC<WeComAuthProps> = ({ onAuthSuccess, onAuthError }) => {
  const [loading, setLoading] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [userInfo, setUserInfo] = useState<WeComUserInfo | null>(null);

  useEffect(() => {
    // 检查是否已经认证
    const storedUserInfo = localStorage.getItem('wecom_user_info');
    if (storedUserInfo) {
      try {
        const parsed = JSON.parse(storedUserInfo);
        setUserInfo(parsed);
        setAuthed(true);
        onAuthSuccess(parsed);
      } catch (e) {
        console.error('解析用户信息失败:', e);
        localStorage.removeItem('wecom_user_info');
      }
    } else {
      // 自动开始认证
      handleAuth();
    }
  }, []);

  const handleAuth = async () => {
    if (!isWeChatWork()) {
      const errorMsg = '请使用企业微信访问此页面';
      onAuthError?.(errorMsg);
      return;
    }

    setLoading(true);
    
    try {
      const result = await wechatWorkAuthFlow();
      
      if (result) {
        const { user, departments } = result;
        
        // 处理部门名称
        const departmentNames = departments.map(dept => dept.name);
        
        const wecomUserInfo: WeComUserInfo = {
          name: user.name,
          departmentNames,
          department: user.department,
          position: user.position,
          avatar: user.avatar,
        };
        
        // 保存到本地存储
        localStorage.setItem('wecom_user_info', JSON.stringify(wecomUserInfo));
        
        setUserInfo(wecomUserInfo);
        setAuthed(true);
        
        onAuthSuccess(wecomUserInfo);
      }
    } catch (error) {
      console.error('企业微信认证失败:', error);
      onAuthError?.('认证失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    localStorage.removeItem('wecom_user_info');
    setAuthed(false);
    setUserInfo(null);
    handleAuth();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-amber-500 font-serif">正在认证企业微信...</p>
        </div>
      </div>
    );
  }

  if (authed && userInfo) {
    return (
      <div className="text-center mb-6">
        <div className="inline-flex items-center space-x-3 bg-blue-950/30 backdrop-blur-md rounded-full px-6 py-3 border border-amber-500/20">
          <img 
            src={userInfo.avatar || '/default-avatar.png'} 
            alt="头像" 
            className="w-8 h-8 rounded-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/default-avatar.png';
            }}
          />
          <div className="text-left">
            <p className="text-amber-200 text-sm font-serif">{userInfo.name}</p>
            <p className="text-amber-500/60 text-xs">
              {userInfo.departmentNames.join(' / ')} {userInfo.position && `- ${userInfo.position}`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-serif text-amber-200 mb-2">企业微信认证</h1>
          <p className="text-amber-500/60 font-serif">请使用企业微信扫码访问此页面</p>
        </div>

        {!isWeChatWork() && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-sm font-serif">
              检测到不在企业微信环境中，请使用企业微信访问
            </p>
          </div>
        )}

        {isWeChatWork() && (
          <button
            onClick={handleRetry}
            className="bg-amber-600/20 border border-amber-500/30 text-amber-200 px-8 py-3 rounded-full hover:bg-amber-600/30 transition-all duration-300 font-serif"
          >
            重新认证
          </button>
        )}
      </div>
    </div>
  );
};

export default WeComAuth;