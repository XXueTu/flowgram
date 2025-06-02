import { EditorRenderer, FreeLayoutEditorProvider, FreeLayoutPluginContext } from '@flowgram.ai/free-layout-editor';
import { useEffect, useRef, useState } from 'react';

import '@flowgram.ai/free-layout-editor/index.css';
import { SidebarProvider, SidebarRenderer } from './components/sidebar';
import { DemoTools } from './components/tools';
import { useEditorProps } from './hooks';
import { nodeRegistries } from './nodes';
import { CanvasService } from './services/canvas';
import './styles/index.css';

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

export const Editor = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const canvasService = CanvasService.getInstance();
      const response = await canvasService.getDetail({
        id: 'default'
      });
      
      if (response?.graph) {
        setData(response.graph);
      }
    };

    loadData();
  }, []);

  if (!data) {
    return null;
  }

  return <EditorContent data={data} />;
};
