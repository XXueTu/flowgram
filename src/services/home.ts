import { ApiClient } from './api-client';
import { API_ROUTES } from './api-routes';

// 系统信息接口
export interface SystemInfo {
  cpu: string;    // CPU使用率
  memory: string; // 内存使用率
  disk: string;   // 磁盘使用率
}

// 首页统计请求接口
export interface GetHomeStatisticsRequest {
  // 空请求体
}

// 首页统计响应接口
export interface GetHomeStatisticsResponse {
  workspaceCount: number;  // 工作空间数量
  datasourceCount: number; // 数据源数量
  apiCount: number;        // 接口数量
  jobCount: number;        // 任务数量
  userCount: number;       // 用户数量
  message: string[];       // 消息列表
  systemInfo: SystemInfo;  // 系统信息
}

// 首页统计服务类
export class HomeService {
  private static instance: HomeService;
  private apiClient: ApiClient;

  private constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  public static getInstance(): HomeService {
    if (!HomeService.instance) {
      HomeService.instance = new HomeService();
    }
    return HomeService.instance;
  }

  /**
   * 获取首页统计数据
   */
  async getHomeStatistics(params: GetHomeStatisticsRequest = {}): Promise<GetHomeStatisticsResponse> {
    return await this.apiClient.get<GetHomeStatisticsResponse>(
      API_ROUTES.HOME.STATISTICS,
      params
    );
  }
}

// 导出服务实例
export const homeService = HomeService.getInstance(); 