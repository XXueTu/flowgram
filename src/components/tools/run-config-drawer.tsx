import { Button, Input, JsonViewer, Modal, Select, SideSheet } from '@douyinfe/semi-ui';
import { useService, WorkflowDocument } from '@flowgram.ai/free-layout-editor';
import React, { useEffect, useRef, useState } from 'react';
import { Case, CaseDetailResponse, CaseService } from '../../services/case';

interface RunConfigDrawerProps {
  visible: boolean;
  onClose: () => void;
  onRun: (params: Record<string, any>) => void;
  workspaceId: string;
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

export const RunConfigDrawer: React.FC<RunConfigDrawerProps> = ({ visible, onClose, onRun, workspaceId = "default" }) => {
  const [params, setParams] = useState('{}');
  const [error, setError] = useState<string | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCase, setSelectedCase] = useState<string>('');
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [caseName, setCaseName] = useState('');
  const document = useService(WorkflowDocument);
  const jsonviewerRef = useRef<any>(null);
  const caseService = CaseService.getInstance();

  // 加载测试用例列表
  const loadCases = async () => {
    try {
      const res = await caseService.listCases({ workspaceId });
      setCases(res.caseList || []);
    } catch (err) {
      console.error('加载测试用例列表失败:', err);
      setError('加载测试用例列表失败');
      setCases([]);
    }
  };

  // 当抽屉打开时，重置状态并加载测试用例列表
  useEffect(() => {
    if (visible) {
      setError(null);
      setSelectedCase('');
      setParams('{}');
      loadCases();
    }
  }, [visible]);

  // 选择测试用例
  useEffect(() => {
    if (selectedCase) {
      caseService.getCaseDetail({ caseId: selectedCase }).then((res: CaseDetailResponse) => {
        setParams(res.case.caseParams);
      }).catch((err: Error) => {
        console.error('加载测试用例详情失败:', err);
        setError('加载测试用例详情失败');
      });
    }
  }, [selectedCase]);

  useEffect(() => {
    if (visible) {
      const startNode = document.getNode('start_0');
      const outputs = startNode?.toJSON().data?.outputs;
      if (outputs) {
        const defaultParams = generateDefault(outputs);
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

  const handleSave = () => {
    setSaveModalVisible(true);
  };

  const handleSaveConfirm = async () => {
    try {
      const value = jsonviewerRef.current?.getValue();
      await caseService.createCase({
        workspaceId,
        caseName,
        caseParams: value
      });
      setSaveModalVisible(false);
      setCaseName('');
      // 刷新测试用例列表
      await loadCases();
    } catch (e) {
      setError('保存失败');
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
        <div style={{ marginBottom: '16px' }}>
          <Select
            style={{ width: '100%' }}
            placeholder="选择测试用例"
            value={selectedCase}
            onChange={(value) => setSelectedCase(value as string)}
            optionList={(cases || []).map(c => ({
              label: c.caseName,
              value: c.caseId
            }))}
          />
        </div>
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
          <Button onClick={handleSave} style={{ marginRight: '8px' }}>
            保存
          </Button>
          <Button type="primary" onClick={handleRun}>
            运行
          </Button>
        </div>
      </div>

      <Modal
        title="保存测试用例"
        visible={saveModalVisible}
        onCancel={() => setSaveModalVisible(false)}
        onOk={handleSaveConfirm}
      >
        <Input
          placeholder="请输入测试用例名称"
          value={caseName}
          onChange={setCaseName}
        />
      </Modal>
    </SideSheet>
  );
}; 