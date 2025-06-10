import React, { useState } from "react";
import { ProLayout, PageContainer } from "@ant-design/pro-components";
import { Button, Dropdown, Avatar, Space } from "antd";
import { LogoutOutlined, UserOutlined, SettingOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../../stores/user-store";
import { routeConfigs } from "../../config/routes";
import { useUserMenu, getBreadcrumb } from "../../config/menu";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUserStore();
  const [collapsed, setCollapsed] = useState(false);

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
        layout="mix"
        splitMenus={false}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        location={{
          pathname: location.pathname,
        }}
        route={{
          routes: menuData,
        }}
        menuItemRender={(item, dom) => <div onClick={() => handleMenuClick(item.path || "")}>{dom}</div>}
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
                <span style={{ marginLeft: 8 }}>{user?.realName || user?.username}</span>
              </Button>
            </Dropdown>
          </Space>
        )}
        menuProps={{
          style: {
            border: "none",
          },
        }}
        headerContentRender={() => null}
        // footerRender={() => <div style={{ textAlign: "center", padding: "12px 0" }}>Flowgram ©2024 Created by Flowgram Team</div>}
        style={{
          height: "auto",
          minHeight: "calc(100vh - 0px)",
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
            minHeight: "calc(100vh - 60px)",
          }}
        >
          {children}
        </PageContainer>
      </ProLayout>
    </div>
  );
};

export default MainLayout;
