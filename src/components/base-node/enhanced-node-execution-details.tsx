import { IconChevronDown, IconSmallTriangleDown, IconSpin } from '@douyinfe/semi-icons';
import { Tag } from '@douyinfe/semi-ui';
import React, { useState } from "react";
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
  if (status === "success") {
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
  // error或其他状态显示warning图标
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ color: status === "error" ? "rgba(229, 50, 65, 1)" : "#6a737d" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM11 8C11 7.44772 11.4477 7 12 7C12.5523 7 13 7.44772 13 8V13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13V8ZM11 16C11 15.4477 11.4477 15 12 15C12.5523 15 13 15.4477 13 16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16Z"
      ></path>
    </svg>
  );
};

// 数据结构查看器组件
interface TreeNodeProps {
  label: string;
  value: any;
  level: number;
  isLast?: boolean;
}

const TreeNode: React.FC<TreeNodeProps> = ({ label, value, level, isLast = false }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Toast 可以根据需要添加
  };

  const isExpandable = (val: any) =>
    val !== null &&
    typeof val === 'object' &&
    ((Array.isArray(val) && val.length > 0) ||
      (!Array.isArray(val) && Object.keys(val).length > 0));

  const renderPrimitiveValue = (val: any) => {
    if (val === null) return <span className="primitive-value null">null</span>;
    if (val === undefined) return <span className="primitive-value undefined">undefined</span>;

    switch (typeof val) {
      case 'string':
        return (
          <span className="string">
            <span className="primitive-value-quote">{'"'}</span>
            <span className="primitive-value" onDoubleClick={() => handleCopy(val)}>
              {val}
            </span>
            <span className="primitive-value-quote">{'"'}</span>
          </span>
        );
      case 'number':
        return (
          <span className="primitive-value number" onDoubleClick={() => handleCopy(String(val))}>
            {val}
          </span>
        );
      case 'boolean':
        return (
          <span
            className="primitive-value boolean"
            onDoubleClick={() => handleCopy(val.toString())}
          >
            {val.toString()}
          </span>
        );
      default:
        return (
          <span className="primitive-value" onDoubleClick={() => handleCopy(String(val))}>
            {String(val)}
          </span>
        );
    }
  };

  const renderChildren = () => {
    if (Array.isArray(value)) {
      return value.map((item, index) => (
        <TreeNode
          key={index}
          label={`${index + 1}.`}
          value={item}
          level={level + 1}
          isLast={index === value.length - 1}
        />
      ));
    } else {
      const entries = Object.entries(value);
      return entries.map(([key, val], index) => (
        <TreeNode
          key={key}
          label={`${key}:`}
          value={val}
          level={level + 1}
          isLast={index === entries.length - 1}
        />
      ));
    }
  };

  return (
    <div className="tree-node">
      <div className="tree-node-header">
        {isExpandable(value) ? (
          <button
            className={`expand-button ${isExpanded ? 'expanded' : 'collapsed'}`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            ▶
          </button>
        ) : (
          <span className="expand-placeholder"></span>
        )}
        <span
          className="node-label"
          onClick={() =>
            handleCopy(
              JSON.stringify({
                [label]: value,
              })
            )
          }
        >
          {label}
        </span>
        {!isExpandable(value) && <span className="node-value">{renderPrimitiveValue(value)}</span>}
      </div>
      {isExpandable(value) && isExpanded && (
        <div className="tree-node-children">{renderChildren()}</div>
      )}
    </div>
  );
};

// 数据组查看器组件
interface DataViewerProps {
  data: any;
}

const DataViewer: React.FC<DataViewerProps> = ({ data }) => {
  if (data === null || data === undefined || typeof data !== 'object') {
    return (
      <DataStructureViewer>
        <TreeNode label="value" value={data} level={0} />
      </DataStructureViewer>
    );
  }

  const entries = Object.entries(data);

  return (
    <DataStructureViewer>
      {entries.map(([key, value], index) => (
        <TreeNode
          key={key}
          label={key}
          value={value}
          level={0}
          isLast={index === entries.length - 1}
        />
      ))}
    </DataStructureViewer>
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
}

const msToSeconds = (ms: number): string => (ms / 1000).toFixed(2) + 's';

const getStatusText = (status: NodeStatus) => {
  switch (status) {
    case "running":
      return "Running";
    case "success":
      return "Succeed";
    case "error":
      return "Failed";
    case "waiting":
      return "Pending";
    default:
      return "Pending";
  }
};

const getTagColor = (status: NodeStatus) => {
  switch (status) {
    case "success":
      return 'node-status-succeed';
    case "error":
      return 'node-status-failed';
    case "running":
      return 'node-status-processing';
    default:
      return '';
  }
};

export const EnhancedNodeExecutionDetails: React.FC<EnhancedNodeExecutionDetailsProps> = ({ nodeId }) => {
  const { nodeRecords, loading } = useNodeExecutionStore();
  const [showDetail, setShowDetail] = useState(false);

  // 获取当前节点的执行记录
  const nodeRecord = nodeRecords[nodeId];

  // 从 store 中获取数据
  const status = nodeRecord?.status || "idle";
  const error = nodeRecord?.error;
  const inputs = nodeRecord?.inputs;
  const outputs = nodeRecord?.outputs;
  const duration = nodeRecord?.duration || 0;

  const hasContent = inputs || outputs || error;

  // 如果正在加载且没有数据，不显示
  if (loading && !nodeRecord) {
    return null;
  }

  // 如果没有运行记录，不显示
  if (!nodeRecord) {
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
            {msToSeconds(duration)}
          </Tag>
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
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <NodeStatusGroup title="Inputs" data={inputs} />
          <NodeStatusGroup title="Outputs" data={outputs} />
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
`;

// 注入全局样式
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = globalStyles;
  document.head.appendChild(styleElement);
} 