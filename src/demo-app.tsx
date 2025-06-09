import React, { useState } from "react";
import { Editor } from "./editor";
import { NodeExecutionDemo } from "./node-execution-demo";

export const DemoApp = () => {
  const [currentView, setCurrentView] = useState<"editor" | "node-execution">("editor");

  return (
    <div>
      <div
        style={{
          padding: "10px 20px",
          borderBottom: "1px solid #d9d9d9",
          backgroundColor: "#fafafa",
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          onClick={() => setCurrentView("editor")}
          style={{
            padding: "8px 16px",
            backgroundColor: currentView === "editor" ? "#1890ff" : "#f0f0f0",
            color: currentView === "editor" ? "white" : "#333",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          编辑器
        </button>
        <button
          onClick={() => setCurrentView("node-execution")}
          style={{
            padding: "8px 16px",
            backgroundColor: currentView === "node-execution" ? "#1890ff" : "#f0f0f0",
            color: currentView === "node-execution" ? "white" : "#333",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          节点执行详情演示
        </button>
      </div>

      {currentView === "editor" && <Editor />}
      {currentView === "node-execution" && <NodeExecutionDemo />}
    </div>
  );
};
