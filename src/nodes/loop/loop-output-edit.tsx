import Icon, { IconCrossCircleStroked, IconPlus } from '@douyinfe/semi-icons';
import { Button, Input, TreeSelect } from '@douyinfe/semi-ui';
import { getSchemaIcon } from '@flowgram.ai/form-materials';
import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
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

interface LoopOutputPropertyEditProps {
  propertyKey: string;
  value: JsonSchema;
  subCanvasOutputs: SubCanvasOutput[];
  disabled?: boolean;
  onChange: (value: JsonSchema, propertyKey: string, newPropertyKey?: string) => void;
  onDelete?: () => void;
}

// 子画布变量选择器组件
const SubCanvasVariableSelector: React.FC<{
  value?: string;
  onChange: (value?: string) => void;
  subCanvasOutputs: SubCanvasOutput[];
  style?: React.CSSProperties;
  disabled?: boolean;
  placeholder?: string;
}> = ({ value, onChange, subCanvasOutputs, style, disabled, placeholder }) => {
  
  // 构建TreeSelect的treeData
  const treeData = useMemo(() => {
    console.log('=== SubCanvasVariableSelector Debug ===');
    console.log('subCanvasOutputs:', subCanvasOutputs);
    
    if (subCanvasOutputs.length === 0) {
      console.log('No subCanvasOutputs found, returning empty treeData');
      return [];
    }

    const nodes = subCanvasOutputs.map(({ nodeId, nodeTitle, outputs }) => {
      console.log(`Processing node: ${nodeId} (${nodeTitle})`, outputs);
      
      if (Object.keys(outputs).length === 0) {
        return null;
      }

      const children = Object.entries(outputs).map(([outputKey, outputSchema]) => ({
        key: `${nodeId}.${outputKey}`,
        value: `${nodeId}.${outputKey}`,
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon size="small" svg={getSchemaIcon(outputSchema)} />
            <span>{outputKey}</span>
            <span style={{ fontSize: '11px', color: '#999' }}>
              ({outputSchema.type || 'unknown'})
            </span>
          </div>
        ),
      }));

      return {
        key: nodeId,
        value: nodeId,
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon size="small" svg={getSchemaIcon({ type: 'object' })} />
            <span>{nodeTitle}</span>
          </div>
        ),
        children,
      };
    }).filter((node): node is NonNullable<typeof node> => node !== null);
    
    console.log('Final treeData:', nodes);
    console.log('=== End Debug ===');
    
    return nodes;
  }, [subCanvasOutputs]);

  const handleChange = useCallback((node: any) => {
    if (typeof node === 'string') {
      onChange(node);
    } else if (node && typeof node.value === 'string') {
      onChange(node.value);
    } else {
      onChange(undefined);
    }
  }, [onChange]);

  return (
    <TreeSelect
      value={value}
      onChange={handleChange}
      treeData={treeData}
      style={style}
      disabled={disabled}
      placeholder={placeholder || '选择子组件输出'}
      searchPosition="trigger"
      filterTreeNode
      leafOnly
      defaultExpandAll
    />
  );
};

const LoopOutputPropertyEdit: React.FC<LoopOutputPropertyEditProps> = (props) => {
  const { value, disabled, subCanvasOutputs } = props;
  const [inputKey, updateKey] = useState(props.propertyKey);

  // 获取数组子类型的显示文本（缩写格式）
  const getArrayTypeDisplay = useCallback((schema: JsonSchema): string => {
    if (schema.type === 'array' && schema.items) {
      const itemType = schema.items.type || 'unknown';
      // 类型缩写映射
      const typeMap: Record<string, string> = {
        'string': 'str',
        'integer': 'int', 
        'number': 'num',
        'boolean': 'bool',
        'object': 'obj',
        'array': 'arr'
      };
      const shortType = typeMap[itemType] || itemType;
      return `[${shortType}]`;
    }
    const typeMap: Record<string, string> = {
      'string': 'str',
      'integer': 'int', 
      'number': 'num',
      'boolean': 'bool',
      'object': 'obj',
      'array': 'arr'
    };
    return typeMap[schema.type || 'unknown'] || schema.type || 'unknown';
  }, []);

  // 解析当前选择的源
  const currentSelection = useMemo((): string | undefined => {
    if (value.description) {
      const match = value.description.match(/^源自: (.+)$/);
      if (match) {
        const sourcePath = match[1];
        return sourcePath; // 直接返回字符串路径
      }
    }
    return undefined;
  }, [value.description]);

  useLayoutEffect(() => {
    updateKey(props.propertyKey);
  }, [props.propertyKey]);

  // 处理SubCanvasVariableSelector的值变化
  const handleSourceChange = useCallback((selectedValue?: string) => {
    console.log('SubCanvasVariableSelector onChange called with:', selectedValue);
    
    if (!selectedValue) return;
    
    const [nodeId, outputKey] = selectedValue.split('.');
    const nodeData = subCanvasOutputs.find(output => output.nodeId === nodeId);
    
    if (nodeData && nodeData.outputs[outputKey]) {
      const outputSchema = nodeData.outputs[outputKey];
      const newSchema: JsonSchema = {
        type: 'array',
        title: value.title || inputKey,
        description: `源自: ${selectedValue}`,
        items: {
          ...outputSchema,
          title: `${inputKey}项`
        }
      };
      
      props.onChange(newSchema, props.propertyKey);
    }
  }, [subCanvasOutputs, value.title, inputKey, props]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6, fontSize: '12px' }}>
      <div style={{ width: 150, marginRight: 8, position: 'relative' }}>
        <div style={{ 
          position: 'absolute', 
          top: 2, 
          left: 4, 
          zIndex: 1, 
          padding: '0 4px', 
          height: 20,
          background: '#f0f0f0',
          borderRadius: 2,
          fontSize: '10px',
          display: 'flex',
          alignItems: 'center',
          color: '#666',
          minWidth: '32px'
        }}>
          {getArrayTypeDisplay(value)}
        </div>
        <Input
          value={inputKey}
          disabled={disabled}
          size="small"
          placeholder="输出参数名"
          onChange={(v) => updateKey(v.trim())}
          onBlur={() => {
            if (inputKey !== '') {
              props.onChange(value, props.propertyKey, inputKey);
            } else {
              updateKey(props.propertyKey);
            }
          }}
          style={{ paddingLeft: 40, width: '100%' }}
        />
      </div>
      
      <div style={{ flex: 1, marginRight: 8, minWidth: 200 }}>
        <SubCanvasVariableSelector
          value={currentSelection}
          onChange={handleSourceChange}
          subCanvasOutputs={subCanvasOutputs}
          style={{ width: '100%' }}
          disabled={disabled}
          placeholder="选择子组件输出"
        />
      </div>
      
      {props.onDelete && !disabled && (
        <Button
          style={{ flexShrink: 0 }}
          size="small"
          theme="borderless"
          icon={<IconCrossCircleStroked />}
          onClick={props.onDelete}
        />
      )}
    </div>
  );
};

