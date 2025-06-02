(() => {
  var __webpack_modules__ = {
    920: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const path = __nccwpck_require__(928);
      const fs = __nccwpck_require__(896);
      const os = __nccwpck_require__(857);
      const url = __nccwpck_require__(16);
      const fsReadFileAsync = fs.promises.readFile;
      function getDefaultSearchPlaces(name, sync) {
        return [
          "package.json",
          `.${name}rc.json`,
          `.${name}rc.js`,
          `.${name}rc.cjs`,
          ...(sync ? [] : [`.${name}rc.mjs`]),
          `.config/${name}rc`,
          `.config/${name}rc.json`,
          `.config/${name}rc.js`,
          `.config/${name}rc.cjs`,
          ...(sync ? [] : [`.config/${name}rc.mjs`]),
          `${name}.config.js`,
          `${name}.config.cjs`,
          ...(sync ? [] : [`${name}.config.mjs`]),
        ];
      }
      function parentDir(p) {
        return path.dirname(p) || path.sep;
      }
      const jsonLoader = (_, content) => JSON.parse(content);
      const requireFunc = true ? eval("require") : 0;
      const defaultLoadersSync = Object.freeze({
        ".js": requireFunc,
        ".json": requireFunc,
        ".cjs": requireFunc,
        noExt: jsonLoader,
      });
      module.exports.defaultLoadersSync = defaultLoadersSync;
      const dynamicImport = async (id) => {
        try {
          const fileUrl = url.pathToFileURL(id).href;
          const mod = await import(fileUrl);
          return mod.default;
        } catch (e) {
          try {
            return requireFunc(id);
          } catch (requireE) {
            if (
              requireE.code === "ERR_REQUIRE_ESM" ||
              (requireE instanceof SyntaxError &&
                requireE
                  .toString()
                  .includes("Cannot use import statement outside a module"))
            ) {
              throw e;
            }
            throw requireE;
          }
        }
      };
      const defaultLoaders = Object.freeze({
        ".js": dynamicImport,
        ".mjs": dynamicImport,
        ".cjs": dynamicImport,
        ".json": jsonLoader,
        noExt: jsonLoader,
      });
      module.exports.defaultLoaders = defaultLoaders;
      function getOptions(name, options, sync) {
        const conf = {
          stopDir: os.homedir(),
          searchPlaces: getDefaultSearchPlaces(name, sync),
          ignoreEmptySearchPlaces: true,
          cache: true,
          transform: (x) => x,
          packageProp: [name],
          ...options,
          loaders: {
            ...(sync ? defaultLoadersSync : defaultLoaders),
            ...options.loaders,
          },
        };
        conf.searchPlaces.forEach((place) => {
          const key = path.extname(place) || "noExt";
          const loader = conf.loaders[key];
          if (!loader) {
            throw new Error(`Missing loader for extension "${place}"`);
          }
          if (typeof loader !== "function") {
            throw new Error(
              `Loader for extension "${place}" is not a function: Received ${typeof loader}.`,
            );
          }
        });
        return conf;
      }
      function getPackageProp(props, obj) {
        if (typeof props === "string" && props in obj) return obj[props];
        return (
          (Array.isArray(props) ? props : props.split(".")).reduce(
            (acc, prop) => (acc === undefined ? acc : acc[prop]),
            obj,
          ) || null
        );
      }
      function validateFilePath(filepath) {
        if (!filepath) throw new Error("load must pass a non-empty string");
      }
      function validateLoader(loader, ext) {
        if (!loader)
          throw new Error(`No loader specified for extension "${ext}"`);
        if (typeof loader !== "function")
          throw new Error("loader is not a function");
      }
      const makeEmplace = (enableCache) => (c, filepath, res) => {
        if (enableCache) c.set(filepath, res);
        return res;
      };
      module.exports.lilconfig = function lilconfig(name, options) {
        const {
          ignoreEmptySearchPlaces,
          loaders,
          packageProp,
          searchPlaces,
          stopDir,
          transform,
          cache,
        } = getOptions(name, options ?? {}, false);
        const searchCache = new Map();
        const loadCache = new Map();
        const emplace = makeEmplace(cache);
        return {
          async search(searchFrom = process.cwd()) {
            const result = { config: null, filepath: "" };
            const visited = new Set();
            let dir = searchFrom;
            dirLoop: while (true) {
              if (cache) {
                const r = searchCache.get(dir);
                if (r !== undefined) {
                  for (const p of visited) searchCache.set(p, r);
                  return r;
                }
                visited.add(dir);
              }
              for (const searchPlace of searchPlaces) {
                const filepath = path.join(dir, searchPlace);
                try {
                  await fs.promises.access(filepath);
                } catch {
                  continue;
                }
                const content = String(await fsReadFileAsync(filepath));
                const loaderKey = path.extname(searchPlace) || "noExt";
                const loader = loaders[loaderKey];
                if (searchPlace === "package.json") {
                  const pkg = await loader(filepath, content);
                  const maybeConfig = getPackageProp(packageProp, pkg);
                  if (maybeConfig != null) {
                    result.config = maybeConfig;
                    result.filepath = filepath;
                    break dirLoop;
                  }
                  continue;
                }
                const isEmpty = content.trim() === "";
                if (isEmpty && ignoreEmptySearchPlaces) continue;
                if (isEmpty) {
                  result.isEmpty = true;
                  result.config = undefined;
                } else {
                  validateLoader(loader, loaderKey);
                  result.config = await loader(filepath, content);
                }
                result.filepath = filepath;
                break dirLoop;
              }
              if (dir === stopDir || dir === parentDir(dir)) break dirLoop;
              dir = parentDir(dir);
            }
            const transformed =
              result.filepath === "" && result.config === null
                ? transform(null)
                : transform(result);
            if (cache) {
              for (const p of visited) searchCache.set(p, transformed);
            }
            return transformed;
          },
          async load(filepath) {
            validateFilePath(filepath);
            const absPath = path.resolve(process.cwd(), filepath);
            if (cache && loadCache.has(absPath)) {
              return loadCache.get(absPath);
            }
            const { base, ext } = path.parse(absPath);
            const loaderKey = ext || "noExt";
            const loader = loaders[loaderKey];
            validateLoader(loader, loaderKey);
            const content = String(await fsReadFileAsync(absPath));
            if (base === "package.json") {
              const pkg = await loader(absPath, content);
              return emplace(
                loadCache,
                absPath,
                transform({
                  config: getPackageProp(packageProp, pkg),
                  filepath: absPath,
                }),
              );
            }
            const result = { config: null, filepath: absPath };
            const isEmpty = content.trim() === "";
            if (isEmpty && ignoreEmptySearchPlaces)
              return emplace(
                loadCache,
                absPath,
                transform({
                  config: undefined,
                  filepath: absPath,
                  isEmpty: true,
                }),
              );
            result.config = isEmpty
              ? undefined
              : await loader(absPath, content);
            return emplace(
              loadCache,
              absPath,
              transform(
                isEmpty ? { ...result, isEmpty, config: undefined } : result,
              ),
            );
          },
          clearLoadCache() {
            if (cache) loadCache.clear();
          },
          clearSearchCache() {
            if (cache) searchCache.clear();
          },
          clearCaches() {
            if (cache) {
              loadCache.clear();
              searchCache.clear();
            }
          },
        };
      };
      module.exports.lilconfigSync = function lilconfigSync(name, options) {
        const {
          ignoreEmptySearchPlaces,
          loaders,
          packageProp,
          searchPlaces,
          stopDir,
          transform,
          cache,
        } = getOptions(name, options ?? {}, true);
        const searchCache = new Map();
        const loadCache = new Map();
        const emplace = makeEmplace(cache);
        return {
          search(searchFrom = process.cwd()) {
            const result = { config: null, filepath: "" };
            const visited = new Set();
            let dir = searchFrom;
            dirLoop: while (true) {
              if (cache) {
                const r = searchCache.get(dir);
                if (r !== undefined) {
                  for (const p of visited) searchCache.set(p, r);
                  return r;
                }
                visited.add(dir);
              }
              for (const searchPlace of searchPlaces) {
                const filepath = path.join(dir, searchPlace);
                try {
                  fs.accessSync(filepath);
                } catch {
                  continue;
                }
                const loaderKey = path.extname(searchPlace) || "noExt";
                const loader = loaders[loaderKey];
                const content = String(fs.readFileSync(filepath));
                if (searchPlace === "package.json") {
                  const pkg = loader(filepath, content);
                  const maybeConfig = getPackageProp(packageProp, pkg);
                  if (maybeConfig != null) {
                    result.config = maybeConfig;
                    result.filepath = filepath;
                    break dirLoop;
                  }
                  continue;
                }
                const isEmpty = content.trim() === "";
                if (isEmpty && ignoreEmptySearchPlaces) continue;
                if (isEmpty) {
                  result.isEmpty = true;
                  result.config = undefined;
                } else {
                  validateLoader(loader, loaderKey);
                  result.config = loader(filepath, content);
                }
                result.filepath = filepath;
                break dirLoop;
              }
              if (dir === stopDir || dir === parentDir(dir)) break dirLoop;
              dir = parentDir(dir);
            }
            const transformed =
              result.filepath === "" && result.config === null
                ? transform(null)
                : transform(result);
            if (cache) {
              for (const p of visited) searchCache.set(p, transformed);
            }
            return transformed;
          },
          load(filepath) {
            validateFilePath(filepath);
            const absPath = path.resolve(process.cwd(), filepath);
            if (cache && loadCache.has(absPath)) {
              return loadCache.get(absPath);
            }
            const { base, ext } = path.parse(absPath);
            const loaderKey = ext || "noExt";
            const loader = loaders[loaderKey];
            validateLoader(loader, loaderKey);
            const content = String(fs.readFileSync(absPath));
            if (base === "package.json") {
              const pkg = loader(absPath, content);
              return transform({
                config: getPackageProp(packageProp, pkg),
                filepath: absPath,
              });
            }
            const result = { config: null, filepath: absPath };
            const isEmpty = content.trim() === "";
            if (isEmpty && ignoreEmptySearchPlaces)
              return emplace(
                loadCache,
                absPath,
                transform({
                  filepath: absPath,
                  config: undefined,
                  isEmpty: true,
                }),
              );
            result.config = isEmpty ? undefined : loader(absPath, content);
            return emplace(
              loadCache,
              absPath,
              transform(
                isEmpty ? { ...result, isEmpty, config: undefined } : result,
              ),
            );
          },
          clearLoadCache() {
            if (cache) loadCache.clear();
          },
          clearSearchCache() {
            if (cache) searchCache.clear();
          },
          clearCaches() {
            if (cache) {
              loadCache.clear();
              searchCache.clear();
            }
          },
        };
      };
    },
    838: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const { resolve } = __nccwpck_require__(760);
      const config = __nccwpck_require__(920);
      const loadOptions = __nccwpck_require__(672);
      const loadPlugins = __nccwpck_require__(934);
      const req = __nccwpck_require__(606);
      const interopRequireDefault = (obj) =>
        obj && obj.__esModule ? obj : { default: obj };
      async function processResult(ctx, result) {
        let file = result.filepath || "";
        let projectConfig = interopRequireDefault(result.config).default || {};
        if (typeof projectConfig === "function") {
          projectConfig = projectConfig(ctx);
        } else {
          projectConfig = Object.assign({}, projectConfig, ctx);
        }
        if (!projectConfig.plugins) {
          projectConfig.plugins = [];
        }
        let res = {
          file,
          options: await loadOptions(projectConfig, file),
          plugins: await loadPlugins(projectConfig, file),
        };
        delete projectConfig.plugins;
        return res;
      }
      function createContext(ctx) {
        ctx = Object.assign(
          { cwd: process.cwd(), env: process.env.NODE_ENV },
          ctx,
        );
        if (!ctx.env) {
          process.env.NODE_ENV = "development";
        }
        return ctx;
      }
      async function loader(filepath) {
        return req(filepath);
      }
      let yaml;
      async function yamlLoader(_, content) {
        if (!yaml) {
          try {
            yaml = await Promise.resolve().then(
              __nccwpck_require__.t.bind(__nccwpck_require__, 160, 23),
            );
          } catch (e) {
            throw new Error(
              `'yaml' is required for the YAML configuration files. Make sure it is installed\nError: ${e.message}`,
            );
          }
        }
        return yaml.parse(content);
      }
      const withLoaders = (options = {}) => {
        let moduleName = "postcss";
        return {
          ...options,
          loaders: {
            ...options.loaders,
            ".cjs": loader,
            ".cts": loader,
            ".js": loader,
            ".mjs": loader,
            ".mts": loader,
            ".ts": loader,
            ".yaml": yamlLoader,
            ".yml": yamlLoader,
          },
          searchPlaces: [
            ...(options.searchPlaces || []),
            "package.json",
            `.${moduleName}rc`,
            `.${moduleName}rc.json`,
            `.${moduleName}rc.yaml`,
            `.${moduleName}rc.yml`,
            `.${moduleName}rc.ts`,
            `.${moduleName}rc.cts`,
            `.${moduleName}rc.mts`,
            `.${moduleName}rc.js`,
            `.${moduleName}rc.cjs`,
            `.${moduleName}rc.mjs`,
            `${moduleName}.config.ts`,
            `${moduleName}.config.cts`,
            `${moduleName}.config.mts`,
            `${moduleName}.config.js`,
            `${moduleName}.config.cjs`,
            `${moduleName}.config.mjs`,
          ],
        };
      };
      function rc(ctx, path, options) {
        ctx = createContext(ctx);
        path = path ? resolve(path) : process.cwd();
        return config
          .lilconfig("postcss", withLoaders(options))
          .search(path)
          .then((result) => {
            if (!result) {
              throw new Error(`No PostCSS Config found in: ${path}`);
            }
            return processResult(ctx, result);
          });
      }
      /**
       * Autoload Config for PostCSS
       *
       * @author Michael Ciniawsky @michael-ciniawsky <michael.ciniawsky@gmail.com>
       * @license MIT
       *
       * @module postcss-load-config
       * @version 2.1.0
       *
       * @requires comsiconfig
       * @requires ./options
       * @requires ./plugins
       */ module.exports = rc;
    },
    672: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const req = __nccwpck_require__(606);
      async function options(config, file) {
        if (config.parser && typeof config.parser === "string") {
          try {
            config.parser = await req(config.parser, file);
          } catch (err) {
            throw new Error(
              `Loading PostCSS Parser failed: ${err.message}\n\n(@${file})`,
            );
          }
        }
        if (config.syntax && typeof config.syntax === "string") {
          try {
            config.syntax = await req(config.syntax, file);
          } catch (err) {
            throw new Error(
              `Loading PostCSS Syntax failed: ${err.message}\n\n(@${file})`,
            );
          }
        }
        if (config.stringifier && typeof config.stringifier === "string") {
          try {
            config.stringifier = await req(config.stringifier, file);
          } catch (err) {
            throw new Error(
              `Loading PostCSS Stringifier failed: ${err.message}\n\n(@${file})`,
            );
          }
        }
        return config;
      }
      module.exports = options;
    },
    934: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const req = __nccwpck_require__(606);
      async function load(plugin, options, file) {
        try {
          if (
            options === null ||
            options === undefined ||
            Object.keys(options).length === 0
          ) {
            return await req(plugin, file);
          } else {
            return (await req(plugin, file))(options);
          }
        } catch (err) {
          throw new Error(
            `Loading PostCSS Plugin failed: ${err.message}\n\n(@${file})`,
          );
        }
      }
      async function plugins(config, file) {
        let list = [];
        if (Array.isArray(config.plugins)) {
          list = config.plugins.filter(Boolean);
        } else {
          list = Object.entries(config.plugins)
            .filter(([, options]) => options !== false)
            .map(([plugin, options]) => load(plugin, options, file));
          list = await Promise.all(list);
        }
        if (list.length && list.length > 0) {
          list.forEach((plugin, i) => {
            if (plugin.default) {
              plugin = plugin.default;
            }
            if (plugin.postcss === true) {
              plugin = plugin();
            } else if (plugin.postcss) {
              plugin = plugin.postcss;
            }
            if (
              !(
                (typeof plugin === "object" && Array.isArray(plugin.plugins)) ||
                (typeof plugin === "object" && plugin.postcssPlugin) ||
                typeof plugin === "function"
              )
            ) {
              throw new TypeError(
                `Invalid PostCSS Plugin found at: plugins[${i}]\n\n(@${file})`,
              );
            }
          });
        }
        return list;
      }
      module.exports = plugins;
    },
    606: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const { createRequire } = __nccwpck_require__(995);
      const { pathToFileURL } = __nccwpck_require__(136);
      const TS_EXT_RE = /\.[mc]?ts$/;
      let tsx;
      let jiti;
      let importError = [];
      async function req(name, rootFile = __filename) {
        let url = createRequire(rootFile).resolve(name);
        try {
          return (await import(`${pathToFileURL(url)}?t=${Date.now()}`))
            .default;
        } catch (err) {
          if (!TS_EXT_RE.test(url)) {
            throw err;
          }
        }
        if (tsx === undefined) {
          try {
            tsx = await import("tsx/cjs/api");
          } catch (error) {
            importError.push(error);
          }
        }
        if (tsx) {
          let loaded = tsx.require(name, rootFile);
          return loaded && "__esModule" in loaded ? loaded.default : loaded;
        }
        if (jiti === undefined) {
          try {
            jiti = (await import("jiti")).default;
          } catch (error) {
            importError.push(error);
          }
        }
        if (jiti) {
          return jiti(rootFile, { interopDefault: true })(name);
        }
        throw new Error(
          `'tsx' or 'jiti' is required for the TypeScript configuration files. Make sure it is installed\nError: ${importError.map((error) => error.message).join("\n")}`,
        );
      }
      module.exports = req;
    },
    896: (module) => {
      "use strict";
      module.exports = require("fs");
    },
    995: (module) => {
      "use strict";
      module.exports = require("node:module");
    },
    760: (module) => {
      "use strict";
      module.exports = require("node:path");
    },
    136: (module) => {
      "use strict";
      module.exports = require("node:url");
    },
    857: (module) => {
      "use strict";
      module.exports = require("os");
    },
    928: (module) => {
      "use strict";
      module.exports = require("path");
    },
    16: (module) => {
      "use strict";
      module.exports = require("url");
    },
    160: (module) => {
      "use strict";
      module.exports = require("yaml");
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
      __webpack_modules__[moduleId](
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
  (() => {
    var getProto = Object.getPrototypeOf
      ? (obj) => Object.getPrototypeOf(obj)
      : (obj) => obj.__proto__;
    var leafPrototypes;
    __nccwpck_require__.t = function (value, mode) {
      if (mode & 1) value = this(value);
      if (mode & 8) return value;
      if (typeof value === "object" && value) {
        if (mode & 4 && value.__esModule) return value;
        if (mode & 16 && typeof value.then === "function") return value;
      }
      var ns = Object.create(null);
      __nccwpck_require__.r(ns);
      var def = {};
      leafPrototypes = leafPrototypes || [
        null,
        getProto({}),
        getProto([]),
        getProto(getProto),
      ];
      for (
        var current = mode & 2 && value;
        typeof current == "object" && !~leafPrototypes.indexOf(current);
        current = getProto(current)
      ) {
        Object.getOwnPropertyNames(current).forEach(
          (key) => (def[key] = () => value[key]),
        );
      }
      def["default"] = () => value;
      __nccwpck_require__.d(ns, def);
      return ns;
    };
  })();
  (() => {
    __nccwpck_require__.d = (exports, definition) => {
      for (var key in definition) {
        if (
          __nccwpck_require__.o(definition, key) &&
          !__nccwpck_require__.o(exports, key)
        ) {
          Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key],
          });
        }
      }
    };
  })();
  (() => {
    __nccwpck_require__.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop);
  })();
  (() => {
    __nccwpck_require__.r = (exports) => {
      if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
      }
      Object.defineProperty(exports, "__esModule", { value: true });
    };
  })();
  if (typeof __nccwpck_require__ !== "undefined")
    __nccwpck_require__.ab = __dirname + "/";
  var __webpack_exports__ = __nccwpck_require__(838);
  module.exports = __webpack_exports__;
})();
