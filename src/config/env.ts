/**
 * 环境配置
 */

// 开发环境配置
const development = {
  API_BASE_URL: "http://127.0.0.1:8888", // 开发环境使用代理
  API_TIMEOUT: 30000,
};

// 生产环境配置
const production = {
  API_BASE_URL: "http://14.103.249.105:9999",
  API_TIMEOUT: 30000,
};

// 测试环境配置
const test = {
  API_BASE_URL: "http://test-api.example.com",
  API_TIMEOUT: 30000,
};

// 根据当前环境获取配置
const getConfig = () => {
  const env = process.env.NODE_ENV || "development";

  switch (env) {
    case "production":
      return production;
    case "test":
      return test;
    case "development":
    default:
      return development;
  }
};

export const ENV_CONFIG = getConfig();

// 导出环境变量
export const isDevelopment = process.env.NODE_ENV === "development";
export const isProduction = process.env.NODE_ENV === "production";
export const isTest = process.env.NODE_ENV === "test";
