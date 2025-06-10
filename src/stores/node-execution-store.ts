import { create } from "zustand";
import { CanvasService } from "../services/canvas";
import { RunningService } from "../services/running-service";

// 定义节点状态类型
export type NodeStatus = "idle" | "pending" | "running" | "paused" | "completed" | "failed" | "canceled" | "waiting" | "success" | "error";

// 节点执行记录接口
export interface NodeExecutionRecord {
  nodeId: string;
  status: NodeStatus;
  startTime?: number;
  endTime?: number;
  error?: string;
  inputs?: Record<string, any>;
  outputs?: Record<string, any>;
  duration?: number;
  subIndex?: number; // 新增：迭代索引，-1表示主画布组件，>=0表示loop内子组件的迭代索引
}

interface NodeExecutionState {
  // 存储所有节点的执行记录，key格式为 nodeId 或 nodeId-subIndex
  nodeRecords: Record<string, NodeExecutionRecord>;

  // 加载状态
  loading: boolean;

  // 运行状态
  isRunning: boolean;

  // 获取节点执行详情
  fetchNodeExecutionDetails: (nodeId: string, canvasId?: string) => Promise<void>;

  // 获取所有节点的执行详情（用于运行后刷新所有节点状态）
  fetchAllNodeExecutionDetails: (data: { id: string; serialId: string; params: Record<string, any> }) => Promise<void>;

  // 运行工作流（包含完整的运行逻辑）
  runWorkflow: (params?: Record<string, any>, canvasId?: string, serialId?: string) => Promise<void>;

  // 更新节点视觉状态
  updateNodeVisualStatus: (canvasId: string, nodeId: string, status: NodeStatus) => void;

  // 更新线视觉状态
  updateLineVisualStatus: (canvasId: string) => void;

  // 清除节点记录
  clearNodeRecord: (canvasId: string, nodeId: string) => void;

  // 清除所有记录
  clearAllRecords: () => void;

  // 设置文档引用（用于更新视觉状态）
  setDocument: (document: any) => void;

  // 文档引用
  document?: any;

  // 获取特定节点的执行记录
  getNodeRecord: (canvasId: string, nodeId: string, subIndex?: number) => NodeExecutionRecord | undefined;
}

// API状态到内部状态的映射
const mapStatusFromApi = (apiStatus: string): NodeStatus => {
  switch (apiStatus.toLowerCase()) {
    case "pending":
      return "pending";
    case "running":
      return "running";
    case "paused":
      return "paused";
    case "completed":
      return "completed";
    case "failed":
      return "failed";
    case "canceled":
      return "canceled";
    case "waiting":
      return "waiting";
    case "success":
      return "success";
    case "error":
      return "error";
    default:
      return "idle";
  }
};

// 生成存储key的辅助函数
const generateRecordKey = (canvasId: string, nodeId: string, subIndex?: number): string => {
  const baseKey = `${canvasId}:${nodeId}`;
  if (subIndex === undefined || subIndex === -1) {
    return baseKey;
  }
  return `${baseKey}-${subIndex}`;
};

