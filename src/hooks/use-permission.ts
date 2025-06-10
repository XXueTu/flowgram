import { useMemo } from "react";
import { PermissionCode } from "../config/routes";
import { useUserStore } from "../stores/user-store";

// 开发模式下是否开放所有权限（后续集成权限管理时可设为false）
const DEVELOPMENT_OPEN_ALL_PERMISSIONS = true;

// 权限验证Hook
export const usePermission = () => {
  const { user } = useUserStore();

  // 获取用户权限码列表
  const userPermissions = useMemo(() => {
    if (!user) return [];

    // 直接从用户信息中获取权限列表
    return user.permissions || [];
  }, [user]);

  // 检查是否拥有单个权限
  const hasPermission = (permission: PermissionCode): boolean => {
    // 开发模式下默认开放所有权限
    if (process.env.NODE_ENV === 'development' && DEVELOPMENT_OPEN_ALL_PERMISSIONS) {
      return true;
    }

    if (!user) return false;

    // 管理员拥有所有权限
    if (userPermissions.includes(PermissionCode.ADMIN_ALL)) {
      return true;
    }

    return userPermissions.includes(permission);
  };

  // 检查是否拥有多个权限中的任意一个（或关系）
  const hasAnyPermission = (permissions: PermissionCode[]): boolean => {
    // 开发模式下默认开放所有权限
    if (process.env.NODE_ENV === 'development' && DEVELOPMENT_OPEN_ALL_PERMISSIONS) {
      return true;
    }

    if (!permissions || permissions.length === 0) return true;
    return permissions.some((permission) => hasPermission(permission));
  };

  // 检查是否拥有所有权限（且关系）
  const hasAllPermissions = (permissions: PermissionCode[]): boolean => {
    // 开发模式下默认开放所有权限
    if (process.env.NODE_ENV === 'development' && DEVELOPMENT_OPEN_ALL_PERMISSIONS) {
      return true;
    }

    if (!permissions || permissions.length === 0) return true;
    return permissions.every((permission) => hasPermission(permission));
  };

  // 检查路由访问权限
  const canAccessRoute = (routePermissions?: PermissionCode[]): boolean => {
    // 开发模式下默认开放所有权限
    if (process.env.NODE_ENV === 'development' && DEVELOPMENT_OPEN_ALL_PERMISSIONS) {
      return true;
    }

    if (!routePermissions || routePermissions.length === 0) {
      return true; // 没有权限要求的路由，任何登录用户都可以访问
    }

    // 默认使用或关系，拥有任意一个权限即可访问
    return hasAnyPermission(routePermissions);
  };

  return {
    userPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessRoute,
  };
};
