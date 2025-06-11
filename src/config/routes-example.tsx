import { Navigate } from "react-router-dom";
import AuthGuard from "../components/auth-guard";
import { createLazyComponent, createLazyGuardedComponent } from "../utils/lazy-import";
import { PermissionCode, RouteConfig } from "./routes";

/**
 * 实际项目中的路由配置示例
 * 展示如何使用动态导入来配置路由
 */

// 使用动态导入的页面组件示例
const ExampleLoginPage = createLazyComponent(() => import("../pages/login"));
const ExampleRegisterPage = createLazyComponent(() => import("../pages/register"));

// 使用动态导入 + 权限守卫的页面组件示例
const ExampleUserProfile = createLazyGuardedComponent(() => import("../components/user-profile"), AuthGuard);

// 实际业务页面的懒加载配置示例（当这些页面存在时使用）
// const DashboardPage = createLazyGuardedComponent(
//   () => import("../pages/dashboard"),
//   AuthGuard
// );

// const WorkflowEditorPage = createLazyGuardedComponent(
//   () => import("../pages/workflow-editor"),
//   AuthGuard
// );

// const UserManagementPage = createLazyGuardedComponent(
//   () => import("../pages/user-management"),
//   AuthGuard
// );

// const SystemSettingsPage = createLazyGuardedComponent(
//   () => import("../pages/system-settings"),
//   AuthGuard
// );

// 高级用法：支持分包加载的路由配置
// const AdminPages = {
//   UserManagement: createLazyGuardedComponent(
//     () => import("../pages/admin/user-management"),
//     AuthGuard
//   ),
//   SystemConfig: createLazyGuardedComponent(
//     () => import("../pages/admin/system-config"),
//     AuthGuard
//   ),
//   LogViewer: createLazyGuardedComponent(
//     () => import("../pages/admin/log-viewer"),
//     AuthGuard
//   ),
// };

// 实际项目路由配置示例
export const exampleRouteConfigs: RouteConfig[] = [
  // 公开路由
  {
    path: "/login",
    element: <ExampleLoginPage />,
    isPublic: true,
  },
  {
    path: "/register",
    element: <ExampleRegisterPage />,
    isPublic: true,
  },

  // 受保护的路由
  {
    path: "/profile",
    element: <ExampleUserProfile />,
    permissions: [PermissionCode.USER_VIEW],
  },

  // 当实际页面组件存在时，可以使用以下配置：
  // {
  //   path: "/dashboard",
  //   element: <DashboardPage />,
  // },
  // {
  //   path: "/workflow",
  //   element: <WorkflowEditorPage />,
  //   permissions: [PermissionCode.WORKFLOW_CREATE, PermissionCode.WORKFLOW_EDIT],
  // },
  // {
  //   path: "/admin/users",
  //   element: <AdminPages.UserManagement />,
  //   permissions: [PermissionCode.USER_EDIT, PermissionCode.ADMIN_ALL],
  // },
  // {
  //   path: "/admin/system",
  //   element: <AdminPages.SystemConfig />,
  //   permissions: [PermissionCode.SYSTEM_CONFIG, PermissionCode.ADMIN_ALL],
  // },
  // {
  //   path: "/admin/logs",
  //   element: <AdminPages.LogViewer />,
  //   permissions: [PermissionCode.SYSTEM_LOG, PermissionCode.ADMIN_ALL],
  // },

  // 重定向和错误页面
  {
    path: "/",
    element: <Navigate to="/login" replace />,
    isPublic: true,
  },
  {
    path: "*",
    element: <Navigate to="/404" replace />,
    isPublic: true,
  },
];

/**
 * Best practices for dynamic imports:
 *
 * 1. Use createLazyComponent for regular lazy-loaded components
 * 2. Use createLazyGuardedComponent for lazy-loaded components with auth guards
 * 3. For large applications, organize by feature modules: admin/, user/, workflow/
 * 4. Use webpack magic comments for better chunk control
 * 5. Provide appropriate fallback UI for better user experience
 */
