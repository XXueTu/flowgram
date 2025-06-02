(() => {
  var __webpack_modules__ = {
    4076: (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      const loader = __nccwpck_require__(4530);
      module.exports = loader.default;
      module.exports.defaultGetLocalIdent =
        __nccwpck_require__(4723).defaultGetLocalIdent;
    },
    4530: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports["default"] = loader;
      var _postcss = _interopRequireDefault(__nccwpck_require__(9409));
      var _plugins = __nccwpck_require__(7329);
      var _utils = __nccwpck_require__(4723);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      async function loader(content, map, meta) {
        const rawOptions = this.getOptions();
        const callback = this.async();
        if (
          this._compiler &&
          this._compiler.options &&
          this._compiler.options.experiments &&
          this._compiler.options.experiments.css &&
          this._module &&
          (this._module.type === "css" ||
            this._module.type === "css/auto" ||
            this._module.type === "css/global" ||
            this._module.type === "css/module")
        ) {
          this.emitWarning(
            new Error(
              'You can\'t use `experiments.css` (`experiments.futureDefaults` enable built-in CSS support by default) and `css-loader` together, please set `experiments.css` to `false` or set `{ type: "javascript/auto" }` for rules with `css-loader` in your webpack config (now css-loader does nothing).',
            ),
          );
          callback(null, content, map, meta);
          return;
        }
        let options;
        try {
          options = (0, _utils.normalizeOptions)(rawOptions, this);
        } catch (error) {
          callback(error);
          return;
        }
        const plugins = [];
        const replacements = [];
        const exports = [];
        if ((0, _utils.shouldUseModulesPlugins)(options)) {
          plugins.push(...(0, _utils.getModulesPlugins)(options, this));
        }
        const importPluginImports = [];
        const importPluginApi = [];
        let isSupportAbsoluteURL = false;
        if (
          this._compilation &&
          this._compilation.options &&
          this._compilation.options.experiments &&
          this._compilation.options.experiments.buildHttp
        ) {
          isSupportAbsoluteURL = true;
        }
        if ((0, _utils.shouldUseImportPlugin)(options)) {
          plugins.push(
            (0, _plugins.importParser)({
              isSupportAbsoluteURL: false,
              isSupportDataURL: false,
              isCSSStyleSheet: options.exportType === "css-style-sheet",
              loaderContext: this,
              imports: importPluginImports,
              api: importPluginApi,
              filter: options.import.filter,
              urlHandler: (url) =>
                (0, _utils.stringifyRequest)(
                  this,
                  (0, _utils.combineRequests)(
                    (0, _utils.getPreRequester)(this)(options.importLoaders),
                    url,
                  ),
                ),
            }),
          );
        }
        const urlPluginImports = [];
        if ((0, _utils.shouldUseURLPlugin)(options)) {
          const needToResolveURL = !options.esModule;
          plugins.push(
            (0, _plugins.urlParser)({
              isSupportAbsoluteURL,
              isSupportDataURL: options.esModule,
              imports: urlPluginImports,
              replacements,
              context: this.context,
              rootContext: this.rootContext,
              filter: (0, _utils.getFilter)(
                options.url.filter,
                this.resourcePath,
              ),
              resolver: needToResolveURL
                ? this.getResolve({ mainFiles: [], extensions: [] })
                : undefined,
              urlHandler: (url) => (0, _utils.stringifyRequest)(this, url),
            }),
          );
        }
        const icssPluginImports = [];
        const icssPluginApi = [];
        const needToUseIcssPlugin = (0, _utils.shouldUseIcssPlugin)(options);
        if (needToUseIcssPlugin) {
          plugins.push(
            (0, _plugins.icssParser)({
              loaderContext: this,
              imports: icssPluginImports,
              api: icssPluginApi,
              replacements,
              exports,
              urlHandler: (url) =>
                (0, _utils.stringifyRequest)(
                  this,
                  (0, _utils.combineRequests)(
                    (0, _utils.getPreRequester)(this)(options.importLoaders),
                    url,
                  ),
                ),
            }),
          );
        }
        if (meta) {
          const { ast } = meta;
          if (ast && ast.type === "postcss") {
            content = ast.root;
          }
        }
        const { resourcePath } = this;
        let result;
        try {
          result = await (0, _postcss.default)(plugins).process(content, {
            hideNothingWarning: true,
            from: resourcePath,
            to: resourcePath,
            map: options.sourceMap
              ? {
                  prev: map
                    ? (0, _utils.normalizeSourceMap)(map, resourcePath)
                    : null,
                  inline: false,
                  annotation: false,
                }
              : false,
          });
        } catch (error) {
          if (error.file) {
            this.addDependency(error.file);
          }
          callback(
            error.name === "CssSyntaxError"
              ? (0, _utils.syntaxErrorFactory)(error)
              : error,
          );
          return;
        }
        for (const warning of result.warnings()) {
          this.emitWarning((0, _utils.warningFactory)(warning));
        }
        const imports = []
          .concat(icssPluginImports.sort(_utils.sort))
          .concat(importPluginImports.sort(_utils.sort))
          .concat(urlPluginImports.sort(_utils.sort));
        const api = []
          .concat(importPluginApi.sort(_utils.sort))
          .concat(icssPluginApi.sort(_utils.sort));
        if (options.modules.exportOnlyLocals !== true) {
          imports.unshift({
            type: "api_import",
            importName: "___CSS_LOADER_API_IMPORT___",
            url: (0, _utils.stringifyRequest)(
              this,
              __nccwpck_require__.ab + "api.js",
            ),
          });
          if (options.sourceMap) {
            imports.unshift({
              importName: "___CSS_LOADER_API_SOURCEMAP_IMPORT___",
              url: (0, _utils.stringifyRequest)(
                this,
                __nccwpck_require__.ab + "sourceMaps.js",
              ),
            });
          } else {
            imports.unshift({
              importName: "___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___",
              url: (0, _utils.stringifyRequest)(
                this,
                __nccwpck_require__.ab + "noSourceMaps.js",
              ),
            });
          }
        }
        const isTemplateLiteralSupported = (0, _utils.supportTemplateLiteral)(
          this,
        );
        const importCode = (0, _utils.getImportCode)(imports, options);
        let moduleCode;
        try {
          moduleCode = (0, _utils.getModuleCode)(
            result,
            api,
            replacements,
            options,
            isTemplateLiteralSupported,
            this,
          );
        } catch (error) {
          callback(error);
          return;
        }
        const exportCode = (0, _utils.getExportCode)(
          exports,
          replacements,
          needToUseIcssPlugin,
          options,
          isTemplateLiteralSupported,
        );
        const { getJSON } = options.modules;
        if (typeof getJSON === "function") {
          try {
            await getJSON({ resourcePath, imports, exports, replacements });
          } catch (error) {
            callback(error);
            return;
          }
        }
        callback(null, `${importCode}${moduleCode}${exportCode}`);
      }
    },
    7329: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      Object.defineProperty(exports, "icssParser", {
        enumerable: true,
        get: function () {
          return _postcssIcssParser.default;
        },
      });
      Object.defineProperty(exports, "importParser", {
        enumerable: true,
        get: function () {
          return _postcssImportParser.default;
        },
      });
      Object.defineProperty(exports, "urlParser", {
        enumerable: true,
        get: function () {
          return _postcssUrlParser.default;
        },
      });
      var _postcssImportParser = _interopRequireDefault(
        __nccwpck_require__(826),
      );
      var _postcssIcssParser = _interopRequireDefault(
        __nccwpck_require__(2755),
      );
      var _postcssUrlParser = _interopRequireDefault(__nccwpck_require__(2454));
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
    },
    2755: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports["default"] = void 0;
      var _icssUtils = __nccwpck_require__(4531);
      var _utils = __nccwpck_require__(4723);
      const plugin = (options = {}) => ({
        postcssPlugin: "postcss-icss-parser",
        async OnceExit(root) {
          const importReplacements = Object.create(null);
          const { icssImports, icssExports } = (0, _icssUtils.extractICSS)(
            root,
          );
          const imports = new Map();
          const tasks = [];
          const { loaderContext } = options;
          const resolver = loaderContext.getResolve({
            dependencyType: "icss",
            conditionNames: ["style"],
            extensions: ["..."],
            mainFields: ["css", "style", "main", "..."],
            mainFiles: ["index", "..."],
            preferRelative: true,
          });
          for (const url in icssImports) {
            const tokens = icssImports[url];
            if (Object.keys(tokens).length === 0) {
              continue;
            }
            let normalizedUrl = url;
            let prefix = "";
            const queryParts = normalizedUrl.split("!");
            if (queryParts.length > 1) {
              normalizedUrl = queryParts.pop();
              prefix = queryParts.join("!");
            }
            const request = (0, _utils.requestify)(
              (0, _utils.normalizeUrl)(normalizedUrl, true),
              loaderContext.rootContext,
            );
            const doResolve = async () => {
              const resolvedUrl = await (0, _utils.resolveRequests)(
                resolver,
                loaderContext.context,
                [...new Set([normalizedUrl, request])],
              );
              if (!resolvedUrl) {
                return;
              }
              return { url: resolvedUrl, prefix, tokens };
            };
            tasks.push(doResolve());
          }
          const results = await Promise.all(tasks);
          for (let index = 0; index <= results.length - 1; index++) {
            const item = results[index];
            if (!item) {
              continue;
            }
            const newUrl = item.prefix
              ? `${item.prefix}!${item.url}`
              : item.url;
            const importKey = newUrl;
            let importName = imports.get(importKey);
            if (!importName) {
              importName = `___CSS_LOADER_ICSS_IMPORT_${imports.size}___`;
              imports.set(importKey, importName);
              options.imports.push({
                type: "icss_import",
                importName,
                url: options.urlHandler(newUrl),
                icss: true,
                index,
              });
              options.api.push({ importName, dedupe: true, index });
            }
            for (const [replacementIndex, token] of Object.keys(
              item.tokens,
            ).entries()) {
              const replacementName = `___CSS_LOADER_ICSS_IMPORT_${index}_REPLACEMENT_${replacementIndex}___`;
              const localName = item.tokens[token];
              importReplacements[token] = replacementName;
              options.replacements.push({
                replacementName,
                importName,
                localName,
              });
            }
          }
          if (Object.keys(importReplacements).length > 0) {
            (0, _icssUtils.replaceSymbols)(root, importReplacements);
          }
          for (const name of Object.keys(icssExports)) {
            const value = (0, _icssUtils.replaceValueSymbols)(
              icssExports[name],
              importReplacements,
            );
            options.exports.push({ name, value });
          }
        },
      });
      plugin.postcss = true;
      var _default = (exports["default"] = plugin);
    },
    826: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports["default"] = void 0;
      var _postcssValueParser = _interopRequireDefault(
        __nccwpck_require__(2948),
      );
      var _utils = __nccwpck_require__(4723);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function isIgnoredAfterName(atRule) {
        if (
          atRule.raws &&
          atRule.raws.afterName &&
          atRule.raws.afterName.trim().length > 0
        ) {
          const lastCommentIndex = atRule.raws.afterName.lastIndexOf("/*");
          const matched = atRule.raws.afterName
            .slice(lastCommentIndex)
            .match(_utils.WEBPACK_IGNORE_COMMENT_REGEXP);
          if (matched && matched[2] === "true") {
            return true;
          }
        }
        return false;
      }
      function isIgnoredPrevNode(atRule) {
        const prevNode = atRule.prev();
        if (prevNode && prevNode.type === "comment") {
          const matched = prevNode.text.match(
            _utils.WEBPACK_IGNORE_COMMENT_REGEXP,
          );
          if (matched && matched[2] === "true") {
            return true;
          }
        }
        return false;
      }
      function parseNode(atRule, key, options) {
        if (atRule.parent.type !== "root") {
          return;
        }
        const isIgnored =
          isIgnoredAfterName(atRule) || isIgnoredPrevNode(atRule);
        if (atRule.nodes) {
          const error = new Error(
            "It looks like you didn't end your @import statement correctly. Child nodes are attached to it.",
          );
          error.node = atRule;
          throw error;
        }
        const rawParams =
          atRule.raws &&
          atRule.raws[key] &&
          typeof atRule.raws[key].raw !== "undefined"
            ? atRule.raws[key].raw
            : atRule[key];
        const { nodes: paramsNodes } = (0, _postcssValueParser.default)(
          rawParams,
        );
        if (
          paramsNodes.length === 0 ||
          (paramsNodes[0].type !== "string" &&
            paramsNodes[0].type !== "function")
        ) {
          const error = new Error(
            `Unable to find uri in "${atRule.toString()}"`,
          );
          error.node = atRule;
          throw error;
        }
        let isStringValue;
        let url;
        if (paramsNodes[0].type === "string") {
          isStringValue = true;
          url = paramsNodes[0].value;
        } else {
          if (paramsNodes[0].value.toLowerCase() !== "url") {
            const error = new Error(
              `Unable to find uri in "${atRule.toString()}"`,
            );
            error.node = atRule;
            throw error;
          }
          isStringValue =
            paramsNodes[0].nodes.length !== 0 &&
            paramsNodes[0].nodes[0].type === "string";
          url = isStringValue
            ? paramsNodes[0].nodes[0].value
            : _postcssValueParser.default.stringify(paramsNodes[0].nodes);
        }
        url = (0, _utils.normalizeUrl)(url, isStringValue);
        let requestable = false;
        let needResolve = false;
        if (!isIgnored) {
          ({ requestable, needResolve } = (0, _utils.isURLRequestable)(
            url,
            options,
          ));
        }
        let prefix;
        if (requestable && needResolve) {
          const queryParts = url.split("!");
          if (queryParts.length > 1) {
            url = queryParts.pop();
            prefix = queryParts.join("!");
          }
        }
        if (url.trim().length === 0) {
          const error = new Error(
            `Unable to find uri in "${atRule.toString()}"`,
          );
          error.node = atRule;
          throw error;
        }
        const additionalNodes = paramsNodes.slice(1);
        let supports;
        let layer;
        let media;
        if (additionalNodes.length > 0) {
          let nodes = [];
          for (const node of additionalNodes) {
            nodes.push(node);
            const isLayerFunction =
              node.type === "function" && node.value.toLowerCase() === "layer";
            const isLayerWord =
              node.type === "word" && node.value.toLowerCase() === "layer";
            if (isLayerFunction || isLayerWord) {
              if (isLayerFunction) {
                nodes.splice(nodes.length - 1, 1, ...node.nodes);
              } else {
                nodes.splice(nodes.length - 1, 1, {
                  type: "string",
                  value: "",
                  unclosed: false,
                });
              }
              layer = _postcssValueParser.default
                .stringify(nodes)
                .trim()
                .toLowerCase();
              nodes = [];
            } else if (
              node.type === "function" &&
              node.value.toLowerCase() === "supports"
            ) {
              nodes.splice(nodes.length - 1, 1, ...node.nodes);
              supports = _postcssValueParser.default
                .stringify(nodes)
                .trim()
                .toLowerCase();
              nodes = [];
            }
          }
          if (nodes.length > 0) {
            media = _postcssValueParser.default
              .stringify(nodes)
              .trim()
              .toLowerCase();
          }
        }
        return {
          atRule,
          prefix,
          url,
          layer,
          supports,
          media,
          requestable,
          needResolve,
        };
      }
      const plugin = (options = {}) => ({
        postcssPlugin: "postcss-import-parser",
        prepare(result) {
          const parsedAtRules = [];
          return {
            AtRule: {
              import(atRule) {
                if (options.isCSSStyleSheet) {
                  options.loaderContext.emitError(
                    new Error(
                      atRule.error(
                        "'@import' rules are not allowed here and will not be processed",
                      ).message,
                    ),
                  );
                  return;
                }
                const { isSupportDataURL, isSupportAbsoluteURL } = options;
                let parsedAtRule;
                try {
                  parsedAtRule = parseNode(atRule, "params", {
                    isSupportAbsoluteURL,
                    isSupportDataURL,
                  });
                } catch (error) {
                  result.warn(error.message, { node: error.node });
                }
                if (!parsedAtRule) {
                  return;
                }
                parsedAtRules.push(parsedAtRule);
              },
            },
            async OnceExit() {
              if (parsedAtRules.length === 0) {
                return;
              }
              const { loaderContext } = options;
              const resolver = loaderContext.getResolve({
                dependencyType: "css",
                conditionNames: ["style"],
                mainFields: ["css", "style", "main", "..."],
                mainFiles: ["index", "..."],
                extensions: [".css", "..."],
                preferRelative: true,
              });
              const resolvedAtRules = await Promise.all(
                parsedAtRules.map(async (parsedAtRule) => {
                  const {
                    atRule,
                    requestable,
                    needResolve,
                    prefix,
                    url,
                    layer,
                    supports,
                    media,
                  } = parsedAtRule;
                  if (options.filter) {
                    const needKeep = await options.filter(
                      url,
                      media,
                      loaderContext.resourcePath,
                      supports,
                      layer,
                    );
                    if (!needKeep) {
                      return;
                    }
                  }
                  if (needResolve) {
                    const request = (0, _utils.requestify)(
                      url,
                      loaderContext.rootContext,
                    );
                    const resolvedUrl = await (0, _utils.resolveRequests)(
                      resolver,
                      loaderContext.context,
                      [...new Set([request, url])],
                    );
                    if (!resolvedUrl) {
                      return;
                    }
                    if (resolvedUrl === loaderContext.resourcePath) {
                      atRule.remove();
                      return;
                    }
                    atRule.remove();
                    return {
                      url: resolvedUrl,
                      layer,
                      supports,
                      media,
                      prefix,
                      requestable,
                    };
                  }
                  atRule.remove();
                  return { url, layer, supports, media, prefix, requestable };
                }),
              );
              const urlToNameMap = new Map();
              for (
                let index = 0;
                index <= resolvedAtRules.length - 1;
                index++
              ) {
                const resolvedAtRule = resolvedAtRules[index];
                if (!resolvedAtRule) {
                  continue;
                }
                const { url, requestable, layer, supports, media } =
                  resolvedAtRule;
                if (!requestable) {
                  options.api.push({ url, layer, supports, media, index });
                  continue;
                }
                const { prefix } = resolvedAtRule;
                const newUrl = prefix ? `${prefix}!${url}` : url;
                let importName = urlToNameMap.get(newUrl);
                if (!importName) {
                  importName = `___CSS_LOADER_AT_RULE_IMPORT_${urlToNameMap.size}___`;
                  urlToNameMap.set(newUrl, importName);
                  options.imports.push({
                    type: "rule_import",
                    importName,
                    url: options.urlHandler(newUrl),
                    index,
                  });
                }
                options.api.push({ importName, layer, supports, media, index });
              }
            },
          };
        },
      });
      plugin.postcss = true;
      var _default = (exports["default"] = plugin);
    },
    2454: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports["default"] = void 0;
      var _postcssValueParser = _interopRequireDefault(
        __nccwpck_require__(2948),
      );
      var _utils = __nccwpck_require__(4723);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      const isUrlFunc = /url/i;
      const isImageSetFunc = /^(?:-webkit-)?image-set$/i;
      const needParseDeclaration = /(?:url|(?:-webkit-)?image-set)\(/i;
      function getNodeFromUrlFunc(node) {
        return node.nodes && node.nodes[0];
      }
      function getWebpackIgnoreCommentValue(index, nodes, inBetween) {
        if (index === 0 && typeof inBetween !== "undefined") {
          return inBetween;
        }
        let prevValueNode = nodes[index - 1];
        if (!prevValueNode) {
          return;
        }
        if (prevValueNode.type === "space") {
          if (!nodes[index - 2]) {
            return;
          }
          prevValueNode = nodes[index - 2];
        }
        if (prevValueNode.type !== "comment") {
          return;
        }
        const matched = prevValueNode.value.match(
          _utils.WEBPACK_IGNORE_COMMENT_REGEXP,
        );
        return matched && matched[2] === "true";
      }
      function shouldHandleURL(url, declaration, result, options) {
        if (url.length === 0) {
          result.warn(`Unable to find uri in '${declaration.toString()}'`, {
            node: declaration,
          });
          return { requestable: false, needResolve: false };
        }
        return (0, _utils.isURLRequestable)(url, options);
      }
      function parseDeclaration(declaration, key, result, options) {
        if (!needParseDeclaration.test(declaration[key])) {
          return;
        }
        const parsed = (0, _postcssValueParser.default)(
          declaration.raws &&
            declaration.raws.value &&
            declaration.raws.value.raw
            ? declaration.raws.value.raw
            : declaration[key],
        );
        let inBetween;
        if (declaration.raws && declaration.raws.between) {
          const lastCommentIndex = declaration.raws.between.lastIndexOf("/*");
          const matched = declaration.raws.between
            .slice(lastCommentIndex)
            .match(_utils.WEBPACK_IGNORE_COMMENT_REGEXP);
          if (matched) {
            inBetween = matched[2] === "true";
          }
        }
        let isIgnoreOnDeclaration = false;
        const prevNode = declaration.prev();
        if (prevNode && prevNode.type === "comment") {
          const matched = prevNode.text.match(
            _utils.WEBPACK_IGNORE_COMMENT_REGEXP,
          );
          if (matched) {
            isIgnoreOnDeclaration = matched[2] === "true";
          }
        }
        let needIgnore;
        const parsedURLs = [];
        parsed.walk((valueNode, index, valueNodes) => {
          if (valueNode.type !== "function") {
            return;
          }
          if (isUrlFunc.test(valueNode.value)) {
            needIgnore = getWebpackIgnoreCommentValue(
              index,
              valueNodes,
              inBetween,
            );
            if (
              (isIgnoreOnDeclaration && typeof needIgnore === "undefined") ||
              needIgnore
            ) {
              if (needIgnore) {
                needIgnore = undefined;
              }
              return;
            }
            const { nodes } = valueNode;
            const isStringValue =
              nodes.length !== 0 && nodes[0].type === "string";
            let url = isStringValue
              ? nodes[0].value
              : _postcssValueParser.default.stringify(nodes);
            url = (0, _utils.normalizeUrl)(url, isStringValue);
            const { requestable, needResolve } = shouldHandleURL(
              url,
              declaration,
              result,
              options,
            );
            if (!requestable) {
              return false;
            }
            const queryParts = url.split("!");
            let prefix;
            if (queryParts.length > 1) {
              url = queryParts.pop();
              prefix = queryParts.join("!");
            }
            parsedURLs.push({
              declaration,
              parsed,
              node: getNodeFromUrlFunc(valueNode),
              prefix,
              url,
              needQuotes: false,
              needResolve,
            });
            return false;
          } else if (isImageSetFunc.test(valueNode.value)) {
            for (const [innerIndex, nNode] of valueNode.nodes.entries()) {
              const { type, value } = nNode;
              if (type === "function" && isUrlFunc.test(value)) {
                needIgnore = getWebpackIgnoreCommentValue(
                  innerIndex,
                  valueNode.nodes,
                );
                if (
                  (isIgnoreOnDeclaration &&
                    typeof needIgnore === "undefined") ||
                  needIgnore
                ) {
                  if (needIgnore) {
                    needIgnore = undefined;
                  }
                  continue;
                }
                const { nodes } = nNode;
                const isStringValue =
                  nodes.length !== 0 && nodes[0].type === "string";
                let url = isStringValue
                  ? nodes[0].value
                  : _postcssValueParser.default.stringify(nodes);
                url = (0, _utils.normalizeUrl)(url, isStringValue);
                const { requestable, needResolve } = shouldHandleURL(
                  url,
                  declaration,
                  result,
                  options,
                );
                if (!requestable) {
                  return false;
                }
                const queryParts = url.split("!");
                let prefix;
                if (queryParts.length > 1) {
                  url = queryParts.pop();
                  prefix = queryParts.join("!");
                }
                parsedURLs.push({
                  declaration,
                  parsed,
                  node: getNodeFromUrlFunc(nNode),
                  prefix,
                  url,
                  needQuotes: false,
                  needResolve,
                });
              } else if (type === "string") {
                needIgnore = getWebpackIgnoreCommentValue(
                  innerIndex,
                  valueNode.nodes,
                );
                if (
                  (isIgnoreOnDeclaration &&
                    typeof needIgnore === "undefined") ||
                  needIgnore
                ) {
                  if (needIgnore) {
                    needIgnore = undefined;
                  }
                  continue;
                }
                let url = (0, _utils.normalizeUrl)(value, true);
                const { requestable, needResolve } = shouldHandleURL(
                  url,
                  declaration,
                  result,
                  options,
                );
                if (!requestable) {
                  return false;
                }
                const queryParts = url.split("!");
                let prefix;
                if (queryParts.length > 1) {
                  url = queryParts.pop();
                  prefix = queryParts.join("!");
                }
                parsedURLs.push({
                  declaration,
                  parsed,
                  node: nNode,
                  prefix,
                  url,
                  needQuotes: true,
                  needResolve,
                });
              }
            }
            return false;
          }
        });
        return parsedURLs;
      }
      const plugin = (options = {}) => ({
        postcssPlugin: "postcss-url-parser",
        prepare(result) {
          const parsedDeclarations = [];
          return {
            Declaration(declaration) {
              const { isSupportDataURL, isSupportAbsoluteURL } = options;
              const parsedURL = parseDeclaration(declaration, "value", result, {
                isSupportDataURL,
                isSupportAbsoluteURL,
              });
              if (!parsedURL) {
                return;
              }
              parsedDeclarations.push(...parsedURL);
            },
            async OnceExit() {
              if (parsedDeclarations.length === 0) {
                return;
              }
              const resolvedDeclarations = await Promise.all(
                parsedDeclarations.map(async (parsedDeclaration) => {
                  const { url, needResolve } = parsedDeclaration;
                  if (options.filter) {
                    const needKeep = await options.filter(url);
                    if (!needKeep) {
                      return;
                    }
                  }
                  if (!needResolve) {
                    return parsedDeclaration;
                  }
                  const splittedUrl = url.split(/(\?)?#/);
                  const [pathname, query, hashOrQuery] = splittedUrl;
                  let hash = query ? "?" : "";
                  hash += hashOrQuery ? `#${hashOrQuery}` : "";
                  const { resolver, rootContext } = options;
                  const request = (0, _utils.requestify)(
                    pathname,
                    rootContext,
                    Boolean(resolver),
                  );
                  if (!resolver) {
                    return { ...parsedDeclaration, url: request, hash };
                  }
                  const resolvedURL = await (0, _utils.resolveRequests)(
                    resolver,
                    options.context,
                    [...new Set([request, url])],
                  );
                  if (!resolvedURL) {
                    return;
                  }
                  return { ...parsedDeclaration, url: resolvedURL, hash };
                }),
              );
              const urlToNameMap = new Map();
              const urlToReplacementMap = new Map();
              let hasUrlImportHelper = false;
              for (
                let index = 0;
                index <= resolvedDeclarations.length - 1;
                index++
              ) {
                const item = resolvedDeclarations[index];
                if (!item) {
                  continue;
                }
                if (!hasUrlImportHelper) {
                  options.imports.push({
                    type: "get_url_import",
                    importName: "___CSS_LOADER_GET_URL_IMPORT___",
                    url: options.urlHandler(
                      __nccwpck_require__.ab + "getUrl.js",
                    ),
                    index: -1,
                  });
                  hasUrlImportHelper = true;
                }
                const { url, prefix } = item;
                const newUrl = prefix ? `${prefix}!${url}` : url;
                let importName = urlToNameMap.get(newUrl);
                if (!importName) {
                  importName = `___CSS_LOADER_URL_IMPORT_${urlToNameMap.size}___`;
                  urlToNameMap.set(newUrl, importName);
                  options.imports.push({
                    type: "url",
                    importName,
                    url: options.resolver
                      ? options.urlHandler(newUrl)
                      : JSON.stringify(newUrl),
                    index,
                  });
                }
                const { hash, needQuotes } = item;
                const replacementKey = JSON.stringify({
                  newUrl,
                  hash,
                  needQuotes,
                });
                let replacementName = urlToReplacementMap.get(replacementKey);
                if (!replacementName) {
                  replacementName = `___CSS_LOADER_URL_REPLACEMENT_${urlToReplacementMap.size}___`;
                  urlToReplacementMap.set(replacementKey, replacementName);
                  options.replacements.push({
                    replacementName,
                    importName,
                    hash,
                    needQuotes,
                  });
                }
                item.node.type = "word";
                item.node.value = replacementName;
                item.declaration.value = item.parsed.toString();
              }
            },
          };
        },
      });
      plugin.postcss = true;
      var _default = (exports["default"] = plugin);
    },
    4723: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.WEBPACK_IGNORE_COMMENT_REGEXP = void 0;
      exports.camelCase = camelCase;
      exports.combineRequests = combineRequests;
      exports.defaultGetLocalIdent = defaultGetLocalIdent;
      exports.getExportCode = getExportCode;
      exports.getFilter = getFilter;
      exports.getImportCode = getImportCode;
      exports.getModuleCode = getModuleCode;
      exports.getModulesOptions = getModulesOptions;
      exports.getModulesPlugins = getModulesPlugins;
      exports.getPreRequester = getPreRequester;
      exports.isDataUrl = isDataUrl;
      exports.isURLRequestable = isURLRequestable;
      exports.normalizeOptions = normalizeOptions;
      exports.normalizeSourceMap = normalizeSourceMap;
      exports.normalizeUrl = normalizeUrl;
      exports.requestify = requestify;
      exports.resolveRequests = resolveRequests;
      exports.shouldUseIcssPlugin = shouldUseIcssPlugin;
      exports.shouldUseImportPlugin = shouldUseImportPlugin;
      exports.shouldUseModulesPlugins = shouldUseModulesPlugins;
      exports.shouldUseURLPlugin = shouldUseURLPlugin;
      exports.sort = sort;
      exports.stringifyRequest = stringifyRequest;
      exports.supportTemplateLiteral = supportTemplateLiteral;
      exports.syntaxErrorFactory = syntaxErrorFactory;
      exports.warningFactory = warningFactory;
      var _url = __nccwpck_require__(7016);
      var _path = _interopRequireDefault(__nccwpck_require__(6928));
      var _postcssModulesValues = _interopRequireDefault(
        __nccwpck_require__(5267),
      );
      var _postcssModulesLocalByDefault = _interopRequireDefault(
        __nccwpck_require__(9433),
      );
      var _postcssModulesExtractImports = _interopRequireDefault(
        __nccwpck_require__(8137),
      );
      var _postcssModulesScope = _interopRequireDefault(
        __nccwpck_require__(6167),
      );
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      const WEBPACK_IGNORE_COMMENT_REGEXP =
        (exports.WEBPACK_IGNORE_COMMENT_REGEXP =
          /webpackIgnore:(\s+)?(true|false)/);
      function stringifyRequest(loaderContext, request) {
        return JSON.stringify(
          loaderContext.utils.contextify(
            loaderContext.context || loaderContext.rootContext,
            request,
          ),
        );
      }
      const IS_NATIVE_WIN32_PATH = /^[a-z]:[/\\]|^\\\\/i;
      const IS_MODULE_REQUEST = /^[^?]*~/;
      function urlToRequest(url, root) {
        let request;
        if (IS_NATIVE_WIN32_PATH.test(url)) {
          request = url;
        } else if (typeof root !== "undefined" && /^\//.test(url)) {
          request = root + url;
        } else if (/^\.\.?\//.test(url)) {
          request = url;
        } else {
          request = `./${url}`;
        }
        if (IS_MODULE_REQUEST.test(request)) {
          request = request.replace(IS_MODULE_REQUEST, "");
        }
        return request;
      }
      const regexSingleEscape = /[ -,.\/:-@[\]\^`{-~]/;
      const regexExcessiveSpaces =
        /(^|\\+)?(\\[A-F0-9]{1,6})\x20(?![a-fA-F0-9\x20])/g;
      const preserveCamelCase = (string) => {
        let result = string;
        let isLastCharLower = false;
        let isLastCharUpper = false;
        let isLastLastCharUpper = false;
        for (let i = 0; i < result.length; i++) {
          const character = result[i];
          if (isLastCharLower && /[\p{Lu}]/u.test(character)) {
            result = `${result.slice(0, i)}-${result.slice(i)}`;
            isLastCharLower = false;
            isLastLastCharUpper = isLastCharUpper;
            isLastCharUpper = true;
            i += 1;
          } else if (
            isLastCharUpper &&
            isLastLastCharUpper &&
            /[\p{Ll}]/u.test(character)
          ) {
            result = `${result.slice(0, i - 1)}-${result.slice(i - 1)}`;
            isLastLastCharUpper = isLastCharUpper;
            isLastCharUpper = false;
            isLastCharLower = true;
          } else {
            isLastCharLower =
              character.toLowerCase() === character &&
              character.toUpperCase() !== character;
            isLastLastCharUpper = isLastCharUpper;
            isLastCharUpper =
              character.toUpperCase() === character &&
              character.toLowerCase() !== character;
          }
        }
        return result;
      };
      function camelCase(input) {
        let result = input.trim();
        if (result.length === 0) {
          return "";
        }
        if (result.length === 1) {
          return result.toLowerCase();
        }
        const hasUpperCase = result !== result.toLowerCase();
        if (hasUpperCase) {
          result = preserveCamelCase(result);
        }
        return result
          .replace(/^[_.\- ]+/, "")
          .toLowerCase()
          .replace(/[_.\- ]+([\p{Alpha}\p{N}_]|$)/gu, (_, p1) =>
            p1.toUpperCase(),
          )
          .replace(/\d+([\p{Alpha}\p{N}_]|$)/gu, (m) => m.toUpperCase());
      }
      function escape(string) {
        let output = "";
        let counter = 0;
        while (counter < string.length) {
          const character = string.charAt(counter++);
          let value;
          if (/[\t\n\f\r\x0B]/.test(character)) {
            const codePoint = character.charCodeAt();
            value = `\\${codePoint.toString(16).toUpperCase()} `;
          } else if (character === "\\" || regexSingleEscape.test(character)) {
            value = `\\${character}`;
          } else {
            value = character;
          }
          output += value;
        }
        const firstChar = string.charAt(0);
        if (/^-[-\d]/.test(output)) {
          output = `\\-${output.slice(1)}`;
        } else if (/\d/.test(firstChar)) {
          output = `\\3${firstChar} ${output.slice(1)}`;
        }
        output = output.replace(regexExcessiveSpaces, ($0, $1, $2) => {
          if ($1 && $1.length % 2) {
            return $0;
          }
          return ($1 || "") + $2;
        });
        return output;
      }
      function gobbleHex(str) {
        const lower = str.toLowerCase();
        let hex = "";
        let spaceTerminated = false;
        for (let i = 0; i < 6 && lower[i] !== undefined; i++) {
          const code = lower.charCodeAt(i);
          const valid =
            (code >= 97 && code <= 102) || (code >= 48 && code <= 57);
          spaceTerminated = code === 32;
          if (!valid) {
            break;
          }
          hex += lower[i];
        }
        if (hex.length === 0) {
          return undefined;
        }
        const codePoint = parseInt(hex, 16);
        const isSurrogate = codePoint >= 55296 && codePoint <= 57343;
        if (isSurrogate || codePoint === 0 || codePoint > 1114111) {
          return ["�", hex.length + (spaceTerminated ? 1 : 0)];
        }
        return [
          String.fromCodePoint(codePoint),
          hex.length + (spaceTerminated ? 1 : 0),
        ];
      }
      const CONTAINS_ESCAPE = /\\/;
      function unescape(str) {
        const needToProcess = CONTAINS_ESCAPE.test(str);
        if (!needToProcess) {
          return str;
        }
        let ret = "";
        for (let i = 0; i < str.length; i++) {
          if (str[i] === "\\") {
            const gobbled = gobbleHex(str.slice(i + 1, i + 7));
            if (gobbled !== undefined) {
              ret += gobbled[0];
              i += gobbled[1];
              continue;
            }
            if (str[i + 1] === "\\") {
              ret += "\\";
              i += 1;
              continue;
            }
            if (str.length === i + 1) {
              ret += str[i];
            }
            continue;
          }
          ret += str[i];
        }
        return ret;
      }
      function normalizePath(file) {
        return _path.default.sep === "\\" ? file.replace(/\\/g, "/") : file;
      }
      const filenameReservedRegex = /[<>:"/\\|?*]/g;
      const reControlChars = /[\u0000-\u001f\u0080-\u009f]/g;
      function escapeLocalIdent(localident) {
        return escape(
          localident
            .replace(/^((-?[0-9])|--)/, "_$1")
            .replace(filenameReservedRegex, "-")
            .replace(reControlChars, "-")
            .replace(/\./g, "-"),
        );
      }
      function defaultGetLocalIdent(
        loaderContext,
        localIdentName,
        localName,
        options,
      ) {
        const { context, hashSalt, hashStrategy } = options;
        const { resourcePath } = loaderContext;
        let relativeResourcePath = normalizePath(
          _path.default.relative(context, resourcePath),
        );
        if (loaderContext._module && loaderContext._module.matchResource) {
          relativeResourcePath = `${normalizePath(_path.default.relative(context, loaderContext._module.matchResource))}`;
        }
        options.content =
          hashStrategy === "minimal-subset" && /\[local\]/.test(localIdentName)
            ? relativeResourcePath
            : `${relativeResourcePath}\0${localName}`;
        let { hashFunction, hashDigest, hashDigestLength } = options;
        const matches = localIdentName.match(
          /\[(?:([^:\]]+):)?(?:(hash|contenthash|fullhash))(?::([a-z]+\d*))?(?::(\d+))?\]/i,
        );
        if (matches) {
          const hashName = matches[2] || hashFunction;
          hashFunction = matches[1] || hashFunction;
          hashDigest = matches[3] || hashDigest;
          hashDigestLength = matches[4] || hashDigestLength;
          localIdentName = localIdentName.replace(
            /\[(?:([^:\]]+):)?(?:hash|contenthash|fullhash)(?::([a-z]+\d*))?(?::(\d+))?\]/gi,
            () => (hashName === "fullhash" ? "[fullhash]" : "[contenthash]"),
          );
        }
        let localIdentHash = "";
        for (let tier = 0; localIdentHash.length < hashDigestLength; tier++) {
          const hash =
            loaderContext._compiler.webpack.util.createHash(hashFunction);
          if (hashSalt) {
            hash.update(hashSalt);
          }
          const tierSalt = Buffer.allocUnsafe(4);
          tierSalt.writeUInt32LE(tier);
          hash.update(tierSalt);
          hash.update(Buffer.from(options.content, "utf8"));
          localIdentHash = (localIdentHash + hash.digest(hashDigest))
            .replace(/^\d+/, "")
            .replace(/\//g, "_")
            .replace(/[^A-Za-z0-9_]+/g, "")
            .slice(0, hashDigestLength);
        }
        const ext = _path.default.extname(resourcePath);
        const base = _path.default.basename(resourcePath);
        const name = base.slice(0, base.length - ext.length);
        const data = {
          filename: _path.default.relative(context, resourcePath),
          contentHash: localIdentHash,
          chunk: { name, hash: localIdentHash, contentHash: localIdentHash },
        };
        let result = loaderContext._compilation.getPath(localIdentName, data);
        if (/\[folder\]/gi.test(result)) {
          const dirname = _path.default.dirname(resourcePath);
          let directory = normalizePath(
            _path.default.relative(context, `${dirname + _path.default.sep}_`),
          );
          directory = directory.substring(0, directory.length - 1);
          let folder = "";
          if (directory.length > 1) {
            folder = _path.default.basename(directory);
          }
          result = result.replace(/\[folder\]/gi, () => folder);
        }
        if (options.regExp) {
          const match = resourcePath.match(options.regExp);
          if (match) {
            match.forEach((matched, i) => {
              result = result.replace(new RegExp(`\\[${i}\\]`, "ig"), matched);
            });
          }
        }
        return result;
      }
      function fixedEncodeURIComponent(str) {
        return str.replace(
          /[!'()*]/g,
          (c) => `%${c.charCodeAt(0).toString(16)}`,
        );
      }
      function isDataUrl(url) {
        if (/^data:/i.test(url)) {
          return true;
        }
        return false;
      }
      const NATIVE_WIN32_PATH = /^[A-Z]:[/\\]|^\\\\/i;
      function normalizeUrl(url, isStringValue) {
        let normalizedUrl = url
          .replace(/^( |\t\n|\r\n|\r|\f)*/g, "")
          .replace(/( |\t\n|\r\n|\r|\f)*$/g, "");
        if (isStringValue && /\\(\n|\r\n|\r|\f)/.test(normalizedUrl)) {
          normalizedUrl = normalizedUrl.replace(/\\(\n|\r\n|\r|\f)/g, "");
        }
        if (NATIVE_WIN32_PATH.test(url)) {
          try {
            normalizedUrl = decodeURI(normalizedUrl);
          } catch (error) {}
          return normalizedUrl;
        }
        normalizedUrl = unescape(normalizedUrl);
        if (isDataUrl(url)) {
          return fixedEncodeURIComponent(normalizedUrl);
        }
        try {
          normalizedUrl = decodeURI(normalizedUrl);
        } catch (error) {}
        return normalizedUrl;
      }
      function requestify(url, rootContext, needToResolveURL = true) {
        if (needToResolveURL) {
          if (/^file:/i.test(url)) {
            return (0, _url.fileURLToPath)(url);
          }
          return url.charAt(0) === "/"
            ? urlToRequest(url, rootContext)
            : urlToRequest(url);
        }
        if (url.charAt(0) === "/" || /^file:/i.test(url)) {
          return url;
        }
        if (IS_MODULE_REQUEST.test(url)) {
          return url.replace(IS_MODULE_REQUEST, "");
        }
        return url;
      }
      function getFilter(filter, resourcePath) {
        return (...args) => {
          if (typeof filter === "function") {
            return filter(...args, resourcePath);
          }
          return true;
        };
      }
      function getValidLocalName(localName, exportLocalsConvention) {
        const result = exportLocalsConvention(localName);
        return Array.isArray(result) ? result[0] : result;
      }
      const IS_MODULES = /\.module(s)?\.\w+$/i;
      const IS_ICSS = /\.icss\.\w+$/i;
      function getModulesOptions(
        rawOptions,
        esModule,
        exportType,
        loaderContext,
      ) {
        if (
          typeof rawOptions.modules === "boolean" &&
          rawOptions.modules === false
        ) {
          return false;
        }
        const resourcePath =
          (loaderContext._module && loaderContext._module.matchResource) ||
          loaderContext.resourcePath;
        let auto;
        let rawModulesOptions;
        if (typeof rawOptions.modules === "undefined") {
          rawModulesOptions = {};
          auto = true;
        } else if (typeof rawOptions.modules === "boolean") {
          rawModulesOptions = {};
        } else if (typeof rawOptions.modules === "string") {
          rawModulesOptions = { mode: rawOptions.modules };
        } else {
          rawModulesOptions = rawOptions.modules;
          ({ auto } = rawModulesOptions);
        }
        const { outputOptions } = loaderContext._compilation;
        const needNamedExport =
          exportType === "css-style-sheet" || exportType === "string";
        const namedExport =
          typeof rawModulesOptions.namedExport !== "undefined"
            ? rawModulesOptions.namedExport
            : needNamedExport || esModule;
        const exportLocalsConvention =
          typeof rawModulesOptions.exportLocalsConvention !== "undefined"
            ? rawModulesOptions.exportLocalsConvention
            : namedExport
              ? "as-is"
              : "camel-case-only";
        const modulesOptions = {
          auto,
          mode: "local",
          exportGlobals: false,
          localIdentName: "[hash:base64]",
          localIdentContext: loaderContext.rootContext,
          localIdentHashSalt: outputOptions.hashSalt,
          localIdentHashFunction: outputOptions.hashFunction,
          localIdentHashDigest: outputOptions.hashDigest,
          localIdentHashDigestLength: outputOptions.hashDigestLength,
          localIdentRegExp: undefined,
          getLocalIdent: undefined,
          exportOnlyLocals: false,
          ...rawModulesOptions,
          exportLocalsConvention,
          namedExport,
        };
        if (typeof modulesOptions.exportLocalsConvention === "string") {
          const { exportLocalsConvention } = modulesOptions;
          modulesOptions.exportLocalsConvention = (name) => {
            switch (exportLocalsConvention) {
              case "camel-case":
              case "camelCase": {
                return [name, camelCase(name)];
              }
              case "camel-case-only":
              case "camelCaseOnly": {
                return camelCase(name);
              }
              case "dashes": {
                return [name, dashesCamelCase(name)];
              }
              case "dashes-only":
              case "dashesOnly": {
                return dashesCamelCase(name);
              }
              case "as-is":
              case "asIs":
              default:
                return name;
            }
          };
        }
        if (typeof modulesOptions.auto === "boolean") {
          const isModules =
            modulesOptions.auto && IS_MODULES.test(resourcePath);
          let isIcss;
          if (!isModules) {
            isIcss = IS_ICSS.test(resourcePath);
            if (isIcss) {
              modulesOptions.mode = "icss";
            }
          }
          if (!isModules && !isIcss) {
            return false;
          }
        } else if (modulesOptions.auto instanceof RegExp) {
          const isModules = modulesOptions.auto.test(resourcePath);
          if (!isModules) {
            return false;
          }
        } else if (typeof modulesOptions.auto === "function") {
          const { resourceQuery, resourceFragment } = loaderContext;
          const isModule = modulesOptions.auto(
            resourcePath,
            resourceQuery,
            resourceFragment,
          );
          if (!isModule) {
            return false;
          }
        }
        if (typeof modulesOptions.mode === "function") {
          modulesOptions.mode = modulesOptions.mode(
            loaderContext.resourcePath,
            loaderContext.resourceQuery,
            loaderContext.resourceFragment,
          );
        }
        if (needNamedExport) {
          if (esModule === false) {
            throw new Error(
              "The 'exportType' option with the 'css-style-sheet' or 'string' value requires the 'esModule' option to be enabled",
            );
          }
          if (modulesOptions.namedExport === false) {
            throw new Error(
              "The 'exportType' option with the 'css-style-sheet' or 'string' value requires the 'modules.namedExport' option to be enabled",
            );
          }
        }
        if (modulesOptions.namedExport === true && esModule === false) {
          throw new Error(
            "The 'modules.namedExport' option requires the 'esModule' option to be enabled",
          );
        }
        return modulesOptions;
      }
      function normalizeOptions(rawOptions, loaderContext) {
        const exportType =
          typeof rawOptions.exportType === "undefined"
            ? "array"
            : rawOptions.exportType;
        const esModule =
          typeof rawOptions.esModule === "undefined"
            ? true
            : rawOptions.esModule;
        const modulesOptions = getModulesOptions(
          rawOptions,
          esModule,
          exportType,
          loaderContext,
        );
        return {
          url: typeof rawOptions.url === "undefined" ? true : rawOptions.url,
          import:
            typeof rawOptions.import === "undefined" ? true : rawOptions.import,
          modules: modulesOptions,
          sourceMap:
            typeof rawOptions.sourceMap === "boolean"
              ? rawOptions.sourceMap
              : loaderContext.sourceMap,
          importLoaders:
            typeof rawOptions.importLoaders === "string"
              ? parseInt(rawOptions.importLoaders, 10)
              : rawOptions.importLoaders,
          esModule,
          exportType,
        };
      }
      function shouldUseImportPlugin(options) {
        if (options.modules.exportOnlyLocals) {
          return false;
        }
        if (typeof options.import === "boolean") {
          return options.import;
        }
        return true;
      }
      function shouldUseURLPlugin(options) {
        if (options.modules.exportOnlyLocals) {
          return false;
        }
        if (typeof options.url === "boolean") {
          return options.url;
        }
        return true;
      }
      function shouldUseModulesPlugins(options) {
        if (typeof options.modules === "boolean" && options.modules === false) {
          return false;
        }
        return options.modules.mode !== "icss";
      }
      function shouldUseIcssPlugin(options) {
        return Boolean(options.modules);
      }
      function getModulesPlugins(options, loaderContext) {
        const {
          mode,
          getLocalIdent,
          localIdentName,
          localIdentContext,
          localIdentHashSalt,
          localIdentHashFunction,
          localIdentHashDigest,
          localIdentHashDigestLength,
          localIdentRegExp,
          hashStrategy,
        } = options.modules;
        let plugins = [];
        try {
          plugins = [
            _postcssModulesValues.default,
            (0, _postcssModulesLocalByDefault.default)({ mode }),
            (0, _postcssModulesExtractImports.default)(),
            (0, _postcssModulesScope.default)({
              generateScopedName(exportName, resourceFile, rawCss, node) {
                let localIdent;
                if (typeof getLocalIdent !== "undefined") {
                  localIdent = getLocalIdent(
                    loaderContext,
                    localIdentName,
                    unescape(exportName),
                    {
                      context: localIdentContext,
                      hashSalt: localIdentHashSalt,
                      hashFunction: localIdentHashFunction,
                      hashDigest: localIdentHashDigest,
                      hashDigestLength: localIdentHashDigestLength,
                      hashStrategy,
                      regExp: localIdentRegExp,
                      node,
                    },
                  );
                }
                if (typeof localIdent === "undefined" || localIdent === null) {
                  localIdent = defaultGetLocalIdent(
                    loaderContext,
                    localIdentName,
                    unescape(exportName),
                    {
                      context: localIdentContext,
                      hashSalt: localIdentHashSalt,
                      hashFunction: localIdentHashFunction,
                      hashDigest: localIdentHashDigest,
                      hashDigestLength: localIdentHashDigestLength,
                      hashStrategy,
                      regExp: localIdentRegExp,
                      node,
                    },
                  );
                  return escapeLocalIdent(localIdent).replace(
                    /\\\[local\\]/gi,
                    exportName,
                  );
                }
                return escapeLocalIdent(localIdent);
              },
              exportGlobals: options.modules.exportGlobals,
            }),
          ];
        } catch (error) {
          loaderContext.emitError(error);
        }
        return plugins;
      }
      const ABSOLUTE_SCHEME = /^[a-z0-9+\-.]+:/i;
      function getURLType(source) {
        if (source[0] === "/") {
          if (source[1] === "/") {
            return "scheme-relative";
          }
          return "path-absolute";
        }
        if (IS_NATIVE_WIN32_PATH.test(source)) {
          return "path-absolute";
        }
        return ABSOLUTE_SCHEME.test(source) ? "absolute" : "path-relative";
      }
      function normalizeSourceMap(map, resourcePath) {
        let newMap = map;
        if (typeof newMap === "string") {
          newMap = JSON.parse(newMap);
        }
        delete newMap.file;
        const { sourceRoot } = newMap;
        delete newMap.sourceRoot;
        if (newMap.sources) {
          newMap.sources = newMap.sources.map((source) => {
            if (source.indexOf("<") === 0) {
              return source;
            }
            const sourceType = getURLType(source);
            if (
              sourceType === "path-relative" ||
              sourceType === "path-absolute"
            ) {
              const absoluteSource =
                sourceType === "path-relative" && sourceRoot
                  ? _path.default.resolve(sourceRoot, normalizePath(source))
                  : normalizePath(source);
              return _path.default.relative(
                _path.default.dirname(resourcePath),
                absoluteSource,
              );
            }
            return source;
          });
        }
        return newMap;
      }
      function getPreRequester({ loaders, loaderIndex }) {
        const cache = Object.create(null);
        return (number) => {
          if (cache[number]) {
            return cache[number];
          }
          if (number === false) {
            cache[number] = "";
          } else {
            const loadersRequest = loaders
              .slice(
                loaderIndex,
                loaderIndex + 1 + (typeof number !== "number" ? 0 : number),
              )
              .map((x) => x.request)
              .join("!");
            cache[number] = `-!${loadersRequest}!`;
          }
          return cache[number];
        };
      }
      function getImportCode(imports, options) {
        let code = "";
        for (const item of imports) {
          const { importName, url, icss, type } = item;
          if (options.esModule) {
            if (icss && options.modules.namedExport) {
              code += `import ${options.modules.exportOnlyLocals ? "" : `${importName}, `}* as ${importName}_NAMED___ from ${url};\n`;
            } else {
              code +=
                type === "url"
                  ? `var ${importName} = new URL(${url}, import.meta.url);\n`
                  : `import ${importName} from ${url};\n`;
            }
          } else {
            code += `var ${importName} = require(${url});\n`;
          }
        }
        return code ? `// Imports\n${code}` : "";
      }
      function normalizeSourceMapForRuntime(map, loaderContext) {
        const resultMap = map ? map.toJSON() : null;
        if (resultMap) {
          delete resultMap.file;
          if (
            loaderContext._compilation &&
            loaderContext._compilation.options &&
            loaderContext._compilation.options.devtool &&
            loaderContext._compilation.options.devtool.includes("nosources")
          ) {
            delete resultMap.sourcesContent;
          }
          resultMap.sourceRoot = "";
          resultMap.sources = resultMap.sources.map((source) => {
            if (source.indexOf("<") === 0) {
              return source;
            }
            const sourceType = getURLType(source);
            if (sourceType !== "path-relative") {
              return source;
            }
            const resourceDirname = _path.default.dirname(
              loaderContext.resourcePath,
            );
            const absoluteSource = _path.default.resolve(
              resourceDirname,
              source,
            );
            const contextifyPath = normalizePath(
              _path.default.relative(loaderContext.rootContext, absoluteSource),
            );
            return `webpack://./${contextifyPath}`;
          });
        }
        return JSON.stringify(resultMap);
      }
      function printParams(media, dedupe, supports, layer) {
        let result = "";
        if (typeof layer !== "undefined") {
          result = `, ${JSON.stringify(layer)}`;
        }
        if (typeof supports !== "undefined") {
          result = `, ${JSON.stringify(supports)}${result}`;
        } else if (result.length > 0) {
          result = `, undefined${result}`;
        }
        if (dedupe) {
          result = `, true${result}`;
        } else if (result.length > 0) {
          result = `, false${result}`;
        }
        if (media) {
          result = `${JSON.stringify(media)}${result}`;
        } else if (result.length > 0) {
          result = `""${result}`;
        }
        return result;
      }
      function getModuleCode(
        result,
        api,
        replacements,
        options,
        isTemplateLiteralSupported,
        loaderContext,
      ) {
        if (options.modules.exportOnlyLocals === true) {
          return "";
        }
        let sourceMapValue = "";
        if (options.sourceMap) {
          const sourceMap = result.map;
          sourceMapValue = `,${normalizeSourceMapForRuntime(sourceMap, loaderContext)}`;
        }
        let code = isTemplateLiteralSupported
          ? convertToTemplateLiteral(result.css)
          : JSON.stringify(result.css);
        let beforeCode = `var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(${options.sourceMap ? "___CSS_LOADER_API_SOURCEMAP_IMPORT___" : "___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___"});\n`;
        for (const item of api) {
          const { url, layer, supports, media, dedupe } = item;
          if (url) {
            const printedParam = printParams(media, undefined, supports, layer);
            beforeCode += `___CSS_LOADER_EXPORT___.push([module.id, ${JSON.stringify(`@import url(${url});`)}${printedParam.length > 0 ? `, ${printedParam}` : ""}]);\n`;
          } else {
            const printedParam = printParams(media, dedupe, supports, layer);
            beforeCode += `___CSS_LOADER_EXPORT___.i(${item.importName}${printedParam.length > 0 ? `, ${printedParam}` : ""});\n`;
          }
        }
        for (const item of replacements) {
          const { replacementName, importName, localName } = item;
          if (localName) {
            code = code.replace(new RegExp(replacementName, "g"), () =>
              options.modules.namedExport
                ? isTemplateLiteralSupported
                  ? `\${ ${importName}_NAMED___[${JSON.stringify(getValidLocalName(localName, options.modules.exportLocalsConvention))}] }`
                  : `" + ${importName}_NAMED___[${JSON.stringify(getValidLocalName(localName, options.modules.exportLocalsConvention))}] + "`
                : isTemplateLiteralSupported
                  ? `\${${importName}.locals[${JSON.stringify(localName)}]}`
                  : `" + ${importName}.locals[${JSON.stringify(localName)}] + "`,
            );
          } else {
            const { hash, needQuotes } = item;
            const getUrlOptions = []
              .concat(hash ? [`hash: ${JSON.stringify(hash)}`] : [])
              .concat(needQuotes ? "needQuotes: true" : []);
            const preparedOptions =
              getUrlOptions.length > 0
                ? `, { ${getUrlOptions.join(", ")} }`
                : "";
            beforeCode += `var ${replacementName} = ___CSS_LOADER_GET_URL_IMPORT___(${importName}${preparedOptions});\n`;
            code = code.replace(new RegExp(replacementName, "g"), () =>
              isTemplateLiteralSupported
                ? `\${${replacementName}}`
                : `" + ${replacementName} + "`,
            );
          }
        }
        return `${beforeCode}// Module\n___CSS_LOADER_EXPORT___.push([module.id, ${code}, ""${sourceMapValue}]);\n`;
      }
      const SLASH = "\\".charCodeAt(0);
      const BACKTICK = "`".charCodeAt(0);
      const DOLLAR = "$".charCodeAt(0);
      function convertToTemplateLiteral(str) {
        let escapedString = "";
        for (let i = 0; i < str.length; i++) {
          const code = str.charCodeAt(i);
          escapedString +=
            code === SLASH || code === BACKTICK || code === DOLLAR
              ? `\\${str[i]}`
              : str[i];
        }
        return `\`${escapedString}\``;
      }
      function dashesCamelCase(str) {
        return str.replace(/-+(\w)/g, (match, firstLetter) =>
          firstLetter.toUpperCase(),
        );
      }
      const validIdentifier = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/u;
      const keywords = new Set([
        "abstract",
        "boolean",
        "break",
        "byte",
        "case",
        "catch",
        "char",
        "class",
        "const",
        "continue",
        "debugger",
        "default",
        "delete",
        "do",
        "double",
        "else",
        "enum",
        "export",
        "extends",
        "false",
        "final",
        "finally",
        "float",
        "for",
        "function",
        "goto",
        "if",
        "implements",
        "import",
        "in",
        "instanceof",
        "int",
        "interface",
        "long",
        "native",
        "new",
        "null",
        "package",
        "private",
        "protected",
        "public",
        "return",
        "short",
        "static",
        "super",
        "switch",
        "synchronized",
        "this",
        "throw",
        "throws",
        "transient",
        "true",
        "try",
        "typeof",
        "var",
        "void",
        "volatile",
        "while",
        "with",
      ]);
      function getExportCode(
        exports,
        replacements,
        icssPluginUsed,
        options,
        isTemplateLiteralSupported,
      ) {
        let code = "// Exports\n";
        if (icssPluginUsed) {
          let localsCode = "";
          let identifierId = 0;
          const addExportToLocalsCode = (names, value) => {
            const normalizedNames = Array.isArray(names)
              ? new Set(names)
              : new Set([names]);
            for (let name of normalizedNames) {
              const serializedValue = isTemplateLiteralSupported
                ? convertToTemplateLiteral(value)
                : JSON.stringify(value);
              if (options.modules.namedExport) {
                if (name === "default") {
                  name = `_${name}`;
                }
                if (!validIdentifier.test(name) || keywords.has(name)) {
                  identifierId += 1;
                  const id = `_${identifierId.toString(16)}`;
                  localsCode += `var ${id} = ${serializedValue};\n`;
                  localsCode += `export { ${id} as ${JSON.stringify(name)} };\n`;
                } else {
                  localsCode += `export var ${name} = ${serializedValue};\n`;
                }
              } else {
                if (localsCode) {
                  localsCode += `,\n`;
                }
                localsCode += `\t${JSON.stringify(name)}: ${serializedValue}`;
              }
            }
          };
          for (const { name, value } of exports) {
            addExportToLocalsCode(
              options.modules.exportLocalsConvention(name),
              value,
            );
          }
          for (const item of replacements) {
            const { replacementName, localName } = item;
            if (localName) {
              const { importName } = item;
              localsCode = localsCode.replace(
                new RegExp(replacementName, "g"),
                () => {
                  if (options.modules.namedExport) {
                    return isTemplateLiteralSupported
                      ? `\${${importName}_NAMED___[${JSON.stringify(getValidLocalName(localName, options.modules.exportLocalsConvention))}]}`
                      : `" + ${importName}_NAMED___[${JSON.stringify(getValidLocalName(localName, options.modules.exportLocalsConvention))}] + "`;
                  } else if (options.modules.exportOnlyLocals) {
                    return isTemplateLiteralSupported
                      ? `\${${importName}[${JSON.stringify(localName)}]}`
                      : `" + ${importName}[${JSON.stringify(localName)}] + "`;
                  }
                  return isTemplateLiteralSupported
                    ? `\${${importName}.locals[${JSON.stringify(localName)}]}`
                    : `" + ${importName}.locals[${JSON.stringify(localName)}] + "`;
                },
              );
            } else {
              localsCode = localsCode.replace(
                new RegExp(replacementName, "g"),
                () =>
                  isTemplateLiteralSupported
                    ? `\${${replacementName}}`
                    : `" + ${replacementName} + "`,
              );
            }
          }
          if (options.modules.exportOnlyLocals) {
            code += options.modules.namedExport
              ? localsCode
              : `${options.esModule ? "export default" : "module.exports ="} {\n${localsCode}\n};\n`;
            return code;
          }
          code += options.modules.namedExport
            ? localsCode
            : `___CSS_LOADER_EXPORT___.locals = {${localsCode ? `\n${localsCode}\n` : ""}};\n`;
        }
        const isCSSStyleSheetExport = options.exportType === "css-style-sheet";
        if (isCSSStyleSheetExport) {
          code += "var ___CSS_LOADER_STYLE_SHEET___ = new CSSStyleSheet();\n";
          code +=
            "___CSS_LOADER_STYLE_SHEET___.replaceSync(___CSS_LOADER_EXPORT___.toString());\n";
        }
        let finalExport;
        switch (options.exportType) {
          case "string":
            finalExport = "___CSS_LOADER_EXPORT___.toString()";
            break;
          case "css-style-sheet":
            finalExport = "___CSS_LOADER_STYLE_SHEET___";
            break;
          default:
          case "array":
            finalExport = "___CSS_LOADER_EXPORT___";
            break;
        }
        code += `${options.esModule ? "export default" : "module.exports ="} ${finalExport};\n`;
        return code;
      }
      async function resolveRequests(resolve, context, possibleRequests) {
        return resolve(context, possibleRequests[0])
          .then((result) => result)
          .catch((error) => {
            const [, ...tailPossibleRequests] = possibleRequests;
            if (tailPossibleRequests.length === 0) {
              throw error;
            }
            return resolveRequests(resolve, context, tailPossibleRequests);
          });
      }
      function isURLRequestable(url, options = {}) {
        if (/^\/\//.test(url)) {
          return { requestable: false, needResolve: false };
        }
        if (/^#/.test(url)) {
          return { requestable: false, needResolve: false };
        }
        if (isDataUrl(url) && options.isSupportDataURL) {
          try {
            decodeURIComponent(url);
          } catch (ignoreError) {
            return { requestable: false, needResolve: false };
          }
          return { requestable: true, needResolve: false };
        }
        if (/^file:/i.test(url)) {
          return { requestable: true, needResolve: true };
        }
        if (/^[a-z][a-z0-9+.-]*:/i.test(url) && !NATIVE_WIN32_PATH.test(url)) {
          if (options.isSupportAbsoluteURL && /^https?:/i.test(url)) {
            return { requestable: true, needResolve: false };
          }
          return { requestable: false, needResolve: false };
        }
        return { requestable: true, needResolve: true };
      }
      function sort(a, b) {
        return a.index - b.index;
      }
      function combineRequests(preRequest, url) {
        const idx = url.indexOf("!=!");
        return idx !== -1
          ? url.slice(0, idx + 3) + preRequest + url.slice(idx + 3)
          : preRequest + url;
      }
      function warningFactory(warning) {
        let message = "";
        if (typeof warning.line !== "undefined") {
          message += `(${warning.line}:${warning.column}) `;
        }
        if (typeof warning.plugin !== "undefined") {
          message += `from "${warning.plugin}" plugin: `;
        }
        message += warning.text;
        if (warning.node) {
          message += `\n\nCode:\n  ${warning.node.toString()}\n`;
        }
        const obj = new Error(message, { cause: warning });
        obj.stack = null;
        return obj;
      }
      function syntaxErrorFactory(error) {
        let message = "\nSyntaxError\n\n";
        if (typeof error.line !== "undefined") {
          message += `(${error.line}:${error.column}) `;
        }
        if (typeof error.plugin !== "undefined") {
          message += `from "${error.plugin}" plugin: `;
        }
        message += error.file ? `${error.file} ` : "<css input> ";
        message += `${error.reason}`;
        const code = error.showSourceCode();
        if (code) {
          message += `\n\n${code}\n`;
        }
        const obj = new Error(message, { cause: error });
        obj.stack = null;
        return obj;
      }
      function supportTemplateLiteral(loaderContext) {
        if (
          loaderContext.environment &&
          loaderContext.environment.templateLiteral
        ) {
          return true;
        }
        if (
          loaderContext._compilation &&
          loaderContext._compilation.options &&
          loaderContext._compilation.options.output &&
          loaderContext._compilation.options.output.environment &&
          loaderContext._compilation.options.output.environment.templateLiteral
        ) {
          return true;
        }
        return false;
      }
    },
    1499: (module) => {
      "use strict";
      /*! https://mths.be/cssesc v3.0.0 by @mathias */ var object = {};
      var hasOwnProperty = object.hasOwnProperty;
      var merge = function merge(options, defaults) {
        if (!options) {
          return defaults;
        }
        var result = {};
        for (var key in defaults) {
          result[key] = hasOwnProperty.call(options, key)
            ? options[key]
            : defaults[key];
        }
        return result;
      };
      var regexAnySingleEscape = /[ -,\.\/:-@\[-\^`\{-~]/;
      var regexSingleEscape = /[ -,\.\/:-@\[\]\^`\{-~]/;
      var regexAlwaysEscape = /['"\\]/;
      var regexExcessiveSpaces =
        /(^|\\+)?(\\[A-F0-9]{1,6})\x20(?![a-fA-F0-9\x20])/g;
      var cssesc = function cssesc(string, options) {
        options = merge(options, cssesc.options);
        if (options.quotes != "single" && options.quotes != "double") {
          options.quotes = "single";
        }
        var quote = options.quotes == "double" ? '"' : "'";
        var isIdentifier = options.isIdentifier;
        var firstChar = string.charAt(0);
        var output = "";
        var counter = 0;
        var length = string.length;
        while (counter < length) {
          var character = string.charAt(counter++);
          var codePoint = character.charCodeAt();
          var value = void 0;
          if (codePoint < 32 || codePoint > 126) {
            if (codePoint >= 55296 && codePoint <= 56319 && counter < length) {
              var extra = string.charCodeAt(counter++);
              if ((extra & 64512) == 56320) {
                codePoint = ((codePoint & 1023) << 10) + (extra & 1023) + 65536;
              } else {
                counter--;
              }
            }
            value = "\\" + codePoint.toString(16).toUpperCase() + " ";
          } else {
            if (options.escapeEverything) {
              if (regexAnySingleEscape.test(character)) {
                value = "\\" + character;
              } else {
                value = "\\" + codePoint.toString(16).toUpperCase() + " ";
              }
            } else if (/[\t\n\f\r\x0B]/.test(character)) {
              value = "\\" + codePoint.toString(16).toUpperCase() + " ";
            } else if (
              character == "\\" ||
              (!isIdentifier &&
                ((character == '"' && quote == character) ||
                  (character == "'" && quote == character))) ||
              (isIdentifier && regexSingleEscape.test(character))
            ) {
              value = "\\" + character;
            } else {
              value = character;
            }
          }
          output += value;
        }
        if (isIdentifier) {
          if (/^-[-\d]/.test(output)) {
            output = "\\-" + output.slice(1);
          } else if (/\d/.test(firstChar)) {
            output = "\\3" + firstChar + " " + output.slice(1);
          }
        }
        output = output.replace(regexExcessiveSpaces, function ($0, $1, $2) {
          if ($1 && $1.length % 2) {
            return $0;
          }
          return ($1 || "") + $2;
        });
        if (!isIdentifier && options.wrap) {
          return quote + output + quote;
        }
        return output;
      };
      cssesc.options = {
        escapeEverything: false,
        isIdentifier: false,
        quotes: "single",
        wrap: false,
      };
      cssesc.version = "3.0.0";
      module.exports = cssesc;
    },
    6918: (module) => {
      const createImports = (imports, postcss, mode = "rule") =>
        Object.keys(imports).map((path) => {
          const aliases = imports[path];
          const declarations = Object.keys(aliases).map((key) =>
            postcss.decl({
              prop: key,
              value: aliases[key],
              raws: { before: "\n  " },
            }),
          );
          const hasDeclarations = declarations.length > 0;
          const rule =
            mode === "rule"
              ? postcss.rule({
                  selector: `:import('${path}')`,
                  raws: { after: hasDeclarations ? "\n" : "" },
                })
              : postcss.atRule({
                  name: "icss-import",
                  params: `'${path}'`,
                  raws: { after: hasDeclarations ? "\n" : "" },
                });
          if (hasDeclarations) {
            rule.append(declarations);
          }
          return rule;
        });
      const createExports = (exports, postcss, mode = "rule") => {
        const declarations = Object.keys(exports).map((key) =>
          postcss.decl({
            prop: key,
            value: exports[key],
            raws: { before: "\n  " },
          }),
        );
        if (declarations.length === 0) {
          return [];
        }
        const rule =
          mode === "rule"
            ? postcss.rule({ selector: `:export`, raws: { after: "\n" } })
            : postcss.atRule({ name: "icss-export", raws: { after: "\n" } });
        rule.append(declarations);
        return [rule];
      };
      const createICSSRules = (imports, exports, postcss, mode) => [
        ...createImports(imports, postcss, mode),
        ...createExports(exports, postcss, mode),
      ];
      module.exports = createICSSRules;
    },
    6796: (module) => {
      const importPattern = /^:import\(("[^"]*"|'[^']*'|[^"']+)\)$/;
      const balancedQuotes = /^("[^"]*"|'[^']*'|[^"']+)$/;
      const getDeclsObject = (rule) => {
        const object = {};
        rule.walkDecls((decl) => {
          const before = decl.raws.before ? decl.raws.before.trim() : "";
          object[before + decl.prop] = decl.value;
        });
        return object;
      };
      const extractICSS = (css, removeRules = true, mode = "auto") => {
        const icssImports = {};
        const icssExports = {};
        function addImports(node, path) {
          const unquoted = path.replace(/'|"/g, "");
          icssImports[unquoted] = Object.assign(
            icssImports[unquoted] || {},
            getDeclsObject(node),
          );
          if (removeRules) {
            node.remove();
          }
        }
        function addExports(node) {
          Object.assign(icssExports, getDeclsObject(node));
          if (removeRules) {
            node.remove();
          }
        }
        css.each((node) => {
          if (node.type === "rule" && mode !== "at-rule") {
            if (node.selector.slice(0, 7) === ":import") {
              const matches = importPattern.exec(node.selector);
              if (matches) {
                addImports(node, matches[1]);
              }
            }
            if (node.selector === ":export") {
              addExports(node);
            }
          }
          if (node.type === "atrule" && mode !== "rule") {
            if (node.name === "icss-import") {
              const matches = balancedQuotes.exec(node.params);
              if (matches) {
                addImports(node, matches[1]);
              }
            }
            if (node.name === "icss-export") {
              addExports(node);
            }
          }
        });
        return { icssImports, icssExports };
      };
      module.exports = extractICSS;
    },
    4531: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const replaceValueSymbols = __nccwpck_require__(8613);
      const replaceSymbols = __nccwpck_require__(1678);
      const extractICSS = __nccwpck_require__(6796);
      const createICSSRules = __nccwpck_require__(6918);
      module.exports = {
        replaceValueSymbols,
        replaceSymbols,
        extractICSS,
        createICSSRules,
      };
    },
    1678: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const replaceValueSymbols = __nccwpck_require__(8613);
      const replaceSymbols = (css, replacements) => {
        css.walk((node) => {
          if (node.type === "decl" && node.value) {
            node.value = replaceValueSymbols(
              node.value.toString(),
              replacements,
            );
          } else if (node.type === "rule" && node.selector) {
            node.selector = replaceValueSymbols(
              node.selector.toString(),
              replacements,
            );
          } else if (node.type === "atrule" && node.params) {
            node.params = replaceValueSymbols(
              node.params.toString(),
              replacements,
            );
          }
        });
      };
      module.exports = replaceSymbols;
    },
    8613: (module) => {
      const matchValueName = /[$]?[\w-]+/g;
      const replaceValueSymbols = (value, replacements) => {
        let matches;
        while ((matches = matchValueName.exec(value))) {
          const replacement = replacements[matches[0]];
          if (replacement) {
            value =
              value.slice(0, matches.index) +
              replacement +
              value.slice(matchValueName.lastIndex);
            matchValueName.lastIndex -= matches[0].length - replacement.length;
          }
        }
        return value;
      };
      module.exports = replaceValueSymbols;
    },
    8137: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const topologicalSort = __nccwpck_require__(8886);
      const matchImports = /^(.+?)\s+from\s+(?:"([^"]+)"|'([^']+)'|(global))$/;
      const icssImport = /^:import\((?:"([^"]+)"|'([^']+)')\)/;
      const VISITED_MARKER = 1;
      function addImportToGraph(importId, parentId, graph, visited) {
        const siblingsId = parentId + "_" + "siblings";
        const visitedId = parentId + "_" + importId;
        if (visited[visitedId] !== VISITED_MARKER) {
          if (!Array.isArray(visited[siblingsId])) {
            visited[siblingsId] = [];
          }
          const siblings = visited[siblingsId];
          if (Array.isArray(graph[importId])) {
            graph[importId] = graph[importId].concat(siblings);
          } else {
            graph[importId] = siblings.slice();
          }
          visited[visitedId] = VISITED_MARKER;
          siblings.push(importId);
        }
      }
      module.exports = (options = {}) => {
        let importIndex = 0;
        const createImportedName =
          typeof options.createImportedName !== "function"
            ? (importName) =>
                `i__imported_${importName.replace(/\W/g, "_")}_${importIndex++}`
            : options.createImportedName;
        const failOnWrongOrder = options.failOnWrongOrder;
        return {
          postcssPlugin: "postcss-modules-extract-imports",
          prepare() {
            const graph = {};
            const visited = {};
            const existingImports = {};
            const importDecls = {};
            const imports = {};
            return {
              Once(root, postcss) {
                root.walkRules((rule) => {
                  const matches = icssImport.exec(rule.selector);
                  if (matches) {
                    const [, doubleQuotePath, singleQuotePath] = matches;
                    const importPath = doubleQuotePath || singleQuotePath;
                    addImportToGraph(importPath, "root", graph, visited);
                    existingImports[importPath] = rule;
                  }
                });
                root.walkDecls(/^composes$/, (declaration) => {
                  const multiple = declaration.value.split(",");
                  const values = [];
                  multiple.forEach((value) => {
                    const matches = value.trim().match(matchImports);
                    if (!matches) {
                      values.push(value);
                      return;
                    }
                    let tmpSymbols;
                    let [, symbols, doubleQuotePath, singleQuotePath, global] =
                      matches;
                    if (global) {
                      tmpSymbols = symbols
                        .split(/\s+/)
                        .map((s) => `global(${s})`);
                    } else {
                      const importPath = doubleQuotePath || singleQuotePath;
                      let parent = declaration.parent;
                      let parentIndexes = "";
                      while (parent.type !== "root") {
                        parentIndexes =
                          parent.parent.index(parent) + "_" + parentIndexes;
                        parent = parent.parent;
                      }
                      const { selector } = declaration.parent;
                      const parentRule = `_${parentIndexes}${selector}`;
                      addImportToGraph(importPath, parentRule, graph, visited);
                      importDecls[importPath] = declaration;
                      imports[importPath] = imports[importPath] || {};
                      tmpSymbols = symbols.split(/\s+/).map((s) => {
                        if (!imports[importPath][s]) {
                          imports[importPath][s] = createImportedName(
                            s,
                            importPath,
                          );
                        }
                        return imports[importPath][s];
                      });
                    }
                    values.push(tmpSymbols.join(" "));
                  });
                  declaration.value = values.join(", ");
                });
                const importsOrder = topologicalSort(graph, failOnWrongOrder);
                if (importsOrder instanceof Error) {
                  const importPath = importsOrder.nodes.find((importPath) =>
                    importDecls.hasOwnProperty(importPath),
                  );
                  const decl = importDecls[importPath];
                  throw decl.error(
                    "Failed to resolve order of composed modules " +
                      importsOrder.nodes
                        .map((importPath) => "`" + importPath + "`")
                        .join(", ") +
                      ".",
                    {
                      plugin: "postcss-modules-extract-imports",
                      word: "composes",
                    },
                  );
                }
                let lastImportRule;
                importsOrder.forEach((path) => {
                  const importedSymbols = imports[path];
                  let rule = existingImports[path];
                  if (!rule && importedSymbols) {
                    rule = postcss.rule({
                      selector: `:import("${path}")`,
                      raws: { after: "\n" },
                    });
                    if (lastImportRule) {
                      root.insertAfter(lastImportRule, rule);
                    } else {
                      root.prepend(rule);
                    }
                  }
                  lastImportRule = rule;
                  if (!importedSymbols) {
                    return;
                  }
                  Object.keys(importedSymbols).forEach((importedSymbol) => {
                    rule.append(
                      postcss.decl({
                        value: importedSymbol,
                        prop: importedSymbols[importedSymbol],
                        raws: { before: "\n  " },
                      }),
                    );
                  });
                });
              },
            };
          },
        };
      };
      module.exports.postcss = true;
    },
    8886: (module) => {
      const PERMANENT_MARKER = 2;
      const TEMPORARY_MARKER = 1;
      function createError(node, graph) {
        const er = new Error("Nondeterministic import's order");
        const related = graph[node];
        const relatedNode = related.find(
          (relatedNode) => graph[relatedNode].indexOf(node) > -1,
        );
        er.nodes = [node, relatedNode];
        return er;
      }
      function walkGraph(node, graph, state, result, strict) {
        if (state[node] === PERMANENT_MARKER) {
          return;
        }
        if (state[node] === TEMPORARY_MARKER) {
          if (strict) {
            return createError(node, graph);
          }
          return;
        }
        state[node] = TEMPORARY_MARKER;
        const children = graph[node];
        const length = children.length;
        for (let i = 0; i < length; ++i) {
          const error = walkGraph(children[i], graph, state, result, strict);
          if (error instanceof Error) {
            return error;
          }
        }
        state[node] = PERMANENT_MARKER;
        result.push(node);
      }
      function topologicalSort(graph, strict) {
        const result = [];
        const state = {};
        const nodes = Object.keys(graph);
        const length = nodes.length;
        for (let i = 0; i < length; ++i) {
          const er = walkGraph(nodes[i], graph, state, result, strict);
          if (er instanceof Error) {
            return er;
          }
        }
        return result;
      }
      module.exports = topologicalSort;
    },
    9433: (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      const selectorParser = __nccwpck_require__(9827);
      const valueParser = __nccwpck_require__(2948);
      const { extractICSS } = __nccwpck_require__(4531);
      const IGNORE_FILE_MARKER = "cssmodules-pure-no-check";
      const IGNORE_NEXT_LINE_MARKER = "cssmodules-pure-ignore";
      const isSpacing = (node) =>
        node.type === "combinator" && node.value === " ";
      const isPureCheckDisabled = (root) => {
        for (const node of root.nodes) {
          if (node.type !== "comment") {
            return false;
          }
          if (node.text.trim().startsWith(IGNORE_FILE_MARKER)) {
            return true;
          }
        }
        return false;
      };
      function getIgnoreComment(node) {
        if (!node.parent) {
          return;
        }
        const indexInParent = node.parent.index(node);
        for (let i = indexInParent - 1; i >= 0; i--) {
          const prevNode = node.parent.nodes[i];
          if (prevNode.type === "comment") {
            if (prevNode.text.trimStart().startsWith(IGNORE_NEXT_LINE_MARKER)) {
              return prevNode;
            }
          } else {
            break;
          }
        }
      }
      function normalizeNodeArray(nodes) {
        const array = [];
        nodes.forEach((x) => {
          if (Array.isArray(x)) {
            normalizeNodeArray(x).forEach((item) => {
              array.push(item);
            });
          } else if (x) {
            array.push(x);
          }
        });
        if (array.length > 0 && isSpacing(array[array.length - 1])) {
          array.pop();
        }
        return array;
      }
      const isPureSelectorSymbol = Symbol("is-pure-selector");
      function localizeNode(rule, mode, localAliasMap) {
        const transform = (node, context) => {
          if (context.ignoreNextSpacing && !isSpacing(node)) {
            throw new Error(
              "Missing whitespace after " + context.ignoreNextSpacing,
            );
          }
          if (context.enforceNoSpacing && isSpacing(node)) {
            throw new Error(
              "Missing whitespace before " + context.enforceNoSpacing,
            );
          }
          let newNodes;
          switch (node.type) {
            case "root": {
              let resultingGlobal;
              context.hasPureGlobals = false;
              newNodes = node.nodes.map((n) => {
                const nContext = {
                  global: context.global,
                  lastWasSpacing: true,
                  hasLocals: false,
                  explicit: false,
                };
                n = transform(n, nContext);
                if (typeof resultingGlobal === "undefined") {
                  resultingGlobal = nContext.global;
                } else if (resultingGlobal !== nContext.global) {
                  throw new Error(
                    'Inconsistent rule global/local result in rule "' +
                      node +
                      '" (multiple selectors must result in the same mode for the rule)',
                  );
                }
                if (!nContext.hasLocals) {
                  context.hasPureGlobals = true;
                }
                return n;
              });
              context.global = resultingGlobal;
              node.nodes = normalizeNodeArray(newNodes);
              break;
            }
            case "selector": {
              newNodes = node.map((childNode) => transform(childNode, context));
              node = node.clone();
              node.nodes = normalizeNodeArray(newNodes);
              break;
            }
            case "combinator": {
              if (isSpacing(node)) {
                if (context.ignoreNextSpacing) {
                  context.ignoreNextSpacing = false;
                  context.lastWasSpacing = false;
                  context.enforceNoSpacing = false;
                  return null;
                }
                context.lastWasSpacing = true;
                return node;
              }
              break;
            }
            case "pseudo": {
              let childContext;
              const isNested = !!node.length;
              const isScoped =
                node.value === ":local" || node.value === ":global";
              const isImportExport =
                node.value === ":import" || node.value === ":export";
              if (isImportExport) {
                context.hasLocals = true;
              } else if (isNested) {
                if (isScoped) {
                  if (node.nodes.length === 0) {
                    throw new Error(`${node.value}() can't be empty`);
                  }
                  if (context.inside) {
                    throw new Error(
                      `A ${node.value} is not allowed inside of a ${context.inside}(...)`,
                    );
                  }
                  childContext = {
                    global: node.value === ":global",
                    inside: node.value,
                    hasLocals: false,
                    explicit: true,
                  };
                  newNodes = node
                    .map((childNode) => transform(childNode, childContext))
                    .reduce((acc, next) => acc.concat(next.nodes), []);
                  if (newNodes.length) {
                    const { before, after } = node.spaces;
                    const first = newNodes[0];
                    const last = newNodes[newNodes.length - 1];
                    first.spaces = { before, after: first.spaces.after };
                    last.spaces = { before: last.spaces.before, after };
                  }
                  node = newNodes;
                  break;
                } else {
                  childContext = {
                    global: context.global,
                    inside: context.inside,
                    lastWasSpacing: true,
                    hasLocals: false,
                    explicit: context.explicit,
                  };
                  newNodes = node.map((childNode) => {
                    const newContext = {
                      ...childContext,
                      enforceNoSpacing: false,
                    };
                    const result = transform(childNode, newContext);
                    childContext.global = newContext.global;
                    childContext.hasLocals = newContext.hasLocals;
                    return result;
                  });
                  node = node.clone();
                  node.nodes = normalizeNodeArray(newNodes);
                  if (childContext.hasLocals) {
                    context.hasLocals = true;
                  }
                }
                break;
              } else if (isScoped) {
                if (context.inside) {
                  throw new Error(
                    `A ${node.value} is not allowed inside of a ${context.inside}(...)`,
                  );
                }
                const addBackSpacing = !!node.spaces.before;
                context.ignoreNextSpacing = context.lastWasSpacing
                  ? node.value
                  : false;
                context.enforceNoSpacing = context.lastWasSpacing
                  ? false
                  : node.value;
                context.global = node.value === ":global";
                context.explicit = true;
                return addBackSpacing
                  ? selectorParser.combinator({ value: " " })
                  : null;
              }
              break;
            }
            case "id":
            case "class": {
              if (!node.value) {
                throw new Error("Invalid class or id selector syntax");
              }
              if (context.global) {
                break;
              }
              const isImportedValue = localAliasMap.has(node.value);
              const isImportedWithExplicitScope =
                isImportedValue && context.explicit;
              if (!isImportedValue || isImportedWithExplicitScope) {
                const innerNode = node.clone();
                innerNode.spaces = { before: "", after: "" };
                node = selectorParser.pseudo({
                  value: ":local",
                  nodes: [innerNode],
                  spaces: node.spaces,
                });
                context.hasLocals = true;
              }
              break;
            }
            case "nesting": {
              if (node.value === "&") {
                context.hasLocals = rule.parent[isPureSelectorSymbol];
              }
            }
          }
          context.lastWasSpacing = false;
          context.ignoreNextSpacing = false;
          context.enforceNoSpacing = false;
          return node;
        };
        const rootContext = {
          global: mode === "global",
          hasPureGlobals: false,
        };
        rootContext.selector = selectorParser((root) => {
          transform(root, rootContext);
        }).processSync(rule, { updateSelector: false, lossless: true });
        return rootContext;
      }
      function localizeDeclNode(node, context) {
        switch (node.type) {
          case "word":
            if (context.localizeNextItem) {
              if (!context.localAliasMap.has(node.value)) {
                node.value = ":local(" + node.value + ")";
                context.localizeNextItem = false;
              }
            }
            break;
          case "function":
            if (
              context.options &&
              context.options.rewriteUrl &&
              node.value.toLowerCase() === "url"
            ) {
              node.nodes.map((nestedNode) => {
                if (
                  nestedNode.type !== "string" &&
                  nestedNode.type !== "word"
                ) {
                  return;
                }
                let newUrl = context.options.rewriteUrl(
                  context.global,
                  nestedNode.value,
                );
                switch (nestedNode.type) {
                  case "string":
                    if (nestedNode.quote === "'") {
                      newUrl = newUrl
                        .replace(/(\\)/g, "\\$1")
                        .replace(/'/g, "\\'");
                    }
                    if (nestedNode.quote === '"') {
                      newUrl = newUrl
                        .replace(/(\\)/g, "\\$1")
                        .replace(/"/g, '\\"');
                    }
                    break;
                  case "word":
                    newUrl = newUrl.replace(/("|'|\)|\\)/g, "\\$1");
                    break;
                }
                nestedNode.value = newUrl;
              });
            }
            break;
        }
        return node;
      }
      const specialKeywords = [
        "none",
        "inherit",
        "initial",
        "revert",
        "revert-layer",
        "unset",
      ];
      function localizeDeclarationValues(localize, declaration, context) {
        const valueNodes = valueParser(declaration.value);
        valueNodes.walk((node, index, nodes) => {
          if (
            node.type === "function" &&
            (node.value.toLowerCase() === "var" ||
              node.value.toLowerCase() === "env")
          ) {
            return false;
          }
          if (
            node.type === "word" &&
            specialKeywords.includes(node.value.toLowerCase())
          ) {
            return;
          }
          const subContext = {
            options: context.options,
            global: context.global,
            localizeNextItem: localize && !context.global,
            localAliasMap: context.localAliasMap,
          };
          nodes[index] = localizeDeclNode(node, subContext);
        });
        declaration.value = valueNodes.toString();
      }
      const validIdent =
        /^-?([a-z\u0080-\uFFFF_]|(\\[^\r\n\f])|-(?![0-9]))((\\[^\r\n\f])|[a-z\u0080-\uFFFF_0-9-])*$/i;
      const animationKeywords = {
        $normal: 1,
        $reverse: 1,
        $alternate: 1,
        "$alternate-reverse": 1,
        $forwards: 1,
        $backwards: 1,
        $both: 1,
        $infinite: 1,
        $paused: 1,
        $running: 1,
        $ease: 1,
        "$ease-in": 1,
        "$ease-out": 1,
        "$ease-in-out": 1,
        $linear: 1,
        "$step-end": 1,
        "$step-start": 1,
        $none: Infinity,
        $initial: Infinity,
        $inherit: Infinity,
        $unset: Infinity,
        $revert: Infinity,
        "$revert-layer": Infinity,
      };
      function localizeDeclaration(declaration, context) {
        const isAnimation = /animation(-name)?$/i.test(declaration.prop);
        if (isAnimation) {
          let parsedAnimationKeywords = {};
          const valueNodes = valueParser(declaration.value).walk((node) => {
            if (node.type === "div") {
              parsedAnimationKeywords = {};
              return;
            } else if (
              node.type === "function" &&
              node.value.toLowerCase() === "local" &&
              node.nodes.length === 1
            ) {
              node.type = "word";
              node.value = node.nodes[0].value;
              return localizeDeclNode(node, {
                options: context.options,
                global: context.global,
                localizeNextItem: true,
                localAliasMap: context.localAliasMap,
              });
            } else if (node.type === "function") {
              if (
                node.value.toLowerCase() === "global" &&
                node.nodes.length === 1
              ) {
                node.type = "word";
                node.value = node.nodes[0].value;
              }
              return false;
            } else if (node.type !== "word") {
              return;
            }
            const value =
              node.type === "word" ? node.value.toLowerCase() : null;
            let shouldParseAnimationName = false;
            if (value && validIdent.test(value)) {
              if ("$" + value in animationKeywords) {
                parsedAnimationKeywords["$" + value] =
                  "$" + value in parsedAnimationKeywords
                    ? parsedAnimationKeywords["$" + value] + 1
                    : 0;
                shouldParseAnimationName =
                  parsedAnimationKeywords["$" + value] >=
                  animationKeywords["$" + value];
              } else {
                shouldParseAnimationName = true;
              }
            }
            return localizeDeclNode(node, {
              options: context.options,
              global: context.global,
              localizeNextItem: shouldParseAnimationName && !context.global,
              localAliasMap: context.localAliasMap,
            });
          });
          declaration.value = valueNodes.toString();
          return;
        }
        if (/url\(/i.test(declaration.value)) {
          return localizeDeclarationValues(false, declaration, context);
        }
      }
      const isPureSelector = (context, rule) => {
        if (!rule.parent || rule.type === "root") {
          return !context.hasPureGlobals;
        }
        if (rule.type === "rule" && rule[isPureSelectorSymbol]) {
          return (
            rule[isPureSelectorSymbol] || isPureSelector(context, rule.parent)
          );
        }
        return !context.hasPureGlobals || isPureSelector(context, rule.parent);
      };
      const isNodeWithoutDeclarations = (rule) => {
        if (rule.nodes.length > 0) {
          return !rule.nodes.every(
            (item) =>
              item.type === "rule" ||
              (item.type === "atrule" && !isNodeWithoutDeclarations(item)),
          );
        }
        return true;
      };
      module.exports = (options = {}) => {
        if (
          options &&
          options.mode &&
          options.mode !== "global" &&
          options.mode !== "local" &&
          options.mode !== "pure"
        ) {
          throw new Error(
            'options.mode must be either "global", "local" or "pure" (default "local")',
          );
        }
        const pureMode = options && options.mode === "pure";
        const globalMode = options && options.mode === "global";
        return {
          postcssPlugin: "postcss-modules-local-by-default",
          prepare() {
            const localAliasMap = new Map();
            return {
              Once(root) {
                const { icssImports } = extractICSS(root, false);
                const enforcePureMode = pureMode && !isPureCheckDisabled(root);
                Object.keys(icssImports).forEach((key) => {
                  Object.keys(icssImports[key]).forEach((prop) => {
                    localAliasMap.set(prop, icssImports[key][prop]);
                  });
                });
                root.walkAtRules((atRule) => {
                  if (/keyframes$/i.test(atRule.name)) {
                    const globalMatch = /^\s*:global\s*\((.+)\)\s*$/.exec(
                      atRule.params,
                    );
                    const localMatch = /^\s*:local\s*\((.+)\)\s*$/.exec(
                      atRule.params,
                    );
                    let globalKeyframes = globalMode;
                    if (globalMatch) {
                      if (enforcePureMode) {
                        const ignoreComment = getIgnoreComment(atRule);
                        if (!ignoreComment) {
                          throw atRule.error(
                            "@keyframes :global(...) is not allowed in pure mode",
                          );
                        } else {
                          ignoreComment.remove();
                        }
                      }
                      atRule.params = globalMatch[1];
                      globalKeyframes = true;
                    } else if (localMatch) {
                      atRule.params = localMatch[0];
                      globalKeyframes = false;
                    } else if (
                      atRule.params &&
                      !globalMode &&
                      !localAliasMap.has(atRule.params)
                    ) {
                      atRule.params = ":local(" + atRule.params + ")";
                    }
                    atRule.walkDecls((declaration) => {
                      localizeDeclaration(declaration, {
                        localAliasMap,
                        options,
                        global: globalKeyframes,
                      });
                    });
                  } else if (/scope$/i.test(atRule.name)) {
                    if (atRule.params) {
                      const ignoreComment = pureMode
                        ? getIgnoreComment(atRule)
                        : undefined;
                      if (ignoreComment) {
                        ignoreComment.remove();
                      }
                      atRule.params = atRule.params
                        .split("to")
                        .map((item) => {
                          const selector = item.trim().slice(1, -1).trim();
                          const context = localizeNode(
                            selector,
                            options.mode,
                            localAliasMap,
                          );
                          context.options = options;
                          context.localAliasMap = localAliasMap;
                          if (
                            enforcePureMode &&
                            context.hasPureGlobals &&
                            !ignoreComment
                          ) {
                            throw atRule.error(
                              'Selector in at-rule"' +
                                selector +
                                '" is not pure ' +
                                "(pure selectors must contain at least one local class or id)",
                            );
                          }
                          return `(${context.selector})`;
                        })
                        .join(" to ");
                    }
                    atRule.nodes.forEach((declaration) => {
                      if (declaration.type === "decl") {
                        localizeDeclaration(declaration, {
                          localAliasMap,
                          options,
                          global: globalMode,
                        });
                      }
                    });
                  } else if (atRule.nodes) {
                    atRule.nodes.forEach((declaration) => {
                      if (declaration.type === "decl") {
                        localizeDeclaration(declaration, {
                          localAliasMap,
                          options,
                          global: globalMode,
                        });
                      }
                    });
                  }
                });
                root.walkRules((rule) => {
                  if (
                    rule.parent &&
                    rule.parent.type === "atrule" &&
                    /keyframes$/i.test(rule.parent.name)
                  ) {
                    return;
                  }
                  const context = localizeNode(
                    rule,
                    options.mode,
                    localAliasMap,
                  );
                  context.options = options;
                  context.localAliasMap = localAliasMap;
                  const ignoreComment = enforcePureMode
                    ? getIgnoreComment(rule)
                    : undefined;
                  const isNotPure =
                    enforcePureMode && !isPureSelector(context, rule);
                  if (
                    isNotPure &&
                    isNodeWithoutDeclarations(rule) &&
                    !ignoreComment
                  ) {
                    throw rule.error(
                      'Selector "' +
                        rule.selector +
                        '" is not pure ' +
                        "(pure selectors must contain at least one local class or id)",
                    );
                  } else if (ignoreComment) {
                    ignoreComment.remove();
                  }
                  if (pureMode) {
                    rule[isPureSelectorSymbol] = !isNotPure;
                  }
                  rule.selector = context.selector;
                  if (rule.nodes) {
                    rule.nodes.forEach((declaration) =>
                      localizeDeclaration(declaration, context),
                    );
                  }
                });
              },
            };
          },
        };
      };
      module.exports.postcss = true;
    },
    6167: (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      const selectorParser = __nccwpck_require__(9827);
      const hasOwnProperty = Object.prototype.hasOwnProperty;
      function isNestedRule(rule) {
        if (!rule.parent || rule.parent.type === "root") {
          return false;
        }
        if (rule.parent.type === "rule") {
          return true;
        }
        return isNestedRule(rule.parent);
      }
      function getSingleLocalNamesForComposes(root, rule) {
        if (isNestedRule(rule)) {
          throw new Error(
            `composition is not allowed in nested rule \n\n${rule}`,
          );
        }
        return root.nodes.map((node) => {
          if (node.type !== "selector" || node.nodes.length !== 1) {
            throw new Error(
              `composition is only allowed when selector is single :local class name not in "${root}"`,
            );
          }
          node = node.nodes[0];
          if (
            node.type !== "pseudo" ||
            node.value !== ":local" ||
            node.nodes.length !== 1
          ) {
            throw new Error(
              'composition is only allowed when selector is single :local class name not in "' +
                root +
                '", "' +
                node +
                '" is weird',
            );
          }
          node = node.first;
          if (node.type !== "selector" || node.length !== 1) {
            throw new Error(
              'composition is only allowed when selector is single :local class name not in "' +
                root +
                '", "' +
                node +
                '" is weird',
            );
          }
          node = node.first;
          if (node.type !== "class") {
            throw new Error(
              'composition is only allowed when selector is single :local class name not in "' +
                root +
                '", "' +
                node +
                '" is weird',
            );
          }
          return node.value;
        });
      }
      const whitespace = "[\\x20\\t\\r\\n\\f]";
      const unescapeRegExp = new RegExp(
        "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)",
        "ig",
      );
      function unescape(str) {
        return str.replace(unescapeRegExp, (_, escaped, escapedWhitespace) => {
          const high = "0x" + escaped - 65536;
          return high !== high || escapedWhitespace
            ? escaped
            : high < 0
              ? String.fromCharCode(high + 65536)
              : String.fromCharCode(
                  (high >> 10) | 55296,
                  (high & 1023) | 56320,
                );
        });
      }
      const plugin = (options = {}) => {
        const generateScopedName =
          (options && options.generateScopedName) || plugin.generateScopedName;
        const generateExportEntry =
          (options && options.generateExportEntry) ||
          plugin.generateExportEntry;
        const exportGlobals = options && options.exportGlobals;
        return {
          postcssPlugin: "postcss-modules-scope",
          Once(root, { rule }) {
            const exports = Object.create(null);
            function exportScopedName(name, rawName, node) {
              const scopedName = generateScopedName(
                rawName ? rawName : name,
                root.source.input.from,
                root.source.input.css,
                node,
              );
              const exportEntry = generateExportEntry(
                rawName ? rawName : name,
                scopedName,
                root.source.input.from,
                root.source.input.css,
                node,
              );
              const { key, value } = exportEntry;
              exports[key] = exports[key] || [];
              if (exports[key].indexOf(value) < 0) {
                exports[key].push(value);
              }
              return scopedName;
            }
            function localizeNode(node) {
              switch (node.type) {
                case "selector":
                  node.nodes = node.map((item) => localizeNode(item));
                  return node;
                case "class":
                  return selectorParser.className({
                    value: exportScopedName(
                      node.value,
                      node.raws && node.raws.value ? node.raws.value : null,
                      node,
                    ),
                  });
                case "id": {
                  return selectorParser.id({
                    value: exportScopedName(
                      node.value,
                      node.raws && node.raws.value ? node.raws.value : null,
                      node,
                    ),
                  });
                }
                case "attribute": {
                  if (node.attribute === "class" && node.operator === "=") {
                    return selectorParser.attribute({
                      attribute: node.attribute,
                      operator: node.operator,
                      quoteMark: "'",
                      value: exportScopedName(node.value, null, null),
                    });
                  }
                }
              }
              throw new Error(
                `${node.type} ("${node}") is not allowed in a :local block`,
              );
            }
            function traverseNode(node) {
              switch (node.type) {
                case "pseudo":
                  if (node.value === ":local") {
                    if (node.nodes.length !== 1) {
                      throw new Error('Unexpected comma (",") in :local block');
                    }
                    const selector = localizeNode(node.first);
                    selector.first.spaces = node.spaces;
                    const nextNode = node.next();
                    if (
                      nextNode &&
                      nextNode.type === "combinator" &&
                      nextNode.value === " " &&
                      /\\[A-F0-9]{1,6}$/.test(selector.last.value)
                    ) {
                      selector.last.spaces.after = " ";
                    }
                    node.replaceWith(selector);
                    return;
                  }
                case "root":
                case "selector": {
                  node.each((item) => traverseNode(item));
                  break;
                }
                case "id":
                case "class":
                  if (exportGlobals) {
                    exports[node.value] = [node.value];
                  }
                  break;
              }
              return node;
            }
            const importedNames = {};
            root.walkRules(/^:import\(.+\)$/, (rule) => {
              rule.walkDecls((decl) => {
                importedNames[decl.prop] = true;
              });
            });
            root.walkRules((rule) => {
              let parsedSelector = selectorParser().astSync(rule);
              rule.selector = traverseNode(parsedSelector.clone()).toString();
              rule.walkDecls(/^(composes|compose-with)$/i, (decl) => {
                const localNames = getSingleLocalNamesForComposes(
                  parsedSelector,
                  decl.parent,
                );
                const multiple = decl.value.split(",");
                multiple.forEach((value) => {
                  const classes = value.trim().split(/\s+/);
                  classes.forEach((className) => {
                    const global = /^global\(([^)]+)\)$/.exec(className);
                    if (global) {
                      localNames.forEach((exportedName) => {
                        exports[exportedName].push(global[1]);
                      });
                    } else if (hasOwnProperty.call(importedNames, className)) {
                      localNames.forEach((exportedName) => {
                        exports[exportedName].push(className);
                      });
                    } else if (hasOwnProperty.call(exports, className)) {
                      localNames.forEach((exportedName) => {
                        exports[className].forEach((item) => {
                          exports[exportedName].push(item);
                        });
                      });
                    } else {
                      throw decl.error(
                        `referenced class name "${className}" in ${decl.prop} not found`,
                      );
                    }
                  });
                });
                decl.remove();
              });
              rule.walkDecls((decl) => {
                if (!/:local\s*\((.+?)\)/.test(decl.value)) {
                  return;
                }
                let tokens = decl.value.split(/(,|'[^']*'|"[^"]*")/);
                tokens = tokens.map((token, idx) => {
                  if (idx === 0 || tokens[idx - 1] === ",") {
                    let result = token;
                    const localMatch = /:local\s*\((.+?)\)/.exec(token);
                    if (localMatch) {
                      const input = localMatch.input;
                      const matchPattern = localMatch[0];
                      const matchVal = localMatch[1];
                      const newVal = exportScopedName(matchVal);
                      result = input.replace(matchPattern, newVal);
                    } else {
                      return token;
                    }
                    return result;
                  } else {
                    return token;
                  }
                });
                decl.value = tokens.join("");
              });
            });
            root.walkAtRules(/keyframes$/i, (atRule) => {
              const localMatch = /^\s*:local\s*\((.+?)\)\s*$/.exec(
                atRule.params,
              );
              if (!localMatch) {
                return;
              }
              atRule.params = exportScopedName(localMatch[1]);
            });
            root.walkAtRules(/scope$/i, (atRule) => {
              if (atRule.params) {
                atRule.params = atRule.params
                  .split("to")
                  .map((item) => {
                    const selector = item.trim().slice(1, -1).trim();
                    const localMatch = /^\s*:local\s*\((.+?)\)\s*$/.exec(
                      selector,
                    );
                    if (!localMatch) {
                      return `(${selector})`;
                    }
                    let parsedSelector = selectorParser().astSync(selector);
                    return `(${traverseNode(parsedSelector).toString()})`;
                  })
                  .join(" to ");
              }
            });
            const exportedNames = Object.keys(exports);
            if (exportedNames.length > 0) {
              const exportRule = rule({ selector: ":export" });
              exportedNames.forEach((exportedName) =>
                exportRule.append({
                  prop: exportedName,
                  value: exports[exportedName].join(" "),
                  raws: { before: "\n  " },
                }),
              );
              root.append(exportRule);
            }
          },
        };
      };
      plugin.postcss = true;
      plugin.generateScopedName = function (name, path) {
        const sanitisedPath = path
          .replace(/\.[^./\\]+$/, "")
          .replace(/[\W_]+/g, "_")
          .replace(/^_|_$/g, "");
        return `_${sanitisedPath}__${name}`.trim();
      };
      plugin.generateExportEntry = function (name, scopedName) {
        return { key: unescape(name), value: unescape(scopedName) };
      };
      module.exports = plugin;
    },
    5267: (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      const ICSSUtils = __nccwpck_require__(4531);
      const matchImports =
        /^(.+?|\([\s\S]+?\))\s+from\s+("[^"]*"|'[^']*'|[\w-]+)$/;
      const matchValueDefinition = /(?:\s+|^)([\w-]+):?(.*?)$/;
      const matchImport = /^([\w-]+)(?:\s+as\s+([\w-]+))?/;
      module.exports = (options) => {
        let importIndex = 0;
        const createImportedName =
          (options && options.createImportedName) ||
          ((importName) =>
            `i__const_${importName.replace(/\W/g, "_")}_${importIndex++}`);
        return {
          postcssPlugin: "postcss-modules-values",
          prepare(result) {
            const importAliases = [];
            const definitions = {};
            return {
              Once(root, postcss) {
                root.walkAtRules(/value/i, (atRule) => {
                  const matches = atRule.params.match(matchImports);
                  if (matches) {
                    let [, aliases, path] = matches;
                    if (definitions[path]) {
                      path = definitions[path];
                    }
                    const imports = aliases
                      .replace(/^\(\s*([\s\S]+)\s*\)$/, "$1")
                      .split(/\s*,\s*/)
                      .map((alias) => {
                        const tokens = matchImport.exec(alias);
                        if (tokens) {
                          const [, theirName, myName = theirName] = tokens;
                          const importedName = createImportedName(myName);
                          definitions[myName] = importedName;
                          return { theirName, importedName };
                        } else {
                          throw new Error(
                            `@import statement "${alias}" is invalid!`,
                          );
                        }
                      });
                    importAliases.push({ path, imports });
                    atRule.remove();
                    return;
                  }
                  if (atRule.params.indexOf("@value") !== -1) {
                    result.warn("Invalid value definition: " + atRule.params);
                  }
                  let [, key, value] =
                    `${atRule.params}${atRule.raws.between}`.match(
                      matchValueDefinition,
                    );
                  const normalizedValue = value.replace(
                    /\/\*((?!\*\/).*?)\*\//g,
                    "",
                  );
                  if (normalizedValue.length === 0) {
                    result.warn("Invalid value definition: " + atRule.params);
                    atRule.remove();
                    return;
                  }
                  let isOnlySpace = /^\s+$/.test(normalizedValue);
                  if (!isOnlySpace) {
                    value = value.trim();
                  }
                  definitions[key] = ICSSUtils.replaceValueSymbols(
                    value,
                    definitions,
                  );
                  atRule.remove();
                });
                if (!Object.keys(definitions).length) {
                  return;
                }
                ICSSUtils.replaceSymbols(root, definitions);
                const exportDeclarations = Object.keys(definitions).map((key) =>
                  postcss.decl({
                    value: definitions[key],
                    prop: key,
                    raws: { before: "\n  " },
                  }),
                );
                if (exportDeclarations.length > 0) {
                  const exportRule = postcss.rule({
                    selector: ":export",
                    raws: { after: "\n" },
                  });
                  exportRule.append(exportDeclarations);
                  root.prepend(exportRule);
                }
                importAliases.reverse().forEach(({ path, imports }) => {
                  const importRule = postcss.rule({
                    selector: `:import(${path})`,
                    raws: { after: "\n" },
                  });
                  imports.forEach(({ theirName, importedName }) => {
                    importRule.append({
                      value: theirName,
                      prop: importedName,
                      raws: { before: "\n  " },
                    });
                  });
                  root.prepend(importRule);
                });
              },
            };
          },
        };
      };
      module.exports.postcss = true;
    },
    9827: (module, exports, __nccwpck_require__) => {
      "use strict";
      exports.__esModule = true;
      exports["default"] = void 0;
      var _processor = _interopRequireDefault(__nccwpck_require__(8227));
      var selectors = _interopRequireWildcard(__nccwpck_require__(4062));
      function _getRequireWildcardCache(nodeInterop) {
        if (typeof WeakMap !== "function") return null;
        var cacheBabelInterop = new WeakMap();
        var cacheNodeInterop = new WeakMap();
        return (_getRequireWildcardCache = function _getRequireWildcardCache(
          nodeInterop,
        ) {
          return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
        })(nodeInterop);
      }
      function _interopRequireWildcard(obj, nodeInterop) {
        if (!nodeInterop && obj && obj.__esModule) {
          return obj;
        }
        if (
          obj === null ||
          (typeof obj !== "object" && typeof obj !== "function")
        ) {
          return { default: obj };
        }
        var cache = _getRequireWildcardCache(nodeInterop);
        if (cache && cache.has(obj)) {
          return cache.get(obj);
        }
        var newObj = {};
        var hasPropertyDescriptor =
          Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var key in obj) {
          if (
            key !== "default" &&
            Object.prototype.hasOwnProperty.call(obj, key)
          ) {
            var desc = hasPropertyDescriptor
              ? Object.getOwnPropertyDescriptor(obj, key)
              : null;
            if (desc && (desc.get || desc.set)) {
              Object.defineProperty(newObj, key, desc);
            } else {
              newObj[key] = obj[key];
            }
          }
        }
        newObj["default"] = obj;
        if (cache) {
          cache.set(obj, newObj);
        }
        return newObj;
      }
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var parser = function parser(processor) {
        return new _processor["default"](processor);
      };
      Object.assign(parser, selectors);
      delete parser.__esModule;
      var _default = parser;
      exports["default"] = _default;
      module.exports = exports.default;
    },
    2508: (module, exports, __nccwpck_require__) => {
      "use strict";
      exports.__esModule = true;
      exports["default"] = void 0;
      var _root = _interopRequireDefault(__nccwpck_require__(9608));
      var _selector = _interopRequireDefault(__nccwpck_require__(5297));
      var _className = _interopRequireDefault(__nccwpck_require__(173));
      var _comment = _interopRequireDefault(__nccwpck_require__(8983));
      var _id = _interopRequireDefault(__nccwpck_require__(8453));
      var _tag = _interopRequireDefault(__nccwpck_require__(5526));
      var _string = _interopRequireDefault(__nccwpck_require__(4349));
      var _pseudo = _interopRequireDefault(__nccwpck_require__(7250));
      var _attribute = _interopRequireWildcard(__nccwpck_require__(7966));
      var _universal = _interopRequireDefault(__nccwpck_require__(815));
      var _combinator = _interopRequireDefault(__nccwpck_require__(3998));
      var _nesting = _interopRequireDefault(__nccwpck_require__(8568));
      var _sortAscending = _interopRequireDefault(__nccwpck_require__(6713));
      var _tokenize = _interopRequireWildcard(__nccwpck_require__(8966));
      var tokens = _interopRequireWildcard(__nccwpck_require__(1885));
      var types = _interopRequireWildcard(__nccwpck_require__(8115));
      var _util = __nccwpck_require__(9236);
      var _WHITESPACE_TOKENS, _Object$assign;
      function _getRequireWildcardCache(nodeInterop) {
        if (typeof WeakMap !== "function") return null;
        var cacheBabelInterop = new WeakMap();
        var cacheNodeInterop = new WeakMap();
        return (_getRequireWildcardCache = function _getRequireWildcardCache(
          nodeInterop,
        ) {
          return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
        })(nodeInterop);
      }
      function _interopRequireWildcard(obj, nodeInterop) {
        if (!nodeInterop && obj && obj.__esModule) {
          return obj;
        }
        if (
          obj === null ||
          (typeof obj !== "object" && typeof obj !== "function")
        ) {
          return { default: obj };
        }
        var cache = _getRequireWildcardCache(nodeInterop);
        if (cache && cache.has(obj)) {
          return cache.get(obj);
        }
        var newObj = {};
        var hasPropertyDescriptor =
          Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var key in obj) {
          if (
            key !== "default" &&
            Object.prototype.hasOwnProperty.call(obj, key)
          ) {
            var desc = hasPropertyDescriptor
              ? Object.getOwnPropertyDescriptor(obj, key)
              : null;
            if (desc && (desc.get || desc.set)) {
              Object.defineProperty(newObj, key, desc);
            } else {
              newObj[key] = obj[key];
            }
          }
        }
        newObj["default"] = obj;
        if (cache) {
          cache.set(obj, newObj);
        }
        return newObj;
      }
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", { writable: false });
        return Constructor;
      }
      var WHITESPACE_TOKENS =
        ((_WHITESPACE_TOKENS = {}),
        (_WHITESPACE_TOKENS[tokens.space] = true),
        (_WHITESPACE_TOKENS[tokens.cr] = true),
        (_WHITESPACE_TOKENS[tokens.feed] = true),
        (_WHITESPACE_TOKENS[tokens.newline] = true),
        (_WHITESPACE_TOKENS[tokens.tab] = true),
        _WHITESPACE_TOKENS);
      var WHITESPACE_EQUIV_TOKENS = Object.assign(
        {},
        WHITESPACE_TOKENS,
        ((_Object$assign = {}),
        (_Object$assign[tokens.comment] = true),
        _Object$assign),
      );
      function tokenStart(token) {
        return {
          line: token[_tokenize.FIELDS.START_LINE],
          column: token[_tokenize.FIELDS.START_COL],
        };
      }
      function tokenEnd(token) {
        return {
          line: token[_tokenize.FIELDS.END_LINE],
          column: token[_tokenize.FIELDS.END_COL],
        };
      }
      function getSource(startLine, startColumn, endLine, endColumn) {
        return {
          start: { line: startLine, column: startColumn },
          end: { line: endLine, column: endColumn },
        };
      }
      function getTokenSource(token) {
        return getSource(
          token[_tokenize.FIELDS.START_LINE],
          token[_tokenize.FIELDS.START_COL],
          token[_tokenize.FIELDS.END_LINE],
          token[_tokenize.FIELDS.END_COL],
        );
      }
      function getTokenSourceSpan(startToken, endToken) {
        if (!startToken) {
          return undefined;
        }
        return getSource(
          startToken[_tokenize.FIELDS.START_LINE],
          startToken[_tokenize.FIELDS.START_COL],
          endToken[_tokenize.FIELDS.END_LINE],
          endToken[_tokenize.FIELDS.END_COL],
        );
      }
      function unescapeProp(node, prop) {
        var value = node[prop];
        if (typeof value !== "string") {
          return;
        }
        if (value.indexOf("\\") !== -1) {
          (0, _util.ensureObject)(node, "raws");
          node[prop] = (0, _util.unesc)(value);
          if (node.raws[prop] === undefined) {
            node.raws[prop] = value;
          }
        }
        return node;
      }
      function indexesOf(array, item) {
        var i = -1;
        var indexes = [];
        while ((i = array.indexOf(item, i + 1)) !== -1) {
          indexes.push(i);
        }
        return indexes;
      }
      function uniqs() {
        var list = Array.prototype.concat.apply([], arguments);
        return list.filter(function (item, i) {
          return i === list.indexOf(item);
        });
      }
      var Parser = (function () {
        function Parser(rule, options) {
          if (options === void 0) {
            options = {};
          }
          this.rule = rule;
          this.options = Object.assign({ lossy: false, safe: false }, options);
          this.position = 0;
          this.css =
            typeof this.rule === "string" ? this.rule : this.rule.selector;
          this.tokens = (0, _tokenize["default"])({
            css: this.css,
            error: this._errorGenerator(),
            safe: this.options.safe,
          });
          var rootSource = getTokenSourceSpan(
            this.tokens[0],
            this.tokens[this.tokens.length - 1],
          );
          this.root = new _root["default"]({ source: rootSource });
          this.root.errorGenerator = this._errorGenerator();
          var selector = new _selector["default"]({
            source: { start: { line: 1, column: 1 } },
            sourceIndex: 0,
          });
          this.root.append(selector);
          this.current = selector;
          this.loop();
        }
        var _proto = Parser.prototype;
        _proto._errorGenerator = function _errorGenerator() {
          var _this = this;
          return function (message, errorOptions) {
            if (typeof _this.rule === "string") {
              return new Error(message);
            }
            return _this.rule.error(message, errorOptions);
          };
        };
        _proto.attribute = function attribute() {
          var attr = [];
          var startingToken = this.currToken;
          this.position++;
          while (
            this.position < this.tokens.length &&
            this.currToken[_tokenize.FIELDS.TYPE] !== tokens.closeSquare
          ) {
            attr.push(this.currToken);
            this.position++;
          }
          if (this.currToken[_tokenize.FIELDS.TYPE] !== tokens.closeSquare) {
            return this.expected(
              "closing square bracket",
              this.currToken[_tokenize.FIELDS.START_POS],
            );
          }
          var len = attr.length;
          var node = {
            source: getSource(
              startingToken[1],
              startingToken[2],
              this.currToken[3],
              this.currToken[4],
            ),
            sourceIndex: startingToken[_tokenize.FIELDS.START_POS],
          };
          if (
            len === 1 &&
            !~[tokens.word].indexOf(attr[0][_tokenize.FIELDS.TYPE])
          ) {
            return this.expected(
              "attribute",
              attr[0][_tokenize.FIELDS.START_POS],
            );
          }
          var pos = 0;
          var spaceBefore = "";
          var commentBefore = "";
          var lastAdded = null;
          var spaceAfterMeaningfulToken = false;
          while (pos < len) {
            var token = attr[pos];
            var content = this.content(token);
            var next = attr[pos + 1];
            switch (token[_tokenize.FIELDS.TYPE]) {
              case tokens.space:
                spaceAfterMeaningfulToken = true;
                if (this.options.lossy) {
                  break;
                }
                if (lastAdded) {
                  (0, _util.ensureObject)(node, "spaces", lastAdded);
                  var prevContent = node.spaces[lastAdded].after || "";
                  node.spaces[lastAdded].after = prevContent + content;
                  var existingComment =
                    (0, _util.getProp)(
                      node,
                      "raws",
                      "spaces",
                      lastAdded,
                      "after",
                    ) || null;
                  if (existingComment) {
                    node.raws.spaces[lastAdded].after =
                      existingComment + content;
                  }
                } else {
                  spaceBefore = spaceBefore + content;
                  commentBefore = commentBefore + content;
                }
                break;
              case tokens.asterisk:
                if (next[_tokenize.FIELDS.TYPE] === tokens.equals) {
                  node.operator = content;
                  lastAdded = "operator";
                } else if (
                  (!node.namespace ||
                    (lastAdded === "namespace" &&
                      !spaceAfterMeaningfulToken)) &&
                  next
                ) {
                  if (spaceBefore) {
                    (0, _util.ensureObject)(node, "spaces", "attribute");
                    node.spaces.attribute.before = spaceBefore;
                    spaceBefore = "";
                  }
                  if (commentBefore) {
                    (0, _util.ensureObject)(
                      node,
                      "raws",
                      "spaces",
                      "attribute",
                    );
                    node.raws.spaces.attribute.before = spaceBefore;
                    commentBefore = "";
                  }
                  node.namespace = (node.namespace || "") + content;
                  var rawValue =
                    (0, _util.getProp)(node, "raws", "namespace") || null;
                  if (rawValue) {
                    node.raws.namespace += content;
                  }
                  lastAdded = "namespace";
                }
                spaceAfterMeaningfulToken = false;
                break;
              case tokens.dollar:
                if (lastAdded === "value") {
                  var oldRawValue = (0, _util.getProp)(node, "raws", "value");
                  node.value += "$";
                  if (oldRawValue) {
                    node.raws.value = oldRawValue + "$";
                  }
                  break;
                }
              case tokens.caret:
                if (next[_tokenize.FIELDS.TYPE] === tokens.equals) {
                  node.operator = content;
                  lastAdded = "operator";
                }
                spaceAfterMeaningfulToken = false;
                break;
              case tokens.combinator:
                if (
                  content === "~" &&
                  next[_tokenize.FIELDS.TYPE] === tokens.equals
                ) {
                  node.operator = content;
                  lastAdded = "operator";
                }
                if (content !== "|") {
                  spaceAfterMeaningfulToken = false;
                  break;
                }
                if (next[_tokenize.FIELDS.TYPE] === tokens.equals) {
                  node.operator = content;
                  lastAdded = "operator";
                } else if (!node.namespace && !node.attribute) {
                  node.namespace = true;
                }
                spaceAfterMeaningfulToken = false;
                break;
              case tokens.word:
                if (
                  next &&
                  this.content(next) === "|" &&
                  attr[pos + 2] &&
                  attr[pos + 2][_tokenize.FIELDS.TYPE] !== tokens.equals &&
                  !node.operator &&
                  !node.namespace
                ) {
                  node.namespace = content;
                  lastAdded = "namespace";
                } else if (
                  !node.attribute ||
                  (lastAdded === "attribute" && !spaceAfterMeaningfulToken)
                ) {
                  if (spaceBefore) {
                    (0, _util.ensureObject)(node, "spaces", "attribute");
                    node.spaces.attribute.before = spaceBefore;
                    spaceBefore = "";
                  }
                  if (commentBefore) {
                    (0, _util.ensureObject)(
                      node,
                      "raws",
                      "spaces",
                      "attribute",
                    );
                    node.raws.spaces.attribute.before = commentBefore;
                    commentBefore = "";
                  }
                  node.attribute = (node.attribute || "") + content;
                  var _rawValue =
                    (0, _util.getProp)(node, "raws", "attribute") || null;
                  if (_rawValue) {
                    node.raws.attribute += content;
                  }
                  lastAdded = "attribute";
                } else if (
                  (!node.value && node.value !== "") ||
                  (lastAdded === "value" &&
                    !(spaceAfterMeaningfulToken || node.quoteMark))
                ) {
                  var _unescaped = (0, _util.unesc)(content);
                  var _oldRawValue =
                    (0, _util.getProp)(node, "raws", "value") || "";
                  var oldValue = node.value || "";
                  node.value = oldValue + _unescaped;
                  node.quoteMark = null;
                  if (_unescaped !== content || _oldRawValue) {
                    (0, _util.ensureObject)(node, "raws");
                    node.raws.value = (_oldRawValue || oldValue) + content;
                  }
                  lastAdded = "value";
                } else {
                  var insensitive = content === "i" || content === "I";
                  if (
                    (node.value || node.value === "") &&
                    (node.quoteMark || spaceAfterMeaningfulToken)
                  ) {
                    node.insensitive = insensitive;
                    if (!insensitive || content === "I") {
                      (0, _util.ensureObject)(node, "raws");
                      node.raws.insensitiveFlag = content;
                    }
                    lastAdded = "insensitive";
                    if (spaceBefore) {
                      (0, _util.ensureObject)(node, "spaces", "insensitive");
                      node.spaces.insensitive.before = spaceBefore;
                      spaceBefore = "";
                    }
                    if (commentBefore) {
                      (0, _util.ensureObject)(
                        node,
                        "raws",
                        "spaces",
                        "insensitive",
                      );
                      node.raws.spaces.insensitive.before = commentBefore;
                      commentBefore = "";
                    }
                  } else if (node.value || node.value === "") {
                    lastAdded = "value";
                    node.value += content;
                    if (node.raws.value) {
                      node.raws.value += content;
                    }
                  }
                }
                spaceAfterMeaningfulToken = false;
                break;
              case tokens.str:
                if (!node.attribute || !node.operator) {
                  return this.error(
                    "Expected an attribute followed by an operator preceding the string.",
                    { index: token[_tokenize.FIELDS.START_POS] },
                  );
                }
                var _unescapeValue = (0, _attribute.unescapeValue)(content),
                  unescaped = _unescapeValue.unescaped,
                  quoteMark = _unescapeValue.quoteMark;
                node.value = unescaped;
                node.quoteMark = quoteMark;
                lastAdded = "value";
                (0, _util.ensureObject)(node, "raws");
                node.raws.value = content;
                spaceAfterMeaningfulToken = false;
                break;
              case tokens.equals:
                if (!node.attribute) {
                  return this.expected(
                    "attribute",
                    token[_tokenize.FIELDS.START_POS],
                    content,
                  );
                }
                if (node.value) {
                  return this.error(
                    'Unexpected "=" found; an operator was already defined.',
                    { index: token[_tokenize.FIELDS.START_POS] },
                  );
                }
                node.operator = node.operator
                  ? node.operator + content
                  : content;
                lastAdded = "operator";
                spaceAfterMeaningfulToken = false;
                break;
              case tokens.comment:
                if (lastAdded) {
                  if (
                    spaceAfterMeaningfulToken ||
                    (next && next[_tokenize.FIELDS.TYPE] === tokens.space) ||
                    lastAdded === "insensitive"
                  ) {
                    var lastComment =
                      (0, _util.getProp)(node, "spaces", lastAdded, "after") ||
                      "";
                    var rawLastComment =
                      (0, _util.getProp)(
                        node,
                        "raws",
                        "spaces",
                        lastAdded,
                        "after",
                      ) || lastComment;
                    (0, _util.ensureObject)(node, "raws", "spaces", lastAdded);
                    node.raws.spaces[lastAdded].after =
                      rawLastComment + content;
                  } else {
                    var lastValue = node[lastAdded] || "";
                    var rawLastValue =
                      (0, _util.getProp)(node, "raws", lastAdded) || lastValue;
                    (0, _util.ensureObject)(node, "raws");
                    node.raws[lastAdded] = rawLastValue + content;
                  }
                } else {
                  commentBefore = commentBefore + content;
                }
                break;
              default:
                return this.error('Unexpected "' + content + '" found.', {
                  index: token[_tokenize.FIELDS.START_POS],
                });
            }
            pos++;
          }
          unescapeProp(node, "attribute");
          unescapeProp(node, "namespace");
          this.newNode(new _attribute["default"](node));
          this.position++;
        };
        _proto.parseWhitespaceEquivalentTokens =
          function parseWhitespaceEquivalentTokens(stopPosition) {
            if (stopPosition < 0) {
              stopPosition = this.tokens.length;
            }
            var startPosition = this.position;
            var nodes = [];
            var space = "";
            var lastComment = undefined;
            do {
              if (WHITESPACE_TOKENS[this.currToken[_tokenize.FIELDS.TYPE]]) {
                if (!this.options.lossy) {
                  space += this.content();
                }
              } else if (
                this.currToken[_tokenize.FIELDS.TYPE] === tokens.comment
              ) {
                var spaces = {};
                if (space) {
                  spaces.before = space;
                  space = "";
                }
                lastComment = new _comment["default"]({
                  value: this.content(),
                  source: getTokenSource(this.currToken),
                  sourceIndex: this.currToken[_tokenize.FIELDS.START_POS],
                  spaces,
                });
                nodes.push(lastComment);
              }
            } while (++this.position < stopPosition);
            if (space) {
              if (lastComment) {
                lastComment.spaces.after = space;
              } else if (!this.options.lossy) {
                var firstToken = this.tokens[startPosition];
                var lastToken = this.tokens[this.position - 1];
                nodes.push(
                  new _string["default"]({
                    value: "",
                    source: getSource(
                      firstToken[_tokenize.FIELDS.START_LINE],
                      firstToken[_tokenize.FIELDS.START_COL],
                      lastToken[_tokenize.FIELDS.END_LINE],
                      lastToken[_tokenize.FIELDS.END_COL],
                    ),
                    sourceIndex: firstToken[_tokenize.FIELDS.START_POS],
                    spaces: { before: space, after: "" },
                  }),
                );
              }
            }
            return nodes;
          };
        _proto.convertWhitespaceNodesToSpace =
          function convertWhitespaceNodesToSpace(nodes, requiredSpace) {
            var _this2 = this;
            if (requiredSpace === void 0) {
              requiredSpace = false;
            }
            var space = "";
            var rawSpace = "";
            nodes.forEach(function (n) {
              var spaceBefore = _this2.lossySpace(
                n.spaces.before,
                requiredSpace,
              );
              var rawSpaceBefore = _this2.lossySpace(
                n.rawSpaceBefore,
                requiredSpace,
              );
              space +=
                spaceBefore +
                _this2.lossySpace(
                  n.spaces.after,
                  requiredSpace && spaceBefore.length === 0,
                );
              rawSpace +=
                spaceBefore +
                n.value +
                _this2.lossySpace(
                  n.rawSpaceAfter,
                  requiredSpace && rawSpaceBefore.length === 0,
                );
            });
            if (rawSpace === space) {
              rawSpace = undefined;
            }
            var result = { space, rawSpace };
            return result;
          };
        _proto.isNamedCombinator = function isNamedCombinator(position) {
          if (position === void 0) {
            position = this.position;
          }
          return (
            this.tokens[position + 0] &&
            this.tokens[position + 0][_tokenize.FIELDS.TYPE] === tokens.slash &&
            this.tokens[position + 1] &&
            this.tokens[position + 1][_tokenize.FIELDS.TYPE] === tokens.word &&
            this.tokens[position + 2] &&
            this.tokens[position + 2][_tokenize.FIELDS.TYPE] === tokens.slash
          );
        };
        _proto.namedCombinator = function namedCombinator() {
          if (this.isNamedCombinator()) {
            var nameRaw = this.content(this.tokens[this.position + 1]);
            var name = (0, _util.unesc)(nameRaw).toLowerCase();
            var raws = {};
            if (name !== nameRaw) {
              raws.value = "/" + nameRaw + "/";
            }
            var node = new _combinator["default"]({
              value: "/" + name + "/",
              source: getSource(
                this.currToken[_tokenize.FIELDS.START_LINE],
                this.currToken[_tokenize.FIELDS.START_COL],
                this.tokens[this.position + 2][_tokenize.FIELDS.END_LINE],
                this.tokens[this.position + 2][_tokenize.FIELDS.END_COL],
              ),
              sourceIndex: this.currToken[_tokenize.FIELDS.START_POS],
              raws,
            });
            this.position = this.position + 3;
            return node;
          } else {
            this.unexpected();
          }
        };
        _proto.combinator = function combinator() {
          var _this3 = this;
          if (this.content() === "|") {
            return this.namespace();
          }
          var nextSigTokenPos = this.locateNextMeaningfulToken(this.position);
          if (
            nextSigTokenPos < 0 ||
            this.tokens[nextSigTokenPos][_tokenize.FIELDS.TYPE] ===
              tokens.comma ||
            this.tokens[nextSigTokenPos][_tokenize.FIELDS.TYPE] ===
              tokens.closeParenthesis
          ) {
            var nodes = this.parseWhitespaceEquivalentTokens(nextSigTokenPos);
            if (nodes.length > 0) {
              var last = this.current.last;
              if (last) {
                var _this$convertWhitespa =
                    this.convertWhitespaceNodesToSpace(nodes),
                  space = _this$convertWhitespa.space,
                  rawSpace = _this$convertWhitespa.rawSpace;
                if (rawSpace !== undefined) {
                  last.rawSpaceAfter += rawSpace;
                }
                last.spaces.after += space;
              } else {
                nodes.forEach(function (n) {
                  return _this3.newNode(n);
                });
              }
            }
            return;
          }
          var firstToken = this.currToken;
          var spaceOrDescendantSelectorNodes = undefined;
          if (nextSigTokenPos > this.position) {
            spaceOrDescendantSelectorNodes =
              this.parseWhitespaceEquivalentTokens(nextSigTokenPos);
          }
          var node;
          if (this.isNamedCombinator()) {
            node = this.namedCombinator();
          } else if (
            this.currToken[_tokenize.FIELDS.TYPE] === tokens.combinator
          ) {
            node = new _combinator["default"]({
              value: this.content(),
              source: getTokenSource(this.currToken),
              sourceIndex: this.currToken[_tokenize.FIELDS.START_POS],
            });
            this.position++;
          } else if (WHITESPACE_TOKENS[this.currToken[_tokenize.FIELDS.TYPE]]) {
          } else if (!spaceOrDescendantSelectorNodes) {
            this.unexpected();
          }
          if (node) {
            if (spaceOrDescendantSelectorNodes) {
              var _this$convertWhitespa2 = this.convertWhitespaceNodesToSpace(
                  spaceOrDescendantSelectorNodes,
                ),
                _space = _this$convertWhitespa2.space,
                _rawSpace = _this$convertWhitespa2.rawSpace;
              node.spaces.before = _space;
              node.rawSpaceBefore = _rawSpace;
            }
          } else {
            var _this$convertWhitespa3 = this.convertWhitespaceNodesToSpace(
                spaceOrDescendantSelectorNodes,
                true,
              ),
              _space2 = _this$convertWhitespa3.space,
              _rawSpace2 = _this$convertWhitespa3.rawSpace;
            if (!_rawSpace2) {
              _rawSpace2 = _space2;
            }
            var spaces = {};
            var raws = { spaces: {} };
            if (_space2.endsWith(" ") && _rawSpace2.endsWith(" ")) {
              spaces.before = _space2.slice(0, _space2.length - 1);
              raws.spaces.before = _rawSpace2.slice(0, _rawSpace2.length - 1);
            } else if (_space2.startsWith(" ") && _rawSpace2.startsWith(" ")) {
              spaces.after = _space2.slice(1);
              raws.spaces.after = _rawSpace2.slice(1);
            } else {
              raws.value = _rawSpace2;
            }
            node = new _combinator["default"]({
              value: " ",
              source: getTokenSourceSpan(
                firstToken,
                this.tokens[this.position - 1],
              ),
              sourceIndex: firstToken[_tokenize.FIELDS.START_POS],
              spaces,
              raws,
            });
          }
          if (
            this.currToken &&
            this.currToken[_tokenize.FIELDS.TYPE] === tokens.space
          ) {
            node.spaces.after = this.optionalSpace(this.content());
            this.position++;
          }
          return this.newNode(node);
        };
        _proto.comma = function comma() {
          if (this.position === this.tokens.length - 1) {
            this.root.trailingComma = true;
            this.position++;
            return;
          }
          this.current._inferEndPosition();
          var selector = new _selector["default"]({
            source: { start: tokenStart(this.tokens[this.position + 1]) },
            sourceIndex:
              this.tokens[this.position + 1][_tokenize.FIELDS.START_POS],
          });
          this.current.parent.append(selector);
          this.current = selector;
          this.position++;
        };
        _proto.comment = function comment() {
          var current = this.currToken;
          this.newNode(
            new _comment["default"]({
              value: this.content(),
              source: getTokenSource(current),
              sourceIndex: current[_tokenize.FIELDS.START_POS],
            }),
          );
          this.position++;
        };
        _proto.error = function error(message, opts) {
          throw this.root.error(message, opts);
        };
        _proto.missingBackslash = function missingBackslash() {
          return this.error("Expected a backslash preceding the semicolon.", {
            index: this.currToken[_tokenize.FIELDS.START_POS],
          });
        };
        _proto.missingParenthesis = function missingParenthesis() {
          return this.expected(
            "opening parenthesis",
            this.currToken[_tokenize.FIELDS.START_POS],
          );
        };
        _proto.missingSquareBracket = function missingSquareBracket() {
          return this.expected(
            "opening square bracket",
            this.currToken[_tokenize.FIELDS.START_POS],
          );
        };
        _proto.unexpected = function unexpected() {
          return this.error(
            "Unexpected '" +
              this.content() +
              "'. Escaping special characters with \\ may help.",
            this.currToken[_tokenize.FIELDS.START_POS],
          );
        };
        _proto.unexpectedPipe = function unexpectedPipe() {
          return this.error(
            "Unexpected '|'.",
            this.currToken[_tokenize.FIELDS.START_POS],
          );
        };
        _proto.namespace = function namespace() {
          var before = (this.prevToken && this.content(this.prevToken)) || true;
          if (this.nextToken[_tokenize.FIELDS.TYPE] === tokens.word) {
            this.position++;
            return this.word(before);
          } else if (
            this.nextToken[_tokenize.FIELDS.TYPE] === tokens.asterisk
          ) {
            this.position++;
            return this.universal(before);
          }
          this.unexpectedPipe();
        };
        _proto.nesting = function nesting() {
          if (this.nextToken) {
            var nextContent = this.content(this.nextToken);
            if (nextContent === "|") {
              this.position++;
              return;
            }
          }
          var current = this.currToken;
          this.newNode(
            new _nesting["default"]({
              value: this.content(),
              source: getTokenSource(current),
              sourceIndex: current[_tokenize.FIELDS.START_POS],
            }),
          );
          this.position++;
        };
        _proto.parentheses = function parentheses() {
          var last = this.current.last;
          var unbalanced = 1;
          this.position++;
          if (last && last.type === types.PSEUDO) {
            var selector = new _selector["default"]({
              source: { start: tokenStart(this.tokens[this.position]) },
              sourceIndex:
                this.tokens[this.position][_tokenize.FIELDS.START_POS],
            });
            var cache = this.current;
            last.append(selector);
            this.current = selector;
            while (this.position < this.tokens.length && unbalanced) {
              if (
                this.currToken[_tokenize.FIELDS.TYPE] === tokens.openParenthesis
              ) {
                unbalanced++;
              }
              if (
                this.currToken[_tokenize.FIELDS.TYPE] ===
                tokens.closeParenthesis
              ) {
                unbalanced--;
              }
              if (unbalanced) {
                this.parse();
              } else {
                this.current.source.end = tokenEnd(this.currToken);
                this.current.parent.source.end = tokenEnd(this.currToken);
                this.position++;
              }
            }
            this.current = cache;
          } else {
            var parenStart = this.currToken;
            var parenValue = "(";
            var parenEnd;
            while (this.position < this.tokens.length && unbalanced) {
              if (
                this.currToken[_tokenize.FIELDS.TYPE] === tokens.openParenthesis
              ) {
                unbalanced++;
              }
              if (
                this.currToken[_tokenize.FIELDS.TYPE] ===
                tokens.closeParenthesis
              ) {
                unbalanced--;
              }
              parenEnd = this.currToken;
              parenValue += this.parseParenthesisToken(this.currToken);
              this.position++;
            }
            if (last) {
              last.appendToPropertyAndEscape("value", parenValue, parenValue);
            } else {
              this.newNode(
                new _string["default"]({
                  value: parenValue,
                  source: getSource(
                    parenStart[_tokenize.FIELDS.START_LINE],
                    parenStart[_tokenize.FIELDS.START_COL],
                    parenEnd[_tokenize.FIELDS.END_LINE],
                    parenEnd[_tokenize.FIELDS.END_COL],
                  ),
                  sourceIndex: parenStart[_tokenize.FIELDS.START_POS],
                }),
              );
            }
          }
          if (unbalanced) {
            return this.expected(
              "closing parenthesis",
              this.currToken[_tokenize.FIELDS.START_POS],
            );
          }
        };
        _proto.pseudo = function pseudo() {
          var _this4 = this;
          var pseudoStr = "";
          var startingToken = this.currToken;
          while (
            this.currToken &&
            this.currToken[_tokenize.FIELDS.TYPE] === tokens.colon
          ) {
            pseudoStr += this.content();
            this.position++;
          }
          if (!this.currToken) {
            return this.expected(
              ["pseudo-class", "pseudo-element"],
              this.position - 1,
            );
          }
          if (this.currToken[_tokenize.FIELDS.TYPE] === tokens.word) {
            this.splitWord(false, function (first, length) {
              pseudoStr += first;
              _this4.newNode(
                new _pseudo["default"]({
                  value: pseudoStr,
                  source: getTokenSourceSpan(startingToken, _this4.currToken),
                  sourceIndex: startingToken[_tokenize.FIELDS.START_POS],
                }),
              );
              if (
                length > 1 &&
                _this4.nextToken &&
                _this4.nextToken[_tokenize.FIELDS.TYPE] ===
                  tokens.openParenthesis
              ) {
                _this4.error("Misplaced parenthesis.", {
                  index: _this4.nextToken[_tokenize.FIELDS.START_POS],
                });
              }
            });
          } else {
            return this.expected(
              ["pseudo-class", "pseudo-element"],
              this.currToken[_tokenize.FIELDS.START_POS],
            );
          }
        };
        _proto.space = function space() {
          var content = this.content();
          if (
            this.position === 0 ||
            this.prevToken[_tokenize.FIELDS.TYPE] === tokens.comma ||
            this.prevToken[_tokenize.FIELDS.TYPE] === tokens.openParenthesis ||
            this.current.nodes.every(function (node) {
              return node.type === "comment";
            })
          ) {
            this.spaces = this.optionalSpace(content);
            this.position++;
          } else if (
            this.position === this.tokens.length - 1 ||
            this.nextToken[_tokenize.FIELDS.TYPE] === tokens.comma ||
            this.nextToken[_tokenize.FIELDS.TYPE] === tokens.closeParenthesis
          ) {
            this.current.last.spaces.after = this.optionalSpace(content);
            this.position++;
          } else {
            this.combinator();
          }
        };
        _proto.string = function string() {
          var current = this.currToken;
          this.newNode(
            new _string["default"]({
              value: this.content(),
              source: getTokenSource(current),
              sourceIndex: current[_tokenize.FIELDS.START_POS],
            }),
          );
          this.position++;
        };
        _proto.universal = function universal(namespace) {
          var nextToken = this.nextToken;
          if (nextToken && this.content(nextToken) === "|") {
            this.position++;
            return this.namespace();
          }
          var current = this.currToken;
          this.newNode(
            new _universal["default"]({
              value: this.content(),
              source: getTokenSource(current),
              sourceIndex: current[_tokenize.FIELDS.START_POS],
            }),
            namespace,
          );
          this.position++;
        };
        _proto.splitWord = function splitWord(namespace, firstCallback) {
          var _this5 = this;
          var nextToken = this.nextToken;
          var word = this.content();
          while (
            nextToken &&
            ~[tokens.dollar, tokens.caret, tokens.equals, tokens.word].indexOf(
              nextToken[_tokenize.FIELDS.TYPE],
            )
          ) {
            this.position++;
            var current = this.content();
            word += current;
            if (current.lastIndexOf("\\") === current.length - 1) {
              var next = this.nextToken;
              if (next && next[_tokenize.FIELDS.TYPE] === tokens.space) {
                word += this.requiredSpace(this.content(next));
                this.position++;
              }
            }
            nextToken = this.nextToken;
          }
          var hasClass = indexesOf(word, ".").filter(function (i) {
            var escapedDot = word[i - 1] === "\\";
            var isKeyframesPercent = /^\d+\.\d+%$/.test(word);
            return !escapedDot && !isKeyframesPercent;
          });
          var hasId = indexesOf(word, "#").filter(function (i) {
            return word[i - 1] !== "\\";
          });
          var interpolations = indexesOf(word, "#{");
          if (interpolations.length) {
            hasId = hasId.filter(function (hashIndex) {
              return !~interpolations.indexOf(hashIndex);
            });
          }
          var indices = (0, _sortAscending["default"])(
            uniqs([0].concat(hasClass, hasId)),
          );
          indices.forEach(function (ind, i) {
            var index = indices[i + 1] || word.length;
            var value = word.slice(ind, index);
            if (i === 0 && firstCallback) {
              return firstCallback.call(_this5, value, indices.length);
            }
            var node;
            var current = _this5.currToken;
            var sourceIndex = current[_tokenize.FIELDS.START_POS] + indices[i];
            var source = getSource(
              current[1],
              current[2] + ind,
              current[3],
              current[2] + (index - 1),
            );
            if (~hasClass.indexOf(ind)) {
              var classNameOpts = {
                value: value.slice(1),
                source,
                sourceIndex,
              };
              node = new _className["default"](
                unescapeProp(classNameOpts, "value"),
              );
            } else if (~hasId.indexOf(ind)) {
              var idOpts = { value: value.slice(1), source, sourceIndex };
              node = new _id["default"](unescapeProp(idOpts, "value"));
            } else {
              var tagOpts = { value, source, sourceIndex };
              unescapeProp(tagOpts, "value");
              node = new _tag["default"](tagOpts);
            }
            _this5.newNode(node, namespace);
            namespace = null;
          });
          this.position++;
        };
        _proto.word = function word(namespace) {
          var nextToken = this.nextToken;
          if (nextToken && this.content(nextToken) === "|") {
            this.position++;
            return this.namespace();
          }
          return this.splitWord(namespace);
        };
        _proto.loop = function loop() {
          while (this.position < this.tokens.length) {
            this.parse(true);
          }
          this.current._inferEndPosition();
          return this.root;
        };
        _proto.parse = function parse(throwOnParenthesis) {
          switch (this.currToken[_tokenize.FIELDS.TYPE]) {
            case tokens.space:
              this.space();
              break;
            case tokens.comment:
              this.comment();
              break;
            case tokens.openParenthesis:
              this.parentheses();
              break;
            case tokens.closeParenthesis:
              if (throwOnParenthesis) {
                this.missingParenthesis();
              }
              break;
            case tokens.openSquare:
              this.attribute();
              break;
            case tokens.dollar:
            case tokens.caret:
            case tokens.equals:
            case tokens.word:
              this.word();
              break;
            case tokens.colon:
              this.pseudo();
              break;
            case tokens.comma:
              this.comma();
              break;
            case tokens.asterisk:
              this.universal();
              break;
            case tokens.ampersand:
              this.nesting();
              break;
            case tokens.slash:
            case tokens.combinator:
              this.combinator();
              break;
            case tokens.str:
              this.string();
              break;
            case tokens.closeSquare:
              this.missingSquareBracket();
            case tokens.semicolon:
              this.missingBackslash();
            default:
              this.unexpected();
          }
        };
        _proto.expected = function expected(description, index, found) {
          if (Array.isArray(description)) {
            var last = description.pop();
            description = description.join(", ") + " or " + last;
          }
          var an = /^[aeiou]/.test(description[0]) ? "an" : "a";
          if (!found) {
            return this.error("Expected " + an + " " + description + ".", {
              index,
            });
          }
          return this.error(
            "Expected " +
              an +
              " " +
              description +
              ', found "' +
              found +
              '" instead.',
            { index },
          );
        };
        _proto.requiredSpace = function requiredSpace(space) {
          return this.options.lossy ? " " : space;
        };
        _proto.optionalSpace = function optionalSpace(space) {
          return this.options.lossy ? "" : space;
        };
        _proto.lossySpace = function lossySpace(space, required) {
          if (this.options.lossy) {
            return required ? " " : "";
          } else {
            return space;
          }
        };
        _proto.parseParenthesisToken = function parseParenthesisToken(token) {
          var content = this.content(token);
          if (token[_tokenize.FIELDS.TYPE] === tokens.space) {
            return this.requiredSpace(content);
          } else {
            return content;
          }
        };
        _proto.newNode = function newNode(node, namespace) {
          if (namespace) {
            if (/^ +$/.test(namespace)) {
              if (!this.options.lossy) {
                this.spaces = (this.spaces || "") + namespace;
              }
              namespace = true;
            }
            node.namespace = namespace;
            unescapeProp(node, "namespace");
          }
          if (this.spaces) {
            node.spaces.before = this.spaces;
            this.spaces = "";
          }
          return this.current.append(node);
        };
        _proto.content = function content(token) {
          if (token === void 0) {
            token = this.currToken;
          }
          return this.css.slice(
            token[_tokenize.FIELDS.START_POS],
            token[_tokenize.FIELDS.END_POS],
          );
        };
        _proto.locateNextMeaningfulToken = function locateNextMeaningfulToken(
          startPosition,
        ) {
          if (startPosition === void 0) {
            startPosition = this.position + 1;
          }
          var searchPosition = startPosition;
          while (searchPosition < this.tokens.length) {
            if (
              WHITESPACE_EQUIV_TOKENS[
                this.tokens[searchPosition][_tokenize.FIELDS.TYPE]
              ]
            ) {
              searchPosition++;
              continue;
            } else {
              return searchPosition;
            }
          }
          return -1;
        };
        _createClass(Parser, [
          {
            key: "currToken",
            get: function get() {
              return this.tokens[this.position];
            },
          },
          {
            key: "nextToken",
            get: function get() {
              return this.tokens[this.position + 1];
            },
          },
          {
            key: "prevToken",
            get: function get() {
              return this.tokens[this.position - 1];
            },
          },
        ]);
        return Parser;
      })();
      exports["default"] = Parser;
      module.exports = exports.default;
    },
    8227: (module, exports, __nccwpck_require__) => {
      "use strict";
      exports.__esModule = true;
      exports["default"] = void 0;
      var _parser = _interopRequireDefault(__nccwpck_require__(2508));
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var Processor = (function () {
        function Processor(func, options) {
          this.func = func || function noop() {};
          this.funcRes = null;
          this.options = options;
        }
        var _proto = Processor.prototype;
        _proto._shouldUpdateSelector = function _shouldUpdateSelector(
          rule,
          options,
        ) {
          if (options === void 0) {
            options = {};
          }
          var merged = Object.assign({}, this.options, options);
          if (merged.updateSelector === false) {
            return false;
          } else {
            return typeof rule !== "string";
          }
        };
        _proto._isLossy = function _isLossy(options) {
          if (options === void 0) {
            options = {};
          }
          var merged = Object.assign({}, this.options, options);
          if (merged.lossless === false) {
            return true;
          } else {
            return false;
          }
        };
        _proto._root = function _root(rule, options) {
          if (options === void 0) {
            options = {};
          }
          var parser = new _parser["default"](
            rule,
            this._parseOptions(options),
          );
          return parser.root;
        };
        _proto._parseOptions = function _parseOptions(options) {
          return { lossy: this._isLossy(options) };
        };
        _proto._run = function _run(rule, options) {
          var _this = this;
          if (options === void 0) {
            options = {};
          }
          return new Promise(function (resolve, reject) {
            try {
              var root = _this._root(rule, options);
              Promise.resolve(_this.func(root))
                .then(function (transform) {
                  var string = undefined;
                  if (_this._shouldUpdateSelector(rule, options)) {
                    string = root.toString();
                    rule.selector = string;
                  }
                  return { transform, root, string };
                })
                .then(resolve, reject);
            } catch (e) {
              reject(e);
              return;
            }
          });
        };
        _proto._runSync = function _runSync(rule, options) {
          if (options === void 0) {
            options = {};
          }
          var root = this._root(rule, options);
          var transform = this.func(root);
          if (transform && typeof transform.then === "function") {
            throw new Error(
              "Selector processor returned a promise to a synchronous call.",
            );
          }
          var string = undefined;
          if (options.updateSelector && typeof rule !== "string") {
            string = root.toString();
            rule.selector = string;
          }
          return { transform, root, string };
        };
        _proto.ast = function ast(rule, options) {
          return this._run(rule, options).then(function (result) {
            return result.root;
          });
        };
        _proto.astSync = function astSync(rule, options) {
          return this._runSync(rule, options).root;
        };
        _proto.transform = function transform(rule, options) {
          return this._run(rule, options).then(function (result) {
            return result.transform;
          });
        };
        _proto.transformSync = function transformSync(rule, options) {
          return this._runSync(rule, options).transform;
        };
        _proto.process = function process(rule, options) {
          return this._run(rule, options).then(function (result) {
            return result.string || result.root.toString();
          });
        };
        _proto.processSync = function processSync(rule, options) {
          var result = this._runSync(rule, options);
          return result.string || result.root.toString();
        };
        return Processor;
      })();
      exports["default"] = Processor;
      module.exports = exports.default;
    },
    7966: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      exports.__esModule = true;
      exports["default"] = void 0;
      exports.unescapeValue = unescapeValue;
      var _cssesc = _interopRequireDefault(__nccwpck_require__(1499));
      var _unesc = _interopRequireDefault(__nccwpck_require__(1284));
      var _namespace = _interopRequireDefault(__nccwpck_require__(3253));
      var _types = __nccwpck_require__(8115);
      var _CSSESC_QUOTE_OPTIONS;
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", { writable: false });
        return Constructor;
      }
      function _inheritsLoose(subClass, superClass) {
        subClass.prototype = Object.create(superClass.prototype);
        subClass.prototype.constructor = subClass;
        _setPrototypeOf(subClass, superClass);
      }
      function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function _setPrototypeOf(o, p) {
              o.__proto__ = p;
              return o;
            };
        return _setPrototypeOf(o, p);
      }
      var deprecate = __nccwpck_require__(8823);
      var WRAPPED_IN_QUOTES = /^('|")([^]*)\1$/;
      var warnOfDeprecatedValueAssignment = deprecate(
        function () {},
        "Assigning an attribute a value containing characters that might need to be escaped is deprecated. " +
          "Call attribute.setValue() instead.",
      );
      var warnOfDeprecatedQuotedAssignment = deprecate(
        function () {},
        "Assigning attr.quoted is deprecated and has no effect. Assign to attr.quoteMark instead.",
      );
      var warnOfDeprecatedConstructor = deprecate(
        function () {},
        "Constructing an Attribute selector with a value without specifying quoteMark is deprecated. Note: The value should be unescaped now.",
      );
      function unescapeValue(value) {
        var deprecatedUsage = false;
        var quoteMark = null;
        var unescaped = value;
        var m = unescaped.match(WRAPPED_IN_QUOTES);
        if (m) {
          quoteMark = m[1];
          unescaped = m[2];
        }
        unescaped = (0, _unesc["default"])(unescaped);
        if (unescaped !== value) {
          deprecatedUsage = true;
        }
        return { deprecatedUsage, unescaped, quoteMark };
      }
      function handleDeprecatedContructorOpts(opts) {
        if (opts.quoteMark !== undefined) {
          return opts;
        }
        if (opts.value === undefined) {
          return opts;
        }
        warnOfDeprecatedConstructor();
        var _unescapeValue = unescapeValue(opts.value),
          quoteMark = _unescapeValue.quoteMark,
          unescaped = _unescapeValue.unescaped;
        if (!opts.raws) {
          opts.raws = {};
        }
        if (opts.raws.value === undefined) {
          opts.raws.value = opts.value;
        }
        opts.value = unescaped;
        opts.quoteMark = quoteMark;
        return opts;
      }
      var Attribute = (function (_Namespace) {
        _inheritsLoose(Attribute, _Namespace);
        function Attribute(opts) {
          var _this;
          if (opts === void 0) {
            opts = {};
          }
          _this =
            _Namespace.call(this, handleDeprecatedContructorOpts(opts)) || this;
          _this.type = _types.ATTRIBUTE;
          _this.raws = _this.raws || {};
          Object.defineProperty(_this.raws, "unquoted", {
            get: deprecate(function () {
              return _this.value;
            }, "attr.raws.unquoted is deprecated. Call attr.value instead."),
            set: deprecate(function () {
              return _this.value;
            }, "Setting attr.raws.unquoted is deprecated and has no effect. attr.value is unescaped by default now."),
          });
          _this._constructed = true;
          return _this;
        }
        var _proto = Attribute.prototype;
        _proto.getQuotedValue = function getQuotedValue(options) {
          if (options === void 0) {
            options = {};
          }
          var quoteMark = this._determineQuoteMark(options);
          var cssescopts = CSSESC_QUOTE_OPTIONS[quoteMark];
          var escaped = (0, _cssesc["default"])(this._value, cssescopts);
          return escaped;
        };
        _proto._determineQuoteMark = function _determineQuoteMark(options) {
          return options.smart
            ? this.smartQuoteMark(options)
            : this.preferredQuoteMark(options);
        };
        _proto.setValue = function setValue(value, options) {
          if (options === void 0) {
            options = {};
          }
          this._value = value;
          this._quoteMark = this._determineQuoteMark(options);
          this._syncRawValue();
        };
        _proto.smartQuoteMark = function smartQuoteMark(options) {
          var v = this.value;
          var numSingleQuotes = v.replace(/[^']/g, "").length;
          var numDoubleQuotes = v.replace(/[^"]/g, "").length;
          if (numSingleQuotes + numDoubleQuotes === 0) {
            var escaped = (0, _cssesc["default"])(v, { isIdentifier: true });
            if (escaped === v) {
              return Attribute.NO_QUOTE;
            } else {
              var pref = this.preferredQuoteMark(options);
              if (pref === Attribute.NO_QUOTE) {
                var quote =
                  this.quoteMark || options.quoteMark || Attribute.DOUBLE_QUOTE;
                var opts = CSSESC_QUOTE_OPTIONS[quote];
                var quoteValue = (0, _cssesc["default"])(v, opts);
                if (quoteValue.length < escaped.length) {
                  return quote;
                }
              }
              return pref;
            }
          } else if (numDoubleQuotes === numSingleQuotes) {
            return this.preferredQuoteMark(options);
          } else if (numDoubleQuotes < numSingleQuotes) {
            return Attribute.DOUBLE_QUOTE;
          } else {
            return Attribute.SINGLE_QUOTE;
          }
        };
        _proto.preferredQuoteMark = function preferredQuoteMark(options) {
          var quoteMark = options.preferCurrentQuoteMark
            ? this.quoteMark
            : options.quoteMark;
          if (quoteMark === undefined) {
            quoteMark = options.preferCurrentQuoteMark
              ? options.quoteMark
              : this.quoteMark;
          }
          if (quoteMark === undefined) {
            quoteMark = Attribute.DOUBLE_QUOTE;
          }
          return quoteMark;
        };
        _proto._syncRawValue = function _syncRawValue() {
          var rawValue = (0, _cssesc["default"])(
            this._value,
            CSSESC_QUOTE_OPTIONS[this.quoteMark],
          );
          if (rawValue === this._value) {
            if (this.raws) {
              delete this.raws.value;
            }
          } else {
            this.raws.value = rawValue;
          }
        };
        _proto._handleEscapes = function _handleEscapes(prop, value) {
          if (this._constructed) {
            var escaped = (0, _cssesc["default"])(value, {
              isIdentifier: true,
            });
            if (escaped !== value) {
              this.raws[prop] = escaped;
            } else {
              delete this.raws[prop];
            }
          }
        };
        _proto._spacesFor = function _spacesFor(name) {
          var attrSpaces = { before: "", after: "" };
          var spaces = this.spaces[name] || {};
          var rawSpaces = (this.raws.spaces && this.raws.spaces[name]) || {};
          return Object.assign(attrSpaces, spaces, rawSpaces);
        };
        _proto._stringFor = function _stringFor(name, spaceName, concat) {
          if (spaceName === void 0) {
            spaceName = name;
          }
          if (concat === void 0) {
            concat = defaultAttrConcat;
          }
          var attrSpaces = this._spacesFor(spaceName);
          return concat(this.stringifyProperty(name), attrSpaces);
        };
        _proto.offsetOf = function offsetOf(name) {
          var count = 1;
          var attributeSpaces = this._spacesFor("attribute");
          count += attributeSpaces.before.length;
          if (name === "namespace" || name === "ns") {
            return this.namespace ? count : -1;
          }
          if (name === "attributeNS") {
            return count;
          }
          count += this.namespaceString.length;
          if (this.namespace) {
            count += 1;
          }
          if (name === "attribute") {
            return count;
          }
          count += this.stringifyProperty("attribute").length;
          count += attributeSpaces.after.length;
          var operatorSpaces = this._spacesFor("operator");
          count += operatorSpaces.before.length;
          var operator = this.stringifyProperty("operator");
          if (name === "operator") {
            return operator ? count : -1;
          }
          count += operator.length;
          count += operatorSpaces.after.length;
          var valueSpaces = this._spacesFor("value");
          count += valueSpaces.before.length;
          var value = this.stringifyProperty("value");
          if (name === "value") {
            return value ? count : -1;
          }
          count += value.length;
          count += valueSpaces.after.length;
          var insensitiveSpaces = this._spacesFor("insensitive");
          count += insensitiveSpaces.before.length;
          if (name === "insensitive") {
            return this.insensitive ? count : -1;
          }
          return -1;
        };
        _proto.toString = function toString() {
          var _this2 = this;
          var selector = [this.rawSpaceBefore, "["];
          selector.push(this._stringFor("qualifiedAttribute", "attribute"));
          if (this.operator && (this.value || this.value === "")) {
            selector.push(this._stringFor("operator"));
            selector.push(this._stringFor("value"));
            selector.push(
              this._stringFor(
                "insensitiveFlag",
                "insensitive",
                function (attrValue, attrSpaces) {
                  if (
                    attrValue.length > 0 &&
                    !_this2.quoted &&
                    attrSpaces.before.length === 0 &&
                    !(_this2.spaces.value && _this2.spaces.value.after)
                  ) {
                    attrSpaces.before = " ";
                  }
                  return defaultAttrConcat(attrValue, attrSpaces);
                },
              ),
            );
          }
          selector.push("]");
          selector.push(this.rawSpaceAfter);
          return selector.join("");
        };
        _createClass(Attribute, [
          {
            key: "quoted",
            get: function get() {
              var qm = this.quoteMark;
              return qm === "'" || qm === '"';
            },
            set: function set(value) {
              warnOfDeprecatedQuotedAssignment();
            },
          },
          {
            key: "quoteMark",
            get: function get() {
              return this._quoteMark;
            },
            set: function set(quoteMark) {
              if (!this._constructed) {
                this._quoteMark = quoteMark;
                return;
              }
              if (this._quoteMark !== quoteMark) {
                this._quoteMark = quoteMark;
                this._syncRawValue();
              }
            },
          },
          {
            key: "qualifiedAttribute",
            get: function get() {
              return this.qualifiedName(this.raws.attribute || this.attribute);
            },
          },
          {
            key: "insensitiveFlag",
            get: function get() {
              return this.insensitive ? "i" : "";
            },
          },
          {
            key: "value",
            get: function get() {
              return this._value;
            },
            set: function set(v) {
              if (this._constructed) {
                var _unescapeValue2 = unescapeValue(v),
                  deprecatedUsage = _unescapeValue2.deprecatedUsage,
                  unescaped = _unescapeValue2.unescaped,
                  quoteMark = _unescapeValue2.quoteMark;
                if (deprecatedUsage) {
                  warnOfDeprecatedValueAssignment();
                }
                if (
                  unescaped === this._value &&
                  quoteMark === this._quoteMark
                ) {
                  return;
                }
                this._value = unescaped;
                this._quoteMark = quoteMark;
                this._syncRawValue();
              } else {
                this._value = v;
              }
            },
          },
          {
            key: "insensitive",
            get: function get() {
              return this._insensitive;
            },
            set: function set(insensitive) {
              if (!insensitive) {
                this._insensitive = false;
                if (
                  this.raws &&
                  (this.raws.insensitiveFlag === "I" ||
                    this.raws.insensitiveFlag === "i")
                ) {
                  this.raws.insensitiveFlag = undefined;
                }
              }
              this._insensitive = insensitive;
            },
          },
          {
            key: "attribute",
            get: function get() {
              return this._attribute;
            },
            set: function set(name) {
              this._handleEscapes("attribute", name);
              this._attribute = name;
            },
          },
        ]);
        return Attribute;
      })(_namespace["default"]);
      exports["default"] = Attribute;
      Attribute.NO_QUOTE = null;
      Attribute.SINGLE_QUOTE = "'";
      Attribute.DOUBLE_QUOTE = '"';
      var CSSESC_QUOTE_OPTIONS =
        ((_CSSESC_QUOTE_OPTIONS = {
          "'": { quotes: "single", wrap: true },
          '"': { quotes: "double", wrap: true },
        }),
        (_CSSESC_QUOTE_OPTIONS[null] = { isIdentifier: true }),
        _CSSESC_QUOTE_OPTIONS);
      function defaultAttrConcat(attrValue, attrSpaces) {
        return "" + attrSpaces.before + attrValue + attrSpaces.after;
      }
    },
    173: (module, exports, __nccwpck_require__) => {
      "use strict";
      exports.__esModule = true;
      exports["default"] = void 0;
      var _cssesc = _interopRequireDefault(__nccwpck_require__(1499));
      var _util = __nccwpck_require__(9236);
      var _node = _interopRequireDefault(__nccwpck_require__(756));
      var _types = __nccwpck_require__(8115);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", { writable: false });
        return Constructor;
      }
      function _inheritsLoose(subClass, superClass) {
        subClass.prototype = Object.create(superClass.prototype);
        subClass.prototype.constructor = subClass;
        _setPrototypeOf(subClass, superClass);
      }
      function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function _setPrototypeOf(o, p) {
              o.__proto__ = p;
              return o;
            };
        return _setPrototypeOf(o, p);
      }
      var ClassName = (function (_Node) {
        _inheritsLoose(ClassName, _Node);
        function ClassName(opts) {
          var _this;
          _this = _Node.call(this, opts) || this;
          _this.type = _types.CLASS;
          _this._constructed = true;
          return _this;
        }
        var _proto = ClassName.prototype;
        _proto.valueToString = function valueToString() {
          return "." + _Node.prototype.valueToString.call(this);
        };
        _createClass(ClassName, [
          {
            key: "value",
            get: function get() {
              return this._value;
            },
            set: function set(v) {
              if (this._constructed) {
                var escaped = (0, _cssesc["default"])(v, {
                  isIdentifier: true,
                });
                if (escaped !== v) {
                  (0, _util.ensureObject)(this, "raws");
                  this.raws.value = escaped;
                } else if (this.raws) {
                  delete this.raws.value;
                }
              }
              this._value = v;
            },
          },
        ]);
        return ClassName;
      })(_node["default"]);
      exports["default"] = ClassName;
      module.exports = exports.default;
    },
    3998: (module, exports, __nccwpck_require__) => {
      "use strict";
      exports.__esModule = true;
      exports["default"] = void 0;
      var _node = _interopRequireDefault(__nccwpck_require__(756));
      var _types = __nccwpck_require__(8115);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function _inheritsLoose(subClass, superClass) {
        subClass.prototype = Object.create(superClass.prototype);
        subClass.prototype.constructor = subClass;
        _setPrototypeOf(subClass, superClass);
      }
      function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function _setPrototypeOf(o, p) {
              o.__proto__ = p;
              return o;
            };
        return _setPrototypeOf(o, p);
      }
      var Combinator = (function (_Node) {
        _inheritsLoose(Combinator, _Node);
        function Combinator(opts) {
          var _this;
          _this = _Node.call(this, opts) || this;
          _this.type = _types.COMBINATOR;
          return _this;
        }
        return Combinator;
      })(_node["default"]);
      exports["default"] = Combinator;
      module.exports = exports.default;
    },
    8983: (module, exports, __nccwpck_require__) => {
      "use strict";
      exports.__esModule = true;
      exports["default"] = void 0;
      var _node = _interopRequireDefault(__nccwpck_require__(756));
      var _types = __nccwpck_require__(8115);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function _inheritsLoose(subClass, superClass) {
        subClass.prototype = Object.create(superClass.prototype);
        subClass.prototype.constructor = subClass;
        _setPrototypeOf(subClass, superClass);
      }
      function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function _setPrototypeOf(o, p) {
              o.__proto__ = p;
              return o;
            };
        return _setPrototypeOf(o, p);
      }
      var Comment = (function (_Node) {
        _inheritsLoose(Comment, _Node);
        function Comment(opts) {
          var _this;
          _this = _Node.call(this, opts) || this;
          _this.type = _types.COMMENT;
          return _this;
        }
        return Comment;
      })(_node["default"]);
      exports["default"] = Comment;
      module.exports = exports.default;
    },
    7805: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      exports.__esModule = true;
      exports.universal =
        exports.tag =
        exports.string =
        exports.selector =
        exports.root =
        exports.pseudo =
        exports.nesting =
        exports.id =
        exports.comment =
        exports.combinator =
        exports.className =
        exports.attribute =
          void 0;
      var _attribute = _interopRequireDefault(__nccwpck_require__(7966));
      var _className = _interopRequireDefault(__nccwpck_require__(173));
      var _combinator = _interopRequireDefault(__nccwpck_require__(3998));
      var _comment = _interopRequireDefault(__nccwpck_require__(8983));
      var _id = _interopRequireDefault(__nccwpck_require__(8453));
      var _nesting = _interopRequireDefault(__nccwpck_require__(8568));
      var _pseudo = _interopRequireDefault(__nccwpck_require__(7250));
      var _root = _interopRequireDefault(__nccwpck_require__(9608));
      var _selector = _interopRequireDefault(__nccwpck_require__(5297));
      var _string = _interopRequireDefault(__nccwpck_require__(4349));
      var _tag = _interopRequireDefault(__nccwpck_require__(5526));
      var _universal = _interopRequireDefault(__nccwpck_require__(815));
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var attribute = function attribute(opts) {
        return new _attribute["default"](opts);
      };
      exports.attribute = attribute;
      var className = function className(opts) {
        return new _className["default"](opts);
      };
      exports.className = className;
      var combinator = function combinator(opts) {
        return new _combinator["default"](opts);
      };
      exports.combinator = combinator;
      var comment = function comment(opts) {
        return new _comment["default"](opts);
      };
      exports.comment = comment;
      var id = function id(opts) {
        return new _id["default"](opts);
      };
      exports.id = id;
      var nesting = function nesting(opts) {
        return new _nesting["default"](opts);
      };
      exports.nesting = nesting;
      var pseudo = function pseudo(opts) {
        return new _pseudo["default"](opts);
      };
      exports.pseudo = pseudo;
      var root = function root(opts) {
        return new _root["default"](opts);
      };
      exports.root = root;
      var selector = function selector(opts) {
        return new _selector["default"](opts);
      };
      exports.selector = selector;
      var string = function string(opts) {
        return new _string["default"](opts);
      };
      exports.string = string;
      var tag = function tag(opts) {
        return new _tag["default"](opts);
      };
      exports.tag = tag;
      var universal = function universal(opts) {
        return new _universal["default"](opts);
      };
      exports.universal = universal;
    },
    2693: (module, exports, __nccwpck_require__) => {
      "use strict";
      exports.__esModule = true;
      exports["default"] = void 0;
      var _node = _interopRequireDefault(__nccwpck_require__(756));
      var types = _interopRequireWildcard(__nccwpck_require__(8115));
      function _getRequireWildcardCache(nodeInterop) {
        if (typeof WeakMap !== "function") return null;
        var cacheBabelInterop = new WeakMap();
        var cacheNodeInterop = new WeakMap();
        return (_getRequireWildcardCache = function _getRequireWildcardCache(
          nodeInterop,
        ) {
          return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
        })(nodeInterop);
      }
      function _interopRequireWildcard(obj, nodeInterop) {
        if (!nodeInterop && obj && obj.__esModule) {
          return obj;
        }
        if (
          obj === null ||
          (typeof obj !== "object" && typeof obj !== "function")
        ) {
          return { default: obj };
        }
        var cache = _getRequireWildcardCache(nodeInterop);
        if (cache && cache.has(obj)) {
          return cache.get(obj);
        }
        var newObj = {};
        var hasPropertyDescriptor =
          Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var key in obj) {
          if (
            key !== "default" &&
            Object.prototype.hasOwnProperty.call(obj, key)
          ) {
            var desc = hasPropertyDescriptor
              ? Object.getOwnPropertyDescriptor(obj, key)
              : null;
            if (desc && (desc.get || desc.set)) {
              Object.defineProperty(newObj, key, desc);
            } else {
              newObj[key] = obj[key];
            }
          }
        }
        newObj["default"] = obj;
        if (cache) {
          cache.set(obj, newObj);
        }
        return newObj;
      }
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function _createForOfIteratorHelperLoose(o, allowArrayLike) {
        var it =
          (typeof Symbol !== "undefined" && o[Symbol.iterator]) ||
          o["@@iterator"];
        if (it) return (it = it.call(o)).next.bind(it);
        if (
          Array.isArray(o) ||
          (it = _unsupportedIterableToArray(o)) ||
          (allowArrayLike && o && typeof o.length === "number")
        ) {
          if (it) o = it;
          var i = 0;
          return function () {
            if (i >= o.length) return { done: true };
            return { done: false, value: o[i++] };
          };
        }
        throw new TypeError(
          "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
        );
      }
      function _unsupportedIterableToArray(o, minLen) {
        if (!o) return;
        if (typeof o === "string") return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor) n = o.constructor.name;
        if (n === "Map" || n === "Set") return Array.from(o);
        if (
          n === "Arguments" ||
          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
        )
          return _arrayLikeToArray(o, minLen);
      }
      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length) len = arr.length;
        for (var i = 0, arr2 = new Array(len); i < len; i++) {
          arr2[i] = arr[i];
        }
        return arr2;
      }
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", { writable: false });
        return Constructor;
      }
      function _inheritsLoose(subClass, superClass) {
        subClass.prototype = Object.create(superClass.prototype);
        subClass.prototype.constructor = subClass;
        _setPrototypeOf(subClass, superClass);
      }
      function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function _setPrototypeOf(o, p) {
              o.__proto__ = p;
              return o;
            };
        return _setPrototypeOf(o, p);
      }
      var Container = (function (_Node) {
        _inheritsLoose(Container, _Node);
        function Container(opts) {
          var _this;
          _this = _Node.call(this, opts) || this;
          if (!_this.nodes) {
            _this.nodes = [];
          }
          return _this;
        }
        var _proto = Container.prototype;
        _proto.append = function append(selector) {
          selector.parent = this;
          this.nodes.push(selector);
          return this;
        };
        _proto.prepend = function prepend(selector) {
          selector.parent = this;
          this.nodes.unshift(selector);
          for (var id in this.indexes) {
            this.indexes[id]++;
          }
          return this;
        };
        _proto.at = function at(index) {
          return this.nodes[index];
        };
        _proto.index = function index(child) {
          if (typeof child === "number") {
            return child;
          }
          return this.nodes.indexOf(child);
        };
        _proto.removeChild = function removeChild(child) {
          child = this.index(child);
          this.at(child).parent = undefined;
          this.nodes.splice(child, 1);
          var index;
          for (var id in this.indexes) {
            index = this.indexes[id];
            if (index >= child) {
              this.indexes[id] = index - 1;
            }
          }
          return this;
        };
        _proto.removeAll = function removeAll() {
          for (
            var _iterator = _createForOfIteratorHelperLoose(this.nodes), _step;
            !(_step = _iterator()).done;

          ) {
            var node = _step.value;
            node.parent = undefined;
          }
          this.nodes = [];
          return this;
        };
        _proto.empty = function empty() {
          return this.removeAll();
        };
        _proto.insertAfter = function insertAfter(oldNode, newNode) {
          var _this$nodes;
          newNode.parent = this;
          var oldIndex = this.index(oldNode);
          var resetNode = [];
          for (var i = 2; i < arguments.length; i++) {
            resetNode.push(arguments[i]);
          }
          (_this$nodes = this.nodes).splice.apply(
            _this$nodes,
            [oldIndex + 1, 0, newNode].concat(resetNode),
          );
          newNode.parent = this;
          var index;
          for (var id in this.indexes) {
            index = this.indexes[id];
            if (oldIndex < index) {
              this.indexes[id] = index + arguments.length - 1;
            }
          }
          return this;
        };
        _proto.insertBefore = function insertBefore(oldNode, newNode) {
          var _this$nodes2;
          newNode.parent = this;
          var oldIndex = this.index(oldNode);
          var resetNode = [];
          for (var i = 2; i < arguments.length; i++) {
            resetNode.push(arguments[i]);
          }
          (_this$nodes2 = this.nodes).splice.apply(
            _this$nodes2,
            [oldIndex, 0, newNode].concat(resetNode),
          );
          newNode.parent = this;
          var index;
          for (var id in this.indexes) {
            index = this.indexes[id];
            if (index >= oldIndex) {
              this.indexes[id] = index + arguments.length - 1;
            }
          }
          return this;
        };
        _proto._findChildAtPosition = function _findChildAtPosition(line, col) {
          var found = undefined;
          this.each(function (node) {
            if (node.atPosition) {
              var foundChild = node.atPosition(line, col);
              if (foundChild) {
                found = foundChild;
                return false;
              }
            } else if (node.isAtPosition(line, col)) {
              found = node;
              return false;
            }
          });
          return found;
        };
        _proto.atPosition = function atPosition(line, col) {
          if (this.isAtPosition(line, col)) {
            return this._findChildAtPosition(line, col) || this;
          } else {
            return undefined;
          }
        };
        _proto._inferEndPosition = function _inferEndPosition() {
          if (this.last && this.last.source && this.last.source.end) {
            this.source = this.source || {};
            this.source.end = this.source.end || {};
            Object.assign(this.source.end, this.last.source.end);
          }
        };
        _proto.each = function each(callback) {
          if (!this.lastEach) {
            this.lastEach = 0;
          }
          if (!this.indexes) {
            this.indexes = {};
          }
          this.lastEach++;
          var id = this.lastEach;
          this.indexes[id] = 0;
          if (!this.length) {
            return undefined;
          }
          var index, result;
          while (this.indexes[id] < this.length) {
            index = this.indexes[id];
            result = callback(this.at(index), index);
            if (result === false) {
              break;
            }
            this.indexes[id] += 1;
          }
          delete this.indexes[id];
          if (result === false) {
            return false;
          }
        };
        _proto.walk = function walk(callback) {
          return this.each(function (node, i) {
            var result = callback(node, i);
            if (result !== false && node.length) {
              result = node.walk(callback);
            }
            if (result === false) {
              return false;
            }
          });
        };
        _proto.walkAttributes = function walkAttributes(callback) {
          var _this2 = this;
          return this.walk(function (selector) {
            if (selector.type === types.ATTRIBUTE) {
              return callback.call(_this2, selector);
            }
          });
        };
        _proto.walkClasses = function walkClasses(callback) {
          var _this3 = this;
          return this.walk(function (selector) {
            if (selector.type === types.CLASS) {
              return callback.call(_this3, selector);
            }
          });
        };
        _proto.walkCombinators = function walkCombinators(callback) {
          var _this4 = this;
          return this.walk(function (selector) {
            if (selector.type === types.COMBINATOR) {
              return callback.call(_this4, selector);
            }
          });
        };
        _proto.walkComments = function walkComments(callback) {
          var _this5 = this;
          return this.walk(function (selector) {
            if (selector.type === types.COMMENT) {
              return callback.call(_this5, selector);
            }
          });
        };
        _proto.walkIds = function walkIds(callback) {
          var _this6 = this;
          return this.walk(function (selector) {
            if (selector.type === types.ID) {
              return callback.call(_this6, selector);
            }
          });
        };
        _proto.walkNesting = function walkNesting(callback) {
          var _this7 = this;
          return this.walk(function (selector) {
            if (selector.type === types.NESTING) {
              return callback.call(_this7, selector);
            }
          });
        };
        _proto.walkPseudos = function walkPseudos(callback) {
          var _this8 = this;
          return this.walk(function (selector) {
            if (selector.type === types.PSEUDO) {
              return callback.call(_this8, selector);
            }
          });
        };
        _proto.walkTags = function walkTags(callback) {
          var _this9 = this;
          return this.walk(function (selector) {
            if (selector.type === types.TAG) {
              return callback.call(_this9, selector);
            }
          });
        };
        _proto.walkUniversals = function walkUniversals(callback) {
          var _this10 = this;
          return this.walk(function (selector) {
            if (selector.type === types.UNIVERSAL) {
              return callback.call(_this10, selector);
            }
          });
        };
        _proto.split = function split(callback) {
          var _this11 = this;
          var current = [];
          return this.reduce(function (memo, node, index) {
            var split = callback.call(_this11, node);
            current.push(node);
            if (split) {
              memo.push(current);
              current = [];
            } else if (index === _this11.length - 1) {
              memo.push(current);
            }
            return memo;
          }, []);
        };
        _proto.map = function map(callback) {
          return this.nodes.map(callback);
        };
        _proto.reduce = function reduce(callback, memo) {
          return this.nodes.reduce(callback, memo);
        };
        _proto.every = function every(callback) {
          return this.nodes.every(callback);
        };
        _proto.some = function some(callback) {
          return this.nodes.some(callback);
        };
        _proto.filter = function filter(callback) {
          return this.nodes.filter(callback);
        };
        _proto.sort = function sort(callback) {
          return this.nodes.sort(callback);
        };
        _proto.toString = function toString() {
          return this.map(String).join("");
        };
        _createClass(Container, [
          {
            key: "first",
            get: function get() {
              return this.at(0);
            },
          },
          {
            key: "last",
            get: function get() {
              return this.at(this.length - 1);
            },
          },
          {
            key: "length",
            get: function get() {
              return this.nodes.length;
            },
          },
        ]);
        return Container;
      })(_node["default"]);
      exports["default"] = Container;
      module.exports = exports.default;
    },
    9966: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      exports.__esModule = true;
      exports.isComment =
        exports.isCombinator =
        exports.isClassName =
        exports.isAttribute =
          void 0;
      exports.isContainer = isContainer;
      exports.isIdentifier = void 0;
      exports.isNamespace = isNamespace;
      exports.isNesting = void 0;
      exports.isNode = isNode;
      exports.isPseudo = void 0;
      exports.isPseudoClass = isPseudoClass;
      exports.isPseudoElement = isPseudoElement;
      exports.isUniversal =
        exports.isTag =
        exports.isString =
        exports.isSelector =
        exports.isRoot =
          void 0;
      var _types = __nccwpck_require__(8115);
      var _IS_TYPE;
      var IS_TYPE =
        ((_IS_TYPE = {}),
        (_IS_TYPE[_types.ATTRIBUTE] = true),
        (_IS_TYPE[_types.CLASS] = true),
        (_IS_TYPE[_types.COMBINATOR] = true),
        (_IS_TYPE[_types.COMMENT] = true),
        (_IS_TYPE[_types.ID] = true),
        (_IS_TYPE[_types.NESTING] = true),
        (_IS_TYPE[_types.PSEUDO] = true),
        (_IS_TYPE[_types.ROOT] = true),
        (_IS_TYPE[_types.SELECTOR] = true),
        (_IS_TYPE[_types.STRING] = true),
        (_IS_TYPE[_types.TAG] = true),
        (_IS_TYPE[_types.UNIVERSAL] = true),
        _IS_TYPE);
      function isNode(node) {
        return typeof node === "object" && IS_TYPE[node.type];
      }
      function isNodeType(type, node) {
        return isNode(node) && node.type === type;
      }
      var isAttribute = isNodeType.bind(null, _types.ATTRIBUTE);
      exports.isAttribute = isAttribute;
      var isClassName = isNodeType.bind(null, _types.CLASS);
      exports.isClassName = isClassName;
      var isCombinator = isNodeType.bind(null, _types.COMBINATOR);
      exports.isCombinator = isCombinator;
      var isComment = isNodeType.bind(null, _types.COMMENT);
      exports.isComment = isComment;
      var isIdentifier = isNodeType.bind(null, _types.ID);
      exports.isIdentifier = isIdentifier;
      var isNesting = isNodeType.bind(null, _types.NESTING);
      exports.isNesting = isNesting;
      var isPseudo = isNodeType.bind(null, _types.PSEUDO);
      exports.isPseudo = isPseudo;
      var isRoot = isNodeType.bind(null, _types.ROOT);
      exports.isRoot = isRoot;
      var isSelector = isNodeType.bind(null, _types.SELECTOR);
      exports.isSelector = isSelector;
      var isString = isNodeType.bind(null, _types.STRING);
      exports.isString = isString;
      var isTag = isNodeType.bind(null, _types.TAG);
      exports.isTag = isTag;
      var isUniversal = isNodeType.bind(null, _types.UNIVERSAL);
      exports.isUniversal = isUniversal;
      function isPseudoElement(node) {
        return (
          isPseudo(node) &&
          node.value &&
          (node.value.startsWith("::") ||
            node.value.toLowerCase() === ":before" ||
            node.value.toLowerCase() === ":after" ||
            node.value.toLowerCase() === ":first-letter" ||
            node.value.toLowerCase() === ":first-line")
        );
      }
      function isPseudoClass(node) {
        return isPseudo(node) && !isPseudoElement(node);
      }
      function isContainer(node) {
        return !!(isNode(node) && node.walk);
      }
      function isNamespace(node) {
        return isAttribute(node) || isTag(node);
      }
    },
    8453: (module, exports, __nccwpck_require__) => {
      "use strict";
      exports.__esModule = true;
      exports["default"] = void 0;
      var _node = _interopRequireDefault(__nccwpck_require__(756));
      var _types = __nccwpck_require__(8115);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function _inheritsLoose(subClass, superClass) {
        subClass.prototype = Object.create(superClass.prototype);
        subClass.prototype.constructor = subClass;
        _setPrototypeOf(subClass, superClass);
      }
      function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function _setPrototypeOf(o, p) {
              o.__proto__ = p;
              return o;
            };
        return _setPrototypeOf(o, p);
      }
      var ID = (function (_Node) {
        _inheritsLoose(ID, _Node);
        function ID(opts) {
          var _this;
          _this = _Node.call(this, opts) || this;
          _this.type = _types.ID;
          return _this;
        }
        var _proto = ID.prototype;
        _proto.valueToString = function valueToString() {
          return "#" + _Node.prototype.valueToString.call(this);
        };
        return ID;
      })(_node["default"]);
      exports["default"] = ID;
      module.exports = exports.default;
    },
    4062: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      exports.__esModule = true;
      var _types = __nccwpck_require__(8115);
      Object.keys(_types).forEach(function (key) {
        if (key === "default" || key === "__esModule") return;
        if (key in exports && exports[key] === _types[key]) return;
        exports[key] = _types[key];
      });
      var _constructors = __nccwpck_require__(7805);
      Object.keys(_constructors).forEach(function (key) {
        if (key === "default" || key === "__esModule") return;
        if (key in exports && exports[key] === _constructors[key]) return;
        exports[key] = _constructors[key];
      });
      var _guards = __nccwpck_require__(9966);
      Object.keys(_guards).forEach(function (key) {
        if (key === "default" || key === "__esModule") return;
        if (key in exports && exports[key] === _guards[key]) return;
        exports[key] = _guards[key];
      });
    },
    3253: (module, exports, __nccwpck_require__) => {
      "use strict";
      exports.__esModule = true;
      exports["default"] = void 0;
      var _cssesc = _interopRequireDefault(__nccwpck_require__(1499));
      var _util = __nccwpck_require__(9236);
      var _node = _interopRequireDefault(__nccwpck_require__(756));
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", { writable: false });
        return Constructor;
      }
      function _inheritsLoose(subClass, superClass) {
        subClass.prototype = Object.create(superClass.prototype);
        subClass.prototype.constructor = subClass;
        _setPrototypeOf(subClass, superClass);
      }
      function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function _setPrototypeOf(o, p) {
              o.__proto__ = p;
              return o;
            };
        return _setPrototypeOf(o, p);
      }
      var Namespace = (function (_Node) {
        _inheritsLoose(Namespace, _Node);
        function Namespace() {
          return _Node.apply(this, arguments) || this;
        }
        var _proto = Namespace.prototype;
        _proto.qualifiedName = function qualifiedName(value) {
          if (this.namespace) {
            return this.namespaceString + "|" + value;
          } else {
            return value;
          }
        };
        _proto.valueToString = function valueToString() {
          return this.qualifiedName(_Node.prototype.valueToString.call(this));
        };
        _createClass(Namespace, [
          {
            key: "namespace",
            get: function get() {
              return this._namespace;
            },
            set: function set(namespace) {
              if (
                namespace === true ||
                namespace === "*" ||
                namespace === "&"
              ) {
                this._namespace = namespace;
                if (this.raws) {
                  delete this.raws.namespace;
                }
                return;
              }
              var escaped = (0, _cssesc["default"])(namespace, {
                isIdentifier: true,
              });
              this._namespace = namespace;
              if (escaped !== namespace) {
                (0, _util.ensureObject)(this, "raws");
                this.raws.namespace = escaped;
              } else if (this.raws) {
                delete this.raws.namespace;
              }
            },
          },
          {
            key: "ns",
            get: function get() {
              return this._namespace;
            },
            set: function set(namespace) {
              this.namespace = namespace;
            },
          },
          {
            key: "namespaceString",
            get: function get() {
              if (this.namespace) {
                var ns = this.stringifyProperty("namespace");
                if (ns === true) {
                  return "";
                } else {
                  return ns;
                }
              } else {
                return "";
              }
            },
          },
        ]);
        return Namespace;
      })(_node["default"]);
      exports["default"] = Namespace;
      module.exports = exports.default;
    },
    8568: (module, exports, __nccwpck_require__) => {
      "use strict";
      exports.__esModule = true;
      exports["default"] = void 0;
      var _node = _interopRequireDefault(__nccwpck_require__(756));
      var _types = __nccwpck_require__(8115);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function _inheritsLoose(subClass, superClass) {
        subClass.prototype = Object.create(superClass.prototype);
        subClass.prototype.constructor = subClass;
        _setPrototypeOf(subClass, superClass);
      }
      function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function _setPrototypeOf(o, p) {
              o.__proto__ = p;
              return o;
            };
        return _setPrototypeOf(o, p);
      }
      var Nesting = (function (_Node) {
        _inheritsLoose(Nesting, _Node);
        function Nesting(opts) {
          var _this;
          _this = _Node.call(this, opts) || this;
          _this.type = _types.NESTING;
          _this.value = "&";
          return _this;
        }
        return Nesting;
      })(_node["default"]);
      exports["default"] = Nesting;
      module.exports = exports.default;
    },
    756: (module, exports, __nccwpck_require__) => {
      "use strict";
      exports.__esModule = true;
      exports["default"] = void 0;
      var _util = __nccwpck_require__(9236);
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", { writable: false });
        return Constructor;
      }
      var cloneNode = function cloneNode(obj, parent) {
        if (typeof obj !== "object" || obj === null) {
          return obj;
        }
        var cloned = new obj.constructor();
        for (var i in obj) {
          if (!obj.hasOwnProperty(i)) {
            continue;
          }
          var value = obj[i];
          var type = typeof value;
          if (i === "parent" && type === "object") {
            if (parent) {
              cloned[i] = parent;
            }
          } else if (value instanceof Array) {
            cloned[i] = value.map(function (j) {
              return cloneNode(j, cloned);
            });
          } else {
            cloned[i] = cloneNode(value, cloned);
          }
        }
        return cloned;
      };
      var Node = (function () {
        function Node(opts) {
          if (opts === void 0) {
            opts = {};
          }
          Object.assign(this, opts);
          this.spaces = this.spaces || {};
          this.spaces.before = this.spaces.before || "";
          this.spaces.after = this.spaces.after || "";
        }
        var _proto = Node.prototype;
        _proto.remove = function remove() {
          if (this.parent) {
            this.parent.removeChild(this);
          }
          this.parent = undefined;
          return this;
        };
        _proto.replaceWith = function replaceWith() {
          if (this.parent) {
            for (var index in arguments) {
              this.parent.insertBefore(this, arguments[index]);
            }
            this.remove();
          }
          return this;
        };
        _proto.next = function next() {
          return this.parent.at(this.parent.index(this) + 1);
        };
        _proto.prev = function prev() {
          return this.parent.at(this.parent.index(this) - 1);
        };
        _proto.clone = function clone(overrides) {
          if (overrides === void 0) {
            overrides = {};
          }
          var cloned = cloneNode(this);
          for (var name in overrides) {
            cloned[name] = overrides[name];
          }
          return cloned;
        };
        _proto.appendToPropertyAndEscape = function appendToPropertyAndEscape(
          name,
          value,
          valueEscaped,
        ) {
          if (!this.raws) {
            this.raws = {};
          }
          var originalValue = this[name];
          var originalEscaped = this.raws[name];
          this[name] = originalValue + value;
          if (originalEscaped || valueEscaped !== value) {
            this.raws[name] = (originalEscaped || originalValue) + valueEscaped;
          } else {
            delete this.raws[name];
          }
        };
        _proto.setPropertyAndEscape = function setPropertyAndEscape(
          name,
          value,
          valueEscaped,
        ) {
          if (!this.raws) {
            this.raws = {};
          }
          this[name] = value;
          this.raws[name] = valueEscaped;
        };
        _proto.setPropertyWithoutEscape = function setPropertyWithoutEscape(
          name,
          value,
        ) {
          this[name] = value;
          if (this.raws) {
            delete this.raws[name];
          }
        };
        _proto.isAtPosition = function isAtPosition(line, column) {
          if (this.source && this.source.start && this.source.end) {
            if (this.source.start.line > line) {
              return false;
            }
            if (this.source.end.line < line) {
              return false;
            }
            if (
              this.source.start.line === line &&
              this.source.start.column > column
            ) {
              return false;
            }
            if (
              this.source.end.line === line &&
              this.source.end.column < column
            ) {
              return false;
            }
            return true;
          }
          return undefined;
        };
        _proto.stringifyProperty = function stringifyProperty(name) {
          return (this.raws && this.raws[name]) || this[name];
        };
        _proto.valueToString = function valueToString() {
          return String(this.stringifyProperty("value"));
        };
        _proto.toString = function toString() {
          return [
            this.rawSpaceBefore,
            this.valueToString(),
            this.rawSpaceAfter,
          ].join("");
        };
        _createClass(Node, [
          {
            key: "rawSpaceBefore",
            get: function get() {
              var rawSpace =
                this.raws && this.raws.spaces && this.raws.spaces.before;
              if (rawSpace === undefined) {
                rawSpace = this.spaces && this.spaces.before;
              }
              return rawSpace || "";
            },
            set: function set(raw) {
              (0, _util.ensureObject)(this, "raws", "spaces");
              this.raws.spaces.before = raw;
            },
          },
          {
            key: "rawSpaceAfter",
            get: function get() {
              var rawSpace =
                this.raws && this.raws.spaces && this.raws.spaces.after;
              if (rawSpace === undefined) {
                rawSpace = this.spaces.after;
              }
              return rawSpace || "";
            },
            set: function set(raw) {
              (0, _util.ensureObject)(this, "raws", "spaces");
              this.raws.spaces.after = raw;
            },
          },
        ]);
        return Node;
      })();
      exports["default"] = Node;
      module.exports = exports.default;
    },
    7250: (module, exports, __nccwpck_require__) => {
      "use strict";
      exports.__esModule = true;
      exports["default"] = void 0;
      var _container = _interopRequireDefault(__nccwpck_require__(2693));
      var _types = __nccwpck_require__(8115);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function _inheritsLoose(subClass, superClass) {
        subClass.prototype = Object.create(superClass.prototype);
        subClass.prototype.constructor = subClass;
        _setPrototypeOf(subClass, superClass);
      }
      function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function _setPrototypeOf(o, p) {
              o.__proto__ = p;
              return o;
            };
        return _setPrototypeOf(o, p);
      }
      var Pseudo = (function (_Container) {
        _inheritsLoose(Pseudo, _Container);
        function Pseudo(opts) {
          var _this;
          _this = _Container.call(this, opts) || this;
          _this.type = _types.PSEUDO;
          return _this;
        }
        var _proto = Pseudo.prototype;
        _proto.toString = function toString() {
          var params = this.length
            ? "(" + this.map(String).join(",") + ")"
            : "";
          return [
            this.rawSpaceBefore,
            this.stringifyProperty("value"),
            params,
            this.rawSpaceAfter,
          ].join("");
        };
        return Pseudo;
      })(_container["default"]);
      exports["default"] = Pseudo;
      module.exports = exports.default;
    },
    9608: (module, exports, __nccwpck_require__) => {
      "use strict";
      exports.__esModule = true;
      exports["default"] = void 0;
      var _container = _interopRequireDefault(__nccwpck_require__(2693));
      var _types = __nccwpck_require__(8115);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", { writable: false });
        return Constructor;
      }
      function _inheritsLoose(subClass, superClass) {
        subClass.prototype = Object.create(superClass.prototype);
        subClass.prototype.constructor = subClass;
        _setPrototypeOf(subClass, superClass);
      }
      function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function _setPrototypeOf(o, p) {
              o.__proto__ = p;
              return o;
            };
        return _setPrototypeOf(o, p);
      }
      var Root = (function (_Container) {
        _inheritsLoose(Root, _Container);
        function Root(opts) {
          var _this;
          _this = _Container.call(this, opts) || this;
          _this.type = _types.ROOT;
          return _this;
        }
        var _proto = Root.prototype;
        _proto.toString = function toString() {
          var str = this.reduce(function (memo, selector) {
            memo.push(String(selector));
            return memo;
          }, []).join(",");
          return this.trailingComma ? str + "," : str;
        };
        _proto.error = function error(message, options) {
          if (this._error) {
            return this._error(message, options);
          } else {
            return new Error(message);
          }
        };
        _createClass(Root, [
          {
            key: "errorGenerator",
            set: function set(handler) {
              this._error = handler;
            },
          },
        ]);
        return Root;
      })(_container["default"]);
      exports["default"] = Root;
      module.exports = exports.default;
    },
    5297: (module, exports, __nccwpck_require__) => {
      "use strict";
      exports.__esModule = true;
      exports["default"] = void 0;
      var _container = _interopRequireDefault(__nccwpck_require__(2693));
      var _types = __nccwpck_require__(8115);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function _inheritsLoose(subClass, superClass) {
        subClass.prototype = Object.create(superClass.prototype);
        subClass.prototype.constructor = subClass;
        _setPrototypeOf(subClass, superClass);
      }
      function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function _setPrototypeOf(o, p) {
              o.__proto__ = p;
              return o;
            };
        return _setPrototypeOf(o, p);
      }
      var Selector = (function (_Container) {
        _inheritsLoose(Selector, _Container);
        function Selector(opts) {
          var _this;
          _this = _Container.call(this, opts) || this;
          _this.type = _types.SELECTOR;
          return _this;
        }
        return Selector;
      })(_container["default"]);
      exports["default"] = Selector;
      module.exports = exports.default;
    },
    4349: (module, exports, __nccwpck_require__) => {
      "use strict";
      exports.__esModule = true;
      exports["default"] = void 0;
      var _node = _interopRequireDefault(__nccwpck_require__(756));
      var _types = __nccwpck_require__(8115);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function _inheritsLoose(subClass, superClass) {
        subClass.prototype = Object.create(superClass.prototype);
        subClass.prototype.constructor = subClass;
        _setPrototypeOf(subClass, superClass);
      }
      function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function _setPrototypeOf(o, p) {
              o.__proto__ = p;
              return o;
            };
        return _setPrototypeOf(o, p);
      }
      var String = (function (_Node) {
        _inheritsLoose(String, _Node);
        function String(opts) {
          var _this;
          _this = _Node.call(this, opts) || this;
          _this.type = _types.STRING;
          return _this;
        }
        return String;
      })(_node["default"]);
      exports["default"] = String;
      module.exports = exports.default;
    },
    5526: (module, exports, __nccwpck_require__) => {
      "use strict";
      exports.__esModule = true;
      exports["default"] = void 0;
      var _namespace = _interopRequireDefault(__nccwpck_require__(3253));
      var _types = __nccwpck_require__(8115);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function _inheritsLoose(subClass, superClass) {
        subClass.prototype = Object.create(superClass.prototype);
        subClass.prototype.constructor = subClass;
        _setPrototypeOf(subClass, superClass);
      }
      function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function _setPrototypeOf(o, p) {
              o.__proto__ = p;
              return o;
            };
        return _setPrototypeOf(o, p);
      }
      var Tag = (function (_Namespace) {
        _inheritsLoose(Tag, _Namespace);
        function Tag(opts) {
          var _this;
          _this = _Namespace.call(this, opts) || this;
          _this.type = _types.TAG;
          return _this;
        }
        return Tag;
      })(_namespace["default"]);
      exports["default"] = Tag;
      module.exports = exports.default;
    },
    8115: (__unused_webpack_module, exports) => {
      "use strict";
      exports.__esModule = true;
      exports.UNIVERSAL =
        exports.TAG =
        exports.STRING =
        exports.SELECTOR =
        exports.ROOT =
        exports.PSEUDO =
        exports.NESTING =
        exports.ID =
        exports.COMMENT =
        exports.COMBINATOR =
        exports.CLASS =
        exports.ATTRIBUTE =
          void 0;
      var TAG = "tag";
      exports.TAG = TAG;
      var STRING = "string";
      exports.STRING = STRING;
      var SELECTOR = "selector";
      exports.SELECTOR = SELECTOR;
      var ROOT = "root";
      exports.ROOT = ROOT;
      var PSEUDO = "pseudo";
      exports.PSEUDO = PSEUDO;
      var NESTING = "nesting";
      exports.NESTING = NESTING;
      var ID = "id";
      exports.ID = ID;
      var COMMENT = "comment";
      exports.COMMENT = COMMENT;
      var COMBINATOR = "combinator";
      exports.COMBINATOR = COMBINATOR;
      var CLASS = "class";
      exports.CLASS = CLASS;
      var ATTRIBUTE = "attribute";
      exports.ATTRIBUTE = ATTRIBUTE;
      var UNIVERSAL = "universal";
      exports.UNIVERSAL = UNIVERSAL;
    },
    815: (module, exports, __nccwpck_require__) => {
      "use strict";
      exports.__esModule = true;
      exports["default"] = void 0;
      var _namespace = _interopRequireDefault(__nccwpck_require__(3253));
      var _types = __nccwpck_require__(8115);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function _inheritsLoose(subClass, superClass) {
        subClass.prototype = Object.create(superClass.prototype);
        subClass.prototype.constructor = subClass;
        _setPrototypeOf(subClass, superClass);
      }
      function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function _setPrototypeOf(o, p) {
              o.__proto__ = p;
              return o;
            };
        return _setPrototypeOf(o, p);
      }
      var Universal = (function (_Namespace) {
        _inheritsLoose(Universal, _Namespace);
        function Universal(opts) {
          var _this;
          _this = _Namespace.call(this, opts) || this;
          _this.type = _types.UNIVERSAL;
          _this.value = "*";
          return _this;
        }
        return Universal;
      })(_namespace["default"]);
      exports["default"] = Universal;
      module.exports = exports.default;
    },
    6713: (module, exports) => {
      "use strict";
      exports.__esModule = true;
      exports["default"] = sortAscending;
      function sortAscending(list) {
        return list.sort(function (a, b) {
          return a - b;
        });
      }
      module.exports = exports.default;
    },
    1885: (__unused_webpack_module, exports) => {
      "use strict";
      exports.__esModule = true;
      exports.word =
        exports.tilde =
        exports.tab =
        exports.str =
        exports.space =
        exports.slash =
        exports.singleQuote =
        exports.semicolon =
        exports.plus =
        exports.pipe =
        exports.openSquare =
        exports.openParenthesis =
        exports.newline =
        exports.greaterThan =
        exports.feed =
        exports.equals =
        exports.doubleQuote =
        exports.dollar =
        exports.cr =
        exports.comment =
        exports.comma =
        exports.combinator =
        exports.colon =
        exports.closeSquare =
        exports.closeParenthesis =
        exports.caret =
        exports.bang =
        exports.backslash =
        exports.at =
        exports.asterisk =
        exports.ampersand =
          void 0;
      var ampersand = 38;
      exports.ampersand = ampersand;
      var asterisk = 42;
      exports.asterisk = asterisk;
      var at = 64;
      exports.at = at;
      var comma = 44;
      exports.comma = comma;
      var colon = 58;
      exports.colon = colon;
      var semicolon = 59;
      exports.semicolon = semicolon;
      var openParenthesis = 40;
      exports.openParenthesis = openParenthesis;
      var closeParenthesis = 41;
      exports.closeParenthesis = closeParenthesis;
      var openSquare = 91;
      exports.openSquare = openSquare;
      var closeSquare = 93;
      exports.closeSquare = closeSquare;
      var dollar = 36;
      exports.dollar = dollar;
      var tilde = 126;
      exports.tilde = tilde;
      var caret = 94;
      exports.caret = caret;
      var plus = 43;
      exports.plus = plus;
      var equals = 61;
      exports.equals = equals;
      var pipe = 124;
      exports.pipe = pipe;
      var greaterThan = 62;
      exports.greaterThan = greaterThan;
      var space = 32;
      exports.space = space;
      var singleQuote = 39;
      exports.singleQuote = singleQuote;
      var doubleQuote = 34;
      exports.doubleQuote = doubleQuote;
      var slash = 47;
      exports.slash = slash;
      var bang = 33;
      exports.bang = bang;
      var backslash = 92;
      exports.backslash = backslash;
      var cr = 13;
      exports.cr = cr;
      var feed = 12;
      exports.feed = feed;
      var newline = 10;
      exports.newline = newline;
      var tab = 9;
      exports.tab = tab;
      var str = singleQuote;
      exports.str = str;
      var comment = -1;
      exports.comment = comment;
      var word = -2;
      exports.word = word;
      var combinator = -3;
      exports.combinator = combinator;
    },
    8966: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      exports.__esModule = true;
      exports.FIELDS = void 0;
      exports["default"] = tokenize;
      var t = _interopRequireWildcard(__nccwpck_require__(1885));
      var _unescapable, _wordDelimiters;
      function _getRequireWildcardCache(nodeInterop) {
        if (typeof WeakMap !== "function") return null;
        var cacheBabelInterop = new WeakMap();
        var cacheNodeInterop = new WeakMap();
        return (_getRequireWildcardCache = function _getRequireWildcardCache(
          nodeInterop,
        ) {
          return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
        })(nodeInterop);
      }
      function _interopRequireWildcard(obj, nodeInterop) {
        if (!nodeInterop && obj && obj.__esModule) {
          return obj;
        }
        if (
          obj === null ||
          (typeof obj !== "object" && typeof obj !== "function")
        ) {
          return { default: obj };
        }
        var cache = _getRequireWildcardCache(nodeInterop);
        if (cache && cache.has(obj)) {
          return cache.get(obj);
        }
        var newObj = {};
        var hasPropertyDescriptor =
          Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var key in obj) {
          if (
            key !== "default" &&
            Object.prototype.hasOwnProperty.call(obj, key)
          ) {
            var desc = hasPropertyDescriptor
              ? Object.getOwnPropertyDescriptor(obj, key)
              : null;
            if (desc && (desc.get || desc.set)) {
              Object.defineProperty(newObj, key, desc);
            } else {
              newObj[key] = obj[key];
            }
          }
        }
        newObj["default"] = obj;
        if (cache) {
          cache.set(obj, newObj);
        }
        return newObj;
      }
      var unescapable =
        ((_unescapable = {}),
        (_unescapable[t.tab] = true),
        (_unescapable[t.newline] = true),
        (_unescapable[t.cr] = true),
        (_unescapable[t.feed] = true),
        _unescapable);
      var wordDelimiters =
        ((_wordDelimiters = {}),
        (_wordDelimiters[t.space] = true),
        (_wordDelimiters[t.tab] = true),
        (_wordDelimiters[t.newline] = true),
        (_wordDelimiters[t.cr] = true),
        (_wordDelimiters[t.feed] = true),
        (_wordDelimiters[t.ampersand] = true),
        (_wordDelimiters[t.asterisk] = true),
        (_wordDelimiters[t.bang] = true),
        (_wordDelimiters[t.comma] = true),
        (_wordDelimiters[t.colon] = true),
        (_wordDelimiters[t.semicolon] = true),
        (_wordDelimiters[t.openParenthesis] = true),
        (_wordDelimiters[t.closeParenthesis] = true),
        (_wordDelimiters[t.openSquare] = true),
        (_wordDelimiters[t.closeSquare] = true),
        (_wordDelimiters[t.singleQuote] = true),
        (_wordDelimiters[t.doubleQuote] = true),
        (_wordDelimiters[t.plus] = true),
        (_wordDelimiters[t.pipe] = true),
        (_wordDelimiters[t.tilde] = true),
        (_wordDelimiters[t.greaterThan] = true),
        (_wordDelimiters[t.equals] = true),
        (_wordDelimiters[t.dollar] = true),
        (_wordDelimiters[t.caret] = true),
        (_wordDelimiters[t.slash] = true),
        _wordDelimiters);
      var hex = {};
      var hexChars = "0123456789abcdefABCDEF";
      for (var i = 0; i < hexChars.length; i++) {
        hex[hexChars.charCodeAt(i)] = true;
      }
      function consumeWord(css, start) {
        var next = start;
        var code;
        do {
          code = css.charCodeAt(next);
          if (wordDelimiters[code]) {
            return next - 1;
          } else if (code === t.backslash) {
            next = consumeEscape(css, next) + 1;
          } else {
            next++;
          }
        } while (next < css.length);
        return next - 1;
      }
      function consumeEscape(css, start) {
        var next = start;
        var code = css.charCodeAt(next + 1);
        if (unescapable[code]) {
        } else if (hex[code]) {
          var hexDigits = 0;
          do {
            next++;
            hexDigits++;
            code = css.charCodeAt(next + 1);
          } while (hex[code] && hexDigits < 6);
          if (hexDigits < 6 && code === t.space) {
            next++;
          }
        } else {
          next++;
        }
        return next;
      }
      var FIELDS = {
        TYPE: 0,
        START_LINE: 1,
        START_COL: 2,
        END_LINE: 3,
        END_COL: 4,
        START_POS: 5,
        END_POS: 6,
      };
      exports.FIELDS = FIELDS;
      function tokenize(input) {
        var tokens = [];
        var css = input.css.valueOf();
        var _css = css,
          length = _css.length;
        var offset = -1;
        var line = 1;
        var start = 0;
        var end = 0;
        var code,
          content,
          endColumn,
          endLine,
          escaped,
          escapePos,
          last,
          lines,
          next,
          nextLine,
          nextOffset,
          quote,
          tokenType;
        function unclosed(what, fix) {
          if (input.safe) {
            css += fix;
            next = css.length - 1;
          } else {
            throw input.error("Unclosed " + what, line, start - offset, start);
          }
        }
        while (start < length) {
          code = css.charCodeAt(start);
          if (code === t.newline) {
            offset = start;
            line += 1;
          }
          switch (code) {
            case t.space:
            case t.tab:
            case t.newline:
            case t.cr:
            case t.feed:
              next = start;
              do {
                next += 1;
                code = css.charCodeAt(next);
                if (code === t.newline) {
                  offset = next;
                  line += 1;
                }
              } while (
                code === t.space ||
                code === t.newline ||
                code === t.tab ||
                code === t.cr ||
                code === t.feed
              );
              tokenType = t.space;
              endLine = line;
              endColumn = next - offset - 1;
              end = next;
              break;
            case t.plus:
            case t.greaterThan:
            case t.tilde:
            case t.pipe:
              next = start;
              do {
                next += 1;
                code = css.charCodeAt(next);
              } while (
                code === t.plus ||
                code === t.greaterThan ||
                code === t.tilde ||
                code === t.pipe
              );
              tokenType = t.combinator;
              endLine = line;
              endColumn = start - offset;
              end = next;
              break;
            case t.asterisk:
            case t.ampersand:
            case t.bang:
            case t.comma:
            case t.equals:
            case t.dollar:
            case t.caret:
            case t.openSquare:
            case t.closeSquare:
            case t.colon:
            case t.semicolon:
            case t.openParenthesis:
            case t.closeParenthesis:
              next = start;
              tokenType = code;
              endLine = line;
              endColumn = start - offset;
              end = next + 1;
              break;
            case t.singleQuote:
            case t.doubleQuote:
              quote = code === t.singleQuote ? "'" : '"';
              next = start;
              do {
                escaped = false;
                next = css.indexOf(quote, next + 1);
                if (next === -1) {
                  unclosed("quote", quote);
                }
                escapePos = next;
                while (css.charCodeAt(escapePos - 1) === t.backslash) {
                  escapePos -= 1;
                  escaped = !escaped;
                }
              } while (escaped);
              tokenType = t.str;
              endLine = line;
              endColumn = start - offset;
              end = next + 1;
              break;
            default:
              if (
                code === t.slash &&
                css.charCodeAt(start + 1) === t.asterisk
              ) {
                next = css.indexOf("*/", start + 2) + 1;
                if (next === 0) {
                  unclosed("comment", "*/");
                }
                content = css.slice(start, next + 1);
                lines = content.split("\n");
                last = lines.length - 1;
                if (last > 0) {
                  nextLine = line + last;
                  nextOffset = next - lines[last].length;
                } else {
                  nextLine = line;
                  nextOffset = offset;
                }
                tokenType = t.comment;
                line = nextLine;
                endLine = nextLine;
                endColumn = next - nextOffset;
              } else if (code === t.slash) {
                next = start;
                tokenType = code;
                endLine = line;
                endColumn = start - offset;
                end = next + 1;
              } else {
                next = consumeWord(css, start);
                tokenType = t.word;
                endLine = line;
                endColumn = next - offset;
              }
              end = next + 1;
              break;
          }
          tokens.push([
            tokenType,
            line,
            start - offset,
            endLine,
            endColumn,
            start,
            end,
          ]);
          if (nextOffset) {
            offset = nextOffset;
            nextOffset = null;
          }
          start = end;
        }
        return tokens;
      }
    },
    8495: (module, exports) => {
      "use strict";
      exports.__esModule = true;
      exports["default"] = ensureObject;
      function ensureObject(obj) {
        for (
          var _len = arguments.length,
            props = new Array(_len > 1 ? _len - 1 : 0),
            _key = 1;
          _key < _len;
          _key++
        ) {
          props[_key - 1] = arguments[_key];
        }
        while (props.length > 0) {
          var prop = props.shift();
          if (!obj[prop]) {
            obj[prop] = {};
          }
          obj = obj[prop];
        }
      }
      module.exports = exports.default;
    },
    3201: (module, exports) => {
      "use strict";
      exports.__esModule = true;
      exports["default"] = getProp;
      function getProp(obj) {
        for (
          var _len = arguments.length,
            props = new Array(_len > 1 ? _len - 1 : 0),
            _key = 1;
          _key < _len;
          _key++
        ) {
          props[_key - 1] = arguments[_key];
        }
        while (props.length > 0) {
          var prop = props.shift();
          if (!obj[prop]) {
            return undefined;
          }
          obj = obj[prop];
        }
        return obj;
      }
      module.exports = exports.default;
    },
    9236: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      exports.__esModule = true;
      exports.unesc =
        exports.stripComments =
        exports.getProp =
        exports.ensureObject =
          void 0;
      var _unesc = _interopRequireDefault(__nccwpck_require__(1284));
      exports.unesc = _unesc["default"];
      var _getProp = _interopRequireDefault(__nccwpck_require__(3201));
      exports.getProp = _getProp["default"];
      var _ensureObject = _interopRequireDefault(__nccwpck_require__(8495));
      exports.ensureObject = _ensureObject["default"];
      var _stripComments = _interopRequireDefault(__nccwpck_require__(8284));
      exports.stripComments = _stripComments["default"];
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
    },
    8284: (module, exports) => {
      "use strict";
      exports.__esModule = true;
      exports["default"] = stripComments;
      function stripComments(str) {
        var s = "";
        var commentStart = str.indexOf("/*");
        var lastEnd = 0;
        while (commentStart >= 0) {
          s = s + str.slice(lastEnd, commentStart);
          var commentEnd = str.indexOf("*/", commentStart + 2);
          if (commentEnd < 0) {
            return s;
          }
          lastEnd = commentEnd + 2;
          commentStart = str.indexOf("/*", lastEnd);
        }
        s = s + str.slice(lastEnd);
        return s;
      }
      module.exports = exports.default;
    },
    1284: (module, exports) => {
      "use strict";
      exports.__esModule = true;
      exports["default"] = unesc;
      function gobbleHex(str) {
        var lower = str.toLowerCase();
        var hex = "";
        var spaceTerminated = false;
        for (var i = 0; i < 6 && lower[i] !== undefined; i++) {
          var code = lower.charCodeAt(i);
          var valid = (code >= 97 && code <= 102) || (code >= 48 && code <= 57);
          spaceTerminated = code === 32;
          if (!valid) {
            break;
          }
          hex += lower[i];
        }
        if (hex.length === 0) {
          return undefined;
        }
        var codePoint = parseInt(hex, 16);
        var isSurrogate = codePoint >= 55296 && codePoint <= 57343;
        if (isSurrogate || codePoint === 0 || codePoint > 1114111) {
          return ["�", hex.length + (spaceTerminated ? 1 : 0)];
        }
        return [
          String.fromCodePoint(codePoint),
          hex.length + (spaceTerminated ? 1 : 0),
        ];
      }
      var CONTAINS_ESCAPE = /\\/;
      function unesc(str) {
        var needToProcess = CONTAINS_ESCAPE.test(str);
        if (!needToProcess) {
          return str;
        }
        var ret = "";
        for (var i = 0; i < str.length; i++) {
          if (str[i] === "\\") {
            var gobbled = gobbleHex(str.slice(i + 1, i + 7));
            if (gobbled !== undefined) {
              ret += gobbled[0];
              i += gobbled[1];
              continue;
            }
            if (str[i + 1] === "\\") {
              ret += "\\";
              i++;
              continue;
            }
            if (str.length === i + 1) {
              ret += str[i];
            }
            continue;
          }
          ret += str[i];
        }
        return ret;
      }
      module.exports = exports.default;
    },
    2948: (module, __unused_webpack_exports, __nccwpck_require__) => {
      var parse = __nccwpck_require__(1639);
      var walk = __nccwpck_require__(8483);
      var stringify = __nccwpck_require__(169);
      function ValueParser(value) {
        if (this instanceof ValueParser) {
          this.nodes = parse(value);
          return this;
        }
        return new ValueParser(value);
      }
      ValueParser.prototype.toString = function () {
        return Array.isArray(this.nodes) ? stringify(this.nodes) : "";
      };
      ValueParser.prototype.walk = function (cb, bubble) {
        walk(this.nodes, cb, bubble);
        return this;
      };
      ValueParser.unit = __nccwpck_require__(328);
      ValueParser.walk = walk;
      ValueParser.stringify = stringify;
      module.exports = ValueParser;
    },
    1639: (module) => {
      var openParentheses = "(".charCodeAt(0);
      var closeParentheses = ")".charCodeAt(0);
      var singleQuote = "'".charCodeAt(0);
      var doubleQuote = '"'.charCodeAt(0);
      var backslash = "\\".charCodeAt(0);
      var slash = "/".charCodeAt(0);
      var comma = ",".charCodeAt(0);
      var colon = ":".charCodeAt(0);
      var star = "*".charCodeAt(0);
      var uLower = "u".charCodeAt(0);
      var uUpper = "U".charCodeAt(0);
      var plus = "+".charCodeAt(0);
      var isUnicodeRange = /^[a-f0-9?-]+$/i;
      module.exports = function (input) {
        var tokens = [];
        var value = input;
        var next,
          quote,
          prev,
          token,
          escape,
          escapePos,
          whitespacePos,
          parenthesesOpenPos;
        var pos = 0;
        var code = value.charCodeAt(pos);
        var max = value.length;
        var stack = [{ nodes: tokens }];
        var balanced = 0;
        var parent;
        var name = "";
        var before = "";
        var after = "";
        while (pos < max) {
          if (code <= 32) {
            next = pos;
            do {
              next += 1;
              code = value.charCodeAt(next);
            } while (code <= 32);
            token = value.slice(pos, next);
            prev = tokens[tokens.length - 1];
            if (code === closeParentheses && balanced) {
              after = token;
            } else if (prev && prev.type === "div") {
              prev.after = token;
              prev.sourceEndIndex += token.length;
            } else if (
              code === comma ||
              code === colon ||
              (code === slash &&
                value.charCodeAt(next + 1) !== star &&
                (!parent ||
                  (parent &&
                    parent.type === "function" &&
                    parent.value !== "calc")))
            ) {
              before = token;
            } else {
              tokens.push({
                type: "space",
                sourceIndex: pos,
                sourceEndIndex: next,
                value: token,
              });
            }
            pos = next;
          } else if (code === singleQuote || code === doubleQuote) {
            next = pos;
            quote = code === singleQuote ? "'" : '"';
            token = { type: "string", sourceIndex: pos, quote };
            do {
              escape = false;
              next = value.indexOf(quote, next + 1);
              if (~next) {
                escapePos = next;
                while (value.charCodeAt(escapePos - 1) === backslash) {
                  escapePos -= 1;
                  escape = !escape;
                }
              } else {
                value += quote;
                next = value.length - 1;
                token.unclosed = true;
              }
            } while (escape);
            token.value = value.slice(pos + 1, next);
            token.sourceEndIndex = token.unclosed ? next : next + 1;
            tokens.push(token);
            pos = next + 1;
            code = value.charCodeAt(pos);
          } else if (code === slash && value.charCodeAt(pos + 1) === star) {
            next = value.indexOf("*/", pos);
            token = {
              type: "comment",
              sourceIndex: pos,
              sourceEndIndex: next + 2,
            };
            if (next === -1) {
              token.unclosed = true;
              next = value.length;
              token.sourceEndIndex = next;
            }
            token.value = value.slice(pos + 2, next);
            tokens.push(token);
            pos = next + 2;
            code = value.charCodeAt(pos);
          } else if (
            (code === slash || code === star) &&
            parent &&
            parent.type === "function" &&
            parent.value === "calc"
          ) {
            token = value[pos];
            tokens.push({
              type: "word",
              sourceIndex: pos - before.length,
              sourceEndIndex: pos + token.length,
              value: token,
            });
            pos += 1;
            code = value.charCodeAt(pos);
          } else if (code === slash || code === comma || code === colon) {
            token = value[pos];
            tokens.push({
              type: "div",
              sourceIndex: pos - before.length,
              sourceEndIndex: pos + token.length,
              value: token,
              before,
              after: "",
            });
            before = "";
            pos += 1;
            code = value.charCodeAt(pos);
          } else if (openParentheses === code) {
            next = pos;
            do {
              next += 1;
              code = value.charCodeAt(next);
            } while (code <= 32);
            parenthesesOpenPos = pos;
            token = {
              type: "function",
              sourceIndex: pos - name.length,
              value: name,
              before: value.slice(parenthesesOpenPos + 1, next),
            };
            pos = next;
            if (
              name === "url" &&
              code !== singleQuote &&
              code !== doubleQuote
            ) {
              next -= 1;
              do {
                escape = false;
                next = value.indexOf(")", next + 1);
                if (~next) {
                  escapePos = next;
                  while (value.charCodeAt(escapePos - 1) === backslash) {
                    escapePos -= 1;
                    escape = !escape;
                  }
                } else {
                  value += ")";
                  next = value.length - 1;
                  token.unclosed = true;
                }
              } while (escape);
              whitespacePos = next;
              do {
                whitespacePos -= 1;
                code = value.charCodeAt(whitespacePos);
              } while (code <= 32);
              if (parenthesesOpenPos < whitespacePos) {
                if (pos !== whitespacePos + 1) {
                  token.nodes = [
                    {
                      type: "word",
                      sourceIndex: pos,
                      sourceEndIndex: whitespacePos + 1,
                      value: value.slice(pos, whitespacePos + 1),
                    },
                  ];
                } else {
                  token.nodes = [];
                }
                if (token.unclosed && whitespacePos + 1 !== next) {
                  token.after = "";
                  token.nodes.push({
                    type: "space",
                    sourceIndex: whitespacePos + 1,
                    sourceEndIndex: next,
                    value: value.slice(whitespacePos + 1, next),
                  });
                } else {
                  token.after = value.slice(whitespacePos + 1, next);
                  token.sourceEndIndex = next;
                }
              } else {
                token.after = "";
                token.nodes = [];
              }
              pos = next + 1;
              token.sourceEndIndex = token.unclosed ? next : pos;
              code = value.charCodeAt(pos);
              tokens.push(token);
            } else {
              balanced += 1;
              token.after = "";
              token.sourceEndIndex = pos + 1;
              tokens.push(token);
              stack.push(token);
              tokens = token.nodes = [];
              parent = token;
            }
            name = "";
          } else if (closeParentheses === code && balanced) {
            pos += 1;
            code = value.charCodeAt(pos);
            parent.after = after;
            parent.sourceEndIndex += after.length;
            after = "";
            balanced -= 1;
            stack[stack.length - 1].sourceEndIndex = pos;
            stack.pop();
            parent = stack[balanced];
            tokens = parent.nodes;
          } else {
            next = pos;
            do {
              if (code === backslash) {
                next += 1;
              }
              next += 1;
              code = value.charCodeAt(next);
            } while (
              next < max &&
              !(
                code <= 32 ||
                code === singleQuote ||
                code === doubleQuote ||
                code === comma ||
                code === colon ||
                code === slash ||
                code === openParentheses ||
                (code === star &&
                  parent &&
                  parent.type === "function" &&
                  parent.value === "calc") ||
                (code === slash &&
                  parent.type === "function" &&
                  parent.value === "calc") ||
                (code === closeParentheses && balanced)
              )
            );
            token = value.slice(pos, next);
            if (openParentheses === code) {
              name = token;
            } else if (
              (uLower === token.charCodeAt(0) ||
                uUpper === token.charCodeAt(0)) &&
              plus === token.charCodeAt(1) &&
              isUnicodeRange.test(token.slice(2))
            ) {
              tokens.push({
                type: "unicode-range",
                sourceIndex: pos,
                sourceEndIndex: next,
                value: token,
              });
            } else {
              tokens.push({
                type: "word",
                sourceIndex: pos,
                sourceEndIndex: next,
                value: token,
              });
            }
            pos = next;
          }
        }
        for (pos = stack.length - 1; pos; pos -= 1) {
          stack[pos].unclosed = true;
          stack[pos].sourceEndIndex = value.length;
        }
        return stack[0].nodes;
      };
    },
    169: (module) => {
      function stringifyNode(node, custom) {
        var type = node.type;
        var value = node.value;
        var buf;
        var customResult;
        if (custom && (customResult = custom(node)) !== undefined) {
          return customResult;
        } else if (type === "word" || type === "space") {
          return value;
        } else if (type === "string") {
          buf = node.quote || "";
          return buf + value + (node.unclosed ? "" : buf);
        } else if (type === "comment") {
          return "/*" + value + (node.unclosed ? "" : "*/");
        } else if (type === "div") {
          return (node.before || "") + value + (node.after || "");
        } else if (Array.isArray(node.nodes)) {
          buf = stringify(node.nodes, custom);
          if (type !== "function") {
            return buf;
          }
          return (
            value +
            "(" +
            (node.before || "") +
            buf +
            (node.after || "") +
            (node.unclosed ? "" : ")")
          );
        }
        return value;
      }
      function stringify(nodes, custom) {
        var result, i;
        if (Array.isArray(nodes)) {
          result = "";
          for (i = nodes.length - 1; ~i; i -= 1) {
            result = stringifyNode(nodes[i], custom) + result;
          }
          return result;
        }
        return stringifyNode(nodes, custom);
      }
      module.exports = stringify;
    },
    328: (module) => {
      var minus = "-".charCodeAt(0);
      var plus = "+".charCodeAt(0);
      var dot = ".".charCodeAt(0);
      var exp = "e".charCodeAt(0);
      var EXP = "E".charCodeAt(0);
      function likeNumber(value) {
        var code = value.charCodeAt(0);
        var nextCode;
        if (code === plus || code === minus) {
          nextCode = value.charCodeAt(1);
          if (nextCode >= 48 && nextCode <= 57) {
            return true;
          }
          var nextNextCode = value.charCodeAt(2);
          if (nextCode === dot && nextNextCode >= 48 && nextNextCode <= 57) {
            return true;
          }
          return false;
        }
        if (code === dot) {
          nextCode = value.charCodeAt(1);
          if (nextCode >= 48 && nextCode <= 57) {
            return true;
          }
          return false;
        }
        if (code >= 48 && code <= 57) {
          return true;
        }
        return false;
      }
      module.exports = function (value) {
        var pos = 0;
        var length = value.length;
        var code;
        var nextCode;
        var nextNextCode;
        if (length === 0 || !likeNumber(value)) {
          return false;
        }
        code = value.charCodeAt(pos);
        if (code === plus || code === minus) {
          pos++;
        }
        while (pos < length) {
          code = value.charCodeAt(pos);
          if (code < 48 || code > 57) {
            break;
          }
          pos += 1;
        }
        code = value.charCodeAt(pos);
        nextCode = value.charCodeAt(pos + 1);
        if (code === dot && nextCode >= 48 && nextCode <= 57) {
          pos += 2;
          while (pos < length) {
            code = value.charCodeAt(pos);
            if (code < 48 || code > 57) {
              break;
            }
            pos += 1;
          }
        }
        code = value.charCodeAt(pos);
        nextCode = value.charCodeAt(pos + 1);
        nextNextCode = value.charCodeAt(pos + 2);
        if (
          (code === exp || code === EXP) &&
          ((nextCode >= 48 && nextCode <= 57) ||
            ((nextCode === plus || nextCode === minus) &&
              nextNextCode >= 48 &&
              nextNextCode <= 57))
        ) {
          pos += nextCode === plus || nextCode === minus ? 3 : 2;
          while (pos < length) {
            code = value.charCodeAt(pos);
            if (code < 48 || code > 57) {
              break;
            }
            pos += 1;
          }
        }
        return { number: value.slice(0, pos), unit: value.slice(pos) };
      };
    },
    8483: (module) => {
      module.exports = function walk(nodes, cb, bubble) {
        var i, max, node, result;
        for (i = 0, max = nodes.length; i < max; i += 1) {
          node = nodes[i];
          if (!bubble) {
            result = cb(node, i, nodes);
          }
          if (
            result !== false &&
            node.type === "function" &&
            Array.isArray(node.nodes)
          ) {
            walk(node.nodes, cb, bubble);
          }
          if (bubble) {
            cb(node, i, nodes);
          }
        }
      };
    },
    8823: (module, __unused_webpack_exports, __nccwpck_require__) => {
      module.exports = __nccwpck_require__(9023).deprecate;
    },
    9409: (module) => {
      "use strict";
      module.exports = require("../postcss");
    },
    6928: (module) => {
      "use strict";
      module.exports = require("path");
    },
    7016: (module) => {
      "use strict";
      module.exports = require("url");
    },
    9023: (module) => {
      "use strict";
      module.exports = require("util");
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
  if (typeof __nccwpck_require__ !== "undefined")
    __nccwpck_require__.ab = __dirname + "/";
  var __webpack_exports__ = __nccwpck_require__(4076);
  module.exports = __webpack_exports__;
})();
