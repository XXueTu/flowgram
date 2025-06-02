import type { Compiler } from '@rspack/core';
import type { HtmlRspackPlugin, InternalContext } from '../types';
import type { EnvironmentContext, HtmlTag, HtmlTagDescriptor } from '../types';
type HtmlTagObject = HtmlRspackPlugin.HtmlTagObject;
export type TagConfig = {
    tags?: HtmlTagDescriptor[];
    hash?: HtmlTag['hash'];
    append?: HtmlTag['append'];
    publicPath?: HtmlTag['publicPath'];
};
/**
 * A unique identifier for providing extra data to RsbuildHtmlPlugin
 */
export declare const entryNameSymbol: unique symbol;
export declare const FILE_ATTRS: {
    link: string;
    script: string;
};
export type HtmlExtraData = {
    entryName: string;
    context: InternalContext;
    environment: EnvironmentContext;
    favicon?: string;
    tagConfig?: TagConfig;
    templateContent?: string;
};
export type AlterAssetTagGroupsData = {
    headTags: HtmlTagObject[];
    bodyTags: HtmlTagObject[];
    outputName: string;
    publicPath: string;
    plugin: HtmlRspackPlugin;
};
export declare const hasTitle: (html?: string) => boolean;
export declare class RsbuildHtmlPlugin {
    readonly name: string;
    readonly getExtraData: (entryName: string) => HtmlExtraData | undefined;
    constructor(getExtraData: (entryName: string) => HtmlExtraData | undefined);
    apply(compiler: Compiler): void;
}
export {};
