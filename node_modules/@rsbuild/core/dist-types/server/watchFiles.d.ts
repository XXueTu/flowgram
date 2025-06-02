import type { FSWatcher } from '../../compiled/chokidar/index.js';
import type { ChokidarOptions, DevConfig, ServerConfig } from '../types';
import type { CompilationManager } from './compilationManager';
type WatchFilesOptions = {
    dev: DevConfig;
    server: ServerConfig;
    root: string;
    compilationManager?: CompilationManager;
};
export type WatchFilesResult = {
    close(): Promise<void>;
};
export declare function setupWatchFiles(options: WatchFilesOptions): Promise<WatchFilesResult | undefined>;
export declare function createChokidar(pathOrGlobs: string[], root: string, options: ChokidarOptions): Promise<FSWatcher>;
export {};
