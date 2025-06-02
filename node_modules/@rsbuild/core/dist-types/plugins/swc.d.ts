import type { SwcLoaderOptions } from '@rspack/core';
import type { NormalizedEnvironmentConfig, RsbuildPlugin } from '../types';
/**
 * Provide some SWC configs of Rspack
 */
export declare const pluginSwc: () => RsbuildPlugin;
export declare function applySwcDecoratorConfig(swcConfig: SwcLoaderOptions, config: NormalizedEnvironmentConfig): void;
