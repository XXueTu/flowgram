import type { StatsCompilation } from '@rspack/core';
export declare function formatStatsMessages(stats: Pick<StatsCompilation, 'errors' | 'warnings'>, verbose?: boolean): {
    errors: string[];
    warnings: string[];
};
