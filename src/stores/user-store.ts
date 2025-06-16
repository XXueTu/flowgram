import { create } from "zustand";
import { PermissionCode } from "../config/routes";
import { User, UserService } from "../services/user";

// 创建拥有所有权限的默认用户
const createDefaultUser = (): User => {
  // 获取所有权限码
  const allPermissions = Object.values(PermissionCode);
  
  return {
    id: 1,
    username: "admin",
    realName: "管理员",
    phone: "13800138000",
    email: "admin@flowgram.ai",
    status: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    password: "",
    permissions: allPermissions, // 拥有所有权限
  };
};

// 从localStorage获取初始状态
const getInitialState = () => {
  const token = localStorage.getItem("token");
  
  if (token) {
    // 有token，返回登录状态，用户信息稍后通过getUserInfo获取
    return {
      user: null,
      token,
      isLoggedIn: true,
    };
  } else {
    // 没有token，返回未登录状态
    return {
      user: null,
      token: null,
      isLoggedIn: false,
    };
  }
};

interface UserState {
  // 用户信息
  user: User | null;
  // 用户 token
  token: string | null;
  // 是否已登录
  isLoggedIn: boolean;
  // 加载状态
  loading: boolean;
  // 错误信息
  error: string | null;
  // 是否已初始化（用于判断是否需要自动获取用户信息）
  initialized: boolean;

  // 登录
  login: (username: string, password: string) => Promise<void>;
  // 注册
  register: (params: { username: string; password: string; realName?: string; phone?: string; email?: string }) => Promise<void>;
  // 登出
  logout: () => Promise<void>;
  // 获取用户信息
  getUserInfo: () => Promise<void>;
  // 更新用户信息
  updateUserInfo: (params: { userId: number; username?: string; phone?: string; email?: string; password?: string }) => Promise<void>;
  // 更新用户状态
  updateUserStatus: (userId: number, status: number) => Promise<void>;
  // 绑定角色
  bindRole: (userId: number, roleId: number) => Promise<void>;
  // 设置默认用户（用于开发测试）
  setDefaultUser: () => void;
  // 初始化用户状态
  initializeUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => {
  const initialState = getInitialState();
  
  return {
    // 使用计算出的初始状态
    user: initialState.user,
    token: initialState.token,
    isLoggedIn: initialState.isLoggedIn,
    loading: false,
    error: null,
    initialized: false,

    login: async (username: string, password: string) => {
      try {
        set({ loading: true, error: null });
        const userService = new UserService();
        const response = await userService.login({ username, password });

        // 保存 token
        localStorage.setItem("token", response.token);

        // 获取用户信息
        await get().getUserInfo();

        set({ token: response.token, isLoggedIn: true, initialized: true });
      } catch (error) {
        set({ error: error instanceof Error ? error.message : "登录失败" });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    register: async (params) => {
      try {
        set({ loading: true, error: null });
        const userService = new UserService();
        const response = await userService.register(params);

        // 保存 token
        localStorage.setItem("token", response.token);

        set({ token: response.token, isLoggedIn: true, initialized: true });
      } catch (error) {
        set({ error: error instanceof Error ? error.message : "注册失败" });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    logout: async () => {
      try {
        set({ loading: true, error: null });
        const userService = new UserService();
        await userService.logout();

        // 清除本地存储
        localStorage.removeItem("token");

        set({ user: null, token: null, isLoggedIn: false, initialized: true });
      } catch (error) {
        set({ error: error instanceof Error ? error.message : "登出失败" });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    getUserInfo: async () => {
      try {
        set({ loading: true, error: null });
        const userService = new UserService();
        const response = await userService.getUserInfo();
        
        // 确保用户拥有所有权限（开发阶段默认开放所有权限）
        const userWithPermissions = {
          ...response.user,
          permissions: response.user.permissions && response.user.permissions.length > 0 
            ? response.user.permissions 
            : Object.values(PermissionCode) // 如果API没有返回权限或权限为空，给予所有权限
        };
        
        set({ user: userWithPermissions, isLoggedIn: true, initialized: true });
      } catch (error) {
        console.error("获取用户信息失败:", error);
        set({ 
          error: error instanceof Error ? error.message : "获取用户信息失败",
          initialized: true 
        });
        throw error; // 抛出错误让调用方处理
      } finally {
        set({ loading: false });
      }
    },

    updateUserInfo: async (params) => {
      try {
        set({ loading: true, error: null });
        const userService = new UserService();
        await userService.updateUserInfo(params);

        // 重新获取用户信息
        await get().getUserInfo();
      } catch (error) {
        set({ error: error instanceof Error ? error.message : "更新用户信息失败" });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    updateUserStatus: async (userId: number, status: number) => {
      try {
        set({ loading: true, error: null });
        const userService = new UserService();
        await userService.updateUserStatus({ userId, status });

        // 重新获取用户信息
        await get().getUserInfo();
      } catch (error) {
        set({ error: error instanceof Error ? error.message : "更新用户状态失败" });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    bindRole: async (userId: number, roleId: number) => {
      try {
        set({ loading: true, error: null });
        const userService = new UserService();
        await userService.bindRole({ userId, roleId });

        // 重新获取用户信息
        await get().getUserInfo();
      } catch (error) {
        set({ error: error instanceof Error ? error.message : "绑定角色失败" });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    setDefaultUser: () => {
      const defaultUser = createDefaultUser();
      set({ 
        user: defaultUser, 
        token: "default-token", 
        isLoggedIn: true,
        initialized: true 
      });
    },

    initializeUser: async () => {
      const state = get();
      
      // 如果已经初始化或正在加载，直接返回
      if (state.initialized) {
        return;
      }
      
      if (state.loading) {
        return;
      }

      const token = localStorage.getItem("token");
      
      if (token) {
        // 有token，尝试获取用户信息
        try {
          await get().getUserInfo();
        } catch (error) {
          console.warn("初始化用户信息失败:", error);
          // 如果获取用户信息失败，清除无效token
          localStorage.removeItem("token");
          set({ 
            user: null, 
            token: null, 
            isLoggedIn: false, 
            initialized: true 
          });
          throw error; // 重新抛出错误，让AuthGuard处理跳转
        }
      } else {
        // 没有token，设置为未登录状态
        set({ 
          user: null, 
          token: null, 
          isLoggedIn: false, 
          initialized: true 
        });
      }
    },
  };
});
