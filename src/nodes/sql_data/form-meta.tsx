import { Collapse, Input, Modal, Select, Tag } from "@douyinfe/semi-ui";
import Editor, { Monaco } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";

import { IFlowValue, JsonSchemaEditor } from "@flowgram.ai/form-materials";
import { Field, FieldRenderProps, FormMeta, FormRenderProps, ValidateTrigger } from "@flowgram.ai/free-layout-editor";
import { mapValues } from "lodash-es";

import { FormContent, FormHeader, FormInputs, FormOutputs, PropertiesEdit } from "../../form-components";
import { useIsSidebar } from "../../hooks";
import { DropdownKind, dropdownService, GetDropDownListResponseItem } from "../../services";
import { FlowNodeJSON, JsonSchema } from "../../typings";

const errorHandlingModes = [
  { label: "中断", value: "abort" },
  { label: "重试", value: "retry" },
];

// SQL 格式化规则
const formatSQL = (sql: string): string => {
  if (!sql) return '';
  
  try {
    // 在关键字前添加换行和缩进
    const keywords = ['select', 'from', 'where', 'group by', 'order by', 'having', 'join', 'left join', 'right join', 'inner join', 'union', 'limit'];
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      sql = sql.replace(regex, `\n  $&`);
    });

    // 处理逗号
    sql = sql.replace(/,\s*/g, ',\n    ');

    // 处理 AND/OR
    sql = sql.replace(/\b(and|or)\b/gi, '\n    $&');

    // 移除多余的空行
    sql = sql.replace(/\n\s*\n/g, '\n');

    // 移除首尾空白
    sql = sql.trim();

    return sql;
  } catch (error) {
    console.error('SQL 格式化失败:', error);
    return sql; // 如果格式化失败，返回原始 SQL
  }
};

export const renderForm = ({ form }: FormRenderProps<FlowNodeJSON>) => {
  const isSidebar = useIsSidebar();
  const editorRef = useRef<any>(null);
  const [visible, setVisible] = useState(false);
  const [currentSQL, setCurrentSQL] = useState("");
  const [dataSourceOptions, setDataSourceOptions] = useState<GetDropDownListResponseItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取MySQL数据源列表
  const fetchDataSources = async () => {
    setLoading(true);
    try {
      const dataSources = await dropdownService.getDataSourcesByKind(DropdownKind.MYSQL);
      setDataSourceOptions(dataSources);
    } catch (error) {
      console.error('获取数据源列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataSources();
  }, []);

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    monaco.editor.setModelLanguage(editor.getModel(), "sql");

    // 添加右键菜单
    editor.addAction({
      id: 'format-sql',
      label: '格式化 SQL',
      keybindings: [monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF],
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.5,
      run: () => {
        try {
          const model = editor.getModel();
          const text = model.getValue();
          const formatted = formatSQL(text);
          model.setValue(formatted);
        } catch (error) {
          console.error('格式化失败:', error);
        }
        return null;
      }
    });
  };

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

            <Collapse.Panel header="SQL 配置" itemKey="2">
              <div style={{ padding: "8px 0" }}>
                <Field name="custom.datasourceId">
                  {({ field }) => (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ marginBottom: 8 }}>数据源</div>
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
                        placeholder="请选择数据源"
                        style={{ width: "100%" }}
                        loading={loading}
                        optionList={dataSourceOptions.map(item => ({
                          label: item.label,
                          value: item.value
                        }))}
                        filter
                        showClear
                      />
                    </div>
                  )}
                </Field>
                <Field name="custom.sql">
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
                          setCurrentSQL(field.value as string);
                          setVisible(true);
                        }}
                      >
                        <Editor
                          height="100%"
                          defaultLanguage="sql"
                          language="sql"
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
                            tabSize: 2,
                            insertSpaces: true,
                            wordWrap: "on",
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
                        title="SQL 编辑器"
                        visible={visible}
                        onCancel={() => setVisible(false)}
                        footer={null}
                        width="80%"
                        height="80%"
                        style={{ maxWidth: "1200px" }}
                      >
                        <div style={{ height: "calc(80vh - 120px)" }}>
                          <Editor
                            height="calc(100% - 40px)"
                            defaultLanguage="sql"
                            language="sql"
                            value={currentSQL}
                            onChange={(value) => {
                              setCurrentSQL(value || "");
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
          <Field name="custom.datasourceId">
            {({ field }: any) => {
              const datasourceId = field.value;
              if (!datasourceId || datasourceId === 0 || datasourceId === null || datasourceId === undefined || isNaN(Number(datasourceId))) {
                return <Tag>数据源: 未选择</Tag>;
              }
              const selectedDataSource = dataSourceOptions.find(item => item.value === datasourceId);
              const displayText = selectedDataSource ? selectedDataSource.label : `ID: ${datasourceId}`;
              return <Tag>数据源: {displayText}</Tag>;
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
