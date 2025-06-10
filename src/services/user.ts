import { injectable } from 'inversify';
import { ApiClient } from './api-client';
import { API_ROUTES } from './api-routes';

export interface User {
  id: number;
  username: string;
  realName: string;
  phone: string;
  email: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  roleId: number;
  roleName: string;
  password: string;
}

export interface UserLoginRequest {
  username: string;
  password: string;
}

export interface UserLoginResponse {
  token: string;
}

export interface UserLogoutRequest {}

export interface UserLogoutResponse {}

export interface UserInfoRequest {}

export interface UserInfoResponse {
  user: User;
  roleName: string;
}

export interface UserRegisterRequest {
  username: string;
  password: string;
  realName?: string;
  phone?: string;
  email?: string;
  status?: number;
}

export interface UserRegisterResponse {
  token: string;
}

export interface UserBindRoleRequest {
  userId: number;
  roleId: number;
}

export interface UserBindRoleResponse {}

export interface UserListRequest {
  current: number;
  pageSize: number;
  username?: string;
}

export interface UserListResponse {
  total: number;
  list: User[];
}

export interface UserUpdateStatusRequest {
  userId: number;
  status: number;
}

export interface UserUpdateStatusResponse {}

export interface UserUpdateInfoRequest {
  userId: number;
  username?: string;
  phone?: string;
  email?: string;
  password?: string;
}

export interface UserUpdateInfoResponse {}

@injectable()
export class UserService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  /**
   * 用户登录
   */
  async login(params: UserLoginRequest): Promise<UserLoginResponse> {
    return this.apiClient.post<UserLoginResponse>(API_ROUTES.USER.LOGIN, params);
  }

  /**
   * 用户注册
   */
  async register(params: UserRegisterRequest): Promise<UserRegisterResponse> {
    return this.apiClient.post<UserRegisterResponse>(API_ROUTES.USER.REGISTER, params);
  }

  /**
   * 用户登出
   */
  async logout(): Promise<UserLogoutResponse> {
    return this.apiClient.post<UserLogoutResponse>(API_ROUTES.USER.LOGOUT, {});
  }

  /**
   * 获取用户信息
   */
  async getUserInfo(): Promise<UserInfoResponse> {
    return this.apiClient.post<UserInfoResponse>(API_ROUTES.USER.INFO, {});
  }

  /**
   * 获取用户列表
   */
  async getUserList(params: UserListRequest): Promise<UserListResponse> {
    return this.apiClient.post<UserListResponse>(API_ROUTES.USER.LIST, params);
  }

  /**
   * 绑定角色
   */
  async bindRole(params: UserBindRoleRequest): Promise<UserBindRoleResponse> {
    return this.apiClient.post<UserBindRoleResponse>(API_ROUTES.USER.BIND_ROLE, params);
  }

  /**
   * 更新用户状态
   */
  async updateUserStatus(params: UserUpdateStatusRequest): Promise<UserUpdateStatusResponse> {
    return this.apiClient.post<UserUpdateStatusResponse>(API_ROUTES.USER.UPDATE_STATUS, params);
  }

  /**
   * 更新用户信息
   */
  async updateUserInfo(params: UserUpdateInfoRequest): Promise<UserUpdateInfoResponse> {
    return this.apiClient.post<UserUpdateInfoResponse>(API_ROUTES.USER.UPDATE_INFO, params);
  }
} 