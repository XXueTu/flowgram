import { Button, Card, Empty, Modal, Tag, Toast, Tree, Typography } from '@douyinfe/semi-ui';
import React, { useEffect, useState } from 'react';
import { CanvasService, ComponentExecutionDetail, GetCanvasRunDetailResponse } from '../../services/canvas';

const { Title, Text } = Typography;

interface RunDetailModalProps {
  visible: boolean;
  onClose: () => void;
  recordId: string | null;
}

// JSON查看器组件
const JsonViewer: React.FC<{ 
  title: string; 
  data: any; 
  visible: boolean; 
  onClose: () => void;
}> = ({ title, data, visible, onClose }) => {
  const jsonString = JSON.stringify(data, null, 2);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    Toast.success('已复制到剪贴板');
  };

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onClose}
      width={800}
      height={600}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={handleCopy} style={{ marginRight: '8px' }}>
            复制
          </Button>
          <Button type="primary" onClick={onClose}>
            关闭
          </Button>
        </div>
      }
      zIndex={1002}
    >
      <div style={{ height: '500px', overflow: 'auto' }}>
        <pre style={{ 
          background: '#f8f9fa', 
          padding: '16px', 
          borderRadius: '4px',
          fontSize: '12px',
          margin: 0,
          fontFamily: 'Monaco, Consolas, "Courier New", monospace'
        }}>
          {jsonString}
        </pre>
      </div>
    </Modal>
  );
};

