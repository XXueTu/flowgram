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

  // WorkSpace 相关接口（编排）
  WORKSPACE: {
    NEW: "/workflow/workspace/new",
    REMOVE: "/workflow/workspace/remove",
    EDIT: "/workflow/workspace/edit",
    LIST: "/workflow/workspace/list",
    EDIT_TAG: "/workflow/workspace/edit/tag",
    COPY: "/workflow/workspace/copy",
    ENV_LIST: "/workflow/workspace/env/list",
    ENV_EDIT: "/workflow/workspace/env/edit",
    EXPORT: "/workflow/workspace/export",
    IMPORT: "/workflow/workspace/import",
  },

  // Tag 相关接口
  TAG: {
    LIST: "/workflow/tag/list",
    EDIT: "/workflow/tag/edit",
    REMOVE: "/workflow/tag/remove",
  },
} as const;

// API 路由类型
export type ApiRoute = typeof API_ROUTES;
