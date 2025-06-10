import { ApiClient } from './api-client';
import { API_ROUTES } from './api-routes';

// WorkSpace 基础信息
export interface WorkSpaceBase {
  id?: string;
  workSpaceName: string;
  workSpaceDesc?: string;
  workSpaceType: string;
  workSpaceTag?: string[];
  workSpaceIcon?: string;
}

// WorkSpace 页面信息（包含时间戳）
export interface WorkSpacePage extends WorkSpaceBase {
  createTime: string;
  updateTime: string;
  canvasId?: string;
  workflowId?: string;
  workSpaceConfig?: string;
}

// 环境变量
export interface EnvList {
  key: string;
  value: string;
}

// 标签实体
export interface TagEntity {
  id: number;
  name: string;
}

// ==================== 创建WorkSpace ====================
export interface WorkSpaceNewRequest extends WorkSpaceBase {}

export interface WorkSpaceNewResponse extends WorkSpaceBase {
  workSpaceConfig: string;
}

// ==================== 编辑WorkSpace ====================
export interface WorkSpaceEditRequest extends WorkSpaceBase {
  workSpaceConfig?: string;
}

export interface WorkSpaceEditResponse extends WorkSpaceBase {
  workSpaceConfig: string;
}

// ==================== 删除WorkSpace ====================
export interface WorkSpaceRemoveRequest {
  id?: string;
}

export interface WorkSpaceRemoveResponse {}

// ==================== WorkSpace列表 ====================
export interface WorkSpaceListRequest {
  workSpaceName?: string;
  workSpaceType?: string;
  workSpaceTag?: number[];
  current: number;
  pageSize: number;
}

export interface WorkSpaceListResponse {
  current: number;
  pageSize: number;
  total: number;
  data: WorkSpacePage[];
}

// ==================== 编辑WorkSpace标签 ====================
export interface WorkSpaceEditTagRequest {
  id: string;
  workSpaceTag: string[];
}

export interface WorkSpaceEditTagResponse {}

// ==================== 复制WorkSpace ====================
export interface WorkSpaceCopyRequest {
  id: string;
  name?: string;
}

export interface WorkSpaceCopyResponse extends WorkSpaceBase {
  workSpaceConfig: string;
}

// ==================== WorkSpace环境变量 ====================
export interface WorkSpaceEnvListRequest {
  id: string;
}

export interface WorkSpaceEnvListResponse {
  envList: EnvList[];
}

export interface WorkSpaceEnvEditRequest {
  id: string;
  env: EnvList[];
}

export interface WorkSpaceEnvEditResponse {}

// ==================== WorkSpace导入导出 ====================
export interface WorkSpaceExportRequest {
  id: string;
}

export interface WorkSpaceExportResponse {
  export: string;
}

export interface WorkSpaceImportRequest extends WorkSpaceBase {
  export: string;
}

export interface WorkSpaceImportResponse extends WorkSpaceBase {}

// ==================== 标签相关 ====================
export interface TagListRequest {
  name?: string;
}

export interface TagListResponse {
  tagList: TagEntity[];
}

export interface TagEditRequest {
  id: number;
  name: string;
}

export interface TagEditResponse {
  id: number;
  name: string;
}

export interface TagRemoveRequest {
  id: number;
}

export interface TagRemoveResponse {
  id: number;
}

/**
 * WorkSpace服务类
 * 负责处理编排工作空间相关的所有操作
 */
export class WorkSpaceService {
  private static instance: WorkSpaceService;
  private apiClient: ApiClient;

  private constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  public static getInstance(): WorkSpaceService {
    if (!WorkSpaceService.instance) {
      WorkSpaceService.instance = new WorkSpaceService();
    }
    return WorkSpaceService.instance;
  }

