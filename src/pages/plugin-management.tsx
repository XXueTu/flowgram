import {
    Button,
    Card,
    Space,
    Table,
    Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React from 'react';

interface PluginData {
  key: string;
  pluginName: string;
  version: string;
  description: string;
  status: string;
}

const PluginManagementPage: React.FC = () => {
  // 插件 Mock 数据和列定义
  const pluginColumns: ColumnsType<PluginData> = [
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

  const mockPluginData: PluginData[] = [
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
    {
      key: '3',
      pluginName: '数据校验插件',
      version: '1.0.3',
      description: '提供多种数据校验规则',
      status: 'enabled',
    },
    {
      key: '4',
      pluginName: '文件处理插件',
      version: '2.0.1',
      description: '支持多种文件格式的读取和写入',
      status: 'enabled',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '16px', color: '#666' }}>
          插件管理功能开发中，敬请期待...
        </div>
        <Table
          columns={pluginColumns}
          dataSource={mockPluginData}
          rowKey="key"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
        />
      </Card>
    </div>
  );
};

export default PluginManagementPage; 