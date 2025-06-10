/**
 * API 路由配置
 * 统一管理所有 API 路径
 */
export const API_ROUTES = {
  // Canvas 相关接口
  CANVAS: {
    DETAIL: "/workflow/canvas/detail",
    DRAFT: "/workflow/canvas/draft",
    RUN: "/workflow/canvas/run",
    TRACE_COMPONENTS: "/workflow/trace/components/query",
    GET_TRACE: "/workflow/canvas/trace",
  },

  // Case 相关接口
  CASE: {
    PUBLISH: "/workflow/case/publish",
    LIST: "/workflow/case/list",
    DETAIL: "/workflow/case/detail",
    DELETE: "/workflow/case/delete",
    EDIT: "/workflow/case/edit",
    CREATE: "/workflow/case/create",
  },

  // User 相关接口
  USER: {
    LOGIN: "/workflow/user/login",
    REGISTER: "/workflow/user/register",
    LOGOUT: "/workflow/user/logout",
    INFO: "/workflow/user/info",
    LIST: "/workflow/user/list",
    BIND_ROLE: "/workflow/user/bindrole",
    UPDATE_STATUS: "/workflow/user/update/status",
    UPDATE_INFO: "/workflow/user/update/info",
  },
} as const;

// API 路由类型
export type ApiRoute = typeof API_ROUTES;
