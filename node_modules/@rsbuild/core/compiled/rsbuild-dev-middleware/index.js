(() => {
  var __webpack_modules__ = {
    3997: (module) => {
      "use strict";
      /*!
       * ee-first
       * Copyright(c) 2014 Jonathan Ong
       * MIT Licensed
       */ module.exports = first;
      function first(stuff, done) {
        if (!Array.isArray(stuff))
          throw new TypeError("arg must be an array of [ee, events...] arrays");
        var cleanups = [];
        for (var i = 0; i < stuff.length; i++) {
          var arr = stuff[i];
          if (!Array.isArray(arr) || arr.length < 2)
            throw new TypeError("each array member must be [ee, events...]");
          var ee = arr[0];
          for (var j = 1; j < arr.length; j++) {
            var event = arr[j];
            var fn = listener(event, callback);
            ee.on(event, fn);
            cleanups.push({ ee, event, fn });
          }
        }
        function callback() {
          cleanup();
          done.apply(null, arguments);
        }
        function cleanup() {
          var x;
          for (var i = 0; i < cleanups.length; i++) {
            x = cleanups[i];
            x.ee.removeListener(x.event, x.fn);
          }
        }
        function thunk(fn) {
          done = fn;
        }
        thunk.cancel = cleanup;
        return thunk;
      }
      function listener(event, done) {
        return function onevent(arg1) {
          var args = new Array(arguments.length);
          var ee = this;
          var err = event === "error" ? arg1 : null;
          for (var i = 0; i < args.length; i++) {
            args[i] = arguments[i];
          }
          done(err, ee, event, args);
        };
      }
    },
    4297: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Dir = void 0;
      const util_1 = __nccwpck_require__(9483);
      const Dirent_1 = __nccwpck_require__(6912);
      class Dir {
        constructor(link, options) {
          this.link = link;
          this.options = options;
          this.iteratorInfo = [];
          this.path = link.getParentPath();
          this.iteratorInfo.push(link.children[Symbol.iterator]());
        }
        wrapAsync(method, args, callback) {
          (0, util_1.validateCallback)(callback);
          setImmediate(() => {
            let result;
            try {
              result = method.apply(this, args);
            } catch (err) {
              callback(err);
              return;
            }
            callback(null, result);
          });
        }
        isFunction(x) {
          return typeof x === "function";
        }
        promisify(obj, fn) {
          return (...args) =>
            new Promise((resolve, reject) => {
              if (this.isFunction(obj[fn])) {
                obj[fn].bind(obj)(...args, (error, result) => {
                  if (error) reject(error);
                  resolve(result);
                });
              } else {
                reject("Not a function");
              }
            });
        }
        closeBase() {}
        readBase(iteratorInfo) {
          let done;
          let value;
          let name;
          let link;
          do {
            do {
              ({ done, value } = iteratorInfo[iteratorInfo.length - 1].next());
              if (!done) {
                [name, link] = value;
              } else {
                break;
              }
            } while (name === "." || name === "..");
            if (done) {
              iteratorInfo.pop();
              if (iteratorInfo.length === 0) {
                break;
              } else {
                done = false;
              }
            } else {
              if (this.options.recursive && link.children.size) {
                iteratorInfo.push(link.children[Symbol.iterator]());
              }
              return Dirent_1.default.build(link, this.options.encoding);
            }
          } while (!done);
          return null;
        }
        closeBaseAsync(callback) {
          this.wrapAsync(this.closeBase, [], callback);
        }
        close(callback) {
          if (typeof callback === "function") {
            this.closeBaseAsync(callback);
          } else {
            return this.promisify(this, "closeBaseAsync")();
          }
        }
        closeSync() {
          this.closeBase();
        }
        readBaseAsync(callback) {
          this.wrapAsync(this.readBase, [this.iteratorInfo], callback);
        }
        read(callback) {
          if (typeof callback === "function") {
            this.readBaseAsync(callback);
          } else {
            return this.promisify(this, "readBaseAsync")();
          }
        }
        readSync() {
          return this.readBase(this.iteratorInfo);
        }
        [Symbol.asyncIterator]() {
          const iteratorInfo = [];
          const _this = this;
          iteratorInfo.push(_this.link.children[Symbol.iterator]());
          const o = {
            readBaseAsync(callback) {
              _this.wrapAsync(_this.readBase, [iteratorInfo], callback);
            },
          };
          return {
            async next() {
              const dirEnt = await _this.promisify(o, "readBaseAsync")();
              if (dirEnt !== null) {
                return { done: false, value: dirEnt };
              } else {
                return { done: true, value: undefined };
              }
            },
            [Symbol.asyncIterator]() {
              throw new Error("Not implemented");
            },
          };
        }
      }
      exports.Dir = Dir;
    },
    6912: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Dirent = void 0;
      const constants_1 = __nccwpck_require__(1895);
      const encoding_1 = __nccwpck_require__(7721);
      const {
        S_IFMT,
        S_IFDIR,
        S_IFREG,
        S_IFBLK,
        S_IFCHR,
        S_IFLNK,
        S_IFIFO,
        S_IFSOCK,
      } = constants_1.constants;
      class Dirent {
        constructor() {
          this.name = "";
          this.path = "";
          this.parentPath = "";
          this.mode = 0;
        }
        static build(link, encoding) {
          const dirent = new Dirent();
          const { mode } = link.getNode();
          dirent.name = (0, encoding_1.strToEncoding)(link.getName(), encoding);
          dirent.mode = mode;
          dirent.path = link.getParentPath();
          dirent.parentPath = dirent.path;
          return dirent;
        }
        _checkModeProperty(property) {
          return (this.mode & S_IFMT) === property;
        }
        isDirectory() {
          return this._checkModeProperty(S_IFDIR);
        }
        isFile() {
          return this._checkModeProperty(S_IFREG);
        }
        isBlockDevice() {
          return this._checkModeProperty(S_IFBLK);
        }
        isCharacterDevice() {
          return this._checkModeProperty(S_IFCHR);
        }
        isSymbolicLink() {
          return this._checkModeProperty(S_IFLNK);
        }
        isFIFO() {
          return this._checkModeProperty(S_IFIFO);
        }
        isSocket() {
          return this._checkModeProperty(S_IFSOCK);
        }
      }
      exports.Dirent = Dirent;
      exports["default"] = Dirent;
    },
    845: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Stats = void 0;
      const constants_1 = __nccwpck_require__(1895);
      const {
        S_IFMT,
        S_IFDIR,
        S_IFREG,
        S_IFBLK,
        S_IFCHR,
        S_IFLNK,
        S_IFIFO,
        S_IFSOCK,
      } = constants_1.constants;
      class Stats {
        static build(node, bigint = false) {
          const stats = new Stats();
          const { uid, gid, atime, mtime, ctime } = node;
          const getStatNumber = !bigint
            ? (number) => number
            : (number) => BigInt(number);
          stats.uid = getStatNumber(uid);
          stats.gid = getStatNumber(gid);
          stats.rdev = getStatNumber(node.rdev);
          stats.blksize = getStatNumber(4096);
          stats.ino = getStatNumber(node.ino);
          stats.size = getStatNumber(node.getSize());
          stats.blocks = getStatNumber(1);
          stats.atime = atime;
          stats.mtime = mtime;
          stats.ctime = ctime;
          stats.birthtime = ctime;
          stats.atimeMs = getStatNumber(atime.getTime());
          stats.mtimeMs = getStatNumber(mtime.getTime());
          const ctimeMs = getStatNumber(ctime.getTime());
          stats.ctimeMs = ctimeMs;
          stats.birthtimeMs = ctimeMs;
          if (bigint) {
            stats.atimeNs = BigInt(atime.getTime()) * BigInt(1e6);
            stats.mtimeNs = BigInt(mtime.getTime()) * BigInt(1e6);
            const ctimeNs = BigInt(ctime.getTime()) * BigInt(1e6);
            stats.ctimeNs = ctimeNs;
            stats.birthtimeNs = ctimeNs;
          }
          stats.dev = getStatNumber(0);
          stats.mode = getStatNumber(node.mode);
          stats.nlink = getStatNumber(node.nlink);
          return stats;
        }
        _checkModeProperty(property) {
          return (Number(this.mode) & S_IFMT) === property;
        }
        isDirectory() {
          return this._checkModeProperty(S_IFDIR);
        }
        isFile() {
          return this._checkModeProperty(S_IFREG);
        }
        isBlockDevice() {
          return this._checkModeProperty(S_IFBLK);
        }
        isCharacterDevice() {
          return this._checkModeProperty(S_IFCHR);
        }
        isSymbolicLink() {
          return this._checkModeProperty(S_IFLNK);
        }
        isFIFO() {
          return this._checkModeProperty(S_IFIFO);
        }
        isSocket() {
          return this._checkModeProperty(S_IFSOCK);
        }
      }
      exports.Stats = Stats;
      exports["default"] = Stats;
    },
    1895: (__unused_webpack_module, exports) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.constants = void 0;
      exports.constants = {
        O_RDONLY: 0,
        O_WRONLY: 1,
        O_RDWR: 2,
        S_IFMT: 61440,
        S_IFREG: 32768,
        S_IFDIR: 16384,
        S_IFCHR: 8192,
        S_IFBLK: 24576,
        S_IFIFO: 4096,
        S_IFLNK: 40960,
        S_IFSOCK: 49152,
        O_CREAT: 64,
        O_EXCL: 128,
        O_NOCTTY: 256,
        O_TRUNC: 512,
        O_APPEND: 1024,
        O_DIRECTORY: 65536,
        O_NOATIME: 262144,
        O_NOFOLLOW: 131072,
        O_SYNC: 1052672,
        O_SYMLINK: 2097152,
        O_DIRECT: 16384,
        O_NONBLOCK: 2048,
        S_IRWXU: 448,
        S_IRUSR: 256,
        S_IWUSR: 128,
        S_IXUSR: 64,
        S_IRWXG: 56,
        S_IRGRP: 32,
        S_IWGRP: 16,
        S_IXGRP: 8,
        S_IRWXO: 7,
        S_IROTH: 4,
        S_IWOTH: 2,
        S_IXOTH: 1,
        F_OK: 0,
        R_OK: 4,
        W_OK: 2,
        X_OK: 1,
        UV_FS_SYMLINK_DIR: 1,
        UV_FS_SYMLINK_JUNCTION: 2,
        UV_FS_COPYFILE_EXCL: 1,
        UV_FS_COPYFILE_FICLONE: 2,
        UV_FS_COPYFILE_FICLONE_FORCE: 4,
        COPYFILE_EXCL: 1,
        COPYFILE_FICLONE: 2,
        COPYFILE_FICLONE_FORCE: 4,
      };
    },
    7721: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ENCODING_UTF8 = void 0;
      exports.assertEncoding = assertEncoding;
      exports.strToEncoding = strToEncoding;
      const buffer_1 = __nccwpck_require__(3330);
      const errors = __nccwpck_require__(4583);
      exports.ENCODING_UTF8 = "utf8";
      function assertEncoding(encoding) {
        if (encoding && !buffer_1.Buffer.isEncoding(encoding))
          throw new errors.TypeError(
            "ERR_INVALID_OPT_VALUE_ENCODING",
            encoding,
          );
      }
      function strToEncoding(str, encoding) {
        if (!encoding || encoding === exports.ENCODING_UTF8) return str;
        if (encoding === "buffer") return new buffer_1.Buffer(str);
        return new buffer_1.Buffer(str).toString(encoding);
      }
    },
    5590: (module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.memfs = exports.fs = exports.vol = exports.Volume = void 0;
      exports.createFsFromVolume = createFsFromVolume;
      const Stats_1 = __nccwpck_require__(845);
      const Dirent_1 = __nccwpck_require__(6912);
      const volume_1 = __nccwpck_require__(7682);
      const constants_1 = __nccwpck_require__(1895);
      const fsSynchronousApiList_1 = __nccwpck_require__(9041);
      const fsCallbackApiList_1 = __nccwpck_require__(6417);
      const { F_OK, R_OK, W_OK, X_OK } = constants_1.constants;
      exports.Volume = volume_1.Volume;
      exports.vol = new volume_1.Volume();
      function createFsFromVolume(vol) {
        const fs = {
          F_OK,
          R_OK,
          W_OK,
          X_OK,
          constants: constants_1.constants,
          Stats: Stats_1.default,
          Dirent: Dirent_1.default,
        };
        for (const method of fsSynchronousApiList_1.fsSynchronousApiList)
          if (typeof vol[method] === "function")
            fs[method] = vol[method].bind(vol);
        for (const method of fsCallbackApiList_1.fsCallbackApiList)
          if (typeof vol[method] === "function")
            fs[method] = vol[method].bind(vol);
        fs.StatWatcher = vol.StatWatcher;
        fs.FSWatcher = vol.FSWatcher;
        fs.WriteStream = vol.WriteStream;
        fs.ReadStream = vol.ReadStream;
        fs.promises = vol.promises;
        fs._toUnixTimestamp = volume_1.toUnixTimestamp;
        fs.__vol = vol;
        return fs;
      }
      exports.fs = createFsFromVolume(exports.vol);
      const memfs = (json = {}, cwd = "/") => {
        const vol = exports.Volume.fromNestedJSON(json, cwd);
        const fs = createFsFromVolume(vol);
        return { fs, vol };
      };
      exports.memfs = memfs;
      module.exports = Object.assign(
        Object.assign({}, module.exports),
        exports.fs,
      );
      module.exports.semantic = true;
    },
    3330: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.bufferFrom = exports.bufferAllocUnsafe = exports.Buffer = void 0;
      const buffer_1 = __nccwpck_require__(181);
      Object.defineProperty(exports, "Buffer", {
        enumerable: true,
        get: function () {
          return buffer_1.Buffer;
        },
      });
      function bufferV0P12Ponyfill(arg0, ...args) {
        return new buffer_1.Buffer(arg0, ...args);
      }
      const bufferAllocUnsafe =
        buffer_1.Buffer.allocUnsafe || bufferV0P12Ponyfill;
      exports.bufferAllocUnsafe = bufferAllocUnsafe;
      const bufferFrom = buffer_1.Buffer.from || bufferV0P12Ponyfill;
      exports.bufferFrom = bufferFrom;
    },
    4583: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.AssertionError =
        exports.RangeError =
        exports.TypeError =
        exports.Error =
          void 0;
      exports.message = message;
      exports.E = E;
      const assert = __nccwpck_require__(2613);
      const util = __nccwpck_require__(9023);
      const kCode = typeof Symbol === "undefined" ? "_kCode" : Symbol("code");
      const messages = {};
      function makeNodeError(Base) {
        return class NodeError extends Base {
          constructor(key, ...args) {
            super(message(key, args));
            this.code = key;
            this[kCode] = key;
            this.name = `${super.name} [${this[kCode]}]`;
          }
        };
      }
      const g = typeof globalThis !== "undefined" ? globalThis : global;
      class AssertionError extends g.Error {
        constructor(options) {
          if (typeof options !== "object" || options === null) {
            throw new exports.TypeError(
              "ERR_INVALID_ARG_TYPE",
              "options",
              "object",
            );
          }
          if (options.message) {
            super(options.message);
          } else {
            super(
              `${util.inspect(options.actual).slice(0, 128)} ` +
                `${options.operator} ${util.inspect(options.expected).slice(0, 128)}`,
            );
          }
          this.generatedMessage = !options.message;
          this.name = "AssertionError [ERR_ASSERTION]";
          this.code = "ERR_ASSERTION";
          this.actual = options.actual;
          this.expected = options.expected;
          this.operator = options.operator;
          exports.Error.captureStackTrace(this, options.stackStartFunction);
        }
      }
      exports.AssertionError = AssertionError;
      function message(key, args) {
        assert.strictEqual(typeof key, "string");
        const msg = messages[key];
        assert(msg, `An invalid error message key was used: ${key}.`);
        let fmt;
        if (typeof msg === "function") {
          fmt = msg;
        } else {
          fmt = util.format;
          if (args === undefined || args.length === 0) return msg;
          args.unshift(msg);
        }
        return String(fmt.apply(null, args));
      }
      function E(sym, val) {
        messages[sym] = typeof val === "function" ? val : String(val);
      }
      exports.Error = makeNodeError(g.Error);
      exports.TypeError = makeNodeError(g.TypeError);
      exports.RangeError = makeNodeError(g.RangeError);
      E("ERR_ARG_NOT_ITERABLE", "%s must be iterable");
      E("ERR_ASSERTION", "%s");
      E("ERR_BUFFER_OUT_OF_BOUNDS", bufferOutOfBounds);
      E("ERR_CHILD_CLOSED_BEFORE_REPLY", "Child closed before reply received");
      E(
        "ERR_CONSOLE_WRITABLE_STREAM",
        "Console expects a writable stream instance for %s",
      );
      E("ERR_CPU_USAGE", "Unable to obtain cpu usage %s");
      E(
        "ERR_DNS_SET_SERVERS_FAILED",
        (err, servers) => `c-ares failed to set servers: "${err}" [${servers}]`,
      );
      E("ERR_FALSY_VALUE_REJECTION", "Promise was rejected with falsy value");
      E(
        "ERR_ENCODING_NOT_SUPPORTED",
        (enc) => `The "${enc}" encoding is not supported`,
      );
      E(
        "ERR_ENCODING_INVALID_ENCODED_DATA",
        (enc) => `The encoded data was not valid for encoding ${enc}`,
      );
      E(
        "ERR_HTTP_HEADERS_SENT",
        "Cannot render headers after they are sent to the client",
      );
      E("ERR_HTTP_INVALID_STATUS_CODE", "Invalid status code: %s");
      E(
        "ERR_HTTP_TRAILER_INVALID",
        "Trailers are invalid with this transfer encoding",
      );
      E("ERR_INDEX_OUT_OF_RANGE", "Index out of range");
      E("ERR_INVALID_ARG_TYPE", invalidArgType);
      E("ERR_INVALID_ARRAY_LENGTH", (name, len, actual) => {
        assert.strictEqual(typeof actual, "number");
        return `The array "${name}" (length ${actual}) must be of length ${len}.`;
      });
      E("ERR_INVALID_BUFFER_SIZE", "Buffer size must be a multiple of %s");
      E("ERR_INVALID_CALLBACK", "Callback must be a function");
      E("ERR_INVALID_CHAR", "Invalid character in %s");
      E(
        "ERR_INVALID_CURSOR_POS",
        "Cannot set cursor row without setting its column",
      );
      E("ERR_INVALID_FD", '"fd" must be a positive integer: %s');
      E(
        "ERR_INVALID_FILE_URL_HOST",
        'File URL host must be "localhost" or empty on %s',
      );
      E("ERR_INVALID_FILE_URL_PATH", "File URL path %s");
      E("ERR_INVALID_HANDLE_TYPE", "This handle type cannot be sent");
      E("ERR_INVALID_IP_ADDRESS", "Invalid IP address: %s");
      E(
        "ERR_INVALID_OPT_VALUE",
        (name, value) =>
          `The value "${String(value)}" is invalid for option "${name}"`,
      );
      E(
        "ERR_INVALID_OPT_VALUE_ENCODING",
        (value) =>
          `The value "${String(value)}" is invalid for option "encoding"`,
      );
      E(
        "ERR_INVALID_REPL_EVAL_CONFIG",
        'Cannot specify both "breakEvalOnSigint" and "eval" for REPL',
      );
      E(
        "ERR_INVALID_SYNC_FORK_INPUT",
        "Asynchronous forks do not support Buffer, Uint8Array or string input: %s",
      );
      E("ERR_INVALID_THIS", 'Value of "this" must be of type %s');
      E("ERR_INVALID_TUPLE", "%s must be an iterable %s tuple");
      E("ERR_INVALID_URL", "Invalid URL: %s");
      E(
        "ERR_INVALID_URL_SCHEME",
        (expected) => `The URL must be ${oneOf(expected, "scheme")}`,
      );
      E("ERR_IPC_CHANNEL_CLOSED", "Channel closed");
      E("ERR_IPC_DISCONNECTED", "IPC channel is already disconnected");
      E("ERR_IPC_ONE_PIPE", "Child process can have only one IPC pipe");
      E("ERR_IPC_SYNC_FORK", "IPC cannot be used with synchronous forks");
      E("ERR_MISSING_ARGS", missingArgs);
      E("ERR_MULTIPLE_CALLBACK", "Callback called multiple times");
      E("ERR_NAPI_CONS_FUNCTION", "Constructor must be a function");
      E(
        "ERR_NAPI_CONS_PROTOTYPE_OBJECT",
        "Constructor.prototype must be an object",
      );
      E("ERR_NO_CRYPTO", "Node.js is not compiled with OpenSSL crypto support");
      E("ERR_NO_LONGER_SUPPORTED", "%s is no longer supported");
      E("ERR_PARSE_HISTORY_DATA", "Could not parse history data in %s");
      E("ERR_SOCKET_ALREADY_BOUND", "Socket is already bound");
      E("ERR_SOCKET_BAD_PORT", "Port should be > 0 and < 65536");
      E(
        "ERR_SOCKET_BAD_TYPE",
        "Bad socket type specified. Valid types are: udp4, udp6",
      );
      E("ERR_SOCKET_CANNOT_SEND", "Unable to send data");
      E("ERR_SOCKET_CLOSED", "Socket is closed");
      E("ERR_SOCKET_DGRAM_NOT_RUNNING", "Not running");
      E("ERR_STDERR_CLOSE", "process.stderr cannot be closed");
      E("ERR_STDOUT_CLOSE", "process.stdout cannot be closed");
      E("ERR_STREAM_WRAP", "Stream has StringDecoder set or is in objectMode");
      E(
        "ERR_TLS_CERT_ALTNAME_INVALID",
        "Hostname/IP does not match certificate's altnames: %s",
      );
      E(
        "ERR_TLS_DH_PARAM_SIZE",
        (size) => `DH parameter size ${size} is less than 2048`,
      );
      E("ERR_TLS_HANDSHAKE_TIMEOUT", "TLS handshake timeout");
      E("ERR_TLS_RENEGOTIATION_FAILED", "Failed to renegotiate");
      E(
        "ERR_TLS_REQUIRED_SERVER_NAME",
        '"servername" is required parameter for Server.addContext',
      );
      E("ERR_TLS_SESSION_ATTACK", "TSL session renegotiation attack detected");
      E(
        "ERR_TRANSFORM_ALREADY_TRANSFORMING",
        "Calling transform done when still transforming",
      );
      E(
        "ERR_TRANSFORM_WITH_LENGTH_0",
        "Calling transform done when writableState.length != 0",
      );
      E("ERR_UNKNOWN_ENCODING", "Unknown encoding: %s");
      E("ERR_UNKNOWN_SIGNAL", "Unknown signal: %s");
      E("ERR_UNKNOWN_STDIN_TYPE", "Unknown stdin file type");
      E("ERR_UNKNOWN_STREAM_TYPE", "Unknown stream file type");
      E(
        "ERR_V8BREAKITERATOR",
        "Full ICU data not installed. " +
          "See https://github.com/nodejs/node/wiki/Intl",
      );
      function invalidArgType(name, expected, actual) {
        assert(name, "name is required");
        let determiner;
        if (expected.includes("not ")) {
          determiner = "must not be";
          expected = expected.split("not ")[1];
        } else {
          determiner = "must be";
        }
        let msg;
        if (Array.isArray(name)) {
          const names = name.map((val) => `"${val}"`).join(", ");
          msg = `The ${names} arguments ${determiner} ${oneOf(expected, "type")}`;
        } else if (name.includes(" argument")) {
          msg = `The ${name} ${determiner} ${oneOf(expected, "type")}`;
        } else {
          const type = name.includes(".") ? "property" : "argument";
          msg = `The "${name}" ${type} ${determiner} ${oneOf(expected, "type")}`;
        }
        if (arguments.length >= 3) {
          msg += `. Received type ${actual !== null ? typeof actual : "null"}`;
        }
        return msg;
      }
      function missingArgs(...args) {
        assert(args.length > 0, "At least one arg needs to be specified");
        let msg = "The ";
        const len = args.length;
        args = args.map((a) => `"${a}"`);
        switch (len) {
          case 1:
            msg += `${args[0]} argument`;
            break;
          case 2:
            msg += `${args[0]} and ${args[1]} arguments`;
            break;
          default:
            msg += args.slice(0, len - 1).join(", ");
            msg += `, and ${args[len - 1]} arguments`;
            break;
        }
        return `${msg} must be specified`;
      }
      function oneOf(expected, thing) {
        assert(expected, "expected is required");
        assert(typeof thing === "string", "thing is required");
        if (Array.isArray(expected)) {
          const len = expected.length;
          assert(len > 0, "At least one expected value needs to be specified");
          expected = expected.map((i) => String(i));
          if (len > 2) {
            return (
              `one of ${thing} ${expected.slice(0, len - 1).join(", ")}, or ` +
              expected[len - 1]
            );
          } else if (len === 2) {
            return `one of ${thing} ${expected[0]} or ${expected[1]}`;
          } else {
            return `of ${thing} ${expected[0]}`;
          }
        } else {
          return `of ${thing} ${String(expected)}`;
        }
      }
      function bufferOutOfBounds(name, isWriting) {
        if (isWriting) {
          return "Attempt to write outside buffer bounds";
        } else {
          return `"${name}" is outside of buffer bounds`;
        }
      }
    },
    6934: (__unused_webpack_module, exports) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.newNotAllowedError =
        exports.newTypeMismatchError =
        exports.newNotFoundError =
        exports.assertCanWrite =
        exports.assertName =
        exports.basename =
        exports.ctx =
          void 0;
      const ctx = (partial = {}) =>
        Object.assign(
          { separator: "/", syncHandleAllowed: false, mode: "read" },
          partial,
        );
      exports.ctx = ctx;
      const basename = (path, separator) => {
        if (path[path.length - 1] === separator) path = path.slice(0, -1);
        const lastSlashIndex = path.lastIndexOf(separator);
        return lastSlashIndex === -1 ? path : path.slice(lastSlashIndex + 1);
      };
      exports.basename = basename;
      const nameRegex = /^(\.{1,2})$|^(.*([\/\\]).*)$/;
      const assertName = (name, method, klass) => {
        const isInvalid = !name || nameRegex.test(name);
        if (isInvalid)
          throw new TypeError(
            `Failed to execute '${method}' on '${klass}': Name is not allowed.`,
          );
      };
      exports.assertName = assertName;
      const assertCanWrite = (mode) => {
        if (mode !== "readwrite")
          throw new DOMException(
            "The request is not allowed by the user agent or the platform in the current context.",
            "NotAllowedError",
          );
      };
      exports.assertCanWrite = assertCanWrite;
      const newNotFoundError = () =>
        new DOMException(
          "A requested file or directory could not be found at the time an operation was processed.",
          "NotFoundError",
        );
      exports.newNotFoundError = newNotFoundError;
      const newTypeMismatchError = () =>
        new DOMException(
          "The path supplied exists, but was not an entry of requested type.",
          "TypeMismatchError",
        );
      exports.newTypeMismatchError = newTypeMismatchError;
      const newNotAllowedError = () =>
        new DOMException("Permission not granted.", "NotAllowedError");
      exports.newNotAllowedError = newNotAllowedError;
    },
    540: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.File = exports.Link = exports.Node = exports.SEP = void 0;
      const process_1 = __nccwpck_require__(4507);
      const buffer_1 = __nccwpck_require__(3330);
      const constants_1 = __nccwpck_require__(1895);
      const events_1 = __nccwpck_require__(4434);
      const Stats_1 = __nccwpck_require__(845);
      const { S_IFMT, S_IFDIR, S_IFREG, S_IFLNK, S_IFCHR, O_APPEND } =
        constants_1.constants;
      const getuid = () => {
        var _a, _b;
        return (_b =
          (_a = process_1.default.getuid) === null || _a === void 0
            ? void 0
            : _a.call(process_1.default)) !== null && _b !== void 0
          ? _b
          : 0;
      };
      const getgid = () => {
        var _a, _b;
        return (_b =
          (_a = process_1.default.getgid) === null || _a === void 0
            ? void 0
            : _a.call(process_1.default)) !== null && _b !== void 0
          ? _b
          : 0;
      };
      exports.SEP = "/";
      class Node extends events_1.EventEmitter {
        constructor(ino, mode = 438) {
          super();
          this._uid = getuid();
          this._gid = getgid();
          this._atime = new Date();
          this._mtime = new Date();
          this._ctime = new Date();
          this.rdev = 0;
          this._nlink = 1;
          this.mode = mode;
          this.ino = ino;
        }
        set ctime(ctime) {
          this._ctime = ctime;
        }
        get ctime() {
          return this._ctime;
        }
        set uid(uid) {
          this._uid = uid;
          this.ctime = new Date();
        }
        get uid() {
          return this._uid;
        }
        set gid(gid) {
          this._gid = gid;
          this.ctime = new Date();
        }
        get gid() {
          return this._gid;
        }
        set atime(atime) {
          this._atime = atime;
          this.ctime = new Date();
        }
        get atime() {
          return this._atime;
        }
        set mtime(mtime) {
          this._mtime = mtime;
          this.ctime = new Date();
        }
        get mtime() {
          return this._mtime;
        }
        get perm() {
          return this.mode & ~S_IFMT;
        }
        set perm(perm) {
          this.mode = (this.mode & S_IFMT) | (perm & ~S_IFMT);
          this.ctime = new Date();
        }
        set nlink(nlink) {
          this._nlink = nlink;
          this.ctime = new Date();
        }
        get nlink() {
          return this._nlink;
        }
        getString(encoding = "utf8") {
          this.atime = new Date();
          return this.getBuffer().toString(encoding);
        }
        setString(str) {
          this.buf = (0, buffer_1.bufferFrom)(str, "utf8");
          this.touch();
        }
        getBuffer() {
          this.atime = new Date();
          if (!this.buf) this.setBuffer((0, buffer_1.bufferAllocUnsafe)(0));
          return (0, buffer_1.bufferFrom)(this.buf);
        }
        setBuffer(buf) {
          this.buf = (0, buffer_1.bufferFrom)(buf);
          this.touch();
        }
        getSize() {
          return this.buf ? this.buf.length : 0;
        }
        setModeProperty(property) {
          this.mode = property;
        }
        isFile() {
          return (this.mode & S_IFMT) === S_IFREG;
        }
        isDirectory() {
          return (this.mode & S_IFMT) === S_IFDIR;
        }
        isSymlink() {
          return (this.mode & S_IFMT) === S_IFLNK;
        }
        isCharacterDevice() {
          return (this.mode & S_IFMT) === S_IFCHR;
        }
        makeSymlink(symlink) {
          this.mode = S_IFLNK | 438;
          this.symlink = symlink;
        }
        write(buf, off = 0, len = buf.length, pos = 0) {
          if (!this.buf) this.buf = (0, buffer_1.bufferAllocUnsafe)(0);
          if (pos + len > this.buf.length) {
            const newBuf = (0, buffer_1.bufferAllocUnsafe)(pos + len);
            this.buf.copy(newBuf, 0, 0, this.buf.length);
            this.buf = newBuf;
          }
          buf.copy(this.buf, pos, off, off + len);
          this.touch();
          return len;
        }
        read(buf, off = 0, len = buf.byteLength, pos = 0) {
          this.atime = new Date();
          if (!this.buf) this.buf = (0, buffer_1.bufferAllocUnsafe)(0);
          let actualLen = len;
          if (actualLen > buf.byteLength) {
            actualLen = buf.byteLength;
          }
          if (actualLen + pos > this.buf.length) {
            actualLen = this.buf.length - pos;
          }
          const buf2 =
            buf instanceof buffer_1.Buffer
              ? buf
              : buffer_1.Buffer.from(buf.buffer);
          this.buf.copy(buf2, off, pos, pos + actualLen);
          return actualLen;
        }
        truncate(len = 0) {
          if (!len) this.buf = (0, buffer_1.bufferAllocUnsafe)(0);
          else {
            if (!this.buf) this.buf = (0, buffer_1.bufferAllocUnsafe)(0);
            if (len <= this.buf.length) {
              this.buf = this.buf.slice(0, len);
            } else {
              const buf = (0, buffer_1.bufferAllocUnsafe)(len);
              this.buf.copy(buf);
              buf.fill(0, this.buf.length);
              this.buf = buf;
            }
          }
          this.touch();
        }
        chmod(perm) {
          this.mode = (this.mode & S_IFMT) | (perm & ~S_IFMT);
          this.touch();
        }
        chown(uid, gid) {
          this.uid = uid;
          this.gid = gid;
          this.touch();
        }
        touch() {
          this.mtime = new Date();
          this.emit("change", this);
        }
        canRead(uid = getuid(), gid = getgid()) {
          if (this.perm & 4) {
            return true;
          }
          if (gid === this.gid) {
            if (this.perm & 32) {
              return true;
            }
          }
          if (uid === this.uid) {
            if (this.perm & 256) {
              return true;
            }
          }
          return false;
        }
        canWrite(uid = getuid(), gid = getgid()) {
          if (this.perm & 2) {
            return true;
          }
          if (gid === this.gid) {
            if (this.perm & 16) {
              return true;
            }
          }
          if (uid === this.uid) {
            if (this.perm & 128) {
              return true;
            }
          }
          return false;
        }
        canExecute(uid = getuid(), gid = getgid()) {
          if (this.perm & 1) {
            return true;
          }
          if (gid === this.gid) {
            if (this.perm & 8) {
              return true;
            }
          }
          if (uid === this.uid) {
            if (this.perm & 64) {
              return true;
            }
          }
          return false;
        }
        del() {
          this.emit("delete", this);
        }
        toJSON() {
          return {
            ino: this.ino,
            uid: this.uid,
            gid: this.gid,
            atime: this.atime.getTime(),
            mtime: this.mtime.getTime(),
            ctime: this.ctime.getTime(),
            perm: this.perm,
            mode: this.mode,
            nlink: this.nlink,
            symlink: this.symlink,
            data: this.getString(),
          };
        }
      }
      exports.Node = Node;
      class Link extends events_1.EventEmitter {
        get steps() {
          return this._steps;
        }
        set steps(val) {
          this._steps = val;
          for (const [child, link] of this.children.entries()) {
            if (child === "." || child === "..") {
              continue;
            }
            link === null || link === void 0 ? void 0 : link.syncSteps();
          }
        }
        constructor(vol, parent, name) {
          super();
          this.children = new Map();
          this._steps = [];
          this.ino = 0;
          this.length = 0;
          this.vol = vol;
          this.parent = parent;
          this.name = name;
          this.syncSteps();
        }
        setNode(node) {
          this.node = node;
          this.ino = node.ino;
        }
        getNode() {
          return this.node;
        }
        createChild(name, node = this.vol.createNode(S_IFREG | 438)) {
          const link = new Link(this.vol, this, name);
          link.setNode(node);
          if (node.isDirectory()) {
            link.children.set(".", link);
            link.getNode().nlink++;
          }
          this.setChild(name, link);
          return link;
        }
        setChild(name, link = new Link(this.vol, this, name)) {
          this.children.set(name, link);
          link.parent = this;
          this.length++;
          const node = link.getNode();
          if (node.isDirectory()) {
            link.children.set("..", this);
            this.getNode().nlink++;
          }
          this.getNode().mtime = new Date();
          this.emit("child:add", link, this);
          return link;
        }
        deleteChild(link) {
          const node = link.getNode();
          if (node.isDirectory()) {
            link.children.delete("..");
            this.getNode().nlink--;
          }
          this.children.delete(link.getName());
          this.length--;
          this.getNode().mtime = new Date();
          this.emit("child:delete", link, this);
        }
        getChild(name) {
          this.getNode().mtime = new Date();
          return this.children.get(name);
        }
        getPath() {
          return this.steps.join(exports.SEP);
        }
        getParentPath() {
          return this.steps.slice(0, -1).join(exports.SEP);
        }
        getName() {
          return this.steps[this.steps.length - 1];
        }
        toJSON() {
          return {
            steps: this.steps,
            ino: this.ino,
            children: Array.from(this.children.keys()),
          };
        }
        syncSteps() {
          this.steps = this.parent
            ? this.parent.steps.concat([this.name])
            : [this.name];
        }
      }
      exports.Link = Link;
      class File {
        constructor(link, node, flags, fd) {
          this.link = link;
          this.node = node;
          this.flags = flags;
          this.fd = fd;
          this.position = 0;
          if (this.flags & O_APPEND) this.position = this.getSize();
        }
        getString(encoding = "utf8") {
          return this.node.getString();
        }
        setString(str) {
          this.node.setString(str);
        }
        getBuffer() {
          return this.node.getBuffer();
        }
        setBuffer(buf) {
          this.node.setBuffer(buf);
        }
        getSize() {
          return this.node.getSize();
        }
        truncate(len) {
          this.node.truncate(len);
        }
        seekTo(position) {
          this.position = position;
        }
        stats() {
          return Stats_1.default.build(this.node);
        }
        write(buf, offset = 0, length = buf.length, position) {
          if (typeof position !== "number") position = this.position;
          const bytes = this.node.write(buf, offset, length, position);
          this.position = position + bytes;
          return bytes;
        }
        read(buf, offset = 0, length = buf.byteLength, position) {
          if (typeof position !== "number") position = this.position;
          const bytes = this.node.read(buf, offset, length, position);
          this.position = position + bytes;
          return bytes;
        }
        chmod(perm) {
          this.node.chmod(perm);
        }
        chown(uid, gid) {
          this.node.chown(uid, gid);
        }
      }
      exports.File = File;
    },
    2407: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.FileHandle = void 0;
      const util_1 = __nccwpck_require__(9483);
      class FileHandle {
        constructor(fs, fd) {
          this.fs = fs;
          this.fd = fd;
        }
        appendFile(data, options) {
          return (0, util_1.promisify)(this.fs, "appendFile")(
            this.fd,
            data,
            options,
          );
        }
        chmod(mode) {
          return (0, util_1.promisify)(this.fs, "fchmod")(this.fd, mode);
        }
        chown(uid, gid) {
          return (0, util_1.promisify)(this.fs, "fchown")(this.fd, uid, gid);
        }
        close() {
          return (0, util_1.promisify)(this.fs, "close")(this.fd);
        }
        datasync() {
          return (0, util_1.promisify)(this.fs, "fdatasync")(this.fd);
        }
        createReadStream(options) {
          return this.fs.createReadStream(
            "",
            Object.assign(Object.assign({}, options), { fd: this }),
          );
        }
        createWriteStream(options) {
          return this.fs.createWriteStream(
            "",
            Object.assign(Object.assign({}, options), { fd: this }),
          );
        }
        readableWebStream(options) {
          return new ReadableStream({
            pull: async (controller) => {
              const data = await this.readFile();
              controller.enqueue(data);
              controller.close();
            },
          });
        }
        read(buffer, offset, length, position) {
          return (0, util_1.promisify)(this.fs, "read", (bytesRead) => ({
            bytesRead,
            buffer,
          }))(this.fd, buffer, offset, length, position);
        }
        readv(buffers, position) {
          return (0, util_1.promisify)(this.fs, "readv", (bytesRead) => ({
            bytesRead,
            buffers,
          }))(this.fd, buffers, position);
        }
        readFile(options) {
          return (0, util_1.promisify)(this.fs, "readFile")(this.fd, options);
        }
        stat(options) {
          return (0, util_1.promisify)(this.fs, "fstat")(this.fd, options);
        }
        sync() {
          return (0, util_1.promisify)(this.fs, "fsync")(this.fd);
        }
        truncate(len) {
          return (0, util_1.promisify)(this.fs, "ftruncate")(this.fd, len);
        }
        utimes(atime, mtime) {
          return (0, util_1.promisify)(this.fs, "futimes")(
            this.fd,
            atime,
            mtime,
          );
        }
        write(buffer, offset, length, position) {
          return (0, util_1.promisify)(this.fs, "write", (bytesWritten) => ({
            bytesWritten,
            buffer,
          }))(this.fd, buffer, offset, length, position);
        }
        writev(buffers, position) {
          return (0, util_1.promisify)(this.fs, "writev", (bytesWritten) => ({
            bytesWritten,
            buffers,
          }))(this.fd, buffers, position);
        }
        writeFile(data, options) {
          return (0, util_1.promisify)(this.fs, "writeFile")(
            this.fd,
            data,
            options,
          );
        }
      }
      exports.FileHandle = FileHandle;
    },
    5890: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.FsPromises = void 0;
      const util_1 = __nccwpck_require__(9483);
      const constants_1 = __nccwpck_require__(1895);
      class FsPromises {
        constructor(fs, FileHandle) {
          this.fs = fs;
          this.FileHandle = FileHandle;
          this.constants = constants_1.constants;
          this.cp = (0, util_1.promisify)(this.fs, "cp");
          this.opendir = (0, util_1.promisify)(this.fs, "opendir");
          this.statfs = (0, util_1.promisify)(this.fs, "statfs");
          this.lutimes = (0, util_1.promisify)(this.fs, "lutimes");
          this.access = (0, util_1.promisify)(this.fs, "access");
          this.chmod = (0, util_1.promisify)(this.fs, "chmod");
          this.chown = (0, util_1.promisify)(this.fs, "chown");
          this.copyFile = (0, util_1.promisify)(this.fs, "copyFile");
          this.lchmod = (0, util_1.promisify)(this.fs, "lchmod");
          this.lchown = (0, util_1.promisify)(this.fs, "lchown");
          this.link = (0, util_1.promisify)(this.fs, "link");
          this.lstat = (0, util_1.promisify)(this.fs, "lstat");
          this.mkdir = (0, util_1.promisify)(this.fs, "mkdir");
          this.mkdtemp = (0, util_1.promisify)(this.fs, "mkdtemp");
          this.readdir = (0, util_1.promisify)(this.fs, "readdir");
          this.readlink = (0, util_1.promisify)(this.fs, "readlink");
          this.realpath = (0, util_1.promisify)(this.fs, "realpath");
          this.rename = (0, util_1.promisify)(this.fs, "rename");
          this.rmdir = (0, util_1.promisify)(this.fs, "rmdir");
          this.rm = (0, util_1.promisify)(this.fs, "rm");
          this.stat = (0, util_1.promisify)(this.fs, "stat");
          this.symlink = (0, util_1.promisify)(this.fs, "symlink");
          this.truncate = (0, util_1.promisify)(this.fs, "truncate");
          this.unlink = (0, util_1.promisify)(this.fs, "unlink");
          this.utimes = (0, util_1.promisify)(this.fs, "utimes");
          this.readFile = (id, options) =>
            (0, util_1.promisify)(this.fs, "readFile")(
              id instanceof this.FileHandle ? id.fd : id,
              options,
            );
          this.appendFile = (path, data, options) =>
            (0, util_1.promisify)(this.fs, "appendFile")(
              path instanceof this.FileHandle ? path.fd : path,
              data,
              options,
            );
          this.open = (path, flags = "r", mode) =>
            (0, util_1.promisify)(
              this.fs,
              "open",
              (fd) => new this.FileHandle(this.fs, fd),
            )(path, flags, mode);
          this.writeFile = (id, data, options) => {
            const dataPromise = (0, util_1.isReadableStream)(data)
              ? (0, util_1.streamToBuffer)(data)
              : Promise.resolve(data);
            return dataPromise.then((data) =>
              (0, util_1.promisify)(this.fs, "writeFile")(
                id instanceof this.FileHandle ? id.fd : id,
                data,
                options,
              ),
            );
          };
          this.watch = () => {
            throw new Error("Not implemented");
          };
        }
      }
      exports.FsPromises = FsPromises;
    },
    7718: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.FLAGS = exports.ERRSTR = void 0;
      const constants_1 = __nccwpck_require__(1895);
      exports.ERRSTR = {
        PATH_STR: "path must be a string, Buffer, or Uint8Array",
        FD: "fd must be a file descriptor",
        MODE_INT: "mode must be an int",
        CB: "callback must be a function",
        UID: "uid must be an unsigned int",
        GID: "gid must be an unsigned int",
        LEN: "len must be an integer",
        ATIME: "atime must be an integer",
        MTIME: "mtime must be an integer",
        PREFIX: "filename prefix is required",
        BUFFER: "buffer must be an instance of Buffer or StaticBuffer",
        OFFSET: "offset must be an integer",
        LENGTH: "length must be an integer",
        POSITION: "position must be an integer",
      };
      const {
        O_RDONLY,
        O_WRONLY,
        O_RDWR,
        O_CREAT,
        O_EXCL,
        O_TRUNC,
        O_APPEND,
        O_SYNC,
      } = constants_1.constants;
      var FLAGS;
      (function (FLAGS) {
        FLAGS[(FLAGS["r"] = O_RDONLY)] = "r";
        FLAGS[(FLAGS["r+"] = O_RDWR)] = "r+";
        FLAGS[(FLAGS["rs"] = O_RDONLY | O_SYNC)] = "rs";
        FLAGS[(FLAGS["sr"] = FLAGS.rs)] = "sr";
        FLAGS[(FLAGS["rs+"] = O_RDWR | O_SYNC)] = "rs+";
        FLAGS[(FLAGS["sr+"] = FLAGS["rs+"])] = "sr+";
        FLAGS[(FLAGS["w"] = O_WRONLY | O_CREAT | O_TRUNC)] = "w";
        FLAGS[(FLAGS["wx"] = O_WRONLY | O_CREAT | O_TRUNC | O_EXCL)] = "wx";
        FLAGS[(FLAGS["xw"] = FLAGS.wx)] = "xw";
        FLAGS[(FLAGS["w+"] = O_RDWR | O_CREAT | O_TRUNC)] = "w+";
        FLAGS[(FLAGS["wx+"] = O_RDWR | O_CREAT | O_TRUNC | O_EXCL)] = "wx+";
        FLAGS[(FLAGS["xw+"] = FLAGS["wx+"])] = "xw+";
        FLAGS[(FLAGS["a"] = O_WRONLY | O_APPEND | O_CREAT)] = "a";
        FLAGS[(FLAGS["ax"] = O_WRONLY | O_APPEND | O_CREAT | O_EXCL)] = "ax";
        FLAGS[(FLAGS["xa"] = FLAGS.ax)] = "xa";
        FLAGS[(FLAGS["a+"] = O_RDWR | O_APPEND | O_CREAT)] = "a+";
        FLAGS[(FLAGS["ax+"] = O_RDWR | O_APPEND | O_CREAT | O_EXCL)] = "ax+";
        FLAGS[(FLAGS["xa+"] = FLAGS["ax+"])] = "xa+";
      })(FLAGS || (exports.FLAGS = FLAGS = {}));
    },
    6417: (__unused_webpack_module, exports) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.fsCallbackApiList = void 0;
      exports.fsCallbackApiList = [
        "access",
        "appendFile",
        "chmod",
        "chown",
        "close",
        "copyFile",
        "createReadStream",
        "createWriteStream",
        "exists",
        "fchmod",
        "fchown",
        "fdatasync",
        "fstat",
        "fsync",
        "ftruncate",
        "futimes",
        "lchmod",
        "lchown",
        "link",
        "lstat",
        "mkdir",
        "mkdtemp",
        "open",
        "read",
        "readv",
        "readdir",
        "readFile",
        "readlink",
        "realpath",
        "rename",
        "rm",
        "rmdir",
        "stat",
        "symlink",
        "truncate",
        "unlink",
        "unwatchFile",
        "utimes",
        "lutimes",
        "watch",
        "watchFile",
        "write",
        "writev",
        "writeFile",
      ];
    },
    9041: (__unused_webpack_module, exports) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.fsSynchronousApiList = void 0;
      exports.fsSynchronousApiList = [
        "accessSync",
        "appendFileSync",
        "chmodSync",
        "chownSync",
        "closeSync",
        "copyFileSync",
        "existsSync",
        "fchmodSync",
        "fchownSync",
        "fdatasyncSync",
        "fstatSync",
        "fsyncSync",
        "ftruncateSync",
        "futimesSync",
        "lchmodSync",
        "lchownSync",
        "linkSync",
        "lstatSync",
        "mkdirSync",
        "mkdtempSync",
        "openSync",
        "readdirSync",
        "readFileSync",
        "readlinkSync",
        "readSync",
        "readvSync",
        "realpathSync",
        "renameSync",
        "rmdirSync",
        "rmSync",
        "statSync",
        "symlinkSync",
        "truncateSync",
        "unlinkSync",
        "utimesSync",
        "lutimesSync",
        "writeFileSync",
        "writeSync",
        "writevSync",
      ];
    },
    1473: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.getWriteFileOptions =
        exports.writeFileDefaults =
        exports.getRealpathOptsAndCb =
        exports.getRealpathOptions =
        exports.getStatOptsAndCb =
        exports.getStatOptions =
        exports.getAppendFileOptsAndCb =
        exports.getAppendFileOpts =
        exports.getOpendirOptsAndCb =
        exports.getOpendirOptions =
        exports.getReaddirOptsAndCb =
        exports.getReaddirOptions =
        exports.getReadFileOptions =
        exports.getRmOptsAndCb =
        exports.getRmdirOptions =
        exports.getDefaultOptsAndCb =
        exports.getDefaultOpts =
        exports.optsDefaults =
        exports.getMkdirOptions =
          void 0;
      exports.getOptions = getOptions;
      exports.optsGenerator = optsGenerator;
      exports.optsAndCbGenerator = optsAndCbGenerator;
      const constants_1 = __nccwpck_require__(7718);
      const encoding_1 = __nccwpck_require__(7721);
      const util_1 = __nccwpck_require__(9483);
      const mkdirDefaults = { mode: 511, recursive: false };
      const getMkdirOptions = (options) => {
        if (typeof options === "number")
          return Object.assign({}, mkdirDefaults, { mode: options });
        return Object.assign({}, mkdirDefaults, options);
      };
      exports.getMkdirOptions = getMkdirOptions;
      const ERRSTR_OPTS = (tipeof) =>
        `Expected options to be either an object or a string, but got ${tipeof} instead`;
      function getOptions(defaults, options) {
        let opts;
        if (!options) return defaults;
        else {
          const tipeof = typeof options;
          switch (tipeof) {
            case "string":
              opts = Object.assign({}, defaults, { encoding: options });
              break;
            case "object":
              opts = Object.assign({}, defaults, options);
              break;
            default:
              throw TypeError(ERRSTR_OPTS(tipeof));
          }
        }
        if (opts.encoding !== "buffer")
          (0, encoding_1.assertEncoding)(opts.encoding);
        return opts;
      }
      function optsGenerator(defaults) {
        return (options) => getOptions(defaults, options);
      }
      function optsAndCbGenerator(getOpts) {
        return (options, callback) =>
          typeof options === "function"
            ? [getOpts(), options]
            : [getOpts(options), (0, util_1.validateCallback)(callback)];
      }
      exports.optsDefaults = { encoding: "utf8" };
      exports.getDefaultOpts = optsGenerator(exports.optsDefaults);
      exports.getDefaultOptsAndCb = optsAndCbGenerator(exports.getDefaultOpts);
      const rmdirDefaults = { recursive: false };
      const getRmdirOptions = (options) =>
        Object.assign({}, rmdirDefaults, options);
      exports.getRmdirOptions = getRmdirOptions;
      const getRmOpts = optsGenerator(exports.optsDefaults);
      exports.getRmOptsAndCb = optsAndCbGenerator(getRmOpts);
      const readFileOptsDefaults = { flag: "r" };
      exports.getReadFileOptions = optsGenerator(readFileOptsDefaults);
      const readdirDefaults = {
        encoding: "utf8",
        recursive: false,
        withFileTypes: false,
      };
      exports.getReaddirOptions = optsGenerator(readdirDefaults);
      exports.getReaddirOptsAndCb = optsAndCbGenerator(
        exports.getReaddirOptions,
      );
      const opendirDefaults = {
        encoding: "utf8",
        bufferSize: 32,
        recursive: false,
      };
      exports.getOpendirOptions = optsGenerator(opendirDefaults);
      exports.getOpendirOptsAndCb = optsAndCbGenerator(
        exports.getOpendirOptions,
      );
      const appendFileDefaults = {
        encoding: "utf8",
        mode: 438,
        flag: constants_1.FLAGS[constants_1.FLAGS.a],
      };
      exports.getAppendFileOpts = optsGenerator(appendFileDefaults);
      exports.getAppendFileOptsAndCb = optsAndCbGenerator(
        exports.getAppendFileOpts,
      );
      const statDefaults = { bigint: false };
      const getStatOptions = (options = {}) =>
        Object.assign({}, statDefaults, options);
      exports.getStatOptions = getStatOptions;
      const getStatOptsAndCb = (options, callback) =>
        typeof options === "function"
          ? [(0, exports.getStatOptions)(), options]
          : [
              (0, exports.getStatOptions)(options),
              (0, util_1.validateCallback)(callback),
            ];
      exports.getStatOptsAndCb = getStatOptsAndCb;
      const realpathDefaults = exports.optsDefaults;
      exports.getRealpathOptions = optsGenerator(realpathDefaults);
      exports.getRealpathOptsAndCb = optsAndCbGenerator(
        exports.getRealpathOptions,
      );
      exports.writeFileDefaults = {
        encoding: "utf8",
        mode: 438,
        flag: constants_1.FLAGS[constants_1.FLAGS.w],
      };
      exports.getWriteFileOptions = optsGenerator(exports.writeFileDefaults);
    },
    9483: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.unixify =
        exports.getWriteSyncArgs =
        exports.getWriteArgs =
        exports.bufToUint8 =
        exports.isWin =
          void 0;
      exports.promisify = promisify;
      exports.validateCallback = validateCallback;
      exports.modeToNumber = modeToNumber;
      exports.nullCheck = nullCheck;
      exports.pathToFilename = pathToFilename;
      exports.createError = createError;
      exports.genRndStr6 = genRndStr6;
      exports.flagsToNumber = flagsToNumber;
      exports.isFd = isFd;
      exports.validateFd = validateFd;
      exports.streamToBuffer = streamToBuffer;
      exports.dataToBuffer = dataToBuffer;
      exports.bufferToEncoding = bufferToEncoding;
      exports.isReadableStream = isReadableStream;
      const constants_1 = __nccwpck_require__(7718);
      const errors = __nccwpck_require__(4583);
      const buffer_1 = __nccwpck_require__(3330);
      const encoding_1 = __nccwpck_require__(7721);
      const buffer_2 = __nccwpck_require__(3330);
      const queueMicrotask_1 = __nccwpck_require__(676);
      exports.isWin = process.platform === "win32";
      function promisify(fs, fn, getResult = (input) => input) {
        return (...args) =>
          new Promise((resolve, reject) => {
            fs[fn].bind(fs)(...args, (error, result) => {
              if (error) return reject(error);
              return resolve(getResult(result));
            });
          });
      }
      function validateCallback(callback) {
        if (typeof callback !== "function")
          throw TypeError(constants_1.ERRSTR.CB);
        return callback;
      }
      function _modeToNumber(mode, def) {
        if (typeof mode === "number") return mode;
        if (typeof mode === "string") return parseInt(mode, 8);
        if (def) return modeToNumber(def);
        return undefined;
      }
      function modeToNumber(mode, def) {
        const result = _modeToNumber(mode, def);
        if (typeof result !== "number" || isNaN(result))
          throw new TypeError(constants_1.ERRSTR.MODE_INT);
        return result;
      }
      function nullCheck(path, callback) {
        if (("" + path).indexOf("\0") !== -1) {
          const er = new Error("Path must be a string without null bytes");
          er.code = "ENOENT";
          if (typeof callback !== "function") throw er;
          (0, queueMicrotask_1.default)(() => {
            callback(er);
          });
          return false;
        }
        return true;
      }
      function getPathFromURLPosix(url) {
        if (url.hostname !== "") {
          throw new errors.TypeError(
            "ERR_INVALID_FILE_URL_HOST",
            process.platform,
          );
        }
        const pathname = url.pathname;
        for (let n = 0; n < pathname.length; n++) {
          if (pathname[n] === "%") {
            const third = pathname.codePointAt(n + 2) | 32;
            if (pathname[n + 1] === "2" && third === 102) {
              throw new errors.TypeError(
                "ERR_INVALID_FILE_URL_PATH",
                "must not include encoded / characters",
              );
            }
          }
        }
        return decodeURIComponent(pathname);
      }
      function pathToFilename(path) {
        if (path instanceof Uint8Array) {
          path = (0, buffer_2.bufferFrom)(path);
        }
        if (typeof path !== "string" && !buffer_1.Buffer.isBuffer(path)) {
          try {
            if (!(path instanceof __nccwpck_require__(7016).URL))
              throw new TypeError(constants_1.ERRSTR.PATH_STR);
          } catch (err) {
            throw new TypeError(constants_1.ERRSTR.PATH_STR);
          }
          path = getPathFromURLPosix(path);
        }
        const pathString = String(path);
        nullCheck(pathString);
        return pathString;
      }
      const ENOENT = "ENOENT";
      const EBADF = "EBADF";
      const EINVAL = "EINVAL";
      const EPERM = "EPERM";
      const EPROTO = "EPROTO";
      const EEXIST = "EEXIST";
      const ENOTDIR = "ENOTDIR";
      const EMFILE = "EMFILE";
      const EACCES = "EACCES";
      const EISDIR = "EISDIR";
      const ENOTEMPTY = "ENOTEMPTY";
      const ENOSYS = "ENOSYS";
      const ERR_FS_EISDIR = "ERR_FS_EISDIR";
      const ERR_OUT_OF_RANGE = "ERR_OUT_OF_RANGE";
      function formatError(errorCode, func = "", path = "", path2 = "") {
        let pathFormatted = "";
        if (path) pathFormatted = ` '${path}'`;
        if (path2) pathFormatted += ` -> '${path2}'`;
        switch (errorCode) {
          case ENOENT:
            return `ENOENT: no such file or directory, ${func}${pathFormatted}`;
          case EBADF:
            return `EBADF: bad file descriptor, ${func}${pathFormatted}`;
          case EINVAL:
            return `EINVAL: invalid argument, ${func}${pathFormatted}`;
          case EPERM:
            return `EPERM: operation not permitted, ${func}${pathFormatted}`;
          case EPROTO:
            return `EPROTO: protocol error, ${func}${pathFormatted}`;
          case EEXIST:
            return `EEXIST: file already exists, ${func}${pathFormatted}`;
          case ENOTDIR:
            return `ENOTDIR: not a directory, ${func}${pathFormatted}`;
          case EISDIR:
            return `EISDIR: illegal operation on a directory, ${func}${pathFormatted}`;
          case EACCES:
            return `EACCES: permission denied, ${func}${pathFormatted}`;
          case ENOTEMPTY:
            return `ENOTEMPTY: directory not empty, ${func}${pathFormatted}`;
          case EMFILE:
            return `EMFILE: too many open files, ${func}${pathFormatted}`;
          case ENOSYS:
            return `ENOSYS: function not implemented, ${func}${pathFormatted}`;
          case ERR_FS_EISDIR:
            return `[ERR_FS_EISDIR]: Path is a directory: ${func} returned EISDIR (is a directory) ${path}`;
          case ERR_OUT_OF_RANGE:
            return `[ERR_OUT_OF_RANGE]: value out of range, ${func}${pathFormatted}`;
          default:
            return `${errorCode}: error occurred, ${func}${pathFormatted}`;
        }
      }
      function createError(
        errorCode,
        func = "",
        path = "",
        path2 = "",
        Constructor = Error,
      ) {
        const error = new Constructor(
          formatError(errorCode, func, path, path2),
        );
        error.code = errorCode;
        if (path) {
          error.path = path;
        }
        return error;
      }
      function genRndStr6() {
        const str = (Math.random() + 1).toString(36).substring(2, 8);
        if (str.length === 6) return str;
        else return genRndStr6();
      }
      function flagsToNumber(flags) {
        if (typeof flags === "number") return flags;
        if (typeof flags === "string") {
          const flagsNum = constants_1.FLAGS[flags];
          if (typeof flagsNum !== "undefined") return flagsNum;
        }
        throw new errors.TypeError("ERR_INVALID_OPT_VALUE", "flags", flags);
      }
      function isFd(path) {
        return path >>> 0 === path;
      }
      function validateFd(fd) {
        if (!isFd(fd)) throw TypeError(constants_1.ERRSTR.FD);
      }
      function streamToBuffer(stream) {
        const chunks = [];
        return new Promise((resolve, reject) => {
          stream.on("data", (chunk) => chunks.push(chunk));
          stream.on("end", () => resolve(buffer_1.Buffer.concat(chunks)));
          stream.on("error", reject);
        });
      }
      function dataToBuffer(data, encoding = encoding_1.ENCODING_UTF8) {
        if (buffer_1.Buffer.isBuffer(data)) return data;
        else if (data instanceof Uint8Array)
          return (0, buffer_2.bufferFrom)(data);
        else return (0, buffer_2.bufferFrom)(String(data), encoding);
      }
      const bufToUint8 = (buf) =>
        new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
      exports.bufToUint8 = bufToUint8;
      const getWriteArgs = (fd, a, b, c, d, e) => {
        validateFd(fd);
        let offset = 0;
        let length;
        let position = null;
        let encoding;
        let callback;
        const tipa = typeof a;
        const tipb = typeof b;
        const tipc = typeof c;
        const tipd = typeof d;
        if (tipa !== "string") {
          if (tipb === "function") {
            callback = b;
          } else if (tipc === "function") {
            offset = b | 0;
            callback = c;
          } else if (tipd === "function") {
            offset = b | 0;
            length = c;
            callback = d;
          } else {
            offset = b | 0;
            length = c;
            position = d;
            callback = e;
          }
        } else {
          if (tipb === "function") {
            callback = b;
          } else if (tipc === "function") {
            position = b;
            callback = c;
          } else if (tipd === "function") {
            position = b;
            encoding = c;
            callback = d;
          }
        }
        const buf = dataToBuffer(a, encoding);
        if (tipa !== "string") {
          if (typeof length === "undefined") length = buf.length;
        } else {
          offset = 0;
          length = buf.length;
        }
        const cb = validateCallback(callback);
        return [fd, tipa === "string", buf, offset, length, position, cb];
      };
      exports.getWriteArgs = getWriteArgs;
      const getWriteSyncArgs = (fd, a, b, c, d) => {
        validateFd(fd);
        let encoding;
        let offset;
        let length;
        let position;
        const isBuffer = typeof a !== "string";
        if (isBuffer) {
          offset = (b || 0) | 0;
          length = c;
          position = d;
        } else {
          position = b;
          encoding = c;
        }
        const buf = dataToBuffer(a, encoding);
        if (isBuffer) {
          if (typeof length === "undefined") {
            length = buf.length;
          }
        } else {
          offset = 0;
          length = buf.length;
        }
        return [fd, buf, offset || 0, length, position];
      };
      exports.getWriteSyncArgs = getWriteSyncArgs;
      function bufferToEncoding(buffer, encoding) {
        if (!encoding || encoding === "buffer") return buffer;
        else return buffer.toString(encoding);
      }
      function isReadableStream(stream) {
        return (
          stream !== null &&
          typeof stream === "object" &&
          typeof stream.pipe === "function" &&
          typeof stream.on === "function" &&
          stream.readable === true
        );
      }
      const isSeparator = (str, i) => {
        let char = str[i];
        return i > 0 && (char === "/" || (exports.isWin && char === "\\"));
      };
      const removeTrailingSeparator = (str) => {
        let i = str.length - 1;
        if (i < 2) return str;
        while (isSeparator(str, i)) i--;
        return str.substr(0, i + 1);
      };
      const normalizePath = (str, stripTrailing) => {
        if (typeof str !== "string") throw new TypeError("expected a string");
        str = str.replace(/[\\\/]+/g, "/");
        if (stripTrailing !== false) str = removeTrailingSeparator(str);
        return str;
      };
      const unixify = (filepath, stripTrailing = true) => {
        if (exports.isWin) {
          filepath = normalizePath(filepath, stripTrailing);
          return filepath.replace(/^([a-zA-Z]+:|\.\/)/, "");
        }
        return filepath;
      };
      exports.unixify = unixify;
    },
    802: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.toTreeSync = void 0;
      const tree_dump_1 = __nccwpck_require__(1821);
      const util_1 = __nccwpck_require__(6934);
      const toTreeSync = (fs, opts = {}) => {
        var _a;
        const separator = opts.separator || "/";
        let dir = opts.dir || separator;
        if (dir[dir.length - 1] !== separator) dir += separator;
        const tab = opts.tab || "";
        const depth = (_a = opts.depth) !== null && _a !== void 0 ? _a : 10;
        let subtree = " (...)";
        if (depth > 0) {
          const list = fs.readdirSync(dir, { withFileTypes: true });
          subtree = (0, tree_dump_1.printTree)(
            tab,
            list.map((entry) => (tab) => {
              if (entry.isDirectory()) {
                return (0, exports.toTreeSync)(fs, {
                  dir: dir + entry.name,
                  depth: depth - 1,
                  tab,
                });
              } else if (entry.isSymbolicLink()) {
                return (
                  "" + entry.name + " → " + fs.readlinkSync(dir + entry.name)
                );
              } else {
                return "" + entry.name;
              }
            }),
          );
        }
        const base = (0, util_1.basename)(dir, separator) + separator;
        return base + subtree;
      };
      exports.toTreeSync = toTreeSync;
    },
    4507: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.createProcess = createProcess;
      const maybeReturnProcess = () => {
        if (typeof process !== "undefined") {
          return process;
        }
        try {
          return __nccwpck_require__(932);
        } catch (_a) {
          return undefined;
        }
      };
      function createProcess() {
        const p = maybeReturnProcess() || {};
        if (!p.cwd) p.cwd = () => "/";
        if (!p.emitWarning)
          p.emitWarning = (message, type) => {
            console.warn(`${type}${type ? ": " : ""}${message}`);
          };
        if (!p.env) p.env = {};
        return p;
      }
      exports["default"] = createProcess();
    },
    676: (__unused_webpack_module, exports) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports["default"] =
        typeof queueMicrotask === "function"
          ? queueMicrotask
          : (cb) =>
              Promise.resolve()
                .then(() => cb())
                .catch(() => {});
    },
    6285: (__unused_webpack_module, exports) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      let _setImmediate;
      if (typeof setImmediate === "function")
        _setImmediate = setImmediate.bind(
          typeof globalThis !== "undefined" ? globalThis : global,
        );
      else
        _setImmediate = setTimeout.bind(
          typeof globalThis !== "undefined" ? globalThis : global,
        );
      exports["default"] = _setImmediate;
    },
    1523: (__unused_webpack_module, exports) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      function setTimeoutUnref(callback, time, args) {
        const ref = setTimeout.apply(
          typeof globalThis !== "undefined" ? globalThis : global,
          arguments,
        );
        if (ref && typeof ref === "object" && typeof ref.unref === "function")
          ref.unref();
        return ref;
      }
      exports["default"] = setTimeoutUnref;
    },
    7682: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.FSWatcher = exports.StatWatcher = exports.Volume = void 0;
      exports.filenameToSteps = filenameToSteps;
      exports.pathToSteps = pathToSteps;
      exports.dataToStr = dataToStr;
      exports.toUnixTimestamp = toUnixTimestamp;
      const pathModule = __nccwpck_require__(6928);
      const node_1 = __nccwpck_require__(540);
      const Stats_1 = __nccwpck_require__(845);
      const Dirent_1 = __nccwpck_require__(6912);
      const buffer_1 = __nccwpck_require__(3330);
      const setImmediate_1 = __nccwpck_require__(6285);
      const queueMicrotask_1 = __nccwpck_require__(676);
      const process_1 = __nccwpck_require__(4507);
      const setTimeoutUnref_1 = __nccwpck_require__(1523);
      const stream_1 = __nccwpck_require__(2203);
      const constants_1 = __nccwpck_require__(1895);
      const events_1 = __nccwpck_require__(4434);
      const encoding_1 = __nccwpck_require__(7721);
      const FileHandle_1 = __nccwpck_require__(2407);
      const util = __nccwpck_require__(9023);
      const FsPromises_1 = __nccwpck_require__(5890);
      const print_1 = __nccwpck_require__(802);
      const constants_2 = __nccwpck_require__(7718);
      const options_1 = __nccwpck_require__(1473);
      const util_1 = __nccwpck_require__(9483);
      const Dir_1 = __nccwpck_require__(4297);
      const resolveCrossPlatform = pathModule.resolve;
      const {
        O_RDONLY,
        O_WRONLY,
        O_RDWR,
        O_CREAT,
        O_EXCL,
        O_TRUNC,
        O_APPEND,
        O_DIRECTORY,
        O_SYMLINK,
        F_OK,
        COPYFILE_EXCL,
        COPYFILE_FICLONE_FORCE,
      } = constants_1.constants;
      const { sep, relative, join, dirname } = pathModule.posix
        ? pathModule.posix
        : pathModule;
      const kMinPoolSpace = 128;
      const EPERM = "EPERM";
      const ENOENT = "ENOENT";
      const EBADF = "EBADF";
      const EINVAL = "EINVAL";
      const EEXIST = "EEXIST";
      const ENOTDIR = "ENOTDIR";
      const EMFILE = "EMFILE";
      const EACCES = "EACCES";
      const EISDIR = "EISDIR";
      const ENOTEMPTY = "ENOTEMPTY";
      const ENOSYS = "ENOSYS";
      const ERR_FS_EISDIR = "ERR_FS_EISDIR";
      const ERR_OUT_OF_RANGE = "ERR_OUT_OF_RANGE";
      let resolve = (filename, base = process_1.default.cwd()) =>
        resolveCrossPlatform(base, filename);
      if (util_1.isWin) {
        const _resolve = resolve;
        resolve = (filename, base) =>
          (0, util_1.unixify)(_resolve(filename, base));
      }
      function filenameToSteps(filename, base) {
        const fullPath = resolve(filename, base);
        const fullPathSansSlash = fullPath.substring(1);
        if (!fullPathSansSlash) return [];
        return fullPathSansSlash.split(sep);
      }
      function pathToSteps(path) {
        return filenameToSteps((0, util_1.pathToFilename)(path));
      }
      function dataToStr(data, encoding = encoding_1.ENCODING_UTF8) {
        if (buffer_1.Buffer.isBuffer(data)) return data.toString(encoding);
        else if (data instanceof Uint8Array)
          return (0, buffer_1.bufferFrom)(data).toString(encoding);
        else return String(data);
      }
      function toUnixTimestamp(time) {
        if (typeof time === "string" && +time == time) {
          return +time;
        }
        if (time instanceof Date) {
          return time.getTime() / 1e3;
        }
        if (isFinite(time)) {
          if (time < 0) {
            return Date.now() / 1e3;
          }
          return time;
        }
        throw new Error("Cannot parse time: " + time);
      }
      function validateUid(uid) {
        if (typeof uid !== "number") throw TypeError(constants_2.ERRSTR.UID);
      }
      function validateGid(gid) {
        if (typeof gid !== "number") throw TypeError(constants_2.ERRSTR.GID);
      }
      function flattenJSON(nestedJSON) {
        const flatJSON = {};
        function flatten(pathPrefix, node) {
          for (const path in node) {
            const contentOrNode = node[path];
            const joinedPath = join(pathPrefix, path);
            if (
              typeof contentOrNode === "string" ||
              contentOrNode instanceof buffer_1.Buffer
            ) {
              flatJSON[joinedPath] = contentOrNode;
            } else if (
              typeof contentOrNode === "object" &&
              contentOrNode !== null &&
              Object.keys(contentOrNode).length > 0
            ) {
              flatten(joinedPath, contentOrNode);
            } else {
              flatJSON[joinedPath] = null;
            }
          }
        }
        flatten("", nestedJSON);
        return flatJSON;
      }
      const notImplemented = () => {
        throw new Error("Not implemented");
      };
      class Volume {
        static fromJSON(json, cwd) {
          const vol = new Volume();
          vol.fromJSON(json, cwd);
          return vol;
        }
        static fromNestedJSON(json, cwd) {
          const vol = new Volume();
          vol.fromNestedJSON(json, cwd);
          return vol;
        }
        get promises() {
          if (this.promisesApi === null)
            throw new Error("Promise is not supported in this environment.");
          return this.promisesApi;
        }
        constructor(props = {}) {
          this.ino = 0;
          this.inodes = {};
          this.releasedInos = [];
          this.fds = {};
          this.releasedFds = [];
          this.maxFiles = 1e4;
          this.openFiles = 0;
          this.promisesApi = new FsPromises_1.FsPromises(
            this,
            FileHandle_1.FileHandle,
          );
          this.statWatchers = {};
          this.cpSync = notImplemented;
          this.statfsSync = notImplemented;
          this.cp = notImplemented;
          this.statfs = notImplemented;
          this.openAsBlob = notImplemented;
          this.props = Object.assign(
            { Node: node_1.Node, Link: node_1.Link, File: node_1.File },
            props,
          );
          const root = this.createLink();
          root.setNode(this.createNode(constants_1.constants.S_IFDIR | 511));
          const self = this;
          this.StatWatcher = class extends StatWatcher {
            constructor() {
              super(self);
            }
          };
          const _ReadStream = FsReadStream;
          this.ReadStream = class extends _ReadStream {
            constructor(...args) {
              super(self, ...args);
            }
          };
          const _WriteStream = FsWriteStream;
          this.WriteStream = class extends _WriteStream {
            constructor(...args) {
              super(self, ...args);
            }
          };
          this.FSWatcher = class extends FSWatcher {
            constructor() {
              super(self);
            }
          };
          root.setChild(".", root);
          root.getNode().nlink++;
          root.setChild("..", root);
          root.getNode().nlink++;
          this.root = root;
        }
        createLink(parent, name, isDirectory = false, mode) {
          if (!parent) {
            return new this.props.Link(this, null, "");
          }
          if (!name) {
            throw new Error("createLink: name cannot be empty");
          }
          const finalPerm =
            mode !== null && mode !== void 0 ? mode : isDirectory ? 511 : 438;
          const hasFileType = mode && mode & constants_1.constants.S_IFMT;
          const modeType = hasFileType
            ? mode & constants_1.constants.S_IFMT
            : isDirectory
              ? constants_1.constants.S_IFDIR
              : constants_1.constants.S_IFREG;
          const finalMode =
            (finalPerm & ~constants_1.constants.S_IFMT) | modeType;
          return parent.createChild(name, this.createNode(finalMode));
        }
        deleteLink(link) {
          const parent = link.parent;
          if (parent) {
            parent.deleteChild(link);
            return true;
          }
          return false;
        }
        newInoNumber() {
          const releasedFd = this.releasedInos.pop();
          if (releasedFd) return releasedFd;
          else {
            this.ino = (this.ino + 1) % 4294967295;
            return this.ino;
          }
        }
        newFdNumber() {
          const releasedFd = this.releasedFds.pop();
          return typeof releasedFd === "number" ? releasedFd : Volume.fd--;
        }
        createNode(mode) {
          const node = new this.props.Node(this.newInoNumber(), mode);
          this.inodes[node.ino] = node;
          return node;
        }
        deleteNode(node) {
          node.del();
          delete this.inodes[node.ino];
          this.releasedInos.push(node.ino);
        }
        walk(
          stepsOrFilenameOrLink,
          resolveSymlinks = false,
          checkExistence = false,
          checkAccess = false,
          funcName,
        ) {
          var _a;
          let steps;
          let filename;
          if (stepsOrFilenameOrLink instanceof node_1.Link) {
            steps = stepsOrFilenameOrLink.steps;
            filename = sep + steps.join(sep);
          } else if (typeof stepsOrFilenameOrLink === "string") {
            steps = filenameToSteps(stepsOrFilenameOrLink);
            filename = stepsOrFilenameOrLink;
          } else {
            steps = stepsOrFilenameOrLink;
            filename = sep + steps.join(sep);
          }
          let curr = this.root;
          let i = 0;
          while (i < steps.length) {
            let node = curr.getNode();
            if (node.isDirectory()) {
              if (checkAccess && !node.canExecute()) {
                throw (0, util_1.createError)(EACCES, funcName, filename);
              }
            } else {
              if (i < steps.length - 1)
                throw (0, util_1.createError)(ENOTDIR, funcName, filename);
            }
            curr =
              (_a = curr.getChild(steps[i])) !== null && _a !== void 0
                ? _a
                : null;
            if (!curr)
              if (checkExistence)
                throw (0, util_1.createError)(ENOENT, funcName, filename);
              else return null;
            node = curr === null || curr === void 0 ? void 0 : curr.getNode();
            if (resolveSymlinks && node.isSymlink()) {
              const resolvedPath = pathModule.isAbsolute(node.symlink)
                ? node.symlink
                : join(pathModule.dirname(curr.getPath()), node.symlink);
              steps = filenameToSteps(resolvedPath).concat(steps.slice(i + 1));
              curr = this.root;
              i = 0;
              continue;
            }
            i++;
          }
          return curr;
        }
        getLink(steps) {
          return this.walk(steps, false, false, false);
        }
        getLinkOrThrow(filename, funcName) {
          return this.walk(filename, false, true, true, funcName);
        }
        getResolvedLink(filenameOrSteps) {
          return this.walk(filenameOrSteps, true, false, false);
        }
        getResolvedLinkOrThrow(filename, funcName) {
          return this.walk(filename, true, true, true, funcName);
        }
        resolveSymlinks(link) {
          return this.getResolvedLink(link.steps.slice(1));
        }
        getLinkAsDirOrThrow(filename, funcName) {
          const link = this.getLinkOrThrow(filename, funcName);
          if (!link.getNode().isDirectory())
            throw (0, util_1.createError)(ENOTDIR, funcName, filename);
          return link;
        }
        getLinkParent(steps) {
          return this.getLink(steps.slice(0, -1));
        }
        getLinkParentAsDirOrThrow(filenameOrSteps, funcName) {
          const steps = (
            filenameOrSteps instanceof Array
              ? filenameOrSteps
              : filenameToSteps(filenameOrSteps)
          ).slice(0, -1);
          const filename = sep + steps.join(sep);
          const link = this.getLinkOrThrow(filename, funcName);
          if (!link.getNode().isDirectory())
            throw (0, util_1.createError)(ENOTDIR, funcName, filename);
          return link;
        }
        getFileByFd(fd) {
          return this.fds[String(fd)];
        }
        getFileByFdOrThrow(fd, funcName) {
          if (!(0, util_1.isFd)(fd)) throw TypeError(constants_2.ERRSTR.FD);
          const file = this.getFileByFd(fd);
          if (!file) throw (0, util_1.createError)(EBADF, funcName);
          return file;
        }
        wrapAsync(method, args, callback) {
          (0, util_1.validateCallback)(callback);
          (0, setImmediate_1.default)(() => {
            let result;
            try {
              result = method.apply(this, args);
            } catch (err) {
              callback(err);
              return;
            }
            callback(null, result);
          });
        }
        _toJSON(link = this.root, json = {}, path, asBuffer) {
          let isEmpty = true;
          let children = link.children;
          if (link.getNode().isFile()) {
            children = new Map([
              [link.getName(), link.parent.getChild(link.getName())],
            ]);
            link = link.parent;
          }
          for (const name of children.keys()) {
            if (name === "." || name === "..") {
              continue;
            }
            isEmpty = false;
            const child = link.getChild(name);
            if (!child) {
              throw new Error("_toJSON: unexpected undefined");
            }
            const node = child.getNode();
            if (node.isFile()) {
              let filename = child.getPath();
              if (path) filename = relative(path, filename);
              json[filename] = asBuffer ? node.getBuffer() : node.getString();
            } else if (node.isDirectory()) {
              this._toJSON(child, json, path, asBuffer);
            }
          }
          let dirPath = link.getPath();
          if (path) dirPath = relative(path, dirPath);
          if (dirPath && isEmpty) {
            json[dirPath] = null;
          }
          return json;
        }
        toJSON(paths, json = {}, isRelative = false, asBuffer = false) {
          const links = [];
          if (paths) {
            if (!Array.isArray(paths)) paths = [paths];
            for (const path of paths) {
              const filename = (0, util_1.pathToFilename)(path);
              const link = this.getResolvedLink(filename);
              if (!link) continue;
              links.push(link);
            }
          } else {
            links.push(this.root);
          }
          if (!links.length) return json;
          for (const link of links)
            this._toJSON(
              link,
              json,
              isRelative ? link.getPath() : "",
              asBuffer,
            );
          return json;
        }
        fromJSON(json, cwd = process_1.default.cwd()) {
          for (let filename in json) {
            const data = json[filename];
            filename = resolve(filename, cwd);
            if (typeof data === "string" || data instanceof buffer_1.Buffer) {
              const dir = dirname(filename);
              this.mkdirpBase(dir, 511);
              this.writeFileSync(filename, data);
            } else {
              this.mkdirpBase(filename, 511);
            }
          }
        }
        fromNestedJSON(json, cwd) {
          this.fromJSON(flattenJSON(json), cwd);
        }
        toTree(opts = { separator: sep }) {
          return (0, print_1.toTreeSync)(this, opts);
        }
        reset() {
          this.ino = 0;
          this.inodes = {};
          this.releasedInos = [];
          this.fds = {};
          this.releasedFds = [];
          this.openFiles = 0;
          this.root = this.createLink();
          this.root.setNode(
            this.createNode(constants_1.constants.S_IFDIR | 511),
          );
        }
        mountSync(mountpoint, json) {
          this.fromJSON(json, mountpoint);
        }
        openLink(link, flagsNum, resolveSymlinks = true) {
          if (this.openFiles >= this.maxFiles) {
            throw (0, util_1.createError)(EMFILE, "open", link.getPath());
          }
          let realLink = link;
          if (resolveSymlinks)
            realLink = this.getResolvedLinkOrThrow(link.getPath(), "open");
          const node = realLink.getNode();
          if (node.isDirectory()) {
            if ((flagsNum & (O_RDONLY | O_RDWR | O_WRONLY)) !== O_RDONLY)
              throw (0, util_1.createError)(EISDIR, "open", link.getPath());
          } else {
            if (flagsNum & O_DIRECTORY)
              throw (0, util_1.createError)(ENOTDIR, "open", link.getPath());
          }
          if (!(flagsNum & O_WRONLY)) {
            if (!node.canRead()) {
              throw (0, util_1.createError)(EACCES, "open", link.getPath());
            }
          }
          if (!(flagsNum & O_RDONLY)) {
            if (!node.canWrite()) {
              throw (0, util_1.createError)(EACCES, "open", link.getPath());
            }
          }
          const file = new this.props.File(
            link,
            node,
            flagsNum,
            this.newFdNumber(),
          );
          this.fds[file.fd] = file;
          this.openFiles++;
          if (flagsNum & O_TRUNC) file.truncate();
          return file;
        }
        openFile(filename, flagsNum, modeNum, resolveSymlinks = true) {
          const steps = filenameToSteps(filename);
          let link;
          try {
            link = resolveSymlinks
              ? this.getResolvedLinkOrThrow(filename, "open")
              : this.getLinkOrThrow(filename, "open");
            if (link && flagsNum & O_CREAT && flagsNum & O_EXCL)
              throw (0, util_1.createError)(EEXIST, "open", filename);
          } catch (err) {
            if (err.code === ENOENT && flagsNum & O_CREAT) {
              const dirname = pathModule.dirname(filename);
              const dirLink = this.getResolvedLinkOrThrow(dirname);
              const dirNode = dirLink.getNode();
              if (!dirNode.isDirectory())
                throw (0, util_1.createError)(ENOTDIR, "open", filename);
              if (!dirNode.canExecute() || !dirNode.canWrite())
                throw (0, util_1.createError)(EACCES, "open", filename);
              modeNum !== null && modeNum !== void 0
                ? modeNum
                : (modeNum = 438);
              link = this.createLink(
                dirLink,
                steps[steps.length - 1],
                false,
                modeNum,
              );
            } else throw err;
          }
          if (link) return this.openLink(link, flagsNum, resolveSymlinks);
          throw (0, util_1.createError)(ENOENT, "open", filename);
        }
        openBase(filename, flagsNum, modeNum, resolveSymlinks = true) {
          const file = this.openFile(
            filename,
            flagsNum,
            modeNum,
            resolveSymlinks,
          );
          if (!file) throw (0, util_1.createError)(ENOENT, "open", filename);
          return file.fd;
        }
        openSync(path, flags, mode = 438) {
          const modeNum = (0, util_1.modeToNumber)(mode);
          const fileName = (0, util_1.pathToFilename)(path);
          const flagsNum = (0, util_1.flagsToNumber)(flags);
          return this.openBase(
            fileName,
            flagsNum,
            modeNum,
            !(flagsNum & O_SYMLINK),
          );
        }
        open(path, flags, a, b) {
          let mode = a;
          let callback = b;
          if (typeof a === "function") {
            mode = 438;
            callback = a;
          }
          mode = mode || 438;
          const modeNum = (0, util_1.modeToNumber)(mode);
          const fileName = (0, util_1.pathToFilename)(path);
          const flagsNum = (0, util_1.flagsToNumber)(flags);
          this.wrapAsync(
            this.openBase,
            [fileName, flagsNum, modeNum, !(flagsNum & O_SYMLINK)],
            callback,
          );
        }
        closeFile(file) {
          if (!this.fds[file.fd]) return;
          this.openFiles--;
          delete this.fds[file.fd];
          this.releasedFds.push(file.fd);
        }
        closeSync(fd) {
          (0, util_1.validateFd)(fd);
          const file = this.getFileByFdOrThrow(fd, "close");
          this.closeFile(file);
        }
        close(fd, callback) {
          (0, util_1.validateFd)(fd);
          const file = this.getFileByFdOrThrow(fd, "close");
          this.wrapAsync(this.closeFile, [file], callback);
        }
        openFileOrGetById(id, flagsNum, modeNum) {
          if (typeof id === "number") {
            const file = this.fds[id];
            if (!file) throw (0, util_1.createError)(ENOENT);
            return file;
          } else {
            return this.openFile(
              (0, util_1.pathToFilename)(id),
              flagsNum,
              modeNum,
            );
          }
        }
        readBase(fd, buffer, offset, length, position) {
          if (buffer.byteLength < length) {
            throw (0, util_1.createError)(
              ERR_OUT_OF_RANGE,
              "read",
              undefined,
              undefined,
              RangeError,
            );
          }
          const file = this.getFileByFdOrThrow(fd);
          if (file.node.isSymlink()) {
            throw (0, util_1.createError)(EPERM, "read", file.link.getPath());
          }
          return file.read(
            buffer,
            Number(offset),
            Number(length),
            position === -1 || typeof position !== "number"
              ? undefined
              : position,
          );
        }
        readSync(fd, buffer, offset, length, position) {
          (0, util_1.validateFd)(fd);
          return this.readBase(fd, buffer, offset, length, position);
        }
        read(fd, buffer, offset, length, position, callback) {
          (0, util_1.validateCallback)(callback);
          if (length === 0) {
            return (0, queueMicrotask_1.default)(() => {
              if (callback) callback(null, 0, buffer);
            });
          }
          (0, setImmediate_1.default)(() => {
            try {
              const bytes = this.readBase(fd, buffer, offset, length, position);
              callback(null, bytes, buffer);
            } catch (err) {
              callback(err);
            }
          });
        }
        readvBase(fd, buffers, position) {
          const file = this.getFileByFdOrThrow(fd);
          let p =
            position !== null && position !== void 0 ? position : undefined;
          if (p === -1) {
            p = undefined;
          }
          let bytesRead = 0;
          for (const buffer of buffers) {
            const bytes = file.read(buffer, 0, buffer.byteLength, p);
            p = undefined;
            bytesRead += bytes;
            if (bytes < buffer.byteLength) break;
          }
          return bytesRead;
        }
        readv(fd, buffers, a, b) {
          let position = a;
          let callback = b;
          if (typeof a === "function") {
            position = null;
            callback = a;
          }
          (0, util_1.validateCallback)(callback);
          (0, setImmediate_1.default)(() => {
            try {
              const bytes = this.readvBase(fd, buffers, position);
              callback(null, bytes, buffers);
            } catch (err) {
              callback(err);
            }
          });
        }
        readvSync(fd, buffers, position) {
          (0, util_1.validateFd)(fd);
          return this.readvBase(fd, buffers, position);
        }
        readFileBase(id, flagsNum, encoding) {
          let result;
          const isUserFd = typeof id === "number";
          const userOwnsFd = isUserFd && (0, util_1.isFd)(id);
          let fd;
          if (userOwnsFd) fd = id;
          else {
            const filename = (0, util_1.pathToFilename)(id);
            const link = this.getResolvedLinkOrThrow(filename, "open");
            const node = link.getNode();
            if (node.isDirectory())
              throw (0, util_1.createError)(EISDIR, "open", link.getPath());
            fd = this.openSync(id, flagsNum);
          }
          try {
            result = (0, util_1.bufferToEncoding)(
              this.getFileByFdOrThrow(fd).getBuffer(),
              encoding,
            );
          } finally {
            if (!userOwnsFd) {
              this.closeSync(fd);
            }
          }
          return result;
        }
        readFileSync(file, options) {
          const opts = (0, options_1.getReadFileOptions)(options);
          const flagsNum = (0, util_1.flagsToNumber)(opts.flag);
          return this.readFileBase(file, flagsNum, opts.encoding);
        }
        readFile(id, a, b) {
          const [opts, callback] = (0, options_1.optsAndCbGenerator)(
            options_1.getReadFileOptions,
          )(a, b);
          const flagsNum = (0, util_1.flagsToNumber)(opts.flag);
          this.wrapAsync(
            this.readFileBase,
            [id, flagsNum, opts.encoding],
            callback,
          );
        }
        writeBase(fd, buf, offset, length, position) {
          const file = this.getFileByFdOrThrow(fd, "write");
          if (file.node.isSymlink()) {
            throw (0, util_1.createError)(EBADF, "write", file.link.getPath());
          }
          return file.write(
            buf,
            offset,
            length,
            position === -1 || typeof position !== "number"
              ? undefined
              : position,
          );
        }
        writeSync(fd, a, b, c, d) {
          const [, buf, offset, length, position] = (0,
          util_1.getWriteSyncArgs)(fd, a, b, c, d);
          return this.writeBase(fd, buf, offset, length, position);
        }
        write(fd, a, b, c, d, e) {
          const [, asStr, buf, offset, length, position, cb] = (0,
          util_1.getWriteArgs)(fd, a, b, c, d, e);
          (0, setImmediate_1.default)(() => {
            try {
              const bytes = this.writeBase(fd, buf, offset, length, position);
              if (!asStr) {
                cb(null, bytes, buf);
              } else {
                cb(null, bytes, a);
              }
            } catch (err) {
              cb(err);
            }
          });
        }
        writevBase(fd, buffers, position) {
          const file = this.getFileByFdOrThrow(fd);
          let p =
            position !== null && position !== void 0 ? position : undefined;
          if (p === -1) {
            p = undefined;
          }
          let bytesWritten = 0;
          for (const buffer of buffers) {
            const nodeBuf = buffer_1.Buffer.from(
              buffer.buffer,
              buffer.byteOffset,
              buffer.byteLength,
            );
            const bytes = file.write(nodeBuf, 0, nodeBuf.byteLength, p);
            p = undefined;
            bytesWritten += bytes;
            if (bytes < nodeBuf.byteLength) break;
          }
          return bytesWritten;
        }
        writev(fd, buffers, a, b) {
          let position = a;
          let callback = b;
          if (typeof a === "function") {
            position = null;
            callback = a;
          }
          (0, util_1.validateCallback)(callback);
          (0, setImmediate_1.default)(() => {
            try {
              const bytes = this.writevBase(fd, buffers, position);
              callback(null, bytes, buffers);
            } catch (err) {
              callback(err);
            }
          });
        }
        writevSync(fd, buffers, position) {
          (0, util_1.validateFd)(fd);
          return this.writevBase(fd, buffers, position);
        }
        writeFileBase(id, buf, flagsNum, modeNum) {
          const isUserFd = typeof id === "number";
          let fd;
          if (isUserFd) fd = id;
          else {
            fd = this.openBase(
              (0, util_1.pathToFilename)(id),
              flagsNum,
              modeNum,
            );
          }
          let offset = 0;
          let length = buf.length;
          let position = flagsNum & O_APPEND ? undefined : 0;
          try {
            while (length > 0) {
              const written = this.writeSync(fd, buf, offset, length, position);
              offset += written;
              length -= written;
              if (position !== undefined) position += written;
            }
          } finally {
            if (!isUserFd) this.closeSync(fd);
          }
        }
        writeFileSync(id, data, options) {
          const opts = (0, options_1.getWriteFileOptions)(options);
          const flagsNum = (0, util_1.flagsToNumber)(opts.flag);
          const modeNum = (0, util_1.modeToNumber)(opts.mode);
          const buf = (0, util_1.dataToBuffer)(data, opts.encoding);
          this.writeFileBase(id, buf, flagsNum, modeNum);
        }
        writeFile(id, data, a, b) {
          let options = a;
          let callback = b;
          if (typeof a === "function") {
            options = options_1.writeFileDefaults;
            callback = a;
          }
          const cb = (0, util_1.validateCallback)(callback);
          const opts = (0, options_1.getWriteFileOptions)(options);
          const flagsNum = (0, util_1.flagsToNumber)(opts.flag);
          const modeNum = (0, util_1.modeToNumber)(opts.mode);
          const buf = (0, util_1.dataToBuffer)(data, opts.encoding);
          this.wrapAsync(this.writeFileBase, [id, buf, flagsNum, modeNum], cb);
        }
        linkBase(filename1, filename2) {
          let link1;
          try {
            link1 = this.getLinkOrThrow(filename1, "link");
          } catch (err) {
            if (err.code)
              err = (0, util_1.createError)(
                err.code,
                "link",
                filename1,
                filename2,
              );
            throw err;
          }
          const dirname2 = pathModule.dirname(filename2);
          let dir2;
          try {
            dir2 = this.getLinkOrThrow(dirname2, "link");
          } catch (err) {
            if (err.code)
              err = (0, util_1.createError)(
                err.code,
                "link",
                filename1,
                filename2,
              );
            throw err;
          }
          const name = pathModule.basename(filename2);
          if (dir2.getChild(name))
            throw (0, util_1.createError)(EEXIST, "link", filename1, filename2);
          const node = link1.getNode();
          node.nlink++;
          dir2.createChild(name, node);
        }
        copyFileBase(src, dest, flags) {
          const buf = this.readFileSync(src);
          if (flags & COPYFILE_EXCL) {
            if (this.existsSync(dest)) {
              throw (0, util_1.createError)(EEXIST, "copyFile", src, dest);
            }
          }
          if (flags & COPYFILE_FICLONE_FORCE) {
            throw (0, util_1.createError)(ENOSYS, "copyFile", src, dest);
          }
          this.writeFileBase(dest, buf, constants_2.FLAGS.w, 438);
        }
        copyFileSync(src, dest, flags) {
          const srcFilename = (0, util_1.pathToFilename)(src);
          const destFilename = (0, util_1.pathToFilename)(dest);
          return this.copyFileBase(srcFilename, destFilename, (flags || 0) | 0);
        }
        copyFile(src, dest, a, b) {
          const srcFilename = (0, util_1.pathToFilename)(src);
          const destFilename = (0, util_1.pathToFilename)(dest);
          let flags;
          let callback;
          if (typeof a === "function") {
            flags = 0;
            callback = a;
          } else {
            flags = a;
            callback = b;
          }
          (0, util_1.validateCallback)(callback);
          this.wrapAsync(
            this.copyFileBase,
            [srcFilename, destFilename, flags],
            callback,
          );
        }
        linkSync(existingPath, newPath) {
          const existingPathFilename = (0, util_1.pathToFilename)(existingPath);
          const newPathFilename = (0, util_1.pathToFilename)(newPath);
          this.linkBase(existingPathFilename, newPathFilename);
        }
        link(existingPath, newPath, callback) {
          const existingPathFilename = (0, util_1.pathToFilename)(existingPath);
          const newPathFilename = (0, util_1.pathToFilename)(newPath);
          this.wrapAsync(
            this.linkBase,
            [existingPathFilename, newPathFilename],
            callback,
          );
        }
        unlinkBase(filename) {
          const link = this.getLinkOrThrow(filename, "unlink");
          if (link.length) throw Error("Dir not empty...");
          this.deleteLink(link);
          const node = link.getNode();
          node.nlink--;
          if (node.nlink <= 0) {
            this.deleteNode(node);
          }
        }
        unlinkSync(path) {
          const filename = (0, util_1.pathToFilename)(path);
          this.unlinkBase(filename);
        }
        unlink(path, callback) {
          const filename = (0, util_1.pathToFilename)(path);
          this.wrapAsync(this.unlinkBase, [filename], callback);
        }
        symlinkBase(targetFilename, pathFilename) {
          const pathSteps = filenameToSteps(pathFilename);
          let dirLink;
          try {
            dirLink = this.getLinkParentAsDirOrThrow(pathSteps);
          } catch (err) {
            if (err.code)
              err = (0, util_1.createError)(
                err.code,
                "symlink",
                targetFilename,
                pathFilename,
              );
            throw err;
          }
          const name = pathSteps[pathSteps.length - 1];
          if (dirLink.getChild(name))
            throw (0, util_1.createError)(
              EEXIST,
              "symlink",
              targetFilename,
              pathFilename,
            );
          const node = dirLink.getNode();
          if (!node.canExecute() || !node.canWrite())
            throw (0, util_1.createError)(
              EACCES,
              "symlink",
              targetFilename,
              pathFilename,
            );
          const symlink = dirLink.createChild(name);
          symlink.getNode().makeSymlink(targetFilename);
          return symlink;
        }
        symlinkSync(target, path, type) {
          const targetFilename = (0, util_1.pathToFilename)(target);
          const pathFilename = (0, util_1.pathToFilename)(path);
          this.symlinkBase(targetFilename, pathFilename);
        }
        symlink(target, path, a, b) {
          const callback = (0, util_1.validateCallback)(
            typeof a === "function" ? a : b,
          );
          const targetFilename = (0, util_1.pathToFilename)(target);
          const pathFilename = (0, util_1.pathToFilename)(path);
          this.wrapAsync(
            this.symlinkBase,
            [targetFilename, pathFilename],
            callback,
          );
        }
        realpathBase(filename, encoding) {
          const realLink = this.getResolvedLinkOrThrow(filename, "realpath");
          return (0, encoding_1.strToEncoding)(
            realLink.getPath() || "/",
            encoding,
          );
        }
        realpathSync(path, options) {
          return this.realpathBase(
            (0, util_1.pathToFilename)(path),
            (0, options_1.getRealpathOptions)(options).encoding,
          );
        }
        realpath(path, a, b) {
          const [opts, callback] = (0, options_1.getRealpathOptsAndCb)(a, b);
          const pathFilename = (0, util_1.pathToFilename)(path);
          this.wrapAsync(
            this.realpathBase,
            [pathFilename, opts.encoding],
            callback,
          );
        }
        lstatBase(filename, bigint = false, throwIfNoEntry = false) {
          let link;
          try {
            link = this.getLinkOrThrow(filename, "lstat");
          } catch (err) {
            if (err.code === ENOENT && !throwIfNoEntry) return undefined;
            else throw err;
          }
          return Stats_1.default.build(link.getNode(), bigint);
        }
        lstatSync(path, options) {
          const { throwIfNoEntry = true, bigint = false } = (0,
          options_1.getStatOptions)(options);
          return this.lstatBase(
            (0, util_1.pathToFilename)(path),
            bigint,
            throwIfNoEntry,
          );
        }
        lstat(path, a, b) {
          const [{ throwIfNoEntry = true, bigint = false }, callback] = (0,
          options_1.getStatOptsAndCb)(a, b);
          this.wrapAsync(
            this.lstatBase,
            [(0, util_1.pathToFilename)(path), bigint, throwIfNoEntry],
            callback,
          );
        }
        statBase(filename, bigint = false, throwIfNoEntry = true) {
          let link;
          try {
            link = this.getResolvedLinkOrThrow(filename, "stat");
          } catch (err) {
            if (err.code === ENOENT && !throwIfNoEntry) return undefined;
            else throw err;
          }
          return Stats_1.default.build(link.getNode(), bigint);
        }
        statSync(path, options) {
          const { bigint = true, throwIfNoEntry = true } = (0,
          options_1.getStatOptions)(options);
          return this.statBase(
            (0, util_1.pathToFilename)(path),
            bigint,
            throwIfNoEntry,
          );
        }
        stat(path, a, b) {
          const [{ bigint = false, throwIfNoEntry = true }, callback] = (0,
          options_1.getStatOptsAndCb)(a, b);
          this.wrapAsync(
            this.statBase,
            [(0, util_1.pathToFilename)(path), bigint, throwIfNoEntry],
            callback,
          );
        }
        fstatBase(fd, bigint = false) {
          const file = this.getFileByFd(fd);
          if (!file) throw (0, util_1.createError)(EBADF, "fstat");
          return Stats_1.default.build(file.node, bigint);
        }
        fstatSync(fd, options) {
          return this.fstatBase(
            fd,
            (0, options_1.getStatOptions)(options).bigint,
          );
        }
        fstat(fd, a, b) {
          const [opts, callback] = (0, options_1.getStatOptsAndCb)(a, b);
          this.wrapAsync(this.fstatBase, [fd, opts.bigint], callback);
        }
        renameBase(oldPathFilename, newPathFilename) {
          let link;
          try {
            link = this.getResolvedLinkOrThrow(oldPathFilename);
          } catch (err) {
            if (err.code)
              err = (0, util_1.createError)(
                err.code,
                "rename",
                oldPathFilename,
                newPathFilename,
              );
            throw err;
          }
          let newPathDirLink;
          try {
            newPathDirLink = this.getLinkParentAsDirOrThrow(newPathFilename);
          } catch (err) {
            if (err.code)
              err = (0, util_1.createError)(
                err.code,
                "rename",
                oldPathFilename,
                newPathFilename,
              );
            throw err;
          }
          const oldLinkParent = link.parent;
          const oldParentNode = oldLinkParent.getNode();
          const newPathDirNode = newPathDirLink.getNode();
          if (
            !oldParentNode.canExecute() ||
            !oldParentNode.canWrite() ||
            !newPathDirNode.canExecute() ||
            !newPathDirNode.canWrite()
          ) {
            throw (0, util_1.createError)(
              EACCES,
              "rename",
              oldPathFilename,
              newPathFilename,
            );
          }
          oldLinkParent.deleteChild(link);
          const name = pathModule.basename(newPathFilename);
          link.name = name;
          link.steps = [...newPathDirLink.steps, name];
          newPathDirLink.setChild(link.getName(), link);
        }
        renameSync(oldPath, newPath) {
          const oldPathFilename = (0, util_1.pathToFilename)(oldPath);
          const newPathFilename = (0, util_1.pathToFilename)(newPath);
          this.renameBase(oldPathFilename, newPathFilename);
        }
        rename(oldPath, newPath, callback) {
          const oldPathFilename = (0, util_1.pathToFilename)(oldPath);
          const newPathFilename = (0, util_1.pathToFilename)(newPath);
          this.wrapAsync(
            this.renameBase,
            [oldPathFilename, newPathFilename],
            callback,
          );
        }
        existsBase(filename) {
          return !!this.statBase(filename);
        }
        existsSync(path) {
          try {
            return this.existsBase((0, util_1.pathToFilename)(path));
          } catch (err) {
            return false;
          }
        }
        exists(path, callback) {
          const filename = (0, util_1.pathToFilename)(path);
          if (typeof callback !== "function")
            throw Error(constants_2.ERRSTR.CB);
          (0, setImmediate_1.default)(() => {
            try {
              callback(this.existsBase(filename));
            } catch (err) {
              callback(false);
            }
          });
        }
        accessBase(filename, mode) {
          const link = this.getLinkOrThrow(filename, "access");
        }
        accessSync(path, mode = F_OK) {
          const filename = (0, util_1.pathToFilename)(path);
          mode = mode | 0;
          this.accessBase(filename, mode);
        }
        access(path, a, b) {
          let mode = F_OK;
          let callback;
          if (typeof a !== "function") {
            mode = a | 0;
            callback = (0, util_1.validateCallback)(b);
          } else {
            callback = a;
          }
          const filename = (0, util_1.pathToFilename)(path);
          this.wrapAsync(this.accessBase, [filename, mode], callback);
        }
        appendFileSync(id, data, options) {
          const opts = (0, options_1.getAppendFileOpts)(options);
          if (!opts.flag || (0, util_1.isFd)(id)) opts.flag = "a";
          this.writeFileSync(id, data, opts);
        }
        appendFile(id, data, a, b) {
          const [opts, callback] = (0, options_1.getAppendFileOptsAndCb)(a, b);
          if (!opts.flag || (0, util_1.isFd)(id)) opts.flag = "a";
          this.writeFile(id, data, opts, callback);
        }
        readdirBase(filename, options) {
          const steps = filenameToSteps(filename);
          const link = this.getResolvedLinkOrThrow(filename, "scandir");
          const node = link.getNode();
          if (!node.isDirectory())
            throw (0, util_1.createError)(ENOTDIR, "scandir", filename);
          if (!node.canRead())
            throw (0, util_1.createError)(EACCES, "scandir", filename);
          const list = [];
          for (const name of link.children.keys()) {
            const child = link.getChild(name);
            if (!child || name === "." || name === "..") continue;
            list.push(Dirent_1.default.build(child, options.encoding));
            if (options.recursive && child.children.size) {
              const recurseOptions = Object.assign(Object.assign({}, options), {
                recursive: true,
                withFileTypes: true,
              });
              const childList = this.readdirBase(
                child.getPath(),
                recurseOptions,
              );
              list.push(...childList);
            }
          }
          if (!util_1.isWin && options.encoding !== "buffer")
            list.sort((a, b) => {
              if (a.name < b.name) return -1;
              if (a.name > b.name) return 1;
              return 0;
            });
          if (options.withFileTypes) return list;
          let filename2 = filename;
          if (util_1.isWin) {
            filename2 = filename2.replace(/\\/g, "/");
          }
          return list.map((dirent) => {
            if (options.recursive) {
              let fullPath = pathModule.join(
                dirent.parentPath,
                dirent.name.toString(),
              );
              if (util_1.isWin) {
                fullPath = fullPath.replace(/\\/g, "/");
              }
              return fullPath.replace(filename2 + pathModule.posix.sep, "");
            }
            return dirent.name;
          });
        }
        readdirSync(path, options) {
          const opts = (0, options_1.getReaddirOptions)(options);
          const filename = (0, util_1.pathToFilename)(path);
          return this.readdirBase(filename, opts);
        }
        readdir(path, a, b) {
          const [options, callback] = (0, options_1.getReaddirOptsAndCb)(a, b);
          const filename = (0, util_1.pathToFilename)(path);
          this.wrapAsync(this.readdirBase, [filename, options], callback);
        }
        readlinkBase(filename, encoding) {
          const link = this.getLinkOrThrow(filename, "readlink");
          const node = link.getNode();
          if (!node.isSymlink())
            throw (0, util_1.createError)(EINVAL, "readlink", filename);
          return (0, encoding_1.strToEncoding)(node.symlink, encoding);
        }
        readlinkSync(path, options) {
          const opts = (0, options_1.getDefaultOpts)(options);
          const filename = (0, util_1.pathToFilename)(path);
          return this.readlinkBase(filename, opts.encoding);
        }
        readlink(path, a, b) {
          const [opts, callback] = (0, options_1.getDefaultOptsAndCb)(a, b);
          const filename = (0, util_1.pathToFilename)(path);
          this.wrapAsync(
            this.readlinkBase,
            [filename, opts.encoding],
            callback,
          );
        }
        fsyncBase(fd) {
          this.getFileByFdOrThrow(fd, "fsync");
        }
        fsyncSync(fd) {
          this.fsyncBase(fd);
        }
        fsync(fd, callback) {
          this.wrapAsync(this.fsyncBase, [fd], callback);
        }
        fdatasyncBase(fd) {
          this.getFileByFdOrThrow(fd, "fdatasync");
        }
        fdatasyncSync(fd) {
          this.fdatasyncBase(fd);
        }
        fdatasync(fd, callback) {
          this.wrapAsync(this.fdatasyncBase, [fd], callback);
        }
        ftruncateBase(fd, len) {
          const file = this.getFileByFdOrThrow(fd, "ftruncate");
          file.truncate(len);
        }
        ftruncateSync(fd, len) {
          this.ftruncateBase(fd, len);
        }
        ftruncate(fd, a, b) {
          const len = typeof a === "number" ? a : 0;
          const callback = (0, util_1.validateCallback)(
            typeof a === "number" ? b : a,
          );
          this.wrapAsync(this.ftruncateBase, [fd, len], callback);
        }
        truncateBase(path, len) {
          const fd = this.openSync(path, "r+");
          try {
            this.ftruncateSync(fd, len);
          } finally {
            this.closeSync(fd);
          }
        }
        truncateSync(id, len) {
          if ((0, util_1.isFd)(id)) return this.ftruncateSync(id, len);
          this.truncateBase(id, len);
        }
        truncate(id, a, b) {
          const len = typeof a === "number" ? a : 0;
          const callback = (0, util_1.validateCallback)(
            typeof a === "number" ? b : a,
          );
          if ((0, util_1.isFd)(id)) return this.ftruncate(id, len, callback);
          this.wrapAsync(this.truncateBase, [id, len], callback);
        }
        futimesBase(fd, atime, mtime) {
          const file = this.getFileByFdOrThrow(fd, "futimes");
          const node = file.node;
          node.atime = new Date(atime * 1e3);
          node.mtime = new Date(mtime * 1e3);
        }
        futimesSync(fd, atime, mtime) {
          this.futimesBase(fd, toUnixTimestamp(atime), toUnixTimestamp(mtime));
        }
        futimes(fd, atime, mtime, callback) {
          this.wrapAsync(
            this.futimesBase,
            [fd, toUnixTimestamp(atime), toUnixTimestamp(mtime)],
            callback,
          );
        }
        utimesBase(filename, atime, mtime, followSymlinks = true) {
          const link = followSymlinks
            ? this.getResolvedLinkOrThrow(filename, "utimes")
            : this.getLinkOrThrow(filename, "lutimes");
          const node = link.getNode();
          node.atime = new Date(atime * 1e3);
          node.mtime = new Date(mtime * 1e3);
        }
        utimesSync(path, atime, mtime) {
          this.utimesBase(
            (0, util_1.pathToFilename)(path),
            toUnixTimestamp(atime),
            toUnixTimestamp(mtime),
            true,
          );
        }
        utimes(path, atime, mtime, callback) {
          this.wrapAsync(
            this.utimesBase,
            [
              (0, util_1.pathToFilename)(path),
              toUnixTimestamp(atime),
              toUnixTimestamp(mtime),
              true,
            ],
            callback,
          );
        }
        lutimesSync(path, atime, mtime) {
          this.utimesBase(
            (0, util_1.pathToFilename)(path),
            toUnixTimestamp(atime),
            toUnixTimestamp(mtime),
            false,
          );
        }
        lutimes(path, atime, mtime, callback) {
          this.wrapAsync(
            this.utimesBase,
            [
              (0, util_1.pathToFilename)(path),
              toUnixTimestamp(atime),
              toUnixTimestamp(mtime),
              false,
            ],
            callback,
          );
        }
        mkdirBase(filename, modeNum) {
          const steps = filenameToSteps(filename);
          if (!steps.length) {
            throw (0, util_1.createError)(EEXIST, "mkdir", filename);
          }
          const dir = this.getLinkParentAsDirOrThrow(filename, "mkdir");
          const name = steps[steps.length - 1];
          if (dir.getChild(name))
            throw (0, util_1.createError)(EEXIST, "mkdir", filename);
          const node = dir.getNode();
          if (!node.canWrite() || !node.canExecute())
            throw (0, util_1.createError)(EACCES, "mkdir", filename);
          dir.createChild(
            name,
            this.createNode(constants_1.constants.S_IFDIR | modeNum),
          );
        }
        mkdirpBase(filename, modeNum) {
          let created = false;
          const steps = filenameToSteps(filename);
          let curr = null;
          let i = steps.length;
          for (i = steps.length; i >= 0; i--) {
            curr = this.getResolvedLink(steps.slice(0, i));
            if (curr) break;
          }
          if (!curr) {
            curr = this.root;
            i = 0;
          }
          curr = this.getResolvedLinkOrThrow(
            sep + steps.slice(0, i).join(sep),
            "mkdir",
          );
          for (i; i < steps.length; i++) {
            const node = curr.getNode();
            if (node.isDirectory()) {
              if (!node.canExecute() || !node.canWrite())
                throw (0, util_1.createError)(EACCES, "mkdir", filename);
            } else {
              throw (0, util_1.createError)(ENOTDIR, "mkdir", filename);
            }
            created = true;
            curr = curr.createChild(
              steps[i],
              this.createNode(constants_1.constants.S_IFDIR | modeNum),
            );
          }
          return created ? filename : undefined;
        }
        mkdirSync(path, options) {
          const opts = (0, options_1.getMkdirOptions)(options);
          const modeNum = (0, util_1.modeToNumber)(opts.mode, 511);
          const filename = (0, util_1.pathToFilename)(path);
          if (opts.recursive) return this.mkdirpBase(filename, modeNum);
          this.mkdirBase(filename, modeNum);
        }
        mkdir(path, a, b) {
          const opts = (0, options_1.getMkdirOptions)(a);
          const callback = (0, util_1.validateCallback)(
            typeof a === "function" ? a : b,
          );
          const modeNum = (0, util_1.modeToNumber)(opts.mode, 511);
          const filename = (0, util_1.pathToFilename)(path);
          if (opts.recursive)
            this.wrapAsync(this.mkdirpBase, [filename, modeNum], callback);
          else this.wrapAsync(this.mkdirBase, [filename, modeNum], callback);
        }
        mkdtempBase(prefix, encoding, retry = 5) {
          const filename = prefix + (0, util_1.genRndStr6)();
          try {
            this.mkdirBase(filename, 511);
            return (0, encoding_1.strToEncoding)(filename, encoding);
          } catch (err) {
            if (err.code === EEXIST) {
              if (retry > 1)
                return this.mkdtempBase(prefix, encoding, retry - 1);
              else throw Error("Could not create temp dir.");
            } else throw err;
          }
        }
        mkdtempSync(prefix, options) {
          const { encoding } = (0, options_1.getDefaultOpts)(options);
          if (!prefix || typeof prefix !== "string")
            throw new TypeError("filename prefix is required");
          (0, util_1.nullCheck)(prefix);
          return this.mkdtempBase(prefix, encoding);
        }
        mkdtemp(prefix, a, b) {
          const [{ encoding }, callback] = (0, options_1.getDefaultOptsAndCb)(
            a,
            b,
          );
          if (!prefix || typeof prefix !== "string")
            throw new TypeError("filename prefix is required");
          if (!(0, util_1.nullCheck)(prefix)) return;
          this.wrapAsync(this.mkdtempBase, [prefix, encoding], callback);
        }
        rmdirBase(filename, options) {
          const opts = (0, options_1.getRmdirOptions)(options);
          const link = this.getLinkAsDirOrThrow(filename, "rmdir");
          if (link.length && !opts.recursive)
            throw (0, util_1.createError)(ENOTEMPTY, "rmdir", filename);
          this.deleteLink(link);
        }
        rmdirSync(path, options) {
          this.rmdirBase((0, util_1.pathToFilename)(path), options);
        }
        rmdir(path, a, b) {
          const opts = (0, options_1.getRmdirOptions)(a);
          const callback = (0, util_1.validateCallback)(
            typeof a === "function" ? a : b,
          );
          this.wrapAsync(
            this.rmdirBase,
            [(0, util_1.pathToFilename)(path), opts],
            callback,
          );
        }
        rmBase(filename, options = {}) {
          let link;
          try {
            link = this.getResolvedLinkOrThrow(filename, "stat");
          } catch (err) {
            if (err.code === ENOENT && options.force) return;
            else throw err;
          }
          if (link.getNode().isDirectory() && !options.recursive)
            throw (0, util_1.createError)(ERR_FS_EISDIR, "rm", filename);
          if (!link.parent.getNode().canWrite())
            throw (0, util_1.createError)(EACCES, "rm", filename);
          this.deleteLink(link);
        }
        rmSync(path, options) {
          this.rmBase((0, util_1.pathToFilename)(path), options);
        }
        rm(path, a, b) {
          const [opts, callback] = (0, options_1.getRmOptsAndCb)(a, b);
          this.wrapAsync(
            this.rmBase,
            [(0, util_1.pathToFilename)(path), opts],
            callback,
          );
        }
        fchmodBase(fd, modeNum) {
          const file = this.getFileByFdOrThrow(fd, "fchmod");
          file.chmod(modeNum);
        }
        fchmodSync(fd, mode) {
          this.fchmodBase(fd, (0, util_1.modeToNumber)(mode));
        }
        fchmod(fd, mode, callback) {
          this.wrapAsync(
            this.fchmodBase,
            [fd, (0, util_1.modeToNumber)(mode)],
            callback,
          );
        }
        chmodBase(filename, modeNum, followSymlinks = true) {
          const link = followSymlinks
            ? this.getResolvedLinkOrThrow(filename, "chmod")
            : this.getLinkOrThrow(filename, "chmod");
          const node = link.getNode();
          node.chmod(modeNum);
        }
        chmodSync(path, mode) {
          const modeNum = (0, util_1.modeToNumber)(mode);
          const filename = (0, util_1.pathToFilename)(path);
          this.chmodBase(filename, modeNum, true);
        }
        chmod(path, mode, callback) {
          const modeNum = (0, util_1.modeToNumber)(mode);
          const filename = (0, util_1.pathToFilename)(path);
          this.wrapAsync(this.chmodBase, [filename, modeNum], callback);
        }
        lchmodBase(filename, modeNum) {
          this.chmodBase(filename, modeNum, false);
        }
        lchmodSync(path, mode) {
          const modeNum = (0, util_1.modeToNumber)(mode);
          const filename = (0, util_1.pathToFilename)(path);
          this.lchmodBase(filename, modeNum);
        }
        lchmod(path, mode, callback) {
          const modeNum = (0, util_1.modeToNumber)(mode);
          const filename = (0, util_1.pathToFilename)(path);
          this.wrapAsync(this.lchmodBase, [filename, modeNum], callback);
        }
        fchownBase(fd, uid, gid) {
          this.getFileByFdOrThrow(fd, "fchown").chown(uid, gid);
        }
        fchownSync(fd, uid, gid) {
          validateUid(uid);
          validateGid(gid);
          this.fchownBase(fd, uid, gid);
        }
        fchown(fd, uid, gid, callback) {
          validateUid(uid);
          validateGid(gid);
          this.wrapAsync(this.fchownBase, [fd, uid, gid], callback);
        }
        chownBase(filename, uid, gid) {
          const link = this.getResolvedLinkOrThrow(filename, "chown");
          const node = link.getNode();
          node.chown(uid, gid);
        }
        chownSync(path, uid, gid) {
          validateUid(uid);
          validateGid(gid);
          this.chownBase((0, util_1.pathToFilename)(path), uid, gid);
        }
        chown(path, uid, gid, callback) {
          validateUid(uid);
          validateGid(gid);
          this.wrapAsync(
            this.chownBase,
            [(0, util_1.pathToFilename)(path), uid, gid],
            callback,
          );
        }
        lchownBase(filename, uid, gid) {
          this.getLinkOrThrow(filename, "lchown").getNode().chown(uid, gid);
        }
        lchownSync(path, uid, gid) {
          validateUid(uid);
          validateGid(gid);
          this.lchownBase((0, util_1.pathToFilename)(path), uid, gid);
        }
        lchown(path, uid, gid, callback) {
          validateUid(uid);
          validateGid(gid);
          this.wrapAsync(
            this.lchownBase,
            [(0, util_1.pathToFilename)(path), uid, gid],
            callback,
          );
        }
        watchFile(path, a, b) {
          const filename = (0, util_1.pathToFilename)(path);
          let options = a;
          let listener = b;
          if (typeof options === "function") {
            listener = a;
            options = null;
          }
          if (typeof listener !== "function") {
            throw Error('"watchFile()" requires a listener function');
          }
          let interval = 5007;
          let persistent = true;
          if (options && typeof options === "object") {
            if (typeof options.interval === "number")
              interval = options.interval;
            if (typeof options.persistent === "boolean")
              persistent = options.persistent;
          }
          let watcher = this.statWatchers[filename];
          if (!watcher) {
            watcher = new this.StatWatcher();
            watcher.start(filename, persistent, interval);
            this.statWatchers[filename] = watcher;
          }
          watcher.addListener("change", listener);
          return watcher;
        }
        unwatchFile(path, listener) {
          const filename = (0, util_1.pathToFilename)(path);
          const watcher = this.statWatchers[filename];
          if (!watcher) return;
          if (typeof listener === "function") {
            watcher.removeListener("change", listener);
          } else {
            watcher.removeAllListeners("change");
          }
          if (watcher.listenerCount("change") === 0) {
            watcher.stop();
            delete this.statWatchers[filename];
          }
        }
        createReadStream(path, options) {
          return new this.ReadStream(path, options);
        }
        createWriteStream(path, options) {
          return new this.WriteStream(path, options);
        }
        watch(path, options, listener) {
          const filename = (0, util_1.pathToFilename)(path);
          let givenOptions = options;
          if (typeof options === "function") {
            listener = options;
            givenOptions = null;
          }
          let { persistent, recursive, encoding } = (0,
          options_1.getDefaultOpts)(givenOptions);
          if (persistent === undefined) persistent = true;
          if (recursive === undefined) recursive = false;
          const watcher = new this.FSWatcher();
          watcher.start(filename, persistent, recursive, encoding);
          if (listener) {
            watcher.addListener("change", listener);
          }
          return watcher;
        }
        opendirBase(filename, options) {
          const link = this.getResolvedLinkOrThrow(filename, "scandir");
          const node = link.getNode();
          if (!node.isDirectory())
            throw (0, util_1.createError)(ENOTDIR, "scandir", filename);
          return new Dir_1.Dir(link, options);
        }
        opendirSync(path, options) {
          const opts = (0, options_1.getOpendirOptions)(options);
          const filename = (0, util_1.pathToFilename)(path);
          return this.opendirBase(filename, opts);
        }
        opendir(path, a, b) {
          const [options, callback] = (0, options_1.getOpendirOptsAndCb)(a, b);
          const filename = (0, util_1.pathToFilename)(path);
          this.wrapAsync(this.opendirBase, [filename, options], callback);
        }
      }
      exports.Volume = Volume;
      Volume.fd = 2147483647;
      function emitStop(self) {
        self.emit("stop");
      }
      class StatWatcher extends events_1.EventEmitter {
        constructor(vol) {
          super();
          this.onInterval = () => {
            try {
              const stats = this.vol.statSync(this.filename);
              if (this.hasChanged(stats)) {
                this.emit("change", stats, this.prev);
                this.prev = stats;
              }
            } finally {
              this.loop();
            }
          };
          this.vol = vol;
        }
        loop() {
          this.timeoutRef = this.setTimeout(this.onInterval, this.interval);
        }
        hasChanged(stats) {
          if (stats.mtimeMs > this.prev.mtimeMs) return true;
          if (stats.nlink !== this.prev.nlink) return true;
          return false;
        }
        start(path, persistent = true, interval = 5007) {
          this.filename = (0, util_1.pathToFilename)(path);
          this.setTimeout = persistent
            ? setTimeout.bind(
                typeof globalThis !== "undefined" ? globalThis : global,
              )
            : setTimeoutUnref_1.default;
          this.interval = interval;
          this.prev = this.vol.statSync(this.filename);
          this.loop();
        }
        stop() {
          clearTimeout(this.timeoutRef);
          (0, queueMicrotask_1.default)(() => {
            emitStop.call(this, this);
          });
        }
      }
      exports.StatWatcher = StatWatcher;
      var pool;
      function allocNewPool(poolSize) {
        pool = (0, buffer_1.bufferAllocUnsafe)(poolSize);
        pool.used = 0;
      }
      util.inherits(FsReadStream, stream_1.Readable);
      exports.ReadStream = FsReadStream;
      function FsReadStream(vol, path, options) {
        if (!(this instanceof FsReadStream))
          return new FsReadStream(vol, path, options);
        this._vol = vol;
        options = Object.assign({}, (0, options_1.getOptions)(options, {}));
        if (options.highWaterMark === undefined)
          options.highWaterMark = 64 * 1024;
        stream_1.Readable.call(this, options);
        this.path = (0, util_1.pathToFilename)(path);
        this.fd =
          options.fd === undefined
            ? null
            : typeof options.fd !== "number"
              ? options.fd.fd
              : options.fd;
        this.flags = options.flags === undefined ? "r" : options.flags;
        this.mode = options.mode === undefined ? 438 : options.mode;
        this.start = options.start;
        this.end = options.end;
        this.autoClose =
          options.autoClose === undefined ? true : options.autoClose;
        this.pos = undefined;
        this.bytesRead = 0;
        if (this.start !== undefined) {
          if (typeof this.start !== "number") {
            throw new TypeError('"start" option must be a Number');
          }
          if (this.end === undefined) {
            this.end = Infinity;
          } else if (typeof this.end !== "number") {
            throw new TypeError('"end" option must be a Number');
          }
          if (this.start > this.end) {
            throw new Error('"start" option must be <= "end" option');
          }
          this.pos = this.start;
        }
        if (typeof this.fd !== "number") this.open();
        this.on("end", function () {
          if (this.autoClose) {
            if (this.destroy) this.destroy();
          }
        });
      }
      FsReadStream.prototype.open = function () {
        var self = this;
        this._vol.open(this.path, this.flags, this.mode, (er, fd) => {
          if (er) {
            if (self.autoClose) {
              if (self.destroy) self.destroy();
            }
            self.emit("error", er);
            return;
          }
          self.fd = fd;
          self.emit("open", fd);
          self.read();
        });
      };
      FsReadStream.prototype._read = function (n) {
        if (typeof this.fd !== "number") {
          return this.once("open", function () {
            this._read(n);
          });
        }
        if (this.destroyed) return;
        if (!pool || pool.length - pool.used < kMinPoolSpace) {
          allocNewPool(this._readableState.highWaterMark);
        }
        var thisPool = pool;
        var toRead = Math.min(pool.length - pool.used, n);
        var start = pool.used;
        if (this.pos !== undefined)
          toRead = Math.min(this.end - this.pos + 1, toRead);
        if (toRead <= 0) return this.push(null);
        var self = this;
        this._vol.read(this.fd, pool, pool.used, toRead, this.pos, onread);
        if (this.pos !== undefined) this.pos += toRead;
        pool.used += toRead;
        function onread(er, bytesRead) {
          if (er) {
            if (self.autoClose && self.destroy) {
              self.destroy();
            }
            self.emit("error", er);
          } else {
            var b = null;
            if (bytesRead > 0) {
              self.bytesRead += bytesRead;
              b = thisPool.slice(start, start + bytesRead);
            }
            self.push(b);
          }
        }
      };
      FsReadStream.prototype._destroy = function (err, cb) {
        this.close((err2) => {
          cb(err || err2);
        });
      };
      FsReadStream.prototype.close = function (cb) {
        var _a;
        if (cb) this.once("close", cb);
        if (this.closed || typeof this.fd !== "number") {
          if (typeof this.fd !== "number") {
            this.once("open", closeOnOpen);
            return;
          }
          return (0, queueMicrotask_1.default)(() => this.emit("close"));
        }
        if (
          typeof ((_a = this._readableState) === null || _a === void 0
            ? void 0
            : _a.closed) === "boolean"
        ) {
          this._readableState.closed = true;
        } else {
          this.closed = true;
        }
        this._vol.close(this.fd, (er) => {
          if (er) this.emit("error", er);
          else this.emit("close");
        });
        this.fd = null;
      };
      function closeOnOpen(fd) {
        this.close();
      }
      util.inherits(FsWriteStream, stream_1.Writable);
      exports.WriteStream = FsWriteStream;
      function FsWriteStream(vol, path, options) {
        if (!(this instanceof FsWriteStream))
          return new FsWriteStream(vol, path, options);
        this._vol = vol;
        options = Object.assign({}, (0, options_1.getOptions)(options, {}));
        stream_1.Writable.call(this, options);
        this.path = (0, util_1.pathToFilename)(path);
        this.fd =
          options.fd === undefined
            ? null
            : typeof options.fd !== "number"
              ? options.fd.fd
              : options.fd;
        this.flags = options.flags === undefined ? "w" : options.flags;
        this.mode = options.mode === undefined ? 438 : options.mode;
        this.start = options.start;
        this.autoClose =
          options.autoClose === undefined ? true : !!options.autoClose;
        this.pos = undefined;
        this.bytesWritten = 0;
        this.pending = true;
        if (this.start !== undefined) {
          if (typeof this.start !== "number") {
            throw new TypeError('"start" option must be a Number');
          }
          if (this.start < 0) {
            throw new Error('"start" must be >= zero');
          }
          this.pos = this.start;
        }
        if (options.encoding) this.setDefaultEncoding(options.encoding);
        if (typeof this.fd !== "number") this.open();
        this.once("finish", function () {
          if (this.autoClose) {
            this.close();
          }
        });
      }
      FsWriteStream.prototype.open = function () {
        this._vol.open(
          this.path,
          this.flags,
          this.mode,
          function (er, fd) {
            if (er) {
              if (this.autoClose && this.destroy) {
                this.destroy();
              }
              this.emit("error", er);
              return;
            }
            this.fd = fd;
            this.pending = false;
            this.emit("open", fd);
          }.bind(this),
        );
      };
      FsWriteStream.prototype._write = function (data, encoding, cb) {
        if (!(data instanceof buffer_1.Buffer || data instanceof Uint8Array))
          return this.emit("error", new Error("Invalid data"));
        if (typeof this.fd !== "number") {
          return this.once("open", function () {
            this._write(data, encoding, cb);
          });
        }
        var self = this;
        this._vol.write(
          this.fd,
          data,
          0,
          data.length,
          this.pos,
          (er, bytes) => {
            if (er) {
              if (self.autoClose && self.destroy) {
                self.destroy();
              }
              return cb(er);
            }
            self.bytesWritten += bytes;
            cb();
          },
        );
        if (this.pos !== undefined) this.pos += data.length;
      };
      FsWriteStream.prototype._writev = function (data, cb) {
        if (typeof this.fd !== "number") {
          return this.once("open", function () {
            this._writev(data, cb);
          });
        }
        const self = this;
        const len = data.length;
        const chunks = new Array(len);
        var size = 0;
        for (var i = 0; i < len; i++) {
          var chunk = data[i].chunk;
          chunks[i] = chunk;
          size += chunk.length;
        }
        const buf = buffer_1.Buffer.concat(chunks);
        this._vol.write(this.fd, buf, 0, buf.length, this.pos, (er, bytes) => {
          if (er) {
            if (self.destroy) self.destroy();
            return cb(er);
          }
          self.bytesWritten += bytes;
          cb();
        });
        if (this.pos !== undefined) this.pos += size;
      };
      FsWriteStream.prototype.close = function (cb) {
        var _a;
        if (cb) this.once("close", cb);
        if (this.closed || typeof this.fd !== "number") {
          if (typeof this.fd !== "number") {
            this.once("open", closeOnOpen);
            return;
          }
          return (0, queueMicrotask_1.default)(() => this.emit("close"));
        }
        if (
          typeof ((_a = this._writableState) === null || _a === void 0
            ? void 0
            : _a.closed) === "boolean"
        ) {
          this._writableState.closed = true;
        } else {
          this.closed = true;
        }
        this._vol.close(this.fd, (er) => {
          if (er) this.emit("error", er);
          else this.emit("close");
        });
        this.fd = null;
      };
      FsWriteStream.prototype._destroy = FsReadStream.prototype._destroy;
      FsWriteStream.prototype.destroySoon = FsWriteStream.prototype.end;
      class FSWatcher extends events_1.EventEmitter {
        constructor(vol) {
          super();
          this._filename = "";
          this._filenameEncoded = "";
          this._recursive = false;
          this._encoding = encoding_1.ENCODING_UTF8;
          this._listenerRemovers = new Map();
          this._onParentChild = (link) => {
            if (link.getName() === this._getName()) {
              this._emit("rename");
            }
          };
          this._emit = (type) => {
            this.emit("change", type, this._filenameEncoded);
          };
          this._persist = () => {
            this._timer = setTimeout(this._persist, 1e6);
          };
          this._vol = vol;
        }
        _getName() {
          return this._steps[this._steps.length - 1];
        }
        start(
          path,
          persistent = true,
          recursive = false,
          encoding = encoding_1.ENCODING_UTF8,
        ) {
          this._filename = (0, util_1.pathToFilename)(path);
          this._steps = filenameToSteps(this._filename);
          this._filenameEncoded = (0, encoding_1.strToEncoding)(this._filename);
          this._recursive = recursive;
          this._encoding = encoding;
          try {
            this._link = this._vol.getLinkOrThrow(this._filename, "FSWatcher");
          } catch (err) {
            const error = new Error(`watch ${this._filename} ${err.code}`);
            error.code = err.code;
            error.errno = err.code;
            throw error;
          }
          const watchLinkNodeChanged = (link) => {
            var _a;
            const filepath = link.getPath();
            const node = link.getNode();
            const onNodeChange = () => {
              let filename = relative(this._filename, filepath);
              if (!filename) {
                filename = this._getName();
              }
              return this.emit("change", "change", filename);
            };
            node.on("change", onNodeChange);
            const removers =
              (_a = this._listenerRemovers.get(node.ino)) !== null &&
              _a !== void 0
                ? _a
                : [];
            removers.push(() => node.removeListener("change", onNodeChange));
            this._listenerRemovers.set(node.ino, removers);
          };
          const watchLinkChildrenChanged = (link) => {
            var _a;
            const node = link.getNode();
            const onLinkChildAdd = (l) => {
              this.emit(
                "change",
                "rename",
                relative(this._filename, l.getPath()),
              );
              setTimeout(() => {
                watchLinkNodeChanged(l);
                watchLinkChildrenChanged(l);
              });
            };
            const onLinkChildDelete = (l) => {
              const removeLinkNodeListeners = (curLink) => {
                const ino = curLink.getNode().ino;
                const removers = this._listenerRemovers.get(ino);
                if (removers) {
                  removers.forEach((r) => r());
                  this._listenerRemovers.delete(ino);
                }
                for (const [name, childLink] of curLink.children.entries()) {
                  if (childLink && name !== "." && name !== "..") {
                    removeLinkNodeListeners(childLink);
                  }
                }
              };
              removeLinkNodeListeners(l);
              this.emit(
                "change",
                "rename",
                relative(this._filename, l.getPath()),
              );
            };
            for (const [name, childLink] of link.children.entries()) {
              if (childLink && name !== "." && name !== "..") {
                watchLinkNodeChanged(childLink);
              }
            }
            link.on("child:add", onLinkChildAdd);
            link.on("child:delete", onLinkChildDelete);
            const removers =
              (_a = this._listenerRemovers.get(node.ino)) !== null &&
              _a !== void 0
                ? _a
                : [];
            removers.push(() => {
              link.removeListener("child:add", onLinkChildAdd);
              link.removeListener("child:delete", onLinkChildDelete);
            });
            if (recursive) {
              for (const [name, childLink] of link.children.entries()) {
                if (childLink && name !== "." && name !== "..") {
                  watchLinkChildrenChanged(childLink);
                }
              }
            }
          };
          watchLinkNodeChanged(this._link);
          watchLinkChildrenChanged(this._link);
          const parent = this._link.parent;
          if (parent) {
            parent.setMaxListeners(parent.getMaxListeners() + 1);
            parent.on("child:delete", this._onParentChild);
          }
          if (persistent) this._persist();
        }
        close() {
          clearTimeout(this._timer);
          this._listenerRemovers.forEach((removers) => {
            removers.forEach((r) => r());
          });
          this._listenerRemovers.clear();
          const parent = this._link.parent;
          if (parent) {
            parent.removeListener("child:delete", this._onParentChild);
          }
        }
      }
      exports.FSWatcher = FSWatcher;
    },
    21: (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      /*!
       * on-finished
       * Copyright(c) 2013 Jonathan Ong
       * Copyright(c) 2014 Douglas Christopher Wilson
       * MIT Licensed
       */ module.exports = onFinished;
      module.exports.isFinished = isFinished;
      var asyncHooks = tryRequireAsyncHooks();
      var first = __nccwpck_require__(3997);
      var defer =
        typeof setImmediate === "function"
          ? setImmediate
          : function (fn) {
              process.nextTick(fn.bind.apply(fn, arguments));
            };
      function onFinished(msg, listener) {
        if (isFinished(msg) !== false) {
          defer(listener, null, msg);
          return msg;
        }
        attachListener(msg, wrap(listener));
        return msg;
      }
      function isFinished(msg) {
        var socket = msg.socket;
        if (typeof msg.finished === "boolean") {
          return Boolean(msg.finished || (socket && !socket.writable));
        }
        if (typeof msg.complete === "boolean") {
          return Boolean(
            msg.upgrade ||
              !socket ||
              !socket.readable ||
              (msg.complete && !msg.readable),
          );
        }
        return undefined;
      }
      function attachFinishedListener(msg, callback) {
        var eeMsg;
        var eeSocket;
        var finished = false;
        function onFinish(error) {
          eeMsg.cancel();
          eeSocket.cancel();
          finished = true;
          callback(error);
        }
        eeMsg = eeSocket = first([[msg, "end", "finish"]], onFinish);
        function onSocket(socket) {
          msg.removeListener("socket", onSocket);
          if (finished) return;
          if (eeMsg !== eeSocket) return;
          eeSocket = first([[socket, "error", "close"]], onFinish);
        }
        if (msg.socket) {
          onSocket(msg.socket);
          return;
        }
        msg.on("socket", onSocket);
        if (msg.socket === undefined) {
          patchAssignSocket(msg, onSocket);
        }
      }
      function attachListener(msg, listener) {
        var attached = msg.__onFinished;
        if (!attached || !attached.queue) {
          attached = msg.__onFinished = createListener(msg);
          attachFinishedListener(msg, attached);
        }
        attached.queue.push(listener);
      }
      function createListener(msg) {
        function listener(err) {
          if (msg.__onFinished === listener) msg.__onFinished = null;
          if (!listener.queue) return;
          var queue = listener.queue;
          listener.queue = null;
          for (var i = 0; i < queue.length; i++) {
            queue[i](err, msg);
          }
        }
        listener.queue = [];
        return listener;
      }
      function patchAssignSocket(res, callback) {
        var assignSocket = res.assignSocket;
        if (typeof assignSocket !== "function") return;
        res.assignSocket = function _assignSocket(socket) {
          assignSocket.call(this, socket);
          callback(socket);
        };
      }
      function tryRequireAsyncHooks() {
        try {
          return __nccwpck_require__(290);
        } catch (e) {
          return {};
        }
      }
      function wrap(fn) {
        var res;
        if (asyncHooks.AsyncResource) {
          res = new asyncHooks.AsyncResource(fn.name || "bound-anonymous-fn");
        }
        if (!res || !res.runInAsyncScope) {
          return fn;
        }
        return res.runInAsyncScope.bind(res, fn, null);
      }
    },
    2668: (module) => {
      "use strict";
      /*!
       * range-parser
       * Copyright(c) 2012-2014 TJ Holowaychuk
       * Copyright(c) 2015-2016 Douglas Christopher Wilson
       * MIT Licensed
       */ module.exports = rangeParser;
      function rangeParser(size, str, options) {
        if (typeof str !== "string") {
          throw new TypeError("argument str must be a string");
        }
        var index = str.indexOf("=");
        if (index === -1) {
          return -2;
        }
        var arr = str.slice(index + 1).split(",");
        var ranges = [];
        ranges.type = str.slice(0, index);
        for (var i = 0; i < arr.length; i++) {
          var range = arr[i].split("-");
          var start = parseInt(range[0], 10);
          var end = parseInt(range[1], 10);
          if (isNaN(start)) {
            start = size - end;
            end = size - 1;
          } else if (isNaN(end)) {
            end = size - 1;
          }
          if (end > size - 1) {
            end = size - 1;
          }
          if (isNaN(start) || isNaN(end) || start > end || start < 0) {
            continue;
          }
          ranges.push({ start, end });
        }
        if (ranges.length < 1) {
          return -1;
        }
        return options && options.combine ? combineRanges(ranges) : ranges;
      }
      function combineRanges(ranges) {
        var ordered = ranges.map(mapWithIndex).sort(sortByRangeStart);
        for (var j = 0, i = 1; i < ordered.length; i++) {
          var range = ordered[i];
          var current = ordered[j];
          if (range.start > current.end + 1) {
            ordered[++j] = range;
          } else if (range.end > current.end) {
            current.end = range.end;
            current.index = Math.min(current.index, range.index);
          }
        }
        ordered.length = j + 1;
        var combined = ordered.sort(sortByRangeIndex).map(mapWithoutIndex);
        combined.type = ranges.type;
        return combined;
      }
      function mapWithIndex(range, index) {
        return { start: range.start, end: range.end, index };
      }
      function mapWithoutIndex(range) {
        return { start: range.start, end: range.end };
      }
      function sortByRangeIndex(a, b) {
        return a.index - b.index;
      }
      function sortByRangeStart(a, b) {
        return a.start - b.start;
      }
    },
    9185: (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      const { logger } = __nccwpck_require__(8679);
      const middleware = __nccwpck_require__(3437);
      const getFilenameFromUrl = __nccwpck_require__(477);
      const setupHooks = __nccwpck_require__(7632);
      const setupWriteToDisk = __nccwpck_require__(8683);
      const setupOutputFileSystem = __nccwpck_require__(1296);
      const ready = __nccwpck_require__(3676);
      const noop = () => {};
      function wdm(compiler, options = {}) {
        const context = {
          state: false,
          stats: undefined,
          callbacks: [],
          options,
          compiler,
        };
        setupHooks(context);
        if (options.writeToDisk) {
          setupWriteToDisk(context);
        }
        setupOutputFileSystem(context);
        if (context.compiler.watching) {
          context.watching = context.compiler.watching;
        } else {
          const errorHandler = (error) => {
            if (error) {
              if (error.message && error.message.includes("× Error:")) {
                error.message = error.message.replace("× Error:", "").trim();
              }
              logger.error(error);
            }
          };
          if (Array.isArray(context.compiler.compilers)) {
            const multiCompiler = context.compiler;
            const watchOptions = multiCompiler.compilers.map(
              (childCompiler) => childCompiler.options.watchOptions || {},
            );
            context.watching = multiCompiler.watch(watchOptions, errorHandler);
          } else {
            const singleCompiler = context.compiler;
            const watchOptions = singleCompiler.options.watchOptions || {};
            context.watching = singleCompiler.watch(watchOptions, errorHandler);
          }
        }
        const filledContext = context;
        const instance = middleware(filledContext);
        instance.getFilenameFromUrl = (url, extra) =>
          getFilenameFromUrl(filledContext, url, extra);
        instance.waitUntilValid = (callback = noop) => {
          ready(filledContext, callback);
        };
        instance.invalidate = (callback = noop) => {
          ready(filledContext, callback);
          filledContext.watching.invalidate();
        };
        instance.close = (callback = noop) => {
          filledContext.watching.close(callback);
        };
        instance.context = filledContext;
        return instance;
      }
      module.exports = wdm;
    },
    3437: (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      const mrmime = __nccwpck_require__(8311);
      const { logger } = __nccwpck_require__(8679);
      const onFinishedStream = __nccwpck_require__(21);
      const getFilenameFromUrl = __nccwpck_require__(477);
      const ready = __nccwpck_require__(3676);
      const parseTokenList = __nccwpck_require__(7579);
      const memorize = __nccwpck_require__(4821);
      async function getEtag(stat) {
        const mtime = stat.mtime.getTime().toString(16);
        const size = stat.size.toString(16);
        return `W/"${size}-${mtime}"`;
      }
      function createReadStreamOrReadFileSync(
        filename,
        outputFileSystem,
        start,
        end,
      ) {
        const bufferOrStream = outputFileSystem.createReadStream(filename, {
          start,
          end,
        });
        const byteLength = end === 0 ? 0 : end - start + 1;
        return { bufferOrStream, byteLength };
      }
      function getContentType(str) {
        let mime = mrmime.lookup(str);
        if (!mime) {
          return false;
        }
        if (
          mime.startsWith("text/") ||
          mime === "application/json" ||
          mime === "application/manifest+json"
        ) {
          mime += "; charset=utf-8";
        }
        return mime;
      }
      const BYTES_RANGE_REGEXP = /^ *bytes/i;
      function getValueContentRangeHeader(type, size, range) {
        return `${type} ${range ? `${range.start}-${range.end}` : "*"}/${size}`;
      }
      function parseHttpDate(date) {
        const timestamp = date && Date.parse(date);
        return typeof timestamp === "number" ? timestamp : Number.NaN;
      }
      const CACHE_CONTROL_NO_CACHE_REGEXP = /(?:^|,)\s*?no-cache\s*?(?:,|$)/;
      function destroyStream(stream, suppress) {
        if (typeof stream.destroy === "function") {
          stream.destroy();
        }
        if (typeof stream.close === "function") {
          stream.on("open", function onOpenClose() {
            if (typeof this.fd === "number") {
              this.close();
            }
          });
        }
        if (typeof stream.addListener === "function" && suppress) {
          stream.removeAllListeners("error");
          stream.addListener("error", () => {});
        }
      }
      const statuses = {
        400: "Bad Request",
        403: "Forbidden",
        404: "Not Found",
        416: "Range Not Satisfiable",
        500: "Internal Server Error",
      };
      const parseRangeHeaders = memorize((value) => {
        const [len, rangeHeader] = value.split("|");
        return __nccwpck_require__(2668)(Number(len), rangeHeader, {
          combine: true,
        });
      });
      function wrapper(context) {
        return async function middleware(req, res, next) {
          const acceptedMethods = ["GET", "HEAD"];
          res.locals = res.locals || {};
          async function goNext() {
            return new Promise((resolve) => {
              ready(
                context,
                () => {
                  res.locals.webpack = { devMiddleware: context };
                  resolve(next());
                },
                req,
              );
            });
          }
          if (req.method && !acceptedMethods.includes(req.method)) {
            await goNext();
            return;
          }
          function sendError(status, options) {
            const escapeHtml = __nccwpck_require__(8081);
            const content = statuses[status] || String(status);
            const document = Buffer.from(
              `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Error</title>\n</head>\n<body>\n<pre>${escapeHtml(content)}</pre>\n</body>\n</html>`,
              "utf-8",
            );
            const headers = res.getHeaderNames();
            for (let i = 0; i < headers.length; i++) {
              res.removeHeader(headers[i]);
            }
            if (options && options.headers) {
              const keys = Object.keys(options.headers);
              for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const value = options.headers[key];
                if (typeof value !== "undefined") {
                  res.setHeader(key, value);
                }
              }
            }
            res.statusCode = status;
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.setHeader("Content-Security-Policy", "default-src 'none'");
            res.setHeader("X-Content-Type-Options", "nosniff");
            const byteLength = Buffer.byteLength(document);
            res.setHeader("Content-Length", byteLength);
            res.end(document);
          }
          function isConditionalGET() {
            return (
              req.headers["if-match"] ||
              req.headers["if-unmodified-since"] ||
              req.headers["if-none-match"] ||
              req.headers["if-modified-since"]
            );
          }
          function isPreconditionFailure() {
            const ifMatch = req.headers["if-match"];
            if (ifMatch) {
              const etag = res.getHeader("ETag");
              return (
                !etag ||
                (ifMatch !== "*" &&
                  parseTokenList(ifMatch).every(
                    (match) =>
                      match !== etag &&
                      match !== `W/${etag}` &&
                      `W/${match}` !== etag,
                  ))
              );
            }
            const ifUnmodifiedSince = req.headers["if-unmodified-since"];
            if (ifUnmodifiedSince) {
              const unmodifiedSince = parseHttpDate(ifUnmodifiedSince);
              if (!Number.isNaN(unmodifiedSince)) {
                const lastModified = parseHttpDate(
                  res.getHeader("Last-Modified"),
                );
                return (
                  Number.isNaN(lastModified) || lastModified > unmodifiedSince
                );
              }
            }
            return false;
          }
          function isCachable() {
            return (
              (res.statusCode >= 200 && res.statusCode < 300) ||
              res.statusCode === 304
            );
          }
          function isFresh(resHeaders) {
            const cacheControl = req.headers["cache-control"];
            if (
              cacheControl &&
              CACHE_CONTROL_NO_CACHE_REGEXP.test(cacheControl)
            ) {
              return false;
            }
            const noneMatch = req.headers["if-none-match"];
            const modifiedSince = req.headers["if-modified-since"];
            if (!noneMatch && !modifiedSince) {
              return false;
            }
            if (noneMatch && noneMatch !== "*") {
              if (!resHeaders.etag) {
                return false;
              }
              const matches = parseTokenList(noneMatch);
              let etagStale = true;
              for (let i = 0; i < matches.length; i++) {
                const match = matches[i];
                if (
                  match === resHeaders.etag ||
                  match === `W/${resHeaders.etag}` ||
                  `W/${match}` === resHeaders.etag
                ) {
                  etagStale = false;
                  break;
                }
              }
              if (etagStale) {
                return false;
              }
            }
            if (noneMatch) {
              return true;
            }
            if (modifiedSince) {
              const lastModified = resHeaders["last-modified"];
              const modifiedStale =
                !lastModified ||
                !(parseHttpDate(lastModified) <= parseHttpDate(modifiedSince));
              if (modifiedStale) {
                return false;
              }
            }
            return true;
          }
          function isRangeFresh() {
            const ifRange = req.headers["if-range"];
            if (!ifRange) {
              return true;
            }
            if (ifRange.indexOf('"') !== -1) {
              const etag = res.getHeader("ETag");
              if (!etag) {
                return true;
              }
              return Boolean(etag && ifRange.indexOf(etag) !== -1);
            }
            const lastModified = res.getHeader("Last-Modified");
            if (!lastModified) {
              return true;
            }
            return parseHttpDate(lastModified) <= parseHttpDate(ifRange);
          }
          function getRangeHeader() {
            const rage = req.headers.range;
            if (rage && BYTES_RANGE_REGEXP.test(rage)) {
              return rage;
            }
            return undefined;
          }
          function getOffsetAndLenFromRange(range) {
            const offset = range.start;
            const len = range.end - range.start + 1;
            return [offset, len];
          }
          function calcStartAndEnd(offset, len) {
            const start = offset;
            const end = Math.max(offset, offset + len - 1);
            return [start, end];
          }
          async function processRequest() {
            const extra = {};
            const filename = getFilenameFromUrl(context, req.url, extra);
            if (extra.errorCode) {
              if (extra.errorCode === 403) {
                logger.error(
                  `[rsbuild-dev-middleware] Malicious path "${filename}".`,
                );
              }
              sendError(extra.errorCode);
              return;
            }
            if (!filename) {
              await goNext();
              return;
            }
            const { size } = extra.stats;
            let len = size;
            let offset = 0;
            if (!res.getHeader("Content-Type")) {
              const contentType = getContentType(filename);
              if (contentType) {
                res.setHeader("Content-Type", contentType);
              }
            }
            if (!res.getHeader("Accept-Ranges")) {
              res.setHeader("Accept-Ranges", "bytes");
            }
            if (
              context.options.lastModified &&
              !res.getHeader("Last-Modified")
            ) {
              const modified = extra.stats.mtime.toUTCString();
              res.setHeader("Last-Modified", modified);
            }
            const rangeHeader = getRangeHeader();
            if (!res.getHeader("ETag")) {
              const value = extra.stats;
              if (value) {
                const hash = await getEtag(value);
                res.setHeader("ETag", hash);
              }
            }
            if (isConditionalGET()) {
              if (isPreconditionFailure()) {
                sendError(412);
                return;
              }
              if (res.statusCode === 404) {
                res.statusCode = 200;
              }
              if (
                isCachable() &&
                isFresh({
                  etag: res.getHeader("ETag"),
                  "last-modified": res.getHeader("Last-Modified"),
                })
              ) {
                res.statusCode = 304;
                res.removeHeader("Content-Encoding");
                res.removeHeader("Content-Language");
                res.removeHeader("Content-Length");
                res.removeHeader("Content-Range");
                res.removeHeader("Content-Type");
                res.end();
                return;
              }
            }
            if (rangeHeader) {
              let parsedRanges = parseRangeHeaders(`${size}|${rangeHeader}`);
              if (!isRangeFresh()) {
                parsedRanges = [];
              }
              if (parsedRanges === -1) {
                logger.error(
                  "[rsbuild-dev-middleware] Unsatisfiable range for 'Range' header.",
                );
                res.setHeader(
                  "Content-Range",
                  getValueContentRangeHeader("bytes", size),
                );
                sendError(416, {
                  headers: { "Content-Range": res.getHeader("Content-Range") },
                });
                return;
              }
              if (parsedRanges === -2) {
                logger.error(
                  "[rsbuild-dev-middleware] A malformed 'Range' header was provided. A regular response will be sent for this request.",
                );
              } else if (parsedRanges.length > 1) {
                logger.error(
                  "[rsbuild-dev-middleware] A 'Range' header with multiple ranges was provided. Multiple ranges are not supported, so a regular response will be sent for this request.",
                );
              }
              if (parsedRanges !== -2 && parsedRanges.length === 1) {
                res.statusCode = 206;
                res.setHeader(
                  "Content-Range",
                  getValueContentRangeHeader("bytes", size, parsedRanges[0]),
                );
                [offset, len] = getOffsetAndLenFromRange(parsedRanges[0]);
              }
            }
            let bufferOrStream;
            let byteLength;
            const [start, end] = calcStartAndEnd(offset, len);
            try {
              ({ bufferOrStream, byteLength } = createReadStreamOrReadFileSync(
                filename,
                context.outputFileSystem,
                start,
                end,
              ));
            } catch (_ignoreError) {
              await goNext();
              return;
            }
            res.setHeader("Content-Length", byteLength);
            if (req.method === "HEAD") {
              if (res.statusCode === 404) {
                res.statusCode = 200;
              }
              res.end();
              return;
            }
            const isPipeSupports = typeof bufferOrStream.pipe === "function";
            if (!isPipeSupports) {
              res.end(bufferOrStream);
              return;
            }
            const cleanup = () => {
              destroyStream(bufferOrStream, true);
            };
            bufferOrStream.on("error", (error) => {
              cleanup();
              switch (error.code) {
                case "ENAMETOOLONG":
                case "ENOENT":
                case "ENOTDIR":
                  sendError(404);
                  break;
                default:
                  sendError(500);
                  break;
              }
            });
            bufferOrStream.pipe(res);
            onFinishedStream(res, cleanup);
          }
          ready(context, processRequest, req);
        };
      }
      module.exports = wrapper;
    },
    8081: (module) => {
      "use strict";
      const matchHtmlRegExp = /["'&<>]/;
      function escapeHtml(string) {
        const str = `${string}`;
        const match = matchHtmlRegExp.exec(str);
        if (!match) {
          return str;
        }
        let escape;
        let html = "";
        let index = 0;
        let lastIndex = 0;
        for ({ index } = match; index < str.length; index++) {
          switch (str.charCodeAt(index)) {
            case 34:
              escape = "&quot;";
              break;
            case 38:
              escape = "&amp;";
              break;
            case 39:
              escape = "&#39;";
              break;
            case 60:
              escape = "&lt;";
              break;
            case 62:
              escape = "&gt;";
              break;
            default:
              continue;
          }
          if (lastIndex !== index) {
            html += str.substring(lastIndex, index);
          }
          lastIndex = index + 1;
          html += escape;
        }
        return lastIndex !== index
          ? html + str.substring(lastIndex, index)
          : html;
      }
      module.exports = escapeHtml;
    },
    477: (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      const path = __nccwpck_require__(6928);
      const { parse } = __nccwpck_require__(7016);
      const querystring = __nccwpck_require__(3480);
      const getPaths = __nccwpck_require__(871);
      const memorize = __nccwpck_require__(4821);
      const memoizedParse = memorize(parse, undefined, (value) => {
        if (value.pathname) {
          value.pathname = decode(value.pathname);
        }
        return value;
      });
      const UP_PATH_REGEXP = /(?:^|[\\/])\.\.(?:[\\/]|$)/;
      function decode(input) {
        return querystring.unescape(input);
      }
      function getFilenameFromUrl(context, url, extra = {}) {
        const { options } = context;
        const paths = getPaths(context);
        let foundFilename;
        let urlObject;
        try {
          urlObject = memoizedParse(url, false, true);
        } catch (_ignoreError) {
          return;
        }
        for (const { publicPath, outputPath } of paths) {
          let filename;
          let publicPathObject;
          try {
            publicPathObject = memoizedParse(
              publicPath !== "auto" && publicPath ? publicPath : "/",
              false,
              true,
            );
          } catch (_ignoreError) {
            continue;
          }
          const { pathname } = urlObject;
          const { pathname: publicPathPathname } = publicPathObject;
          if (pathname && pathname.startsWith(publicPathPathname)) {
            if (pathname.includes("\0")) {
              extra.errorCode = 400;
              return;
            }
            if (UP_PATH_REGEXP.test(path.normalize(`./${pathname}`))) {
              extra.errorCode = 403;
              return;
            }
            filename = path.join(
              outputPath,
              pathname.slice(publicPathPathname.length),
            );
            try {
              extra.stats = context.outputFileSystem.statSync(filename);
            } catch (_ignoreError) {
              continue;
            }
            if (extra.stats.isFile()) {
              foundFilename = filename;
              break;
            }
            if (
              extra.stats.isDirectory() &&
              (typeof options.index === "undefined" || options.index)
            ) {
              const indexValue =
                typeof options.index === "undefined" ||
                typeof options.index === "boolean"
                  ? "index.html"
                  : options.index;
              filename = path.join(filename, indexValue);
              try {
                extra.stats = context.outputFileSystem.statSync(filename);
              } catch (__ignoreError) {
                continue;
              }
              if (extra.stats.isFile()) {
                foundFilename = filename;
                break;
              }
            }
          }
        }
        return foundFilename;
      }
      module.exports = getFilenameFromUrl;
    },
    871: (module) => {
      "use strict";
      function getPaths(context) {
        const { stats, options } = context;
        const childStats = stats.stats ? stats.stats : [stats];
        const publicPaths = [];
        for (const { compilation } of childStats) {
          const outputPath = compilation.getPath(
            compilation.outputOptions.path || "",
          );
          const publicPath = options.publicPath
            ? compilation.getPath(options.publicPath)
            : compilation.outputOptions.publicPath
              ? compilation.getPath(compilation.outputOptions.publicPath)
              : "";
          publicPaths.push({ outputPath, publicPath });
        }
        return publicPaths;
      }
      module.exports = getPaths;
    },
    4821: (module) => {
      "use strict";
      const cacheStore = new WeakMap();
      function memorize(fn, { cache = new Map() } = {}, callback) {
        const memoized = (...arguments_) => {
          const [key] = arguments_;
          const cacheItem = cache.get(key);
          if (cacheItem) {
            return cacheItem.data;
          }
          let result = fn.apply(this, arguments_);
          if (callback) {
            result = callback(result);
          }
          cache.set(key, { data: result });
          return result;
        };
        cacheStore.set(memoized, cache);
        return memoized;
      }
      module.exports = memorize;
    },
    7579: (module) => {
      "use strict";
      function parseTokenList(str) {
        let end = 0;
        let start = 0;
        const list = [];
        for (let i = 0, len = str.length; i < len; i++) {
          switch (str.charCodeAt(i)) {
            case 32:
              if (start === end) {
                end = i + 1;
                start = end;
              }
              break;
            case 44:
              if (start !== end) {
                list.push(str.substring(start, end));
              }
              end = i + 1;
              start = end;
              break;
            default:
              end = i + 1;
              break;
          }
        }
        if (start !== end) {
          list.push(str.substring(start, end));
        }
        return list;
      }
      module.exports = parseTokenList;
    },
    3676: (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      const { logger } = __nccwpck_require__(8679);
      function ready(context, callback, req) {
        if (context.state) {
          callback(context.stats);
          return;
        }
        const name = (req && req.url) || callback.name;
        logger.debug(
          `[rsbuild-dev-middleware] wait until bundle finished${name ? `: ${name}` : ""}`,
        );
        context.callbacks.push(callback);
      }
      module.exports = ready;
    },
    7632: (module) => {
      "use strict";
      function setupHooks(context) {
        function invalid() {
          context.state = false;
          context.stats = undefined;
        }
        function done(stats) {
          context.state = true;
          context.stats = stats;
          process.nextTick(() => {
            const { state, callbacks } = context;
            if (!state) {
              return;
            }
            context.callbacks = [];
            callbacks.forEach((callback) => {
              callback(stats);
            });
          });
        }
        const compiler = context.compiler;
        compiler.hooks.watchRun.tap("webpack-dev-middleware", invalid);
        compiler.hooks.invalid.tap("webpack-dev-middleware", invalid);
        compiler.hooks.done.tap("webpack-dev-middleware", done);
      }
      module.exports = setupHooks;
    },
    1296: (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      const memfs = __nccwpck_require__(5590);
      function setupOutputFileSystem(context) {
        let outputFileSystem;
        if (context.options.writeToDisk !== true) {
          outputFileSystem = memfs.createFsFromVolume(new memfs.Volume());
        } else {
          const isMultiCompiler = context.compiler.compilers;
          if (isMultiCompiler) {
            const compiler = context.compiler.compilers.filter((item) =>
              Object.prototype.hasOwnProperty.call(item.options, "devServer"),
            );
            ({ outputFileSystem } =
              compiler[0] || context.compiler.compilers[0]);
          } else {
            ({ outputFileSystem } = context.compiler);
          }
        }
        const compilers = context.compiler.compilers || [context.compiler];
        for (const compiler of compilers) {
          compiler.outputFileSystem = outputFileSystem;
        }
        context.outputFileSystem = outputFileSystem;
      }
      module.exports = setupOutputFileSystem;
    },
    8683: (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      const fs = __nccwpck_require__(9896);
      const path = __nccwpck_require__(6928);
      const { logger } = __nccwpck_require__(8679);
      function setupWriteToDisk(context) {
        const compilers = context.compiler.compilers || [context.compiler];
        for (const compiler of compilers) {
          compiler.hooks.emit.tap("DevMiddleware", () => {
            if (compiler.hasWebpackDevMiddlewareAssetEmittedCallback) {
              return;
            }
            compiler.hooks.assetEmitted.tapAsync(
              "DevMiddleware",
              (_file, info, callback) => {
                const { targetPath, content, compilation } = info;
                const { writeToDisk: filter } = context.options;
                const allowWrite =
                  filter && typeof filter === "function"
                    ? filter(targetPath, compilation.name)
                    : true;
                if (!allowWrite) {
                  return callback();
                }
                const dir = path.dirname(targetPath);
                const name = compiler.options.name
                  ? `Child "${compiler.options.name}": `
                  : "";
                return fs.mkdir(dir, { recursive: true }, (mkdirError) => {
                  if (mkdirError) {
                    logger.error(
                      `[rsbuild-dev-middleware] ${name}Unable to write "${dir}" directory to disk:\n${mkdirError}`,
                    );
                    return callback(mkdirError);
                  }
                  return fs.writeFile(targetPath, content, (writeFileError) => {
                    if (writeFileError) {
                      logger.error(
                        `[rsbuild-dev-middleware] ${name}Unable to write "${targetPath}" asset to disk:\n${writeFileError}`,
                      );
                      return callback(writeFileError);
                    }
                    logger.debug(
                      `[rsbuild-dev-middleware] ${name}Asset written to disk: "${targetPath}"`,
                    );
                    return callback();
                  });
                });
              },
            );
            compiler.hasWebpackDevMiddlewareAssetEmittedCallback = true;
          });
        }
      }
      module.exports = setupWriteToDisk;
    },
    1821: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      const tslib_1 = __nccwpck_require__(5477);
      tslib_1.__exportStar(__nccwpck_require__(2290), exports);
      tslib_1.__exportStar(__nccwpck_require__(7839), exports);
    },
    7839: (__unused_webpack_module, exports) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.printBinary = void 0;
      const printBinary = (tab = "", children) => {
        const left = children[0],
          right = children[1];
        let str = "";
        if (left) str += "\n" + tab + "← " + left(tab + "  ");
        if (right) str += "\n" + tab + "→ " + right(tab + "  ");
        return str;
      };
      exports.printBinary = printBinary;
    },
    2290: (__unused_webpack_module, exports) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.printTree = void 0;
      const printTree = (tab = "", children) => {
        let str = "";
        let last = children.length - 1;
        for (; last >= 0; last--) if (children[last]) break;
        for (let i = 0; i <= last; i++) {
          const fn = children[i];
          if (!fn) continue;
          const isLast = i === last;
          const child = fn(tab + (isLast ? " " : "│") + "  ");
          const branch = child ? (isLast ? "└─" : "├─") : "│";
          str += "\n" + tab + branch + (child ? " " + child : "");
        }
        return str;
      };
      exports.printTree = printTree;
    },
    5477: (module) => {
      var __extends;
      var __assign;
      var __rest;
      var __decorate;
      var __param;
      var __esDecorate;
      var __runInitializers;
      var __propKey;
      var __setFunctionName;
      var __metadata;
      var __awaiter;
      var __generator;
      var __exportStar;
      var __values;
      var __read;
      var __spread;
      var __spreadArrays;
      var __spreadArray;
      var __await;
      var __asyncGenerator;
      var __asyncDelegator;
      var __asyncValues;
      var __makeTemplateObject;
      var __importStar;
      var __importDefault;
      var __classPrivateFieldGet;
      var __classPrivateFieldSet;
      var __classPrivateFieldIn;
      var __createBinding;
      var __addDisposableResource;
      var __disposeResources;
      var __rewriteRelativeImportExtension;
      (function (factory) {
        var root =
          typeof global === "object"
            ? global
            : typeof self === "object"
              ? self
              : typeof this === "object"
                ? this
                : {};
        if (typeof define === "function" && define.amd) {
          define("tslib", ["exports"], function (exports) {
            factory(createExporter(root, createExporter(exports)));
          });
        } else if (true && typeof module.exports === "object") {
          factory(createExporter(root, createExporter(module.exports)));
        } else {
          factory(createExporter(root));
        }
        function createExporter(exports, previous) {
          if (exports !== root) {
            if (typeof Object.create === "function") {
              Object.defineProperty(exports, "__esModule", { value: true });
            } else {
              exports.__esModule = true;
            }
          }
          return function (id, v) {
            return (exports[id] = previous ? previous(id, v) : v);
          };
        }
      })(function (exporter) {
        var extendStatics =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (d, b) {
              d.__proto__ = b;
            }) ||
          function (d, b) {
            for (var p in b)
              if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
          };
        __extends = function (d, b) {
          if (typeof b !== "function" && b !== null)
            throw new TypeError(
              "Class extends value " +
                String(b) +
                " is not a constructor or null",
            );
          extendStatics(d, b);
          function __() {
            this.constructor = d;
          }
          d.prototype =
            b === null
              ? Object.create(b)
              : ((__.prototype = b.prototype), new __());
        };
        __assign =
          Object.assign ||
          function (t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
          };
        __rest = function (s, e) {
          var t = {};
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
              t[p] = s[p];
          if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (
              var i = 0, p = Object.getOwnPropertySymbols(s);
              i < p.length;
              i++
            ) {
              if (
                e.indexOf(p[i]) < 0 &&
                Object.prototype.propertyIsEnumerable.call(s, p[i])
              )
                t[p[i]] = s[p[i]];
            }
          return t;
        };
        __decorate = function (decorators, target, key, desc) {
          var c = arguments.length,
            r =
              c < 3
                ? target
                : desc === null
                  ? (desc = Object.getOwnPropertyDescriptor(target, key))
                  : desc,
            d;
          if (
            typeof Reflect === "object" &&
            typeof Reflect.decorate === "function"
          )
            r = Reflect.decorate(decorators, target, key, desc);
          else
            for (var i = decorators.length - 1; i >= 0; i--)
              if ((d = decorators[i]))
                r =
                  (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) ||
                  r;
          return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        __param = function (paramIndex, decorator) {
          return function (target, key) {
            decorator(target, key, paramIndex);
          };
        };
        __esDecorate = function (
          ctor,
          descriptorIn,
          decorators,
          contextIn,
          initializers,
          extraInitializers,
        ) {
          function accept(f) {
            if (f !== void 0 && typeof f !== "function")
              throw new TypeError("Function expected");
            return f;
          }
          var kind = contextIn.kind,
            key =
              kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
          var target =
            !descriptorIn && ctor
              ? contextIn["static"]
                ? ctor
                : ctor.prototype
              : null;
          var descriptor =
            descriptorIn ||
            (target
              ? Object.getOwnPropertyDescriptor(target, contextIn.name)
              : {});
          var _,
            done = false;
          for (var i = decorators.length - 1; i >= 0; i--) {
            var context = {};
            for (var p in contextIn)
              context[p] = p === "access" ? {} : contextIn[p];
            for (var p in contextIn.access)
              context.access[p] = contextIn.access[p];
            context.addInitializer = function (f) {
              if (done)
                throw new TypeError(
                  "Cannot add initializers after decoration has completed",
                );
              extraInitializers.push(accept(f || null));
            };
            var result = (0, decorators[i])(
              kind === "accessor"
                ? { get: descriptor.get, set: descriptor.set }
                : descriptor[key],
              context,
            );
            if (kind === "accessor") {
              if (result === void 0) continue;
              if (result === null || typeof result !== "object")
                throw new TypeError("Object expected");
              if ((_ = accept(result.get))) descriptor.get = _;
              if ((_ = accept(result.set))) descriptor.set = _;
              if ((_ = accept(result.init))) initializers.unshift(_);
            } else if ((_ = accept(result))) {
              if (kind === "field") initializers.unshift(_);
              else descriptor[key] = _;
            }
          }
          if (target) Object.defineProperty(target, contextIn.name, descriptor);
          done = true;
        };
        __runInitializers = function (thisArg, initializers, value) {
          var useValue = arguments.length > 2;
          for (var i = 0; i < initializers.length; i++) {
            value = useValue
              ? initializers[i].call(thisArg, value)
              : initializers[i].call(thisArg);
          }
          return useValue ? value : void 0;
        };
        __propKey = function (x) {
          return typeof x === "symbol" ? x : "".concat(x);
        };
        __setFunctionName = function (f, name, prefix) {
          if (typeof name === "symbol")
            name = name.description ? "[".concat(name.description, "]") : "";
          return Object.defineProperty(f, "name", {
            configurable: true,
            value: prefix ? "".concat(prefix, " ", name) : name,
          });
        };
        __metadata = function (metadataKey, metadataValue) {
          if (
            typeof Reflect === "object" &&
            typeof Reflect.metadata === "function"
          )
            return Reflect.metadata(metadataKey, metadataValue);
        };
        __awaiter = function (thisArg, _arguments, P, generator) {
          function adopt(value) {
            return value instanceof P
              ? value
              : new P(function (resolve) {
                  resolve(value);
                });
          }
          return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
              try {
                step(generator.next(value));
              } catch (e) {
                reject(e);
              }
            }
            function rejected(value) {
              try {
                step(generator["throw"](value));
              } catch (e) {
                reject(e);
              }
            }
            function step(result) {
              result.done
                ? resolve(result.value)
                : adopt(result.value).then(fulfilled, rejected);
            }
            step(
              (generator = generator.apply(thisArg, _arguments || [])).next(),
            );
          });
        };
        __generator = function (thisArg, body) {
          var _ = {
              label: 0,
              sent: function () {
                if (t[0] & 1) throw t[1];
                return t[1];
              },
              trys: [],
              ops: [],
            },
            f,
            y,
            t,
            g = Object.create(
              (typeof Iterator === "function" ? Iterator : Object).prototype,
            );
          return (
            (g.next = verb(0)),
            (g["throw"] = verb(1)),
            (g["return"] = verb(2)),
            typeof Symbol === "function" &&
              (g[Symbol.iterator] = function () {
                return this;
              }),
            g
          );
          function verb(n) {
            return function (v) {
              return step([n, v]);
            };
          }
          function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while ((g && ((g = 0), op[0] && (_ = 0)), _))
              try {
                if (
                  ((f = 1),
                  y &&
                    (t =
                      op[0] & 2
                        ? y["return"]
                        : op[0]
                          ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                          : y.next) &&
                    !(t = t.call(y, op[1])).done)
                )
                  return t;
                if (((y = 0), t)) op = [op[0] & 2, t.value];
                switch (op[0]) {
                  case 0:
                  case 1:
                    t = op;
                    break;
                  case 4:
                    _.label++;
                    return { value: op[1], done: false };
                  case 5:
                    _.label++;
                    y = op[1];
                    op = [0];
                    continue;
                  case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                  default:
                    if (
                      !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                      (op[0] === 6 || op[0] === 2)
                    ) {
                      _ = 0;
                      continue;
                    }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                      _.label = op[1];
                      break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                      _.label = t[1];
                      t = op;
                      break;
                    }
                    if (t && _.label < t[2]) {
                      _.label = t[2];
                      _.ops.push(op);
                      break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
                }
                op = body.call(thisArg, _);
              } catch (e) {
                op = [6, e];
                y = 0;
              } finally {
                f = t = 0;
              }
            if (op[0] & 5) throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
          }
        };
        __exportStar = function (m, o) {
          for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
              __createBinding(o, m, p);
        };
        __createBinding = Object.create
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
            };
        __values = function (o) {
          var s = typeof Symbol === "function" && Symbol.iterator,
            m = s && o[s],
            i = 0;
          if (m) return m.call(o);
          if (o && typeof o.length === "number")
            return {
              next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
              },
            };
          throw new TypeError(
            s ? "Object is not iterable." : "Symbol.iterator is not defined.",
          );
        };
        __read = function (o, n) {
          var m = typeof Symbol === "function" && o[Symbol.iterator];
          if (!m) return o;
          var i = m.call(o),
            r,
            ar = [],
            e;
          try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
              ar.push(r.value);
          } catch (error) {
            e = { error };
          } finally {
            try {
              if (r && !r.done && (m = i["return"])) m.call(i);
            } finally {
              if (e) throw e.error;
            }
          }
          return ar;
        };
        __spread = function () {
          for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
          return ar;
        };
        __spreadArrays = function () {
          for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
          for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
              r[k] = a[j];
          return r;
        };
        __spreadArray = function (to, from, pack) {
          if (pack || arguments.length === 2)
            for (var i = 0, l = from.length, ar; i < l; i++) {
              if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
              }
            }
          return to.concat(ar || Array.prototype.slice.call(from));
        };
        __await = function (v) {
          return this instanceof __await
            ? ((this.v = v), this)
            : new __await(v);
        };
        __asyncGenerator = function (thisArg, _arguments, generator) {
          if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
          var g = generator.apply(thisArg, _arguments || []),
            i,
            q = [];
          return (
            (i = Object.create(
              (typeof AsyncIterator === "function" ? AsyncIterator : Object)
                .prototype,
            )),
            verb("next"),
            verb("throw"),
            verb("return", awaitReturn),
            (i[Symbol.asyncIterator] = function () {
              return this;
            }),
            i
          );
          function awaitReturn(f) {
            return function (v) {
              return Promise.resolve(v).then(f, reject);
            };
          }
          function verb(n, f) {
            if (g[n]) {
              i[n] = function (v) {
                return new Promise(function (a, b) {
                  q.push([n, v, a, b]) > 1 || resume(n, v);
                });
              };
              if (f) i[n] = f(i[n]);
            }
          }
          function resume(n, v) {
            try {
              step(g[n](v));
            } catch (e) {
              settle(q[0][3], e);
            }
          }
          function step(r) {
            r.value instanceof __await
              ? Promise.resolve(r.value.v).then(fulfill, reject)
              : settle(q[0][2], r);
          }
          function fulfill(value) {
            resume("next", value);
          }
          function reject(value) {
            resume("throw", value);
          }
          function settle(f, v) {
            if ((f(v), q.shift(), q.length)) resume(q[0][0], q[0][1]);
          }
        };
        __asyncDelegator = function (o) {
          var i, p;
          return (
            (i = {}),
            verb("next"),
            verb("throw", function (e) {
              throw e;
            }),
            verb("return"),
            (i[Symbol.iterator] = function () {
              return this;
            }),
            i
          );
          function verb(n, f) {
            i[n] = o[n]
              ? function (v) {
                  return (p = !p)
                    ? { value: __await(o[n](v)), done: false }
                    : f
                      ? f(v)
                      : v;
                }
              : f;
          }
        };
        __asyncValues = function (o) {
          if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
          var m = o[Symbol.asyncIterator],
            i;
          return m
            ? m.call(o)
            : ((o =
                typeof __values === "function"
                  ? __values(o)
                  : o[Symbol.iterator]()),
              (i = {}),
              verb("next"),
              verb("throw"),
              verb("return"),
              (i[Symbol.asyncIterator] = function () {
                return this;
              }),
              i);
          function verb(n) {
            i[n] =
              o[n] &&
              function (v) {
                return new Promise(function (resolve, reject) {
                  (v = o[n](v)), settle(resolve, reject, v.done, v.value);
                });
              };
          }
          function settle(resolve, reject, d, v) {
            Promise.resolve(v).then(function (v) {
              resolve({ value: v, done: d });
            }, reject);
          }
        };
        __makeTemplateObject = function (cooked, raw) {
          if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
          } else {
            cooked.raw = raw;
          }
          return cooked;
        };
        var __setModuleDefault = Object.create
          ? function (o, v) {
              Object.defineProperty(o, "default", {
                enumerable: true,
                value: v,
              });
            }
          : function (o, v) {
              o["default"] = v;
            };
        var ownKeys = function (o) {
          ownKeys =
            Object.getOwnPropertyNames ||
            function (o) {
              var ar = [];
              for (var k in o)
                if (Object.prototype.hasOwnProperty.call(o, k))
                  ar[ar.length] = k;
              return ar;
            };
          return ownKeys(o);
        };
        __importStar = function (mod) {
          if (mod && mod.__esModule) return mod;
          var result = {};
          if (mod != null)
            for (var k = ownKeys(mod), i = 0; i < k.length; i++)
              if (k[i] !== "default") __createBinding(result, mod, k[i]);
          __setModuleDefault(result, mod);
          return result;
        };
        __importDefault = function (mod) {
          return mod && mod.__esModule ? mod : { default: mod };
        };
        __classPrivateFieldGet = function (receiver, state, kind, f) {
          if (kind === "a" && !f)
            throw new TypeError(
              "Private accessor was defined without a getter",
            );
          if (
            typeof state === "function"
              ? receiver !== state || !f
              : !state.has(receiver)
          )
            throw new TypeError(
              "Cannot read private member from an object whose class did not declare it",
            );
          return kind === "m"
            ? f
            : kind === "a"
              ? f.call(receiver)
              : f
                ? f.value
                : state.get(receiver);
        };
        __classPrivateFieldSet = function (receiver, state, value, kind, f) {
          if (kind === "m")
            throw new TypeError("Private method is not writable");
          if (kind === "a" && !f)
            throw new TypeError(
              "Private accessor was defined without a setter",
            );
          if (
            typeof state === "function"
              ? receiver !== state || !f
              : !state.has(receiver)
          )
            throw new TypeError(
              "Cannot write private member to an object whose class did not declare it",
            );
          return (
            kind === "a"
              ? f.call(receiver, value)
              : f
                ? (f.value = value)
                : state.set(receiver, value),
            value
          );
        };
        __classPrivateFieldIn = function (state, receiver) {
          if (
            receiver === null ||
            (typeof receiver !== "object" && typeof receiver !== "function")
          )
            throw new TypeError("Cannot use 'in' operator on non-object");
          return typeof state === "function"
            ? receiver === state
            : state.has(receiver);
        };
        __addDisposableResource = function (env, value, async) {
          if (value !== null && value !== void 0) {
            if (typeof value !== "object" && typeof value !== "function")
              throw new TypeError("Object expected.");
            var dispose, inner;
            if (async) {
              if (!Symbol.asyncDispose)
                throw new TypeError("Symbol.asyncDispose is not defined.");
              dispose = value[Symbol.asyncDispose];
            }
            if (dispose === void 0) {
              if (!Symbol.dispose)
                throw new TypeError("Symbol.dispose is not defined.");
              dispose = value[Symbol.dispose];
              if (async) inner = dispose;
            }
            if (typeof dispose !== "function")
              throw new TypeError("Object not disposable.");
            if (inner)
              dispose = function () {
                try {
                  inner.call(this);
                } catch (e) {
                  return Promise.reject(e);
                }
              };
            env.stack.push({ value, dispose, async });
          } else if (async) {
            env.stack.push({ async: true });
          }
          return value;
        };
        var _SuppressedError =
          typeof SuppressedError === "function"
            ? SuppressedError
            : function (error, suppressed, message) {
                var e = new Error(message);
                return (
                  (e.name = "SuppressedError"),
                  (e.error = error),
                  (e.suppressed = suppressed),
                  e
                );
              };
        __disposeResources = function (env) {
          function fail(e) {
            env.error = env.hasError
              ? new _SuppressedError(
                  e,
                  env.error,
                  "An error was suppressed during disposal.",
                )
              : e;
            env.hasError = true;
          }
          var r,
            s = 0;
          function next() {
            while ((r = env.stack.pop())) {
              try {
                if (!r.async && s === 1)
                  return (
                    (s = 0), env.stack.push(r), Promise.resolve().then(next)
                  );
                if (r.dispose) {
                  var result = r.dispose.call(r.value);
                  if (r.async)
                    return (
                      (s |= 2),
                      Promise.resolve(result).then(next, function (e) {
                        fail(e);
                        return next();
                      })
                    );
                } else s |= 1;
              } catch (e) {
                fail(e);
              }
            }
            if (s === 1)
              return env.hasError
                ? Promise.reject(env.error)
                : Promise.resolve();
            if (env.hasError) throw env.error;
          }
          return next();
        };
        __rewriteRelativeImportExtension = function (path, preserveJsx) {
          if (typeof path === "string" && /^\.\.?\//.test(path)) {
            return path.replace(
              /\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i,
              function (m, tsx, d, ext, cm) {
                return tsx
                  ? preserveJsx
                    ? ".jsx"
                    : ".js"
                  : d && (!ext || !cm)
                    ? m
                    : d + ext + "." + cm.toLowerCase() + "js";
              },
            );
          }
          return path;
        };
        exporter("__extends", __extends);
        exporter("__assign", __assign);
        exporter("__rest", __rest);
        exporter("__decorate", __decorate);
        exporter("__param", __param);
        exporter("__esDecorate", __esDecorate);
        exporter("__runInitializers", __runInitializers);
        exporter("__propKey", __propKey);
        exporter("__setFunctionName", __setFunctionName);
        exporter("__metadata", __metadata);
        exporter("__awaiter", __awaiter);
        exporter("__generator", __generator);
        exporter("__exportStar", __exportStar);
        exporter("__createBinding", __createBinding);
        exporter("__values", __values);
        exporter("__read", __read);
        exporter("__spread", __spread);
        exporter("__spreadArrays", __spreadArrays);
        exporter("__spreadArray", __spreadArray);
        exporter("__await", __await);
        exporter("__asyncGenerator", __asyncGenerator);
        exporter("__asyncDelegator", __asyncDelegator);
        exporter("__asyncValues", __asyncValues);
        exporter("__makeTemplateObject", __makeTemplateObject);
        exporter("__importStar", __importStar);
        exporter("__importDefault", __importDefault);
        exporter("__classPrivateFieldGet", __classPrivateFieldGet);
        exporter("__classPrivateFieldSet", __classPrivateFieldSet);
        exporter("__classPrivateFieldIn", __classPrivateFieldIn);
        exporter("__addDisposableResource", __addDisposableResource);
        exporter("__disposeResources", __disposeResources);
        exporter(
          "__rewriteRelativeImportExtension",
          __rewriteRelativeImportExtension,
        );
      });
      0 && 0;
    },
    8311: (module) => {
      "use strict";
      module.exports = require("../mrmime");
    },
    8679: (module) => {
      "use strict";
      module.exports = require("../rslog");
    },
    2613: (module) => {
      "use strict";
      module.exports = require("assert");
    },
    290: (module) => {
      "use strict";
      module.exports = require("async_hooks");
    },
    181: (module) => {
      "use strict";
      module.exports = require("buffer");
    },
    4434: (module) => {
      "use strict";
      module.exports = require("events");
    },
    9896: (module) => {
      "use strict";
      module.exports = require("fs");
    },
    6928: (module) => {
      "use strict";
      module.exports = require("path");
    },
    932: (module) => {
      "use strict";
      module.exports = require("process");
    },
    3480: (module) => {
      "use strict";
      module.exports = require("querystring");
    },
    2203: (module) => {
      "use strict";
      module.exports = require("stream");
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
  var __webpack_exports__ = __nccwpck_require__(9185);
  module.exports = __webpack_exports__;
})();
