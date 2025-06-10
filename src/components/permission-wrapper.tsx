import React from "react";
import { PermissionCode } from "../config/routes";
import { usePermission } from "../hooks/use-permission";

interface PermissionWrapperProps {
  children?: React.ReactNode;
  permissions: PermissionCode | PermissionCode[]; // 单个权限或权限数组
  requireAll?: boolean; // 是否需要拥有所有权限（默认false）
  fallback?: React.ReactNode; // 没有权限时显示的内容
  render?: (hasPermission: boolean) => React.ReactNode; // 自定义渲染函数
}

/**
 * 权限包装器组件
 * 用于在组件级别进行权限控制，比如控制按钮、菜单项的显示
 */
const PermissionWrapper: React.FC<PermissionWrapperProps> = ({ children, permissions, requireAll = false, fallback = null, render }) => {
  const { hasPermission, hasAllPermissions, hasAnyPermission } = usePermission();

  // 标准化权限为数组
  const permissionArray = Array.isArray(permissions) ? permissions : [permissions];

  // 检查权限
  const hasAccess = requireAll ? hasAllPermissions(permissionArray) : hasAnyPermission(permissionArray);

  // 如果有自定义渲染函数，使用它
  if (render) {
    return <>{render(hasAccess)}</>;
  }

  // 有权限时显示子组件，没有权限时显示fallback
  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export default PermissionWrapper;
