import color from '../../compiled/picocolors/index.js';
import type RspackChain from '../../compiled/rspack-chain';
import type { FilenameConfig, NormalizedConfig, NormalizedEnvironmentConfig, RsbuildTarget, Rspack } from '../types';
export * from './fs';
export * from './path';
export * from './stats';
export { color };
export declare const rspackMinVersion = "1.2.4";
export declare const getNodeEnv: () => string;
export declare const setNodeEnv: (env: string) => void;
export declare const isNil: (o: unknown) => o is undefined | null;
export declare const isFunction: (func: unknown) => func is (...args: any[]) => any;
export declare const isObject: (obj: unknown) => obj is Record<string, any>;
export declare const isPlainObject: (obj: unknown) => obj is Record<string, any>;
export declare const castArray: <T>(arr?: T | T[]) => T[];
export declare const cloneDeep: <T>(value: T) => T;
/**
 * If the application overrides the Rspack version to a lower one,
 * we should check that the Rspack version is greater than the minimum
 * supported version.
 */
export declare const isSatisfyRspackVersion: (originalVersion: string) => Promise<boolean>;
export declare const removeLeadingSlash: (s: string) => string;
export declare const removeTailingSlash: (s: string) => string;
export declare const addTrailingSlash: (s: string) => string;
export declare const formatPublicPath: (publicPath: string, withSlash?: boolean) => string;
export declare const getPublicPathFromChain: (chain: RspackChain, withSlash?: boolean) => string;
export declare const getPublicPathFromCompiler: (compiler: Rspack.Compiler | Rspack.Compilation) => string;
export declare const urlJoin: (base: string, path: string) => string;
export declare const canParse: (url: string) => boolean;
export declare const ensureAssetPrefix: (url: string, assetPrefix?: Rspack.PublicPath) => string;
export declare function getFilename(config: NormalizedConfig | NormalizedEnvironmentConfig, type: 'js', isProd: boolean, isServer?: boolean): Rspack.Filename;
export declare function getFilename(config: NormalizedConfig | NormalizedEnvironmentConfig, type: 'css', isProd: boolean): Rspack.CssFilename;
export declare function getFilename(config: NormalizedConfig | NormalizedEnvironmentConfig, type: Exclude<keyof FilenameConfig, 'js' | 'css'>, isProd: boolean, isServer?: boolean): Rspack.AssetModuleFilename;
export declare function partition<T>(array: T[], predicate: (value: T) => boolean): [T[], T[]];
export declare const applyToCompiler: (compiler: Rspack.Compiler | Rspack.MultiCompiler, apply: (c: Rspack.Compiler, index: number) => void) => void;
export declare const upperFirst: (str: string) => string;
export declare const isURL: (str: string) => boolean;
export declare const createVirtualModule: (content: string) => string;
export declare function isWebTarget(target: RsbuildTarget | RsbuildTarget[]): boolean;
export declare const isMultiCompiler: (compiler: Rspack.Compiler | Rspack.MultiCompiler) => compiler is Rspack.MultiCompiler;
export declare function pick<T, U extends keyof T>(obj: T, keys: ReadonlyArray<U>): Pick<T, U>;
export declare const camelCase: (input: string) => string;
export declare const prettyTime: (seconds: number) => string;
/**
 * Check if running in a TTY context
 */
export declare const isTTY: (type?: "stdin" | "stdout") => boolean;
export declare const addCompilationError: (compilation: Rspack.Compilation, message: string) => void;
export declare function hash(data: string): string;
