import { IconChevronDown, IconSmallTriangleDown, IconSpin } from '@douyinfe/semi-icons';
import { Tag } from '@douyinfe/semi-ui';
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNodeExecutionStore, type NodeStatus } from "../../stores/node-execution-store";

// 复用官方testrun的样式和组件结构
const ExecutionDetailsWrapper = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
  background: white;
  border: 1px solid rgba(68, 83, 130, 0.25);
  border-radius: 8px;
  font-size: 12px;
  pointer-events: auto;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const StatusHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px;

  &.status-header-opened {
    padding-bottom: 0;
  }

  .status-title {
    height: 24px;
    display: flex;
    align-items: center;
    column-gap: 8px;
    min-width: 0;

    .semi-tag-content {
      font-weight: 500;
      line-height: 16px;
      font-size: 12px;
    }
  }

  .status-btns {
    height: 24px;
    display: flex;
    align-items: center;
    column-gap: 4px;
  }

  .is-show-detail {
    transform: rotate(180deg);
  }
`;

const DataStructureViewer = styled.div`
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  background: #fafafa;
  border-radius: 6px;
  padding: 12px 12px 12px 0;
  margin: 12px;
  border: 1px solid #e1e4e8;
  overflow: hidden;

  .tree-node {
    margin: 2px 0;
  }

  .tree-node-header {
    display: flex;
    align-items: flex-start;
    gap: 4px;
    min-height: 20px;
    padding: 2px 0;
    border-radius: 3px;
    transition: background-color 0.15s ease;

    &:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }
  }

  .expand-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 10px;
    color: #666;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 2px;
    transition: all 0.15s ease;
    padding: 0;
    margin: 0;

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
      color: #333;
    }

    &.expanded {
      transform: rotate(90deg);
    }

    &.collapsed {
      transform: rotate(0deg);
    }
  }

  .expand-placeholder {
    width: 16px;
    height: 16px;
    display: inline-block;
    flex-shrink: 0;
  }

  .node-label {
    color: #0969da;
    font-weight: 500;
    cursor: pointer;
    user-select: auto;
    margin-right: 4px;

    &:hover {
      text-decoration: underline;
    }
  }

  .node-value {
    margin-left: 4px;
  }

  .primitive-value-quote {
    color: #8f8f8f;
  }

  .primitive-value {
    cursor: pointer;
    user-select: all;
    padding: 1px 3px;
    border-radius: 3px;
    transition: background-color 0.15s ease;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    &.string {
      color: #032f62;
      background-color: rgba(3, 47, 98, 0.05);
    }

    &.number {
      color: #005cc5;
      background-color: rgba(0, 92, 197, 0.05);
    }

    &.boolean {
      color: #e36209;
      background-color: rgba(227, 98, 9, 0.05);
    }

    &.null,
    &.undefined {
      color: #6a737d;
      font-style: italic;
      background-color: rgba(106, 115, 125, 0.05);
    }
  }

  .tree-node-children {
    margin-left: 8px;
    padding-left: 8px;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 1px;
      background: #e1e4e8;
    }
  }
`;

const StatusGroup = styled.div`
  .node-status-group {
    padding: 6px;
    font-weight: 500;
    color: #333;
    font-size: 15px;
    display: flex;
    align-items: center;
  }
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

// 状态映射函数
const mapStatusToWorkflowStatus = (status: NodeStatus) => {
  switch (status) {
    case "waiting":
      return "Pending";
    case "running":
      return "Processing";
    case "error":
      return "Failed";
    case "success":
      return "Succeeded";
    default:
      return "Pending";
  }
};

