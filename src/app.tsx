import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import RouteRenderer from "./components/route-renderer";
import { routeConfigs } from "./config/routes";

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <RouteRenderer routes={routeConfigs} />
      </Router>
    </ConfigProvider>
  );
};

export default App;
