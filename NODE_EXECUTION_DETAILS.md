# 节点执行详情组件 (NodeExecutionDetails)

这个组件已经成功接入了真实的接口，使用 Zustand 进行状态管理，能够实时展示节点的执行状态和结果。

## 功能特性

- ✅ **接口集成**: 集成了 `canvas.ts` 中的 `getTraceComponents` 接口
- ✅ **状态管理**: 使用 Zustand 管理节点执行状态
- ✅ **实时数据**: 自动获取并显示真实的执行数据
- ✅ **多状态支持**: 支持运行中、成功、失败、等待中、未开始等状态
- ✅ **数据展示**: 显示输入、输出和错误信息
- ✅ **交互功能**: 支持展开/收起详情，复制数据

## 使用方法

### 基本用法

```tsx
import { NodeExecutionDetails } from "./components/base-node/node-execution-details";

// 在你的组件中使用
<NodeExecutionDetails
  nodeId="your-node-id"
  canvasId="default" // 可选，默认为 "default"
  serialId="trace-485d787428f428a484fd5e2d9de880f9" // 可选，使用指定的 mock 值
/>;
```

### 组件属性

| 属性       | 类型     | 必需 | 默认值                                     | 说明    |
| ---------- | -------- | ---- | ------------------------------------------ | ------- |
| `nodeId`   | `string` | ✅   | -                                          | 节点 ID |
| `canvasId` | `string` | ❌   | `"default"`                                | 画布 ID |
| `serialId` | `string` | ❌   | `"trace-485d787428f428a484fd5e2d9de880f9"` | 序列 ID |

### 状态管理

组件使用 Zustand store (`useNodeExecutionStore`) 来管理状态：

```tsx
import { useNodeExecutionStore } from "./stores/node-execution-store";

const {
  nodeRecords, // 所有节点记录
  loading, // 加载状态
  fetchNodeExecutionDetails, // 获取执行详情
  clearNodeRecord, // 清除单个节点记录
  clearAllRecords, // 清除所有记录
} = useNodeExecutionStore();
```

### 状态类型

```tsx
type NodeStatus = "idle" | "waiting" | "running" | "success" | "error";
```

- `idle`: 未开始
- `waiting`: 等待中
- `running`: 运行中
- `success`: 运行成功
- `error`: 运行失败

## 接口数据映射

接口返回的数据会自动映射到组件需要的格式：

```tsx
// API 返回格式
{
  records: [
    {
      nodeId: string,
      status: string, // -> 映射到 NodeStatus
      startTime: string, // -> 转换为时间戳
      endTime: string, // -> 转换为时间戳
      duration: number,
      error: string,
      input: object, // -> 映射到 inputs
      output: object, // -> 映射到 outputs
      nodeType: string,
      nodeName: string,
      step: number,
    },
  ];
}
```

## 运行演示

项目中包含了完整的演示：

1. 启动开发服务器：

   ```bash
   npm run dev
   ```

2. 在浏览器中切换到"节点执行详情演示"标签页

3. 点击"显示演示"按钮查看效果

## 样式定制

组件使用 styled-components，所有样式都可以通过 props 进行定制。主要的样式组件包括：

- `ExecutionDetailsWrapper`: 主容器
- `StatusHeader`: 状态头部
- `StatusIndicator`: 状态指示器
- `DataSection`: 数据展示区域
- `DataContent`: 数据内容区域

## Mock 数据

目前使用的 Mock 参数：

- `canvasId`: "default"
- `serialId`: "trace-485d787428f428a484fd5e2d9de880f9"

这些参数可以通过组件 props 进行覆盖。

## 注意事项

1. 组件会在挂载时自动调用接口获取数据
2. 如果接口返回错误，组件会显示错误状态
3. 支持复制输入和输出数据到剪贴板
4. 数据展示区域支持展开/收起
5. 组件具有加载状态指示
