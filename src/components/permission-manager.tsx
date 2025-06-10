import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Divider, Row, Col, Space, Tag, Typography } from "antd";
import React, { useState } from "react";
import { PermissionCode, PERMISSION_DESCRIPTIONS } from "../config/routes";
import { permissionTemplates } from "../config/mock-users";

const { Title, Text } = Typography;

interface PermissionManagerProps {
  currentPermissions: string[];
  onPermissionsChange?: (permissions: string[]) => void;
  readonly?: boolean;
}

/**
 * 权限管理组件
 * 用于展示和编辑用户权限
 */
const PermissionManager: React.FC<PermissionManagerProps> = ({ currentPermissions = [], onPermissionsChange, readonly = false }) => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(currentPermissions);

  // 权限分组
  const permissionGroups = {
    user: {
      title: "用户管理",
      permissions: [PermissionCode.USER_VIEW, PermissionCode.USER_EDIT, PermissionCode.USER_DELETE],
    },
    workflow: {
      title: "工作流管理",
      permissions: [PermissionCode.WORKFLOW_CREATE, PermissionCode.WORKFLOW_EDIT, PermissionCode.WORKFLOW_DELETE, PermissionCode.WORKFLOW_EXECUTE],
    },
    system: {
      title: "系统管理",
      permissions: [PermissionCode.SYSTEM_CONFIG, PermissionCode.SYSTEM_LOG],
    },
    admin: {
      title: "管理员权限",
      permissions: [PermissionCode.ADMIN_ALL],
    },
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    const newPermissions = checked ? [...selectedPermissions, permission] : selectedPermissions.filter((p) => p !== permission);

    setSelectedPermissions(newPermissions);
    onPermissionsChange?.(newPermissions);
  };

  const handleTemplateApply = (template: keyof typeof permissionTemplates) => {
    const newPermissions = [...permissionTemplates[template]];
    setSelectedPermissions(newPermissions);
    onPermissionsChange?.(newPermissions);
  };

  const renderPermissionGroup = (groupKey: string, group: typeof permissionGroups.user) => (
    <Card key={groupKey} size="small" style={{ marginBottom: 16 }}>
      <Title level={5}>{group.title}</Title>
      <Space direction="vertical" style={{ width: "100%" }}>
        {group.permissions.map((permission) => {
          const isChecked = selectedPermissions.includes(permission);
          return (
            <div key={permission} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                {readonly ? (
                  <Tag color={isChecked ? "success" : "default"} icon={isChecked ? <CheckOutlined /> : <CloseOutlined />}>
                    {PERMISSION_DESCRIPTIONS[permission]}
                  </Tag>
                ) : (
                  <Checkbox checked={isChecked} onChange={(e) => handlePermissionChange(permission, e.target.checked)}>
                    {PERMISSION_DESCRIPTIONS[permission]}
                  </Checkbox>
                )}
              </div>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {permission}
              </Text>
            </div>
          );
        })}
      </Space>
    </Card>
  );

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Title level={4}>权限管理</Title>
        <Text type="secondary">{readonly ? "当前用户权限" : "编辑用户权限"}</Text>
      </div>

      {!readonly && (
        <>
          <Card size="small" style={{ marginBottom: 16 }}>
            <Title level={5}>快速应用权限模板</Title>
            <Space wrap>
              <Button size="small" onClick={() => handleTemplateApply("admin")}>
                管理员模板
              </Button>
              <Button size="small" onClick={() => handleTemplateApply("user")}>
                普通用户模板
              </Button>
              <Button size="small" onClick={() => handleTemplateApply("workflowAdmin")}>
                工作流管理员模板
              </Button>
              <Button size="small" onClick={() => handleTemplateApply("guest")}>
                访客模板
              </Button>
              <Button size="small" onClick={() => handleTemplateApply("viewer")}>
                查看者模板
              </Button>
              <Button
                size="small"
                danger
                onClick={() => {
                  setSelectedPermissions([]);
                  onPermissionsChange?.([]);
                }}
              >
                清空权限
              </Button>
            </Space>
          </Card>
          <Divider />
        </>
      )}

      <Row gutter={[16, 16]}>
        {Object.entries(permissionGroups).map(([groupKey, group]) => (
          <Col key={groupKey} xs={24} sm={12} lg={8}>
            {renderPermissionGroup(groupKey, group)}
          </Col>
        ))}
      </Row>

      {!readonly && (
        <Card size="small" style={{ marginTop: 16, backgroundColor: "#f5f5f5" }}>
          <Title level={5}>当前已选权限 ({selectedPermissions.length})</Title>
          <Space wrap>
            {selectedPermissions.map((permission) => (
              <Tag key={permission} color="blue" closable onClose={() => handlePermissionChange(permission, false)}>
                {PERMISSION_DESCRIPTIONS[permission as PermissionCode] || permission}
              </Tag>
            ))}
            {selectedPermissions.length === 0 && <Text type="secondary">暂无权限</Text>}
          </Space>
        </Card>
      )}
    </div>
  );
};

export default PermissionManager;
