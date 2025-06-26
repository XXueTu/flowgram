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
    background: '#f8fafc',
    overflow: 'hidden',
  };

  const leftPanelStyle: React.CSSProperties = {
    flex: 1,
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  };

  const rightPanelStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    background: '#ffffff',
  };

  const logoSectionStyle: React.CSSProperties = {
    textAlign: 'center',
    color: 'white',
    zIndex: 2,
    position: 'relative',
  };

  const brandLogoStyle: React.CSSProperties = {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '16px',
    background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    lineHeight: 1.2,
  };

  const brandDescStyle: React.CSSProperties = {
    fontSize: '18px',
    opacity: 0.8,
    fontWeight: 300,
    marginBottom: '32px',
  };

  const featureListStyle: React.CSSProperties = {
    textAlign: 'left',
    maxWidth: '300px',
  };

  const featureItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
    fontSize: '14px',
    opacity: 0.9,
  };

  const formContainerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '400px',
    padding: '0 20px',
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '40px',
  };

  const titleStyle: React.CSSProperties = {
    color: '#1e293b',
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '8px',
  };

  const subtitleStyle: React.CSSProperties = {
    color: '#64748b',
    fontSize: '16px',
    fontWeight: 400,
  };

  const inputStyle: React.CSSProperties = {
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
    height: '52px',
    fontSize: '16px',
    transition: 'all 0.3s ease',
  };

  const buttonStyle: React.CSSProperties = {
    height: '52px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
    border: 'none',
    fontWeight: 600,
    fontSize: '16px',
    transition: 'all 0.3s ease',
    marginTop: '8px',
  };

  const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginTop: '32px',
  };

  const registerLinkStyle: React.CSSProperties = {
    color: '#64748b',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
    fontSize: '14px',
  };

  const linkTextStyle: React.CSSProperties = {
    color: '#1e293b',
    fontWeight: 600,
  };

  // 装饰性元素
  const decorativeCircle1Style: React.CSSProperties = {
    position: 'absolute',
    width: '200px',
    height: '200px',
    background: 'rgba(59, 130, 246, 0.1)',
    borderRadius: '50%',
    top: '10%',
    right: '10%',
    animation: 'pulse 4s ease-in-out infinite',
  };

  const decorativeCircle2Style: React.CSSProperties = {
    position: 'absolute',
    width: '150px',
    height: '150px',
    background: 'rgba(139, 92, 246, 0.1)',
    borderRadius: '50%',
    bottom: '20%',
    left: '15%',
    animation: 'pulse 4s ease-in-out infinite 2s',
  };

  const decorativeShapeStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100px',
    height: '100px',
    background: 'rgba(6, 182, 212, 0.1)',
    transform: 'rotate(45deg)',
    top: '50%',
    left: '5%',
    animation: 'rotate 8s linear infinite',
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 0.7;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.3;
            }
          }

          @keyframes rotate {
            from {
              transform: rotate(45deg);
            }
            to {
              transform: rotate(405deg);
            }
          }

          .modern-input:hover {
            border-color: #cbd5e1 !important;
          }

          .modern-input:focus,
          .modern-input.ant-input-focused,
          .modern-input .ant-input:focus {
            border-color: #1e293b !important;
            box-shadow: 0 0 0 3px rgba(30, 41, 59, 0.1) !important;
          }

          .input-icon {
            color: #64748b !important;
            font-size: 18px !important;
          }

          .modern-button:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 10px 25px rgba(30, 41, 59, 0.3) !important;
          }

          .register-link:hover {
            color: #1e293b !important;
          }

          .register-link:hover .link-text {
            color: #0f172a !important;
          }

          .feature-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            margin-right: 12px;
            font-size: 12px;
          }

          @media (max-width: 768px) {
            .responsive-container {
              flex-direction: column !important;
            }
            
            .left-panel {
              min-height: 300px !important;
              flex: none !important;
            }
            
            .right-panel {
              padding: 20px !important;
            }
          }
        `}
      </style>
      <div style={containerStyle} className="responsive-container">
        <div style={leftPanelStyle} className="left-panel">
          <div style={decorativeCircle1Style}></div>
          <div style={decorativeCircle2Style}></div>
          <div style={decorativeShapeStyle}></div>
          
          <div style={logoSectionStyle}>
            <div style={brandLogoStyle}>WorkFlow</div>
            <div style={brandDescStyle}>智能工作流编排平台</div>
            
            <div style={featureListStyle}>
              <div style={featureItemStyle}>
                <span className="feature-icon">✓</span>
                可视化流程设计
              </div>
              <div style={featureItemStyle}>
                <span className="feature-icon">✓</span>
                智能节点编排
              </div>
              <div style={featureItemStyle}>
                <span className="feature-icon">✓</span>
                实时执行监控
              </div>
              <div style={featureItemStyle}>
                <span className="feature-icon">✓</span>
                API 任务发布
              </div>
            </div>
          </div>
        </div>
        
        <div style={rightPanelStyle} className="right-panel">
          <div style={formContainerStyle}>
            <div style={headerStyle}>
              <Title level={2} style={titleStyle}>欢迎回来</Title>
              <Text style={subtitleStyle}>请登录您的账户以继续使用</Text>
            </div>

            <Form 
              form={form} 
              name="login" 
              onFinish={onFinish} 
              autoComplete="off" 
              layout="vertical"
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
                  className="modern-input"
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
                  className="modern-input"
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
                  className="modern-button"
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
