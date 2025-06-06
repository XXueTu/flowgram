import { NodeStatus } from '../components/base-node/node-execution-details';

export interface FlowNodeEntity {
  id: string;
  status?: NodeStatus;
  startTime?: number;
  endTime?: number;
  error?: string;
  progress?: number;
  // ... 其他节点属性
} 