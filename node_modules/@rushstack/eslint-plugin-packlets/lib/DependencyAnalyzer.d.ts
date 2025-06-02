import type * as ts from 'typescript';
import { PackletAnalyzer } from './PackletAnalyzer';
/**
 * Represents a packlet that imports another packlet.
 */
export interface IPackletImport {
    /**
     * The name of the packlet being imported.
     */
    packletName: string;
    /**
     * The absolute path of the file that imports the packlet.
     */
    fromFilePath: string;
}
export declare class DependencyAnalyzer {
    /**
     * @param packletName - the packlet to be checked next in our traversal
     * @param startingPackletName - the packlet that we started with; if the traversal reaches this packlet,
     *   then a circular dependency has been detected
     * @param refFileMap - the compiler's `refFileMap` data structure describing import relationships
     * @param fileIncludeReasonsMap - the compiler's data structure describing import relationships
     * @param program - the compiler's `ts.Program` object
     * @param packletsFolderPath - the absolute path of the "src/packlets" folder.
     * @param visitedPacklets - the set of packlets that have already been visited in this traversal
     * @param previousNode - a linked list of import statements that brought us to this step in the traversal
     */
    private static _walkImports;
    /**
     * For the specified packlet, trace all modules that import it, looking for a circular dependency
     * between packlets.  If found, an array is returned describing the import statements that cause
     * the problem.
     *
     * @remarks
     * For example, suppose we have files like this:
     *
     * ```
     * src/packlets/logging/index.ts
     * src/packlets/logging/Logger.ts --> imports "../data-model"
     * src/packlets/data-model/index.ts
     * src/packlets/data-model/DataModel.ts --> imports "../logging"
     * ```
     *
     * The returned array would be:
     * ```ts
     * [
     *   { packletName: "logging",    fromFilePath: "/path/to/src/packlets/data-model/DataModel.ts" },
     *   { packletName: "data-model", fromFilePath: "/path/to/src/packlets/logging/Logger.ts" },
     * ]
     * ```
     *
     * If there is more than one circular dependency chain, only the first one that is encountered
     * will be returned.
     */
    static checkEntryPointForCircularImport(packletName: string, packletAnalyzer: PackletAnalyzer, program: ts.Program): IPackletImport[] | undefined;
}
//# sourceMappingURL=DependencyAnalyzer.d.ts.map