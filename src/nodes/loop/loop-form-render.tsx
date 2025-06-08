import { Collapse } from "@douyinfe/semi-ui";
import { BatchVariableSelector, IFlowRefValue, IFlowValue, JsonSchemaUtils } from "@flowgram.ai/form-materials";
import { SubCanvasRender } from '@flowgram.ai/free-container-plugin';
import { ASTNode, Field, FieldRenderProps, FlowNodeJSON, FormRenderProps, useScopeAvailable } from '@flowgram.ai/free-layout-editor';
import { mapValues } from "lodash-es";
import { Feedback, FormContent, FormHeader, FormItem, FormOutputs, PropertiesEdit } from '../../form-components';
import { useIsSidebar, useNodeRenderContext } from '../../hooks';
import { JsonSchema } from "../../typings";

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
            <Collapse.Panel header="输入" itemKey="1">
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
            <Collapse.Panel header="迭代参数" itemKey="2">
              {batchFor}
            </Collapse.Panel>
            <Collapse.Panel header="输出" itemKey="3">
              <Field
                name="custom.outputParams.properties"
                render={({ field: { value: propertiesSchemaValue, onChange: propertiesSchemaChange } }: FieldRenderProps<Record<string, JsonSchema>>) => (
                  <Field<Record<string, IFlowValue>> name="custom.outputParamsValues">
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
