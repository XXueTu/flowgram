import type { StatsCompilation } from '@rspack/core';
import type { Rspack } from '../types';
export declare const getAllStatsErrors: (statsData: StatsCompilation) => Rspack.StatsError[] | undefined;
export declare const getAllStatsWarnings: (statsData: StatsCompilation) => Rspack.StatsError[] | undefined;
export declare function getStatsOptions(compiler: Rspack.Compiler | Rspack.MultiCompiler): Rspack.StatsOptions;
export declare function formatStats(statsData: Rspack.StatsCompilation, hasErrors: boolean): {
    message?: string;
    level?: string;
};