// 状态图标组件
const StatusIcon = ({ status }: { status: NodeStatus }) => {
  if (status === "running") {
    return (
      <IconSpin
        spin
        style={{
          color: 'rgba(77,83,232,1)',
        }}
      />
    );
  }
  if (status === "success" || status === "completed") {
    return (
      <svg
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 20 20"
      >
        <g clipPath="url(#icon-workflow-run-success_svg__a)">
          <path
            fill="#3EC254"
            d="M.833 10A9.166 9.166 0 0 0 10 19.168a9.166 9.166 0 0 0 9.167-9.166A9.166 9.166 0 0 0 10 .834a9.166 9.166 0 0 0-9.167 9.167"
          ></path>
          <path
            fill="#fff"
            d="M6.077 9.755a.833.833 0 0 0 0 1.179l2.357 2.357a.833.833 0 0 0 1.179 0l4.714-4.714a.833.833 0 1 0-1.178-1.179l-4.125 4.125-1.768-1.768a.833.833 0 0 0-1.179 0"
          ></path>
        </g>
        <defs>
          <clipPath id="icon-workflow-run-success_svg__a">
            <path fill="#fff" d="M0 0h20v20H0z"></path>
          </clipPath>
        </defs>
      </svg>
    );
  }
  if (status === "paused") {
    return (
      <svg
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 20 20"
      >
        <circle cx="10" cy="10" r="8" fill="#faad14" />
        <rect x="7" y="6" width="2" height="8" fill="white" rx="1" />
        <rect x="11" y="6" width="2" height="8" fill="white" rx="1" />
      </svg>
    );
  }
  if (status === "canceled") {
    return (
      <svg
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 20 20"
      >
        <circle cx="10" cy="10" r="8" fill="#8c8c8c" />
        <path
          d="M6.5 6.5l7 7M13.5 6.5l-7 7"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (status === "pending" || status === "waiting") {
    return (
      <svg
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 20 20"
      >
        <circle cx="10" cy="10" r="8" fill="#d9d9d9" />
        <circle cx="10" cy="10" r="2" fill="white" />
      </svg>
    );
  }
  if (status === "idle") {
    return (
      <svg
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 20 20"
      >
        <circle cx="10" cy="10" r="8" fill="#f0f0f0" stroke="#d9d9d9" strokeWidth="1" />
        <circle cx="10" cy="10" r="1" fill="#bfbfbf" />
      </svg>
    );
  }
  // error或failed状态显示错误图标
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ color: status === "error" || status === "failed" ? "rgba(229, 50, 65, 1)" : "#6a737d" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM11 8C11 7.44772 11.4477 7 12 7C12.5523 7 13 7.44772 13 8V13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13V8ZM11 16C11 15.4477 11.4477 15 12 15C12.5523 15 13 15.4477 13 16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16Z"
      ></path>
    </svg>
  );
};

// 数据组查看器组件
interface DataViewerProps {
  data: any;
}

const DataViewer: React.FC<DataViewerProps> = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Toast 可以根据需要添加
  };

  const handleDownload = (content: string, filename: string = 'data.json') => {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 格式化数据为 JSON 字符串
  const formatData = (data: any): string => {
    if (data === null) return 'null';
    if (data === undefined) return 'undefined';
    
    // 如果是字符串，先尝试解析是否为有效的 JSON
    if (typeof data === 'string') {
      try {
        // 尝试解析 JSON 字符串
        const parsed = JSON.parse(data);
        // 如果解析成功，重新格式化显示
        return JSON.stringify(parsed, null, 2);
      } catch (error) {
        // 如果不是有效的 JSON，直接返回原字符串
        return data;
      }
    }
    
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      return String(data);
    }
  };

  const formattedData = formatData(data);
  const dataLines = formattedData.split('\n');
  const isLargeData = dataLines.length > 50 || formattedData.length > 5000;
  
  // 截断显示的数据
  const truncatedData = isLargeData && !isExpanded 
    ? dataLines.slice(0, 20).join('\n') + '\n...\n' + dataLines.slice(-5).join('\n')
    : formattedData;

  // 搜索高亮功能
  const highlightSearchTerm = (text: string, term: string) => {
    if (!term.trim()) return text;
    
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '★$1★'); // 用特殊符号标记，稍后替换为高亮
  };

  // 计算匹配个数
  const getMatchCount = (text: string, term: string): number => {
    if (!term.trim()) return 0;
    
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  };

  const displayData = searchTerm ? highlightSearchTerm(truncatedData, searchTerm) : truncatedData;
  const matchCount = searchTerm ? getMatchCount(formattedData, searchTerm) : 0;

  return (
    <div style={{ margin: '12px' }}>
      {/* 工具栏 */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        alignItems: 'center', 
        marginBottom: '8px',
        flexWrap: 'wrap',
        fontSize: '12px'
      }}>
        {/* 搜索框 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <input
            type="text"
            placeholder="搜索内容..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '4px 8px',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              fontSize: '11px',
              minWidth: '150px'
            }}
          />
          {searchTerm && (
            <span style={{
              fontSize: '10px',
              color: matchCount > 0 ? '#52c41a' : '#ff4d4f',
              fontWeight: '500',
              minWidth: '60px'
            }}>
              {matchCount > 0 ? `${matchCount} 项` : '无匹配'}
            </span>
          )}
        </div>
      
        {isLargeData && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              padding: '4px 8px',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              backgroundColor: isExpanded ? '#e6f7ff' : 'white',
              cursor: 'pointer',
              fontSize: '11px'
            }}
          >
            {isExpanded ? '📄 收起' : '📑 展开全部'}
          </button>
        )}
        
        {/* 数据统计 */}
        <span style={{ 
          color: '#666', 
          fontSize: '10px',
          marginLeft: 'auto'
        }}>
          {dataLines.length} 行 | {Math.round(formattedData.length / 1024 * 100) / 100} KB
        </span>
      </div>

      {/* JSON 内容显示 */}
      <pre 
        style={{
          margin: 0,
          fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace',
          fontSize: '12px',
          lineHeight: '1.4',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          padding: '12px',
          backgroundColor: '#fafafa',
          border: '1px solid #e1e4e8',
          borderRadius: '6px',
          userSelect: 'all',
          overflow: 'auto',
          maxHeight: isExpanded ? '600px' : '300px',
          position: 'relative'
        }}
        title="双击选择全部内容"
      >
        {displayData.split('★').map((part, index) => {
          // 简单的搜索高亮显示
          if (index % 2 === 1 && searchTerm) {
            return (
              <span 
                key={index} 
                style={{ 
                  backgroundColor: '#fff3cd', 
                  color: '#856404',
                  fontWeight: 'bold'
                }}
              >
                {part}
              </span>
            );
          }
          return part;
        })}
      </pre>
      
      {/* 截断提示 */}
      {isLargeData && !isExpanded && (
        <div style={{
          textAlign: 'center',
          padding: '8px',
          color: '#666',
          fontSize: '11px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #e1e4e8',
          borderTop: 'none',
          borderRadius: '0 0 6px 6px'
        }}>
          内容已截断显示 (前 20 行 + 后 5 行)，点击"展开全部"查看完整内容
        </div>
      )}
    </div>
  );
};

