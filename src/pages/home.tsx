import React from "react";
import { Card, Row, Col, Statistic, Button, Space } from "antd";
import { UserOutlined, ProjectOutlined, DatabaseOutlined, BarChartOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { usePermission } from "../hooks/use-permission";
import { PermissionCode } from "../config/routes";
import PermissionWrapper from "../components/permission-wrapper";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { userPermissions } = usePermission();
  // 模拟统计数据
  const stats = [
    {
      title: "工作流总数",
      value: 125,
      icon: <ProjectOutlined style={{ color: "#1890ff" }} />,
      path: "/workflow/list",
    },
    {
      title: "数据资产",
      value: 68,
      icon: <DatabaseOutlined style={{ color: "#52c41a" }} />,
      path: "/data-asset/list",
    },
    {
      title: "用户总数",
      value: 24,
      icon: <UserOutlined style={{ color: "#722ed1" }} />,
      path: "/admin/users",
    },
    {
      title: "今日访问",
      value: 1234,
      icon: <EyeOutlined style={{ color: "#fa8c16" }} />,
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card hoverable={!!stat.path} onClick={() => stat.path && navigate(stat.path)} style={{ cursor: stat.path ? "pointer" : "default" }}>
              <Statistic title={stat.title} value={stat.value} prefix={stat.icon} valueStyle={{ fontSize: "24px" }} />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 快捷操作 */}
      <Card title="快捷操作" style={{ marginBottom: "24px" }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card onClick={() => navigate("/editor/123/456")}>editor</Card>
          </Col>
        </Row>
      </Card>

      {/* 用户信息卡片 */}
      <Card title="当前用户权限">
        <div style={{ marginBottom: "16px" }}>
          <strong>拥有权限：</strong>
        </div>
        <Space wrap>
          {userPermissions.map((permission) => (
            <Button key={permission} size="small" type="dashed">
              {permission}
            </Button>
          ))}
          {userPermissions.length === 0 && <span style={{ color: "#999" }}>暂无权限</span>}
        </Space>
      </Card>
    </div>
  );
};

export default HomePage;
