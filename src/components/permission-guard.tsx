import React from "react";
import { Navigate } from "react-router-dom";
import { PermissionCode } from "../config/routes";
import { usePermission } from "../hooks/use-permission";

interface PermissionGuardProps {
  children: React.ReactNode;
  permissions?: PermissionCode[]; // 需要的权限码列表
  requireAll?: boolean; // 是否需要拥有所有权限（默认false，拥有任意一个即可）
  fallback?: React.ReactNode; // 没有权限时显示的组件
  redirectTo?: string; // 没有权限时重定向的路径
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({ children, permissions, requireAll = false, fallback, redirectTo = "/403" }) => {
  const { canAccessRoute, hasAllPermissions, hasAnyPermission } = usePermission();

  // 如果没有权限要求，直接渲染子组件
  if (!permissions || permissions.length === 0) {
    return <>{children}</>;
  }

  // 检查权限
  const hasAccess = requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions);

  // 没有权限时的处理
  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default PermissionGuard;
