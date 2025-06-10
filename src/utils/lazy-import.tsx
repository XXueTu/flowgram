import React, { lazy, ComponentType } from "react";
import LazyLoader from "../components/lazy-loader";

/**
 * 创建懒加载组件的工具函数
 * @param importFn 动态导入函数
 * @param fallback 加载时的占位组件
 * @returns 包装了懒加载的组件
 */
export function createLazyComponent<T extends ComponentType<any>>(importFn: () => Promise<{ default: T }>, fallback?: React.ReactNode) {
  const LazyComponent = lazy(importFn);

  return (props: React.ComponentProps<T>) => (
    <LazyLoader fallback={fallback}>
      <LazyComponent {...props} />
    </LazyLoader>
  );
}

/**
 * 创建带权限守卫的懒加载组件
 * @param importFn 动态导入函数
 * @param AuthGuardComponent 权限守卫组件
 * @param fallback 加载时的占位组件
 * @returns 包装了懒加载和权限守卫的组件
 */
export function createLazyGuardedComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  AuthGuardComponent: ComponentType<{ children: React.ReactNode }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFn);

  return (props: React.ComponentProps<T>) => (
    <LazyLoader fallback={fallback}>
      <AuthGuardComponent>
        <LazyComponent {...props} />
      </AuthGuardComponent>
    </LazyLoader>
  );
}
