import { ApiClient } from './api-client';
import { API_ROUTES } from './api-routes';

/**
 * API 发布列表请求参数
 */
export interface ApiPublishListRequest {
  current: number;      // 当前页
  pageSize: number;     // 页大小
  id: string;          // 列表对应的 id 
  name?: string;       // 名称
  tag?: string;        // 标签
}

/**
 * API 发布列表响应
 */
export interface ApiPublishListResponse {
  current: number;
  pageSize: number;
  total: number;
  list: ApiPublishList[];
}

/**
 * API 发布列表项
 */
export interface ApiPublishList {
  workSpaceId: string;
  apiId: string;
  apiName: string;
  apiDesc: string;
  tag: string[];
  publishTime: string;
  status: string; // 上下线状态ON OFF
}

/**
 * API上下线请求参数
 */
export interface ApiOnOffRequest {
  apiId: string;
  status: string; // ON OFF
}

/**
 * API上下线响应
 */
export interface ApiOnOffResponse {
  apiId: string;
  status: string;
}

/**
 * API编辑请求参数
 */
export interface ApiEditRequest {
  apiId: string;
  apiName: string;
  apiDesc: string;
  tag: string[];
}

/**
 * API编辑响应
 */
export interface ApiEditResponse {
  apiId: string;
}

/**
 * API调用记录请求参数
 */
export interface ApiRecordsRequest {
  current: number;
  pageSize: number;
  apiId?: string;
  startTime?: number;
  endTime?: number;
  request?: string;
  response?: string;
}

/**
 * API调用记录响应
 */
export interface ApiRecordsResponse {
  current: number;
  pageSize: number;
  total: number;
  list: ApiRecords[];
}

/**
 * API调用记录项
 */
export interface ApiRecords {
  apiId: string;
  apiName: string;
  callTime: string;
  status: string;
  traceId: string;
  param: string;
  extend: string;
}

/**
 * API密钥列表请求参数
 */
export interface ApiSecretKeyListRequest {
  apiId: string;
  current: number;
  pageSize: number;
}

/**
 * API密钥列表响应
 */
export interface ApiSecretKeyListResponse {
  current: number;
  pageSize: number;
  total: number;
  list: ApiSecretKey[];
}

/**
 * API密钥项
 */
export interface ApiSecretKey {
  apiId: string;
  name: string;
  secretKey: string;
  expirationTime: string;
  status: string; // ON OFF
}

/**
 * 创建API密钥请求参数
 */
export interface ApiSecretKeyCreateRequest {
  apiId: string;
  name: string;
  secretKey?: string;
  expirationTime: number;
}

/**
 * 创建API密钥响应
 */
export interface ApiSecretKeyCreateResponse {
  apiId: string;
  name: string;
  secretKey: string;
  expirationTime: string;
}

/**
 * 更新API密钥状态请求参数
 */
export interface ApiSecretKeyUpdateStatusRequest {
  secretKey: string;
  status: string; // ON OFF
}

/**
 * 更新API密钥状态响应
 */
export interface ApiSecretKeyUpdateStatusResponse {
  secretKey: string;
  status: string;
}

/**
 * 更新API密钥到期时间请求参数
 */
export interface ApiSecretKeyUpdateExpirationTimeRequest {
  secretKey: string;
  expirationTime: number;
}

/**
 * 更新API密钥到期时间响应
 */
export interface ApiSecretKeyUpdateExpirationTimeResponse {
  secretKey: string;
  expirationTime: string;
}

/**
 * 删除API密钥请求参数
 */
export interface ApiSecretKeyDeleteRequest {
  secretKey: string;
}

/**
 * 删除API密钥响应
 */
export interface ApiSecretKeyDeleteResponse {
  secretKey: string;
}

/**
 * API历史版本请求参数
 */
export interface ApiHistoryRequest {
  workspaceId: string;
  current: number;
  pageSize: number;
}

/**
 * API历史版本响应
 */
export interface ApiHistoryResponse {
  current: number;
  pageSize: number;
  total: number;
  list: ApiHistory[];
}

/**
 * API历史版本项
 */
export interface ApiHistory {
  id: number;
  workspaceId: string;
  name: string;
  createTime: string;
}

/**
 * API调用请求参数
 */
export interface ApiCallRequest {
  apiId: string;
  url: string;
  header: string;
  body: string;
}

/**
 * API调用响应
 */
export interface ApiCallResponse {
  response: string;
}

/**
 * API调用模板请求参数
 */
export interface ApiCallTemplateRequest {
  apiId: string;
  caseId: string;
}

/**
 * API调用模板响应
 */
export interface ApiCallTemplateResponse {
  apiId: string;
  url: string;
  header: string;
  body: string;
}

/**
 * API导出curl请求参数
 */
export interface ApiExportCurlRequest {
  apiId: string;
  url: string;
  header: string;
  body: string;
}

/**
 * API导出curl响应
 */
export interface ApiExportCurlResponse {
  curl: string;
}

/**
 * API调用统计请求参数
 */
export interface ApiCallStatisticsRequest {
  apiId: string;
  startTime: number;
  endTime: number;
}

/**
 * API调用统计响应
 */
export interface ApiCallStatisticsResponse {
  total: number;
  xAxis: string[];
  yAxis: number[];
}

