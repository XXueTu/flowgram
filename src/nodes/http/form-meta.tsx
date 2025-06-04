import { Collapse, Input, JsonViewer, Select, Switch, Tag } from "@douyinfe/semi-ui";
import React, { useCallback, useRef } from "react";

import { IFlowValue } from "@flowgram.ai/form-materials";
import { Field, FieldRenderProps, FormMeta, FormRenderProps, ValidateTrigger } from "@flowgram.ai/free-layout-editor";
import { mapValues } from "lodash-es";

import { FormContent, FormHeader, FormItem, FormOutputs, PropertiesEdit, TypeTag } from "../../form-components";
import { useIsSidebar } from "../../hooks";
import { FlowNodeJSON, JsonSchema } from "../../typings";

const apiMethods = [
  { label: "GET", value: "GET" },
  { label: "POST", value: "POST" },
  { label: "PUT", value: "PUT" },
  { label: "DELETE", value: "DELETE" },
  // 可根据需要添加更多方法
];

const bodyTypes = [
  { label: "none", value: "none" },
  { label: "json", value: "json" },
  { label: "form-data", value: "form-data" },
  // 可根据需要添加更多类型
];



export const renderForm = ({ form }: FormRenderProps<FlowNodeJSON>) => {
  const isSidebar = useIsSidebar();
  if (isSidebar) {
    return (
      <>
        <FormHeader />
        <FormContent>
          {/* API 方法和URL */}
          <Collapse defaultActiveKey={["1", "2", "3", "4", "5", "6"]}>
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
                      const value = mapValues(propertiesSchemaValue, (v, key) => ({
                        ...v,
                        default: propertiesValue?.[key],
                      }));
                      return <PropertiesEdit value={value} onChange={onChange} useFx={true} />;
                    }}
                  </Field>
                )}
              />
            </Collapse.Panel>
            <Collapse.Panel header="URL" itemKey="2">
              <div style={{ display: "flex", gap: 10, flexDirection: "column" }}>
                <Field name="custom.apiMethod">{({ field }) => <Select value={field.value as string} onChange={field.onChange} optionList={apiMethods} />}</Field>
                <Field name="custom.apiUrl">
                  {({ field }) => <Input value={field.value as string} onChange={field.onChange as (v: string) => void} placeholder="请输入接口URL" />}
                </Field>
              </div>
            </Collapse.Panel>
            
            <Collapse.Panel header="请求头" itemKey="3">
              <Field
                name="custom.requestHeaders.properties"
                render={({ field: { value: propertiesSchemaValue, onChange: propertiesSchemaChange } }: FieldRenderProps<Record<string, JsonSchema>>) => (
                  <Field<Record<string, IFlowValue>> name="custom.requestHeadersValues">
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
                      const value = mapValues(propertiesSchemaValue, (v, key) => ({
                        ...v,
                        default: propertiesValue?.[key],
                      }));
                      return <PropertiesEdit value={value} onChange={onChange} useFx={true} />;
                    }}
                  </Field>
                )}
              />
            </Collapse.Panel>
            <Collapse.Panel header="请求体" itemKey="4">
              <Field name="custom.bodyType">
                {({ field }) => (
                  <FormItem name="请求体类型" type="string">
                    <Select value={field.value as string} style={{ width: "100%" }} onChange={field.onChange} optionList={bodyTypes} placeholder="请选择" />
                  </FormItem>
                )}
              </Field>

              {/* 根据bodyType动态显示不同的组件 */}
              <Field name="custom.bodyType">
                {({ field: bodyTypeField }) => {
                  if (bodyTypeField.value === "json") {
                    return (
                      <Field name="custom.bodyData">
                        {({ field: bodyDataField }) => {
                          const jsonViewerRef = useRef<any>(null);

                          // 确保初始值是有效的JSON字符串
                          const initialValue = React.useMemo(() => {
                            try {
                              if (!bodyDataField.value) return "{}";
                              if (typeof bodyDataField.value === "string") {
                                return bodyDataField.value;
                              }
                              return bodyDataField.value;
                            } catch {
                              return "{}";
                            }
                          }, []);

                          const handleChange = useCallback(
                            (value: string) => {
                              bodyDataField.onChange(value);
                            },
                            [bodyDataField.onChange]
                          );

                          return (
                            <div style={{ border: "1px solid rgb(222,222,222)", borderRadius: "4px", height: "200px", paddingBottom: "25px" }}>
                              <JsonViewer
                                value={initialValue}
                                showSearch={false}
                                options={{ autoWrap: true }}
                                ref={jsonViewerRef}
                                defaultValue={initialValue}
                                onChange={handleChange}
                                editable
                                width="100%"
                                height="100%"
                              />
                            </div>
                          );
                        }}
                      </Field>
                    );
                  } else if (bodyTypeField.value === "form-data") {
                    return (
                      <Field
                        name="custom.bodyFormData.properties"
                        render={({
                          field: { value: propertiesSchemaValue, onChange: propertiesSchemaChange },
                        }: FieldRenderProps<Record<string, JsonSchema>>) => (
                          <Field<Record<string, IFlowValue>> name="custom.bodyFormDataValues">
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
                              const value = mapValues(propertiesSchemaValue, (v, key) => ({
                                ...v,
                                default: propertiesValue?.[key],
                              }));
                              return (
                                <div style={{ padding: "10px" }}>
                                  <PropertiesEdit value={value} onChange={onChange} useFx={true} />
                                </div>
                              );
                            }}
                          </Field>
                        )}
                      />
                    );
                  }
                  return <></>;
                }}
              </Field>
            </Collapse.Panel>
            <Collapse.Panel header="其他" itemKey="5">
              <Field name="custom.timeout">
                {({ field }) => (
                  <FormItem name="超时设置（s）" type="number">
                    <Input type="number" value={field.value as number | string} onChange={field.onChange as (v: string) => void} placeholder="请输入" />
                  </FormItem>
                )}
              </Field>
              <Field name="custom.retry">
                {({ field }) => (
                  <FormItem name="重试次数" type="number">
                    <Input type="number" value={field.value as number | string} onChange={field.onChange as (v: string) => void} placeholder="请输入" />
                  </FormItem>
                )}
              </Field>
              <Field name="custom.ignoreError">
                {({ field }) => (
                  <FormItem name="异常忽略" type="boolean">
                    <Switch checked={!!field.value} onChange={field.onChange as (v: boolean) => void} />
                  </FormItem>
                )}
              </Field>
            </Collapse.Panel>
            <Collapse.Panel header="输出" itemKey="6">
              <Field<JsonSchema> name="outputs">
                {({ field }) => {
                  const properties = field.value?.properties;
                  if (properties) {
                    const content = Object.keys(properties).map((key) => {
                      const property = properties[key];
                      return <TypeTag key={key} name={key} type={property.type as string} />;
                    });
                    return <div style={{ display: "flex", gap: 10 }}>{content}</div>;
                  }
                  return <></>;
                }}
              </Field>
            </Collapse.Panel>
          </Collapse>
        </FormContent>
      </>
    );
  }
  return (
    <>
      <FormHeader />
      <FormContent>
        <div style={{ display: "flex", gap: 10, fontSize: "12px", alignItems: "baseline" }}>
          <Field name="custom.apiMethod">{({ field }: any) => <Tag>{field.value}</Tag>}</Field>
          <Field name="custom.apiUrl">{({ field }: any) => <div style={{ fontSize: "14px" }}>{field.value}</div>}</Field>
        </div>
        <FormOutputs />
      </FormContent>
    </>
  );
};

export const formMeta: FormMeta<FlowNodeJSON> = {
  render: renderForm,
  validateTrigger: ValidateTrigger.onChange,
  validate: {
    title: ({ value }: { value: string }) => (value ? undefined : "Title is required"),
  },
};
