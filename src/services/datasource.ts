import { ApiClient } from './api-client';
import { API_ROUTES } from './api-routes';

// 数据源相关接口类型定义

// 数据源列表请求
export interface DatasourceListRequest {
  current: number;
  pageSize: number;
  type?: string;
  name?: string;
  status?: string;
  switch?: number;
}

// 数据源信息
export interface DatasourceInfo {
  id: number;
  name: string;
  type: string;
  config: string;
  switch: number;
  hash: string;
  status: string;
  createTime: string;
  updateTime: string;
}

// 数据源列表响应
export interface DatasourceListResponse {
  current: number;
  pageSize: number;
  total: number;
  list: DatasourceInfo[];
}

// 新增数据源请求
export interface DatasourceAddRequest {
  name: string;
  type: string;
  config: string;
  switch: number;
}

// 新增数据源响应
export interface DatasourceAddResponse {
  id: number;
}

// 编辑数据源请求
export interface DatasourceEditRequest {
  id: number;
  name: string;
  type?: string;
  config?: string;
  switch?: number;
}

// 编辑数据源响应
export interface DatasourceEditResponse {
  id: number;
}

// 删除数据源请求
export interface DatasourceDeleteRequest {
  id: number;
}

// 删除数据源响应
export interface DatasourceDeleteResponse {
  id: number;
}

// 测试数据源请求
export interface DatasourceTestRequest {
  type?: string;
  config?: string;
}

// 测试数据源响应
export interface DatasourceTestResponse {
  status: string;
  message: string;
}

// 数据源类型枚举
export enum DatasourceType {
  MYSQL = 'mysql',
  MODEL = 'model',
  SFTP = 'sftp',
}

// 数据源状态枚举
export enum DatasourceStatus {
  CONNECTED = 'connected',
  CLOSED = 'closed',
}

// 数据源开关状态
export enum DatasourceSwitch {
  ON = 1,
  OFF = 2,
}

// 数据源服务类
export class DatasourceService {
  private static instance: DatasourceService;
  private apiClient: ApiClient;

  private constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  public static getInstance(): DatasourceService {
    if (!DatasourceService.instance) {
      DatasourceService.instance = new DatasourceService();
    }
    return DatasourceService.instance;
  }

  /**
   * 获取数据源列表
   */
  async getDatasourceList(params: DatasourceListRequest): Promise<DatasourceListResponse> {
    return await this.apiClient.post<DatasourceListResponse>(
      API_ROUTES.DATASOURCE.LIST,
      params
    );
  }

  /**
   * 新增数据源
   */
  async addDatasource(params: DatasourceAddRequest): Promise<DatasourceAddResponse> {
    return await this.apiClient.post<DatasourceAddResponse>(
      API_ROUTES.DATASOURCE.ADD,
      params
    );
  }

  /**
   * 编辑数据源
   */
  async editDatasource(params: DatasourceEditRequest): Promise<DatasourceEditResponse> {
    return await this.apiClient.post<DatasourceEditResponse>(
      API_ROUTES.DATASOURCE.EDIT,
      params
    );
  }

  /**
   * 删除数据源
   */
  async deleteDatasource(params: DatasourceDeleteRequest): Promise<DatasourceDeleteResponse> {
    return await this.apiClient.post<DatasourceDeleteResponse>(
      API_ROUTES.DATASOURCE.DELETE,
      params
    );
  }

  /**
   * 测试数据源连接
   */
  async testDatasource(params: DatasourceTestRequest): Promise<DatasourceTestResponse> {
    return await this.apiClient.post<DatasourceTestResponse>(
      API_ROUTES.DATASOURCE.TEST,
      params
    );
  }
}

// 导出服务实例
export const datasourceService = DatasourceService.getInstance();

// 配置字段类型
interface ConfigField {
  key: string;
  label: string;
  type: 'input' | 'password' | 'number' | 'select' | 'json';
  required?: boolean;
  default?: any;
  options?: string[];
}

// 数据源类型配置类型
interface DatasourceTypeConfig {
  name: string;
  icon: string;
  configFields: ConfigField[];
}

// 数据源类型配置
export const DATASOURCE_TYPE_CONFIG: Record<DatasourceType, DatasourceTypeConfig> = {
  [DatasourceType.MYSQL]: {
    name: 'MySQL',
    icon: '🐬',
    configFields: [
      { key: 'host', label: '主机地址', type: 'input', required: true },
      { key: 'port', label: '端口', type: 'number', required: true, default: 3306 },
      { key: 'database', label: '数据库名', type: 'input', required: true },
      { key: 'user', label: '用户名', type: 'input', required: true },
      { key: 'password', label: '密码', type: 'password', required: true },
      { key: 'charset', label: '字符集', type: 'select', default: 'utf8mb4', options: ['utf8', 'utf8mb4'] },
    ],
  },
  [DatasourceType.MODEL]: {
    name: 'Model',
    icon: '🤖',
    configFields: [
      { key: 'model', label: '模型名称', type: 'input', required: true },
      { key: 'baseUrl', label: 'API地址', type: 'input', required: true },
      { key: 'apiKey', label: 'API密钥', type: 'password', required: true },
      { key: 'tag', label: '标签', type: 'json', required: false },
      { key: 'describe', label: '描述', type: 'input', required: false },
    ],
  },
  [DatasourceType.SFTP]: {
    name: 'SFTP',
    icon: '📂',
    configFields: [
      { key: 'host', label: '主机地址', type: 'input', required: true },
      { key: 'port', label: '端口', type: 'number', required: true, default: 22 },
      { key: 'username', label: '用户名', type: 'input', required: true },
      { key: 'password', label: '密码', type: 'password', required: true },
    ],
  },
}; 