import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Typography } from "antd";
import MD5 from "crypto-js/md5";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/user-store";

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useUserStore();
  const [form] = Form.useForm();

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      const encryptedPassword = MD5(values.password).toString();
      values.password = encryptedPassword;
      await login(values.username, values.password);
      message.success('登录成功');
      
      // 登录成功后跳转到之前想要访问的页面，或者默认跳转到首页
      const from = (location.state as any)?.from || '/dashboard';
      navigate(from, { replace: true });
    } catch (error) {
      message.error(error instanceof Error ? error.message : '登录失败');
    }
  };

  // 开发环境快捷登录
  const onQuickLogin = () => {
    localStorage.setItem("token", "default-token");
    message.success('已使用默认用户身份登录');
    const from = (location.state as any)?.from || '/dashboard';
    navigate(from, { replace: true });
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };

  const backgroundStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    zIndex: 0,
  };

  const contentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: 400,
    padding: 20,
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: 20,
    padding: 40,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    animation: 'slideUp 0.6s ease-out',
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: 32,
  };

  const logoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  };

  const logoIconStyle: React.CSSProperties = {
    color: '#667eea',
    marginRight: 12,
  };

  const logoTextStyle: React.CSSProperties = {
    margin: '0 !important',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const subtitleStyle: React.CSSProperties = {
    color: '#666',
    fontSize: 14,
  };

  const inputStyle: React.CSSProperties = {
    borderRadius: 12,
    border: '2px solid #f0f0f0',
    transition: 'all 0.3s ease',
  };

  const buttonStyle: React.CSSProperties = {
    height: 48,
    borderRadius: 12,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    fontWeight: 500,
    fontSize: 16,
    transition: 'all 0.3s ease',
    marginTop: 8,
  };

  const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginTop: 24,
  };

  const registerLinkStyle: React.CSSProperties = {
    color: '#666',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
  };

  const linkTextStyle: React.CSSProperties = {
    color: '#667eea',
    fontWeight: 500,
  };

  const shapeStyle1: React.CSSProperties = {
    position: 'absolute',
    width: 80,
    height: 80,
    top: '20%',
    left: '10%',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    animation: 'float1 6s ease-in-out infinite',
  };

  const shapeStyle2: React.CSSProperties = {
    position: 'absolute',
    width: 120,
    height: 120,
    top: '60%',
    right: '10%',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    animation: 'float2 6s ease-in-out infinite 2s',
  };

  const shapeStyle3: React.CSSProperties = {
    position: 'absolute',
    width: 60,
    height: 60,
    bottom: '20%',
    left: '20%',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    animation: 'float3 6s ease-in-out infinite 4s',
  };

  return (
    <>
      <style>
        {`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes float1 {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-20px) rotate(180deg);
            }
          }

          @keyframes float2 {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-25px) rotate(-180deg);
            }
          }

          @keyframes float3 {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-15px) rotate(360deg);
            }
          }

          .custom-input:hover {
            border-color: #d9d9d9 !important;
          }

          .custom-input:focus,
          .custom-input.ant-input-focused,
          .custom-input .ant-input:focus {
            border-color: #667eea !important;
            box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2) !important;
          }

          .input-icon {
            color: #667eea !important;
          }

          .login-button:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4) !important;
          }

          .register-link:hover {
            color: #333 !important;
          }

          .register-link:hover .link-text {
            color: #764ba2 !important;
          }

          @media (max-width: 480px) {
            .login-content {
              padding: 16px !important;
            }
            
            .login-card {
              padding: 24px !important;
            }
          }
        `}
      </style>
      <div style={containerStyle}>
        <div style={backgroundStyle}>
          <div style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden' }}>
            <div style={shapeStyle1}></div>
            <div style={shapeStyle2}></div>
            <div style={shapeStyle3}></div>
          </div>
        </div>
        
        <div style={contentStyle} className="login-content">
          <div style={cardStyle} className="login-card">
            <div style={headerStyle}>
              <div style={logoStyle}>
                <div style={logoIconStyle}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <Title level={2} style={logoTextStyle}>WorkFlow</Title>
              </div>
              <Text style={subtitleStyle}>欢迎回来，请登录您的账户</Text>
            </div>

            <Form 
              form={form} 
              name="login" 
              onFinish={onFinish} 
              autoComplete="off" 
              layout="vertical"
              style={{ marginTop: 24 }}
            >
              <Form.Item 
                name="username" 
                rules={[{ required: true, message: "请输入用户名" }]}
              >
                <Input 
                  prefix={<UserOutlined className="input-icon" />} 
                  placeholder="请输入用户名" 
                  size="large"
                  style={inputStyle}
                  className="custom-input"
                />
              </Form.Item>

              <Form.Item 
                name="password" 
                rules={[{ required: true, message: "请输入密码" }]}
              >
                <Input.Password 
                  prefix={<LockOutlined className="input-icon" />} 
                  placeholder="请输入密码" 
                  size="large"
                  style={inputStyle}
                  className="custom-input"
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading} 
                  block 
                  size="large"
                  style={buttonStyle}
                  className="login-button"
                >
                  {loading ? "登录中..." : "登录"}
                </Button>
              </Form.Item>

              <div style={footerStyle}>
                <Text style={registerLinkStyle} className="register-link" onClick={() => navigate("/register")}>
                  还没有账号？<span style={linkTextStyle} className="link-text">立即注册</span>
                </Text>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
