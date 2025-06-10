import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { RouteConfig } from "../config/routes";
import LazyLoader from "./lazy-loader";
import PermissionGuard from "./permission-guard";
import MainLayout from "./layout/main-layout";
import AuthGuard from "./auth-guard";

interface RouteRendererProps {
  routes: RouteConfig[];
}

const RouteRenderer: React.FC<RouteRendererProps> = ({ routes }) => {
  const renderElement = (element: RouteConfig["element"]): React.ReactNode => {
    // 如果是函数，创建懒加载组件
    if (typeof element === "function") {
      const LazyComponent = lazy(element);
      return (
        <LazyLoader>
          <LazyComponent />
        </LazyLoader>
      );
    }
    // 否则直接返回元素
    return element as React.ReactNode;
  };

  // 扁平化所有路由（包括子路由）
  const flattenRoutes = (routeList: RouteConfig[]): RouteConfig[] => {
    const flattened: RouteConfig[] = [];

    routeList.forEach((route) => {
      flattened.push(route);
      if (route.children) {
        flattened.push(...flattenRoutes(route.children));
      }
    });

    return flattened;
  };

  const renderRoute = (route: RouteConfig) => {
    const renderedElement = renderElement(route.element);

    // 如果是公开路由，直接渲染（不包装布局）
    if (route.isPublic) {
      return <Route key={route.path} path={route.path} element={renderedElement} />;
    }

    // 受保护的路由，需要权限验证和布局包装
    let protectedElement = renderedElement;

    // 如果有权限要求，包装权限守卫
    if (route.permissions) {
      protectedElement = <PermissionGuard permissions={route.permissions}>{renderedElement}</PermissionGuard>;
    }

    // 所有非公开路由都包装 AuthGuard 和 MainLayout
    const layoutElement = (
      <AuthGuard>
        <MainLayout>{protectedElement}</MainLayout>
      </AuthGuard>
    );

    return <Route key={route.path} path={route.path} element={layoutElement} />;
  };

  const allRoutes = flattenRoutes(routes);

  return <Routes>{allRoutes.map(renderRoute)}</Routes>;
};

export default RouteRenderer;
