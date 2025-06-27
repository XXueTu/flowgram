import {
  ApiOutlined,
  AppstoreOutlined,
  ArrowLeftOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  DatabaseOutlined,
  HistoryOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MonitorOutlined,
  PlayCircleOutlined,
  SettingOutlined
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Layout,
  Menu,
  Row,
  Space,
  Statistic,
  Tag,
  Tooltip,
  Typography
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { WorkSpaceGetResponse, WorkSpaceService } from '../services/workspace';

const { Title, Text } = Typography;
const { Sider, Content } = Layout;

interface WorkspaceOverviewState {
  workspaceInfo: WorkSpaceGetResponse | null;
  loading: boolean;
  activeMenuKey: string;
  collapsed: boolean;
}

const WorkspaceOverviewPage: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const [state, setState] = useState<WorkspaceOverviewState>({
    workspaceInfo: null,
    loading: false,
    activeMenuKey: 'overview',
    collapsed: false,
  });

  const workSpaceService = WorkSpaceService.getInstance();

  // 获取工作空间详情
  const fetchWorkspaceInfo = async () => {
    if (!workspaceId) return;
    
    setState(prev => ({ ...prev, loading: true }));
    try {
      // 调用新的getWorkSpace API
      const response = await workSpaceService.getWorkSpace({ id: workspaceId });
      
      setState(prev => ({
        ...prev,
        workspaceInfo: response,
      }));
    } catch (error) {
      console.error('获取工作空间信息失败:', error);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchWorkspaceInfo();
  }, [workspaceId]);

  // 添加键盘快捷键支持
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + \ 切换侧边栏
      if ((event.ctrlKey || event.metaKey) && event.key === '\\') {
        event.preventDefault();
        toggleCollapsed();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 工作空间类型映射
  const getWorkspaceTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      workflow: '工作流',
      pipeline: '数据管道',
      automation: '自动化',
      integration: '集成',
    };
    return typeMap[type] || type;
  };

  // 获取类型对应的颜色
  const getWorkspaceTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      workflow: 'blue',
      pipeline: 'green',
      automation: 'orange',
      integration: 'purple',
    };
    return colorMap[type] || 'default';
  };

  // 计算成功率（基于runCount，假设90%的成功率）
  const calculateSuccessRate = (runCount: number) => {
    if (runCount === 0) return 0;
    return Math.round((runCount * 0.9) * 10) / 10; // 简单的90%成功率计算
  };

  // 菜单项配置
  const menuItems = [
    {
      key: 'overview',
      icon: <HomeOutlined />,
      label: '概览',
    },
    {
      key: 'editor',
      icon: <SettingOutlined />,
      label: '编排设计',
    },
    {
      key: 'api',
      icon: <ApiOutlined />,
      label: 'API管理',
    },
    {
      key: 'job',
      icon: <ClockCircleOutlined />,
      label: '任务管理',
    },
    {
      key: 'plugin',
      icon: <AppstoreOutlined />,
      label: '插件管理',
    },
    {
      key: 'monitor',
      icon: <MonitorOutlined />,
      label: '运行监控',
    },
    {
      key: 'history',
      icon: <HistoryOutlined />,
      label: '运行历史',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
  ];

  // 处理菜单点击
  const handleMenuClick = (key: string) => {
    if (key === 'editor') {
      // 编排设计跳转到独立的编辑器页面
      const canvasId = workspaceId || 'default';
      const workflowId = workspaceId || 'default';
      navigate(`/editor/${canvasId}/${workflowId}`);
      return;
    }
    setState(prev => ({ ...prev, activeMenuKey: key }));
  };

  // 切换侧边栏折叠状态
  const toggleCollapsed = () => {
    setState(prev => ({ ...prev, collapsed: !prev.collapsed }));
  };

  // 渲染API管理组件
  const renderApiManagement = () => {
    const ApiManagement = React.lazy(() => import('./api-management'));
    
    return (
      <React.Suspense fallback={<div style={{ padding: '24px', textAlign: 'center' }}>加载API管理中...</div>}>
        <ApiManagement />
      </React.Suspense>
    );
  };

  // 渲染任务管理组件
  const renderJobManagement = () => {
    const JobManagement = React.lazy(() => import('./job-management'));
    
    return (
      <React.Suspense fallback={<div style={{ padding: '24px', textAlign: 'center' }}>加载任务管理中...</div>}>
        <JobManagement />
      </React.Suspense>
    );
  };

  // 渲染插件管理组件
  const renderPluginManagement = () => {
    const PluginManagement = React.lazy(() => import('./plugin-management'));
    
    return (
      <React.Suspense fallback={<div style={{ padding: '24px', textAlign: 'center' }}>加载插件管理中...</div>}>
        <PluginManagement />
      </React.Suspense>
    );
  };

  // 渲染右侧内容区域
  const renderContent = () => {
    if (!state.workspaceInfo) {
      return (
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <Text>加载中...</Text>
        </div>
      );
    }

    switch (state.activeMenuKey) {
      case 'overview':
        return (
          <div style={{ padding: '24px' }}>
            {/* 工作空间基本信息 */}
            <Card style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
                <div style={{ fontSize: '48px' }}>
                  {state.workspaceInfo.workSpaceIcon || '📋'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <Title level={3} style={{ margin: 0 }}>
                      {state.workspaceInfo.workSpaceName}
                    </Title>
                    <Tag 
                      color={getWorkspaceTypeColor(state.workspaceInfo.workSpaceType)}
                      style={{ fontSize: '14px', padding: '4px 8px' }}
                    >
                      {getWorkspaceTypeLabel(state.workspaceInfo.workSpaceType)}
                    </Tag>
                  </div>
                  <Text style={{ fontSize: '16px', color: '#666', lineHeight: '1.5' }}>
                    {state.workspaceInfo.workSpaceDesc}
                  </Text>
                  <div style={{ marginTop: '12px' }}>
                    {state.workspaceInfo.workSpaceTag?.map((tag, index) => (
                      <Tag key={index} style={{ marginBottom: '4px' }}>
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* 统计数据 */}
            <Card title="运行统计" style={{ marginBottom: '24px' }}>
              <Row gutter={16}>
                <Col span={6}>
                  <Statistic
                    title="节点总数"
                    value={state.workspaceInfo.stat.nodeCount}
                    prefix={<DatabaseOutlined />}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="运行次数"
                    value={state.workspaceInfo.stat.runCount}
                    prefix={<PlayCircleOutlined />}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="成功率"
                    value={calculateSuccessRate(state.workspaceInfo.stat.runCount)}
                    suffix="%"
                    precision={1}
                    prefix={<BarChartOutlined />}
                  />
                </Col>
                <Col span={6}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', color: '#999', marginBottom: '4px' }}>
                      <ClockCircleOutlined /> 最后运行
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                      {state.workspaceInfo.stat.lastRunTime ? 
                        dayjs(state.workspaceInfo.stat.lastRunTime).format('MM-DD HH:mm') : 
                        '暂无记录'
                      }
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* 详细信息 */}
            <Card title="详细信息" style={{ marginBottom: '24px' }}>
              <Descriptions column={2} bordered>
                <Descriptions.Item label="工作空间ID">
                  <Text copyable>{state.workspaceInfo.id}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="类型">
                  {getWorkspaceTypeLabel(state.workspaceInfo.workSpaceType)}
                </Descriptions.Item>
                <Descriptions.Item label="节点数量">
                  {state.workspaceInfo.stat.nodeCount}
                </Descriptions.Item>
                <Descriptions.Item label="运行次数">
                  {state.workspaceInfo.stat.runCount}
                </Descriptions.Item>
                <Descriptions.Item label="最后运行时间" span={2}>
                  {state.workspaceInfo.stat.lastRunTime ? 
                    dayjs(state.workspaceInfo.stat.lastRunTime).format('YYYY-MM-DD HH:mm:ss') : 
                    '暂无记录'
                  }
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* 系统消息 */}
            {state.workspaceInfo.messages && state.workspaceInfo.messages.length > 0 && (
              <Card title="系统消息" style={{ marginBottom: '24px' }}>
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                  {state.workspaceInfo.messages.map((message: string, index: number) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '6px', 
                        height: '6px', 
                        borderRadius: '50%', 
                        backgroundColor: '#52c41a' 
                      }} />
                      <Text style={{ fontSize: '14px' }}>{message}</Text>
                    </div>
                  ))}
                </Space>
              </Card>
            )}

            {/* 最近活动 */}
            <Card title="最近活动" style={{ marginTop: '24px' }}>
              <Space direction="vertical" style={{ width: '100%' }} size="small">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PlayCircleOutlined style={{ color: '#1890ff' }} />
                  <Text style={{ fontSize: '14px' }}>
                    {state.workspaceInfo.stat.lastRunTime ? 
                      `${dayjs(state.workspaceInfo.stat.lastRunTime).format('MM-DD HH:mm')} 执行成功` :
                      '暂无运行记录'
                    }
                  </Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DatabaseOutlined style={{ color: '#52c41a' }} />
                  <Text style={{ fontSize: '14px' }}>
                    工作流包含 {state.workspaceInfo.stat.nodeCount} 个节点
                  </Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BarChartOutlined style={{ color: '#722ed1' }} />
                  <Text style={{ fontSize: '14px' }}>
                    总共执行了 {state.workspaceInfo.stat.runCount} 次
                  </Text>
                </div>
              </Space>
            </Card>
          </div>
        );

      case 'editor':
        return (
          <div style={{ padding: '24px' }}>
            <Card title="编排设计" style={{ minHeight: '500px' }}>
              <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
                <SettingOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                <div>编排设计功能开发中...</div>
              </div>
            </Card>
          </div>
        );

      case 'api':
        return renderApiManagement();

      case 'job':
        return renderJobManagement();

      case 'plugin':
        return renderPluginManagement();

      case 'monitor':
        return (
          <div style={{ padding: '24px' }}>
            <Card title="运行监控" style={{ minHeight: '500px' }}>
              <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
                <MonitorOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                <div>监控功能开发中...</div>
              </div>
            </Card>
          </div>
        );

      case 'history':
        return (
          <div style={{ padding: '24px' }}>
            <Card title="运行历史" style={{ minHeight: '500px' }}>
              <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
                <HistoryOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                <div>历史记录功能开发中...</div>
              </div>
            </Card>
          </div>
        );

      case 'settings':
        return (
          <div style={{ padding: '24px' }}>
            <Card title="工作空间设置" style={{ minHeight: '500px' }}>
              <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
                <SettingOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                <div>设置功能开发中...</div>
              </div>
            </Card>
          </div>
        );

      default:
        return renderContent();
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* 页面头部 */}
      <div style={{ 
        background: '#fff', 
        padding: '16px 24px', 
        borderBottom: '1px solid #e8e8e8',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)}
        >
          返回
        </Button>
        <Tooltip 
          title={
            <div>
              {state.collapsed ? '展开侧边栏' : '折叠侧边栏'}
              <br />
              <span style={{ fontSize: '12px', opacity: 0.8 }}>快捷键: ⌘/Ctrl + \</span>
            </div>
          } 
          placement="bottom"
        >
          <Button
            type="text"
            icon={state.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleCollapsed}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '6px',
              transition: 'all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)',
              backgroundColor: 'transparent',
              border: '1px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
              e.currentTarget.style.borderColor = '#d9d9d9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          />
        </Tooltip>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '24px' }}>
            {state.workspaceInfo?.workSpaceIcon || ''}
          </div>
        
        </div>
      </div>

      {/* 主要布局 */}
      <Layout style={{ minHeight: 'calc(100vh - 73px)' }}>
        {/* 左侧菜单 */}
        <Sider 
          width={200} 
          collapsedWidth={60}
          collapsed={state.collapsed}
          style={{ 
            background: '#fff',
            boxShadow: state.collapsed ? 'none' : '2px 0 8px 0 rgba(29, 35, 41, 0.05)',
            transition: 'all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)',
            zIndex: 1
          }}
          theme="light"
          trigger={null}
        >
          {/* 折叠状态下的悬浮按钮 */}
          {state.collapsed && (
            <div style={{ 
              position: 'absolute', 
              top: '12px', 
              right: '-18px', 
              zIndex: 1000,
              background: '#fff',
              borderRadius: '50%',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
            }}>
              <Tooltip title="展开侧边栏" placement="right">
                <Button
                  type="text"
                  size="small"
                  icon={<MenuUnfoldOutlined />}
                  onClick={toggleCollapsed}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#666',
                    transition: 'all 0.2s',
                  }}
                />
              </Tooltip>
            </div>
          )}
          
          <Menu
            mode="inline"
            selectedKeys={[state.activeMenuKey]}
            style={{ 
              height: '100%', 
              borderRight: 0,
              paddingTop: state.collapsed ? '48px' : '12px',
              transition: 'padding-top 0.2s'
            }}
            items={menuItems}
            onClick={({ key }) => handleMenuClick(key)}
            inlineCollapsed={state.collapsed}
          />
        </Sider>

        {/* 右侧内容区域 */}
        <Layout style={{ background: '#f5f5f5' }}>
          <Content style={{ overflow: 'auto' }}>
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default WorkspaceOverviewPage; 