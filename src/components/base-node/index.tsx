import { useCallback } from 'react';

import { ConfigProvider } from '@douyinfe/semi-ui';
import { FlowNodeEntity, useNodeRender } from '@flowgram.ai/free-layout-editor';

import { NodeRenderContext } from '../../context';
import { NodeWrapper } from './node-wrapper';
import { ErrorIcon } from './styles';

export const BaseNode = ({ node }: { node: FlowNodeEntity }) => {
  /**
   * Provides methods related to node rendering
   * 提供节点渲染相关的方法
   */
  const nodeRender = useNodeRender();
  /**
   * It can only be used when nodeEngine is enabled
   * 只有在节点引擎开启时候才能使用表单
   */
  const form = nodeRender.form;

  /**
   * Used to make the Tooltip scale with the node, which can be implemented by itself depending on the UI library
   * 用于让 Tooltip 跟随节点缩放, 这个可以根据不同的 ui 库自己实现
   */
  const getPopupContainer = useCallback(() => node.renderData.node || document.body, []);

  return (
    <ConfigProvider getPopupContainer={getPopupContainer}>
      <NodeRenderContext.Provider value={nodeRender}>
        <NodeWrapper>
          {form?.state.invalid && <ErrorIcon />}
          {form?.render()}
        </NodeWrapper>
      </NodeRenderContext.Provider>
    </ConfigProvider>
  );
};

// 导出组件和类型
export { EnhancedNodeExecutionDetails } from "./enhanced-node-execution-details";
export { NodeExecutionDetails } from "./node-execution-details";
export type { NodeStatus } from "./node-execution-details";
export { NodeWrapper } from "./node-wrapper";
export type { NodeWrapperProps } from "./node-wrapper";
export { NodeStatusBar } from "./status-bar";
export { scrollToView } from "./utils";

