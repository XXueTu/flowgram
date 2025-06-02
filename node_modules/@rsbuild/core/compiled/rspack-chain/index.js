(() => {
  var __webpack_modules__ = {
    779: (module) => {
      "use strict";
      var isMergeableObject = function isMergeableObject(value) {
        return isNonNullObject(value) && !isSpecial(value);
      };
      function isNonNullObject(value) {
        return !!value && typeof value === "object";
      }
      function isSpecial(value) {
        var stringValue = Object.prototype.toString.call(value);
        return (
          stringValue === "[object RegExp]" ||
          stringValue === "[object Date]" ||
          isReactElement(value)
        );
      }
      var canUseSymbol = typeof Symbol === "function" && Symbol.for;
      var REACT_ELEMENT_TYPE = canUseSymbol
        ? Symbol.for("react.element")
        : 60103;
      function isReactElement(value) {
        return value.$$typeof === REACT_ELEMENT_TYPE;
      }
      function emptyTarget(val) {
        return Array.isArray(val) ? [] : {};
      }
      function cloneUnlessOtherwiseSpecified(value, options) {
        return options.clone !== false && options.isMergeableObject(value)
          ? deepmerge(emptyTarget(value), value, options)
          : value;
      }
      function defaultArrayMerge(target, source, options) {
        return target.concat(source).map(function (element) {
          return cloneUnlessOtherwiseSpecified(element, options);
        });
      }
      function getMergeFunction(key, options) {
        if (!options.customMerge) {
          return deepmerge;
        }
        var customMerge = options.customMerge(key);
        return typeof customMerge === "function" ? customMerge : deepmerge;
      }
      function getEnumerableOwnPropertySymbols(target) {
        return Object.getOwnPropertySymbols
          ? Object.getOwnPropertySymbols(target).filter(function (symbol) {
              return Object.propertyIsEnumerable.call(target, symbol);
            })
          : [];
      }
      function getKeys(target) {
        return Object.keys(target).concat(
          getEnumerableOwnPropertySymbols(target),
        );
      }
      function propertyIsOnObject(object, property) {
        try {
          return property in object;
        } catch (_) {
          return false;
        }
      }
      function propertyIsUnsafe(target, key) {
        return (
          propertyIsOnObject(target, key) &&
          !(
            Object.hasOwnProperty.call(target, key) &&
            Object.propertyIsEnumerable.call(target, key)
          )
        );
      }
      function mergeObject(target, source, options) {
        var destination = {};
        if (options.isMergeableObject(target)) {
          getKeys(target).forEach(function (key) {
            destination[key] = cloneUnlessOtherwiseSpecified(
              target[key],
              options,
            );
          });
        }
        getKeys(source).forEach(function (key) {
          if (propertyIsUnsafe(target, key)) {
            return;
          }
          if (
            propertyIsOnObject(target, key) &&
            options.isMergeableObject(source[key])
          ) {
            destination[key] = getMergeFunction(key, options)(
              target[key],
              source[key],
              options,
            );
          } else {
            destination[key] = cloneUnlessOtherwiseSpecified(
              source[key],
              options,
            );
          }
        });
        return destination;
      }
      function deepmerge(target, source, options) {
        options = options || {};
        options.arrayMerge = options.arrayMerge || defaultArrayMerge;
        options.isMergeableObject =
          options.isMergeableObject || isMergeableObject;
        options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;
        var sourceIsArray = Array.isArray(source);
        var targetIsArray = Array.isArray(target);
        var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;
        if (!sourceAndTargetTypesMatch) {
          return cloneUnlessOtherwiseSpecified(source, options);
        } else if (sourceIsArray) {
          return options.arrayMerge(target, source, options);
        } else {
          return mergeObject(target, source, options);
        }
      }
      deepmerge.all = function deepmergeAll(array, options) {
        if (!Array.isArray(array)) {
          throw new Error("first argument should be an array");
        }
        return array.reduce(function (prev, next) {
          return deepmerge(prev, next, options);
        }, {});
      };
      var deepmerge_1 = deepmerge;
      module.exports = deepmerge_1;
    },
    257: (__unused_webpack_module, exports) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.arrayToString = void 0;
      const arrayToString = (array, space, next) => {
        const values = array
          .map(function (value, index) {
            const result = next(value, index);
            if (result === undefined) return String(result);
            return space + result.split("\n").join(`\n${space}`);
          })
          .join(space ? ",\n" : ",");
        const eol = space && values ? "\n" : "";
        return `[${eol}${values}${eol}]`;
      };
      exports.arrayToString = arrayToString;
    },
    210: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.FunctionParser =
        exports.dedentFunction =
        exports.functionToString =
        exports.USED_METHOD_KEY =
          void 0;
      const quote_1 = __nccwpck_require__(412);
      const METHOD_NAMES_ARE_QUOTED =
        { " "() {} }[" "].toString().charAt(0) === '"';
      const FUNCTION_PREFIXES = {
        Function: "function ",
        GeneratorFunction: "function* ",
        AsyncFunction: "async function ",
        AsyncGeneratorFunction: "async function* ",
      };
      const METHOD_PREFIXES = {
        Function: "",
        GeneratorFunction: "*",
        AsyncFunction: "async ",
        AsyncGeneratorFunction: "async *",
      };
      const TOKENS_PRECEDING_REGEXPS = new Set(
        (
          "case delete else in instanceof new return throw typeof void " +
          ", ; : + - ! ~ & | ^ * / % < > ? ="
        ).split(" "),
      );
      exports.USED_METHOD_KEY = new WeakSet();
      const functionToString = (fn, space, next, key) => {
        const name = typeof key === "string" ? key : undefined;
        if (name !== undefined) exports.USED_METHOD_KEY.add(fn);
        return new FunctionParser(fn, space, next, name).stringify();
      };
      exports.functionToString = functionToString;
      function dedentFunction(fnString) {
        let found;
        for (const line of fnString.split("\n").slice(1)) {
          const m = /^[\s\t]+/.exec(line);
          if (!m) return fnString;
          const [str] = m;
          if (found === undefined) found = str;
          else if (str.length < found.length) found = str;
        }
        return found ? fnString.split(`\n${found}`).join("\n") : fnString;
      }
      exports.dedentFunction = dedentFunction;
      class FunctionParser {
        constructor(fn, indent, next, key) {
          this.fn = fn;
          this.indent = indent;
          this.next = next;
          this.key = key;
          this.pos = 0;
          this.hadKeyword = false;
          this.fnString = Function.prototype.toString.call(fn);
          this.fnType = fn.constructor.name;
          this.keyQuote = key === undefined ? "" : quote_1.quoteKey(key, next);
          this.keyPrefix =
            key === undefined ? "" : `${this.keyQuote}:${indent ? " " : ""}`;
          this.isMethodCandidate =
            key === undefined
              ? false
              : this.fn.name === "" || this.fn.name === key;
        }
        stringify() {
          const value = this.tryParse();
          if (!value) {
            return `${this.keyPrefix}void ${this.next(this.fnString)}`;
          }
          return dedentFunction(value);
        }
        getPrefix() {
          if (this.isMethodCandidate && !this.hadKeyword) {
            return METHOD_PREFIXES[this.fnType] + this.keyQuote;
          }
          return this.keyPrefix + FUNCTION_PREFIXES[this.fnType];
        }
        tryParse() {
          if (this.fnString[this.fnString.length - 1] !== "}") {
            return this.keyPrefix + this.fnString;
          }
          if (this.fn.name) {
            const result = this.tryStrippingName();
            if (result) return result;
          }
          const prevPos = this.pos;
          if (this.consumeSyntax() === "class") return this.fnString;
          this.pos = prevPos;
          if (this.tryParsePrefixTokens()) {
            const result = this.tryStrippingName();
            if (result) return result;
            let offset = this.pos;
            switch (this.consumeSyntax("WORD_LIKE")) {
              case "WORD_LIKE":
                if (this.isMethodCandidate && !this.hadKeyword) {
                  offset = this.pos;
                }
              case "()":
                if (this.fnString.substr(this.pos, 2) === "=>") {
                  return this.keyPrefix + this.fnString;
                }
                this.pos = offset;
              case '"':
              case "'":
              case "[]":
                return this.getPrefix() + this.fnString.substr(this.pos);
            }
          }
        }
        tryStrippingName() {
          if (METHOD_NAMES_ARE_QUOTED) {
            return;
          }
          let start = this.pos;
          const prefix = this.fnString.substr(this.pos, this.fn.name.length);
          if (prefix === this.fn.name) {
            this.pos += prefix.length;
            if (
              this.consumeSyntax() === "()" &&
              this.consumeSyntax() === "{}" &&
              this.pos === this.fnString.length
            ) {
              if (
                this.isMethodCandidate ||
                !quote_1.isValidVariableName(prefix)
              ) {
                start += prefix.length;
              }
              return this.getPrefix() + this.fnString.substr(start);
            }
          }
          this.pos = start;
        }
        tryParsePrefixTokens() {
          let posPrev = this.pos;
          this.hadKeyword = false;
          switch (this.fnType) {
            case "AsyncFunction":
              if (this.consumeSyntax() !== "async") return false;
              posPrev = this.pos;
            case "Function":
              if (this.consumeSyntax() === "function") {
                this.hadKeyword = true;
              } else {
                this.pos = posPrev;
              }
              return true;
            case "AsyncGeneratorFunction":
              if (this.consumeSyntax() !== "async") return false;
            case "GeneratorFunction":
              let token = this.consumeSyntax();
              if (token === "function") {
                token = this.consumeSyntax();
                this.hadKeyword = true;
              }
              return token === "*";
          }
        }
        consumeSyntax(wordLikeToken) {
          const m = this.consumeMatch(
            /^(?:([A-Za-z_0-9$\xA0-\uFFFF]+)|=>|\+\+|\-\-|.)/,
          );
          if (!m) return;
          const [token, match] = m;
          this.consumeWhitespace();
          if (match) return wordLikeToken || match;
          switch (token) {
            case "(":
              return this.consumeSyntaxUntil("(", ")");
            case "[":
              return this.consumeSyntaxUntil("[", "]");
            case "{":
              return this.consumeSyntaxUntil("{", "}");
            case "`":
              return this.consumeTemplate();
            case '"':
              return this.consumeRegExp(/^(?:[^\\"]|\\.)*"/, '"');
            case "'":
              return this.consumeRegExp(/^(?:[^\\']|\\.)*'/, "'");
          }
          return token;
        }
        consumeSyntaxUntil(startToken, endToken) {
          let isRegExpAllowed = true;
          for (;;) {
            const token = this.consumeSyntax();
            if (token === endToken) return startToken + endToken;
            if (!token || token === ")" || token === "]" || token === "}")
              return;
            if (
              token === "/" &&
              isRegExpAllowed &&
              this.consumeMatch(
                /^(?:\\.|[^\\\/\n[]|\[(?:\\.|[^\]])*\])+\/[a-z]*/,
              )
            ) {
              isRegExpAllowed = false;
              this.consumeWhitespace();
            } else {
              isRegExpAllowed = TOKENS_PRECEDING_REGEXPS.has(token);
            }
          }
        }
        consumeMatch(re) {
          const m = re.exec(this.fnString.substr(this.pos));
          if (m) this.pos += m[0].length;
          return m;
        }
        consumeRegExp(re, token) {
          const m = re.exec(this.fnString.substr(this.pos));
          if (!m) return;
          this.pos += m[0].length;
          this.consumeWhitespace();
          return token;
        }
        consumeTemplate() {
          for (;;) {
            this.consumeMatch(/^(?:[^`$\\]|\\.|\$(?!{))*/);
            if (this.fnString[this.pos] === "`") {
              this.pos++;
              this.consumeWhitespace();
              return "`";
            }
            if (this.fnString.substr(this.pos, 2) === "${") {
              this.pos += 2;
              this.consumeWhitespace();
              if (this.consumeSyntaxUntil("{", "}")) continue;
            }
            return;
          }
        }
        consumeWhitespace() {
          this.consumeMatch(/^(?:\s|\/\/.*|\/\*[^]*?\*\/)*/);
        }
      }
      exports.FunctionParser = FunctionParser;
    },
    824: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.stringify = void 0;
      const stringify_1 = __nccwpck_require__(421);
      const quote_1 = __nccwpck_require__(412);
      const ROOT_SENTINEL = Symbol("root");
      function stringify(value, replacer, indent, options = {}) {
        const space =
          typeof indent === "string" ? indent : " ".repeat(indent || 0);
        const path = [];
        const stack = new Set();
        const tracking = new Map();
        const unpack = new Map();
        let valueCount = 0;
        const {
          maxDepth = 100,
          references = false,
          skipUndefinedProperties = false,
          maxValues = 1e5,
        } = options;
        const valueToString = replacerToString(replacer);
        const onNext = (value, key) => {
          if (++valueCount > maxValues) return;
          if (skipUndefinedProperties && value === undefined) return;
          if (path.length > maxDepth) return;
          if (key === undefined)
            return valueToString(value, space, onNext, key);
          path.push(key);
          const result = builder(
            value,
            key === ROOT_SENTINEL ? undefined : key,
          );
          path.pop();
          return result;
        };
        const builder = references
          ? (value, key) => {
              if (
                value !== null &&
                (typeof value === "object" ||
                  typeof value === "function" ||
                  typeof value === "symbol")
              ) {
                if (tracking.has(value)) {
                  unpack.set(path.slice(1), tracking.get(value));
                  return valueToString(undefined, space, onNext, key);
                }
                tracking.set(value, path.slice(1));
              }
              return valueToString(value, space, onNext, key);
            }
          : (value, key) => {
              if (stack.has(value)) return;
              stack.add(value);
              const result = valueToString(value, space, onNext, key);
              stack.delete(value);
              return result;
            };
        const result = onNext(value, ROOT_SENTINEL);
        if (unpack.size) {
          const sp = space ? " " : "";
          const eol = space ? "\n" : "";
          let wrapper = `var x${sp}=${sp}${result};${eol}`;
          for (const [key, value] of unpack.entries()) {
            const keyPath = quote_1.stringifyPath(key, onNext);
            const valuePath = quote_1.stringifyPath(value, onNext);
            wrapper += `x${keyPath}${sp}=${sp}x${valuePath};${eol}`;
          }
          return `(function${sp}()${sp}{${eol}${wrapper}return x;${eol}}())`;
        }
        return result;
      }
      exports.stringify = stringify;
      function replacerToString(replacer) {
        if (!replacer) return stringify_1.toString;
        return (value, space, next, key) =>
          replacer(
            value,
            space,
            (value) => stringify_1.toString(value, space, next, key),
            key,
          );
      }
    },
    973: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.objectToString = void 0;
      const quote_1 = __nccwpck_require__(412);
      const function_1 = __nccwpck_require__(210);
      const array_1 = __nccwpck_require__(257);
      const objectToString = (value, space, next, key) => {
        if (typeof Buffer === "function" && Buffer.isBuffer(value)) {
          return `Buffer.from(${next(value.toString("base64"))}, 'base64')`;
        }
        if (typeof global === "object" && value === global) {
          return globalToString(value, space, next, key);
        }
        const toString = OBJECT_TYPES[Object.prototype.toString.call(value)];
        return toString ? toString(value, space, next, key) : undefined;
      };
      exports.objectToString = objectToString;
      const rawObjectToString = (obj, indent, next, key) => {
        const eol = indent ? "\n" : "";
        const space = indent ? " " : "";
        const values = Object.keys(obj)
          .reduce(function (values, key) {
            const fn = obj[key];
            const result = next(fn, key);
            if (result === undefined) return values;
            const value = result.split("\n").join(`\n${indent}`);
            if (function_1.USED_METHOD_KEY.has(fn)) {
              values.push(`${indent}${value}`);
              return values;
            }
            values.push(
              `${indent}${quote_1.quoteKey(key, next)}:${space}${value}`,
            );
            return values;
          }, [])
          .join(`,${eol}`);
        if (values === "") return "{}";
        return `{${eol}${values}${eol}}`;
      };
      const globalToString = (value, space, next) =>
        `Function(${next("return this")})()`;
      const OBJECT_TYPES = {
        "[object Array]": array_1.arrayToString,
        "[object Object]": rawObjectToString,
        "[object Error]": (error, space, next) =>
          `new Error(${next(error.message)})`,
        "[object Date]": (date) => `new Date(${date.getTime()})`,
        "[object String]": (str, space, next) =>
          `new String(${next(str.toString())})`,
        "[object Number]": (num) => `new Number(${num})`,
        "[object Boolean]": (bool) => `new Boolean(${bool})`,
        "[object Set]": (set, space, next) =>
          `new Set(${next(Array.from(set))})`,
        "[object Map]": (map, space, next) =>
          `new Map(${next(Array.from(map))})`,
        "[object RegExp]": String,
        "[object global]": globalToString,
        "[object Window]": globalToString,
      };
    },
    412: (__unused_webpack_module, exports) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.stringifyPath =
        exports.quoteKey =
        exports.isValidVariableName =
        exports.IS_VALID_IDENTIFIER =
        exports.quoteString =
          void 0;
      const ESCAPABLE =
        /[\\\'\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
      const META_CHARS = new Map([
        ["\b", "\\b"],
        ["\t", "\\t"],
        ["\n", "\\n"],
        ["\f", "\\f"],
        ["\r", "\\r"],
        ["'", "\\'"],
        ['"', '\\"'],
        ["\\", "\\\\"],
      ]);
      function escapeChar(char) {
        return (
          META_CHARS.get(char) ||
          `\\u${`0000${char.charCodeAt(0).toString(16)}`.slice(-4)}`
        );
      }
      function quoteString(str) {
        return `'${str.replace(ESCAPABLE, escapeChar)}'`;
      }
      exports.quoteString = quoteString;
      const RESERVED_WORDS = new Set(
        (
          "break else new var case finally return void catch for switch while " +
          "continue function this with default if throw delete in try " +
          "do instanceof typeof abstract enum int short boolean export " +
          "interface static byte extends long super char final native synchronized " +
          "class float package throws const goto private transient debugger " +
          "implements protected volatile double import public let yield"
        ).split(" "),
      );
      exports.IS_VALID_IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
      function isValidVariableName(name) {
        return (
          typeof name === "string" &&
          !RESERVED_WORDS.has(name) &&
          exports.IS_VALID_IDENTIFIER.test(name)
        );
      }
      exports.isValidVariableName = isValidVariableName;
      function quoteKey(key, next) {
        return isValidVariableName(key) ? key : next(key);
      }
      exports.quoteKey = quoteKey;
      function stringifyPath(path, next) {
        let result = "";
        for (const key of path) {
          if (isValidVariableName(key)) {
            result += `.${key}`;
          } else {
            result += `[${next(key)}]`;
          }
        }
        return result;
      }
      exports.stringifyPath = stringifyPath;
    },
    421: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.toString = void 0;
      const quote_1 = __nccwpck_require__(412);
      const object_1 = __nccwpck_require__(973);
      const function_1 = __nccwpck_require__(210);
      const PRIMITIVE_TYPES = {
        string: quote_1.quoteString,
        number: (value) => (Object.is(value, -0) ? "-0" : String(value)),
        boolean: String,
        symbol: (value, space, next) => {
          const key = Symbol.keyFor(value);
          if (key !== undefined) return `Symbol.for(${next(key)})`;
          return `Symbol(${next(value.description)})`;
        },
        bigint: (value, space, next) => `BigInt(${next(String(value))})`,
        undefined: String,
        object: object_1.objectToString,
        function: function_1.functionToString,
      };
      const toString = (value, space, next, key) => {
        if (value === null) return "null";
        return PRIMITIVE_TYPES[typeof value](value, space, next, key);
      };
      exports.toString = toString;
    },
    676: (module) => {
      module.exports = class extends Function {
        constructor() {
          super();
          return new Proxy(this, {
            apply: (target, thisArg, args) => target.classCall(...args),
          });
        }
        classCall() {
          throw new Error("not implemented");
        }
      };
    },
    446: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const createMap = __nccwpck_require__(635);
      const createChainable = __nccwpck_require__(912);
      module.exports = createMap(createChainable(Object));
    },
    572: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const createSet = __nccwpck_require__(453);
      const createChainable = __nccwpck_require__(912);
      module.exports = createSet(createChainable(Object));
    },
    663: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const Callable = __nccwpck_require__(676);
      const createMap = __nccwpck_require__(635);
      const createChainable = __nccwpck_require__(912);
      const createValue = __nccwpck_require__(776);
      module.exports = createValue(createMap(createChainable(Callable)));
    },
    842: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const ChainedMap = __nccwpck_require__(446);
      const ChainedValueMap = __nccwpck_require__(663);
      const ChainedSet = __nccwpck_require__(572);
      const Resolve = __nccwpck_require__(318);
      const ResolveLoader = __nccwpck_require__(981);
      const Output = __nccwpck_require__(113);
      const DevServer = __nccwpck_require__(670);
      const Plugin = __nccwpck_require__(271);
      const Module = __nccwpck_require__(972);
      const Optimization = __nccwpck_require__(117);
      const Performance = __nccwpck_require__(212);
      const castArray = (value) => (Array.isArray(value) ? value : [value]);
      const toEntryObject = (entryPoints) => {
        const entry = Object.keys(entryPoints).reduce(
          (acc, key) =>
            Object.assign(acc, { [key]: entryPoints[key].values() }),
          {},
        );
        const formattedEntry = {};
        for (const [entryName, entryValue] of Object.entries(entry)) {
          const entryImport = [];
          let entryDescription = null;
          for (const item of castArray(entryValue)) {
            if (typeof item === "string") {
              entryImport.push(item);
              continue;
            }
            if (item.import) {
              entryImport.push(...castArray(item.import));
            }
            if (entryDescription) {
              Object.assign(entryDescription, item);
            } else {
              entryDescription = item;
            }
          }
          formattedEntry[entryName] = entryDescription
            ? { ...entryDescription, import: entryImport }
            : entryImport;
        }
        return formattedEntry;
      };
      module.exports = class extends ChainedMap {
        constructor() {
          super();
          this.entryPoints = new ChainedMap(this);
          this.output = new Output(this);
          this.module = new Module(this);
          this.resolve = new Resolve(this);
          this.resolveLoader = new ResolveLoader(this);
          this.optimization = new Optimization(this);
          this.plugins = new ChainedMap(this);
          this.devServer = new DevServer(this);
          this.performance = new Performance(this);
          this.node = new ChainedValueMap(this);
          this.extend([
            "context",
            "mode",
            "devtool",
            "target",
            "watch",
            "watchOptions",
            "externals",
            "externalsType",
            "externalsPresets",
            "stats",
            "experiments",
            "amd",
            "bail",
            "cache",
            "dependencies",
            "ignoreWarnings",
            "loader",
            "parallelism",
            "profile",
            "recordsPath",
            "recordsInputPath",
            "recordsOutputPath",
            "name",
            "infrastructureLogging",
            "snapshot",
          ]);
        }
        static toString(
          config,
          { verbose = false, configPrefix = "config" } = {},
        ) {
          const { stringify } = __nccwpck_require__(824);
          return stringify(
            config,
            (value, indent, stringify) => {
              if (value && value.__pluginName) {
                const prefix = `/* ${configPrefix}.${value.__pluginType}('${value.__pluginName}') */\n`;
                const constructorExpression = value.__pluginPath
                  ? `(require(${stringify(value.__pluginPath)}))`
                  : value.__pluginConstructorName;
                if (constructorExpression) {
                  const args = stringify(value.__pluginArgs).slice(1, -1);
                  return `${prefix}new ${constructorExpression}(${args})`;
                }
                return (
                  prefix +
                  stringify(
                    value.__pluginArgs && value.__pluginArgs.length
                      ? { args: value.__pluginArgs }
                      : {},
                  )
                );
              }
              if (value && value.__ruleNames) {
                const ruleTypes = value.__ruleTypes;
                const prefix = `/* ${configPrefix}.module${value.__ruleNames.map((r, index) => `.${ruleTypes ? ruleTypes[index] : "rule"}('${r}')`).join("")}${value.__useName ? `.use('${value.__useName}')` : ``} */\n`;
                return prefix + stringify(value);
              }
              if (value && value.__expression) {
                return value.__expression;
              }
              if (typeof value === "function") {
                if (!verbose && value.toString().length > 100) {
                  return `function () { /* omitted long function */ }`;
                }
              }
              return stringify(value);
            },
            2,
          );
        }
        entry(name) {
          return this.entryPoints.getOrCompute(
            name,
            () => new ChainedSet(this),
          );
        }
        plugin(name) {
          return this.plugins.getOrCompute(name, () => new Plugin(this, name));
        }
        toConfig() {
          const entryPoints = this.entryPoints.entries() || {};
          const baseConfig = this.entries() || {};
          return this.clean(
            Object.assign(baseConfig, {
              node: this.node.entries(),
              output: this.output.entries(),
              resolve: this.resolve.toConfig(),
              resolveLoader: this.resolveLoader.toConfig(),
              devServer: this.devServer.toConfig(),
              module: this.module.toConfig(),
              optimization: this.optimization.toConfig(),
              plugins: this.plugins.values().map((plugin) => plugin.toConfig()),
              performance: this.performance.entries(),
              entry: toEntryObject(entryPoints),
            }),
          );
        }
        toString(options) {
          return module.exports.toString(this.toConfig(), options);
        }
        merge(obj = {}, omit = []) {
          const omissions = [
            "node",
            "output",
            "resolve",
            "resolveLoader",
            "devServer",
            "optimization",
            "performance",
            "module",
          ];
          if (!omit.includes("entry") && "entry" in obj) {
            Object.keys(obj.entry).forEach((name) =>
              this.entry(name).merge([].concat(obj.entry[name])),
            );
          }
          if (!omit.includes("plugin") && "plugin" in obj) {
            Object.keys(obj.plugin).forEach((name) =>
              this.plugin(name).merge(obj.plugin[name]),
            );
          }
          omissions.forEach((key) => {
            if (!omit.includes(key) && key in obj) {
              this[key].merge(obj[key]);
            }
          });
          return super.merge(obj, [...omit, ...omissions, "entry", "plugin"]);
        }
      };
    },
    670: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const ChainedMap = __nccwpck_require__(446);
      const ChainedSet = __nccwpck_require__(572);
      module.exports = class extends ChainedMap {
        constructor(parent) {
          super(parent);
          this.allowedHosts = new ChainedSet(this);
          this.extend([
            "after",
            "before",
            "bonjour",
            "clientLogLevel",
            "compress",
            "contentBase",
            "contentBasePublicPath",
            "disableHostCheck",
            "filename",
            "headers",
            "historyApiFallback",
            "host",
            "hot",
            "hotOnly",
            "http2",
            "https",
            "index",
            "injectClient",
            "injectHot",
            "inline",
            "lazy",
            "liveReload",
            "mimeTypes",
            "noInfo",
            "onListening",
            "open",
            "openPage",
            "overlay",
            "pfx",
            "pfxPassphrase",
            "port",
            "proxy",
            "progress",
            "public",
            "publicPath",
            "quiet",
            "serveIndex",
            "setup",
            "socket",
            "sockHost",
            "sockPath",
            "sockPort",
            "staticOptions",
            "stats",
            "stdin",
            "transportMode",
            "useLocalIp",
            "watchContentBase",
            "watchOptions",
            "writeToDisk",
          ]);
        }
        toConfig() {
          return this.clean({
            allowedHosts: this.allowedHosts.values(),
            ...(this.entries() || {}),
          });
        }
        merge(obj, omit = []) {
          if (!omit.includes("allowedHosts") && "allowedHosts" in obj) {
            this.allowedHosts.merge(obj.allowedHosts);
          }
          return super.merge(obj, ["allowedHosts"]);
        }
      };
    },
    972: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const ChainedMap = __nccwpck_require__(446);
      const Rule = __nccwpck_require__(478);
      module.exports = class extends ChainedMap {
        constructor(parent) {
          super(parent);
          this.rules = new ChainedMap(this);
          this.defaultRules = new ChainedMap(this);
          this.generator = new ChainedMap(this);
          this.parser = new ChainedMap(this);
          this.extend([
            "noParse",
            "unsafeCache",
            "wrappedContextCritical",
            "exprContextRegExp",
            "wrappedContextRecursive",
            "strictExportPresence",
            "wrappedContextRegExp",
          ]);
        }
        defaultRule(name) {
          return this.defaultRules.getOrCompute(
            name,
            () => new Rule(this, name, "defaultRule"),
          );
        }
        rule(name) {
          return this.rules.getOrCompute(
            name,
            () => new Rule(this, name, "rule"),
          );
        }
        toConfig() {
          return this.clean(
            Object.assign(this.entries() || {}, {
              defaultRules: this.defaultRules.values().map((r) => r.toConfig()),
              generator: this.generator.entries(),
              parser: this.parser.entries(),
              rules: this.rules.values().map((r) => r.toConfig()),
            }),
          );
        }
        merge(obj, omit = []) {
          if (!omit.includes("rule") && "rule" in obj) {
            Object.keys(obj.rule).forEach((name) =>
              this.rule(name).merge(obj.rule[name]),
            );
          }
          if (!omit.includes("defaultRule") && "defaultRule" in obj) {
            Object.keys(obj.defaultRule).forEach((name) =>
              this.defaultRule(name).merge(obj.defaultRule[name]),
            );
          }
          return super.merge(obj, ["rule", "defaultRule"]);
        }
      };
    },
    117: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const ChainedMap = __nccwpck_require__(446);
      const ChainedValueMap = __nccwpck_require__(663);
      const Plugin = __nccwpck_require__(271);
      module.exports = class extends ChainedMap {
        constructor(parent) {
          super(parent);
          this.minimizers = new ChainedMap(this);
          this.splitChunks = new ChainedValueMap(this);
          this.extend([
            "minimize",
            "runtimeChunk",
            "emitOnErrors",
            "moduleIds",
            "chunkIds",
            "nodeEnv",
            "mangleWasmImports",
            "removeAvailableModules",
            "removeEmptyChunks",
            "mergeDuplicateChunks",
            "flagIncludedChunks",
            "providedExports",
            "usedExports",
            "concatenateModules",
            "sideEffects",
            "portableRecords",
            "mangleExports",
            "innerGraph",
            "realContentHash",
            "avoidEntryIife",
          ]);
        }
        minimizer(name) {
          if (Array.isArray(name)) {
            throw new Error(
              "optimization.minimizer() no longer supports being passed an array. " +
                "Either switch to the new syntax (https://github.com/neutrinojs/webpack-chain#config-optimization-minimizers-adding) or downgrade to webpack-chain 4. " +
                "If using Vue this likely means a Vue plugin has not yet been updated to support Vue CLI 4+.",
            );
          }
          return this.minimizers.getOrCompute(
            name,
            () => new Plugin(this, name, "optimization.minimizer"),
          );
        }
        toConfig() {
          return this.clean(
            Object.assign(this.entries() || {}, {
              splitChunks: this.splitChunks.entries(),
              minimizer: this.minimizers
                .values()
                .map((plugin) => plugin.toConfig()),
            }),
          );
        }
        merge(obj, omit = []) {
          if (!omit.includes("minimizer") && "minimizer" in obj) {
            Object.keys(obj.minimizer).forEach((name) =>
              this.minimizer(name).merge(obj.minimizer[name]),
            );
          }
          return super.merge(obj, [...omit, "minimizer"]);
        }
      };
    },
    102: (module) => {
      module.exports = (Class) =>
        class extends Class {
          before(name) {
            if (this.__after) {
              throw new Error(
                `Unable to set .before(${JSON.stringify(name)}) with existing value for .after()`,
              );
            }
            this.__before = name;
            return this;
          }
          after(name) {
            if (this.__before) {
              throw new Error(
                `Unable to set .after(${JSON.stringify(name)}) with existing value for .before()`,
              );
            }
            this.__after = name;
            return this;
          }
          merge(obj, omit = []) {
            if (obj.before) {
              this.before(obj.before);
            }
            if (obj.after) {
              this.after(obj.after);
            }
            return super.merge(obj, [...omit, "before", "after"]);
          }
        };
    },
    113: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const ChainedMap = __nccwpck_require__(446);
      module.exports = class extends ChainedMap {
        constructor(parent) {
          super(parent);
          this.extend([
            "auxiliaryComment",
            "charset",
            "chunkFilename",
            "chunkLoadTimeout",
            "chunkLoadingGlobal",
            "chunkLoading",
            "chunkFormat",
            "enabledChunkLoadingTypes",
            "crossOriginLoading",
            "devtoolFallbackModuleFilenameTemplate",
            "devtoolModuleFilenameTemplate",
            "devtoolNamespace",
            "filename",
            "assetModuleFilename",
            "globalObject",
            "uniqueName",
            "hashDigest",
            "hashDigestLength",
            "hashFunction",
            "hashSalt",
            "hotUpdateChunkFilename",
            "hotUpdateGlobal",
            "hotUpdateMainFilename",
            "library",
            "libraryExport",
            "libraryTarget",
            "importFunctionName",
            "path",
            "pathinfo",
            "publicPath",
            "scriptType",
            "sourceMapFilename",
            "sourcePrefix",
            "strictModuleErrorHandling",
            "strictModuleExceptionHandling",
            "umdNamedDefine",
            "workerChunkLoading",
            "enabledLibraryTypes",
            "environment",
            "compareBeforeEmit",
            "wasmLoading",
            "webassemblyModuleFilename",
            "enabledWasmLoadingTypes",
            "iife",
            "module",
            "clean",
          ]);
        }
      };
    },
    212: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const ChainedValueMap = __nccwpck_require__(663);
      module.exports = class extends ChainedValueMap {
        constructor(parent) {
          super(parent);
          this.extend([
            "assetFilter",
            "hints",
            "maxAssetSize",
            "maxEntrypointSize",
          ]);
        }
      };
    },
    271: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const ChainedMap = __nccwpck_require__(446);
      const Orderable = __nccwpck_require__(102);
      module.exports = Orderable(
        class extends ChainedMap {
          constructor(parent, name, type = "plugin") {
            super(parent);
            this.name = name;
            this.type = type;
            this.extend(["init"]);
            this.init((Plugin, args = []) => {
              if (typeof Plugin === "function") {
                return new Plugin(...args);
              }
              return Plugin;
            });
          }
          use(plugin, args = []) {
            return this.set("plugin", plugin).set("args", args);
          }
          tap(f) {
            if (!this.has("plugin")) {
              throw new Error(
                `Cannot call .tap() on a plugin that has not yet been defined. Call ${this.type}('${this.name}').use(<Plugin>) first.`,
              );
            }
            this.set("args", f(this.get("args") || []));
            return this;
          }
          set(key, value) {
            if (key === "args" && !Array.isArray(value)) {
              throw new Error("args must be an array of arguments");
            }
            return super.set(key, value);
          }
          merge(obj, omit = []) {
            if ("plugin" in obj) {
              this.set("plugin", obj.plugin);
            }
            if ("args" in obj) {
              this.set("args", obj.args);
            }
            return super.merge(obj, [...omit, "args", "plugin"]);
          }
          toConfig() {
            const init = this.get("init");
            let plugin = this.get("plugin");
            const args = this.get("args");
            let pluginPath = null;
            if (plugin === undefined) {
              throw new Error(
                `Invalid ${this.type} configuration: ${this.type}('${this.name}').use(<Plugin>) was not called to specify the plugin`,
              );
            }
            if (typeof plugin === "string") {
              pluginPath = plugin;
              plugin = __nccwpck_require__(563)(pluginPath);
            }
            const constructorName = plugin.__expression
              ? `(${plugin.__expression})`
              : plugin.name;
            const config = init(plugin, args);
            Object.defineProperties(config, {
              __pluginName: { value: this.name },
              __pluginType: { value: this.type },
              __pluginArgs: { value: args },
              __pluginConstructorName: { value: constructorName },
              __pluginPath: { value: pluginPath },
            });
            return config;
          }
        },
      );
    },
    318: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const ChainedMap = __nccwpck_require__(446);
      const ChainedSet = __nccwpck_require__(572);
      const Plugin = __nccwpck_require__(271);
      const childMaps = ["alias", "fallback", "byDependency", "extensionAlias"];
      const childSets = [
        "aliasFields",
        "conditionNames",
        "descriptionFiles",
        "extensions",
        "mainFields",
        "mainFiles",
        "exportsFields",
        "importsFields",
        "restrictions",
        "roots",
        "modules",
      ];
      module.exports = class extends ChainedMap {
        constructor(parent) {
          super(parent);
          childMaps.forEach((key) => {
            this[key] = new ChainedMap(this);
          });
          childSets.forEach((key) => {
            this[key] = new ChainedSet(this);
          });
          this.plugins = new ChainedMap(this);
          this.extend([
            "cachePredicate",
            "cacheWithContext",
            "enforceExtension",
            "symlinks",
            "unsafeCache",
            "preferRelative",
            "preferAbsolute",
            "tsConfig",
          ]);
        }
        plugin(name) {
          return this.plugins.getOrCompute(
            name,
            () => new Plugin(this, name, "resolve.plugin"),
          );
        }
        get(key) {
          if (childMaps.includes(key)) {
            return this[key].entries();
          }
          if (childSets.includes(key)) {
            return this[key].values();
          }
          return super.get(key);
        }
        toConfig() {
          const config = Object.assign(this.entries() || {}, {
            plugins: this.plugins.values().map((plugin) => plugin.toConfig()),
          });
          childMaps.forEach((key) => {
            config[key] = this[key].entries();
          });
          childSets.forEach((key) => {
            config[key] = this[key].values();
          });
          return this.clean(config);
        }
        merge(obj, omit = []) {
          if (!omit.includes("plugin") && "plugin" in obj) {
            Object.keys(obj.plugin).forEach((name) =>
              this.plugin(name).merge(obj.plugin[name]),
            );
          }
          const omissions = [...childMaps, ...childSets];
          omissions.forEach((key) => {
            if (!omit.includes(key) && key in obj) {
              this[key].merge(obj[key]);
            }
          });
          return super.merge(obj, [...omit, ...omissions, "plugin"]);
        }
      };
    },
    981: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const Resolve = __nccwpck_require__(318);
      const ChainedSet = __nccwpck_require__(572);
      module.exports = class extends Resolve {
        constructor(parent) {
          super(parent);
          this.modules = new ChainedSet(this);
          this.moduleExtensions = new ChainedSet(this);
          this.packageMains = new ChainedSet(this);
        }
        toConfig() {
          return this.clean({
            modules: this.modules.values(),
            moduleExtensions: this.moduleExtensions.values(),
            packageMains: this.packageMains.values(),
            ...super.toConfig(),
          });
        }
        merge(obj, omit = []) {
          const omissions = ["modules", "moduleExtensions", "packageMains"];
          omissions.forEach((key) => {
            if (!omit.includes(key) && key in obj) {
              this[key].merge(obj[key]);
            }
          });
          return super.merge(obj, [...omit, ...omissions]);
        }
      };
    },
    478: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const ChainedMap = __nccwpck_require__(446);
      const ChainedSet = __nccwpck_require__(572);
      const Orderable = __nccwpck_require__(102);
      const Use = __nccwpck_require__(877);
      const Resolve = __nccwpck_require__(318);
      function toArray(arr) {
        return Array.isArray(arr) ? arr : [arr];
      }
      const Rule = Orderable(
        class extends ChainedMap {
          constructor(parent, name, ruleType = "rule") {
            super(parent);
            this.ruleName = name;
            this.names = [];
            this.ruleType = ruleType;
            this.ruleTypes = [];
            let rule = this;
            while (rule instanceof Rule) {
              this.names.unshift(rule.ruleName);
              this.ruleTypes.unshift(rule.ruleType);
              rule = rule.parent;
            }
            this.uses = new ChainedMap(this);
            this.include = new ChainedSet(this);
            this.exclude = new ChainedSet(this);
            this.rules = new ChainedMap(this);
            this.oneOfs = new ChainedMap(this);
            this.resolve = new Resolve(this);
            this.resolve.extend(["fullySpecified"]);
            this.extend([
              "dependency",
              "enforce",
              "issuer",
              "issuerLayer",
              "layer",
              "mimetype",
              "parser",
              "generator",
              "resource",
              "resourceFragment",
              "resourceQuery",
              "sideEffects",
              "with",
              "test",
              "type",
            ]);
          }
          use(name) {
            return this.uses.getOrCompute(name, () => new Use(this, name));
          }
          rule(name) {
            return this.rules.getOrCompute(
              name,
              () => new Rule(this, name, "rule"),
            );
          }
          oneOf(name) {
            return this.oneOfs.getOrCompute(
              name,
              () => new Rule(this, name, "oneOf"),
            );
          }
          pre() {
            return this.enforce("pre");
          }
          post() {
            return this.enforce("post");
          }
          toConfig() {
            const config = this.clean(
              Object.assign(this.entries() || {}, {
                include: this.include.values(),
                exclude: this.exclude.values(),
                rules: this.rules.values().map((rule) => rule.toConfig()),
                oneOf: this.oneOfs.values().map((oneOf) => oneOf.toConfig()),
                use: this.uses.values().map((use) => use.toConfig()),
                resolve: this.resolve.toConfig(),
              }),
            );
            Object.defineProperties(config, {
              __ruleNames: { value: this.names },
              __ruleTypes: { value: this.ruleTypes },
            });
            return config;
          }
          merge(obj, omit = []) {
            if (!omit.includes("include") && "include" in obj) {
              this.include.merge(toArray(obj.include));
            }
            if (!omit.includes("exclude") && "exclude" in obj) {
              this.exclude.merge(toArray(obj.exclude));
            }
            if (!omit.includes("use") && "use" in obj) {
              Object.keys(obj.use).forEach((name) =>
                this.use(name).merge(obj.use[name]),
              );
            }
            if (!omit.includes("rules") && "rules" in obj) {
              Object.keys(obj.rules).forEach((name) =>
                this.rule(name).merge(obj.rules[name]),
              );
            }
            if (!omit.includes("oneOf") && "oneOf" in obj) {
              Object.keys(obj.oneOf).forEach((name) =>
                this.oneOf(name).merge(obj.oneOf[name]),
              );
            }
            if (!omit.includes("resolve") && "resolve" in obj) {
              this.resolve.merge(obj.resolve);
            }
            if (!omit.includes("test") && "test" in obj) {
              this.test(
                obj.test instanceof RegExp || typeof obj.test === "function"
                  ? obj.test
                  : new RegExp(obj.test),
              );
            }
            return super.merge(obj, [
              ...omit,
              "include",
              "exclude",
              "use",
              "rules",
              "oneOf",
              "resolve",
              "test",
            ]);
          }
        },
      );
      module.exports = Rule;
    },
    877: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const merge = __nccwpck_require__(779);
      const ChainedMap = __nccwpck_require__(446);
      const Orderable = __nccwpck_require__(102);
      module.exports = Orderable(
        class extends ChainedMap {
          constructor(parent, name) {
            super(parent);
            this.name = name;
            this.extend(["loader", "options"]);
          }
          tap(f) {
            this.options(f(this.get("options")));
            return this;
          }
          merge(obj, omit = []) {
            if (!omit.includes("loader") && "loader" in obj) {
              this.loader(obj.loader);
            }
            if (!omit.includes("options") && "options" in obj) {
              this.options(merge(this.store.get("options") || {}, obj.options));
            }
            return super.merge(obj, [...omit, "loader", "options"]);
          }
          toConfig() {
            const config = this.clean(this.entries() || {});
            Object.defineProperties(config, {
              __useName: { value: this.name },
              __ruleNames: { value: this.parent && this.parent.names },
              __ruleTypes: { value: this.parent && this.parent.ruleTypes },
            });
            return config;
          }
        },
      );
    },
    912: (module) => {
      module.exports = function createChainable(superClass) {
        return class extends superClass {
          constructor(parent) {
            super();
            this.parent = parent;
          }
          batch(handler) {
            handler(this);
            return this;
          }
          end() {
            return this.parent;
          }
        };
      };
    },
    635: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const merge = __nccwpck_require__(779);
      module.exports = function createMap(superClass) {
        return class extends superClass {
          constructor(...args) {
            super(...args);
            this.store = new Map();
          }
          extend(methods) {
            this.shorthands = methods;
            methods.forEach((method) => {
              this[method] = (value) => this.set(method, value);
            });
            return this;
          }
          clear() {
            this.store.clear();
            return this;
          }
          delete(key) {
            this.store.delete(key);
            return this;
          }
          order() {
            const entries = [...this.store].reduce((acc, [key, value]) => {
              acc[key] = value;
              return acc;
            }, {});
            const names = Object.keys(entries);
            const order = [...names];
            names.forEach((name) => {
              if (!entries[name]) {
                return;
              }
              const { __before, __after } = entries[name];
              if (__before && order.includes(__before)) {
                order.splice(order.indexOf(name), 1);
                order.splice(order.indexOf(__before), 0, name);
              } else if (__after && order.includes(__after)) {
                order.splice(order.indexOf(name), 1);
                order.splice(order.indexOf(__after) + 1, 0, name);
              }
            });
            return { entries, order };
          }
          entries() {
            const { entries, order } = this.order();
            if (order.length) {
              return entries;
            }
            return undefined;
          }
          values() {
            const { entries, order } = this.order();
            return order.map((name) => entries[name]);
          }
          get(key) {
            return this.store.get(key);
          }
          getOrCompute(key, fn) {
            if (!this.has(key)) {
              this.set(key, fn());
            }
            return this.get(key);
          }
          has(key) {
            return this.store.has(key);
          }
          set(key, value) {
            this.store.set(key, value);
            return this;
          }
          merge(obj, omit = []) {
            Object.keys(obj).forEach((key) => {
              if (omit.includes(key)) {
                return;
              }
              const value = obj[key];
              if (
                (!Array.isArray(value) && typeof value !== "object") ||
                value === null ||
                !this.has(key)
              ) {
                this.set(key, value);
              } else {
                this.set(key, merge(this.get(key), value));
              }
            });
            return this;
          }
          clean(obj) {
            return Object.keys(obj).reduce((acc, key) => {
              const value = obj[key];
              if (value === undefined) {
                return acc;
              }
              if (Array.isArray(value) && !value.length) {
                return acc;
              }
              if (
                Object.prototype.toString.call(value) === "[object Object]" &&
                !Object.keys(value).length
              ) {
                return acc;
              }
              acc[key] = value;
              return acc;
            }, {});
          }
          when(
            condition,
            whenTruthy = Function.prototype,
            whenFalsy = Function.prototype,
          ) {
            if (condition) {
              whenTruthy(this);
            } else {
              whenFalsy(this);
            }
            return this;
          }
        };
      };
    },
    453: (module) => {
      module.exports = function createSet(superClass) {
        return class extends superClass {
          constructor(...args) {
            super(...args);
            this.store = new Set();
          }
          add(value) {
            this.store.add(value);
            return this;
          }
          prepend(value) {
            this.store = new Set([value, ...this.store]);
            return this;
          }
          clear() {
            this.store.clear();
            return this;
          }
          delete(value) {
            this.store.delete(value);
            return this;
          }
          values() {
            return [...this.store];
          }
          has(value) {
            return this.store.has(value);
          }
          merge(arr) {
            if (arr !== undefined) {
              this.store = new Set([...this.store, ...arr]);
            }
            return this;
          }
          when(
            condition,
            whenTruthy = Function.prototype,
            whenFalsy = Function.prototype,
          ) {
            if (condition) {
              whenTruthy(this);
            } else {
              whenFalsy(this);
            }
            return this;
          }
        };
      };
    },
    776: (module) => {
      module.exports = function createValue(superClass) {
        return class extends superClass {
          constructor(...args) {
            super(...args);
            this.value = undefined;
            this.useMap = true;
          }
          set(...args) {
            this.useMap = true;
            this.value = undefined;
            return super.set(...args);
          }
          clear() {
            this.value = undefined;
            return super.clear();
          }
          classCall(value) {
            this.clear();
            this.useMap = false;
            this.value = value;
            return this.parent;
          }
          entries() {
            if (this.useMap) {
              return super.entries();
            }
            return this.value;
          }
          values() {
            if (this.useMap) {
              return super.values();
            }
            return this.value;
          }
        };
      };
    },
    563: (module) => {
      function webpackEmptyContext(req) {
        var e = new Error("Cannot find module '" + req + "'");
        e.code = "MODULE_NOT_FOUND";
        throw e;
      }
      webpackEmptyContext.keys = () => [];
      webpackEmptyContext.resolve = webpackEmptyContext;
      webpackEmptyContext.id = 563;
      module.exports = webpackEmptyContext;
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
    __nccwpck_require__.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop);
  })();
  if (typeof __nccwpck_require__ !== "undefined")
    __nccwpck_require__.ab = __dirname + "/";
  var __webpack_exports__ = __nccwpck_require__(842);
  module.exports = __webpack_exports__;
})();
