import type { Runner, RunnerFactory, RunnerFactoryOptions } from './type';
export declare class BasicRunnerFactory implements RunnerFactory {
    protected name: string;
    constructor(name: string);
    create(options: RunnerFactoryOptions): Runner;
    protected createRunner(options: RunnerFactoryOptions): Runner;
}
export declare const run: <T>({ bundlePath, ...runnerFactoryOptions }: RunnerFactoryOptions & {
    bundlePath: string;
}) => Promise<T>;