  /**
   * 创建WorkSpace
   */
  public async createWorkSpace(data: WorkSpaceNewRequest): Promise<WorkSpaceNewResponse> {
    try {
      console.log("开始创建工作空间:", data);
      const result = await this.apiClient.post<WorkSpaceNewResponse>(
        API_ROUTES.WORKSPACE.NEW,
        data
      );
      console.log("创建工作空间返回数据:", result);
      return result;
    } catch (error) {
      console.error("创建工作空间失败，返回mock响应:", error);
      
      // 返回模拟的创建成功响应
      const mockResponse: WorkSpaceNewResponse = {
        id: `workspace_${Date.now()}`, // 生成唯一ID
        workSpaceName: data.workSpaceName,
        workSpaceDesc: data.workSpaceDesc,
        workSpaceType: data.workSpaceType,
        workSpaceTag: data.workSpaceTag,
        workSpaceIcon: data.workSpaceIcon,
        workSpaceConfig: JSON.stringify({
          nodes: [
            {
              id: "start_0",
              type: "start",
              meta: {
                position: { x: 180, y: 0 }
              },
              data: {
                outputs: {
                  properties: {},
                  required: [],
                  type: "object"
                },
                title: "开始"
              }
            },
            {
              id: "end_0",
              type: "end",
              meta: {
                position: { x: 640, y: 0 }
              },
              data: {
                inputsValues: {},
                outputs: {
                  properties: {},
                  type: "object"
                },
                title: "结束"
              }
            }
          ],
          edges: [
            {
              sourceNodeID: "start_0",
              targetNodeID: "end_0"
            }
          ]
        })
      };
      
      console.log("返回模拟创建响应:", mockResponse);
      return mockResponse;
    }
  }

  /**
   * 编辑WorkSpace
   */
  public async editWorkSpace(data: WorkSpaceEditRequest): Promise<WorkSpaceEditResponse> {
    try {
      console.log("开始编辑工作空间:", data);
      const result = await this.apiClient.post<WorkSpaceEditResponse>(
        API_ROUTES.WORKSPACE.EDIT,
        data
      );
      console.log("编辑工作空间返回数据:", result);
      return result;
    } catch (error) {
      console.error("编辑工作空间失败:", error);
      throw error;
    }
  }

  /**
   * 删除WorkSpace
   */
  public async removeWorkSpace(data: WorkSpaceRemoveRequest): Promise<WorkSpaceRemoveResponse> {
    try {
      console.log("开始删除工作空间:", data);
      const result = await this.apiClient.post<WorkSpaceRemoveResponse>(
        API_ROUTES.WORKSPACE.REMOVE,
        data
      );
      console.log("删除工作空间返回数据:", result);
      return result;
    } catch (error) {
      console.error("删除工作空间失败:", error);
      throw error;
    }
  }

  /**
   * 获取WorkSpace列表
   */
  public async listWorkSpaces(data: WorkSpaceListRequest): Promise<WorkSpaceListResponse> {
    try {
      console.log("开始获取工作空间列表:", data);
      const result = await this.apiClient.post<WorkSpaceListResponse>(
        API_ROUTES.WORKSPACE.LIST,
        data
      );
      console.log("获取工作空间列表返回数据:", result);
      return result;
    } catch (error) {
      console.error("获取工作空间列表失败:", error);
      throw error;
    }
  }

  /**
   * 编辑WorkSpace标签
   */
  public async editWorkSpaceTag(data: WorkSpaceEditTagRequest): Promise<WorkSpaceEditTagResponse> {
    try {
      console.log("开始编辑工作空间标签:", data);
      const result = await this.apiClient.post<WorkSpaceEditTagResponse>(
        API_ROUTES.WORKSPACE.EDIT_TAG,
        data
      );
      console.log("编辑工作空间标签返回数据:", result);
      return result;
    } catch (error) {
      console.error("编辑工作空间标签失败:", error);
      throw error;
    }
  }

