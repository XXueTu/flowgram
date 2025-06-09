import {
  delay,
  inject,
  injectable,
  Playground,
  WorkflowDocument,
  WorkflowLineEntity,
  WorkflowNodeEntity,
  WorkflowNodeLinesData,
} from "@flowgram.ai/free-layout-editor";
import { getNodeExecutionStore } from "../stores/node-execution-store";

const RUNNING_INTERVAL = 1000;

@injectable()
export class RunningService {
  @inject(Playground) playground: Playground;

  @inject(WorkflowDocument) document: WorkflowDocument;

  private _runningNodes: WorkflowNodeEntity[] = [];

  constructor() {
    // 初始化时设置文档引用到 store
    setTimeout(() => {
      const store = getNodeExecutionStore();
      store.setDocument(this.document);
    }, 0);
  }

  async addRunningNode(node: WorkflowNodeEntity): Promise<void> {
    this._runningNodes.push(node);
    node.renderData.node.classList.add("node-running");
    this.document.linesManager.forceUpdate(); // Refresh line renderer
    await delay(RUNNING_INTERVAL);

    // Child Nodes
    await Promise.all(node.blocks.map((nextNode) => this.addRunningNode(nextNode)));
    // Sibling Nodes
    const nextNodes = node.getData(WorkflowNodeLinesData).outputNodes;
    await Promise.all(nextNodes.map((nextNode) => this.addRunningNode(nextNode)));
  }

  async startRun(params: Record<string, any> = {}): Promise<void> {
    try {
      // 确保 store 有文档引用
      const store = getNodeExecutionStore();
      store.setDocument(this.document);

      // 使用 store 的 runWorkflow 方法
      await store.runWorkflow(params);
    } catch (error) {
      console.error("Run canvas failed:", error);
      throw error;
    } finally {
      // 清空运行状态
      this.clearRunningState();
    }
  }

  private clearRunningState(): void {
    // 清除节点运行状态
    this._runningNodes.forEach((node) => {
      node.renderData.node.classList.remove("node-running");
    });

    this._runningNodes = [];
    this.document.linesManager.forceUpdate();
  }

  isFlowingLine(line: WorkflowLineEntity): boolean {
    const nodeExecutionStore = getNodeExecutionStore();
    const nodeRecords = nodeExecutionStore.nodeRecords;

    // 检查所有正在运行的节点的输出线
    for (const record of Object.values(nodeRecords)) {
      if (record.status === "running") {
        const node = this.document.getNode(record.nodeId);
        if (node) {
          const outputLines = node.getData(WorkflowNodeLinesData).outputLines;
          if (outputLines.includes(line)) {
            return true;
          }
        }
      }
    }

    return false;
  }
}
