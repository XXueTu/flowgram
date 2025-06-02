import type { InitConfigsOptions } from './provider/initConfigs';
import type { InspectConfigOptions, InspectConfigResult, NormalizedConfig, PluginManager, Rspack, WebpackConfig } from './types';
export declare const getRsbuildInspectConfig: ({ normalizedConfig, inspectOptions, pluginManager, }: {
    normalizedConfig: NormalizedConfig;
    inspectOptions: InspectConfigOptions;
    pluginManager: PluginManager;
}) => {
    rawRsbuildConfig: string;
    rsbuildConfig: InspectConfigResult["origin"]["rsbuildConfig"];
    rawEnvironmentConfigs: Array<{
        name: string;
        content: string;
    }>;
    environmentConfigs: InspectConfigResult["origin"]["environmentConfigs"];
};
export declare function outputInspectConfigFiles({ rawBundlerConfigs, rawEnvironmentConfigs, inspectOptions, configType, }: {
    configType: string;
    rawEnvironmentConfigs: Array<{
        name: string;
        content: string;
    }>;
    rawBundlerConfigs: Array<{
        name: string;
        content: string;
    }>;
    inspectOptions: InspectConfigOptions & {
        outputPath: string;
    };
}): Promise<void>;
export declare function stringifyConfig(config: unknown, verbose?: boolean): string;
export declare function inspectConfig<B extends 'rspack' | 'webpack' = 'rspack'>({ context, pluginManager, bundlerConfigs, inspectOptions, bundler, }: InitConfigsOptions & {
    inspectOptions?: InspectConfigOptions;
    bundlerConfigs: B extends 'rspack' ? Rspack.Configuration[] : WebpackConfig[];
    bundler?: 'rspack' | 'webpack';
}): Promise<InspectConfigResult<B>>;
