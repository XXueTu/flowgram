import { IconChevronDown, IconChevronUp, IconCopy } from "@douyinfe/semi-icons";
import { useState } from "react";
import styled from "styled-components";
import { useNodeExecutionStore, type NodeStatus } from "../../stores/node-execution-store";

const ExecutionDetailsWrapper = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 12px;
  pointer-events: auto;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const StatusHeader = styled.div<{ status: NodeStatus; collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${({ status }) => {
    switch (status) {
      case "success":
      case "completed":
        return "#f6ffed";
      case "error":
      case "failed":
        return "#fff2f0";
      case "running":
        return "#e6f7ff";
      case "waiting":
      case "pending":
        return "#fffbe6";
      case "paused":
        return "#fff7e6";
      case "canceled":
        return "#f5f5f5";
      default:
        return "#fafafa";
    }
  }};
  border-bottom: ${({ collapsed }) => (collapsed ? "none" : "1px solid #f0f0f0")};
  border-radius: ${({ collapsed }) => (collapsed ? "6px" : "6px 6px 0 0")};
  color: ${({ status }) => {
    switch (status) {
      case "success":
      case "completed":
        return "#52c41a";
      case "error":
      case "failed":
        return "#ff4d4f";
      case "running":
        return "#1890ff";
      case "waiting":
      case "pending":
        return "#faad14";
      case "paused":
        return "#faad14";
      case "canceled":
        return "#8c8c8c";
      default:
        return "#666";
    }
  }};
  font-weight: 500;
`;

const StatusIndicator = styled.div<{ status: NodeStatus }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ status }) => {
    switch (status) {
      case "running":
        return "#1890ff";
      case "success":
      case "completed":
        return "#52c41a";
      case "error":
      case "failed":
        return "#ff4d4f";
      case "waiting":
      case "pending":
        return "#faad14";
      case "paused":
        return "#faad14";
      case "canceled":
        return "#8c8c8c";
      default:
        return "#d9d9d9";
    }
  }};
`;

const StatusText = styled.div``;

const TimeTag = styled.div`
  background: #f0f0f0;
  color: #666;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 400;
  white-space: nowrap;
  margin-left: 6px;
`;

const DataSection = styled.div`
  padding: 8px 12px;
`;

const DataLabel = styled.div`
  color: #666;
  font-size: 11px;
  margin-bottom: 2px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CopyButton = styled.div`
  cursor: pointer;
  color: #999;
  padding: 2px;
  border-radius: 2px;
  display: flex;
  align-items: center;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
    color: #666;
  }
`;

const DataContent = styled.pre`
  background: #f5f5f5;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  max-height: 80px;
  overflow-y: auto;
  word-break: break-all;
  line-height: 1.4;
  color: #333;
  border: 1px solid #e8e8e8;
  margin: 0;
`;

const ErrorMessage = styled.div`
  color: #ff4d4f;
  background: #fff2f0;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 11px;
  margin: 8px 12px;
  border: 1px solid #ffccc7;
`;

const ToggleButton = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;
  color: #999;
  padding: 2px;
  border-radius: 2px;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`;

export type { NodeStatus };

interface NodeExecutionDetailsProps {
  nodeId: string;
  canvasId?: string;
  serialId?: string;
  // 移除原有的 props，改为从 store 获取
  // status?: NodeStatus;
  // startTime?: number;
  // endTime?: number;
  // error?: string;
  // progress?: number;
  // inputs?: Record<string, any>;
  // outputs?: Record<string, any>;
}

const formatDuration = (duration: number) => {
  if (duration < 1000) return `${duration.toFixed(0)}ms`;
  return `${(duration / 1000).toFixed(3)}s`;
};

const getStatusText = (status: NodeStatus) => {
  switch (status) {
    case "pending":
      return "等待中";
    case "running":
      return "运行中";
    case "paused":
      return "已暂停";
    case "completed":
      return "已完成";
    case "failed":
      return "运行失败";
    case "canceled":
      return "已取消";
    case "waiting":
      return "等待中";
    case "success":
      return "运行成功";
    case "error":
      return "运行失败";
    default:
      return "未开始";
  }
};

