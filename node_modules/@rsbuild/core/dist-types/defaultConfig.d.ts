import type { NormalizedConfig, PublicDir, PublicDirOptions, RsbuildConfig, RsbuildEntry } from './types';
/**
 * Default allowed origins for CORS.
 * - localhost
 * - 127.0.0.1
 * - [::1]
 *
 * Can be used in `server.cors.origin` config.
 * @example
 * ```ts
 * server: {
 *   cors: {
 *     origin: [defaultAllowedOrigins, 'https://example.com'],
 *   },
 * }
 * ```
 */
export declare const defaultAllowedOrigins: RegExp;
export declare function getDefaultEntry(root: string): RsbuildEntry;
export declare const withDefaultConfig: (rootPath: string, config: RsbuildConfig) => Promise<RsbuildConfig>;
/**
 * Merges user config with default values to ensure required properties
 * are initialized.
 */
export declare const normalizeConfig: (config: RsbuildConfig) => NormalizedConfig;
export declare const normalizePublicDirs: (publicDir?: PublicDir) => Required<PublicDirOptions>[];
