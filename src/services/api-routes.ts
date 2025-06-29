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
    RUN_SINGLE: "/workflow/canvas/run/single",
    TRACE_COMPONENTS: "/workflow/trace/components/query",
    GET_TRACE: "/workflow/canvas/trace",
    RUN_HISTORY: "/workflow/canvas/run/history",
    RUN_DETAIL: "/workflow/canvas/run/detail",
    SAVE: "/workflow/canvas/save",
    LOAD: "/workflow/canvas/load",
    STOP: "/workflow/canvas/stop",
  },

  // API 发布相关接口
  API: {
    PUBLISH: "/workflow/api/publish",
    LIST: "/workflow/api/list",
    ON_OFF: "/workflow/api/onoff",
    EDIT: "/workflow/api/edit",
    RECORDS: "/workflow/api/records",
    SECRET_KEY_LIST: "/workflow/api/secretkey/list",
    SECRET_KEY_CREATE: "/workflow/api/secretkey/create",
    SECRET_KEY_UPDATE_STATUS: "/workflow/api/secretkey/update/status",
    SECRET_KEY_UPDATE_EXPIRATION: "/workflow/api/secretkey/update/expirationtime",
    SECRET_KEY_DELETE: "/workflow/api/secretkey/delete",
    HISTORY: "/workflow/api/history",
    CALL: "/workflow/api/call",
    CALL_TEMPLATE: "/workflow/api/call/template",
    EXPORT_CURL: "/workflow/api/export/curl",
    CALL_STATISTICS: "/workflow/api/call/statistics",
    GET_DOC: "/workflow/api/get/apidoc",
  },
  

  // JOB 发布相关接口
  JOB: {
    LIST: "/workflow/job/list",
    ON_OFF: "/workflow/job/on_off",
    EDIT: "/workflow/job/edit",
    RECORDS: "/workflow/job/records",
  },

  // Case 相关接口
  CASE: {
    PUBLISH: "/workflow/case/publish",
    LIST: "/workflow/case/list",
    DETAIL: "/workflow/case/detail",
    DELETE: "/workflow/case/delete",
    EDIT: "/workflow/case/edit",
    CREATE: "/workflow/case/create",
    UPDATE: "/workflow/case/update",
    RUN: "/workflow/case/run",
    DUPLICATE: "/workflow/case/duplicate",
  },

  // User 相关接口
  USER: {
    LOGIN: "/workflow/user/login",
    REGISTER: "/workflow/user/register",
    REFRESH_TOKEN: "/workflow/user/refresh_token",
    LOGOUT: "/workflow/user/logout",
    INFO: "/workflow/user/info",
    LIST: "/workflow/user/list",
    BIND_ROLE: "/workflow/user/bindrole",
    UPDATE_STATUS: "/workflow/user/update/status",
    UPDATE_INFO: "/workflow/user/update/info",
    UPDATE: "/workflow/user/update",
  },

  // WorkSpace 相关接口（编排）
  WORKSPACE: {
    NEW: "/workflow/workspace/new",
    REMOVE: "/workflow/workspace/remove",
    EDIT: "/workflow/workspace/edit",
    LIST: "/workflow/workspace/list",
    GET: "/workflow/workspace/get",
    EDIT_TAG: "/workflow/workspace/edit/tag",
    COPY: "/workflow/workspace/copy",
    ENV_LIST: "/workflow/workspace/env/list",
    ENV_EDIT: "/workflow/workspace/env/edit",
    EXPORT: "/workflow/workspace/export",
    IMPORT: "/workflow/workspace/import",
    CREATE: "/workflow/workspace/create",
    UPDATE: "/workflow/workspace/update",
    DELETE: "/workflow/workspace/delete",
    DETAIL: "/workflow/workspace/detail",
    MEMBER_LIST: "/workflow/workspace/member/list",
    MEMBER_ADD: "/workflow/workspace/member/add",
    MEMBER_REMOVE: "/workflow/workspace/member/remove",
    MEMBER_UPDATE_ROLE: "/workflow/workspace/member/update_role",
  },

  // Tag 相关接口
  TAG: {
    LIST: "/workflow/tag/list",
    EDIT: "/workflow/tag/edit",
    REMOVE: "/workflow/tag/remove",
  },

  // 数据源相关
  DATASOURCE: {
    LIST: "/workflow/datasource/list",
    ADD: "/workflow/datasource/add",
    EDIT: "/workflow/datasource/edit",
    DELETE: "/workflow/datasource/delete",
    TEST: "/workflow/datasource/test",
  },

  // 首页统计相关接口
  HOME: {
    STATISTICS: "/workflow/basics/home/statistics",
  },

  // 下拉框相关接口
  DROPDOWN: {
    LIST: "/workflow/basics/dropdown",
  },
} as const;

// API 路由类型
export type ApiRoute = typeof API_ROUTES;
