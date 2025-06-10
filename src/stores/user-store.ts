import { create } from 'zustand';
import { User, UserService } from '../services/user';

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
  register: (params: {
    username: string;
    password: string;
    realName?: string;
    phone?: string;
    email?: string;
  }) => Promise<void>;
  // 登出
  logout: () => Promise<void>;
  // 获取用户信息
  getUserInfo: () => Promise<void>;
  // 更新用户信息
  updateUserInfo: (params: {
    userId: number;
    username?: string;
    phone?: string;
    email?: string;
    password?: string;
  }) => Promise<void>;
  // 更新用户状态
  updateUserStatus: (userId: number, status: number) => Promise<void>;
  // 绑定角色
  bindRole: (userId: number, roleId: number) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  token: null,
  isLoggedIn: false,
  loading: false,
  error: null,

  login: async (username: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const userService = new UserService();
      const response = await userService.login({ username, password });
      
      // 保存 token
      localStorage.setItem('token', response.token);
      
      // 获取用户信息
      await get().getUserInfo();
      
      set({ token: response.token, isLoggedIn: true });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '登录失败' });
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
      localStorage.setItem('token', response.token);
      
      // 获取用户信息
      await get().getUserInfo();
      
      set({ token: response.token, isLoggedIn: true });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '注册失败' });
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
      localStorage.removeItem('token');
      
      set({ user: null, token: null, isLoggedIn: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '登出失败' });
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
      
      set({ user: response.user });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '获取用户信息失败' });
      throw error;
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
      set({ error: error instanceof Error ? error.message : '更新用户信息失败' });
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
      set({ error: error instanceof Error ? error.message : '更新用户状态失败' });
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
      set({ error: error instanceof Error ? error.message : '绑定角色失败' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
})); 