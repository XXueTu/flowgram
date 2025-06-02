import type { AsyncHook, EnvironmentAsyncHook, InternalContext, ModifyBundlerChainFn, ModifyEnvironmentConfigFn, ModifyHTMLFn, ModifyHTMLTagsFn, ModifyRsbuildConfigFn, ModifyRspackConfigFn, ModifyWebpackChainFn, ModifyWebpackConfigFn, OnAfterBuildFn, OnAfterCreateCompilerFn, OnAfterEnvironmentCompileFn, OnAfterStartDevServerFn, OnAfterStartProdServerFn, OnBeforeBuildFn, OnBeforeCreateCompilerFn, OnBeforeEnvironmentCompileFn, OnBeforeStartDevServerFn, OnBeforeStartProdServerFn, OnCloseBuildFn, OnCloseDevServerFn, OnDevCompileDoneFn, OnExitFn, Rspack } from './types';
export declare function createEnvironmentAsyncHook<Callback extends (...args: any[]) => any>(): EnvironmentAsyncHook<Callback>;
export declare function createAsyncHook<Callback extends (...args: any[]) => any>(): AsyncHook<Callback>;
export declare function initHooks(): {
    /** The following hooks are global hooks */
    onExit: AsyncHook<OnExitFn>;
    onAfterBuild: AsyncHook<OnAfterBuildFn>;
    onCloseBuild: AsyncHook<OnCloseBuildFn>;
    onBeforeBuild: AsyncHook<OnBeforeBuildFn>;
    onDevCompileDone: AsyncHook<OnDevCompileDoneFn>;
    onCloseDevServer: AsyncHook<OnCloseDevServerFn>;
    onAfterStartDevServer: AsyncHook<OnAfterStartDevServerFn>;
    onBeforeStartDevServer: AsyncHook<OnBeforeStartDevServerFn>;
    onAfterStartProdServer: AsyncHook<OnAfterStartProdServerFn>;
    onBeforeStartProdServer: AsyncHook<OnBeforeStartProdServerFn>;
    onAfterCreateCompiler: AsyncHook<OnAfterCreateCompilerFn>;
    onBeforeCreateCompiler: AsyncHook<OnBeforeCreateCompilerFn>;
    /**  The following hooks are related to the environment */
    modifyHTML: EnvironmentAsyncHook<ModifyHTMLFn>;
    modifyHTMLTags: EnvironmentAsyncHook<ModifyHTMLTagsFn>;
    modifyRspackConfig: EnvironmentAsyncHook<ModifyRspackConfigFn>;
    modifyBundlerChain: EnvironmentAsyncHook<ModifyBundlerChainFn>;
    modifyWebpackChain: EnvironmentAsyncHook<ModifyWebpackChainFn>;
    modifyWebpackConfig: EnvironmentAsyncHook<ModifyWebpackConfigFn>;
    modifyRsbuildConfig: AsyncHook<ModifyRsbuildConfigFn>;
    modifyEnvironmentConfig: EnvironmentAsyncHook<ModifyEnvironmentConfigFn>;
    onBeforeEnvironmentCompile: EnvironmentAsyncHook<OnBeforeEnvironmentCompileFn>;
    onAfterEnvironmentCompile: EnvironmentAsyncHook<OnAfterEnvironmentCompileFn>;
};
export type Hooks = ReturnType<typeof initHooks>;
export declare const onCompileDone: ({ compiler, onDone, onEnvironmentDone, MultiStatsCtor, }: {
    compiler: Rspack.Compiler | Rspack.MultiCompiler;
    onDone: (stats: Rspack.Stats | Rspack.MultiStats) => Promise<void>;
    onEnvironmentDone: (buildIndex: number, stats: Rspack.Stats) => Promise<void>;
    MultiStatsCtor: new (stats: Rspack.Stats[]) => Rspack.MultiStats;
}) => void;
export declare const registerBuildHook: ({ context, isWatch, compiler, bundlerConfigs, MultiStatsCtor, }: {
    bundlerConfigs?: Rspack.Configuration[];
    context: InternalContext;
    compiler: Rspack.Compiler | Rspack.MultiCompiler;
    isWatch: boolean;
    MultiStatsCtor: new (stats: Rspack.Stats[]) => Rspack.MultiStats;
}) => void;
export declare const registerDevHook: ({ context, compiler, bundlerConfigs, MultiStatsCtor, }: {
    bundlerConfigs?: Rspack.Configuration[];
    context: InternalContext;
    compiler: Rspack.Compiler | Rspack.MultiCompiler;
    MultiStatsCtor: new (stats: Rspack.Stats[]) => Rspack.MultiStats;
}) => void;
