import { ApiClient } from './api-client';
import { API_ROUTES } from './api-routes';

export interface Case {
  workspaceId: string;
  caseId: string;
  caseName: string;
  caseParams: string;
  createAt: string;
  updateAt: string;
  createBy: string;
  updateBy: string;
}

export interface CaseCreateRequest {
  workspaceId: string;
  caseName: string;
  caseParams: string;
}

export interface CaseCreateResponse {
  caseId: string;
}

export interface CaseListRequest {
  workspaceId: string;
}

export interface CaseListResponse {
  caseList: Case[];
}

export interface CaseDetailRequest {
  caseId: string;
}

export interface CaseDetailResponse {
  case: Case;
}

export interface CaseDeleteRequest {
  caseId: string;
}

export interface CaseDeleteResponse {
  success: boolean;
}

export interface CaseEditRequest {
  caseId: string;
  caseName: string;
  caseParams: string;
}

export interface CaseEditResponse {
  success: boolean;
}

/**
 * 用例服务类
 * 负责处理用例相关的所有操作，包括创建、编辑、删除、查询等
 */
export class CaseService {
  private static instance: CaseService;
  private apiClient: ApiClient;

  private constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  public static getInstance(): CaseService {
    if (!CaseService.instance) {
      CaseService.instance = new CaseService();
    }
    return CaseService.instance;
  }

  /**
   * 创建用例
   */
  public async createCase(data: CaseCreateRequest): Promise<CaseCreateResponse> {
    try {
      console.log("开始创建用例:", data);
      const result = await this.apiClient.post<CaseCreateResponse>(
        API_ROUTES.CASE.PUBLISH,
        data
      );
      console.log("创建用例返回数据:", result);
      return result;
    } catch (error) {
      console.error("创建用例失败:", error);
      throw error;
    }
  }

  /**
   * 获取用例列表
   */
  public async listCases(data: CaseListRequest): Promise<CaseListResponse> {
    try {
      console.log("开始获取用例列表:", data);
      const result = await this.apiClient.post<CaseListResponse>(
        API_ROUTES.CASE.LIST,
        data
      );
      console.log("获取用例列表返回数据:", result);
      return result;
    } catch (error) {
      console.error("获取用例列表失败:", error);
      throw error;
    }
  }

  /**
   * 获取用例详情
   */
  public async getCaseDetail(data: CaseDetailRequest): Promise<CaseDetailResponse> {
    try {
      console.log("开始获取用例详情:", data);
      const result = await this.apiClient.post<CaseDetailResponse>(
        API_ROUTES.CASE.DETAIL,
        data
      );
      console.log("获取用例详情返回数据:", result);
      return result;
    } catch (error) {
      console.error("获取用例详情失败:", error);
      throw error;
    }
  }

  /**
   * 删除用例
   */
  public async deleteCase(data: CaseDeleteRequest): Promise<CaseDeleteResponse> {
    try {
      console.log("开始删除用例:", data);
      const result = await this.apiClient.post<CaseDeleteResponse>(
        API_ROUTES.CASE.DELETE,
        data
      );
      console.log("删除用例返回数据:", result);
      return result;
    } catch (error) {
      console.error("删除用例失败:", error);
      throw error;
    }
  }

  /**
   * 编辑用例
   */
  public async editCase(data: CaseEditRequest): Promise<CaseEditResponse> {
    try {
      console.log("开始编辑用例:", data);
      const result = await this.apiClient.post<CaseEditResponse>(
        API_ROUTES.CASE.EDIT,
        data
      );
      console.log("编辑用例返回数据:", result);
      return result;
    } catch (error) {
      console.error("编辑用例失败:", error);
      throw error;
    }
  }
}