export const useNodeExecutionStore = create<NodeExecutionState>((set, get) => ({
  nodeRecords: {},
  loading: false,
  isRunning: false,
  document: undefined,

  setDocument: (document: any) => {
    set({ document });
  },

  fetchNodeExecutionDetails: async (nodeId: string, canvasId = "default") => {
    try {
      set({ loading: true });
      const canvasService = CanvasService.getInstance();
      const runningService = new RunningService();
      const serialId = runningService.getCurrentSerialId();

      if (!serialId) {
        console.warn('No active execution found');
        return;
      }

      const response = await canvasService.getTraceComponents({
        id: canvasId,
        serialId,
      });

      // 查找当前节点的所有记录（包括迭代记录）
      const nodeRecords = response.records?.filter((record) => record.nodeId === nodeId) || [];

      if (nodeRecords.length > 0) {
        const newRecords: Record<string, NodeExecutionRecord> = {};

        nodeRecords.forEach((record) => {
          const executionRecord: NodeExecutionRecord = {
            nodeId,
            status: mapStatusFromApi(record.status),
            startTime: record.startTime ? new Date(record.startTime).getTime() : undefined,
            endTime: record.endTime ? new Date(record.endTime).getTime() : undefined,
            error: record.error || undefined,
            inputs: record.input || {},
            outputs: record.output || {},
            duration: record.duration,
            subIndex: record.subIndex,
          };

          const recordKey = generateRecordKey(canvasId, nodeId, record.subIndex);
          newRecords[recordKey] = executionRecord;
        });

        set((state) => ({
          nodeRecords: {
            ...state.nodeRecords,
            ...newRecords,
          },
        }));
      } else {
        // 如果没找到记录，设置为默认状态
        const recordKey = generateRecordKey(canvasId, nodeId);
        set((state) => ({
          nodeRecords: {
            ...state.nodeRecords,
            [recordKey]: {
              nodeId,
              status: "idle",
              subIndex: -1,
            },
          },
        }));
      }
    } catch (error) {
      console.error("获取节点执行详情失败:", error);

      // 设置错误状态
      const recordKey = generateRecordKey(canvasId, nodeId);
      set((state) => ({
        nodeRecords: {
          ...state.nodeRecords,
          [recordKey]: {
            nodeId,
            status: "error",
            error: error instanceof Error ? error.message : "获取执行详情失败",
            subIndex: -1,
          },
        },
      }));
    } finally {
      set({ loading: false });
    }
  },

  fetchAllNodeExecutionDetails: async (data: { id: string; serialId: string; params: Record<string, any> }) => {
    const MAX_POLL_COUNT = 300; // 最大轮询次数 (300次 * 2秒 = 10分钟)
    let pollCount = 0;

    const pollForResult = async (): Promise<void> => {
      try {
        pollCount++;

        const canvasService = CanvasService.getInstance();
        const response = await canvasService.getTraceComponents({
          id: data.id,
          serialId: data.serialId,
        });

        // 处理所有节点的记录（包括迭代记录）
        if (response.records && response.records.length > 0) {
          const newNodeRecords: Record<string, NodeExecutionRecord> = {};
          
          response.records.forEach((record, index) => {
            const executionRecord: NodeExecutionRecord = {
              nodeId: record.nodeId,
              status: mapStatusFromApi(record.status),
              startTime: record.startTime ? new Date(record.startTime).getTime() : undefined,
              endTime: record.endTime ? new Date(record.endTime).getTime() : undefined,
              error: record.error || undefined,
              inputs: record.input || {},
              outputs: record.output || {},
              duration: record.duration,
              subIndex: record.subIndex,
            };

            const recordKey = generateRecordKey(data.id, record.nodeId, record.subIndex);
            newNodeRecords[recordKey] = executionRecord;
          });

          set((state) => ({
            nodeRecords: {
              ...state.nodeRecords,
              ...newNodeRecords,
            },
          }));

          // 更新节点和线的视觉状态
          get().updateNodeVisualStatus(data.id, "", "idle"); // 更新所有节点
          get().updateLineVisualStatus(data.id);
        }

        // 检查是否需要继续轮询
        const shouldContinuePolling = (response.status === "pending" || response.status === "running") && pollCount < MAX_POLL_COUNT;

        if (shouldContinuePolling) {
          setTimeout(pollForResult, 2000); // 2秒后重新轮询
        } else {
          if (pollCount >= MAX_POLL_COUNT) {
            console.warn("已达到最大轮询次数，停止轮询");
          }
          set({ loading: false });
        }
      } catch (error) {
        console.error("获取所有节点执行详情失败:", error);

        // 如果轮询次数未超限且不是运行状态，则停止轮询
        if (pollCount >= MAX_POLL_COUNT || !get().isRunning) {
          set({ loading: false });
        } else {
          // 否则继续重试（网络错误等临时问题）
          setTimeout(pollForResult, 2000);
        }
      }
    };

    try {
      set({ loading: true });
      await pollForResult();
    } catch (error) {
      set({ loading: false });
    }
  },

  runWorkflow: async (params = {}, canvasId = "default", serialId?: string) => {
    const state = get();
    try {
      set({ isRunning: true });

      // 清空之前的状态
      set({ nodeRecords: {} });

      // 清除所有节点的视觉状态
      if (state.document) {
        Object.keys(state.nodeRecords).forEach((nodeId) => {
          const node = state.document.getNode(nodeId);
          if (node) {
            node.renderData.node.classList.remove("node-idle", "node-waiting", "node-running", "node-success", "node-error");
          }
        });
      }

      // 调用后端 API 开始运行
      const canvasService = CanvasService.getInstance();
      const runRes = await canvasService.run({
        id: canvasId,
        params,
      });

      // 获取执行结果（包含轮询逻辑）
      await get().fetchAllNodeExecutionDetails({
        id: canvasId,
        serialId: serialId || runRes.serialId,
        params,
      });
    } catch (error) {
      throw error;
    } finally {
      set({ isRunning: false });
    }
  },

  updateNodeVisualStatus: (canvasId: string, nodeId: string, status: NodeStatus) => {
    const state = get();
    if (!state.document) return;

    if (nodeId) {
      // 更新单个节点
      const node = state.document.getNode(nodeId);
      if (node) {
        node.renderData.node.classList.remove("node-idle", "node-waiting", "node-running", "node-success", "node-error");
        node.renderData.node.classList.add(`node-${status}`);
      }
    } else {
      // 更新所有节点（仅限当前画布）
      Object.entries(state.nodeRecords).forEach(([key, record]) => {
        if (key.startsWith(`${canvasId}:`)) {
          const node = state.document.getNode(record.nodeId);
          if (node) {
            node.renderData.node.classList.remove("node-idle", "node-waiting", "node-running", "node-success", "node-error");
            node.renderData.node.classList.add(`node-${record.status}`);
          }
        }
      });
    }

    state.document.linesManager.forceUpdate();
  },

  updateLineVisualStatus: (canvasId: string) => {
    const state = get();
    if (!state.document) return;

    // 获取当前画布的所有节点的输出线并更新状态
    Object.entries(state.nodeRecords).forEach(([key, record]) => {
      if (key.startsWith(`${canvasId}:`)) {
        const node = state.document.getNode(record.nodeId);
        if (node) {
          try {
            const outputLines = node.getData({ key: "WorkflowNodeLinesData" })?.outputLines || [];

            outputLines.forEach((line: any) => {
              try {
                // 移除之前的状态
                line.renderData?.element?.classList?.remove("line-flowing", "line-success", "line-error");

                // 根据当前节点状态决定线的状态
                if (record.status === "success") {
                  line.renderData?.element?.classList?.add("line-success");
                } else if (record.status === "error") {
                  line.renderData?.element?.classList?.add("line-error");
                } else if (record.status === "running") {
                  line.renderData?.element?.classList?.add("line-flowing");
                }
              } catch (e) {
                // 忽略错误，继续执行
              }
            });
          } catch (e) {
            // 忽略错误，继续执行
          }
        }
      }
    });

    state.document.linesManager.forceUpdate();
  },

  clearNodeRecord: (canvasId: string, nodeId: string) => {
    set((state) => {
      const newRecords = { ...state.nodeRecords };
      // 删除主记录和所有迭代记录，使用新的key格式
      const baseKey = `${canvasId}:${nodeId}`;
      Object.keys(newRecords).forEach(key => {
        if (key === baseKey || key.startsWith(`${baseKey}-`)) {
          delete newRecords[key];
        }
      });
      return { nodeRecords: newRecords };
    });
  },

  clearAllRecords: () => {
    set({ nodeRecords: {} });
  },

  // 获取特定节点的执行记录
  getNodeRecord: (canvasId: string, nodeId: string, subIndex?: number) => {
    const recordKey = generateRecordKey(canvasId, nodeId, subIndex);
    return get().nodeRecords[recordKey];
  },
}));

// 全局访问方法，允许非 React 组件访问 store
export const getNodeExecutionStore = () => useNodeExecutionStore.getState();