// 状态组组件
interface StatusGroupProps {
  title: string;
  data: unknown;
  optional?: boolean;
  disableCollapse?: boolean;
}

const isObjectHasContent = (obj: any = {}): boolean => Object.keys(obj).length > 0;

const NodeStatusGroup: React.FC<StatusGroupProps> = ({
  title,
  data,
  optional = false,
  disableCollapse = false,
}) => {
  const hasContent = isObjectHasContent(data);
  const [isExpanded, setIsExpanded] = useState(true);

  if (optional && !hasContent) {
    return null;
  }

  return (
    <StatusGroup>
      <div className="node-status-group" onClick={() => hasContent && setIsExpanded(!isExpanded)}>
        {!disableCollapse && (
          <IconSmallTriangleDown
            style={{
              transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
              transition: 'transform 0.2s',
              cursor: 'pointer',
              marginRight: '4px',
              opacity: hasContent ? 1 : 0,
            }}
          />
        )}
        <span>{title}:</span>
        {!hasContent && (
          <Tag
            size="small"
            style={{
              marginLeft: 4,
            }}
          >
            null
          </Tag>
        )}
      </div>
      {hasContent && isExpanded ? <DataViewer data={data} /> : null}
    </StatusGroup>
  );
};

// 主组件接口
interface EnhancedNodeExecutionDetailsProps {
  nodeId: string;
  canvasId?: string;
}

const msToSeconds = (ms: number): string => (ms / 1000).toFixed(2) + 's';

