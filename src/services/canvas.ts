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
  }>;
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
      console.log("开始请求画布详情:", request);
      const result = await this.apiClient.post<CanvasDetailResponse>(
        API_ROUTES.CANVAS.DETAIL,
        request
      );
      console.log("接口返回数据:", result);

      if (!result || !result.graph) {
        throw new Error("画布数据格式不正确");
      }

      return result;
    } catch (error) {
      console.error("获取画布详情失败:", error);
      throw error;
    }
  }

  /**
   * 查询组件运行结果
   */
  public async getTraceComponents(request: CanvasTraceComponentsRequest): Promise<CanvasTraceComponentsResponse> {
    try {
      console.log("开始查询组件运行结果:", request);
      const result = await this.apiClient.post<CanvasTraceComponentsResponse>(
        API_ROUTES.CANVAS.TRACE_COMPONENTS,
        {
          id: request.id,
          serialId: request.serialId
        }
      );
      console.log("组件运行结果接口返回数据:", result);
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
      console.log("开始保存画布:", request);
      const result = await this.apiClient.post<CanvasDraftResponse>(
        API_ROUTES.CANVAS.DRAFT,
        request
      );
      console.log("保存接口返回数据:", result);
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
}
