import { CanvasDetailRequest, CanvasDetailResponse, CanvasDraftRequest, CanvasDraftResponse } from "../typings/canvas";
import { ApiClient } from './api-client';
import { API_ROUTES } from './api-routes';

interface CanvasRunRequest {
  id: string;
  params: Record<string, any>;
}

interface CanvasRunResponse {
  serialId: string;
  status: 'running' | 'completed' | 'failed';
}

// 单组件运行接口定义
export interface CanvasRunSingleRequest {
  id: string;                     // 空间ID
  nodeId: string;                 // 节点ID
  params: Record<string, any>;    // 组件运行参数
}

export interface CanvasRunSingleResponse {
  id: string;                     // 空间ID
  nodeId: string;                 // 节点ID
  result: {
    input: any;                   // 组件运行参数
    output: any;                  // 组件运行结果
    nodeId: string;               // 节点ID
    nodeName: string;             // 节点名称
    step: number;                 // 组件运行步骤
    error: string;                // 组件运行错误信息
    duration: number;             // 组件运行耗时
    status: string;               // 组件运行状态
    startTime: string;            // 组件运行开始时间
  };
}

interface CanvasTraceComponentsRequest {
  id: string;
  serialId: string;
}

interface CanvasTraceComponentsResponse {
  status: "running" | "pending" | string;
  records: Array<{
    input: object;
    output: object;
    nodeId: string;
    nodeType: string;
    nodeName: string;
    step: number;
    startTime: string;
    duration: number;
    error: string;
    endTime: string;
    status: string;
    subIndex: number;
  }>;
}

// 运行历史相关接口定义
export interface GetCanvasRunHistoryRequest {
  workSpaceId: string;
}

export interface RunHistoryRecord {
  id: string;
  startTime: string;
  duration: number;
  status: string;
  componentCount: number;
}

export interface GetCanvasRunHistoryResponse {
  records: RunHistoryRecord[];
}

export interface GetCanvasRunDetailRequest {
  recordId: string;
}

export interface ComponentExecutionDetail {
  id: string;
  index: number;
  name: string;
  logic: string;
  startTime: number; // 时间戳
  duration: number;
  status: string;
  error: string;
  input: any;
  output: any;
  components?: ComponentExecutionDetail[] | null;
}

export interface GetCanvasRunDetailResponse {
  id: string;
  startTime: string;
  duration: number;
  status: string;
  error: string;
  components: ComponentExecutionDetail[];
}

// API发布相关接口定义
export interface ApiPublishRequest {
  id: string;      // 空间ID
  apiName: string; // 名称
  apiDesc: string; // 描述
  tag: string[];   // 标签
}

export interface ApiPublishResponse {
  apiId: string;
}

/**
 * 画布服务类
 * 负责处理画布相关的所有操作，包括获取详情、保存草稿、运行等
 */
export class CanvasService {
  private static instance: CanvasService;
  private apiClient: ApiClient;

  private constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  public static getInstance(): CanvasService {
    if (!CanvasService.instance) {
      CanvasService.instance = new CanvasService();
    }
    return CanvasService.instance;
  }

  /**
   * 获取画布详情
   */
  public async getDetail(request: CanvasDetailRequest): Promise<CanvasDetailResponse> {
    try {
      const result = await this.apiClient.post<CanvasDetailResponse>(
        API_ROUTES.CANVAS.DETAIL,
        request
      );

      if (!result || !result.graph) {
        throw new Error("画布数据格式不正确");
      }

      return result;
    } catch (error) {
      console.error("获取画布详情失败，返回默认画布内容:", error);
      
      // 返回默认画布内容
      const defaultCanvasResponse: CanvasDetailResponse = {
        id: request.id,
        name: '默认工作流',
        graph: {
          nodes: [
            {
              id: "start_0",
              type: "start",
              meta: {
                position: {
                  x: 180,
                  y: 0
                }
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
                position: {
                  x: 640,
                  y: 0
                }
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
        }
      };
      
      console.log("返回默认画布内容:", defaultCanvasResponse);
      return defaultCanvasResponse;
    }
  }

  /**
   * 查询组件运行结果
   */
  public async getTraceComponents(request: CanvasTraceComponentsRequest): Promise<CanvasTraceComponentsResponse> {
    try {
      const result = await this.apiClient.post<CanvasTraceComponentsResponse>(
        API_ROUTES.CANVAS.TRACE_COMPONENTS,
        {
          id: request.id,
          serialId: request.serialId
        }
      );
      return result || { records: [] };
    } catch (error) {
      console.error("查询组件运行结果失败:", error);
      throw error;
    }
  }

  /**
   * 保存画布草稿
   */
  public async saveDraft(request: CanvasDraftRequest): Promise<CanvasDraftResponse> {
    try {
      const result = await this.apiClient.post<CanvasDraftResponse>(
        API_ROUTES.CANVAS.DRAFT,
        request
      );
      return {
        success: true,
        message: "保存成功",
      };
    } catch (error) {
      console.error("保存画布草稿失败:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "保存失败",
      };
    }
  }

  /**
   * 运行画布
   */
  public async run(params: CanvasRunRequest): Promise<CanvasRunResponse> {
    return this.apiClient.post<CanvasRunResponse>(
      API_ROUTES.CANVAS.RUN,
      params
    );
  }

  /**
   * 单组件运行
   */
  public async runSingle(request: CanvasRunSingleRequest): Promise<CanvasRunSingleResponse> {
    try {
      const result = await this.apiClient.post<CanvasRunSingleResponse>(
        API_ROUTES.CANVAS.RUN_SINGLE,
        request
      );
      return result;
    } catch (error) {
      console.error("单组件运行失败:", error);
      throw error;
    }
  }

  async getExecutionResults(request: { id: string; serialId: string; params: Record<string, any> }): Promise<any> {
    const result = await this.apiClient.post<any>(`/canvas/execution-results`, request);
    return result;
  }

  /**
   * 获取画布运行历史
   */
  public async getRunHistory(workSpaceId: string): Promise<GetCanvasRunHistoryResponse> {
    try {
      const result = await this.apiClient.get<GetCanvasRunHistoryResponse>(
        `${API_ROUTES.CANVAS.RUN_HISTORY}/${workSpaceId}`
      );
      return result;
    } catch (error) {
      console.error("获取运行历史失败:", error);
      throw error;
    }
  }

  /**
   * 获取画布运行详情
   */
  public async getRunDetail(recordId: string): Promise<GetCanvasRunDetailResponse> {
    try {
      const result = await this.apiClient.get<GetCanvasRunDetailResponse>(
        `${API_ROUTES.CANVAS.RUN_DETAIL}/${recordId}`
      );
      return result;
    } catch (error) {
      console.error("获取运行详情失败:", error);
      throw error;
    }
  }

  /**
   * 发布API
   */
  public async publishApi(request: ApiPublishRequest): Promise<ApiPublishResponse> {
    try {
      const result = await this.apiClient.post<ApiPublishResponse>(
        API_ROUTES.API.PUBLISH,
        request
      );
      return result;
    } catch (error) {
      console.error("发布API失败:", error);
      throw error;
    }
  }
}