const getStatusText = (status: NodeStatus) => {
  switch (status) {
    case "pending":
      return "Pending";
    case "running":
      return "Running";
    case "paused":
      return "Paused";
    case "completed":
      return "Completed";
    case "failed":
      return "Failed";
    case "canceled":
      return "Canceled";
    case "waiting":
      return "Waiting";
    case "success":
      return "Succeed";
    case "error":
      return "Error";
    default:
      return "Idle";
  }
};

const getTagColor = (status: NodeStatus) => {
  switch (status) {
    case "success":
    case "completed":
      return 'node-status-succeed';
    case "error":
    case "failed":
      return 'node-status-failed';
    case "running":
      return 'node-status-processing';
    case "paused":
      return 'node-status-paused';
    case "canceled":
      return 'node-status-canceled';
    case "pending":
    case "waiting":
      return 'node-status-pending';
    case "idle":
      return 'node-status-idle';
    default:
      return '';
  }
};

export const EnhancedNodeExecutionDetails: React.FC<EnhancedNodeExecutionDetailsProps> = ({ nodeId, canvasId }) => {
  const { nodeRecords, loading, fetchNodeExecutionDetails } = useNodeExecutionStore();
  const [showDetail, setShowDetail] = useState(false);

  // 组件挂载时获取执行详情
  useEffect(() => {
    // 如果还没有该节点的记录，尝试获取
    const actualCanvasId = canvasId || "default";
    const keyPrefix = `${actualCanvasId}:${nodeId}`;
    const hasRecord = Object.keys(nodeRecords).some(key => key === keyPrefix || key.startsWith(`${keyPrefix}-`));
    
    if (!hasRecord && !loading) {
      fetchNodeExecutionDetails(nodeId, canvasId);
    }
  }, [nodeId, nodeRecords, loading, fetchNodeExecutionDetails, canvasId]);

  // 获取当前节点的所有执行记录（包括迭代记录）
  const actualCanvasId = canvasId || "default";
  const keyPrefix = `${actualCanvasId}:${nodeId}`;
  const allNodeRecords = Object.entries(nodeRecords)
    .filter(([key, record]) => key === keyPrefix || key.startsWith(`${keyPrefix}-`))
    .map(([key, record]) => record);
  
  // 分离主组件记录和迭代记录
  const mainRecord = allNodeRecords.find(record => record.subIndex === -1 || record.subIndex === undefined);
  const iterationRecords = allNodeRecords
    .filter(record => record.subIndex !== undefined && record.subIndex >= 0)
    .map(record => ({ subIndex: record.subIndex!, record }));

  // 计算综合状态和总时间
  const calculateOverallStatus = (): { status: NodeStatus; totalDuration: number } => {
    // 如果有主记录且没有迭代记录，直接使用主记录
    if (mainRecord && iterationRecords.length === 0) {
      return {
        status: mainRecord.status,
        totalDuration: mainRecord.duration || 0
      };
    }

    // 如果有迭代记录，根据迭代记录计算总状态和时间
    if (iterationRecords.length > 0) {
      let totalDuration = 0;
      let hasRunning = false;
      let hasFailed = false;
      let hasError = false;
      let hasPaused = false;
      let hasCanceled = false;
      let hasPending = false;
      let completedCount = 0;

      iterationRecords.forEach(({ record }) => {
        totalDuration += record.duration || 0;
        
        switch (record.status) {
          case 'running':
            hasRunning = true;
            break;
          case 'failed':
            hasFailed = true;
            break;
          case 'error':
            hasError = true;
            break;
          case 'paused':
            hasPaused = true;
            break;
          case 'canceled':
            hasCanceled = true;
            break;
          case 'pending':
          case 'waiting':
            hasPending = true;
            break;
          case 'completed':
          case 'success':
            completedCount++;
            break;
        }
      });

      // 确定总体状态 - 按优先级排序
      let overallStatus: NodeStatus = 'idle';
      if (hasRunning) {
        overallStatus = 'running';
      } else if (hasError) {
        overallStatus = 'error';
      } else if (hasFailed) {
        overallStatus = 'failed';
      } else if (hasPaused) {
        overallStatus = 'paused';
      } else if (hasCanceled) {
        overallStatus = 'canceled';
      } else if (hasPending) {
        overallStatus = 'pending';
      } else if (completedCount === iterationRecords.length && iterationRecords.length > 0) {
        overallStatus = 'completed';
      }

      return {
        status: overallStatus,
        totalDuration
      };
    }

    // 默认情况
    return {
      status: mainRecord?.status || "idle",
      totalDuration: mainRecord?.duration || 0
    };
  };

  const { status, totalDuration } = calculateOverallStatus();
  
  // 从主记录获取其他数据
  const error = mainRecord?.error;
  const inputs = mainRecord?.inputs;
  const outputs = mainRecord?.outputs;

  const hasMainContent = inputs || outputs || error;
  const hasIterationContent = iterationRecords.length > 0;
  const hasAnyContent = hasMainContent || hasIterationContent;

  // 如果没有任何运行记录，不显示
  if (!mainRecord && iterationRecords.length === 0) {
    return null;
  }

  const handleToggleShowDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetail(!showDetail);
  };

  return (
    <ExecutionDetailsWrapper
      onMouseDown={(e) => e.stopPropagation()}
    >
      <StatusHeaderWrapper
        className={showDetail ? 'status-header-opened' : ''}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={handleToggleShowDetail}
      >
        <div className="status-title">
          <StatusIcon status={status} />
          <p style={{ margin: 0 }}>{getStatusText(status)}</p>
          <Tag size="small" className={getTagColor(status)}>
            {msToSeconds(totalDuration)}
          </Tag>
          {hasIterationContent && (
            <Tag size="small" style={{ marginLeft: '4px', backgroundColor: '#e6f7ff', color: '#1890ff' }}>
              {iterationRecords.length} 次迭代
            </Tag>
          )}
        </div>
        <div className="status-btns">
          <IconChevronDown className={showDetail ? 'is-show-detail' : ''} />
        </div>
      </StatusHeaderWrapper>
      
      {showDetail && (
        <div
          style={{
            width: '100%',
            height: '100%',
            padding: '0px 2px 10px 2px',
          }}
        >
          {/* 主组件执行结果 */}
          {hasMainContent && (
            <>
              {error && <ErrorMessage>{error}</ErrorMessage>}
              <NodeStatusGroup title="Inputs" data={inputs} />
              <NodeStatusGroup title="Outputs" data={outputs} />
            </>
          )}
          
          {/* 迭代组件执行结果 */}
          {hasIterationContent && (
            <IterationGroup nodeId={nodeId} iterations={iterationRecords} />
          )}
          
          {/* 如果没有任何内容 */}
          {!hasAnyContent && (
            <div style={{ padding: '8px 12px', color: '#999', fontSize: '12px' }}>
              暂无执行结果
            </div>
          )}
        </div>
      )}
    </ExecutionDetailsWrapper>
  );
};

