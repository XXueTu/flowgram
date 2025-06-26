import { Collapse, Input, Modal, Select } from "@douyinfe/semi-ui";
import Editor, { Monaco } from "@monaco-editor/react";
import { useRef, useState } from "react";

import { IFlowValue, JsonSchemaEditor } from "@flowgram.ai/form-materials";
import { Field, FieldRenderProps, FormMeta, FormRenderProps, ValidateTrigger } from "@flowgram.ai/free-layout-editor";
import { mapValues } from "lodash-es";

import { FormContent, FormHeader, FormInputs, FormOutputs, PropertiesEdit } from "../../form-components";
import { useIsSidebar } from "../../hooks";
import { FlowNodeJSON, JsonSchema } from "../../typings";
import { CodeTip, CodeTips } from "./components/CodeTips";

const languages = [
  { label: "JavaScript", value: "javascript" },
  { label: "Golang", value: "golang" },
  { label: "Python", value: "python" },
];

const errorHandlingModes = [
  { label: "中断", value: "abort" },
  { label: "重试", value: "retry" },
];

const codeTips: CodeTip[] = [
  {
    title: "获取输入",
    code: "const input = params.input;",
    description: "获取节点输入中参数名为 input 的值",
  },
  {
    title: "输出结果",
    code: `const ret = { "name": '小明', "hobbies": ["看书", "旅游"] };`,
    description: "输出一个包含多种数据类型的对象",
  },
  {
    title: "解析 JSON 对象",
    code: `const ret = { "name": '小明', "hobbies": ["看书", "旅游"] };`,
    description: "输出一个包含多种数据类型的对象",
  },
  {
    title: "加解密处理",
    code: `const ret = { "name": '小明', "hobbies": ["看书", "旅游"] };`,
    description: "输出一个包含多种数据类型的对象",
  },
];

export const renderForm = ({ form }: FormRenderProps<FlowNodeJSON>) => {
  const isSidebar = useIsSidebar();
  const editorRef = useRef<any>(null);
  const [visible, setVisible] = useState(false);
  const [currentCode, setCurrentCode] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState("javascript");

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    monaco.editor.setModelLanguage(editor.getModel(), currentLanguage);
  };
  console.log(currentCode, "currentCode");
  if (isSidebar) {
    return (
      <>
        <FormHeader />
        <FormContent>
          <Collapse defaultActiveKey={["1", "2", "3", "4"]}>
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

            <Collapse.Panel header="代码编辑器" itemKey="2">
              <div style={{ padding: "8px 0" }}>
                <Field name="custom.language">
                  {({ field }) => (
                    <Select
                      value={field.value as string}
                      style={{ width: "100%", marginBottom: 8 }}
                      onChange={(value) => {
                        field.onChange(value);
                        if (typeof value === "string") {
                          setCurrentLanguage(value.toLowerCase());
                        }
                      }}
                      optionList={languages}
                      placeholder="请选择编程语言"
                    />
                  )}
                </Field>
                <CodeTips tips={codeTips} />
                <Field name="custom.code">
                  {({ field }) => (
                    <>
                      <div
                        style={{
                          height: "300px",
                          border: "1px solid var(--semi-color-border)",
                          cursor: "pointer",
                          position: "relative",
                        }}
                        onClick={() => {
                          setCurrentCode(field.value as string);
                          setVisible(true);
                        }}
                      >
                        <Editor
                          height="100%"
                          defaultLanguage="javascript"
                          language={currentLanguage}
                          value={field.value as string}
                          onChange={(value) => field.onChange(value)}
                          options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            lineNumbers: "on",
                            roundedSelection: false,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            formatOnPaste: true,
                            formatOnType: true,
                            readOnly: true,
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            background: "var(--semi-color-bg-2)",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            color: "var(--semi-color-text-2)",
                          }}
                        >
                        </div>
                      </div>
                      <Modal
                        title="代码编辑器"
                        visible={visible}
                        onCancel={() => setVisible(false)}
                        footer={null}
                        width="80%"
                        height="80%"
                        style={{ maxWidth: "1200px" }}
                      >
                        <div style={{ height: "calc(80vh - 120px)" }}>
                          <Editor
                            // loading={false}
                            height="100%"
                            defaultLanguage="javascript"
                            language={currentLanguage}
                            value={currentCode}
                            onChange={(value) => {
                              setCurrentCode(value || "");
                              field.onChange(value || "");
                            }}
                            onMount={handleEditorDidMount}
                            options={{
                              minimap: { enabled: false },
                              fontSize: 14,
                              lineNumbers: "on",
                              roundedSelection: false,
                              scrollBeyondLastLine: false,
                              automaticLayout: true,
                              formatOnPaste: true,
                              formatOnType: true,
                              tabSize: 2,
                              insertSpaces: true,
                              wordWrap: "on",
                            }}
                          />
                        </div>
                      </Modal>
                    </>
                  )}
                </Field>
              </div>
            </Collapse.Panel>

            <Collapse.Panel header="输出" itemKey="3">
              <Field
                name="outputs"
                render={({ field: { value, onChange } }: FieldRenderProps<JsonSchema>) => (
                  <JsonSchemaEditor value={value} onChange={(value) => onChange(value as JsonSchema)} />
                )}
              />
            </Collapse.Panel>

            <Collapse.Panel header="异常处理" itemKey="4">
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
          {/* <Field name="custom.language">{({ field }: any) => <Tag>{field.value}</Tag>}</Field> */}
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
