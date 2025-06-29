import { useCallback, useContext, useEffect, useMemo } from 'react';

import { SideSheet } from '@douyinfe/semi-ui';
import {
    PlaygroundEntityContext,
    useClientContext,
    useRefresh,
} from '@flowgram.ai/free-layout-editor';

import { IsSidebarContext, NodeRenderContext, SidebarContext, SingleRunContext } from '../../context';
import { FlowNodeMeta } from '../../typings';
import { SingleRunSidebar } from '../single-run-sidebar/index';

export const SidebarRenderer = () => {
  const { nodeRender, setNodeRender } = useContext(SidebarContext);
  const { singleRunState, closeSingleRun } = useContext(SingleRunContext);
  const { selection, playground } = useClientContext();
  const refresh = useRefresh();

  const handleClose = useCallback(() => {
    if (singleRunState.visible) {
      closeSingleRun();
    } else {
      setNodeRender(undefined);
    }
  }, [singleRunState.visible, closeSingleRun, setNodeRender]);

  /**
   * Listen readonly
   */
  useEffect(() => {
    const disposable = playground.config.onReadonlyOrDisabledChange(() => refresh());
    return () => disposable.dispose();
  }, [playground]);

  /**
   * Listen selection
   */
  useEffect(() => {
    const toDispose = selection.onSelectionChanged(() => {
      /**
       * 如果没有选中任何节点，则自动关闭侧边栏
       * If no node is selected, the sidebar is automatically closed
       */
      if (selection.selection.length === 0) {
        // 只有在非单组件运行状态时才关闭侧边栏
        if (!singleRunState.visible) {
          setNodeRender(undefined);
        }
      } else if (selection.selection.length === 1 && selection.selection[0] !== nodeRender?.node) {
        // 选中其他节点时，关闭单组件运行界面，但保持节点侧边栏
        if (singleRunState.visible) {
          closeSingleRun();
        } else {
          setNodeRender(undefined);
        }
      }
    });
    return () => toDispose.dispose();
  }, [selection, setNodeRender, singleRunState.visible, closeSingleRun]);

  /**
   * Close when node disposed
   */
  useEffect(() => {
    if (nodeRender) {
      const toDispose = nodeRender.node.onDispose(() => {
        setNodeRender(undefined);
        if (singleRunState.visible) {
          closeSingleRun();
        }
      });
      return () => toDispose.dispose();
    }
    return () => {};
  }, [nodeRender, singleRunState.visible, closeSingleRun]);

  const visible = useMemo(() => {
    // 如果是单组件运行状态，直接显示
    if (singleRunState.visible) {
      return true;
    }
    
    // 否则判断普通的节点侧边栏显示逻辑
    if (!nodeRender) {
      return false;
    }
    const { disableSideBar = false } = nodeRender.node.getNodeMeta<FlowNodeMeta>();
    return !disableSideBar;
  }, [nodeRender, singleRunState.visible]);

  if (playground.config.readonly && !singleRunState.visible) {
    return null;
  }

  // 决定显示内容：优先显示单组件运行界面
  const content = (() => {
    if (singleRunState.visible) {
      return <SingleRunSidebar />;
    }
    
    if (nodeRender) {
      return (
        <PlaygroundEntityContext.Provider key={nodeRender.node.id} value={nodeRender.node}>
          <NodeRenderContext.Provider value={nodeRender}>
            {nodeRender.form?.render()}
          </NodeRenderContext.Provider>
        </PlaygroundEntityContext.Provider>
      );
    }
    
    return null;
  })();

  return (
    <SideSheet style={{ width: '130%' }} mask={false} visible={visible} onCancel={handleClose}>
      <IsSidebarContext.Provider value={true}>{content}</IsSidebarContext.Provider>
    </SideSheet>
  );
};
