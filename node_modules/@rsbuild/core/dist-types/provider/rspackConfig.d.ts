import type { EnvironmentContext, InternalContext, ModifyChainUtils, ModifyRspackConfigUtils, RsbuildTarget, Rspack } from '../types';
export declare function getConfigUtils(config: Rspack.Configuration, chainUtils: ModifyChainUtils): Promise<ModifyRspackConfigUtils>;
export declare function getChainUtils(target: RsbuildTarget, environment: EnvironmentContext): ModifyChainUtils;
export declare function generateRspackConfig({ target, context, environment, }: {
    environment: string;
    target: RsbuildTarget;
    context: InternalContext;
}): Promise<Rspack.Configuration>;
