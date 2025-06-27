import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  ImportOutlined,
  MoreOutlined,
  PlusOutlined,
  SearchOutlined
} from '@ant-design/icons';
import {
  Button,
  Card,
  Dropdown,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TagEntity,
  WorkSpaceEditRequest,
  WorkSpaceListRequest,
  WorkSpaceNewRequest,
  WorkSpacePage,
  WorkSpaceService,
} from '../services/workspace';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface WorkSpaceListPageState {
  // 数据状态
  workSpaces: WorkSpacePage[];
  tags: TagEntity[];
  loading: boolean;
  
  // 分页状态
  current: number;
  pageSize: number;
  total: number;
  
  // 模态框状态
  createModalVisible: boolean;
  editModalVisible: boolean;
  importModalVisible: boolean;
  
  // 编辑状态
  editingWorkSpace: WorkSpacePage | null;
  
  // 搜索状态
  searchParams: {
    workSpaceName?: string;
    workSpaceType?: string;
    workSpaceTag?: number[];
  };
}

const WorkSpaceListPage: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<WorkSpaceListPageState>({
    workSpaces: [],
    tags: [],
    loading: false,
    current: 1,
    pageSize: 10,
    total: 0,
    createModalVisible: false,
    editModalVisible: false,
    importModalVisible: false,
    editingWorkSpace: null,
    searchParams: {},
  });

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [importForm] = Form.useForm();

  const workSpaceService = WorkSpaceService.getInstance();

  // 工作空间类型选项
  const workSpaceTypes = [
    { value: 'workflow', label: '工作流' },
    { value: 'pipeline', label: '数据管道' },
    { value: 'automation', label: '自动化' },
    { value: 'integration', label: '集成' },
  ];

  // 获取工作空间列表
  const fetchWorkSpaces = async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const params: WorkSpaceListRequest = {
        current: state.current,
        pageSize: state.pageSize,
        ...state.searchParams,
      };
      
      const response = await workSpaceService.listWorkSpaces(params);
      
      setState(prev => ({
        ...prev,
        workSpaces: response.data,
        current: response.current,
        pageSize: response.pageSize,
        total: response.total,
      }));
    } catch (error) {
      message.error('获取工作空间列表失败，显示示例数据');
      // 显示mock数据用于演示
      const mockData: WorkSpacePage[] = [
        {
          id: 'workspace_1',
          workSpaceName: '数据处理工作流',
          workSpaceDesc: '用于处理客户数据的自动化工作流',
          workSpaceType: 'workflow',
          workSpaceTag: ['数据处理', '自动化'],
          workSpaceIcon: '🔄',
          createTime: '2024-01-15T10:30:00Z',
          updateTime: '2024-01-20T15:45:00Z',
          canvasId: 'canvas_data_processing',
          workflowId: 'workflow_customer_data',
        },
        {
          id: 'workspace_2',
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
        {
          id: 'workspace_3',
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
      ];
      
      setState(prev => ({
        ...prev,
        workSpaces: mockData,
        current: 1,
        pageSize: 10,
        total: mockData.length,
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  // 获取标签列表
  const fetchTags = async () => {
    try {
      const response = await workSpaceService.listTags({ name: '' });
      setState(prev => ({ ...prev, tags: response.tagList }));
    } catch (error) {
      message.error('获取标签列表失败，显示示例数据');
      // 显示mock数据用于演示
      const mockTags: TagEntity[] = [
        { id: 1, name: '数据处理' },
        { id: 2, name: '自动化' },
        { id: 3, name: '报表' },
        { id: 4, name: '定时任务' },
        { id: 5, name: '集成' },
        { id: 6, name: 'API' },
      ];
      setState(prev => ({ ...prev, tags: mockTags }));
    }
  };

  // 初始化数据
  useEffect(() => {
    fetchWorkSpaces();
    fetchTags();
  }, [state.current, state.pageSize, state.searchParams]);

  // 创建工作空间
  const handleCreate = async (values: WorkSpaceNewRequest) => {
    try {
      const response = await workSpaceService.createWorkSpace(values);
      
      message.success('创建工作空间成功');
      setState(prev => ({ ...prev, createModalVisible: false }));
      createForm.resetFields();
      fetchWorkSpaces();
      
      // 如果创建成功，可以选择直接跳转到编辑器
      // 这里可以根据业务需求决定是否自动跳转
      if (response.id) {
        const shouldJumpToEditor = await new Promise(resolve => {
          Modal.confirm({
            title: '工作空间创建成功',
            content: '是否立即进入开始设计工作流？',
            okText: '进入编排',
            cancelText: '稍后再说',
            onOk: () => resolve(true),
            onCancel: () => resolve(false),
          });
        });
        
        if (shouldJumpToEditor) {
          const canvasId = response.id;
          const workflowId = `workflow_${response.id}`;
          navigate(`/editor/${canvasId}/${workflowId}`);
        }
      }
    } catch (error) {
      message.error('创建工作空间失败');
    }
  };

  // 编辑工作空间
  const handleEdit = async (values: WorkSpaceEditRequest) => {
    if (!state.editingWorkSpace) return;
    
    try {
      await workSpaceService.editWorkSpace({
        ...values,
        id: state.editingWorkSpace.id,
      });
      message.success('编辑工作空间成功');
      setState(prev => ({ 
        ...prev, 
        editModalVisible: false, 
        editingWorkSpace: null 
      }));
      editForm.resetFields();
      fetchWorkSpaces();
    } catch (error) {
      message.error('编辑工作空间失败');
    }
  };

  // 删除工作空间
  const handleDelete = async (id: string) => {
    try {
      await workSpaceService.removeWorkSpace({ id });
      message.success('删除工作空间成功');
      fetchWorkSpaces();
    } catch (error) {
      message.error('删除工作空间失败');
    }
  };

  // 复制工作空间
  const handleCopy = async (record: WorkSpacePage) => {
    try {
      await workSpaceService.copyWorkSpace({
        id: record.id!,
        name: `${record.workSpaceName}_副本`,
      });
      message.success('复制工作空间成功');
      fetchWorkSpaces();
    } catch (error) {
      message.error('复制工作空间失败');
    }
  };

  // 导出工作空间
  const handleExport = async (record: WorkSpacePage) => {
    try {
      const response = await workSpaceService.exportWorkSpace({ id: record.id! });
      
      // 创建下载链接
      const blob = new Blob([response.export], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${record.workSpaceName}_export.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      message.success('导出工作空间成功');
    } catch (error) {
      message.error('导出工作空间失败');
    }
  };

  // 搜索
  const handleSearch = (values: any) => {
    setState(prev => ({
      ...prev,
      searchParams: values,
      current: 1,
    }));
  };

  // 重置搜索
  const handleResetSearch = () => {
    searchForm.resetFields();
    setState(prev => ({
      ...prev,
      searchParams: {},
      current: 1,
    }));
  };

  // 进入编辑器
  const handleOpenEditor = (record: WorkSpacePage) => {
    // 优先使用记录中的canvasId和workflowId，如果没有则使用workSpaceId作为默认值
    const canvasId = record.canvasId || record.id || 'default';
    const workflowId = record.workflowId || record.id || 'default';
    
    navigate(`/editor/${canvasId}/${workflowId}`);
  };

  // 显示编辑模态框
  const showEditModal = (record: WorkSpacePage) => {
    setState(prev => ({
      ...prev,
      editModalVisible: true,
      editingWorkSpace: record,
    }));
    editForm.setFieldsValue(record);
  };

  // 表格列定义
  const columns: ColumnsType<WorkSpacePage> = [
    {
      title: '工作空间',
      dataIndex: 'workSpaceName',
      key: 'workSpaceName',
      width: 250,
      render: (name, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              {name}
            </div>
         
          </div>
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'workSpaceType',
      key: 'workSpaceType',
      width: 100,
      render: (type) => {
        const typeConfig = workSpaceTypes.find(t => t.value === type);
        const typeColors: Record<string, string> = {
          workflow: 'blue',
          pipeline: 'green',
          automation: 'orange',
          integration: 'purple',
        };
        return (
          <Tag color={typeColors[type] || 'default'}>
            {typeConfig ? typeConfig.label : type}
          </Tag>
        );
      },
    },
    {
      title: '标签',
      dataIndex: 'workSpaceTag',
      key: 'workSpaceTag',
      width: 150,
      render: (tags: string[]) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {tags?.slice(0, 2).map((tag, index) => (
            <Tag key={index} style={{ fontSize: '12px', padding: '2px 6px' }}>
              {tag}
            </Tag>
          ))}
          {tags?.length > 2 && (
            <Tag style={{ fontSize: '12px', padding: '2px 6px', color: '#666', background: '#f5f5f5' }}>
              +{tags.length - 2}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 150,
      render: (time) => time ? new Date(time).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }) : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => {
        const menuItems = [
          {
            key: 'edit',
            label: '编辑',
            icon: <EditOutlined />,
            onClick: () => showEditModal(record),
          },
          {
            key: 'copy',
            label: '复制',
            icon: <CopyOutlined />,
            onClick: () => handleCopy(record),
          },
          {
            key: 'export',
            label: '导出',
            icon: <ExportOutlined />,
            onClick: () => handleExport(record),
          },
          {
            type: 'divider' as const,
          },
          {
            key: 'delete',
            label: '删除',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => {
              Modal.confirm({
                title: '确认删除',
                content: `确定要删除工作空间"${record.workSpaceName}"吗？此操作无法撤销。`,
                okText: '确定删除',
                cancelText: '取消',
                okType: 'danger',
                onOk: () => handleDelete(record.id!),
              });
            },
          },
        ];

        return (
          <Space size="small">
            <Button
              type="primary"
              size="small"
              onClick={() => navigate(`/workspace-overview/${record.id}`)}
            >
              进入
            </Button>
          
            <Dropdown
              menu={{
                items: menuItems,
              }}
              trigger={['click']}
            >
              <Button
                size="small"
                icon={<MoreOutlined />}
              />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0 }}>编排工作空间</Title>
        <Typography.Text type="secondary">
          管理和创建您的数据处理工作流程
        </Typography.Text>
      </div>

      {/* 操作区域 */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <Form
            form={searchForm}
            layout="inline"
            onFinish={handleSearch}
          >
            <Form.Item name="workSpaceName" label="名称">
              <Input placeholder="请输入工作空间名称" allowClear style={{ width: 150 }} />
            </Form.Item>
            <Form.Item name="workSpaceType" label="类型">
              <Select placeholder="请选择类型" allowClear style={{ width: 150 }}>
                {workSpaceTypes.map(type => (
                  <Option key={type.value} value={type.value}>
                    {type.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="workSpaceTag" label="标签">
              <Select
                mode="multiple"
                placeholder="请选择标签"
                allowClear
                style={{ width: 200 }}
              >
                {state.tags.map(tag => (
                  <Option key={tag.id} value={tag.id}>
                    {tag.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                >
                  搜索
                </Button>
                <Button onClick={handleResetSearch}>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>
          
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setState(prev => ({ ...prev, createModalVisible: true }))}
            >
              新建
            </Button>
            <Button
              icon={<ImportOutlined />}
              onClick={() => setState(prev => ({ ...prev, importModalVisible: true }))}
            >
              导入
            </Button>
            {/* <Button
              icon={<ReloadOutlined />}
              onClick={fetchWorkSpaces}
            >
              刷新
            </Button> */}
          </Space>
        </div>
      </Card>

      {/* 数据表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={state.workSpaces}
          rowKey="id"
          loading={state.loading}
          scroll={{ x: 800 }}
          pagination={{
            current: state.current,
            pageSize: state.pageSize,
            total: state.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
            onChange: (page, size) => {
              setState(prev => ({
                ...prev,
                current: page,
                pageSize: size || 10,
              }));
            },
          }}
        />
      </Card>

      {/* 创建工作空间模态框 */}
      <Modal
        title="新建"
        open={state.createModalVisible}
        onCancel={() => setState(prev => ({ ...prev, createModalVisible: false }))}
        footer={null}
        width={600}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreate}
        >
          <Form.Item
            name="workSpaceName"
            label="工作空间名称"
            rules={[{ required: true, message: '请输入工作空间名称' }]}
          >
            <Input placeholder="请输入工作空间名称" />
          </Form.Item>
          <Form.Item
            name="workSpaceDesc"
            label="描述"
          >
            <TextArea rows={3} placeholder="请输入描述" />
          </Form.Item>
          <Form.Item
            name="workSpaceType"
            label="类型"
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Select placeholder="请选择类型">
              {workSpaceTypes.map(type => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="workSpaceTag"
            label="标签"
          >
            <Select
              mode="tags"
              placeholder="请选择或输入标签"
              allowClear
            >
              {state.tags.map(tag => (
                <Option key={tag.id} value={tag.name}>
                  {tag.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="workSpaceIcon"
            label="图标"
          >
            <Input placeholder="请输入图标URL或图标名称" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                创建
              </Button>
              <Button onClick={() => setState(prev => ({ ...prev, createModalVisible: false }))}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑工作空间模态框 */}
      <Modal
        title="编辑工作空间"
        open={state.editModalVisible}
        onCancel={() => setState(prev => ({ 
          ...prev, 
          editModalVisible: false, 
          editingWorkSpace: null 
        }))}
        footer={null}
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEdit}
        >
          <Form.Item
            name="workSpaceName"
            label="工作空间名称"
            rules={[{ required: true, message: '请输入工作空间名称' }]}
          >
            <Input placeholder="请输入工作空间名称" />
          </Form.Item>
          <Form.Item
            name="workSpaceDesc"
            label="描述"
          >
            <TextArea rows={3} placeholder="请输入描述" />
          </Form.Item>
          <Form.Item
            name="workSpaceType"
            label="类型"
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Select placeholder="请选择类型">
              {workSpaceTypes.map(type => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="workSpaceTag"
            label="标签"
          >
            <Select
              mode="tags"
              placeholder="请选择或输入标签"
              allowClear
            >
              {state.tags.map(tag => (
                <Option key={tag.id} value={tag.name}>
                  {tag.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="workSpaceIcon"
            label="图标"
          >
            <Input placeholder="请输入图标URL或图标名称" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button onClick={() => setState(prev => ({ 
                ...prev, 
                editModalVisible: false, 
                editingWorkSpace: null 
              }))}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WorkSpaceListPage; 