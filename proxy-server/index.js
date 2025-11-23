const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 静态文件服务（备用）
app.use(express.static(path.join(__dirname, 'public')));

// 反向代理到 GitHub Pages
const githubProxy = createProxyMiddleware({
  target: 'https://carol-huang00.github.io',
  changeOrigin: true,
  pathRewrite: {
    '^/seek-stars': '/seek-stars'
  },
  headers: {
    'X-Forwarded-Host': 'your-domain.com', // 替换为您的域名
    'X-Real-IP': (req) => req.ip
  }
});

// 主路由
app.use('/seek-stars', githubProxy);

// 企业微信认证回调
app.post('/api/wecom/token', async (req, res) => {
  try {
    const axios = require('axios');
    const { corpId, corpSecret } = req.body;
    
    const response = await axios.get(
      `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpId}&corpsecret=${corpSecret}`
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Token获取失败:', error);
    res.status(500).json({ error: 'Token获取失败' });
  }
});

app.post('/api/wecom/userinfo', async (req, res) => {
  try {
    const axios = require('axios');
    const { code } = req.body;
    
    // 先获取 access_token
    const tokenResponse = await axios.get(
      `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${process.env.WECOM_CORP_ID}&corpsecret=${process.env.WECOM_CORP_SECRET}`
    );
    
    const accessToken = tokenResponse.data.access_token;
    
    // 获取用户ID
    const userResponse = await axios.get(
      `https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=${accessToken}&code=${code}`
    );
    
    if (userResponse.data.errcode !== 0) {
      throw new Error(userResponse.data.errmsg);
    }
    
    const userId = userResponse.data.UserId;
    
    // 获取用户详细信息
    const userInfoResponse = await axios.get(
      `https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=${accessToken}&userid=${userId}`
    );
    
    res.json(userInfoResponse.data);
  } catch (error) {
    console.error('用户信息获取失败:', error);
    res.status(500).json({ error: '用户信息获取失败' });
  }
});

app.post('/api/wecom/departments', async (req, res) => {
  try {
    const axios = require('axios');
    const { departmentIds } = req.body;
    
    const tokenResponse = await axios.get(
      `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${process.env.WECOM_CORP_ID}&corpsecret=${process.env.WECOM_CORP_SECRET}`
    );
    
    const accessToken = tokenResponse.data.access_token;
    
    // 获取部门列表
    const deptResponse = await axios.get(
      `https://qyapi.weixin.qq.com/cgi-bin/department/list?access_token=${accessToken}`
    );
    
    res.json(deptResponse.data.department || []);
  } catch (error) {
    console.error('部门信息获取失败:', error);
    res.status(500).json({ error: '部门信息获取失败' });
  }
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`代理服务器运行在端口 ${PORT}`);
});