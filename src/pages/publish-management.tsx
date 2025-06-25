import { ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Form,
  Input,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ApiOnOffRequest,
  ApiPublishList,
  ApiPublishListRequest,
  JobPublishList,
  JobPublishListRequest,
  PublishService,
} from '../services/publish';

const { Title } = Typography;
const { Option } = Select;

interface PublishManagementState {
  activeTab: string;
  apiList: ApiPublishList[];
  jobList: JobPublishList[];
  apiLoading: boolean;
  jobLoading: boolean;
  apiPagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  jobPagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  apiSearchParams: {
    name?: string;
    tag?: string;
  };
  jobSearchParams: {
    jobName?: string;
  };
}

const PublishManagementPage: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const [state, setState] = useState<PublishManagementState>({
    activeTab: 'api',
    apiList: [],
    jobList: [],
    apiLoading: false,
    jobLoading: false,
    apiPagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
    jobPagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
    apiSearchParams: {},
    jobSearchParams: {},
  });

  const [apiSearchForm] = Form.useForm();
  const [jobSearchForm] = Form.useForm();
  const publishService = PublishService.getInstance();

  // 获取 API 列表
  const fetchApiList = async () => {
    if (!workspaceId) return;
    
    setState(prev => ({ ...prev, apiLoading: true }));
    try {
      const params: ApiPublishListRequest = {
        current: state.apiPagination.current,
        pageSize: state.apiPagination.pageSize,
        id: workspaceId,
        ...state.apiSearchParams,
      };
      
      const response = await publishService.getApiList(params);
      setState(prev => ({
        ...prev,
        apiList: response.list,
        apiPagination: {
          current: response.current,
          pageSize: response.pageSize,
          total: response.total,
        },
      }));
    } catch (error) {
      message.error('获取 API 列表失败，显示示例数据');
      // Mock 数据
      const mockApiList: ApiPublishList[] = [
        {
          workSpaceId: workspaceId,
          apiId: 'api_001',
          apiName: '用户信息查询API',
          apiDesc: '根据用户ID查询用户详细信息',
          tag: ['用户管理', '查询'],
          publishTime: '2024-01-15T10:30:00Z',
          status: 'ON',
        },
        {
          workSpaceId: workspaceId,
          apiId: 'api_002',
          apiName: '数据处理API',
          apiDesc: '批量处理数据并返回结果',
          tag: ['数据处理', '批量'],
          publishTime: '2024-01-14T09:20:00Z',
          status: 'OFF',
        },
      ];
      setState(prev => ({
        ...prev,
        apiList: mockApiList,
        apiPagination: {
          current: 1,
          pageSize: 10,
          total: mockApiList.length,
        },
      }));
    } finally {
      setState(prev => ({ ...prev, apiLoading: false }));
    }
  };

  // 获取 JOB 列表
  const fetchJobList = async () => {
    if (!workspaceId) return;
    
    setState(prev => ({ ...prev, jobLoading: true }));
    try {
      const params: JobPublishListRequest = {
        current: state.jobPagination.current,
        pageSize: state.jobPagination.pageSize,
        id: workspaceId,
        ...state.jobSearchParams,
      };
      
      const response = await publishService.getJobList(params);
      setState(prev => ({
        ...prev,
        jobList: response.list,
        jobPagination: {
          current: response.current,
          pageSize: response.pageSize,
          total: response.total,
        },
      }));
    } catch (error) {
      message.error('获取任务列表失败，显示示例数据');
      // Mock 数据
      const mockJobList: JobPublishList[] = [
        {
          workSpaceId: workspaceId,
          jobId: 'job_001',
          jobName: '每日数据同步',
          jobDesc: '每天凌晨2点同步数据库数据',
          jobCron: '0 2 * * *',
          jobParam: '{"database": "production", "tables": ["users", "orders"]}',
          status: 'ON',
          createTime: '2024-01-10T08:00:00Z',
          updateTime: '2024-01-15T10:30:00Z',
        },
        {
          workSpaceId: workspaceId,
          jobId: 'job_002',
          jobName: '报表生成任务',
          jobDesc: '每周生成销售报表',
          jobCron: '0 6 * * 1',
          jobParam: '{"report_type": "sales", "format": "excel"}',
          status: 'OFF',
          createTime: '2024-01-08T12:00:00Z',
          updateTime: '2024-01-12T14:20:00Z',
        },
      ];
      setState(prev => ({
        ...prev,
        jobList: mockJobList,
        jobPagination: {
          current: 1,
          pageSize: 10,
          total: mockJobList.length,
        },
      }));
    } finally {
      setState(prev => ({ ...prev, jobLoading: false }));
    }
  };

  // 初始化数据
  useEffect(() => {
    if (state.activeTab === 'api') {
      fetchApiList();
    }
  }, [state.apiPagination.current, state.apiPagination.pageSize, state.apiSearchParams]);

  useEffect(() => {
    if (state.activeTab === 'job') {
      fetchJobList();
    }
  }, [state.jobPagination.current, state.jobPagination.pageSize, state.jobSearchParams]);

  // API 搜索
  const handleApiSearch = (values: any) => {
    setState(prev => ({
      ...prev,
      apiSearchParams: values,
      apiPagination: { ...prev.apiPagination, current: 1 },
    }));
  };

  // JOB 搜索
  const handleJobSearch = (values: any) => {
    setState(prev => ({
      ...prev,
      jobSearchParams: values,
      jobPagination: { ...prev.jobPagination, current: 1 },
    }));
  };

  // 重置搜索
  const handleApiSearchReset = () => {
    apiSearchForm.resetFields();
    setState(prev => ({
      ...prev,
      apiSearchParams: {},
      apiPagination: { ...prev.apiPagination, current: 1 },
    }));
  };

  const handleJobSearchReset = () => {
    jobSearchForm.resetFields();
    setState(prev => ({
      ...prev,
      jobSearchParams: {},
      jobPagination: { ...prev.jobPagination, current: 1 },
    }));
  };

  // API上下线
  const handleApiOnOff = async (apiId: string, status: string) => {
    try {
      const params: ApiOnOffRequest = { apiId, status };
      await publishService.apiOnOff(params);
      
      // 更新本地状态
      setState(prev => ({
        ...prev,
        apiList: prev.apiList.map(api => 
          api.apiId === apiId ? { ...api, status } : api
        ),
      }));
      
      message.success(`API已${status === 'ON' ? '上线' : '下线'}`);
    } catch (error) {
      message.error(`API${status === 'ON' ? '上线' : '下线'}失败`);
    }
  };

  // API 表格列定义
  const apiColumns: ColumnsType<ApiPublishList> = [
    {
      title: 'API名称',
      dataIndex: 'apiName',
      key: 'apiName',
      width: 150,
      ellipsis: true,
    },
    {
      title: '描述',
      dataIndex: 'apiDesc',
      key: 'apiDesc',
      width: 200,
      ellipsis: true,
    },
    {
      title: '标签',
      dataIndex: 'tag',
      key: 'tag',
      width: 120,
      render: (tags: string[]) => (
        <>
          {tags?.map((tag, index) => (
            <Tag key={index} color="blue">
              {tag}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={status === 'ON' ? 'green' : 'red'}>
          {status === 'ON' ? '在线' : '离线'}
        </Tag>
      ),
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      key: 'publishTime',
      width: 180,
      render: (time: string) => new Date(time).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button 
            size="small" 
            type="primary"
            onClick={() => navigate(`/api-detail/${workspaceId}/${record.apiId}`)}
          >
            详情
          </Button>
          <Button 
            size="small"
            onClick={() => handleApiOnOff(record.apiId, record.status === 'ON' ? 'OFF' : 'ON')}
          >
            {record.status === 'ON' ? '下线' : '上线'}
          </Button>
        </Space>
      ),
    },
  ];

  // JOB 表格列定义
  const jobColumns: ColumnsType<JobPublishList> = [
    {
      title: '任务名称',
      dataIndex: 'jobName',
      key: 'jobName',
      width: 150,
      ellipsis: true,
    },
    {
      title: '描述',
      dataIndex: 'jobDesc',
      key: 'jobDesc',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Cron表达式',
      dataIndex: 'jobCron',
      key: 'jobCron',
      width: 120,
      render: (cron: string) => (
        <code style={{ background: '#f5f5f5', padding: '2px 4px', borderRadius: '3px' }}>
          {cron}
        </code>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={status === 'ON' ? 'green' : 'red'}>
          {status === 'ON' ? '运行中' : '已停止'}
        </Tag>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 180,
      render: (time: string) => new Date(time).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button size="small" type="primary">
            编辑
          </Button>
          <Button size="small">
            {record.status === 'ON' ? '停止' : '启动'}
          </Button>
        </Space>
      ),
    },
  ];

  // 插件 Mock 数据和列定义
  const pluginColumns: ColumnsType<any> = [
    {
      title: '插件名称',
      dataIndex: 'pluginName',
      key: 'pluginName',
      width: 150,
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      width: 100,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={status === 'enabled' ? 'green' : 'red'}>
          {status === 'enabled' ? '已启用' : '已禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: () => (
        <Space size="small">
          <Button size="small" type="primary">
            配置
          </Button>
          <Button size="small">
            禁用
          </Button>
        </Space>
      ),
    },
  ];

  const mockPluginData = [
    {
      key: '1',
      pluginName: '数据转换插件',
      version: '1.2.0',
      description: '提供多种数据格式转换功能',
      status: 'enabled',
    },
    {
      key: '2',
      pluginName: '消息通知插件',
      version: '2.1.0',
      description: '支持邮件、短信、钉钉等多种通知方式',
      status: 'disabled',
    },
  ];

  const tabItems = [
    {
      key: 'api',
      label: 'API',
      children: (
        <div>
          {/* API 搜索区域 */}
          <Card style={{ marginBottom: '16px' }}>
            <Form
              form={apiSearchForm}
              layout="inline"
              onFinish={handleApiSearch}
            >
              <Form.Item name="name" label="API名称">
                <Input placeholder="请输入API名称" allowClear style={{ width: 200 }} />
              </Form.Item>
              <Form.Item name="tag" label="标签">
                <Input placeholder="请输入标签" allowClear style={{ width: 150 }} />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                    搜索
                  </Button>
                  <Button onClick={handleApiSearchReset}>
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
          
          {/* API 表格 */}
          <Card>
            <Table
              columns={apiColumns}
              dataSource={state.apiList}
              rowKey="apiId"
              loading={state.apiLoading}
              pagination={{
                current: state.apiPagination.current,
                pageSize: state.apiPagination.pageSize,
                total: state.apiPagination.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
                onChange: (page, size) => {
                  setState(prev => ({
                    ...prev,
                    apiPagination: {
                      ...prev.apiPagination,
                      current: page,
                      pageSize: size || 10,
                    },
                  }));
                },
              }}
            />
          </Card>
        </div>
      ),
    },
    {
      key: 'job',
      label: '任务',
      children: (
        <div>
          {/* JOB 搜索区域 */}
          <Card style={{ marginBottom: '16px' }}>
            <Form
              form={jobSearchForm}
              layout="inline"
              onFinish={handleJobSearch}
            >
              <Form.Item name="jobName" label="任务名称">
                <Input placeholder="请输入任务名称" allowClear style={{ width: 200 }} />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                    搜索
                  </Button>
                  <Button onClick={handleJobSearchReset}>
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
          
          {/* JOB 表格 */}
          <Card>
            <Table
              columns={jobColumns}
              dataSource={state.jobList}
              rowKey="jobId"
              loading={state.jobLoading}
              pagination={{
                current: state.jobPagination.current,
                pageSize: state.jobPagination.pageSize,
                total: state.jobPagination.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
                onChange: (page, size) => {
                  setState(prev => ({
                    ...prev,
                    jobPagination: {
                      ...prev.jobPagination,
                      current: page,
                      pageSize: size || 10,
                    },
                  }));
                },
              }}
            />
          </Card>
        </div>
      ),
    },
    {
      key: 'plugin',
      label: '插件',
      children: (
        <Card>
          <div style={{ marginBottom: '16px', color: '#666' }}>
            插件管理功能开发中，敬请期待...
          </div>
          <Table
            columns={pluginColumns}
            dataSource={mockPluginData}
            rowKey="key"
            pagination={false}
          />
        </Card>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Tab 内容 */}
      <Tabs
        activeKey={state.activeTab}
        onChange={(key) => setState(prev => ({ ...prev, activeTab: key }))}
        items={tabItems}
        tabBarExtraContent={
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/workflow-list')}
          >
            返回列表
          </Button>
        }
      />
    </div>
  );
};

export default PublishManagementPage; 