export const LoopOutputEdit: React.FC<LoopOutputEditProps> = ({ value, subCanvasOutputs, onChange }) => {
  const { readonly } = useNodeRenderContext();
  const [newProperty, updateNewPropertyFromCache] = useState<{ key: string; value: JsonSchema }>({
    key: '',
    value: { type: 'array', title: '', items: { type: 'string' } },
  });
  const [newPropertyVisible, setNewPropertyVisible] = useState<boolean>(false);

  const clearCache = () => {
    updateNewPropertyFromCache({ 
      key: '', 
      value: { type: 'array', title: '', items: { type: 'string' } } 
    });
    setNewPropertyVisible(false);
  };

  const updateProperty = (
    propertyValue: JsonSchema,
    propertyKey: string,
    newPropertyKey?: string
  ) => {
    const newValue = { ...value };
    if (newPropertyKey) {
      delete newValue[propertyKey];
      newValue[newPropertyKey] = propertyValue;
    } else {
      newValue[propertyKey] = propertyValue;
    }
    onChange(newValue);
  };

  const updateNewProperty = (
    propertyValue: JsonSchema,
    propertyKey: string,
    newPropertyKey?: string
  ) => {
    if (newPropertyKey) {
      if (!(newPropertyKey in value)) {
        updateProperty(propertyValue, propertyKey, newPropertyKey);
      }
      clearCache();
    } else {
      updateNewPropertyFromCache({
        key: newPropertyKey || propertyKey,
        value: propertyValue,
      });
    }
  };

  return (
    <div>
      {/* 显示可用子组件输出的提示 */}
      {subCanvasOutputs.length === 0 && (
        <div style={{ 
          marginBottom: 12, 
          padding: 8, 
          background: '#fff3cd', 
          borderRadius: 4,
          fontSize: '12px',
          color: '#856404'
        }}>
          当前子画布中没有检测到有输出的组件。请先在子画布中添加组件并配置其输出。
        </div>
      )}

      {subCanvasOutputs.length > 0 && (
        <div style={{ 
          marginBottom: 12, 
          padding: 8, 
          background: '#e8f5e8', 
          borderRadius: 4,
          fontSize: '11px',
          color: '#6c757d'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: 4, color: '#495057' }}>
            可用的子画布组件输出:
          </div>
          {subCanvasOutputs.map(({ nodeId, nodeTitle, outputs }) => (
            <div key={nodeId} style={{ marginBottom: 2 }}>
              • <span style={{ fontWeight: 'bold' }}>{nodeTitle}</span>: {Object.entries(outputs).map(([key, schema]) => 
                `${key}(${schema.type || 'unknown'})`
              ).join(', ')}
            </div>
          ))}
        </div>
      )}

      {/* 现有的输出配置 */}
      {Object.keys(value || {}).map((key) => {
        const property = (value[key] || {}) as JsonSchema;
        return (
          <LoopOutputPropertyEdit
            key={key}
            propertyKey={key}
            value={property}
            subCanvasOutputs={subCanvasOutputs}
            disabled={readonly}
            onChange={updateProperty}
            onDelete={() => {
              const newValue = { ...value };
              delete newValue[key];
              onChange(newValue);
            }}
          />
        );
      })}

      {/* 新属性编辑器 */}
      {newPropertyVisible && (
        <LoopOutputPropertyEdit
          propertyKey={newProperty.key}
          value={newProperty.value}
          subCanvasOutputs={subCanvasOutputs}
          onChange={updateNewProperty}
          onDelete={() => {
            const key = newProperty.key;
            setTimeout(() => {
              const newValue = { ...value };
              delete newValue[key];
              onChange(newValue);
              clearCache();
            }, 10);
          }}
        />
      )}

      {/* 添加按钮 */}
      {!readonly && (
        <div>
          <Button
            theme="borderless"
            icon={<IconPlus />}
            onClick={() => setNewPropertyVisible(true)}
            disabled={subCanvasOutputs.length === 0}
          >
            添加输出参数
          </Button>
        </div>
      )}
    </div>
  );
}; 