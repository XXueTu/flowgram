import { MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Form, Input, message, Modal } from 'antd';
import React from 'react';
import { useUserStore } from '../stores/user-store';

const UserProfile: React.FC = () => {
  const { user, updateUserInfo, loading } = useUserStore();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const handleUpdate = async (values: {
    phone?: string;
    email?: string;
    password?: string;
  }) => {
    try {
      if (!user) return;
      await updateUserInfo({
        userId: user.id,
        ...values,
      });
      message.success('更新成功');
      setIsModalVisible(false);
    } catch (error) {
      message.error(error instanceof Error ? error.message : '更新失败');
    }
  };

  if (!user) return null;

  return (
    <div className="p-4">
      <Card
        title="用户信息"
        extra={
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            编辑信息
          </Button>
        }
      >
        <Descriptions column={1}>
          <Descriptions.Item label="用户名">
            <UserOutlined /> {user.username}
          </Descriptions.Item>
          <Descriptions.Item label="真实姓名">
            <UserOutlined /> {user.realName}
          </Descriptions.Item>
          <Descriptions.Item label="手机号">
            <PhoneOutlined /> {user.phone || '未设置'}
          </Descriptions.Item>
          <Descriptions.Item label="邮箱">
            <MailOutlined /> {user.email || '未设置'}
          </Descriptions.Item>
          <Descriptions.Item label="角色">
            {user.roleName}
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            {user.status === 1 ? '正常' : '禁用'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Modal
        title="编辑用户信息"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={{
            phone: user.phone,
            email: user.email,
          }}
        >
          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
            ]}
          >
            <Input prefix={<PhoneOutlined />} />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { type: 'email', message: '请输入正确的邮箱地址' }
            ]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item
            name="password"
            label="新密码"
            rules={[
              { min: 6, message: '密码长度不能小于6位' }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              保存
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserProfile; 