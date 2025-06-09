import { IconCrossCircleStroked, IconPlus } from '@douyinfe/semi-icons';
import { Button, Input, Select } from '@douyinfe/semi-ui';
import React, { useCallback, useState } from 'react';
import { useNodeRenderContext } from '../../hooks';
import { JsonSchema } from '../../typings';

interface SubCanvasOutput {
  nodeId: string;
  nodeTitle: string;
  outputs: Record<string, any>;
}

interface LoopOutputEditProps {
  value: Record<string, JsonSchema>;
  subCanvasOutputs: SubCanvasOutput[];
  onChange: (value: Record<string, JsonSchema>) => void;
}

interface LoopOutputProperty {
  key: string;
  name: string;
  sourceNodeId: string;
  sourceOutputKey: string;
  type: string;
}

export const LoopOutputEdit: React.FC<LoopOutputEditProps> = ({ value, subCanvasOutputs, onChange }) => {
  const { readonly } = useNodeRenderContext();
  const [newProperty, setNewProperty] = useState<LoopOutputProperty>({
    key: '',
    name: '',
    sourceNodeId: '',
    sourceOutputKey: '',
    type: 'array'
  });
  const [newPropertyVisible, setNewPropertyVisible] = useState(false);

  // 构建可选择的输出选项
  const outputOptions = subCanvasOutputs.flatMap(({ nodeId, nodeTitle, outputs }) =>
    Object.entries(outputs).map(([outputKey, outputSchema]) => ({
      label: `${nodeTitle} - ${outputKey} (${outputSchema.type || 'unknown'})`,
      value: `${nodeId}:${outputKey}`,
      nodeId,
      nodeTitle,
      outputKey,
      outputSchema
    }))
  );

  // 解析当前配置的输出
  const parseCurrentOutputs = useCallback((): LoopOutputProperty[] => {
    return Object.entries(value).map(([key, schema]) => {
      // 尝试从description中解析源信息
      const match = schema.description?.match(/^源自: (.+) - (.+)$/);
      if (match) {
        return {
          key,
          name: key,
          sourceNodeId: match[1].split(' ')[0],
          sourceOutputKey: match[2],
          type: schema.type || 'array'
        };
      }
      return {
        key,
        name: key,
        sourceNodeId: '',
        sourceOutputKey: '',
        type: schema.type || 'array'
      };
    });
  }, [value]);

  const currentProperties = parseCurrentOutputs();

  const updateProperty = useCallback((index: number, field: keyof LoopOutputProperty, newValue: string) => {
    const properties = [...currentProperties];
    properties[index] = { ...properties[index], [field]: newValue };

    // 如果更改了源选择，自动更新类型
    if (field === 'sourceNodeId' || field === 'sourceOutputKey') {
      const sourceInfo = newValue.split(':');
      if (sourceInfo.length === 2) {
        const [nodeId, outputKey] = sourceInfo;
        const sourceOutput = subCanvasOutputs
          .find(output => output.nodeId === nodeId)
          ?.outputs[outputKey];
        
        if (sourceOutput) {
          properties[index].sourceNodeId = nodeId;
          properties[index].sourceOutputKey = outputKey;
          properties[index].type = 'array'; // 总是包装成数组
        }
      }
    }

    updateOutputs(properties);
  }, [currentProperties, subCanvasOutputs]);

  const updateOutputs = useCallback((properties: LoopOutputProperty[]) => {
    const newOutputs: Record<string, JsonSchema> = {};

    properties.forEach(prop => {
      if (prop.name && prop.sourceNodeId && prop.sourceOutputKey) {
        const sourceOutput = subCanvasOutputs
          .find(output => output.nodeId === prop.sourceNodeId)
          ?.outputs[prop.sourceOutputKey];

        if (sourceOutput) {
          const nodeTitle = subCanvasOutputs
            .find(output => output.nodeId === prop.sourceNodeId)?.nodeTitle || prop.sourceNodeId;

          newOutputs[prop.name] = {
            type: 'array',
            title: prop.name,
            description: `源自: ${nodeTitle} - ${prop.sourceOutputKey}`,
            items: {
              ...sourceOutput,
              title: `${prop.name}项`
            }
          };
        }
      }
    });

    onChange(newOutputs);
  }, [subCanvasOutputs, onChange]);

  const addProperty = useCallback(() => {
    if (newProperty.name && newProperty.sourceNodeId && newProperty.sourceOutputKey) {
      const properties = [...currentProperties, { ...newProperty, key: Date.now().toString() }];
      updateOutputs(properties);
      setNewProperty({
        key: '',
        name: '',
        sourceNodeId: '',
        sourceOutputKey: '',
        type: 'array'
      });
      setNewPropertyVisible(false);
    }
  }, [newProperty, currentProperties, updateOutputs]);

  const removeProperty = useCallback((index: number) => {
    const properties = currentProperties.filter((_, i) => i !== index);
    updateOutputs(properties);
  }, [currentProperties, updateOutputs]);

  return (
    <div>
      {subCanvasOutputs.length === 0 && (
        <div style={{ marginBottom: 16, padding: 12, background: '#fff3cd', borderRadius: 4 }}>
          <div style={{ fontSize: '12px', color: '#856404' }}>
            当前子画布中没有检测到有输出的组件。请先在子画布中添加组件并配置其输出。
          </div>
        </div>
      )}

      {currentProperties.map((property, index) => (
        <div key={property.key} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: 8, 
          padding: 8, 
          border: '1px solid #e6e6e6', 
          borderRadius: 4 
        }}>
          <Input
            placeholder="输出参数名"
            value={property.name}
            disabled={readonly}
            style={{ width: 120, marginRight: 8 }}
            onChange={(value) => updateProperty(index, 'name', value)}
          />
          <Select
            placeholder="选择源输出"
            value={property.sourceNodeId && property.sourceOutputKey ? 
              `${property.sourceNodeId}:${property.sourceOutputKey}` : ''}
            disabled={readonly}
            style={{ flex: 1, marginRight: 8 }}
            optionList={outputOptions}
            onChange={(value) => updateProperty(index, 'sourceNodeId', value as string)}
          />
          <span style={{ marginRight: 8, fontSize: '12px', color: '#666' }}>
            array
          </span>
          {!readonly && (
            <Button
              size="small"
              theme="borderless"
              icon={<IconCrossCircleStroked />}
              onClick={() => removeProperty(index)}
            />
          )}
        </div>
      ))}

      {newPropertyVisible && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: 8, 
          padding: 8, 
          border: '1px solid #1890ff', 
          borderRadius: 4,
          background: '#f6ffff'
        }}>
          <Input
            placeholder="输出参数名"
            value={newProperty.name}
            style={{ width: 120, marginRight: 8 }}
            onChange={(value) => setNewProperty(prev => ({ ...prev, name: value }))}
          />
          <Select
            placeholder="选择源输出"
            value={newProperty.sourceNodeId && newProperty.sourceOutputKey ? 
              `${newProperty.sourceNodeId}:${newProperty.sourceOutputKey}` : ''}
            style={{ flex: 1, marginRight: 8 }}
            optionList={outputOptions}
            onChange={(value) => {
              const [nodeId, outputKey] = (value as string).split(':');
              setNewProperty(prev => ({ 
                ...prev, 
                sourceNodeId: nodeId, 
                sourceOutputKey: outputKey 
              }));
            }}
          />
          <span style={{ marginRight: 8, fontSize: '12px', color: '#666' }}>
            array
          </span>
          <Button
            size="small"
            type="primary"
            onClick={addProperty}
            disabled={!newProperty.name || !newProperty.sourceNodeId || !newProperty.sourceOutputKey}
          >
            确定
          </Button>
          <Button
            size="small"
            theme="borderless"
            onClick={() => setNewPropertyVisible(false)}
            style={{ marginLeft: 4 }}
          >
            取消
          </Button>
        </div>
      )}

      {!readonly && !newPropertyVisible && (
        <Button
          theme="borderless"
          icon={<IconPlus />}
          onClick={() => setNewPropertyVisible(true)}
          disabled={outputOptions.length === 0}
        >
          添加输出参数
        </Button>
      )}

      {outputOptions.length > 0 && (
        <div style={{ marginTop: 12, padding: 8, background: '#f8f9fa', borderRadius: 4 }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: 4 }}>
            可选择的子组件输出:
          </div>
          {subCanvasOutputs.map(({ nodeId, nodeTitle, outputs }) => (
            <div key={nodeId} style={{ fontSize: '11px', color: '#999' }}>
              • {nodeTitle}: {Object.keys(outputs).join(', ')}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 