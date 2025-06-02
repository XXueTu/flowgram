(() => {
  var __webpack_modules__ = {
    459: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.callback = exports.promise = void 0;
      const walker_1 = __nccwpck_require__(645);
      function promise(root, options) {
        return new Promise((resolve, reject) => {
          callback(root, options, (err, output) => {
            if (err) return reject(err);
            resolve(output);
          });
        });
      }
      exports.promise = promise;
      function callback(root, options, callback) {
        let walker = new walker_1.Walker(root, options, callback);
        walker.start();
      }
      exports.callback = callback;
    },
    963: (__unused_webpack_module, exports) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Counter = void 0;
      class Counter {
        _files = 0;
        _directories = 0;
        set files(num) {
          this._files = num;
        }
        get files() {
          return this._files;
        }
        set directories(num) {
          this._directories = num;
        }
        get directories() {
          return this._directories;
        }
        get dirs() {
          return this._directories;
        }
      }
      exports.Counter = Counter;
    },
    693: (__unused_webpack_module, exports) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.build = void 0;
      const getArray = (paths) => paths;
      const getArrayGroup = () => [""].slice(0, 0);
      function build(options) {
        return options.group ? getArrayGroup : getArray;
      }
      exports.build = build;
    },
    140: (__unused_webpack_module, exports) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.build = void 0;
      const groupFiles = (groups, directory, files) => {
        groups.push({ directory, files, dir: directory });
      };
      const empty = () => {};
      function build(options) {
        return options.group ? groupFiles : empty;
      }
      exports.build = build;
    },
    97: (__unused_webpack_module, exports) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.build = void 0;
      const onlyCountsSync = (state) => state.counts;
      const groupsSync = (state) => state.groups;
      const defaultSync = (state) => state.paths;
      const limitFilesSync = (state) =>
        state.paths.slice(0, state.options.maxFiles);
      const onlyCountsAsync = (state, error, callback) => {
        report(error, callback, state.counts, state.options.suppressErrors);
        return null;
      };
      const defaultAsync = (state, error, callback) => {
        report(error, callback, state.paths, state.options.suppressErrors);
        return null;
      };
      const limitFilesAsync = (state, error, callback) => {
        report(
          error,
          callback,
          state.paths.slice(0, state.options.maxFiles),
          state.options.suppressErrors,
        );
        return null;
      };
      const groupsAsync = (state, error, callback) => {
        report(error, callback, state.groups, state.options.suppressErrors);
        return null;
      };
      function report(error, callback, output, suppressErrors) {
        if (error && !suppressErrors) callback(error, output);
        else callback(null, output);
      }
      function build(options, isSynchronous) {
        const { onlyCounts, group, maxFiles } = options;
        if (onlyCounts) return isSynchronous ? onlyCountsSync : onlyCountsAsync;
        else if (group) return isSynchronous ? groupsSync : groupsAsync;
        else if (maxFiles)
          return isSynchronous ? limitFilesSync : limitFilesAsync;
        else return isSynchronous ? defaultSync : defaultAsync;
      }
      exports.build = build;
    },
    541: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.build =
        exports.joinDirectoryPath =
        exports.joinPathWithBasePath =
          void 0;
      const path_1 = __nccwpck_require__(928);
      const utils_1 = __nccwpck_require__(281);
      function joinPathWithBasePath(filename, directoryPath) {
        return directoryPath + filename;
      }
      exports.joinPathWithBasePath = joinPathWithBasePath;
      function joinPathWithRelativePath(root, options) {
        return function (filename, directoryPath) {
          const sameRoot = directoryPath.startsWith(root);
          if (sameRoot) return directoryPath.replace(root, "") + filename;
          else
            return (
              (0, utils_1.convertSlashes)(
                (0, path_1.relative)(root, directoryPath),
                options.pathSeparator,
              ) +
              options.pathSeparator +
              filename
            );
        };
      }
      function joinPath(filename) {
        return filename;
      }
      function joinDirectoryPath(filename, directoryPath, separator) {
        return directoryPath + filename + separator;
      }
      exports.joinDirectoryPath = joinDirectoryPath;
      function build(root, options) {
        const { relativePaths, includeBasePath } = options;
        return relativePaths && root
          ? joinPathWithRelativePath(root, options)
          : includeBasePath
            ? joinPathWithBasePath
            : joinPath;
      }
      exports.build = build;
    },
    143: (__unused_webpack_module, exports) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.build = void 0;
      function pushDirectoryWithRelativePath(root) {
        return function (directoryPath, paths) {
          paths.push(directoryPath.substring(root.length) || ".");
        };
      }
      function pushDirectoryFilterWithRelativePath(root) {
        return function (directoryPath, paths, filters) {
          const relativePath = directoryPath.substring(root.length) || ".";
          if (filters.every((filter) => filter(relativePath, true))) {
            paths.push(relativePath);
          }
        };
      }
      const pushDirectory = (directoryPath, paths) => {
        paths.push(directoryPath || ".");
      };
      const pushDirectoryFilter = (directoryPath, paths, filters) => {
        const path = directoryPath || ".";
        if (filters.every((filter) => filter(path, true))) {
          paths.push(path);
        }
      };
      const empty = () => {};
      function build(root, options) {
        const { includeDirs, filters, relativePaths } = options;
        if (!includeDirs) return empty;
        if (relativePaths)
          return filters && filters.length
            ? pushDirectoryFilterWithRelativePath(root)
            : pushDirectoryWithRelativePath(root);
        return filters && filters.length ? pushDirectoryFilter : pushDirectory;
      }
      exports.build = build;
    },
    368: (__unused_webpack_module, exports) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.build = void 0;
      const pushFileFilterAndCount = (filename, _paths, counts, filters) => {
        if (filters.every((filter) => filter(filename, false))) counts.files++;
      };
      const pushFileFilter = (filename, paths, _counts, filters) => {
        if (filters.every((filter) => filter(filename, false)))
          paths.push(filename);
      };
      const pushFileCount = (_filename, _paths, counts, _filters) => {
        counts.files++;
      };
      const pushFile = (filename, paths) => {
        paths.push(filename);
      };
      const empty = () => {};
      function build(options) {
        const { excludeFiles, filters, onlyCounts } = options;
        if (excludeFiles) return empty;
        if (filters && filters.length) {
          return onlyCounts ? pushFileFilterAndCount : pushFileFilter;
        } else if (onlyCounts) {
          return pushFileCount;
        } else {
          return pushFile;
        }
      }
      exports.build = build;
    },
    267: function (__unused_webpack_module, exports, __nccwpck_require__) {
      "use strict";
      var __importDefault =
        (this && this.__importDefault) ||
        function (mod) {
          return mod && mod.__esModule ? mod : { default: mod };
        };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.build = void 0;
      const fs_1 = __importDefault(__nccwpck_require__(896));
      const path_1 = __nccwpck_require__(928);
      const resolveSymlinksAsync = function (path, state, callback) {
        const {
          queue,
          options: { suppressErrors },
        } = state;
        queue.enqueue();
        fs_1.default.realpath(path, (error, resolvedPath) => {
          if (error) return queue.dequeue(suppressErrors ? null : error, state);
          fs_1.default.stat(resolvedPath, (error, stat) => {
            if (error)
              return queue.dequeue(suppressErrors ? null : error, state);
            if (stat.isDirectory() && isRecursive(path, resolvedPath, state))
              return queue.dequeue(null, state);
            callback(stat, resolvedPath);
            queue.dequeue(null, state);
          });
        });
      };
      const resolveSymlinks = function (path, state, callback) {
        const {
          queue,
          options: { suppressErrors },
        } = state;
        queue.enqueue();
        try {
          const resolvedPath = fs_1.default.realpathSync(path);
          const stat = fs_1.default.statSync(resolvedPath);
          if (stat.isDirectory() && isRecursive(path, resolvedPath, state))
            return;
          callback(stat, resolvedPath);
        } catch (e) {
          if (!suppressErrors) throw e;
        }
      };
      function build(options, isSynchronous) {
        if (!options.resolveSymlinks || options.excludeSymlinks) return null;
        return isSynchronous ? resolveSymlinks : resolveSymlinksAsync;
      }
      exports.build = build;
      function isRecursive(path, resolved, state) {
        if (state.options.useRealPaths)
          return isRecursiveUsingRealPaths(resolved, state);
        let parent = (0, path_1.dirname)(path);
        let depth = 1;
        while (parent !== state.root && depth < 2) {
          const resolvedPath = state.symlinks.get(parent);
          const isSameRoot =
            !!resolvedPath &&
            (resolvedPath === resolved ||
              resolvedPath.startsWith(resolved) ||
              resolved.startsWith(resolvedPath));
          if (isSameRoot) depth++;
          else parent = (0, path_1.dirname)(parent);
        }
        state.symlinks.set(path, resolved);
        return depth > 1;
      }
      function isRecursiveUsingRealPaths(resolved, state) {
        return state.visited.includes(resolved + state.options.pathSeparator);
      }
    },
    642: function (__unused_webpack_module, exports, __nccwpck_require__) {
      "use strict";
      var __importDefault =
        (this && this.__importDefault) ||
        function (mod) {
          return mod && mod.__esModule ? mod : { default: mod };
        };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.build = void 0;
      const fs_1 = __importDefault(__nccwpck_require__(896));
      const readdirOpts = { withFileTypes: true };
      const walkAsync = (
        state,
        crawlPath,
        directoryPath,
        currentDepth,
        callback,
      ) => {
        if (currentDepth < 0) return state.queue.dequeue(null, state);
        state.visited.push(crawlPath);
        state.counts.directories++;
        state.queue.enqueue();
        fs_1.default.readdir(
          crawlPath || ".",
          readdirOpts,
          (error, entries = []) => {
            callback(entries, directoryPath, currentDepth);
            state.queue.dequeue(
              state.options.suppressErrors ? null : error,
              state,
            );
          },
        );
      };
      const walkSync = (
        state,
        crawlPath,
        directoryPath,
        currentDepth,
        callback,
      ) => {
        if (currentDepth < 0) return;
        state.visited.push(crawlPath);
        state.counts.directories++;
        let entries = [];
        try {
          entries = fs_1.default.readdirSync(crawlPath || ".", readdirOpts);
        } catch (e) {
          if (!state.options.suppressErrors) throw e;
        }
        callback(entries, directoryPath, currentDepth);
      };
      function build(isSynchronous) {
        return isSynchronous ? walkSync : walkAsync;
      }
      exports.build = build;
    },
    388: (__unused_webpack_module, exports) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Queue = void 0;
      class Queue {
        onQueueEmpty;
        count = 0;
        constructor(onQueueEmpty) {
          this.onQueueEmpty = onQueueEmpty;
        }
        enqueue() {
          this.count++;
        }
        dequeue(error, output) {
          if (--this.count <= 0 || error) this.onQueueEmpty(error, output);
        }
      }
      exports.Queue = Queue;
    },
    192: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.sync = void 0;
      const walker_1 = __nccwpck_require__(645);
      function sync(root, options) {
        const walker = new walker_1.Walker(root, options);
        return walker.start();
      }
      exports.sync = sync;
    },
    645: function (__unused_webpack_module, exports, __nccwpck_require__) {
      "use strict";
      var __createBinding =
        (this && this.__createBinding) ||
        (Object.create
          ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              var desc = Object.getOwnPropertyDescriptor(m, k);
              if (
                !desc ||
                ("get" in desc
                  ? !m.__esModule
                  : desc.writable || desc.configurable)
              ) {
                desc = {
                  enumerable: true,
                  get: function () {
                    return m[k];
                  },
                };
              }
              Object.defineProperty(o, k2, desc);
            }
          : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              o[k2] = m[k];
            });
      var __setModuleDefault =
        (this && this.__setModuleDefault) ||
        (Object.create
          ? function (o, v) {
              Object.defineProperty(o, "default", {
                enumerable: true,
                value: v,
              });
            }
          : function (o, v) {
              o["default"] = v;
            });
      var __importStar =
        (this && this.__importStar) ||
        function (mod) {
          if (mod && mod.__esModule) return mod;
          var result = {};
          if (mod != null)
            for (var k in mod)
              if (
                k !== "default" &&
                Object.prototype.hasOwnProperty.call(mod, k)
              )
                __createBinding(result, mod, k);
          __setModuleDefault(result, mod);
          return result;
        };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Walker = void 0;
      const path_1 = __nccwpck_require__(928);
      const utils_1 = __nccwpck_require__(281);
      const joinPath = __importStar(__nccwpck_require__(541));
      const pushDirectory = __importStar(__nccwpck_require__(143));
      const pushFile = __importStar(__nccwpck_require__(368));
      const getArray = __importStar(__nccwpck_require__(693));
      const groupFiles = __importStar(__nccwpck_require__(140));
      const resolveSymlink = __importStar(__nccwpck_require__(267));
      const invokeCallback = __importStar(__nccwpck_require__(97));
      const walkDirectory = __importStar(__nccwpck_require__(642));
      const queue_1 = __nccwpck_require__(388);
      const counter_1 = __nccwpck_require__(963);
      class Walker {
        root;
        isSynchronous;
        state;
        joinPath;
        pushDirectory;
        pushFile;
        getArray;
        groupFiles;
        resolveSymlink;
        walkDirectory;
        callbackInvoker;
        constructor(root, options, callback) {
          this.isSynchronous = !callback;
          this.callbackInvoker = invokeCallback.build(
            options,
            this.isSynchronous,
          );
          this.root = (0, utils_1.normalizePath)(root, options);
          this.state = {
            root: (0, utils_1.isRootDirectory)(this.root)
              ? this.root
              : this.root.slice(0, -1),
            paths: [""].slice(0, 0),
            groups: [],
            counts: new counter_1.Counter(),
            options,
            queue: new queue_1.Queue((error, state) =>
              this.callbackInvoker(state, error, callback),
            ),
            symlinks: new Map(),
            visited: [""].slice(0, 0),
          };
          this.joinPath = joinPath.build(this.root, options);
          this.pushDirectory = pushDirectory.build(this.root, options);
          this.pushFile = pushFile.build(options);
          this.getArray = getArray.build(options);
          this.groupFiles = groupFiles.build(options);
          this.resolveSymlink = resolveSymlink.build(
            options,
            this.isSynchronous,
          );
          this.walkDirectory = walkDirectory.build(this.isSynchronous);
        }
        start() {
          this.walkDirectory(
            this.state,
            this.root,
            this.root,
            this.state.options.maxDepth,
            this.walk,
          );
          return this.isSynchronous
            ? this.callbackInvoker(this.state, null)
            : null;
        }
        walk = (entries, directoryPath, depth) => {
          const {
            paths,
            options: {
              filters,
              resolveSymlinks,
              excludeSymlinks,
              exclude,
              maxFiles,
              signal,
              useRealPaths,
              pathSeparator,
            },
          } = this.state;
          if (
            (signal && signal.aborted) ||
            (maxFiles && paths.length > maxFiles)
          )
            return;
          this.pushDirectory(directoryPath, paths, filters);
          const files = this.getArray(this.state.paths);
          for (let i = 0; i < entries.length; ++i) {
            const entry = entries[i];
            if (
              entry.isFile() ||
              (entry.isSymbolicLink() && !resolveSymlinks && !excludeSymlinks)
            ) {
              const filename = this.joinPath(entry.name, directoryPath);
              this.pushFile(filename, files, this.state.counts, filters);
            } else if (entry.isDirectory()) {
              let path = joinPath.joinDirectoryPath(
                entry.name,
                directoryPath,
                this.state.options.pathSeparator,
              );
              if (exclude && exclude(entry.name, path)) continue;
              this.walkDirectory(this.state, path, path, depth - 1, this.walk);
            } else if (entry.isSymbolicLink() && this.resolveSymlink) {
              let path = joinPath.joinPathWithBasePath(
                entry.name,
                directoryPath,
              );
              this.resolveSymlink(path, this.state, (stat, resolvedPath) => {
                if (stat.isDirectory()) {
                  resolvedPath = (0, utils_1.normalizePath)(
                    resolvedPath,
                    this.state.options,
                  );
                  if (
                    exclude &&
                    exclude(
                      entry.name,
                      useRealPaths ? resolvedPath : path + pathSeparator,
                    )
                  )
                    return;
                  this.walkDirectory(
                    this.state,
                    resolvedPath,
                    useRealPaths ? resolvedPath : path + pathSeparator,
                    depth - 1,
                    this.walk,
                  );
                } else {
                  resolvedPath = useRealPaths ? resolvedPath : path;
                  const filename = (0, path_1.basename)(resolvedPath);
                  const directoryPath = (0, utils_1.normalizePath)(
                    (0, path_1.dirname)(resolvedPath),
                    this.state.options,
                  );
                  resolvedPath = this.joinPath(filename, directoryPath);
                  this.pushFile(
                    resolvedPath,
                    files,
                    this.state.counts,
                    filters,
                  );
                }
              });
            }
          }
          this.groupFiles(this.state.groups, directoryPath, files);
        };
      }
      exports.Walker = Walker;
    },
    250: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.APIBuilder = void 0;
      const async_1 = __nccwpck_require__(459);
      const sync_1 = __nccwpck_require__(192);
      class APIBuilder {
        root;
        options;
        constructor(root, options) {
          this.root = root;
          this.options = options;
        }
        withPromise() {
          return (0, async_1.promise)(this.root, this.options);
        }
        withCallback(cb) {
          (0, async_1.callback)(this.root, this.options, cb);
        }
        sync() {
          return (0, sync_1.sync)(this.root, this.options);
        }
      }
      exports.APIBuilder = APIBuilder;
    },
    256: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Builder = void 0;
      const path_1 = __nccwpck_require__(928);
      const api_builder_1 = __nccwpck_require__(250);
      var pm = null;
      try {
        __nccwpck_require__.ab + "index1.js";
        pm = __nccwpck_require__(976);
      } catch (_e) {}
      class Builder {
        globCache = {};
        options = {
          maxDepth: Infinity,
          suppressErrors: true,
          pathSeparator: path_1.sep,
          filters: [],
        };
        globFunction;
        constructor(options) {
          this.options = { ...this.options, ...options };
          this.globFunction = this.options.globFunction;
        }
        group() {
          this.options.group = true;
          return this;
        }
        withPathSeparator(separator) {
          this.options.pathSeparator = separator;
          return this;
        }
        withBasePath() {
          this.options.includeBasePath = true;
          return this;
        }
        withRelativePaths() {
          this.options.relativePaths = true;
          return this;
        }
        withDirs() {
          this.options.includeDirs = true;
          return this;
        }
        withMaxDepth(depth) {
          this.options.maxDepth = depth;
          return this;
        }
        withMaxFiles(limit) {
          this.options.maxFiles = limit;
          return this;
        }
        withFullPaths() {
          this.options.resolvePaths = true;
          this.options.includeBasePath = true;
          return this;
        }
        withErrors() {
          this.options.suppressErrors = false;
          return this;
        }
        withSymlinks({ resolvePaths = true } = {}) {
          this.options.resolveSymlinks = true;
          this.options.useRealPaths = resolvePaths;
          return this.withFullPaths();
        }
        withAbortSignal(signal) {
          this.options.signal = signal;
          return this;
        }
        normalize() {
          this.options.normalizePath = true;
          return this;
        }
        filter(predicate) {
          this.options.filters.push(predicate);
          return this;
        }
        onlyDirs() {
          this.options.excludeFiles = true;
          this.options.includeDirs = true;
          return this;
        }
        exclude(predicate) {
          this.options.exclude = predicate;
          return this;
        }
        onlyCounts() {
          this.options.onlyCounts = true;
          return this;
        }
        crawl(root) {
          return new api_builder_1.APIBuilder(root || ".", this.options);
        }
        withGlobFunction(fn) {
          this.globFunction = fn;
          return this;
        }
        crawlWithOptions(root, options) {
          this.options = { ...this.options, ...options };
          return new api_builder_1.APIBuilder(root || ".", this.options);
        }
        glob(...patterns) {
          if (this.globFunction) {
            return this.globWithOptions(patterns);
          }
          return this.globWithOptions(patterns, ...[{ dot: true }]);
        }
        globWithOptions(patterns, ...options) {
          const globFn = this.globFunction || pm;
          if (!globFn) {
            throw new Error(
              "Please specify a glob function to use glob matching.",
            );
          }
          var isMatch = this.globCache[patterns.join("\0")];
          if (!isMatch) {
            isMatch = globFn(patterns, ...options);
            this.globCache[patterns.join("\0")] = isMatch;
          }
          this.options.filters.push((path) => isMatch(path));
          return this;
        }
      }
      exports.Builder = Builder;
    },
    648: function (__unused_webpack_module, exports, __nccwpck_require__) {
      "use strict";
      var __createBinding =
        (this && this.__createBinding) ||
        (Object.create
          ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              var desc = Object.getOwnPropertyDescriptor(m, k);
              if (
                !desc ||
                ("get" in desc
                  ? !m.__esModule
                  : desc.writable || desc.configurable)
              ) {
                desc = {
                  enumerable: true,
                  get: function () {
                    return m[k];
                  },
                };
              }
              Object.defineProperty(o, k2, desc);
            }
          : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              o[k2] = m[k];
            });
      var __exportStar =
        (this && this.__exportStar) ||
        function (m, exports) {
          for (var p in m)
            if (
              p !== "default" &&
              !Object.prototype.hasOwnProperty.call(exports, p)
            )
              __createBinding(exports, m, p);
        };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.fdir = void 0;
      const builder_1 = __nccwpck_require__(256);
      Object.defineProperty(exports, "fdir", {
        enumerable: true,
        get: function () {
          return builder_1.Builder;
        },
      });
      __exportStar(__nccwpck_require__(205), exports);
    },
    205: (__unused_webpack_module, exports) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
    },
    281: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.normalizePath =
        exports.isRootDirectory =
        exports.convertSlashes =
        exports.cleanPath =
          void 0;
      const path_1 = __nccwpck_require__(928);
      function cleanPath(path) {
        let normalized = (0, path_1.normalize)(path);
        if (
          normalized.length > 1 &&
          normalized[normalized.length - 1] === path_1.sep
        )
          normalized = normalized.substring(0, normalized.length - 1);
        return normalized;
      }
      exports.cleanPath = cleanPath;
      const SLASHES_REGEX = /[\\/]/g;
      function convertSlashes(path, separator) {
        return path.replace(SLASHES_REGEX, separator);
      }
      exports.convertSlashes = convertSlashes;
      function isRootDirectory(path) {
        return path === "/" || /^[a-z]:\\$/i.test(path);
      }
      exports.isRootDirectory = isRootDirectory;
      function normalizePath(path, options) {
        const { resolvePaths, normalizePath, pathSeparator } = options;
        const pathNeedsCleaning =
          (process.platform === "win32" && path.includes("/")) ||
          path.startsWith(".");
        if (resolvePaths) path = (0, path_1.resolve)(path);
        if (normalizePath || pathNeedsCleaning) path = cleanPath(path);
        if (path === ".") return "";
        const needsSeperator = path[path.length - 1] !== pathSeparator;
        return convertSlashes(
          needsSeperator ? path + pathSeparator : path,
          pathSeparator,
        );
      }
      exports.normalizePath = normalizePath;
    },
    976: (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      const pico = __nccwpck_require__(106);
      const utils = __nccwpck_require__(949);
      function picomatch(glob, options, returnState = false) {
        if (
          options &&
          (options.windows === null || options.windows === undefined)
        ) {
          options = { ...options, windows: utils.isWindows() };
        }
        return pico(glob, options, returnState);
      }
      Object.assign(picomatch, pico);
      module.exports = picomatch;
    },
    425: (module) => {
      "use strict";
      const WIN_SLASH = "\\\\/";
      const WIN_NO_SLASH = `[^${WIN_SLASH}]`;
      const DOT_LITERAL = "\\.";
      const PLUS_LITERAL = "\\+";
      const QMARK_LITERAL = "\\?";
      const SLASH_LITERAL = "\\/";
      const ONE_CHAR = "(?=.)";
      const QMARK = "[^/]";
      const END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
      const START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
      const DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
      const NO_DOT = `(?!${DOT_LITERAL})`;
      const NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
      const NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
      const NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
      const QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
      const STAR = `${QMARK}*?`;
      const SEP = "/";
      const POSIX_CHARS = {
        DOT_LITERAL,
        PLUS_LITERAL,
        QMARK_LITERAL,
        SLASH_LITERAL,
        ONE_CHAR,
        QMARK,
        END_ANCHOR,
        DOTS_SLASH,
        NO_DOT,
        NO_DOTS,
        NO_DOT_SLASH,
        NO_DOTS_SLASH,
        QMARK_NO_DOT,
        STAR,
        START_ANCHOR,
        SEP,
      };
      const WINDOWS_CHARS = {
        ...POSIX_CHARS,
        SLASH_LITERAL: `[${WIN_SLASH}]`,
        QMARK: WIN_NO_SLASH,
        STAR: `${WIN_NO_SLASH}*?`,
        DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
        NO_DOT: `(?!${DOT_LITERAL})`,
        NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
        NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
        NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
        QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
        START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
        END_ANCHOR: `(?:[${WIN_SLASH}]|$)`,
        SEP: "\\",
      };
      const POSIX_REGEX_SOURCE = {
        alnum: "a-zA-Z0-9",
        alpha: "a-zA-Z",
        ascii: "\\x00-\\x7F",
        blank: " \\t",
        cntrl: "\\x00-\\x1F\\x7F",
        digit: "0-9",
        graph: "\\x21-\\x7E",
        lower: "a-z",
        print: "\\x20-\\x7E ",
        punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
        space: " \\t\\r\\n\\v\\f",
        upper: "A-Z",
        word: "A-Za-z0-9_",
        xdigit: "A-Fa-f0-9",
      };
      module.exports = {
        MAX_LENGTH: 1024 * 64,
        POSIX_REGEX_SOURCE,
        REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
        REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
        REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
        REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
        REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
        REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
        REPLACEMENTS: { "***": "*", "**/**": "**", "**/**/**": "**" },
        CHAR_0: 48,
        CHAR_9: 57,
        CHAR_UPPERCASE_A: 65,
        CHAR_LOWERCASE_A: 97,
        CHAR_UPPERCASE_Z: 90,
        CHAR_LOWERCASE_Z: 122,
        CHAR_LEFT_PARENTHESES: 40,
        CHAR_RIGHT_PARENTHESES: 41,
        CHAR_ASTERISK: 42,
        CHAR_AMPERSAND: 38,
        CHAR_AT: 64,
        CHAR_BACKWARD_SLASH: 92,
        CHAR_CARRIAGE_RETURN: 13,
        CHAR_CIRCUMFLEX_ACCENT: 94,
        CHAR_COLON: 58,
        CHAR_COMMA: 44,
        CHAR_DOT: 46,
        CHAR_DOUBLE_QUOTE: 34,
        CHAR_EQUAL: 61,
        CHAR_EXCLAMATION_MARK: 33,
        CHAR_FORM_FEED: 12,
        CHAR_FORWARD_SLASH: 47,
        CHAR_GRAVE_ACCENT: 96,
        CHAR_HASH: 35,
        CHAR_HYPHEN_MINUS: 45,
        CHAR_LEFT_ANGLE_BRACKET: 60,
        CHAR_LEFT_CURLY_BRACE: 123,
        CHAR_LEFT_SQUARE_BRACKET: 91,
        CHAR_LINE_FEED: 10,
        CHAR_NO_BREAK_SPACE: 160,
        CHAR_PERCENT: 37,
        CHAR_PLUS: 43,
        CHAR_QUESTION_MARK: 63,
        CHAR_RIGHT_ANGLE_BRACKET: 62,
        CHAR_RIGHT_CURLY_BRACE: 125,
        CHAR_RIGHT_SQUARE_BRACKET: 93,
        CHAR_SEMICOLON: 59,
        CHAR_SINGLE_QUOTE: 39,
        CHAR_SPACE: 32,
        CHAR_TAB: 9,
        CHAR_UNDERSCORE: 95,
        CHAR_VERTICAL_LINE: 124,
        CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
        extglobChars(chars) {
          return {
            "!": {
              type: "negate",
              open: "(?:(?!(?:",
              close: `))${chars.STAR})`,
            },
            "?": { type: "qmark", open: "(?:", close: ")?" },
            "+": { type: "plus", open: "(?:", close: ")+" },
            "*": { type: "star", open: "(?:", close: ")*" },
            "@": { type: "at", open: "(?:", close: ")" },
          };
        },
        globChars(win32) {
          return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
        },
      };
    },
    775: (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      const constants = __nccwpck_require__(425);
      const utils = __nccwpck_require__(949);
      const {
        MAX_LENGTH,
        POSIX_REGEX_SOURCE,
        REGEX_NON_SPECIAL_CHARS,
        REGEX_SPECIAL_CHARS_BACKREF,
        REPLACEMENTS,
      } = constants;
      const expandRange = (args, options) => {
        if (typeof options.expandRange === "function") {
          return options.expandRange(...args, options);
        }
        args.sort();
        const value = `[${args.join("-")}]`;
        try {
          new RegExp(value);
        } catch (ex) {
          return args.map((v) => utils.escapeRegex(v)).join("..");
        }
        return value;
      };
      const syntaxError = (type, char) =>
        `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
      const parse = (input, options) => {
        if (typeof input !== "string") {
          throw new TypeError("Expected a string");
        }
        input = REPLACEMENTS[input] || input;
        const opts = { ...options };
        const max =
          typeof opts.maxLength === "number"
            ? Math.min(MAX_LENGTH, opts.maxLength)
            : MAX_LENGTH;
        let len = input.length;
        if (len > max) {
          throw new SyntaxError(
            `Input length: ${len}, exceeds maximum allowed length: ${max}`,
          );
        }
        const bos = { type: "bos", value: "", output: opts.prepend || "" };
        const tokens = [bos];
        const capture = opts.capture ? "" : "?:";
        const PLATFORM_CHARS = constants.globChars(opts.windows);
        const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);
        const {
          DOT_LITERAL,
          PLUS_LITERAL,
          SLASH_LITERAL,
          ONE_CHAR,
          DOTS_SLASH,
          NO_DOT,
          NO_DOT_SLASH,
          NO_DOTS_SLASH,
          QMARK,
          QMARK_NO_DOT,
          STAR,
          START_ANCHOR,
        } = PLATFORM_CHARS;
        const globstar = (opts) =>
          `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
        const nodot = opts.dot ? "" : NO_DOT;
        const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
        let star = opts.bash === true ? globstar(opts) : STAR;
        if (opts.capture) {
          star = `(${star})`;
        }
        if (typeof opts.noext === "boolean") {
          opts.noextglob = opts.noext;
        }
        const state = {
          input,
          index: -1,
          start: 0,
          dot: opts.dot === true,
          consumed: "",
          output: "",
          prefix: "",
          backtrack: false,
          negated: false,
          brackets: 0,
          braces: 0,
          parens: 0,
          quotes: 0,
          globstar: false,
          tokens,
        };
        input = utils.removePrefix(input, state);
        len = input.length;
        const extglobs = [];
        const braces = [];
        const stack = [];
        let prev = bos;
        let value;
        const eos = () => state.index === len - 1;
        const peek = (state.peek = (n = 1) => input[state.index + n]);
        const advance = (state.advance = () => input[++state.index] || "");
        const remaining = () => input.slice(state.index + 1);
        const consume = (value = "", num = 0) => {
          state.consumed += value;
          state.index += num;
        };
        const append = (token) => {
          state.output += token.output != null ? token.output : token.value;
          consume(token.value);
        };
        const negate = () => {
          let count = 1;
          while (peek() === "!" && (peek(2) !== "(" || peek(3) === "?")) {
            advance();
            state.start++;
            count++;
          }
          if (count % 2 === 0) {
            return false;
          }
          state.negated = true;
          state.start++;
          return true;
        };
        const increment = (type) => {
          state[type]++;
          stack.push(type);
        };
        const decrement = (type) => {
          state[type]--;
          stack.pop();
        };
        const push = (tok) => {
          if (prev.type === "globstar") {
            const isBrace =
              state.braces > 0 &&
              (tok.type === "comma" || tok.type === "brace");
            const isExtglob =
              tok.extglob === true ||
              (extglobs.length &&
                (tok.type === "pipe" || tok.type === "paren"));
            if (
              tok.type !== "slash" &&
              tok.type !== "paren" &&
              !isBrace &&
              !isExtglob
            ) {
              state.output = state.output.slice(0, -prev.output.length);
              prev.type = "star";
              prev.value = "*";
              prev.output = star;
              state.output += prev.output;
            }
          }
          if (extglobs.length && tok.type !== "paren") {
            extglobs[extglobs.length - 1].inner += tok.value;
          }
          if (tok.value || tok.output) append(tok);
          if (prev && prev.type === "text" && tok.type === "text") {
            prev.output = (prev.output || prev.value) + tok.value;
            prev.value += tok.value;
            return;
          }
          tok.prev = prev;
          tokens.push(tok);
          prev = tok;
        };
        const extglobOpen = (type, value) => {
          const token = { ...EXTGLOB_CHARS[value], conditions: 1, inner: "" };
          token.prev = prev;
          token.parens = state.parens;
          token.output = state.output;
          const output = (opts.capture ? "(" : "") + token.open;
          increment("parens");
          push({ type, value, output: state.output ? "" : ONE_CHAR });
          push({ type: "paren", extglob: true, value: advance(), output });
          extglobs.push(token);
        };
        const extglobClose = (token) => {
          let output = token.close + (opts.capture ? ")" : "");
          let rest;
          if (token.type === "negate") {
            let extglobStar = star;
            if (
              token.inner &&
              token.inner.length > 1 &&
              token.inner.includes("/")
            ) {
              extglobStar = globstar(opts);
            }
            if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) {
              output = token.close = `)$))${extglobStar}`;
            }
            if (
              token.inner.includes("*") &&
              (rest = remaining()) &&
              /^\.[^\\/.]+$/.test(rest)
            ) {
              const expression = parse(rest, {
                ...options,
                fastpaths: false,
              }).output;
              output = token.close = `)${expression})${extglobStar})`;
            }
            if (token.prev.type === "bos") {
              state.negatedExtglob = true;
            }
          }
          push({ type: "paren", extglob: true, value, output });
          decrement("parens");
        };
        if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
          let backslashes = false;
          let output = input.replace(
            REGEX_SPECIAL_CHARS_BACKREF,
            (m, esc, chars, first, rest, index) => {
              if (first === "\\") {
                backslashes = true;
                return m;
              }
              if (first === "?") {
                if (esc) {
                  return esc + first + (rest ? QMARK.repeat(rest.length) : "");
                }
                if (index === 0) {
                  return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : "");
                }
                return QMARK.repeat(chars.length);
              }
              if (first === ".") {
                return DOT_LITERAL.repeat(chars.length);
              }
              if (first === "*") {
                if (esc) {
                  return esc + first + (rest ? star : "");
                }
                return star;
              }
              return esc ? m : `\\${m}`;
            },
          );
          if (backslashes === true) {
            if (opts.unescape === true) {
              output = output.replace(/\\/g, "");
            } else {
              output = output.replace(/\\+/g, (m) =>
                m.length % 2 === 0 ? "\\\\" : m ? "\\" : "",
              );
            }
          }
          if (output === input && opts.contains === true) {
            state.output = input;
            return state;
          }
          state.output = utils.wrapOutput(output, state, options);
          return state;
        }
        while (!eos()) {
          value = advance();
          if (value === "\0") {
            continue;
          }
          if (value === "\\") {
            const next = peek();
            if (next === "/" && opts.bash !== true) {
              continue;
            }
            if (next === "." || next === ";") {
              continue;
            }
            if (!next) {
              value += "\\";
              push({ type: "text", value });
              continue;
            }
            const match = /^\\+/.exec(remaining());
            let slashes = 0;
            if (match && match[0].length > 2) {
              slashes = match[0].length;
              state.index += slashes;
              if (slashes % 2 !== 0) {
                value += "\\";
              }
            }
            if (opts.unescape === true) {
              value = advance();
            } else {
              value += advance();
            }
            if (state.brackets === 0) {
              push({ type: "text", value });
              continue;
            }
          }
          if (
            state.brackets > 0 &&
            (value !== "]" || prev.value === "[" || prev.value === "[^")
          ) {
            if (opts.posix !== false && value === ":") {
              const inner = prev.value.slice(1);
              if (inner.includes("[")) {
                prev.posix = true;
                if (inner.includes(":")) {
                  const idx = prev.value.lastIndexOf("[");
                  const pre = prev.value.slice(0, idx);
                  const rest = prev.value.slice(idx + 2);
                  const posix = POSIX_REGEX_SOURCE[rest];
                  if (posix) {
                    prev.value = pre + posix;
                    state.backtrack = true;
                    advance();
                    if (!bos.output && tokens.indexOf(prev) === 1) {
                      bos.output = ONE_CHAR;
                    }
                    continue;
                  }
                }
              }
            }
            if (
              (value === "[" && peek() !== ":") ||
              (value === "-" && peek() === "]")
            ) {
              value = `\\${value}`;
            }
            if (value === "]" && (prev.value === "[" || prev.value === "[^")) {
              value = `\\${value}`;
            }
            if (opts.posix === true && value === "!" && prev.value === "[") {
              value = "^";
            }
            prev.value += value;
            append({ value });
            continue;
          }
          if (state.quotes === 1 && value !== '"') {
            value = utils.escapeRegex(value);
            prev.value += value;
            append({ value });
            continue;
          }
          if (value === '"') {
            state.quotes = state.quotes === 1 ? 0 : 1;
            if (opts.keepQuotes === true) {
              push({ type: "text", value });
            }
            continue;
          }
          if (value === "(") {
            increment("parens");
            push({ type: "paren", value });
            continue;
          }
          if (value === ")") {
            if (state.parens === 0 && opts.strictBrackets === true) {
              throw new SyntaxError(syntaxError("opening", "("));
            }
            const extglob = extglobs[extglobs.length - 1];
            if (extglob && state.parens === extglob.parens + 1) {
              extglobClose(extglobs.pop());
              continue;
            }
            push({ type: "paren", value, output: state.parens ? ")" : "\\)" });
            decrement("parens");
            continue;
          }
          if (value === "[") {
            if (opts.nobracket === true || !remaining().includes("]")) {
              if (opts.nobracket !== true && opts.strictBrackets === true) {
                throw new SyntaxError(syntaxError("closing", "]"));
              }
              value = `\\${value}`;
            } else {
              increment("brackets");
            }
            push({ type: "bracket", value });
            continue;
          }
          if (value === "]") {
            if (
              opts.nobracket === true ||
              (prev && prev.type === "bracket" && prev.value.length === 1)
            ) {
              push({ type: "text", value, output: `\\${value}` });
              continue;
            }
            if (state.brackets === 0) {
              if (opts.strictBrackets === true) {
                throw new SyntaxError(syntaxError("opening", "["));
              }
              push({ type: "text", value, output: `\\${value}` });
              continue;
            }
            decrement("brackets");
            const prevValue = prev.value.slice(1);
            if (
              prev.posix !== true &&
              prevValue[0] === "^" &&
              !prevValue.includes("/")
            ) {
              value = `/${value}`;
            }
            prev.value += value;
            append({ value });
            if (
              opts.literalBrackets === false ||
              utils.hasRegexChars(prevValue)
            ) {
              continue;
            }
            const escaped = utils.escapeRegex(prev.value);
            state.output = state.output.slice(0, -prev.value.length);
            if (opts.literalBrackets === true) {
              state.output += escaped;
              prev.value = escaped;
              continue;
            }
            prev.value = `(${capture}${escaped}|${prev.value})`;
            state.output += prev.value;
            continue;
          }
          if (value === "{" && opts.nobrace !== true) {
            increment("braces");
            const open = {
              type: "brace",
              value,
              output: "(",
              outputIndex: state.output.length,
              tokensIndex: state.tokens.length,
            };
            braces.push(open);
            push(open);
            continue;
          }
          if (value === "}") {
            const brace = braces[braces.length - 1];
            if (opts.nobrace === true || !brace) {
              push({ type: "text", value, output: value });
              continue;
            }
            let output = ")";
            if (brace.dots === true) {
              const arr = tokens.slice();
              const range = [];
              for (let i = arr.length - 1; i >= 0; i--) {
                tokens.pop();
                if (arr[i].type === "brace") {
                  break;
                }
                if (arr[i].type !== "dots") {
                  range.unshift(arr[i].value);
                }
              }
              output = expandRange(range, opts);
              state.backtrack = true;
            }
            if (brace.comma !== true && brace.dots !== true) {
              const out = state.output.slice(0, brace.outputIndex);
              const toks = state.tokens.slice(brace.tokensIndex);
              brace.value = brace.output = "\\{";
              value = output = "\\}";
              state.output = out;
              for (const t of toks) {
                state.output += t.output || t.value;
              }
            }
            push({ type: "brace", value, output });
            decrement("braces");
            braces.pop();
            continue;
          }
          if (value === "|") {
            if (extglobs.length > 0) {
              extglobs[extglobs.length - 1].conditions++;
            }
            push({ type: "text", value });
            continue;
          }
          if (value === ",") {
            let output = value;
            const brace = braces[braces.length - 1];
            if (brace && stack[stack.length - 1] === "braces") {
              brace.comma = true;
              output = "|";
            }
            push({ type: "comma", value, output });
            continue;
          }
          if (value === "/") {
            if (prev.type === "dot" && state.index === state.start + 1) {
              state.start = state.index + 1;
              state.consumed = "";
              state.output = "";
              tokens.pop();
              prev = bos;
              continue;
            }
            push({ type: "slash", value, output: SLASH_LITERAL });
            continue;
          }
          if (value === ".") {
            if (state.braces > 0 && prev.type === "dot") {
              if (prev.value === ".") prev.output = DOT_LITERAL;
              const brace = braces[braces.length - 1];
              prev.type = "dots";
              prev.output += value;
              prev.value += value;
              brace.dots = true;
              continue;
            }
            if (
              state.braces + state.parens === 0 &&
              prev.type !== "bos" &&
              prev.type !== "slash"
            ) {
              push({ type: "text", value, output: DOT_LITERAL });
              continue;
            }
            push({ type: "dot", value, output: DOT_LITERAL });
            continue;
          }
          if (value === "?") {
            const isGroup = prev && prev.value === "(";
            if (
              !isGroup &&
              opts.noextglob !== true &&
              peek() === "(" &&
              peek(2) !== "?"
            ) {
              extglobOpen("qmark", value);
              continue;
            }
            if (prev && prev.type === "paren") {
              const next = peek();
              let output = value;
              if (
                (prev.value === "(" && !/[!=<:]/.test(next)) ||
                (next === "<" && !/<([!=]|\w+>)/.test(remaining()))
              ) {
                output = `\\${value}`;
              }
              push({ type: "text", value, output });
              continue;
            }
            if (
              opts.dot !== true &&
              (prev.type === "slash" || prev.type === "bos")
            ) {
              push({ type: "qmark", value, output: QMARK_NO_DOT });
              continue;
            }
            push({ type: "qmark", value, output: QMARK });
            continue;
          }
          if (value === "!") {
            if (opts.noextglob !== true && peek() === "(") {
              if (peek(2) !== "?" || !/[!=<:]/.test(peek(3))) {
                extglobOpen("negate", value);
                continue;
              }
            }
            if (opts.nonegate !== true && state.index === 0) {
              negate();
              continue;
            }
          }
          if (value === "+") {
            if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
              extglobOpen("plus", value);
              continue;
            }
            if ((prev && prev.value === "(") || opts.regex === false) {
              push({ type: "plus", value, output: PLUS_LITERAL });
              continue;
            }
            if (
              (prev &&
                (prev.type === "bracket" ||
                  prev.type === "paren" ||
                  prev.type === "brace")) ||
              state.parens > 0
            ) {
              push({ type: "plus", value });
              continue;
            }
            push({ type: "plus", value: PLUS_LITERAL });
            continue;
          }
          if (value === "@") {
            if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
              push({ type: "at", extglob: true, value, output: "" });
              continue;
            }
            push({ type: "text", value });
            continue;
          }
          if (value !== "*") {
            if (value === "$" || value === "^") {
              value = `\\${value}`;
            }
            const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
            if (match) {
              value += match[0];
              state.index += match[0].length;
            }
            push({ type: "text", value });
            continue;
          }
          if (prev && (prev.type === "globstar" || prev.star === true)) {
            prev.type = "star";
            prev.star = true;
            prev.value += value;
            prev.output = star;
            state.backtrack = true;
            state.globstar = true;
            consume(value);
            continue;
          }
          let rest = remaining();
          if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
            extglobOpen("star", value);
            continue;
          }
          if (prev.type === "star") {
            if (opts.noglobstar === true) {
              consume(value);
              continue;
            }
            const prior = prev.prev;
            const before = prior.prev;
            const isStart = prior.type === "slash" || prior.type === "bos";
            const afterStar =
              before && (before.type === "star" || before.type === "globstar");
            if (
              opts.bash === true &&
              (!isStart || (rest[0] && rest[0] !== "/"))
            ) {
              push({ type: "star", value, output: "" });
              continue;
            }
            const isBrace =
              state.braces > 0 &&
              (prior.type === "comma" || prior.type === "brace");
            const isExtglob =
              extglobs.length &&
              (prior.type === "pipe" || prior.type === "paren");
            if (!isStart && prior.type !== "paren" && !isBrace && !isExtglob) {
              push({ type: "star", value, output: "" });
              continue;
            }
            while (rest.slice(0, 3) === "/**") {
              const after = input[state.index + 4];
              if (after && after !== "/") {
                break;
              }
              rest = rest.slice(3);
              consume("/**", 3);
            }
            if (prior.type === "bos" && eos()) {
              prev.type = "globstar";
              prev.value += value;
              prev.output = globstar(opts);
              state.output = prev.output;
              state.globstar = true;
              consume(value);
              continue;
            }
            if (
              prior.type === "slash" &&
              prior.prev.type !== "bos" &&
              !afterStar &&
              eos()
            ) {
              state.output = state.output.slice(
                0,
                -(prior.output + prev.output).length,
              );
              prior.output = `(?:${prior.output}`;
              prev.type = "globstar";
              prev.output = globstar(opts) + (opts.strictSlashes ? ")" : "|$)");
              prev.value += value;
              state.globstar = true;
              state.output += prior.output + prev.output;
              consume(value);
              continue;
            }
            if (
              prior.type === "slash" &&
              prior.prev.type !== "bos" &&
              rest[0] === "/"
            ) {
              const end = rest[1] !== void 0 ? "|$" : "";
              state.output = state.output.slice(
                0,
                -(prior.output + prev.output).length,
              );
              prior.output = `(?:${prior.output}`;
              prev.type = "globstar";
              prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
              prev.value += value;
              state.output += prior.output + prev.output;
              state.globstar = true;
              consume(value + advance());
              push({ type: "slash", value: "/", output: "" });
              continue;
            }
            if (prior.type === "bos" && rest[0] === "/") {
              prev.type = "globstar";
              prev.value += value;
              prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
              state.output = prev.output;
              state.globstar = true;
              consume(value + advance());
              push({ type: "slash", value: "/", output: "" });
              continue;
            }
            state.output = state.output.slice(0, -prev.output.length);
            prev.type = "globstar";
            prev.output = globstar(opts);
            prev.value += value;
            state.output += prev.output;
            state.globstar = true;
            consume(value);
            continue;
          }
          const token = { type: "star", value, output: star };
          if (opts.bash === true) {
            token.output = ".*?";
            if (prev.type === "bos" || prev.type === "slash") {
              token.output = nodot + token.output;
            }
            push(token);
            continue;
          }
          if (
            prev &&
            (prev.type === "bracket" || prev.type === "paren") &&
            opts.regex === true
          ) {
            token.output = value;
            push(token);
            continue;
          }
          if (
            state.index === state.start ||
            prev.type === "slash" ||
            prev.type === "dot"
          ) {
            if (prev.type === "dot") {
              state.output += NO_DOT_SLASH;
              prev.output += NO_DOT_SLASH;
            } else if (opts.dot === true) {
              state.output += NO_DOTS_SLASH;
              prev.output += NO_DOTS_SLASH;
            } else {
              state.output += nodot;
              prev.output += nodot;
            }
            if (peek() !== "*") {
              state.output += ONE_CHAR;
              prev.output += ONE_CHAR;
            }
          }
          push(token);
        }
        while (state.brackets > 0) {
          if (opts.strictBrackets === true)
            throw new SyntaxError(syntaxError("closing", "]"));
          state.output = utils.escapeLast(state.output, "[");
          decrement("brackets");
        }
        while (state.parens > 0) {
          if (opts.strictBrackets === true)
            throw new SyntaxError(syntaxError("closing", ")"));
          state.output = utils.escapeLast(state.output, "(");
          decrement("parens");
        }
        while (state.braces > 0) {
          if (opts.strictBrackets === true)
            throw new SyntaxError(syntaxError("closing", "}"));
          state.output = utils.escapeLast(state.output, "{");
          decrement("braces");
        }
        if (
          opts.strictSlashes !== true &&
          (prev.type === "star" || prev.type === "bracket")
        ) {
          push({ type: "maybe_slash", value: "", output: `${SLASH_LITERAL}?` });
        }
        if (state.backtrack === true) {
          state.output = "";
          for (const token of state.tokens) {
            state.output += token.output != null ? token.output : token.value;
            if (token.suffix) {
              state.output += token.suffix;
            }
          }
        }
        return state;
      };
      parse.fastpaths = (input, options) => {
        const opts = { ...options };
        const max =
          typeof opts.maxLength === "number"
            ? Math.min(MAX_LENGTH, opts.maxLength)
            : MAX_LENGTH;
        const len = input.length;
        if (len > max) {
          throw new SyntaxError(
            `Input length: ${len}, exceeds maximum allowed length: ${max}`,
          );
        }
        input = REPLACEMENTS[input] || input;
        const {
          DOT_LITERAL,
          SLASH_LITERAL,
          ONE_CHAR,
          DOTS_SLASH,
          NO_DOT,
          NO_DOTS,
          NO_DOTS_SLASH,
          STAR,
          START_ANCHOR,
        } = constants.globChars(opts.windows);
        const nodot = opts.dot ? NO_DOTS : NO_DOT;
        const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
        const capture = opts.capture ? "" : "?:";
        const state = { negated: false, prefix: "" };
        let star = opts.bash === true ? ".*?" : STAR;
        if (opts.capture) {
          star = `(${star})`;
        }
        const globstar = (opts) => {
          if (opts.noglobstar === true) return star;
          return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
        };
        const create = (str) => {
          switch (str) {
            case "*":
              return `${nodot}${ONE_CHAR}${star}`;
            case ".*":
              return `${DOT_LITERAL}${ONE_CHAR}${star}`;
            case "*.*":
              return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
            case "*/*":
              return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;
            case "**":
              return nodot + globstar(opts);
            case "**/*":
              return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;
            case "**/*.*":
              return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
            case "**/.*":
              return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;
            default: {
              const match = /^(.*?)\.(\w+)$/.exec(str);
              if (!match) return;
              const source = create(match[1]);
              if (!source) return;
              return source + DOT_LITERAL + match[2];
            }
          }
        };
        const output = utils.removePrefix(input, state);
        let source = create(output);
        if (source && opts.strictSlashes !== true) {
          source += `${SLASH_LITERAL}?`;
        }
        return source;
      };
      module.exports = parse;
    },
    106: (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      const scan = __nccwpck_require__(75);
      const parse = __nccwpck_require__(775);
      const utils = __nccwpck_require__(949);
      const constants = __nccwpck_require__(425);
      const isObject = (val) =>
        val && typeof val === "object" && !Array.isArray(val);
      const picomatch = (glob, options, returnState = false) => {
        if (Array.isArray(glob)) {
          const fns = glob.map((input) =>
            picomatch(input, options, returnState),
          );
          const arrayMatcher = (str) => {
            for (const isMatch of fns) {
              const state = isMatch(str);
              if (state) return state;
            }
            return false;
          };
          return arrayMatcher;
        }
        const isState = isObject(glob) && glob.tokens && glob.input;
        if (glob === "" || (typeof glob !== "string" && !isState)) {
          throw new TypeError("Expected pattern to be a non-empty string");
        }
        const opts = options || {};
        const posix = opts.windows;
        const regex = isState
          ? picomatch.compileRe(glob, options)
          : picomatch.makeRe(glob, options, false, true);
        const state = regex.state;
        delete regex.state;
        let isIgnored = () => false;
        if (opts.ignore) {
          const ignoreOpts = {
            ...options,
            ignore: null,
            onMatch: null,
            onResult: null,
          };
          isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
        }
        const matcher = (input, returnObject = false) => {
          const { isMatch, match, output } = picomatch.test(
            input,
            regex,
            options,
            { glob, posix },
          );
          const result = {
            glob,
            state,
            regex,
            posix,
            input,
            output,
            match,
            isMatch,
          };
          if (typeof opts.onResult === "function") {
            opts.onResult(result);
          }
          if (isMatch === false) {
            result.isMatch = false;
            return returnObject ? result : false;
          }
          if (isIgnored(input)) {
            if (typeof opts.onIgnore === "function") {
              opts.onIgnore(result);
            }
            result.isMatch = false;
            return returnObject ? result : false;
          }
          if (typeof opts.onMatch === "function") {
            opts.onMatch(result);
          }
          return returnObject ? result : true;
        };
        if (returnState) {
          matcher.state = state;
        }
        return matcher;
      };
      picomatch.test = (input, regex, options, { glob, posix } = {}) => {
        if (typeof input !== "string") {
          throw new TypeError("Expected input to be a string");
        }
        if (input === "") {
          return { isMatch: false, output: "" };
        }
        const opts = options || {};
        const format = opts.format || (posix ? utils.toPosixSlashes : null);
        let match = input === glob;
        let output = match && format ? format(input) : input;
        if (match === false) {
          output = format ? format(input) : input;
          match = output === glob;
        }
        if (match === false || opts.capture === true) {
          if (opts.matchBase === true || opts.basename === true) {
            match = picomatch.matchBase(input, regex, options, posix);
          } else {
            match = regex.exec(output);
          }
        }
        return { isMatch: Boolean(match), match, output };
      };
      picomatch.matchBase = (input, glob, options) => {
        const regex =
          glob instanceof RegExp ? glob : picomatch.makeRe(glob, options);
        return regex.test(utils.basename(input));
      };
      picomatch.isMatch = (str, patterns, options) =>
        picomatch(patterns, options)(str);
      picomatch.parse = (pattern, options) => {
        if (Array.isArray(pattern))
          return pattern.map((p) => picomatch.parse(p, options));
        return parse(pattern, { ...options, fastpaths: false });
      };
      picomatch.scan = (input, options) => scan(input, options);
      picomatch.compileRe = (
        state,
        options,
        returnOutput = false,
        returnState = false,
      ) => {
        if (returnOutput === true) {
          return state.output;
        }
        const opts = options || {};
        const prepend = opts.contains ? "" : "^";
        const append = opts.contains ? "" : "$";
        let source = `${prepend}(?:${state.output})${append}`;
        if (state && state.negated === true) {
          source = `^(?!${source}).*$`;
        }
        const regex = picomatch.toRegex(source, options);
        if (returnState === true) {
          regex.state = state;
        }
        return regex;
      };
      picomatch.makeRe = (
        input,
        options = {},
        returnOutput = false,
        returnState = false,
      ) => {
        if (!input || typeof input !== "string") {
          throw new TypeError("Expected a non-empty string");
        }
        let parsed = { negated: false, fastpaths: true };
        if (
          options.fastpaths !== false &&
          (input[0] === "." || input[0] === "*")
        ) {
          parsed.output = parse.fastpaths(input, options);
        }
        if (!parsed.output) {
          parsed = parse(input, options);
        }
        return picomatch.compileRe(parsed, options, returnOutput, returnState);
      };
      picomatch.toRegex = (source, options) => {
        try {
          const opts = options || {};
          return new RegExp(source, opts.flags || (opts.nocase ? "i" : ""));
        } catch (err) {
          if (options && options.debug === true) throw err;
          return /$^/;
        }
      };
      picomatch.constants = constants;
      module.exports = picomatch;
    },
    75: (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      const utils = __nccwpck_require__(949);
      const {
        CHAR_ASTERISK,
        CHAR_AT,
        CHAR_BACKWARD_SLASH,
        CHAR_COMMA,
        CHAR_DOT,
        CHAR_EXCLAMATION_MARK,
        CHAR_FORWARD_SLASH,
        CHAR_LEFT_CURLY_BRACE,
        CHAR_LEFT_PARENTHESES,
        CHAR_LEFT_SQUARE_BRACKET,
        CHAR_PLUS,
        CHAR_QUESTION_MARK,
        CHAR_RIGHT_CURLY_BRACE,
        CHAR_RIGHT_PARENTHESES,
        CHAR_RIGHT_SQUARE_BRACKET,
      } = __nccwpck_require__(425);
      const isPathSeparator = (code) =>
        code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
      const depth = (token) => {
        if (token.isPrefix !== true) {
          token.depth = token.isGlobstar ? Infinity : 1;
        }
      };
      const scan = (input, options) => {
        const opts = options || {};
        const length = input.length - 1;
        const scanToEnd = opts.parts === true || opts.scanToEnd === true;
        const slashes = [];
        const tokens = [];
        const parts = [];
        let str = input;
        let index = -1;
        let start = 0;
        let lastIndex = 0;
        let isBrace = false;
        let isBracket = false;
        let isGlob = false;
        let isExtglob = false;
        let isGlobstar = false;
        let braceEscaped = false;
        let backslashes = false;
        let negated = false;
        let negatedExtglob = false;
        let finished = false;
        let braces = 0;
        let prev;
        let code;
        let token = { value: "", depth: 0, isGlob: false };
        const eos = () => index >= length;
        const peek = () => str.charCodeAt(index + 1);
        const advance = () => {
          prev = code;
          return str.charCodeAt(++index);
        };
        while (index < length) {
          code = advance();
          let next;
          if (code === CHAR_BACKWARD_SLASH) {
            backslashes = token.backslashes = true;
            code = advance();
            if (code === CHAR_LEFT_CURLY_BRACE) {
              braceEscaped = true;
            }
            continue;
          }
          if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
            braces++;
            while (eos() !== true && (code = advance())) {
              if (code === CHAR_BACKWARD_SLASH) {
                backslashes = token.backslashes = true;
                advance();
                continue;
              }
              if (code === CHAR_LEFT_CURLY_BRACE) {
                braces++;
                continue;
              }
              if (
                braceEscaped !== true &&
                code === CHAR_DOT &&
                (code = advance()) === CHAR_DOT
              ) {
                isBrace = token.isBrace = true;
                isGlob = token.isGlob = true;
                finished = true;
                if (scanToEnd === true) {
                  continue;
                }
                break;
              }
              if (braceEscaped !== true && code === CHAR_COMMA) {
                isBrace = token.isBrace = true;
                isGlob = token.isGlob = true;
                finished = true;
                if (scanToEnd === true) {
                  continue;
                }
                break;
              }
              if (code === CHAR_RIGHT_CURLY_BRACE) {
                braces--;
                if (braces === 0) {
                  braceEscaped = false;
                  isBrace = token.isBrace = true;
                  finished = true;
                  break;
                }
              }
            }
            if (scanToEnd === true) {
              continue;
            }
            break;
          }
          if (code === CHAR_FORWARD_SLASH) {
            slashes.push(index);
            tokens.push(token);
            token = { value: "", depth: 0, isGlob: false };
            if (finished === true) continue;
            if (prev === CHAR_DOT && index === start + 1) {
              start += 2;
              continue;
            }
            lastIndex = index + 1;
            continue;
          }
          if (opts.noext !== true) {
            const isExtglobChar =
              code === CHAR_PLUS ||
              code === CHAR_AT ||
              code === CHAR_ASTERISK ||
              code === CHAR_QUESTION_MARK ||
              code === CHAR_EXCLAMATION_MARK;
            if (isExtglobChar === true && peek() === CHAR_LEFT_PARENTHESES) {
              isGlob = token.isGlob = true;
              isExtglob = token.isExtglob = true;
              finished = true;
              if (code === CHAR_EXCLAMATION_MARK && index === start) {
                negatedExtglob = true;
              }
              if (scanToEnd === true) {
                while (eos() !== true && (code = advance())) {
                  if (code === CHAR_BACKWARD_SLASH) {
                    backslashes = token.backslashes = true;
                    code = advance();
                    continue;
                  }
                  if (code === CHAR_RIGHT_PARENTHESES) {
                    isGlob = token.isGlob = true;
                    finished = true;
                    break;
                  }
                }
                continue;
              }
              break;
            }
          }
          if (code === CHAR_ASTERISK) {
            if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
            isGlob = token.isGlob = true;
            finished = true;
            if (scanToEnd === true) {
              continue;
            }
            break;
          }
          if (code === CHAR_QUESTION_MARK) {
            isGlob = token.isGlob = true;
            finished = true;
            if (scanToEnd === true) {
              continue;
            }
            break;
          }
          if (code === CHAR_LEFT_SQUARE_BRACKET) {
            while (eos() !== true && (next = advance())) {
              if (next === CHAR_BACKWARD_SLASH) {
                backslashes = token.backslashes = true;
                advance();
                continue;
              }
              if (next === CHAR_RIGHT_SQUARE_BRACKET) {
                isBracket = token.isBracket = true;
                isGlob = token.isGlob = true;
                finished = true;
                break;
              }
            }
            if (scanToEnd === true) {
              continue;
            }
            break;
          }
          if (
            opts.nonegate !== true &&
            code === CHAR_EXCLAMATION_MARK &&
            index === start
          ) {
            negated = token.negated = true;
            start++;
            continue;
          }
          if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
            isGlob = token.isGlob = true;
            if (scanToEnd === true) {
              while (eos() !== true && (code = advance())) {
                if (code === CHAR_LEFT_PARENTHESES) {
                  backslashes = token.backslashes = true;
                  code = advance();
                  continue;
                }
                if (code === CHAR_RIGHT_PARENTHESES) {
                  finished = true;
                  break;
                }
              }
              continue;
            }
            break;
          }
          if (isGlob === true) {
            finished = true;
            if (scanToEnd === true) {
              continue;
            }
            break;
          }
        }
        if (opts.noext === true) {
          isExtglob = false;
          isGlob = false;
        }
        let base = str;
        let prefix = "";
        let glob = "";
        if (start > 0) {
          prefix = str.slice(0, start);
          str = str.slice(start);
          lastIndex -= start;
        }
        if (base && isGlob === true && lastIndex > 0) {
          base = str.slice(0, lastIndex);
          glob = str.slice(lastIndex);
        } else if (isGlob === true) {
          base = "";
          glob = str;
        } else {
          base = str;
        }
        if (base && base !== "" && base !== "/" && base !== str) {
          if (isPathSeparator(base.charCodeAt(base.length - 1))) {
            base = base.slice(0, -1);
          }
        }
        if (opts.unescape === true) {
          if (glob) glob = utils.removeBackslashes(glob);
          if (base && backslashes === true) {
            base = utils.removeBackslashes(base);
          }
        }
        const state = {
          prefix,
          input,
          start,
          base,
          glob,
          isBrace,
          isBracket,
          isGlob,
          isExtglob,
          isGlobstar,
          negated,
          negatedExtglob,
        };
        if (opts.tokens === true) {
          state.maxDepth = 0;
          if (!isPathSeparator(code)) {
            tokens.push(token);
          }
          state.tokens = tokens;
        }
        if (opts.parts === true || opts.tokens === true) {
          let prevIndex;
          for (let idx = 0; idx < slashes.length; idx++) {
            const n = prevIndex ? prevIndex + 1 : start;
            const i = slashes[idx];
            const value = input.slice(n, i);
            if (opts.tokens) {
              if (idx === 0 && start !== 0) {
                tokens[idx].isPrefix = true;
                tokens[idx].value = prefix;
              } else {
                tokens[idx].value = value;
              }
              depth(tokens[idx]);
              state.maxDepth += tokens[idx].depth;
            }
            if (idx !== 0 || value !== "") {
              parts.push(value);
            }
            prevIndex = i;
          }
          if (prevIndex && prevIndex + 1 < input.length) {
            const value = input.slice(prevIndex + 1);
            parts.push(value);
            if (opts.tokens) {
              tokens[tokens.length - 1].value = value;
              depth(tokens[tokens.length - 1]);
              state.maxDepth += tokens[tokens.length - 1].depth;
            }
          }
          state.slashes = slashes;
          state.parts = parts;
        }
        return state;
      };
      module.exports = scan;
    },
    949: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      const {
        REGEX_BACKSLASH,
        REGEX_REMOVE_BACKSLASH,
        REGEX_SPECIAL_CHARS,
        REGEX_SPECIAL_CHARS_GLOBAL,
      } = __nccwpck_require__(425);
      exports.isObject = (val) =>
        val !== null && typeof val === "object" && !Array.isArray(val);
      exports.hasRegexChars = (str) => REGEX_SPECIAL_CHARS.test(str);
      exports.isRegexChar = (str) =>
        str.length === 1 && exports.hasRegexChars(str);
      exports.escapeRegex = (str) =>
        str.replace(REGEX_SPECIAL_CHARS_GLOBAL, "\\$1");
      exports.toPosixSlashes = (str) => str.replace(REGEX_BACKSLASH, "/");
      exports.isWindows = () => {
        if (typeof navigator !== "undefined" && navigator.platform) {
          const platform = navigator.platform.toLowerCase();
          return platform === "win32" || platform === "windows";
        }
        if (typeof process !== "undefined" && process.platform) {
          return process.platform === "win32";
        }
        return false;
      };
      exports.removeBackslashes = (str) =>
        str.replace(REGEX_REMOVE_BACKSLASH, (match) =>
          match === "\\" ? "" : match,
        );
      exports.escapeLast = (input, char, lastIdx) => {
        const idx = input.lastIndexOf(char, lastIdx);
        if (idx === -1) return input;
        if (input[idx - 1] === "\\")
          return exports.escapeLast(input, char, idx - 1);
        return `${input.slice(0, idx)}\\${input.slice(idx)}`;
      };
      exports.removePrefix = (input, state = {}) => {
        let output = input;
        if (output.startsWith("./")) {
          output = output.slice(2);
          state.prefix = "./";
        }
        return output;
      };
      exports.wrapOutput = (input, state = {}, options = {}) => {
        const prepend = options.contains ? "" : "^";
        const append = options.contains ? "" : "$";
        let output = `${prepend}(?:${input})${append}`;
        if (state.negated === true) {
          output = `(?:^(?!${output}).*$)`;
        }
        return output;
      };
      exports.basename = (path, { windows } = {}) => {
        const segs = path.split(windows ? /[\\/]/ : "/");
        const last = segs[segs.length - 1];
        if (last === "") {
          return segs[segs.length - 2];
        }
        return last;
      };
    },
    896: (module) => {
      "use strict";
      module.exports = require("fs");
    },
    928: (module) => {
      "use strict";
      module.exports = require("path");
    },
  };
  var __webpack_module_cache__ = {};
  function __nccwpck_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = (__webpack_module_cache__[moduleId] = { exports: {} });
    var threw = true;
    try {
      __webpack_modules__[moduleId].call(
        module.exports,
        module,
        module.exports,
        __nccwpck_require__,
      );
      threw = false;
    } finally {
      if (threw) delete __webpack_module_cache__[moduleId];
    }
    return module.exports;
  }
  if (typeof __nccwpck_require__ !== "undefined")
    __nccwpck_require__.ab = __dirname + "/";
  var __webpack_exports__ = {};
  (() => {
    var exports = __webpack_exports__;
    var __create = Object.create;
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __copyProps = (to, from, except, desc) => {
      if ((from && typeof from === "object") || typeof from === "function")
        for (
          var keys = __getOwnPropNames(from), i = 0, n = keys.length, key;
          i < n;
          i++
        ) {
          key = keys[i];
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp(to, key, {
              get: ((k) => from[k]).bind(null, key),
              enumerable:
                !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
            });
        }
      return to;
    };
    var __toESM = (mod, isNodeMode, target) => (
      (target = mod != null ? __create(__getProtoOf(mod)) : {}),
      __copyProps(
        isNodeMode || !mod || !mod.__esModule
          ? __defProp(target, "default", { value: mod, enumerable: true })
          : target,
        mod,
      )
    );
    const path = __toESM(__nccwpck_require__(928));
    const fdir = __toESM(__nccwpck_require__(648));
    const picomatch = __toESM(__nccwpck_require__(976));
    const ONLY_PARENT_DIRECTORIES = /^(\/?\.\.)+$/;
    function getPartialMatcher(patterns, options) {
      const patternsCount = patterns.length;
      const patternsParts = Array(patternsCount);
      const regexes = Array(patternsCount);
      for (let i = 0; i < patternsCount; i++) {
        const parts = splitPattern(patterns[i]);
        patternsParts[i] = parts;
        const partsCount = parts.length;
        const partRegexes = Array(partsCount);
        for (let j = 0; j < partsCount; j++)
          partRegexes[j] = picomatch.default.makeRe(parts[j], options);
        regexes[i] = partRegexes;
      }
      return (input) => {
        const inputParts = input.split("/");
        if (inputParts[0] === ".." && ONLY_PARENT_DIRECTORIES.test(input))
          return true;
        for (let i = 0; i < patterns.length; i++) {
          const patternParts = patternsParts[i];
          const regex = regexes[i];
          const inputPatternCount = inputParts.length;
          const minParts = Math.min(inputPatternCount, patternParts.length);
          let j = 0;
          while (j < minParts) {
            const part = patternParts[j];
            if (part.includes("/")) return true;
            const match = regex[j].test(inputParts[j]);
            if (!match) break;
            if (part === "**") return true;
            j++;
          }
          if (j === inputPatternCount) return true;
        }
        return false;
      };
    }
    const splitPatternOptions = { parts: true };
    function splitPattern(path$2) {
      var _result$parts;
      const result = picomatch.default.scan(path$2, splitPatternOptions);
      return (
        (_result$parts = result.parts) === null || _result$parts === void 0
          ? void 0
          : _result$parts.length
      )
        ? result.parts
        : [path$2];
    }
    const isWin = process.platform === "win32";
    const ESCAPED_WIN32_BACKSLASHES = /\\(?![()[\]{}!+@])/g;
    function convertPosixPathToPattern(path$2) {
      return escapePosixPath(path$2);
    }
    function convertWin32PathToPattern(path$2) {
      return escapeWin32Path(path$2).replace(ESCAPED_WIN32_BACKSLASHES, "/");
    }
    const convertPathToPattern = isWin
      ? convertWin32PathToPattern
      : convertPosixPathToPattern;
    const POSIX_UNESCAPED_GLOB_SYMBOLS =
      /(?<!\\)([()[\]{}*?|]|^!|[!+@](?=\()|\\(?![()[\]{}!*+?@|]))/g;
    const WIN32_UNESCAPED_GLOB_SYMBOLS = /(?<!\\)([()[\]{}]|^!|[!+@](?=\())/g;
    const escapePosixPath = (path$2) =>
      path$2.replace(POSIX_UNESCAPED_GLOB_SYMBOLS, "\\$&");
    const escapeWin32Path = (path$2) =>
      path$2.replace(WIN32_UNESCAPED_GLOB_SYMBOLS, "\\$&");
    const escapePath = isWin ? escapeWin32Path : escapePosixPath;
    function isDynamicPattern(pattern, options) {
      if (
        (options === null || options === void 0
          ? void 0
          : options.caseSensitiveMatch) === false
      )
        return true;
      const scan = picomatch.default.scan(pattern);
      return scan.isGlob || scan.negated;
    }
    function log(...tasks) {
      console.log(
        `[tinyglobby ${new Date().toLocaleTimeString("es")}]`,
        ...tasks,
      );
    }
    const PARENT_DIRECTORY = /^(\/?\.\.)+/;
    const ESCAPING_BACKSLASHES = /\\(?=[()[\]{}!*+?@|])/g;
    const BACKSLASHES = /\\/g;
    function normalizePattern(
      pattern,
      expandDirectories,
      cwd,
      props,
      isIgnore,
    ) {
      let result = pattern;
      if (pattern.endsWith("/")) result = pattern.slice(0, -1);
      if (!result.endsWith("*") && expandDirectories) result += "/**";
      const escapedCwd = escapePath(cwd);
      if (path.default.isAbsolute(result.replace(ESCAPING_BACKSLASHES, "")))
        result = path.posix.relative(escapedCwd, result);
      else result = path.posix.normalize(result);
      const parentDirectoryMatch = PARENT_DIRECTORY.exec(result);
      const parts = splitPattern(result);
      if (
        parentDirectoryMatch === null || parentDirectoryMatch === void 0
          ? void 0
          : parentDirectoryMatch[0]
      ) {
        const n = (parentDirectoryMatch[0].length + 1) / 3;
        let i = 0;
        const cwdParts = escapedCwd.split("/");
        while (i < n && parts[i + n] === cwdParts[cwdParts.length + i - n]) {
          result =
            result.slice(0, (n - i - 1) * 3) +
              result.slice((n - i) * 3 + parts[i + n].length + 1) || ".";
          i++;
        }
        const potentialRoot = path.posix.join(
          cwd,
          parentDirectoryMatch[0].slice(i * 3),
        );
        if (
          !potentialRoot.startsWith(".") &&
          props.root.length > potentialRoot.length
        ) {
          props.root = potentialRoot;
          props.depthOffset = -n + i;
        }
      }
      if (!isIgnore && props.depthOffset >= 0) {
        var _props$commonPath;
        ((_props$commonPath = props.commonPath) !== null &&
          _props$commonPath !== void 0) ||
          (props.commonPath = parts);
        const newCommonPath = [];
        const length = Math.min(props.commonPath.length, parts.length);
        for (let i = 0; i < length; i++) {
          const part = parts[i];
          if (part === "**" && !parts[i + 1]) {
            newCommonPath.pop();
            break;
          }
          if (
            part !== props.commonPath[i] ||
            isDynamicPattern(part) ||
            i === parts.length - 1
          )
            break;
          newCommonPath.push(part);
        }
        props.depthOffset = newCommonPath.length;
        props.commonPath = newCommonPath;
        props.root =
          newCommonPath.length > 0
            ? path.default.posix.join(cwd, ...newCommonPath)
            : cwd;
      }
      return result;
    }
    function processPatterns(
      { patterns, ignore = [], expandDirectories = true },
      cwd,
      props,
    ) {
      if (typeof patterns === "string") patterns = [patterns];
      else if (!patterns) patterns = ["**/*"];
      if (typeof ignore === "string") ignore = [ignore];
      const matchPatterns = [];
      const ignorePatterns = [];
      for (const pattern of ignore) {
        if (!pattern) continue;
        if (pattern[0] !== "!" || pattern[1] === "(")
          ignorePatterns.push(
            normalizePattern(pattern, expandDirectories, cwd, props, true),
          );
      }
      for (const pattern of patterns) {
        if (!pattern) continue;
        if (pattern[0] !== "!" || pattern[1] === "(")
          matchPatterns.push(
            normalizePattern(pattern, expandDirectories, cwd, props, false),
          );
        else if (pattern[1] !== "!" || pattern[2] === "(")
          ignorePatterns.push(
            normalizePattern(
              pattern.slice(1),
              expandDirectories,
              cwd,
              props,
              true,
            ),
          );
      }
      return { match: matchPatterns, ignore: ignorePatterns };
    }
    function getRelativePath(path$2, cwd, root) {
      return path.posix.relative(cwd, `${root}/${path$2}`) || ".";
    }
    function processPath(path$2, cwd, root, isDirectory, absolute) {
      const relativePath = absolute
        ? path$2.slice(root === "/" ? 1 : root.length + 1) || "."
        : path$2;
      if (root === cwd)
        return isDirectory && relativePath !== "."
          ? relativePath.slice(0, -1)
          : relativePath;
      return getRelativePath(relativePath, cwd, root);
    }
    function formatPaths(paths, cwd, root) {
      for (let i = paths.length - 1; i >= 0; i--) {
        const path$2 = paths[i];
        paths[i] =
          getRelativePath(path$2, cwd, root) +
          (!path$2 || path$2.endsWith("/") ? "/" : "");
      }
      return paths;
    }
    function crawl(options, cwd, sync) {
      if (process.env.TINYGLOBBY_DEBUG) options.debug = true;
      if (options.debug) log("globbing with options:", options, "cwd:", cwd);
      if (Array.isArray(options.patterns) && options.patterns.length === 0)
        return sync ? [] : Promise.resolve([]);
      const props = { root: cwd, commonPath: null, depthOffset: 0 };
      const processed = processPatterns(options, cwd, props);
      const nocase = options.caseSensitiveMatch === false;
      if (options.debug) log("internal processing patterns:", processed);
      const matcher = (0, picomatch.default)(processed.match, {
        dot: options.dot,
        nocase,
        ignore: processed.ignore,
      });
      const ignore = (0, picomatch.default)(processed.ignore, {
        dot: options.dot,
        nocase,
      });
      const partialMatcher = getPartialMatcher(processed.match, {
        dot: options.dot,
        nocase,
      });
      const fdirOptions = {
        filters: [
          options.debug
            ? (p, isDirectory) => {
                const path$2 = processPath(
                  p,
                  cwd,
                  props.root,
                  isDirectory,
                  options.absolute,
                );
                const matches = matcher(path$2);
                if (matches) log(`matched ${path$2}`);
                return matches;
              }
            : (p, isDirectory) =>
                matcher(
                  processPath(
                    p,
                    cwd,
                    props.root,
                    isDirectory,
                    options.absolute,
                  ),
                ),
        ],
        exclude: options.debug
          ? (_, p) => {
              const relativePath = processPath(p, cwd, props.root, true, true);
              const skipped =
                (relativePath !== "." && !partialMatcher(relativePath)) ||
                ignore(relativePath);
              if (skipped) log(`skipped ${p}`);
              else log(`crawling ${p}`);
              return skipped;
            }
          : (_, p) => {
              const relativePath = processPath(p, cwd, props.root, true, true);
              return (
                (relativePath !== "." && !partialMatcher(relativePath)) ||
                ignore(relativePath)
              );
            },
        pathSeparator: "/",
        relativePaths: true,
        resolveSymlinks: true,
      };
      if (options.deep !== void 0)
        fdirOptions.maxDepth = Math.round(options.deep - props.depthOffset);
      if (options.absolute) {
        fdirOptions.relativePaths = false;
        fdirOptions.resolvePaths = true;
        fdirOptions.includeBasePath = true;
      }
      if (options.followSymbolicLinks === false) {
        fdirOptions.resolveSymlinks = false;
        fdirOptions.excludeSymlinks = true;
      }
      if (options.onlyDirectories) {
        fdirOptions.excludeFiles = true;
        fdirOptions.includeDirs = true;
      } else if (options.onlyFiles === false) fdirOptions.includeDirs = true;
      props.root = props.root.replace(BACKSLASHES, "");
      const root = props.root;
      if (options.debug) log("internal properties:", props);
      const api = new fdir.fdir(fdirOptions).crawl(root);
      if (cwd === root || options.absolute)
        return sync ? api.sync() : api.withPromise();
      return sync
        ? formatPaths(api.sync(), cwd, root)
        : api.withPromise().then((paths) => formatPaths(paths, cwd, root));
    }
    async function glob(patternsOrOptions, options) {
      if (
        patternsOrOptions &&
        (options === null || options === void 0 ? void 0 : options.patterns)
      )
        throw new Error(
          "Cannot pass patterns as both an argument and an option",
        );
      const opts =
        Array.isArray(patternsOrOptions) ||
        typeof patternsOrOptions === "string"
          ? { ...options, patterns: patternsOrOptions }
          : patternsOrOptions;
      const cwd = opts.cwd
        ? path.default.resolve(opts.cwd).replace(BACKSLASHES, "/")
        : process.cwd().replace(BACKSLASHES, "/");
      return crawl(opts, cwd, false);
    }
    function globSync(patternsOrOptions, options) {
      if (
        patternsOrOptions &&
        (options === null || options === void 0 ? void 0 : options.patterns)
      )
        throw new Error(
          "Cannot pass patterns as both an argument and an option",
        );
      const opts =
        Array.isArray(patternsOrOptions) ||
        typeof patternsOrOptions === "string"
          ? { ...options, patterns: patternsOrOptions }
          : patternsOrOptions;
      const cwd = opts.cwd
        ? path.default.resolve(opts.cwd).replace(BACKSLASHES, "/")
        : process.cwd().replace(BACKSLASHES, "/");
      return crawl(opts, cwd, true);
    }
    exports.convertPathToPattern = convertPathToPattern;
    exports.escapePath = escapePath;
    exports.glob = glob;
    exports.globSync = globSync;
    exports.isDynamicPattern = isDynamicPattern;
  })();
  module.exports = __webpack_exports__;
})();
