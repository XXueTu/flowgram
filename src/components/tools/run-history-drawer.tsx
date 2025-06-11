import { Button, Empty, List, Modal, Tag, Toast, Typography } from '@douyinfe/semi-ui';
import React, { useEffect, useState } from 'react';
import { CanvasService, RunHistoryRecord } from '../../services/canvas';
import { RunDetailModal } from './run-detail-modal';

const { Title, Text } = Typography;

interface RunHistoryDrawerProps {
  visible: boolean;
  onClose: () => void;
  canvasId?: string;
}

export const RunHistoryDrawer: React.FC<RunHistoryDrawerProps> = ({ 
  visible, 
  onClose, 
  canvasId 
}) => {
  const [runRecords, setRunRecords] = useState<RunHistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  // 加载运行历史数据
  const loadRunHistory = async () => {
    if (!canvasId) {
      Toast.warning('画布ID为空，无法加载运行记录');
      return;
    }

    setLoading(true);
    try {
      const canvasService = CanvasService.getInstance();
      const response = await canvasService.getRunHistory(canvasId);
      setRunRecords(response.records || []);
    } catch (error) {
      console.error('加载运行记录失败:', error);
      Toast.error('加载运行记录失败，请重试');
      setRunRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      loadRunHistory();
    }
  }, [visible, canvasId]);

  const getStatusTag = (status: string) => {
    const statusConfig: Record<string, { color: 'blue' | 'green' | 'red' | 'orange', text: string }> = {
      running: { color: 'blue', text: '运行中' },
      success: { color: 'green', text: '成功' },
      completed: { color: 'green', text: '完成' },
      failed: { color: 'red', text: '失败' },
      cancelled: { color: 'orange', text: '已取消' },
      error: { color: 'red', text: '错误' },
    };
    
    const config = statusConfig[status] || { color: 'blue' as const, text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const formatDuration = (milliseconds: number) => {
    if (milliseconds < 1000) {
      return `${milliseconds}ms`;
    }
    const seconds = Math.floor(milliseconds / 1000);
    if (seconds < 60) {
      return `${seconds}秒`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}分${remainingSeconds}秒`;
  };

  const formatDateTime = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  const handleViewDetail = (recordId: string) => {
    setSelectedRecordId(recordId);
    setDetailModalVisible(true);
  };

  const modalTitle = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
      <span>运行记录</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Text type="secondary">
          共 {runRecords.length} 条记录
        </Text>
        <Button onClick={loadRunHistory} loading={loading} style={{ marginRight: '8px' }}>
          刷新
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <Modal
        title={modalTitle}
        visible={visible}
        onCancel={onClose}
        width={800}
        height={600}
        footer={null}
        style={{ top: '50%', transform: 'translateY(-50%)' }}
        zIndex={1000}
      >
        <div style={{ 
          padding: '24px', 
          minHeight: '500px',
          height: '500px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ flex: 1, overflowY: 'auto', height: 0 }}>
            {runRecords.length === 0 && !loading ? (
              <Empty
                title="暂无运行记录"
                description="还没有运行过此画布"
                style={{ marginTop: '50px' }}
              />
            ) : (
              <List
                dataSource={runRecords}
                loading={loading}
                style={{ height: '100%', overflowY: 'auto' }}
                renderItem={(record) => (
                  <List.Item
                    style={{
                      border: '1px solid #e6e8eb',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      padding: '16px',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleViewDetail(record.id)}
                  >
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <Text strong>运行ID: {record.id}</Text>
                        {getStatusTag(record.status)}
                      </div>
                      
                      <div style={{ marginBottom: '8px' }}>
                        <Text type="secondary">开始时间: {formatDateTime(record.startTime)}</Text>
                      </div>
                      
                      <div style={{ marginBottom: '8px' }}>
                        <Text type="secondary">运行时长: {formatDuration(record.duration)}</Text>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            )}
          </div>
        </div>
      </Modal>

      {/* 运行详情模态框 */}
      <RunDetailModal
        visible={detailModalVisible}
        onClose={() => {
          setDetailModalVisible(false);
          setSelectedRecordId(null);
        }}
        recordId={selectedRecordId}
      />
    </>
  );
};