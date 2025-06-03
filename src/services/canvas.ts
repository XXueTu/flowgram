import axios from "axios";
import { CanvasDetailRequest, CanvasDetailResponse, CanvasDraftRequest, CanvasDraftResponse } from "../typings/canvas";

const API_BASE_URL = "http://10.8.0.61:8888/workflow";

interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

interface CanvasRunRequest {
  id: string;
  params: Record<string, any>;
}

interface CanvasRunResponse {
  nodes: Array<{
    id: string;
    inputs: Record<string, any>;
    outputs: Record<string, any>;
  }>;
}

export class CanvasService {
  private static instance: CanvasService;
  private constructor() {}

  public static getInstance(): CanvasService {
    if (!CanvasService.instance) {
      CanvasService.instance = new CanvasService();
    }
    return CanvasService.instance;
  }

  /**
   * 获取画布详情
   * @param request 请求参数
   */
  public async getDetail(request: CanvasDetailRequest): Promise<CanvasDetailResponse> {
    try {
      console.log("开始请求画布详情:", request);
      const response = await axios.post(`${API_BASE_URL}/canvas/detail`, request);
      console.log("接口响应状态:", response.status);
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = response.data as ApiResponse<CanvasDetailResponse>;
      console.log("接口返回数据:", result);

      if (!result.data || !result.data.graph) {
        console.error("接口返回数据格式不正确:", result);
        throw new Error("画布数据格式不正确");
      }

      return result.data;
    } catch (error) {
      console.error("获取画布详情失败:", error);
      throw error;
    }
  }

  /**
   * 保存画布草稿
   * @param request 保存请求参数
   */
  public async saveDraft(request: CanvasDraftRequest): Promise<CanvasDraftResponse> {
    try {
      console.log("开始保存画布:", request);
      const response = await axios.post(`${API_BASE_URL}/canvas/draft`, request);

      console.log("保存接口响应状态:", response.status);

      const result = (await response.data) as ApiResponse<CanvasDraftResponse>;
      console.log("保存接口返回数据:", result);

      if (result.code !== 0) {
        throw new Error(result.msg || "保存失败");
      }

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

  async run(params: CanvasRunRequest) {
    const response = await axios.post(`${API_BASE_URL}/canvas/run`, params);
    return response.data;
  }
}
