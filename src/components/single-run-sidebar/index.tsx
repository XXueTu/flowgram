import { IconClose, IconPlay } from '@douyinfe/semi-icons';
import { Button, Card, Divider, Spin, TextArea, Toast, Typography } from '@douyinfe/semi-ui';
import React, { useContext, useState } from 'react';
import { SingleRunContext } from '../../context/single-run-context';
import { CanvasRunSingleRequest, CanvasRunSingleResponse, CanvasService } from '../../services/canvas';

const { Title, Text } = Typography;

export const SingleRunSidebar: React.FC = () => {
  const { singleRunState, closeSingleRun } = useContext(SingleRunContext);
  const [paramsText, setParamsText] = useState('{\n  \n}');
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<CanvasRunSingleResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    if (!singleRunState.nodeId || !singleRunState.canvasId) {
      Toast.error('缺少必要的运行参数');
      return;
    }

    try {
      // 验证JSON格式
      let params: Record<string, any>;
      try {
        params = JSON.parse(paramsText);
      } catch (parseError) {
        Toast.error('请输入有效的JSON格式参数');
        return;
      }

      console.log('开始运行单组件', { 
        nodeId: singleRunState.nodeId, 
        canvasId: singleRunState.canvasId, 
        params 
      });

      setIsRunning(true);
      setError(null);
      setResult(null);

      const request: CanvasRunSingleRequest = {
        id: singleRunState.canvasId,
        nodeId: singleRunState.nodeId,
        params: params
      };

      const response = await CanvasService.getInstance().runSingle(request);
      console.log('运行结果', response);
      setResult(response);
      Toast.success('组件运行完成');
    } catch (err: any) {
      console.error('运行失败', err);
      const errorMessage = err?.message || '运行失败';
      setError(errorMessage);
      Toast.error(errorMessage);
    } finally {
      setIsRunning(false);
    }
  };

  const formatJson = (obj: any) => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(obj);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'completed':
        return '#52c41a';
      case 'error':
      case 'failed':
        return '#ff4d4f';
      case 'running':
        return '#1890ff';
      default:
        return '#faad14';
    }
  };

  if (!singleRunState.visible) {
    return null;
  }

  return (
    <div style={{ 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#fafafa'
    }}>
      {/* 头部 */}
      <div style={{ 
        padding: '20px 20px 0 20px',
        flexShrink: 0
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconPlay style={{ color: '#1890ff', fontSize: '18px' }} />
            <Title heading={5} style={{ margin: 0 }}>
              单组件运行
            </Title>
          </div>
          <Button
            type="tertiary"
            theme="borderless"
            icon={<IconClose />}
            onClick={closeSingleRun}
            size="small"
          />
        </div>

        <Text type="secondary" size="small">
          组件: {singleRunState.nodeTitle || singleRunState.nodeId}
        </Text>
      </div>

      {/* 可滚动内容区域 */}
      <div style={{ 
        flex: 1,
        padding: '16px 20px 20px 20px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        minHeight: 0
      }}>
        {/* 输入参数区域 */}
        <Card title="输入参数" style={{ flexShrink: 0 }}>
          <div style={{ marginBottom: '12px' }}>
            <Text type="secondary" size="small">
              请输入JSON格式的运行参数
            </Text>
          </div>
          <TextArea
            value={paramsText}
            onChange={setParamsText}
            placeholder='例如: {\n  "input": "test",\n  "param1": "value1"\n}'
            rows={6}
            style={{ 
              fontFamily: 'Monaco, Consolas, "Courier New", monospace',
              fontSize: '12px'
            }}
          />
          <div style={{ marginTop: '12px' }}>
            <Button
              type="primary"
              icon={<IconPlay />}
              onClick={handleRun}
              loading={isRunning}
              disabled={isRunning}
              style={{ marginRight: '8px' }}
            >
              {isRunning ? '运行中...' : '运行'}
            </Button>
          </div>
        </Card>

        <Divider style={{ margin: 0, flexShrink: 0 }} />

        {/* 输出结果区域 */}
        <div style={{ 
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Card 
            title="运行结果" 
            style={{ 
              height: '100%',
              display: 'flex', 
              flexDirection: 'column'
            }}
            bodyStyle={{
              flex: 1,
              padding: '16px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ 
              flex: 1, 
              overflow: 'auto',
              minHeight: 0
            }}>
              {isRunning && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '200px',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <Spin size="large" />
                  <Text>组件运行中，请稍候...</Text>
                </div>
              )}

              {error && (
                <div style={{ 
                  background: '#fff2f0', 
                  border: '1px solid #ffccc7',
                  borderRadius: '6px',
                  padding: '16px',
                  minHeight: '100px'
                }}>
                  <Text type="danger" strong>运行失败</Text>
                  <pre style={{ 
                    marginTop: '8px',
                    fontSize: '12px',
                    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    margin: 0
                  }}>
                    {error}
                  </pre>
                </div>
              )}

              {result && !isRunning && (
                <div style={{ 
                  paddingBottom: '16px'
                }}>
                  {/* 结果概要 */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Text strong>运行状态：</Text>
                      <span style={{ 
                        color: getStatusColor(result.result.status),
                        fontWeight: 'bold'
                      }}>
                        {result.result.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Text strong>运行时长：</Text>
                      <Text>{result.result.duration}ms</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Text strong>开始时间：</Text>
                      <Text>{result.result.startTime}</Text>
                    </div>
                  </div>

                  {/* 错误信息 */}
                  {result.result.error && (
                    <div style={{ marginBottom: '16px' }}>
                      <Text strong type="danger">错误信息：</Text>
                      <pre style={{ 
                        marginTop: '8px',
                        fontSize: '12px',
                        fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                        background: '#fff2f0',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ffccc7',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        margin: 0
                      }}>
                        {result.result.error}
                      </pre>
                    </div>
                  )}

                  {/* 输入参数 */}
                  <div style={{ marginBottom: '16px' }}>
                    <Text strong>输入参数：</Text>
                    <pre style={{ 
                      marginTop: '8px',
                      fontSize: '12px',
                      fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                      background: '#f6f8fa',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #e1e5e9',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      margin: 0
                    }}>
                      {formatJson(result.result.input)}
                    </pre>
                  </div>

                  {/* 输出结果 */}
                  <div>
                    <Text strong>输出结果：</Text>
                    <pre style={{ 
                      marginTop: '8px',
                      fontSize: '12px',
                      fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                      background: result.result.status === 'success' ? '#f6ffed' : '#fff2f0',
                      padding: '8px',
                      borderRadius: '4px',
                      border: `1px solid ${result.result.status === 'success' ? '#b7eb8f' : '#ffccc7'}`,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      margin: 0
                    }}>
                      {formatJson(result.result.output)}
                    </pre>
                  </div>
                </div>
              )}

              {!isRunning && !error && !result && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '200px',
                  color: '#999'
                }}>
                  <Text>点击运行按钮开始执行组件</Text>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}; 