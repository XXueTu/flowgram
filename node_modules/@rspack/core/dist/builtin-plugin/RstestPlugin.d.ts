import { BuiltinPluginName, type RawRstestPluginOptions } from "@rspack/binding";
export type RstestPluginArgument = Partial<Omit<RawRstestPluginOptions, "handler">> | ((percentage: number, msg: string, ...args: string[]) => void) | undefined;
export declare const RstestPlugin: {
    new (rstest: RawRstestPluginOptions): {
        name: BuiltinPluginName;
        _args: [rstest: RawRstestPluginOptions];
        affectedHooks: "done" | "make" | "compile" | "emit" | "afterEmit" | "invalid" | "thisCompilation" | "afterDone" | "compilation" | "normalModuleFactory" | "contextModuleFactory" | "initialize" | "shouldEmit" | "infrastructureLog" | "beforeRun" | "run" | "assetEmitted" | "failed" | "shutdown" | "watchRun" | "watchClose" | "environment" | "afterEnvironment" | "afterPlugins" | "afterResolvers" | "beforeCompile" | "afterCompile" | "finishMake" | "entryOption" | "additionalPass" | undefined;
        raw(compiler: import("..").Compiler): import("@rspack/binding").BuiltinPlugin;
        apply(compiler: import("..").Compiler): void;
    };
};
