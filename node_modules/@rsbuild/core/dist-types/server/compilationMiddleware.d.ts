import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Compiler, MultiCompiler } from '@rspack/core';
import type { DevConfig, NextFunction, ServerConfig } from '../types';
export declare const isClientCompiler: (compiler: {
    options: {
        target?: Compiler["options"]["target"];
    };
}) => boolean;
type ServerCallbacks = {
    onInvalid: (compilationId?: string, fileName?: string | null) => void;
    onDone: (stats: any) => void;
};
export declare const setupServerHooks: (compiler: Compiler, { onDone, onInvalid }: ServerCallbacks) => void;
type Middleware = (req: IncomingMessage, res: ServerResponse, next: NextFunction) => Promise<void>;
export type CompilationMiddlewareOptions = {
    /**
     * To ensure HMR works, the devMiddleware need inject the HMR client path into page when HMR enable.
     */
    clientPaths?: string[];
    /**
     * Should trigger when compiler hook called
     */
    callbacks: ServerCallbacks;
    devConfig: DevConfig;
    serverConfig: ServerConfig;
};
export type CompilationMiddleware = Middleware & {
    close: (callback: (err: Error | null | undefined) => void) => any;
};
/**
 * The CompilationMiddleware handles compiler setup for development:
 * - Call `compiler.watch` (handled by rsbuild-dev-middleware)
 * - Inject the HMR client path into page
 * - Notify server when compiler hooks are triggered
 */
export declare const getCompilationMiddleware: (compiler: Compiler | MultiCompiler, options: CompilationMiddlewareOptions) => Promise<CompilationMiddleware>;
export {};
