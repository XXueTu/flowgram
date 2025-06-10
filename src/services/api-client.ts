import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API 配置
export const API_CONFIG = {
  BASE_URL: 'http://14.103.249.105:9999/workflow',
  TIMEOUT: 30000,
} as const;

// 统一的 API 响应结构
export interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}

// 统一的错误类型
export class ApiError extends Error {
  constructor(
    public code: number,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * API 客户端类
 * 提供统一的 HTTP 请求方法和错误处理
 */
export class ApiClient {
  private static instance: ApiClient;
  private axiosInstance: AxiosInstance;

  private constructor(config: Partial<AxiosRequestConfig> = {}) {
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      ...config,
    });

    // 请求拦截器
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // 从 localStorage 获取 token
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        const { data } = response;
        console.log('response:', data);
        
        // 检查响应格式
        if (!data || typeof data !== 'object') {
          throw new ApiError(500, '响应格式错误');
        }

        // 检查业务状态码
        if (data.code !== 0) {
          console.log('data.code:', data.code);
          throw new ApiError(data.code, data.msg || '请求失败', data.data);
        }

        return response;
      },
      (error) => {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 401) {
            // token 过期或无效，清除本地存储并跳转到登录页
            localStorage.removeItem('token');
            window.location.href = '/login';
          }
          throw new ApiError(
            data.code || status,
            data?.msg || `请求失败 (${status})`,
            data
          );
        }
        if (error.request) {
          throw new ApiError(500, '网络请求失败，请检查网络连接');
        }
        throw new ApiError(500, error.message || '未知错误');
      }
    );
  }

  public static getInstance(config?: Partial<AxiosRequestConfig>): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient(config);
    }
    return ApiClient.instance;
  }

  /**
   * 发送请求
   */
  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.request<ApiResponse<T>>(config);
      return response.data.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, error instanceof Error ? error.message : '未知错误');
    }
  }

  /**
   * GET 请求
   */
  public async get<T>(url: string, params?: any): Promise<T> {
    return this.request<T>({
      method: 'GET',
      url,
      params,
    });
  }

  /**
   * POST 请求
   */
  public async post<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({
      method: 'POST',
      url,
      data,
    });
  }

  /**
   * PUT 请求
   */
  public async put<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({
      method: 'PUT',
      url,
      data,
    });
  }

  /**
   * DELETE 请求
   */
  public async delete<T>(url: string, params?: any): Promise<T> {
    return this.request<T>({
      method: 'DELETE',
      url,
      params,
    });
  }
} 