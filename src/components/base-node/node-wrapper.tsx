import React, { useContext, useState } from 'react';

import { useClientContext, WorkflowPortRender } from '@flowgram.ai/free-layout-editor';

import { SidebarContext } from '../../context';
import { useNodeRenderContext } from '../../hooks';
import { NodeExecutionDetails } from './node-execution-details';
import { NodeWrapperStyle } from './styles';
import { scrollToView } from './utils';

export interface NodeWrapperProps {
  isScrollToView?: boolean;
  children: React.ReactNode;
}

/**
 * Used for drag-and-drop/click events and ports rendering of nodes
 * 用于节点的拖拽/点击事件和点位渲染
 */
export const NodeWrapper: React.FC<NodeWrapperProps> = (props) => {
  const { children, isScrollToView = false } = props;
  const nodeRender = useNodeRenderContext();
  const { selected, startDrag, ports, selectNode, nodeRef, onFocus, onBlur } = nodeRender;
  const [isDragging, setIsDragging] = useState(false);
  const sidebar = useContext(SidebarContext);
  const form = nodeRender.form;
  const ctx = useClientContext();

  const portsRender = ports.map((p) => <WorkflowPortRender key={p.id} entity={p} />);

  return (
    <>
      <NodeWrapperStyle
        className={selected ? 'selected' : ''}
        ref={nodeRef}
        draggable
        data-node-id={nodeRender.node.id}
        onDragStart={(e) => {
          startDrag(e);
          setIsDragging(true);
        }}
        onClick={(e) => {
          selectNode(e);
          if (!isDragging) {
            sidebar.setNodeRender(nodeRender);
            // 可选：将 isScrollToView 设为 true，可以让节点选中后滚动到画布中间
            // Optional: Set isScrollToView to true to scroll the node to the center of the canvas after it is selected.
            if (isScrollToView) {
              scrollToView(ctx, nodeRender.node);
            }
          }
        }}
        onMouseUp={() => setIsDragging(false)}
        onFocus={onFocus}
        onBlur={onBlur}
        data-node-selected={String(selected)}
        style={{
          outline: form?.state.invalid ? '1px solid red' : 'none',
          position: 'relative',
          paddingBottom: '32px',
        }}
      >
        {children}
      </NodeWrapperStyle>
      {portsRender}
      <NodeExecutionDetails 
        nodeId={nodeRender.node.id}
        status={'success'}
        startTime={1717689420000}
        endTime={1717689430000}
        error={'执行错误执行错误，执行错误执行错误，执行错误执行错误'}
        progress={90}
      />
    </>
  );
};
