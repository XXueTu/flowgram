import React from "react";
import { Navigate } from "react-router-dom";
import { PermissionCode, RouteConfig } from "./routes";

/**
 * 直接使用 import() 函数的路由配置示例
 * 这是最简洁的写法，推荐在实际项目中使用
 */

export const directImportRouteConfigs: RouteConfig[] = [
  // 公开路由 - 直接使用 import() 函数
  {
    path: "/login",
    element: () => import("../pages/login"),
    isPublic: true,
  },
  {
    path: "/register",
    element: () => import("../pages/register"),
    isPublic: true,
  },
  {
    path: "/403",
    element: () => Promise.resolve({ default: () => <div>403 - 没有权限访问此页面</div> }),
    isPublic: true,
  },
  {
    path: "/404",
    element: () => Promise.resolve({ default: () => <div>404 - 页面未找到</div> }),
    isPublic: true,
  },

  // 受保护的路由 - 系统会自动包装权限验证
  {
    path: "/",
    element: <Navigate to="/login" replace />,
    isPublic: true,
  },
  {
    path: "/home",
    element: () => import("../pages/home"),
  },
  {
    path: "/profile",
    element: () => import("../components/user-profile"),
    permissions: [PermissionCode.USER_VIEW],
  },

  // 实际业务页面示例
  {
    path: "/data-asset/create",
    element: () => import("../pages/data-asset/create"),
    permissions: [PermissionCode.WORKFLOW_CREATE],
  },
  {
    path: "/data-asset/list",
    element: () => import("../pages/data-asset/list"),
    permissions: [PermissionCode.WORKFLOW_VIEW],
  },
  {
    path: "/data-asset/edit/:id",
    element: () => import("../pages/data-asset/edit"),
    permissions: [PermissionCode.WORKFLOW_EDIT],
  },

  // 工作流相关页面
  {
    path: "/workflow/editor",
    element: () => import("../pages/workflow/editor"),
    permissions: [PermissionCode.WORKFLOW_CREATE, PermissionCode.WORKFLOW_EDIT],
  },
  {
    path: "/workflow/list",
    element: () => import("../pages/workflow/list"),
    permissions: [PermissionCode.WORKFLOW_VIEW],
  },

  // 管理员页面
  {
    path: "/admin/users",
    element: () => import("../pages/admin/user-management"),
    permissions: [PermissionCode.USER_EDIT, PermissionCode.ADMIN_ALL],
  },
  {
    path: "/admin/system",
    element: () => import("../pages/admin/system-config"),
    permissions: [PermissionCode.SYSTEM_CONFIG, PermissionCode.ADMIN_ALL],
  },
  {
    path: "/admin/logs",
    element: () => import("../pages/admin/log-viewer"),
    permissions: [PermissionCode.SYSTEM_LOG, PermissionCode.ADMIN_ALL],
  },

  // 使用 webpack 魔法注释进行分包
  {
    path: "/report/dashboard",
    element: () => import(/* webpackChunkName: "reports" */ "../pages/report/dashboard"),
    permissions: [PermissionCode.REPORT_VIEW],
  },
  {
    path: "/report/analytics",
    element: () => import(/* webpackChunkName: "reports" */ "../pages/report/analytics"),
    permissions: [PermissionCode.REPORT_VIEW],
  },

  // 404 fallback
  {
    path: "*",
    element: <Navigate to="/404" replace />,
    isPublic: true,
  },
];

/**
 * 使用说明：
 *
 * 1. 直接在 element 字段使用 () => import("路径")
 * 2. 系统会自动处理懒加载和 Suspense 包装
 * 3. 权限验证会自动应用到非公开路由
 * 4. 支持 webpack 魔法注释进行代码分割
 * 5. 可以混合使用 React 元素和 import 函数
 *
 * 优势：
 * - 代码更简洁，不需要额外的包装函数
 * - 自动处理懒加载逻辑
 * - 支持所有 webpack 代码分割特性
 * - 与权限系统无缝集成
 */
