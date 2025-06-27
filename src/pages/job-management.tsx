import { SearchOutlined } from '@ant-design/icons';
import {
    Button,
    Card,
    Form,
    Input,
    Space,
    Table,
    Tag,
    message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    JobPublishList,
    JobPublishListRequest,
    PublishService,
} from '../services/publish';

interface JobManagementState {
  jobList: JobPublishList[];
  jobLoading: boolean;
  jobPagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  jobSearchParams: {
    jobName?: string;
  };
}

const JobManagementPage: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [state, setState] = useState<JobManagementState>({
    jobList: [],
    jobLoading: false,
    jobPagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
    jobSearchParams: {},
  });

  const [jobSearchForm] = Form.useForm();
  const publishService = PublishService.getInstance();

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
    fetchJobList();
  }, [state.jobPagination.current, state.jobPagination.pageSize, state.jobSearchParams]);

  // JOB 搜索
  const handleJobSearch = (values: any) => {
    setState(prev => ({
      ...prev,
      jobSearchParams: values,
      jobPagination: { ...prev.jobPagination, current: 1 },
    }));
  };

  // 重置搜索
  const handleJobSearchReset = () => {
    jobSearchForm.resetFields();
    setState(prev => ({
      ...prev,
      jobSearchParams: {},
      jobPagination: { ...prev.jobPagination, current: 1 },
    }));
  };

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

  return (
    <div style={{ padding: '24px' }}>
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
  );
};

export default JobManagementPage; 