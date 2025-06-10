import React from "react";
import { Navigate } from "react-router-dom";
import {
  UserOutlined,
  DashboardOutlined,
  SettingOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  TeamOutlined,
  SafetyOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import AuthGuard from "../components/auth-guard";
import { createLazyComponent, createLazyGuardedComponent } from "../utils/lazy-import";

// 权限码定义
export enum PermissionCode {
  // 用户管理权限
  USER_VIEW = "user:view",
  USER_EDIT = "user:edit",
  USER_DELETE = "user:delete",

  // 系统管理权限
  SYSTEM_CONFIG = "system:config",
  SYSTEM_LOG = "system:log",

  // 业务权限
  WORKFLOW_CREATE = "workflow:create",
  WORKFLOW_EDIT = "workflow:edit",
  WORKFLOW_DELETE = "workflow:delete",
  WORKFLOW_EXECUTE = "workflow:execute",
  WORKFLOW_VIEW = "workflow:view",

  // 报表权限
  REPORT_VIEW = "report:view",

  // 管理员权限
  ADMIN_ALL = "admin:all",
}

// 路由配置接口
export interface RouteConfig {
  path: string;
  element: React.ReactNode | (() => Promise<{ default: React.ComponentType<any> }>);
  isPublic?: boolean; // 是否为公开路由（不需要登录）
  permissions?: PermissionCode[]; // 需要的权限码
  exact?: boolean;
  children?: RouteConfig[];

  // 菜单相关配置
  name?: string; // 菜单显示名称
  icon?: React.ReactNode; // 菜单图标
  hideInMenu?: boolean; // 是否在菜单中隐藏
  hideChildrenInMenu?: boolean; // 是否隐藏子菜单
  menuOrder?: number; // 菜单排序
}

// 现在支持两种方式：
// 方式1: 使用懒加载工具函数（推荐用于复杂场景）
const LoginPage = createLazyComponent(() => import("../pages/login"));
const RegisterPage = createLazyComponent(() => import("../pages/register"));

// 方式2: 直接使用函数（推荐用于简单场景，将在路由配置中直接使用）
// 不需要在这里定义，直接在路由配置中使用 () => import("...") 即可

// 基础页面组件（这里用占位符，实际项目中需要替换为真实组件）
const WorkflowPage = () => <div>工作流页面</div>;
const UserManagePage = () => <div>用户管理页面</div>;
const SystemConfigPage = () => <div>系统配置页面</div>;

// 错误页面组件
const NotFoundPage = () => <div>404 - 页面未找到</div>;
const NoPermissionPage = () => <div>403 - 没有权限访问此页面</div>;

// 路由配置
export const routeConfigs: RouteConfig[] = [
  // 公开路由
  {
    path: "/login",
    element: <LoginPage />,
    isPublic: true,
  },
  {
    path: "/register",
    element: <RegisterPage />,
    isPublic: true,
  },
  {
    path: "/403",
    element: <NoPermissionPage />,
    isPublic: true,
  },
  {
    path: "/404",
    element: <NotFoundPage />,
    isPublic: true,
  },

  // 受保护的路由
  {
    path: "/",
    element: <Navigate to="/home" replace />,
    isPublic: true,
    hideInMenu: true,
  },
  {
    path: "/home",
    element: () => import("../pages/home"),
    name: "首页",
    icon: <DashboardOutlined />,
    menuOrder: 1,
  },
  {
    path: "/profile",
    element: () => import("../components/user-profile"),
    permissions: [PermissionCode.USER_VIEW],
    name: "个人中心",
    icon: <UserOutlined />,
    menuOrder: 2,
  },
  {
    path: "/editor/:canvasId/:workflowId",
    element: () => import("../editor"),
    hideInMenu: true, // 编辑器页面隐藏在菜单中
  },
  {
    path: "/workflow",
    element: () => Promise.resolve({ default: WorkflowPage }),
    permissions: [PermissionCode.WORKFLOW_VIEW],
    name: "工作流",
    icon: <FileTextOutlined />,
    menuOrder: 3,
    children: [
      {
        path: "/workflow/list",
        element: () => Promise.resolve({ default: () => <div>工作流列表</div> }),
        permissions: [PermissionCode.WORKFLOW_VIEW],
        name: "工作流列表",
        menuOrder: 1,
      },
      {
        path: "/workflow/editor",
        element: () => Promise.resolve({ default: () => <div>工作流编辑器</div> }),
        permissions: [PermissionCode.WORKFLOW_CREATE, PermissionCode.WORKFLOW_EDIT],
        name: "工作流编辑器",
        menuOrder: 2,
      },
    ],
  },
  {
    path: "/data-asset",
    element: () => Promise.resolve({ default: () => <div>数据资产</div> }),
    permissions: [PermissionCode.WORKFLOW_VIEW],
    name: "数据资产",
    icon: <DatabaseOutlined />,
    menuOrder: 4,
    children: [
      {
        path: "/data-asset/list",
        element: () => Promise.resolve({ default: () => <div>资产列表</div> }),
        permissions: [PermissionCode.WORKFLOW_VIEW],
        name: "资产列表",
        menuOrder: 1,
      },
      {
        path: "/data-asset/create",
        element: () => Promise.resolve({ default: () => <div>创建资产</div> }),
        permissions: [PermissionCode.WORKFLOW_CREATE],
        name: "创建资产",
        menuOrder: 2,
      },
    ],
  },
  {
    path: "/admin",
    element: () => Promise.resolve({ default: () => <div>系统管理</div> }),
    permissions: [PermissionCode.ADMIN_ALL, PermissionCode.USER_EDIT, PermissionCode.SYSTEM_CONFIG],
    name: "系统管理",
    icon: <SettingOutlined />,
    menuOrder: 5,
    children: [
      {
        path: "/user-manage",
        element: () => Promise.resolve({ default: UserManagePage }),
        permissions: [PermissionCode.USER_VIEW, PermissionCode.USER_EDIT],
        name: "用户管理",
        icon: <TeamOutlined />,
        menuOrder: 1,
      },
      {
        path: "/system-config",
        element: () => Promise.resolve({ default: SystemConfigPage }),
        permissions: [PermissionCode.SYSTEM_CONFIG, PermissionCode.ADMIN_ALL],
        name: "系统配置",
        icon: <SettingOutlined />,
        menuOrder: 2,
      },
    ],
  },

  // 404 fallback
  {
    path: "*",
    element: <Navigate to="/404" replace />,
    isPublic: true,
  },
];

// 权限码说明文档（供参考）
export const PERMISSION_DESCRIPTIONS: Record<PermissionCode, string> = {
  [PermissionCode.USER_VIEW]: "查看用户信息",
  [PermissionCode.USER_EDIT]: "编辑用户信息",
  [PermissionCode.USER_DELETE]: "删除用户",
  [PermissionCode.SYSTEM_CONFIG]: "系统配置管理",
  [PermissionCode.SYSTEM_LOG]: "系统日志查看",
  [PermissionCode.WORKFLOW_CREATE]: "创建工作流",
  [PermissionCode.WORKFLOW_EDIT]: "编辑工作流",
  [PermissionCode.WORKFLOW_DELETE]: "删除工作流",
  [PermissionCode.WORKFLOW_EXECUTE]: "执行工作流",
  [PermissionCode.WORKFLOW_VIEW]: "查看工作流",
  [PermissionCode.REPORT_VIEW]: "查看报表",
  [PermissionCode.ADMIN_ALL]: "管理员所有权限",
};
