"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackletAnalyzer = void 0;
const fs = __importStar(require("fs"));
const Path_1 = require("./Path");
class PackletAnalyzer {
    constructor(inputFilePath, tsconfigFilePath) {
        this.inputFilePath = inputFilePath;
        this.error = undefined;
        this.nothingToDo = false;
        this.projectUsesPacklets = false;
        this.packletsFolderPath = undefined;
        this.inputFilePackletName = undefined;
        this.isEntryPoint = false;
        // Example: /path/to/my-project/src
        let srcFolderPath;
        if (!tsconfigFilePath) {
            this.error = { messageId: 'missing-tsconfig' };
            return;
        }
        srcFolderPath = Path_1.Path.join(Path_1.Path.dirname(tsconfigFilePath), 'src');
        if (!fs.existsSync(srcFolderPath)) {
            this.error = { messageId: 'missing-src-folder', data: { srcFolderPath } };
            return;
        }
        if (!Path_1.Path.isUnder(inputFilePath, srcFolderPath)) {
            // Ignore files outside the "src" folder
            this.nothingToDo = true;
            return;
        }
        // Example: packlets/my-packlet/index.ts
        const inputFilePathRelativeToSrc = Path_1.Path.relative(srcFolderPath, inputFilePath);
        // Example: [ 'packlets', 'my-packlet', 'index.ts' ]
        const pathParts = inputFilePathRelativeToSrc.split(/[\/\\]+/);
        let underPackletsFolder = false;
        const expectedPackletsFolder = Path_1.Path.join(srcFolderPath, 'packlets');
        for (let i = 0; i < pathParts.length; ++i) {
            const pathPart = pathParts[i];
            if (pathPart.toUpperCase() === 'PACKLETS') {
                if (pathPart !== 'packlets') {
                    // Example: /path/to/my-project/src/PACKLETS
                    const packletsFolderPath = Path_1.Path.join(srcFolderPath, ...pathParts.slice(0, i + 1));
                    this.error = { messageId: 'packlet-folder-case', data: { packletsFolderPath } };
                    return;
                }
                if (i !== 0) {
                    this.error = { messageId: 'misplaced-packlets-folder', data: { expectedPackletsFolder } };
                    return;
                }
                underPackletsFolder = true;
            }
        }
        if (underPackletsFolder || fs.existsSync(expectedPackletsFolder)) {
            // packletsAbsolutePath
            this.projectUsesPacklets = true;
            this.packletsFolderPath = expectedPackletsFolder;
        }
        if (underPackletsFolder) {
            if (pathParts.length === 2) {
                // Example: src/packlets/SomeFile.ts
                this.error = { messageId: 'file-in-packets-folder' };
                return;
            }
            if (pathParts.length >= 2) {
                // Example: 'my-packlet'
                const packletName = pathParts[1];
                this.inputFilePackletName = packletName;
                if (pathParts.length === 3) {
                    // Example: 'index.ts' or 'index.tsx'
                    const thirdPart = pathParts[2];
                    // Example: 'index'
                    const thirdPartWithoutExtension = Path_1.Path.parse(thirdPart).name;
                    if (thirdPartWithoutExtension.toUpperCase() === 'INDEX') {
                        if (!PackletAnalyzer._validPackletName.test(packletName)) {
                            this.error = { messageId: 'invalid-packlet-name', data: { packletName } };
                            return;
                        }
                        this.isEntryPoint = true;
                    }
                }
            }
        }
        if (this.error === undefined && !this.projectUsesPacklets) {
            this.nothingToDo = true;
        }
    }
    static analyzeInputFile(inputFilePath, tsconfigFilePath) {
        return new PackletAnalyzer(inputFilePath, tsconfigFilePath);
    }
    analyzeImport(modulePath) {
        if (!this.packletsFolderPath) {
            // The caller should ensure this can never happen
            throw new Error('Internal error: packletsFolderPath is not defined');
        }
        // Example: /path/to/my-project/src/packlets/my-packlet
        const inputFileFolder = Path_1.Path.dirname(this.inputFilePath);
        // Example: /path/to/my-project/src/other-packlet/index
        const importedPath = Path_1.Path.resolve(inputFileFolder, modulePath);
        // Is the imported path referring to a file under the src/packlets folder?
        if (Path_1.Path.isUnder(importedPath, this.packletsFolderPath)) {
            // Example: other-packlet/index
            const importedPathRelativeToPackletsFolder = Path_1.Path.relative(this.packletsFolderPath, importedPath);
            // Example: [ 'other-packlet', 'index' ]
            const importedPathParts = importedPathRelativeToPackletsFolder.split(/[\/\\]+/);
            if (importedPathParts.length > 0) {
                // Example: 'other-packlet'
                const importedPackletName = importedPathParts[0];
                // We are importing from a packlet. Is the input file part of the same packlet?
                if (this.inputFilePackletName && importedPackletName === this.inputFilePackletName) {
                    // Yes.  Then our import must NOT use the packlet entry point.
                    // Example: 'index'
                    //
                    // We discard the file extension to handle a degenerate case like:
                    //   import { X } from "../index.js";
                    const lastPart = Path_1.Path.parse(importedPathParts[importedPathParts.length - 1]).name;
                    let pathToCompare;
                    if (lastPart.toUpperCase() === 'INDEX') {
                        // Example:
                        //   importedPath = /path/to/my-project/src/other-packlet/index
                        //   pathToCompare = /path/to/my-project/src/other-packlet
                        pathToCompare = Path_1.Path.dirname(importedPath);
                    }
                    else {
                        pathToCompare = importedPath;
                    }
                    // Example: /path/to/my-project/src/other-packlet
                    const entryPointPath = Path_1.Path.join(this.packletsFolderPath, importedPackletName);
                    if (Path_1.Path.isEqual(pathToCompare, entryPointPath)) {
                        return {
                            messageId: 'circular-entry-point'
                        };
                    }
                }
                else {
                    // No.  If we are not part of the same packlet, then the module path must refer
                    // to the index.ts entry point.
                    // Example: /path/to/my-project/src/other-packlet
                    const entryPointPath = Path_1.Path.join(this.packletsFolderPath, importedPackletName);
                    if (!Path_1.Path.isEqual(importedPath, entryPointPath)) {
                        // Example: "../packlets/other-packlet"
                        const entryPointModulePath = Path_1.Path.convertToSlashes(Path_1.Path.relative(inputFileFolder, entryPointPath));
                        return {
                            messageId: 'bypassed-entry-point',
                            data: { entryPointModulePath }
                        };
                    }
                }
            }
        }
        else {
            // The imported path does NOT refer to a file under the src/packlets folder
            if (this.inputFilePackletName) {
                return {
                    messageId: 'packlet-importing-project-file'
                };
            }
        }
        return undefined;
    }
}
exports.PackletAnalyzer = PackletAnalyzer;
PackletAnalyzer._validPackletName = /^[a-z0-9]+(-[a-z0-9]+)*$/;
//# sourceMappingURL=PackletAnalyzer.js.map