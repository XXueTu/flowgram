import type { PrintFileSizeAsset, RsbuildPlugin } from '../types';
/** Exclude source map and license files by default */
export declare const excludeAsset: (asset: PrintFileSizeAsset) => boolean;
export declare const pluginFileSize: () => RsbuildPlugin;
