import type Connect from '../../compiled/connect/index.js';
import type { EnvironmentAPI, HtmlFallback, RequestHandler as Middleware } from '../types';
import type { CompilationManager } from './compilationManager';
export declare const faviconFallbackMiddleware: Middleware;
export declare const getRequestLoggerMiddleware: () => Promise<Connect.NextHandleFunction>;
export declare const notFoundMiddleware: Middleware;
export declare const optionsFallbackMiddleware: Middleware;
/**
 * Support access HTML without suffix
 */
export declare const getHtmlCompletionMiddleware: (params: {
    distPath: string;
    compilationManager: CompilationManager;
}) => Middleware;
/**
 * handle `server.base`
 */
export declare const getBaseMiddleware: (params: {
    base: string;
}) => Middleware;
/**
 * support HTML fallback in some edge cases
 */
export declare const getHtmlFallbackMiddleware: (params: {
    distPath: string;
    compilationManager: CompilationManager;
    htmlFallback?: HtmlFallback;
}) => Middleware;
/**
 * Support viewing served files via `/rsbuild-dev-server` route
 */
export declare const viewingServedFilesMiddleware: (params: {
    environments: EnvironmentAPI;
}) => Middleware;
