import iconStart from "../../assets/icon-start.jpg";
import { FlowNodeRegistry } from "../../typings";
import { WorkflowNodeType } from "../constants";
import { formMeta } from './form-meta';
const defaultCode = `function main(params) {
  return {
      key0: params.input + params.input,
      key1: ["hello", "world"],
      key2: {
          key21: "hi"
      },
  };
}`;
export const CodeNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.Code,
  meta: {
    size: {
      width: 360,
      height: 211,
    },
  },
  info: {
    icon: iconStart,
    description: "代码执行节点，支持 JavaScript 和 Golang 代码执行。",
  },
  formMeta,
  onAdd() {
    return {
      id: `code_${Date.now()}`,
      type: "code",
      data: {
        title: "代码执行",
        custom: {
          language: "javascript",
          code: defaultCode,
          timeout: 30,
          retry: 3,
          errorHandlingMode: "abort",
        },
        inputs: {
          properties: {
            input1: {
              type: "string",
              title: "输入1"
            }
          }
        },
        inputsValues: {
          input1: {
            type: "constant",
            content: ""
          }
        },
        outputs: {
          type: "object",
          properties: {
            result: { type: "string", default: "" },
            error: { type: "string", default: "" }
          },
          required: ["result", "error"],
        },
      },
    };
  },
};
