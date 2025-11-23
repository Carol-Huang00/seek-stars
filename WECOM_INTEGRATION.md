# 企业微信集成指南

## 📋 功能概述

本应用已集成企业微信认证，支持：
- 企业微信用户扫码访问
- 自动获取用户姓名和部门信息
- 用户信息与星宿查询结果绑定

## 🔧 配置步骤

### 1. 企业微信后台配置

#### 创建自建应用
1. 登录 [企业微信管理后台](https://work.weixin.qq.com/)
2. 进入「应用管理」→「应用」→「自建应用」
3. 点击「创建应用」，填写信息：
   - **应用名称**：星宿查询
   - **应用介绍**：二十八星宿查询工具
   - **应用logo**：上传应用图标

#### 获取关键信息
创建应用后，记录以下信息：
- **企业ID (Corp ID)**：在「我的企业」→「企业信息」中查看
- **应用Secret (Corp Secret)**：在应用详情页的「凭证与基础信息」中
- **应用ID (Agent ID)**：在应用详情页中查看

#### 配置网页授权
在应用详情页中：
1. 找到「网页授权及JS-SDK」
2. 设置「可信域名」：
   ```
   https://carol-huang00.github.io
   ```
3. 启用「企业微信授权登录」

### 2. 环境变量配置

在部署平台添加以下环境变量：

#### GitHub Pages
进入 Settings → Secrets and variables → Actions，添加：
- `WECOM_CORP_ID`：企业ID
- `WECOM_CORP_SECRET`：应用Secret  
- `WECOM_AGENT_ID`：应用ID
- `ENABLE_WECOM_AUTH`：`true`

#### Vercel
在 Project Settings → Environment Variables 中添加相同的环境变量。

#### Netlify
在 Site settings → Environment variables 中添加。

### 3. 访问方式配置

企业微信访问可以通过以下方式：

#### 方式一：应用内网页
1. 在企业微信应用配置中，设置「应用主页」为：
   ```
   https://carol-huang00.github.io/seek-stars/?wecom=true
   ```

#### 方式二：二维码访问
1. 生成二维码指向：
   ```
   https://carol-huang00.github.io/seek-stars/?wecom=true
   ```
2. 用户扫码后会提示用企业微信打开

#### 方式三：直接链接访问
```
https://carol-huang00.github.io/seek-stars/?wecom=true
```

## 🚀 部署更新

添加企业微信功能后，需要重新部署：

```bash
git add .
git commit -m "集成企业微信认证功能"
git push origin main
```

## 📱 用户体验

### 认证流程
1. 用户通过企业微信访问链接
2. 系统自动检测企业微信环境
3. 获取用户授权（静默授权，用户无感知）
4. 显示用户信息和部门信息
5. 用户可以进行星宿查询

### 认证失败处理
- 非企业微信环境：显示提示信息
- 授权失败：提供重试按钮
- 网络错误：显示错误信息并重试

## 🔒 安全说明

- 所有企业微信配置信息通过环境变量管理
- 用户信息仅保存在浏览器本地存储
- 不会将企业敏感信息暴露在前端代码中
- 遵循企业微信安全规范

## 🛠 调试方式

### 本地调试
1. 安装企业微信PC端
2. 修改 hosts 文件，将本地域名映射到 127.0.0.1
3. 在企业微信中打开本地开发环境

### 生产调试
1. 使用浏览器开发者工具查看网络请求
2. 检查企业微信 API 调用日志
3. 查看控制台错误信息

## 📞 常见问题

### Q: 为什么认证失败？
A: 检查以下项目：
- 企业ID和Secret是否正确
- 可信域名是否设置
- 用户是否在企业通讯录中

### Q: 如何获取部门信息？
A: 系统会自动获取用户所属的所有部门，包括主部门和兼职部门。

### Q: 支持哪些企业微信版本？
A: 支持企业微信所有版本，建议使用最新版本以获得最佳体验。

## 🔄 后端API说明

如果需要完整的后端支持，还需要实现以下API端点：

```
POST /api/wecom/token      # 获取访问令牌
POST /api/wecom/userinfo   # 获取用户信息  
POST /api/wecom/departments # 获取部门信息
```

这些端点需要使用 Node.js/Python 等后端技术实现，用于处理企业微信API调用。