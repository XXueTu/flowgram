import {
  ApiOutlined,
  CopyOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  FileTextOutlined,
  HistoryOutlined,
  KeyOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  SearchOutlined
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Typography
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate, useParams } from 'react-router-dom';
import remarkGfm from 'remark-gfm';
import {
  Case,
  CaseListRequest,
  CaseService
} from '../services/case';
import {
  ApiCallRequest,
  ApiCallTemplateRequest,
  ApiEditRequest,
  ApiExportCurlRequest,
  ApiGetApiDocRequest,
  ApiGetApiDocResponse,
  ApiHistory,
  ApiHistoryRequest,
  ApiOnOffRequest,
  ApiPublishList,
  ApiPublishListRequest,
  ApiRecords,
  ApiRecordsRequest,
  ApiSecretKey,
  ApiSecretKeyListRequest,
  PublishService,
} from '../services/publish';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;

interface ApiManagementState {
  // API列表相关
  apiList: ApiPublishList[];
  apiLoading: boolean;
  apiSearchParams: {
    name?: string;
    tag?: string;
  };
  // 选中的API
  selectedApiId: string | null;
  selectedApi: ApiPublishList | null;
  // API详情相关
  activeTab: string;
  records: ApiRecords[];
  secretKeys: ApiSecretKey[];
  history: ApiHistory[];
  recordsLoading: boolean;
  secretKeysLoading: boolean;
  historyLoading: boolean;
  recordsPagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  secretKeysPagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  historyPagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  recordsSearchParams: {
    startTime?: number;
    endTime?: number;
    request?: string;
    response?: string;
  };
  editModalVisible: boolean;
  secretKeyModalVisible: boolean;
  jsonViewerModalVisible: boolean;
  jsonViewerContent: string;
  jsonViewerTitle: string;
  callTemplate: {
    url: string;
    header: string;
    body: string;
  };
  testResult: string;
  caseList: Case[];
  selectedCaseId: string;
  caseListLoading: boolean;
  templateLoading: boolean;
  exportCurlLoading: boolean;
  apiDoc: ApiGetApiDocResponse | null;
  docLoading: boolean;
}

