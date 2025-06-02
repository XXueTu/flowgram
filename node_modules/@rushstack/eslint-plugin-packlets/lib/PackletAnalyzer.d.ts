export declare type InputFileMessageIds = 'file-in-packets-folder' | 'invalid-packlet-name' | 'misplaced-packlets-folder' | 'missing-src-folder' | 'missing-tsconfig' | 'packlet-folder-case';
export declare type ImportMessageIds = 'bypassed-entry-point' | 'circular-entry-point' | 'packlet-importing-project-file';
export interface IAnalyzerError {
    messageId: InputFileMessageIds | ImportMessageIds;
    data?: Readonly<Record<string, unknown>>;
}
export declare class PackletAnalyzer {
    private static _validPackletName;
    /**
     * The input file being linted.
     *
     * Example: "/path/to/my-project/src/file.ts"
     */
    readonly inputFilePath: string;
    /**
     * An error that occurred while analyzing the inputFilePath.
     */
    readonly error: IAnalyzerError | undefined;
    /**
     * Returned to indicate that the linter can ignore this file.  Possible reasons:
     * - It's outside the "src" folder
     * - The project doesn't define any packlets
     */
    readonly nothingToDo: boolean;
    /**
     * If true, then the "src/packlets" folder exists.
     */
    readonly projectUsesPacklets: boolean;
    /**
     * The absolute path of the "src/packlets" folder.
     */
    readonly packletsFolderPath: string | undefined;
    /**
     * The packlet that the inputFilePath is under, if any.
     */
    readonly inputFilePackletName: string | undefined;
    /**
     * Returns true if inputFilePath belongs to a packlet and is the entry point index.ts.
     */
    readonly isEntryPoint: boolean;
    private constructor();
    static analyzeInputFile(inputFilePath: string, tsconfigFilePath: string | undefined): PackletAnalyzer;
    analyzeImport(modulePath: string): IAnalyzerError | undefined;
}
//# sourceMappingURL=PackletAnalyzer.d.ts.map