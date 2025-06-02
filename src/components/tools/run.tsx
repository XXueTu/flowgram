import { useState } from 'react';

import { Button } from '@douyinfe/semi-ui';
import { useService } from '@flowgram.ai/free-layout-editor';

import { RunningService } from '../../services';

/**
 * Run the simulation and highlight the lines
 */
export function Run() {
  const [isRunning, setRunning] = useState(false);
  const runningService = useService(RunningService);
  const onRun = async () => {
    setRunning(true);
    console.log(runningService.document.toJSON());
    await runningService.startRun();
    setRunning(false);
  };
  return (
    <Button
      onClick={onRun}
      loading={isRunning}
      style={{ backgroundColor: 'rgba(171,181,255,0.3)', borderRadius: '8px' }}
    >
      Run
    </Button>
  );
}
