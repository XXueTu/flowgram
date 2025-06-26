import { ApiOutlined, DatabaseOutlined, FileTextOutlined, ScheduleOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Col, message, Row, Space, Spin, Statistic, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { GetHomeStatisticsResponse, homeService } from '../services';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState<GetHomeStatisticsResponse | null>(null);

  // 获取首页统计数据
  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const response = await homeService.getHomeStatistics();
      setStatistics(response);
    } catch (error) {
      console.error('获取首页统计数据失败:', error);
      message.error('获取数据失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col flex={1}>
          <Card>
            <Statistic
              title="工作空间数量"
              value={statistics?.workspaceCount || 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col flex={1}>
          <Card>
            <Statistic
              title="数据源数量"
              value={statistics?.datasourceCount || 0}
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col flex={1}>
          <Card>
            <Statistic
              title="API数量"
              value={statistics?.apiCount || 0}
              prefix={<ApiOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col flex={1}>
          <Card>
            <Statistic
              title="任务数量"
              value={statistics?.jobCount || 0}
              prefix={<ScheduleOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col flex={1}>
          <Card>
            <Statistic
              title="用户数量"
              value={statistics?.userCount || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="最近消息" style={{ height: '300px' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%', maxHeight: '220px', overflowY: 'auto' }}>
              {statistics?.message && statistics.message.length > 0 ? (
                statistics.message.map((msg, index) => (
                  <div key={index} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                    {msg}
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>
                  暂无消息
                </div>
              )}
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="系统状态" style={{ height: '300px' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <span>CPU 使用率：</span>
                <span style={{ 
                  color: statistics?.systemInfo?.cpu && parseFloat(statistics.systemInfo.cpu.replace('%', '')) > 80 ? '#ff4d4f' : '#52c41a', 
                  fontWeight: 'bold' 
                }}>
                  {statistics?.systemInfo?.cpu || '0%'}
                </span>
              </div>
              <div>
                <span>内存使用率：</span>
                <span style={{ 
                  color: statistics?.systemInfo?.memory && parseFloat(statistics.systemInfo.memory.replace('%', '')) > 80 ? '#ff4d4f' : '#52c41a', 
                  fontWeight: 'bold' 
                }}>
                  {statistics?.systemInfo?.memory || '0%'}
                </span>
              </div>
              <div>
                <span>磁盘使用率：</span>
                <span style={{ 
                  color: statistics?.systemInfo?.disk && parseFloat(statistics.systemInfo.disk.replace('%', '')) > 80 ? '#ff4d4f' : '#52c41a', 
                  fontWeight: 'bold' 
                }}>
                  {statistics?.systemInfo?.disk || '0%'}
                </span>
              </div>
              <div>
                <span>系统状态：</span>
                <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
                  {statistics ? '运行正常' : '数据加载中...'}
                </span>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 