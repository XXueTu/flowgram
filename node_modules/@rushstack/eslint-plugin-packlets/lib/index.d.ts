import { TSESLint } from '@typescript-eslint/experimental-utils';
interface IPlugin {
    rules: {
        [ruleName: string]: TSESLint.RuleModule<string, unknown[]>;
    };
    configs: {
        [ruleName: string]: any;
    };
}
declare const plugin: IPlugin;
export = plugin;
//# sourceMappingURL=index.d.ts.map