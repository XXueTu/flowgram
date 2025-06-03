import { useCallback, useEffect, useState } from "react";

import { Badge, Button, Toast } from "@douyinfe/semi-ui";
import { FlowNodeEntity, getNodeForm, useClientContext } from "@flowgram.ai/free-layout-editor";
import { CanvasService } from "../../services/canvas";

export function Save(props: { disabled: boolean }) {
  const [errorCount, setErrorCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const clientContext = useClientContext();

  const updateValidateData = useCallback(() => {
    const allForms = clientContext.document.getAllNodes().map((node) => getNodeForm(node));
    const count = allForms.filter((form) => form?.state.invalid).length;
    setErrorCount(count);
  }, [clientContext]);

  /**
   * Validate all node and Save
   */
  const onSave = useCallback(async () => {
    try {
      setSaving(true);
      // 验证所有节点
      const allForms = clientContext.document.getAllNodes().map((node) => getNodeForm(node));
      await Promise.all(allForms.map(async (form) => form?.validate()));

      // 调用保存接口
      const canvasService = CanvasService.getInstance();
      const response = await canvasService.saveDraft({
        id: "default",
        graph: clientContext.document.toJSON(),
      });

      if (!response.success) {
        Toast.error({
          content: `保存失败: ${response.message}`,
          duration: 3,
        });
      } else {
        Toast.success({
          content: "保存成功",
          duration: 2,
        });
      }
    } catch (error) {
      console.error("保存失败:", error);
      Toast.error({
        content: error instanceof Error ? error.message : "保存失败",
        duration: 3,
      });
    } finally {
      setSaving(false);
    }
  }, [clientContext]);

  /**
   * Listen single node validate
   */
  useEffect(() => {
    const listenSingleNodeValidate = (node: FlowNodeEntity) => {
      const form = getNodeForm(node);
      if (form) {
        const formValidateDispose = form.onValidate(() => updateValidateData());
        node.onDispose(() => formValidateDispose.dispose());
      }
    };
    clientContext.document.getAllNodes().map((node) => listenSingleNodeValidate(node));
    const dispose = clientContext.document.onNodeCreate(({ node }) => listenSingleNodeValidate(node));
    return () => dispose.dispose();
  }, [clientContext]);

  if (errorCount === 0) {
    return (
      <Button disabled={props.disabled || saving} loading={saving} onClick={onSave} style={{ backgroundColor: "rgba(171,181,255,0.3)", borderRadius: "8px" }}>
        保存
      </Button>
    );
  }
  return (
    <Badge count={errorCount} position="rightTop" type="danger">
      <Button
        type="danger"
        disabled={props.disabled || saving}
        loading={saving}
        onClick={onSave}
        style={{ backgroundColor: "rgba(255, 179, 171, 0.3)", borderRadius: "8px" }}
      >
        保存
      </Button>
    </Badge>
  );
}
