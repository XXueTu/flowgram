import { useState } from "react";

import { Button } from "@douyinfe/semi-ui";
import { useService } from "@flowgram.ai/free-layout-editor";

import { RunningService } from "../../services";
import { useNodeExecutionStore } from "../../stores/node-execution-store";
import { RunConfigDrawer } from "./run-config-drawer";

/**
 * Run the simulation and highlight the lines
 */
export function Run({ canvasId }: { canvasId?: string }) {
  const [showConfig, setShowConfig] = useState(false);
  const runningService = useService(RunningService);
  const { runWorkflow, isRunning } = useNodeExecutionStore();

  const handleRun = async (params: Record<string, any>) => {
    try {
      // 确保 store 有文档引用
      const store = useNodeExecutionStore.getState();
      store.setDocument(runningService.document);

      // 使用 store 的 runWorkflow 方法，传递实际的canvasId
      await runWorkflow(params, canvasId || "default");
    } catch (error) {
      console.error("运行失败:", error);
    }
  };

  return (
    <>
      <Button onClick={() => setShowConfig(true)} loading={isRunning} style={{ backgroundColor: "rgba(171,181,255,0.3)", borderRadius: "8px" }}>
        运行
      </Button>
      <RunConfigDrawer visible={showConfig} onClose={() => setShowConfig(false)} onRun={handleRun} workspaceId={canvasId || "default"} />
    </>
  );
}
