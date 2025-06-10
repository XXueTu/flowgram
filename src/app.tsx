import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AuthGuard from './components/auth-guard';
import UserProfile from './components/user-profile';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import { useUserStore } from './stores/user-store';

// 受保护的路由组件
const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { isLoggedIn } = useUserStore();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{element}</>;
};

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Routes>
          {/* 公开路由 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 受保护的路由 */}
          <Route
            path="/profile"
            element={
              <AuthGuard>
                <UserProfile />
              </AuthGuard>
            }
          />

          {/* 其他受保护的路由 */}
          <Route
            path="/*"
            element={
              <AuthGuard>
                <ProtectedRoute element={<div>受保护的页面</div>} />
              </AuthGuard>
            }
          />

          {/* 默认重定向到登录页 */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App;
