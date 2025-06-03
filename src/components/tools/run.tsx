import { useState } from 'react';

import { Button } from '@douyinfe/semi-ui';
import { useService } from '@flowgram.ai/free-layout-editor';

import { RunningService } from '../../services';
import { RunConfigDrawer } from './run-config-drawer';

/**
 * Run the simulation and highlight the lines
 */
export function Run() {
  const [isRunning, setRunning] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const runningService = useService(RunningService);

  const handleRun = async (params: Record<string, any>) => {
    setRunning(true);
    try {
      await runningService.startRun(params);
    } finally {
      setRunning(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setShowConfig(true)}
        loading={isRunning}
        style={{ backgroundColor: 'rgba(171,181,255,0.3)', borderRadius: '8px' }}
      >
        Run
      </Button>
      <RunConfigDrawer
        visible={showConfig}
        onClose={() => setShowConfig(false)}
        onRun={handleRun}
      />
    </>
  );
}
