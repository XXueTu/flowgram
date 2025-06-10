import { LogoutOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { PageContainer, ProLayout } from "@ant-design/pro-components";
import { Avatar, Button, Dropdown, Space } from "antd";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getBreadcrumb, useUserMenu } from "../../config/menu";
import { routeConfigs } from "../../config/routes";
import { usePermission } from "../../hooks/use-permission";
import { useUserStore } from "../../stores/user-store";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUserStore();
  const permission = usePermission();

  // 根据当前用户权限生成菜单
  const menuData = useUserMenu(routeConfigs);

  // 获取面包屑
  const breadcrumb = getBreadcrumb(menuData, location.pathname);

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
      <ProLayout
        title="Flowgram"
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
