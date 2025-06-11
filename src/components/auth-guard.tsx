import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/user-store";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user, initialized, initializeUser } = useUserStore();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      setIsChecking(true);
      
      const token = localStorage.getItem("token");

      // 没有token，跳转登录
      if (!token) {
        navigate("/login", {
          state: { from: location.pathname },
          replace: true,
        });
        setIsChecking(false);
        return;
      }

      // 如果还没有初始化，先初始化用户状态
      if (!initialized) {
        try {
          await initializeUser();
        } catch (error) {
          console.error("初始化用户状态失败:", error);
          // 初始化失败，清除无效token并跳转到登录页面
          localStorage.removeItem("token");
          navigate("/login", {
            state: { from: location.pathname },
            replace: true,
          });
          setIsChecking(false);
          return;
        }
      }

      // 再次检查最新状态
      const currentState = useUserStore.getState();

      // 检查登录状态
      if (!currentState.isLoggedIn) {
        localStorage.removeItem("token");
        navigate("/login", {
          state: { from: location.pathname },
          replace: true,
        });
        setIsChecking(false);
        return;
      }

      // 检查用户信息
      if (!currentState.user) {
        localStorage.removeItem("token");
        navigate("/login", {
          state: { from: location.pathname },
          replace: true,
        });
        setIsChecking(false);
        return;
      }

      // 验证通过
      setIsChecking(false);
    };

    checkAuth();
  }, [isLoggedIn, user, initialized, initializeUser, navigate, location]);

  // 正在检查登录状态时显示加载状态
  if (isChecking) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '16px',
        color: '#666'
      }}>
        正在验证登录状态...
      </div>
    );
  }

  // 再次获取最新状态进行最终检查
  const finalState = useUserStore.getState();

  // 登录验证通过才渲染子组件
  if (!finalState.isLoggedIn || !finalState.user) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
