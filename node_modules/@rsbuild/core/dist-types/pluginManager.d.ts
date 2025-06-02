import type { PluginManager, PluginMeta, RsbuildPluginAPI } from './types';
export declare const RSBUILD_ALL_ENVIRONMENT_SYMBOL = "RSBUILD_ALL_ENVIRONMENT_SYMBOL";
export declare const isPluginMatchEnvironment: (pluginEnvironment: string, currentEnvironment: string) => boolean;
export declare function createPluginManager(): PluginManager;
export declare const pluginDagSort: (plugins: PluginMeta[]) => PluginMeta[];
export declare function initPlugins({ getPluginAPI, pluginManager, }: {
    getPluginAPI: (environment?: string) => RsbuildPluginAPI;
    pluginManager: PluginManager;
}): Promise<void>;
