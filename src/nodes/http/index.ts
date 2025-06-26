import iconApi from "../../assets/icon-api.svg";
import { FlowNodeRegistry } from "../../typings";
import { WorkflowNodeType } from "../constants";
import { formMeta } from "./form-meta";

export const HttpNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.Http,
  meta: {
    size: {
      width: 360,
      height: 211,
    },
  },
  info: {
    icon: iconApi,
    description: "HTTP 请求节点，支持发送各种类型的 HTTP 请求。",
  },
  formMeta,
  onAdd() {
    return {
      id: `http_${Date.now()}`,
      type: "http",
      data: {
        title: "HTTP 请求",
        custom: {
          apiUrl: "https://api.example.com",
          apiMethod: "GET",
          bodyType: "none",
          timeout: 10,
          retry: 2,
          ignoreError: false,
          requestHeaders: {
            properties: {
              "Content-Type": {
                type: "string"
              }
            }
          },
          requestHeadersValues: {
            "Content-Type": {
              type: "constant",
              content: "application/json"
            }
          }
        },
        // 可根据需要添加默认 inputs/outputs
        outputs: {
          type: "object",
          properties: {
            body: { type: "string" ,default:"{}"},
            statusCode: { type: "number" ,default:0},
            headers: { type: "string" ,default:"{}"},
          },
          required: ["body", "statusCode", "headers"],
        },
      },
    };
  },
};
