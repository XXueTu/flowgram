import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/user-store";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user, getUserInfo } = useUserStore();
  
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", {
          state: { from: location.pathname },
          replace: true,
        });
        return;
      }

      if (isLoggedIn && user) {
        return;
      }

      if (!isLoggedIn) {
        try {
          await getUserInfo();
        } catch (error) {
          console.error("获取用户信息失败:", error);
          localStorage.removeItem("token");
          navigate("/login", {
            state: { from: location.pathname },
            replace: true,
          });
        }
      }
    };

    checkAuth();
  }, [isLoggedIn, user, getUserInfo, navigate, location]);

  if (!isLoggedIn) {
    return null;
  }
  return <>{children}</>;
};

export default AuthGuard;
