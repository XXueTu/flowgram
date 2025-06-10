import { EditorRenderer, FreeLayoutEditorProvider, FreeLayoutPluginContext } from "@flowgram.ai/free-layout-editor";
import { useEffect, useRef, useState } from "react";

import "@flowgram.ai/free-layout-editor/index.css";
import { useParams } from "react-router-dom";
import { SidebarProvider, SidebarRenderer } from "./components/sidebar";
import { DemoTools } from "./components/tools";
import { useEditorProps } from "./hooks";
import { nodeRegistries } from "./nodes";
import { CanvasService } from "./services/canvas";
import "./styles/index.css";

const EditorContent = ({ data }: { data: any }) => {
  const ref = useRef<FreeLayoutPluginContext | null>(null);
  const editorProps = useEditorProps(data, nodeRegistries);

  return (
    <div className="doc-free-feature-overview">
      <FreeLayoutEditorProvider ref={ref} {...editorProps}>
        <SidebarProvider>
          <div className="demo-container">
            <EditorRenderer className="demo-editor" />
          </div>
          <DemoTools />
          <SidebarRenderer />
        </SidebarProvider>
      </FreeLayoutEditorProvider>
    </div>
  );
};

const Editor = () => {
  const [data, setData] = useState<any>(null);
  const { canvasId, workflowId } = useParams();
  console.log(canvasId, workflowId, "canvasId, workflowId");
  
  // 默认画布内容
  const getDefaultCanvasData = () => ({
    nodes: [
      {
        id: "start_0",
        type: "start",
        meta: {
          position: {
            x: 180,
            y: 0
          }
        },
        data: {
          outputs: {
            properties: {},
            required: [],
            type: "object"
          },
          title: "开始"
        }
      },
      {
        id: "end_0",
        type: "end",
        meta: {
          position: {
            x: 640,
            y: 0
          }
        },
        data: {
          inputsValues: {},
          outputs: {
            properties: {},
            type: "object"
          },
          title: "结束"
        }
      }
    ],
    edges: [
      {
        sourceNodeID: "start_0",
        targetNodeID: "end_0"
      }
    ]
  });
  
  useEffect(() => {
    const loadData = async () => {
      const canvasService = CanvasService.getInstance();
      
      // 使用URL参数中的canvasId，如果为空则使用"default"作为备用
      const actualCanvasId = canvasId || "default";
      console.log("正在获取画布详情，canvasId:", actualCanvasId);
      
      try {
        const response = await canvasService.getDetail({
          id: actualCanvasId,
        });

        if (response?.graph) {
          setData(response.graph);
        } else {
          // 如果响应中没有graph数据，使用默认画布内容
          console.log("响应中无画布数据，使用默认内容");
          setData(getDefaultCanvasData());
        }
      } catch (error) {
        console.error("获取画布详情失败，使用默认画布内容:", error);
        // 如果获取失败，设置默认的画布内容
        setData(getDefaultCanvasData());
      }
    };

    loadData();
  }, [canvasId]); // 依赖于canvasId，当canvasId变化时重新加载

  if (!data) {
    return <div>加载中...</div>;
  }

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <EditorContent data={data} />
    </div>
  );
};

export default Editor;
