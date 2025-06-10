import {
  UserOutlined,
  DashboardOutlined,
  SettingOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  TeamOutlined,
  SafetyOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { MenuDataItem } from "@ant-design/pro-components";
import { PermissionCode, RouteConfig } from "./routes";
import { usePermission } from "../hooks/use-permission";

export interface MenuConfig extends MenuDataItem {
  path?: string;
  name?: string;
  icon?: React.ReactNode;
  permissions?: PermissionCode[]; // 菜单需要的权限
  children?: MenuConfig[];
  hideInMenu?: boolean; // 是否在菜单中隐藏
  menuOrder?: number;
}

/**
 * 从路由配置生成菜单配置
 * @param routes 路由配置
 * @param userPermissions 用户权限列表
 * @returns 菜单配置
 */
export const generateMenuFromRoutes = (routes: RouteConfig[], userPermissions: string[] = []): MenuConfig[] => {
  const filterAndConvertRoutes = (routeList: RouteConfig[]): MenuConfig[] => {
    return routeList
      .filter((route) => {
        // 过滤掉公开路由、隐藏菜单的路由
        if (route.isPublic || route.hideInMenu) {
          return false;
        }

        // 如果有名称，才显示在菜单中
        if (!route.name) {
          return false;
        }

        // 权限检查：如果有权限要求，检查用户是否有权限
        if (route.permissions && route.permissions.length > 0) {
          // 检查用户是否有任意一个所需权限
          const hasPermission = route.permissions.some((permission) => userPermissions.includes(permission));

          // 检查是否有管理员权限
          const hasAdminPermission = userPermissions.includes(PermissionCode.ADMIN_ALL);

          if (!hasPermission && !hasAdminPermission) {
            return false;
          }
        }

        return true;
      })
      .map((route) => {
        const menuItem: MenuConfig = {
          path: route.path,
          name: route.name,
          icon: route.icon,
          permissions: route.permissions,
          hideInMenu: route.hideInMenu,
          menuOrder: route.menuOrder || 999,
        };

        // 递归处理子路由
        if (route.children && route.children.length > 0) {
          const children = filterAndConvertRoutes(route.children);
          if (children.length > 0) {
            menuItem.children = children;
          }
        }

        return menuItem;
      })
      .sort((a, b) => (a.menuOrder || 999) - (b.menuOrder || 999)); // 按 menuOrder 排序
  };

  return filterAndConvertRoutes(routes);
};

/**
 * Hook: 根据当前用户权限生成菜单
 * @param routes 路由配置
 * @returns 用户可访问的菜单配置
 */
export const useUserMenu = (routes: RouteConfig[]): MenuConfig[] => {
  const { userPermissions } = usePermission();

  return generateMenuFromRoutes(routes, userPermissions);
};

// 获取所有菜单路径（用于路由匹配）
export const getAllMenuPaths = (menus: MenuConfig[]): string[] => {
  const paths: string[] = [];

  const traverse = (items: MenuConfig[]) => {
    items.forEach((item) => {
      if (item.path && !item.hideInMenu) {
        paths.push(item.path);
      }
      if (item.children) {
        traverse(item.children);
      }
    });
  };

  traverse(menus);
  return paths;
};

// 根据路径查找菜单项
export const findMenuByPath = (menus: MenuConfig[], path: string): MenuConfig | null => {
  for (const menu of menus) {
    if (menu.path === path) {
      return menu;
    }
    if (menu.children) {
      const found = findMenuByPath(menu.children, path);
      if (found) return found;
    }
  }
  return null;
};

/**
 * 获取面包屑导航
 */
export const getBreadcrumb = (menus: MenuConfig[], path: string): MenuConfig[] => {
  const breadcrumb: MenuConfig[] = [];

  const findPath = (items: MenuConfig[], targetPath: string, currentPath: MenuConfig[]): boolean => {
    for (const item of items) {
      const newPath = [...currentPath, item];

      if (item.path === targetPath) {
        breadcrumb.push(...newPath);
        return true;
      }

      if (item.children && findPath(item.children, targetPath, newPath)) {
        return true;
      }
    }
    return false;
  };

  findPath(menus, path, []);
  return breadcrumb;
};
