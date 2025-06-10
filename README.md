# Flowgram Demo 自由布局编辑器

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/npm/v/@flowgram.ai/demo-free-layout.svg)](https://www.npmjs.com/package/@flowgram.ai/demo-free-layout)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)

一个基于 React + TypeScript 构建的可视化流程编辑器演示项目，提供强大的自由布局编辑能力和丰富的插件生态系统。

## 🚀 功能特性

### 🎨 核心编辑功能
- **自由布局编辑器**: 支持拖拽、缩放、旋转等操作
- **可视化节点系统**: 丰富的节点类型和自定义节点支持
- **智能连线**: 自动吸附、智能路径规划
- **分组管理**: 支持节点分组和批量操作
- **实时预览**: 所见即所得的编辑体验

### 🔧 高级功能
- **节点执行监控**: 实时监控节点执行状态和结果
- **权限管理系统**: 细粒度权限控制
- **插件系统**: 可扩展的插件架构
- **快照功能**: 支持撤销/重做操作
- **导入导出**: 支持多种格式的数据交换

### 🎯 用户体验
- **响应式设计**: 适配不同屏幕尺寸
- **国际化支持**: 多语言界面
- **主题定制**: 支持亮色/暗色主题
- **快捷键**: 丰富的键盘快捷键支持

## 🛠 技术栈

### 前端核心
- **React 18**: 现代化的用户界面库
- **TypeScript**: 类型安全的 JavaScript 超集
- **Rsbuild**: 高性能的现代化构建工具
- **Ant Design**: 企业级 UI 设计语言

### 状态管理
- **Zustand**: 轻量级状态管理库
- **MobX**: 响应式状态管理

### 样式方案
- **Styled Components**: CSS-in-JS 解决方案
- **Less**: CSS 预处理器
- **Semi Design**: 现代化设计系统

### 开发工具
- **ESLint**: 代码质量检查
- **Monaco Editor**: 在线代码编辑器
- **React Router**: 单页应用路由

## 📁 项目结构

```
flowgram/
├── src/                          # 源代码目录
│   ├── app.tsx                   # 应用入口组件
│   ├── main.tsx                  # 应用启动文件
│   ├── editor.tsx                # 编辑器核心组件
│   ├── assets/                   # 静态资源
│   ├── components/               # UI 组件
│   │   ├── base-node/           # 基础节点组件
│   │   ├── sidebar/             # 侧边栏组件
│   │   ├── layout/              # 布局组件
│   │   ├── tools/               # 工具栏组件
│   │   ├── node-panel/          # 节点面板
│   │   ├── node-menu/           # 节点菜单
│   │   ├── add-node/            # 添加节点
│   │   ├── comment/             # 注释组件
│   │   └── group/               # 分组组件
│   ├── pages/                   # 页面组件
│   │   ├── home.tsx             # 首页
│   │   ├── login.tsx            # 登录页
│   │   └── register.tsx         # 注册页
│   ├── config/                  # 配置文件
│   │   ├── routes.tsx           # 路由配置
│   │   ├── menu.ts              # 菜单配置
│   │   ├── proxy.ts             # 代理配置
│   │   └── env.ts               # 环境配置
│   ├── stores/                  # 状态管理
│   ├── services/                # API 服务
│   ├── hooks/                   # 自定义 Hooks
│   ├── context/                 # React Context
│   ├── utils/                   # 工具函数
│   ├── plugins/                 # 插件系统
│   ├── nodes/                   # 节点定义
│   ├── form-components/         # 表单组件
│   ├── form-materials/          # 表单物料
│   ├── shortcuts/               # 快捷键配置
│   ├── styles/                  # 全局样式
│   ├── types/                   # 类型定义
│   └── typings/                 # TypeScript 声明
├── docs/                        # 文档目录
│   └── PROXY_CONFIG.md          # 代理配置文档
├── dist/                        # 构建输出目录
├── package.json                 # 项目依赖配置
├── rsbuild.config.ts           # 构建工具配置
├── tsconfig.json               # TypeScript 配置
├── .eslintrc.js                # ESLint 配置
├── CODING_RULES.md             # 编码规范
└── NODE_EXECUTION_DETAILS.md   # 节点执行详情文档
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install
```

### 启动开发服务器

```bash
# 启动开发模式
npm run dev

# 或
yarn dev
```

项目将在 `http://localhost:3000` 启动，支持热重载。

### 构建生产版本

```bash
# 构建生产版本
npm run build

# 或
yarn build
```

构建文件将输出到 `dist` 目录。

## 📝 开发指南

### 代码规范

项目遵循严格的代码规范，详见 [CODING_RULES.md](./CODING_RULES.md)：

- 使用 TypeScript 进行类型安全开发
- 遵循 ESLint 代码规范
- 使用函数式组件和 React Hooks
- 采用模块化的目录结构

### 组件开发

创建新组件时请遵循以下结构：

```typescript
import React from 'react';
import styled from 'styled-components';

interface ComponentProps {
  // 属性定义
}

const StyledWrapper = styled.div`
  // 样式定义
`;

export const ComponentName: React.FC<ComponentProps> = (props) => {
  // 组件实现
  return <StyledWrapper>{/* 组件内容 */}</StyledWrapper>;
};
```

### 状态管理

项目使用 Zustand 进行状态管理：

```typescript
import { create } from 'zustand';

interface StoreState {
  // 状态定义
}

export const useStore = create<StoreState>((set, get) => ({
  // 状态实现
}));
```

### 路由配置

在 `src/config/routes.tsx` 中配置路由：

```typescript
export const routeConfigs: RouteConfig[] = [
  {
    path: '/your-path',
    component: lazy(() => import('../pages/YourPage')),
    requireAuth: true, // 是否需要认证
    permissions: ['permission'], // 权限要求
  },
];
```

## 🔧 核心功能详解

### 节点执行监控

项目提供了完整的节点执行监控功能，详见 [NODE_EXECUTION_DETAILS.md](./NODE_EXECUTION_DETAILS.md)：

```tsx
import { NodeExecutionDetails } from './components/base-node/node-execution-details';

<NodeExecutionDetails
  nodeId="your-node-id"
  canvasId="default"
  serialId="trace-id"
/>
```

### 权限管理

使用权限组件包装需要权限控制的内容：

```tsx
import { PermissionWrapper } from './components/permission-wrapper';

<PermissionWrapper permissions={['read', 'write']}>
  <YourComponent />
</PermissionWrapper>
```

### 插件系统

项目支持丰富的插件扩展：

- `@flowgram.ai/free-container-plugin`: 容器插件
- `@flowgram.ai/free-group-plugin`: 分组插件
- `@flowgram.ai/free-lines-plugin`: 连线插件
- `@flowgram.ai/free-snap-plugin`: 吸附插件
- `@flowgram.ai/minimap-plugin`: 缩略图插件

## 🎨 样式主题

项目支持主题定制，可通过修改样式变量来调整界面外观：

```less
// 在 src/styles/ 目录下修改主题变量
@primary-color: #1890ff;
@success-color: #52c41a;
@warning-color: #faad14;
@error-color: #ff4d4f;
```

## 📦 构建配置

### Rsbuild 配置

项目使用 Rsbuild 作为构建工具，配置文件位于 `rsbuild.config.ts`：

```typescript
export default defineConfig({
  plugins: [pluginReact(), pluginLess()],
  source: {
    entry: { index: "./src/main.tsx" },
    decorators: { version: "legacy" },
  },
  // 更多配置...
});
```

### 代理配置

开发环境代理配置详见 [docs/PROXY_CONFIG.md](./docs/PROXY_CONFIG.md)。

## 🧪 测试

```bash
# 运行测试
npm run test

# 运行代码检查
npm run lint

# 修复代码格式
npm run lint:fix
```

## 📚 文档

- [编码规范](./CODING_RULES.md)
- [节点执行详情](./NODE_EXECUTION_DETAILS.md)
- [代理配置](./docs/PROXY_CONFIG.md)
- [路由懒加载说明](./src/config/README-lazy-loading.md)

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'Add some amazing feature'`
4. 推送到分支: `git push origin feature/amazing-feature`
5. 开启 Pull Request

### 提交规范

使用约定式提交规范：

- `feat`: 新功能
- `fix`: 修复问题
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建工具或辅助工具的变动

## 📄 许可证

本项目基于 [MIT License](https://opensource.org/licenses/MIT) 开源。

## 🔗 相关链接

- [Flowgram 官网](https://flowgram.ai)
- [在线演示](https://demo.flowgram.ai)
- [API 文档](https://docs.flowgram.ai)
- [问题反馈](https://github.com/flowgram-ai/demo-free-layout/issues)

## 📞 联系我们

如有问题或建议，请通过以下方式联系我们：

- 邮箱: support@flowgram.ai
- 官网: https://flowgram.ai
- GitHub Issues: [提交问题](https://github.com/flowgram-ai/demo-free-layout/issues)

---

**注意**: 这是一个演示项目，用于展示 Flowgram 编辑器的核心功能。生产环境使用请联系我们获取完整版本。
