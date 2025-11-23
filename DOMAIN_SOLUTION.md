# 企业微信域名主体校验解决方案

## 🚨 问题说明

企业微信要求可信域名的备案主体与企业主体一致或有关联关系，但 GitHub Pages 的域名无法满足这个要求。

## 🛠️ 解决方案

### 方案一：使用自有域名（推荐）

#### 1. 购买并备案域名
- 购买与您的企业主体一致的域名
- 完成域名备案（主体与企业相同）
- 例如：`yourcompany-seekstars.com`

#### 2. 配置 GitHub Pages 自定义域名
```bash
# 1. 在域名DNS管理中添加CNAME记录
# 类型：CNAME
# 主机记录：www
# 记录值：carol-huang00.github.io

# 2. 在GitHub仓库设置中添加自定义域名
# Settings → Pages → Custom domain
# 输入：yourcompany-seekstars.com
```

#### 3. 更新企业微信可信域名
```
https://yourcompany-seekstars.com
```

#### 4. 更新应用配置
- 企业微信应用主页设置为：`https://yourcompany-seekstars.com/seek-stars/?wecom=true`
- 所有链接使用新域名

### 方案二：反向代理服务器

#### 1. 服务器部署
```bash
# 使用提供的代理服务器代码
# 部署到有备案域名的服务器上

cd proxy-server
npm install
npm start
```

#### 2. 配置反向代理
- 将有备案的域名指向您的服务器
- 服务器将请求代理到 GitHub Pages

#### 3. 企业微信配置
- 可信域名设置为您有备案的域名
- 应用链接指向代理服务器地址

### 方案三：使用云服务（快速部署）

#### 腾讯云 SCF + API 网关
1. **创建云函数**
   ```bash
   # 使用proxy-server中的代码
   # 部署到腾讯云函数
   ```

2. **配置API网关**
   - 创建API网关服务
   - 绑定云函数
   - 配置自定义域名

3. **企业微信配置**
   - 可信域名设置为API网关域名

#### 阿里云函数计算
类似腾讯云方案，使用阿里云函数计算 + API 网关

## 🔧 具体操作步骤（推荐方案一）

### 1. 域名购买与备案
```bash
# 示例：购买域名
yourcompany-seekstars.com

# 备案所需材料
- 企业营业执照
- 法人身份证
- 域名注册证书
- 备案真实性核验单
```

### 2. DNS 配置
```
类型：CNAME
主机记录：@ 或 www
记录值：carol-huang00.github.io
TTL：600
```

### 3. GitHub 配置
1. 进入仓库 Settings → Pages
2. 在 "Custom domain" 中输入：`yourcompany-seekstars.com`
3. 等待 SSL 证书生成

### 4. 企业微信配置
```
可信域名：https://yourcompany-seekstars.com
应用主页：https://yourcompany-seekstars.com/seek-stars/?wecom=true
```

## 🚀 快速验证方案

如果急需测试，可以使用以下临时方案：

### 临时测试方案
1. **使用本地代理**
   ```bash
   # 本地启动代理服务器
   cd proxy-server
   npm install
   npm start
   
   # 使用内网穿透工具（如ngrok）
   ngrok http 3000
   ```

2. **企业微信配置**
   ```
   可信域名：https://your-ngrok-domain.com
   ```

3. **限制说明**
   - 仅用于开发测试
   - ngrok域名不稳定
   - 不适合生产环境

## 📋 选择建议

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| 自有域名 | 稳定可靠，符合要求 | 需要域名备案费用 | 正式生产环境 |
| 反向代理 | 灵活，可控制 | 需要服务器维护 | 有服务器的企业 |
| 云服务 | 免维护，自动扩容 | 有一定费用 | 快速上线 |
| 临时方案 | 快速测试 | 不稳定 | 开发阶段 |

## 🔄 迁移步骤

选择方案后，需要更新以下配置：

1. **GitHub Actions 环境变量**（不变）
2. **企业微信应用配置**
   - 可信域名
   - 应用主页
3. **Vite 配置**中的 `base` 路径
4. **所有相关链接**

## 🎯 推荐操作顺序

1. **购买域名** → 2-3天
2. **域名备案** → 1-2周
3. **配置DNS** → 几小时
4. **GitHub配置** → 几小时
5. **企业微信更新** → 几小时
6. **测试验证** → 几小时

总计预估时间：1-3周（主要是备案时间）

## 💡 备选建议

如果时间紧迫，建议：
1. 先使用临时方案进行功能验证
2. 同时办理域名备案
3. 备案完成后切换到正式方案