import { Button, JsonViewer, SideSheet } from '@douyinfe/semi-ui';
import { useService, WorkflowDocument } from '@flowgram.ai/free-layout-editor';
import React, { useEffect, useRef, useState } from 'react';

interface RunConfigDrawerProps {
  visible: boolean;
  onClose: () => void;
  onRun: (params: Record<string, any>) => void;
}

// 递归生成默认参数
function generateDefault(schema: any): any {
  if (!schema) return undefined;
  if (schema.default !== undefined) return schema.default;
  switch (schema.type) {
    case 'string':
      return '';
    case 'number':
      return 0;
    case 'boolean':
      return false;
    case 'object': {
      const obj: Record<string, any> = {};
      if (schema.properties) {
        for (const key in schema.properties) {
          obj[key] = generateDefault(schema.properties[key]);
        }
      }
      return obj;
    }
    case 'array': {
      if (schema.items) {
        // 默认给一个元素
        return [generateDefault(schema.items)];
      }
      return [];
    }
    default:
      return null;
  }
}

export const RunConfigDrawer: React.FC<RunConfigDrawerProps> = ({ visible, onClose, onRun }) => {
  const [params, setParams] = useState('{}');
  const [error, setError] = useState<string | null>(null);
  const document = useService(WorkflowDocument);
  const jsonviewerRef = useRef<any>(null);

  useEffect(() => {
    if (visible) {
      const startNode = document.getNode('start_0');
      const outputs = startNode?.toJSON().data?.outputs;
      console.log('outputs:', outputs);
      if (outputs) {
        const defaultParams = generateDefault(outputs);
        console.log('defaultParams:', defaultParams);
        setParams(JSON.stringify(defaultParams, null, 2));
      }
    }
  }, [visible, document]);

  const handleRun = () => {
    try {
      const value = jsonviewerRef.current?.getValue();
      const parsedParams = JSON.parse(value);
      onRun(parsedParams);
      onClose();
    } catch (e) {
      setError('JSON 格式错误');
    }
  };

  return (
    <SideSheet
      title="运行参数配置"
      visible={visible}
      onCancel={onClose}
      placement="right"
      width={400}
    >
      <div style={{ padding: '20px' }}>
        <JsonViewer
          ref={jsonviewerRef}
          value={params}
          height={300}
          editable
        />
        {error && <div style={{ color: 'red', marginTop: '4px' }}>{error}</div>}
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: '8px' }}>
            取消
          </Button>
          <Button type="primary" onClick={handleRun}>
            运行
          </Button>
        </div>
      </div>
    </SideSheet>
  );
}; 