/**
 * JOB 发布列表请求参数
 */
export interface JobPublishListRequest {
  current: number;
  pageSize: number;
  id: string;
  jobName?: string;
}

/**
 * JOB 发布列表响应
 */
export interface JobPublishListResponse {
  current: number;
  pageSize: number;
  total: number;
  list: JobPublishList[];
}

/**
 * JOB 发布列表项
 */
export interface JobPublishList {
  workSpaceId: string;
  jobId: string;
  jobName: string;
  jobDesc: string;
  jobCron: string;
  jobParam: string;
  status: string; // 状态 ON OFF
  createTime: string;
  updateTime: string;
}

/**
 * 发布管理服务类
 */
export class PublishService {
  private static instance: PublishService;
  private apiClient: ApiClient;

  private constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  public static getInstance(): PublishService {
    if (!PublishService.instance) {
      PublishService.instance = new PublishService();
    }
    return PublishService.instance;
  }

  /**
   * 获取 API 发布列表
   */
  public async getApiList(params: ApiPublishListRequest): Promise<ApiPublishListResponse> {
    return this.apiClient.post<ApiPublishListResponse>(API_ROUTES.API.LIST, params);
  }

  /**
   * API上下线
   */
  public async apiOnOff(params: ApiOnOffRequest): Promise<ApiOnOffResponse> {
    return this.apiClient.post<ApiOnOffResponse>(API_ROUTES.API.ON_OFF, params);
  }

  /**
   * 编辑API
   */
  public async editApi(params: ApiEditRequest): Promise<ApiEditResponse> {
    return this.apiClient.post<ApiEditResponse>(API_ROUTES.API.EDIT, params);
  }

  /**
   * 获取API调用记录
   */
  public async getApiRecords(params: ApiRecordsRequest): Promise<ApiRecordsResponse> {
    return this.apiClient.post<ApiRecordsResponse>(API_ROUTES.API.RECORDS, params);
  }

  /**
   * 获取API密钥列表
   */
  public async getApiSecretKeyList(params: ApiSecretKeyListRequest): Promise<ApiSecretKeyListResponse> {
    return this.apiClient.post<ApiSecretKeyListResponse>(API_ROUTES.API.SECRET_KEY_LIST, params);
  }

  /**
   * 创建API密钥
   */
  public async createApiSecretKey(params: ApiSecretKeyCreateRequest): Promise<ApiSecretKeyCreateResponse> {
    return this.apiClient.post<ApiSecretKeyCreateResponse>(API_ROUTES.API.SECRET_KEY_CREATE, params);
  }

  /**
   * 更新API密钥状态
   */
  public async updateApiSecretKeyStatus(params: ApiSecretKeyUpdateStatusRequest): Promise<ApiSecretKeyUpdateStatusResponse> {
    return this.apiClient.post<ApiSecretKeyUpdateStatusResponse>(API_ROUTES.API.SECRET_KEY_UPDATE_STATUS, params);
  }

  /**
   * 更新API密钥到期时间
   */
  public async updateApiSecretKeyExpiration(params: ApiSecretKeyUpdateExpirationTimeRequest): Promise<ApiSecretKeyUpdateExpirationTimeResponse> {
    return this.apiClient.post<ApiSecretKeyUpdateExpirationTimeResponse>(API_ROUTES.API.SECRET_KEY_UPDATE_EXPIRATION, params);
  }

  /**
   * 删除API密钥
   */
  public async deleteApiSecretKey(params: ApiSecretKeyDeleteRequest): Promise<ApiSecretKeyDeleteResponse> {
    return this.apiClient.post<ApiSecretKeyDeleteResponse>(API_ROUTES.API.SECRET_KEY_DELETE, params);
  }

  /**
   * 获取API历史版本
   */
  public async getApiHistory(params: ApiHistoryRequest): Promise<ApiHistoryResponse> {
    return this.apiClient.post<ApiHistoryResponse>(API_ROUTES.API.HISTORY, params);
  }

  /**
   * 调用API
   */
  public async callApi(params: ApiCallRequest): Promise<ApiCallResponse> {
    return this.apiClient.post<ApiCallResponse>(API_ROUTES.API.CALL, params);
  }

  /**
   * 获取API调用模板
   */
  public async getApiCallTemplate(params: ApiCallTemplateRequest): Promise<ApiCallTemplateResponse> {
    return this.apiClient.post<ApiCallTemplateResponse>(API_ROUTES.API.CALL_TEMPLATE, params);
  }

  /**
   * 导出API为curl
   */
  public async exportApiCurl(params: ApiExportCurlRequest): Promise<ApiExportCurlResponse> {
    return this.apiClient.post<ApiExportCurlResponse>(API_ROUTES.API.EXPORT_CURL, params);
  }

  /**
   * 获取API调用统计
   */
  public async getApiCallStatistics(params: ApiCallStatisticsRequest): Promise<ApiCallStatisticsResponse> {
    return this.apiClient.post<ApiCallStatisticsResponse>(API_ROUTES.API.CALL_STATISTICS, params);
  }

  /**
   * 获取 JOB 发布列表
   */
  public async getJobList(params: JobPublishListRequest): Promise<JobPublishListResponse> {
    return this.apiClient.post<JobPublishListResponse>(API_ROUTES.JOB.LIST, params);
  }
} 