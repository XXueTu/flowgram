import React, { useState } from "react";
import styled from "styled-components";
import { IconChevronDown, IconChevronUp, IconCopy } from "@douyinfe/semi-icons";

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
        return "#f6ffed";
      case "error":
        return "#fff2f0";
      case "running":
        return "#e6f7ff";
      case "waiting":
        return "#fffbe6";
      default:
        return "#fafafa";
    }
  }};
  border-bottom: ${({ collapsed }) => (collapsed ? "none" : "1px solid #f0f0f0")};
  border-radius: ${({ collapsed }) => (collapsed ? "6px" : "6px 6px 0 0")};
  color: ${({ status }) => {
    switch (status) {
      case "success":
        return "#52c41a";
      case "error":
        return "#ff4d4f";
      case "running":
        return "#1890ff";
      case "waiting":
        return "#faad14";
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
        return "#52c41a";
      case "error":
        return "#ff4d4f";
      case "waiting":
        return "#faad14";
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

export type NodeStatus = "idle" | "waiting" | "running" | "success" | "error";

interface NodeExecutionDetailsProps {
  nodeId: string;
  status?: NodeStatus;
  startTime?: number;
  endTime?: number;
  error?: string;
  progress?: number;
  inputs?: Record<string, any>;
  outputs?: Record<string, any>;
}

const formatDuration = (startTime?: number, endTime?: number) => {
  if (!startTime) return "";
  const end = endTime || Date.now();
  const duration = end - startTime;
  if (duration < 1000) return `${duration.toFixed(0)}ms`;
  return `${(duration / 1000).toFixed(3)}s`;
};

const getStatusText = (status: NodeStatus) => {
  switch (status) {
    case "running":
      return "运行中";
    case "success":
      return "运行成功";
    case "error":
      return "运行失败";
    case "waiting":
      return "等待中";
    default:
      return "未开始";
  }
};

const formatData = (data: Record<string, any> | undefined) => {
  if (!data || Object.keys(data).length === 0) return "";

  return Object.entries(data)
    .map(([key, value]) => {
      let formattedValue = value;
      if (typeof value === "object") {
        formattedValue = JSON.stringify(value, null, 2);
      }
      return `${key}: ${formattedValue}`;
    })
    .join("\n");
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

export const NodeExecutionDetails = ({
  nodeId,
}: // status = "idle",
// startTime,
// endTime,
// error,
// progress,
// inputs,
// outputs,
NodeExecutionDetailsProps) => {
  const { status, startTime, endTime, error, inputs, outputs }: any = {
    status: "success",
    startTime: 1717689420000,
    endTime: 1717689430000,
    error: "执行错误执行错误，执行错误执行错误，执行错误执行错误",
    inputs: {
      a: "1",
      b: "2",
    },
    outputs: {
      c: "3",
    },
  };
  const [collapsed, setCollapsed] = useState(true);
  const duration = formatDuration(startTime, endTime);
  const statusText = getStatusText(status);
  const inputText = formatData(inputs);
  const outputText = formatData(outputs);

  const hasData = inputText || outputText || error;

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
