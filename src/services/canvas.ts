import { CanvasDetailRequest, CanvasDetailResponse, CanvasDraftRequest, CanvasDraftResponse } from '../typings/canvas';

const API_BASE_URL = 'http://127.0.0.1:8888/workflow';

interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
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
      console.log('开始请求画布详情:', request);
      const response = await fetch(`${API_BASE_URL}/canvas/detail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      console.log('接口响应状态:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json() as ApiResponse<CanvasDetailResponse>;
      console.log('接口返回数据:', result);

      if (result.code !== 0) {
        throw new Error(result.msg || '获取画布详情失败');
      }

      if (!result.data || !result.data.graph) {
        console.error('接口返回数据格式不正确:', result);
        throw new Error('画布数据格式不正确');
      }

      return result.data;
    } catch (error) {
      console.error('获取画布详情失败:', error);
      throw error;
    }
  }

  /**
   * 保存画布草稿
   * @param request 保存请求参数
   */
  public async saveDraft(request: CanvasDraftRequest): Promise<CanvasDraftResponse> {
    try {
      console.log('开始保存画布:', request);
      const response = await fetch(`${API_BASE_URL}/canvas/draft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      console.log('保存接口响应状态:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json() as ApiResponse<CanvasDraftResponse>;
      console.log('保存接口返回数据:', result);

      if (result.code !== 0) {
        throw new Error(result.msg || '保存失败');
      }

      return {
        success: true,
        message: '保存成功',
      }
    } catch (error) {
      console.error('保存画布草稿失败:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : '保存失败',
      };
    }
  }
} 