export const RunDetailModal: React.FC<RunDetailModalProps> = ({
  visible,
  onClose,
  recordId
}) => {
  const [detailData, setDetailData] = useState<GetCanvasRunDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<ComponentExecutionDetail | null>(null);
  const [jsonViewerVisible, setJsonViewerVisible] = useState(false);
  const [jsonViewerData, setJsonViewerData] = useState<{ title: string; data: any }>({ title: '', data: null });

  // 处理关闭事件，阻止冒泡
  const handleClose = () => {
    onClose();
    // 重置状态
    setDetailData(null);
    setSelectedComponent(null);
    setJsonViewerVisible(false);
  };

  // 加载运行详情数据
  const loadRunDetail = async () => {
    if (!recordId) return;

    setLoading(true);
    try {
      const canvasService = CanvasService.getInstance();
      const response = await canvasService.getRunDetail(recordId);
      setDetailData(response);
      // 默认选择第一个组件
      if (response.components && response.components.length > 0) {
        setSelectedComponent(response.components[0]);
      }
    } catch (error) {
      console.error('加载运行详情失败:', error);
      Toast.error('加载运行详情失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && recordId) {
      loadRunDetail();
    }
  }, [visible, recordId]);

  const getStatusTag = (status: string) => {
    const statusConfig: Record<string, { color: 'blue' | 'green' | 'red' | 'orange', text: string }> = {
      running: { color: 'blue', text: '运行中' },
      success: { color: 'green', text: '成功' },
      completed: { color: 'green', text: '完成' },
      failed: { color: 'red', text: '失败' },
      cancelled: { color: 'orange', text: '已取消' },
      error: { color: 'red', text: '错误' },
    };
    
    const config = statusConfig[status] || { color: 'blue' as const, text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const formatDateTime = (timestamp: number) => {
    try {
      return new Date(timestamp).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return timestamp.toString();
    }
  };

  const formatDuration = (milliseconds: number) => {
    if (milliseconds < 1000) {
      return `${milliseconds}ms`;
    }
    const seconds = Math.floor(milliseconds / 1000);
    if (seconds < 60) {
      return `${seconds}秒`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}分${remainingSeconds}秒`;
  };

  const getJsonPreview = (obj: any, maxLength: number = 100) => {
    if (!obj) return '{}';
    try {
      const jsonString = JSON.stringify(obj, null, 2);
      if (jsonString.length <= maxLength) {
        return jsonString;
      }
      return jsonString.substring(0, maxLength) + '...';
    } catch {
      return String(obj);
    }
  };

  const showJsonViewer = (title: string, data: any) => {
    setJsonViewerData({ title, data });
    setJsonViewerVisible(true);
  };

  // 递归构建组件树数据，确保每个节点都有唯一的key
  const buildComponentTreeData = (components: ComponentExecutionDetail[], level: number = 0, parentKey: string = ''): any[] => {
    return components.map((component, index) => {
      const nodeKey = parentKey ? `${parentKey}-${component.id}-${component.index}` : `${component.id}-${component.index}`;
      
      const treeNode = {
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
            <Text strong style={{ minWidth: '30px', fontSize: '12px', color: '#666' }}>
              #{component.index}
            </Text>
            <Text style={{ fontWeight: level === 0 ? 'bold' : 'normal' }}>
              {component.name}
            </Text>
            {getStatusTag(component.status)}
            <Text type="secondary" style={{ fontSize: '11px' }}>
              {formatDuration(component.duration)}
            </Text>
          </div>
        ),
        value: nodeKey,
        key: nodeKey,
        children: undefined as any,
        // 存储完整的组件数据，用于选择时获取
        componentData: component
      };

      // 如果有子组件，递归构建子树
      if (component.components && component.components.length > 0) {
        treeNode.children = buildComponentTreeData(component.components, level + 1, nodeKey);
      }

      return treeNode;
    });
  };

  // 递归查找组件，修复查找逻辑
  const findComponentByKey = (treeData: any[], targetKey: string): ComponentExecutionDetail | null => {
    for (const node of treeData) {
      if (node.key === targetKey && node.componentData) {
        return node.componentData;
      }
      if (node.children && node.children.length > 0) {
        const found = findComponentByKey(node.children, targetKey);
        if (found) return found;
      }
    }
    return null;
  };

  const handleComponentSelect = (selectedKey: string, selected: boolean) => {
    if (selected && detailData?.components) {
      const treeData = buildComponentTreeData(detailData.components, 0);
      const component = findComponentByKey(treeData, selectedKey);
      if (component) {
        setSelectedComponent(component);
      }
    }
  };

  // 构建树数据的入口函数
  const getTreeData = () => {
    if (!detailData?.components) return [];
    return buildComponentTreeData(detailData.components, 0);
  };

  return (
    <>
      <Modal
        title="运行详情"
        visible={visible}
        onCancel={handleClose}
        width={1200}
        height={700}
        footer={null}
        style={{ top: '50%', transform: 'translateY(-50%)' }}
        zIndex={1001}
        maskClosable={true}
        destroyOnClose={true}
        getContainer={() => document.body}
      >
        <div style={{ 
          padding: '20px', 
          height: '600px',
          display: 'flex',
          gap: '20px'
        }}>
          {/* 左侧 - 组件列表 */}
          <div style={{ 
            width: '350px', 
            borderRight: '1px solid #e6e8eb',
            paddingRight: '20px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Title heading={5} style={{ marginBottom: '16px' }}>执行组件</Title>
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Text>加载中...</Text>
              </div>
            ) : !detailData?.components?.length ? (
              <Empty 
                title="暂无执行数据"
                description="该运行记录暂无组件执行信息"
              />
            ) : (
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <Tree
                  treeData={getTreeData()}
                  onSelect={handleComponentSelect}
                  selectedKey={selectedComponent ? 
                    getTreeData().find(node => node.componentData?.id === selectedComponent.id)?.key : 
                    undefined
                  }
                  style={{ background: 'transparent' }}
                  defaultExpandAll={true}
                  showLine={true}
                  // 去掉directory属性，使用默认的树形图标
                />
              </div>
            )}
          </div>

          {/* 右侧 - 详细信息区域 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* 选中组件的详细信息 */}
            {selectedComponent ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Card>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '12px' 
                  }}>
                    <Title heading={6} style={{ margin: 0 }}>
                      组件信息: {selectedComponent.name}
                    </Title>
                    
                    {/* 右侧属性信息 */}
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>ID:</Text>
                        <Text style={{ fontSize: '12px' }}>{selectedComponent.id}</Text>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>状态:</Text>
                        {getStatusTag(selectedComponent.status)}
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>时长:</Text>
                        <Text style={{ fontSize: '12px' }}>{formatDuration(selectedComponent.duration)}</Text>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>时间:</Text>
                        <Text style={{ fontSize: '12px' }}>{formatDateTime(selectedComponent.startTime)}</Text>
                      </div>
                    </div>
                  </div>
                  
                  {selectedComponent.error && (
                    <div style={{ marginTop: '12px', padding: '8px', background: '#fff2f0', borderRadius: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text type="danger" strong>错误信息:</Text>
                        <Button 
                          size="small" 
                          onClick={() => showJsonViewer('错误信息', selectedComponent.error)}
                        >
                          查看详情
                        </Button>
                      </div>
                      <Text type="danger" style={{ fontSize: '12px' }}>
                        {selectedComponent.error.length > 100 
                          ? selectedComponent.error.substring(0, 100) + '...' 
                          : selectedComponent.error
                        }
                      </Text>
                    </div>
                  )}
                </Card>

                <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                  {/* 输入数据 */}
                  <Card style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <Title heading={6} style={{ margin: 0 }}>输入</Title>
                      <Button 
                        size="small"
                        onClick={() => showJsonViewer('输入数据', selectedComponent.input)}
                      >
                        查看完整数据
                      </Button>
                    </div>
                    <pre style={{ 
                      background: '#f8f9fa', 
                      padding: '12px', 
                      borderRadius: '4px',
                      fontSize: '12px',
                      overflow: 'hidden',
                      height: '150px',
                      margin: 0,
                      fontFamily: 'Monaco, Consolas, "Courier New", monospace'
                    }}>
                      {getJsonPreview(selectedComponent.input, 300)}
                    </pre>
                  </Card>

                  {/* 输出数据 */}
                  <Card style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <Title heading={6} style={{ margin: 0 }}>输出</Title>
                      <Button 
                        size="small"
                        onClick={() => showJsonViewer('输出数据', selectedComponent.output)}
                      >
                        查看完整数据
                      </Button>
                    </div>
                    <pre style={{ 
                      background: '#f8f9fa', 
                      padding: '12px', 
                      borderRadius: '4px',
                      fontSize: '12px',
                      overflow: 'hidden',
                      height: '150px',
                      margin: 0,
                      fontFamily: 'Monaco, Consolas, "Courier New", monospace'
                    }}>
                      {getJsonPreview(selectedComponent.output, 300)}
                    </pre>
                  </Card>
                </div>
              </div>
            ) : (
              <div style={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Text type="secondary">请选择左侧组件查看详细信息</Text>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* JSON查看器 */}
      <JsonViewer
        title={jsonViewerData.title}
        data={jsonViewerData.data}
        visible={jsonViewerVisible}
        onClose={() => setJsonViewerVisible(false)}
      />
    </>
  );
}; 