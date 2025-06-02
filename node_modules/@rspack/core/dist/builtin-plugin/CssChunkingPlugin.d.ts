import * as binding from "@rspack/binding";
export interface CssChunkingPluginOptions {
    strict?: boolean;
    /**
     * This plugin is intended to be generic, but currently requires some special handling for Next.js.
     * A `next` option has been added to accommodate this.
     * In the future, once the design of CssChunkingPlugin becomes more stable, this option may be removed.
     */
    nextjs?: boolean;
}
export declare const CssChunkingPlugin: {
    new (options: CssChunkingPluginOptions): {
        name: binding.BuiltinPluginName;
        _args: [options: CssChunkingPluginOptions];
        affectedHooks: "done" | "make" | "compile" | "emit" | "afterEmit" | "invalid" | "thisCompilation" | "afterDone" | "compilation" | "normalModuleFactory" | "contextModuleFactory" | "initialize" | "shouldEmit" | "infrastructureLog" | "beforeRun" | "run" | "assetEmitted" | "failed" | "shutdown" | "watchRun" | "watchClose" | "environment" | "afterEnvironment" | "afterPlugins" | "afterResolvers" | "beforeCompile" | "afterCompile" | "finishMake" | "entryOption" | "additionalPass" | undefined;
        raw(compiler: import("..").Compiler): binding.BuiltinPlugin;
        apply(compiler: import("..").Compiler): void;
    };
};
