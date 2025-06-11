import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import RouteRenderer from "./components/route-renderer";
import { routeConfigs } from "./config/routes";
import { useUserStore } from "./stores/user-store";

const App: React.FC = () => {
  const { initializeUser } = useUserStore();

  useEffect(() => {
    // 初始化用户状态，恢复登录状态
    initializeUser().catch((error) => {
      console.error("用户初始化失败:", error);
    });
  }, [initializeUser]);

  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <RouteRenderer routes={routeConfigs} />
      </Router>
    </ConfigProvider>
  );
};

export default App;
