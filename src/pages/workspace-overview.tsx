import {
  ApiOutlined,
  AppstoreOutlined,
  ArrowLeftOutlined,
  BarChartOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DatabaseOutlined,
  HistoryOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MonitorOutlined,
  PlayCircleOutlined,
  SettingOutlined,
  UserOutlined
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
  Typography
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { WorkSpacePage, WorkSpaceService } from '../services/workspace';

const { Title, Text } = Typography;
const { Sider, Content } = Layout;

interface WorkspaceOverviewState {
  workspaceInfo: WorkSpacePage | null;
  loading: boolean;
  activeMenuKey: string;
  collapsed: boolean;
  statistics: {
    totalNodes: number;
    totalRuns: number;
    successRate: number;
    lastRunTime: string;
  };
}

const WorkspaceOverviewPage: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const [state, setState] = useState<WorkspaceOverviewState>({
    workspaceInfo: null,
    loading: false,
    activeMenuKey: 'overview',
    collapsed: false,
    statistics: {
      totalNodes: 0,
      totalRuns: 0,
      successRate: 0,
      lastRunTime: '',
    },
  });

  const workSpaceService = WorkSpaceService.getInstance();

  // 获取工作空间详情
  const fetchWorkspaceInfo = async () => {
    if (!workspaceId) return;
    
    setState(prev => ({ ...prev, loading: true }));
    try {
      // 这里应该调用获取工作空间详情的API
      // const response = await workSpaceService.getWorkSpaceDetail({ id: workspaceId });
      
      // 暂时使用mock数据，根据workspaceId显示不同内容
      const mockWorkspaces: Record<string, WorkSpacePage> = {
        'workspace_1': {
          id: workspaceId,
          workSpaceName: '数据处理工作流',
          workSpaceDesc: '用于处理客户数据的自动化工作流，包含数据清洗、转换、分析等步骤',
          workSpaceType: 'workflow',
          workSpaceTag: ['数据处理', '自动化', '客户数据'],
          workSpaceIcon: '🔄',
          createTime: '2024-01-15T10:30:00Z',
          updateTime: '2024-01-20T15:45:00Z',
          canvasId: 'canvas_data_processing',
          workflowId: 'workflow_customer_data',
        },
        'workspace_2': {
          id: workspaceId,
          workSpaceName: '报表生成管道',
          workSpaceDesc: '自动生成日报、周报、月报的数据管道',
          workSpaceType: 'pipeline',
          workSpaceTag: ['报表', '定时任务'],
          workSpaceIcon: '📊',
          createTime: '2024-01-10T09:15:00Z',
          updateTime: '2024-01-18T11:20:00Z',
          canvasId: 'canvas_report_pipeline',
          workflowId: 'workflow_report_generation',
        },
        'workspace_3': {
          id: workspaceId,
          workSpaceName: '系统集成流程',
          workSpaceDesc: '连接多个外部系统的集成流程',
          workSpaceType: 'integration',
          workSpaceTag: ['集成', 'API'],
          workSpaceIcon: '🔗',
          createTime: '2024-01-08T14:20:00Z',
          updateTime: '2024-01-16T16:30:00Z',
          canvasId: 'canvas_integration',
          workflowId: 'workflow_system_integration',
        },
      };
      
      const mockWorkspace = mockWorkspaces[workspaceId!] || {
        id: workspaceId,
        workSpaceName: '默认工作空间',
        workSpaceDesc: '这是一个示例工作空间',
        workSpaceType: 'workflow',
        workSpaceTag: ['示例'],
        workSpaceIcon: '📋',
        createTime: '2024-01-01T00:00:00Z',
        updateTime: '2024-01-01T00:00:00Z',
        canvasId: workspaceId || 'default',
        workflowId: workspaceId || 'default',
      };
      
      const mockStatisticsMap: Record<string, typeof state.statistics> = {
        'workspace_1': {
          totalNodes: 12,
          totalRuns: 156,
          successRate: 94.2,
          lastRunTime: '2024-01-20T15:45:00Z',
        },
        'workspace_2': {
          totalNodes: 8,
          totalRuns: 89,
          successRate: 97.8,
          lastRunTime: '2024-01-18T11:20:00Z',
        },
        'workspace_3': {
          totalNodes: 15,
          totalRuns: 234,
          successRate: 91.5,
          lastRunTime: '2024-01-16T16:30:00Z',
        },
      };
      
      const mockStatistics = mockStatisticsMap[workspaceId!] || {
        totalNodes: 5,
        totalRuns: 25,
        successRate: 88.0,
        lastRunTime: '2024-01-01T00:00:00Z',
      };
      
      setState(prev => ({
        ...prev,
        workspaceInfo: mockWorkspace,
        statistics: mockStatistics,
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
      const canvasId = state.workspaceInfo?.canvasId || state.workspaceInfo?.id || workspaceId || 'default';
      const workflowId = state.workspaceInfo?.workflowId || state.workspaceInfo?.id || workspaceId || 'default';
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
                    value={state.statistics.totalNodes}
                    prefix={<DatabaseOutlined />}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="运行次数"
                    value={state.statistics.totalRuns}
                    prefix={<PlayCircleOutlined />}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="成功率"
                    value={state.statistics.successRate}
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
                      {state.statistics.lastRunTime ? 
                        dayjs(state.statistics.lastRunTime).format('MM-DD HH:mm') : 
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
                <Descriptions.Item label="画布ID">
                  <Text copyable>{state.workspaceInfo.canvasId}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="工作流ID">
                  <Text copyable>{state.workspaceInfo.workflowId}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="类型">
                  {getWorkspaceTypeLabel(state.workspaceInfo.workSpaceType)}
                </Descriptions.Item>
                <Descriptions.Item label="创建时间">
                  {dayjs(state.workspaceInfo.createTime).format('YYYY-MM-DD HH:mm:ss')}
                </Descriptions.Item>
                <Descriptions.Item label="更新时间">
                  {dayjs(state.workspaceInfo.updateTime).format('YYYY-MM-DD HH:mm:ss')}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* 快捷操作 */}
            <Card title="快捷操作">
              <Row gutter={16}>
                <Col span={6}>
                  <Card 
                    hoverable 
                    style={{ textAlign: 'center', cursor: 'pointer' }}
                    onClick={() => {
                      const canvasId = state.workspaceInfo?.canvasId || state.workspaceInfo?.id || workspaceId || 'default';
                      const workflowId = state.workspaceInfo?.workflowId || state.workspaceInfo?.id || workspaceId || 'default';
                      navigate(`/editor/${canvasId}/${workflowId}`);
                    }}
                  >
                    <SettingOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '8px' }} />
                    <div>编排设计</div>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card 
                    hoverable 
                    style={{ textAlign: 'center', cursor: 'pointer' }}
                    onClick={() => handleMenuClick('api')}
                  >
                    <ApiOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '8px' }} />
                    <div>API管理</div>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card 
                    hoverable 
                    style={{ textAlign: 'center', cursor: 'pointer' }}
                    onClick={() => handleMenuClick('job')}
                  >
                    <ClockCircleOutlined style={{ fontSize: '32px', color: '#faad14', marginBottom: '8px' }} />
                    <div>任务管理</div>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card 
                    hoverable 
                    style={{ textAlign: 'center', cursor: 'pointer' }}
                    onClick={() => handleMenuClick('monitor')}
                  >
                    <MonitorOutlined style={{ fontSize: '32px', color: '#722ed1', marginBottom: '8px' }} />
                    <div>运行监控</div>
                  </Card>
                </Col>
              </Row>
            </Card>

            {/* 最近活动 */}
            <Card title="最近活动" style={{ marginTop: '24px' }}>
              <Space direction="vertical" style={{ width: '100%' }} size="small">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CalendarOutlined style={{ color: '#52c41a' }} />
                  <Text style={{ fontSize: '14px' }}>
                    {dayjs(state.workspaceInfo.updateTime).format('MM-DD HH:mm')} 工作流已更新
                  </Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PlayCircleOutlined style={{ color: '#1890ff' }} />
                  <Text style={{ fontSize: '14px' }}>
                    {dayjs(state.statistics.lastRunTime).format('MM-DD HH:mm')} 执行成功
                  </Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserOutlined style={{ color: '#722ed1' }} />
                  <Text style={{ fontSize: '14px' }}>
                    {dayjs(state.workspaceInfo.createTime).format('MM-DD HH:mm')} 工作空间创建
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
        <Button
          type="text"
          icon={state.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleCollapsed}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '24px' }}>
            {state.workspaceInfo?.workSpaceIcon || '📋'}
          </div>
          <Title level={4} style={{ margin: 0 }}>
            {state.workspaceInfo?.workSpaceName || '工作空间'}
          </Title>
        </div>
      </div>

      {/* 主要布局 */}
      <Layout style={{ minHeight: 'calc(100vh - 73px)' }}>
        {/* 左侧菜单 */}
        <Sider 
          width={200} 
          collapsedWidth={60}
          collapsed={state.collapsed}
          style={{ background: '#fff' }}
          theme="light"
          trigger={null}
        >
          <Menu
            mode="inline"
            selectedKeys={[state.activeMenuKey]}
            style={{ height: '100%', borderRight: 0 }}
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