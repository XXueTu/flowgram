/*! For license information please see index.js.LICENSE.txt */
let swcHelpersPath, pluginHelper_htmlPlugin, cssExtractPlugin;
import * as __WEBPACK_EXTERNAL_MODULE_crypto__ from "crypto";
import * as __WEBPACK_EXTERNAL_MODULE_fs__ from "fs";
import * as __WEBPACK_EXTERNAL_MODULE_os__ from "os";
import * as __WEBPACK_EXTERNAL_MODULE_path__ from "path";
import * as __WEBPACK_EXTERNAL_MODULE__rspack_core_e0096ff7__ from "@rspack/core";
import * as __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__ from "node:fs";
import * as __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__ from "node:path";
import * as __WEBPACK_EXTERNAL_MODULE_node_crypto_9ba42079__ from "node:crypto";
import * as __WEBPACK_EXTERNAL_MODULE_node_url_e96de089__ from "node:url";
import * as __WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__ from "../compiled/picocolors/index.js";
import * as __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__ from "../compiled/rslog/index.js";
import * as __WEBPACK_EXTERNAL_MODULE_node_util_types_ce11fc49__ from "node:util/types";
import * as __WEBPACK_EXTERNAL_MODULE_node_module_ab9f2194__ from "node:module";
import * as __WEBPACK_EXTERNAL_MODULE_node_os_74b4b876__ from "node:os";
import * as __WEBPACK_EXTERNAL_MODULE_node_process_786449bf__ from "node:process";
import * as __WEBPACK_EXTERNAL_MODULE_node_util_1b29d436__ from "node:util";
import * as __WEBPACK_EXTERNAL_MODULE__compiled_mrmime_index_js_86f064ca__ from "../compiled/mrmime/index.js";
import * as __WEBPACK_EXTERNAL_MODULE__compiled_rspack_chain_index_js_b67fefbd__ from "../compiled/rspack-chain/index.js";
import * as __WEBPACK_EXTERNAL_MODULE_node_zlib_a5bb16fc__ from "node:zlib";
import * as __WEBPACK_EXTERNAL_MODULE_events__ from "events";
var EsmMode, __webpack_modules__ = {
    "../../node_modules/.pnpm/clone-deep@4.0.1/node_modules/clone-deep/index.js": function(module, __unused_webpack_exports, __webpack_require__) {
        let clone = __webpack_require__("../../node_modules/.pnpm/shallow-clone@3.0.1/node_modules/shallow-clone/index.js"), typeOf = __webpack_require__("../../node_modules/.pnpm/kind-of@6.0.3/node_modules/kind-of/index.js"), isPlainObject = __webpack_require__("../../node_modules/.pnpm/is-plain-object@2.0.4/node_modules/is-plain-object/index.js");
        module.exports = function cloneDeep(val, instanceClone) {
            switch(typeOf(val)){
                case 'object':
                    var val1 = val, instanceClone1 = instanceClone;
                    if ('function' == typeof instanceClone1) return instanceClone1(val1);
                    if (instanceClone1 || isPlainObject(val1)) {
                        let res = new val1.constructor();
                        for(let key in val1)res[key] = cloneDeep(val1[key], instanceClone1);
                        return res;
                    }
                    return val1;
                case 'array':
                    var val2 = val, instanceClone2 = instanceClone;
                    let res = new val2.constructor(val2.length);
                    for(let i = 0; i < val2.length; i++)res[i] = cloneDeep(val2[i], instanceClone2);
                    return res;
                default:
                    return clone(val);
            }
        };
    },
    "../../node_modules/.pnpm/deepmerge@4.3.1/node_modules/deepmerge/dist/cjs.js": function(module) {
        var isMergeableObject = function(value) {
            var value1, value2, stringValue;
            return !!(value1 = value) && 'object' == typeof value1 && (value2 = value, '[object RegExp]' !== (stringValue = Object.prototype.toString.call(value2)) && '[object Date]' !== stringValue && value2.$$typeof !== REACT_ELEMENT_TYPE);
        }, REACT_ELEMENT_TYPE = 'function' == typeof Symbol && Symbol.for ? Symbol.for('react.element') : 0xeac7;
        function cloneUnlessOtherwiseSpecified(value, options) {
            return !1 !== options.clone && options.isMergeableObject(value) ? deepmerge(Array.isArray(value) ? [] : {}, value, options) : value;
        }
        function defaultArrayMerge(target, source, options) {
            return target.concat(source).map(function(element) {
                return cloneUnlessOtherwiseSpecified(element, options);
            });
        }
        function getKeys(target) {
            return Object.keys(target).concat(Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(target).filter(function(symbol) {
                return Object.propertyIsEnumerable.call(target, symbol);
            }) : []);
        }
        function propertyIsOnObject(object, property) {
            try {
                return property in object;
            } catch (_) {
                return !1;
            }
        }
        function deepmerge(target, source, options) {
            (options = options || {}).arrayMerge = options.arrayMerge || defaultArrayMerge, options.isMergeableObject = options.isMergeableObject || isMergeableObject, options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;
            var options1, destination, sourceIsArray = Array.isArray(source);
            return sourceIsArray !== Array.isArray(target) ? cloneUnlessOtherwiseSpecified(source, options) : sourceIsArray ? options.arrayMerge(target, source, options) : (destination = {}, (options1 = options).isMergeableObject(target) && getKeys(target).forEach(function(key) {
                destination[key] = cloneUnlessOtherwiseSpecified(target[key], options1);
            }), getKeys(source).forEach(function(key) {
                propertyIsOnObject(target, key) && !(Object.hasOwnProperty.call(target, key) && Object.propertyIsEnumerable.call(target, key)) || (propertyIsOnObject(target, key) && options1.isMergeableObject(source[key]) ? destination[key] = (function(key, options) {
                    if (!options.customMerge) return deepmerge;
                    var customMerge = options.customMerge(key);
                    return 'function' == typeof customMerge ? customMerge : deepmerge;
                })(key, options1)(target[key], source[key], options1) : destination[key] = cloneUnlessOtherwiseSpecified(source[key], options1));
            }), destination);
        }
        deepmerge.all = function(array, options) {
            if (!Array.isArray(array)) throw Error('first argument should be an array');
            return array.reduce(function(prev, next) {
                return deepmerge(prev, next, options);
            }, {});
        }, module.exports = deepmerge;
    },
    "../../node_modules/.pnpm/dotenv-expand@12.0.2/node_modules/dotenv-expand/lib/main.js": function(module) {
        function _resolveEscapeSequences(value) {
            return value.replace(/\\\$/g, '$');
        }
        module.exports.expand = function(options) {
            let runningParsed = {}, processEnv = process.env;
            for(let key in options && null != options.processEnv && (processEnv = options.processEnv), options.parsed){
                let value = options.parsed[key];
                value = processEnv[key] && processEnv[key] !== value ? processEnv[key] : function(value, processEnv, runningParsed) {
                    let match, env = {
                        ...runningParsed,
                        ...processEnv
                    }, regex = /(?<!\\)\${([^{}]+)}|(?<!\\)\$([A-Za-z_][A-Za-z0-9_]*)/g, result = value, seen = new Set();
                    for(; null !== (match = regex.exec(result));){
                        let defaultValue, value;
                        seen.add(result);
                        let [template, bracedExpression, unbracedExpression] = match, expression = bracedExpression || unbracedExpression, opRegex = /(:\+|\+|:-|-)/, opMatch = expression.match(opRegex), splitter = opMatch ? opMatch[0] : null, r = expression.split(splitter), key = r.shift();
                        if ([
                            ':+',
                            '+'
                        ].includes(splitter) ? (defaultValue = env[key] ? r.join(splitter) : '', value = null) : (defaultValue = r.join(splitter), value = env[key]), (result = value ? seen.has(value) ? result.replace(template, defaultValue) : result.replace(template, value) : result.replace(template, defaultValue)) === runningParsed[key]) break;
                        regex.lastIndex = 0;
                    }
                    return result;
                }(value, processEnv, runningParsed), options.parsed[key] = _resolveEscapeSequences(value), runningParsed[key] = _resolveEscapeSequences(value);
            }
            for(let processKey in options.parsed)processEnv[processKey] = options.parsed[processKey];
            return options;
        };
    },
    "../../node_modules/.pnpm/dotenv@16.5.0/node_modules/dotenv/lib/main.js": function(module, __unused_webpack_exports, __webpack_require__) {
        let fs = __webpack_require__("fs"), path = __webpack_require__("path"), os = __webpack_require__("os"), crypto = __webpack_require__("crypto"), version = __webpack_require__("../../node_modules/.pnpm/dotenv@16.5.0/node_modules/dotenv/package.json").version, LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
        function _debug(message) {
            console.log(`[dotenv@${version}][DEBUG] ${message}`);
        }
        function _dotenvKey(options) {
            return options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0 ? options.DOTENV_KEY : process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0 ? process.env.DOTENV_KEY : '';
        }
        function _vaultPath(options) {
            let possibleVaultPath = null;
            if (options && options.path && options.path.length > 0) if (Array.isArray(options.path)) for (let filepath of options.path)fs.existsSync(filepath) && (possibleVaultPath = filepath.endsWith('.vault') ? filepath : `${filepath}.vault`);
            else possibleVaultPath = options.path.endsWith('.vault') ? options.path : `${options.path}.vault`;
            else possibleVaultPath = path.resolve(process.cwd(), '.env.vault');
            return fs.existsSync(possibleVaultPath) ? possibleVaultPath : null;
        }
        function _resolveHome(envPath) {
            return '~' === envPath[0] ? path.join(os.homedir(), envPath.slice(1)) : envPath;
        }
        let DotenvModule = {
            configDotenv: function(options) {
                let lastError, dotenvPath = path.resolve(process.cwd(), '.env'), encoding = 'utf8', debug = !!(options && options.debug);
                options && options.encoding ? encoding = options.encoding : debug && _debug('No encoding is specified. UTF-8 is used by default');
                let optionPaths = [
                    dotenvPath
                ];
                if (options && options.path) if (Array.isArray(options.path)) for (let filepath of (optionPaths = [], options.path))optionPaths.push(_resolveHome(filepath));
                else optionPaths = [
                    _resolveHome(options.path)
                ];
                let parsedAll = {};
                for (let path of optionPaths)try {
                    let parsed = DotenvModule.parse(fs.readFileSync(path, {
                        encoding
                    }));
                    DotenvModule.populate(parsedAll, parsed, options);
                } catch (e) {
                    debug && _debug(`Failed to load ${path} ${e.message}`), lastError = e;
                }
                let processEnv = process.env;
                return (options && null != options.processEnv && (processEnv = options.processEnv), DotenvModule.populate(processEnv, parsedAll, options), lastError) ? {
                    parsed: parsedAll,
                    error: lastError
                } : {
                    parsed: parsedAll
                };
            },
            _configVault: function(options) {
                options && options.debug && _debug('Loading env from encrypted .env.vault');
                let parsed = DotenvModule._parseVault(options), processEnv = process.env;
                return options && null != options.processEnv && (processEnv = options.processEnv), DotenvModule.populate(processEnv, parsed, options), {
                    parsed
                };
            },
            _parseVault: function(options) {
                let decrypted, vaultPath = _vaultPath(options), result = DotenvModule.configDotenv({
                    path: vaultPath
                });
                if (!result.parsed) {
                    let err = Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
                    throw err.code = 'MISSING_DATA', err;
                }
                let keys = _dotenvKey(options).split(','), length = keys.length;
                for(let i = 0; i < length; i++)try {
                    let key = keys[i].trim(), attrs = function(result, dotenvKey) {
                        let uri;
                        try {
                            uri = new URL(dotenvKey);
                        } catch (error) {
                            if ('ERR_INVALID_URL' === error.code) {
                                let err = Error('INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development');
                                throw err.code = 'INVALID_DOTENV_KEY', err;
                            }
                            throw error;
                        }
                        let key = uri.password;
                        if (!key) {
                            let err = Error('INVALID_DOTENV_KEY: Missing key part');
                            throw err.code = 'INVALID_DOTENV_KEY', err;
                        }
                        let environment = uri.searchParams.get('environment');
                        if (!environment) {
                            let err = Error('INVALID_DOTENV_KEY: Missing environment part');
                            throw err.code = 'INVALID_DOTENV_KEY', err;
                        }
                        let environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`, ciphertext = result.parsed[environmentKey];
                        if (!ciphertext) {
                            let err = Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
                            throw err.code = 'NOT_FOUND_DOTENV_ENVIRONMENT', err;
                        }
                        return {
                            ciphertext,
                            key
                        };
                    }(result, key);
                    decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
                    break;
                } catch (error) {
                    if (i + 1 >= length) throw error;
                }
                return DotenvModule.parse(decrypted);
            },
            config: function(options) {
                if (0 === _dotenvKey(options).length) return DotenvModule.configDotenv(options);
                let vaultPath = _vaultPath(options);
                if (!vaultPath) {
                    var message;
                    return message = `You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`, console.log(`[dotenv@${version}][WARN] ${message}`), DotenvModule.configDotenv(options);
                }
                return DotenvModule._configVault(options);
            },
            decrypt: function(encrypted, keyStr) {
                let key = Buffer.from(keyStr.slice(-64), 'hex'), ciphertext = Buffer.from(encrypted, 'base64'), nonce = ciphertext.subarray(0, 12), authTag = ciphertext.subarray(-16);
                ciphertext = ciphertext.subarray(12, -16);
                try {
                    let aesgcm = crypto.createDecipheriv('aes-256-gcm', key, nonce);
                    return aesgcm.setAuthTag(authTag), `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
                } catch (error) {
                    let isRange = error instanceof RangeError, invalidKeyLength = 'Invalid key length' === error.message, decryptionFailed = 'Unsupported state or unable to authenticate data' === error.message;
                    if (isRange || invalidKeyLength) {
                        let err = Error('INVALID_DOTENV_KEY: It must be 64 characters long (or more)');
                        throw err.code = 'INVALID_DOTENV_KEY', err;
                    }
                    if (decryptionFailed) {
                        let err = Error('DECRYPTION_FAILED: Please check your DOTENV_KEY');
                        throw err.code = 'DECRYPTION_FAILED', err;
                    }
                    throw error;
                }
            },
            parse: function(src) {
                let match, obj = {}, lines = src.toString();
                for(lines = lines.replace(/\r\n?/mg, '\n'); null != (match = LINE.exec(lines));){
                    let key = match[1], value = match[2] || '', maybeQuote = (value = value.trim())[0];
                    value = value.replace(/^(['"`])([\s\S]*)\1$/mg, '$2'), '"' === maybeQuote && (value = (value = value.replace(/\\n/g, '\n')).replace(/\\r/g, '\r')), obj[key] = value;
                }
                return obj;
            },
            populate: function(processEnv, parsed, options = {}) {
                let debug = !!(options && options.debug), override = !!(options && options.override);
                if ('object' != typeof parsed) {
                    let err = Error('OBJECT_REQUIRED: Please check the processEnv argument being passed to populate');
                    throw err.code = 'OBJECT_REQUIRED', err;
                }
                for (let key of Object.keys(parsed))Object.prototype.hasOwnProperty.call(processEnv, key) ? (!0 === override && (processEnv[key] = parsed[key]), debug && (!0 === override ? _debug(`"${key}" is already defined and WAS overwritten`) : _debug(`"${key}" is already defined and was NOT overwritten`))) : processEnv[key] = parsed[key];
            }
        };
        module.exports.configDotenv = DotenvModule.configDotenv, module.exports._configVault = DotenvModule._configVault, module.exports._parseVault = DotenvModule._parseVault, module.exports.config = DotenvModule.config, module.exports.decrypt = DotenvModule.decrypt, module.exports.parse = DotenvModule.parse, module.exports.populate = DotenvModule.populate, module.exports = DotenvModule;
    },
    "../../node_modules/.pnpm/flat@5.0.2/node_modules/flat/index.js": function(module) {
        function isBuffer(obj) {
            return obj && obj.constructor && 'function' == typeof obj.constructor.isBuffer && obj.constructor.isBuffer(obj);
        }
        function keyIdentity(key) {
            return key;
        }
        function flatten(target, opts) {
            let delimiter = (opts = opts || {}).delimiter || '.', maxDepth = opts.maxDepth, transformKey = opts.transformKey || keyIdentity, output = {};
            return !function step(object, prev, currentDepth) {
                currentDepth = currentDepth || 1, Object.keys(object).forEach(function(key) {
                    let value = object[key], isarray = opts.safe && Array.isArray(value), type = Object.prototype.toString.call(value), isbuffer = isBuffer(value), newKey = prev ? prev + delimiter + transformKey(key) : transformKey(key);
                    if (!isarray && !isbuffer && ('[object Object]' === type || '[object Array]' === type) && Object.keys(value).length && (!opts.maxDepth || currentDepth < maxDepth)) return step(value, newKey, currentDepth + 1);
                    output[newKey] = value;
                });
            }(target), output;
        }
        module.exports = flatten, flatten.flatten = flatten, flatten.unflatten = function unflatten(target, opts) {
            let delimiter = (opts = opts || {}).delimiter || '.', overwrite = opts.overwrite || !1, transformKey = opts.transformKey || keyIdentity, result = {};
            if (isBuffer(target) || '[object Object]' !== Object.prototype.toString.call(target)) return target;
            function getkey(key) {
                let parsedKey = Number(key);
                return isNaN(parsedKey) || -1 !== key.indexOf('.') || opts.object ? key : parsedKey;
            }
            return Object.keys(target = Object.keys(target).reduce(function(result, key) {
                var target1;
                let type = Object.prototype.toString.call(target[key]);
                return '[object Object]' !== type && '[object Array]' !== type || function(val) {
                    let type = Object.prototype.toString.call(val);
                    return !val || ('[object Array]' === type ? !val.length : '[object Object]' === type ? !Object.keys(val).length : void 0);
                }(target[key]) ? (result[key] = target[key], result) : Object.keys(target1 = flatten(target[key], opts)).reduce(function(result, key1) {
                    return result[key + delimiter + key1] = target1[key1], result;
                }, result);
            }, {})).forEach(function(key) {
                let split = key.split(delimiter).map(transformKey), key1 = getkey(split.shift()), key2 = getkey(split[0]), recipient = result;
                for(; void 0 !== key2;){
                    if ('__proto__' === key1) return;
                    let type = Object.prototype.toString.call(recipient[key1]), isobject = '[object Object]' === type || '[object Array]' === type;
                    if (!overwrite && !isobject && void 0 !== recipient[key1]) return;
                    (!overwrite || isobject) && (overwrite || null != recipient[key1]) || (recipient[key1] = 'number' != typeof key2 || opts.object ? {} : []), recipient = recipient[key1], split.length > 0 && (key1 = getkey(split.shift()), key2 = getkey(split[0]));
                }
                recipient[key1] = unflatten(target[key], opts);
            }), result;
        };
    },
    "../../node_modules/.pnpm/is-plain-object@2.0.4/node_modules/is-plain-object/index.js": function(module, __unused_webpack_exports, __webpack_require__) {
        var isObject = __webpack_require__("../../node_modules/.pnpm/isobject@3.0.1/node_modules/isobject/index.js");
        function isObjectObject(o) {
            return !0 === isObject(o) && '[object Object]' === Object.prototype.toString.call(o);
        }
        module.exports = function(o) {
            var ctor, prot;
            return !1 !== isObjectObject(o) && 'function' == typeof (ctor = o.constructor) && !1 !== isObjectObject(prot = ctor.prototype) && !1 !== prot.hasOwnProperty('isPrototypeOf');
        };
    },
    "../../node_modules/.pnpm/isobject@3.0.1/node_modules/isobject/index.js": function(module) {
        module.exports = function(val) {
            return null != val && 'object' == typeof val && !1 === Array.isArray(val);
        };
    },
    "../../node_modules/.pnpm/kind-of@6.0.3/node_modules/kind-of/index.js": function(module) {
        var toString = Object.prototype.toString;
        function ctorName(val) {
            return 'function' == typeof val.constructor ? val.constructor.name : null;
        }
        module.exports = function(val) {
            if (void 0 === val) return 'undefined';
            if (null === val) return 'null';
            var val1, val2, val3, val4, val5, val6, val7, type = typeof val;
            if ('boolean' === type) return 'boolean';
            if ('string' === type) return 'string';
            if ('number' === type) return 'number';
            if ('symbol' === type) return 'symbol';
            if ('function' === type) {
                return 'GeneratorFunction' === ctorName(val) ? 'generatorfunction' : 'function';
            }
            if (val2 = val, Array.isArray ? Array.isArray(val2) : val2 instanceof Array) return 'array';
            if ((val3 = val).constructor && 'function' == typeof val3.constructor.isBuffer && val3.constructor.isBuffer(val3)) return 'buffer';
            if (function(val) {
                try {
                    if ('number' == typeof val.length && 'function' == typeof val.callee) return !0;
                } catch (err) {
                    if (-1 !== err.message.indexOf('callee')) return !0;
                }
                return !1;
            }(val)) return 'arguments';
            if ((val4 = val) instanceof Date || 'function' == typeof val4.toDateString && 'function' == typeof val4.getDate && 'function' == typeof val4.setDate) return 'date';
            if ((val5 = val) instanceof Error || 'string' == typeof val5.message && val5.constructor && 'number' == typeof val5.constructor.stackTraceLimit) return 'error';
            if ((val6 = val) instanceof RegExp || 'string' == typeof val6.flags && 'boolean' == typeof val6.ignoreCase && 'boolean' == typeof val6.multiline && 'boolean' == typeof val6.global) return 'regexp';
            switch(ctorName(val)){
                case 'Symbol':
                    return 'symbol';
                case 'Promise':
                    return 'promise';
                case 'WeakMap':
                    return 'weakmap';
                case 'WeakSet':
                    return 'weakset';
                case 'Map':
                    return 'map';
                case 'Set':
                    return 'set';
                case 'Int8Array':
                    return 'int8array';
                case 'Uint8Array':
                    return 'uint8array';
                case 'Uint8ClampedArray':
                    return 'uint8clampedarray';
                case 'Int16Array':
                    return 'int16array';
                case 'Uint16Array':
                    return 'uint16array';
                case 'Int32Array':
                    return 'int32array';
                case 'Uint32Array':
                    return 'uint32array';
                case 'Float32Array':
                    return 'float32array';
                case 'Float64Array':
                    return 'float64array';
            }
            if ('function' == typeof (val7 = val).throw && 'function' == typeof val7.return && 'function' == typeof val7.next) return 'generator';
            switch(type = toString.call(val)){
                case '[object Object]':
                    return 'object';
                case '[object Map Iterator]':
                    return 'mapiterator';
                case '[object Set Iterator]':
                    return 'setiterator';
                case '[object String Iterator]':
                    return 'stringiterator';
                case '[object Array Iterator]':
                    return 'arrayiterator';
            }
            return type.slice(8, -1).toLowerCase().replace(/\s/g, '');
        };
    },
    "../../node_modules/.pnpm/shallow-clone@3.0.1/node_modules/shallow-clone/index.js": function(module, __unused_webpack_exports, __webpack_require__) {
        let valueOf = Symbol.prototype.valueOf, typeOf = __webpack_require__("../../node_modules/.pnpm/kind-of@6.0.3/node_modules/kind-of/index.js");
        module.exports = function(val, deep) {
            switch(typeOf(val)){
                case 'array':
                    return val.slice();
                case 'object':
                    return Object.assign({}, val);
                case 'date':
                    return new val.constructor(Number(val));
                case 'map':
                    return new Map(val);
                case 'set':
                    return new Set(val);
                case 'buffer':
                    var val1, val2, deep1, val3 = val;
                    let len = val3.length, buf = Buffer.allocUnsafe ? Buffer.allocUnsafe(len) : Buffer.from(len);
                    return val3.copy(buf), buf;
                case 'symbol':
                    return val1 = val, valueOf ? Object(valueOf.call(val1)) : {};
                case 'arraybuffer':
                    var val4 = val;
                    let res = new val4.constructor(val4.byteLength);
                    return new Uint8Array(res).set(new Uint8Array(val4)), res;
                case 'float32array':
                case 'float64array':
                case 'int16array':
                case 'int32array':
                case 'int8array':
                case 'uint16array':
                case 'uint32array':
                case 'uint8clampedarray':
                case 'uint8array':
                    return new (val2 = val).constructor(val2.buffer, val2.byteOffset, val2.length);
                case 'regexp':
                    var val5 = val;
                    let flags = void 0 !== val5.flags ? val5.flags : /\w+$/.exec(val5) || void 0, re = new val5.constructor(val5.source, flags);
                    return re.lastIndex = val5.lastIndex, re;
                case 'error':
                    return Object.create(val);
                default:
                    return val;
            }
        };
    },
    "../../node_modules/.pnpm/webpack-merge@6.0.1/node_modules/webpack-merge/dist/index.js": function(__unused_webpack_module, exports, __webpack_require__) {
        var __read = this && this.__read || function(o, n) {
            var m = "function" == typeof Symbol && o[Symbol.iterator];
            if (!m) return o;
            var r, e, i = m.call(o), ar = [];
            try {
                for(; (void 0 === n || n-- > 0) && !(r = i.next()).done;)ar.push(r.value);
            } catch (error) {
                e = {
                    error: error
                };
            } finally{
                try {
                    r && !r.done && (m = i.return) && m.call(i);
                } finally{
                    if (e) throw e.error;
                }
            }
            return ar;
        }, __spreadArray = this && this.__spreadArray || function(to, from, pack) {
            if (pack || 2 == arguments.length) for(var ar, i = 0, l = from.length; i < l; i++)!ar && i in from || (ar || (ar = Array.prototype.slice.call(from, 0, i)), ar[i] = from[i]);
            return to.concat(ar || Array.prototype.slice.call(from));
        }, __importDefault = this && this.__importDefault || function(mod) {
            return mod && mod.__esModule ? mod : {
                default: mod
            };
        };
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.unique = exports.mergeWithRules = exports.mergeWithCustomize = exports.default = exports.merge = exports.CustomizeRule = exports.customizeObject = exports.customizeArray = void 0;
        var wildcard_1 = __importDefault(__webpack_require__("../../node_modules/.pnpm/wildcard@2.0.1/node_modules/wildcard/index.js")), merge_with_1 = __importDefault(__webpack_require__("../../node_modules/.pnpm/webpack-merge@6.0.1/node_modules/webpack-merge/dist/merge-with.js")), join_arrays_1 = __importDefault(__webpack_require__("../../node_modules/.pnpm/webpack-merge@6.0.1/node_modules/webpack-merge/dist/join-arrays.js"));
        exports.unique = __importDefault(__webpack_require__("../../node_modules/.pnpm/webpack-merge@6.0.1/node_modules/webpack-merge/dist/unique.js")).default;
        var types_1 = __webpack_require__("../../node_modules/.pnpm/webpack-merge@6.0.1/node_modules/webpack-merge/dist/types.js");
        Object.defineProperty(exports, "CustomizeRule", {
            enumerable: !0,
            get: function() {
                return types_1.CustomizeRule;
            }
        });
        var utils_1 = __webpack_require__("../../node_modules/.pnpm/webpack-merge@6.0.1/node_modules/webpack-merge/dist/utils.js");
        function merge(firstConfiguration) {
            for(var configurations = [], _i = 1; _i < arguments.length; _i++)configurations[_i - 1] = arguments[_i];
            return mergeWithCustomize({}).apply(void 0, __spreadArray([
                firstConfiguration
            ], __read(configurations), !1));
        }
        function mergeWithCustomize(options) {
            return function(firstConfiguration) {
                for(var configurations = [], _i = 1; _i < arguments.length; _i++)configurations[_i - 1] = arguments[_i];
                if ((0, utils_1.isUndefined)(firstConfiguration) || configurations.some(utils_1.isUndefined)) throw TypeError("Merging undefined is not supported");
                if (firstConfiguration.then) throw TypeError("Promises are not supported");
                if (!firstConfiguration) return {};
                if (0 === configurations.length) {
                    if (Array.isArray(firstConfiguration)) {
                        if (0 === firstConfiguration.length) return {};
                        if (firstConfiguration.some(utils_1.isUndefined)) throw TypeError("Merging undefined is not supported");
                        if (firstConfiguration[0].then) throw TypeError("Promises are not supported");
                        return (0, merge_with_1.default)(firstConfiguration, (0, join_arrays_1.default)(options));
                    }
                    return firstConfiguration;
                }
                return (0, merge_with_1.default)([
                    firstConfiguration
                ].concat(configurations), (0, join_arrays_1.default)(options));
            };
        }
        exports.merge = merge, exports.default = merge, exports.mergeWithCustomize = mergeWithCustomize, exports.customizeArray = function(rules) {
            return function(a, b, key) {
                var matchedRule = Object.keys(rules).find(function(rule) {
                    return (0, wildcard_1.default)(rule, key);
                }) || "";
                if (matchedRule) switch(rules[matchedRule]){
                    case types_1.CustomizeRule.Prepend:
                        return __spreadArray(__spreadArray([], __read(b), !1), __read(a), !1);
                    case types_1.CustomizeRule.Replace:
                        return b;
                    case types_1.CustomizeRule.Append:
                    default:
                        return __spreadArray(__spreadArray([], __read(a), !1), __read(b), !1);
                }
            };
        }, exports.mergeWithRules = function(rules) {
            return mergeWithCustomize({
                customizeArray: function(a, b, key) {
                    var currentRule = rules;
                    return (key.split(".").forEach(function(k) {
                        currentRule && (currentRule = currentRule[k]);
                    }), (0, utils_1.isPlainObject)(currentRule)) ? function mergeWithRule(_a) {
                        var currentRule = _a.currentRule, a = _a.a, b = _a.b;
                        if (!isArray(a)) return a;
                        var bAllMatches = [];
                        return a.map(function(ao) {
                            if (!(0, utils_1.isPlainObject)(currentRule)) return ao;
                            var ret = {}, rulesToMatch = [], operations = {};
                            Object.entries(currentRule).forEach(function(_a) {
                                var _b = __read(_a, 2), k = _b[0], v = _b[1];
                                v === types_1.CustomizeRule.Match ? rulesToMatch.push(k) : operations[k] = v;
                            });
                            var bMatches = b.filter(function(o) {
                                var matches = rulesToMatch.every(function(rule) {
                                    return (0, utils_1.isSameCondition)(ao[rule], o[rule]);
                                });
                                return matches && bAllMatches.push(o), matches;
                            });
                            return (0, utils_1.isPlainObject)(ao) ? (Object.entries(ao).forEach(function(_a) {
                                var _b = __read(_a, 2), k = _b[0], v = _b[1];
                                switch(currentRule[k]){
                                    case types_1.CustomizeRule.Match:
                                        ret[k] = v, Object.entries(currentRule).forEach(function(_a) {
                                            var _b = __read(_a, 2), k = _b[0];
                                            if (_b[1] === types_1.CustomizeRule.Replace && bMatches.length > 0) {
                                                var val = last(bMatches)[k];
                                                void 0 !== val && (ret[k] = val);
                                            }
                                        });
                                        break;
                                    case types_1.CustomizeRule.Append:
                                        if (!bMatches.length) {
                                            ret[k] = v;
                                            break;
                                        }
                                        var appendValue = last(bMatches)[k];
                                        if (!isArray(v) || !isArray(appendValue)) throw TypeError("Trying to append non-arrays");
                                        ret[k] = v.concat(appendValue);
                                        break;
                                    case types_1.CustomizeRule.Merge:
                                        if (!bMatches.length) {
                                            ret[k] = v;
                                            break;
                                        }
                                        var lastValue = last(bMatches)[k];
                                        if (!(0, utils_1.isPlainObject)(v) || !(0, utils_1.isPlainObject)(lastValue)) throw TypeError("Trying to merge non-objects");
                                        ret[k] = merge(v, lastValue);
                                        break;
                                    case types_1.CustomizeRule.Prepend:
                                        if (!bMatches.length) {
                                            ret[k] = v;
                                            break;
                                        }
                                        var prependValue = last(bMatches)[k];
                                        if (!isArray(v) || !isArray(prependValue)) throw TypeError("Trying to prepend non-arrays");
                                        ret[k] = prependValue.concat(v);
                                        break;
                                    case types_1.CustomizeRule.Replace:
                                        ret[k] = bMatches.length > 0 ? last(bMatches)[k] : v;
                                        break;
                                    default:
                                        var currentRule_1 = operations[k], b_1 = bMatches.map(function(o) {
                                            return o[k];
                                        }).reduce(function(acc, val) {
                                            return isArray(acc) && isArray(val) ? __spreadArray(__spreadArray([], __read(acc), !1), __read(val), !1) : acc;
                                        }, []);
                                        ret[k] = mergeWithRule({
                                            currentRule: currentRule_1,
                                            a: v,
                                            b: b_1
                                        });
                                }
                            }), ret) : ao;
                        }).concat(b.filter(function(o) {
                            return !bAllMatches.includes(o);
                        }));
                    }({
                        currentRule: currentRule,
                        a: a,
                        b: b
                    }) : "string" == typeof currentRule ? function(_a) {
                        var currentRule = _a.currentRule, a = _a.a, b = _a.b;
                        switch(currentRule){
                            case types_1.CustomizeRule.Append:
                                return a.concat(b);
                            case types_1.CustomizeRule.Prepend:
                                return b.concat(a);
                            case types_1.CustomizeRule.Replace:
                                return b;
                        }
                        return a;
                    }({
                        currentRule: currentRule,
                        a: a,
                        b: b
                    }) : void 0;
                }
            });
        };
        var isArray = Array.isArray;
        function last(arr) {
            return arr[arr.length - 1];
        }
        exports.customizeObject = function(rules) {
            return function(a, b, key) {
                switch(rules[key]){
                    case types_1.CustomizeRule.Prepend:
                        return (0, merge_with_1.default)([
                            b,
                            a
                        ], (0, join_arrays_1.default)());
                    case types_1.CustomizeRule.Replace:
                        return b;
                    case types_1.CustomizeRule.Append:
                        return (0, merge_with_1.default)([
                            a,
                            b
                        ], (0, join_arrays_1.default)());
                }
            };
        };
    },
    "../../node_modules/.pnpm/webpack-merge@6.0.1/node_modules/webpack-merge/dist/join-arrays.js": function(__unused_webpack_module, exports, __webpack_require__) {
        var __read = this && this.__read || function(o, n) {
            var m = "function" == typeof Symbol && o[Symbol.iterator];
            if (!m) return o;
            var r, e, i = m.call(o), ar = [];
            try {
                for(; (void 0 === n || n-- > 0) && !(r = i.next()).done;)ar.push(r.value);
            } catch (error) {
                e = {
                    error: error
                };
            } finally{
                try {
                    r && !r.done && (m = i.return) && m.call(i);
                } finally{
                    if (e) throw e.error;
                }
            }
            return ar;
        }, __spreadArray = this && this.__spreadArray || function(to, from, pack) {
            if (pack || 2 == arguments.length) for(var ar, i = 0, l = from.length; i < l; i++)!ar && i in from || (ar || (ar = Array.prototype.slice.call(from, 0, i)), ar[i] = from[i]);
            return to.concat(ar || Array.prototype.slice.call(from));
        }, __importDefault = this && this.__importDefault || function(mod) {
            return mod && mod.__esModule ? mod : {
                default: mod
            };
        };
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var clone_deep_1 = __importDefault(__webpack_require__("../../node_modules/.pnpm/clone-deep@4.0.1/node_modules/clone-deep/index.js")), merge_with_1 = __importDefault(__webpack_require__("../../node_modules/.pnpm/webpack-merge@6.0.1/node_modules/webpack-merge/dist/merge-with.js")), utils_1 = __webpack_require__("../../node_modules/.pnpm/webpack-merge@6.0.1/node_modules/webpack-merge/dist/utils.js"), isArray = Array.isArray;
        exports.default = function joinArrays(_a) {
            var _b = void 0 === _a ? {} : _a, customizeArray = _b.customizeArray, customizeObject = _b.customizeObject, key = _b.key;
            return function _joinArrays(a, b, k) {
                var newKey = key ? "".concat(key, ".").concat(k) : k;
                if ((0, utils_1.isFunction)(a) && (0, utils_1.isFunction)(b)) return function() {
                    for(var args = [], _i = 0; _i < arguments.length; _i++)args[_i] = arguments[_i];
                    return _joinArrays(a.apply(void 0, __spreadArray([], __read(args), !1)), b.apply(void 0, __spreadArray([], __read(args), !1)), k);
                };
                if (isArray(a) && isArray(b)) {
                    var customResult = customizeArray && customizeArray(a, b, newKey);
                    return customResult || __spreadArray(__spreadArray([], __read(a), !1), __read(b), !1);
                }
                if ((0, utils_1.isRegex)(b)) return b;
                if ((0, utils_1.isPlainObject)(a) && (0, utils_1.isPlainObject)(b)) {
                    var customResult = customizeObject && customizeObject(a, b, newKey);
                    return customResult || (0, merge_with_1.default)([
                        a,
                        b
                    ], joinArrays({
                        customizeArray: customizeArray,
                        customizeObject: customizeObject,
                        key: newKey
                    }));
                }
                return (0, utils_1.isPlainObject)(b) ? (0, clone_deep_1.default)(b) : isArray(b) ? __spreadArray([], __read(b), !1) : b;
            };
        };
    },
    "../../node_modules/.pnpm/webpack-merge@6.0.1/node_modules/webpack-merge/dist/merge-with.js": function(__unused_webpack_module, exports) {
        var __read = this && this.__read || function(o, n) {
            var m = "function" == typeof Symbol && o[Symbol.iterator];
            if (!m) return o;
            var r, e, i = m.call(o), ar = [];
            try {
                for(; (void 0 === n || n-- > 0) && !(r = i.next()).done;)ar.push(r.value);
            } catch (error) {
                e = {
                    error: error
                };
            } finally{
                try {
                    r && !r.done && (m = i.return) && m.call(i);
                } finally{
                    if (e) throw e.error;
                }
            }
            return ar;
        };
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.default = function(objects, customizer) {
            var _a = __read(objects), first = _a[0], rest = _a.slice(1), ret = first;
            return rest.forEach(function(a) {
                var a1, b, customizer1, ret1;
                a1 = ret, b = a, customizer1 = customizer, ret1 = {}, Object.keys(a1).concat(Object.keys(b)).forEach(function(k) {
                    var v = customizer1(a1[k], b[k], k);
                    ret1[k] = void 0 === v ? a1[k] : v;
                }), ret = ret1;
            }), ret;
        };
    },
    "../../node_modules/.pnpm/webpack-merge@6.0.1/node_modules/webpack-merge/dist/types.js": function(__unused_webpack_module, exports) {
        var CustomizeRule, CustomizeRule1;
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.CustomizeRule = void 0, (CustomizeRule1 = CustomizeRule || (exports.CustomizeRule = CustomizeRule = {})).Match = "match", CustomizeRule1.Merge = "merge", CustomizeRule1.Append = "append", CustomizeRule1.Prepend = "prepend", CustomizeRule1.Replace = "replace";
    },
    "../../node_modules/.pnpm/webpack-merge@6.0.1/node_modules/webpack-merge/dist/unique.js": function(__unused_webpack_module, exports) {
        var __read = this && this.__read || function(o, n) {
            var m = "function" == typeof Symbol && o[Symbol.iterator];
            if (!m) return o;
            var r, e, i = m.call(o), ar = [];
            try {
                for(; (void 0 === n || n-- > 0) && !(r = i.next()).done;)ar.push(r.value);
            } catch (error) {
                e = {
                    error: error
                };
            } finally{
                try {
                    r && !r.done && (m = i.return) && m.call(i);
                } finally{
                    if (e) throw e.error;
                }
            }
            return ar;
        }, __spreadArray = this && this.__spreadArray || function(to, from, pack) {
            if (pack || 2 == arguments.length) for(var ar, i = 0, l = from.length; i < l; i++)!ar && i in from || (ar || (ar = Array.prototype.slice.call(from, 0, i)), ar[i] = from[i]);
            return to.concat(ar || Array.prototype.slice.call(from));
        };
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.default = function(key, uniques, getter) {
            var uniquesSet = new Set(uniques);
            return function(a, b, k) {
                return k === key && Array.from(__spreadArray(__spreadArray([], __read(a), !1), __read(b), !1).map(function(it) {
                    return {
                        key: getter(it),
                        value: it
                    };
                }).map(function(_a) {
                    var key = _a.key, value = _a.value;
                    return {
                        key: uniquesSet.has(key) ? key : value,
                        value: value
                    };
                }).reduce(function(m, _a) {
                    var key = _a.key, value = _a.value;
                    return m.delete(key), m.set(key, value);
                }, new Map()).values());
            };
        };
    },
    "../../node_modules/.pnpm/webpack-merge@6.0.1/node_modules/webpack-merge/dist/utils.js": function(__unused_webpack_module, exports, __webpack_require__) {
        var __read = this && this.__read || function(o, n) {
            var m = "function" == typeof Symbol && o[Symbol.iterator];
            if (!m) return o;
            var r, e, i = m.call(o), ar = [];
            try {
                for(; (void 0 === n || n-- > 0) && !(r = i.next()).done;)ar.push(r.value);
            } catch (error) {
                e = {
                    error: error
                };
            } finally{
                try {
                    r && !r.done && (m = i.return) && m.call(i);
                } finally{
                    if (e) throw e.error;
                }
            }
            return ar;
        };
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.isSameCondition = exports.isUndefined = exports.isPlainObject = exports.isFunction = exports.isRegex = void 0;
        var flat_1 = __webpack_require__("../../node_modules/.pnpm/flat@5.0.2/node_modules/flat/index.js");
        function isRegex(o) {
            return o instanceof RegExp;
        }
        function isFunction(functionToCheck) {
            return functionToCheck && "[object Function]" === ({}).toString.call(functionToCheck);
        }
        exports.isRegex = isRegex, exports.isFunction = isFunction, exports.isPlainObject = function(a) {
            return !(null === a || Array.isArray(a)) && "object" == typeof a;
        }, exports.isUndefined = function(a) {
            return void 0 === a;
        }, exports.isSameCondition = function(a, b) {
            if (!a || !b) return a === b;
            if ("string" == typeof a || "string" == typeof b || isRegex(a) || isRegex(b) || isFunction(a) || isFunction(b)) return a.toString() === b.toString();
            var _a, _b, entriesA = Object.entries((0, flat_1.flatten)(a)), entriesB = Object.entries((0, flat_1.flatten)(b));
            if (entriesA.length !== entriesB.length) return !1;
            for(var i = 0; i < entriesA.length; i++)entriesA[i][0] = entriesA[i][0].replace(/\b\d+\b/g, "[]"), entriesB[i][0] = entriesB[i][0].replace(/\b\d+\b/g, "[]");
            function cmp(_a, _b) {
                var _c = __read(_a, 2), k1 = _c[0], v1 = _c[1], _d = __read(_b, 2), k2 = _d[0], v2 = _d[1];
                return k1 < k2 ? -1 : k1 > k2 ? 1 : v1 < v2 ? -1 : +(v1 > v2);
            }
            if (entriesA.sort(cmp), entriesB.sort(cmp), entriesA.length !== entriesB.length) return !1;
            for(var i = 0; i < entriesA.length; i++)if (entriesA[i][0] !== entriesB[i][0] || (null == (_a = entriesA[i][1]) ? void 0 : _a.toString()) !== (null == (_b = entriesB[i][1]) ? void 0 : _b.toString())) return !1;
            return !0;
        };
    },
    "../../node_modules/.pnpm/wildcard@2.0.1/node_modules/wildcard/index.js": function(module) {
        var REGEXP_PARTS = /(\*|\?)/g;
        function WildcardMatcher(text, separator) {
            this.text = text = text || '', this.hasWild = text.indexOf('*') >= 0, this.separator = separator, this.parts = text.split(separator).map(this.classifyPart.bind(this));
        }
        WildcardMatcher.prototype.match = function(input) {
            var ii, testParts, matches = !0, parts = this.parts, partsCount = parts.length;
            if ('string' == typeof input || input instanceof String) if (this.hasWild || this.text == input) {
                for(ii = 0, testParts = (input || '').split(this.separator); matches && ii < partsCount; ii++)if ('*' === parts[ii]) continue;
                else matches = ii < testParts.length && (parts[ii] instanceof RegExp ? parts[ii].test(testParts[ii]) : parts[ii] === testParts[ii]);
                matches = matches && testParts;
            } else matches = !1;
            else if ('function' == typeof input.splice) for(matches = [], ii = input.length; ii--;)this.match(input[ii]) && (matches[matches.length] = input[ii]);
            else if ('object' == typeof input) for(var key in matches = {}, input)this.match(key) && (matches[key] = input[key]);
            return matches;
        }, WildcardMatcher.prototype.classifyPart = function(part) {
            if ('*' === part) ;
            else if (part.indexOf('*') >= 0 || part.indexOf('?') >= 0) return new RegExp(part.replace(REGEXP_PARTS, '\.$1'));
            return part;
        }, module.exports = function(text, test, separator) {
            var matcher = new WildcardMatcher(text, separator || /[\/\.]/);
            return void 0 !== test ? matcher.match(test) : matcher;
        };
    },
    crypto: function(module) {
        module.exports = __WEBPACK_EXTERNAL_MODULE_crypto__;
    },
    fs: function(module) {
        module.exports = __WEBPACK_EXTERNAL_MODULE_fs__;
    },
    os: function(module) {
        module.exports = __WEBPACK_EXTERNAL_MODULE_os__;
    },
    path: function(module) {
        module.exports = __WEBPACK_EXTERNAL_MODULE_path__;
    },
    "../../node_modules/.pnpm/dotenv@16.5.0/node_modules/dotenv/package.json": function(module) {
        module.exports = JSON.parse('{"name":"dotenv","version":"16.5.0","description":"Loads environment variables from .env file","main":"lib/main.js","types":"lib/main.d.ts","exports":{".":{"types":"./lib/main.d.ts","require":"./lib/main.js","default":"./lib/main.js"},"./config":"./config.js","./config.js":"./config.js","./lib/env-options":"./lib/env-options.js","./lib/env-options.js":"./lib/env-options.js","./lib/cli-options":"./lib/cli-options.js","./lib/cli-options.js":"./lib/cli-options.js","./package.json":"./package.json"},"scripts":{"dts-check":"tsc --project tests/types/tsconfig.json","lint":"standard","pretest":"npm run lint && npm run dts-check","test":"tap run --allow-empty-coverage --disable-coverage --timeout=60000","test:coverage":"tap run --show-full-coverage --timeout=60000 --coverage-report=lcov","prerelease":"npm test","release":"standard-version"},"repository":{"type":"git","url":"git://github.com/motdotla/dotenv.git"},"homepage":"https://github.com/motdotla/dotenv#readme","funding":"https://dotenvx.com","keywords":["dotenv","env",".env","environment","variables","config","settings"],"readmeFilename":"README.md","license":"BSD-2-Clause","devDependencies":{"@types/node":"^18.11.3","decache":"^4.6.2","sinon":"^14.0.1","standard":"^17.0.0","standard-version":"^9.5.0","tap":"^19.2.0","typescript":"^4.8.4"},"engines":{"node":">=12"},"browser":{"fs":false}}');
    }
}, __webpack_module_cache__ = {};
function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (void 0 !== cachedModule) return cachedModule.exports;
    var module = __webpack_module_cache__[moduleId] = {
        exports: {}
    };
    return __webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__), module.exports;
}
__webpack_require__.n = (module)=>{
    var getter = module && module.__esModule ? ()=>module.default : ()=>module;
    return __webpack_require__.d(getter, {
        a: getter
    }), getter;
}, __webpack_require__.d = (exports, definition)=>{
    for(var key in definition)__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key) && Object.defineProperty(exports, key, {
        enumerable: !0,
        get: definition[key]
    });
}, __webpack_require__.o = (obj, prop)=>Object.prototype.hasOwnProperty.call(obj, prop), __webpack_require__.r = (exports)=>{
    'undefined' != typeof Symbol && Symbol.toStringTag && Object.defineProperty(exports, Symbol.toStringTag, {
        value: 'Module'
    }), Object.defineProperty(exports, '__esModule', {
        value: !0
    });
};
var provider_helpers_namespaceObject = {};
__webpack_require__.r(provider_helpers_namespaceObject), __webpack_require__.d(provider_helpers_namespaceObject, {
    createDevServer: ()=>devServer_createDevServer,
    formatStats: ()=>formatStats,
    getChainUtils: ()=>getChainUtils,
    getConfigUtils: ()=>getConfigUtils,
    getHTMLPlugin: ()=>getHTMLPlugin,
    getStatsOptions: ()=>getStatsOptions,
    initRsbuildConfig: ()=>initRsbuildConfig,
    inspectConfig: ()=>inspectConfig,
    modifyBundlerChain: ()=>modifyBundlerChain,
    prettyTime: ()=>prettyTime,
    registerBuildHook: ()=>registerBuildHook,
    registerDevHook: ()=>registerDevHook,
    setCssExtractPlugin: ()=>setCssExtractPlugin,
    setHTMLPlugin: ()=>setHTMLPlugin
});
var main = __webpack_require__("../../node_modules/.pnpm/dotenv@16.5.0/node_modules/dotenv/lib/main.js"), lib_main = __webpack_require__("../../node_modules/.pnpm/dotenv-expand@12.0.2/node_modules/dotenv-expand/lib/main.js"), cjs = __webpack_require__("../../node_modules/.pnpm/deepmerge@4.3.1/node_modules/deepmerge/dist/cjs.js"), cjs_default = __webpack_require__.n(cjs);
let constants_filename = (0, __WEBPACK_EXTERNAL_MODULE_node_url_e96de089__.fileURLToPath)(import.meta.url), constants_dirname = (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.dirname)(constants_filename), ROOT_DIST_DIR = 'dist', LOADER_PATH = (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.join)(constants_dirname), STATIC_PATH = (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.join)(constants_dirname, '../static'), COMPILED_PATH = (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.join)(constants_dirname, '../compiled'), RSBUILD_OUTPUTS_PATH = '.rsbuild', DEFAULT_DEV_HOST = '0.0.0.0', DEFAULT_ASSET_PREFIX = '/', DEFAULT_WEB_BROWSERSLIST = [
    'chrome >= 87',
    'edge >= 88',
    'firefox >= 78',
    'safari >= 14'
], DEFAULT_BROWSERSLIST = {
    web: DEFAULT_WEB_BROWSERSLIST,
    'web-worker': DEFAULT_WEB_BROWSERSLIST,
    node: [
        'node >= 16'
    ]
}, HTML_REGEX = /\.html$/, JS_REGEX = /\.(?:js|mjs|cjs|jsx)$/, SCRIPT_REGEX = /\.(?:js|jsx|mjs|cjs|ts|tsx|mts|cts)$/, CSS_REGEX = /\.css$/, NODE_MODULES_REGEX = /[\\/]node_modules[\\/]/, PLUGIN_SWC_NAME = 'rsbuild:swc', PLUGIN_CSS_NAME = 'rsbuild:css', FONT_EXTENSIONS = [
    'woff',
    'woff2',
    'eot',
    'ttf',
    'otf',
    'ttc'
], IMAGE_EXTENSIONS = [
    'png',
    'jpg',
    'jpeg',
    'pjpeg',
    'pjp',
    'gif',
    'bmp',
    'webp',
    'ico',
    'apng',
    'avif',
    'tif',
    'tiff',
    'jfif',
    'cur'
], VIDEO_EXTENSIONS = [
    'mp4',
    'webm',
    'ogg',
    'mov'
], AUDIO_EXTENSIONS = [
    'mp3',
    'wav',
    'flac',
    'aac',
    'm4a',
    'opus'
], isDebug = ()=>{
    if (!process.env.DEBUG) return !1;
    let values = process.env.DEBUG.toLocaleLowerCase().split(',');
    return [
        'rsbuild',
        'builder',
        '*'
    ].some((key)=>values.includes(key));
};
isDebug() && (__WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.level = 'verbose'), __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.override({
    debug: (message, ...args)=>{
        if ('verbose' !== __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.level) return;
        let time = __WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.gray(`${function() {
            let now = new Date(), hours = String(now.getHours()).padStart(2, '0'), minutes = String(now.getMinutes()).padStart(2, '0'), seconds = String(now.getSeconds()).padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        }()}`);
        console.log(`  ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.magenta('rsbuild')} ${time} ${message}`, ...args);
    }
});
let getCompiledPath = (packageName)=>(0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.join)(COMPILED_PATH, packageName, 'index.js'), ensureAbsolutePath = (base, filePath)=>(0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.isAbsolute)(filePath) ? filePath : (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.join)(base, filePath), getPathnameFromUrl = (publicPath)=>{
    try {
        return publicPath ? new URL(publicPath).pathname : publicPath;
    } catch (err) {
        return publicPath;
    }
}, dedupeNestedPaths = (paths)=>paths.sort((p1, p2)=>p2.length > p1.length ? -1 : 1).reduce((prev, curr)=>prev.find((p)=>curr.startsWith(p) || curr === p) ? prev : prev.concat(curr), []), toPosixPath = (filepath)=>'/' === __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.sep ? filepath : filepath.replace(/\\/g, '/'), isFileSync = (filePath)=>{
    try {
        var _fs_statSync;
        return null == (_fs_statSync = __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.default.statSync(filePath, {
            throwIfNoEntry: !1
        })) ? void 0 : _fs_statSync.isFile();
    } catch (_) {
        return !1;
    }
}, findExists = (files)=>{
    for (let file of files)if (isFileSync(file)) return file;
    return !1;
};
async function pathExists(path) {
    return __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.default.promises.access(path).then(()=>!0).catch(()=>!1);
}
async function isFileExists(file) {
    return __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.default.promises.access(file, __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.default.constants.F_OK).then(()=>!0).catch(()=>!1);
}
async function fileExistsByCompilation({ inputFileSystem }, filePath) {
    return new Promise((resolve)=>{
        if (!inputFileSystem) return void resolve(!1);
        inputFileSystem.stat(filePath, (err, stats)=>{
            err ? resolve(!1) : resolve(!!(null == stats ? void 0 : stats.isFile()));
        });
    });
}
async function emptyDir(dir, keep = [], checkExists = !0) {
    if (!checkExists || await pathExists(dir)) try {
        let entries = await __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.default.promises.readdir(dir, {
            withFileTypes: !0
        });
        await Promise.all(entries.map(async (entry)=>{
            let fullPath = __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.join(dir, entry.name);
            !keep.some((reg)=>reg.test(toPosixPath(fullPath))) && (entry.isDirectory() ? (await emptyDir(fullPath, keep, !1), keep.length || await __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.default.promises.rmdir(fullPath)) : await __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.default.promises.unlink(fullPath));
        }));
    } catch (err) {
        __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug(`failed to empty dir: ${dir}`), __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug(err);
    }
}
let formatFileName = (fileName)=>/:\d+:\d+/.test(fileName) ? `File: ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.cyan(fileName)}\n` : `File: ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.cyan(`${fileName}:1:1`)}\n`, hintNodePolyfill = (message)=>{
    let getTips = (moduleName)=>{
        let tips = [
            `Error: "${moduleName}" is a built-in Node.js module and cannot be imported in client-side code.\n`,
            'Solution: Check if you need to import Node.js module.',
            '  - If not needed, remove the import.',
            `  - If needed, use "${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('@rsbuild/plugin-node-polyfill')}" to polyfill it. (See ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('https://npmjs.com/package/@rsbuild/plugin-node-polyfill')})`
        ];
        return `${message}\n\n${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.red(tips.join('\n'))}`;
    };
    if (message.includes('need an additional plugin to handle "node:" URIs')) return getTips('node:*');
    if (!message.includes("Can't resolve")) return message;
    let matchArray = message.match(/Can't resolve '(\w+)'/);
    if (!matchArray) return message;
    let moduleName = matchArray[1];
    return moduleName && [
        'assert',
        'buffer',
        'child_process',
        'cluster',
        'console',
        'constants',
        'crypto',
        'dgram',
        'dns',
        'domain',
        'events',
        'fs',
        'http',
        'https',
        'module',
        'net',
        'os',
        'path',
        'punycode',
        'process',
        'querystring',
        'readline',
        'repl',
        'stream',
        '_stream_duplex',
        '_stream_passthrough',
        '_stream_readable',
        '_stream_transform',
        '_stream_writable',
        'string_decoder',
        'sys',
        'timers',
        'tls',
        'tty',
        'url',
        'util',
        'vm',
        'zlib'
    ].includes(moduleName) ? getTips(moduleName) : message;
};
function formatMessage(stats, verbose) {
    let message, lines = [];
    if ('object' == typeof stats) {
        let fileName = function(stats) {
            if (stats.moduleIdentifier) {
                let matched = stats.moduleIdentifier.match(/(?:\!|^)([^!]+)$/);
                if (matched) {
                    let fileName = matched.pop();
                    if (fileName) return formatFileName(fileName);
                }
            }
            let file = stats.file || stats.moduleName;
            return file ? formatFileName(file) : '';
        }(stats), mainMessage = stats.message, details = verbose && stats.details ? `\nDetails: ${stats.details}\n` : '', stack = verbose && stats.stack ? `\n${stats.stack}` : '', moduleTrace = function(stats) {
            let traceStr = '';
            if (stats.moduleTrace) for (let trace of stats.moduleTrace)trace.originName && (traceStr += `\n @ ${trace.originName}`);
            return traceStr;
        }(stats);
        message = `${fileName}${mainMessage}${details}${stack}${moduleTrace}`;
    } else message = stats;
    let innerError = '-- inner error --';
    return !verbose && message.includes(innerError) && (message = message.split(innerError)[0]), (message = (message = hintNodePolyfill(message = function(message) {
        let hint = 'You may need an appropriate loader to handle this file type.';
        if (-1 === message.indexOf(hint)) return message;
        let createPluginHint = (packageName, keyword)=>`To enable support for ${keyword}, use "${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(`@rsbuild/plugin-${packageName}`)}" ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim(`(https://npmjs.com/package/@rsbuild/plugin-${packageName})`)}.`;
        for (let plugin of [
            {
                test: /File: .+\.s(c|a)ss/,
                hint: createPluginHint('sass', 'Sass')
            },
            {
                test: /File: .+\.less/,
                hint: createPluginHint('less', 'Less')
            },
            {
                test: /File: .+\.styl(us)?/,
                hint: createPluginHint('stylus', 'Stylus')
            },
            {
                test: /File: .+\.vue?/,
                hint: createPluginHint('vue', 'Vue')
            },
            {
                test: /File: .+\.svelte?/,
                hint: createPluginHint('svelte', 'Svelte')
            },
            {
                test: /File: .+\.mdx/,
                hint: createPluginHint('mdx', 'MDX')
            },
            {
                test: /File: .+\.toml/,
                hint: createPluginHint('toml', 'TOML')
            },
            {
                test: /File: .+\.yaml/,
                hint: createPluginHint('yaml', 'YAML')
            }
        ])if (plugin.test.test(message)) return message.replace(hint, plugin.hint);
        return message;
    }(message))).split('\n').filter((line, index, arr)=>0 === index || '' !== line.trim() || line.trim() !== arr[index - 1].trim()).join('\n')).trim();
}
function formatStatsMessages(stats, verbose) {
    var _stats_errors, _stats_warnings;
    return {
        errors: (null == (_stats_errors = stats.errors) ? void 0 : _stats_errors.map((error)=>formatMessage(error, verbose))) || [],
        warnings: (null == (_stats_warnings = stats.warnings) ? void 0 : _stats_warnings.map((warning)=>formatMessage(warning, verbose))) || []
    };
}
let getAllStatsErrors = (statsData)=>{
    var _statsData_errors, _statsData_children;
    return statsData.errorsCount && (null == (_statsData_errors = statsData.errors) ? void 0 : _statsData_errors.length) === 0 ? null == (_statsData_children = statsData.children) ? void 0 : _statsData_children.reduce((errors, curr)=>errors.concat(curr.errors || []), []) : statsData.errors;
}, getAllStatsWarnings = (statsData)=>{
    var _statsData_warnings, _statsData_children;
    return statsData.warningsCount && (null == (_statsData_warnings = statsData.warnings) ? void 0 : _statsData_warnings.length) === 0 ? null == (_statsData_children = statsData.children) ? void 0 : _statsData_children.reduce((warnings, curr)=>warnings.concat(curr.warnings || []), []) : statsData.warnings;
};
function getStatsOptions(compiler) {
    if (helpers_isMultiCompiler(compiler)) return {
        children: compiler.compilers.map((compiler)=>compiler.options ? compiler.options.stats : void 0)
    };
    let { stats } = compiler.options;
    return 'string' == typeof stats ? {
        preset: stats
    } : 'object' == typeof stats ? stats : {};
}
function formatStats(statsData, hasErrors) {
    let verbose = 'verbose' === __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.level;
    if (hasErrors) {
        let { errors } = formatStatsMessages({
            errors: getAllStatsErrors(statsData),
            warnings: []
        }, verbose);
        return {
            message: function(errors) {
                let title = __WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.bold(__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.red(errors.length > 1 ? 'Build errors: ' : 'Build error: '));
                if (!errors.length) return `${title}\n${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow("For more details, please setting 'stats.errors: true' ")}`;
                let text = `${errors.join('\n\n')}\n`;
                return `${title}\n${text}`;
            }(errors),
            level: 'error'
        };
    }
    let { warnings } = formatStatsMessages({
        errors: [],
        warnings: getAllStatsWarnings(statsData)
    }, verbose);
    if (warnings.length) {
        let title = __WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.bold(__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(warnings.length > 1 ? 'Build warnings: \n' : 'Build warning: \n'));
        return {
            message: `${title}${warnings.join('\n\n')}\n`,
            level: 'warning'
        };
    }
    return {};
}
let rspackMinVersion = '1.2.4', getNodeEnv = ()=>process.env.NODE_ENV, setNodeEnv = (env)=>{
    process.env.NODE_ENV = env;
}, isFunction = (func)=>'function' == typeof func, isObject = (obj)=>'[object Object]' === Object.prototype.toString.call(obj), isPlainObject = (obj)=>null !== obj && 'object' == typeof obj && Object.getPrototypeOf(obj) === Object.prototype, castArray = (arr)=>void 0 === arr ? [] : Array.isArray(arr) ? arr : [
        arr
    ], cloneDeep = (value)=>null == value ? value : cjs_default()({}, value, {
        isMergeableObject: isPlainObject
    }), compareSemver = (version1, version2)=>{
    let parts1 = version1.split('.').map(Number), parts2 = version2.split('.').map(Number), len = Math.max(parts1.length, parts2.length);
    for(let i = 0; i < len; i++){
        let item1 = parts1[i] ?? 0, item2 = parts2[i] ?? 0;
        if (item1 > item2) return 1;
        if (item1 < item2) return -1;
    }
    return 0;
}, isSatisfyRspackVersion = async (originalVersion)=>{
    let version = originalVersion;
    return version.includes('-canary') && (version = version.split('-canary')[0]), !(version && /^[\d\.]+$/.test(version)) || compareSemver(version, rspackMinVersion) >= 0;
}, removeLeadingSlash = (s)=>s.replace(/^\/+/, ''), removeTailingSlash = (s)=>s.replace(/\/+$/, ''), addTrailingSlash = (s)=>s.endsWith('/') ? s : `${s}/`, formatPublicPath = (publicPath, withSlash = !0)=>'auto' === publicPath ? publicPath : withSlash ? addTrailingSlash(publicPath) : removeTailingSlash(publicPath), getPublicPathFromChain = (chain, withSlash = !0)=>{
    let publicPath = chain.output.get('publicPath');
    return 'string' == typeof publicPath ? formatPublicPath(publicPath, withSlash) : formatPublicPath(DEFAULT_ASSET_PREFIX, withSlash);
}, getPublicPathFromCompiler = (compiler)=>{
    let { publicPath } = compiler.options.output;
    return 'string' == typeof publicPath ? 'auto' === publicPath ? '' : publicPath.endsWith('/') ? publicPath : `${publicPath}/` : DEFAULT_ASSET_PREFIX;
}, urlJoin = (base, path)=>{
    let [urlProtocol, baseUrl] = base.split('://');
    return `${urlProtocol}://${__WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.posix.join(baseUrl, path)}`;
}, canParse = (url)=>{
    try {
        return new __WEBPACK_EXTERNAL_MODULE_node_url_e96de089__.URL(url), !0;
    } catch  {
        return !1;
    }
}, ensureAssetPrefix = (url, assetPrefix = DEFAULT_ASSET_PREFIX)=>url.startsWith('//') || canParse(url) || 'auto' === assetPrefix || 'function' == typeof assetPrefix ? url : assetPrefix.startsWith('http') ? urlJoin(assetPrefix, url) : assetPrefix.startsWith('//') ? urlJoin(`https:${assetPrefix}`, url).replace('https:', '') : __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.posix.join(assetPrefix, url);
function getFilename(config, type, isProd, isServer) {
    let { filename, filenameHash } = config.output, hash = 'string' == typeof filenameHash ? filenameHash ? `.[${filenameHash}]` : '' : filenameHash ? '.[contenthash:8]' : '';
    switch(type){
        case 'js':
            return filename.js ?? `[name]${isProd && !isServer ? hash : ''}.js`;
        case 'css':
            return filename.css ?? `[name]${isProd ? hash : ''}.css`;
        case 'svg':
            return filename.svg ?? `[name]${hash}.svg`;
        case 'font':
            return filename.font ?? `[name]${hash}[ext]`;
        case 'image':
            return filename.image ?? `[name]${hash}[ext]`;
        case 'media':
            return filename.media ?? `[name]${hash}[ext]`;
        case 'assets':
            return filename.assets ?? `[name]${hash}[ext]`;
        default:
            throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:config]')} unknown key ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(type)} in ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('output.filename')}`);
    }
}
let applyToCompiler = (compiler, apply)=>{
    helpers_isMultiCompiler(compiler) ? compiler.compilers.forEach(apply) : apply(compiler, 0);
}, upperFirst = (str)=>str ? str.charAt(0).toUpperCase() + str.slice(1) : '', isURL = (str)=>str.startsWith('http') || str.startsWith('//:'), createVirtualModule = (content)=>`data:text/javascript,${content}`, helpers_isMultiCompiler = (compiler)=>'compilers' in compiler && Array.isArray(compiler.compilers);
function pick(obj, keys) {
    return keys.reduce((ret, key)=>(void 0 !== obj[key] && (ret[key] = obj[key]), ret), {});
}
let camelCase = (input)=>input.replace(/[-_](\w)/g, (_, c)=>c.toUpperCase()), prettyTime = (seconds)=>{
    let format = (time)=>__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.bold(time);
    if (seconds < 10) {
        let digits = seconds >= 0.01 ? 2 : 3;
        return `${format(seconds.toFixed(digits))} s`;
    }
    if (seconds < 60) return `${format(seconds.toFixed(1))} s`;
    let minutes = seconds / 60;
    return `${format(minutes.toFixed(2))} m`;
}, isTTY = (type = 'stdout')=>('stdin' === type ? process.stdin.isTTY : process.stdout.isTTY) && !process.env.CI, addCompilationError = (compilation, message)=>{
    compilation.errors.push(new compilation.compiler.webpack.WebpackError(message));
};
function loadEnv({ cwd = process.cwd(), mode = getNodeEnv(), prefixes = [
    'PUBLIC_'
], processEnv = process.env } = {}) {
    if ('local' === mode) throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:loadEnv]')} ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('local')} cannot be used as a value for env mode, because ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('.env.local')} represents a temporary local file. Please use another value.`);
    let filePaths = [
        '.env',
        '.env.local',
        `.env.${mode}`,
        `.env.${mode}.local`
    ].map((filename)=>(0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.join)(cwd, filename)).filter(isFileSync), parsed = {};
    for (let envPath of filePaths)Object.assign(parsed, (0, main.parse)(__WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.default.readFileSync(envPath))), __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug('loaded env file:', envPath);
    parsed.NODE_ENV && (processEnv.NODE_ENV = parsed.NODE_ENV), (0, lib_main.expand)({
        parsed,
        processEnv
    });
    let publicVars = {}, rawPublicVars = {};
    for (let key of Object.keys(processEnv))if (prefixes.some((prefix)=>key.startsWith(prefix))) {
        let val = processEnv[key];
        publicVars[`import.meta.env.${key}`] = JSON.stringify(val), publicVars[`process.env.${key}`] = JSON.stringify(val), rawPublicVars[key] = val;
    }
    let cleaned = !1;
    return {
        parsed,
        cleanup: ()=>{
            if (!cleaned) {
                for (let key of Object.keys(parsed))'NODE_ENV' !== key && processEnv[key] === parsed[key] && delete processEnv[key];
                cleaned = !0;
            }
        },
        filePaths,
        publicVars,
        rawPublicVars
    };
}
class BrowserslistError extends Error {
    constructor(message){
        var key, value;
        super(message), value = void 0, (key = "browserslist") in this ? Object.defineProperty(this, key, {
            value: value,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : this[key] = value, this.name = 'BrowserslistError', this.browserslist = !0, Error.captureStackTrace && Error.captureStackTrace(this, BrowserslistError);
    }
}
let isFileCache = {};
function isFile(file) {
    if (file in isFileCache) return isFileCache[file];
    let result = __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.default.existsSync(file) && __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.default.statSync(file).isFile();
    return isFileCache[file] = result, result;
}
function parsePackage(file) {
    let config = JSON.parse(__WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.default.readFileSync(file).toString().replace(/^\uFEFF/m, ''));
    if (config.browserlist && !config.browserslist) throw new BrowserslistError(`\`browserlist\` key instead of \`browserslist\` in ${file}`);
    let list = config.browserslist;
    for(let i in Array.isArray(list) && (list = {
        defaults: list
    }), 'string' == typeof list && (list = parseConfig(list)), list){
        var section = list[i];
        let FORMAT = 'Browserslist config should be a string or an array of strings with browser queries';
        if (Array.isArray(section)) {
            for(let i = 0; i < section.length; i++)if ('string' != typeof section[i]) throw new BrowserslistError(FORMAT);
        } else if ('string' != typeof section) throw new BrowserslistError(FORMAT);
    }
    return list;
}
let IS_SECTION = /^\s*\[(.+)]\s*$/;
function parseConfig(string) {
    let result = {
        defaults: []
    }, sections = [
        'defaults'
    ];
    return string.toString().replace(/#[^\n]*/g, '').split(/\n|,/).map((line)=>line.trim()).filter((line)=>'' !== line).forEach((line)=>{
        let matched = line.match(IS_SECTION);
        matched ? (sections = matched[1].trim().split(' ')).forEach((section)=>{
            if (result[section]) throw new BrowserslistError(`Duplicate section ${section} in Browserslist config`);
            result[section] = [];
        }) : sections.forEach((section)=>{
            result[section].push(line);
        });
    }), result;
}
function parsePackageOrReadConfig(file) {
    if ('package.json' === __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.basename(file)) return parsePackage(file);
    if (!isFile(file)) throw new BrowserslistError(`Can't read ${file} config`);
    return parseConfig(__WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.default.readFileSync(file, 'utf-8'));
}
function pickEnv(config, opts) {
    let name;
    return 'object' != typeof config ? config : config['string' == typeof opts.env ? opts.env : process.env.BROWSERSLIST_ENV ? process.env.BROWSERSLIST_ENV : process.env.NODE_ENV ? process.env.NODE_ENV : 'production'] || config.defaults;
}
function eachParent(file, callback) {
    let dir = isFile(file) ? __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.dirname(file) : file, loc = __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.resolve(dir);
    do {
        let result = callback(loc);
        if (void 0 !== result) return result;
    }while (loc !== (loc = __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.dirname(loc)));
}
let configCache = {}, OVERRIDE_PATHS = [
    'performance.removeConsole',
    'output.inlineScripts',
    'output.inlineStyles',
    'output.cssModules.auto',
    'output.overrideBrowserslist',
    'server.open',
    'server.printUrls',
    'resolve.extensions',
    'provider'
], isOverridePath = (key)=>{
    if (key.startsWith('environments.')) {
        let realKey = key.split('.').slice(2).join('.');
        return OVERRIDE_PATHS.includes(realKey);
    }
    return OVERRIDE_PATHS.includes(key) || key.startsWith('output.filename.');
}, merge = (x, y, path = '')=>{
    if (isOverridePath(path)) return y ?? x;
    if (void 0 === x) return isPlainObject(y) ? cloneDeep(y) : y;
    if (void 0 === y) return isPlainObject(x) ? cloneDeep(x) : x;
    if ('boolean' == typeof x || 'boolean' == typeof y) return y;
    let pair = [
        x,
        y
    ];
    if (pair.some(Array.isArray)) return 'output.copy' !== path || pair.every(Array.isArray) ? [
        ...castArray(x),
        ...castArray(y)
    ] : Array.isArray(x) ? merge({
        patterns: x
    }, y, path) : merge(x, {
        patterns: y
    }, path);
    if (pair.some(isFunction)) return pair;
    if (!isPlainObject(x) || !isPlainObject(y)) return y;
    let merged = {};
    for (let key of new Set([
        ...Object.keys(x),
        ...Object.keys(y)
    ])){
        let childPath = path ? `${path}.${key}` : key;
        merged[key] = merge(x[key], y[key], childPath);
    }
    return merged;
}, mergeRsbuildConfig = (...configs)=>2 === configs.length ? merge(configs[0], configs[1]) : configs.length < 2 ? configs[0] : configs.reduce((result, config)=>merge(result, config), {}), defaultConfig_require = (0, __WEBPACK_EXTERNAL_MODULE_node_module_ab9f2194__.createRequire)(import.meta.url), getDefaultDevConfig = ()=>({
        hmr: !0,
        liveReload: !0,
        watchFiles: [],
        assetPrefix: DEFAULT_ASSET_PREFIX,
        writeToDisk: !1,
        cliShortcuts: !1,
        client: {
            path: '/rsbuild-hmr',
            port: '',
            host: '',
            overlay: !0,
            reconnect: 100
        }
    }), defaultAllowedOrigins = /^https?:\/\/(?:(?:[^:]+\.)?localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/, getDefaultServerConfig = ()=>({
        port: 3000,
        host: DEFAULT_DEV_HOST,
        open: !1,
        base: '/',
        htmlFallback: 'index',
        compress: !0,
        printUrls: !0,
        strictPort: !1,
        cors: {
            origin: defaultAllowedOrigins
        },
        middlewareMode: !1
    }), getDefaultSourceConfig = ()=>({
        define: {},
        preEntry: [],
        decorators: {
            version: '2022-03'
        }
    }), getDefaultHtmlConfig = ()=>({
        meta: {
            charset: {
                charset: 'UTF-8'
            },
            viewport: 'width=device-width, initial-scale=1.0'
        },
        title: 'Rsbuild App',
        inject: 'head',
        mountId: 'root',
        crossorigin: !1,
        outputStructure: 'flat',
        scriptLoading: 'defer'
    }), getDefaultSecurityConfig = ()=>({
        nonce: '',
        sri: {
            enable: !1
        }
    }), getDefaultToolsConfig = ()=>({
        cssExtract: {
            loaderOptions: {},
            pluginOptions: {
                ignoreOrder: !0
            }
        }
    }), getDefaultPerformanceConfig = ()=>({
        profile: !1,
        printFileSize: !0,
        removeConsole: !1,
        removeMomentLocale: !1,
        chunkSplit: {
            strategy: 'split-by-experience'
        }
    }), getDefaultOutputConfig = ()=>({
        target: 'web',
        cleanDistPath: 'auto',
        distPath: {
            root: ROOT_DIST_DIR,
            css: 'static/css',
            svg: 'static/svg',
            font: 'static/font',
            html: './',
            wasm: 'static/wasm',
            image: 'static/image',
            media: 'static/media',
            assets: 'static/assets'
        },
        assetPrefix: DEFAULT_ASSET_PREFIX,
        filename: {},
        charset: 'utf8',
        polyfill: 'off',
        dataUriLimit: {
            svg: 4096,
            font: 4096,
            image: 4096,
            media: 4096,
            assets: 4096
        },
        legalComments: 'linked',
        injectStyles: !1,
        minify: !0,
        manifest: !1,
        sourceMap: {
            js: void 0,
            css: !1
        },
        filenameHash: !0,
        inlineScripts: !1,
        inlineStyles: !1,
        cssModules: {
            auto: !0,
            namedExport: !1,
            exportGlobals: !1,
            exportLocalsConvention: 'camelCase'
        },
        emitAssets: !0
    }), getDefaultResolveConfig = ()=>(swcHelpersPath || (swcHelpersPath = (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.dirname)(defaultConfig_require.resolve('@swc/helpers/package.json'))), {
        alias: {
            '@swc/helpers': swcHelpersPath
        },
        aliasStrategy: 'prefer-tsconfig',
        extensions: [
            '.ts',
            '.tsx',
            '.mjs',
            '.js',
            '.jsx',
            '.json'
        ]
    }), createDefaultConfig = ()=>({
        dev: getDefaultDevConfig(),
        server: getDefaultServerConfig(),
        html: getDefaultHtmlConfig(),
        resolve: getDefaultResolveConfig(),
        source: getDefaultSourceConfig(),
        output: getDefaultOutputConfig(),
        tools: getDefaultToolsConfig(),
        security: getDefaultSecurityConfig(),
        performance: getDefaultPerformanceConfig(),
        environments: {}
    }), withDefaultConfig = async (rootPath, config)=>{
    var _merged_server, _config_dev, _config_output;
    let merged = mergeRsbuildConfig(createDefaultConfig(), config);
    if (merged.root ||= rootPath, merged.source ||= {}, (null == (_merged_server = merged.server) ? void 0 : _merged_server.base) && ((null == (_config_dev = config.dev) ? void 0 : _config_dev.assetPrefix) === void 0 && (merged.dev ||= {}, merged.dev.assetPrefix = merged.server.base), (null == (_config_output = config.output) ? void 0 : _config_output.assetPrefix) === void 0 && (merged.output ||= {}, merged.output.assetPrefix = merged.server.base)), !merged.source.tsconfigPath) {
        let tsconfigPath = (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.join)(rootPath, 'tsconfig.json');
        await isFileExists(tsconfigPath) && (merged.source.tsconfigPath = tsconfigPath);
    }
    return merged;
}, normalizeConfig = (config)=>{
    let mergedConfig = mergeRsbuildConfig({
        ...createDefaultConfig(),
        mode: (()=>{
            if (config.mode) return config.mode;
            let nodeEnv = getNodeEnv();
            return 'production' === nodeEnv || 'development' === nodeEnv ? nodeEnv : 'none';
        })()
    }, config), { watchFiles } = mergedConfig.dev;
    return Array.isArray(watchFiles) || (mergedConfig.dev.watchFiles = [
        watchFiles
    ]), mergedConfig;
}, normalizePublicDirs = (publicDir)=>{
    if (!1 === publicDir) return [];
    let defaultConfig = {
        name: 'public',
        copyOnBuild: 'auto',
        watch: !1
    };
    return void 0 === publicDir ? [
        defaultConfig
    ] : Array.isArray(publicDir) ? publicDir.map((options)=>({
            ...defaultConfig,
            ...options
        })) : [
        {
            ...defaultConfig,
            ...publicDir
        }
    ];
}, RSBUILD_ALL_ENVIRONMENT_SYMBOL = 'RSBUILD_ALL_ENVIRONMENT_SYMBOL', isPluginMatchEnvironment = (pluginEnvironment, currentEnvironment)=>pluginEnvironment === currentEnvironment || pluginEnvironment === RSBUILD_ALL_ENVIRONMENT_SYMBOL, pluginDagSort = (plugins)=>{
    let allLines = [];
    function getPlugin(name) {
        let targets = plugins.filter((item)=>item.instance.name === name);
        if (!targets.length) throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:plugin]')} Plugin "${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(name)}" not existed`);
        return targets;
    }
    for (let plugin of plugins){
        if (plugin.instance.pre) for (let pre of plugin.instance.pre)pre && plugins.some((item)=>item.instance.name === pre) && allLines.push([
            pre,
            plugin.instance.name
        ]);
        if (plugin.instance.post) for (let post of plugin.instance.post)post && plugins.some((item)=>item.instance.name === post) && allLines.push([
            plugin.instance.name,
            post
        ]);
    }
    let zeroEndPoints = plugins.filter((item)=>!allLines.find((l)=>l[1] === item.instance.name)), sortedPoint = [];
    for(; zeroEndPoints.length;){
        let zep = zeroEndPoints.shift();
        sortedPoint.push(...getPlugin(zep.instance.name)), allLines = allLines.filter((l)=>l[0] !== getPlugin(zep.instance.name)[0].instance.name), zeroEndPoints = plugins.filter((item)=>!sortedPoint.find((sp)=>sp.instance.name === item.instance.name)).filter((item)=>!allLines.find((l)=>l[1] === item.instance.name));
    }
    if (allLines.length) {
        let restInRingPoints = {};
        for (let l of allLines)restInRingPoints[l[0]] = !0, restInRingPoints[l[1]] = !0;
        throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:plugin]')} Plugins dependencies has loop: ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(Object.keys(restInRingPoints).join(','))}`);
    }
    return sortedPoint;
};
async function initPlugins({ getPluginAPI, pluginManager }) {
    __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug('init plugins');
    let plugins = pluginDagSort(pluginManager.getAllPluginsWithMeta()), removedPlugins = plugins.reduce((ret, plugin)=>(plugin.instance.remove && (ret[plugin.environment] ??= [], ret[plugin.environment].push(...plugin.instance.remove)), ret), {});
    for (let plugin of plugins){
        var _removedPlugins_plugin_environment, _removedPlugins_RSBUILD_ALL_ENVIRONMENT_SYMBOL;
        let isGlobalPlugin = 'RSBUILD_ALL_ENVIRONMENT_SYMBOL' === plugin.environment;
        if ((null == (_removedPlugins_plugin_environment = removedPlugins[plugin.environment]) ? void 0 : _removedPlugins_plugin_environment.includes(plugin.instance.name)) || !isGlobalPlugin && (null == (_removedPlugins_RSBUILD_ALL_ENVIRONMENT_SYMBOL = removedPlugins[RSBUILD_ALL_ENVIRONMENT_SYMBOL]) ? void 0 : _removedPlugins_RSBUILD_ALL_ENVIRONMENT_SYMBOL.includes(plugin.instance.name))) continue;
        let { instance, environment } = plugin;
        await instance.setup(getPluginAPI(environment));
    }
    __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug('init plugins done');
}
function createEnvironmentAsyncHook() {
    let preGroup = [], postGroup = [], defaultGroup = [], tapEnvironment = ({ environment, handler: cb })=>{
        isFunction(cb) ? defaultGroup.push({
            environment,
            handler: cb
        }) : 'pre' === cb.order ? preGroup.push({
            environment,
            handler: cb.handler
        }) : 'post' === cb.order ? postGroup.push({
            environment,
            handler: cb.handler
        }) : defaultGroup.push({
            environment,
            handler: cb.handler
        });
    };
    return {
        tapEnvironment,
        tap: (handler)=>tapEnvironment({
                handler
            }),
        callChain: async ({ environment, args: params })=>{
            for (let callback of [
                ...preGroup,
                ...defaultGroup,
                ...postGroup
            ]){
                if (callback.environment && environment && !isPluginMatchEnvironment(callback.environment, environment)) continue;
                let result = await callback.handler(...params);
                void 0 !== result && (params[0] = result);
            }
            return params;
        },
        callBatch: async ({ environment, args: params })=>{
            let results = [];
            for (let callback of [
                ...preGroup,
                ...defaultGroup,
                ...postGroup
            ]){
                if (callback.environment && environment && !isPluginMatchEnvironment(callback.environment, environment)) continue;
                let result = await callback.handler(...params);
                results.push(result);
            }
            return results;
        }
    };
}
function createAsyncHook() {
    let preGroup = [], postGroup = [], defaultGroup = [];
    return {
        tap: (cb)=>{
            isFunction(cb) ? defaultGroup.push(cb) : 'pre' === cb.order ? preGroup.push(cb.handler) : 'post' === cb.order ? postGroup.push(cb.handler) : defaultGroup.push(cb.handler);
        },
        callChain: async (...params)=>{
            for (let callback of [
                ...preGroup,
                ...defaultGroup,
                ...postGroup
            ]){
                let result = await callback(...params);
                void 0 !== result && (params[0] = result);
            }
            return params;
        },
        callBatch: async (...params)=>{
            let results = [];
            for (let callback of [
                ...preGroup,
                ...defaultGroup,
                ...postGroup
            ]){
                let result = await callback(...params);
                results.push(result);
            }
            return results;
        }
    };
}
let onBeforeCompile = ({ compiler, beforeCompile, beforeEnvironmentCompiler, isWatch })=>{
    let name = 'rsbuild:beforeCompile';
    if (helpers_isMultiCompiler(compiler)) {
        let waitBeforeCompileDone, { compilers } = compiler, doneCompilers = 0;
        for(let index = 0; index < compilers.length; index++){
            let compiler = compilers[index], compilerDone = !1;
            (isWatch ? compiler.hooks.watchRun : compiler.hooks.run).tapPromise(name, async ()=>{
                !compilerDone && (compilerDone = !0, doneCompilers++), waitBeforeCompileDone || (waitBeforeCompileDone = null == beforeCompile ? void 0 : beforeCompile()), await waitBeforeCompileDone, await beforeEnvironmentCompiler(index);
            }), compiler.hooks.invalid.tap(name, ()=>{
                compilerDone && (compilerDone = !1, doneCompilers--), doneCompilers <= 0 && (waitBeforeCompileDone = void 0);
            });
        }
    } else (isWatch ? compiler.hooks.watchRun : compiler.hooks.run).tapPromise(name, async ()=>{
        await (null == beforeCompile ? void 0 : beforeCompile()), await beforeEnvironmentCompiler(0);
    });
}, onCompileDone = ({ compiler, onDone, onEnvironmentDone, MultiStatsCtor })=>{
    if (helpers_isMultiCompiler(compiler)) {
        let { compilers } = compiler, compilerStats = [], doneCompilers = 0;
        for(let index = 0; index < compilers.length; index++){
            let compiler = compilers[index], compilerIndex = index, compilerDone = !1;
            compiler.hooks.done.tapPromise('rsbuild:done', async (stats)=>{
                !compilerDone && (compilerDone = !0, doneCompilers++), compilerStats[compilerIndex] = stats;
                let lastCompilerDone = doneCompilers === compilers.length;
                await onEnvironmentDone(index, stats), lastCompilerDone && await onDone(new MultiStatsCtor(compilerStats));
            }), compiler.hooks.invalid.tap('rsbuild:done', ()=>{
                compilerDone && (compilerDone = !1, doneCompilers--);
            });
        }
    } else compiler.hooks.done.tapPromise('rsbuild:done', async (stats)=>{
        await onEnvironmentDone(0, stats), await onDone(stats);
    });
}, registerBuildHook = ({ context, isWatch, compiler, bundlerConfigs, MultiStatsCtor })=>{
    let isFirstCompile = !0, environmentList = Object.values(context.environments).reduce((prev, curr)=>(prev[curr.index] = curr, prev), []), onDone = async (stats)=>{
        let p = context.hooks.onAfterBuild.callBatch({
            isFirstCompile,
            stats,
            environments: context.environments,
            isWatch
        });
        isFirstCompile = !1, await p;
    }, onEnvironmentDone = async (buildIndex, stats)=>{
        await context.hooks.onAfterEnvironmentCompile.callBatch({
            environment: environmentList[buildIndex].name,
            args: [
                {
                    isFirstCompile,
                    stats,
                    environment: environmentList[buildIndex],
                    isWatch
                }
            ]
        });
    };
    onBeforeCompile({
        compiler,
        beforeCompile: async ()=>await context.hooks.onBeforeBuild.callBatch({
                bundlerConfigs,
                environments: context.environments,
                isWatch,
                isFirstCompile
            }),
        beforeEnvironmentCompiler: async (buildIndex)=>await context.hooks.onBeforeEnvironmentCompile.callBatch({
                environment: environmentList[buildIndex].name,
                args: [
                    {
                        bundlerConfig: null == bundlerConfigs ? void 0 : bundlerConfigs[buildIndex],
                        environment: environmentList[buildIndex],
                        isWatch,
                        isFirstCompile
                    }
                ]
            }),
        isWatch
    }), onCompileDone({
        compiler,
        onDone,
        onEnvironmentDone,
        MultiStatsCtor
    });
}, registerDevHook = ({ context, compiler, bundlerConfigs, MultiStatsCtor })=>{
    let isFirstCompile = !0, environmentList = Object.values(context.environments).reduce((prev, curr)=>(prev[curr.index] = curr, prev), []), onDone = async (stats)=>{
        let p = context.hooks.onDevCompileDone.callBatch({
            isFirstCompile,
            stats,
            environments: context.environments
        });
        isFirstCompile = !1, await p;
    }, onEnvironmentDone = async (buildIndex, stats)=>{
        await context.hooks.onAfterEnvironmentCompile.callBatch({
            environment: environmentList[buildIndex].name,
            args: [
                {
                    isFirstCompile,
                    stats,
                    environment: environmentList[buildIndex],
                    isWatch: !0
                }
            ]
        });
    };
    onBeforeCompile({
        compiler,
        beforeEnvironmentCompiler: async (buildIndex)=>await context.hooks.onBeforeEnvironmentCompile.callBatch({
                environment: environmentList[buildIndex].name,
                args: [
                    {
                        bundlerConfig: null == bundlerConfigs ? void 0 : bundlerConfigs[buildIndex],
                        environment: environmentList[buildIndex],
                        isWatch: !0,
                        isFirstCompile
                    }
                ]
            }),
        isWatch: !0
    }), onCompileDone({
        compiler,
        onDone,
        onEnvironmentDone,
        MultiStatsCtor
    });
}, exitHook_callbacks = new Set(), isCalled = !1, isRegistered = !1;
function exit(exitCode, type) {
    if (!isCalled) {
        for (let callback of (isCalled = !0, exitHook_callbacks))callback(exitCode);
        if ('SIGINT' === type) {
            let listeners = __WEBPACK_EXTERNAL_MODULE_node_process_786449bf__.default.listeners('SIGINT');
            Array.isArray(listeners) && listeners.length <= 1 && __WEBPACK_EXTERNAL_MODULE_node_process_786449bf__.default.exit(exitCode);
        }
    }
}
let mapProcessAssetsStage = (compiler, stage)=>{
    let { Compilation } = compiler.webpack;
    switch(stage){
        case 'additional':
            return Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL;
        case 'pre-process':
            return Compilation.PROCESS_ASSETS_STAGE_PRE_PROCESS;
        case 'derived':
            return Compilation.PROCESS_ASSETS_STAGE_DERIVED;
        case 'additions':
            return Compilation.PROCESS_ASSETS_STAGE_ADDITIONS;
        case 'none':
            return Compilation.PROCESS_ASSETS_STAGE_NONE;
        case 'optimize':
            return Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE;
        case 'optimize-count':
            return Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_COUNT;
        case 'optimize-compatibility':
            return Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_COMPATIBILITY;
        case 'optimize-size':
            return Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE;
        case 'dev-tooling':
            return Compilation.PROCESS_ASSETS_STAGE_DEV_TOOLING;
        case 'optimize-inline':
            return Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE;
        case 'summarize':
            return Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE;
        case 'optimize-hash':
            return Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_HASH;
        case 'optimize-transfer':
            return Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_TRANSFER;
        case 'analyse':
            return Compilation.PROCESS_ASSETS_STAGE_ANALYSE;
        case 'report':
            return Compilation.PROCESS_ASSETS_STAGE_REPORT;
        default:
            throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild]')} Invalid process assets stage: ${stage}`);
    }
}, browsersListCache = new Map();
async function getBrowserslist(path) {
    let env = process.env.NODE_ENV, cacheKey = path + env;
    if (browsersListCache.has(cacheKey)) return browsersListCache.get(cacheKey);
    let result = function(opts) {
        if (opts.config) return pickEnv(parsePackageOrReadConfig(opts.config), opts);
        if (opts.path) {
            let config = function(from) {
                let resolved, fromDir = isFile(from = __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.resolve(from)) ? __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.dirname(from) : from;
                if (fromDir in configCache) return configCache[fromDir];
                let configFile = eachParent(from, (dir)=>{
                    let pkgBrowserslist, config = __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.join(dir, 'browserslist'), pkg = __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.join(dir, 'package.json'), rc = __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.join(dir, '.browserslistrc');
                    if (isFile(pkg)) try {
                        pkgBrowserslist = parsePackage(pkg);
                    } catch (e) {
                        if (e instanceof BrowserslistError) throw e;
                        console.warn(`[Browserslist] Could not parse ${pkg}. Ignoring it.`);
                    }
                    if (isFile(config) && pkgBrowserslist) throw new BrowserslistError(`${dir} contains both browserslist and package.json with browsers`);
                    if (isFile(rc) && pkgBrowserslist) throw new BrowserslistError(`${dir} contains both .browserslistrc and package.json with browsers`);
                    if (isFile(config) && isFile(rc)) throw new BrowserslistError(`${dir} contains both .browserslistrc and browserslist`);
                    return isFile(config) ? config : isFile(rc) ? rc : pkgBrowserslist ? pkg : void 0;
                });
                configFile && (resolved = parsePackageOrReadConfig(configFile));
                let configDir = configFile && __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.dirname(configFile);
                return eachParent(from, (dir)=>{
                    if (resolved && (configCache[dir] = resolved), dir === configDir) return null;
                }), resolved;
            }(opts.path);
            if (!config) return;
            return pickEnv(config, opts);
        }
    }({
        path,
        env
    });
    return result ? (browsersListCache.set(cacheKey, result), result) : null;
}
async function getBrowserslistByEnvironment(path, config) {
    let { target, overrideBrowserslist } = config.output;
    if (Array.isArray(overrideBrowserslist)) return overrideBrowserslist;
    if ('web' === target || 'web-worker' === target) {
        let browserslistrc = await getBrowserslist(path);
        if (browserslistrc) return browserslistrc;
    }
    return DEFAULT_BROWSERSLIST[target];
}
let getEnvironmentHTMLPaths = (entry, config)=>'web' !== config.output.target || !1 === config.tools.htmlPlugin ? {} : Object.keys(entry).reduce((prev, key)=>{
        let entryValue = entry[key];
        return ('string' == typeof entryValue || Array.isArray(entryValue) || !1 !== entryValue.html) && (prev[key] = function(entryName, config) {
            let filename;
            filename = config.output.filename.html ? config.output.filename.html.replace('[name]', entryName) : 'flat' === config.html.outputStructure ? `${entryName}.html` : `${entryName}/index.html`;
            let prefix = config.output.distPath.html;
            return prefix.startsWith('/') && __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.warn(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:config]')} Absolute path is not recommended at ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(`output.distPath.html: "${prefix}"`)}, use relative path instead.`), removeLeadingSlash(__WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.posix.join(prefix, filename));
        }(key, config)), prev;
    }, {});
async function updateEnvironmentContext(context, configs) {
    for (let [index, [name, config]] of (context.environments ||= {}, Object.entries(configs).entries())){
        let browserslist = await getBrowserslistByEnvironment(context.rootPath, config), { entry = {}, tsconfigPath } = config.source, htmlPaths = getEnvironmentHTMLPaths(entry, config), environmentContext = {
            index,
            name,
            distPath: function(cwd, config) {
                var _config_output_distPath, _config_output;
                return ensureAbsolutePath(cwd, (null == (_config_output = config.output) || null == (_config_output_distPath = _config_output.distPath) ? void 0 : _config_output_distPath.root) ?? ROOT_DIST_DIR);
            }(context.rootPath, config),
            entry,
            browserslist,
            htmlPaths,
            tsconfigPath,
            config
        };
        context.environments[name] = new Proxy(environmentContext, {
            get: (target, prop)=>target[prop],
            set: (target, prop, newValue)=>('manifest' === prop ? target[prop] = newValue : __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.error(`EnvironmentContext is readonly, you can not assign to the "environment.${prop}" prop.`), !0)
        });
    }
}
async function createContext(options, userConfig) {
    let { cwd } = options, rootPath = userConfig.root ? ensureAbsolutePath(cwd, userConfig.root) : cwd, rsbuildConfig = await withDefaultConfig(rootPath, userConfig), cachePath = (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.join)(rootPath, 'node_modules', '.cache'), specifiedEnvironments = options.environment && options.environment.length > 0 ? options.environment : void 0, bundlerType = userConfig.provider ? 'webpack' : 'rspack';
    return {
        version: "1.3.22",
        rootPath,
        distPath: '',
        cachePath,
        callerName: options.callerName,
        bundlerType,
        environments: {},
        hooks: {
            onExit: createAsyncHook(),
            onCloseBuild: createAsyncHook(),
            onAfterBuild: createAsyncHook(),
            onBeforeBuild: createAsyncHook(),
            onDevCompileDone: createAsyncHook(),
            onCloseDevServer: createAsyncHook(),
            onAfterStartDevServer: createAsyncHook(),
            onBeforeStartDevServer: createAsyncHook(),
            onAfterStartProdServer: createAsyncHook(),
            onBeforeStartProdServer: createAsyncHook(),
            onAfterCreateCompiler: createAsyncHook(),
            onBeforeCreateCompiler: createAsyncHook(),
            modifyHTML: createEnvironmentAsyncHook(),
            modifyHTMLTags: createEnvironmentAsyncHook(),
            modifyRspackConfig: createEnvironmentAsyncHook(),
            modifyBundlerChain: createEnvironmentAsyncHook(),
            modifyWebpackChain: createEnvironmentAsyncHook(),
            modifyWebpackConfig: createEnvironmentAsyncHook(),
            modifyRsbuildConfig: createAsyncHook(),
            modifyEnvironmentConfig: createEnvironmentAsyncHook(),
            onBeforeEnvironmentCompile: createEnvironmentAsyncHook(),
            onAfterEnvironmentCompile: createEnvironmentAsyncHook()
        },
        config: {
            ...rsbuildConfig
        },
        originalConfig: userConfig,
        specifiedEnvironments
    };
}
let pluginAppIcon = ()=>({
        name: 'rsbuild:app-icon',
        setup (api) {
            let htmlTagsMap = new Map(), iconFormatMap = new Map(), formatIcon = (icon, distDir, publicPath)=>{
                let { src, size } = icon, cached = iconFormatMap.get(src);
                if (cached) return cached;
                let sizes = `${size}x${size}`;
                if (isURL(src)) {
                    let formatted = {
                        ...icon,
                        src,
                        sizes,
                        isURL: !0,
                        mimeType: (0, __WEBPACK_EXTERNAL_MODULE__compiled_mrmime_index_js_86f064ca__.lookup)(src)
                    };
                    return iconFormatMap.set(src, formatted), formatted;
                }
                let absolutePath = __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.isAbsolute(src) ? src : __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.join(api.context.rootPath, src), relativePath = __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.posix.join(distDir, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.basename(absolutePath)), formatted = {
                    ...icon,
                    sizes,
                    src: ensureAssetPrefix(relativePath, publicPath),
                    isURL: !1,
                    absolutePath,
                    relativePath,
                    mimeType: (0, __WEBPACK_EXTERNAL_MODULE__compiled_mrmime_index_js_86f064ca__.lookup)(absolutePath)
                };
                return iconFormatMap.set(src, formatted), formatted;
            };
            api.processAssets({
                stage: 'additional'
            }, async ({ compilation, environment, sources })=>{
                let { config } = environment, { appIcon } = config.html;
                if (!appIcon) return;
                let distDir = config.output.distPath.image, manifestFile = appIcon.filename ?? 'manifest.webmanifest', publicPath = getPublicPathFromCompiler(compilation), icons = appIcon.icons.map((icon)=>formatIcon(icon, distDir, publicPath)), tags = [];
                for (let icon of icons){
                    if ('web-app-manifest' === icon.target && !appIcon.name) {
                        addCompilationError(compilation, `${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:app-icon]')} ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('"appIcon.name"')} is required when ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('"target"')} is ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('"web-app-manifest"')}.`);
                        continue;
                    }
                    if (!icon.isURL) {
                        if (!compilation.inputFileSystem) {
                            addCompilationError(compilation, `${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:app-icon]')} Failed to read the icon file as ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('"compilation.inputFileSystem"')} is not available.`);
                            continue;
                        }
                        if (!await fileExistsByCompilation(compilation, icon.absolutePath)) {
                            addCompilationError(compilation, `${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:app-icon]')} Failed to find the icon file at ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(icon.absolutePath)}.`);
                            continue;
                        }
                        let source = await (0, __WEBPACK_EXTERNAL_MODULE_node_util_1b29d436__.promisify)(compilation.inputFileSystem.readFile)(icon.absolutePath);
                        if (!source) {
                            addCompilationError(compilation, `${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:app-icon]')} Failed to read the icon file at ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(icon.absolutePath)}.`);
                            continue;
                        }
                        compilation.emitAsset(icon.relativePath, new sources.RawSource(source));
                    }
                    ('apple-touch-icon' === icon.target || !icon.target && icon.size < 200) && tags.push({
                        tag: 'link',
                        attrs: {
                            rel: 'apple-touch-icon',
                            sizes: icon.sizes,
                            href: icon.src
                        }
                    });
                }
                if (appIcon.name) {
                    let manifestIcons = icons.filter((icon)=>'web-app-manifest' === icon.target || !icon.target).map((icon)=>{
                        let result = {
                            src: icon.src,
                            sizes: icon.sizes
                        };
                        return icon.mimeType ? {
                            ...result,
                            type: icon.mimeType
                        } : result;
                    }), manifest = {
                        name: appIcon.name,
                        icons: manifestIcons
                    };
                    compilation.emitAsset(manifestFile, new sources.RawSource(JSON.stringify(manifest))), tags.push({
                        tag: 'link',
                        attrs: {
                            rel: 'manifest',
                            href: ensureAssetPrefix(manifestFile, publicPath)
                        }
                    });
                }
                tags.length && htmlTagsMap.set(environment.name, tags);
            }), api.modifyHTMLTags(({ headTags, bodyTags }, { environment })=>{
                let tags = htmlTagsMap.get(environment.name);
                return tags && headTags.unshift(...tags), {
                    headTags,
                    bodyTags
                };
            });
            let clean = ()=>{
                htmlTagsMap.clear(), iconFormatMap.clear();
            };
            api.onCloseDevServer(clean), api.onCloseBuild(clean);
        }
    });
async function modifyBundlerChain(context, utils) {
    var _utils_environment_config_tools;
    __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug('modify bundler chain');
    let bundlerChain = new __WEBPACK_EXTERNAL_MODULE__compiled_rspack_chain_index_js_b67fefbd__.default(), [modifiedBundlerChain] = await context.hooks.modifyBundlerChain.callChain({
        environment: utils.environment.name,
        args: [
            bundlerChain,
            utils
        ]
    });
    if (null == (_utils_environment_config_tools = utils.environment.config.tools) ? void 0 : _utils_environment_config_tools.bundlerChain) for (let item of castArray(utils.environment.config.tools.bundlerChain))await item(modifiedBundlerChain, utils);
    return __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug('modify bundler chain done'), modifiedBundlerChain;
}
let configChain_CHAIN_ID = {
    RULE: {
        MJS: 'mjs',
        FONT: 'font',
        IMAGE: 'image',
        MEDIA: 'media',
        ADDITIONAL_ASSETS: 'additional-assets',
        JS: 'js',
        JS_DATA_URI: 'js-data-uri',
        TS: 'ts',
        CSS: 'css',
        CSS_RAW: 'css-raw',
        CSS_INLINE: 'css-inline',
        LESS: 'less',
        LESS_RAW: 'less-raw',
        LESS_INLINE: 'less-inline',
        SASS: 'sass',
        SASS_RAW: 'sass-raw',
        SASS_INLINE: 'sass-inline',
        STYLUS: 'stylus',
        STYLUS_RAW: 'stylus-raw',
        STYLUS_INLINE: 'stylus-inline',
        SVG: 'svg',
        PUG: 'pug',
        VUE: 'vue',
        WASM: 'wasm',
        SVELTE: 'svelte'
    },
    ONE_OF: {
        SVG: 'svg',
        SVG_RAW: 'svg-asset-raw',
        SVG_URL: 'svg-asset-url',
        SVG_ASSET: 'svg-asset',
        SVG_REACT: 'svg-react',
        SVG_INLINE: 'svg-asset-inline'
    },
    USE: {
        TS: 'ts',
        CSS: 'css',
        SASS: 'sass',
        LESS: 'less',
        STYLUS: 'stylus',
        URL: 'url',
        PUG: 'pug',
        VUE: 'vue',
        SWC: 'swc',
        SVGR: 'svgr',
        BABEL: 'babel',
        STYLE: 'style-loader',
        SVELTE: 'svelte',
        POSTCSS: 'postcss',
        LIGHTNINGCSS: 'lightningcss',
        IGNORE_CSS: 'ignore-css',
        CSS_MODULES_TS: "css-modules-typescript",
        MINI_CSS_EXTRACT: 'mini-css-extract',
        RESOLVE_URL: 'resolve-url-loader'
    },
    PLUGIN: {
        HMR: 'hmr',
        COPY: 'copy',
        HTML: 'html',
        DEFINE: 'define',
        PROGRESS: 'progress',
        MANIFEST: 'webpack-manifest',
        TS_CHECKER: 'ts-checker',
        BUNDLE_ANALYZER: 'bundle-analyze',
        MODULE_FEDERATION: 'module-federation',
        HTML_PREFETCH: 'html-prefetch-plugin',
        HTML_PRELOAD: 'html-preload-plugin',
        MINI_CSS_EXTRACT: 'mini-css-extract',
        VUE_LOADER_PLUGIN: 'vue-loader-plugin',
        REACT_FAST_REFRESH: 'react-fast-refresh',
        SUBRESOURCE_INTEGRITY: 'subresource-integrity'
    },
    MINIMIZER: {
        JS: 'js',
        CSS: 'css'
    },
    RESOLVE_PLUGIN: {
        TS_CONFIG_PATHS: 'ts-config-paths'
    }
}, chainStaticAssetRule = ({ emit, rule, maxSize, filename, assetType })=>{
    let generatorOptions = {
        filename
    };
    !1 === emit && (generatorOptions.emit = !1), rule.oneOf(`${assetType}-asset-url`).type('asset/resource').resourceQuery(/(__inline=false|url)/).set('generator', generatorOptions), rule.oneOf(`${assetType}-asset-inline`).type('asset/inline').resourceQuery(/inline/), rule.oneOf(`${assetType}-asset-raw`).type('asset/source').resourceQuery(/raw/), rule.oneOf(`${assetType}-asset`).type('asset').parser({
        dataUrlCondition: {
            maxSize
        }
    }).set('generator', generatorOptions);
}, pluginAsset = ()=>({
        name: 'rsbuild:asset',
        setup (api) {
            api.modifyBundlerChain((chain, { isProd, environment })=>{
                let { config } = environment, getMergedFilename = (assetType)=>{
                    let distDir = config.output.distPath[assetType], filename = getFilename(config, assetType, isProd);
                    return 'function' == typeof filename ? (...args)=>{
                        let name = filename(...args);
                        return __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.posix.join(distDir, name);
                    } : __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.posix.join(distDir, filename);
                }, createAssetRule = (assetType, exts, emit)=>{
                    let regExp = function(exts) {
                        let matcher = exts.map((ext)=>ext.trim()).map((ext)=>ext.startsWith('.') ? ext.slice(1) : ext).join('|');
                        return RegExp(1 === exts.length ? `\\.${matcher}$` : `\\.(?:${matcher})$`, 'i');
                    }(exts), { dataUriLimit } = config.output, maxSize = 'number' == typeof dataUriLimit ? dataUriLimit : dataUriLimit[assetType];
                    chainStaticAssetRule({
                        emit,
                        rule: chain.module.rule(assetType).test(regExp),
                        maxSize,
                        filename: getMergedFilename(assetType),
                        assetType
                    });
                }, { emitAssets } = config.output;
                createAssetRule(configChain_CHAIN_ID.RULE.IMAGE, IMAGE_EXTENSIONS, emitAssets), createAssetRule(configChain_CHAIN_ID.RULE.SVG, [
                    'svg'
                ], emitAssets), createAssetRule(configChain_CHAIN_ID.RULE.MEDIA, [
                    ...VIDEO_EXTENSIONS,
                    ...AUDIO_EXTENSIONS
                ], emitAssets), createAssetRule(configChain_CHAIN_ID.RULE.FONT, FONT_EXTENSIONS, emitAssets);
                let assetsFilename = getMergedFilename('assets');
                chain.output.assetModuleFilename(assetsFilename), emitAssets || chain.module.generator.merge({
                    'asset/resource': {
                        emit: !1
                    }
                });
                let { assetsInclude } = config.source;
                if (assetsInclude) {
                    let { dataUriLimit } = config.output;
                    chainStaticAssetRule({
                        emit: emitAssets,
                        rule: chain.module.rule(configChain_CHAIN_ID.RULE.ADDITIONAL_ASSETS).test(assetsInclude),
                        maxSize: 'number' == typeof dataUriLimit ? dataUriLimit : dataUriLimit.assets,
                        filename: assetsFilename,
                        assetType: 'additional-assets'
                    });
                }
            });
        }
    }), getDevtool = (config)=>{
    let { sourceMap } = config.output, isProd = 'production' === config.mode;
    return !1 !== sourceMap && (!0 === sourceMap ? isProd ? 'source-map' : 'cheap-module-source-map' : void 0 === sourceMap.js ? !isProd && 'cheap-module-source-map' : sourceMap.js);
}, pluginBasic = ()=>({
        name: 'rsbuild:basic',
        setup (api) {
            api.modifyBundlerChain((chain, { env, isDev, target, bundler, environment, CHAIN_ID })=>{
                let { config } = environment;
                chain.name(environment.name);
                let devtool = getDevtool(config);
                chain.devtool(devtool);
                let { sourceMap } = config.output;
                !devtool && 'object' == typeof sourceMap && sourceMap.css && chain.plugin('source-map-css').use(bundler.SourceMapDevToolPlugin, [
                    {
                        test: /\.css$/,
                        filename: '[file].map[query]'
                    }
                ]), chain.context(api.context.rootPath), chain.mode(environment.config.mode), chain.infrastructureLogging({
                    level: 'error'
                }), chain.watchOptions({
                    aggregateTimeout: 0
                }), chain.performance.hints(!1), chain.module.parser.merge({
                    javascript: {
                        exportsPresence: 'error'
                    }
                }), isDev && config.dev.hmr && 'web' === target && chain.plugin(CHAIN_ID.PLUGIN.HMR).use(bundler.HotModuleReplacementPlugin), 'development' === env && chain.output.devtoolModuleFilenameTemplate((info)=>toPosixPath(info.absoluteResourcePath)), process.env.RSPACK_CONFIG_VALIDATE ||= 'loose-unrecognized-keys', 'rspack' === api.context.bundlerType && chain.experiments({
                    ...chain.get('experiments'),
                    incremental: !0
                });
            });
        }
    }), isUseAnalyzer = (config)=>{
    var _config_performance;
    return process.env.BUNDLE_ANALYZE || (null == (_config_performance = config.performance) ? void 0 : _config_performance.bundleAnalyze);
};
async function validateWebpackCache(cacheDirectory, buildDependencies) {
    let configFile = (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.join)(cacheDirectory, 'buildDependencies.json');
    if (await isFileExists(configFile)) {
        let rawConfigFile = await __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.default.promises.readFile(configFile, 'utf-8'), prevBuildDependencies = null;
        try {
            prevBuildDependencies = JSON.parse(rawConfigFile);
        } catch (e) {
            __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug('failed to parse the previous buildDependencies.json', e);
        }
        if (JSON.stringify(prevBuildDependencies) === JSON.stringify(buildDependencies)) return;
        await __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.default.promises.rm(cacheDirectory, {
            force: !0,
            recursive: !0
        });
    }
    await __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.default.promises.mkdir(cacheDirectory, {
        recursive: !0
    }), await __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.default.promises.writeFile(configFile, JSON.stringify(buildDependencies));
}
async function getBuildDependencies(context, config, environmentContext, userBuildDependencies) {
    var _config__privateMeta;
    let rootPackageJson = (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.join)(context.rootPath, 'package.json'), browserslistConfig = (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.join)(context.rootPath, '.browserslistrc'), buildDependencies = {};
    await isFileExists(rootPackageJson) && (buildDependencies.packageJson = [
        rootPackageJson
    ]);
    let { tsconfigPath } = environmentContext;
    tsconfigPath && (buildDependencies.tsconfig = [
        tsconfigPath
    ]), (null == (_config__privateMeta = config._privateMeta) ? void 0 : _config__privateMeta.configFilePath) && (buildDependencies.rsbuildConfig = [
        config._privateMeta.configFilePath
    ]), await isFileExists(browserslistConfig) && (buildDependencies.browserslistrc = [
        browserslistConfig
    ]);
    let tailwindConfig = findExists([
        'ts',
        'js',
        'cjs',
        'mjs'
    ].map((ext)=>(0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.join)(context.rootPath, `tailwind.config.${ext}`)));
    return tailwindConfig && (buildDependencies.tailwindcss = [
        tailwindConfig
    ]), {
        ...buildDependencies,
        ...userBuildDependencies
    };
}
let pluginCache = ()=>({
        name: 'rsbuild:cache',
        setup (api) {
            let cacheEnabled = !1;
            api.modifyBundlerChain(async (chain, { environment, env })=>{
                var data;
                let { config } = environment, { bundlerType } = api.context, buildCache = config.performance.buildCache ?? 'webpack' === bundlerType;
                if (!1 === buildCache) return;
                cacheEnabled = !0;
                let { context } = api, cacheConfig = 'boolean' == typeof buildCache ? {} : buildCache, cacheDirectory = function({ cacheDirectory }, context) {
                    return cacheDirectory ? (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.isAbsolute)(cacheDirectory) ? cacheDirectory : (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.join)(context.rootPath, cacheDirectory) : (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.join)(context.cachePath, context.bundlerType);
                }(cacheConfig, context), buildDependencies = await getBuildDependencies(context, config, environment, cacheConfig.buildDependencies ? {
                    userBuildDependencies: cacheConfig.buildDependencies
                } : {});
                'webpack' === bundlerType && await validateWebpackCache(cacheDirectory, buildDependencies);
                let cacheVersion = Array.isArray(cacheConfig.cacheDigest) && cacheConfig.cacheDigest.length ? `${environment.name}-${env}-${data = JSON.stringify(cacheConfig.cacheDigest), __WEBPACK_EXTERNAL_MODULE_node_crypto_9ba42079__.default.hash ? __WEBPACK_EXTERNAL_MODULE_node_crypto_9ba42079__.default.hash('sha256', data, 'hex').slice(0, 16) : __WEBPACK_EXTERNAL_MODULE_node_crypto_9ba42079__.default.createHash('sha256').update(data).digest('hex').slice(0, 16)}` : `${environment.name}-${env}`;
                'rspack' === bundlerType ? (chain.cache(!0), chain.experiments({
                    ...chain.get('experiments'),
                    cache: {
                        type: 'persistent',
                        version: cacheVersion,
                        storage: {
                            type: 'filesystem',
                            directory: cacheDirectory
                        },
                        buildDependencies: Object.values(buildDependencies).flat()
                    }
                })) : chain.cache({
                    name: cacheVersion,
                    type: 'filesystem',
                    cacheDirectory,
                    buildDependencies
                });
            }), api.onAfterCreateCompiler(()=>{
                cacheEnabled && 'rspack' === api.context.bundlerType && __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.info(`Rspack persistent cache enabled ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('(experimental)')}`);
            });
        }
    }), addTrailingSep = (dir)=>dir.endsWith(__WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.sep) ? dir : dir + __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.sep, isStrictSubdir = (parent, child)=>{
    let parentDir = addTrailingSep(parent), childDir = addTrailingSep(child);
    return parentDir !== childDir && childDir.startsWith(parentDir);
}, normalizeCleanDistPath = (userOptions)=>{
    let defaultOptions = {
        enable: 'auto'
    };
    return 'boolean' == typeof userOptions || 'auto' === userOptions ? {
        ...defaultOptions,
        enable: userOptions
    } : {
        ...defaultOptions,
        ...userOptions
    };
}, pluginCleanOutput = ()=>({
        name: 'rsbuild:clean-output',
        setup (api) {
            let getRsbuildOutputPath = ()=>{
                let { rootPath, distPath } = api.context, config = api.getNormalizedConfig(), targetPath = (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.join)(distPath, RSBUILD_OUTPUTS_PATH), { enable } = normalizeCleanDistPath(config.output.cleanDistPath);
                if (!0 === enable || 'auto' === enable && isStrictSubdir(rootPath, targetPath)) return {
                    path: targetPath
                };
            }, getPathInfo = (environment, isDev)=>{
                let { rootPath } = api.context, { config, distPath } = environment, { enable, keep } = normalizeCleanDistPath(config.output.cleanDistPath);
                return 'auto' === enable ? isDev && !config.dev.writeToDisk ? void 0 : isStrictSubdir(rootPath, distPath) ? {
                    path: distPath,
                    keep
                } : (__WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.warn('The dist path is not a subdir of root path, Rsbuild will not empty it.'), __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.warn(`Please set ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('`output.cleanDistPath`')} config manually.`), __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.warn(`Current root path: ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim(rootPath)}`), void __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.warn(`Current dist path: ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim(distPath)}`)) : !0 === enable ? {
                    path: distPath,
                    keep
                } : void 0;
            }, cleanAll = async (params)=>{
                for (let pathInfo of [
                    ...Object.values(params.environments).reduce((result, curr)=>(result.find((item)=>item.distPath === curr.distPath) || result.push(curr), result), []).map((environment)=>getPathInfo(environment, params.isDev)),
                    getRsbuildOutputPath()
                ].filter((pathInfo)=>!!pathInfo))await emptyDir(pathInfo.path, pathInfo.keep);
            };
            api.onBeforeBuild(async ({ isFirstCompile, environments })=>{
                isFirstCompile && await cleanAll({
                    environments
                });
            }), api.onBeforeStartDevServer(async ({ environments })=>{
                await cleanAll({
                    environments,
                    isDev: !0
                });
            });
        }
    }), dist_isNil = (o)=>null == o, dist_isFunction = (func)=>'function' == typeof func, dist_isObject = (obj)=>null !== obj && 'object' == typeof obj, dist_isPlainObject = (obj)=>dist_isObject(obj) && '[object Object]' === Object.prototype.toString.call(obj);
function reduceConfigs({ initial, config, mergeFn = Object.assign }) {
    return dist_isNil(config) ? initial : dist_isPlainObject(config) ? dist_isPlainObject(initial) ? mergeFn(initial, config) : config : dist_isFunction(config) ? config(initial) ?? initial : Array.isArray(config) ? config.reduce((initial, config)=>reduceConfigs({
            initial,
            config,
            mergeFn
        }), initial) : config ?? initial;
}
function reduceConfigsWithContext({ initial, config, ctx, mergeFn = Object.assign }) {
    return dist_isNil(config) ? initial : dist_isPlainObject(config) ? dist_isPlainObject(initial) ? mergeFn(initial, config) : config : dist_isFunction(config) ? config(initial, ctx) ?? initial : Array.isArray(config) ? config.reduce((initial, config)=>reduceConfigsWithContext({
            initial,
            config,
            ctx,
            mergeFn
        }), initial) : config ?? initial;
}
async function reduceConfigsAsyncWithContext({ initial, config, ctx, mergeFn = Object.assign }) {
    return dist_isNil(config) ? initial : dist_isPlainObject(config) ? dist_isPlainObject(initial) ? mergeFn(initial, config) : config : dist_isFunction(config) ? await config(initial, ctx) ?? initial : Array.isArray(config) ? config.reduce((initial, config)=>reduceConfigsWithContext({
            initial,
            config,
            ctx,
            mergeFn
        }), initial) : config ?? initial;
}
function reduceConfigsMergeContext({ initial, config, ctx, mergeFn = Object.assign }) {
    return dist_isNil(config) ? initial : dist_isPlainObject(config) ? dist_isPlainObject(initial) ? mergeFn(initial, config) : config : dist_isFunction(config) ? config({
        value: initial,
        ...ctx
    }) ?? initial : Array.isArray(config) ? config.reduce((initial, config)=>reduceConfigsMergeContext({
            initial,
            config,
            ctx,
            mergeFn
        }), initial) : config ?? initial;
}
let pluginHelper_require = (0, __WEBPACK_EXTERNAL_MODULE_node_module_ab9f2194__.createRequire)(import.meta.url), setHTMLPlugin = (plugin)=>{
    plugin && (pluginHelper_htmlPlugin = plugin);
}, getHTMLPlugin = ()=>(pluginHelper_htmlPlugin || (pluginHelper_htmlPlugin = pluginHelper_require('../compiled/html-rspack-plugin/index.js')), pluginHelper_htmlPlugin), setCssExtractPlugin = (plugin)=>{
    cssExtractPlugin = plugin;
}, getCssExtractPlugin = ()=>cssExtractPlugin || __WEBPACK_EXTERNAL_MODULE__rspack_core_e0096ff7__.rspack.CssExtractRspackPlugin, getSwcMinimizerOptions = (config, jsOptions)=>{
    let options = {};
    options.minimizerOptions ||= {}, options.minimizerOptions.format ||= {};
    let { removeConsole } = config.performance;
    if (!0 === removeConsole) options.minimizerOptions.compress = {
        drop_console: !0
    };
    else if (Array.isArray(removeConsole)) {
        let pureFuncs = removeConsole.map((method)=>`console.${method}`);
        options.minimizerOptions.compress = {
            pure_funcs: pureFuncs
        };
    }
    switch(config.output.legalComments){
        case 'inline':
            options.minimizerOptions.format.comments = 'some', options.extractComments = !1;
            break;
        case 'linked':
            options.extractComments = !0;
            break;
        case 'none':
            options.minimizerOptions.format.comments = !1, options.extractComments = !1;
    }
    return (options.minimizerOptions.format.asciiOnly = 'ascii' === config.output.charset, jsOptions) ? cjs_default()(options, jsOptions) : options;
}, parseMinifyOptions = (config)=>{
    let isProd = 'production' === config.mode, { minify } = config.output;
    if ('boolean' == typeof minify) {
        let shouldMinify = !0 === minify && isProd;
        return {
            minifyJs: shouldMinify,
            minifyCss: shouldMinify
        };
    }
    return {
        minifyJs: !1 !== minify.js && ('always' === minify.js || isProd),
        minifyCss: !1 !== minify.css && ('always' === minify.css || isProd),
        jsOptions: minify.jsOptions,
        cssOptions: minify.cssOptions
    };
}, pluginMinimize = ()=>({
        name: 'rsbuild:minimize',
        setup (api) {
            let isRspack = 'rspack' === api.context.bundlerType;
            api.modifyBundlerChain(async (chain, { environment, CHAIN_ID })=>{
                let { config } = environment, { minifyJs, minifyCss, jsOptions, cssOptions } = parseMinifyOptions(config);
                if (chain.optimization.minimize(minifyJs || minifyCss), minifyJs && isRspack && chain.optimization.minimizer(CHAIN_ID.MINIMIZER.JS).use(__WEBPACK_EXTERNAL_MODULE__rspack_core_e0096ff7__.rspack.SwcJsMinimizerRspackPlugin, [
                    getSwcMinimizerOptions(config, jsOptions)
                ]).end(), minifyCss && isRspack) {
                    let loaderOptions = getLightningCSSLoaderOptions(config, environment.browserslist, !0), defaultOptions = {
                        minimizerOptions: {
                            targets: isPlainObject(loaderOptions.targets) ? environment.browserslist : loaderOptions.targets,
                            ...pick(loaderOptions, [
                                'draft',
                                'include',
                                'exclude',
                                'nonStandard',
                                'pseudoClasses',
                                'unusedSymbols',
                                'errorRecovery'
                            ])
                        }
                    }, mergedOptions = cssOptions ? cjs_default()(defaultOptions, cssOptions) : defaultOptions;
                    chain.optimization.minimizer(CHAIN_ID.MINIMIZER.CSS).use(__WEBPACK_EXTERNAL_MODULE__rspack_core_e0096ff7__.rspack.LightningCssMinimizerRspackPlugin, [
                        mergedOptions
                    ]).end();
                }
            });
        }
    }), getCSSModulesLocalIdentName = (config, isProd)=>config.output.cssModules.localIdentName || (isProd ? '[local]-[hash:base64:6]' : '[path][name]__[local]-[hash:base64:6]'), getLightningCSSLoaderOptions = (config, targets, minify)=>{
    let userOptions = 'object' == typeof config.tools.lightningcssLoader ? config.tools.lightningcssLoader : {}, initialOptions = {
        targets,
        errorRecovery: !0
    };
    return minify && (initialOptions.minify = !0), reduceConfigs({
        initial: initialOptions,
        config: userOptions
    });
}, normalizeCssLoaderOptions = (options, exportOnlyLocals)=>{
    if (options.modules && exportOnlyLocals) {
        let { modules } = options;
        return modules = !0 === modules ? {
            exportOnlyLocals: !0
        } : 'string' == typeof modules ? {
            mode: modules,
            exportOnlyLocals: !0
        } : {
            ...modules,
            exportOnlyLocals: !0
        }, {
            ...options,
            modules
        };
    }
    return options;
}, clonePostCSSConfig = (config)=>({
        ...config,
        plugins: config.plugins ? [
            ...config.plugins
        ] : void 0
    }), getCSSSourceMap = (config)=>{
    let { sourceMap } = config.output;
    return 'boolean' == typeof sourceMap ? sourceMap : sourceMap.css;
};
async function loadUserPostcssrc(root, postcssrcCache) {
    let cached = postcssrcCache.get(root);
    if (cached) return clonePostCSSConfig(await cached);
    let { default: postcssrc } = await import("../compiled/postcss-load-config/index.js"), promise = postcssrc({}, root).catch((err)=>{
        var _err_message;
        if (null == (_err_message = err.message) ? void 0 : _err_message.includes('No PostCSS Config found')) return {};
        throw err;
    });
    return postcssrcCache.set(root, promise), promise.then((config)=>(postcssrcCache.set(root, config), clonePostCSSConfig(config)));
}
let isPostcssPluginCreator = (plugin)=>'function' == typeof plugin && !0 === plugin.postcss, getPostcssLoaderOptions = async ({ config, root, postcssrcCache })=>{
    let extraPlugins = [], userOptions = await loadUserPostcssrc(root, postcssrcCache);
    userOptions.plugins ||= [];
    let finalOptions = reduceConfigsWithContext({
        initial: {
            implementation: getCompiledPath('postcss'),
            postcssOptions: userOptions,
            sourceMap: getCSSSourceMap(config)
        },
        config: config.tools.postcss,
        ctx: {
            addPlugins (plugins) {
                extraPlugins.push(...castArray(plugins));
            }
        }
    });
    finalOptions.postcssOptions ||= {};
    let updatePostcssOptions = (options)=>(options.plugins ||= [], extraPlugins.length && options.plugins.push(...extraPlugins), options.plugins = options.plugins.map((plugin)=>isPostcssPluginCreator(plugin) ? plugin() : plugin), options.config = !1, options), { postcssOptions } = finalOptions;
    if ('function' == typeof postcssOptions) {
        let postcssOptionsWrapper = (loaderContext)=>{
            let options = postcssOptions(loaderContext);
            if ('object' != typeof options || null === options) throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:css]')} \`postcssOptions\` function must return a PostCSSOptions object, got ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(typeof options)}.`);
            return updatePostcssOptions({
                ...userOptions,
                ...options,
                plugins: [
                    ...userOptions.plugins || [],
                    ...options.plugins || []
                ]
            });
        };
        return postcssOptionsWrapper.config = !1, {
            ...finalOptions,
            postcssOptions: postcssOptionsWrapper
        };
    }
    return finalOptions.postcssOptions = updatePostcssOptions(postcssOptions), finalOptions;
}, getCSSLoaderOptions = ({ config, importLoaders, localIdentName, emitCss })=>{
    let { cssModules } = config.output;
    return normalizeCssLoaderOptions(reduceConfigs({
        initial: {
            importLoaders,
            modules: {
                ...cssModules,
                localIdentName
            },
            sourceMap: getCSSSourceMap(config)
        },
        config: config.tools.cssLoader,
        mergeFn: cjs_default()
    }), !emitCss);
}, pluginCss = ()=>({
        name: 'rsbuild:css',
        setup (api) {
            let postcssrcCache = new Map();
            api.modifyBundlerChain({
                order: 'pre',
                handler: async (chain, { target, isProd, CHAIN_ID, environment })=>{
                    let rule = chain.module.rule(CHAIN_ID.RULE.CSS), inlineRule = chain.module.rule(CHAIN_ID.RULE.CSS_INLINE), { config } = environment;
                    rule.test(CSS_REGEX).type("javascript/auto").dependency({
                        not: 'url'
                    }).resourceQuery({
                        not: /raw|inline/
                    }), inlineRule.test(CSS_REGEX).type("javascript/auto").resourceQuery(/inline/), chain.module.rule(CHAIN_ID.RULE.CSS_RAW).test(CSS_REGEX).type('asset/source').resourceQuery(/raw/);
                    let emitCss = config.output.emitCss ?? 'web' === target;
                    if (emitCss) if (config.output.injectStyles) {
                        let styleLoaderOptions = reduceConfigs({
                            initial: {},
                            config: config.tools.styleLoader
                        });
                        rule.use(CHAIN_ID.USE.STYLE).loader(getCompiledPath('style-loader')).options(styleLoaderOptions);
                    } else rule.use(CHAIN_ID.USE.MINI_CSS_EXTRACT).loader(getCssExtractPlugin().loader).options(config.tools.cssExtract.loaderOptions);
                    else rule.use(CHAIN_ID.USE.IGNORE_CSS).loader(__WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.join(LOADER_PATH, 'ignoreCssLoader.mjs'));
                    let importLoaders = 0, updateRules = (callback)=>{
                        callback(rule, 'normal'), callback(inlineRule, 'inline');
                    }, cssLoaderPath = getCompiledPath('css-loader');
                    if (updateRules((rule)=>{
                        rule.use(CHAIN_ID.USE.CSS).loader(cssLoaderPath);
                    }), emitCss) {
                        var _postcssLoaderOptions_postcssOptions_plugins, _postcssLoaderOptions_postcssOptions;
                        if ('rspack' === api.context.bundlerType && !1 !== config.tools.lightningcssLoader) {
                            importLoaders++;
                            let { minifyCss } = parseMinifyOptions(config);
                            updateRules((rule, type)=>{
                                let inlineStyle = 'inline' === type || config.output.injectStyles, lightningcssOptions = getLightningCSSLoaderOptions(config, environment.browserslist, inlineStyle && minifyCss);
                                rule.use(CHAIN_ID.USE.LIGHTNINGCSS).loader('builtin:lightningcss-loader').options(lightningcssOptions);
                            });
                        }
                        let postcssLoaderOptions = await getPostcssLoaderOptions({
                            config,
                            root: api.context.rootPath,
                            postcssrcCache
                        });
                        if ('function' == typeof postcssLoaderOptions.postcssOptions || (null == (_postcssLoaderOptions_postcssOptions = postcssLoaderOptions.postcssOptions) || null == (_postcssLoaderOptions_postcssOptions_plugins = _postcssLoaderOptions_postcssOptions.plugins) ? void 0 : _postcssLoaderOptions_postcssOptions_plugins.length)) {
                            importLoaders++;
                            let postcssLoaderPath = getCompiledPath('postcss-loader');
                            updateRules((rule)=>{
                                rule.use(CHAIN_ID.USE.POSTCSS).loader(postcssLoaderPath).options(postcssLoaderOptions);
                            });
                        }
                    }
                    let localIdentName = getCSSModulesLocalIdentName(config, isProd), cssLoaderOptions = getCSSLoaderOptions({
                        config,
                        importLoaders,
                        localIdentName,
                        emitCss
                    });
                    updateRules((rule, type)=>{
                        rule.use(CHAIN_ID.USE.CSS).options('inline' === type ? {
                            ...cssLoaderOptions,
                            exportType: 'string',
                            modules: !1
                        } : cssLoaderOptions), rule.sideEffects(!0), rule.resolve.preferRelative(!0);
                    });
                    let isStringExport = 'string' === cssLoaderOptions.exportType;
                    if (isStringExport && rule.uses.has(CHAIN_ID.USE.MINI_CSS_EXTRACT) && rule.uses.delete(CHAIN_ID.USE.MINI_CSS_EXTRACT), emitCss && !config.output.injectStyles && !isStringExport) {
                        let extractPluginOptions = config.tools.cssExtract.pluginOptions, cssPath = config.output.distPath.css, cssFilename = getFilename(config, 'css', isProd), isCssFilenameFn = 'function' == typeof cssFilename, cssAsyncPath = config.output.distPath.cssAsync ?? (cssPath ? `${cssPath}/async` : 'async');
                        chain.plugin(CHAIN_ID.PLUGIN.MINI_CSS_EXTRACT).use(getCssExtractPlugin(), [
                            {
                                filename: isCssFilenameFn ? (...args)=>{
                                    let name = cssFilename(...args);
                                    return __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.posix.join(cssPath, name);
                                } : __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.posix.join(cssPath, cssFilename),
                                chunkFilename: isCssFilenameFn ? (...args)=>{
                                    let name = cssFilename(...args);
                                    return __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.posix.join(cssAsyncPath, name);
                                } : __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.posix.join(cssAsyncPath, cssFilename),
                                ...extractPluginOptions
                            }
                        ]);
                    }
                }
            });
        }
    }), pluginDefine = ()=>({
        name: 'rsbuild:define',
        setup (api) {
            api.modifyBundlerChain((chain, { CHAIN_ID, bundler, environment })=>{
                let { config } = environment, baseUrl = JSON.stringify(config.server.base), assetPrefix = JSON.stringify(getPublicPathFromChain(chain, !1)), mergedDefine = {
                    ...{
                        'import.meta.env.MODE': JSON.stringify(config.mode),
                        'import.meta.env.DEV': 'development' === config.mode,
                        'import.meta.env.PROD': 'production' === config.mode,
                        'import.meta.env.BASE_URL': baseUrl,
                        'import.meta.env.ASSET_PREFIX': assetPrefix,
                        'process.env.BASE_URL': baseUrl,
                        'process.env.ASSET_PREFIX': assetPrefix
                    },
                    ...config.source.define
                };
                !function(define) {
                    let value = define['process.env'];
                    if (!value) return;
                    let check = (value)=>{
                        let pathKey = Object.keys(value).find((key)=>'path' === key.toLowerCase() && value[key] === process.env[key]);
                        pathKey && __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.warn(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:config]')} The ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('"source.define"')} option includes an object with the key ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(JSON.stringify(pathKey))} under ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('"process.env"')}, indicating potential exposure of all environment variables. This can lead to security risks and should be avoided.`);
                    };
                    if ('object' == typeof value) return check(value);
                    if ('string' == typeof value) try {
                        check(JSON.parse(value));
                    } catch (error) {}
                }(mergedDefine), chain.plugin(CHAIN_ID.PLUGIN.DEFINE).use(bundler.DefinePlugin, [
                    mergedDefine
                ]);
            });
        }
    }), pluginEntry = ()=>({
        name: 'rsbuild:entry',
        setup (api) {
            api.modifyBundlerChain(async (chain, { environment, isServer })=>{
                let { config, entry } = environment, { preEntry } = config.source, injectCoreJsEntry = 'entry' === config.output.polyfill && !isServer;
                for (let entryName of Object.keys(entry)){
                    let entryPoint = chain.entry(entryName), addEntry = (item)=>{
                        if ('object' == typeof item && 'html' in item) {
                            let { html, ...rest } = item;
                            entryPoint.add(rest);
                        } else entryPoint.add(item);
                    };
                    preEntry.forEach(addEntry), injectCoreJsEntry && addEntry(createVirtualModule('import "core-js";')), castArray(entry[entryName]).forEach(addEntry);
                }
            }), api.onBeforeCreateCompiler(({ bundlerConfigs })=>{
                if (bundlerConfigs.every((config)=>!config.entry)) throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:config]')} Could not find any entry module, please make sure that ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('src/index.(ts|js|tsx|jsx|mts|cts|mjs|cjs)')} exists, or customize entry through the ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('source.entry')} configuration.`);
            });
        }
    }), fileSize_gzip = (0, __WEBPACK_EXTERNAL_MODULE_node_util_1b29d436__.promisify)(__WEBPACK_EXTERNAL_MODULE_node_zlib_a5bb16fc__.default.gzip);
async function gzipSize(input) {
    let data = await fileSize_gzip(input);
    return Buffer.byteLength(data);
}
let EXCLUDE_ASSET_REGEX = /\.(?:map|LICENSE\.txt|d\.ts)$/, excludeAsset = (asset)=>EXCLUDE_ASSET_REGEX.test(asset.name), getAssetColor = (size)=>size > 300000 ? __WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.red : size > 100000 ? __WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow : __WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.green, calcFileSize = (len)=>{
    let val = len / 1000;
    return `${val.toFixed(val < 1 ? 2 : 1)} kB`;
}, coloringAssetName = (assetName)=>JS_REGEX.test(assetName) ? __WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.cyan(assetName) : CSS_REGEX.test(assetName) ? __WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(assetName) : HTML_REGEX.test(assetName) ? __WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.green(assetName) : __WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.magenta(assetName), COMPRESSIBLE_REGEX = /\.(?:js|css|html|json|svg|txt|xml|xhtml|wasm|manifest)$/i, isCompressible = (assetName)=>COMPRESSIBLE_REGEX.test(assetName);
async function printFileSizes(options, stats, rootPath, environmentName) {
    let logs = [], showTotal = !1 !== options.total, showDetail = !1 !== options.detail, exclude = options.exclude ?? excludeAsset;
    if (!showTotal && !showDetail) return logs;
    let formatAsset = async (asset, distPath, distFolder)=>{
        let fileName = asset.name.split('?')[0], contents = await __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.default.promises.readFile(__WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.join(distPath, fileName)), size = Buffer.byteLength(contents), gzippedSize = options.compressed && isCompressible(fileName) ? await gzipSize(contents) : null, gzipSizeLabel = gzippedSize ? getAssetColor(gzippedSize)(calcFileSize(gzippedSize)) : null;
        return {
            size,
            folder: __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.join(distFolder, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.dirname(fileName)),
            name: __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.basename(fileName),
            gzippedSize,
            sizeLabel: calcFileSize(size),
            gzipSizeLabel
        };
    }, getAssets = async ()=>{
        let distPath = stats.compilation.outputOptions.path;
        if (!distPath) return [];
        let filteredAssets = (stats.toJson({
            all: !1,
            assets: !0,
            cachedAssets: !0,
            groupAssetsByInfo: !1,
            groupAssetsByPath: !1,
            groupAssetsByChunk: !1,
            groupAssetsByExtension: !1,
            groupAssetsByEmitStatus: !1
        }).assets || []).filter((asset)=>{
            let assetInfo = {
                name: asset.name,
                size: asset.size
            };
            return !exclude(assetInfo) && (!options.include || options.include(assetInfo));
        }), distFolder = __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.relative(rootPath, distPath);
        return Promise.all(filteredAssets.map((asset)=>formatAsset(asset, distPath, distFolder)));
    }, assets = await getAssets();
    if (0 === assets.length) return logs;
    logs.push(''), assets.sort((a, b)=>a.size - b.size);
    let totalSize = 0, totalGzipSize = 0;
    for (let asset of (showTotal = showTotal && !(showDetail && 1 === assets.length), assets))totalSize += asset.size, options.compressed && (totalGzipSize += asset.gzippedSize ?? asset.size);
    let fileHeader = showDetail ? `File (${environmentName})` : '', totalSizeLabel = showTotal ? showDetail ? 'Total:' : `Total size (${environmentName}):` : '', totalSizeStr = showTotal ? calcFileSize(totalSize) : '';
    if (showDetail) {
        let maxFileLength = Math.max(...assets.map((a)=>(a.folder + __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.sep + a.name).length), showTotal ? totalSizeLabel.length : 0, fileHeader.length), maxSizeLength = Math.max(...assets.map((a)=>a.sizeLabel.length), totalSizeStr.length), showGzipHeader = !!(options.compressed && assets.some((item)=>null !== item.gzippedSize));
        for (let asset of (logs.push(function(maxFileLength, maxSizeLength, fileHeader, showGzipHeader) {
            let lengths = [
                maxFileLength,
                maxSizeLength
            ], rowTypes = [
                fileHeader,
                'Size'
            ];
            showGzipHeader && rowTypes.push('Gzip');
            let headerRow = rowTypes.reduce((prev, cur, index)=>{
                let length = lengths[index], curLabel = cur;
                return length && (curLabel = cur.length < length ? cur + ' '.repeat(length - cur.length) : cur), `${prev + curLabel}   `;
            }, '');
            return __WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.blue(headerRow);
        }(maxFileLength, maxSizeLength, fileHeader, showGzipHeader)), assets)){
            let { sizeLabel } = asset, { name, folder, gzipSizeLabel } = asset, fileNameLength = (folder + __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.sep + name).length, sizeLength = sizeLabel.length;
            sizeLength < maxSizeLength && (sizeLabel += ' '.repeat(maxSizeLength - sizeLength));
            let fileNameLabel = __WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim(asset.folder + __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.sep) + coloringAssetName(asset.name);
            fileNameLength < maxFileLength && (fileNameLabel += ' '.repeat(maxFileLength - fileNameLength));
            let log = `${fileNameLabel}   ${sizeLabel}`;
            gzipSizeLabel && (log += `   ${gzipSizeLabel}`), logs.push(log);
        }
        if (showTotal) {
            logs.push('');
            let log = '';
            if (log += ' '.repeat(maxFileLength - totalSizeLabel.length), log += __WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.magenta(totalSizeLabel), log += `   ${totalSizeStr}`, options.compressed) {
                let colorFn = getAssetColor(totalGzipSize / assets.length);
                log += ' '.repeat(maxSizeLength - totalSizeStr.length), log += `   ${colorFn(calcFileSize(totalGzipSize))}`;
            }
            logs.push(log);
        }
    } else if (showTotal) {
        let log = `${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.magenta(totalSizeLabel)} ${totalSizeStr}`;
        options.compressed && (log += __WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.green(` (${calcFileSize(totalGzipSize)} gzipped)`)), logs.push(log);
    }
    return logs.push(''), logs;
}
let pluginFileSize = ()=>({
        name: 'rsbuild:file-size',
        setup (api) {
            api.onAfterBuild(async ({ stats, environments, isFirstCompile })=>{
                if (!stats || stats.hasErrors() || !isFirstCompile) return;
                let logs = [];
                await Promise.all(Object.values(environments).map(async (environment, index)=>{
                    let { printFileSize } = environment.config.performance;
                    if (!1 === printFileSize) return;
                    let multiStats = 'stats' in stats ? stats.stats : [
                        stats
                    ], defaultConfig = {
                        total: !0,
                        detail: !0,
                        compressed: 'node' !== environment.config.output.target
                    }, mergedConfig = !0 === printFileSize ? defaultConfig : {
                        ...defaultConfig,
                        ...printFileSize
                    }, statsLogs = await printFileSizes(mergedConfig, multiStats[index], api.context.rootPath, environment.name);
                    logs.push(...statsLogs);
                })).catch((err)=>{
                    __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.warn('Failed to print file size.'), __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.warn(err);
                }), __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.log(logs.join('\n'));
            });
        }
    });
function RsbuildHtmlPlugin_define_property(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
let entryNameSymbol = Symbol('entryName'), VOID_TAGS = [
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'keygen',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr'
], HEAD_TAGS = [
    'title',
    'base',
    'link',
    'style',
    'meta',
    "script",
    "noscript",
    'template'
], FILE_ATTRS = {
    link: 'href',
    script: 'src'
}, hasTitle = (html)=>!!html && /<title/i.test(html) && /<\/title/i.test(html), getTagPriority = (tag, tagConfig)=>{
    let priority = tag.head ?? HEAD_TAGS.includes(tag.tag) ? -2 : 2, append = tag.append ?? tagConfig.append;
    return 'boolean' == typeof append && (priority += append ? 1 : -1), priority;
}, formatBasicTag = (tag)=>({
        tag: tag.tagName,
        attrs: tag.attributes,
        children: tag.innerHTML
    }), fromBasicTag = (tag)=>({
        meta: {},
        tagName: tag.tag,
        attributes: tag.attrs ?? {},
        voidTag: VOID_TAGS.includes(tag.tag),
        innerHTML: tag.children
    }), formatTags = (tags, override)=>tags.map((tag)=>({
            ...formatBasicTag(tag),
            publicPath: !1,
            ...override
        })), applyTagConfig = (data, tagConfig, compilationHash, entryName)=>{
    var _tagConfig_tags;
    if (!(null == (_tagConfig_tags = tagConfig.tags) ? void 0 : _tagConfig_tags.length)) return data;
    let fromInjectTags = (tags)=>{
        let ret = [];
        for (let tag of tags){
            let attrs = {
                ...tag.attrs
            }, filenameTag = FILE_ATTRS[tag.tag], filename = attrs[filenameTag];
            if ('string' == typeof filename) {
                let optPublicPath = tag.publicPath ?? tagConfig.publicPath;
                'function' == typeof optPublicPath ? filename = optPublicPath(filename, data.publicPath) : 'string' == typeof optPublicPath ? filename = ensureAssetPrefix(filename, optPublicPath) : !1 !== optPublicPath && (filename = ensureAssetPrefix(filename, data.publicPath));
                let optHash = tag.hash ?? tagConfig.hash;
                'function' == typeof optHash ? compilationHash.length && (filename = optHash(filename, compilationHash)) : 'string' == typeof optHash ? optHash.length && (filename = `${filename}?${optHash}`) : !0 === optHash && compilationHash.length && (filename = `${filename}?${compilationHash}`), attrs[filenameTag] = filename, tag.attrs = attrs;
            }
            ret.push(fromBasicTag(tag));
        }
        return ret;
    }, tags = [
        ...formatTags(data.headTags, {
            head: !0
        }),
        ...formatTags(data.bodyTags, {
            head: !1
        })
    ], context = {
        hash: compilationHash,
        entryName,
        outputName: data.outputName,
        publicPath: data.publicPath
    };
    for (let item of tagConfig.tags)isFunction(item) ? tags = item(tags, context) || tags : tags.push(item), tags = tags.sort((tag1, tag2)=>getTagPriority(tag1, tagConfig) - getTagPriority(tag2, tagConfig));
    let [headTags, bodyTags] = function(array, predicate) {
        let truthy = [], falsy = [];
        for (let value of array)predicate(value) ? truthy.push(value) : falsy.push(value);
        return [
            truthy,
            falsy
        ];
    }(tags, (tag)=>tag.head ?? HEAD_TAGS.includes(tag.tag));
    return data.headTags = fromInjectTags(headTags), data.bodyTags = fromInjectTags(bodyTags), data;
}, addTitleTag = (headTags, title = '')=>{
    '' !== title && void 0 !== title && headTags.unshift({
        tagName: 'title',
        innerHTML: title,
        attributes: {},
        voidTag: !1,
        meta: {}
    });
};
class RsbuildHtmlPlugin {
    apply(compiler) {
        let emitFavicon = async (compilation, favicon)=>{
            let buffer, name = __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.basename(favicon);
            if (compilation.assets[name]) return name;
            if (!compilation.inputFileSystem) return addCompilationError(compilation, `${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:html]')} Failed to read the favicon file as ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('compilation.inputFileSystem')} is not available.`), null;
            let filename = __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.isAbsolute(favicon) ? favicon : __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.join(compilation.compiler.context, favicon);
            try {
                if (!(buffer = await (0, __WEBPACK_EXTERNAL_MODULE_node_util_1b29d436__.promisify)(compilation.inputFileSystem.readFile)(filename))) throw Error('Buffer is undefined');
            } catch (error) {
                return __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug(`read favicon error: ${error}`), addCompilationError(compilation, `${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:html]')} Failed to read the favicon file at ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(filename)}.`), null;
            }
            let source = new compiler.webpack.sources.RawSource(buffer, !1);
            return compilation.emitAsset(name, source), name;
        }, addFavicon = async (headTags, favicon, compilation, publicPath)=>{
            let href = favicon;
            if (!isURL(favicon)) {
                let name = await emitFavicon(compilation, favicon);
                if (null === name) return;
                href = ensureAssetPrefix(name, publicPath);
            }
            let tag = {
                tagName: 'link',
                voidTag: !0,
                attributes: {
                    rel: 'icon',
                    href
                },
                meta: {}
            };
            href.endsWith('.svg') && (tag.attributes.type = 'image/svg+xml'), headTags.unshift(tag);
        }, getExtraDataByPlugin = (plugin)=>{
            if (!plugin.options) return;
            let entryName = plugin.options[entryNameSymbol];
            if (entryName) return this.getExtraData(entryName);
        };
        compiler.hooks.compilation.tap(this.name, (compilation)=>{
            let hooks = getHTMLPlugin().getCompilationHooks(compilation);
            hooks.alterAssetTagGroups.tapPromise(this.name, async (data)=>{
                let extraData = getExtraDataByPlugin(data.plugin);
                if (!extraData) return data;
                let { headTags, bodyTags } = data, { favicon, context, tagConfig, entryName, environment, templateContent } = extraData;
                if (!hasTitle(templateContent)) {
                    var _data_plugin_options;
                    addTitleTag(headTags, null == (_data_plugin_options = data.plugin.options) ? void 0 : _data_plugin_options.title);
                }
                favicon && await addFavicon(headTags, favicon, compilation, data.publicPath);
                let tags = {
                    headTags: headTags.map(formatBasicTag),
                    bodyTags: bodyTags.map(formatBasicTag)
                }, [modified] = await context.hooks.modifyHTMLTags.callChain({
                    environment: environment.name,
                    args: [
                        tags,
                        {
                            compiler,
                            compilation,
                            assetPrefix: data.publicPath,
                            filename: data.outputName,
                            environment
                        }
                    ]
                });
                return Object.assign(data, {
                    headTags: modified.headTags.map(fromBasicTag),
                    bodyTags: modified.bodyTags.map(fromBasicTag)
                }), tagConfig && applyTagConfig(data, tagConfig, compilation.hash ?? '', entryName), data;
            }), hooks.beforeEmit.tapPromise(this.name, async (data)=>{
                let extraData = getExtraDataByPlugin(data.plugin);
                if (!extraData) return data;
                let { context, environment } = extraData, [modified] = await context.hooks.modifyHTML.callChain({
                    environment: environment.name,
                    args: [
                        data.html,
                        {
                            compiler,
                            compilation,
                            filename: data.outputName,
                            environment
                        }
                    ]
                });
                return {
                    ...data,
                    html: modified
                };
            });
        });
    }
    constructor(getExtraData){
        RsbuildHtmlPlugin_define_property(this, "name", void 0), RsbuildHtmlPlugin_define_property(this, "getExtraData", void 0), this.name = 'RsbuildHtmlPlugin', this.getExtraData = getExtraData;
    }
}
let getDefaultTemplateContent = (mountId)=>`<!doctype html><html><head></head><body><div id="${mountId}"></div></body></html>`, existTemplatePath = new Set();
async function getTemplate(entryName, config, rootPath) {
    let templatePath = reduceConfigsMergeContext({
        initial: '',
        config: config.html.template,
        ctx: {
            entryName
        }
    });
    if (!templatePath) return {
        templatePath: void 0,
        templateContent: getDefaultTemplateContent(config.html.mountId)
    };
    let absolutePath = (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.isAbsolute)(templatePath) ? templatePath : __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.join(rootPath, templatePath);
    if (!existTemplatePath.has(absolutePath)) {
        if (!await isFileExists(absolutePath)) throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:html]')} Failed to resolve HTML template, check if the file exists: ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(absolutePath)}`);
        existTemplatePath.add(absolutePath);
    }
    let templateContent = await __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.default.promises.readFile(absolutePath, 'utf-8');
    return {
        templatePath: absolutePath,
        templateContent
    };
}
let getTagConfig = (config)=>{
    let tags = castArray(config.html.tags).filter(Boolean);
    if (tags.length) return {
        append: !0,
        hash: !1,
        publicPath: !0,
        tags
    };
}, pluginHtml = (context)=>({
        name: 'rsbuild:html',
        setup (api) {
            api.modifyBundlerChain(async (chain, { HtmlPlugin, CHAIN_ID, environment })=>{
                let { config, htmlPaths } = environment;
                if (0 === Object.keys(htmlPaths).length) return;
                let assetPrefix = getPublicPathFromChain(chain, !1), entries = chain.entryPoints.entries() || {}, entryNames = Object.keys(entries).filter((entryName)=>!!htmlPaths[entryName]), extraDataMap = new Map(), finalOptions = await Promise.all(entryNames.map(async (entryName)=>{
                    let entryValue = entries[entryName].values(), chunks = function(entryName, entryValue) {
                        let chunks = [
                            entryName
                        ];
                        for (let item of entryValue){
                            if (!isPlainObject(item)) continue;
                            let { dependOn } = item;
                            dependOn && ('string' == typeof dependOn ? chunks.unshift(dependOn) : chunks.unshift(...dependOn));
                        }
                        return chunks;
                    }(entryName, entryValue), inject = reduceConfigsMergeContext({
                        initial: 'head',
                        config: config.html.inject,
                        ctx: {
                            entryName: entryName
                        }
                    }), filename = htmlPaths[entryName], { templatePath, templateContent } = await getTemplate(entryName, config, api.context.rootPath), templateParameters = (compilation, assets, assetTags, pluginOptions)=>{
                        let { mountId, templateParameters } = config.html, rspackConfig = compilation.options, htmlPlugin = {
                            tags: assetTags,
                            files: assets,
                            options: pluginOptions
                        };
                        return reduceConfigsWithContext({
                            initial: {
                                mountId,
                                entryName: entryName,
                                assetPrefix: assetPrefix,
                                compilation,
                                htmlPlugin,
                                rspackConfig,
                                webpackConfig: rspackConfig,
                                htmlWebpackPlugin: htmlPlugin
                            },
                            config: templateParameters,
                            ctx: {
                                entryName: entryName
                            }
                        });
                    }, pluginOptions = {
                        meta: function(entryName, config, templateContent) {
                            let metaTags = reduceConfigsMergeContext({
                                initial: {},
                                config: config.html.meta,
                                ctx: {
                                    entryName
                                }
                            });
                            return templateContent && metaTags.charset && /<meta[^>]+charset=["'][^>]*>/i.test(templateContent) && delete metaTags.charset, metaTags;
                        }(entryName, config, templateContent),
                        chunks,
                        inject,
                        filename,
                        entryName,
                        templateParameters,
                        scriptLoading: config.html.scriptLoading
                    };
                    templatePath && (pluginOptions.template = templatePath), chunks.length > 1 && (pluginOptions.chunksSortMode = 'manual');
                    let extraData = {
                        entryName,
                        context,
                        environment
                    };
                    extraDataMap.set(entryName, extraData), templateContent && (extraData.templateContent = templateContent);
                    let tagConfig = getTagConfig(environment.config);
                    tagConfig && (extraData.tagConfig = tagConfig), pluginOptions.title = reduceConfigsMergeContext({
                        initial: '',
                        config: config.html.title,
                        ctx: {
                            entryName: entryName
                        }
                    });
                    let favicon = reduceConfigsMergeContext({
                        initial: '',
                        config: config.html.favicon,
                        ctx: {
                            entryName: entryName
                        }
                    });
                    favicon && (extraData.favicon = favicon);
                    let finalOptions = reduceConfigsWithContext({
                        initial: pluginOptions,
                        config: 'boolean' == typeof config.tools.htmlPlugin ? {} : config.tools.htmlPlugin,
                        ctx: {
                            entryName,
                            entryValue
                        }
                    });
                    return finalOptions.template || finalOptions.templateContent || (pluginOptions.template = '', pluginOptions.templateContent = templateContent), finalOptions;
                }));
                if (entryNames.forEach((entryName, index)=>{
                    chain.plugin(`${CHAIN_ID.PLUGIN.HTML}-${entryName}`).use(HtmlPlugin, [
                        {
                            ...finalOptions[index],
                            [entryNameSymbol]: entryName
                        }
                    ]);
                }), chain.plugin('rsbuild-html-plugin').use(RsbuildHtmlPlugin, [
                    (entryName)=>extraDataMap.get(entryName)
                ]), config.html) {
                    let { crossorigin } = config.html;
                    crossorigin && chain.output.crossOriginLoading(!0 === crossorigin ? 'anonymous' : crossorigin);
                }
            }), api.modifyHTMLTags({
                order: 'post',
                handler: ({ headTags, bodyTags }, { environment })=>{
                    let { config } = environment, { crossorigin } = config.html, allTags = [
                        ...headTags,
                        ...bodyTags
                    ];
                    if (crossorigin) {
                        let formattedCrossorigin = !0 === crossorigin ? 'anonymous' : crossorigin;
                        for (let tag of allTags){
                            var _tag_attrs, _tag_attrs1;
                            ("script" === tag.tag && (null == (_tag_attrs = tag.attrs) ? void 0 : _tag_attrs.src) || 'link' === tag.tag && (null == (_tag_attrs1 = tag.attrs) ? void 0 : _tag_attrs1.rel) === 'stylesheet') && (tag.attrs.crossorigin ??= formattedCrossorigin);
                        }
                    }
                    return {
                        headTags,
                        bodyTags
                    };
                }
            });
        }
    });
function updateSourceMappingURL({ source, compilation, publicPath, type, config }) {
    let { devtool } = compilation.options;
    if (devtool && !devtool.includes('inline') && source.includes('# sourceMappingURL')) {
        let prefix = addTrailingSlash(__WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.join(publicPath, config.output.distPath[type] || ''));
        return source.replace(/# sourceMappingURL=/, `# sourceMappingURL=${prefix}`);
    }
    return source;
}
function matchTests(name, asset, tests) {
    return tests.some((test)=>isFunction(test) ? test({
            name,
            size: asset.size()
        }) : test.exec(name));
}
let getInlineTests = (config)=>{
    let isProd = 'production' === config.mode, { inlineStyles, inlineScripts } = config.output, scriptTests = [], styleTests = [];
    return inlineScripts && (!0 === inlineScripts ? isProd && scriptTests.push(JS_REGEX) : (0, __WEBPACK_EXTERNAL_MODULE_node_util_types_ce11fc49__.isRegExp)(inlineScripts) || isFunction(inlineScripts) ? isProd && scriptTests.push(inlineScripts) : ('auto' === inlineScripts.enable ? isProd : inlineScripts.enable) && scriptTests.push(inlineScripts.test)), inlineStyles && (!0 === inlineStyles ? isProd && styleTests.push(CSS_REGEX) : (0, __WEBPACK_EXTERNAL_MODULE_node_util_types_ce11fc49__.isRegExp)(inlineStyles) || isFunction(inlineStyles) ? isProd && styleTests.push(inlineStyles) : ('auto' === inlineStyles.enable ? isProd : inlineStyles.enable) && styleTests.push(inlineStyles.test)), {
        scriptTests,
        styleTests
    };
}, pluginInlineChunk = ()=>({
        name: 'rsbuild:inline-chunk',
        setup (api) {
            let inlinedAssets = new Set(), getInlinedScriptTag = (publicPath, tag, compilation, scriptTests, config)=>{
                var _tag_attrs;
                let { assets } = compilation;
                if (!((null == (_tag_attrs = tag.attrs) ? void 0 : _tag_attrs.src) && 'string' == typeof tag.attrs.src)) return tag;
                let { src, ...otherAttrs } = tag.attrs, scriptName = publicPath ? src.replace(publicPath, '') : src, asset = assets[scriptName];
                if (null == asset || !matchTests(scriptName, asset, scriptTests)) return tag;
                let ret = {
                    tag: "script",
                    children: updateSourceMappingURL({
                        source: asset.source().toString(),
                        compilation,
                        publicPath,
                        type: 'js',
                        config
                    }),
                    attrs: {
                        ...otherAttrs
                    }
                };
                return inlinedAssets.add(scriptName), ret;
            }, getInlinedCSSTag = (publicPath, tag, compilation, styleTests, config)=>{
                var _tag_attrs;
                let { assets } = compilation;
                if (!((null == (_tag_attrs = tag.attrs) ? void 0 : _tag_attrs.href) && 'string' == typeof tag.attrs.href)) return tag;
                let linkName = publicPath ? tag.attrs.href.replace(publicPath, '') : tag.attrs.href, asset = assets[linkName];
                if (null == asset || !matchTests(linkName, asset, styleTests)) return tag;
                let ret = {
                    tag: 'style',
                    children: updateSourceMappingURL({
                        source: asset.source().toString(),
                        compilation,
                        publicPath,
                        type: 'css',
                        config
                    })
                };
                return inlinedAssets.add(linkName), ret;
            }, getInlinedTag = (publicPath, tag, compilation, scriptTests, styleTests, config)=>"script" === tag.tag ? getInlinedScriptTag(publicPath, tag, compilation, scriptTests, config) : 'link' === tag.tag && tag.attrs && 'stylesheet' === tag.attrs.rel ? getInlinedCSSTag(publicPath, tag, compilation, styleTests, config) : tag;
            api.processAssets({
                stage: 'summarize'
            }, ({ compiler, compilation })=>{
                if (0 === inlinedAssets.size) return;
                let { devtool } = compiler.options;
                for (let name of inlinedAssets)'hidden-source-map' === devtool ? compilation.deleteAsset(name) : delete compilation.assets[name];
                inlinedAssets.clear();
            }), api.modifyHTMLTags(({ headTags, bodyTags }, { compiler, compilation, environment })=>{
                let { htmlPaths, config } = environment;
                if (0 === Object.keys(htmlPaths).length) return {
                    headTags,
                    bodyTags
                };
                let { scriptTests, styleTests } = getInlineTests(config);
                if (!scriptTests.length && !styleTests.length) return {
                    headTags,
                    bodyTags
                };
                let publicPath = getPublicPathFromCompiler(compiler), updateTag = (tag)=>getInlinedTag(publicPath, tag, compilation, scriptTests, styleTests, environment.config);
                return {
                    headTags: headTags.map(updateTag),
                    bodyTags: bodyTags.map(updateTag)
                };
            });
        }
    });
function recursiveChunkEntryNames(chunk) {
    let [...chunkGroups] = chunk.groupsIterable;
    return [
        ...new Set(chunkGroups.flatMap((chunkGroup)=>(function recursiveChunkGroup(chunkGroup, visited = new Set()) {
                if (visited.has(chunkGroup)) return [];
                visited.add(chunkGroup);
                let parents = chunkGroup.getParents();
                return parents.length ? parents.flatMap((chunkParent)=>recursiveChunkGroup(chunkParent, visited)) : [
                    chunkGroup.name
                ];
            })(chunkGroup)).filter((name)=>!!name))
    ];
}
let generateManifest = (htmlPaths, manifestOptions, environment)=>(_seed, files)=>{
        let chunkEntries = new Map(), licenseMap = new Map(), allFiles = files.map((file)=>{
            if (file.chunk) for (let name of recursiveChunkEntryNames(file.chunk))chunkEntries.set(name, [
                file,
                ...chunkEntries.get(name) || []
            ]);
            if (file.path.endsWith('.LICENSE.txt')) {
                let sourceFilePath = file.path.split('.LICENSE.txt')[0];
                licenseMap.set(sourceFilePath, file.path);
            }
            return file.path;
        }), entries = {};
        for (let [name, chunkFiles] of chunkEntries){
            var _files_find;
            let assets = new Set(), initialJS = [], asyncJS = [], initialCSS = [], asyncCSS = [];
            for (let file of chunkFiles){
                file.isInitial ? file.path.endsWith('.css') ? initialCSS.push(file.path) : initialJS.push(file.path) : file.path.endsWith('.css') ? asyncCSS.push(file.path) : asyncJS.push(file.path);
                let relatedLICENSE = licenseMap.get(file.path);
                if (relatedLICENSE && assets.add(relatedLICENSE), file.chunk) for (let auxiliaryFile of file.chunk.auxiliaryFiles)assets.add(auxiliaryFile);
            }
            let entryManifest = {};
            assets.size && (entryManifest.assets = Array.from(assets));
            let htmlPath = null == (_files_find = files.find((f)=>f.name === htmlPaths[name])) ? void 0 : _files_find.path;
            htmlPath && (entryManifest.html = [
                htmlPath
            ]), initialJS.length && (entryManifest.initial = {
                js: initialJS
            }), initialCSS.length && (entryManifest.initial = {
                ...entryManifest.initial || {},
                css: initialCSS
            }), asyncJS.length && (entryManifest.async = {
                js: asyncJS
            }), asyncCSS.length && (entryManifest.async = {
                ...entryManifest.async || {},
                css: asyncCSS
            }), entries[name] = entryManifest;
        }
        let manifestData = {
            allFiles,
            entries
        };
        if (manifestOptions.generate) {
            let generatedManifest = manifestOptions.generate({
                files,
                manifestData
            });
            if (isObject(generatedManifest)) return environment.manifest = generatedManifest, generatedManifest;
            throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:manifest]')} \`manifest.generate\` function must return a valid manifest object.`);
        }
        return environment.manifest = manifestData, manifestData;
    }, pluginManifest = ()=>({
        name: 'rsbuild:manifest',
        setup (api) {
            let manifestFilenames = new Map();
            api.modifyBundlerChain(async (chain, { CHAIN_ID, environment, isDev })=>{
                let { output: { manifest }, dev: { writeToDisk } } = environment.config;
                if (!1 === manifest) return;
                let manifestOptions = function(manifest) {
                    if ('string' == typeof manifest) return {
                        filename: manifest
                    };
                    let defaultOptions = {
                        filename: 'manifest.json'
                    };
                    return 'boolean' == typeof manifest ? defaultOptions : {
                        ...defaultOptions,
                        ...manifest
                    };
                }(manifest), { RspackManifestPlugin } = await import("../compiled/rspack-manifest-plugin/index.js"), { htmlPaths } = environment, filter = manifestOptions.filter ?? ((file)=>!file.name.endsWith('.LICENSE.txt'));
                manifestFilenames.set(environment.name, manifestOptions.filename), chain.plugin(CHAIN_ID.PLUGIN.MANIFEST).use(RspackManifestPlugin, [
                    {
                        fileName: manifestOptions.filename,
                        filter,
                        writeToFileEmit: isDev && !0 !== writeToDisk,
                        generate: generateManifest(htmlPaths, manifestOptions, environment)
                    }
                ]);
            }), api.onAfterCreateCompiler(()=>{
                if (manifestFilenames.size <= 1) return void manifestFilenames.clear();
                let environmentNames = Array.from(manifestFilenames.keys()), filenames = Array.from(manifestFilenames.values());
                new Set(filenames).size !== filenames.length && __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.warn(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:manifest]')} The ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('"manifest.filename"')} option must be unique when there are multiple environments (${environmentNames.join(', ')}), otherwise the manifest file will be overwritten.`), manifestFilenames.clear();
            });
        }
    });
class PatchSplitChunksPlugin {
    apply(compiler) {
        let { splitChunks } = compiler.options.optimization;
        if (!splitChunks) return;
        let applyPatch = (config)=>{
            if ('object' != typeof config || (0, __WEBPACK_EXTERNAL_MODULE_node_util_types_ce11fc49__.isRegExp)(config)) return;
            let { chunks } = config;
            if (chunks && 'async' !== chunks) {
                if ('function' == typeof chunks) {
                    config.chunks = (chunk)=>(!chunk.name || chunk.name !== this.name) && chunks(chunk);
                    return;
                }
                if ('all' === chunks) {
                    config.chunks = (chunk)=>!chunk.name || chunk.name !== this.name;
                    return;
                }
                if ('initial' === chunks) {
                    config.chunks = (chunk)=>(!chunk.name || chunk.name !== this.name) && chunk.isOnlyInitial();
                    return;
                }
            }
        };
        applyPatch(splitChunks);
        let { cacheGroups } = splitChunks;
        if (cacheGroups) for (let cacheGroupKey of Object.keys(cacheGroups))cacheGroups[cacheGroupKey] && applyPatch(cacheGroups[cacheGroupKey]);
    }
    constructor(name){
        var key, value;
        value = void 0, (key = "name") in this ? Object.defineProperty(this, key, {
            value: value,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : this[key] = value, this.name = name;
    }
}
let pluginMoment = ()=>({
        name: 'rsbuild:moment',
        setup (api) {
            api.modifyBundlerChain(async (chain, { environment, bundler })=>{
                let { config } = environment;
                config.performance.removeMomentLocale && chain.plugin('remove-moment-locale').use(bundler.IgnorePlugin, [
                    {
                        resourceRegExp: /^\.\/locale$/,
                        contextRegExp: /moment$/
                    }
                ]);
            });
        }
    }), nodeAddons_getFilename = (resourcePath)=>{
    let basename = '';
    if (resourcePath) {
        let parsed = __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.parse(resourcePath);
        parsed.dir && (basename = parsed.name);
    }
    return basename ? `${basename}.node` : null;
}, pluginNodeAddons = ()=>({
        name: 'rsbuild:node-addons',
        setup (api) {
            api.transform({
                test: /\.node$/,
                targets: [
                    'node'
                ],
                raw: !0
            }, ({ code, emitFile, resourcePath })=>{
                let name = nodeAddons_getFilename(resourcePath);
                if (null === name) throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:node-addons]')} Failed to load Node.js addon: ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(resourcePath)}`);
                return emitFile(name, code), `
try {
const path = require("path");
process.dlopen(module, path.join(__dirname, "${name}"));
} catch (error) {
throw new Error('Failed to load Node.js addon: "${name}"\\n' + error);
}
`;
            });
        }
    }), pluginNonce = ()=>({
        name: 'rsbuild:nonce',
        setup (api) {
            api.onAfterCreateCompiler(({ compiler, environments })=>{
                let nonces = Object.values(environments).map((environment)=>{
                    let { nonce } = environment.config.security;
                    return nonce;
                });
                if (!nonces.some((nonce)=>!!nonce)) return;
                let environmentList = Object.values(environments);
                applyToCompiler(compiler, (compiler, index)=>{
                    let nonce = nonces[index], environment = environmentList.find((item)=>item.index === index);
                    if (!Object.keys((null == environment ? void 0 : environment.htmlPaths) ?? {}).length || !nonce) return;
                    let injectCode = createVirtualModule(`__webpack_nonce__ = "${nonce}";`);
                    new compiler.webpack.EntryPlugin(compiler.context, injectCode, {
                        name: void 0
                    }).apply(compiler);
                });
            }), api.modifyHTMLTags({
                order: 'post',
                handler: ({ headTags, bodyTags }, { environment })=>{
                    let { config } = environment, { nonce } = config.security, allTags = [
                        ...headTags,
                        ...bodyTags
                    ];
                    if (nonce) for (let tag of allTags){
                        var _tag_attrs, _tag_attrs1;
                        ("script" === tag.tag || 'style' === tag.tag || 'link' === tag.tag && (null == (_tag_attrs = tag.attrs) ? void 0 : _tag_attrs.rel) === 'preload' && (null == (_tag_attrs1 = tag.attrs) ? void 0 : _tag_attrs1.as) === "script") && (tag.attrs ??= {}, tag.attrs.nonce = nonce);
                    }
                    return {
                        headTags,
                        bodyTags
                    };
                }
            });
        }
    }), normalizeUrl = (url)=>url.replace(/([^:]\/)\/+/g, '$1'), formatPrefix = (input)=>{
    let prefix = input;
    if ((null == prefix ? void 0 : prefix.startsWith('./')) && (prefix = prefix.replace('./', '')), !prefix) return '/';
    let hasLeadingSlash = prefix.startsWith('/'), hasTailSlash = prefix.endsWith('/');
    return `${hasLeadingSlash ? '' : '/'}${prefix}${hasTailSlash ? '' : '/'}`;
}, joinUrlSegments = (s1, s2)=>s1 && s2 ? addTrailingSlash(s1) + removeLeadingSlash(s2) : s1 || s2 || '', stripBase = (path, base)=>{
    if (path === base) return '/';
    let trailingSlashBase = addTrailingSlash(base);
    return path.startsWith(trailingSlashBase) ? path.slice(trailingSlashBase.length - 1) : path;
}, getRoutes = (context)=>Object.values(context.environments).reduce((prev, environmentContext)=>{
        let { distPath, config } = environmentContext, distPrefix = (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.relative)(context.distPath, distPath).split(__WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.sep).join('/'), routes = formatRoutes(environmentContext.htmlPaths, context.normalizedConfig.server.base, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.posix.join(distPrefix, config.output.distPath.html), config.html.outputStructure);
        return prev.concat(...routes);
    }, []), formatRoutes = (entry, base, distPathPrefix, outputStructure)=>{
    let prefix = joinUrlSegments(base, formatPrefix(distPathPrefix));
    return Object.keys(entry).map((entryName)=>({
            entryName,
            pathname: prefix + ('index' === entryName && 'nested' !== outputStructure ? '' : entryName)
        })).sort((a)=>'index' === a.entryName ? -1 : 1);
};
function printServerURLs({ urls: originalUrls, port, routes, protocol, printUrls, trailingLineBreak = !0 }) {
    if (!1 === printUrls) return null;
    let urls = originalUrls, useCustomUrl = isFunction(printUrls);
    if (useCustomUrl) {
        let newUrls = printUrls({
            urls: urls.map((item)=>item.url),
            port,
            routes,
            protocol
        });
        if (!newUrls) return null;
        if (!Array.isArray(newUrls)) throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:config]')} "server.printUrls" must return an array, but got ${typeof newUrls}.`);
        urls = newUrls.map((url)=>({
                url,
                label: getUrlLabel(url)
            }));
    }
    if (0 === urls.length || 0 === routes.length && !useCustomUrl) return null;
    let message = function(urls, routes) {
        if (routes.length <= 1) {
            let pathname = routes.length ? routes[0].pathname : '';
            return urls.map(({ label, url })=>{
                let normalizedPathname = normalizeUrl(`${url}${pathname}`), prefix = `\u{279C} ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim(label.padEnd(10))}`;
                return `  ${prefix}${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.cyan(normalizedPathname)}\n`;
            }).join('');
        }
        let message = '', maxNameLength = Math.max(...routes.map((r)=>r.entryName.length));
        return urls.forEach(({ label, url }, index)=>{
            for (let r of (index > 0 && (message += '\n'), message += `  ${`\u{279C} ${label}`}\n`, routes))message += `  ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('-')} ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim(r.entryName.padEnd(maxNameLength + 4))}${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.cyan(normalizeUrl(`${url}${r.pathname}`))}\n`;
        }), message;
    }(urls, routes);
    return !1 === trailingLineBreak && message.endsWith('\n') && (message = message.slice(0, -1)), __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.log(message), message;
}
let getPort = async ({ host, port, strictPort, tryLimits = 20 })=>{
    'string' == typeof port && (port = Number.parseInt(port, 10)), strictPort && (tryLimits = 1);
    let { createServer } = await import("node:net"), original = port, found = !1, attempts = 0;
    for(; !found && attempts <= tryLimits;)try {
        await new Promise((resolve, reject)=>{
            let server = createServer();
            server.unref(), server.on('error', reject), server.listen({
                port,
                host
            }, ()=>{
                found = !0, server.close(resolve);
            });
        });
    } catch (e) {
        if ('EADDRINUSE' !== e.code) throw e;
        port++, attempts++;
    }
    if (port !== original && strictPort) throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:server]')} Port ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(original)} is occupied, please choose another one.`);
    return port;
}, getServerConfig = async ({ config })=>{
    let { host, port: originalPort, strictPort } = config.server, port = await getPort({
        host,
        port: originalPort,
        strictPort
    }), https = !!config.server.https, portTip = port !== originalPort ? `port ${originalPort} is in use, ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(`using port ${port}.`)}` : void 0;
    return {
        port,
        host,
        https,
        portTip
    };
}, getIpv4Interfaces = ()=>{
    let interfaces = __WEBPACK_EXTERNAL_MODULE_node_os_74b4b876__.default.networkInterfaces(), ipv4Interfaces = new Map();
    for (let key of Object.keys(interfaces))for (let detail of interfaces[key]){
        let familyV4Value = 'string' == typeof detail.family ? 'IPv4' : 4;
        detail.family !== familyV4Value || ipv4Interfaces.has(detail.address) || ipv4Interfaces.set(detail.address, detail);
    }
    return Array.from(ipv4Interfaces.values());
}, isWildcardHost = (host)=>new Set([
        '0.0.0.0',
        '::',
        '0000:0000:0000:0000:0000:0000:0000:0000'
    ]).has(host), isLoopbackHost = (host)=>new Set([
        'localhost',
        '127.0.0.1',
        '::1',
        '0000:0000:0000:0000:0000:0000:0000:0001'
    ]).has(host), getHostInUrl = async (host)=>{
    if (host === DEFAULT_DEV_HOST) return 'localhost';
    let { isIPv6 } = await import("node:net");
    return isIPv6(host) ? '::' === host ? '[::1]' : `[${host}]` : host;
}, concatUrl = ({ host, port, protocol })=>`${protocol}://${host}:${port}`, LOCAL_LABEL = 'Local:  ', NETWORK_LABEL = 'Network:  ', getUrlLabel = (url)=>{
    try {
        let { host } = new URL(url);
        return isLoopbackHost(host) ? LOCAL_LABEL : NETWORK_LABEL;
    } catch (err) {
        return NETWORK_LABEL;
    }
}, getAddressUrls = async ({ protocol = 'http', port, host })=>{
    if (host && host !== DEFAULT_DEV_HOST) {
        let url = concatUrl({
            port,
            host: await getHostInUrl(host),
            protocol
        });
        return [
            {
                label: isLoopbackHost(host) ? LOCAL_LABEL : NETWORK_LABEL,
                url
            }
        ];
    }
    let ipv4Interfaces = getIpv4Interfaces(), addressUrls = [], hasLocalUrl = !1;
    for (let detail of ipv4Interfaces)if (isLoopbackHost(detail.address) || detail.internal) {
        if (hasLocalUrl) continue;
        addressUrls.push({
            label: LOCAL_LABEL,
            url: concatUrl({
                host: 'localhost',
                port,
                protocol
            })
        }), hasLocalUrl = !0;
    } else addressUrls.push({
        label: NETWORK_LABEL,
        url: concatUrl({
            host: detail.address,
            port,
            protocol
        })
    });
    return addressUrls;
}, COMPILATION_ID_REGEX = /[^a-zA-Z0-9_-]/g, getCompilationId = (compiler)=>{
    let uniqueName = compiler.options.output.uniqueName ?? '';
    return `${compiler.name ?? ''}_${uniqueName.replace(COMPILATION_ID_REGEX, '_')}`;
};
function getServerTerminator(server) {
    let listened = !1, pendingSockets = new Set(), onConnection = (socket)=>{
        pendingSockets.add(socket), socket.on('close', ()=>{
            pendingSockets.delete(socket);
        });
    };
    return server.on('connection', onConnection), server.on('secureConnection', onConnection), server.once('listening', ()=>{
        listened = !0;
    }), ()=>new Promise((resolve, reject)=>{
            for (let socket of pendingSockets)socket.destroy();
            listened ? server.close((err)=>err ? reject(err) : resolve()) : resolve();
        });
}
let supportedChromiumBrowsers = [
    'Google Chrome Canary',
    'Google Chrome Dev',
    'Google Chrome Beta',
    'Google Chrome',
    'Microsoft Edge',
    'Brave Browser',
    'Vivaldi',
    'Chromium'
], mapChromiumBrowserName = (browser)=>'chrome' === browser || 'google chrome' === browser ? 'Google Chrome' : browser, shouldTryAppleScript = (browser, browserArgs)=>'darwin' === process.platform && (!browser || !browserArgs) && (!browser || supportedChromiumBrowsers.includes(mapChromiumBrowserName(browser)));
async function openBrowser(url) {
    let browser = process.env.BROWSER, browserArgs = process.env.BROWSER_ARGS;
    if (shouldTryAppleScript(browser, browserArgs)) {
        let { exec } = await import("node:child_process"), { promisify } = await import("node:util"), execAsync = promisify(exec), getDefaultBrowserForAppleScript = async ()=>{
            let { stdout: ps } = await execAsync('ps cax');
            return supportedChromiumBrowsers.find((b)=>ps.includes(b));
        };
        try {
            let chromiumBrowser = browser ? mapChromiumBrowserName(browser) : await getDefaultBrowserForAppleScript();
            if (chromiumBrowser) return await execAsync(`osascript openChrome.applescript "${encodeURI(url)}" "${chromiumBrowser}"`, {
                cwd: STATIC_PATH
            }), !0;
            __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug('failed to find the target browser.');
        } catch (err) {
            __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug("failed to open start URL with apple script."), __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug(err);
        }
    }
    try {
        let { default: open } = await import("../compiled/open/index.js"), { apps } = open, options = browser ? {
            app: {
                name: apps[browser] ?? browser,
                arguments: null == browserArgs ? void 0 : browserArgs.split(' ')
            }
        } : {};
        return await open(url, options), !0;
    } catch (err) {
        return __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.error('Failed to open start URL.'), __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.error(err), !1;
    }
}
let openedURLs = [], clearOpenedURLs = ()=>{
    openedURLs = [];
}, replacePortPlaceholder = (url, port)=>url.replace(/<port>/g, String(port)), normalizeOpenConfig = (config)=>{
    let { open } = config.server;
    return 'boolean' == typeof open ? {
        targets: []
    } : 'string' == typeof open ? {
        targets: [
            open
        ]
    } : Array.isArray(open) ? {
        targets: open
    } : {
        targets: open.target ? castArray(open.target) : [],
        before: open.before
    };
};
async function open_open({ https, port, routes, config, clearCache }) {
    let { targets, before } = normalizeOpenConfig(config);
    if ('true' === process.env.CSB) return;
    clearCache && clearOpenedURLs();
    let urls = [], host = await getHostInUrl(config.server.host), baseUrl = `${https ? 'https' : 'http'}://${host}:${port}`;
    for (let url of (targets.length ? urls.push(...targets.map((target)=>(function(str, base) {
            if (canParse(str)) return str;
            try {
                return new URL(str, base).href;
            } catch (e) {
                throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:open]')} Invalid input: ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(str)} is not a valid URL or pathname`);
            }
        })(replacePortPlaceholder(target, port), baseUrl))) : routes.length && urls.push(`${baseUrl}${routes[0].pathname}`), before && await before(), urls))openedURLs.includes(url) || (openBrowser(url), openedURLs.push(url));
}
let getJsAsyncPath = (jsPath, isServer, jsAsync)=>void 0 !== jsAsync ? jsAsync : isServer ? jsPath : jsPath ? `${jsPath}/async` : 'async', pluginOutput = ()=>({
        name: 'rsbuild:output',
        setup (api) {
            api.modifyBundlerChain(async (chain, { CHAIN_ID, isProd, isServer, environment })=>{
                let { distPath, config } = environment, publicPath = function({ isProd, config, context }) {
                    var _context_devServer, _context_devServer1, _context_devServer2;
                    let { dev, output, server } = config, publicPath = DEFAULT_ASSET_PREFIX;
                    if (isProd) 'string' == typeof output.assetPrefix && (publicPath = output.assetPrefix);
                    else if ('string' == typeof dev.assetPrefix) publicPath = dev.assetPrefix;
                    else if (!0 === dev.assetPrefix) {
                        let protocol = (null == (_context_devServer1 = context.devServer) ? void 0 : _context_devServer1.https) ? 'https' : 'http', hostname = (null == (_context_devServer2 = context.devServer) ? void 0 : _context_devServer2.hostname) || DEFAULT_DEV_HOST;
                        publicPath = hostname === DEFAULT_DEV_HOST ? `${protocol}://localhost:<port>/` : `${protocol}://${hostname}:<port>/`, server.base && '/' !== server.base && (publicPath = urlJoin(publicPath, server.base));
                    }
                    let defaultPort = server.port ?? 3000;
                    return formatPublicPath(replacePortPlaceholder(publicPath, isProd ? defaultPort : (null == (_context_devServer = context.devServer) ? void 0 : _context_devServer.port) ?? defaultPort));
                }({
                    config,
                    isProd,
                    context: api.context
                }), jsPath = config.output.distPath.js, jsAsyncPath = getJsAsyncPath(jsPath, isServer, config.output.distPath.jsAsync), jsFilename = getFilename(config, 'js', isProd, isServer), isJsFilenameFn = 'function' == typeof jsFilename;
                if (chain.output.path(distPath).filename(isJsFilenameFn ? (...args)=>{
                    let name = jsFilename(...args);
                    return __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.posix.join(jsPath, name);
                } : __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.posix.join(jsPath, jsFilename)).chunkFilename(isJsFilenameFn ? (...args)=>{
                    let name = jsFilename(...args);
                    return __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.posix.join(jsAsyncPath, name);
                } : __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.posix.join(jsAsyncPath, jsFilename)).publicPath(publicPath).pathinfo(!1).hashFunction('xxhash64'), isServer && chain.output.library({
                    type: 'commonjs2',
                    ...chain.output.get('library') || {}
                }), config.output.copy && 'rspack' === api.context.bundlerType) {
                    let { copy } = config.output, options = Array.isArray(copy) ? {
                        patterns: copy
                    } : copy;
                    chain.plugin(CHAIN_ID.PLUGIN.COPY).use(__WEBPACK_EXTERNAL_MODULE__rspack_core_e0096ff7__.rspack.CopyRspackPlugin, [
                        options
                    ]);
                }
            });
        }
    }), pluginPerformance = ()=>({
        name: 'rsbuild:performance',
        setup (api) {
            api.modifyRsbuildConfig({
                order: 'post',
                handler: (rsbuildConfig)=>{
                    var _rsbuildConfig_performance, _config_performance;
                    let applyBundleAnalyzeConfig = (config)=>{
                        var _config_performance;
                        (null == (_config_performance = config.performance) ? void 0 : _config_performance.bundleAnalyze) ? config.performance.bundleAnalyze = {
                            generateStatsFile: !0,
                            ...config.performance.bundleAnalyze || {}
                        } : (config.performance ??= {}, config.performance.bundleAnalyze = {
                            analyzerMode: 'disabled',
                            generateStatsFile: !0
                        });
                    };
                    if (null == (_rsbuildConfig_performance = rsbuildConfig.performance) ? void 0 : _rsbuildConfig_performance.profile) applyBundleAnalyzeConfig(rsbuildConfig);
                    else if (rsbuildConfig.environments) for (let config of Object.values(rsbuildConfig.environments))(null == (_config_performance = config.performance) ? void 0 : _config_performance.profile) && applyBundleAnalyzeConfig(config);
                }
            }), api.modifyBundlerChain((chain, { environment })=>{
                let { config } = environment, { profile } = config.performance;
                profile && chain.profile(profile);
            });
        }
    }), pluginProgress = ()=>({
        name: 'rsbuild:progress',
        setup (api) {
            'webpack' !== api.context.bundlerType && api.modifyBundlerChain(async (chain, { CHAIN_ID, environment })=>{
                let { config } = environment, options = config.dev.progressBar ?? 'production' === config.mode;
                if (!options) return;
                let prefix = !0 !== options && void 0 !== options.id ? options.id : environment.name;
                chain.plugin(CHAIN_ID.PLUGIN.PROGRESS).use(__WEBPACK_EXTERNAL_MODULE__rspack_core_e0096ff7__.rspack.ProgressPlugin, [
                    {
                        prefix,
                        ...!0 === options ? {} : options
                    }
                ]);
            });
        }
    }), resolve_require = (0, __WEBPACK_EXTERNAL_MODULE_node_module_ab9f2194__.createRequire)(import.meta.url), pluginResolve = ()=>({
        name: 'rsbuild:resolve',
        setup (api) {
            api.modifyBundlerChain({
                order: 'pre',
                handler: (chain, { environment, CHAIN_ID })=>{
                    let { config, tsconfigPath } = environment;
                    chain.resolve.extensions.merge([
                        ...config.resolve.extensions
                    ]), tsconfigPath && !tsconfigPath.endsWith('jsconfig.json') && chain.resolve.extensionAlias.set('.js', [
                        '.js',
                        '.ts',
                        '.tsx'
                    ]).set('.jsx', [
                        '.jsx',
                        '.tsx'
                    ]), function({ chain, config, rootPath }) {
                        let mergedAlias = reduceConfigs({
                            initial: {},
                            config: config.resolve.alias
                        });
                        if (config.source.alias && (__WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.warn(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:config]')} The ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('"source.alias"')} config is deprecated, use ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('"resolve.alias"')} instead.`), mergedAlias = reduceConfigs({
                            initial: mergedAlias,
                            config: config.source.alias
                        })), config.resolve.dedupe) for (let pkgName of config.resolve.dedupe){
                            let pkgPath;
                            if (mergedAlias[pkgName]) {
                                __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:resolve]')} The package ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(pkgName)} is already in the alias config, dedupe option for ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(pkgName)} will be ignored.`);
                                continue;
                            }
                            try {
                                pkgPath = (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.dirname)(resolve_require.resolve(`${pkgName}/package.json`, {
                                    paths: [
                                        rootPath
                                    ]
                                }));
                            } catch (e) {}
                            if (!pkgPath) try {
                                pkgPath = resolve_require.resolve(pkgName, {
                                    paths: [
                                        rootPath
                                    ]
                                });
                                let trailing = [
                                    'node_modules',
                                    ...pkgName.split('/')
                                ].join(__WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.sep);
                                for(; !pkgPath.endsWith(trailing) && pkgPath.includes('node_modules');)pkgPath = (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.dirname)(pkgPath);
                            } catch (e) {
                                __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:resolve]')} The package ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(pkgName)} is not resolved in the project, dedupe option for ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(pkgName)} will be ignored.`);
                                continue;
                            }
                            mergedAlias[pkgName] = pkgPath;
                        }
                        for (let name of Object.keys(mergedAlias)){
                            let formattedValues = castArray(mergedAlias[name]).map((value)=>'string' == typeof value && value.startsWith('.') ? ensureAbsolutePath(rootPath, value) : value);
                            chain.resolve.alias.set(name, 1 === formattedValues.length ? formattedValues[0] : formattedValues);
                        }
                    }({
                        chain,
                        config,
                        rootPath: api.context.rootPath
                    }), chain.module.rule(CHAIN_ID.RULE.MJS).test(/\.m?js/).resolve.set('fullySpecified', !1), config.source.aliasStrategy && __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.warn(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:config]')} The ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('"source.aliasStrategy"')} config is deprecated, use ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('"resolve.aliasStrategy"')} instead.`);
                    let aliasStrategy = config.source.aliasStrategy ?? config.resolve.aliasStrategy;
                    tsconfigPath && 'rspack' === api.context.bundlerType && 'prefer-tsconfig' === aliasStrategy && chain.resolve.tsConfig({
                        configFile: tsconfigPath,
                        references: 'auto'
                    });
                }
            });
        }
    });
function isAsyncChunk(chunk) {
    return 'canBeInitial' in chunk ? !chunk.canBeInitial() : 'isInitial' in chunk && !chunk.isInitial();
}
function HtmlResourceHintsPlugin_define_property(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
let HtmlResourceHintsPlugin_defaultOptions = {
    type: 'async-chunks',
    dedupe: !0
}, applyFilter = (files, include, exclude)=>{
    let includeRegExp = [], excludeRegExp = [], includeFn = [], excludeFn = [];
    if (include) for (let item of castArray(include))'string' == typeof item ? includeRegExp.push(new RegExp(item)) : isFunction(item) ? includeFn.push(item) : includeRegExp.push(item);
    if (exclude) for (let item of castArray(exclude))'string' == typeof item ? excludeRegExp.push(new RegExp(item)) : isFunction(item) ? excludeFn.push(item) : excludeRegExp.push(item);
    return files.filter((file)=>{
        let includeMatched = !1;
        for (let item of includeRegExp)item.test(file) && (includeMatched = !0);
        for (let item of includeFn)item(file) && (includeMatched = !0);
        if (includeRegExp.length + includeFn.length > 0 && !includeMatched) return !1;
        for (let item of excludeRegExp)if (item.test(file)) return !1;
        for (let item of excludeFn)if (item(file)) return !1;
        return !0;
    });
};
class HtmlResourceHintsPlugin {
    apply(compiler) {
        compiler.hooks.compilation.tap(this.name, (compilation)=>{
            let pluginHooks = getHTMLPlugin().getCompilationHooks(compilation), pluginName = `HTML${upperFirst(this.type)}Plugin`;
            pluginHooks.beforeAssetTagGeneration.tap(pluginName, (data)=>(this.resourceHints = function(options, type, compilation, data, HTMLCount) {
                    let extractedChunks = function(compilation, includeType) {
                        let chunks = [
                            ...compilation.chunks
                        ];
                        if (void 0 === includeType || 'async-chunks' === includeType) return chunks.filter(isAsyncChunk);
                        if ('initial' === includeType) return chunks.filter((chunk)=>!isAsyncChunk(chunk));
                        if ('all-chunks' === includeType) return chunks;
                        if ('all-assets' === includeType) {
                            var _compilation_assetsInfo;
                            let licenseAssets = [
                                ...(null == (_compilation_assetsInfo = compilation.assetsInfo) ? void 0 : _compilation_assetsInfo.values()) || []
                            ].map((info)=>{
                                var _info_related;
                                return null != (_info_related = info.related) && !!_info_related.license && info.related.license;
                            }).filter(Boolean);
                            return [
                                {
                                    files: Object.keys(compilation.assets).filter((t)=>!licenseAssets.includes(t))
                                }
                            ];
                        }
                        return chunks;
                    }(compilation, options.type), sortedFilteredFiles = applyFilter([
                        ...new Set(('all-assets' === options.type || 1 === HTMLCount ? extractedChunks : extractedChunks.filter((chunk)=>(function({ chunk, htmlPluginData }) {
                                let { options } = htmlPluginData.plugin;
                                return recursiveChunkEntryNames(chunk).some((chunkName)=>{
                                    var includeChunks, excludeChunks;
                                    return includeChunks = null == options ? void 0 : options.chunks, excludeChunks = null == options ? void 0 : options.excludeChunks, !(Array.isArray(includeChunks) && -1 === includeChunks.indexOf(chunkName) || Array.isArray(excludeChunks) && -1 !== excludeChunks.indexOf(chunkName));
                                });
                            })({
                                chunk: chunk,
                                compilation,
                                htmlPluginData: data,
                                pluginOptions: options
                            }))).reduce((accumulated, chunk)=>accumulated.concat([
                                ...chunk.files,
                                ...chunk.auxiliaryFiles || []
                            ]), []).filter((file)=>!file.endsWith('.map')))
                    ], options.include, options.exclude).sort(), links = [], { publicPath, crossOriginLoading } = compilation.outputOptions;
                    for (let file of sortedFilteredFiles){
                        let href = ensureAssetPrefix(file, publicPath), attributes = {
                            href,
                            rel: type
                        };
                        'preload' === type && (attributes.as = function({ href, file }) {
                            let url = new __WEBPACK_EXTERNAL_MODULE_node_url_e96de089__.URL(file || href, 'https://example.com'), extension = __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.extname(url.pathname).slice(1);
                            return [
                                'css'
                            ].includes(extension) ? 'style' : IMAGE_EXTENSIONS.includes(extension) ? 'image' : VIDEO_EXTENSIONS.includes(extension) ? 'video' : AUDIO_EXTENSIONS.includes(extension) ? 'audio' : FONT_EXTENSIONS.includes(extension) ? 'font' : [
                                'vtt'
                            ].includes(extension) ? 'track' : "script";
                        }({
                            href,
                            file
                        }), 'font' === attributes.as && (attributes.crossorigin = ''), ("script" === attributes.as || 'style' === attributes.as) && crossOriginLoading && ('use-credentials' === crossOriginLoading || '/' !== publicPath) && (attributes.crossorigin = 'anonymous' === crossOriginLoading ? '' : crossOriginLoading)), links.push({
                            tagName: 'link',
                            attributes,
                            voidTag: !0,
                            meta: {}
                        });
                    }
                    return links;
                }(this.options, this.type, compilation, data, this.HTMLCount), data)), pluginHooks.alterAssetTags.tap(pluginName, (data)=>{
                var resourceHints, scripts;
                return this.resourceHints && (data.assetTags.styles = [
                    ...this.options.dedupe ? (resourceHints = this.resourceHints, scripts = data.assetTags.scripts, resourceHints.filter((resourceHint)=>!scripts.find((script)=>script.attributes.src === resourceHint.attributes.href))) : this.resourceHints,
                    ...data.assetTags.styles
                ]), data;
            });
        });
    }
    constructor(options, type, HTMLCount){
        HtmlResourceHintsPlugin_define_property(this, "options", void 0), HtmlResourceHintsPlugin_define_property(this, "name", 'HtmlResourceHintsPlugin'), HtmlResourceHintsPlugin_define_property(this, "resourceHints", []), HtmlResourceHintsPlugin_define_property(this, "type", void 0), HtmlResourceHintsPlugin_define_property(this, "HTMLCount", void 0), this.options = {
            ...HtmlResourceHintsPlugin_defaultOptions,
            ...options
        }, this.type = type, this.HTMLCount = HTMLCount;
    }
}
let resourceHints_generateLinks = (options, rel)=>options.map((option)=>({
            tag: 'link',
            attrs: {
                rel,
                ...option
            }
        })), getInlineExcludes = (config)=>{
    let { scriptTests, styleTests } = getInlineTests(config);
    return [
        ...scriptTests,
        ...styleTests
    ].filter((item)=>(0, __WEBPACK_EXTERNAL_MODULE_node_util_types_ce11fc49__.isRegExp)(item));
}, pluginResourceHints = ()=>({
        name: 'rsbuild:resource-hints',
        setup (api) {
            api.modifyHTMLTags(({ headTags, bodyTags }, { environment })=>{
                let { config } = environment, { dnsPrefetch, preconnect } = config.performance;
                if (dnsPrefetch) {
                    let attrs = dnsPrefetch.map((option)=>({
                            href: option
                        }));
                    attrs.length && headTags.unshift(...resourceHints_generateLinks(attrs, 'dns-prefetch'));
                }
                if (preconnect) {
                    let attrs = preconnect.map((option)=>'string' == typeof option ? {
                            href: option
                        } : option);
                    attrs.length && headTags.unshift(...resourceHints_generateLinks(attrs, 'preconnect'));
                }
                return {
                    headTags,
                    bodyTags
                };
            }), api.modifyBundlerChain(async (chain, { CHAIN_ID, environment })=>{
                let { config, htmlPaths } = environment;
                if (0 === Object.keys(htmlPaths).length) return;
                let { performance: { preload, prefetch } } = config, HTMLCount = chain.entryPoints.values().length, excludes = getInlineExcludes(config);
                if (prefetch) {
                    let options = !0 === prefetch ? {} : prefetch;
                    excludes.length && (options.exclude = options.exclude ? [
                        ...castArray(options.exclude),
                        ...excludes
                    ] : excludes), chain.plugin(CHAIN_ID.PLUGIN.HTML_PREFETCH).use(HtmlResourceHintsPlugin, [
                        options,
                        'prefetch',
                        HTMLCount
                    ]);
                }
                if (preload) {
                    let options = !0 === preload ? {} : preload;
                    excludes.length && (options.exclude = options.exclude ? [
                        ...castArray(options.exclude),
                        ...excludes
                    ] : excludes), chain.plugin(CHAIN_ID.PLUGIN.HTML_PRELOAD).use(HtmlResourceHintsPlugin, [
                        options,
                        'preload',
                        HTMLCount
                    ]);
                }
            });
        }
    }), rsdoctor_require = (0, __WEBPACK_EXTERNAL_MODULE_node_module_ab9f2194__.createRequire)(import.meta.url), pluginRsdoctor = ()=>({
        name: 'rsbuild:rsdoctor',
        setup (api) {
            api.onBeforeCreateCompiler(async ({ bundlerConfigs })=>{
                let packagePath, module;
                if ('true' !== process.env.RSDOCTOR) return;
                let isRspack = 'rspack' === api.context.bundlerType, pluginName = isRspack ? 'RsdoctorRspackPlugin' : 'RsdoctorWebpackPlugin', isRsdoctorPlugin = (plugin)=>{
                    var _plugin_constructor;
                    return (null == plugin ? void 0 : plugin.isRsdoctorPlugin) === !0 || (null == plugin || null == (_plugin_constructor = plugin.constructor) ? void 0 : _plugin_constructor.name) === pluginName;
                };
                for (let config of bundlerConfigs){
                    var _config_plugins;
                    if (null == (_config_plugins = config.plugins) ? void 0 : _config_plugins.some((plugin)=>isRsdoctorPlugin(plugin))) return;
                }
                let packageName = isRspack ? '@rsdoctor/rspack-plugin' : '@rsdoctor/webpack-plugin';
                try {
                    packagePath = rsdoctor_require.resolve(packageName, {
                        paths: [
                            api.context.rootPath
                        ]
                    });
                } catch (err) {
                    __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.warn(`\`process.env.RSDOCTOR\` enabled, please install ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.bold(__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(packageName))} package.`);
                    return;
                }
                try {
                    let moduleURL = 'win32' === process.platform ? (0, __WEBPACK_EXTERNAL_MODULE_node_url_e96de089__.pathToFileURL)(packagePath).href : packagePath;
                    module = await import(moduleURL);
                } catch (err) {
                    __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.error(`\`process.env.RSDOCTOR\` enabled, but failed to load ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.bold(__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(packageName))} module.`);
                    return;
                }
                if (module && module[pluginName]) {
                    for (let config of bundlerConfigs)config.plugins ||= [], config.plugins.push(new module[pluginName]());
                    __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.info(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.bold(__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(packageName))} enabled.`);
                }
            });
        }
    });
async function ensureFileDir(outputFilePath) {
    let dir = __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.dirname(outputFilePath);
    await __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.default.promises.mkdir(dir, {
        recursive: !0
    });
}
async function applyProfile(root, filterValue, traceLayer = 'chrome', traceOutput) {
    if ('chrome' !== traceLayer && 'logger' !== traceLayer) throw Error(`unsupported trace layer: ${traceLayer}`);
    if (!traceOutput) {
        let timestamp = Date.now(), defaultOutputDir = __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.join(root, `.rspack-profile-${timestamp}-${process.pid}`), defaultRustTraceChromeOutput = __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.join(defaultOutputDir, 'trace.json');
        traceOutput = 'chrome' === traceLayer ? defaultRustTraceChromeOutput : 'stdout';
    }
    return await ensureFileDir(traceOutput), await __WEBPACK_EXTERNAL_MODULE__rspack_core_e0096ff7__.rspack.experiments.globalTrace.register("OVERVIEW" === filterValue ? 'info' : "ALL" === filterValue ? 'trace' : filterValue, traceLayer, traceOutput), traceOutput;
}
let pluginRspackProfile = ()=>({
        name: 'rsbuild:rspack-profile',
        async setup (api) {
            let traceOutput;
            if ('webpack' === api.context.bundlerType) return;
            let { RSPACK_PROFILE } = process.env;
            if (!RSPACK_PROFILE) return;
            let onStart = async ()=>{
                traceOutput = await applyProfile(api.context.rootPath, RSPACK_PROFILE, process.env.RSPACK_TRACE_LAYER, process.env.RSPACK_TRACE_OUTPUT);
            };
            api.onBeforeBuild(({ isFirstCompile })=>{
                isFirstCompile && onStart();
            }), api.onBeforeStartDevServer(onStart), api.onExit(()=>{
                traceOutput && (__WEBPACK_EXTERNAL_MODULE__rspack_core_e0096ff7__.rspack.experiments.globalTrace.cleanup(), __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.info(`profile file saved to ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.cyan(traceOutput)}`));
            });
        }
    }), pluginServer = ()=>({
        name: 'rsbuild:server',
        setup (api) {
            let onStartServer = async ({ port, routes })=>{
                let config = api.getNormalizedConfig();
                if (config.server.open) {
                    var _api_context_devServer;
                    open_open({
                        https: null == (_api_context_devServer = api.context.devServer) ? void 0 : _api_context_devServer.https,
                        port,
                        routes,
                        config
                    });
                }
            };
            api.onAfterStartDevServer(onStartServer), api.onAfterStartProdServer(onStartServer), api.onBeforeBuild(async ({ isFirstCompile, environments })=>{
                if (isFirstCompile) for (let publicDir of normalizePublicDirs(api.getNormalizedConfig().server.publicDir)){
                    let { name, copyOnBuild } = publicDir;
                    if (!1 === copyOnBuild || !name) continue;
                    let normalizedPath = (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.isAbsolute)(name) ? name : (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.join)(api.context.rootPath, name);
                    if (!__WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.default.existsSync(normalizedPath)) continue;
                    let distPaths = dedupeNestedPaths(Object.values(environments).filter(({ config })=>!0 === copyOnBuild || 'auto' === copyOnBuild && 'node' !== config.output.target).map(({ distPath })=>distPath));
                    try {
                        await Promise.all(distPaths.map((distPath)=>__WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.default.promises.cp(normalizedPath, distPath, {
                                recursive: !0,
                                dereference: !0
                            })));
                    } catch (err) {
                        throw err instanceof Error && (err.message = `Copy public dir (${normalizedPath}) to dist failed:\n${err.message}`), err;
                    }
                }
            });
        }
    }), MODULE_PATH_REGEX = /.*[\\/]node_modules[\\/](?!\.pnpm[\\/])(?:(@[^\\/]+)[\\/])?([^\\/]+)/, SPLIT_STRATEGY_DISPATCHER = {
    'split-by-experience': function(ctx) {
        let { override, polyfill, defaultConfig, forceSplittingGroups } = ctx, experienceCacheGroup = {}, packageRegExps = {
            axios: /node_modules[\\/]axios(-.+)?[\\/]/
        };
        for (let [name, test] of (('entry' === polyfill || 'usage' === polyfill) && (packageRegExps.polyfill = /node_modules[\\/](?:tslib|core-js|@swc[\\/]helpers)[\\/]/), Object.entries(packageRegExps))){
            let key = `lib-${name}`;
            experienceCacheGroup[key] = {
                test,
                priority: 0,
                name: key
            };
        }
        return {
            ...defaultConfig,
            ...override,
            cacheGroups: {
                ...defaultConfig.cacheGroups,
                ...experienceCacheGroup,
                ...forceSplittingGroups,
                ...override.cacheGroups
            }
        };
    },
    'split-by-module': function(ctx) {
        let { override, forceSplittingGroups, defaultConfig } = ctx;
        return {
            ...defaultConfig,
            minSize: 0,
            maxInitialRequests: Number.POSITIVE_INFINITY,
            ...override,
            cacheGroups: {
                ...defaultConfig.cacheGroups,
                ...forceSplittingGroups,
                vendors: {
                    priority: -9,
                    test: NODE_MODULES_REGEX,
                    name: (module)=>module ? function(modulePath) {
                            let handleModuleContext = null == modulePath ? void 0 : modulePath.match(MODULE_PATH_REGEX);
                            if (!handleModuleContext) return;
                            let [, scope, name] = handleModuleContext;
                            return [
                                'npm',
                                (scope ?? '').replace('@', ''),
                                name
                            ].filter(Boolean).join('.');
                        }(module.context) : void 0
                },
                ...override.cacheGroups
            }
        };
    },
    'split-by-size': function(ctx) {
        let { override, forceSplittingGroups, defaultConfig, userConfig } = ctx;
        return {
            ...defaultConfig,
            minSize: userConfig.minSize ?? 0,
            maxSize: userConfig.maxSize ?? Number.POSITIVE_INFINITY,
            ...override,
            cacheGroups: {
                ...defaultConfig.cacheGroups,
                ...forceSplittingGroups,
                ...override.cacheGroups
            }
        };
    },
    custom: function(ctx) {
        let { override, forceSplittingGroups, defaultConfig } = ctx;
        return {
            ...defaultConfig,
            ...override,
            cacheGroups: {
                ...defaultConfig.cacheGroups,
                ...forceSplittingGroups,
                ...override.cacheGroups
            }
        };
    },
    'all-in-one': function(_ctx) {
        return !1;
    },
    'single-vendor': function(ctx) {
        let { override, defaultConfig, forceSplittingGroups } = ctx;
        return {
            ...defaultConfig,
            ...override,
            cacheGroups: {
                ...defaultConfig.cacheGroups,
                singleVendor: {
                    test: NODE_MODULES_REGEX,
                    priority: 0,
                    chunks: 'all',
                    name: 'vendor',
                    enforce: !0
                },
                ...forceSplittingGroups,
                ...override.cacheGroups
            }
        };
    }
}, pluginSplitChunks = ()=>({
        name: 'rsbuild:split-chunks',
        setup (api) {
            api.modifyBundlerChain(async (chain, { environment, isServer, isWebWorker })=>{
                var _config_moduleFederation_options, _config_moduleFederation;
                if (isServer || isWebWorker) {
                    chain.optimization.splitChunks(!1), isWebWorker && chain.module.parser.merge({
                        javascript: {
                            dynamicImportMode: 'eager'
                        }
                    });
                    return;
                }
                let { config } = environment, defaultConfig = {
                    chunks: (null == (_config_moduleFederation = config.moduleFederation) || null == (_config_moduleFederation_options = _config_moduleFederation.options) ? void 0 : _config_moduleFederation_options.exposes) ? 'async' : 'all',
                    cacheGroups: {}
                };
                'webpack' === api.context.bundlerType && (defaultConfig.enforceSizeThreshold = 50000);
                let { chunkSplit } = config.performance, forceSplittingGroups = {};
                chunkSplit.forceSplitting && (forceSplittingGroups = function(forceSplitting, strategy) {
                    let cacheGroups = {};
                    for (let [key, regexp] of Array.isArray(forceSplitting) ? forceSplitting.map((regexp, index)=>[
                            `force-split-${index}`,
                            regexp
                        ]) : Object.entries(forceSplitting))cacheGroups[key] = {
                        test: regexp,
                        name: key,
                        chunks: 'all',
                        priority: +('single-vendor' === strategy),
                        enforce: !0
                    };
                    return cacheGroups;
                }(chunkSplit.forceSplitting, chunkSplit.strategy));
                let override = 'custom' === chunkSplit.strategy ? chunkSplit.splitChunks ?? chunkSplit.override : chunkSplit.override, splitChunksOptions = await SPLIT_STRATEGY_DISPATCHER[chunkSplit.strategy || 'split-by-experience']({
                    defaultConfig,
                    override: override || {},
                    forceSplittingGroups,
                    userConfig: chunkSplit,
                    rootPath: api.context.rootPath,
                    polyfill: config.output.polyfill
                });
                chain.optimization.splitChunks(splitChunksOptions);
            });
        }
    }), pluginSri = ()=>({
        name: 'rsbuild:sri',
        setup (api) {
            api.modifyBundlerChain((chain, { environment, CHAIN_ID })=>{
                if ('webpack' === api.context.bundlerType) return;
                let { config, htmlPaths } = environment;
                if (0 === Object.keys(htmlPaths).length) return;
                let { sri } = config.security;
                if (!('auto' === sri.enable ? 'production' === config.mode : sri.enable)) return;
                let crossorigin = chain.output.get('crossOriginLoading');
                (!1 === crossorigin || void 0 === crossorigin) && chain.output.crossOriginLoading('anonymous');
                let { algorithm = 'sha384' } = sri;
                chain.plugin(CHAIN_ID.PLUGIN.SUBRESOURCE_INTEGRITY).use(__WEBPACK_EXTERNAL_MODULE__rspack_core_e0096ff7__.rspack.experiments.SubresourceIntegrityPlugin, [
                    {
                        enabled: !0,
                        hashFuncNames: [
                            algorithm
                        ],
                        htmlPlugin: __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.join(COMPILED_PATH, 'html-rspack-plugin/index.js')
                    }
                ]);
            });
        }
    }), swc_require = (0, __WEBPACK_EXTERNAL_MODULE_node_module_ab9f2194__.createRequire)(import.meta.url), builtinSwcLoaderName = 'builtin:swc-loader', pluginSwc = ()=>({
        name: PLUGIN_SWC_NAME,
        setup (api) {
            api.modifyBundlerChain({
                order: 'pre',
                handler: async (chain, { CHAIN_ID, isDev, target, environment })=>{
                    let { config, browserslist } = environment, cacheRoot = __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.join(api.context.cachePath, '.swc'), rule = chain.module.rule(CHAIN_ID.RULE.JS).test(SCRIPT_REGEX).type("javascript/auto").dependency({
                        not: 'url'
                    }), dataUriRule = chain.module.rule(CHAIN_ID.RULE.JS_DATA_URI).mimetype({
                        or: [
                            "text/javascript",
                            "application/javascript"
                        ]
                    });
                    if (!function({ rule, isDev, config, context, rsbuildTarget }) {
                        for (let condition of (rule.include.add({
                            and: [
                                context.rootPath,
                                {
                                    not: NODE_MODULES_REGEX
                                }
                            ]
                        }), rule.include.add(/\.(?:ts|tsx|jsx|mts|cts)$/), 'web' === rsbuildTarget && isDev && rule.include.add(/[\\/]@rsbuild[\\/]core[\\/]dist[\\/]/), config.source.include || []))rule.include.add(condition);
                        for (let condition of config.source.exclude || [])rule.exclude.add(condition);
                    }({
                        rule,
                        isDev,
                        config,
                        context: api.context,
                        rsbuildTarget: target
                    }), 'webpack' === api.context.bundlerType) return;
                    let swcConfig = {
                        jsc: {
                            externalHelpers: !0,
                            parser: {
                                tsx: !1,
                                syntax: "typescript",
                                decorators: !0
                            },
                            experimental: {
                                cacheRoot: cacheRoot,
                                keepImportAttributes: !0
                            }
                        },
                        isModule: 'unknown',
                        env: {
                            targets: browserslist
                        }
                    };
                    if (function(swcConfig, pluginImport) {
                        let finalPluginImport = reduceTransformImportConfig(pluginImport);
                        (null == finalPluginImport ? void 0 : finalPluginImport.length) && (swcConfig.rspackExperiments ??= {}, swcConfig.rspackExperiments.import ??= [], swcConfig.rspackExperiments.import.push(...finalPluginImport));
                    }(swcConfig, config.source.transformImport), function(swcConfig, config) {
                        swcConfig.jsc ||= {}, swcConfig.jsc.transform ||= {};
                        let { version } = config.source.decorators;
                        switch(version){
                            case 'legacy':
                                swcConfig.jsc.transform.legacyDecorator = !0, swcConfig.jsc.transform.decoratorMetadata = !0, swcConfig.jsc.transform.useDefineForClassFields = !1;
                                break;
                            case '2022-03':
                                swcConfig.jsc.transform.legacyDecorator = !1, swcConfig.jsc.transform.decoratorVersion = '2022-03';
                                break;
                            default:
                                throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:swc]')} Unknown decorators version: ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(version)}`);
                        }
                    }(swcConfig, config), castArray(target).includes('web') || target.includes('web-worker')) {
                        let polyfillMode = config.output.polyfill;
                        if ('off' === polyfillMode) swcConfig.env.mode = void 0;
                        else {
                            swcConfig.env.mode = polyfillMode;
                            let coreJsDir = await applyCoreJs(swcConfig, polyfillMode);
                            for (let item of [
                                rule,
                                dataUriRule
                            ])item.resolve.alias.set('core-js', coreJsDir);
                        }
                    }
                    let mergedSwcConfig = reduceConfigs({
                        initial: swcConfig,
                        config: config.tools.swc,
                        mergeFn: cjs_default()
                    });
                    rule.use(CHAIN_ID.USE.SWC).loader(builtinSwcLoaderName).options(mergedSwcConfig), dataUriRule.resolve.set('fullySpecified', !1).end().use(CHAIN_ID.USE.SWC).loader(builtinSwcLoaderName).options(cloneDeep(mergedSwcConfig));
                }
            });
        }
    }), getCoreJsVersion = (corejsPkgPath)=>{
    try {
        let rawJson = __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.default.readFileSync(corejsPkgPath, 'utf-8'), { version } = JSON.parse(rawJson), [major, minor] = version.split('.');
        return `${major}.${minor}`;
    } catch (err) {
        return '3';
    }
};
async function applyCoreJs(swcConfig, polyfillMode) {
    let coreJsPath = swc_require.resolve('core-js/package.json'), version = getCoreJsVersion(coreJsPath), coreJsDir = __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.dirname(coreJsPath);
    return swcConfig.env.coreJs = version, 'usage' === polyfillMode && (swcConfig.env.shippedProposals = !0), coreJsDir;
}
let reduceTransformImportConfig = (options)=>{
    if (!options) return [];
    let imports = [];
    for (let item of castArray(options))isFunction(item) ? imports = item(imports) ?? imports : imports.push(item);
    return imports;
}, pluginTarget = ()=>({
        name: 'rsbuild:target',
        setup (api) {
            api.modifyBundlerChain({
                order: 'pre',
                handler: async (chain, { target, environment })=>{
                    if ('node' === target) return void chain.target('node');
                    let { browserslist } = environment, isDefaultBrowserslist = browserslist.join(',') === DEFAULT_WEB_BROWSERSLIST.join(',');
                    if ('web-worker' === target) return void chain.target(isDefaultBrowserslist ? [
                        'webworker',
                        'es2017'
                    ] : [
                        'webworker',
                        'es5'
                    ]);
                    let esQuery = isDefaultBrowserslist ? 'es2017' : `browserslist:${browserslist.join(',')}`;
                    chain.target([
                        'web',
                        esQuery
                    ]);
                }
            });
        }
    }), pluginWasm = ()=>({
        name: 'rsbuild:wasm',
        setup (api) {
            api.modifyBundlerChain(async (chain, { CHAIN_ID, environment })=>{
                let { config } = environment, distPath = config.output.distPath.wasm;
                chain.experiments({
                    ...chain.get('experiments'),
                    asyncWebAssembly: !0
                });
                let wasmFilename = __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.posix.join(distPath, '[hash].module.wasm');
                chain.output.webassemblyModuleFilename(wasmFilename), chain.module.rule(CHAIN_ID.RULE.WASM).test(/\.wasm$/).dependency('url').type('asset/resource').set('generator', {
                    filename: wasmFilename
                });
            });
        }
    }), normalizePluginObject = (plugin)=>{
    let { setup: _, ...rest } = plugin;
    return {
        ...rest,
        setup () {}
    };
}, getRsbuildInspectConfig = ({ normalizedConfig, inspectOptions, pluginManager })=>{
    let { environments, ...rsbuildConfig } = normalizedConfig, rawRsbuildConfig = stringifyConfig({
        ...rsbuildConfig,
        plugins: pluginManager.getPlugins().map(normalizePluginObject)
    }, inspectOptions.verbose), environmentConfigs = {}, rawEnvironmentConfigs = [];
    for (let [name, config] of Object.entries(environments)){
        let debugConfig = {
            ...config,
            plugins: pluginManager.getPlugins({
                environment: name
            }).map(normalizePluginObject)
        };
        rawEnvironmentConfigs.push({
            name,
            content: stringifyConfig(debugConfig, inspectOptions.verbose)
        }), environmentConfigs[name] = debugConfig;
    }
    return {
        rsbuildConfig,
        rawRsbuildConfig,
        environmentConfigs: environments,
        rawEnvironmentConfigs
    };
};
async function outputInspectConfigFiles({ rawBundlerConfigs, rawEnvironmentConfigs, inspectOptions, configType }) {
    let { outputPath } = inspectOptions, files = [
        ...rawEnvironmentConfigs.map(({ name, content })=>{
            if (1 === rawEnvironmentConfigs.length) return {
                path: (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.join)(outputPath, 'rsbuild.config.mjs'),
                label: 'Rsbuild config',
                content
            };
            let outputFile = `rsbuild.config.${name}.mjs`;
            return {
                path: (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.join)(outputPath, outputFile),
                label: `Rsbuild config (${name})`,
                content
            };
        }),
        ...rawBundlerConfigs.map(({ name, content })=>{
            let outputFile = `${configType}.config.${name}.mjs`, outputFilePath = (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.join)(outputPath, outputFile);
            return __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.default.existsSync(outputFilePath) && (outputFilePath = outputFilePath.replace(/\.mjs$/, `.${Date.now()}.mjs`)), {
                path: outputFilePath,
                label: `${upperFirst(configType)} Config (${name})`,
                content
            };
        })
    ];
    await __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.default.promises.mkdir(outputPath, {
        recursive: !0
    }), await Promise.all(files.map(async (item)=>__WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.default.promises.writeFile(item.path, `export default ${item.content}`)));
    let fileInfos = files.map((item)=>`  - ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.bold(__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(item.label))}: ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.underline(item.path)}`).join('\n');
    __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.success(`config inspection completed, generated files: \n\n${fileInfos}\n`);
}
function stringifyConfig(config, verbose) {
    return (0, __WEBPACK_EXTERNAL_MODULE__compiled_rspack_chain_index_js_b67fefbd__.default.toString)(config, {
        verbose
    });
}
let getInspectOutputPath = (context, inspectOptions)=>inspectOptions.outputPath ? (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.isAbsolute)(inspectOptions.outputPath) ? inspectOptions.outputPath : (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.join)(context.distPath, inspectOptions.outputPath) : (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.join)(context.distPath, RSBUILD_OUTPUTS_PATH);
async function inspectConfig({ context, pluginManager, bundlerConfigs, inspectOptions = {}, bundler = 'rspack' }) {
    inspectOptions.mode ? setNodeEnv(inspectOptions.mode) : getNodeEnv() || setNodeEnv('development');
    let rawBundlerConfigs = bundlerConfigs.map((config, index)=>({
            name: config.name || String(index),
            content: stringifyConfig(config, inspectOptions.verbose)
        })), { rsbuildConfig, rawRsbuildConfig, environmentConfigs, rawEnvironmentConfigs } = getRsbuildInspectConfig({
        normalizedConfig: context.normalizedConfig,
        inspectOptions,
        pluginManager
    }), outputPath = getInspectOutputPath(context, inspectOptions);
    return inspectOptions.writeToDisk && await outputInspectConfigFiles({
        rawBundlerConfigs,
        rawEnvironmentConfigs,
        inspectOptions: {
            ...inspectOptions,
            outputPath
        },
        configType: bundler
    }), {
        rsbuildConfig: rawRsbuildConfig,
        environmentConfigs: rawEnvironmentConfigs.map((r)=>r.content),
        bundlerConfigs: rawBundlerConfigs.map((r)=>r.content),
        origin: {
            rsbuildConfig,
            environmentConfigs,
            bundlerConfigs
        }
    };
}
var dist = __webpack_require__("../../node_modules/.pnpm/webpack-merge@6.0.1/node_modules/webpack-merge/dist/index.js");
async function modifyRspackConfig(context, rspackConfig, chainUtils) {
    var _utils_environment_config_tools;
    __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug('modify Rspack config');
    let currentConfig = rspackConfig, proxiedConfig = new Proxy({}, {
        get: (_, prop)=>currentConfig[prop],
        set: (_, prop, value)=>(currentConfig[prop] = value, !0)
    }), utils = await getConfigUtils(proxiedConfig, chainUtils);
    if ([currentConfig] = await context.hooks.modifyRspackConfig.callChain({
        environment: utils.environment.name,
        args: [
            rspackConfig,
            utils
        ]
    }), null == (_utils_environment_config_tools = utils.environment.config.tools) ? void 0 : _utils_environment_config_tools.rspack) {
        let toolsRspackConfig = utils.environment.config.tools.rspack;
        currentConfig = await reduceConfigsAsyncWithContext({
            initial: currentConfig,
            config: toolsRspackConfig,
            ctx: utils,
            mergeFn: (...args)=>currentConfig = utils.mergeConfig.call(utils, args)
        });
    }
    return __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug('modify Rspack config done'), currentConfig;
}
async function getConfigUtils(config, chainUtils) {
    return {
        ...chainUtils,
        mergeConfig: dist.merge,
        addRules (rules) {
            let ruleArr = castArray(rules);
            config.module || (config.module = {}), config.module.rules || (config.module.rules = []), config.module.rules.unshift(...ruleArr);
        },
        appendRules (rules) {
            let ruleArr = castArray(rules);
            config.module || (config.module = {}), config.module.rules || (config.module.rules = []), config.module.rules.push(...ruleArr);
        },
        prependPlugins (plugins) {
            let pluginArr = castArray(plugins);
            config.plugins || (config.plugins = []), config.plugins.unshift(...pluginArr);
        },
        appendPlugins (plugins) {
            let pluginArr = castArray(plugins);
            config.plugins || (config.plugins = []), config.plugins.push(...pluginArr);
        },
        removePlugin (pluginName) {
            config.plugins && (config.plugins = config.plugins.filter((plugin)=>!plugin || (plugin.name || plugin.constructor.name) !== pluginName));
        }
    };
}
function getChainUtils(target, environment) {
    let nodeEnv = getNodeEnv();
    return {
        rspack: __WEBPACK_EXTERNAL_MODULE__rspack_core_e0096ff7__.rspack,
        environment,
        env: nodeEnv,
        target,
        isDev: 'development' === environment.config.mode,
        isProd: 'production' === environment.config.mode,
        isServer: 'node' === target,
        isWebWorker: 'web-worker' === target,
        CHAIN_ID: configChain_CHAIN_ID,
        HtmlPlugin: getHTMLPlugin()
    };
}
async function generateRspackConfig({ target, context, environment }) {
    let chainUtils = getChainUtils(target, context.environments[environment]), { BannerPlugin, DefinePlugin, IgnorePlugin, ProvidePlugin, SourceMapDevToolPlugin, HotModuleReplacementPlugin } = __WEBPACK_EXTERNAL_MODULE__rspack_core_e0096ff7__.rspack, rspackConfig = (await modifyBundlerChain(context, {
        ...chainUtils,
        bundler: {
            BannerPlugin,
            DefinePlugin,
            IgnorePlugin,
            ProvidePlugin,
            SourceMapDevToolPlugin,
            HotModuleReplacementPlugin
        }
    })).toConfig();
    var config = rspackConfig = await modifyRspackConfig(context, rspackConfig, chainUtils);
    if (config.plugins) {
        for (let plugin of config.plugins)if (plugin && void 0 === plugin.apply && 'name' in plugin && 'setup' in plugin) {
            let name = __WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.bold(__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(plugin.name));
            throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:plugin]')} "${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(name)}" appears to be an Rsbuild plugin. It cannot be used as an Rspack plugin.`);
        }
    }
    return config.devServer && __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.warn(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:config]')} Find invalid Rspack config: "${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('devServer')}". Note that Rspack's "devServer" config is not supported by Rsbuild. You can use Rsbuild's "dev" config to configure the Rsbuild dev server.`), rspackConfig;
}
async function modifyRsbuildConfig(context) {
    var _context_config_plugins, _modified_plugins;
    __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug('modify Rsbuild config');
    let pluginsCount = (null == (_context_config_plugins = context.config.plugins) ? void 0 : _context_config_plugins.length) ?? 0, [modified] = await context.hooks.modifyRsbuildConfig.callChain(context.config, {
        mergeRsbuildConfig: mergeRsbuildConfig
    });
    context.config = modified, ((null == (_modified_plugins = modified.plugins) ? void 0 : _modified_plugins.length) ?? 0) !== pluginsCount && __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.warn(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild]')} Cannot change plugins via ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('modifyRsbuildConfig')} as plugins are already initialized when it executes.`), __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug('modify Rsbuild config done');
}
async function modifyEnvironmentConfig(context, config, name) {
    __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug(`modify Rsbuild environment(${name}) config`);
    let [modified] = await context.hooks.modifyEnvironmentConfig.callChain({
        environment: name,
        args: [
            config,
            {
                name,
                mergeEnvironmentConfig: mergeRsbuildConfig
            }
        ]
    });
    return __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug(`modify Rsbuild environment(${name}) config done`), modified;
}
let initEnvironmentConfigs = (normalizedConfig, rootPath, specifiedEnvironments)=>{
    let defaultEntry, getDefaultEntryWithMemo = ()=>(defaultEntry || (defaultEntry = function(root) {
            let entryFile = findExists([
                'ts',
                'js',
                'tsx',
                'jsx',
                'mts',
                'cts',
                'mjs',
                'cjs'
            ].map((ext)=>(0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.join)(root, `src/index.${ext}`)));
            return entryFile ? {
                index: entryFile
            } : {};
        }(rootPath)), defaultEntry), { environments, dev, server, provider, ...rsbuildSharedConfig } = normalizedConfig, isEnvironmentEnabled = (name)=>!specifiedEnvironments || specifiedEnvironments.includes(name), applyEnvironmentDefaultConfig = (config)=>{
        config.source.entry && 0 !== Object.keys(config.source.entry).length || (config.source.entry = getDefaultEntryWithMemo());
        let isServer = 'node' === config.output.target;
        return void 0 === config.output.distPath.js && (config.output.distPath.js = isServer ? '' : 'static/js'), config;
    };
    if (environments && Object.keys(environments).length) {
        let resolvedEnvironments = Object.fromEntries(Object.entries(environments).filter(([name])=>isEnvironmentEnabled(name)).map(([name, config])=>[
                name,
                applyEnvironmentDefaultConfig({
                    ...mergeRsbuildConfig({
                        ...rsbuildSharedConfig,
                        dev: pick(dev, [
                            'writeToDisk',
                            'hmr',
                            'assetPrefix',
                            'progressBar',
                            'lazyCompilation'
                        ])
                    }, config)
                })
            ]));
        if (!Object.keys(resolvedEnvironments).length) throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:config]')} The current build is specified to run only in the ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(null == specifiedEnvironments ? void 0 : specifiedEnvironments.join(','))} environment, but the configuration of the specified environment was not found.`);
        return resolvedEnvironments;
    }
    let defaultEnvironmentName = camelCase(rsbuildSharedConfig.output.target);
    if (!isEnvironmentEnabled(defaultEnvironmentName)) throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:config]')} The current build is specified to run only in the ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(null == specifiedEnvironments ? void 0 : specifiedEnvironments.join(','))} environment, but the configuration of the specified environment was not found.`);
    return {
        [defaultEnvironmentName]: applyEnvironmentDefaultConfig({
            ...rsbuildSharedConfig,
            dev: pick(dev, [
                'hmr',
                'assetPrefix',
                'progressBar',
                'lazyCompilation',
                'writeToDisk'
            ])
        })
    };
}, validateRsbuildConfig = (config)=>{
    if (config.server.base && !config.server.base.startsWith('/')) throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:config]')} The ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('"server.base"')} option should start with a slash, for example: "/base"`);
};
async function initRsbuildConfig({ context, pluginManager }) {
    if (context.normalizedConfig) return context.normalizedConfig;
    await initPlugins({
        getPluginAPI: context.getPluginAPI,
        pluginManager
    }), await modifyRsbuildConfig(context);
    let normalizedBaseConfig = normalizeConfig(context.config), environments = {}, mergedEnvironments = initEnvironmentConfigs(normalizedBaseConfig, context.rootPath, context.specifiedEnvironments), { dev: { hmr, assetPrefix, progressBar, lazyCompilation, writeToDisk, ...rsbuildSharedDev }, server } = normalizedBaseConfig, tsconfigPaths = new Set();
    for (let [name, config] of Object.entries(mergedEnvironments)){
        let environmentConfig = await modifyEnvironmentConfig(context, config, name), normalizedEnvironmentConfig = {
            ...environmentConfig,
            dev: {
                ...environmentConfig.dev,
                ...rsbuildSharedDev
            },
            server
        }, { tsconfigPath } = normalizedEnvironmentConfig.source;
        if (tsconfigPath) {
            let absoluteTsconfigPath = ensureAbsolutePath(context.rootPath, tsconfigPath);
            normalizedEnvironmentConfig.source.tsconfigPath = absoluteTsconfigPath, tsconfigPaths.add(absoluteTsconfigPath);
        }
        environments[name] = normalizedEnvironmentConfig;
    }
    tsconfigPaths.size && 'prefer-tsconfig' === normalizedBaseConfig.resolve.aliasStrategy && normalizedBaseConfig.dev.watchFiles.push({
        paths: Array.from(tsconfigPaths),
        type: 'reload-server'
    }), context.normalizedConfig = {
        ...normalizedBaseConfig,
        environments
    }, await updateEnvironmentContext(context, environments);
    let distPaths = Object.values(context.environments).map((item)=>item.distPath);
    return context.distPath = function(paths) {
        let uniquePaths = [
            ...new Set(paths)
        ];
        if (1 === uniquePaths.length) return uniquePaths[0];
        let [first, ...rest] = uniquePaths.map((p)=>p.split(__WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.sep)), common = [];
        for(let i = 0; i < first.length; i++){
            let segment = first[i];
            if (rest.every((p)=>p[i] === segment)) common.push(segment);
            else break;
        }
        return common.join(__WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.sep);
    }(distPaths), validateRsbuildConfig(context.normalizedConfig), context.normalizedConfig;
}
async function initConfigs({ context, pluginManager, rsbuildOptions }) {
    let normalizedConfig = await initRsbuildConfig({
        context,
        pluginManager
    }), rspackConfigs = await Promise.all(Object.entries(normalizedConfig.environments).map(([environment, config])=>generateRspackConfig({
            target: config.output.target,
            context,
            environment
        })));
    if (isDebug()) {
        let inspect = async ()=>{
            await inspectConfig({
                context,
                pluginManager,
                inspectOptions: {
                    verbose: !0,
                    writeToDisk: !0
                },
                rsbuildOptions,
                bundlerConfigs: rspackConfigs
            });
        };
        context.hooks.onBeforeBuild.tap(async ({ isFirstCompile })=>{
            isFirstCompile && await inspect();
        }), context.hooks.onAfterStartDevServer.tap(inspect);
    }
    return {
        rspackConfigs
    };
}
function defineConfig(config) {
    return config;
}
let resolveConfigPath = (root, customConfig)=>{
    if (customConfig) {
        let customConfigPath = (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.isAbsolute)(customConfig) ? customConfig : (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.join)(root, customConfig);
        if (__WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.default.existsSync(customConfigPath)) return customConfigPath;
        __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.warn(`Cannot find config file: ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim(customConfigPath)}\n`);
    }
    for (let file of [
        'rsbuild.config.mjs',
        'rsbuild.config.ts',
        'rsbuild.config.js',
        'rsbuild.config.cjs',
        'rsbuild.config.mts',
        'rsbuild.config.cts'
    ]){
        let configFile = (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.join)(root, file);
        if (__WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.default.existsSync(configFile)) return configFile;
    }
    return null;
};
async function loadConfig_loadConfig({ cwd = process.cwd(), path, envMode, meta, loader = 'jiti' } = {}) {
    let configExport, configFilePath = resolveConfigPath(cwd, path);
    if (!configFilePath) return __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug('no config file found.'), {
        content: {},
        filePath: configFilePath
    };
    let applyMetaInfo = (config)=>(config._privateMeta = {
            configFilePath
        }, config);
    if ('native' === loader || /\.(?:js|mjs|cjs)$/.test(configFilePath)) try {
        let configFileURL = (0, __WEBPACK_EXTERNAL_MODULE_node_url_e96de089__.pathToFileURL)(configFilePath).href, exportModule = await import(`${configFileURL}?t=${Date.now()}`);
        configExport = exportModule.default ? exportModule.default : exportModule;
    } catch (err) {
        if ('native' === loader) throw __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.error(`Failed to load file with native loader: ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim(configFilePath)}`), err;
        __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug(`failed to load file with dynamic import: ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim(configFilePath)}`);
    }
    try {
        if (void 0 === configExport) {
            let { createJiti } = await import("jiti"), jiti = createJiti(constants_filename, {
                moduleCache: !1,
                interopDefault: !0,
                nativeModules: [
                    '@rspack/core',
                    "typescript"
                ]
            });
            configExport = await jiti.import(configFilePath, {
                default: !0
            });
        }
    } catch (err) {
        throw __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.error(`Failed to load file with jiti: ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim(configFilePath)}`), err;
    }
    if ('function' == typeof configExport) {
        let command = process.argv[2], nodeEnv = getNodeEnv(), result = await configExport({
            env: nodeEnv,
            command,
            envMode: envMode || nodeEnv,
            meta
        });
        if (void 0 === result) throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:loadConfig]')} The config function must return a config object.`);
        return {
            content: applyMetaInfo(result),
            filePath: configFilePath
        };
    }
    if (!isObject(configExport)) throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:loadConfig]')} The config must be an object or a function that returns an object, get ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(configExport)}`);
    return __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug('loaded config file:', configFilePath), {
        content: applyMetaInfo(configExport),
        filePath: configFilePath
    };
}
let commonOpts = {}, getEnvDir = (cwd, envDir)=>envDir ? __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.isAbsolute(envDir) ? envDir : __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.join(cwd, envDir) : cwd, init_loadConfig = async (root)=>{
    var _config_server;
    let { content: config, filePath } = await loadConfig_loadConfig({
        cwd: root,
        path: commonOpts.config,
        envMode: commonOpts.envMode,
        loader: commonOpts.configLoader
    });
    return config.dev ||= {}, config.source ||= {}, config.server ||= {}, commonOpts.base && (config.server.base = commonOpts.base), commonOpts.root && (config.root = root), commonOpts.mode && (config.mode = commonOpts.mode), !commonOpts.open || (null == (_config_server = config.server) ? void 0 : _config_server.open) || (config.server.open = commonOpts.open), commonOpts.host && (config.server.host = commonOpts.host), commonOpts.port && (config.server.port = commonOpts.port), void 0 === config.dev.cliShortcuts && (config.dev.cliShortcuts = !0), filePath && (config.dev.watchFiles = [
        ...config.dev.watchFiles ? castArray(config.dev.watchFiles) : [],
        {
            paths: filePath,
            type: 'reload-server'
        }
    ]), config;
};
async function init({ cliOptions, isRestart, isBuildWatch = !1 }) {
    cliOptions && (commonOpts = cliOptions);
    try {
        let cwd = process.cwd(), root = commonOpts.root ? ensureAbsolutePath(cwd, commonOpts.root) : cwd, rsbuild = await createRsbuild({
            cwd: root,
            rsbuildConfig: ()=>init_loadConfig(root),
            environment: commonOpts.environment,
            loadEnv: !1 !== commonOpts.env && {
                cwd: getEnvDir(root, commonOpts.envDir),
                mode: commonOpts.envMode
            }
        });
        return rsbuild.onBeforeCreateCompiler(()=>{
            if ('dev' !== rsbuild.context.action && !isBuildWatch) return;
            let files = [], config = rsbuild.getNormalizedConfig();
            if (config.dev.watchFiles) for (let watchConfig of config.dev.watchFiles){
                if ('reload-server' !== watchConfig.type) continue;
                let paths = castArray(watchConfig.paths);
                watchConfig.options ? watchFilesForRestart({
                    files: paths,
                    rsbuild,
                    isBuildWatch,
                    watchOptions: watchConfig.options
                }) : files.push(...paths);
            }
            watchFilesForRestart({
                files,
                rsbuild,
                isBuildWatch
            });
        }), rsbuild;
    } catch (err) {
        if (isRestart) __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.error(err);
        else throw err;
    }
}
async function setupWatchFiles(options) {
    let { dev, server, root, compilationManager } = options, { hmr, liveReload } = dev;
    if (!hmr && !liveReload || !compilationManager) return;
    let closeDevFilesWatcher = await watchDevFiles(dev, compilationManager, root), serverFilesWatcher = await function(serverConfig, compilationManager, root) {
        let publicDirs = normalizePublicDirs(serverConfig.publicDir);
        if (!publicDirs.length) return;
        let watchPaths = publicDirs.filter((item)=>item.watch).map((item)=>item.name);
        if (watchPaths.length) return startWatchFiles(prepareWatchOptions(watchPaths), compilationManager, root);
    }(server, compilationManager, root);
    return {
        async close () {
            await Promise.all([
                null == closeDevFilesWatcher ? void 0 : closeDevFilesWatcher(),
                null == serverFilesWatcher ? void 0 : serverFilesWatcher.close()
            ]);
        }
    };
}
async function watchDevFiles(devConfig, compilationManager, root) {
    let { watchFiles } = devConfig;
    if (!watchFiles) return;
    let watchers = [];
    for (let { paths, options, type } of castArray(watchFiles)){
        let watchOptions = prepareWatchOptions(paths, options, type), watcher = await startWatchFiles(watchOptions, compilationManager, root);
        watcher && watchers.push(watcher);
    }
    return async ()=>{
        for (let watcher of watchers)await watcher.close();
    };
}
function prepareWatchOptions(paths, options = {}, type) {
    return {
        paths: 'string' == typeof paths ? [
            paths
        ] : paths,
        options,
        type
    };
}
let GLOB_REGEX = /[*?{}[\]()!@+|]/, isGlob = (str)=>GLOB_REGEX.test(str);
async function createChokidar(pathOrGlobs, root, options) {
    let chokidar = await import("../compiled/chokidar/index.js"), watchFiles = new Set(), globPatterns = pathOrGlobs.filter((pathOrGlob)=>!!isGlob(pathOrGlob) || (watchFiles.add(pathOrGlob), !1));
    if (globPatterns.length) {
        let tinyglobby = await import("../compiled/tinyglobby/index.js"), { glob } = tinyglobby.default || tinyglobby;
        for (let file of (await glob(globPatterns, {
            cwd: root,
            absolute: !0
        })))watchFiles.add(file);
    }
    return chokidar.watch(Array.from(watchFiles), options);
}
async function startWatchFiles({ paths, options, type = 'reload-page' }, compilationManager, root) {
    if ('reload-page' !== type) return;
    let watcher = await createChokidar(paths, root, options);
    return watcher.on('change', ()=>{
        compilationManager.socketServer.sockWrite({
            type: 'static-changed'
        });
    }), watcher;
}
let cleaners = [], onBeforeRestartServer = (cleaner)=>{
    cleaners.push(cleaner);
}, clearConsole = ()=>{
    isTTY() && !process.env.DEBUG && process.stdout.write('\x1B[H\x1B[2J');
}, beforeRestart = async ({ filePath, clear = !0, id })=>{
    if (clear && clearConsole(), filePath) {
        let filename = __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.basename(filePath);
        __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.info(`restarting ${id} as ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(filename)} changed\n`);
    } else __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.info(`restarting ${id}...\n`);
    for (let cleaner of cleaners)await cleaner();
    cleaners = [];
}, restartDevServer = async ({ filePath, clear = !0 } = {})=>{
    await beforeRestart({
        filePath,
        clear,
        id: 'server'
    });
    let rsbuild = await init({
        isRestart: !0
    });
    return !!rsbuild && (await rsbuild.startDevServer(), !0);
}, restartBuild = async ({ filePath, clear = !0 } = {})=>{
    await beforeRestart({
        filePath,
        clear,
        id: 'build'
    });
    let rsbuild = await init({
        isRestart: !0,
        isBuildWatch: !0
    });
    return !!rsbuild && (onBeforeRestartServer((await rsbuild.build({
        watch: !0
    })).close), !0);
};
async function watchFilesForRestart({ files, rsbuild, isBuildWatch, watchOptions }) {
    if (!files.length) return;
    let root = rsbuild.context.rootPath, watcher = await createChokidar(files, root, {
        ignoreInitial: !0,
        ignorePermissionErrors: !0,
        ...watchOptions
    }), restarting = !1, onChange = async (filePath)=>{
        restarting || (restarting = !0, (isBuildWatch ? await restartBuild({
            filePath
        }) : await restartDevServer({
            filePath
        })) ? await watcher.close() : __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.error(isBuildWatch ? 'Restart build failed.' : 'Restart server failed.'), restarting = !1);
    };
    watcher.on('add', onChange), watcher.on('change', onChange), watcher.on('unlink', onChange);
}
let isCliShortcutsEnabled = (devConfig)=>devConfig.cliShortcuts && isTTY('stdin');
async function setupCliShortcuts({ help = !0, openPage, closeServer, printUrls, restartServer, customShortcuts }) {
    let shortcuts = [
        {
            key: 'c',
            description: `${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.bold('c + enter')}  ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('clear console')}`,
            action: ()=>{
                console.clear();
            }
        },
        {
            key: 'o',
            description: `${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.bold('o + enter')}  ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('open in browser')}`,
            action: openPage
        },
        {
            key: 'q',
            description: `${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.bold('q + enter')}  ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('quit process')}`,
            action: async ()=>{
                try {
                    await closeServer();
                } finally{
                    process.exit(0);
                }
            }
        },
        restartServer ? {
            key: 'r',
            description: `${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.bold('r + enter')}  ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('restart server')}`,
            action: restartServer
        } : null,
        {
            key: 'u',
            description: `${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.bold('u + enter')}  ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('show urls')}`,
            action: printUrls
        }
    ].filter(Boolean);
    if (customShortcuts && !Array.isArray(shortcuts = customShortcuts(shortcuts))) throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:config]')} ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('dev.cliShortcuts')} option must return an array of shortcuts.`);
    help && __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.log(!0 === help ? `  \u{279C} ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('press')} ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.bold('h + enter')} ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('to show shortcuts')}\n` : `  \u{279C} ${help}\n`);
    let { createInterface } = await import("node:readline"), rl = createInterface({
        input: process.stdin
    });
    return rl.on('line', (input)=>{
        if ('h' === input) {
            let message = `\n  ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.bold(__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.blue('Shortcuts:'))}\n`;
            for (let shortcut of shortcuts)message += `  ${shortcut.description}\n`;
            __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.log(message);
        }
        for (let shortcut of shortcuts)if (input === shortcut.key) return void shortcut.action();
    }), ()=>{
        rl.close();
    };
}
async function getLocalhostResolvedAddress() {
    let { promises: dns } = await import("node:dns"), [defaultLookup, explicitLookup] = await Promise.all([
        dns.lookup('localhost'),
        dns.lookup('localhost', {
            verbatim: !0
        })
    ]);
    return defaultLookup.family === explicitLookup.family && defaultLookup.address === explicitLookup.address ? void 0 : defaultLookup.address;
}
async function resolveHostname(host = 'localhost') {
    if ('localhost' === host) {
        let resolvedAddress = await getLocalhostResolvedAddress();
        if (resolvedAddress) return resolvedAddress;
    }
    return void 0 === host || isWildcardHost(host) ? 'localhost' : host;
}
async function getResolvedClientConfig(clientConfig, serverConfig) {
    let resolvedHost = await resolveHostname(serverConfig.host);
    return {
        ...clientConfig,
        host: resolvedHost,
        port: serverConfig.port
    };
}
let isClientCompiler = (compiler)=>{
    let { target } = compiler.options;
    return !!target && (Array.isArray(target) ? target.includes('web') : 'web' === target);
}, isNodeCompiler = (compiler)=>{
    let { target } = compiler.options;
    return !!target && (Array.isArray(target) ? target.includes('node') : 'node' === target);
}, setupServerHooks = (compiler, { onDone, onInvalid })=>{
    if (isNodeCompiler(compiler)) return;
    let { compile, invalid, done } = compiler.hooks;
    compile.tap('rsbuild-dev-server', ()=>{
        onInvalid(getCompilationId(compiler));
    }), invalid.tap('rsbuild-dev-server', (fileName)=>{
        onInvalid(getCompilationId(compiler), fileName);
    }), done.tap('rsbuild-dev-server', onDone);
}, getCompilationMiddleware = async (compiler, options)=>{
    let { default: rsbuildDevMiddleware } = await import("../compiled/rsbuild-dev-middleware/index.js"), { clientPaths, callbacks, devConfig, serverConfig } = options, resolvedClientConfig = await getResolvedClientConfig(devConfig.client, serverConfig);
    return applyToCompiler(compiler, (compiler)=>{
        clientPaths && function({ compiler, clientPaths, devConfig, resolvedClientConfig }) {
            if (isClientCompiler(compiler)) for (let clientPath of (new compiler.webpack.DefinePlugin({
                RSBUILD_COMPILATION_NAME: JSON.stringify(getCompilationId(compiler)),
                RSBUILD_CLIENT_CONFIG: JSON.stringify(devConfig.client),
                RSBUILD_RESOLVED_CLIENT_CONFIG: JSON.stringify(resolvedClientConfig),
                RSBUILD_DEV_LIVE_RELOAD: devConfig.liveReload
            }).apply(compiler), clientPaths))new compiler.webpack.EntryPlugin(compiler.context, clientPath, {
                name: void 0
            }).apply(compiler);
        }({
            compiler,
            clientPaths,
            devConfig,
            resolvedClientConfig
        }), setupServerHooks(compiler, callbacks);
    }), rsbuildDevMiddleware(compiler, {
        etag: 'weak',
        publicPath: '/',
        stats: !1,
        serverSideRender: !0,
        writeToDisk: devConfig.writeToDisk
    });
}, styles = {
    1: 'font-weight:bold',
    2: 'opacity:0.5',
    3: 'font-style:italic',
    4: 'text-decoration:underline;text-underline-offset:3px',
    8: 'display:none',
    9: 'text-decoration:line-through',
    30: 'color:#000',
    31: 'color:#fb6a6a',
    32: 'color:#6ef790',
    33: 'color:#eff986',
    34: 'color:#6eb2f7',
    35: 'color:#f76ebe',
    36: 'color:#6eecf7',
    37: 'color:#f0f0f0',
    90: 'color:#888'
};
for(let i = 91; i <= 97; i++)styles[i] = styles[i - 60];
let closeCode = [
    0,
    21,
    22,
    23,
    24,
    27,
    28,
    29,
    39,
    49
];
function socketServer_define_property(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
class SocketServer {
    clearHeartbeatTimer() {
        this.heartbeatTimer && (clearInterval(this.heartbeatTimer), this.heartbeatTimer = null);
    }
    async prepare() {
        var _this_options_client;
        this.clearHeartbeatTimer();
        let { default: ws } = await import("../compiled/ws/index.js");
        this.wsServer = new ws.Server({
            noServer: !0,
            path: null == (_this_options_client = this.options.client) ? void 0 : _this_options_client.path
        }), this.wsServer.on('error', (err)=>{
            __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.error(err);
        }), this.heartbeatTimer = setTimeout(this.checkSockets, 30000).unref(), this.wsServer.on('connection', (socket, req)=>{
            let queryStr = req.url ? req.url.split('?')[1] : '';
            this.onConnect(socket, queryStr ? Object.fromEntries(new URLSearchParams(queryStr)) : {});
        });
    }
    updateStats(stats) {
        let compilationId = getCompilationId(stats.compilation);
        this.stats[compilationId] = stats, this.sockets.length && this.sendStats({
            compilationId
        });
    }
    sockWrite({ type, compilationId, data }) {
        for (let socket of this.sockets)this.send(socket, JSON.stringify({
            type,
            data,
            compilationId
        }));
    }
    singleWrite(socket, { type, data, compilationId }) {
        this.send(socket, JSON.stringify({
            type,
            data,
            compilationId
        }));
    }
    async close() {
        for (let socket of (this.clearHeartbeatTimer(), this.wsServer.removeAllListeners(), this.wsServer.clients))socket.terminate();
        for (let socket of this.sockets)socket.close();
        return this.stats = {}, this.initialChunks = {}, this.sockets.length = 0, new Promise((resolve, reject)=>{
            this.wsServer.close((err)=>{
                err ? reject(err) : resolve();
            });
        });
    }
    onConnect(socket, params) {
        socket.isAlive = !0, socket.on('pong', ()=>{
            socket.isAlive = !0;
        }), this.sockets.push(socket), socket.on('close', ()=>{
            let index = this.sockets.indexOf(socket);
            index >= 0 && this.sockets.splice(index, 1);
        }), (this.options.hmr || this.options.liveReload) && this.singleWrite(socket, {
            type: 'hot',
            compilationId: params.compilationId
        }), this.stats && this.sendStats({
            force: !0,
            compilationId: params.compilationId
        });
    }
    getStats(name) {
        let curStats = this.stats[name];
        if (!curStats) return null;
        let statsOptions = getStatsOptions(curStats.compilation.compiler), statsJson = curStats.toJson({
            all: !1,
            hash: !0,
            assets: !0,
            warnings: !0,
            warningsCount: !0,
            errors: !0,
            errorsCount: !0,
            errorDetails: !1,
            entrypoints: !0,
            children: !0,
            moduleTrace: !0,
            ...statsOptions
        });
        return statsJson ? {
            statsJson,
            root: curStats.compilation.compiler.options.context
        } : null;
    }
    sendStats({ force = !1, compilationId }) {
        let result = this.getStats(compilationId);
        if (!result) return null;
        let { statsJson, root } = result, newInitialChunks = new Set();
        if (statsJson.entrypoints) for (let entrypoint of Object.values(statsJson.entrypoints)){
            let chunks = entrypoint.chunks;
            if (Array.isArray(chunks)) for (let chunkName of chunks)chunkName && newInitialChunks.add(String(chunkName));
        }
        let initialChunks = this.initialChunks[compilationId], shouldReload = !!statsJson.entrypoints && !!initialChunks && !(initialChunks.size === newInitialChunks.size && [
            ...initialChunks
        ].every((value)=>newInitialChunks.has(value)));
        if (this.initialChunks[compilationId] = newInitialChunks, shouldReload) return this.sockWrite({
            type: 'static-changed',
            compilationId
        });
        if (!force && statsJson && !statsJson.errorsCount && statsJson.assets && statsJson.assets.every((asset)=>!asset.emitted)) return this.sockWrite({
            type: 'ok',
            compilationId
        });
        if (this.sockWrite({
            type: 'hash',
            compilationId,
            data: statsJson.hash
        }), statsJson.errorsCount) {
            let { errors: formattedErrors } = formatStatsMessages({
                errors: getAllStatsErrors(statsJson),
                warnings: []
            });
            return this.sockWrite({
                type: 'errors',
                compilationId,
                data: {
                    text: formattedErrors,
                    html: function(errors, root) {
                        let htmlItems = errors.map((item)=>{
                            var text = function(text) {
                                let ansiCodes = [], ret = text.replace(/\x1B\[([0-9;]+)m/g, (_match, sequences)=>{
                                    let style = '';
                                    for (let seq of sequences.split(';'))styles[seq] && (style += `${styles[seq]};`);
                                    return style ? (ansiCodes.push(sequences), `<span style="${style}">`) : closeCode.includes(Number(sequences)) && ansiCodes.length > 0 ? (ansiCodes.pop(), '</span>') : '';
                                });
                                return ansiCodes.length > 0 && (ret += Array(ansiCodes.length + 1).join('</span>')), ret;
                            }(item ? item.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') : ''), root1 = root;
                            let pathRegex = /(?:\.\.?[\/\\]|[a-zA-Z]:\\|\/)[^:]*:\d+:\d+/g, urlRegex = /(https?:\/\/(?:[\w-]+\.)+[a-z0-9](?:[\w-.~:/?#[\]@!$&'*+,;=])*)/gi;
                            return text.split('\n').map((line)=>{
                                let replacedLine = line.replace(pathRegex, (file)=>{
                                    let hasClosingSpan = file.includes('</span>') && !file.includes('<span'), filePath = hasClosingSpan ? file.replace('</span>', '') : file, isAbsolute = __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.isAbsolute(filePath), absolutePath = root1 && !isAbsolute ? __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.join(root1, filePath) : filePath, relativePath = root1 && isAbsolute ? function(base, filepath) {
                                        let relativePath = (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.relative)(base, filepath);
                                        return '' === relativePath ? `.${__WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.sep}` : relativePath.startsWith('.') ? relativePath : `.${__WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.sep}${relativePath}`;
                                    }(root1, filePath) : filePath;
                                    return `<a class="file-link" data-file="${absolutePath}">${relativePath}</a>${hasClosingSpan ? '</span>' : ''}`;
                                });
                                return replacedLine.replace(urlRegex, (url)=>`<a class="url-link" href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
                            }).join('\n');
                        });
                        return `
<style>
.root {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  margin: 0;
  background: rgba(0, 0, 0, 0.66);
  cursor: pointer;
}
.container {
  font-family: Menlo, Consolas, monospace;
  line-height: 1.6;
  width: 960px;
  max-width: 85%;
  color: #d8d8d8;
  margin: 32px auto;
  padding: 32px 40px;
  position: relative;
  background: #181818;
  border-radius: 24px;
  box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
  overflow: hidden;
  direction: ltr;
  text-align: left;
  box-sizing: border-box;
  cursor: default;
}
.title {
  margin: 0 0 20px;
  padding-bottom: 12px;
  font-size: 17px;
  font-weight: 600;
  color: #fb6a6a;
  border-bottom: 2px solid rgba(252,94,94,.66);
}
.content {
  margin: 0;
  font-size: 14px;
  font-family: inherit;
  overflow-x: scroll;
  scrollbar-width: none;
}
.content::-webkit-scrollbar {
  display: none;
}
.file-link,
.url-link,
.config-link {
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.6;
  }
}
.file-link {
  color: #6eecf7;
}
.url-link {
  color: #eff986;
}
.config-link {
  color: inherit;
  text-decoration: none;
}
.close {
  position: absolute;
  top: 27px;
  right: 32px;
  width: 32px;
  height: 32px;
  cursor: pointer;
}
.close:hover {
  opacity: 0.8;
}
.close:active {
  opacity: 0.6;
}
.close:before,
.close:after {
  position: absolute;
  left: 16px;
  top: 8px;
  content: ' ';
  height: 18px;
  width: 2px;
  border-radius: 4px;
  background-color: #b8b8b8;
}
.close:before {
  transform: rotate(45deg);
}
.close:after {
  transform: rotate(-45deg);
}
.footer {
  font-size: 12px;
  color: #7e6a92;
  margin-top: 20px;
  padding-top: 12px;
  border-top: 2px solid rgba(126,106,146,.6);
}
.footer p {
  margin: 4px 0 0;
}
.footer span {
  color: #a88dc3;
}
</style>

<div class="root">
  <div class="container">
    <div class="close"></div>
    <p class="title">Build failed</p>
    <pre class="content">${htmlItems.join('\n\n').trim()}</pre>
    <footer class="footer">
      <p><span>Fix error</span>, click outside, or press Esc to close the overlay.</p>
      <p>Disable overlay by setting Rsbuild's <span><a class="config-link" target="_blank" rel="noopener noreferrer" href="https://rsbuild.dev/config/dev/client">dev.client.overlay</a></span> config to false.<p>
    </footer>
  </div>
</div>
`;
                    }(formattedErrors, root)
                }
            });
        }
        if (statsJson.warningsCount) {
            let { warnings: formattedWarnings } = formatStatsMessages({
                warnings: getAllStatsWarnings(statsJson),
                errors: []
            });
            return this.sockWrite({
                type: 'warnings',
                compilationId,
                data: {
                    text: formattedWarnings
                }
            });
        }
        return this.sockWrite({
            type: 'ok',
            compilationId
        });
    }
    send(connection, message) {
        1 === connection.readyState && connection.send(message);
    }
    constructor(options){
        socketServer_define_property(this, "wsServer", void 0), socketServer_define_property(this, "sockets", []), socketServer_define_property(this, "options", void 0), socketServer_define_property(this, "stats", void 0), socketServer_define_property(this, "initialChunks", void 0), socketServer_define_property(this, "heartbeatTimer", null), socketServer_define_property(this, "upgrade", (req, sock, head)=>{
            this.wsServer.shouldHandle(req) && this.wsServer.handleUpgrade(req, sock, head, (connection)=>{
                this.wsServer.emit('connection', connection, req);
            });
        }), socketServer_define_property(this, "checkSockets", ()=>{
            for (let socket of this.wsServer.clients)socket.isAlive ? (socket.isAlive = !1, socket.ping(()=>{})) : socket.terminate();
            null !== this.heartbeatTimer && (this.heartbeatTimer = setTimeout(this.checkSockets, 30000).unref());
        }), this.options = options, this.stats = {}, this.initialChunks = {};
    }
}
function compilationManager_define_property(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
let compilationManager_require = (0, __WEBPACK_EXTERNAL_MODULE_node_module_ab9f2194__.createRequire)(import.meta.url), formatDevConfig = (config, environments)=>{
    let writeToDiskValues = Object.values(environments).map((env)=>env.config.dev.writeToDisk);
    return 1 === new Set(writeToDiskValues).size ? {
        ...config,
        writeToDisk: writeToDiskValues[0]
    } : {
        ...config,
        writeToDisk (filePath, compilationName) {
            let { writeToDisk } = config;
            return compilationName && environments[compilationName] && (writeToDisk = environments[compilationName].config.dev.writeToDisk ?? writeToDisk), 'function' == typeof writeToDisk ? writeToDisk(filePath) : writeToDisk;
        }
    };
};
class CompilationManager {
    async init() {
        await this.setupCompilationMiddleware(), await this.socketServer.prepare();
        let { compiler } = this;
        this.outputFileSystem = (helpers_isMultiCompiler(compiler) ? compiler.compilers[0].outputFileSystem : compiler.outputFileSystem) || __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.default;
    }
    async close() {
        await this.socketServer.close(), this.middleware && await new Promise((resolve)=>{
            this.middleware.close(()=>{
                resolve();
            });
        }), await new Promise((resolve)=>{
            this.compiler.close(()=>{
                resolve();
            });
        });
    }
    async setupCompilationMiddleware() {
        let { devConfig, serverConfig, publicPaths } = this, clientPaths = function(devConfig) {
            var _devConfig_client;
            let clientPaths = [];
            return (devConfig.hmr || devConfig.liveReload) && (clientPaths.push(compilationManager_require.resolve('@rsbuild/core/client/hmr')), (null == (_devConfig_client = devConfig.client) ? void 0 : _devConfig_client.overlay) && clientPaths.push(`${compilationManager_require.resolve('@rsbuild/core/client/overlay')}`)), clientPaths;
        }(devConfig), middleware = await getCompilationMiddleware(this.compiler, {
            callbacks: {
                onInvalid: (compilationId, fileName)=>{
                    if ('string' == typeof fileName && HTML_REGEX.test(fileName)) return void this.socketServer.sockWrite({
                        type: 'static-changed',
                        compilationId
                    });
                    this.socketServer.sockWrite({
                        type: 'invalid',
                        compilationId
                    });
                },
                onDone: (stats)=>{
                    this.socketServer.updateStats(stats);
                }
            },
            clientPaths,
            devConfig,
            serverConfig
        }), { base } = serverConfig, assetPrefixes = publicPaths.map(getPathnameFromUrl).map((prefix)=>base && '/' !== base ? stripBase(prefix, base) : prefix), wrapper = async (req, res, next)=>{
            let { url } = req, assetPrefix = url && assetPrefixes.find((prefix)=>url.startsWith(prefix));
            assetPrefix && '/' !== assetPrefix ? (req.url = url.slice(assetPrefix.length - 1), middleware(req, res, (...args)=>{
                req.url = url, next(...args);
            })) : middleware(req, res, next);
        };
        wrapper.close = middleware.close, this.middleware = wrapper;
    }
    constructor({ dev, server, compiler, publicPaths, environments }){
        compilationManager_define_property(this, "middleware", void 0), compilationManager_define_property(this, "outputFileSystem", void 0), compilationManager_define_property(this, "devConfig", void 0), compilationManager_define_property(this, "serverConfig", void 0), compilationManager_define_property(this, "compiler", void 0), compilationManager_define_property(this, "publicPaths", void 0), compilationManager_define_property(this, "socketServer", void 0), compilationManager_define_property(this, "readFileSync", (fileName)=>'readFileSync' in this.outputFileSystem ? this.outputFileSystem.readFileSync(fileName, 'utf-8') : __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.default.readFileSync(fileName, 'utf-8')), this.devConfig = formatDevConfig(dev, environments), this.serverConfig = server, this.compiler = compiler, this.publicPaths = publicPaths, this.outputFileSystem = __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.default, this.socketServer = new SocketServer(dev);
    }
}
let ENCODING_REGEX = /\bgzip\b/, CONTENT_TYPE_REGEX = /text|javascript|\/json|xml/i, shouldCompress = (res)=>{
    if (res.getHeader('Content-Encoding')) return !1;
    let contentType = String(res.getHeader('Content-Type'));
    if (contentType && !CONTENT_TYPE_REGEX.test(contentType)) return !1;
    let size = res.getHeader('Content-Length');
    return void 0 === size || Number(size) > 1024;
}, gzipMiddleware = ({ level = __WEBPACK_EXTERNAL_MODULE_node_zlib_a5bb16fc__.default.constants.Z_BEST_SPEED } = {})=>(req, res, next)=>{
        let gzip, writeHeadStatus, accept = req.headers['accept-encoding'], encoding = 'string' == typeof accept && ENCODING_REGEX.test(accept);
        if ('HEAD' === req.method || !encoding) return void next();
        let started = !1, { end, write, on, writeHead } = res, listeners = [], start = ()=>{
            if (!started) {
                if (started = !0, shouldCompress(res)) for (let listener of (res.setHeader('Content-Encoding', 'gzip'), res.removeHeader('Content-Length'), (gzip = __WEBPACK_EXTERNAL_MODULE_node_zlib_a5bb16fc__.default.createGzip({
                    level
                })).on('data', (chunk)=>{
                    !1 === write.call(res, chunk) && gzip.pause();
                }), on.call(res, 'drain', ()=>gzip.resume()), gzip.on('end', ()=>{
                    end.call(res);
                }), listeners))gzip.on.apply(gzip, listener);
                else for (let listener of listeners)on.apply(res, listener);
                writeHead.call(res, writeHeadStatus ?? res.statusCode);
            }
        };
        res.writeHead = (status, reason, headers)=>{
            if (reason) for (let [key, value] of Object.entries(headers || reason))res.setHeader(key, value);
            return writeHeadStatus = status, res;
        }, res.write = (...args)=>(start(), gzip ? gzip.write(...args) : write.apply(res, args)), res.end = (...args)=>(start(), gzip ? gzip.end(...args) : end.apply(res, args)), res.on = (type, listener)=>(started ? gzip && 'drain' === type ? gzip.on(type, listener) : on.call(res, type, listener) : listeners.push([
                type,
                listener
            ]), res), next();
    }, faviconFallbackMiddleware = (req, res, next)=>{
    '/favicon.ico' === req.url ? (res.statusCode = 204, res.end()) : next();
}, getStatusCodeColor = (status)=>status >= 500 ? __WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.red : status >= 400 ? __WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow : status >= 300 ? __WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.cyan : status >= 200 ? __WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.green : (res)=>res, getRequestLoggerMiddleware = async ()=>{
    let { default: onFinished } = await import("../compiled/on-finished/index.js");
    return (req, res, next)=>{
        let _startAt = process.hrtime();
        onFinished(res, ()=>{
            let method = req.method, url = req.originalUrl || req.url, status = Number(res.statusCode), statusColor = getStatusCodeColor(status), endAt = process.hrtime(), totalTime = (endAt[0] - _startAt[0]) * 1e3 + (endAt[1] - _startAt[1]) * 1e-6;
            __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug(`${statusColor(status)} ${method} ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.gray(url)} ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.gray(`${totalTime.toFixed(3)} ms`)}`);
        }), next();
    };
}, notFoundMiddleware = (_req, res, _next)=>{
    res.statusCode = 404, res.end();
}, optionsFallbackMiddleware = (req, res, next)=>{
    if ('OPTIONS' === req.method) {
        res.statusCode = 204, res.setHeader('Content-Length', '0'), res.end();
        return;
    }
    next();
}, middlewares_isFileExists = async (filePath, outputFileSystem)=>new Promise((resolve)=>{
        outputFileSystem.stat(filePath, (_error, stats)=>{
            resolve(null == stats ? void 0 : stats.isFile());
        });
    }), maybeHTMLRequest = (req)=>{
    if (!req.url || !req.headers || 'GET' !== req.method && 'HEAD' !== req.method) return !1;
    let { accept } = req.headers;
    return 'string' == typeof accept && (accept.includes('text/html') || accept.includes('*/*'));
}, postfixRE = /[?#].*$/, getUrlPathname = (url)=>url.replace(postfixRE, ''), getHtmlCompletionMiddleware = ({ distPath, compilationManager })=>async (req, res, next)=>{
        if (!maybeHTMLRequest(req)) return next();
        let pathname = getUrlPathname(req.url), rewrite = (newUrl)=>(req.url = newUrl, compilationManager.middleware(req, res, (...args)=>{
                next(...args);
            }));
        if (pathname.endsWith('/')) {
            let newUrl = `${pathname}index.html`, filePath = __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.join(distPath, newUrl);
            if (await middlewares_isFileExists(filePath, compilationManager.outputFileSystem)) return rewrite(newUrl);
        } else if (!__WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.extname(pathname)) {
            let newUrl = `${pathname}.html`, filePath = __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.join(distPath, newUrl);
            if (await middlewares_isFileExists(filePath, compilationManager.outputFileSystem)) return rewrite(newUrl);
        }
        next();
    }, getBaseMiddleware = ({ base })=>async (req, res, next)=>{
        var _req_headers_accept;
        let url = req.url, pathname = getUrlPathname(url);
        if (pathname.startsWith(base)) return req.url = stripBase(url, base), next();
        let redirectPath = addTrailingSlash(url) !== base ? joinUrlSegments(base, url) : base;
        if ('/' === pathname || '/index.html' === pathname) {
            res.writeHead(302, {
                Location: redirectPath
            }), res.end();
            return;
        }
        if (null == (_req_headers_accept = req.headers.accept) ? void 0 : _req_headers_accept.includes('text/html')) {
            res.writeHead(404, {
                'Content-Type': 'text/html'
            }), res.end(`The server is configured with a base URL of ${base} - did you mean to visit <a href="${redirectPath}">${redirectPath}</a> instead?`);
            return;
        }
        res.writeHead(404, {
            'Content-Type': 'text/plain'
        }), res.end(`The server is configured with a base URL of ${base} - did you mean to visit ${redirectPath} instead?`);
    }, getHtmlFallbackMiddleware = ({ htmlFallback, distPath, compilationManager })=>async (req, res, next)=>{
        if (!maybeHTMLRequest(req) || '/favicon.ico' === req.url || 'index' !== htmlFallback) return next();
        let filePath = __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.join(distPath, 'index.html');
        if (await middlewares_isFileExists(filePath, compilationManager.outputFileSystem)) {
            let newUrl = '/index.html';
            return 'verbose' === __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.level && __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug(`${req.method} ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.gray(`${req.url} ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('fallback')} to ${newUrl}`)}`), req.url = newUrl, compilationManager.middleware(req, res, (...args)=>next(...args));
        }
        next();
    }, viewingServedFilesMiddleware = ({ environments })=>async (req, res, next)=>{
        if ('/rsbuild-dev-server' === getUrlPathname(req.url)) {
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8'
            }), res.write(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        margin: 0;
        color: #f6f7f9;
        padding: 32px 40px;
        line-height: 1.8;
        min-height: 100vh;
        background-image: linear-gradient(#020917, #101725);
        font-family: ui-sans-serif,system-ui,sans-serif;
      }
      h1, h2 {
        font-weight: 500;
      }
      h1 {
        margin: 0;
        font-size: 36px;
      }
      h2 {
        font-size: 20px;
        margin: 24px 0 16px;
      }
      ul {
        margin: 0;
        padding-left: 16px;
      }
      a {
        color: #58c4dc;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <h1>Assets Report</h1>
  </body>
</html>`);
            try {
                for(let key in environments){
                    let list = [];
                    res.write(`<h2>Environment: ${key}</h2>`);
                    let environment = environments[key], { assets = [] } = (await environment.getStats()).toJson();
                    for (let asset of (res.write('<ul>'), assets))list.push(`<li><a target="_blank" href="${null == asset ? void 0 : asset.name}">${null == asset ? void 0 : asset.name}</a></li>`);
                    res.write(null == list ? void 0 : list.join('')), res.write('</ul>');
                }
                res.end('</body></html>');
            } catch (err) {
                __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.error(err), res.writeHead(500), res.end('Failed to list the files');
            }
        } else next();
    }, createProxyMiddleware = async (proxyOptions)=>{
    let formattedOptions = function(proxyOptions) {
        let ret = [];
        if (Array.isArray(proxyOptions)) ret.push(...proxyOptions);
        else if ('target' in proxyOptions) ret.push(proxyOptions);
        else for (let [context, options] of Object.entries(proxyOptions)){
            let opts = {
                context,
                changeOrigin: !0,
                logLevel: 'warn',
                logProvider: ()=>__WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger
            };
            'string' == typeof options ? opts.target = options : Object.assign(opts, options), ret.push(opts);
        }
        return ret;
    }(proxyOptions), proxyMiddlewares = [], middlewares = [], { createProxyMiddleware: baseMiddleware } = await import("../compiled/http-proxy-middleware/index.js");
    for (let opts of formattedOptions){
        let { onProxyRes } = opts;
        opts.onProxyRes = (proxyRes, _req, res)=>{
            onProxyRes && onProxyRes(proxyRes, _req, res), res.on('close', ()=>{
                res.writableEnded || proxyRes.destroy();
            });
        };
        let proxyMiddleware = baseMiddleware(opts.context, opts), middleware = async (req, res, next)=>{
            let bypassUrl = 'function' == typeof opts.bypass ? await opts.bypass(req, res, opts) : null;
            !1 === bypassUrl ? (res.statusCode = 404, next()) : 'string' == typeof bypassUrl ? (req.url = bypassUrl, next()) : !0 === bypassUrl ? next() : proxyMiddleware(req, res, next);
        };
        middlewares.push(middleware), opts.ws && proxyMiddlewares.push(proxyMiddleware);
    }
    return {
        middlewares,
        upgrade: (req, socket, head)=>{
            for (let middleware of proxyMiddlewares)'function' == typeof middleware.upgrade && middleware.upgrade(req, socket, head);
        }
    };
}, applySetupMiddlewares = (dev, devServerAPI)=>{
    let setupMiddlewares = dev.setupMiddlewares || [], serverOptions = pick(devServerAPI, [
        'sockWrite',
        'environments'
    ]), before = [], after = [];
    for (let handler of setupMiddlewares)handler({
        unshift: (...handlers)=>before.unshift(...handlers),
        push: (...handlers)=>after.push(...handlers)
    }, serverOptions);
    return {
        before,
        after
    };
}, applyDefaultMiddlewares = async ({ dev, devServerAPI, middlewares, server, compilationManager, context, pwd, postCallbacks })=>{
    let upgradeEvents = [];
    if (server.cors) {
        let { default: corsMiddleware } = await import("../compiled/cors/index.js");
        middlewares.push(corsMiddleware('boolean' == typeof server.cors ? {} : server.cors));
    }
    let { headers } = server;
    if (headers && middlewares.push((_req, res, next)=>{
        for (let [key, value] of Object.entries(headers))res.setHeader(key, value);
        next();
    }), server.proxy) {
        let { middlewares: proxyMiddlewares, upgrade } = await createProxyMiddleware(server.proxy);
        for (let middleware of (upgradeEvents.push(upgrade), proxyMiddlewares))middlewares.push(middleware);
    }
    if (server.compress && middlewares.push(gzipMiddleware()), 'dev' === context.action && 'rspack' === context.bundlerType && dev.lazyCompilation && compilationManager) {
        let { compiler } = compilationManager;
        'object' == typeof dev.lazyCompilation && 'string' == typeof dev.lazyCompilation.serverUrl && context.devServer && (dev.lazyCompilation.serverUrl = replacePortPlaceholder(dev.lazyCompilation.serverUrl, context.devServer.port)), middlewares.push(__WEBPACK_EXTERNAL_MODULE__rspack_core_e0096ff7__.rspack.experiments.lazyCompilationMiddleware(helpers_isMultiCompiler(compiler) ? compiler.compilers[0] : compiler, dev.lazyCompilation));
    }
    server.base && '/' !== server.base && middlewares.push(getBaseMiddleware({
        base: server.base
    }));
    let { default: launchEditorMiddleware } = await import("../compiled/launch-editor-middleware/index.js");
    for (let publicDir of (middlewares.push([
        '/__open-in-editor',
        launchEditorMiddleware()
    ]), middlewares.push(viewingServedFilesMiddleware({
        environments: devServerAPI.environments
    })), compilationManager && (middlewares.push(compilationManager.middleware), upgradeEvents.push(compilationManager.socketServer.upgrade), middlewares.push((req, res, next)=>{
        var _req_url;
        (null == (_req_url = req.url) ? void 0 : _req_url.endsWith('.hot-update.json')) && 'OPTIONS' !== req.method ? (res.statusCode = 404, res.end()) : next();
    })), compilationManager && middlewares.push(getHtmlCompletionMiddleware({
        compilationManager,
        distPath: context.distPath
    })), normalizePublicDirs(null == server ? void 0 : server.publicDir))){
        let { default: sirv } = await import("../compiled/sirv/index.js"), { name } = publicDir, assetMiddleware = sirv((0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.isAbsolute)(name) ? name : (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.join)(pwd, name), {
            etag: !0,
            dev: !0
        });
        middlewares.push(assetMiddleware);
    }
    for (let callback of postCallbacks)callback();
    if (compilationManager && middlewares.push(getHtmlFallbackMiddleware({
        compilationManager,
        distPath: context.distPath,
        htmlFallback: server.htmlFallback
    })), server.historyApiFallback) {
        let { default: connectHistoryApiFallback } = await import("../compiled/connect-history-api-fallback/index.js"), historyApiFallbackMiddleware = connectHistoryApiFallback(!0 === server.historyApiFallback ? {} : server.historyApiFallback);
        middlewares.push(historyApiFallbackMiddleware), (null == compilationManager ? void 0 : compilationManager.middleware) && middlewares.push(compilationManager.middleware);
    }
    return middlewares.push(faviconFallbackMiddleware), {
        onUpgrade: (...args)=>{
            for (let cb of upgradeEvents)cb(...args);
        }
    };
}, getDevMiddlewares = async (options)=>{
    let middlewares = [], { compilationManager } = options;
    'verbose' === __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.level && middlewares.push(await getRequestLoggerMiddleware());
    let { before, after } = applySetupMiddlewares(options.dev, options.devServerAPI);
    middlewares.push(...before);
    let { onUpgrade } = await applyDefaultMiddlewares({
        ...options,
        middlewares
    });
    return middlewares.push(...after), {
        close: async ()=>{
            await (null == compilationManager ? void 0 : compilationManager.close());
        },
        onUpgrade,
        middlewares
    };
}, asModule = async (something, context, unlinked)=>{
    let { Module, SyntheticModule } = await import("node:vm");
    if (something instanceof Module) return something;
    let exports = [
        ...new Set([
            'default',
            ...Object.keys(something)
        ])
    ], m = new SyntheticModule(exports, ()=>{
        for (let name of exports)m.setExport(name, 'default' === name ? something : something[name]);
    }, {
        context
    });
    return unlinked || (await m.link(()=>{}), m.instantiate && m.instantiate(), await m.evaluate()), m;
};
function basic_define_property(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
let isRelativePath = (p)=>/^\.\.?\//.test(p), getSubPath = (p)=>{
    let lastSlash = p.lastIndexOf('/'), firstSlash = p.indexOf('/');
    if (-1 !== lastSlash && firstSlash !== lastSlash) {
        if (-1 !== firstSlash) {
            let next = p.indexOf('/', firstSlash + 1), dir = p.slice(firstSlash + 1, next);
            for(; '.' === dir;)firstSlash = next, next = p.indexOf('/', firstSlash + 1), dir = p.slice(firstSlash + 1, next);
        }
        return p.slice(firstSlash + 1, lastSlash + 1);
    }
    return '';
};
class BasicRunner {
    run(file) {
        this.globalContext || (this.globalContext = this.createGlobalContext()), this.baseModuleScope = this.createBaseModuleScope(), this.createRunner();
        let res = this.getRequire()(this._options.dist, file.startsWith('./') ? file : `./${file}`);
        return 'object' == typeof res && 'then' in res ? res : Promise.resolve(res);
    }
    getRequire() {
        let entryRequire = this.requirers.get('entry');
        return (currentDirectory, modulePath, context = {})=>entryRequire(currentDirectory, Array.isArray(modulePath) ? modulePath : modulePath.split('?')[0], context);
    }
    getFile(modulePath, currentDirectory) {
        if (Array.isArray(modulePath)) return {
            path: __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.join(currentDirectory, '.array-require.js'),
            content: `module.exports = (${modulePath.map((arg)=>`require(${JSON.stringify(`./${arg}`)})`).join(', ')});`,
            subPath: ''
        };
        let joinedPath = isRelativePath(modulePath) ? __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.join(currentDirectory, modulePath) : modulePath;
        return this._options.isBundleOutput(joinedPath) ? {
            path: joinedPath,
            content: this._options.readFileSync(joinedPath),
            subPath: getSubPath(modulePath)
        } : null;
    }
    preExecute(_code, _file) {}
    postExecute(_m, _file) {}
    createRunner() {
        this.requirers.set('entry', (_currentDirectory, _modulePath, _context = {})=>{
            throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:runner]')} Not implemented`);
        });
    }
    constructor(_options){
        basic_define_property(this, "_options", void 0), basic_define_property(this, "globalContext", void 0), basic_define_property(this, "baseModuleScope", void 0), basic_define_property(this, "requirers", void 0), this._options = _options, this.globalContext = null, this.baseModuleScope = null, this.requirers = new Map();
    }
}
let cjs_require = (0, __WEBPACK_EXTERNAL_MODULE_node_module_ab9f2194__.createRequire)(import.meta.url), cjs_define = (...args)=>{
    args.pop()();
};
class CommonJsRunner extends BasicRunner {
    createGlobalContext() {
        return {
            console: console,
            setTimeout: (cb, ms, ...args)=>{
                let timeout = setTimeout(cb, ms, ...args);
                return timeout.unref(), timeout;
            },
            clearTimeout: clearTimeout,
            queueMicrotask
        };
    }
    createBaseModuleScope() {
        return {
            console: this.globalContext.console,
            setTimeout: this.globalContext.setTimeout,
            clearTimeout: this.globalContext.clearTimeout,
            nsObj: (m)=>(Object.defineProperty(m, Symbol.toStringTag, {
                    value: 'Module'
                }), m),
            queueMicrotask
        };
    }
    createModuleScope(requireFn, m, file) {
        return {
            ...this.baseModuleScope,
            require: requireFn.bind(null, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.dirname(file.path)),
            module: m,
            exports: m.exports,
            __dirname: __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.dirname(file.path),
            __filename: file.path,
            define: cjs_define
        };
    }
    createRunner() {
        this.requirers.set('miss', this.createMissRequirer()), this.requirers.set('entry', this.createCjsRequirer());
    }
    createMissRequirer() {
        return (_currentDirectory, modulePath, _context = {})=>{
            let resolvedPath = cjs_require.resolve(modulePath, {
                paths: [
                    _currentDirectory
                ]
            });
            return cjs_require(resolvedPath.startsWith('node:') ? resolvedPath.slice(5) : resolvedPath);
        };
    }
    createCjsRequirer() {
        let requireCache = Object.create(null), vm = cjs_require('node:vm');
        return (currentDirectory, modulePath, context = {})=>{
            let file = context.file || this.getFile(modulePath, currentDirectory);
            if (!file) return this.requirers.get('miss')(currentDirectory, modulePath);
            if (file.path in requireCache) return requireCache[file.path].exports;
            let m = {
                exports: {}
            };
            requireCache[file.path] = m;
            let currentModuleScope = this.createModuleScope(this.getRequire(), m, file), args = Object.keys(currentModuleScope), argValues = args.map((arg)=>currentModuleScope[arg]), code = `(function(${args.join(', ')}) {
        ${file.content}
      })`;
            this.preExecute(code, file);
            let dynamicImport = Function('specifier', 'return import(specifier)');
            return vm.runInThisContext(code, {
                filename: file.path,
                importModuleDynamically: async (specifier)=>await dynamicImport(specifier)
            }).call(m.exports, ...argValues), this.postExecute(m, file), m.exports;
        };
    }
}
var type_EsmMode = ((EsmMode = {})[EsmMode.Unknown = 0] = "Unknown", EsmMode[EsmMode.Evaluated = 1] = "Evaluated", EsmMode[EsmMode.Unlinked = 2] = "Unlinked", EsmMode);
let esm_require = (0, __WEBPACK_EXTERNAL_MODULE_node_module_ab9f2194__.createRequire)(import.meta.url);
class EsmRunner extends CommonJsRunner {
    createRunner() {
        var _this__options_compilerOptions_experiments;
        super.createRunner(), this.requirers.set('cjs', this.getRequire()), this.requirers.set('esm', this.createEsmRequirer());
        let outputModule = null == (_this__options_compilerOptions_experiments = this._options.compilerOptions.experiments) ? void 0 : _this__options_compilerOptions_experiments.outputModule;
        this.requirers.set('entry', (currentDirectory, modulePath, context)=>{
            let file = this.getFile(modulePath, currentDirectory);
            return file ? outputModule && !file.path.endsWith('.cjs') ? this.requirers.get('esm')(currentDirectory, modulePath, {
                ...context,
                file
            }) : this.requirers.get('cjs')(currentDirectory, modulePath, {
                ...context,
                file
            }) : this.requirers.get('miss')(currentDirectory, modulePath);
        });
    }
    createEsmRequirer() {
        let esmCache = new Map(), esmIdentifier = this._options.name, vm = esm_require('node:vm');
        return (currentDirectory, modulePath, context = {})=>{
            if (!vm.SourceTextModule) throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:runner]')} Running ESM bundle needs add Node.js option ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('--experimental-vm-modules')}.`);
            let _require = this.getRequire(), file = context.file || this.getFile(modulePath, currentDirectory);
            if (!file) return this.requirers.get('miss')(currentDirectory, modulePath);
            let esm = esmCache.get(file.path);
            return (esm || (esm = new vm.SourceTextModule(file.content, {
                identifier: `${esmIdentifier}-${file.path}`,
                url: `${(0, __WEBPACK_EXTERNAL_MODULE_node_url_e96de089__.pathToFileURL)(file.path).href}?${esmIdentifier}`,
                initializeImportMeta: (meta, _)=>{
                    meta.url = (0, __WEBPACK_EXTERNAL_MODULE_node_url_e96de089__.pathToFileURL)(file.path).href;
                },
                importModuleDynamically: async (specifier, module)=>{
                    let result = await _require(__WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.dirname(file.path), specifier, {
                        esmMode: type_EsmMode.Evaluated
                    });
                    return await asModule(result, module.context);
                }
            }), esmCache.set(file.path, esm)), context.esmMode === type_EsmMode.Unlinked) ? esm : (async ()=>{
                if (await esm.link(async (specifier, referencingModule)=>await asModule(await _require(__WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.default.dirname(referencingModule.identifier ? referencingModule.identifier.slice(esmIdentifier.length + 1) : (0, __WEBPACK_EXTERNAL_MODULE_node_url_e96de089__.fileURLToPath)(referencingModule.url)), specifier, {
                        esmMode: type_EsmMode.Unlinked
                    }), referencingModule.context, !0)), esm.instantiate && esm.instantiate(), await esm.evaluate(), context.esmMode === type_EsmMode.Evaluated) return esm;
                let ns = esm.namespace;
                return ns.default && ns.default instanceof Promise ? ns.default : ns;
            })();
        };
    }
}
class BasicRunnerFactory {
    create(options) {
        return this.createRunner(options);
    }
    createRunner(options) {
        let runnerOptions = {
            name: this.name,
            ...options
        }, { compilerOptions } = options;
        if ('web' === compilerOptions.target || 'webworker' === compilerOptions.target) throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:runner]')} Not support run ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(compilerOptions.target)} resource in Rsbuild server`);
        return new EsmRunner(runnerOptions);
    }
    constructor(name){
        var key, value;
        value = void 0, (key = "name") in this ? Object.defineProperty(this, key, {
            value: value,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : this[key] = value, this.name = name;
    }
}
let runner_run = async ({ bundlePath, ...runnerFactoryOptions })=>new BasicRunnerFactory(bundlePath).create(runnerFactoryOptions).run(bundlePath), loadBundle = async (stats, entryName, utils)=>{
    let { chunks, entrypoints, outputPath } = stats.toJson({
        all: !1,
        chunks: !0,
        entrypoints: !0,
        outputPath: !0
    });
    if (!(null == entrypoints ? void 0 : entrypoints[entryName])) throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:loadBundle]')} Can't find entry: ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(entryName)}`);
    let { chunks: entryChunks = [] } = entrypoints[entryName], files = entryChunks.reduce((prev, entryChunkName)=>{
        let chunk = null == chunks ? void 0 : chunks.find((chunk)=>{
            var _chunk_names;
            return chunk.entry && (null == (_chunk_names = chunk.names) ? void 0 : _chunk_names.includes(String(entryChunkName)));
        });
        return (null == chunk ? void 0 : chunk.files) ? prev.concat(chunk.files.filter((file)=>!file.endsWith('.css'))) : prev;
    }, []);
    if (0 === files.length) throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:loadBundle]')} Failed to get bundle by entryName: ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(entryName)}`);
    if (files.length > 1) throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:loadBundle]')} Only support load single entry chunk, but got ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(files.length)}: ${files.join(',')}`);
    let allChunkFiles = (null == chunks ? void 0 : chunks.flatMap((c)=>c.files).map((file)=>(0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.join)(outputPath, file))) || [];
    return await runner_run({
        bundlePath: files[0],
        dist: outputPath,
        compilerOptions: stats.compilation.options,
        readFileSync: utils.readFileSync,
        isBundleOutput: (modulePath)=>allChunkFiles.includes(modulePath)
    });
}, getTransformedHtml = async (entryName, utils)=>{
    let { htmlPaths, distPath } = utils.environment, htmlPath = htmlPaths[entryName];
    if (!htmlPath) throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:getTransformedHtml]')} Failed to get HTML file by entryName: ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(entryName)}`);
    let fileName = (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.join)(distPath, htmlPath);
    return utils.readFileSync(fileName);
}, createCacheableFunction = (getter)=>{
    let cache = new WeakMap();
    return async (stats, entryName, utils)=>{
        let cachedEntries = cache.get(stats);
        if (null == cachedEntries ? void 0 : cachedEntries[entryName]) return cachedEntries[entryName];
        let res = await getter(stats, entryName, utils);
        return cache.set(stats, {
            ...cachedEntries || {},
            [entryName]: res
        }), res;
    };
}, cleanupCallbacks = new Set(), handleTermination = async (exitCode)=>{
    try {
        await Promise.all([
            ...cleanupCallbacks
        ].map((cb)=>cb()));
    } finally{
        process.exitCode ??= exitCode, process.exit();
    }
}, registerCleanup = (callback)=>{
    cleanupCallbacks.add(callback);
}, removeCleanup = (callback)=>{
    cleanupCallbacks.delete(callback);
}, shutdownRefCount = 0, setupGracefulShutdown = ()=>{
    shutdownRefCount++;
    let onSigterm = ()=>{
        handleTermination(__WEBPACK_EXTERNAL_MODULE_node_os_74b4b876__.constants.signals.SIGTERM + 128);
    };
    process.once('SIGTERM', onSigterm);
    let isCI = 'true' === process.env.CI, onStdinEnd = ()=>{
        handleTermination(0);
    };
    return isCI || process.stdin.on('end', onStdinEnd), ()=>{
        !(--shutdownRefCount > 0) && (process.removeListener('SIGTERM', onSigterm), isCI || process.stdin.removeListener('end', onStdinEnd));
    };
}, createHttpServer = async ({ serverConfig, middlewares })=>{
    if (serverConfig.https) {
        if (serverConfig.proxy) {
            let { createServer } = await import("node:https");
            return createServer(serverConfig.https, middlewares);
        }
        let { createSecureServer } = await import("node:http2");
        return createSecureServer({
            allowHTTP1: !0,
            maxSessionMemory: 1024,
            ...serverConfig.https
        }, middlewares);
    }
    let { createServer } = await import("node:http");
    return createServer(middlewares);
}, devServer_formatDevConfig = (config, port)=>('<port>' === config.client.port && (config.client.port = String(port)), config);
async function devServer_createDevServer(options, createCompiler, config, { compiler: customCompiler, getPortSilently, runCompile = !0 } = {}) {
    let lastStats, fileWatcher, devMiddlewares;
    __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug('create dev server');
    let { port, host, https, portTip } = await getServerConfig({
        config
    }), { middlewareMode } = config.server, { context } = options, devConfig = devServer_formatDevConfig(config.dev, port), routes = getRoutes(context), root = context.rootPath;
    context.devServer = {
        hostname: host,
        port,
        https
    };
    let waitFirstCompileDone = runCompile ? new Promise((resolve)=>{
        context.hooks.onDevCompileDone.tap(({ stats, isFirstCompile })=>{
            lastStats = 'stats' in stats ? stats.stats : [
                stats
            ], isFirstCompile && resolve();
        });
    }) : Promise.resolve(), startCompile = async ()=>{
        let compiler = customCompiler || await createCompiler();
        if (!compiler) throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:server]')} Failed to get compiler instance.`);
        let publicPaths = helpers_isMultiCompiler(compiler) ? compiler.compilers.map(getPublicPathFromCompiler) : [
            getPublicPathFromCompiler(compiler)
        ], compilationManager = new CompilationManager({
            dev: devConfig,
            server: {
                ...config.server,
                port
            },
            publicPaths: publicPaths,
            compiler,
            environments: context.environments
        });
        return await compilationManager.init(), compilationManager;
    }, protocol = https ? 'https' : 'http', urls = await getAddressUrls({
        protocol,
        port,
        host
    }), cliShortcutsEnabled = isCliShortcutsEnabled(devConfig), printUrls = ()=>printServerURLs({
            urls,
            port,
            routes,
            protocol,
            printUrls: config.server.printUrls,
            trailingLineBreak: !cliShortcutsEnabled
        }), openPage = async ()=>open_open({
            https,
            port,
            routes,
            config,
            clearCache: !0
        }), cleanupGracefulShutdown = middlewareMode ? null : setupGracefulShutdown(), closeServer = async ()=>{
        removeCleanup(closeServer), null == cleanupGracefulShutdown || cleanupGracefulShutdown(), await context.hooks.onCloseDevServer.callBatch(), await Promise.all([
            null == devMiddlewares ? void 0 : devMiddlewares.close(),
            null == fileWatcher ? void 0 : fileWatcher.close()
        ]);
    };
    middlewareMode || registerCleanup(closeServer);
    let beforeCreateCompiler = async ()=>{
        if (printUrls(), cliShortcutsEnabled) {
            let shortcutsOptions = 'boolean' == typeof devConfig.cliShortcuts ? {} : devConfig.cliShortcuts, cleanup = await setupCliShortcuts({
                openPage,
                closeServer,
                printUrls,
                restartServer: ()=>restartDevServer({
                        clear: !1
                    }),
                help: shortcutsOptions.help,
                customShortcuts: shortcutsOptions.custom
            });
            context.hooks.onCloseDevServer.tap(cleanup);
        }
        !getPortSilently && portTip && __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.info(portTip);
    }, cacheableLoadBundle = createCacheableFunction(loadBundle), cacheableTransformedHtml = createCacheableFunction((_stats, entryName, utils)=>getTransformedHtml(entryName, utils)), environmentAPI = Object.fromEntries(Object.entries(context.environments).map(([name, environment])=>[
            name,
            {
                getStats: async ()=>{
                    if (!compilationManager) throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:server]')} Can not call ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('getStats')} when ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('runCompile')} is false`);
                    return await waitFirstCompileDone, lastStats[environment.index];
                },
                loadBundle: async (entryName)=>{
                    if (!compilationManager) throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:server]')} Can not call ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('loadBundle')} when ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('runCompile')} is false`);
                    return await waitFirstCompileDone, cacheableLoadBundle(lastStats[environment.index], entryName, {
                        readFileSync: compilationManager.readFileSync,
                        environment
                    });
                },
                getTransformedHtml: async (entryName)=>{
                    if (!compilationManager) throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:server]')} Can not call ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('getTransformedHtml')} when ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('runCompile')} is false`);
                    return await waitFirstCompileDone, cacheableTransformedHtml(lastStats[environment.index], entryName, {
                        readFileSync: compilationManager.readFileSync,
                        environment
                    });
                }
            }
        ])), { default: connect } = await import("../compiled/connect/index.js"), middlewares = connect(), httpServer = middlewareMode ? null : await createHttpServer({
        serverConfig: config.server,
        middlewares
    }), devServerAPI = {
        port,
        middlewares,
        environments: environmentAPI,
        httpServer,
        sockWrite: (type, data)=>null == compilationManager ? void 0 : compilationManager.socketServer.sockWrite({
                type,
                data
            }),
        listen: async ()=>{
            if (!httpServer) throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:server]')} Can not listen dev server as ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('server.middlewareMode')} is enabled.`);
            let serverTerminator = getServerTerminator(httpServer);
            return __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug('listen dev server'), context.hooks.onCloseDevServer.tap(serverTerminator), new Promise((resolve)=>{
                httpServer.listen({
                    host,
                    port
                }, async (err)=>{
                    if (err) throw err;
                    middlewares.use(optionsFallbackMiddleware), middlewares.use(notFoundMiddleware), devMiddlewares && httpServer.on('upgrade', devMiddlewares.onUpgrade), __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug('listen dev server done'), await devServerAPI.afterListen(), onBeforeRestartServer(devServerAPI.close), resolve({
                        port,
                        urls: urls.map((item)=>item.url),
                        server: {
                            close: devServerAPI.close
                        }
                    });
                });
            });
        },
        afterListen: async ()=>{
            await context.hooks.onAfterStartDevServer.callBatch({
                port,
                routes,
                environments: context.environments
            });
        },
        connectWebSocket: ({ server })=>{
            devMiddlewares && server.on('upgrade', devMiddlewares.onUpgrade);
        },
        close: closeServer,
        printUrls,
        open: openPage
    }, postCallbacks = (await context.hooks.onBeforeStartDevServer.callBatch({
        server: devServerAPI,
        environments: context.environments
    })).filter((item)=>'function' == typeof item);
    runCompile ? context.hooks.onBeforeCreateCompiler.tap(beforeCreateCompiler) : await beforeCreateCompiler();
    let compilationManager = runCompile ? await startCompile() : void 0;
    for (let item of (fileWatcher = await setupWatchFiles({
        dev: devConfig,
        server: config.server,
        compilationManager,
        root
    }), (devMiddlewares = await getDevMiddlewares({
        pwd: root,
        compilationManager,
        dev: devConfig,
        devServerAPI,
        context,
        server: config.server,
        postCallbacks
    })).middlewares))Array.isArray(item) ? middlewares.use(...item) : middlewares.use(item);
    return __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug('create dev server done'), devServerAPI;
}
function isLikelyFile(filePath) {
    return (filePath.split(__WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.sep).pop() || '').includes('.');
}
function formatFileList(paths, rootPath) {
    let files = paths.filter(isLikelyFile);
    0 === files.length && (files = [
        paths[0]
    ]);
    let fileInfo = files.slice(0, 1).map((file)=>(function(originalFilePath, root) {
            let prefix = root.endsWith(__WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.sep) ? root : root + __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.sep, filePath = originalFilePath;
            filePath.startsWith(prefix) && (filePath = filePath.slice(prefix.length));
            let parts = filePath.split(__WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.sep).filter(Boolean);
            return parts.length > 3 ? parts.slice(-3).join(__WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.sep) : parts.join(__WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.sep);
        })(file, rootPath)).join(', ');
    return files.length > 1 ? `${fileInfo} and ${files.length - 1} more` : fileInfo;
}
async function createCompiler_createCompiler(options) {
    __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug('create compiler');
    let { context } = options, { rspackConfigs } = await initConfigs(options);
    if (await context.hooks.onBeforeCreateCompiler.callBatch({
        bundlerConfigs: rspackConfigs,
        environments: context.environments
    }), !await isSatisfyRspackVersion(__WEBPACK_EXTERNAL_MODULE__rspack_core_e0096ff7__.rspack.rspackVersion)) throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild]')} The current Rspack version does not meet the requirements, the minimum supported version of Rspack is ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.green(rspackMinVersion)}`);
    let isMultiCompiler = rspackConfigs.length > 1, compiler = isMultiCompiler ? (0, __WEBPACK_EXTERNAL_MODULE__rspack_core_e0096ff7__.rspack)(rspackConfigs) : (0, __WEBPACK_EXTERNAL_MODULE__rspack_core_e0096ff7__.rspack)(rspackConfigs[0]), isVersionLogged = !1, isCompiling = !1, logRspackVersion = ()=>{
        isVersionLogged || (__WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug(`use Rspack v${__WEBPACK_EXTERNAL_MODULE__rspack_core_e0096ff7__.rspack.rspackVersion}`), isVersionLogged = !0);
    };
    compiler.hooks.watchRun.tap('rsbuild:compiling', (compiler)=>{
        logRspackVersion(), isCompiling || function(compiler, context) {
            let changedFiles = compiler.modifiedFiles ? Array.from(compiler.modifiedFiles) : null;
            if (null == changedFiles ? void 0 : changedFiles.length) {
                let fileInfo = formatFileList(changedFiles, context.rootPath);
                __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.start(`building ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim(fileInfo)}`);
                return;
            }
            let removedFiles = compiler.removedFiles ? Array.from(compiler.removedFiles) : null;
            if (null == removedFiles ? void 0 : removedFiles.length) {
                let fileInfo = formatFileList(removedFiles, context.rootPath);
                __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.start(`building ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim(`removed ${fileInfo}`)}`);
                return;
            }
            __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.start('build started...');
        }(compiler, context), isCompiling = !0;
    }), 'build' === context.action && compiler.hooks.run.tap('rsbuild:run', logRspackVersion);
    let done = (stats)=>{
        let statsOptions = getStatsOptions(compiler), statsJson = stats.toJson({
            children: !0,
            moduleTrace: !0,
            timings: !0,
            preset: 'errors-warnings',
            ...statsOptions
        }), printTime = (c, index)=>{
            if (c.time) {
                let time = prettyTime(c.time / 1000), { name } = rspackConfigs[index], suffix = name && isMultiCompiler ? __WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.gray(` (${name})`) : '';
                __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.ready(`built in ${time}${suffix}`);
            }
        }, hasErrors = stats.hasErrors();
        if (!hasErrors) {
            var _statsJson_children;
            isMultiCompiler && (null == (_statsJson_children = statsJson.children) ? void 0 : _statsJson_children.length) ? statsJson.children.forEach((c, index)=>{
                printTime(c, index);
            }) : printTime(statsJson, 0);
        }
        let { message, level } = formatStats(statsJson, hasErrors);
        'error' === level && __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.error(message), 'warning' === level && __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.warn(message), isCompiling = !1;
    };
    return compiler.hooks.done.tap('rsbuild:done', (stats)=>{
        done(stats);
    }), 'dev' === context.action && registerDevHook({
        context,
        compiler,
        bundlerConfigs: rspackConfigs,
        MultiStatsCtor: __WEBPACK_EXTERNAL_MODULE__rspack_core_e0096ff7__.rspack.MultiStats
    }), await context.hooks.onAfterCreateCompiler.callBatch({
        compiler,
        environments: context.environments
    }), __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug('create compiler done'), {
        compiler,
        rspackConfigs
    };
}
let RSPACK_BUILD_ERROR = 'Rspack build failed.', build_build = async (initOptions, { watch, compiler: customCompiler } = {})=>{
    let compiler, bundlerConfigs, { context } = initOptions;
    if (customCompiler) compiler = customCompiler;
    else {
        let result = await createCompiler_createCompiler(initOptions);
        compiler = result.compiler, bundlerConfigs = result.rspackConfigs;
    }
    if (registerBuildHook({
        context,
        bundlerConfigs,
        compiler,
        isWatch: !!watch,
        MultiStatsCtor: __WEBPACK_EXTERNAL_MODULE__rspack_core_e0096ff7__.rspack.MultiStats
    }), watch) return compiler.watch({}, (err)=>{
        err && __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.error(err);
    }), {
        close: ()=>new Promise((resolve)=>{
                compiler.close(()=>{
                    resolve();
                });
            })
    };
    let { stats } = await new Promise((resolve, reject)=>{
        compiler.run((err, stats)=>{
            compiler.close((closeErr)=>{
                closeErr && __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.error('Failed to close compiler: ', closeErr), err ? reject(err) : (null == stats ? void 0 : stats.hasErrors()) ? reject(Error(RSPACK_BUILD_ERROR)) : resolve({
                    stats
                });
            });
        });
    });
    return {
        stats,
        close: async ()=>{}
    };
}, rspackProvider = async ({ context, pluginManager, rsbuildOptions })=>{
    let createCompiler = async ()=>(await createCompiler_createCompiler({
            context,
            pluginManager,
            rsbuildOptions
        })).compiler;
    return {
        bundler: 'rspack',
        createCompiler,
        async createDevServer (options) {
            let config = await initRsbuildConfig({
                context,
                pluginManager
            });
            return devServer_createDevServer({
                context,
                pluginManager,
                rsbuildOptions
            }, createCompiler, config, options);
        },
        async startDevServer (options) {
            let config = await initRsbuildConfig({
                context,
                pluginManager
            });
            return (await devServer_createDevServer({
                context,
                pluginManager,
                rsbuildOptions
            }, createCompiler, config, options)).listen();
        },
        build: async (options)=>build_build({
                context,
                pluginManager,
                rsbuildOptions
            }, options),
        async initConfigs () {
            let { rspackConfigs } = await initConfigs({
                context,
                pluginManager,
                rsbuildOptions
            });
            return rspackConfigs;
        },
        async inspectConfig (inspectOptions) {
            let bundlerConfigs = (await initConfigs({
                context,
                pluginManager,
                rsbuildOptions
            })).rspackConfigs;
            return inspectConfig({
                context,
                pluginManager,
                rsbuildOptions,
                inspectOptions,
                bundlerConfigs
            });
        }
    };
};
function prodServer_define_property(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
class RsbuildProdServer {
    async onInit(app) {
        this.app = app, await this.applyDefaultMiddlewares();
    }
    async applyDefaultMiddlewares() {
        let { headers, proxy, historyApiFallback, compress, base, cors } = this.options.serverConfig;
        if ('verbose' === __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.level && this.middlewares.use(await getRequestLoggerMiddleware()), cors) {
            let { default: corsMiddleware } = await import("../compiled/cors/index.js");
            this.middlewares.use(corsMiddleware('boolean' == typeof cors ? {} : cors));
        }
        if (headers && this.middlewares.use((_req, res, next)=>{
            for (let [key, value] of Object.entries(headers))res.setHeader(key, value);
            next();
        }), proxy) {
            let { middlewares, upgrade } = await createProxyMiddleware(proxy);
            for (let middleware of middlewares)this.middlewares.use(middleware);
            this.app.on('upgrade', upgrade);
        }
        if (compress && this.middlewares.use(gzipMiddleware({
            level: 6
        })), base && '/' !== base && this.middlewares.use(getBaseMiddleware({
            base
        })), await this.applyStaticAssetMiddleware(), historyApiFallback) {
            let { default: connectHistoryApiFallback } = await import("../compiled/connect-history-api-fallback/index.js"), historyApiFallbackMiddleware = connectHistoryApiFallback(!0 === historyApiFallback ? {} : historyApiFallback);
            this.middlewares.use(historyApiFallbackMiddleware), await this.applyStaticAssetMiddleware();
        }
        this.middlewares.use(faviconFallbackMiddleware), this.middlewares.use(optionsFallbackMiddleware), this.middlewares.use(notFoundMiddleware);
    }
    async applyStaticAssetMiddleware() {
        let { output: { path, assetPrefixes }, serverConfig: { htmlFallback } } = this.options, { default: sirv } = await import("../compiled/sirv/index.js"), assetMiddleware = sirv(path, {
            etag: !0,
            dev: !0,
            ignores: [
                'favicon.ico'
            ],
            single: 'index' === htmlFallback
        });
        this.middlewares.use((req, res, next)=>{
            let url = req.url, assetPrefix = url && assetPrefixes.find((prefix)=>url.startsWith(prefix));
            assetPrefix && (null == url ? void 0 : url.startsWith(assetPrefix)) ? (req.url = url.slice(assetPrefix.length), assetMiddleware(req, res, (...args)=>{
                req.url = url, next(...args);
            })) : assetMiddleware(req, res, next);
        });
    }
    async close() {}
    constructor(options, middlewares){
        prodServer_define_property(this, "app", void 0), prodServer_define_property(this, "options", void 0), prodServer_define_property(this, "middlewares", void 0), this.options = options, this.middlewares = middlewares;
    }
}
async function startProdServer(context, config, { getPortSilently } = {}) {
    let { port, host, https, portTip } = await getServerConfig({
        config
    }), { default: connect } = await import("../compiled/connect/index.js"), middlewares = connect(), serverConfig = config.server, server = new RsbuildProdServer({
        pwd: context.rootPath,
        output: {
            path: context.distPath,
            assetPrefixes: Object.values(context.environments).map((e)=>getPathnameFromUrl(e.config.output.assetPrefix))
        },
        serverConfig
    }, middlewares);
    await context.hooks.onBeforeStartProdServer.callBatch();
    let httpServer = await createHttpServer({
        serverConfig,
        middlewares: server.middlewares
    }), serverTerminator = getServerTerminator(httpServer);
    return await server.onInit(httpServer), new Promise((resolve)=>{
        httpServer.listen({
            host,
            port
        }, async ()=>{
            let routes = getRoutes(context);
            await context.hooks.onAfterStartProdServer.callBatch({
                port,
                routes,
                environments: context.environments
            });
            let protocol = https ? 'https' : 'http', urls = await getAddressUrls({
                protocol,
                port,
                host
            }), cliShortcutsEnabled = isCliShortcutsEnabled(config.dev), cleanupGracefulShutdown = setupGracefulShutdown(), closeServer = async ()=>{
                removeCleanup(closeServer), cleanupGracefulShutdown(), await Promise.all([
                    server.close(),
                    serverTerminator()
                ]);
            };
            registerCleanup(closeServer);
            let printUrls = ()=>printServerURLs({
                    urls,
                    port,
                    routes,
                    protocol,
                    printUrls: serverConfig.printUrls,
                    trailingLineBreak: !cliShortcutsEnabled
                }), openPage = async ()=>open_open({
                    https,
                    port,
                    routes,
                    config,
                    clearCache: !0
                });
            if (printUrls(), cliShortcutsEnabled) {
                let shortcutsOptions = 'boolean' == typeof config.dev.cliShortcuts ? {} : config.dev.cliShortcuts;
                await setupCliShortcuts({
                    openPage,
                    closeServer,
                    printUrls,
                    help: shortcutsOptions.help,
                    customShortcuts: shortcutsOptions.custom
                });
            }
            !getPortSilently && portTip && __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.info(portTip), resolve({
                port,
                urls: urls.map((item)=>item.url),
                server: {
                    close: closeServer
                }
            });
        });
    });
}
async function applyDefaultPlugins(pluginManager, context) {
    pluginManager.addPlugins([
        pluginBasic(),
        pluginEntry(),
        pluginCache(),
        pluginTarget(),
        pluginOutput(),
        pluginResolve(),
        pluginFileSize(),
        pluginCleanOutput(),
        pluginAsset(),
        pluginHtml(context),
        pluginAppIcon(),
        pluginWasm(),
        pluginMoment(),
        pluginNodeAddons(),
        pluginDefine(),
        pluginCss(),
        pluginMinimize(),
        pluginProgress(),
        pluginSwc(),
        {
            name: 'rsbuild:externals',
            setup (api) {
                api.modifyBundlerChain((chain, { environment })=>{
                    let { externals } = environment.config.output;
                    externals && chain.externals(externals);
                }), api.onBeforeCreateCompiler(({ bundlerConfigs })=>{
                    for (let config of bundlerConfigs)(Array.isArray(config.target) ? config.target.includes('webworker') : 'webworker' === config.target) && config.externals && delete config.externals;
                });
            }
        },
        pluginSplitChunks(),
        pluginInlineChunk(),
        pluginRsdoctor(),
        pluginResourceHints(),
        pluginPerformance(),
        {
            name: 'rsbuild:bundle-analyzer',
            setup (api) {
                api.modifyRsbuildConfig({
                    order: 'post',
                    handler: (config)=>{
                        if (isUseAnalyzer(config) || Object.values(config.environments || []).some((config)=>isUseAnalyzer(config))) return config.dev ||= {}, config.dev.writeToDisk = !0, config;
                    }
                }), api.modifyBundlerChain(async (chain, { CHAIN_ID, environment })=>{
                    let { config } = environment;
                    if (!isUseAnalyzer(config)) return;
                    let { default: BundleAnalyzer } = await import("../compiled/webpack-bundle-analyzer/index.js");
                    chain.plugin(CHAIN_ID.PLUGIN.BUNDLE_ANALYZER).use(BundleAnalyzer.BundleAnalyzerPlugin, [
                        {
                            analyzerMode: 'static',
                            openAnalyzer: !1,
                            reportFilename: `report-${environment.name}.html`,
                            ...config.performance.bundleAnalyze || {}
                        }
                    ]);
                });
            }
        },
        pluginServer(),
        pluginManifest(),
        {
            name: 'rsbuild:module-federation',
            setup (api) {
                'webpack' !== api.context.bundlerType && (api.modifyRsbuildConfig((config)=>{
                    let { moduleFederation } = config;
                    if ((null == moduleFederation ? void 0 : moduleFederation.options) && moduleFederation.options.exposes) {
                        var _userConfig_server, _config_server, _config_dev_client, _userConfig_dev, _config_server1;
                        let userConfig = api.getRsbuildConfig('original');
                        config.dev ||= {}, config.server ||= {}, (null == (_userConfig_server = userConfig.server) ? void 0 : _userConfig_server.cors) === void 0 && (config.server.cors = !0), (null == (_config_server = config.server) ? void 0 : _config_server.port) && !(null == (_config_dev_client = config.dev.client) ? void 0 : _config_dev_client.port) && (config.dev.client ||= {}, config.dev.client.port = config.server.port), (null == (_userConfig_dev = userConfig.dev) ? void 0 : _userConfig_dev.assetPrefix) === void 0 && config.dev.assetPrefix === (null == (_config_server1 = config.server) ? void 0 : _config_server1.base) && (config.dev.assetPrefix = !0);
                    }
                }), api.modifyEnvironmentConfig((config)=>{
                    var _config_moduleFederation, _config_performance_chunkSplit, _config_performance;
                    (null == (_config_moduleFederation = config.moduleFederation) ? void 0 : _config_moduleFederation.options) && ((null == (_config_performance = config.performance) || null == (_config_performance_chunkSplit = _config_performance.chunkSplit) ? void 0 : _config_performance_chunkSplit.strategy) === 'split-by-experience' && (config.performance.chunkSplit = {
                        ...config.performance.chunkSplit,
                        strategy: 'custom'
                    }), config.source.include = [
                        ...config.source.include || [],
                        /@module-federation[\\/]/
                    ]);
                }), api.modifyBundlerChain(async (chain, { CHAIN_ID, target, environment })=>{
                    var _config_moduleFederation;
                    let { config } = environment;
                    if (!(null == (_config_moduleFederation = config.moduleFederation) ? void 0 : _config_moduleFederation.options) || 'web' !== target) return;
                    let { options } = config.moduleFederation;
                    chain.plugin(CHAIN_ID.PLUGIN.MODULE_FEDERATION).use(__WEBPACK_EXTERNAL_MODULE__rspack_core_e0096ff7__.rspack.container.ModuleFederationPlugin, [
                        options
                    ]), options.name && (options.exposes && chain.plugin('mf-patch-split-chunks').use(PatchSplitChunksPlugin, [
                        options.name
                    ]), chain.output.get('uniqueName') || chain.output.set('uniqueName', options.name));
                }));
            }
        },
        pluginRspackProfile(),
        pluginSri(),
        pluginNonce()
    ]);
}
async function createRsbuild(options = {}) {
    let plugins, envs = options.loadEnv ? loadEnv({
        cwd: options.cwd,
        ...'boolean' == typeof options.loadEnv ? {} : options.loadEnv
    }) : null, config = isFunction(options.rsbuildConfig) ? await options.rsbuildConfig() : options.rsbuildConfig || {};
    var _config_performance, config1 = config, envs1 = envs;
    if (null !== envs1 && (config1.source ||= {}, config1.source.define = {
        ...envs1.publicVars,
        ...config1.source.define
    }, 0 !== envs1.filePaths.length && (config1.dev ||= {}, config1.dev.watchFiles = [
        ...config1.dev.watchFiles ? castArray(config1.dev.watchFiles) : [],
        {
            paths: envs1.filePaths,
            type: 'reload-server'
        }
    ], null == (_config_performance = config1.performance) ? void 0 : _config_performance.buildCache))) {
        let { buildCache } = config1.performance;
        !0 === buildCache ? config1.performance.buildCache = {
            buildDependencies: envs1.filePaths
        } : (buildCache.buildDependencies ||= [], buildCache.buildDependencies.push(...envs1.filePaths));
    }
    let resolvedOptions = {
        cwd: process.cwd(),
        callerName: 'rsbuild',
        ...options,
        rsbuildConfig: config
    }, pluginManager = (plugins = [], {
        getPlugins: (options = {
            environment: RSBUILD_ALL_ENVIRONMENT_SYMBOL
        })=>plugins.filter((p)=>isPluginMatchEnvironment(p.environment, options.environment)).map((p)=>p.instance),
        getAllPluginsWithMeta: ()=>plugins,
        addPlugins: (newPlugins, options)=>{
            let { before, environment = RSBUILD_ALL_ENVIRONMENT_SYMBOL } = options || {};
            for (let newPlugin of newPlugins)if (newPlugin) {
                let type = typeof newPlugin;
                if ('object' !== type || null === newPlugin) throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:plugin]')} Expect Rsbuild plugin instance to be an object, but got ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(type)}.`);
                if (!isFunction(newPlugin.setup)) {
                    if (isFunction(newPlugin.apply)) {
                        let { name = 'SomeWebpackPlugin' } = newPlugin.constructor || {};
                        throw Error([
                            `${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(name)} looks like a webpack or Rspack plugin, please use ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('`tools.rspack`')} to register it:`,
                            __WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.green(`
  // rsbuild.config.ts
  export default {
    tools: {
      rspack: {
        plugins: [new ${name}()]
      }
    }
  };
`)
                        ].join('\n'));
                    }
                    throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:plugin]')} Expect the setup function of Rsbuild plugin to be a function, but got ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(type)}.`);
                }
                if (before) {
                    let index = plugins.findIndex((item)=>item.instance.name === before);
                    -1 === index ? (__WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.warn(`Plugin "${before}" does not exist.`), plugins.push({
                        environment,
                        instance: newPlugin
                    })) : plugins.splice(index, 0, {
                        environment,
                        instance: newPlugin
                    });
                } else plugins.push({
                    environment,
                    instance: newPlugin
                });
            }
        },
        removePlugins: (pluginNames, options = {})=>{
            plugins = plugins.filter((plugin)=>!(pluginNames.includes(plugin.instance.name) && (!options.environment || plugin.environment === options.environment)));
        },
        isPluginExists: (pluginName, options = {
            environment: RSBUILD_ALL_ENVIRONMENT_SYMBOL
        })=>!!plugins.find((plugin)=>plugin.instance.name === pluginName && isPluginMatchEnvironment(plugin.environment, options.environment))
    }), context = await createContext(resolvedOptions, config), getPluginAPI = function({ context, pluginManager }) {
        let { hooks } = context, publicContext = function(context) {
            let exposedKeys = [
                'action',
                'version',
                'rootPath',
                'distPath',
                'devServer',
                'cachePath',
                'callerName',
                'bundlerType'
            ];
            return new Proxy(context, {
                get (target, prop) {
                    if (exposedKeys.includes(prop)) return target[prop];
                },
                set: (_, prop)=>(__WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.error(`Context is readonly, you can not assign to the "context.${prop}" prop.`), !0)
            });
        }(context);
        function getNormalizedConfig(options) {
            if (context.normalizedConfig) {
                if (null == options ? void 0 : options.environment) {
                    let config = context.normalizedConfig.environments[options.environment];
                    if (!config) throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild]')} Cannot find normalized config by environment: ${options.environment}.`);
                    return config;
                }
                return context.normalizedConfig;
            }
            throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild]')} Cannot access normalized config until ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('modifyRsbuildConfig')} is called.`);
        }
        let getRsbuildConfig = (type = 'current')=>{
            switch(type){
                case 'original':
                    return context.originalConfig;
                case 'current':
                    return context.config;
                case 'normalized':
                    return getNormalizedConfig();
            }
            throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild]')} ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow('getRsbuildConfig')} get an invalid type param.`);
        }, exposed = [], expose = (id, api)=>{
            exposed.push({
                id,
                api
            });
        }, useExposed = (id)=>{
            let matched = exposed.find((item)=>item.id === id);
            if (matched) return matched.api;
        }, transformId = 0, transformer = {}, processAssetsFns = [], resolveFns = [];
        hooks.modifyBundlerChain.tap((chain, { target, environment })=>{
            let pluginName = 'RsbuildCorePlugin';
            chain.plugin(pluginName).use(class {
                apply(compiler) {
                    for (let { handler, environment: pluginEnvironment } of (compiler.__rsbuildTransformer = transformer, resolveFns))(!pluginEnvironment || isPluginMatchEnvironment(pluginEnvironment, environment.name)) && compiler.hooks.compilation.tap(pluginName, (compilation, { normalModuleFactory })=>{
                        normalModuleFactory.hooks.resolve.tapPromise(pluginName, async (resolveData)=>handler({
                                compiler,
                                compilation,
                                environment,
                                resolveData
                            }));
                    });
                    compiler.hooks.thisCompilation.tap(pluginName, (compilation)=>{
                        compilation.hooks.childCompiler.tap(pluginName, (childCompiler)=>{
                            childCompiler.__rsbuildTransformer = transformer;
                        });
                        let { sources } = compiler.webpack;
                        for (let { descriptor, handler, environment: pluginEnvironment } of processAssetsFns)(!descriptor.targets || descriptor.targets.includes(target)) && (!descriptor.environments || descriptor.environments.includes(environment.name)) && (!pluginEnvironment || isPluginMatchEnvironment(pluginEnvironment, environment.name)) && compilation.hooks.processAssets.tapPromise({
                            name: pluginName,
                            stage: mapProcessAssetsStage(compiler, descriptor.stage)
                        }, async (assets)=>handler({
                                assets,
                                compiler,
                                compilation,
                                environment,
                                sources
                            }));
                    });
                }
                constructor(){
                    var key;
                    (key = "name") in this ? Object.defineProperty(this, key, {
                        value: pluginName,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }) : this[key] = pluginName;
                }
            });
        });
        let getTransformHook = (environment)=>(descriptor, handler)=>{
                let id = `rsbuild-transform-${transformId++}`;
                transformer[id] = handler, hooks.modifyBundlerChain.tapEnvironment({
                    environment,
                    handler: (chain, { target, environment })=>{
                        if (descriptor.targets && !descriptor.targets.includes(target) || descriptor.environments && !descriptor.environments.includes(environment.name)) return;
                        let rule = chain.module.rule(id);
                        descriptor.test && rule.test(descriptor.test), descriptor.resourceQuery && rule.resourceQuery(descriptor.resourceQuery), descriptor.layer && rule.layer(descriptor.layer), descriptor.issuerLayer && rule.issuerLayer(descriptor.issuerLayer), descriptor.issuer && rule.issuer(descriptor.issuer), descriptor.with && rule.with(descriptor.with), descriptor.mimetype && rule.mimetype(descriptor.mimetype), descriptor.enforce && rule.enforce(descriptor.enforce);
                        let loaderName = descriptor.raw ? 'transformRawLoader.mjs' : 'transformLoader.mjs', loaderPath = (0, __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.join)(LOADER_PATH, loaderName);
                        rule.use(id).loader(loaderPath).options({
                            id,
                            getEnvironment: ()=>environment
                        });
                    }
                });
            }, setProcessAssets = (environment)=>(descriptor, handler)=>{
                processAssetsFns.push({
                    environment,
                    descriptor,
                    handler
                });
            }, setResolve = (environment)=>(handler)=>{
                resolveFns.push({
                    environment,
                    handler
                });
            }, onExitListened = !1, onExit = (cb)=>{
            if (!onExitListened) {
                var onExit;
                onExit = (exitCode)=>{
                    hooks.onExit.callBatch({
                        exitCode
                    });
                }, exitHook_callbacks.add(onExit), isRegistered || (isRegistered = !0, __WEBPACK_EXTERNAL_MODULE_node_process_786449bf__.default.on('SIGINT', ()=>{
                    exit(__WEBPACK_EXTERNAL_MODULE_node_os_74b4b876__.constants.signals.SIGINT + 128, 'SIGINT');
                }), __WEBPACK_EXTERNAL_MODULE_node_process_786449bf__.default.once('SIGTERM', ()=>{
                    exit(__WEBPACK_EXTERNAL_MODULE_node_os_74b4b876__.constants.signals.SIGTERM + 128, 'SIGTERM');
                }), __WEBPACK_EXTERNAL_MODULE_node_process_786449bf__.default.once('exit', (exitCode)=>{
                    exit(exitCode, 'exit');
                })), onExitListened = !0;
            }
            hooks.onExit.tap(cb);
        };
        return (environment)=>({
                context: publicContext,
                expose,
                transform: getTransformHook(environment),
                useExposed,
                processAssets: setProcessAssets(environment),
                resolve: setResolve(environment),
                getRsbuildConfig,
                getNormalizedConfig,
                isPluginExists: pluginManager.isPluginExists,
                onExit,
                onAfterBuild: hooks.onAfterBuild.tap,
                onCloseBuild: hooks.onCloseBuild.tap,
                onBeforeBuild: hooks.onBeforeBuild.tap,
                onCloseDevServer: hooks.onCloseDevServer.tap,
                onDevCompileDone: hooks.onDevCompileDone.tap,
                onAfterCreateCompiler: hooks.onAfterCreateCompiler.tap,
                onAfterStartDevServer: hooks.onAfterStartDevServer.tap,
                onBeforeCreateCompiler: hooks.onBeforeCreateCompiler.tap,
                onBeforeStartDevServer: hooks.onBeforeStartDevServer.tap,
                onAfterStartProdServer: hooks.onAfterStartProdServer.tap,
                onBeforeStartProdServer: hooks.onBeforeStartProdServer.tap,
                modifyRsbuildConfig: hooks.modifyRsbuildConfig.tap,
                modifyHTML: (handler)=>hooks.modifyHTML.tapEnvironment({
                        environment,
                        handler
                    }),
                modifyHTMLTags: (handler)=>hooks.modifyHTMLTags.tapEnvironment({
                        environment,
                        handler
                    }),
                modifyBundlerChain: (handler)=>hooks.modifyBundlerChain.tapEnvironment({
                        environment,
                        handler
                    }),
                modifyRspackConfig: (handler)=>hooks.modifyRspackConfig.tapEnvironment({
                        environment,
                        handler
                    }),
                modifyWebpackChain: (handler)=>hooks.modifyWebpackChain.tapEnvironment({
                        environment,
                        handler
                    }),
                modifyWebpackConfig: (handler)=>hooks.modifyWebpackConfig.tapEnvironment({
                        environment,
                        handler
                    }),
                modifyEnvironmentConfig: (handler)=>hooks.modifyEnvironmentConfig.tapEnvironment({
                        environment,
                        handler
                    }),
                onAfterEnvironmentCompile: (handler)=>hooks.onAfterEnvironmentCompile.tapEnvironment({
                        environment,
                        handler
                    }),
                onBeforeEnvironmentCompile: (handler)=>hooks.onBeforeEnvironmentCompile.tapEnvironment({
                        environment,
                        handler
                    })
            });
    }({
        context,
        pluginManager
    });
    context.getPluginAPI = getPluginAPI;
    let globalPluginAPI = getPluginAPI();
    __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug('add default plugins'), await applyDefaultPlugins(pluginManager, context), __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.debug('add default plugins done');
    let provider = config.provider || rspackProvider, providerInstance = await provider({
        context,
        pluginManager,
        rsbuildOptions: resolvedOptions,
        helpers: provider_helpers_namespaceObject
    }), rsbuild = {
        build: async (...args)=>{
            context.action = 'build', getNodeEnv() || setNodeEnv('production');
            let buildInstance = await providerInstance.build(...args);
            return {
                ...buildInstance,
                close: async ()=>{
                    await context.hooks.onCloseBuild.callBatch(), await buildInstance.close();
                }
            };
        },
        preview: async (options = {})=>{
            context.action = 'preview', getNodeEnv() || setNodeEnv('production');
            let config = await initRsbuildConfig({
                context,
                pluginManager
            }), { distPath } = context, { checkDistDir = !0 } = options;
            if (checkDistDir) {
                if (!(0, __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.existsSync)(distPath)) throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:preview]')} The output directory ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(distPath)} does not exist, please build the project before previewing.`);
                if (function(path) {
                    let files = __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.default.readdirSync(path);
                    return 0 === files.length || 1 === files.length && '.git' === files[0];
                }(distPath)) throw Error(`${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.dim('[rsbuild:preview]')} The output directory ${__WEBPACK_EXTERNAL_MODULE__compiled_picocolors_index_js_ea7a20e9__.default.yellow(distPath)} is empty, please build the project before previewing.`);
            }
            return startProdServer(context, config, options);
        },
        startDevServer: (...args)=>(context.action = 'dev', getNodeEnv() || setNodeEnv('development'), providerInstance.startDevServer(...args)),
        createCompiler: (...args)=>(context.action || (context.action = 'development' === getNodeEnv() ? 'dev' : 'build'), providerInstance.createCompiler(...args)),
        createDevServer: (...args)=>(context.action = 'dev', getNodeEnv() || setNodeEnv('development'), providerInstance.createDevServer(...args)),
        ...pick(pluginManager, [
            'addPlugins',
            'getPlugins',
            'removePlugins',
            'isPluginExists'
        ]),
        ...pick(globalPluginAPI, [
            'context',
            'onCloseBuild',
            'onBeforeBuild',
            'onBeforeCreateCompiler',
            'onBeforeStartDevServer',
            'onBeforeStartProdServer',
            'onAfterBuild',
            'onAfterCreateCompiler',
            'onAfterStartDevServer',
            'onAfterStartProdServer',
            'onCloseDevServer',
            'onDevCompileDone',
            'onExit',
            'getRsbuildConfig',
            'getNormalizedConfig'
        ]),
        ...pick(providerInstance, [
            'initConfigs',
            'inspectConfig'
        ])
    };
    envs && (rsbuild.onCloseBuild(envs.cleanup), rsbuild.onCloseDevServer(envs.cleanup));
    let getFlattenedPlugins = async (pluginOptions)=>{
        let plugins = pluginOptions;
        do plugins = (await Promise.all(plugins)).flat(Number.POSITIVE_INFINITY);
        while (plugins.some((v)=>(0, __WEBPACK_EXTERNAL_MODULE_node_util_types_ce11fc49__.isPromise)(v)));
        return plugins;
    };
    if (config.plugins) {
        let plugins = await getFlattenedPlugins(config.plugins);
        rsbuild.addPlugins(plugins);
    }
    return config.environments && await Promise.all(Object.entries(config.environments).map(async ([name, environmentConfig])=>{
        if (!environmentConfig.plugins || context.specifiedEnvironments && !context.specifiedEnvironments.includes(name)) return;
        let plugins = await getFlattenedPlugins(environmentConfig.plugins);
        rsbuild.addPlugins(plugins, {
            environment: name
        });
    })), rsbuild;
}
function toArr(any) {
    return null == any ? [] : Array.isArray(any) ? any : [
        any
    ];
}
let removeBrackets = (v)=>v.replace(/[<[].+/, "").trim(), findAllBrackets = (v)=>{
    let angledMatch, squareMatch, ANGLED_BRACKET_RE_GLOBAL = /<([^>]+)>/g, SQUARE_BRACKET_RE_GLOBAL = /\[([^\]]+)\]/g, res = [], parse = (match)=>{
        let variadic = !1, value = match[1];
        return value.startsWith("...") && (value = value.slice(3), variadic = !0), {
            required: match[0].startsWith("<"),
            value,
            variadic
        };
    };
    for(; angledMatch = ANGLED_BRACKET_RE_GLOBAL.exec(v);)res.push(parse(angledMatch));
    for(; squareMatch = SQUARE_BRACKET_RE_GLOBAL.exec(v);)res.push(parse(squareMatch));
    return res;
}, getMriOptions = (options)=>{
    let result = {
        alias: {},
        boolean: []
    };
    for (let [index, option] of options.entries())option.names.length > 1 && (result.alias[option.names[0]] = option.names.slice(1)), option.isBoolean && (option.negated && options.some((o, i)=>i !== index && o.names.some((name)=>option.names.includes(name)) && "boolean" == typeof o.required) || result.boolean.push(option.names[0]));
    return result;
}, findLongest = (arr)=>arr.sort((a, b)=>a.length > b.length ? -1 : 1)[0], padRight = (str, length)=>str.length >= length ? str : `${str}${" ".repeat(length - str.length)}`, camelcase = (input)=>input.replace(/([a-z])-([a-z])/g, (_, p1, p2)=>p1 + p2.toUpperCase()), setDotProp = (obj, keys, val)=>{
    let x, i = 0, length = keys.length, t = obj;
    for(; i < length; ++i)x = t[keys[i]], t = t[keys[i]] = i === length - 1 ? val : null != x ? x : ~keys[i + 1].indexOf(".") || !(+keys[i + 1] > -1) ? {} : [];
}, setByType = (obj, transforms)=>{
    for (let key of Object.keys(transforms)){
        let transform = transforms[key];
        transform.shouldTransform && (obj[key] = Array.prototype.concat.call([], obj[key]), "function" == typeof transform.transformFunction && (obj[key] = obj[key].map(transform.transformFunction)));
    }
}, getFileName = (input)=>{
    let m = /([^\\\/]+)$/.exec(input);
    return m ? m[1] : "";
}, camelcaseOptionName = (name)=>name.split(".").map((v, i)=>0 === i ? camelcase(v) : v).join(".");
class CACError extends Error {
    constructor(message){
        super(message), this.name = this.constructor.name, "function" == typeof Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = Error(message).stack;
    }
}
class Option {
    constructor(rawName, description, config){
        this.rawName = rawName, this.description = description, this.config = Object.assign({}, config), rawName = rawName.replace(/\.\*/g, ""), this.negated = !1, this.names = removeBrackets(rawName).split(",").map((v)=>{
            let name = v.trim().replace(/^-{1,2}/, "");
            return name.startsWith("no-") && (this.negated = !0, name = name.replace(/^no-/, "")), camelcaseOptionName(name);
        }).sort((a, b)=>a.length > b.length ? 1 : -1), this.name = this.names[this.names.length - 1], this.negated && null == this.config.default && (this.config.default = !0), rawName.includes("<") ? this.required = !0 : rawName.includes("[") ? this.required = !1 : this.isBoolean = !0;
    }
}
let processArgs = process.argv, platformInfo = `${process.platform}-${process.arch} node-${process.version}`;
class Command {
    constructor(rawName, description, config = {}, cli){
        this.rawName = rawName, this.description = description, this.config = config, this.cli = cli, this.options = [], this.aliasNames = [], this.name = removeBrackets(rawName), this.args = findAllBrackets(rawName), this.examples = [];
    }
    usage(text) {
        return this.usageText = text, this;
    }
    allowUnknownOptions() {
        return this.config.allowUnknownOptions = !0, this;
    }
    ignoreOptionDefaultValue() {
        return this.config.ignoreOptionDefaultValue = !0, this;
    }
    version(version, customFlags = "-v, --version") {
        return this.versionNumber = version, this.option(customFlags, "Display version number"), this;
    }
    example(example) {
        return this.examples.push(example), this;
    }
    option(rawName, description, config) {
        let option = new Option(rawName, description, config);
        return this.options.push(option), this;
    }
    alias(name) {
        return this.aliasNames.push(name), this;
    }
    action(callback) {
        return this.commandAction = callback, this;
    }
    isMatched(name) {
        return this.name === name || this.aliasNames.includes(name);
    }
    get isDefaultCommand() {
        return "" === this.name || this.aliasNames.includes("!");
    }
    get isGlobalCommand() {
        return this instanceof GlobalCommand;
    }
    hasOption(name) {
        return name = name.split(".")[0], this.options.find((option)=>option.names.includes(name));
    }
    outputHelp() {
        let { name, commands } = this.cli, { versionNumber, options: globalOptions, helpCallback } = this.cli.globalCommand, sections = [
            {
                body: `${name}${versionNumber ? `/${versionNumber}` : ""}`
            }
        ];
        if (sections.push({
            title: "Usage",
            body: `  $ ${name} ${this.usageText || this.rawName}`
        }), (this.isGlobalCommand || this.isDefaultCommand) && commands.length > 0) {
            let longestCommandName = findLongest(commands.map((command)=>command.rawName));
            sections.push({
                title: "Commands",
                body: commands.map((command)=>`  ${padRight(command.rawName, longestCommandName.length)}  ${command.description}`).join("\n")
            }), sections.push({
                title: "For more info, run any command with the `--help` flag",
                body: commands.map((command)=>`  $ ${name}${"" === command.name ? "" : ` ${command.name}`} --help`).join("\n")
            });
        }
        let options = this.isGlobalCommand ? globalOptions : [
            ...this.options,
            ...globalOptions || []
        ];
        if (this.isGlobalCommand || this.isDefaultCommand || (options = options.filter((option)=>"version" !== option.name)), options.length > 0) {
            let longestOptionName = findLongest(options.map((option)=>option.rawName));
            sections.push({
                title: "Options",
                body: options.map((option)=>`  ${padRight(option.rawName, longestOptionName.length)}  ${option.description} ${void 0 === option.config.default ? "" : `(default: ${option.config.default})`}`).join("\n")
            });
        }
        this.examples.length > 0 && sections.push({
            title: "Examples",
            body: this.examples.map((example)=>"function" == typeof example ? example(name) : example).join("\n")
        }), helpCallback && (sections = helpCallback(sections) || sections), console.log(sections.map((section)=>section.title ? `${section.title}:
${section.body}` : section.body).join("\n\n"));
    }
    outputVersion() {
        let { name } = this.cli, { versionNumber } = this.cli.globalCommand;
        versionNumber && console.log(`${name}/${versionNumber} ${platformInfo}`);
    }
    checkRequiredArgs() {
        let minimalArgsCount = this.args.filter((arg)=>arg.required).length;
        if (this.cli.args.length < minimalArgsCount) throw new CACError(`missing required args for command \`${this.rawName}\``);
    }
    checkUnknownOptions() {
        let { options, globalCommand } = this.cli;
        if (!this.config.allowUnknownOptions) {
            for (let name of Object.keys(options))if ("--" !== name && !this.hasOption(name) && !globalCommand.hasOption(name)) throw new CACError(`Unknown option \`${name.length > 1 ? `--${name}` : `-${name}`}\``);
        }
    }
    checkOptionValue() {
        let { options: parsedOptions, globalCommand } = this.cli, options = [
            ...globalCommand.options,
            ...this.options
        ];
        for (let option of options){
            let value = parsedOptions[option.name.split(".")[0]];
            if (option.required) {
                let hasNegated = options.some((o)=>o.negated && o.names.includes(option.name));
                if (!0 === value || !1 === value && !hasNegated) throw new CACError(`option \`${option.rawName}\` value is missing`);
            }
        }
    }
}
class GlobalCommand extends Command {
    constructor(cli){
        super("@@global@@", "", {}, cli);
    }
}
var __assign = Object.assign;
class CAC extends __WEBPACK_EXTERNAL_MODULE_events__.EventEmitter {
    constructor(name = ""){
        super(), this.name = name, this.commands = [], this.rawArgs = [], this.args = [], this.options = {}, this.globalCommand = new GlobalCommand(this), this.globalCommand.usage("<command> [options]");
    }
    usage(text) {
        return this.globalCommand.usage(text), this;
    }
    command(rawName, description, config) {
        let command = new Command(rawName, description || "", config, this);
        return command.globalCommand = this.globalCommand, this.commands.push(command), command;
    }
    option(rawName, description, config) {
        return this.globalCommand.option(rawName, description, config), this;
    }
    help(callback) {
        return this.globalCommand.option("-h, --help", "Display this message"), this.globalCommand.helpCallback = callback, this.showHelpOnExit = !0, this;
    }
    version(version, customFlags = "-v, --version") {
        return this.globalCommand.version(version, customFlags), this.showVersionOnExit = !0, this;
    }
    example(example) {
        return this.globalCommand.example(example), this;
    }
    outputHelp() {
        this.matchedCommand ? this.matchedCommand.outputHelp() : this.globalCommand.outputHelp();
    }
    outputVersion() {
        this.globalCommand.outputVersion();
    }
    setParsedInfo({ args, options }, matchedCommand, matchedCommandName) {
        return this.args = args, this.options = options, matchedCommand && (this.matchedCommand = matchedCommand), matchedCommandName && (this.matchedCommandName = matchedCommandName), this;
    }
    unsetMatchedCommand() {
        this.matchedCommand = void 0, this.matchedCommandName = void 0;
    }
    parse(argv = processArgs, { run = !0 } = {}) {
        this.rawArgs = argv, this.name || (this.name = argv[1] ? getFileName(argv[1]) : "cli");
        let shouldParse = !0;
        for (let command of this.commands){
            let parsed = this.mri(argv.slice(2), command), commandName = parsed.args[0];
            if (command.isMatched(commandName)) {
                shouldParse = !1;
                let parsedInfo = __assign(__assign({}, parsed), {
                    args: parsed.args.slice(1)
                });
                this.setParsedInfo(parsedInfo, command, commandName), this.emit(`command:${commandName}`, command);
            }
        }
        if (shouldParse) {
            for (let command of this.commands)if ("" === command.name) {
                shouldParse = !1;
                let parsed = this.mri(argv.slice(2), command);
                this.setParsedInfo(parsed, command), this.emit("command:!", command);
            }
        }
        if (shouldParse) {
            let parsed = this.mri(argv.slice(2));
            this.setParsedInfo(parsed);
        }
        this.options.help && this.showHelpOnExit && (this.outputHelp(), run = !1, this.unsetMatchedCommand()), this.options.version && this.showVersionOnExit && null == this.matchedCommandName && (this.outputVersion(), run = !1, this.unsetMatchedCommand());
        let parsedArgv = {
            args: this.args,
            options: this.options
        };
        return run && this.runMatchedCommand(), !this.matchedCommand && this.args[0] && this.emit("command:*"), parsedArgv;
    }
    mri(argv, command) {
        let cliOptions = [
            ...this.globalCommand.options,
            ...command ? command.options : []
        ], mriOptions = getMriOptions(cliOptions), argsAfterDoubleDashes = [], doubleDashesIndex = argv.indexOf("--");
        doubleDashesIndex > -1 && (argsAfterDoubleDashes = argv.slice(doubleDashesIndex + 1), argv = argv.slice(0, doubleDashesIndex));
        let parsed = function(args, opts) {
            opts = opts || {};
            var k, arr, arg, name, val, out = {
                _: []
            }, i = 0, j = 0, idx = 0, len = (args = args || []).length;
            let alibi = void 0 !== opts.alias, strict = void 0 !== opts.unknown, defaults = void 0 !== opts.default;
            if (opts.alias = opts.alias || {}, opts.string = toArr(opts.string), opts.boolean = toArr(opts.boolean), alibi) for(k in opts.alias)for(i = 0, arr = opts.alias[k] = toArr(opts.alias[k]); i < arr.length; i++)(opts.alias[arr[i]] = arr.concat(k)).splice(i, 1);
            for(i = opts.boolean.length; i-- > 0;)for(j = (arr = opts.alias[opts.boolean[i]] || []).length; j-- > 0;)opts.boolean.push(arr[j]);
            for(i = opts.string.length; i-- > 0;)for(j = (arr = opts.alias[opts.string[i]] || []).length; j-- > 0;)opts.string.push(arr[j]);
            if (defaults) {
                for(k in opts.default)if (name = typeof opts.default[k], arr = opts.alias[k] = opts.alias[k] || [], void 0 !== opts[name]) for(opts[name].push(k), i = 0; i < arr.length; i++)opts[name].push(arr[i]);
            }
            let keys = strict ? Object.keys(opts.alias) : [];
            for(i = 0; i < len; i++){
                if ('--' === (arg = args[i])) {
                    out._ = out._.concat(args.slice(++i));
                    break;
                }
                for(j = 0; j < arg.length && 45 === arg.charCodeAt(j); j++);
                if (0 === j) out._.push(arg);
                else if ('no-' === arg.substring(j, j + 3)) {
                    if (name = arg.substring(j + 3), strict && !~keys.indexOf(name)) return opts.unknown(arg);
                    out[name] = !1;
                } else {
                    for(idx = j + 1; idx < arg.length && 61 !== arg.charCodeAt(idx); idx++);
                    for(name = arg.substring(j, idx), val = arg.substring(++idx) || i + 1 === len || 45 === ('' + args[i + 1]).charCodeAt(0) || args[++i], arr = 2 === j ? [
                        name
                    ] : name, idx = 0; idx < arr.length; idx++){
                        if (name = arr[idx], strict && !~keys.indexOf(name)) return opts.unknown('-'.repeat(j) + name);
                        !function(out, key, val, opts) {
                            var x, old = out[key], nxt = ~opts.string.indexOf(key) ? null == val || !0 === val ? '' : String(val) : 'boolean' == typeof val ? val : ~opts.boolean.indexOf(key) ? 'false' !== val && ('true' === val || (out._.push(0 * (x = +val) == 0 ? x : val), !!val)) : 0 * (x = +val) == 0 ? x : val;
                            out[key] = null == old ? nxt : Array.isArray(old) ? old.concat(nxt) : [
                                old,
                                nxt
                            ];
                        }(out, name, idx + 1 < arr.length || val, opts);
                    }
                }
            }
            if (defaults) for(k in opts.default)void 0 === out[k] && (out[k] = opts.default[k]);
            if (alibi) for(k in out)for(arr = opts.alias[k] || []; arr.length > 0;)out[arr.shift()] = out[k];
            return out;
        }(argv, mriOptions), args = (parsed = Object.keys(parsed).reduce((res, name)=>__assign(__assign({}, res), {
                [camelcaseOptionName(name)]: parsed[name]
            }), {
            _: []
        }))._, options = {
            "--": argsAfterDoubleDashes
        }, ignoreDefault = command && command.config.ignoreOptionDefaultValue ? command.config.ignoreOptionDefaultValue : this.globalCommand.config.ignoreOptionDefaultValue, transforms = Object.create(null);
        for (let cliOption of cliOptions){
            if (!ignoreDefault && void 0 !== cliOption.config.default) for (let name of cliOption.names)options[name] = cliOption.config.default;
            Array.isArray(cliOption.config.type) && void 0 === transforms[cliOption.name] && (transforms[cliOption.name] = Object.create(null), transforms[cliOption.name].shouldTransform = !0, transforms[cliOption.name].transformFunction = cliOption.config.type[0]);
        }
        for (let key of Object.keys(parsed))"_" !== key && (setDotProp(options, key.split("."), parsed[key]), setByType(options, transforms));
        return {
            args,
            options
        };
    }
    runMatchedCommand() {
        let { args, options, matchedCommand: command } = this;
        if (!command || !command.commandAction) return;
        command.checkUnknownOptions(), command.checkOptionValue(), command.checkRequiredArgs();
        let actionArgs = [];
        return command.args.forEach((arg, index)=>{
            arg.variadic ? actionArgs.push(args.slice(index)) : actionArgs.push(args[index]);
        }), actionArgs.push(options), command.commandAction.apply(this, actionArgs);
    }
}
let cac_dist = (name = "")=>new CAC(name), applyCommonOptions = (cli)=>{
    cli.option('--base <base>', 'specify the base path of the server').option('-c, --config <config>', 'specify the configuration file, can be a relative or absolute path').option('--config-loader <loader>', 'specify the loader to load the config file, can be `jiti` or `native`', {
        default: 'jiti'
    }).option('-r, --root <root>', 'specify the project root directory, can be an absolute path or a path relative to cwd').option('-m, --mode <mode>', 'specify the build mode, can be `development`, `production` or `none`').option('--env-mode <mode>', 'specify the env mode to load the `.env.[mode]` file').option('--environment <name>', 'specify the name of environment to build', {
        type: [
            String
        ],
        default: []
    }).option('--env-dir <dir>', 'specify the directory to load `.env` files').option('--no-env', 'Disable loading `.env` files');
}, applyServerOptions = (command)=>{
    command.option('-o, --open [url]', 'open the page in browser on startup').option('--port <port>', 'specify a port number for server to listen').option('--host <host>', 'specify the host that the server listens to');
};
async function runCLI() {
    if (!process.env.NODE_ENV) {
        let command = process.argv[2];
        process.env.NODE_ENV = [
            'build',
            'preview'
        ].includes(command) ? 'production' : 'development';
    }
    process.title = 'rsbuild-node';
    let { npm_execpath } = process.env;
    (!npm_execpath || npm_execpath.includes('npx-cli.js') || npm_execpath.includes('.bun')) && console.log(), __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.greet(`  Rsbuild v1.3.22\n`);
    try {
        !function() {
            let cli = cac_dist('rsbuild');
            cli.help(), cli.version("1.3.22"), applyCommonOptions(cli);
            let devCommand = cli.command('', 'starting the dev server').alias('dev'), buildCommand = cli.command('build', 'build the app for production'), previewCommand = cli.command('preview', 'preview the production build locally'), inspectCommand = cli.command('inspect', 'inspect the Rspack and Rsbuild configs');
            applyServerOptions(devCommand), applyServerOptions(previewCommand), devCommand.action(async (options)=>{
                try {
                    let rsbuild = await init({
                        cliOptions: options
                    });
                    await (null == rsbuild ? void 0 : rsbuild.startDevServer());
                } catch (err) {
                    __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.error('Failed to start dev server.'), __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.error(err), process.exit(1);
                }
            }), buildCommand.option('-w, --watch', 'turn on watch mode, watch for changes and rebuild').action(async (options)=>{
                try {
                    let rsbuild = await init({
                        cliOptions: options,
                        isBuildWatch: options.watch
                    }), buildInstance = await (null == rsbuild ? void 0 : rsbuild.build({
                        watch: options.watch
                    }));
                    buildInstance && (options.watch ? onBeforeRestartServer(buildInstance.close) : await buildInstance.close());
                } catch (err) {
                    err instanceof Error && err.message === RSPACK_BUILD_ERROR || __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.error('Failed to build.'), __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.error(err), process.exit(1);
                }
            }), previewCommand.action(async (options)=>{
                try {
                    let rsbuild = await init({
                        cliOptions: options
                    });
                    await (null == rsbuild ? void 0 : rsbuild.preview());
                } catch (err) {
                    __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.error('Failed to start preview server.'), __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.error(err), process.exit(1);
                }
            }), inspectCommand.option('--output <output>', 'specify inspect content output path').option('--verbose', 'show full function definitions in output').action(async (options)=>{
                try {
                    let rsbuild = await init({
                        cliOptions: options
                    });
                    await (null == rsbuild ? void 0 : rsbuild.inspectConfig({
                        verbose: options.verbose,
                        outputPath: options.output,
                        writeToDisk: !0
                    }));
                } catch (err) {
                    __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.error('Failed to inspect config.'), __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.error(err), process.exit(1);
                }
            }), cli.parse();
        }();
    } catch (err) {
        __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.error('Failed to start Rsbuild CLI.'), __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger.error(err);
    }
}
let src_version = "1.3.22";
var __webpack_exports__logger = __WEBPACK_EXTERNAL_MODULE__compiled_rslog_index_js_c302f6e3__.logger, __webpack_exports__rspack = __WEBPACK_EXTERNAL_MODULE__rspack_core_e0096ff7__.rspack;
export { PLUGIN_CSS_NAME, PLUGIN_SWC_NAME, createRsbuild, defaultAllowedOrigins, defineConfig, ensureAssetPrefix, loadConfig_loadConfig as loadConfig, loadEnv, mergeRsbuildConfig, runCLI, src_version as version, __webpack_exports__logger as logger, __webpack_exports__rspack as rspack };
