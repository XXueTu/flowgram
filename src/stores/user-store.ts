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
}

export const useUserStore = create<UserState>((set, get) => ({
  // 初始化时设置默认用户，这样菜单就能完全显示
  user: createDefaultUser(),
  token: "default-token",
  isLoggedIn: true,
  loading: false,
  error: null,

  login: async (username: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const userService = new UserService();
      const response = await userService.login({ username, password });

      // 保存 token
      localStorage.setItem("token", response.token);

      // 获取用户信息
      await get().getUserInfo();

      set({ token: response.token, isLoggedIn: true });
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

      // 获取用户信息
      await get().getUserInfo();

      set({ token: response.token, isLoggedIn: true });
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

      set({ user: null, token: null, isLoggedIn: false });
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
      
      set({ user: userWithPermissions, isLoggedIn: true });
    } catch (error) {
      console.warn("获取用户信息失败，使用默认用户:", error);
      // 如果API失败，保持默认用户，避免菜单消失
      const currentState = get();
      if (!currentState.user) {
        set({ 
          user: createDefaultUser(), 
          isLoggedIn: true, 
          error: error instanceof Error ? error.message : "获取用户信息失败" 
        });
      } else {
        set({ error: error instanceof Error ? error.message : "获取用户信息失败" });
      }
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
      isLoggedIn: true 
    });
  },
}));
