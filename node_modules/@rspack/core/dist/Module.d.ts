import * as binding from "@rspack/binding";
import type { Source } from "../compiled/webpack-sources";
import type { ResourceData } from "./Resolver";
export type ResourceDataWithData = ResourceData & {
    data?: Record<string, any>;
};
export type CreateData = Partial<binding.JsCreateData>;
export type ContextInfo = {
    issuer: string;
    issuerLayer?: string | null;
};
export type ResolveData = {
    contextInfo: ContextInfo;
    context: string;
    request: string;
    fileDependencies: string[];
    missingDependencies: string[];
    contextDependencies: string[];
    createData?: CreateData;
};
export declare class ContextModuleFactoryBeforeResolveData {
    #private;
    context: string;
    request: string;
    regExp: RegExp | undefined;
    recursive: boolean;
    static __from_binding(binding: binding.JsContextModuleFactoryBeforeResolveData): ContextModuleFactoryBeforeResolveData;
    static __to_binding(data: ContextModuleFactoryBeforeResolveData): binding.JsContextModuleFactoryBeforeResolveData;
    private constructor();
}
export type ContextModuleFactoryBeforeResolveResult = false | ContextModuleFactoryBeforeResolveData;
export declare class ContextModuleFactoryAfterResolveData {
    #private;
    resource: number;
    context: string;
    request: string;
    regExp: RegExp | undefined;
    recursive: boolean;
    readonly dependencies: binding.Dependency[];
    static __from_binding(binding: binding.JsContextModuleFactoryAfterResolveData): ContextModuleFactoryAfterResolveData;
    static __to_binding(data: ContextModuleFactoryAfterResolveData): binding.JsContextModuleFactoryAfterResolveData;
    private constructor();
}
export type ContextModuleFactoryAfterResolveResult = false | ContextModuleFactoryAfterResolveData;
declare const $assets: unique symbol;
declare module "@rspack/binding" {
    interface Assets {
        [$assets]: Record<string, Source>;
    }
    interface BuildInfo {
        assets: Record<string, Source>;
    }
}
declare module "@rspack/binding" {
    interface Module {
        identifier(): string;
        readableIdentifier(): string;
        originalSource(): Source | null;
        emitFile(filename: string, source: Source, assetInfo?: AssetInfo): void;
    }
}
export { Module } from "@rspack/binding";