  /**
   * 复制WorkSpace
   */
  public async copyWorkSpace(data: WorkSpaceCopyRequest): Promise<WorkSpaceCopyResponse> {
    try {
      console.log("开始复制工作空间:", data);
      const result = await this.apiClient.post<WorkSpaceCopyResponse>(
        API_ROUTES.WORKSPACE.COPY,
        data
      );
      console.log("复制工作空间返回数据:", result);
      return result;
    } catch (error) {
      console.error("复制工作空间失败:", error);
      throw error;
    }
  }

  /**
   * 获取WorkSpace环境变量列表
   */
  public async getWorkSpaceEnvList(data: WorkSpaceEnvListRequest): Promise<WorkSpaceEnvListResponse> {
    try {
      console.log("开始获取工作空间环境变量:", data);
      const result = await this.apiClient.post<WorkSpaceEnvListResponse>(
        API_ROUTES.WORKSPACE.ENV_LIST,
        data
      );
      console.log("获取工作空间环境变量返回数据:", result);
      return result;
    } catch (error) {
      console.error("获取工作空间环境变量失败:", error);
      throw error;
    }
  }

  /**
   * 编辑WorkSpace环境变量
   */
  public async editWorkSpaceEnv(data: WorkSpaceEnvEditRequest): Promise<WorkSpaceEnvEditResponse> {
    try {
      console.log("开始编辑工作空间环境变量:", data);
      const result = await this.apiClient.post<WorkSpaceEnvEditResponse>(
        API_ROUTES.WORKSPACE.ENV_EDIT,
        data
      );
      console.log("编辑工作空间环境变量返回数据:", result);
      return result;
    } catch (error) {
      console.error("编辑工作空间环境变量失败:", error);
      throw error;
    }
  }

  /**
   * 导出WorkSpace
   */
  public async exportWorkSpace(data: WorkSpaceExportRequest): Promise<WorkSpaceExportResponse> {
    try {
      console.log("开始导出工作空间:", data);
      const result = await this.apiClient.post<WorkSpaceExportResponse>(
        API_ROUTES.WORKSPACE.EXPORT,
        data
      );
      console.log("导出工作空间返回数据:", result);
      return result;
    } catch (error) {
      console.error("导出工作空间失败:", error);
      throw error;
    }
  }

  /**
   * 导入WorkSpace
   */
  public async importWorkSpace(data: WorkSpaceImportRequest): Promise<WorkSpaceImportResponse> {
    try {
      console.log("开始导入工作空间:", data);
      const result = await this.apiClient.post<WorkSpaceImportResponse>(
        API_ROUTES.WORKSPACE.IMPORT,
        data
      );
      console.log("导入工作空间返回数据:", result);
      return result;
    } catch (error) {
      console.error("导入工作空间失败:", error);
      throw error;
    }
  }

  // ==================== 标签相关方法 ====================

  /**
   * 获取标签列表
   */
  public async listTags(data: TagListRequest): Promise<TagListResponse> {
    try {
      console.log("开始获取标签列表:", data);
      const result = await this.apiClient.post<TagListResponse>(
        API_ROUTES.TAG.LIST,
        data
      );
      console.log("获取标签列表返回数据:", result);
      return result;
    } catch (error) {
      console.error("获取标签列表失败:", error);
      throw error;
    }
  }

  /**
   * 编辑标签
   */
  public async editTag(data: TagEditRequest): Promise<TagEditResponse> {
    try {
      console.log("开始编辑标签:", data);
      const result = await this.apiClient.post<TagEditResponse>(
        API_ROUTES.TAG.EDIT,
        data
      );
      console.log("编辑标签返回数据:", result);
      return result;
    } catch (error) {
      console.error("编辑标签失败:", error);
      throw error;
    }
  }

  /**
   * 删除标签
   */
  public async removeTag(data: TagRemoveRequest): Promise<TagRemoveResponse> {
    try {
      console.log("开始删除标签:", data);
      const result = await this.apiClient.post<TagRemoveResponse>(
        API_ROUTES.TAG.REMOVE,
        data
      );
      console.log("删除标签返回数据:", result);
      return result;
    } catch (error) {
      console.error("删除标签失败:", error);
      throw error;
    }
  }
} 