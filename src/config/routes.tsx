import {
  ApiOutlined,
  AppstoreOutlined,
  CloudOutlined,
  DashboardOutlined,
  SettingOutlined,
  TeamOutlined
} from "@ant-design/icons";
import React from "react";
import { Navigate } from "react-router-dom";
import { createLazyComponent } from "../utils/lazy-import";

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

  // 资源管理权限
  RESOURCE_VIEW = "resource:view",
  RESOURCE_EDIT = "resource:edit",
  RESOURCE_DELETE = "resource:delete",

  // 任务管理权限
  TASK_VIEW = "task:view",
  TASK_EDIT = "task:edit",
  TASK_DELETE = "task:delete",

  // 插件管理权限
  PLUGIN_VIEW = "plugin:view",
  PLUGIN_EDIT = "plugin:edit",
  PLUGIN_DELETE = "plugin:delete",

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
const DashboardPage = () => <div>Dashboard 仪表盘页面</div>;
const WorkflowPage = () => <div>编排页面</div>;
const ResourcePage = () => <div>资源管理页面</div>;
const TaskPage = () => <div>任务管理页面</div>;
const PluginPage = () => <div>插件管理页面</div>;

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
    element: <Navigate to="/dashboard" replace />,
    isPublic: true,
    hideInMenu: true,
  },
  {
    path: "/home",
    element: <Navigate to="/dashboard" replace />,
    isPublic: true,
    hideInMenu: true,
  },

  // 顶部菜单项
  {
    path: "/dashboard",
    element: () => import("../pages/dashboard"),
    name: "Dashboard",
    icon: <DashboardOutlined />,
    menuOrder: 1,
  },

  {
    path: "/workflow",
    element: () => import("../pages/workflow-list"),
    permissions: [PermissionCode.WORKFLOW_VIEW],
    name: "编排",
    icon: <ApiOutlined />,
    menuOrder: 2,
    children: [
      {
        path: "/workflow-list",
        element: () => import("../pages/workflow-list"),
        permissions: [PermissionCode.WORKFLOW_VIEW],
        name: "工作空间列表",
        menuOrder: 1,
      },
      // {
      //   path: "/workflow/editor",
      //   element: () => Promise.resolve({ default: () => <div>工作流编辑器</div> }),
      //   permissions: [PermissionCode.WORKFLOW_CREATE, PermissionCode.WORKFLOW_EDIT],
      //   name: "工作流编辑器",
      //   menuOrder: 2,
      // },
      // {
      //   path: "/workflow/template",
      //   element: () => Promise.resolve({ default: () => <div>工作流模板</div> }),
      //   permissions: [PermissionCode.WORKFLOW_VIEW],
      //   name: "工作流模板",
      //   menuOrder: 3,
      // },
    ],
  },
  {
    path: "/resource",
    element: () => Promise.resolve({ default: ResourcePage }),
    permissions: [PermissionCode.RESOURCE_VIEW],
    name: "资源",
    icon: <CloudOutlined />,
    menuOrder: 3,
    children: [
      {
        path: "/resource/data-source",
        element: () => import("../pages/datasource-management"),
        permissions: [PermissionCode.RESOURCE_VIEW],
        name: "数据源",
        menuOrder: 1,
      },
      // {
      //   path: "/resource/compute",
      //   element: () => Promise.resolve({ default: () => <div>计算资源</div> }),
      //   permissions: [PermissionCode.RESOURCE_VIEW],
      //   name: "计算资源",
      //   menuOrder: 2,
      // },
      // {
      //   path: "/resource/storage",
      //   element: () => Promise.resolve({ default: () => <div>存储资源</div> }),
      //   permissions: [PermissionCode.RESOURCE_VIEW],
      //   name: "存储资源",
      //   menuOrder: 3,
      // },
    ],
  },
  // {
  //   path: "/task",
  //   element: () => Promise.resolve({ default: TaskPage }),
  //   permissions: [PermissionCode.TASK_VIEW],
  //   name: "任务",
  //   icon: <ScheduleOutlined />,
  //   menuOrder: 4,
  //   children: [
  //     {
  //       path: "/task/running",
  //       element: () => Promise.resolve({ default: () => <div>运行中任务</div> }),
  //       permissions: [PermissionCode.TASK_VIEW],
  //       name: "运行中",
  //       menuOrder: 1,
  //     },
  //     {
  //       path: "/task/history",
  //       element: () => Promise.resolve({ default: () => <div>历史任务</div> }),
  //       permissions: [PermissionCode.TASK_VIEW],
  //       name: "历史任务",
  //       menuOrder: 2,
  //     },
  //     {
  //       path: "/task/schedule",
  //       element: () => Promise.resolve({ default: () => <div>定时任务</div> }),
  //       permissions: [PermissionCode.TASK_VIEW],
  //       name: "定时任务",
  //       menuOrder: 3,
  //     },
  //   ],
  // },
  {
    path: "/plugin",
    element: () => Promise.resolve({ default: PluginPage }),
    permissions: [PermissionCode.PLUGIN_VIEW],
    name: "插件",
    icon: <AppstoreOutlined />,
    menuOrder: 5,
    children: [
      {
        path: "/plugin/installed",
        element: () => Promise.resolve({ default: () => <div>已安装插件</div> }),
        permissions: [PermissionCode.PLUGIN_VIEW],
        name: "已安装",
        menuOrder: 1,
      },
      {
        path: "/plugin/market",
        element: () => Promise.resolve({ default: () => <div>插件市场</div> }),
        permissions: [PermissionCode.PLUGIN_VIEW],
        name: "插件市场",
        menuOrder: 2,
      },
      {
        path: "/plugin/develop",
        element: () => Promise.resolve({ default: () => <div>插件开发</div> }),
        permissions: [PermissionCode.PLUGIN_EDIT],
        name: "插件开发",
        menuOrder: 3,
      },
    ],
  },

  // 特殊路由
  {
    path: "/profile",
    element: () => import("../components/user-profile"),
    permissions: [PermissionCode.USER_VIEW],
    hideInMenu: true, // 隐藏在菜单中，通过用户下拉菜单访问
  },
  {
    path: "/editor/:canvasId/:workflowId",
    element: () => import("../pages/editor"),
    hideInMenu: true, // 编辑器页面隐藏在菜单中
  },
  {
    path: "/publish-management/:workspaceId",
    element: () => import("../pages/publish-management"),
    permissions: [PermissionCode.WORKFLOW_VIEW],
    hideInMenu: true, // 发布管理页面隐藏在菜单中
  },
  {
    path: "/api-detail/:workspaceId/:apiId",
    element: () => import("../pages/api-detail"),
    permissions: [PermissionCode.WORKFLOW_VIEW],
    hideInMenu: true, // API详情页面隐藏在菜单中
  },
  {
    path: "/workflow-list",
    element: () => import("../pages/workflow-list"),
    permissions: [PermissionCode.WORKFLOW_VIEW],
    hideInMenu: true, // 工作空间列表页面
  },

  // 系统管理（隐藏菜单，可通过URL直接访问或其他方式进入）
  {
    path: "/admin",
    element: () => Promise.resolve({ default: () => <div>系统管理</div> }),
    permissions: [PermissionCode.ADMIN_ALL],
    hideInMenu: true,
    children: [
      {
        path: "/admin/user",
        element: () => Promise.resolve({ default: () => <div>用户管理</div> }),
        permissions: [PermissionCode.USER_VIEW, PermissionCode.USER_EDIT],
        name: "用户管理",
        icon: <TeamOutlined />,
        menuOrder: 1,
      },
      {
        path: "/admin/system",
        element: () => Promise.resolve({ default: () => <div>系统配置</div> }),
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
  [PermissionCode.RESOURCE_VIEW]: "查看资源信息",
  [PermissionCode.RESOURCE_EDIT]: "编辑资源信息",
  [PermissionCode.RESOURCE_DELETE]: "删除资源",
  [PermissionCode.TASK_VIEW]: "查看任务信息",
  [PermissionCode.TASK_EDIT]: "编辑任务信息",
  [PermissionCode.TASK_DELETE]: "删除任务",
  [PermissionCode.PLUGIN_VIEW]: "查看插件信息",
  [PermissionCode.PLUGIN_EDIT]: "编辑插件信息",
  [PermissionCode.PLUGIN_DELETE]: "删除插件",
  [PermissionCode.REPORT_VIEW]: "查看报表",
  [PermissionCode.ADMIN_ALL]: "管理员所有权限",
};
