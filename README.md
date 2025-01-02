# waikanstore
上传自己的外刊资料信息
# 外刊库 (E-Magazines Library)

基于 React + TypeScript + Node.js 构建的现代化外刊管理和展示系统。

## 🌟 功能特点

- 📚 多分类杂志展示（期刊报纸、人文地理、商业财经等）
- 🔍 实时搜索功能
- 📱 响应式布局设计
- 📖 分页浏览
- 🛠️ 后台管理系统
- 📤 杂志封面上传

## 🚀 技术栈

### 前端
- React 18
- TypeScript 4
- Ant Design 5
- React Router 6

### 后端
- Node.js
- Express
- SQLite3
- Multer (文件上传)

## 📦 快速开始

### 环境要求
- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装步骤

1. **克隆项目**
```bash
git clone <project-url>
cd e-magazines
```

2. **安装依赖**
```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd waikan-backend
npm install
```

3. **启动项目**
```bash
# 启动后端服务 (http://localhost:5001)
cd waikan-backend
node server.js

# 新开终端，启动前端开发服务器 (http://localhost:3000)
cd ..
npm start
```

## 🏗️ 项目结构

```
e-magazines/
├── src/                    # 前端源码
│   ├── components/        # 通用组件
│   ├── pages/            # 页面组件
│   ├── services/         # API 服务
│   ├── styles/           # 全局样式
│   └── types/            # TypeScript 类型定义
│
├── waikan-backend/        # 后端项目
│   ├── data/             # SQLite 数据库文件
│   ├── public/           # 静态资源（上传的图片）
│   └── server.js         # 服务器入口文件
│
└── public/               # 前端静态资源
```

## 📝 API 接口

### 杂志管理接口
```typescript
GET    /api/magazines          // 获取所有杂志
GET    /api/magazines/:id      // 获取单个杂志
POST   /api/magazines         // 添加新杂志
PUT    /api/magazines/:id      // 更新杂志信息
DELETE /api/magazines/:id      // 删除杂志
```

## ⚙️ 开发配置

### 前端配置
创建 `.env` 文件：
```env
REACT_APP_API_URL=http://localhost:5001/api
```

### 后端配置
默认配置：
- 端口：5001
- 数据库：SQLite3
- 图片存储：本地文件系统

## 📈 待优化功能

- [ ] 用户认证系统
- [ ] 图片懒加载优化
- [ ] 服务端渲染支持
- [ ] 单元测试覆盖
- [ ] 国际化支持
- [ ] 黑暗模式
- [ ] 移动端适配优化
- [ ] Docker 部署支持

## 🔧 常见问题

### 类型定义错误
安装所需的类型定义：
```bash
npm install --save-dev @types/better-sqlite3 @types/babel__core @types/babel__generator @types/babel__template
```

### 图片上传失败
确保 `waikan-backend/public/images` 目录存在且有写入权限：
```bash
mkdir -p waikan-backend/public/images
chmod 755 waikan-backend/public/images
```

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献指南

1. Fork 本项目
2. 创建新分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

---

如果这个项目对您有帮助，欢迎给个 ⭐️ Star！
