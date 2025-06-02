import type { DevConfig, InternalContext, RequestHandler, ServerConfig } from '../types';
import type { CompilationManager } from './compilationManager';
import type { RsbuildDevServer } from './devServer';
import type { UpgradeEvent } from './helper';
export type RsbuildDevMiddlewareOptions = {
    pwd: string;
    dev: DevConfig;
    devServerAPI: RsbuildDevServer;
    server: ServerConfig;
    context: InternalContext;
    compilationManager?: CompilationManager;
    /**
     * Callbacks returned by the `onBeforeStartDevServer` hook.
     */
    postCallbacks: (() => void)[];
};
export type Middlewares = Array<RequestHandler | [string, RequestHandler]>;
export type GetDevMiddlewaresResult = {
    close: () => Promise<void>;
    onUpgrade: UpgradeEvent;
    middlewares: Middlewares;
};
export declare const getDevMiddlewares: (options: RsbuildDevMiddlewareOptions) => Promise<GetDevMiddlewaresResult>;