const ApiManagementPage: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const [state, setState] = useState<ApiManagementState>({
    // API列表相关
    apiList: [],
    apiLoading: false,
    apiSearchParams: {},
    // 选中的API
    selectedApiId: null,
    selectedApi: null,
    // API详情相关
    activeTab: 'info',
    records: [],
    secretKeys: [],
    history: [],
    recordsLoading: false,
    secretKeysLoading: false,
    historyLoading: false,
    recordsPagination: { current: 1, pageSize: 10, total: 0 },
    secretKeysPagination: { current: 1, pageSize: 10, total: 0 },
    historyPagination: { current: 1, pageSize: 10, total: 0 },
    recordsSearchParams: {},
    editModalVisible: false,
    secretKeyModalVisible: false,
    jsonViewerModalVisible: false,
    jsonViewerContent: '',
    jsonViewerTitle: '',
    callTemplate: { url: '', header: '', body: '' },
    testResult: '',
    caseList: [],
    selectedCaseId: '',
    caseListLoading: false,
    templateLoading: false,
    exportCurlLoading: false,
    apiDoc: null,
    docLoading: false,
  });

  const [apiSearchForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [secretKeyForm] = Form.useForm();
  const [recordsSearchForm] = Form.useForm();
  const [testForm] = Form.useForm();
  const publishService = PublishService.getInstance();
  const caseService = CaseService.getInstance();

  // JSON格式化工具函数
  const formatJsonResponse = (response: string): string => {
    try {
      const parsed = JSON.parse(response);
      return JSON.stringify(parsed, null, 2);
    } catch (error) {
      return response;
    }
  };

  // 获取 API 列表
  const fetchApiList = async () => {
    if (!workspaceId) return;
    
    setState(prev => ({ ...prev, apiLoading: true }));
    try {
      const params: ApiPublishListRequest = {
        current: 1,
        pageSize: 10,
        id: workspaceId,
        ...state.apiSearchParams,
      };
      
      const response = await publishService.getApiList(params);
      setState(prev => ({
        ...prev,
        apiList: response.list,
      }));
      
      // 默认选择第一个API
      if (response.list.length > 0 && !state.selectedApiId) {
        selectApi(response.list[0]);
      }
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
      }));
      
      // 默认选择第一个API
      if (mockApiList.length > 0 && !state.selectedApiId) {
        selectApi(mockApiList[0]);
      }
    } finally {
      setState(prev => ({ ...prev, apiLoading: false }));
    }
  };

  // 选择API
  const selectApi = (api: ApiPublishList) => {
    setState(prev => ({
      ...prev,
      selectedApiId: api.apiId,
      selectedApi: api,
      activeTab: 'info', // 重置到信息tab
      // 清理之前的详情数据
      records: [],
      secretKeys: [],
      history: [],
      testResult: '',
      selectedCaseId: '',
      callTemplate: { url: '', header: '', body: '' },
      apiDoc: null,
    }));
  };

  // 初始化数据
  useEffect(() => {
    fetchApiList();
  }, [state.apiSearchParams]);

  // API 搜索
  const handleApiSearch = (values: any) => {
    setState(prev => ({
      ...prev,
      apiSearchParams: values,
    }));
  };

  // 重置搜索
  const handleApiSearchReset = () => {
    apiSearchForm.resetFields();
    setState(prev => ({
      ...prev,
      apiSearchParams: {},
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
        selectedApi: prev.selectedApi?.apiId === apiId 
          ? { ...prev.selectedApi, status } 
          : prev.selectedApi,
      }));
      
      message.success(`API已${status === 'ON' ? '上线' : '下线'}`);
    } catch (error) {
      message.error(`API${status === 'ON' ? '上线' : '下线'}失败`);
    }
  };

  // 获取调用记录
  const fetchRecords = async (searchParams?: typeof state.recordsSearchParams, pagination?: typeof state.recordsPagination) => {
    if (!state.selectedApiId) return;
    
    const currentSearchParams = searchParams || state.recordsSearchParams;
    const currentPagination = pagination || state.recordsPagination;
    
    setState(prev => ({ ...prev, recordsLoading: true }));
    try {
      const params: ApiRecordsRequest = {
        current: currentPagination.current,
        pageSize: currentPagination.pageSize,
        apiId: state.selectedApiId,
        ...currentSearchParams,
      };
      
      const response = await publishService.getApiRecords(params);
      setState(prev => ({
        ...prev,
        records: response.list,
        recordsPagination: {
          current: response.current,
          pageSize: response.pageSize,
          total: response.total,
        },
      }));
    } catch (error) {
      message.error('获取调用记录失败，显示示例数据');
      // Mock 数据
      const mockRecords: ApiRecords[] = [
        {
          apiId: state.selectedApiId,
          apiName: state.selectedApi?.apiName || '',
          callTime: '2024-01-15T10:30:00Z',
          status: 'SUCCESS',
          traceId: 'trace_001',
          param: '{"userId": "12345"}',
          extend: '{"responseTime": "120ms"}',
        },
        {
          apiId: state.selectedApiId,
          apiName: state.selectedApi?.apiName || '',
          callTime: '2024-01-15T10:25:00Z',
          status: 'ERROR',
          traceId: 'trace_002',
          param: '{"userId": ""}',
          extend: '{"error": "userId is required", "message": "参数校验失败"}',
        },
      ];
      setState(prev => ({
        ...prev,
        records: mockRecords,
        recordsPagination: {
          current: 1,
          pageSize: 10,
          total: mockRecords.length,
        },
      }));
    } finally {
      setState(prev => ({ ...prev, recordsLoading: false }));
    }
  };

  // 获取密钥列表
  const fetchSecretKeys = async () => {
    if (!state.selectedApiId) return;
    
    setState(prev => ({ ...prev, secretKeysLoading: true }));
    try {
      const params: ApiSecretKeyListRequest = {
        apiId: state.selectedApiId,
        current: state.secretKeysPagination.current,
        pageSize: state.secretKeysPagination.pageSize,
      };
      
      const response = await publishService.getApiSecretKeyList(params);
      setState(prev => ({
        ...prev,
        secretKeys: response.list,
        secretKeysPagination: {
          current: response.current,
          pageSize: response.pageSize,
          total: response.total,
        },
      }));
    } catch (error) {
      message.error('获取密钥列表失败，显示示例数据');
      // Mock 数据
      const mockSecretKeys: ApiSecretKey[] = [
        {
          apiId: state.selectedApiId,
          name: '生产环境密钥',
          secretKey: 'sk_prod_abcd1234efgh5678',
          expirationTime: '2025-01-15T10:30:00Z',
          status: 'ON',
        },
        {
          apiId: state.selectedApiId,
          name: '测试环境密钥',
          secretKey: 'sk_test_ijkl9012mnop3456',
          expirationTime: '2024-06-15T10:30:00Z',
          status: 'OFF',
        },
      ];
      setState(prev => ({
        ...prev,
        secretKeys: mockSecretKeys,
        secretKeysPagination: {
          current: 1,
          pageSize: 10,
          total: mockSecretKeys.length,
        },
      }));
    } finally {
      setState(prev => ({ ...prev, secretKeysLoading: false }));
    }
  };

  // 获取历史版本
  const fetchHistory = async () => {
    if (!workspaceId) return;
    
    setState(prev => ({ ...prev, historyLoading: true }));
    try {
      const params: ApiHistoryRequest = {
        workspaceId,
        current: state.historyPagination.current,
        pageSize: state.historyPagination.pageSize,
      };
      
      const response = await publishService.getApiHistory(params);
      setState(prev => ({
        ...prev,
        history: response.list,
        historyPagination: {
          current: response.current,
          pageSize: response.pageSize,
          total: response.total,
        },
      }));
    } catch (error) {
      message.error('获取历史版本失败，显示示例数据');
      // Mock 数据
      const mockHistory: ApiHistory[] = [
        {
          id: 1,
          workspaceId: workspaceId,
          name: 'v1.2.0',
          createTime: '2024-01-15T10:30:00Z',
        },
        {
          id: 2,
          workspaceId: workspaceId,
          name: 'v1.1.0',
          createTime: '2024-01-10T08:20:00Z',
        },
      ];
      setState(prev => ({
        ...prev,
        history: mockHistory,
        historyPagination: {
          current: 1,
          pageSize: 10,
          total: mockHistory.length,
        },
      }));
    } finally {
      setState(prev => ({ ...prev, historyLoading: false }));
    }
  };

  // 获取用例列表
  const fetchCaseList = async () => {
    if (!workspaceId) return;
    
    setState(prev => ({ ...prev, caseListLoading: true }));
    try {
      const params: CaseListRequest = { workspaceId };
      const response = await caseService.listCases(params);
      setState(prev => ({ ...prev, caseList: response.caseList }));
    } catch (error) {
      message.error('获取用例列表失败，显示示例数据');
      // Mock 数据
      const mockCases: Case[] = [
        {
          workspaceId: workspaceId,
          caseId: 'case_001',
          caseName: '用户查询测试用例',
          caseParams: '{"userId": "12345"}',
          createAt: '2024-01-15T10:30:00Z',
          updateAt: '2024-01-15T10:30:00Z',
          createBy: 'admin',
          updateBy: 'admin',
        },
        {
          workspaceId: workspaceId,
          caseId: 'case_002',
          caseName: '用户批量查询用例',
          caseParams: '{"userIds": ["12345", "67890"]}',
          createAt: '2024-01-15T11:00:00Z',
          updateAt: '2024-01-15T11:00:00Z',
          createBy: 'admin',
          updateBy: 'admin',
        },
      ];
      setState(prev => ({ ...prev, caseList: mockCases }));
    } finally {
      setState(prev => ({ ...prev, caseListLoading: false }));
    }
  };

  // 获取调用模板
  const fetchCallTemplate = async (caseId?: string) => {
    if (!state.selectedApiId) return;
    
    const targetCaseId = caseId || state.selectedCaseId;
    if (!targetCaseId) {
      message.warning('请先选择用例');
      return;
    }
    
    setState(prev => ({ ...prev, templateLoading: true }));
    try {
      const params: ApiCallTemplateRequest = { apiId: state.selectedApiId, caseId: targetCaseId };
      const response = await publishService.getApiCallTemplate(params);
      setState(prev => ({
        ...prev,
        callTemplate: {
          url: response.url,
          header: response.header,
          body: response.body,
        },
      }));
      testForm.setFieldsValue({
        url: response.url,
        header: response.header,
        body: response.body,
      });
      message.success('模板加载成功');
    } catch (error) {
      message.error('获取调用模板失败');
      // Mock 数据
      const mockTemplate = {
        url: 'https://api.example.com/users/{userId}',
        header: '{"Content-Type": "application/json", "Authorization": "Bearer your_token"}',
        body: '{"userId": "12345"}',
      };
      setState(prev => ({ ...prev, callTemplate: mockTemplate }));
      testForm.setFieldsValue(mockTemplate);
    } finally {
      setState(prev => ({ ...prev, templateLoading: false }));
    }
  };

  // 获取API文档
  const fetchApiDoc = async () => {
    if (!state.selectedApiId) return;
    
    setState(prev => ({ ...prev, docLoading: true }));
    try {
      const params: ApiGetApiDocRequest = { apiId: state.selectedApiId };
      const response = await publishService.getApiDoc(params);
      setState(prev => ({ ...prev, apiDoc: response }));
    } catch (error) {
      message.error('获取API文档失败，显示示例文档');
      // Mock 数据
      const mockDoc: ApiGetApiDocResponse = {
        apiName: state.selectedApi?.apiName || '',
        apiDoc: `# ${state.selectedApi?.apiName || 'API文档'}

## 接口描述
${state.selectedApi?.apiDesc || '暂无描述'}

## 请求参数
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| userId | string | 是 | 用户唯一标识符 |

## 响应参数
| 参数名 | 类型 | 描述 |
|--------|------|------|
| code | number | 响应状态码 |
| message | string | 响应消息 |
| data | object | 用户信息对象 |

## 示例

### 请求示例
\`\`\`json
{
  "userId": "12345"
}
\`\`\`

### 响应示例
\`\`\`json
{
  "code": 200,
  "message": "success",
  "data": {
    "userId": "12345",
    "userName": "张三",
    "email": "zhangsan@example.com"
  }
}
\`\`\`
`,
      };
      setState(prev => ({ ...prev, apiDoc: mockDoc }));
    } finally {
      setState(prev => ({ ...prev, docLoading: false }));
    }
  };

  // 编辑API
  const handleEditApi = async (values: any) => {
    if (!state.selectedApiId) return;
    
    try {
      const params: ApiEditRequest = {
        apiId: state.selectedApiId,
        apiName: values.apiName,
        apiDesc: values.apiDesc,
        tag: values.tag || [],
      };
      await publishService.editApi(params);
      setState(prev => ({
        ...prev,
        selectedApi: prev.selectedApi ? { ...prev.selectedApi, ...params } : null,
        apiList: prev.apiList.map(api => 
          api.apiId === state.selectedApiId ? { ...api, ...params } : api
        ),
        editModalVisible: false,
      }));
      message.success('API信息更新成功');
    } catch (error) {
      message.error('API信息更新失败');
    }
  };

  // 创建密钥
  const handleCreateSecretKey = async (values: any) => {
    if (!state.selectedApiId) return;
    
    try {
      const params = {
        apiId: state.selectedApiId,
        name: values.name,
        expirationTime: values.expirationTime.valueOf(),
      };
      await publishService.createApiSecretKey(params);
      message.success('密钥创建成功');
      setState(prev => ({ ...prev, secretKeyModalVisible: false }));
      fetchSecretKeys();
    } catch (error) {
      message.error('密钥创建失败');
    }
  };

  // 删除密钥
  const handleDeleteSecretKey = async (secretKey: string) => {
    try {
      await publishService.deleteApiSecretKey({ secretKey });
      message.success('密钥删除成功');
      fetchSecretKeys();
    } catch (error) {
      message.error('密钥删除失败');
    }
  };

  // 测试API调用
  const handleTestApi = async (values: any) => {
    if (!state.selectedApiId) return;
    
    try {
      const params: ApiCallRequest = {
        apiId: state.selectedApiId,
        url: values.url,
        header: values.header,
        body: values.body,
      };
      const response = await publishService.callApi(params);
      const formattedResponse = formatJsonResponse(response.response);
      setState(prev => ({ ...prev, testResult: formattedResponse }));
      message.success('API调用成功');
    } catch (error) {
      message.error('API调用失败，显示模拟响应');
      const mockResponse = {
        code: 200,
        message: "success",
        data: {
          userId: "12345",
          userName: "张三",
          email: "zhangsan@example.com",
          profile: {
            age: 25,
            department: "技术部",
            position: "前端工程师"
          },
          permissions: ["read", "write", "admin"],
          lastLoginTime: "2024-01-15T10:30:00Z"
        },
        timestamp: new Date().toISOString()
      };
      const formattedMockResponse = formatJsonResponse(JSON.stringify(mockResponse));
      setState(prev => ({ ...prev, testResult: formattedMockResponse }));
    }
  };

  // 导出API curl命令
  const handleExportCurl = async () => {
    if (!state.selectedApiId) return;
    
    try {
      const formValues = testForm.getFieldsValue();
      if (!formValues.url) {
        message.warning('请先填写请求URL');
        return;
      }
      
      setState(prev => ({ ...prev, exportCurlLoading: true }));
      
      const params: ApiExportCurlRequest = {
        apiId: state.selectedApiId,
        url: formValues.url || '',
        header: formValues.header || '',
        body: formValues.body || '',
      };
      
      const response = await publishService.exportApiCurl(params);
      await navigator.clipboard.writeText(response.curl);
      message.success('curl命令已复制到剪贴板');
      
    } catch (error) {
      console.error('导出curl失败:', error);
      message.error('导出curl失败');
    } finally {
      setState(prev => ({ ...prev, exportCurlLoading: false }));
    }
  };

  // 显示JSON内容
  const showJsonViewer = (content: string, title: string) => {
    const formattedContent = formatJsonResponse(content);
    setState(prev => ({
      ...prev,
      jsonViewerModalVisible: true,
      jsonViewerContent: formattedContent,
      jsonViewerTitle: title,
    }));
  };

  // 复制JSON内容
  const copyJsonContent = async () => {
    try {
      await navigator.clipboard.writeText(state.jsonViewerContent);
      message.success('内容已复制到剪贴板');
    } catch (error) {
      message.error('复制失败');
    }
  };

  // 处理调用记录搜索
  const handleRecordsSearch = (values: any) => {
    const newSearchParams = {
      startTime: values.timeRange?.[0]?.valueOf(),
      endTime: values.timeRange?.[1]?.valueOf(),
      request: values.request,
      response: values.response,
    };
    const newPagination = { ...state.recordsPagination, current: 1 };
    
    setState(prev => ({
      ...prev,
      recordsSearchParams: newSearchParams,
      recordsPagination: newPagination,
    }));
    
    fetchRecords(newSearchParams, newPagination);
  };

  // 重置调用记录搜索
  const handleRecordsSearchReset = () => {
    recordsSearchForm.resetFields();
    const newSearchParams = {};
    const newPagination = { ...state.recordsPagination, current: 1 };
    
    setState(prev => ({
      ...prev,
      recordsSearchParams: newSearchParams,
      recordsPagination: newPagination,
    }));
    
    fetchRecords(newSearchParams, newPagination);
  };

  // 处理用例选择变更
  const handleCaseSelect = (caseId: string) => {
    setState(prev => ({ ...prev, selectedCaseId: caseId }));
    fetchCallTemplate(caseId);
  };

  // 下载API文档
  const handleDownloadDoc = () => {
    if (!state.apiDoc) {
      message.warning('暂无文档内容');
      return;
    }

    const blob = new Blob([state.apiDoc.apiDoc], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${state.apiDoc.apiName}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    message.success('文档下载成功');
  };

  // 添加一个ref来跟踪上一个tab
  const prevTabRef = useRef(state.activeTab);

  // Tab切换时加载对应数据
  useEffect(() => {
    if (!state.selectedApiId) return;
    
    const prevTab = prevTabRef.current;
    const currentTab = state.activeTab;
    
    // 如果从test tab切换到其他tab，清理测试相关数据
    if (prevTab === 'test' && currentTab !== 'test') {
      setState(prev => ({
        ...prev,
        selectedCaseId: '',
        callTemplate: { url: '', header: '', body: '' },
        testResult: '',
        templateLoading: false,
      }));
      testForm.resetFields();
    }

    prevTabRef.current = currentTab;

    switch (currentTab) {
      case 'records':
        fetchRecords();
        break;
      case 'keys':
        fetchSecretKeys();
        break;
      case 'history':
        fetchHistory();
        break;
      case 'test':
        if (state.caseList.length === 0) {
          fetchCaseList();
        }
        break;
      case 'doc':
        fetchApiDoc();
        break;
    }
  }, [state.activeTab, state.selectedApiId]);

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
      width: 100,
      render: (_, record) => (
        <Button 
          size="small"
          onClick={() => handleApiOnOff(record.apiId, record.status === 'ON' ? 'OFF' : 'ON')}
        >
          {record.status === 'ON' ? '下线' : '上线'}
        </Button>
      ),
    },
  ];

  // 调用记录表格列
  const recordsColumns: ColumnsType<ApiRecords> = [
    {
      title: '调用时间',
      dataIndex: 'callTime',
      key: 'callTime',
      width: 180,
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'success' ? 'green' : 'red'}>
          {status === 'success' ? '成功' : '失败'}
        </Tag>
      ),
    },
    {
      title: 'TraceID',
      dataIndex: 'traceId',
      key: 'traceId',
      width: 150,
      render: (traceId: string) => (
        <Text copyable={{ text: traceId }} style={{ fontSize: '12px' }}>
          {traceId}
        </Text>
      ),
    },
    {
      title: '请求参数',
      dataIndex: 'param',
      key: 'param',
      width: 200,
      render: (param: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Text ellipsis style={{ fontSize: '12px', flex: 1, maxWidth: '120px' }}>
            {param}
          </Text>
          <Button
            size="small"
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showJsonViewer(param, '请求参数')}
            style={{ padding: '0 4px' }}
            title="查看详情"
          />
        </div>
      ),
    },
    {
      title: '扩展信息',
      dataIndex: 'extend',
      key: 'extend',
      width: 200,
      render: (extend: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Text ellipsis style={{ fontSize: '12px', flex: 1, maxWidth: '120px' }}>
            {extend}
          </Text>
          <Button
            size="small"
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showJsonViewer(extend, '扩展信息')}
            style={{ padding: '0 4px' }}
            title="查看详情"
          />
        </div>
      ),
    },
  ];

  // 密钥表格列
  const secretKeysColumns: ColumnsType<ApiSecretKey> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '密钥',
      dataIndex: 'secretKey',
      key: 'secretKey',
      width: 200,
      render: (secretKey: string) => (
        <Text copyable={{ text: secretKey }}>
          {secretKey.substring(0, 20)}...
        </Text>
      ),
    },
    {
      title: '到期时间',
      dataIndex: 'expirationTime',
      key: 'expirationTime',
      width: 180,
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'ON' ? 'green' : 'red'}>
          {status === 'ON' ? '启用' : '禁用'}
        </Tag>
      ),
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
          <Popconfirm
            title="确定要删除这个密钥吗？"
            onConfirm={() => handleDeleteSecretKey(record.secretKey)}
          >
            <Button size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 历史版本表格列
  const historyColumns: ColumnsType<ApiHistory> = [
    {
      title: '版本',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: () => (
        <Space size="small">
          <Button size="small" type="primary">
            查看
          </Button>
          <Button size="small">
            回滚
          </Button>
        </Space>
      ),
    },
  ];

  // 详情Tab项
  const getDetailTabItems = () => [
    {
      key: 'info',
      label: (
        <span>
          <ApiOutlined />
          API信息
        </span>
      ),
      children: (
        <Card>
          {state.selectedApi && (
            <>
              <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={3}>{state.selectedApi.apiName}</Title>
                <Space>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => {
                      editForm.setFieldsValue(state.selectedApi);
                      setState(prev => ({ ...prev, editModalVisible: true }));
                    }}
                  >
                    编辑
                  </Button>
                  <Button
                    type={state.selectedApi.status === 'ON' ? 'default' : 'primary'}
                    onClick={() => handleApiOnOff(state.selectedApi?.apiId!, state.selectedApi?.status === 'ON' ? 'OFF' : 'ON')}
                  >
                    {state.selectedApi.status === 'ON' ? '下线' : '上线'}
                  </Button>
                </Space>
              </div>
              
              <Descriptions bordered column={2}>
                <Descriptions.Item label="API ID">
                  <Text copyable>{state.selectedApi.apiId}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Tag color={state.selectedApi.status === 'ON' ? 'green' : 'red'}>
                    {state.selectedApi.status === 'ON' ? '在线' : '离线'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="描述" span={2}>
                  {state.selectedApi.apiDesc}
                </Descriptions.Item>
                <Descriptions.Item label="标签" span={2}>
                  {state.selectedApi.tag.map((tag, index) => (
                    <Tag key={index} color="blue">{tag}</Tag>
                  ))}
                </Descriptions.Item>
                <Descriptions.Item label="发布时间" span={2}>
                  {dayjs(state.selectedApi.publishTime).format('YYYY-MM-DD HH:mm:ss')}
                </Descriptions.Item>
              </Descriptions>
            </>
          )}
        </Card>
      ),
    },
    {
      key: 'records',
      label: (
        <span>
          <FileTextOutlined />
          调用记录
        </span>
      ),
      children: (
        <div>
          <Card style={{ marginBottom: '16px' }}>
            <Form
              form={recordsSearchForm}
              layout="inline"
              onFinish={handleRecordsSearch}
            >
              <Form.Item name="timeRange" label="时间范围">
                <RangePicker showTime />
              </Form.Item>
              <Form.Item name="request" label="请求参数">
                <Input placeholder="搜索请求参数" />
              </Form.Item>
              <Form.Item name="response" label="响应参数">
                <Input placeholder="搜索响应参数" />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                    搜索
                  </Button>
                  <Button onClick={handleRecordsSearchReset}>
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
          
          <Card>
            <Table
              columns={recordsColumns}
              dataSource={state.records}
              rowKey="traceId"
              loading={state.recordsLoading}
              pagination={{
                current: state.recordsPagination.current,
                pageSize: state.recordsPagination.pageSize,
                total: state.recordsPagination.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
                onChange: (page, size) => {
                  const newPagination = {
                    ...state.recordsPagination,
                    current: page,
                    pageSize: size || 10,
                  };
                  
                  setState(prev => ({
                    ...prev,
                    recordsPagination: newPagination,
                  }));
                  
                  fetchRecords(state.recordsSearchParams, newPagination);
                },
              }}
            />
          </Card>
        </div>
      ),
    },
    {
      key: 'keys',
      label: (
        <span>
          <KeyOutlined />
          密钥管理
        </span>
      ),
      children: (
        <div>
          <Card style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={4}>API密钥</Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setState(prev => ({ ...prev, secretKeyModalVisible: true }))}
              >
                创建密钥
              </Button>
            </div>
          </Card>
          
          <Card>
            <Table
              columns={secretKeysColumns}
              dataSource={state.secretKeys}
              rowKey="secretKey"
              loading={state.secretKeysLoading}
              pagination={{
                current: state.secretKeysPagination.current,
                pageSize: state.secretKeysPagination.pageSize,
                total: state.secretKeysPagination.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
                onChange: (page, size) => {
                  setState(prev => ({
                    ...prev,
                    secretKeysPagination: {
                      ...prev.secretKeysPagination,
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
      key: 'test',
      label: (
        <span>
          <PlayCircleOutlined />
          调用测试
        </span>
      ),
      children: (
        <div style={{ height: 'calc(100vh - 400px)', minHeight: '600px' }}>
          <Row gutter={16} style={{ height: '100%' }}>
            <Col span={12} style={{ height: '100%' }}>
              <Card 
                title="请求参数" 
                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                bodyStyle={{ flex: 1, overflow: 'auto', padding: '16px' }}
              >
                <Form
                  form={testForm}
                  layout="vertical"
                  onFinish={handleTestApi}
                  style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <Form.Item
                    label="选择用例"
                    required
                    style={{ marginBottom: '16px' }}
                  >
                    <Select
                      placeholder="请选择用例"
                      value={state.selectedCaseId}
                      onChange={handleCaseSelect}
                      loading={state.caseListLoading}
                      disabled={state.templateLoading}
                      style={{ width: '100%' }}
                    >
                      {state.caseList.map(caseItem => (
                        <Option key={caseItem.caseId} value={caseItem.caseId}>
                          {caseItem.caseName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  {state.templateLoading && (
                    <div style={{ textAlign: 'center', margin: '8px 0', color: '#1890ff' }}>
                      <span>正在加载模板...</span>
                    </div>
                  )}
                  <Form.Item
                    name="url"
                    label="请求URL"
                    rules={[{ required: true, message: '请输入请求URL' }]}
                    style={{ marginBottom: '16px' }}
                  >
                    <Input placeholder="请输入请求URL" />
                  </Form.Item>
                  <Form.Item
                    name="header"
                    label="请求头"
                    style={{ marginBottom: '16px' }}
                  >
                    <TextArea rows={5} placeholder="请输入请求头（JSON格式）" />
                  </Form.Item>
                  <Form.Item
                    name="body"
                    label="请求体"
                    style={{ flex: 1, marginBottom: '16px' }}
                  >
                    <TextArea 
                      placeholder="请输入请求体（JSON格式）" 
                      style={{ height: '100%', minHeight: '120px' }}
                    />
                  </Form.Item>
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Space size="middle" style={{ width: '100%' }}>
                      <Button 
                        type="primary" 
                        htmlType="submit" 
                        icon={<PlayCircleOutlined />} 
                        style={{ flex: 1 }}
                      >
                        发送请求
                      </Button>
                      <Button 
                        icon={<DownloadOutlined />} 
                        onClick={handleExportCurl}
                        loading={state.exportCurlLoading}
                        style={{ flex: 1 }}
                      >
                        导出 curl
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            
            <Col span={12} style={{ height: '100%' }}>
              <Card 
                title="响应结果" 
                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                bodyStyle={{ flex: 1, overflow: 'hidden', padding: '16px' }}
              >
                {state.testResult ? (
                  <TextArea
                    value={state.testResult}
                    readOnly
                    style={{ 
                      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace', 
                      fontSize: '12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      resize: 'none',
                      background: '#fafafa',
                      height: '100%',
                      padding: '12px',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      lineHeight: '1.5'
                    }}
                  />
                ) : (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '100%',
                    color: '#999',
                    fontSize: '14px',
                    background: '#fafafa',
                    border: '1px dashed #d9d9d9',
                    borderRadius: '6px'
                  }}>
                    请先发送请求以查看响应结果
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: 'history',
      label: (
        <span>
          <HistoryOutlined />
          历史版本
        </span>
      ),
      children: (
        <Card>
          <Table
            columns={historyColumns}
            dataSource={state.history}
            rowKey="id"
            loading={state.historyLoading}
            pagination={{
              current: state.historyPagination.current,
              pageSize: state.historyPagination.pageSize,
              total: state.historyPagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              onChange: (page, size) => {
                setState(prev => ({
                  ...prev,
                  historyPagination: {
                    ...prev.historyPagination,
                    current: page,
                    pageSize: size || 10,
                  },
                }));
              },
            }}
          />
        </Card>
      ),
    },
    {
      key: 'doc',
      label: (
        <span>
          <FileTextOutlined />
          接口文档
        </span>
      ),
      children: (
        <Card 
          title="API文档"
          loading={state.docLoading}
          extra={
            state.apiDoc && (
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleDownloadDoc}
              >
                下载文档
              </Button>
            )
          }
        >
          {state.apiDoc ? (
            <div style={{ 
              background: '#fafafa', 
              padding: '16px', 
              borderRadius: '6px',
              minHeight: '400px',
              maxHeight: '70vh',
              overflow: 'auto'
            }}>
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  table: ({ children }) => (
                    <table style={{ 
                      width: '100%', 
                      borderCollapse: 'collapse', 
                      margin: '16px 0',
                      border: '1px solid #d9d9d9'
                    }}>
                      {children}
                    </table>
                  ),
                  th: ({ children }) => (
                    <th style={{ 
                      padding: '8px 12px', 
                      textAlign: 'left', 
                      borderBottom: '2px solid #d9d9d9',
                      background: '#f5f5f5',
                      fontWeight: 'bold'
                    }}>
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td style={{ 
                      padding: '8px 12px', 
                      borderBottom: '1px solid #d9d9d9'
                    }}>
                      {children}
                    </td>
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className;
                    if (isInline) {
                      return (
                        <code style={{
                          background: '#f6f8fa',
                          padding: '2px 4px',
                          borderRadius: '3px',
                          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                          fontSize: '0.85em'
                        }}>
                          {children}
                        </code>
                      );
                    }
                    return (
                      <code style={{
                        display: 'block',
                        background: '#f6f8fa',
                        padding: '12px',
                        borderRadius: '6px',
                        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                        fontSize: '0.85em',
                        lineHeight: '1.5',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        border: '1px solid #e1e4e8'
                      }}>
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children }) => (
                    <pre style={{ margin: '16px 0' }}>
                      {children}
                    </pre>
                  ),
                  h1: ({ children }) => (
                    <h1 style={{ 
                      borderBottom: '2px solid #e1e4e8', 
                      paddingBottom: '8px',
                      marginTop: '24px',
                      marginBottom: '16px'
                    }}>
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 style={{ 
                      borderBottom: '1px solid #e1e4e8', 
                      paddingBottom: '6px',
                      marginTop: '20px',
                      marginBottom: '12px'
                    }}>
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 style={{ 
                      marginTop: '16px',
                      marginBottom: '8px'
                    }}>
                      {children}
                    </h3>
                  )
                }}
              >
                {state.apiDoc.apiDoc}
              </ReactMarkdown>
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              color: '#999'
            }}>
              {state.docLoading ? '正在加载文档...' : '暂无文档内容'}
            </div>
          )}
        </Card>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* API 表格 */}
      <Card style={{ marginBottom: state.selectedApi ? '24px' : '0' }}>
        <Table
          columns={apiColumns}
          dataSource={state.apiList}
          rowKey="apiId"
          loading={state.apiLoading}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: state.selectedApiId ? [state.selectedApiId] : [],
            onSelect: (record) => {
              selectApi(record);
            },
          }}
          onRow={(record) => ({
            onClick: () => {
              selectApi(record);
            },
            style: {
              cursor: 'pointer',
              backgroundColor: state.selectedApiId === record.apiId ? '#e6f7ff' : undefined,
            },
          })}
          pagination={false}
        />
      </Card>

      {/* API 详情区域 */}
      {state.selectedApi && (
        <Card >
          <Tabs
            activeKey={state.activeTab}
            onChange={(key) => setState(prev => ({ ...prev, activeTab: key }))}
            items={getDetailTabItems()}
          />
        </Card>
      )}

      {/* 编辑API模态框 */}
      <Modal
        title="编辑API"
        open={state.editModalVisible}
        onCancel={() => setState(prev => ({ ...prev, editModalVisible: false }))}
        footer={null}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditApi}
        >
          <Form.Item
            name="apiName"
            label="API名称"
            rules={[{ required: true, message: '请输入API名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="apiDesc" label="描述">
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name="tag" label="标签">
            <Select mode="tags" placeholder="请选择或输入标签" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button onClick={() => setState(prev => ({ ...prev, editModalVisible: false }))}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 创建密钥模态框 */}
      <Modal
        title="创建API密钥"
        open={state.secretKeyModalVisible}
        onCancel={() => setState(prev => ({ ...prev, secretKeyModalVisible: false }))}
        footer={null}
      >
        <Form
          form={secretKeyForm}
          layout="vertical"
          onFinish={handleCreateSecretKey}
        >
          <Form.Item
            name="name"
            label="密钥名称"
            rules={[{ required: true, message: '请输入密钥名称' }]}
          >
            <Input placeholder="请输入密钥名称" />
          </Form.Item>
          <Form.Item
            name="expirationTime"
            label="到期时间"
            rules={[{ required: true, message: '请选择到期时间' }]}
          >
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                创建
              </Button>
              <Button onClick={() => setState(prev => ({ ...prev, secretKeyModalVisible: false }))}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 显示JSON内容模态框 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{state.jsonViewerTitle}</span>
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={copyJsonContent}
              size="small"
              title="复制内容"
            />
          </div>
        }
        open={state.jsonViewerModalVisible}
        onCancel={() => setState(prev => ({ ...prev, jsonViewerModalVisible: false }))}
        footer={[
          <Button key="close" onClick={() => setState(prev => ({ ...prev, jsonViewerModalVisible: false }))}>
            关闭
          </Button>,
          <Button key="copy" type="primary" icon={<CopyOutlined />} onClick={copyJsonContent}>
            复制
          </Button>,
        ]}
        width={600}
      >
        <TextArea
          value={state.jsonViewerContent}
          readOnly
          style={{ 
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace', 
            fontSize: '12px',
            border: '1px solid #d9d9d9',
            borderRadius: '6px',
            resize: 'none',
            background: '#fafafa',
            height: '400px',
            padding: '12px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            lineHeight: '1.5'
          }}
        />
      </Modal>
    </div>
  );
};

export default ApiManagementPage; 