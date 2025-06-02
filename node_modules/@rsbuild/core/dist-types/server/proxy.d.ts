import type { RequestHandler as Middleware, ProxyConfig } from '../types';
import type { UpgradeEvent } from './helper';
export declare const createProxyMiddleware: (proxyOptions: ProxyConfig) => Promise<{
    middlewares: Middleware[];
    upgrade: UpgradeEvent;
}>;
