import { Collapse } from "@douyinfe/semi-ui";
import { BatchVariableSelector, IFlowRefValue, IFlowValue, JsonSchemaUtils } from "@flowgram.ai/form-materials";
import { SubCanvasRender } from '@flowgram.ai/free-container-plugin';
import { ASTNode, Field, FieldRenderProps, FlowNodeJSON, FormRenderProps, getNodeForm, useClientContext, useScopeAvailable } from '@flowgram.ai/free-layout-editor';
import { mapValues } from "lodash-es";
import { useEffect, useMemo, useState } from 'react';
import { Feedback, FormContent, FormHeader, FormItem, FormOutputs, PropertiesEdit } from '../../form-components';
import { useIsSidebar, useNodeRenderContext } from '../../hooks';
import { JsonSchema } from "../../typings";
import { LoopOutputEdit } from './loop-output-edit';

interface LoopNodeJSON extends FlowNodeJSON {
  data: {
    batchFor: IFlowRefValue;
    custom?: {
      batchForType?: string;
    };
  };
}

export const LoopFormRender = ({ form }: FormRenderProps<LoopNodeJSON>) => {
  const isSidebar = useIsSidebar();
  const { readonly } = useNodeRenderContext();
  const available = useScopeAvailable();
  const clientContext = useClientContext();
  const { node } = useNodeRenderContext();
  const [refreshKey, setRefreshKey] = useState(0);

  // 监听子画布变化
  useEffect(() => {
    const disposables: Array<{ dispose: () => void }> = [];
    
    // 监听节点创建事件
    const onNodeCreate = () => {
      setRefreshKey(prev => prev + 1);
    };
    
    disposables.push(clientContext.document.onNodeCreate(onNodeCreate));
    
    // 定期检查子节点变化（作为备用方案）
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 2000); // 每2秒检查一次
    
    return () => {
      disposables.forEach(d => d.dispose());
      clearInterval(interval);
    };
  }, [clientContext.document]);

  // 获取子画布中的组件及其输出
  const subCanvasOutputs = useMemo(() => {
    // 添加refreshKey作为依赖，确保在内容变化时重新计算
    const childNodes = node.blocks || [];
    const outputs: Array<{ nodeId: string; nodeTitle: string; outputs: Record<string, any> }> = [];
    
    childNodes.forEach(childNode => {
      // 使用正确的方式获取节点表单数据
      const nodeForm = getNodeForm(childNode);
      if (nodeForm) {
        const nodeOutputs = nodeForm.getValueIn('outputs');
        const nodeTitle = nodeForm.getValueIn('title') || childNode.id;
        
        if (nodeOutputs?.properties) {
          outputs.push({
            nodeId: childNode.id,
            nodeTitle: nodeTitle,
            outputs: nodeOutputs.properties
          });
        }
      }
    });
    
    return outputs;
  }, [node.blocks, refreshKey]);

  const batchFor = (
    <Field<IFlowRefValue> name={`batchFor`}>
      {({ field, fieldState }) => (
        <FormItem name={'batchFor'} type={'array'} required>
          <BatchVariableSelector
            style={{ width: '100%' }}
            value={field.value?.content}
            onChange={(val) => {
              const variable = available.getByKeyPath(val as string[]);
              let type = "undefined";
              if (variable) {
                const schemaType = JsonSchemaUtils.astToSchema(variable?.type?.items as ASTNode<any, any>, { drilldown: false })?.type;
                if (schemaType) {
                  type = schemaType;
                }
              }
              form.setValueIn('data.custom.batchForType', type);
              field.onChange({ type: 'ref', content: val });
            }}
            readonly={readonly}
            hasError={Object.keys(fieldState?.errors || {}).length > 0}
          />
          <Feedback errors={fieldState?.errors} />
        </FormItem>
      )}
    </Field>
  );

  if (isSidebar) {
    return (
      <>
        <FormHeader />
        <FormContent>
          <Collapse defaultActiveKey={["1", "2", "3"]}>
            <Collapse.Panel header="迭代参数" itemKey="1">
              {batchFor}
            </Collapse.Panel>
            <Collapse.Panel header="中间变量" itemKey="2">
              <Field
                name="custom.requestParams.properties"
                render={({ field: { value: propertiesSchemaValue, onChange: propertiesSchemaChange } }: FieldRenderProps<Record<string, JsonSchema>>) => (
                  <Field<Record<string, IFlowValue>> name="custom.requestParamsValues">
                    {({ field: { value: propertiesValue, onChange: propertiesValueChange } }) => {
                      const onChange = (newProperties: Record<string, JsonSchema>) => {
                        const newPropertiesValue = mapValues(newProperties, (v) => v.default);
                        const newPropetiesSchema = mapValues(newProperties, (v) => {
                          delete v.default;
                          return v;
                        });
                        propertiesValueChange(newPropertiesValue);
                        propertiesSchemaChange(newPropetiesSchema);
                      };
                      const filteredSchemaValue = Object.entries(propertiesSchemaValue || {}).reduce((acc, [key, value]) => {
                        acc[key] = value;
                        return acc;
                      }, {} as Record<string, JsonSchema>);

                      const value = mapValues(filteredSchemaValue, (v, key) => ({
                        ...v,
                        default: propertiesValue?.[key],
                      }));
                      return <PropertiesEdit value={value} onChange={onChange} useFx={true} />;
                    }}
                  </Field>
                )}
              />
            </Collapse.Panel>
            <Collapse.Panel header="输出配置" itemKey="3">
              <div style={{ marginBottom: 16 }}>
                <div style={{ marginBottom: 8, fontSize: '12px', color: '#666' }}>
                  配置循环输出参数，可以选择子画布中组件的输出，类型会自动包装成数组
                </div>
                
                <Field
                  name="outputs.properties"
                  render={({ field: { value: outputsSchema, onChange: outputsSchemaChange } }: FieldRenderProps<Record<string, JsonSchema>>) => (
                    <LoopOutputEdit
                      value={outputsSchema || {}}
                      subCanvasOutputs={subCanvasOutputs}
                      onChange={outputsSchemaChange}
                    />
                  )}
                />
              </div>
            </Collapse.Panel>
          </Collapse>
          <FormOutputs />
        </FormContent>
      </>
    );
  }
  return (
    <>
      <FormHeader />
      <FormContent>
        {batchFor}
        <SubCanvasRender />
        <FormOutputs />
      </FormContent>
    </>
  );
};
