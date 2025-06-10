import { useNodeExecutionStore, type NodeStatus } from '../../../stores/node-execution-store';
import { NodeStatusRender, WorkflowStatus } from './render';

interface NodeStatusBarProps {
  nodeId: string;
}

// 状态映射，将我们的状态映射到官方的WorkflowStatus枚举值
const mapNodeStatusToWorkflowStatus = (status: NodeStatus) => {
  switch (status) {
    case "waiting":
      return WorkflowStatus.Pending;
    case "running":
      return WorkflowStatus.Processing;
    case "error":
      return WorkflowStatus.Failed;
    case "success":
      return WorkflowStatus.Succeeded;
    default:
      return WorkflowStatus.Pending;
  }
};

// 模拟官方的NodeReport接口
const createNodeReport = (nodeId: string, nodeRecord: any) => {
  if (!nodeRecord) return null;
  
  return {
    id: nodeId,
    status: mapNodeStatusToWorkflowStatus(nodeRecord.status),
    timeCost: nodeRecord.duration || 0,
    snapshots: [
      {
        inputs: nodeRecord.inputs,
        outputs: nodeRecord.outputs,
        branch: null, // 暂时不支持branch
        data: null,   // 暂时不支持data
      }
    ],
    error: nodeRecord.error,
  };
};

export const NodeStatusBar = ({ nodeId }: NodeStatusBarProps) => {
  const { nodeRecords, loading } = useNodeExecutionStore();
  
  // 获取当前节点的执行记录
  const nodeRecord = nodeRecords[nodeId];
  
  // 如果正在加载且没有数据，不显示
  if (loading && !nodeRecord) {
    return null;
  }

  // 如果没有运行记录，不显示
  if (!nodeRecord) {
    return null;
  }

  // 创建模拟的report对象
  const report = createNodeReport(nodeId, nodeRecord);
  
  if (!report) {
    return null;
  }

  return <NodeStatusRender report={report} />;
}; 