import { User } from "../services/user";
import { PermissionCode } from "./routes";

/**
 * 模拟用户数据示例
 * 展示不同权限配置的用户
 */
export const mockUsers: User[] = [
  // 管理员用户
  {
    id: 1,
    username: "admin",
    realName: "系统管理员",
    phone: "13800138000",
    email: "admin@example.com",
    status: 1,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    password: "",
    permissions: [
      PermissionCode.ADMIN_ALL,
      PermissionCode.USER_VIEW,
      PermissionCode.USER_EDIT,
      PermissionCode.USER_DELETE,
      PermissionCode.SYSTEM_CONFIG,
      PermissionCode.SYSTEM_LOG,
      PermissionCode.WORKFLOW_CREATE,
      PermissionCode.WORKFLOW_EDIT,
      PermissionCode.WORKFLOW_DELETE,
      PermissionCode.WORKFLOW_EXECUTE,
    ],
  },

  // 普通用户
  {
    id: 2,
    username: "user",
    realName: "普通用户",
    phone: "13800138001",
    email: "user@example.com",
    status: 1,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    password: "",
    permissions: [PermissionCode.USER_VIEW, PermissionCode.WORKFLOW_CREATE, PermissionCode.WORKFLOW_EDIT, PermissionCode.WORKFLOW_EXECUTE],
  },

  // 访客用户
  {
    id: 3,
    username: "guest",
    realName: "访客用户",
    phone: "13800138002",
    email: "guest@example.com",
    status: 1,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    password: "",
    permissions: [PermissionCode.USER_VIEW, PermissionCode.WORKFLOW_EXECUTE],
  },

  // 工作流管理员
  {
    id: 4,
    username: "workflow_admin",
    realName: "工作流管理员",
    phone: "13800138003",
    email: "workflow_admin@example.com",
    status: 1,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    password: "",
    permissions: [
      PermissionCode.USER_VIEW,
      PermissionCode.WORKFLOW_CREATE,
      PermissionCode.WORKFLOW_EDIT,
      PermissionCode.WORKFLOW_DELETE,
      PermissionCode.WORKFLOW_EXECUTE,
    ],
  },

  // 受限用户（只有查看权限）
  {
    id: 5,
    username: "viewer",
    realName: "查看用户",
    phone: "13800138004",
    email: "viewer@example.com",
    status: 1,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    password: "",
    permissions: [PermissionCode.USER_VIEW],
  },
];

/**
 * 根据用户名获取模拟用户数据
 */
export const getMockUserByUsername = (username: string): User | undefined => {
  return mockUsers.find((user) => user.username === username);
};

/**
 * 权限配置模版
 * 可以用于创建新用户时的权限预设
 */
export const permissionTemplates = {
  // 管理员模版
  admin: [
    PermissionCode.ADMIN_ALL,
    PermissionCode.USER_VIEW,
    PermissionCode.USER_EDIT,
    PermissionCode.USER_DELETE,
    PermissionCode.SYSTEM_CONFIG,
    PermissionCode.SYSTEM_LOG,
    PermissionCode.WORKFLOW_CREATE,
    PermissionCode.WORKFLOW_EDIT,
    PermissionCode.WORKFLOW_DELETE,
    PermissionCode.WORKFLOW_EXECUTE,
  ],

  // 普通用户模版
  user: [PermissionCode.USER_VIEW, PermissionCode.WORKFLOW_CREATE, PermissionCode.WORKFLOW_EDIT, PermissionCode.WORKFLOW_EXECUTE],

  // 访客模版
  guest: [PermissionCode.USER_VIEW, PermissionCode.WORKFLOW_EXECUTE],

  // 工作流管理员模版
  workflowAdmin: [
    PermissionCode.USER_VIEW,
    PermissionCode.WORKFLOW_CREATE,
    PermissionCode.WORKFLOW_EDIT,
    PermissionCode.WORKFLOW_DELETE,
    PermissionCode.WORKFLOW_EXECUTE,
  ],

  // 查看者模版
  viewer: [PermissionCode.USER_VIEW],
} as const;
