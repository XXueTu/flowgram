import React from 'react';
import styled from 'styled-components';

const ExecutionDetailsWrapper = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
  max-width: 300px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const StatusIndicator = styled.div<{ status: NodeStatus }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ status }) => {
    switch (status) {
      case 'running':
        return '#1890ff';
      case 'success':
        return '#52c41a';
      case 'error':
        return '#ff4d4f';
      case 'waiting':
        return '#faad14';
      default:
        return '#d9d9d9';
    }
  }};
`;

const ErrorMessage = styled.div`
  color: #ff4d4f;
  margin-top: 4px;
  font-size: 11px;
`;

const TimeInfo = styled.div`
  color: #d9d9d9;
  font-size: 11px;
`;

export type NodeStatus = 'idle' | 'waiting' | 'running' | 'success' | 'error';

interface NodeExecutionDetailsProps {
  nodeId: string;
  status?: NodeStatus;
  startTime?: number;
  endTime?: number;
  error?: string;
  progress?: number;
}

const formatDuration = (startTime?: number, endTime?: number) => {
  if (!startTime) return '';
  const end = endTime || Date.now();
  const duration = end - startTime;
  if (duration < 1000) return `${duration}ms`;
  return `${(duration / 1000).toFixed(1)}s`;
};

const getStatusText = (status: NodeStatus) => {
  switch (status) {
    case 'running':
      return '运行中';
    case 'success':
      return '已完成';
    case 'error':
      return '执行失败';
    case 'waiting':
      return '等待中';
    default:
      return '未开始';
  }
};

export const NodeExecutionDetails: React.FC<NodeExecutionDetailsProps> = ({
  nodeId,
  status = 'idle',
  startTime,
  endTime,
  error,
  progress,
}) => {
  const duration = formatDuration(startTime, endTime);
  const statusText = getStatusText(status);

  return (
    <ExecutionDetailsWrapper>
      <StatusIndicator status={status} />
      <div>
        <div>{statusText}</div>
        {duration && <TimeInfo>{duration}</TimeInfo>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </div>
    </ExecutionDetailsWrapper>
  );
}; 