// 添加必要的CSS类
const globalStyles = `
.node-status-succeed {
  background-color: rgba(105, 209, 140, 0.3);
  color: rgba(0, 178, 60, 1);
}

.node-status-processing {
  background-color: rgba(153, 187, 255, 0.3);
  color: rgba(61, 121, 242, 1);
}

.node-status-failed {
  background-color: rgba(255, 163, 171, 0.3);
  color: rgba(229, 50, 65, 1);
}

.node-status-paused {
  background-color: rgba(255, 221, 87, 0.3);
  color: rgba(250, 173, 20, 1);
}

.node-status-canceled {
  background-color: rgba(190, 190, 190, 0.3);
  color: rgba(140, 140, 140, 1);
}

.node-status-pending {
  background-color: rgba(217, 217, 217, 0.3);
  color: rgba(102, 102, 102, 1);
}

.node-status-idle {
  background-color: rgba(240, 240, 240, 0.3);
  color: rgba(150, 150, 150, 1);
}
`;

// 注入全局样式
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = globalStyles;
  document.head.appendChild(styleElement);
}

// 迭代组件数据分组和排序组件
interface IterationGroupProps {
  nodeId: string;
  iterations: Array<{ subIndex: number; record: any }>;
}

// 状态统计接口
interface StatusStats {
  total: number;
  completed: number;
  failed: number;
  running: number;
  pending: number;
  paused: number;
  canceled: number;
}

