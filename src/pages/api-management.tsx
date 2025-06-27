import { SearchOutlined } from '@ant-design/icons';
import {
    Button,
    Card,
    Form,
    Input,
    Select,
    Space,
    Table,
    Tag,
    message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ApiOnOffRequest,
    ApiPublishList,
    ApiPublishListRequest,
    PublishService,
} from '../services/publish';

const { Option } = Select;

interface ApiManagementState {
  apiList: ApiPublishList[];
  apiLoading: boolean;
  apiPagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  apiSearchParams: {
    name?: string;
    tag?: string;
  };
}

const ApiManagementPage: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const [state, setState] = useState<ApiManagementState>({
    apiList: [],
    apiLoading: false,
    apiPagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
    apiSearchParams: {},
  });

  const [apiSearchForm] = Form.useForm();
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

  // 初始化数据
  useEffect(() => {
    fetchApiList();
  }, [state.apiPagination.current, state.apiPagination.pageSize, state.apiSearchParams]);

  // API 搜索
  const handleApiSearch = (values: any) => {
    setState(prev => ({
      ...prev,
      apiSearchParams: values,
      apiPagination: { ...prev.apiPagination, current: 1 },
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

  return (
    <div style={{ padding: '24px' }}>
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
  );
};

export default ApiManagementPage; 