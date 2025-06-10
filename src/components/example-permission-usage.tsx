import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import React from "react";
import { PermissionCode } from "../config/routes";
import { usePermission } from "../hooks/use-permission";
import PermissionWrapper from "./permission-wrapper";

/**
 * 权限使用示例组件
 * 展示如何在实际项目中使用权限控制
 */
const ExamplePermissionUsage: React.FC = () => {
  const { userPermissions, hasPermission } = usePermission();

  return (
    <div className="p-4">
      <h2>权限控制示例</h2>

      <div className="mb-4">
        <h3>当前用户权限:</h3>
        <ul>
          {userPermissions.map((permission) => (
            <li key={permission}>{permission}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h3>按钮权限控制:</h3>
        <Space>
          {/* 只有拥有创建权限的用户才能看到新建按钮 */}
          <PermissionWrapper permissions={PermissionCode.WORKFLOW_CREATE}>
            <Button type="primary" icon={<PlusOutlined />}>
              新建工作流
            </Button>
          </PermissionWrapper>

          {/* 只有拥有编辑权限的用户才能看到编辑按钮 */}
          <PermissionWrapper permissions={PermissionCode.WORKFLOW_EDIT}>
            <Button icon={<EditOutlined />}>编辑</Button>
          </PermissionWrapper>

          {/* 只有拥有删除权限或管理员权限的用户才能看到删除按钮 */}
          <PermissionWrapper permissions={[PermissionCode.WORKFLOW_DELETE, PermissionCode.ADMIN_ALL]}>
            <Button danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </PermissionWrapper>

          {/* 需要同时拥有用户查看和编辑权限才能看到的按钮 */}
          <PermissionWrapper permissions={[PermissionCode.USER_VIEW, PermissionCode.USER_EDIT]} requireAll={true}>
            <Button type="dashed">用户管理</Button>
          </PermissionWrapper>
        </Space>
      </div>

      <div className="mb-4">
        <h3>自定义渲染示例:</h3>
        <PermissionWrapper
          permissions={PermissionCode.SYSTEM_CONFIG}
          render={(hasAccess) => (
            <Button type={hasAccess ? "primary" : "default"} disabled={!hasAccess}>
              {hasAccess ? "系统配置" : "权限不足"}
            </Button>
          )}
        />
      </div>

      <div className="mb-4">
        <h3>代码中直接使用权限判断:</h3>
        <p>{hasPermission(PermissionCode.ADMIN_ALL) ? "您是管理员，拥有所有权限" : "您不是管理员"}</p>
      </div>
    </div>
  );
};

export default ExamplePermissionUsage;
