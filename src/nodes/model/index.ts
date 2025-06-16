import iconStart from "../../assets/icon-start.jpg";
import { FlowNodeJSON, FlowNodeRegistry } from "../../typings";
import { WorkflowNodeType } from "../constants";
import { formMeta } from './form-meta';

const defaultSystemPrompt = `你是一个专业的AI助手，请根据用户的需求提供帮助。`;

const defaultUserPrompt = `{{input}}`

const defaultOutput = {
  type: "object",
  properties: {
    content: { type: "string", default: "" },
    totalTokens: { type: "integer", default: 0 },
    promptTokens: { type: "integer", default: 0 },
    completionTokens: { type: "integer", default: 0 },
  },
  required: ["content", "totalTokens", "promptTokens", "completionTokens"]
};

export const llmDefaultOutput = defaultOutput

/**
 * 支持的输出类型
 * json: 返回 JSON 格式的数据
 * string: 返回字符串格式的数据
 */
export const LLMNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.LLM,
  meta: {
    size: {
      width: 360,
      height: 211,
    },
  },
  info: {
    icon: iconStart,
    description: "大模型节点，支持调用各种大模型服务。",
  },
  formMeta,
  onAdd() {
    return {
      id: `llm_${Date.now()}`,
      type: "llm",
      data: {
        title: "大模型调用",
        custom: {
          modelId: 0,
          tools: [],
          systemPrompt: defaultSystemPrompt,
          userPrompt: defaultUserPrompt,
          outputType: "string",
          timeout: 30,
          retry: 3,
          errorHandlingMode: "abort",
        },
        inputs: {
          properties: {
            input: {
              type: "string",
              title: "input"
            }
          }
        },
        inputsValues: {
          input: {
            type: "constant",
            content: ""
          }
        },
        outputs: defaultOutput,
      },
    };
  },
  onCustomChange: (node: FlowNodeJSON, custom: Record<string, any>) => {
    if (custom.outputType && node.data) {
      node.data.outputs =  defaultOutput;
    }
    return node;
  },
};
