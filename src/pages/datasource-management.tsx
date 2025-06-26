import {
  DeleteOutlined,
  EditOutlined,
  LinkOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Col,
  Drawer,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import {
  DATASOURCE_TYPE_CONFIG,
  DatasourceInfo,
  DatasourceListRequest,
  datasourceService,
  DatasourceType
} from '../services/datasource';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// 数据源配置表单组件
const DatasourceConfigForm: React.FC<{
  type: DatasourceType;
  value?: any;
  onChange?: (value: any) => void;
  form?: any;
}> = ({ type, value, onChange, form: externalForm }) => {
  const [internalForm] = Form.useForm();
  const form = externalForm || internalForm;
  const config = DATASOURCE_TYPE_CONFIG[type];

  useEffect(() => {
    if (value) {
      try {
        const parsedValue = typeof value === 'string' ? JSON.parse(value) : value;
        // 处理标签字段，将数组转换为JSON字符串以便编辑
        if (parsedValue.tag && Array.isArray(parsedValue.tag)) {
          parsedValue.tag = JSON.stringify(parsedValue.tag);
        }
        form.setFieldsValue(parsedValue);
      } catch (e) {
        console.error('解析配置失败:', e);
      }
    }
  }, [value, form]);

  const handleValuesChange = (changedValues: any, allValues: any) => {
    // 处理标签字段的JSON格式转换
    if (changedValues.tag && typeof changedValues.tag === 'string') {
      try {
        allValues.tag = JSON.parse(changedValues.tag);
      } catch (e) {
        // 如果解析失败，保持原始字符串
      }
    }
    onChange?.(allValues);
  };

  if (!config) {
    return <Text type="secondary">不支持的数据源类型</Text>;
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onValuesChange={handleValuesChange}
      initialValues={value}
    >
      {config.configFields.map((field: any) => {
        const rules: any[] = field.required ? [{ required: true, message: `请输入${field.label}` }] : [];
        
        // 为标签字段添加JSON验证规则
        if (field.key === 'tag' && field.type === 'json') {
          rules.push({
            validator: (_: any, value: any) => {
              if (!value) return Promise.resolve();
              try {
                const parsed = JSON.parse(value);
                if (!Array.isArray(parsed)) {
                  return Promise.reject(new Error('标签必须是数组格式'));
                }
                return Promise.resolve();
              } catch (e) {
                return Promise.reject(new Error('请输入有效的JSON数组格式'));
              }
            },
          });
        }
        
        return (
          <Form.Item
            key={field.key}
            name={field.key}
            label={field.label}
            rules={rules}
          >
            {field.type === 'input' && <Input placeholder={`请输入${field.label}`} />}
            {field.type === 'password' && <Input.Password placeholder={`请输入${field.label}`} />}
            {field.type === 'number' && <Input type="number" placeholder={`请输入${field.label}`} />}
            {field.type === 'select' && (
              <Select placeholder={`请选择${field.label}`}>
                {field.options?.map((option: string) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            )}
            {field.type === 'json' && field.key === 'tag' && (
              <TextArea
                rows={2}
                placeholder={`请输入${field.label}，例如：["125K","function","doubao"]`}
              />
            )}
            {field.type === 'json' && field.key !== 'tag' && (
              <TextArea
                rows={4}
                placeholder={`请输入${field.label}（JSON格式）`}
              />
            )}
          </Form.Item>
        );
      })}
    </Form>
  );
};

const DatasourceManagement: React.FC = () => {
  // const { workspaceId } = useParams<{ workspaceId: string }>();
  
  // 状态管理
  const [loading, setLoading] = useState(false);
  const [datasources, setDatasources] = useState<DatasourceInfo[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // 筛选条件
  const [filters, setFilters] = useState({
    name: '',
    type: '',
    status: '',
    switch: -1,
  });
  
  // 弹窗状态
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDatasource, setEditingDatasource] = useState<DatasourceInfo | null>(null);
  const [testDrawerVisible, setTestDrawerVisible] = useState(false);
  const [testingDatasource, setTestingDatasource] = useState<DatasourceInfo | null>(null);
  
  // 表单
  const [form] = Form.useForm();
  const [configForm] = Form.useForm();

  // 获取数据源列表
  const fetchDatasources = async () => {
    setLoading(true);
    try {
      const params: DatasourceListRequest = {
        current,
        pageSize,
        name: filters.name || undefined,
        type: filters.type || undefined,
        status: filters.status || undefined,
        switch: filters.switch !== -1 ? filters.switch : undefined,
      };
      
      const response = await datasourceService.getDatasourceList(params);
      setDatasources(response.list);
      setTotal(response.total);
    } catch (error) {
      console.error('获取数据源列表失败:', error);
      message.error('获取数据源列表失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasources();
  }, [current, pageSize, filters]);

  // 新增数据源
  const handleAdd = () => {
    setEditingDatasource(null);
    form.resetFields();
    configForm.resetFields();
    setModalVisible(true);
  };

  // 编辑数据源
  const handleEdit = (record: DatasourceInfo) => {
    setEditingDatasource(record);
    form.setFieldsValue({
      name: record.name,
      type: record.type,
      switch: record.switch === 1, // 转换为布尔值：1为true，2为false
    });
    
    try {
      const config = JSON.parse(record.config);
      configForm.setFieldsValue(config);
    } catch (e) {
      console.error('解析配置失败:', e);
    }
    
    setModalVisible(true);
  };

  // 删除数据源
  const handleDelete = async (id: number) => {
    try {
      await datasourceService.deleteDatasource({ id });
      message.success('删除成功');
      fetchDatasources();
    } catch (error) {
      console.error('删除数据源失败:', error);
      message.error('删除失败，请重试');
    }
  };

  // 测试连接
  const handleTest = (record: DatasourceInfo) => {
    setTestingDatasource(record);
    
    // 设置配置表单的初始值
    try {
      const config = JSON.parse(record.config);
      // 处理标签字段，将数组转换为JSON字符串以便编辑
      if (config.tag && Array.isArray(config.tag)) {
        config.tag = JSON.stringify(config.tag);
      }
      configForm.setFieldsValue(config);
    } catch (e) {
      console.error('解析配置失败:', e);
      configForm.resetFields();
    }
    
    setTestDrawerVisible(true);
  };

  // 保存数据源
  const handleSave = async () => {
    try {
      const basicValues = await form.validateFields();
      const configValues = await configForm.validateFields();
      
      // 处理标签字段，确保为数组格式
      if (configValues.tag && typeof configValues.tag === 'string') {
        try {
          configValues.tag = JSON.parse(configValues.tag);
        } catch (e) {
          message.error('标签格式错误，请输入有效的JSON数组格式');
          return;
        }
      }
      
      const config = JSON.stringify(configValues);
      
      if (editingDatasource) {
        // 编辑
        await datasourceService.editDatasource({
          id: editingDatasource.id,
          name: basicValues.name,
          type: basicValues.type,
          config,
          switch: basicValues.switch ? 1 : 2,
        });
        message.success('编辑成功');
      } else {
        // 新增
        await datasourceService.addDatasource({
          name: basicValues.name,
          type: basicValues.type,
          config,
          switch: basicValues.switch ? 1 : 2,
        });
        message.success('添加成功');
      }
      
      setModalVisible(false);
      fetchDatasources();
    } catch (error) {
      console.error('保存数据源失败:', error);
      message.error('保存失败，请重试');
    }
  };

  // 测试数据源连接
  const handleTestConnection = async () => {
    if (!testingDatasource) return;
    
    try {
      const configValues = await configForm.validateFields();
      
      // 处理标签字段，确保为数组格式
      if (configValues.tag && typeof configValues.tag === 'string') {
        try {
          configValues.tag = JSON.parse(configValues.tag);
        } catch (e) {
          message.error('标签格式错误，请输入有效的JSON数组格式');
          return;
        }
      }
      
      const config = JSON.stringify(configValues);
      
      const response = await datasourceService.testDatasource({
        type: testingDatasource.type,
        config,
      });
      
      if (response.status === 'success') {
        message.success('连接测试成功');
      } else {
        message.error(`连接测试失败: ${response.message}`);
      }
    } catch (error) {
      console.error('测试连接失败:', error);
      message.error('测试连接失败，请重试');
    }
  };

  // 状态显示
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      connected: { color: 'green', text: '已连接' },
      closed: { color: 'red', text: '已关闭' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.closed;
    return <Badge color={config.color} text={config.text} />;
  };

  // 数据源类型显示
  const getTypeTag = (type: string) => {
    const config = DATASOURCE_TYPE_CONFIG[type as DatasourceType];
    return config ? (
      <Tag>
        <span style={{ marginRight: 4 }}>{config.icon}</span>
        {config.name}
      </Tag>
    ) : (
      <Tag>{type}</Tag>
    );
  };

  // 表格列定义
  const columns = [
    {
      title: '数据源名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => getTypeTag(type),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => getStatusBadge(status),
    },
    {
      title: '开关',
      dataIndex: 'switch',
      key: 'switch',
      width: 80,
      render: (switchValue: number) => (
        <Switch checked={switchValue === 1} disabled />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 160,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: DatasourceInfo) => (
        <Space size="small">
          <Tooltip title="测试连接">
            <Button
              type="text"
              icon={<LinkOutlined />}
              onClick={() => handleTest(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确定要删除这个数据源吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>数据源管理</Title>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              新建数据源
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchDatasources}
            >
              刷新
            </Button>
          </Space>
        </div>

        {/* 筛选条件 */}
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col span={6}>
            <Input
              placeholder="搜索数据源名称"
              prefix={<SearchOutlined />}
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="选择类型"
              value={filters.type || undefined}
              onChange={(value) => setFilters({ ...filters, type: value || '' })}
              allowClear
              style={{ width: '100%' }}
            >
              {Object.entries(DATASOURCE_TYPE_CONFIG).map(([key, config]) => (
                <Option key={key} value={key}>
                  <span style={{ marginRight: 4 }}>{config.icon}</span>
                  {config.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            <Select
              placeholder="选择状态"
              value={filters.status || undefined}
              onChange={(value) => setFilters({ ...filters, status: value || '' })}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="connected">已连接</Option>
              <Option value="closed">已关闭</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Select
              placeholder="选择开关状态"
              value={filters.switch === -1 ? undefined : filters.switch}
              onChange={(value) => setFilters({ ...filters, switch: value ?? -1 })}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value={1}>开启</Option>
              <Option value={2}>关闭</Option>
            </Select>
          </Col>
        </Row>

        {/* 数据源列表 */}
        <Table
          columns={columns}
          dataSource={datasources}
          rowKey="id"
          loading={loading}
          pagination={{
            current,
            pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            onChange: (page, size) => {
              setCurrent(page);
              setPageSize(size || 10);
            },
          }}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingDatasource ? '编辑数据源' : '新建数据源'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSave}
        width={800}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginBottom: '24px' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="数据源名称"
                name="name"
                rules={[{ required: true, message: '请输入数据源名称' }]}
              >
                <Input placeholder="请输入数据源名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="数据源类型"
                name="type"
                rules={[{ required: true, message: '请选择数据源类型' }]}
              >
                <Select placeholder="请选择数据源类型" disabled={!!editingDatasource}>
                  {Object.entries(DATASOURCE_TYPE_CONFIG).map(([key, config]) => (
                    <Option key={key} value={key}>
                      <span style={{ marginRight: 4 }}>{config.icon}</span>
                      {config.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="开启状态" name="switch" valuePropName="checked">
            <Switch />
          </Form.Item>
          
          <Title level={5}>连接配置</Title>
          <Form.Item dependencies={['type']} noStyle>
            {({ getFieldValue }) => {
              const type = getFieldValue('type');
              return type ? (
                <DatasourceConfigForm
                  type={type}
                  value={editingDatasource?.config}
                  form={configForm}
                />
              ) : (
                <Text type="secondary">请先选择数据源类型</Text>
              );
            }}
          </Form.Item>
        </Form>
      </Modal>

      {/* 测试连接抽屉 */}
      <Drawer
        title="测试数据源连接"
        open={testDrawerVisible}
        onClose={() => setTestDrawerVisible(false)}
        width={600}
        extra={
          <Button type="primary" onClick={handleTestConnection}>
            测试连接
          </Button>
        }
      >
        {testingDatasource && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <Text strong>数据源: </Text>
              <Text>{testingDatasource.name}</Text>
              <br />
              <Text strong>类型: </Text>
              {getTypeTag(testingDatasource.type)}
            </div>
            
            <Title level={5}>连接配置</Title>
            <DatasourceConfigForm
              type={testingDatasource.type as DatasourceType}
              value={testingDatasource.config}
              form={configForm}
            />
          </>
        )}
      </Drawer>
    </div>
  );
};

export default DatasourceManagement; 