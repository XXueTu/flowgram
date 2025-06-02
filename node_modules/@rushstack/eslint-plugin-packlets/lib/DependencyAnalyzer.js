"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyAnalyzer = void 0;
const Path_1 = require("./Path");
var RefFileKind;
(function (RefFileKind) {
    RefFileKind[RefFileKind["Import"] = 0] = "Import";
    RefFileKind[RefFileKind["ReferenceFile"] = 1] = "ReferenceFile";
    RefFileKind[RefFileKind["TypeReferenceDirective"] = 2] = "TypeReferenceDirective";
})(RefFileKind || (RefFileKind = {}));
// TypeScript compiler internal:
// Version range: > 4.2.0
// https://github.com/microsoft/TypeScript/blob/2eca17d7c1a3fb2b077f3a910d5019d74b6f07a0/src/compiler/types.ts#L3693
var FileIncludeKind;
(function (FileIncludeKind) {
    FileIncludeKind[FileIncludeKind["RootFile"] = 0] = "RootFile";
    FileIncludeKind[FileIncludeKind["SourceFromProjectReference"] = 1] = "SourceFromProjectReference";
    FileIncludeKind[FileIncludeKind["OutputFromProjectReference"] = 2] = "OutputFromProjectReference";
    FileIncludeKind[FileIncludeKind["Import"] = 3] = "Import";
    FileIncludeKind[FileIncludeKind["ReferenceFile"] = 4] = "ReferenceFile";
    FileIncludeKind[FileIncludeKind["TypeReferenceDirective"] = 5] = "TypeReferenceDirective";
    FileIncludeKind[FileIncludeKind["LibFile"] = 6] = "LibFile";
    FileIncludeKind[FileIncludeKind["LibReferenceDirective"] = 7] = "LibReferenceDirective";
    FileIncludeKind[FileIncludeKind["AutomaticTypeDirectiveFile"] = 8] = "AutomaticTypeDirectiveFile";
})(FileIncludeKind || (FileIncludeKind = {}));
class DependencyAnalyzer {
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
    static _walkImports(packletName, startingPackletName, refFileMap, fileIncludeReasonsMap, program, packletsFolderPath, visitedPacklets, previousNode) {
        visitedPacklets.add(packletName);
        const packletEntryPoint = Path_1.Path.join(packletsFolderPath, packletName, 'index');
        const tsSourceFile = program.getSourceFile(packletEntryPoint + '.ts') || program.getSourceFile(packletEntryPoint + '.tsx');
        if (!tsSourceFile) {
            return undefined;
        }
        const referencingFilePaths = [];
        if (refFileMap) {
            // TypeScript version range: >= 3.6.0, <= 4.2.0
            const refFiles = refFileMap.get(tsSourceFile.path);
            if (refFiles) {
                for (const refFile of refFiles) {
                    if (refFile.kind === RefFileKind.Import) {
                        referencingFilePaths.push(refFile.file);
                    }
                }
            }
        }
        else if (fileIncludeReasonsMap) {
            // Typescript version range: > 4.2.0
            const fileIncludeReasons = fileIncludeReasonsMap.get(tsSourceFile.path);
            if (fileIncludeReasons) {
                for (const fileIncludeReason of fileIncludeReasons) {
                    if (fileIncludeReason.kind === FileIncludeKind.Import) {
                        if (fileIncludeReason.file) {
                            referencingFilePaths.push(fileIncludeReason.file);
                        }
                    }
                }
            }
        }
        for (const referencingFilePath of referencingFilePaths) {
            // Is it a reference to a packlet?
            if (Path_1.Path.isUnder(referencingFilePath, packletsFolderPath)) {
                const referencingRelativePath = Path_1.Path.relative(packletsFolderPath, referencingFilePath);
                const referencingPathParts = referencingRelativePath.split(/[\/\\]+/);
                const referencingPackletName = referencingPathParts[0];
                // Did we return to where we started from?
                if (referencingPackletName === startingPackletName) {
                    // Ignore the degenerate case where the starting node imports itself,
                    // since @rushstack/packlets/mechanics will already report that.
                    if (previousNode) {
                        // Make a new linked list node to record this step of the traversal
                        const importListNode = {
                            previousNode: previousNode,
                            fromFilePath: referencingFilePath,
                            packletName: packletName
                        };
                        // The traversal has returned to the packlet that we started from;
                        // this means we have detected a circular dependency
                        return importListNode;
                    }
                }
                // Have we already analyzed this packlet?
                if (!visitedPacklets.has(referencingPackletName)) {
                    // Make a new linked list node to record this step of the traversal
                    const importListNode = {
                        previousNode: previousNode,
                        fromFilePath: referencingFilePath,
                        packletName: packletName
                    };
                    const result = DependencyAnalyzer._walkImports(referencingPackletName, startingPackletName, refFileMap, fileIncludeReasonsMap, program, packletsFolderPath, visitedPacklets, importListNode);
                    if (result) {
                        return result;
                    }
                }
            }
        }
        return undefined;
    }
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
    static checkEntryPointForCircularImport(packletName, packletAnalyzer, program) {
        const programInternals = program;
        let refFileMap;
        let fileIncludeReasonsMap;
        if (programInternals.getRefFileMap) {
            // TypeScript version range: >= 3.6.0, <= 4.2.0
            refFileMap = programInternals.getRefFileMap();
        }
        else if (programInternals.getFileIncludeReasons) {
            // Typescript version range: > 4.2.0
            fileIncludeReasonsMap = programInternals.getFileIncludeReasons();
        }
        else {
            // If you encounter this error, please report a bug
            throw new Error('Your TypeScript compiler version is not supported; please upgrade @rushstack/eslint-plugin-packlets' +
                ' or report a GitHub issue');
        }
        const visitedPacklets = new Set();
        const listNode = DependencyAnalyzer._walkImports(packletName, packletName, refFileMap, fileIncludeReasonsMap, program, packletAnalyzer.packletsFolderPath, visitedPacklets, undefined // previousNode
        );
        if (listNode) {
            // Convert the linked list to an array
            const packletImports = [];
            for (let current = listNode; current; current = current.previousNode) {
                packletImports.push({ fromFilePath: current.fromFilePath, packletName: current.packletName });
            }
            return packletImports;
        }
        return undefined;
    }
}
exports.DependencyAnalyzer = DependencyAnalyzer;
//# sourceMappingURL=DependencyAnalyzer.js.map