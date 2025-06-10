import { FC, useEffect, useState } from 'react';

import { IconRedo, IconUndo } from '@douyinfe/semi-icons';
import { Divider, IconButton, Tooltip } from '@douyinfe/semi-ui';
import { useClientContext, useRefresh } from '@flowgram.ai/free-layout-editor';

import { AddNode } from '../add-node';
import { AutoLayout } from './auto-layout';
import { Comment } from './comment';
import { FitView } from './fit-view';
import { Interactive } from './interactive';
import { Minimap } from './minimap';
import { MinimapSwitch } from './minimap-switch';
import { Readonly } from './readonly';
import { Run } from './run';
import { Save } from './save';
import { ToolContainer, ToolSection } from './styles';
import { SwitchLine } from './switch-line';
import { ZoomSelect } from './zoom-select';

export const DemoTools: FC<{ canvasId?: string }> = ({ canvasId }) => {
  const { history, playground } = useClientContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [minimapVisible, setMinimapVisible] = useState(true);
  useEffect(() => {
    const disposable = history.undoRedoService.onChange(() => {
      setCanUndo(history.canUndo());
      setCanRedo(history.canRedo());
    });
    return () => disposable.dispose();
  }, [history]);
  const refresh = useRefresh();

  useEffect(() => {
    const disposable = playground.config.onReadonlyOrDisabledChange(() => refresh());
    return () => disposable.dispose();
  }, [playground]);

  return (
    <ToolContainer className="demo-free-layout-tools">
      <ToolSection>
        <Interactive />
        <AutoLayout />
        <SwitchLine />
        <ZoomSelect />
        <FitView />
        <MinimapSwitch minimapVisible={minimapVisible} setMinimapVisible={setMinimapVisible} />
        <Minimap visible={minimapVisible} />
        <Readonly />
        <Comment />
        <Tooltip content="Undo">
          <IconButton
            type="tertiary"
            theme="borderless"
            icon={<IconUndo />}
            disabled={!canUndo || playground.config.readonly}
            onClick={() => history.undo()}
          />
        </Tooltip>
        <Tooltip content="Redo">
          <IconButton
            type="tertiary"
            theme="borderless"
            icon={<IconRedo />}
            disabled={!canRedo || playground.config.readonly}
            onClick={() => history.redo()}
          />
        </Tooltip>
        <Divider layout="vertical" style={{ height: '16px' }} margin={3} />
        <AddNode disabled={playground.config.readonly} />
        <Divider layout="vertical" style={{ height: '16px' }} margin={3} />
        <Save disabled={playground.config.readonly} canvasId={canvasId} />
        <Run canvasId={canvasId} />
      </ToolSection>
    </ToolContainer>
  );
};
