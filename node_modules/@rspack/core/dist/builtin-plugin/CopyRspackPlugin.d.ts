import { BuiltinPluginName, type RawCopyPattern } from "@rspack/binding";
export type CopyRspackPluginOptions = {
    /** An array of objects that describe the copy operations to be performed. */
    patterns: (string | (Pick<RawCopyPattern, "from"> & Partial<Omit<RawCopyPattern, "from">>))[];
};
export declare const CopyRspackPlugin: {
    new (copy: CopyRspackPluginOptions): {
        name: BuiltinPluginName;
        _args: [copy: CopyRspackPluginOptions];
        affectedHooks: "done" | "make" | "compile" | "emit" | "afterEmit" | "invalid" | "thisCompilation" | "afterDone" | "compilation" | "normalModuleFactory" | "contextModuleFactory" | "initialize" | "shouldEmit" | "infrastructureLog" | "beforeRun" | "run" | "assetEmitted" | "failed" | "shutdown" | "watchRun" | "watchClose" | "environment" | "afterEnvironment" | "afterPlugins" | "afterResolvers" | "beforeCompile" | "afterCompile" | "finishMake" | "entryOption" | "additionalPass" | undefined;
        raw(compiler: import("..").Compiler): import("@rspack/binding").BuiltinPlugin;
        apply(compiler: import("..").Compiler): void;
    };
};
