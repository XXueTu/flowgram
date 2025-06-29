import { useContext, useState } from 'react';

import { IconPlay, IconSmallTriangleDown, IconSmallTriangleLeft } from '@douyinfe/semi-icons';
import { Button, Tooltip } from '@douyinfe/semi-ui';
import { CommandService, useClientContext } from '@flowgram.ai/free-layout-editor';

import { NodeMenu } from '../../components/node-menu';
import { CanvasContext } from '../../context';
import { SingleRunContext } from '../../context/single-run-context';
import { useIsSidebar, useNodeRenderContext } from '../../hooks';
import { WorkflowNodeType } from '../../nodes/constants';
import { FlowCommandId } from '../../shortcuts';
import { Header, Operators } from './styles';
import { TitleInput } from './title-input';
import { getIcon } from './utils';

export function FormHeader() {
  const { node, expanded, toggleExpand, readonly, form } = useNodeRenderContext();
  const [titleEdit, updateTitleEdit] = useState<boolean>(false);
  const ctx = useClientContext();
  const isSidebar = useIsSidebar();
  const { canvasId } = useContext(CanvasContext);
  const { openSingleRun } = useContext(SingleRunContext);

  const handleExpand = (e: React.MouseEvent) => {
    toggleExpand();
    e.stopPropagation(); // Disable clicking prevents the sidebar from opening
  };

  const handleDelete = () => {
    ctx.get<CommandService>(CommandService).executeCommand(FlowCommandId.DELETE, [node]);
  };

  const handleRunSingle = (e: React.MouseEvent) => {
    e.stopPropagation(); // 防止冒泡
    
    // 获取节点标题
    const nodeTitle = form?.getValueIn('title') || node.id;
    
    console.log('单组件运行', { 
      nodeId: node.id, 
      canvasId, 
      nodeTitle,
      nodeType: node.type 
    });
    
    openSingleRun(node.id, canvasId, nodeTitle);
  };
  console.log('node:', node.flowNodeType);
  // 检查是否应该显示运行按钮（排除start、end、condition节点）
  const shouldShowRunButton = !readonly && 
    node.flowNodeType !== WorkflowNodeType.Start && 
    node.flowNodeType !== WorkflowNodeType.End && 
    node.flowNodeType !== WorkflowNodeType.Condition;

  return (
    <Header>
      {getIcon(node)}
      <TitleInput readonly={readonly} updateTitleEdit={updateTitleEdit} titleEdit={titleEdit} />
      {node.renderData.expandable && !isSidebar && (
        <Button
          type="primary"
          icon={expanded ? <IconSmallTriangleDown /> : <IconSmallTriangleLeft />}
          size="small"
          theme="borderless"
          onClick={handleExpand}
        />
      )}
      {/* 单组件运行按钮 */}
      {shouldShowRunButton && !isSidebar && (
        <Tooltip content="单组件运行">
          <Button
            type="primary"
            icon={<IconPlay />}
            size="small"
            theme="borderless"
            onClick={handleRunSingle}
          />
        </Tooltip>
      )}
      {readonly ? undefined : (
        <Operators>
          <NodeMenu node={node} deleteNode={handleDelete} updateTitleEdit={updateTitleEdit} />
        </Operators>
      )}
    </Header>
  );
}