import type { EnvironmentContext, DevConfig as OriginDevConfig, Rspack, ServerConfig } from '../types';
import { type CompilationMiddleware } from './compilationMiddleware';
import { SocketServer } from './socketServer';
type Options = {
    publicPaths: string[];
    environments: Record<string, EnvironmentContext>;
    dev: OriginDevConfig;
    server: ServerConfig;
    compiler: Rspack.Compiler | Rspack.MultiCompiler;
};
/**
 * Setup compiler-related logic:
 * 1. setup rsbuild-dev-middleware
 * 2. establish webSocket connect
 */
export declare class CompilationManager {
    middleware: CompilationMiddleware;
    outputFileSystem: Rspack.OutputFileSystem;
    private devConfig;
    private serverConfig;
    compiler: Rspack.Compiler | Rspack.MultiCompiler;
    private publicPaths;
    socketServer: SocketServer;
    constructor({ dev, server, compiler, publicPaths, environments }: Options);
    init(): Promise<void>;
    close(): Promise<void>;
    readFileSync: (fileName: string) => string;
    private setupCompilationMiddleware;
}
export {};