// 计算状态统计
const calculateStats = (iterations: Array<{ subIndex: number; record: any }>): StatusStats => {
  const stats = {
    total: iterations.length,
    completed: 0,
    failed: 0,
    running: 0,
    pending: 0,
    paused: 0,
    canceled: 0,
  };

  iterations.forEach(({ record }) => {
    switch (record.status) {
      case 'completed':
      case 'success':
        stats.completed++;
        break;
      case 'failed':
      case 'error':
        stats.failed++;
        break;
      case 'running':
        stats.running++;
        break;
      case 'pending':
      case 'waiting':
        stats.pending++;
        break;
      case 'paused':
        stats.paused++;
        break;
      case 'canceled':
        stats.canceled++;
        break;
    }
  });

  return stats;
};

const IterationGroup: React.FC<IterationGroupProps> = ({ nodeId, iterations }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const pageSize = 20; // 每页显示20个

  // 按subIndex排序
  const sortedIterations = iterations.sort((a, b) => a.subIndex - b.subIndex);
  
  // 计算统计信息
  const stats = calculateStats(sortedIterations);

  // 应用筛选
  const filteredIterations = sortedIterations.filter(({ subIndex, record }) => {
    // 搜索筛选
    if (searchFilter && !String(subIndex + 1).includes(searchFilter)) {
      return false;
    }
    
    // 状态筛选
    if (statusFilter !== 'all') {
      if (statusFilter === 'completed' && !['completed', 'success'].includes(record.status)) {
        return false;
      }
      if (statusFilter === 'failed' && !['failed', 'error'].includes(record.status)) {
        return false;
      }
      if (statusFilter !== 'completed' && statusFilter !== 'failed' && record.status !== statusFilter) {
        return false;
      }
    }
    
    return true;
  });

  // 分页数据
  const totalPages = Math.ceil(filteredIterations.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedIterations = filteredIterations.slice(startIndex, startIndex + pageSize);

  // 重置页码当筛选改变时
  useEffect(() => {
    setCurrentPage(1);
  }, [searchFilter, statusFilter]);

  const StatsSummary = () => (
    <div style={{ 
      display: 'flex', 
      gap: '6px', 
      alignItems: 'center',
      flexWrap: 'wrap',
      marginBottom: '8px',
      fontSize: '11px'
    }}>
      <div style={{ 
        padding: '2px 6px', 
        backgroundColor: '#f0f0f0', 
        borderRadius: '4px',
        lineHeight: '16px'
      }}>
        总计: {stats.total}
      </div>
      {stats.completed > 0 && (
        <div style={{ 
          padding: '2px 6px', 
          backgroundColor: '#f6ffed', 
          color: '#52c41a', 
          borderRadius: '4px',
          lineHeight: '16px'
        }}>
          成功: {stats.completed}
        </div>
      )}
      {stats.failed > 0 && (
        <div style={{ 
          padding: '2px 6px', 
          backgroundColor: '#fff2f0', 
          color: '#ff4d4f', 
          borderRadius: '4px',
          lineHeight: '16px'
        }}>
          失败: {stats.failed}
        </div>
      )}
      {stats.running > 0 && (
        <div style={{ 
          padding: '2px 6px', 
          backgroundColor: '#e6f7ff', 
          color: '#1890ff', 
          borderRadius: '4px',
          lineHeight: '16px'
        }}>
          运行中: {stats.running}
        </div>
      )}
      {stats.pending > 0 && (
        <div style={{ 
          padding: '2px 6px', 
          backgroundColor: '#fffbe6', 
          color: '#faad14', 
          borderRadius: '4px',
          lineHeight: '16px'
        }}>
          等待: {stats.pending}
        </div>
      )}
      {stats.paused > 0 && (
        <div style={{ 
          padding: '2px 6px', 
          backgroundColor: '#fff7e6', 
          color: '#faad14', 
          borderRadius: '4px',
          lineHeight: '16px'
        }}>
          暂停: {stats.paused}
        </div>
      )}
      {stats.canceled > 0 && (
        <div style={{ 
          padding: '2px 6px', 
          backgroundColor: '#f5f5f5', 
          color: '#8c8c8c', 
          borderRadius: '4px',
          lineHeight: '16px'
        }}>
          取消: {stats.canceled}
        </div>
      )}
    </div>
  );

  const FilterControls = () => (
    <div style={{ 
      display: 'flex', 
      gap: '8px', 
      alignItems: 'center',
      marginBottom: '8px',
      fontSize: '12px',
      flexWrap: 'wrap'
    }}>
      <input
        type="text"
        placeholder="搜索迭代序号..."
        value={searchFilter}
        onChange={(e) => setSearchFilter(e.target.value)}
        style={{
          padding: '2px 6px',
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
          fontSize: '11px',
          width: '120px'
        }}
      />
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        style={{
          padding: '2px 6px',
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
          fontSize: '11px'
        }}
      >
        <option value="all">全部状态</option>
        <option value="completed">已完成</option>
        <option value="failed">失败</option>
        <option value="running">运行中</option>
        <option value="pending">等待中</option>
        <option value="paused">暂停</option>
        <option value="canceled">已取消</option>
      </select>
    </div>
  );

  const TableView = () => (
    <div style={{ border: '1px solid #f0f0f0', borderRadius: '4px' }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '60px 80px 100px 80px 1fr',
        gap: '8px',
        padding: '6px 8px',
        backgroundColor: '#fafafa',
        borderBottom: '1px solid #f0f0f0',
        fontSize: '11px',
        fontWeight: 'bold'
      }}>
        <div>序号</div>
        <div>状态</div>
        <div>耗时</div>
        <div>操作</div>
        <div>详情</div>
      </div>
      {paginatedIterations.map(({ subIndex, record }) => (
        <IterationTableRow key={`${nodeId}-${subIndex}`} subIndex={subIndex} record={record} />
      ))}
    </div>
  );

  const Pagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        gap: '4px',
        marginTop: '8px',
        fontSize: '11px'
      }}>
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          style={{
            padding: '2px 6px',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            backgroundColor: currentPage === 1 ? '#f5f5f5' : 'white',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
          }}
        >
          上一页
        </button>
        <span style={{ padding: '0 8px' }}>
          {currentPage} / {totalPages} 页 (共 {filteredIterations.length} 条)
        </span>
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          style={{
            padding: '2px 6px',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            backgroundColor: currentPage === totalPages ? '#f5f5f5' : 'white',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
          }}
        >
          下一页
        </button>
      </div>
    );
  };

  return (
    <div style={{ margin: '8px 0' }}>
      <StatsSummary />
      <FilterControls />
      <TableView />
      <Pagination />
    </div>
  );
};

