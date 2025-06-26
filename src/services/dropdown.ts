import { ApiClient } from './api-client';
import { API_ROUTES } from './api-routes';

// 下拉框相关接口类型定义

// 下拉框请求
export interface GetDropDownListRequest {
  kinds: string[];  // 类型 mysql,model,sftp
}

// 下拉框响应项
export interface GetDropDownListResponseItem {
  label: string;  // 标签
  value: number;  // 值
}

// 下拉框响应
export interface GetDropDownListResponse {
  list: GetDropDownListResponseItem[];  // 列表
}

// 下拉框数据源类型枚举
export enum DropdownKind {
  MYSQL = 'mysql',
  MODEL = 'model',
  SFTP = 'sftp',
  PG = 'pg',  // 预留 PostgreSQL 支持
}

// 下拉框服务类
export class DropdownService {
  private static instance: DropdownService;
  private apiClient: ApiClient;

  private constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  public static getInstance(): DropdownService {
    if (!DropdownService.instance) {
      DropdownService.instance = new DropdownService();
    }
    return DropdownService.instance;
  }

  /**
   * 获取下拉框数据
   */
  async getDropDownList(params: GetDropDownListRequest): Promise<GetDropDownListResponse> {
    return await this.apiClient.post<GetDropDownListResponse>(
      API_ROUTES.DROPDOWN.LIST,
      params
    );
  }

  /**
   * 获取MySQL数据源下拉框数据
   */
  async getMySQLDataSources(): Promise<GetDropDownListResponseItem[]> {
    const response = await this.getDropDownList({ kinds: [DropdownKind.MYSQL] });
    return response.list;
  }

  /**
   * 获取模型数据源下拉框数据
   */
  async getModelDataSources(): Promise<GetDropDownListResponseItem[]> {
    const response = await this.getDropDownList({ kinds: [DropdownKind.MODEL] });
    return response.list;
  }

  /**
   * 获取SFTP数据源下拉框数据
   */
  async getSFTPDataSources(): Promise<GetDropDownListResponseItem[]> {
    const response = await this.getDropDownList({ kinds: [DropdownKind.SFTP] });
    return response.list;
  }

  /**
   * 获取PostgreSQL数据源下拉框数据 (预留)
   */
  async getPGDataSources(): Promise<GetDropDownListResponseItem[]> {
    const response = await this.getDropDownList({ kinds: [DropdownKind.PG] });
    return response.list;
  }

  /**
   * 根据类型获取数据源下拉框数据（通用方法）
   */
  async getDataSourcesByKind(kind: DropdownKind): Promise<GetDropDownListResponseItem[]> {
    const response = await this.getDropDownList({ kinds: [kind] });
    return response.list;
  }

  /**
   * 批量获取多种类型的数据源下拉框数据
   */
  async getDataSourcesByKinds(kinds: DropdownKind[]): Promise<GetDropDownListResponseItem[]> {
    const response = await this.getDropDownList({ kinds });
    return response.list;
  }
}

// 导出服务实例
export const dropdownService = DropdownService.getInstance(); 