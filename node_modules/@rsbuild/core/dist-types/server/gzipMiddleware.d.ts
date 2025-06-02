import type { RequestHandler } from '../types';
export declare const gzipMiddleware: ({ level, }?: {
    level?: number;
}) => RequestHandler;
