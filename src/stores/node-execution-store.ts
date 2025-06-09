import { create } from "zustand";
import { CanvasService } from "../services/canvas";

export type NodeStatus = "idle" | "waiting" | "running" | "success" | "error";

interface NodeExecutionRecord {
  nodeId: string;
  status: NodeStatus;
  startTime?: number;
  endTime?: number;
  error?: string;
  inputs?: Record<string, any>;
  outputs?: Record<string, any>;
  duration?: number;
}

interface NodeExecutionState {
  // 存储所有节点的执行记录
  nodeRecords: Record<string, NodeExecutionRecord>;

  // 加载状态
  loading: boolean;

  // 运行状态
  isRunning: boolean;

  // 获取节点执行详情
  fetchNodeExecutionDetails: (nodeId: string, canvasId?: string, serialId?: string) => Promise<void>;

  // 获取所有节点的执行详情（用于运行后刷新所有节点状态）
  fetchAllNodeExecutionDetails: (data: { id: string; serialId: string; params: Record<string, any> }) => Promise<void>;

  // 运行工作流（包含完整的运行逻辑）
  runWorkflow: (params?: Record<string, any>, canvasId?: string, serialId?: string) => Promise<void>;

  // 更新节点视觉状态
  updateNodeVisualStatus: (nodeId: string, status: NodeStatus) => void;

  // 更新线视觉状态
  updateLineVisualStatus: () => void;

  // 清除节点记录
  clearNodeRecord: (nodeId: string) => void;

  // 清除所有记录
  clearAllRecords: () => void;

  // 设置文档引用（用于更新视觉状态）
  setDocument: (document: any) => void;

  // 文档引用
  document?: any;
}

const mapStatusFromApi = (apiStatus: string): NodeStatus => {
  switch (apiStatus.toLowerCase()) {
    case "success":
    case "completed":
      return "success";
    case "error":
    case "failed":
      return "error";
    case "running":
    case "processing":
      return "running";
    case "waiting":
    case "pending":
      return "waiting";
    default:
      return "idle";
  }
};

export const useNodeExecutionStore = create<NodeExecutionState>((set, get) => ({
  nodeRecords: {},
  loading: false,
  isRunning: false,
  document: undefined,

  setDocument: (document: any) => {
    set({ document });
  },

  fetchNodeExecutionDetails: async (nodeId: string, canvasId = "default", serialId = "trace-485d787428f428a484fd5e2d9de880f9") => {
    try {
      set({ loading: true });
      debugger;
      const canvasService = CanvasService.getInstance();
      const response = await canvasService.getTraceComponents({
        id: canvasId,
        serialId: serialId,
      });

      // 查找当前节点的记录
      const nodeRecord = response.records?.find((record) => record.nodeId === nodeId);

      if (nodeRecord) {
        const executionRecord: NodeExecutionRecord = {
          nodeId,
          status: mapStatusFromApi(nodeRecord.status),
          startTime: nodeRecord.startTime ? new Date(nodeRecord.startTime).getTime() : undefined,
          endTime: nodeRecord.endTime ? new Date(nodeRecord.endTime).getTime() : undefined,
          error: nodeRecord.error || undefined,
          inputs: nodeRecord.input || {},
          outputs: nodeRecord.output || {},
          duration: nodeRecord.duration,
        };

        set((state) => ({
          nodeRecords: {
            ...state.nodeRecords,
            [nodeId]: executionRecord,
          },
        }));
      } else {
        // 如果没找到记录，设置为默认状态
        set((state) => ({
          nodeRecords: {
            ...state.nodeRecords,
            [nodeId]: {
              nodeId,
              status: "idle",
            },
          },
        }));
      }
    } catch (error) {
      console.error("获取节点执行详情失败:", error);

      // 设置错误状态
      set((state) => ({
        nodeRecords: {
          ...state.nodeRecords,
          [nodeId]: {
            nodeId,
            status: "error",
            error: error instanceof Error ? error.message : "获取执行详情失败",
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

        // 处理所有节点的记录
        if (response.records && response.records.length > 0) {
          const newNodeRecords: Record<string, NodeExecutionRecord> = {};

          response.records.forEach((record) => {
            const executionRecord: NodeExecutionRecord = {
              nodeId: record.nodeId,
              status: mapStatusFromApi(record.status),
              startTime: record.startTime ? new Date(record.startTime).getTime() : undefined,
              endTime: record.endTime ? new Date(record.endTime).getTime() : undefined,
              error: record.error || undefined,
              inputs: record.input || {},
              outputs: record.output || {},
              duration: record.duration,
            };

            newNodeRecords[record.nodeId] = executionRecord;
          });

          set((state) => ({
            nodeRecords: {
              ...state.nodeRecords,
              ...newNodeRecords,
            },
          }));

          // 更新节点和线的视觉状态
          get().updateNodeVisualStatus("", "idle"); // 更新所有节点
          get().updateLineVisualStatus();
        }

        // 检查是否需要继续轮询
        const shouldContinuePolling = (response.status === "pending" || response.status === "running") && pollCount < MAX_POLL_COUNT;

        if (shouldContinuePolling) {
          console.log(`工作流仍在执行中，状态: ${response.status}，轮询次数: ${pollCount}/${MAX_POLL_COUNT}，将在2秒后重新查询`);
          setTimeout(pollForResult, 2000); // 2秒后重新轮询
        } else {
          if (pollCount >= MAX_POLL_COUNT) {
            console.warn("已达到最大轮询次数，停止轮询");
          } else {
            console.log("工作流执行完成，状态:", response.status);
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
          console.log("发生错误，将在2秒后重试...");
          setTimeout(pollForResult, 2000);
        }
      }
    };

    try {
      set({ loading: true });
      await pollForResult();
    } catch (error) {
      console.error("获取所有节点执行详情失败:", error);
      set({ loading: false });
    }
  },

  runWorkflow: async (params = {}, canvasId = "default", serialId = "trace-485d787428f428a484fd5e2d9de880f9") => {
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
      // debugger;
      // 获取执行结果（包含轮询逻辑）
      await get().fetchAllNodeExecutionDetails({
        canvasId,
        ...(runRes?.data || {}),
      });
    } catch (error) {
      console.error("运行工作流失败:", error);
      throw error;
    } finally {
      set({ isRunning: false });
    }
  },

  updateNodeVisualStatus: (nodeId: string, status: NodeStatus) => {
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
      // 更新所有节点
      Object.values(state.nodeRecords).forEach((record) => {
        const node = state.document.getNode(record.nodeId);
        if (node) {
          node.renderData.node.classList.remove("node-idle", "node-waiting", "node-running", "node-success", "node-error");
          node.renderData.node.classList.add(`node-${record.status}`);
        }
      });
    }

    state.document.linesManager.forceUpdate();
  },

  updateLineVisualStatus: () => {
    const state = get();
    if (!state.document) return;

    // 获取所有节点的输出线并更新状态
    Object.values(state.nodeRecords).forEach((record) => {
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
    });

    state.document.linesManager.forceUpdate();
  },

  clearNodeRecord: (nodeId: string) => {
    set((state) => {
      const newRecords = { ...state.nodeRecords };
      delete newRecords[nodeId];
      return { nodeRecords: newRecords };
    });
  },

  clearAllRecords: () => {
    set({ nodeRecords: {} });
  },
}));

// 全局访问方法，允许非 React 组件访问 store
export const getNodeExecutionStore = () => useNodeExecutionStore.getState();
