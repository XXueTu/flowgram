import { ArrowDownOutlined, ArrowUpOutlined, CloudOutlined, FileTextOutlined, ScheduleOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Col, Row, Space, Statistic, Typography } from 'antd';
import React from 'react';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
   
      
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="工作流总数"
              value={112}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#3f8600' }}
              suffix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="运行中任务"
              value={93}
              prefix={<ScheduleOutlined />}
              valueStyle={{ color: '#cf1322' }}
              suffix={<ArrowDownOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="资源池"
              value={28}
              prefix={<CloudOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="活跃用户"
              value={56}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="最近活动" style={{ height: '300px' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>📝 工作流 "数据处理流程" 已完成执行</div>
              <div>🚀 新增资源 "计算集群-01" 已上线</div>
              <div>⏰ 定时任务 "日报生成" 执行成功</div>
              <div>🔧 插件 "数据清洗插件" 已更新至 v2.1.0</div>
              <div>👤 用户 "张三" 创建了新的工作流</div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="系统状态" style={{ height: '300px' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <span>CPU 使用率：</span>
                <span style={{ color: '#52c41a', fontWeight: 'bold' }}>45%</span>
              </div>
              <div>
                <span>内存使用率：</span>
                <span style={{ color: '#faad14', fontWeight: 'bold' }}>72%</span>
              </div>
              <div>
                <span>磁盘使用率：</span>
                <span style={{ color: '#52c41a', fontWeight: 'bold' }}>38%</span>
              </div>
              <div>
                <span>网络状态：</span>
                <span style={{ color: '#52c41a', fontWeight: 'bold' }}>正常</span>
              </div>
              <div>
                <span>服务状态：</span>
                <span style={{ color: '#52c41a', fontWeight: 'bold' }}>所有服务运行正常</span>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 