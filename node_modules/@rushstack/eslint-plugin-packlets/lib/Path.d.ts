/// <reference types="node" />
import * as path from 'path';
export declare type ParsedPath = path.ParsedPath;
export declare class Path {
    /**
     * Whether the filesystem is assumed to be case sensitive for Path operations.
     *
     * @remarks
     * Regardless of operating system, a given file system's paths may be case-sensitive or case-insensitive.
     * If a volume is mounted under a subfolder, then different parts of a path can even have different
     * case-sensitivity.  The Node.js "path" API naively assumes that all Windows paths are case-insensitive,
     * and that all other OS's are case-sensitive.  This is way off, for example a modern MacBook has a
     * case-insensitive filesystem by default.  There isn't an easy workaround because Node.js does not expose
     * the native OS APIs that would give accurate answers.
     *
     * The TypeScript compiler does somewhat better: it performs an empirical test of its own bundle path to see
     * whether it can be read using different case.  If so, it normalizes all paths to lowercase (sometimes with
     * no API for retrieving the real path).  This caused our Path.isUnder() to return incorrect answers because
     * it relies on Node.js path.relative().
     *
     * To solve that problem, Path.ts performs an empirical test similar to what the TypeScript compiler does,
     * and then we adjust path.relative() to be case insensitive if appropriate.
     *
     * @see {@link https://nodejs.org/en/docs/guides/working-with-different-filesystems/}
     */
    static usingCaseSensitive: boolean;
    private static _detectCaseSensitive;
    private static _trimTrailingSlashes;
    private static _relativeCaseInsensitive;
    static relative(from: string, to: string): string;
    static dirname(p: string): string;
    static join(...paths: string[]): string;
    static resolve(...pathSegments: string[]): string;
    static parse(pathString: string): ParsedPath;
    private static _relativePathRegex;
    /**
     * Returns true if "childPath" is located inside the "parentFolderPath" folder
     * or one of its child folders.  Note that "parentFolderPath" is not considered to be
     * under itself.  The "childPath" can refer to any type of file system object.
     *
     * @remarks
     * The indicated file/folder objects are not required to actually exist on disk.
     * For example, "parentFolderPath" is interpreted as a folder name even if it refers to a file.
     * If the paths are relative, they will first be resolved using path.resolve().
     */
    static isUnder(childPath: string, parentFolderPath: string): boolean;
    /**
     * Returns true if `path1` and `path2` refer to the same underlying path.
     *
     * @remarks
     *
     * The comparison is performed using `path.relative()`.
     */
    static isEqual(path1: string, path2: string): boolean;
    /**
     * Replaces Windows-style backslashes with POSIX-style slashes.
     *
     * @remarks
     * POSIX is a registered trademark of the Institute of Electrical and Electronic Engineers, Inc.
     */
    static convertToSlashes(inputPath: string): string;
}
//# sourceMappingURL=Path.d.ts.map