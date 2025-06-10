/**
 * 代理配置
 */

export interface ProxyConfig {
  target: string;
  changeOrigin: boolean;
  secure: boolean;
  pathRewrite?: Record<string, string>;
}

// 后端API服务器地址
const API_SERVER = "http://14.103.249.105:9999";

// 代理配置
export const PROXY_CONFIG: Record<string, ProxyConfig> = {
  // workflow API代理
  "/workflow": {
    target: API_SERVER,
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      "^/workflow": "/workflow",
    },
  },

  // 通用API代理（如果需要）
  "/api": {
    target: API_SERVER,
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      "^/api": "",
    },
  },
};

// 获取Rsbuild格式的代理配置
export const getRsbuildProxyConfig = () => {
  return PROXY_CONFIG;
};
