import { Spin } from "antd";
import React, { Suspense } from "react";

interface LazyLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * 懒加载包装器组件
 * 用于包装动态导入的组件，提供加载状态
 */
const LazyLoader: React.FC<LazyLoaderProps> = ({
  children,
  fallback = (
    <div className="flex justify-center items-center h-64">
      <Spin size="large" />
    </div>
  ),
}) => {
  return <Suspense fallback={fallback}>{children}</Suspense>;
};

export default LazyLoader;
