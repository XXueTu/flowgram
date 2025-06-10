# 代理配置说明

## 概述

项目已经配置了开发环境代理，用于解决开发时的跨域问题。代理配置使用 Rsbuild 的内置代理功能。

## 配置文件

### 1. 环境配置 (`src/config/env.ts`)

管理不同环境下的配置：

- **开发环境**: 使用空字符串作为 BASE_URL，通过代理访问 API
- **生产环境**: 使用完整的 API 服务器地址
- **测试环境**: 可配置测试服务器地址

### 2. 代理配置 (`src/config/proxy.ts`)

定义代理规则：

- `/workflow`: 代理到后端 workflow API
- `/api`: 通用 API 代理（可选）

### 3. 构建配置 (`rsbuild.config.ts`)

引用代理配置，在开发服务器启动时生效。

## 代理规则

### /workflow

- **目标**: `http://14.103.249.105:9999`
- **用途**: 所有以 `/workflow` 开头的请求都会被代理到后端服务器
- **路径重写**: 保持原路径 `/workflow`

### /api

- **目标**: `http://14.103.249.105:9999`
- **用途**: 通用 API 代理
- **路径重写**: 移除 `/api` 前缀

## 如何修改代理配置

### 1. 修改后端服务器地址

编辑 `src/config/proxy.ts` 文件中的 `API_SERVER` 常量：

```typescript
const API_SERVER = "http://your-api-server:port";
```

### 2. 添加新的代理规则

在 `PROXY_CONFIG` 对象中添加新规则：

```typescript
export const PROXY_CONFIG: Record<string, ProxyConfig> = {
  // 现有配置...

  // 新增代理规则
  "/new-api": {
    target: "http://another-server:port",
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      "^/new-api": "/api",
    },
  },
};
```

### 3. 修改环境配置

编辑 `src/config/env.ts` 文件，为不同环境配置不同的 API 地址。

## 开发环境启动

启动开发服务器后，代理会自动生效：

```bash
npm run dev
# 或
yarn dev
```

## 注意事项

1. **代理仅在开发环境生效**，生产环境需要直接访问 API 服务器
2. **修改代理配置后需要重启开发服务器**
3. **确保后端服务器支持跨域请求**（如果直接访问）
4. **检查防火墙和网络连接**，确保能访问代理目标服务器

## 常见问题

### Q: 代理不生效怎么办？

A:

1. 检查代理配置是否正确
2. 重启开发服务器
3. 检查浏览器开发者工具的网络面板

### Q: 如何查看代理请求？

A:

1. 打开浏览器开发者工具
2. 查看 Network 面板
3. 观察请求的实际 URL 和响应

### Q: 生产环境如何处理跨域？

A:

1. 后端配置 CORS 头
2. 使用 Nginx 等反向代理
3. 将前端和后端部署在同一域名下