// 表格行组件
const IterationTableRow: React.FC<{ subIndex: number; record: any }> = ({ subIndex, record }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '60px 80px 100px 80px 1fr',
        gap: '8px',
        padding: '6px 8px',
        borderBottom: '1px solid #f5f5f5',
        fontSize: '11px',
        alignItems: 'center'
      }}>
        <div>#{subIndex + 1}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <StatusIcon status={record.status} />
          <span>{getStatusText(record.status)}</span>
        </div>
        <div>
          {record.duration > 0 && (
            <Tag size="small" className={getTagColor(record.status)}>
              {msToSeconds(record.duration)}
            </Tag>
          )}
        </div>
        <div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              padding: '2px 6px',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              fontSize: '10px',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            {showDetails ? '隐藏' : '详情'}
          </button>
        </div>
        <div style={{ fontSize: '10px', color: '#999' }}>
          {record.error && <span style={{ color: '#ff4d4f' }}>错误: {record.error.slice(0, 50)}...</span>}
        </div>
      </div>
      {showDetails && (
        <div style={{ 
          padding: '8px 16px', 
          backgroundColor: '#fafafa',
          borderBottom: '1px solid #f0f0f0'
        }}>
          {record.error && <ErrorMessage>{record.error}</ErrorMessage>}
          <NodeStatusGroup title="Inputs" data={record.inputs} />
          <NodeStatusGroup title="Outputs" data={record.outputs} />
        </div>
      )}
    </>
  );
}; 