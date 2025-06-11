import { Button, Form, Input, Modal, Tag, Toast, Typography } from '@douyinfe/semi-ui';
import React, { useState } from 'react';
import { ApiPublishRequest, CanvasService } from '../../services/canvas';

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
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  // 添加标签
  const handleAddTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      setTags([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  // 删除标签
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // 处理发布
  const handlePublish = async (values: any) => {
    if (!canvasId) {
      Toast.error('画布ID为空，无法发布');
      return;
    }

    setLoading(true);
    try {
      const canvasService = CanvasService.getInstance();
      const publishRequest: ApiPublishRequest = {
        id: canvasId,
        apiName: values.apiName,
        apiDesc: values.apiDesc || '',
        tag: tags
      };

      const response = await canvasService.publishApi(publishRequest);
      
      Toast.success({
        content: `发布成功！API ID: ${response.apiId}`,
        duration: 3,
      });

      // 重置表单状态
      setTags([]);
      setInputValue('');
      onClose();
    } catch (error) {
      console.error('发布失败:', error);
      Toast.error({
        content: '发布失败，请重试',
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setTags([]);
      setInputValue('');
      onClose();
    }
  };

  return (
    <Modal
      title="发布画布"
      visible={visible}
      onCancel={handleClose}
      width={600}
      height={540}
      footer={null}
      style={{ top: '50%', transform: 'translateY(-50%)' }}
    >
      <div>
        
        <Form
          onSubmit={handlePublish}
          style={{ padding: '24px', height: 'calc(100% - 48px)', display: 'flex', flexDirection: 'column' }}
        >
          {({ formState, formApi, values }: any) => (
            <>
              <div style={{ flex: 1, overflow: 'auto' }}>
                <Form.Input
                  field="apiName"
                  label="API名称"
                  placeholder="请输入API名称"
                  rules={[
                    { required: true, message: '请输入API名称' },
                    { min: 2, message: 'API名称至少2个字符' }
                  ]}
                  style={{ marginBottom: '16px' }}
                />

                <Form.TextArea
                  field="apiDesc"
                  label="API描述"
                  placeholder="请输入API描述（可选）"
                  rows={3}
                  maxCount={200}
                  showClear
                  style={{ marginBottom: '16px' }}
                />

                <div style={{ marginBottom: '16px' }}>
                  <Text strong>标签</Text>
                  <div style={{ 
                    marginTop: '8px', 
                    marginBottom: '8px',
                    maxHeight: '120px',
                    overflow: 'auto',
                    border: tags.length > 4 ? '1px solid #e6e6e6' : 'none',
                    borderRadius: '4px',
                    padding: tags.length > 4 ? '8px' : '0'
                  }}>
                    {tags.map(tag => (
                      <Tag
                        key={tag}
                        closable
                        onClose={() => handleRemoveTag(tag)}
                        style={{ marginRight: '8px', marginBottom: '8px' }}
                      >
                        {tag}
                      </Tag>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Input
                      value={inputValue}
                      onChange={setInputValue}
                      placeholder="输入标签后按回车或点击添加"
                      onEnterPress={handleAddTag}
                      style={{ flex: 1 }}
                    />
                    <Button onClick={handleAddTag} disabled={!inputValue.trim()}>
                      添加
                    </Button>
                  </div>
                </div>
              </div>

              <div style={{ 
                paddingTop: '16px', 
                borderTop: '1px solid #f0f0f0',
                textAlign: 'right',
                flexShrink: 0
              }}>
                <Button 
                  onClick={handleClose} 
                  disabled={loading}
                  style={{ marginRight: '8px' }}
                >
                  取消
                </Button>
                <Button 
                  type="primary" 
                  loading={loading}
                  htmlType="submit"
                  disabled={!values?.apiName}
                >
                  发布
                </Button>
              </div>
            </>
          )}
        </Form>
      </div>
    </Modal>
  );
}; 