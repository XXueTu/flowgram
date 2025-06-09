import React from "react";
import { NodeExecutionDetails } from "./node-execution-details";

// 使用示例组件
export const NodeExecutionDetailsExample = () => {
  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <h2>节点执行详情示例</h2>

      <div style={{ marginBottom: "20px" }}>
        <h3>示例节点 1</h3>
        <div style={{ position: "relative", display: "inline-block" }}>
          <div
            style={{
              width: "200px",
              height: "100px",
              backgroundColor: "#1890ff",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
            }}
          >
            节点 1
          </div>
          <NodeExecutionDetails nodeId="node-1" canvasId="default" serialId="trace-485d787428f428a484fd5e2d9de880f9" />
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>示例节点 2</h3>
        <div style={{ position: "relative", display: "inline-block" }}>
          <div
            style={{
              width: "200px",
              height: "100px",
              backgroundColor: "#52c41a",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
            }}
          >
            节点 2
          </div>
          <NodeExecutionDetails nodeId="node-2" canvasId="default" serialId="trace-485d787428f428a484fd5e2d9de880f9" />
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>示例节点 3</h3>
        <div style={{ position: "relative", display: "inline-block" }}>
          <div
            style={{
              width: "200px",
              height: "100px",
              backgroundColor: "#ff4d4f",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
            }}
          >
            节点 3
          </div>
          <NodeExecutionDetails nodeId="node-3" canvasId="default" serialId="trace-485d787428f428a484fd5e2d9de880f9" />
        </div>
      </div>
    </div>
  );
};
