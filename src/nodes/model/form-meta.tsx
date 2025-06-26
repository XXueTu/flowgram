import { Collapse, Input, Select, Tag, TextArea } from "@douyinfe/semi-ui";
import React, { useEffect, useState } from "react";

import { IFlowValue, JsonSchemaEditor } from "@flowgram.ai/form-materials";
import { Field, FieldRenderProps, FormMeta, FormRenderProps, ValidateTrigger } from "@flowgram.ai/free-layout-editor";
import { mapValues } from "lodash-es";

import { llmDefaultOutput } from ".";
import { FormContent, FormHeader, FormInputs, FormOutputs, PropertiesEdit } from "../../form-components";
import { useIsSidebar } from "../../hooks";
import { DropdownKind, dropdownService, GetDropDownListResponseItem } from "../../services";
import { FlowNodeJSON, JsonSchema } from "../../typings";

const errorHandlingModes = [
  { label: "中断", value: "abort" },
  { label: "重试", value: "retry" },
];

const outputTypes = [
  { label: "字符串", value: "string" },
  { label: "JSON", value: "json" },
];

export const renderForm = ({ form }: FormRenderProps<FlowNodeJSON>) => {
  const isSidebar = useIsSidebar();
  const [modelOptions, setModelOptions] = useState<GetDropDownListResponseItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取模型数据源列表
  const fetchModelDataSources = async () => {
    setLoading(true);
    try {
      const models = await dropdownService.getDataSourcesByKind(DropdownKind.MODEL);
      setModelOptions(models);
    } catch (error) {
      console.error('获取模型列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModelDataSources();
  }, []);

  if (isSidebar) {
    return (
      <>
        <FormHeader />
        <FormContent>
          <Collapse defaultActiveKey={["1", "2", "3", "4", "5", "6"]}>
            <Collapse.Panel header="输入" itemKey="1">
              <Field
                name="inputs.properties"
                render={({ field: { value: propertiesSchemaValue, onChange: propertiesSchemaChange } }: FieldRenderProps<Record<string, JsonSchema>>) => (
                  <Field<Record<string, IFlowValue>> name="inputsValues">
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

            <Collapse.Panel header="模型配置" itemKey="2">
              <div style={{ padding: "8px 0" }}>
                <Field name="custom.modelId">
                  {({ field }) => (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ marginBottom: 8 }}>模型</div>
                      <Select
                        value={field.value as number}
                        onChange={(value) => {
                          // 如果清除选择，设置为 null 或 undefined
                          if (value === null || value === undefined) {
                            field.onChange(null);
                          } else {
                            field.onChange(Number(value));
                          }
                        }}
                        placeholder="请选择模型"
                        style={{ width: "100%" }}
                        loading={loading}
                        optionList={modelOptions.map(item => ({
                          label: item.label,
                          value: item.value
                        }))}
                        filter
                        showClear
                      />
                    </div>
                  )}
                </Field>
                <Field name="custom.tools">
                  {({ field }) => (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ marginBottom: 8 }}>工具列表</div>
                      <Select
                        value={field.value as string[]}
                        onChange={field.onChange}
                        placeholder="请选择工具"
                        multiple
                        style={{ width: "100%" }}
                        optionList={[]} // 这里需要根据实际情况添加工具列表
                      />
                    </div>
                  )}
                </Field>
              </div>
            </Collapse.Panel>

            <Collapse.Panel header="系统提示词" itemKey="3">
              <Field name="custom.systemPrompt">
                {({ field }) => (
                  <TextArea
                    value={field.value as string}
                    onChange={field.onChange}
                    placeholder="请输入系统提示词"
                    style={{ width: "100%", height: "200px" }}
                  />
                )}
              </Field>
            </Collapse.Panel>

            <Collapse.Panel header="用户提示词" itemKey="4">
              <Field name="custom.userPrompt">
                {({ field }) => (
                  <TextArea
                    value={field.value as string}
                    onChange={field.onChange}
                    placeholder="请输入用户提示词"
                    style={{ width: "100%", height: "200px" }}
                  />
                )}
              </Field>
            </Collapse.Panel>

            <Collapse.Panel header="输出配置" itemKey="5">
              <Field name="custom.outputType">
                {({ field }) => (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ marginBottom: 8 }}>输出类型</div>
                    <Select
                      value={field.value as string}
                      onChange={(value) => {
                        field.onChange(value);
                        // 切换输出类型时，重置 outputs 的值
                        const newOutput =  llmDefaultOutput ;
                        form.setValueIn("outputs", newOutput);
                        form.setValueIn("custom.output", newOutput);
                      }}
                      placeholder="请选择输出类型"
                      style={{ width: "100%" }}
                      optionList={outputTypes}
                    />
                  </div>
                )}
              </Field>
            </Collapse.Panel>

            <Collapse.Panel header="输出" itemKey="6">
              <Field name="custom.outputType">
                {({ field: { value: outputType } }) => (
                  <>
                    <Field
                      name="outputs"
                      render={({ field: { value, onChange } }: FieldRenderProps<JsonSchema>) => {
                        // 如果是 string 类型，强制使用 defaultStringOutput
                        const currentValue = outputType === "string" ? llmDefaultOutput : value;
                        return (
                          <JsonSchemaEditor 
                            value={currentValue} 
                            onChange={(value) => {
                              // 如果是 string 类型，不允许修改
                              if (outputType === "string") {
                                return;
                              }
                              onChange(value as JsonSchema);
                            }}
                          />
                        );
                      }}
                    />
                    <Field name="custom.output">
                      {({ field: { onChange: outputChange } }) => (
                        <Field
                          name="outputs"
                          render={({ field: { value } }: FieldRenderProps<JsonSchema>) => {
                            // 当 outputs 变化时，同步到 custom.output
                            React.useEffect(() => {
                              // 如果是 string 类型，使用 defaultStringOutput
                              const outputValue = outputType === "string" ? llmDefaultOutput : value;
                              outputChange(outputValue);
                            }, [value, outputChange, outputType]);
                            return <></>;
                          }}
                        />
                      )}
                    </Field>
                  </>
                )}
              </Field>
            </Collapse.Panel>

            <Collapse.Panel header="异常处理" itemKey="7">
              <Field name="custom.timeout">
                {({ field }) => (
                  <div style={{ marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ width: 100 }}>超时时间（秒）</span>
                    <Input
                      type="number"
                      value={field.value as number | string}
                      onChange={field.onChange as (v: string) => void}
                      placeholder="请输入"
                      min={1}
                      style={{ width: 120 }}
                    />
                  </div>
                )}
              </Field>
              <Field name="custom.retry">
                {({ field }) => (
                  <div style={{ marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ width: 100 }}>重试次数</span>
                    <Input
                      type="number"
                      value={field.value as number | string}
                      onChange={field.onChange as (v: string) => void}
                      placeholder="请输入"
                      min={0}
                      style={{ width: 120 }}
                    />
                  </div>
                )}
              </Field>
              <Field name="custom.errorHandlingMode">
                {({ field }) => (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ width: 100 }}>异常处理方式</span>
                    <Select
                      value={field.value as string}
                      style={{ width: 120 }}
                      onChange={field.onChange}
                      optionList={errorHandlingModes}
                      placeholder="请选择"
                    />
                  </div>
                )}
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
          <Field name="custom.modelId">
            {({ field }: any) => {
              const modelId = field.value;
              if (!modelId || modelId === 0 || modelId === null || modelId === undefined || isNaN(Number(modelId))) {
                return <Tag>模型: 未选择</Tag>;
              }
              const selectedModel = modelOptions.find(item => item.value === modelId);
              const displayText = selectedModel ? selectedModel.label : `ID: ${modelId}`;
              return <Tag>模型: {displayText}</Tag>;
            }}
          </Field>
        </div>
        <FormInputs />
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
