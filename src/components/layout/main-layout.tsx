import { LogoutOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { PageContainer, ProLayout } from "@ant-design/pro-components";
import { Avatar, Button, Dropdown, Space, Typography } from "antd";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getBreadcrumb, useUserMenu } from "../../config/menu";
import { routeConfigs } from "../../config/routes";
import { usePermission } from "../../hooks/use-permission";
import { useUserStore } from "../../stores/user-store";

const { Title } = Typography;

interface MainLayoutProps {
  children: React.ReactNode;
}

// 自定义Logo图标组件
const WorkflowIcon: React.FC = () => {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32" style={{ color: '#667eea' }}>
      <path d="M4 4h5v5H4V4zm7 0h5v5h-5V4zm7 0h2v5h-2V4zM4 11h5v5H4v-5zm7 0h5v5h-5v-5zm7 0h2v5h-2v-5zM4 18h5v2H4v-2zm7 0h5v2h-5v-2zm7 0h2v2h-2v-2z"/>
      <path d="M6 6h1v1H6V6zm7 0h1v1h-1V6zm7 0h1v1h-1V6zM6 13h1v1H6v-1zm7 0h1v1h-1v-1zm7 0h1v1h-1v-1z"/>
    </svg>
  );
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, loading } = useUserStore();
  const permission = usePermission();

  // 根据当前用户权限生成菜单
  const menuData = useUserMenu(routeConfigs);

  // 获取面包屑
  const breadcrumb = getBreadcrumb(menuData, location.pathname);

  // 在用户信息加载时，如果没有用户或菜单数据，显示基本结构
  const shouldShowMenu = user && menuData.length > 0;

  console.log("MenuData:", menuData, "User:", user, "UserPermissions:", permission.userPermissions);

  // 用户下拉菜单
  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "个人中心",
      onClick: () => navigate("/profile"),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "个人设置",
      onClick: () => navigate("/settings"),
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "退出登录",
      onClick: async () => {
        await logout();
        navigate("/login");
      },
    },
  ];

  const handleMenuClick = (path: string) => {
    if (path && path !== location.pathname) {
      navigate(path);
    }
  };

  return (
    <div style={{ height: "auto", minHeight: "100vh" }}>
      <style>
        {`
          .ant-pro-global-header-logo h1 {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            background-clip: text !important;
            font-weight: 600 !important;
            letter-spacing: 0.5px !important;
            margin: 0 !important;
          }
          
          .ant-pro-global-header {
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
          
          .ant-pro-global-header-logo {
            padding-left: 0 !important;
            margin-right: 40px !important;
          }
          
          .ant-pro-top-nav-header-main-left {
            margin-left: 0 !important;
            padding-left: 0 !important;
          }
          
          .ant-menu-horizontal {
            margin-left: 0 !important;
            padding-left: 0 !important;
          }
          
          .ant-menu-horizontal > .ant-menu-item,
          .ant-menu-horizontal > .ant-menu-submenu {
            margin-left: 0 !important;
          }
        `}
      </style>
      <ProLayout
        title="Workflow"
        logo={<WorkflowIcon />}
        layout="top"
        navTheme="light"
        location={{
          pathname: location.pathname,
        }}
        route={{
          path: "/",
          routes: menuData,
        }}
        // 使用menuDataRender确保菜单正确渲染
        menuDataRender={() => {
          return menuData;
        }}
        menuItemRender={(item, dom) => {
          return <div onClick={() => handleMenuClick(item.path || "")}>{dom}</div>;
        }}
        breadcrumbRender={(routes) => {
          const items = breadcrumb.map((item) => ({
            title: item.name,
            path: item.path,
          }));
          return items;
        }}
        rightContentRender={() => (
          <Space>
            <Dropdown
              menu={{
                items: userMenuItems,
              }}
              trigger={["click"]}
            >
              <Button
                type="text"
                style={{
                  border: "none",
                  padding: "0 12px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Avatar size="small" icon={<UserOutlined />} />
                <span style={{ marginLeft: 8 }}>{user?.realName || user?.username || "未登录"}</span>
              </Button>
            </Dropdown>
          </Space>
        )}
        headerContentRender={false}
        footerRender={false}
        style={{
          height: "auto",
          minHeight: "100vh",
        }}
        contentStyle={{
          margin: 0,
          padding: 0,
        }}
      >
        <PageContainer
          breadcrumb={{
            items: breadcrumb.map((item) => ({
              title: item.name,
              path: item.path,
            })),
          }}
          style={{
            height: "auto",
            minHeight: "calc(100vh - 120px)",
            marginTop: 0,
          }}
          pageHeaderRender={false}
        >
          {children}
        </PageContainer>
      </ProLayout>
    </div>
  );
};

export default MainLayout;
