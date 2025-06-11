import { Modal, Typography } from '@douyinfe/semi-ui';
import React from 'react';

const { Title, Text } = Typography;

interface PublishDrawerProps {
  visible: boolean;
  onClose: () => void;
  canvasId?: string;
}

export const PublishDrawer: React.FC<PublishDrawerProps> = ({ 
  visible, 
  onClose, 
  canvasId 
}) => {
  return (
    <Modal
      title="发布画布"
      visible={visible}
      onCancel={onClose}
      width={800}
      height={600}
      footer={null}
      style={{ top: '50%', transform: 'translateY(-50%)' }}
    >
      <div style={{ 
        padding: '24px', 
        minHeight: '500px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <Title heading={4}>发布画布</Title>
          <Text type="secondary">
            画布ID: {canvasId || 'default'}
          </Text>
        </div>

        <div style={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#999'
        }}>
          <Text>发布功能内容待补充...</Text>
        </div>
      </div>
    </Modal>
  );
}; 