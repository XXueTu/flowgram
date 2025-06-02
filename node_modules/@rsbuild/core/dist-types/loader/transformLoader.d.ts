import type { LoaderContext } from '@rspack/core';
import type { EnvironmentContext, Rspack } from '../types';
export type TransformLoaderOptions = {
    id: string;
    getEnvironment: () => EnvironmentContext;
};
export default function transform(this: LoaderContext<TransformLoaderOptions>, source: string, map?: string | Rspack.sources.RawSourceMap): Promise<void>;