const formatData = (data: any) => {
  if (!data) return "";

  // 如果 data 不是对象，直接处理
  if (typeof data === "string") {
    try {
      // 尝试解析 JSON 字符串
      if ((data.startsWith("{") && data.endsWith("}")) || (data.startsWith("[") && data.endsWith("]"))) {
        const parsed = JSON.parse(data);
        return JSON.stringify(parsed, null, 2);
      }
      return data;
    } catch (e) {
      return data;
    }
  }

  // 如果是数组，直接序列化
  if (Array.isArray(data)) {
    return JSON.stringify(data, null, 2);
  }

  // 如果是对象但不是 null
  if (typeof data === "object" && data !== null) {
    // 检查是否是空对象
    const keys = Object.keys(data);
    if (keys.length === 0) return "";

    // 格式化对象的每个键值对
    return keys
      .map((key) => {
        let value = data[key];
        let formattedValue;

        if (typeof value === "string") {
          // 尝试解析 JSON 字符串
          try {
            if ((value.startsWith("{") && value.endsWith("}")) || (value.startsWith("[") && value.endsWith("]"))) {
              const parsed = JSON.parse(value);
              formattedValue = JSON.stringify(parsed, null, 2);
            } else {
              formattedValue = value;
            }
          } catch (e) {
            formattedValue = value;
          }
        } else if (typeof value === "object" && value !== null) {
          formattedValue = JSON.stringify(value, null, 2);
        } else {
          formattedValue = String(value);
        }

        return `${key}: ${formattedValue}`;
      })
      .join("\n");
  }

  // 其他类型直接转字符串
  return String(data);
};

const handleCopy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // 降级方案
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }
};

export const NodeExecutionDetails = ({ nodeId }: NodeExecutionDetailsProps) => {
  const { nodeRecords, loading } = useNodeExecutionStore();
  const [collapsed, setCollapsed] = useState(true);

  // 获取当前节点的执行记录
  const nodeRecord = nodeRecords[nodeId];

  // 从 store 中获取数据，如果没有数据则使用默认值
  const status = nodeRecord?.status || "idle";
  const error = nodeRecord?.error;
  const inputs = nodeRecord?.inputs;
  const outputs = nodeRecord?.outputs;

  const duration = formatDuration(nodeRecord?.duration || 0);
  const statusText = getStatusText(status);
  const inputText = formatData(inputs);
  const outputText = formatData(outputs);
  const hasData = inputText || outputText || error;

  // 如果正在加载且没有数据，显示加载状态
  if (loading && !nodeRecord) {
    return (
      <ExecutionDetailsWrapper>
        <StatusHeader status="idle" collapsed={true}>
          <StatusIndicator status="idle" />
          <StatusText>加载中...</StatusText>
        </StatusHeader>
      </ExecutionDetailsWrapper>
    );
  }

  return (
    <ExecutionDetailsWrapper>
      <StatusHeader status={status} collapsed={collapsed}>
        <StatusIndicator status={status} />
        <StatusText>{statusText}</StatusText>
        {duration && <TimeTag>{duration}</TimeTag>}
        {hasData && (
          <ToggleButton onClick={() => setCollapsed(!collapsed)}>{collapsed ? <IconChevronDown size="small" /> : <IconChevronUp size="small" />}</ToggleButton>
        )}
      </StatusHeader>

      {hasData && !collapsed && (
        <>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          {inputText && (
            <DataSection>
              <DataLabel>
                输入
                <CopyButton onClick={() => handleCopy(inputText)}>
                  <IconCopy size="small" />
                </CopyButton>
              </DataLabel>
              <DataContent>{inputText}</DataContent>
            </DataSection>
          )}

          {outputText && (
            <DataSection style={{ paddingTop: 0, paddingBottom: "12px" }}>
              <DataLabel>
                输出
                <CopyButton onClick={() => handleCopy(outputText)}>
                  <IconCopy size="small" />
                </CopyButton>
              </DataLabel>
              <DataContent>{outputText}</DataContent>
            </DataSection>
          )}
        </>
      )}
    </ExecutionDetailsWrapper>
  );
};
