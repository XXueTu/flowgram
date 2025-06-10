import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { RouteConfig } from "../config/routes";
import AuthGuard from "./auth-guard";
import MainLayout from "./layout/main-layout";
import LazyLoader from "./lazy-loader";
import PermissionGuard from "./permission-guard";

interface RouteRendererProps {
  routes: RouteConfig[];
}

const RouteRenderer: React.FC<RouteRendererProps> = ({ routes }) => {
  const renderElement = (element: RouteConfig["element"]): React.ReactNode => {
    if (typeof element === "function") {
      const LazyComponent = lazy(element);
      return (
        <LazyLoader>
          <LazyComponent />
        </LazyLoader>
      );
    }
    return element as React.ReactNode;
  };

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

  const allRoutes = flattenRoutes(routes);

  const renderRoute = (route: RouteConfig) => {
    const renderedElement = renderElement(route.element);

    // 公开路由直接渲染
    if (route.isPublic) {
      return <Route key={route.path} path={route.path} element={renderedElement} />;
    }

    // 受保护的路由包装权限验证和布局
    let protectedElement = renderedElement;

    if (route.permissions) {
      protectedElement = <PermissionGuard permissions={route.permissions}>{renderedElement}</PermissionGuard>;
    }

    const layoutElement = (
      <AuthGuard>
        <MainLayout>{protectedElement}</MainLayout>
      </AuthGuard>
    );

    return <Route key={route.path} path={route.path} element={layoutElement} />;
  };

  return <Routes>{allRoutes.map(renderRoute)}</Routes>;
};

export default RouteRenderer;
