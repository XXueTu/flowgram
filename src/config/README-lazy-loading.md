# 动态导入路由系统使用指南

本项目实现了基于权限码的路由系统，支持动态导入（懒加载）来优化应用性能。

## 📁 文件结构

```
src/
├── components/
│   ├── lazy-loader.tsx          # 懒加载包装器组件
│   ├── permission-guard.tsx     # 权限守卫组件
│   └── route-renderer.tsx       # 路由渲染器
├── config/
│   ├── routes.tsx               # 主路由配置
│   ├── routes-example.tsx       # 使用示例
│   └── mock-users.ts           # 模拟用户数据
├── hooks/
│   └── use-permission.ts        # 权限管理Hook
└── utils/
    └── lazy-import.tsx          # 懒加载工具函数
```

## 🚀 快速开始

### 1. 基础用法

```tsx
import { createLazyComponent, createLazyGuardedComponent } from "../utils/lazy-import";
import AuthGuard from "../components/auth-guard";

// 普通懒加载组件
const LoginPage = createLazyComponent(() => import("../pages/login"));

// 带权限守卫的懒加载组件
const UserProfile = createLazyGuardedComponent(() => import("../components/user-profile"), AuthGuard);
```

### 2. 路由配置

```tsx
export const routeConfigs: RouteConfig[] = [
  // 公开路由
  {
    path: "/login",
    element: <LoginPage />,
    isPublic: true,
  },

  // 受保护的路由
  {
    path: "/profile",
    element: <UserProfile />,
    permissions: [PermissionCode.USER_VIEW],
  },
];
```

## 🔧 核心功能

### createLazyComponent

创建普通的懒加载组件：

```tsx
const MyPage = createLazyComponent(
  () => import("../pages/my-page"),
  <div>Loading...</div> // 可选的加载提示
);
```

### createLazyGuardedComponent

创建带权限守卫的懒加载组件：

```tsx
const AdminPage = createLazyGuardedComponent(
  () => import("../pages/admin"),
  AuthGuard,
  <div>Loading admin...</div> // 可选的加载提示
);
```

## 📦 代码分割策略

### 按功能模块分包

```tsx
// 管理员模块
const AdminPages = {
  UserManagement: createLazyGuardedComponent(() => import(/* webpackChunkName: "admin" */ "../pages/admin/users"), AuthGuard),
  SystemConfig: createLazyGuardedComponent(() => import(/* webpackChunkName: "admin" */ "../pages/admin/config"), AuthGuard),
};

// 用户模块
const UserPages = {
  Profile: createLazyGuardedComponent(() => import(/* webpackChunkName: "user" */ "../pages/user/profile"), AuthGuard),
  Settings: createLazyGuardedComponent(() => import(/* webpackChunkName: "user" */ "../pages/user/settings"), AuthGuard),
};
```

### Webpack 魔法注释

使用 webpack 魔法注释进行更精细的控制：

```tsx
const WorkflowEditor = createLazyComponent(
  () =>
    import(
      /* webpackChunkName: "workflow" */
      /* webpackPrefetch: true */
      "../pages/workflow/editor"
    )
);
```

## 🔐 权限系统集成

### 权限码定义

```tsx
export enum PermissionCode {
  USER_VIEW = "user:view",
  USER_EDIT = "user:edit",
  WORKFLOW_CREATE = "workflow:create",
  ADMIN_ALL = "admin:all",
}
```

### 路由权限配置

```tsx
{
  path: "/admin",
  element: <AdminPage />,
  permissions: [PermissionCode.ADMIN_ALL],
}
```

## 🎨 自定义加载状态

### 全局加载状态

在 `src/components/lazy-loader.tsx` 中自定义默认加载状态：

```tsx
const defaultFallback = (
  <div className="flex justify-center items-center h-64">
    <Spin size="large" />
  </div>
);
```

### 页面级加载状态

为特定页面提供自定义加载状态：

```tsx
const CustomLoadingPage = createLazyComponent(
  () => import("../pages/heavy-page"),
  <div className="custom-loading">
    <Spin tip="加载复杂页面中..." />
  </div>
);
```

## 📊 性能监控

### 分析包大小

```bash
# 分析打包结果
npm run build
# 使用 webpack-bundle-analyzer
npx webpack-bundle-analyzer dist/static/js/*.js
```

### 预加载关键资源

```tsx
// 在关键路径上预加载重要组件
const CriticalPage = createLazyComponent(
  () =>
    import(
      /* webpackPrefetch: true */
      "../pages/critical"
    )
);
```

## 🐛 常见问题

### 1. 懒加载组件不显示

确保组件有正确的默认导出：

```tsx
// ✅ 正确
const MyComponent = () => <div>Content</div>;
export default MyComponent;

// ❌ 错误
export const MyComponent = () => <div>Content</div>;
```

### 2. 权限验证失效

确保在 `createLazyGuardedComponent` 中传入了正确的权限守卫：

```tsx
// ✅ 正确
const ProtectedPage = createLazyGuardedComponent(() => import("../pages/protected"), AuthGuard);
```

### 3. 加载状态闪烁

为网络较慢的用户提供最小显示时间：

```tsx
const MinLoadingTime = ({ children, fallback }) => {
  const [showFallback, setShowFallback] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowFallback(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return showFallback ? fallback : children;
};
```

## 🔗 相关资源

- [React.lazy 官方文档](https://react.dev/reference/react/lazy)
- [Webpack 代码分割](https://webpack.js.org/guides/code-splitting/)
- [React Router 懒加载](https://reactrouter.com/en/main/route/lazy)
