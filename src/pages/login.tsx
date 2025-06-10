import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MD5 from "crypto-js/md5";
import { useUserStore } from "../stores/user-store";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useUserStore();
  const [form] = Form.useForm();

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      // 对密码进行 MD5 加密
      const encryptedPassword = MD5(values.password).toString();
      await login(values.username, encryptedPassword);
      message.success("登录成功");

      // 获取重定向前的页面路径
      const from = (location.state as any)?.from || "/";
      navigate(from, { replace: true });
    } catch (error) {
      message.error(error instanceof Error ? error.message : "登录失败");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-8">登录</h1>
        <Form form={form} name="login" onFinish={onFinish} autoComplete="off" layout="vertical">
          <Form.Item name="username" rules={[{ required: true, message: "请输入用户名" }]}>
            <Input prefix={<UserOutlined />} placeholder="用户名" size="large" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: "请输入密码" }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              登录
            </Button>
          </Form.Item>

          <div className="text-center">
            <a onClick={() => navigate("/register")}>还没有账号？立即注册</a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
