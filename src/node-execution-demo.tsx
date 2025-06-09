import React, { useState } from "react";
import { NodeExecutionDetailsExample } from "./components/base-node/node-execution-details-example";
import { useNodeExecutionStore } from "./stores/node-execution-store";

export const NodeExecutionDemo = () => {
  const { clearAllRecords } = useNodeExecutionStore();
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div style={{ padding: "20px" }}>
      <h1>节点执行详情演示</h1>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setShowDemo(!showDemo)}
          style={{
            padding: "8px 16px",
            marginRight: "10px",
            backgroundColor: "#1890ff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {showDemo ? "隐藏演示" : "显示演示"}
        </button>

        <button
          onClick={clearAllRecords}
          style={{
            padding: "8px 16px",
            backgroundColor: "#ff4d4f",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          清除所有记录
        </button>
      </div>

      <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#f0f0f0", borderRadius: "6px" }}>
        <h3>功能说明</h3>
        <ul>
          <li>
            <strong>接口集成</strong>：组件已集成 <code>canvas.ts</code> 中的 <code>getTraceComponents</code> 接口
          </li>
          <li>
            <strong>状态管理</strong>：使用 Zustand 管理节点执行状态
          </li>
          <li>
            <strong>Mock 参数</strong>：使用 canvasId="default" 和 serialId="trace-485d787428f428a484fd5e2d9de880f9"
          </li>
          <li>
            <strong>实时数据</strong>：组件会自动获取并显示真实的执行数据
          </li>
          <li>
            <strong>状态映射</strong>：支持多种状态：运行中、成功、失败、等待中、未开始
          </li>
          <li>
            <strong>数据展示</strong>：支持展示输入、输出和错误信息
          </li>
          <li>
            <strong>交互功能</strong>：支持展开/收起详情，复制数据
          </li>
        </ul>
      </div>

      {showDemo && <NodeExecutionDetailsExample />}
    </div>
  );
};
