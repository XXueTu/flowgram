(() => {
  var __webpack_modules__ = {
    7229: (module, __unused_webpack_exports, __nccwpck_require__) => {
      module.exports = {
        version: __nccwpck_require__(6069),
        stringifyInfo: __nccwpck_require__(2009),
        stringifyStream: __nccwpck_require__(585),
        parseChunked: __nccwpck_require__(6959),
      };
    },
    6959: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const { isReadableStream } = __nccwpck_require__(1816);
      const TextDecoder = __nccwpck_require__(3775);
      const STACK_OBJECT = 1;
      const STACK_ARRAY = 2;
      const decoder = new TextDecoder();
      function isObject(value) {
        return value !== null && typeof value === "object";
      }
      function adjustPosition(error, parser) {
        if (error.name === "SyntaxError" && parser.jsonParseOffset) {
          error.message = error.message.replace(
            /at position (\d+)/,
            (_, pos) => "at position " + (Number(pos) + parser.jsonParseOffset),
          );
        }
        return error;
      }
      function append(array, elements) {
        const initialLength = array.length;
        array.length += elements.length;
        for (let i = 0; i < elements.length; i++) {
          array[initialLength + i] = elements[i];
        }
      }
      module.exports = function (chunkEmitter) {
        let parser = new ChunkParser();
        if (isObject(chunkEmitter) && isReadableStream(chunkEmitter)) {
          return new Promise((resolve, reject) => {
            chunkEmitter
              .on("data", (chunk) => {
                try {
                  parser.push(chunk);
                } catch (e) {
                  reject(adjustPosition(e, parser));
                  parser = null;
                }
              })
              .on("error", (e) => {
                parser = null;
                reject(e);
              })
              .on("end", () => {
                try {
                  resolve(parser.finish());
                } catch (e) {
                  reject(adjustPosition(e, parser));
                } finally {
                  parser = null;
                }
              });
          });
        }
        if (typeof chunkEmitter === "function") {
          const iterator = chunkEmitter();
          if (
            isObject(iterator) &&
            (Symbol.iterator in iterator || Symbol.asyncIterator in iterator)
          ) {
            return new Promise(async (resolve, reject) => {
              try {
                for await (const chunk of iterator) {
                  parser.push(chunk);
                }
                resolve(parser.finish());
              } catch (e) {
                reject(adjustPosition(e, parser));
              } finally {
                parser = null;
              }
            });
          }
        }
        throw new Error(
          "Chunk emitter should be readable stream, generator, " +
            "async generator or function returning an iterable object",
        );
      };
      class ChunkParser {
        constructor() {
          this.value = undefined;
          this.valueStack = null;
          this.stack = new Array(100);
          this.lastFlushDepth = 0;
          this.flushDepth = 0;
          this.stateString = false;
          this.stateStringEscape = false;
          this.pendingByteSeq = null;
          this.pendingChunk = null;
          this.chunkOffset = 0;
          this.jsonParseOffset = 0;
        }
        parseAndAppend(fragment, wrap) {
          if (this.stack[this.lastFlushDepth - 1] === STACK_OBJECT) {
            if (wrap) {
              this.jsonParseOffset--;
              fragment = "{" + fragment + "}";
            }
            Object.assign(this.valueStack.value, JSON.parse(fragment));
          } else {
            if (wrap) {
              this.jsonParseOffset--;
              fragment = "[" + fragment + "]";
            }
            append(this.valueStack.value, JSON.parse(fragment));
          }
        }
        prepareAddition(fragment) {
          const { value } = this.valueStack;
          const expectComma = Array.isArray(value)
            ? value.length !== 0
            : Object.keys(value).length !== 0;
          if (expectComma) {
            if (fragment[0] === ",") {
              this.jsonParseOffset++;
              return fragment.slice(1);
            }
            if (fragment[0] !== "}" && fragment[0] !== "]") {
              this.jsonParseOffset -= 3;
              return "[[]" + fragment;
            }
          }
          return fragment;
        }
        flush(chunk, start, end) {
          let fragment = chunk.slice(start, end);
          this.jsonParseOffset = this.chunkOffset + start;
          if (this.pendingChunk !== null) {
            fragment = this.pendingChunk + fragment;
            this.jsonParseOffset -= this.pendingChunk.length;
            this.pendingChunk = null;
          }
          if (this.flushDepth === this.lastFlushDepth) {
            if (this.flushDepth > 0) {
              this.parseAndAppend(this.prepareAddition(fragment), true);
            } else {
              this.value = JSON.parse(fragment);
              this.valueStack = { value: this.value, prev: null };
            }
          } else if (this.flushDepth > this.lastFlushDepth) {
            for (let i = this.flushDepth - 1; i >= this.lastFlushDepth; i--) {
              fragment += this.stack[i] === STACK_OBJECT ? "}" : "]";
            }
            if (this.lastFlushDepth === 0) {
              this.value = JSON.parse(fragment);
              this.valueStack = { value: this.value, prev: null };
            } else {
              this.parseAndAppend(this.prepareAddition(fragment), true);
            }
            for (let i = this.lastFlushDepth || 1; i < this.flushDepth; i++) {
              let value = this.valueStack.value;
              if (this.stack[i - 1] === STACK_OBJECT) {
                let key;
                for (key in value);
                value = value[key];
              } else {
                value = value[value.length - 1];
              }
              this.valueStack = { value, prev: this.valueStack };
            }
          } else {
            fragment = this.prepareAddition(fragment);
            for (let i = this.lastFlushDepth - 1; i >= this.flushDepth; i--) {
              this.jsonParseOffset--;
              fragment =
                (this.stack[i] === STACK_OBJECT ? "{" : "[") + fragment;
            }
            this.parseAndAppend(fragment, false);
            for (let i = this.lastFlushDepth - 1; i >= this.flushDepth; i--) {
              this.valueStack = this.valueStack.prev;
            }
          }
          this.lastFlushDepth = this.flushDepth;
        }
        push(chunk) {
          if (typeof chunk !== "string") {
            if (this.pendingByteSeq !== null) {
              const origRawChunk = chunk;
              chunk = new Uint8Array(
                this.pendingByteSeq.length + origRawChunk.length,
              );
              chunk.set(this.pendingByteSeq);
              chunk.set(origRawChunk, this.pendingByteSeq.length);
              this.pendingByteSeq = null;
            }
            if (chunk[chunk.length - 1] > 127) {
              for (let seqLength = 0; seqLength < chunk.length; seqLength++) {
                const byte = chunk[chunk.length - 1 - seqLength];
                if (byte >> 6 === 3) {
                  seqLength++;
                  if (
                    (seqLength !== 4 && byte >> 3 === 30) ||
                    (seqLength !== 3 && byte >> 4 === 14) ||
                    (seqLength !== 2 && byte >> 5 === 6)
                  ) {
                    this.pendingByteSeq = chunk.slice(chunk.length - seqLength);
                    chunk = chunk.slice(0, -seqLength);
                  }
                  break;
                }
              }
            }
            chunk = decoder.decode(chunk);
          }
          const chunkLength = chunk.length;
          let lastFlushPoint = 0;
          let flushPoint = 0;
          scan: for (let i = 0; i < chunkLength; i++) {
            if (this.stateString) {
              for (; i < chunkLength; i++) {
                if (this.stateStringEscape) {
                  this.stateStringEscape = false;
                } else {
                  switch (chunk.charCodeAt(i)) {
                    case 34:
                      this.stateString = false;
                      continue scan;
                    case 92:
                      this.stateStringEscape = true;
                  }
                }
              }
              break;
            }
            switch (chunk.charCodeAt(i)) {
              case 34:
                this.stateString = true;
                this.stateStringEscape = false;
                break;
              case 44:
                flushPoint = i;
                break;
              case 123:
                flushPoint = i + 1;
                this.stack[this.flushDepth++] = STACK_OBJECT;
                break;
              case 91:
                flushPoint = i + 1;
                this.stack[this.flushDepth++] = STACK_ARRAY;
                break;
              case 93:
              case 125:
                flushPoint = i + 1;
                this.flushDepth--;
                if (this.flushDepth < this.lastFlushDepth) {
                  this.flush(chunk, lastFlushPoint, flushPoint);
                  lastFlushPoint = flushPoint;
                }
                break;
              case 9:
              case 10:
              case 13:
              case 32:
                if (lastFlushPoint === i) {
                  lastFlushPoint++;
                }
                if (flushPoint === i) {
                  flushPoint++;
                }
                break;
            }
          }
          if (flushPoint > lastFlushPoint) {
            this.flush(chunk, lastFlushPoint, flushPoint);
          }
          if (flushPoint < chunkLength) {
            if (this.pendingChunk !== null) {
              this.pendingChunk += chunk;
            } else {
              this.pendingChunk = chunk.slice(flushPoint, chunkLength);
            }
          }
          this.chunkOffset += chunkLength;
        }
        finish() {
          if (this.pendingChunk !== null) {
            this.flush("", 0, 0);
            this.pendingChunk = null;
          }
          return this.value;
        }
      }
    },
    2009: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const {
        normalizeReplacer,
        normalizeSpace,
        replaceValue,
        getTypeNative,
        getTypeAsync,
        isLeadingSurrogate,
        isTrailingSurrogate,
        escapableCharCodeSubstitution,
        type: {
          PRIMITIVE,
          OBJECT,
          ARRAY,
          PROMISE,
          STRING_STREAM,
          OBJECT_STREAM,
        },
      } = __nccwpck_require__(1816);
      const charLength2048 = Array.from({ length: 2048 }).map((_, code) => {
        if (escapableCharCodeSubstitution.hasOwnProperty(code)) {
          return 2;
        }
        if (code < 32) {
          return 6;
        }
        return code < 128 ? 1 : 2;
      });
      function stringLength(str) {
        let len = 0;
        let prevLeadingSurrogate = false;
        for (let i = 0; i < str.length; i++) {
          const code = str.charCodeAt(i);
          if (code < 2048) {
            len += charLength2048[code];
          } else if (isLeadingSurrogate(code)) {
            len += 6;
            prevLeadingSurrogate = true;
            continue;
          } else if (isTrailingSurrogate(code)) {
            len = prevLeadingSurrogate ? len - 2 : len + 6;
          } else {
            len += 3;
          }
          prevLeadingSurrogate = false;
        }
        return len + 2;
      }
      function primitiveLength(value) {
        switch (typeof value) {
          case "string":
            return stringLength(value);
          case "number":
            return Number.isFinite(value) ? String(value).length : 4;
          case "boolean":
            return value ? 4 : 5;
          case "undefined":
          case "object":
            return 4;
          default:
            return 0;
        }
      }
      function spaceLength(space) {
        space = normalizeSpace(space);
        return typeof space === "string" ? space.length : 0;
      }
      module.exports = function jsonStringifyInfo(
        value,
        replacer,
        space,
        options,
      ) {
        function walk(holder, key, value) {
          if (stop) {
            return;
          }
          value = replaceValue(holder, key, value, replacer);
          let type = getType(value);
          if (type !== PRIMITIVE && stack.has(value)) {
            circular.add(value);
            length += 4;
            if (!options.continueOnCircular) {
              stop = true;
            }
            return;
          }
          switch (type) {
            case PRIMITIVE:
              if (value !== undefined || Array.isArray(holder)) {
                length += primitiveLength(value);
              } else if (holder === root) {
                length += 9;
              }
              break;
            case OBJECT: {
              if (visited.has(value)) {
                duplicate.add(value);
                length += visited.get(value);
                break;
              }
              const valueLength = length;
              let entries = 0;
              length += 2;
              stack.add(value);
              for (const key in value) {
                if (
                  hasOwnProperty.call(value, key) &&
                  (allowlist === null || allowlist.has(key))
                ) {
                  const prevLength = length;
                  walk(value, key, value[key]);
                  if (prevLength !== length) {
                    length += stringLength(key) + 1;
                    entries++;
                  }
                }
              }
              if (entries > 1) {
                length += entries - 1;
              }
              stack.delete(value);
              if (space > 0 && entries > 0) {
                length += (1 + (stack.size + 1) * space + 1) * entries;
                length += 1 + stack.size * space;
              }
              visited.set(value, length - valueLength);
              break;
            }
            case ARRAY: {
              if (visited.has(value)) {
                duplicate.add(value);
                length += visited.get(value);
                break;
              }
              const valueLength = length;
              length += 2;
              stack.add(value);
              for (let i = 0; i < value.length; i++) {
                walk(value, i, value[i]);
              }
              if (value.length > 1) {
                length += value.length - 1;
              }
              stack.delete(value);
              if (space > 0 && value.length > 0) {
                length += (1 + (stack.size + 1) * space) * value.length;
                length += 1 + stack.size * space;
              }
              visited.set(value, length - valueLength);
              break;
            }
            case PROMISE:
            case STRING_STREAM:
              async.add(value);
              break;
            case OBJECT_STREAM:
              length += 2;
              async.add(value);
              break;
          }
        }
        let allowlist = null;
        replacer = normalizeReplacer(replacer);
        if (Array.isArray(replacer)) {
          allowlist = new Set(replacer);
          replacer = null;
        }
        space = spaceLength(space);
        options = options || {};
        const visited = new Map();
        const stack = new Set();
        const duplicate = new Set();
        const circular = new Set();
        const async = new Set();
        const getType = options.async ? getTypeAsync : getTypeNative;
        const root = { "": value };
        let stop = false;
        let length = 0;
        walk(root, "", value);
        return {
          minLength: isNaN(length) ? Infinity : length,
          circular: [...circular],
          duplicate: [...duplicate],
          async: [...async],
        };
      };
    },
    585: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const { Readable } = __nccwpck_require__(2203);
      const {
        normalizeReplacer,
        normalizeSpace,
        replaceValue,
        getTypeAsync,
        type: {
          PRIMITIVE,
          OBJECT,
          ARRAY,
          PROMISE,
          STRING_STREAM,
          OBJECT_STREAM,
        },
      } = __nccwpck_require__(1816);
      const noop = () => {};
      const hasOwnProperty = Object.prototype.hasOwnProperty;
      const wellformedStringStringify =
        JSON.stringify("\ud800") === '"\\ud800"'
          ? JSON.stringify
          : (s) =>
              JSON.stringify(s).replace(
                /\p{Surrogate}/gu,
                (m) => `\\u${m.charCodeAt(0).toString(16)}`,
              );
      function push() {
        this.push(this._stack.value);
        this.popStack();
      }
      function pushPrimitive(value) {
        switch (typeof value) {
          case "string":
            this.push(this.encodeString(value));
            break;
          case "number":
            this.push(
              Number.isFinite(value) ? this.encodeNumber(value) : "null",
            );
            break;
          case "boolean":
            this.push(value ? "true" : "false");
            break;
          case "undefined":
          case "object":
            this.push("null");
            break;
          default:
            this.destroy(
              new TypeError(
                `Do not know how to serialize a ${(value.constructor && value.constructor.name) || typeof value}`,
              ),
            );
        }
      }
      function processObjectEntry(key) {
        const current = this._stack;
        if (!current.first) {
          current.first = true;
        } else {
          this.push(",");
        }
        if (this.space) {
          this.push(
            `\n${this.space.repeat(this._depth)}${this.encodeString(key)}: `,
          );
        } else {
          this.push(this.encodeString(key) + ":");
        }
      }
      function processObject() {
        const current = this._stack;
        if (current.index === current.keys.length) {
          if (this.space && current.first) {
            this.push(`\n${this.space.repeat(this._depth - 1)}}`);
          } else {
            this.push("}");
          }
          this.popStack();
          return;
        }
        const key = current.keys[current.index];
        this.processValue(
          current.value,
          key,
          current.value[key],
          processObjectEntry,
        );
        current.index++;
      }
      function processArrayItem(index) {
        if (index !== 0) {
          this.push(",");
        }
        if (this.space) {
          this.push(`\n${this.space.repeat(this._depth)}`);
        }
      }
      function processArray() {
        const current = this._stack;
        if (current.index === current.value.length) {
          if (this.space && current.index > 0) {
            this.push(`\n${this.space.repeat(this._depth - 1)}]`);
          } else {
            this.push("]");
          }
          this.popStack();
          return;
        }
        this.processValue(
          current.value,
          current.index,
          current.value[current.index],
          processArrayItem,
        );
        current.index++;
      }
      function createStreamReader(fn) {
        return function () {
          const current = this._stack;
          const data = current.value.read(this._readSize);
          if (data !== null) {
            current.first = false;
            fn.call(this, data, current);
          } else {
            if (
              (current.first && !current.value._readableState.reading) ||
              current.ended
            ) {
              this.popStack();
            } else {
              current.first = true;
              current.awaiting = true;
            }
          }
        };
      }
      const processReadableObject = createStreamReader(
        function (data, current) {
          this.processValue(
            current.value,
            current.index,
            data,
            processArrayItem,
          );
          current.index++;
        },
      );
      const processReadableString = createStreamReader(function (data) {
        this.push(data);
      });
      class JsonStringifyStream extends Readable {
        constructor(value, replacer, space) {
          super({ autoDestroy: true });
          this.getKeys = Object.keys;
          this.replacer = normalizeReplacer(replacer);
          if (Array.isArray(this.replacer)) {
            const allowlist = this.replacer;
            this.getKeys = (value) =>
              allowlist.filter((key) => hasOwnProperty.call(value, key));
            this.replacer = null;
          }
          this.space = normalizeSpace(space);
          this._depth = 0;
          this.error = null;
          this._processing = false;
          this._ended = false;
          this._readSize = 0;
          this._buffer = "";
          this._stack = null;
          this._visited = new WeakSet();
          this.pushStack({
            handler: () => {
              this.popStack();
              this.processValue({ "": value }, "", value, noop);
            },
          });
        }
        encodeString(value) {
          if (/[^\x20-\uD799]|[\x22\x5c]/.test(value)) {
            return wellformedStringStringify(value);
          }
          return '"' + value + '"';
        }
        encodeNumber(value) {
          return value;
        }
        processValue(holder, key, value, callback) {
          value = replaceValue(holder, key, value, this.replacer);
          let type = getTypeAsync(value);
          switch (type) {
            case PRIMITIVE:
              if (callback !== processObjectEntry || value !== undefined) {
                callback.call(this, key);
                pushPrimitive.call(this, value);
              }
              break;
            case OBJECT:
              callback.call(this, key);
              if (this._visited.has(value)) {
                return this.destroy(
                  new TypeError("Converting circular structure to JSON"),
                );
              }
              this._visited.add(value);
              this._depth++;
              this.push("{");
              this.pushStack({
                handler: processObject,
                value,
                index: 0,
                first: false,
                keys: this.getKeys(value),
              });
              break;
            case ARRAY:
              callback.call(this, key);
              if (this._visited.has(value)) {
                return this.destroy(
                  new TypeError("Converting circular structure to JSON"),
                );
              }
              this._visited.add(value);
              this.push("[");
              this.pushStack({ handler: processArray, value, index: 0 });
              this._depth++;
              break;
            case PROMISE:
              this.pushStack({ handler: noop, awaiting: true });
              Promise.resolve(value)
                .then((resolved) => {
                  this.popStack();
                  this.processValue(holder, key, resolved, callback);
                  this.processStack();
                })
                .catch((error) => {
                  this.destroy(error);
                });
              break;
            case STRING_STREAM:
            case OBJECT_STREAM:
              callback.call(this, key);
              if (value.readableEnded || value._readableState.endEmitted) {
                return this.destroy(
                  new Error(
                    "Readable Stream has ended before it was serialized. All stream data have been lost",
                  ),
                );
              }
              if (value.readableFlowing) {
                return this.destroy(
                  new Error(
                    "Readable Stream is in flowing mode, data may have been lost. Trying to pause stream.",
                  ),
                );
              }
              if (type === OBJECT_STREAM) {
                this.push("[");
                this.pushStack({
                  handler: push,
                  value: this.space
                    ? "\n" + this.space.repeat(this._depth) + "]"
                    : "]",
                });
                this._depth++;
              }
              const self = this.pushStack({
                handler:
                  type === OBJECT_STREAM
                    ? processReadableObject
                    : processReadableString,
                value,
                index: 0,
                first: false,
                ended: false,
                awaiting: !value.readable || value.readableLength === 0,
              });
              const continueProcessing = () => {
                if (self.awaiting) {
                  self.awaiting = false;
                  this.processStack();
                }
              };
              value.once("error", (error) => this.destroy(error));
              value.once("end", () => {
                self.ended = true;
                continueProcessing();
              });
              value.on("readable", continueProcessing);
              break;
          }
        }
        pushStack(node) {
          node.prev = this._stack;
          return (this._stack = node);
        }
        popStack() {
          const { handler, value } = this._stack;
          if (
            handler === processObject ||
            handler === processArray ||
            handler === processReadableObject
          ) {
            this._visited.delete(value);
            this._depth--;
          }
          this._stack = this._stack.prev;
        }
        processStack() {
          if (this._processing || this._ended) {
            return;
          }
          try {
            this._processing = true;
            while (this._stack !== null && !this._stack.awaiting) {
              this._stack.handler.call(this);
              if (!this._processing) {
                return;
              }
            }
            this._processing = false;
          } catch (error) {
            this.destroy(error);
            return;
          }
          if (this._stack === null && !this._ended) {
            this._finish();
            this.push(null);
          }
        }
        push(data) {
          if (data !== null) {
            this._buffer += data;
            if (this._buffer.length < this._readSize) {
              return;
            }
            data = this._buffer;
            this._buffer = "";
            this._processing = false;
          }
          super.push(data);
        }
        _read(size) {
          this._readSize = size || this.readableHighWaterMark;
          this.processStack();
        }
        _finish() {
          this._ended = true;
          this._processing = false;
          this._stack = null;
          this._visited = null;
          if (this._buffer && this._buffer.length) {
            super.push(this._buffer);
          }
          this._buffer = "";
        }
        _destroy(error, cb) {
          this.error = this.error || error;
          this._finish();
          cb(error);
        }
      }
      module.exports = function createJsonStringifyStream(
        value,
        replacer,
        space,
      ) {
        return new JsonStringifyStream(value, replacer, space);
      };
    },
    3775: (module, __unused_webpack_exports, __nccwpck_require__) => {
      module.exports = __nccwpck_require__(9023).TextDecoder;
    },
    1816: (module) => {
      const PrimitiveType = 1;
      const ObjectType = 2;
      const ArrayType = 3;
      const PromiseType = 4;
      const ReadableStringType = 5;
      const ReadableObjectType = 6;
      const escapableCharCodeSubstitution = {
        8: "\\b",
        9: "\\t",
        10: "\\n",
        12: "\\f",
        13: "\\r",
        34: '\\"',
        92: "\\\\",
      };
      function isLeadingSurrogate(code) {
        return code >= 55296 && code <= 56319;
      }
      function isTrailingSurrogate(code) {
        return code >= 56320 && code <= 57343;
      }
      function isReadableStream(value) {
        return (
          typeof value.pipe === "function" &&
          typeof value._read === "function" &&
          typeof value._readableState === "object" &&
          value._readableState !== null
        );
      }
      function replaceValue(holder, key, value, replacer) {
        if (value && typeof value.toJSON === "function") {
          value = value.toJSON();
        }
        if (replacer !== null) {
          value = replacer.call(holder, String(key), value);
        }
        switch (typeof value) {
          case "function":
          case "symbol":
            value = undefined;
            break;
          case "object":
            if (value !== null) {
              const cls = value.constructor;
              if (cls === String || cls === Number || cls === Boolean) {
                value = value.valueOf();
              }
            }
            break;
        }
        return value;
      }
      function getTypeNative(value) {
        if (value === null || typeof value !== "object") {
          return PrimitiveType;
        }
        if (Array.isArray(value)) {
          return ArrayType;
        }
        return ObjectType;
      }
      function getTypeAsync(value) {
        if (value === null || typeof value !== "object") {
          return PrimitiveType;
        }
        if (typeof value.then === "function") {
          return PromiseType;
        }
        if (isReadableStream(value)) {
          return value._readableState.objectMode
            ? ReadableObjectType
            : ReadableStringType;
        }
        if (Array.isArray(value)) {
          return ArrayType;
        }
        return ObjectType;
      }
      function normalizeReplacer(replacer) {
        if (typeof replacer === "function") {
          return replacer;
        }
        if (Array.isArray(replacer)) {
          const allowlist = new Set(
            replacer
              .map((item) => {
                const cls = item && item.constructor;
                return cls === String || cls === Number ? String(item) : null;
              })
              .filter((item) => typeof item === "string"),
          );
          return [...allowlist];
        }
        return null;
      }
      function normalizeSpace(space) {
        if (typeof space === "number") {
          if (!Number.isFinite(space) || space < 1) {
            return false;
          }
          return " ".repeat(Math.min(space, 10));
        }
        if (typeof space === "string") {
          return space.slice(0, 10) || false;
        }
        return false;
      }
      module.exports = {
        escapableCharCodeSubstitution,
        isLeadingSurrogate,
        isTrailingSurrogate,
        type: {
          PRIMITIVE: PrimitiveType,
          PROMISE: PromiseType,
          ARRAY: ArrayType,
          OBJECT: ObjectType,
          STRING_STREAM: ReadableStringType,
          OBJECT_STREAM: ReadableObjectType,
        },
        isReadableStream,
        replaceValue,
        getTypeNative,
        getTypeAsync,
        normalizeReplacer,
        normalizeSpace,
      };
    },
    6069: (module, __unused_webpack_exports, __nccwpck_require__) => {
      module.exports = __nccwpck_require__(3344).version;
    },
    9847: (__unused_webpack_module, exports, __nccwpck_require__) => {
      const qs = __nccwpck_require__(3480);
      function parse(req) {
        let raw = req.url;
        if (raw == null) return;
        let prev = req._parsedUrl;
        if (prev && prev.raw === raw) return prev;
        let pathname = raw,
          search = "",
          query;
        if (raw.length > 1) {
          let idx = raw.indexOf("?", 1);
          if (idx !== -1) {
            search = raw.substring(idx);
            pathname = raw.substring(0, idx);
            if (search.length > 1) {
              query = qs.parse(search.substring(1));
            }
          }
        }
        return (req._parsedUrl = { pathname, search, query, raw });
      }
      exports.parse = parse;
    },
    9703: function (__unused_webpack_module, exports) {
      (function (global, factory) {
        true ? factory(exports) : 0;
      })(this, function (exports) {
        "use strict";
        function simple(node, visitors, baseVisitor, state, override) {
          if (!baseVisitor) {
            baseVisitor = base;
          }
          (function c(node, st, override) {
            var type = override || node.type;
            baseVisitor[type](node, st, c);
            if (visitors[type]) {
              visitors[type](node, st);
            }
          })(node, state, override);
        }
        function ancestor(node, visitors, baseVisitor, state, override) {
          var ancestors = [];
          if (!baseVisitor) {
            baseVisitor = base;
          }
          (function c(node, st, override) {
            var type = override || node.type;
            var isNew = node !== ancestors[ancestors.length - 1];
            if (isNew) {
              ancestors.push(node);
            }
            baseVisitor[type](node, st, c);
            if (visitors[type]) {
              visitors[type](node, st || ancestors, ancestors);
            }
            if (isNew) {
              ancestors.pop();
            }
          })(node, state, override);
        }
        function recursive(node, state, funcs, baseVisitor, override) {
          var visitor = funcs
            ? make(funcs, baseVisitor || undefined)
            : baseVisitor;
          (function c(node, st, override) {
            visitor[override || node.type](node, st, c);
          })(node, state, override);
        }
        function makeTest(test) {
          if (typeof test === "string") {
            return function (type) {
              return type === test;
            };
          } else if (!test) {
            return function () {
              return true;
            };
          } else {
            return test;
          }
        }
        var Found = function Found(node, state) {
          this.node = node;
          this.state = state;
        };
        function full(node, callback, baseVisitor, state, override) {
          if (!baseVisitor) {
            baseVisitor = base;
          }
          var last;
          (function c(node, st, override) {
            var type = override || node.type;
            baseVisitor[type](node, st, c);
            if (last !== node) {
              callback(node, st, type);
              last = node;
            }
          })(node, state, override);
        }
        function fullAncestor(node, callback, baseVisitor, state) {
          if (!baseVisitor) {
            baseVisitor = base;
          }
          var ancestors = [],
            last;
          (function c(node, st, override) {
            var type = override || node.type;
            var isNew = node !== ancestors[ancestors.length - 1];
            if (isNew) {
              ancestors.push(node);
            }
            baseVisitor[type](node, st, c);
            if (last !== node) {
              callback(node, st || ancestors, ancestors, type);
              last = node;
            }
            if (isNew) {
              ancestors.pop();
            }
          })(node, state);
        }
        function findNodeAt(node, start, end, test, baseVisitor, state) {
          if (!baseVisitor) {
            baseVisitor = base;
          }
          test = makeTest(test);
          try {
            (function c(node, st, override) {
              var type = override || node.type;
              if (
                (start == null || node.start <= start) &&
                (end == null || node.end >= end)
              ) {
                baseVisitor[type](node, st, c);
              }
              if (
                (start == null || node.start === start) &&
                (end == null || node.end === end) &&
                test(type, node)
              ) {
                throw new Found(node, st);
              }
            })(node, state);
          } catch (e) {
            if (e instanceof Found) {
              return e;
            }
            throw e;
          }
        }
        function findNodeAround(node, pos, test, baseVisitor, state) {
          test = makeTest(test);
          if (!baseVisitor) {
            baseVisitor = base;
          }
          try {
            (function c(node, st, override) {
              var type = override || node.type;
              if (node.start > pos || node.end < pos) {
                return;
              }
              baseVisitor[type](node, st, c);
              if (test(type, node)) {
                throw new Found(node, st);
              }
            })(node, state);
          } catch (e) {
            if (e instanceof Found) {
              return e;
            }
            throw e;
          }
        }
        function findNodeAfter(node, pos, test, baseVisitor, state) {
          test = makeTest(test);
          if (!baseVisitor) {
            baseVisitor = base;
          }
          try {
            (function c(node, st, override) {
              if (node.end < pos) {
                return;
              }
              var type = override || node.type;
              if (node.start >= pos && test(type, node)) {
                throw new Found(node, st);
              }
              baseVisitor[type](node, st, c);
            })(node, state);
          } catch (e) {
            if (e instanceof Found) {
              return e;
            }
            throw e;
          }
        }
        function findNodeBefore(node, pos, test, baseVisitor, state) {
          test = makeTest(test);
          if (!baseVisitor) {
            baseVisitor = base;
          }
          var max;
          (function c(node, st, override) {
            if (node.start > pos) {
              return;
            }
            var type = override || node.type;
            if (
              node.end <= pos &&
              (!max || max.node.end < node.end) &&
              test(type, node)
            ) {
              max = new Found(node, st);
            }
            baseVisitor[type](node, st, c);
          })(node, state);
          return max;
        }
        function make(funcs, baseVisitor) {
          var visitor = Object.create(baseVisitor || base);
          for (var type in funcs) {
            visitor[type] = funcs[type];
          }
          return visitor;
        }
        function skipThrough(node, st, c) {
          c(node, st);
        }
        function ignore(_node, _st, _c) {}
        var base = {};
        base.Program =
          base.BlockStatement =
          base.StaticBlock =
            function (node, st, c) {
              for (var i = 0, list = node.body; i < list.length; i += 1) {
                var stmt = list[i];
                c(stmt, st, "Statement");
              }
            };
        base.Statement = skipThrough;
        base.EmptyStatement = ignore;
        base.ExpressionStatement =
          base.ParenthesizedExpression =
          base.ChainExpression =
            function (node, st, c) {
              return c(node.expression, st, "Expression");
            };
        base.IfStatement = function (node, st, c) {
          c(node.test, st, "Expression");
          c(node.consequent, st, "Statement");
          if (node.alternate) {
            c(node.alternate, st, "Statement");
          }
        };
        base.LabeledStatement = function (node, st, c) {
          return c(node.body, st, "Statement");
        };
        base.BreakStatement = base.ContinueStatement = ignore;
        base.WithStatement = function (node, st, c) {
          c(node.object, st, "Expression");
          c(node.body, st, "Statement");
        };
        base.SwitchStatement = function (node, st, c) {
          c(node.discriminant, st, "Expression");
          for (var i = 0, list = node.cases; i < list.length; i += 1) {
            var cs = list[i];
            c(cs, st);
          }
        };
        base.SwitchCase = function (node, st, c) {
          if (node.test) {
            c(node.test, st, "Expression");
          }
          for (var i = 0, list = node.consequent; i < list.length; i += 1) {
            var cons = list[i];
            c(cons, st, "Statement");
          }
        };
        base.ReturnStatement =
          base.YieldExpression =
          base.AwaitExpression =
            function (node, st, c) {
              if (node.argument) {
                c(node.argument, st, "Expression");
              }
            };
        base.ThrowStatement = base.SpreadElement = function (node, st, c) {
          return c(node.argument, st, "Expression");
        };
        base.TryStatement = function (node, st, c) {
          c(node.block, st, "Statement");
          if (node.handler) {
            c(node.handler, st);
          }
          if (node.finalizer) {
            c(node.finalizer, st, "Statement");
          }
        };
        base.CatchClause = function (node, st, c) {
          if (node.param) {
            c(node.param, st, "Pattern");
          }
          c(node.body, st, "Statement");
        };
        base.WhileStatement = base.DoWhileStatement = function (node, st, c) {
          c(node.test, st, "Expression");
          c(node.body, st, "Statement");
        };
        base.ForStatement = function (node, st, c) {
          if (node.init) {
            c(node.init, st, "ForInit");
          }
          if (node.test) {
            c(node.test, st, "Expression");
          }
          if (node.update) {
            c(node.update, st, "Expression");
          }
          c(node.body, st, "Statement");
        };
        base.ForInStatement = base.ForOfStatement = function (node, st, c) {
          c(node.left, st, "ForInit");
          c(node.right, st, "Expression");
          c(node.body, st, "Statement");
        };
        base.ForInit = function (node, st, c) {
          if (node.type === "VariableDeclaration") {
            c(node, st);
          } else {
            c(node, st, "Expression");
          }
        };
        base.DebuggerStatement = ignore;
        base.FunctionDeclaration = function (node, st, c) {
          return c(node, st, "Function");
        };
        base.VariableDeclaration = function (node, st, c) {
          for (var i = 0, list = node.declarations; i < list.length; i += 1) {
            var decl = list[i];
            c(decl, st);
          }
        };
        base.VariableDeclarator = function (node, st, c) {
          c(node.id, st, "Pattern");
          if (node.init) {
            c(node.init, st, "Expression");
          }
        };
        base.Function = function (node, st, c) {
          if (node.id) {
            c(node.id, st, "Pattern");
          }
          for (var i = 0, list = node.params; i < list.length; i += 1) {
            var param = list[i];
            c(param, st, "Pattern");
          }
          c(node.body, st, node.expression ? "Expression" : "Statement");
        };
        base.Pattern = function (node, st, c) {
          if (node.type === "Identifier") {
            c(node, st, "VariablePattern");
          } else if (node.type === "MemberExpression") {
            c(node, st, "MemberPattern");
          } else {
            c(node, st);
          }
        };
        base.VariablePattern = ignore;
        base.MemberPattern = skipThrough;
        base.RestElement = function (node, st, c) {
          return c(node.argument, st, "Pattern");
        };
        base.ArrayPattern = function (node, st, c) {
          for (var i = 0, list = node.elements; i < list.length; i += 1) {
            var elt = list[i];
            if (elt) {
              c(elt, st, "Pattern");
            }
          }
        };
        base.ObjectPattern = function (node, st, c) {
          for (var i = 0, list = node.properties; i < list.length; i += 1) {
            var prop = list[i];
            if (prop.type === "Property") {
              if (prop.computed) {
                c(prop.key, st, "Expression");
              }
              c(prop.value, st, "Pattern");
            } else if (prop.type === "RestElement") {
              c(prop.argument, st, "Pattern");
            }
          }
        };
        base.Expression = skipThrough;
        base.ThisExpression = base.Super = base.MetaProperty = ignore;
        base.ArrayExpression = function (node, st, c) {
          for (var i = 0, list = node.elements; i < list.length; i += 1) {
            var elt = list[i];
            if (elt) {
              c(elt, st, "Expression");
            }
          }
        };
        base.ObjectExpression = function (node, st, c) {
          for (var i = 0, list = node.properties; i < list.length; i += 1) {
            var prop = list[i];
            c(prop, st);
          }
        };
        base.FunctionExpression = base.ArrowFunctionExpression =
          base.FunctionDeclaration;
        base.SequenceExpression = function (node, st, c) {
          for (var i = 0, list = node.expressions; i < list.length; i += 1) {
            var expr = list[i];
            c(expr, st, "Expression");
          }
        };
        base.TemplateLiteral = function (node, st, c) {
          for (var i = 0, list = node.quasis; i < list.length; i += 1) {
            var quasi = list[i];
            c(quasi, st);
          }
          for (
            var i$1 = 0, list$1 = node.expressions;
            i$1 < list$1.length;
            i$1 += 1
          ) {
            var expr = list$1[i$1];
            c(expr, st, "Expression");
          }
        };
        base.TemplateElement = ignore;
        base.UnaryExpression = base.UpdateExpression = function (node, st, c) {
          c(node.argument, st, "Expression");
        };
        base.BinaryExpression = base.LogicalExpression = function (
          node,
          st,
          c,
        ) {
          c(node.left, st, "Expression");
          c(node.right, st, "Expression");
        };
        base.AssignmentExpression = base.AssignmentPattern = function (
          node,
          st,
          c,
        ) {
          c(node.left, st, "Pattern");
          c(node.right, st, "Expression");
        };
        base.ConditionalExpression = function (node, st, c) {
          c(node.test, st, "Expression");
          c(node.consequent, st, "Expression");
          c(node.alternate, st, "Expression");
        };
        base.NewExpression = base.CallExpression = function (node, st, c) {
          c(node.callee, st, "Expression");
          if (node.arguments) {
            for (var i = 0, list = node.arguments; i < list.length; i += 1) {
              var arg = list[i];
              c(arg, st, "Expression");
            }
          }
        };
        base.MemberExpression = function (node, st, c) {
          c(node.object, st, "Expression");
          if (node.computed) {
            c(node.property, st, "Expression");
          }
        };
        base.ExportNamedDeclaration = base.ExportDefaultDeclaration = function (
          node,
          st,
          c,
        ) {
          if (node.declaration) {
            c(
              node.declaration,
              st,
              node.type === "ExportNamedDeclaration" || node.declaration.id
                ? "Statement"
                : "Expression",
            );
          }
          if (node.source) {
            c(node.source, st, "Expression");
          }
        };
        base.ExportAllDeclaration = function (node, st, c) {
          if (node.exported) {
            c(node.exported, st);
          }
          c(node.source, st, "Expression");
        };
        base.ImportDeclaration = function (node, st, c) {
          for (var i = 0, list = node.specifiers; i < list.length; i += 1) {
            var spec = list[i];
            c(spec, st);
          }
          c(node.source, st, "Expression");
        };
        base.ImportExpression = function (node, st, c) {
          c(node.source, st, "Expression");
        };
        base.ImportSpecifier =
          base.ImportDefaultSpecifier =
          base.ImportNamespaceSpecifier =
          base.Identifier =
          base.PrivateIdentifier =
          base.Literal =
            ignore;
        base.TaggedTemplateExpression = function (node, st, c) {
          c(node.tag, st, "Expression");
          c(node.quasi, st, "Expression");
        };
        base.ClassDeclaration = base.ClassExpression = function (node, st, c) {
          return c(node, st, "Class");
        };
        base.Class = function (node, st, c) {
          if (node.id) {
            c(node.id, st, "Pattern");
          }
          if (node.superClass) {
            c(node.superClass, st, "Expression");
          }
          c(node.body, st);
        };
        base.ClassBody = function (node, st, c) {
          for (var i = 0, list = node.body; i < list.length; i += 1) {
            var elt = list[i];
            c(elt, st);
          }
        };
        base.MethodDefinition =
          base.PropertyDefinition =
          base.Property =
            function (node, st, c) {
              if (node.computed) {
                c(node.key, st, "Expression");
              }
              if (node.value) {
                c(node.value, st, "Expression");
              }
            };
        exports.ancestor = ancestor;
        exports.base = base;
        exports.findNodeAfter = findNodeAfter;
        exports.findNodeAround = findNodeAround;
        exports.findNodeAt = findNodeAt;
        exports.findNodeBefore = findNodeBefore;
        exports.full = full;
        exports.fullAncestor = fullAncestor;
        exports.make = make;
        exports.recursive = recursive;
        exports.simple = simple;
      });
    },
    8024: function (__unused_webpack_module, exports) {
      (function (global, factory) {
        true ? factory(exports) : 0;
      })(this, function (exports) {
        "use strict";
        var astralIdentifierCodes = [
          509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166,
          1, 574, 3, 9, 9, 7, 9, 32, 4, 318, 1, 80, 3, 71, 10, 50, 3, 123, 2,
          54, 14, 32, 10, 3, 1, 11, 3, 46, 10, 8, 0, 46, 9, 7, 2, 37, 13, 2, 9,
          6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 2, 11, 83, 11, 7, 0, 3, 0, 158, 11,
          6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 68, 8,
          2, 0, 3, 0, 2, 3, 2, 4, 2, 0, 15, 1, 83, 17, 10, 9, 5, 0, 82, 19, 13,
          9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 7, 19, 58, 14, 5,
          9, 243, 14, 166, 9, 71, 5, 2, 1, 3, 3, 2, 0, 2, 1, 13, 9, 120, 6, 3,
          6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 343, 9, 54, 7, 2,
          7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2, 0, 9, 9, 49, 4,
          2, 1, 2, 4, 9, 9, 330, 3, 10, 1, 2, 0, 49, 6, 4, 4, 14, 10, 5350, 0,
          7, 14, 11465, 27, 2343, 9, 87, 9, 39, 4, 60, 6, 26, 9, 535, 9, 470, 0,
          2, 54, 8, 3, 82, 0, 12, 1, 19628, 1, 4178, 9, 519, 45, 3, 22, 543, 4,
          4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15,
          0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 101, 0, 161, 6, 10,
          9, 357, 0, 62, 13, 499, 13, 245, 1, 2, 9, 726, 6, 110, 6, 6, 9, 4759,
          9, 787719, 239,
        ];
        var astralIdentifierStartCodes = [
          0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4,
          48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35,
          5, 35, 5, 39, 9, 51, 13, 10, 2, 14, 2, 6, 2, 1, 2, 10, 2, 14, 2, 6, 2,
          1, 4, 51, 13, 310, 10, 21, 11, 7, 25, 5, 2, 41, 2, 8, 70, 5, 3, 0, 2,
          43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25,
          71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27,
          28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 39,
          27, 10, 22, 251, 41, 7, 1, 17, 2, 60, 28, 11, 0, 9, 21, 43, 17, 47,
          20, 28, 22, 13, 52, 58, 1, 3, 0, 14, 44, 33, 24, 27, 35, 30, 0, 3, 0,
          9, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 20, 1, 64, 6,
          2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4,
          4, 0, 19, 0, 13, 4, 31, 9, 2, 0, 3, 0, 2, 37, 2, 0, 26, 0, 2, 0, 45,
          52, 19, 3, 21, 2, 31, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0,
          60, 42, 14, 0, 72, 26, 38, 6, 186, 43, 117, 63, 32, 7, 3, 0, 3, 7, 2,
          1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11, 39, 8, 0,
          22, 0, 12, 45, 20, 0, 19, 72, 200, 32, 32, 8, 2, 36, 18, 0, 50, 29,
          113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 328, 18, 16, 0,
          2, 12, 2, 33, 125, 0, 80, 921, 103, 110, 18, 195, 2637, 96, 16, 1071,
          18, 5, 26, 3994, 6, 582, 6842, 29, 1763, 568, 8, 30, 18, 78, 18, 29,
          19, 47, 17, 3, 32, 20, 6, 18, 433, 44, 212, 63, 129, 74, 6, 0, 67, 12,
          65, 1, 2, 0, 29, 6135, 9, 1237, 42, 9, 8936, 3, 2, 6, 2, 1, 2, 290,
          16, 0, 30, 2, 3, 0, 15, 3, 9, 395, 2309, 106, 6, 12, 4, 8, 8, 9, 5991,
          84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3,
          7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30,
          2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 1845, 30, 7, 5,
          262, 61, 147, 44, 11, 6, 17, 0, 322, 29, 19, 43, 485, 27, 229, 29, 3,
          0, 496, 6, 2, 3, 2, 1, 2, 14, 2, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2,
          1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2,
          2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2,
          3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42719, 33, 4153,
          7, 221, 3, 5761, 15, 7472, 16, 621, 2467, 541, 1507, 4938, 6, 4191,
        ];
        var nonASCIIidentifierChars =
          "‌‍·̀-ͯ·҃-֑҇-ׇֽֿׁׂׅׄؐ-ًؚ-٩ٰۖ-ۜ۟-۪ۤۧۨ-ۭ۰-۹ܑܰ-݊ަ-ް߀-߉߫-߽߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛ࢗ-࢟࣊-ࣣ࣡-ःऺ-़ा-ॏ॑-ॗॢॣ०-९ঁ-ঃ়া-ৄেৈো-্ৗৢৣ০-৯৾ਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣ૦-૯ૺ-૿ଁ-ଃ଼ା-ୄେୈୋ-୍୕-ୗୢୣ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఀ-ఄ఼ా-ౄె-ైొ-్ౕౖౢౣ౦-౯ಁ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣ೦-೯ೳഀ-ഃ഻഼ാ-ൄെ-ൈൊ-്ൗൢൣ൦-൯ඁ-ඃ්ා-ුූෘ-ෟ෦-෯ෲෳัิ-ฺ็-๎๐-๙ັິ-ຼ່-໎໐-໙༘༙༠-༩༹༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှ၀-၉ၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟፩-፱ᜒ-᜕ᜲ-᜴ᝒᝓᝲᝳ឴-៓៝០-៩᠋-᠍᠏-᠙ᢩᤠ-ᤫᤰ-᤻᥆-᥏᧐-᧚ᨗ-ᨛᩕ-ᩞ᩠-᩿᩼-᪉᪐-᪙᪰-᪽ᪿ-ᫎᬀ-ᬄ᬴-᭄᭐-᭙᭫-᭳ᮀ-ᮂᮡ-ᮭ᮰-᮹᯦-᯳ᰤ-᰷᱀-᱉᱐-᱙᳐-᳔᳒-᳨᳭᳴᳷-᳹᷀-᷿‌‍‿⁀⁔⃐-⃥⃜⃡-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯・꘠-꘩꙯ꙴ-꙽ꚞꚟ꛰꛱ꠂ꠆ꠋꠣ-ꠧ꠬ꢀꢁꢴ-ꣅ꣐-꣙꣠-꣱ꣿ-꤉ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀꧐-꧙ꧥ꧰-꧹ꨩ-ꨶꩃꩌꩍ꩐-꩙ꩻ-ꩽꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꫫ-ꫯꫵ꫶ꯣ-ꯪ꯬꯭꯰-꯹ﬞ︀-️︠-︯︳︴﹍-﹏０-９＿･";
        var nonASCIIidentifierStartChars =
          "ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙՠ-ֈא-תׯ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࡠ-ࡪࡰ-ࢇࢉ-ࢎࢠ-ࣉऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱৼਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡૹଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚౝౠౡಀಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೝೞೠೡೱೲഄ-ഌഎ-ഐഒ-ഺഽൎൔ-ൖൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄຆ-ຊຌ-ຣລວ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜑᜟ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡸᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭌᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᲀ-ᲊᲐ-ᲺᲽ-Ჿᳩ-ᳬᳮ-ᳳᳵᳶᳺᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕ℘-ℝℤΩℨK-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〇〡-〩〱-〵〸-〼ぁ-ゖ゛-ゟァ-ヺー-ヿㄅ-ㄯㄱ-ㆎㆠ-ㆿㇰ-ㇿ㐀-䶿一-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-ꟍꟐꟑꟓꟕ-Ƛꟲ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽꣾꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭩꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ";
        var reservedWords = {
          3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
          5: "class enum extends super const export import",
          6: "enum",
          strict:
            "implements interface let package private protected public static yield",
          strictBind: "eval arguments",
        };
        var ecma5AndLessKeywords =
          "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this";
        var keywords$1 = {
          5: ecma5AndLessKeywords,
          "5module": ecma5AndLessKeywords + " export import",
          6: ecma5AndLessKeywords + " const class extends export import super",
        };
        var keywordRelationalOperator = /^in(stanceof)?$/;
        var nonASCIIidentifierStart = new RegExp(
          "[" + nonASCIIidentifierStartChars + "]",
        );
        var nonASCIIidentifier = new RegExp(
          "[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]",
        );
        function isInAstralSet(code, set) {
          var pos = 65536;
          for (var i = 0; i < set.length; i += 2) {
            pos += set[i];
            if (pos > code) {
              return false;
            }
            pos += set[i + 1];
            if (pos >= code) {
              return true;
            }
          }
          return false;
        }
        function isIdentifierStart(code, astral) {
          if (code < 65) {
            return code === 36;
          }
          if (code < 91) {
            return true;
          }
          if (code < 97) {
            return code === 95;
          }
          if (code < 123) {
            return true;
          }
          if (code <= 65535) {
            return (
              code >= 170 &&
              nonASCIIidentifierStart.test(String.fromCharCode(code))
            );
          }
          if (astral === false) {
            return false;
          }
          return isInAstralSet(code, astralIdentifierStartCodes);
        }
        function isIdentifierChar(code, astral) {
          if (code < 48) {
            return code === 36;
          }
          if (code < 58) {
            return true;
          }
          if (code < 65) {
            return false;
          }
          if (code < 91) {
            return true;
          }
          if (code < 97) {
            return code === 95;
          }
          if (code < 123) {
            return true;
          }
          if (code <= 65535) {
            return (
              code >= 170 && nonASCIIidentifier.test(String.fromCharCode(code))
            );
          }
          if (astral === false) {
            return false;
          }
          return (
            isInAstralSet(code, astralIdentifierStartCodes) ||
            isInAstralSet(code, astralIdentifierCodes)
          );
        }
        var TokenType = function TokenType(label, conf) {
          if (conf === void 0) conf = {};
          this.label = label;
          this.keyword = conf.keyword;
          this.beforeExpr = !!conf.beforeExpr;
          this.startsExpr = !!conf.startsExpr;
          this.isLoop = !!conf.isLoop;
          this.isAssign = !!conf.isAssign;
          this.prefix = !!conf.prefix;
          this.postfix = !!conf.postfix;
          this.binop = conf.binop || null;
          this.updateContext = null;
        };
        function binop(name, prec) {
          return new TokenType(name, { beforeExpr: true, binop: prec });
        }
        var beforeExpr = { beforeExpr: true },
          startsExpr = { startsExpr: true };
        var keywords = {};
        function kw(name, options) {
          if (options === void 0) options = {};
          options.keyword = name;
          return (keywords[name] = new TokenType(name, options));
        }
        var types$1 = {
          num: new TokenType("num", startsExpr),
          regexp: new TokenType("regexp", startsExpr),
          string: new TokenType("string", startsExpr),
          name: new TokenType("name", startsExpr),
          privateId: new TokenType("privateId", startsExpr),
          eof: new TokenType("eof"),
          bracketL: new TokenType("[", { beforeExpr: true, startsExpr: true }),
          bracketR: new TokenType("]"),
          braceL: new TokenType("{", { beforeExpr: true, startsExpr: true }),
          braceR: new TokenType("}"),
          parenL: new TokenType("(", { beforeExpr: true, startsExpr: true }),
          parenR: new TokenType(")"),
          comma: new TokenType(",", beforeExpr),
          semi: new TokenType(";", beforeExpr),
          colon: new TokenType(":", beforeExpr),
          dot: new TokenType("."),
          question: new TokenType("?", beforeExpr),
          questionDot: new TokenType("?."),
          arrow: new TokenType("=>", beforeExpr),
          template: new TokenType("template"),
          invalidTemplate: new TokenType("invalidTemplate"),
          ellipsis: new TokenType("...", beforeExpr),
          backQuote: new TokenType("`", startsExpr),
          dollarBraceL: new TokenType("${", {
            beforeExpr: true,
            startsExpr: true,
          }),
          eq: new TokenType("=", { beforeExpr: true, isAssign: true }),
          assign: new TokenType("_=", { beforeExpr: true, isAssign: true }),
          incDec: new TokenType("++/--", {
            prefix: true,
            postfix: true,
            startsExpr: true,
          }),
          prefix: new TokenType("!/~", {
            beforeExpr: true,
            prefix: true,
            startsExpr: true,
          }),
          logicalOR: binop("||", 1),
          logicalAND: binop("&&", 2),
          bitwiseOR: binop("|", 3),
          bitwiseXOR: binop("^", 4),
          bitwiseAND: binop("&", 5),
          equality: binop("==/!=/===/!==", 6),
          relational: binop("</>/<=/>=", 7),
          bitShift: binop("<</>>/>>>", 8),
          plusMin: new TokenType("+/-", {
            beforeExpr: true,
            binop: 9,
            prefix: true,
            startsExpr: true,
          }),
          modulo: binop("%", 10),
          star: binop("*", 10),
          slash: binop("/", 10),
          starstar: new TokenType("**", { beforeExpr: true }),
          coalesce: binop("??", 1),
          _break: kw("break"),
          _case: kw("case", beforeExpr),
          _catch: kw("catch"),
          _continue: kw("continue"),
          _debugger: kw("debugger"),
          _default: kw("default", beforeExpr),
          _do: kw("do", { isLoop: true, beforeExpr: true }),
          _else: kw("else", beforeExpr),
          _finally: kw("finally"),
          _for: kw("for", { isLoop: true }),
          _function: kw("function", startsExpr),
          _if: kw("if"),
          _return: kw("return", beforeExpr),
          _switch: kw("switch"),
          _throw: kw("throw", beforeExpr),
          _try: kw("try"),
          _var: kw("var"),
          _const: kw("const"),
          _while: kw("while", { isLoop: true }),
          _with: kw("with"),
          _new: kw("new", { beforeExpr: true, startsExpr: true }),
          _this: kw("this", startsExpr),
          _super: kw("super", startsExpr),
          _class: kw("class", startsExpr),
          _extends: kw("extends", beforeExpr),
          _export: kw("export"),
          _import: kw("import", startsExpr),
          _null: kw("null", startsExpr),
          _true: kw("true", startsExpr),
          _false: kw("false", startsExpr),
          _in: kw("in", { beforeExpr: true, binop: 7 }),
          _instanceof: kw("instanceof", { beforeExpr: true, binop: 7 }),
          _typeof: kw("typeof", {
            beforeExpr: true,
            prefix: true,
            startsExpr: true,
          }),
          _void: kw("void", {
            beforeExpr: true,
            prefix: true,
            startsExpr: true,
          }),
          _delete: kw("delete", {
            beforeExpr: true,
            prefix: true,
            startsExpr: true,
          }),
        };
        var lineBreak = /\r\n?|\n|\u2028|\u2029/;
        var lineBreakG = new RegExp(lineBreak.source, "g");
        function isNewLine(code) {
          return code === 10 || code === 13 || code === 8232 || code === 8233;
        }
        function nextLineBreak(code, from, end) {
          if (end === void 0) end = code.length;
          for (var i = from; i < end; i++) {
            var next = code.charCodeAt(i);
            if (isNewLine(next)) {
              return i < end - 1 && next === 13 && code.charCodeAt(i + 1) === 10
                ? i + 2
                : i + 1;
            }
          }
          return -1;
        }
        var nonASCIIwhitespace =
          /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
        var skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;
        var ref = Object.prototype;
        var hasOwnProperty = ref.hasOwnProperty;
        var toString = ref.toString;
        var hasOwn =
          Object.hasOwn ||
          function (obj, propName) {
            return hasOwnProperty.call(obj, propName);
          };
        var isArray =
          Array.isArray ||
          function (obj) {
            return toString.call(obj) === "[object Array]";
          };
        var regexpCache = Object.create(null);
        function wordsRegexp(words) {
          return (
            regexpCache[words] ||
            (regexpCache[words] = new RegExp(
              "^(?:" + words.replace(/ /g, "|") + ")$",
            ))
          );
        }
        function codePointToString(code) {
          if (code <= 65535) {
            return String.fromCharCode(code);
          }
          code -= 65536;
          return String.fromCharCode(
            (code >> 10) + 55296,
            (code & 1023) + 56320,
          );
        }
        var loneSurrogate =
          /(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/;
        var Position = function Position(line, col) {
          this.line = line;
          this.column = col;
        };
        Position.prototype.offset = function offset(n) {
          return new Position(this.line, this.column + n);
        };
        var SourceLocation = function SourceLocation(p, start, end) {
          this.start = start;
          this.end = end;
          if (p.sourceFile !== null) {
            this.source = p.sourceFile;
          }
        };
        function getLineInfo(input, offset) {
          for (var line = 1, cur = 0; ; ) {
            var nextBreak = nextLineBreak(input, cur, offset);
            if (nextBreak < 0) {
              return new Position(line, offset - cur);
            }
            ++line;
            cur = nextBreak;
          }
        }
        var defaultOptions = {
          ecmaVersion: null,
          sourceType: "script",
          onInsertedSemicolon: null,
          onTrailingComma: null,
          allowReserved: null,
          allowReturnOutsideFunction: false,
          allowImportExportEverywhere: false,
          allowAwaitOutsideFunction: null,
          allowSuperOutsideMethod: null,
          allowHashBang: false,
          checkPrivateFields: true,
          locations: false,
          onToken: null,
          onComment: null,
          ranges: false,
          program: null,
          sourceFile: null,
          directSourceFile: null,
          preserveParens: false,
        };
        var warnedAboutEcmaVersion = false;
        function getOptions(opts) {
          var options = {};
          for (var opt in defaultOptions) {
            options[opt] =
              opts && hasOwn(opts, opt) ? opts[opt] : defaultOptions[opt];
          }
          if (options.ecmaVersion === "latest") {
            options.ecmaVersion = 1e8;
          } else if (options.ecmaVersion == null) {
            if (
              !warnedAboutEcmaVersion &&
              typeof console === "object" &&
              console.warn
            ) {
              warnedAboutEcmaVersion = true;
              console.warn(
                "Since Acorn 8.0.0, options.ecmaVersion is required.\nDefaulting to 2020, but this will stop working in the future.",
              );
            }
            options.ecmaVersion = 11;
          } else if (options.ecmaVersion >= 2015) {
            options.ecmaVersion -= 2009;
          }
          if (options.allowReserved == null) {
            options.allowReserved = options.ecmaVersion < 5;
          }
          if (!opts || opts.allowHashBang == null) {
            options.allowHashBang = options.ecmaVersion >= 14;
          }
          if (isArray(options.onToken)) {
            var tokens = options.onToken;
            options.onToken = function (token) {
              return tokens.push(token);
            };
          }
          if (isArray(options.onComment)) {
            options.onComment = pushComment(options, options.onComment);
          }
          return options;
        }
        function pushComment(options, array) {
          return function (block, text, start, end, startLoc, endLoc) {
            var comment = {
              type: block ? "Block" : "Line",
              value: text,
              start,
              end,
            };
            if (options.locations) {
              comment.loc = new SourceLocation(this, startLoc, endLoc);
            }
            if (options.ranges) {
              comment.range = [start, end];
            }
            array.push(comment);
          };
        }
        var SCOPE_TOP = 1,
          SCOPE_FUNCTION = 2,
          SCOPE_ASYNC = 4,
          SCOPE_GENERATOR = 8,
          SCOPE_ARROW = 16,
          SCOPE_SIMPLE_CATCH = 32,
          SCOPE_SUPER = 64,
          SCOPE_DIRECT_SUPER = 128,
          SCOPE_CLASS_STATIC_BLOCK = 256,
          SCOPE_VAR = SCOPE_TOP | SCOPE_FUNCTION | SCOPE_CLASS_STATIC_BLOCK;
        function functionFlags(async, generator) {
          return (
            SCOPE_FUNCTION |
            (async ? SCOPE_ASYNC : 0) |
            (generator ? SCOPE_GENERATOR : 0)
          );
        }
        var BIND_NONE = 0,
          BIND_VAR = 1,
          BIND_LEXICAL = 2,
          BIND_FUNCTION = 3,
          BIND_SIMPLE_CATCH = 4,
          BIND_OUTSIDE = 5;
        var Parser = function Parser(options, input, startPos) {
          this.options = options = getOptions(options);
          this.sourceFile = options.sourceFile;
          this.keywords = wordsRegexp(
            keywords$1[
              options.ecmaVersion >= 6
                ? 6
                : options.sourceType === "module"
                  ? "5module"
                  : 5
            ],
          );
          var reserved = "";
          if (options.allowReserved !== true) {
            reserved =
              reservedWords[
                options.ecmaVersion >= 6 ? 6 : options.ecmaVersion === 5 ? 5 : 3
              ];
            if (options.sourceType === "module") {
              reserved += " await";
            }
          }
          this.reservedWords = wordsRegexp(reserved);
          var reservedStrict =
            (reserved ? reserved + " " : "") + reservedWords.strict;
          this.reservedWordsStrict = wordsRegexp(reservedStrict);
          this.reservedWordsStrictBind = wordsRegexp(
            reservedStrict + " " + reservedWords.strictBind,
          );
          this.input = String(input);
          this.containsEsc = false;
          if (startPos) {
            this.pos = startPos;
            this.lineStart = this.input.lastIndexOf("\n", startPos - 1) + 1;
            this.curLine = this.input
              .slice(0, this.lineStart)
              .split(lineBreak).length;
          } else {
            this.pos = this.lineStart = 0;
            this.curLine = 1;
          }
          this.type = types$1.eof;
          this.value = null;
          this.start = this.end = this.pos;
          this.startLoc = this.endLoc = this.curPosition();
          this.lastTokEndLoc = this.lastTokStartLoc = null;
          this.lastTokStart = this.lastTokEnd = this.pos;
          this.context = this.initialContext();
          this.exprAllowed = true;
          this.inModule = options.sourceType === "module";
          this.strict = this.inModule || this.strictDirective(this.pos);
          this.potentialArrowAt = -1;
          this.potentialArrowInForAwait = false;
          this.yieldPos = this.awaitPos = this.awaitIdentPos = 0;
          this.labels = [];
          this.undefinedExports = Object.create(null);
          if (
            this.pos === 0 &&
            options.allowHashBang &&
            this.input.slice(0, 2) === "#!"
          ) {
            this.skipLineComment(2);
          }
          this.scopeStack = [];
          this.enterScope(SCOPE_TOP);
          this.regexpState = null;
          this.privateNameStack = [];
        };
        var prototypeAccessors = {
          inFunction: { configurable: true },
          inGenerator: { configurable: true },
          inAsync: { configurable: true },
          canAwait: { configurable: true },
          allowSuper: { configurable: true },
          allowDirectSuper: { configurable: true },
          treatFunctionsAsVar: { configurable: true },
          allowNewDotTarget: { configurable: true },
          inClassStaticBlock: { configurable: true },
        };
        Parser.prototype.parse = function parse() {
          var node = this.options.program || this.startNode();
          this.nextToken();
          return this.parseTopLevel(node);
        };
        prototypeAccessors.inFunction.get = function () {
          return (this.currentVarScope().flags & SCOPE_FUNCTION) > 0;
        };
        prototypeAccessors.inGenerator.get = function () {
          return (
            (this.currentVarScope().flags & SCOPE_GENERATOR) > 0 &&
            !this.currentVarScope().inClassFieldInit
          );
        };
        prototypeAccessors.inAsync.get = function () {
          return (
            (this.currentVarScope().flags & SCOPE_ASYNC) > 0 &&
            !this.currentVarScope().inClassFieldInit
          );
        };
        prototypeAccessors.canAwait.get = function () {
          for (var i = this.scopeStack.length - 1; i >= 0; i--) {
            var scope = this.scopeStack[i];
            if (
              scope.inClassFieldInit ||
              scope.flags & SCOPE_CLASS_STATIC_BLOCK
            ) {
              return false;
            }
            if (scope.flags & SCOPE_FUNCTION) {
              return (scope.flags & SCOPE_ASYNC) > 0;
            }
          }
          return (
            (this.inModule && this.options.ecmaVersion >= 13) ||
            this.options.allowAwaitOutsideFunction
          );
        };
        prototypeAccessors.allowSuper.get = function () {
          var ref = this.currentThisScope();
          var flags = ref.flags;
          var inClassFieldInit = ref.inClassFieldInit;
          return (
            (flags & SCOPE_SUPER) > 0 ||
            inClassFieldInit ||
            this.options.allowSuperOutsideMethod
          );
        };
        prototypeAccessors.allowDirectSuper.get = function () {
          return (this.currentThisScope().flags & SCOPE_DIRECT_SUPER) > 0;
        };
        prototypeAccessors.treatFunctionsAsVar.get = function () {
          return this.treatFunctionsAsVarInScope(this.currentScope());
        };
        prototypeAccessors.allowNewDotTarget.get = function () {
          var ref = this.currentThisScope();
          var flags = ref.flags;
          var inClassFieldInit = ref.inClassFieldInit;
          return (
            (flags & (SCOPE_FUNCTION | SCOPE_CLASS_STATIC_BLOCK)) > 0 ||
            inClassFieldInit
          );
        };
        prototypeAccessors.inClassStaticBlock.get = function () {
          return (this.currentVarScope().flags & SCOPE_CLASS_STATIC_BLOCK) > 0;
        };
        Parser.extend = function extend() {
          var plugins = [],
            len = arguments.length;
          while (len--) plugins[len] = arguments[len];
          var cls = this;
          for (var i = 0; i < plugins.length; i++) {
            cls = plugins[i](cls);
          }
          return cls;
        };
        Parser.parse = function parse(input, options) {
          return new this(options, input).parse();
        };
        Parser.parseExpressionAt = function parseExpressionAt(
          input,
          pos,
          options,
        ) {
          var parser = new this(options, input, pos);
          parser.nextToken();
          return parser.parseExpression();
        };
        Parser.tokenizer = function tokenizer(input, options) {
          return new this(options, input);
        };
        Object.defineProperties(Parser.prototype, prototypeAccessors);
        var pp$9 = Parser.prototype;
        var literal = /^(?:'((?:\\[^]|[^'\\])*?)'|"((?:\\[^]|[^"\\])*?)")/;
        pp$9.strictDirective = function (start) {
          if (this.options.ecmaVersion < 5) {
            return false;
          }
          for (;;) {
            skipWhiteSpace.lastIndex = start;
            start += skipWhiteSpace.exec(this.input)[0].length;
            var match = literal.exec(this.input.slice(start));
            if (!match) {
              return false;
            }
            if ((match[1] || match[2]) === "use strict") {
              skipWhiteSpace.lastIndex = start + match[0].length;
              var spaceAfter = skipWhiteSpace.exec(this.input),
                end = spaceAfter.index + spaceAfter[0].length;
              var next = this.input.charAt(end);
              return (
                next === ";" ||
                next === "}" ||
                (lineBreak.test(spaceAfter[0]) &&
                  !(
                    /[(`.[+\-/*%<>=,?^&]/.test(next) ||
                    (next === "!" && this.input.charAt(end + 1) === "=")
                  ))
              );
            }
            start += match[0].length;
            skipWhiteSpace.lastIndex = start;
            start += skipWhiteSpace.exec(this.input)[0].length;
            if (this.input[start] === ";") {
              start++;
            }
          }
        };
        pp$9.eat = function (type) {
          if (this.type === type) {
            this.next();
            return true;
          } else {
            return false;
          }
        };
        pp$9.isContextual = function (name) {
          return (
            this.type === types$1.name &&
            this.value === name &&
            !this.containsEsc
          );
        };
        pp$9.eatContextual = function (name) {
          if (!this.isContextual(name)) {
            return false;
          }
          this.next();
          return true;
        };
        pp$9.expectContextual = function (name) {
          if (!this.eatContextual(name)) {
            this.unexpected();
          }
        };
        pp$9.canInsertSemicolon = function () {
          return (
            this.type === types$1.eof ||
            this.type === types$1.braceR ||
            lineBreak.test(this.input.slice(this.lastTokEnd, this.start))
          );
        };
        pp$9.insertSemicolon = function () {
          if (this.canInsertSemicolon()) {
            if (this.options.onInsertedSemicolon) {
              this.options.onInsertedSemicolon(
                this.lastTokEnd,
                this.lastTokEndLoc,
              );
            }
            return true;
          }
        };
        pp$9.semicolon = function () {
          if (!this.eat(types$1.semi) && !this.insertSemicolon()) {
            this.unexpected();
          }
        };
        pp$9.afterTrailingComma = function (tokType, notNext) {
          if (this.type === tokType) {
            if (this.options.onTrailingComma) {
              this.options.onTrailingComma(
                this.lastTokStart,
                this.lastTokStartLoc,
              );
            }
            if (!notNext) {
              this.next();
            }
            return true;
          }
        };
        pp$9.expect = function (type) {
          this.eat(type) || this.unexpected();
        };
        pp$9.unexpected = function (pos) {
          this.raise(pos != null ? pos : this.start, "Unexpected token");
        };
        var DestructuringErrors = function DestructuringErrors() {
          this.shorthandAssign =
            this.trailingComma =
            this.parenthesizedAssign =
            this.parenthesizedBind =
            this.doubleProto =
              -1;
        };
        pp$9.checkPatternErrors = function (refDestructuringErrors, isAssign) {
          if (!refDestructuringErrors) {
            return;
          }
          if (refDestructuringErrors.trailingComma > -1) {
            this.raiseRecoverable(
              refDestructuringErrors.trailingComma,
              "Comma is not permitted after the rest element",
            );
          }
          var parens = isAssign
            ? refDestructuringErrors.parenthesizedAssign
            : refDestructuringErrors.parenthesizedBind;
          if (parens > -1) {
            this.raiseRecoverable(
              parens,
              isAssign ? "Assigning to rvalue" : "Parenthesized pattern",
            );
          }
        };
        pp$9.checkExpressionErrors = function (
          refDestructuringErrors,
          andThrow,
        ) {
          if (!refDestructuringErrors) {
            return false;
          }
          var shorthandAssign = refDestructuringErrors.shorthandAssign;
          var doubleProto = refDestructuringErrors.doubleProto;
          if (!andThrow) {
            return shorthandAssign >= 0 || doubleProto >= 0;
          }
          if (shorthandAssign >= 0) {
            this.raise(
              shorthandAssign,
              "Shorthand property assignments are valid only in destructuring patterns",
            );
          }
          if (doubleProto >= 0) {
            this.raiseRecoverable(
              doubleProto,
              "Redefinition of __proto__ property",
            );
          }
        };
        pp$9.checkYieldAwaitInDefaultParams = function () {
          if (
            this.yieldPos &&
            (!this.awaitPos || this.yieldPos < this.awaitPos)
          ) {
            this.raise(
              this.yieldPos,
              "Yield expression cannot be a default value",
            );
          }
          if (this.awaitPos) {
            this.raise(
              this.awaitPos,
              "Await expression cannot be a default value",
            );
          }
        };
        pp$9.isSimpleAssignTarget = function (expr) {
          if (expr.type === "ParenthesizedExpression") {
            return this.isSimpleAssignTarget(expr.expression);
          }
          return expr.type === "Identifier" || expr.type === "MemberExpression";
        };
        var pp$8 = Parser.prototype;
        pp$8.parseTopLevel = function (node) {
          var exports = Object.create(null);
          if (!node.body) {
            node.body = [];
          }
          while (this.type !== types$1.eof) {
            var stmt = this.parseStatement(null, true, exports);
            node.body.push(stmt);
          }
          if (this.inModule) {
            for (
              var i = 0, list = Object.keys(this.undefinedExports);
              i < list.length;
              i += 1
            ) {
              var name = list[i];
              this.raiseRecoverable(
                this.undefinedExports[name].start,
                "Export '" + name + "' is not defined",
              );
            }
          }
          this.adaptDirectivePrologue(node.body);
          this.next();
          node.sourceType = this.options.sourceType;
          return this.finishNode(node, "Program");
        };
        var loopLabel = { kind: "loop" },
          switchLabel = { kind: "switch" };
        pp$8.isLet = function (context) {
          if (this.options.ecmaVersion < 6 || !this.isContextual("let")) {
            return false;
          }
          skipWhiteSpace.lastIndex = this.pos;
          var skip = skipWhiteSpace.exec(this.input);
          var next = this.pos + skip[0].length,
            nextCh = this.input.charCodeAt(next);
          if (nextCh === 91 || nextCh === 92) {
            return true;
          }
          if (context) {
            return false;
          }
          if (nextCh === 123 || (nextCh > 55295 && nextCh < 56320)) {
            return true;
          }
          if (isIdentifierStart(nextCh, true)) {
            var pos = next + 1;
            while (
              isIdentifierChar((nextCh = this.input.charCodeAt(pos)), true)
            ) {
              ++pos;
            }
            if (nextCh === 92 || (nextCh > 55295 && nextCh < 56320)) {
              return true;
            }
            var ident = this.input.slice(next, pos);
            if (!keywordRelationalOperator.test(ident)) {
              return true;
            }
          }
          return false;
        };
        pp$8.isAsyncFunction = function () {
          if (this.options.ecmaVersion < 8 || !this.isContextual("async")) {
            return false;
          }
          skipWhiteSpace.lastIndex = this.pos;
          var skip = skipWhiteSpace.exec(this.input);
          var next = this.pos + skip[0].length,
            after;
          return (
            !lineBreak.test(this.input.slice(this.pos, next)) &&
            this.input.slice(next, next + 8) === "function" &&
            (next + 8 === this.input.length ||
              !(
                isIdentifierChar((after = this.input.charCodeAt(next + 8))) ||
                (after > 55295 && after < 56320)
              ))
          );
        };
        pp$8.parseStatement = function (context, topLevel, exports) {
          var starttype = this.type,
            node = this.startNode(),
            kind;
          if (this.isLet(context)) {
            starttype = types$1._var;
            kind = "let";
          }
          switch (starttype) {
            case types$1._break:
            case types$1._continue:
              return this.parseBreakContinueStatement(node, starttype.keyword);
            case types$1._debugger:
              return this.parseDebuggerStatement(node);
            case types$1._do:
              return this.parseDoStatement(node);
            case types$1._for:
              return this.parseForStatement(node);
            case types$1._function:
              if (
                context &&
                (this.strict || (context !== "if" && context !== "label")) &&
                this.options.ecmaVersion >= 6
              ) {
                this.unexpected();
              }
              return this.parseFunctionStatement(node, false, !context);
            case types$1._class:
              if (context) {
                this.unexpected();
              }
              return this.parseClass(node, true);
            case types$1._if:
              return this.parseIfStatement(node);
            case types$1._return:
              return this.parseReturnStatement(node);
            case types$1._switch:
              return this.parseSwitchStatement(node);
            case types$1._throw:
              return this.parseThrowStatement(node);
            case types$1._try:
              return this.parseTryStatement(node);
            case types$1._const:
            case types$1._var:
              kind = kind || this.value;
              if (context && kind !== "var") {
                this.unexpected();
              }
              return this.parseVarStatement(node, kind);
            case types$1._while:
              return this.parseWhileStatement(node);
            case types$1._with:
              return this.parseWithStatement(node);
            case types$1.braceL:
              return this.parseBlock(true, node);
            case types$1.semi:
              return this.parseEmptyStatement(node);
            case types$1._export:
            case types$1._import:
              if (
                this.options.ecmaVersion > 10 &&
                starttype === types$1._import
              ) {
                skipWhiteSpace.lastIndex = this.pos;
                var skip = skipWhiteSpace.exec(this.input);
                var next = this.pos + skip[0].length,
                  nextCh = this.input.charCodeAt(next);
                if (nextCh === 40 || nextCh === 46) {
                  return this.parseExpressionStatement(
                    node,
                    this.parseExpression(),
                  );
                }
              }
              if (!this.options.allowImportExportEverywhere) {
                if (!topLevel) {
                  this.raise(
                    this.start,
                    "'import' and 'export' may only appear at the top level",
                  );
                }
                if (!this.inModule) {
                  this.raise(
                    this.start,
                    "'import' and 'export' may appear only with 'sourceType: module'",
                  );
                }
              }
              return starttype === types$1._import
                ? this.parseImport(node)
                : this.parseExport(node, exports);
            default:
              if (this.isAsyncFunction()) {
                if (context) {
                  this.unexpected();
                }
                this.next();
                return this.parseFunctionStatement(node, true, !context);
              }
              var maybeName = this.value,
                expr = this.parseExpression();
              if (
                starttype === types$1.name &&
                expr.type === "Identifier" &&
                this.eat(types$1.colon)
              ) {
                return this.parseLabeledStatement(
                  node,
                  maybeName,
                  expr,
                  context,
                );
              } else {
                return this.parseExpressionStatement(node, expr);
              }
          }
        };
        pp$8.parseBreakContinueStatement = function (node, keyword) {
          var isBreak = keyword === "break";
          this.next();
          if (this.eat(types$1.semi) || this.insertSemicolon()) {
            node.label = null;
          } else if (this.type !== types$1.name) {
            this.unexpected();
          } else {
            node.label = this.parseIdent();
            this.semicolon();
          }
          var i = 0;
          for (; i < this.labels.length; ++i) {
            var lab = this.labels[i];
            if (node.label == null || lab.name === node.label.name) {
              if (lab.kind != null && (isBreak || lab.kind === "loop")) {
                break;
              }
              if (node.label && isBreak) {
                break;
              }
            }
          }
          if (i === this.labels.length) {
            this.raise(node.start, "Unsyntactic " + keyword);
          }
          return this.finishNode(
            node,
            isBreak ? "BreakStatement" : "ContinueStatement",
          );
        };
        pp$8.parseDebuggerStatement = function (node) {
          this.next();
          this.semicolon();
          return this.finishNode(node, "DebuggerStatement");
        };
        pp$8.parseDoStatement = function (node) {
          this.next();
          this.labels.push(loopLabel);
          node.body = this.parseStatement("do");
          this.labels.pop();
          this.expect(types$1._while);
          node.test = this.parseParenExpression();
          if (this.options.ecmaVersion >= 6) {
            this.eat(types$1.semi);
          } else {
            this.semicolon();
          }
          return this.finishNode(node, "DoWhileStatement");
        };
        pp$8.parseForStatement = function (node) {
          this.next();
          var awaitAt =
            this.options.ecmaVersion >= 9 &&
            this.canAwait &&
            this.eatContextual("await")
              ? this.lastTokStart
              : -1;
          this.labels.push(loopLabel);
          this.enterScope(0);
          this.expect(types$1.parenL);
          if (this.type === types$1.semi) {
            if (awaitAt > -1) {
              this.unexpected(awaitAt);
            }
            return this.parseFor(node, null);
          }
          var isLet = this.isLet();
          if (
            this.type === types$1._var ||
            this.type === types$1._const ||
            isLet
          ) {
            var init$1 = this.startNode(),
              kind = isLet ? "let" : this.value;
            this.next();
            this.parseVar(init$1, true, kind);
            this.finishNode(init$1, "VariableDeclaration");
            if (
              (this.type === types$1._in ||
                (this.options.ecmaVersion >= 6 && this.isContextual("of"))) &&
              init$1.declarations.length === 1
            ) {
              if (this.options.ecmaVersion >= 9) {
                if (this.type === types$1._in) {
                  if (awaitAt > -1) {
                    this.unexpected(awaitAt);
                  }
                } else {
                  node.await = awaitAt > -1;
                }
              }
              return this.parseForIn(node, init$1);
            }
            if (awaitAt > -1) {
              this.unexpected(awaitAt);
            }
            return this.parseFor(node, init$1);
          }
          var startsWithLet = this.isContextual("let"),
            isForOf = false;
          var containsEsc = this.containsEsc;
          var refDestructuringErrors = new DestructuringErrors();
          var initPos = this.start;
          var init =
            awaitAt > -1
              ? this.parseExprSubscripts(refDestructuringErrors, "await")
              : this.parseExpression(true, refDestructuringErrors);
          if (
            this.type === types$1._in ||
            (isForOf = this.options.ecmaVersion >= 6 && this.isContextual("of"))
          ) {
            if (awaitAt > -1) {
              if (this.type === types$1._in) {
                this.unexpected(awaitAt);
              }
              node.await = true;
            } else if (isForOf && this.options.ecmaVersion >= 8) {
              if (
                init.start === initPos &&
                !containsEsc &&
                init.type === "Identifier" &&
                init.name === "async"
              ) {
                this.unexpected();
              } else if (this.options.ecmaVersion >= 9) {
                node.await = false;
              }
            }
            if (startsWithLet && isForOf) {
              this.raise(
                init.start,
                "The left-hand side of a for-of loop may not start with 'let'.",
              );
            }
            this.toAssignable(init, false, refDestructuringErrors);
            this.checkLValPattern(init);
            return this.parseForIn(node, init);
          } else {
            this.checkExpressionErrors(refDestructuringErrors, true);
          }
          if (awaitAt > -1) {
            this.unexpected(awaitAt);
          }
          return this.parseFor(node, init);
        };
        pp$8.parseFunctionStatement = function (
          node,
          isAsync,
          declarationPosition,
        ) {
          this.next();
          return this.parseFunction(
            node,
            FUNC_STATEMENT | (declarationPosition ? 0 : FUNC_HANGING_STATEMENT),
            false,
            isAsync,
          );
        };
        pp$8.parseIfStatement = function (node) {
          this.next();
          node.test = this.parseParenExpression();
          node.consequent = this.parseStatement("if");
          node.alternate = this.eat(types$1._else)
            ? this.parseStatement("if")
            : null;
          return this.finishNode(node, "IfStatement");
        };
        pp$8.parseReturnStatement = function (node) {
          if (!this.inFunction && !this.options.allowReturnOutsideFunction) {
            this.raise(this.start, "'return' outside of function");
          }
          this.next();
          if (this.eat(types$1.semi) || this.insertSemicolon()) {
            node.argument = null;
          } else {
            node.argument = this.parseExpression();
            this.semicolon();
          }
          return this.finishNode(node, "ReturnStatement");
        };
        pp$8.parseSwitchStatement = function (node) {
          this.next();
          node.discriminant = this.parseParenExpression();
          node.cases = [];
          this.expect(types$1.braceL);
          this.labels.push(switchLabel);
          this.enterScope(0);
          var cur;
          for (var sawDefault = false; this.type !== types$1.braceR; ) {
            if (this.type === types$1._case || this.type === types$1._default) {
              var isCase = this.type === types$1._case;
              if (cur) {
                this.finishNode(cur, "SwitchCase");
              }
              node.cases.push((cur = this.startNode()));
              cur.consequent = [];
              this.next();
              if (isCase) {
                cur.test = this.parseExpression();
              } else {
                if (sawDefault) {
                  this.raiseRecoverable(
                    this.lastTokStart,
                    "Multiple default clauses",
                  );
                }
                sawDefault = true;
                cur.test = null;
              }
              this.expect(types$1.colon);
            } else {
              if (!cur) {
                this.unexpected();
              }
              cur.consequent.push(this.parseStatement(null));
            }
          }
          this.exitScope();
          if (cur) {
            this.finishNode(cur, "SwitchCase");
          }
          this.next();
          this.labels.pop();
          return this.finishNode(node, "SwitchStatement");
        };
        pp$8.parseThrowStatement = function (node) {
          this.next();
          if (lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) {
            this.raise(this.lastTokEnd, "Illegal newline after throw");
          }
          node.argument = this.parseExpression();
          this.semicolon();
          return this.finishNode(node, "ThrowStatement");
        };
        var empty$1 = [];
        pp$8.parseCatchClauseParam = function () {
          var param = this.parseBindingAtom();
          var simple = param.type === "Identifier";
          this.enterScope(simple ? SCOPE_SIMPLE_CATCH : 0);
          this.checkLValPattern(
            param,
            simple ? BIND_SIMPLE_CATCH : BIND_LEXICAL,
          );
          this.expect(types$1.parenR);
          return param;
        };
        pp$8.parseTryStatement = function (node) {
          this.next();
          node.block = this.parseBlock();
          node.handler = null;
          if (this.type === types$1._catch) {
            var clause = this.startNode();
            this.next();
            if (this.eat(types$1.parenL)) {
              clause.param = this.parseCatchClauseParam();
            } else {
              if (this.options.ecmaVersion < 10) {
                this.unexpected();
              }
              clause.param = null;
              this.enterScope(0);
            }
            clause.body = this.parseBlock(false);
            this.exitScope();
            node.handler = this.finishNode(clause, "CatchClause");
          }
          node.finalizer = this.eat(types$1._finally)
            ? this.parseBlock()
            : null;
          if (!node.handler && !node.finalizer) {
            this.raise(node.start, "Missing catch or finally clause");
          }
          return this.finishNode(node, "TryStatement");
        };
        pp$8.parseVarStatement = function (
          node,
          kind,
          allowMissingInitializer,
        ) {
          this.next();
          this.parseVar(node, false, kind, allowMissingInitializer);
          this.semicolon();
          return this.finishNode(node, "VariableDeclaration");
        };
        pp$8.parseWhileStatement = function (node) {
          this.next();
          node.test = this.parseParenExpression();
          this.labels.push(loopLabel);
          node.body = this.parseStatement("while");
          this.labels.pop();
          return this.finishNode(node, "WhileStatement");
        };
        pp$8.parseWithStatement = function (node) {
          if (this.strict) {
            this.raise(this.start, "'with' in strict mode");
          }
          this.next();
          node.object = this.parseParenExpression();
          node.body = this.parseStatement("with");
          return this.finishNode(node, "WithStatement");
        };
        pp$8.parseEmptyStatement = function (node) {
          this.next();
          return this.finishNode(node, "EmptyStatement");
        };
        pp$8.parseLabeledStatement = function (node, maybeName, expr, context) {
          for (var i$1 = 0, list = this.labels; i$1 < list.length; i$1 += 1) {
            var label = list[i$1];
            if (label.name === maybeName) {
              this.raise(
                expr.start,
                "Label '" + maybeName + "' is already declared",
              );
            }
          }
          var kind = this.type.isLoop
            ? "loop"
            : this.type === types$1._switch
              ? "switch"
              : null;
          for (var i = this.labels.length - 1; i >= 0; i--) {
            var label$1 = this.labels[i];
            if (label$1.statementStart === node.start) {
              label$1.statementStart = this.start;
              label$1.kind = kind;
            } else {
              break;
            }
          }
          this.labels.push({
            name: maybeName,
            kind,
            statementStart: this.start,
          });
          node.body = this.parseStatement(
            context
              ? context.indexOf("label") === -1
                ? context + "label"
                : context
              : "label",
          );
          this.labels.pop();
          node.label = expr;
          return this.finishNode(node, "LabeledStatement");
        };
        pp$8.parseExpressionStatement = function (node, expr) {
          node.expression = expr;
          this.semicolon();
          return this.finishNode(node, "ExpressionStatement");
        };
        pp$8.parseBlock = function (createNewLexicalScope, node, exitStrict) {
          if (createNewLexicalScope === void 0) createNewLexicalScope = true;
          if (node === void 0) node = this.startNode();
          node.body = [];
          this.expect(types$1.braceL);
          if (createNewLexicalScope) {
            this.enterScope(0);
          }
          while (this.type !== types$1.braceR) {
            var stmt = this.parseStatement(null);
            node.body.push(stmt);
          }
          if (exitStrict) {
            this.strict = false;
          }
          this.next();
          if (createNewLexicalScope) {
            this.exitScope();
          }
          return this.finishNode(node, "BlockStatement");
        };
        pp$8.parseFor = function (node, init) {
          node.init = init;
          this.expect(types$1.semi);
          node.test =
            this.type === types$1.semi ? null : this.parseExpression();
          this.expect(types$1.semi);
          node.update =
            this.type === types$1.parenR ? null : this.parseExpression();
          this.expect(types$1.parenR);
          node.body = this.parseStatement("for");
          this.exitScope();
          this.labels.pop();
          return this.finishNode(node, "ForStatement");
        };
        pp$8.parseForIn = function (node, init) {
          var isForIn = this.type === types$1._in;
          this.next();
          if (
            init.type === "VariableDeclaration" &&
            init.declarations[0].init != null &&
            (!isForIn ||
              this.options.ecmaVersion < 8 ||
              this.strict ||
              init.kind !== "var" ||
              init.declarations[0].id.type !== "Identifier")
          ) {
            this.raise(
              init.start,
              (isForIn ? "for-in" : "for-of") +
                " loop variable declaration may not have an initializer",
            );
          }
          node.left = init;
          node.right = isForIn
            ? this.parseExpression()
            : this.parseMaybeAssign();
          this.expect(types$1.parenR);
          node.body = this.parseStatement("for");
          this.exitScope();
          this.labels.pop();
          return this.finishNode(
            node,
            isForIn ? "ForInStatement" : "ForOfStatement",
          );
        };
        pp$8.parseVar = function (node, isFor, kind, allowMissingInitializer) {
          node.declarations = [];
          node.kind = kind;
          for (;;) {
            var decl = this.startNode();
            this.parseVarId(decl, kind);
            if (this.eat(types$1.eq)) {
              decl.init = this.parseMaybeAssign(isFor);
            } else if (
              !allowMissingInitializer &&
              kind === "const" &&
              !(
                this.type === types$1._in ||
                (this.options.ecmaVersion >= 6 && this.isContextual("of"))
              )
            ) {
              this.unexpected();
            } else if (
              !allowMissingInitializer &&
              decl.id.type !== "Identifier" &&
              !(isFor && (this.type === types$1._in || this.isContextual("of")))
            ) {
              this.raise(
                this.lastTokEnd,
                "Complex binding patterns require an initialization value",
              );
            } else {
              decl.init = null;
            }
            node.declarations.push(this.finishNode(decl, "VariableDeclarator"));
            if (!this.eat(types$1.comma)) {
              break;
            }
          }
          return node;
        };
        pp$8.parseVarId = function (decl, kind) {
          decl.id = this.parseBindingAtom();
          this.checkLValPattern(
            decl.id,
            kind === "var" ? BIND_VAR : BIND_LEXICAL,
            false,
          );
        };
        var FUNC_STATEMENT = 1,
          FUNC_HANGING_STATEMENT = 2,
          FUNC_NULLABLE_ID = 4;
        pp$8.parseFunction = function (
          node,
          statement,
          allowExpressionBody,
          isAsync,
          forInit,
        ) {
          this.initFunction(node);
          if (
            this.options.ecmaVersion >= 9 ||
            (this.options.ecmaVersion >= 6 && !isAsync)
          ) {
            if (
              this.type === types$1.star &&
              statement & FUNC_HANGING_STATEMENT
            ) {
              this.unexpected();
            }
            node.generator = this.eat(types$1.star);
          }
          if (this.options.ecmaVersion >= 8) {
            node.async = !!isAsync;
          }
          if (statement & FUNC_STATEMENT) {
            node.id =
              statement & FUNC_NULLABLE_ID && this.type !== types$1.name
                ? null
                : this.parseIdent();
            if (node.id && !(statement & FUNC_HANGING_STATEMENT)) {
              this.checkLValSimple(
                node.id,
                this.strict || node.generator || node.async
                  ? this.treatFunctionsAsVar
                    ? BIND_VAR
                    : BIND_LEXICAL
                  : BIND_FUNCTION,
              );
            }
          }
          var oldYieldPos = this.yieldPos,
            oldAwaitPos = this.awaitPos,
            oldAwaitIdentPos = this.awaitIdentPos;
          this.yieldPos = 0;
          this.awaitPos = 0;
          this.awaitIdentPos = 0;
          this.enterScope(functionFlags(node.async, node.generator));
          if (!(statement & FUNC_STATEMENT)) {
            node.id = this.type === types$1.name ? this.parseIdent() : null;
          }
          this.parseFunctionParams(node);
          this.parseFunctionBody(node, allowExpressionBody, false, forInit);
          this.yieldPos = oldYieldPos;
          this.awaitPos = oldAwaitPos;
          this.awaitIdentPos = oldAwaitIdentPos;
          return this.finishNode(
            node,
            statement & FUNC_STATEMENT
              ? "FunctionDeclaration"
              : "FunctionExpression",
          );
        };
        pp$8.parseFunctionParams = function (node) {
          this.expect(types$1.parenL);
          node.params = this.parseBindingList(
            types$1.parenR,
            false,
            this.options.ecmaVersion >= 8,
          );
          this.checkYieldAwaitInDefaultParams();
        };
        pp$8.parseClass = function (node, isStatement) {
          this.next();
          var oldStrict = this.strict;
          this.strict = true;
          this.parseClassId(node, isStatement);
          this.parseClassSuper(node);
          var privateNameMap = this.enterClassBody();
          var classBody = this.startNode();
          var hadConstructor = false;
          classBody.body = [];
          this.expect(types$1.braceL);
          while (this.type !== types$1.braceR) {
            var element = this.parseClassElement(node.superClass !== null);
            if (element) {
              classBody.body.push(element);
              if (
                element.type === "MethodDefinition" &&
                element.kind === "constructor"
              ) {
                if (hadConstructor) {
                  this.raiseRecoverable(
                    element.start,
                    "Duplicate constructor in the same class",
                  );
                }
                hadConstructor = true;
              } else if (
                element.key &&
                element.key.type === "PrivateIdentifier" &&
                isPrivateNameConflicted(privateNameMap, element)
              ) {
                this.raiseRecoverable(
                  element.key.start,
                  "Identifier '#" +
                    element.key.name +
                    "' has already been declared",
                );
              }
            }
          }
          this.strict = oldStrict;
          this.next();
          node.body = this.finishNode(classBody, "ClassBody");
          this.exitClassBody();
          return this.finishNode(
            node,
            isStatement ? "ClassDeclaration" : "ClassExpression",
          );
        };
        pp$8.parseClassElement = function (constructorAllowsSuper) {
          if (this.eat(types$1.semi)) {
            return null;
          }
          var ecmaVersion = this.options.ecmaVersion;
          var node = this.startNode();
          var keyName = "";
          var isGenerator = false;
          var isAsync = false;
          var kind = "method";
          var isStatic = false;
          if (this.eatContextual("static")) {
            if (ecmaVersion >= 13 && this.eat(types$1.braceL)) {
              this.parseClassStaticBlock(node);
              return node;
            }
            if (this.isClassElementNameStart() || this.type === types$1.star) {
              isStatic = true;
            } else {
              keyName = "static";
            }
          }
          node.static = isStatic;
          if (!keyName && ecmaVersion >= 8 && this.eatContextual("async")) {
            if (
              (this.isClassElementNameStart() || this.type === types$1.star) &&
              !this.canInsertSemicolon()
            ) {
              isAsync = true;
            } else {
              keyName = "async";
            }
          }
          if (
            !keyName &&
            (ecmaVersion >= 9 || !isAsync) &&
            this.eat(types$1.star)
          ) {
            isGenerator = true;
          }
          if (!keyName && !isAsync && !isGenerator) {
            var lastValue = this.value;
            if (this.eatContextual("get") || this.eatContextual("set")) {
              if (this.isClassElementNameStart()) {
                kind = lastValue;
              } else {
                keyName = lastValue;
              }
            }
          }
          if (keyName) {
            node.computed = false;
            node.key = this.startNodeAt(
              this.lastTokStart,
              this.lastTokStartLoc,
            );
            node.key.name = keyName;
            this.finishNode(node.key, "Identifier");
          } else {
            this.parseClassElementName(node);
          }
          if (
            ecmaVersion < 13 ||
            this.type === types$1.parenL ||
            kind !== "method" ||
            isGenerator ||
            isAsync
          ) {
            var isConstructor =
              !node.static && checkKeyName(node, "constructor");
            var allowsDirectSuper = isConstructor && constructorAllowsSuper;
            if (isConstructor && kind !== "method") {
              this.raise(
                node.key.start,
                "Constructor can't have get/set modifier",
              );
            }
            node.kind = isConstructor ? "constructor" : kind;
            this.parseClassMethod(
              node,
              isGenerator,
              isAsync,
              allowsDirectSuper,
            );
          } else {
            this.parseClassField(node);
          }
          return node;
        };
        pp$8.isClassElementNameStart = function () {
          return (
            this.type === types$1.name ||
            this.type === types$1.privateId ||
            this.type === types$1.num ||
            this.type === types$1.string ||
            this.type === types$1.bracketL ||
            this.type.keyword
          );
        };
        pp$8.parseClassElementName = function (element) {
          if (this.type === types$1.privateId) {
            if (this.value === "constructor") {
              this.raise(
                this.start,
                "Classes can't have an element named '#constructor'",
              );
            }
            element.computed = false;
            element.key = this.parsePrivateIdent();
          } else {
            this.parsePropertyName(element);
          }
        };
        pp$8.parseClassMethod = function (
          method,
          isGenerator,
          isAsync,
          allowsDirectSuper,
        ) {
          var key = method.key;
          if (method.kind === "constructor") {
            if (isGenerator) {
              this.raise(key.start, "Constructor can't be a generator");
            }
            if (isAsync) {
              this.raise(key.start, "Constructor can't be an async method");
            }
          } else if (method.static && checkKeyName(method, "prototype")) {
            this.raise(
              key.start,
              "Classes may not have a static property named prototype",
            );
          }
          var value = (method.value = this.parseMethod(
            isGenerator,
            isAsync,
            allowsDirectSuper,
          ));
          if (method.kind === "get" && value.params.length !== 0) {
            this.raiseRecoverable(value.start, "getter should have no params");
          }
          if (method.kind === "set" && value.params.length !== 1) {
            this.raiseRecoverable(
              value.start,
              "setter should have exactly one param",
            );
          }
          if (method.kind === "set" && value.params[0].type === "RestElement") {
            this.raiseRecoverable(
              value.params[0].start,
              "Setter cannot use rest params",
            );
          }
          return this.finishNode(method, "MethodDefinition");
        };
        pp$8.parseClassField = function (field) {
          if (checkKeyName(field, "constructor")) {
            this.raise(
              field.key.start,
              "Classes can't have a field named 'constructor'",
            );
          } else if (field.static && checkKeyName(field, "prototype")) {
            this.raise(
              field.key.start,
              "Classes can't have a static field named 'prototype'",
            );
          }
          if (this.eat(types$1.eq)) {
            var scope = this.currentThisScope();
            var inClassFieldInit = scope.inClassFieldInit;
            scope.inClassFieldInit = true;
            field.value = this.parseMaybeAssign();
            scope.inClassFieldInit = inClassFieldInit;
          } else {
            field.value = null;
          }
          this.semicolon();
          return this.finishNode(field, "PropertyDefinition");
        };
        pp$8.parseClassStaticBlock = function (node) {
          node.body = [];
          var oldLabels = this.labels;
          this.labels = [];
          this.enterScope(SCOPE_CLASS_STATIC_BLOCK | SCOPE_SUPER);
          while (this.type !== types$1.braceR) {
            var stmt = this.parseStatement(null);
            node.body.push(stmt);
          }
          this.next();
          this.exitScope();
          this.labels = oldLabels;
          return this.finishNode(node, "StaticBlock");
        };
        pp$8.parseClassId = function (node, isStatement) {
          if (this.type === types$1.name) {
            node.id = this.parseIdent();
            if (isStatement) {
              this.checkLValSimple(node.id, BIND_LEXICAL, false);
            }
          } else {
            if (isStatement === true) {
              this.unexpected();
            }
            node.id = null;
          }
        };
        pp$8.parseClassSuper = function (node) {
          node.superClass = this.eat(types$1._extends)
            ? this.parseExprSubscripts(null, false)
            : null;
        };
        pp$8.enterClassBody = function () {
          var element = { declared: Object.create(null), used: [] };
          this.privateNameStack.push(element);
          return element.declared;
        };
        pp$8.exitClassBody = function () {
          var ref = this.privateNameStack.pop();
          var declared = ref.declared;
          var used = ref.used;
          if (!this.options.checkPrivateFields) {
            return;
          }
          var len = this.privateNameStack.length;
          var parent = len === 0 ? null : this.privateNameStack[len - 1];
          for (var i = 0; i < used.length; ++i) {
            var id = used[i];
            if (!hasOwn(declared, id.name)) {
              if (parent) {
                parent.used.push(id);
              } else {
                this.raiseRecoverable(
                  id.start,
                  "Private field '#" +
                    id.name +
                    "' must be declared in an enclosing class",
                );
              }
            }
          }
        };
        function isPrivateNameConflicted(privateNameMap, element) {
          var name = element.key.name;
          var curr = privateNameMap[name];
          var next = "true";
          if (
            element.type === "MethodDefinition" &&
            (element.kind === "get" || element.kind === "set")
          ) {
            next = (element.static ? "s" : "i") + element.kind;
          }
          if (
            (curr === "iget" && next === "iset") ||
            (curr === "iset" && next === "iget") ||
            (curr === "sget" && next === "sset") ||
            (curr === "sset" && next === "sget")
          ) {
            privateNameMap[name] = "true";
            return false;
          } else if (!curr) {
            privateNameMap[name] = next;
            return false;
          } else {
            return true;
          }
        }
        function checkKeyName(node, name) {
          var computed = node.computed;
          var key = node.key;
          return (
            !computed &&
            ((key.type === "Identifier" && key.name === name) ||
              (key.type === "Literal" && key.value === name))
          );
        }
        pp$8.parseExportAllDeclaration = function (node, exports) {
          if (this.options.ecmaVersion >= 11) {
            if (this.eatContextual("as")) {
              node.exported = this.parseModuleExportName();
              this.checkExport(exports, node.exported, this.lastTokStart);
            } else {
              node.exported = null;
            }
          }
          this.expectContextual("from");
          if (this.type !== types$1.string) {
            this.unexpected();
          }
          node.source = this.parseExprAtom();
          if (this.options.ecmaVersion >= 16) {
            node.attributes = this.parseWithClause();
          }
          this.semicolon();
          return this.finishNode(node, "ExportAllDeclaration");
        };
        pp$8.parseExport = function (node, exports) {
          this.next();
          if (this.eat(types$1.star)) {
            return this.parseExportAllDeclaration(node, exports);
          }
          if (this.eat(types$1._default)) {
            this.checkExport(exports, "default", this.lastTokStart);
            node.declaration = this.parseExportDefaultDeclaration();
            return this.finishNode(node, "ExportDefaultDeclaration");
          }
          if (this.shouldParseExportStatement()) {
            node.declaration = this.parseExportDeclaration(node);
            if (node.declaration.type === "VariableDeclaration") {
              this.checkVariableExport(exports, node.declaration.declarations);
            } else {
              this.checkExport(
                exports,
                node.declaration.id,
                node.declaration.id.start,
              );
            }
            node.specifiers = [];
            node.source = null;
          } else {
            node.declaration = null;
            node.specifiers = this.parseExportSpecifiers(exports);
            if (this.eatContextual("from")) {
              if (this.type !== types$1.string) {
                this.unexpected();
              }
              node.source = this.parseExprAtom();
              if (this.options.ecmaVersion >= 16) {
                node.attributes = this.parseWithClause();
              }
            } else {
              for (var i = 0, list = node.specifiers; i < list.length; i += 1) {
                var spec = list[i];
                this.checkUnreserved(spec.local);
                this.checkLocalExport(spec.local);
                if (spec.local.type === "Literal") {
                  this.raise(
                    spec.local.start,
                    "A string literal cannot be used as an exported binding without `from`.",
                  );
                }
              }
              node.source = null;
            }
            this.semicolon();
          }
          return this.finishNode(node, "ExportNamedDeclaration");
        };
        pp$8.parseExportDeclaration = function (node) {
          return this.parseStatement(null);
        };
        pp$8.parseExportDefaultDeclaration = function () {
          var isAsync;
          if (
            this.type === types$1._function ||
            (isAsync = this.isAsyncFunction())
          ) {
            var fNode = this.startNode();
            this.next();
            if (isAsync) {
              this.next();
            }
            return this.parseFunction(
              fNode,
              FUNC_STATEMENT | FUNC_NULLABLE_ID,
              false,
              isAsync,
            );
          } else if (this.type === types$1._class) {
            var cNode = this.startNode();
            return this.parseClass(cNode, "nullableID");
          } else {
            var declaration = this.parseMaybeAssign();
            this.semicolon();
            return declaration;
          }
        };
        pp$8.checkExport = function (exports, name, pos) {
          if (!exports) {
            return;
          }
          if (typeof name !== "string") {
            name = name.type === "Identifier" ? name.name : name.value;
          }
          if (hasOwn(exports, name)) {
            this.raiseRecoverable(pos, "Duplicate export '" + name + "'");
          }
          exports[name] = true;
        };
        pp$8.checkPatternExport = function (exports, pat) {
          var type = pat.type;
          if (type === "Identifier") {
            this.checkExport(exports, pat, pat.start);
          } else if (type === "ObjectPattern") {
            for (var i = 0, list = pat.properties; i < list.length; i += 1) {
              var prop = list[i];
              this.checkPatternExport(exports, prop);
            }
          } else if (type === "ArrayPattern") {
            for (
              var i$1 = 0, list$1 = pat.elements;
              i$1 < list$1.length;
              i$1 += 1
            ) {
              var elt = list$1[i$1];
              if (elt) {
                this.checkPatternExport(exports, elt);
              }
            }
          } else if (type === "Property") {
            this.checkPatternExport(exports, pat.value);
          } else if (type === "AssignmentPattern") {
            this.checkPatternExport(exports, pat.left);
          } else if (type === "RestElement") {
            this.checkPatternExport(exports, pat.argument);
          }
        };
        pp$8.checkVariableExport = function (exports, decls) {
          if (!exports) {
            return;
          }
          for (var i = 0, list = decls; i < list.length; i += 1) {
            var decl = list[i];
            this.checkPatternExport(exports, decl.id);
          }
        };
        pp$8.shouldParseExportStatement = function () {
          return (
            this.type.keyword === "var" ||
            this.type.keyword === "const" ||
            this.type.keyword === "class" ||
            this.type.keyword === "function" ||
            this.isLet() ||
            this.isAsyncFunction()
          );
        };
        pp$8.parseExportSpecifier = function (exports) {
          var node = this.startNode();
          node.local = this.parseModuleExportName();
          node.exported = this.eatContextual("as")
            ? this.parseModuleExportName()
            : node.local;
          this.checkExport(exports, node.exported, node.exported.start);
          return this.finishNode(node, "ExportSpecifier");
        };
        pp$8.parseExportSpecifiers = function (exports) {
          var nodes = [],
            first = true;
          this.expect(types$1.braceL);
          while (!this.eat(types$1.braceR)) {
            if (!first) {
              this.expect(types$1.comma);
              if (this.afterTrailingComma(types$1.braceR)) {
                break;
              }
            } else {
              first = false;
            }
            nodes.push(this.parseExportSpecifier(exports));
          }
          return nodes;
        };
        pp$8.parseImport = function (node) {
          this.next();
          if (this.type === types$1.string) {
            node.specifiers = empty$1;
            node.source = this.parseExprAtom();
          } else {
            node.specifiers = this.parseImportSpecifiers();
            this.expectContextual("from");
            node.source =
              this.type === types$1.string
                ? this.parseExprAtom()
                : this.unexpected();
          }
          if (this.options.ecmaVersion >= 16) {
            node.attributes = this.parseWithClause();
          }
          this.semicolon();
          return this.finishNode(node, "ImportDeclaration");
        };
        pp$8.parseImportSpecifier = function () {
          var node = this.startNode();
          node.imported = this.parseModuleExportName();
          if (this.eatContextual("as")) {
            node.local = this.parseIdent();
          } else {
            this.checkUnreserved(node.imported);
            node.local = node.imported;
          }
          this.checkLValSimple(node.local, BIND_LEXICAL);
          return this.finishNode(node, "ImportSpecifier");
        };
        pp$8.parseImportDefaultSpecifier = function () {
          var node = this.startNode();
          node.local = this.parseIdent();
          this.checkLValSimple(node.local, BIND_LEXICAL);
          return this.finishNode(node, "ImportDefaultSpecifier");
        };
        pp$8.parseImportNamespaceSpecifier = function () {
          var node = this.startNode();
          this.next();
          this.expectContextual("as");
          node.local = this.parseIdent();
          this.checkLValSimple(node.local, BIND_LEXICAL);
          return this.finishNode(node, "ImportNamespaceSpecifier");
        };
        pp$8.parseImportSpecifiers = function () {
          var nodes = [],
            first = true;
          if (this.type === types$1.name) {
            nodes.push(this.parseImportDefaultSpecifier());
            if (!this.eat(types$1.comma)) {
              return nodes;
            }
          }
          if (this.type === types$1.star) {
            nodes.push(this.parseImportNamespaceSpecifier());
            return nodes;
          }
          this.expect(types$1.braceL);
          while (!this.eat(types$1.braceR)) {
            if (!first) {
              this.expect(types$1.comma);
              if (this.afterTrailingComma(types$1.braceR)) {
                break;
              }
            } else {
              first = false;
            }
            nodes.push(this.parseImportSpecifier());
          }
          return nodes;
        };
        pp$8.parseWithClause = function () {
          var nodes = [];
          if (!this.eat(types$1._with)) {
            return nodes;
          }
          this.expect(types$1.braceL);
          var attributeKeys = {};
          var first = true;
          while (!this.eat(types$1.braceR)) {
            if (!first) {
              this.expect(types$1.comma);
              if (this.afterTrailingComma(types$1.braceR)) {
                break;
              }
            } else {
              first = false;
            }
            var attr = this.parseImportAttribute();
            var keyName =
              attr.key.type === "Identifier" ? attr.key.name : attr.key.value;
            if (hasOwn(attributeKeys, keyName)) {
              this.raiseRecoverable(
                attr.key.start,
                "Duplicate attribute key '" + keyName + "'",
              );
            }
            attributeKeys[keyName] = true;
            nodes.push(attr);
          }
          return nodes;
        };
        pp$8.parseImportAttribute = function () {
          var node = this.startNode();
          node.key =
            this.type === types$1.string
              ? this.parseExprAtom()
              : this.parseIdent(this.options.allowReserved !== "never");
          this.expect(types$1.colon);
          if (this.type !== types$1.string) {
            this.unexpected();
          }
          node.value = this.parseExprAtom();
          return this.finishNode(node, "ImportAttribute");
        };
        pp$8.parseModuleExportName = function () {
          if (this.options.ecmaVersion >= 13 && this.type === types$1.string) {
            var stringLiteral = this.parseLiteral(this.value);
            if (loneSurrogate.test(stringLiteral.value)) {
              this.raise(
                stringLiteral.start,
                "An export name cannot include a lone surrogate.",
              );
            }
            return stringLiteral;
          }
          return this.parseIdent(true);
        };
        pp$8.adaptDirectivePrologue = function (statements) {
          for (
            var i = 0;
            i < statements.length && this.isDirectiveCandidate(statements[i]);
            ++i
          ) {
            statements[i].directive = statements[i].expression.raw.slice(1, -1);
          }
        };
        pp$8.isDirectiveCandidate = function (statement) {
          return (
            this.options.ecmaVersion >= 5 &&
            statement.type === "ExpressionStatement" &&
            statement.expression.type === "Literal" &&
            typeof statement.expression.value === "string" &&
            (this.input[statement.start] === '"' ||
              this.input[statement.start] === "'")
          );
        };
        var pp$7 = Parser.prototype;
        pp$7.toAssignable = function (node, isBinding, refDestructuringErrors) {
          if (this.options.ecmaVersion >= 6 && node) {
            switch (node.type) {
              case "Identifier":
                if (this.inAsync && node.name === "await") {
                  this.raise(
                    node.start,
                    "Cannot use 'await' as identifier inside an async function",
                  );
                }
                break;
              case "ObjectPattern":
              case "ArrayPattern":
              case "AssignmentPattern":
              case "RestElement":
                break;
              case "ObjectExpression":
                node.type = "ObjectPattern";
                if (refDestructuringErrors) {
                  this.checkPatternErrors(refDestructuringErrors, true);
                }
                for (
                  var i = 0, list = node.properties;
                  i < list.length;
                  i += 1
                ) {
                  var prop = list[i];
                  this.toAssignable(prop, isBinding);
                  if (
                    prop.type === "RestElement" &&
                    (prop.argument.type === "ArrayPattern" ||
                      prop.argument.type === "ObjectPattern")
                  ) {
                    this.raise(prop.argument.start, "Unexpected token");
                  }
                }
                break;
              case "Property":
                if (node.kind !== "init") {
                  this.raise(
                    node.key.start,
                    "Object pattern can't contain getter or setter",
                  );
                }
                this.toAssignable(node.value, isBinding);
                break;
              case "ArrayExpression":
                node.type = "ArrayPattern";
                if (refDestructuringErrors) {
                  this.checkPatternErrors(refDestructuringErrors, true);
                }
                this.toAssignableList(node.elements, isBinding);
                break;
              case "SpreadElement":
                node.type = "RestElement";
                this.toAssignable(node.argument, isBinding);
                if (node.argument.type === "AssignmentPattern") {
                  this.raise(
                    node.argument.start,
                    "Rest elements cannot have a default value",
                  );
                }
                break;
              case "AssignmentExpression":
                if (node.operator !== "=") {
                  this.raise(
                    node.left.end,
                    "Only '=' operator can be used for specifying default value.",
                  );
                }
                node.type = "AssignmentPattern";
                delete node.operator;
                this.toAssignable(node.left, isBinding);
                break;
              case "ParenthesizedExpression":
                this.toAssignable(
                  node.expression,
                  isBinding,
                  refDestructuringErrors,
                );
                break;
              case "ChainExpression":
                this.raiseRecoverable(
                  node.start,
                  "Optional chaining cannot appear in left-hand side",
                );
                break;
              case "MemberExpression":
                if (!isBinding) {
                  break;
                }
              default:
                this.raise(node.start, "Assigning to rvalue");
            }
          } else if (refDestructuringErrors) {
            this.checkPatternErrors(refDestructuringErrors, true);
          }
          return node;
        };
        pp$7.toAssignableList = function (exprList, isBinding) {
          var end = exprList.length;
          for (var i = 0; i < end; i++) {
            var elt = exprList[i];
            if (elt) {
              this.toAssignable(elt, isBinding);
            }
          }
          if (end) {
            var last = exprList[end - 1];
            if (
              this.options.ecmaVersion === 6 &&
              isBinding &&
              last &&
              last.type === "RestElement" &&
              last.argument.type !== "Identifier"
            ) {
              this.unexpected(last.argument.start);
            }
          }
          return exprList;
        };
        pp$7.parseSpread = function (refDestructuringErrors) {
          var node = this.startNode();
          this.next();
          node.argument = this.parseMaybeAssign(false, refDestructuringErrors);
          return this.finishNode(node, "SpreadElement");
        };
        pp$7.parseRestBinding = function () {
          var node = this.startNode();
          this.next();
          if (this.options.ecmaVersion === 6 && this.type !== types$1.name) {
            this.unexpected();
          }
          node.argument = this.parseBindingAtom();
          return this.finishNode(node, "RestElement");
        };
        pp$7.parseBindingAtom = function () {
          if (this.options.ecmaVersion >= 6) {
            switch (this.type) {
              case types$1.bracketL:
                var node = this.startNode();
                this.next();
                node.elements = this.parseBindingList(
                  types$1.bracketR,
                  true,
                  true,
                );
                return this.finishNode(node, "ArrayPattern");
              case types$1.braceL:
                return this.parseObj(true);
            }
          }
          return this.parseIdent();
        };
        pp$7.parseBindingList = function (
          close,
          allowEmpty,
          allowTrailingComma,
          allowModifiers,
        ) {
          var elts = [],
            first = true;
          while (!this.eat(close)) {
            if (first) {
              first = false;
            } else {
              this.expect(types$1.comma);
            }
            if (allowEmpty && this.type === types$1.comma) {
              elts.push(null);
            } else if (allowTrailingComma && this.afterTrailingComma(close)) {
              break;
            } else if (this.type === types$1.ellipsis) {
              var rest = this.parseRestBinding();
              this.parseBindingListItem(rest);
              elts.push(rest);
              if (this.type === types$1.comma) {
                this.raiseRecoverable(
                  this.start,
                  "Comma is not permitted after the rest element",
                );
              }
              this.expect(close);
              break;
            } else {
              elts.push(this.parseAssignableListItem(allowModifiers));
            }
          }
          return elts;
        };
        pp$7.parseAssignableListItem = function (allowModifiers) {
          var elem = this.parseMaybeDefault(this.start, this.startLoc);
          this.parseBindingListItem(elem);
          return elem;
        };
        pp$7.parseBindingListItem = function (param) {
          return param;
        };
        pp$7.parseMaybeDefault = function (startPos, startLoc, left) {
          left = left || this.parseBindingAtom();
          if (this.options.ecmaVersion < 6 || !this.eat(types$1.eq)) {
            return left;
          }
          var node = this.startNodeAt(startPos, startLoc);
          node.left = left;
          node.right = this.parseMaybeAssign();
          return this.finishNode(node, "AssignmentPattern");
        };
        pp$7.checkLValSimple = function (expr, bindingType, checkClashes) {
          if (bindingType === void 0) bindingType = BIND_NONE;
          var isBind = bindingType !== BIND_NONE;
          switch (expr.type) {
            case "Identifier":
              if (this.strict && this.reservedWordsStrictBind.test(expr.name)) {
                this.raiseRecoverable(
                  expr.start,
                  (isBind ? "Binding " : "Assigning to ") +
                    expr.name +
                    " in strict mode",
                );
              }
              if (isBind) {
                if (bindingType === BIND_LEXICAL && expr.name === "let") {
                  this.raiseRecoverable(
                    expr.start,
                    "let is disallowed as a lexically bound name",
                  );
                }
                if (checkClashes) {
                  if (hasOwn(checkClashes, expr.name)) {
                    this.raiseRecoverable(expr.start, "Argument name clash");
                  }
                  checkClashes[expr.name] = true;
                }
                if (bindingType !== BIND_OUTSIDE) {
                  this.declareName(expr.name, bindingType, expr.start);
                }
              }
              break;
            case "ChainExpression":
              this.raiseRecoverable(
                expr.start,
                "Optional chaining cannot appear in left-hand side",
              );
              break;
            case "MemberExpression":
              if (isBind) {
                this.raiseRecoverable(expr.start, "Binding member expression");
              }
              break;
            case "ParenthesizedExpression":
              if (isBind) {
                this.raiseRecoverable(
                  expr.start,
                  "Binding parenthesized expression",
                );
              }
              return this.checkLValSimple(
                expr.expression,
                bindingType,
                checkClashes,
              );
            default:
              this.raise(
                expr.start,
                (isBind ? "Binding" : "Assigning to") + " rvalue",
              );
          }
        };
        pp$7.checkLValPattern = function (expr, bindingType, checkClashes) {
          if (bindingType === void 0) bindingType = BIND_NONE;
          switch (expr.type) {
            case "ObjectPattern":
              for (var i = 0, list = expr.properties; i < list.length; i += 1) {
                var prop = list[i];
                this.checkLValInnerPattern(prop, bindingType, checkClashes);
              }
              break;
            case "ArrayPattern":
              for (
                var i$1 = 0, list$1 = expr.elements;
                i$1 < list$1.length;
                i$1 += 1
              ) {
                var elem = list$1[i$1];
                if (elem) {
                  this.checkLValInnerPattern(elem, bindingType, checkClashes);
                }
              }
              break;
            default:
              this.checkLValSimple(expr, bindingType, checkClashes);
          }
        };
        pp$7.checkLValInnerPattern = function (
          expr,
          bindingType,
          checkClashes,
        ) {
          if (bindingType === void 0) bindingType = BIND_NONE;
          switch (expr.type) {
            case "Property":
              this.checkLValInnerPattern(expr.value, bindingType, checkClashes);
              break;
            case "AssignmentPattern":
              this.checkLValPattern(expr.left, bindingType, checkClashes);
              break;
            case "RestElement":
              this.checkLValPattern(expr.argument, bindingType, checkClashes);
              break;
            default:
              this.checkLValPattern(expr, bindingType, checkClashes);
          }
        };
        var TokContext = function TokContext(
          token,
          isExpr,
          preserveSpace,
          override,
          generator,
        ) {
          this.token = token;
          this.isExpr = !!isExpr;
          this.preserveSpace = !!preserveSpace;
          this.override = override;
          this.generator = !!generator;
        };
        var types = {
          b_stat: new TokContext("{", false),
          b_expr: new TokContext("{", true),
          b_tmpl: new TokContext("${", false),
          p_stat: new TokContext("(", false),
          p_expr: new TokContext("(", true),
          q_tmpl: new TokContext("`", true, true, function (p) {
            return p.tryReadTemplateToken();
          }),
          f_stat: new TokContext("function", false),
          f_expr: new TokContext("function", true),
          f_expr_gen: new TokContext("function", true, false, null, true),
          f_gen: new TokContext("function", false, false, null, true),
        };
        var pp$6 = Parser.prototype;
        pp$6.initialContext = function () {
          return [types.b_stat];
        };
        pp$6.curContext = function () {
          return this.context[this.context.length - 1];
        };
        pp$6.braceIsBlock = function (prevType) {
          var parent = this.curContext();
          if (parent === types.f_expr || parent === types.f_stat) {
            return true;
          }
          if (
            prevType === types$1.colon &&
            (parent === types.b_stat || parent === types.b_expr)
          ) {
            return !parent.isExpr;
          }
          if (
            prevType === types$1._return ||
            (prevType === types$1.name && this.exprAllowed)
          ) {
            return lineBreak.test(
              this.input.slice(this.lastTokEnd, this.start),
            );
          }
          if (
            prevType === types$1._else ||
            prevType === types$1.semi ||
            prevType === types$1.eof ||
            prevType === types$1.parenR ||
            prevType === types$1.arrow
          ) {
            return true;
          }
          if (prevType === types$1.braceL) {
            return parent === types.b_stat;
          }
          if (
            prevType === types$1._var ||
            prevType === types$1._const ||
            prevType === types$1.name
          ) {
            return false;
          }
          return !this.exprAllowed;
        };
        pp$6.inGeneratorContext = function () {
          for (var i = this.context.length - 1; i >= 1; i--) {
            var context = this.context[i];
            if (context.token === "function") {
              return context.generator;
            }
          }
          return false;
        };
        pp$6.updateContext = function (prevType) {
          var update,
            type = this.type;
          if (type.keyword && prevType === types$1.dot) {
            this.exprAllowed = false;
          } else if ((update = type.updateContext)) {
            update.call(this, prevType);
          } else {
            this.exprAllowed = type.beforeExpr;
          }
        };
        pp$6.overrideContext = function (tokenCtx) {
          if (this.curContext() !== tokenCtx) {
            this.context[this.context.length - 1] = tokenCtx;
          }
        };
        types$1.parenR.updateContext = types$1.braceR.updateContext =
          function () {
            if (this.context.length === 1) {
              this.exprAllowed = true;
              return;
            }
            var out = this.context.pop();
            if (
              out === types.b_stat &&
              this.curContext().token === "function"
            ) {
              out = this.context.pop();
            }
            this.exprAllowed = !out.isExpr;
          };
        types$1.braceL.updateContext = function (prevType) {
          this.context.push(
            this.braceIsBlock(prevType) ? types.b_stat : types.b_expr,
          );
          this.exprAllowed = true;
        };
        types$1.dollarBraceL.updateContext = function () {
          this.context.push(types.b_tmpl);
          this.exprAllowed = true;
        };
        types$1.parenL.updateContext = function (prevType) {
          var statementParens =
            prevType === types$1._if ||
            prevType === types$1._for ||
            prevType === types$1._with ||
            prevType === types$1._while;
          this.context.push(statementParens ? types.p_stat : types.p_expr);
          this.exprAllowed = true;
        };
        types$1.incDec.updateContext = function () {};
        types$1._function.updateContext = types$1._class.updateContext =
          function (prevType) {
            if (
              prevType.beforeExpr &&
              prevType !== types$1._else &&
              !(
                prevType === types$1.semi && this.curContext() !== types.p_stat
              ) &&
              !(
                prevType === types$1._return &&
                lineBreak.test(this.input.slice(this.lastTokEnd, this.start))
              ) &&
              !(
                (prevType === types$1.colon || prevType === types$1.braceL) &&
                this.curContext() === types.b_stat
              )
            ) {
              this.context.push(types.f_expr);
            } else {
              this.context.push(types.f_stat);
            }
            this.exprAllowed = false;
          };
        types$1.colon.updateContext = function () {
          if (this.curContext().token === "function") {
            this.context.pop();
          }
          this.exprAllowed = true;
        };
        types$1.backQuote.updateContext = function () {
          if (this.curContext() === types.q_tmpl) {
            this.context.pop();
          } else {
            this.context.push(types.q_tmpl);
          }
          this.exprAllowed = false;
        };
        types$1.star.updateContext = function (prevType) {
          if (prevType === types$1._function) {
            var index = this.context.length - 1;
            if (this.context[index] === types.f_expr) {
              this.context[index] = types.f_expr_gen;
            } else {
              this.context[index] = types.f_gen;
            }
          }
          this.exprAllowed = true;
        };
        types$1.name.updateContext = function (prevType) {
          var allowed = false;
          if (this.options.ecmaVersion >= 6 && prevType !== types$1.dot) {
            if (
              (this.value === "of" && !this.exprAllowed) ||
              (this.value === "yield" && this.inGeneratorContext())
            ) {
              allowed = true;
            }
          }
          this.exprAllowed = allowed;
        };
        var pp$5 = Parser.prototype;
        pp$5.checkPropClash = function (
          prop,
          propHash,
          refDestructuringErrors,
        ) {
          if (this.options.ecmaVersion >= 9 && prop.type === "SpreadElement") {
            return;
          }
          if (
            this.options.ecmaVersion >= 6 &&
            (prop.computed || prop.method || prop.shorthand)
          ) {
            return;
          }
          var key = prop.key;
          var name;
          switch (key.type) {
            case "Identifier":
              name = key.name;
              break;
            case "Literal":
              name = String(key.value);
              break;
            default:
              return;
          }
          var kind = prop.kind;
          if (this.options.ecmaVersion >= 6) {
            if (name === "__proto__" && kind === "init") {
              if (propHash.proto) {
                if (refDestructuringErrors) {
                  if (refDestructuringErrors.doubleProto < 0) {
                    refDestructuringErrors.doubleProto = key.start;
                  }
                } else {
                  this.raiseRecoverable(
                    key.start,
                    "Redefinition of __proto__ property",
                  );
                }
              }
              propHash.proto = true;
            }
            return;
          }
          name = "$" + name;
          var other = propHash[name];
          if (other) {
            var redefinition;
            if (kind === "init") {
              redefinition =
                (this.strict && other.init) || other.get || other.set;
            } else {
              redefinition = other.init || other[kind];
            }
            if (redefinition) {
              this.raiseRecoverable(key.start, "Redefinition of property");
            }
          } else {
            other = propHash[name] = { init: false, get: false, set: false };
          }
          other[kind] = true;
        };
        pp$5.parseExpression = function (forInit, refDestructuringErrors) {
          var startPos = this.start,
            startLoc = this.startLoc;
          var expr = this.parseMaybeAssign(forInit, refDestructuringErrors);
          if (this.type === types$1.comma) {
            var node = this.startNodeAt(startPos, startLoc);
            node.expressions = [expr];
            while (this.eat(types$1.comma)) {
              node.expressions.push(
                this.parseMaybeAssign(forInit, refDestructuringErrors),
              );
            }
            return this.finishNode(node, "SequenceExpression");
          }
          return expr;
        };
        pp$5.parseMaybeAssign = function (
          forInit,
          refDestructuringErrors,
          afterLeftParse,
        ) {
          if (this.isContextual("yield")) {
            if (this.inGenerator) {
              return this.parseYield(forInit);
            } else {
              this.exprAllowed = false;
            }
          }
          var ownDestructuringErrors = false,
            oldParenAssign = -1,
            oldTrailingComma = -1,
            oldDoubleProto = -1;
          if (refDestructuringErrors) {
            oldParenAssign = refDestructuringErrors.parenthesizedAssign;
            oldTrailingComma = refDestructuringErrors.trailingComma;
            oldDoubleProto = refDestructuringErrors.doubleProto;
            refDestructuringErrors.parenthesizedAssign =
              refDestructuringErrors.trailingComma = -1;
          } else {
            refDestructuringErrors = new DestructuringErrors();
            ownDestructuringErrors = true;
          }
          var startPos = this.start,
            startLoc = this.startLoc;
          if (this.type === types$1.parenL || this.type === types$1.name) {
            this.potentialArrowAt = this.start;
            this.potentialArrowInForAwait = forInit === "await";
          }
          var left = this.parseMaybeConditional(
            forInit,
            refDestructuringErrors,
          );
          if (afterLeftParse) {
            left = afterLeftParse.call(this, left, startPos, startLoc);
          }
          if (this.type.isAssign) {
            var node = this.startNodeAt(startPos, startLoc);
            node.operator = this.value;
            if (this.type === types$1.eq) {
              left = this.toAssignable(left, false, refDestructuringErrors);
            }
            if (!ownDestructuringErrors) {
              refDestructuringErrors.parenthesizedAssign =
                refDestructuringErrors.trailingComma =
                refDestructuringErrors.doubleProto =
                  -1;
            }
            if (refDestructuringErrors.shorthandAssign >= left.start) {
              refDestructuringErrors.shorthandAssign = -1;
            }
            if (this.type === types$1.eq) {
              this.checkLValPattern(left);
            } else {
              this.checkLValSimple(left);
            }
            node.left = left;
            this.next();
            node.right = this.parseMaybeAssign(forInit);
            if (oldDoubleProto > -1) {
              refDestructuringErrors.doubleProto = oldDoubleProto;
            }
            return this.finishNode(node, "AssignmentExpression");
          } else {
            if (ownDestructuringErrors) {
              this.checkExpressionErrors(refDestructuringErrors, true);
            }
          }
          if (oldParenAssign > -1) {
            refDestructuringErrors.parenthesizedAssign = oldParenAssign;
          }
          if (oldTrailingComma > -1) {
            refDestructuringErrors.trailingComma = oldTrailingComma;
          }
          return left;
        };
        pp$5.parseMaybeConditional = function (
          forInit,
          refDestructuringErrors,
        ) {
          var startPos = this.start,
            startLoc = this.startLoc;
          var expr = this.parseExprOps(forInit, refDestructuringErrors);
          if (this.checkExpressionErrors(refDestructuringErrors)) {
            return expr;
          }
          if (this.eat(types$1.question)) {
            var node = this.startNodeAt(startPos, startLoc);
            node.test = expr;
            node.consequent = this.parseMaybeAssign();
            this.expect(types$1.colon);
            node.alternate = this.parseMaybeAssign(forInit);
            return this.finishNode(node, "ConditionalExpression");
          }
          return expr;
        };
        pp$5.parseExprOps = function (forInit, refDestructuringErrors) {
          var startPos = this.start,
            startLoc = this.startLoc;
          var expr = this.parseMaybeUnary(
            refDestructuringErrors,
            false,
            false,
            forInit,
          );
          if (this.checkExpressionErrors(refDestructuringErrors)) {
            return expr;
          }
          return expr.start === startPos &&
            expr.type === "ArrowFunctionExpression"
            ? expr
            : this.parseExprOp(expr, startPos, startLoc, -1, forInit);
        };
        pp$5.parseExprOp = function (
          left,
          leftStartPos,
          leftStartLoc,
          minPrec,
          forInit,
        ) {
          var prec = this.type.binop;
          if (prec != null && (!forInit || this.type !== types$1._in)) {
            if (prec > minPrec) {
              var logical =
                this.type === types$1.logicalOR ||
                this.type === types$1.logicalAND;
              var coalesce = this.type === types$1.coalesce;
              if (coalesce) {
                prec = types$1.logicalAND.binop;
              }
              var op = this.value;
              this.next();
              var startPos = this.start,
                startLoc = this.startLoc;
              var right = this.parseExprOp(
                this.parseMaybeUnary(null, false, false, forInit),
                startPos,
                startLoc,
                prec,
                forInit,
              );
              var node = this.buildBinary(
                leftStartPos,
                leftStartLoc,
                left,
                right,
                op,
                logical || coalesce,
              );
              if (
                (logical && this.type === types$1.coalesce) ||
                (coalesce &&
                  (this.type === types$1.logicalOR ||
                    this.type === types$1.logicalAND))
              ) {
                this.raiseRecoverable(
                  this.start,
                  "Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses",
                );
              }
              return this.parseExprOp(
                node,
                leftStartPos,
                leftStartLoc,
                minPrec,
                forInit,
              );
            }
          }
          return left;
        };
        pp$5.buildBinary = function (
          startPos,
          startLoc,
          left,
          right,
          op,
          logical,
        ) {
          if (right.type === "PrivateIdentifier") {
            this.raise(
              right.start,
              "Private identifier can only be left side of binary expression",
            );
          }
          var node = this.startNodeAt(startPos, startLoc);
          node.left = left;
          node.operator = op;
          node.right = right;
          return this.finishNode(
            node,
            logical ? "LogicalExpression" : "BinaryExpression",
          );
        };
        pp$5.parseMaybeUnary = function (
          refDestructuringErrors,
          sawUnary,
          incDec,
          forInit,
        ) {
          var startPos = this.start,
            startLoc = this.startLoc,
            expr;
          if (this.isContextual("await") && this.canAwait) {
            expr = this.parseAwait(forInit);
            sawUnary = true;
          } else if (this.type.prefix) {
            var node = this.startNode(),
              update = this.type === types$1.incDec;
            node.operator = this.value;
            node.prefix = true;
            this.next();
            node.argument = this.parseMaybeUnary(null, true, update, forInit);
            this.checkExpressionErrors(refDestructuringErrors, true);
            if (update) {
              this.checkLValSimple(node.argument);
            } else if (
              this.strict &&
              node.operator === "delete" &&
              isLocalVariableAccess(node.argument)
            ) {
              this.raiseRecoverable(
                node.start,
                "Deleting local variable in strict mode",
              );
            } else if (
              node.operator === "delete" &&
              isPrivateFieldAccess(node.argument)
            ) {
              this.raiseRecoverable(
                node.start,
                "Private fields can not be deleted",
              );
            } else {
              sawUnary = true;
            }
            expr = this.finishNode(
              node,
              update ? "UpdateExpression" : "UnaryExpression",
            );
          } else if (!sawUnary && this.type === types$1.privateId) {
            if (
              (forInit || this.privateNameStack.length === 0) &&
              this.options.checkPrivateFields
            ) {
              this.unexpected();
            }
            expr = this.parsePrivateIdent();
            if (this.type !== types$1._in) {
              this.unexpected();
            }
          } else {
            expr = this.parseExprSubscripts(refDestructuringErrors, forInit);
            if (this.checkExpressionErrors(refDestructuringErrors)) {
              return expr;
            }
            while (this.type.postfix && !this.canInsertSemicolon()) {
              var node$1 = this.startNodeAt(startPos, startLoc);
              node$1.operator = this.value;
              node$1.prefix = false;
              node$1.argument = expr;
              this.checkLValSimple(expr);
              this.next();
              expr = this.finishNode(node$1, "UpdateExpression");
            }
          }
          if (!incDec && this.eat(types$1.starstar)) {
            if (sawUnary) {
              this.unexpected(this.lastTokStart);
            } else {
              return this.buildBinary(
                startPos,
                startLoc,
                expr,
                this.parseMaybeUnary(null, false, false, forInit),
                "**",
                false,
              );
            }
          } else {
            return expr;
          }
        };
        function isLocalVariableAccess(node) {
          return (
            node.type === "Identifier" ||
            (node.type === "ParenthesizedExpression" &&
              isLocalVariableAccess(node.expression))
          );
        }
        function isPrivateFieldAccess(node) {
          return (
            (node.type === "MemberExpression" &&
              node.property.type === "PrivateIdentifier") ||
            (node.type === "ChainExpression" &&
              isPrivateFieldAccess(node.expression)) ||
            (node.type === "ParenthesizedExpression" &&
              isPrivateFieldAccess(node.expression))
          );
        }
        pp$5.parseExprSubscripts = function (refDestructuringErrors, forInit) {
          var startPos = this.start,
            startLoc = this.startLoc;
          var expr = this.parseExprAtom(refDestructuringErrors, forInit);
          if (
            expr.type === "ArrowFunctionExpression" &&
            this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")"
          ) {
            return expr;
          }
          var result = this.parseSubscripts(
            expr,
            startPos,
            startLoc,
            false,
            forInit,
          );
          if (refDestructuringErrors && result.type === "MemberExpression") {
            if (refDestructuringErrors.parenthesizedAssign >= result.start) {
              refDestructuringErrors.parenthesizedAssign = -1;
            }
            if (refDestructuringErrors.parenthesizedBind >= result.start) {
              refDestructuringErrors.parenthesizedBind = -1;
            }
            if (refDestructuringErrors.trailingComma >= result.start) {
              refDestructuringErrors.trailingComma = -1;
            }
          }
          return result;
        };
        pp$5.parseSubscripts = function (
          base,
          startPos,
          startLoc,
          noCalls,
          forInit,
        ) {
          var maybeAsyncArrow =
            this.options.ecmaVersion >= 8 &&
            base.type === "Identifier" &&
            base.name === "async" &&
            this.lastTokEnd === base.end &&
            !this.canInsertSemicolon() &&
            base.end - base.start === 5 &&
            this.potentialArrowAt === base.start;
          var optionalChained = false;
          while (true) {
            var element = this.parseSubscript(
              base,
              startPos,
              startLoc,
              noCalls,
              maybeAsyncArrow,
              optionalChained,
              forInit,
            );
            if (element.optional) {
              optionalChained = true;
            }
            if (
              element === base ||
              element.type === "ArrowFunctionExpression"
            ) {
              if (optionalChained) {
                var chainNode = this.startNodeAt(startPos, startLoc);
                chainNode.expression = element;
                element = this.finishNode(chainNode, "ChainExpression");
              }
              return element;
            }
            base = element;
          }
        };
        pp$5.shouldParseAsyncArrow = function () {
          return !this.canInsertSemicolon() && this.eat(types$1.arrow);
        };
        pp$5.parseSubscriptAsyncArrow = function (
          startPos,
          startLoc,
          exprList,
          forInit,
        ) {
          return this.parseArrowExpression(
            this.startNodeAt(startPos, startLoc),
            exprList,
            true,
            forInit,
          );
        };
        pp$5.parseSubscript = function (
          base,
          startPos,
          startLoc,
          noCalls,
          maybeAsyncArrow,
          optionalChained,
          forInit,
        ) {
          var optionalSupported = this.options.ecmaVersion >= 11;
          var optional = optionalSupported && this.eat(types$1.questionDot);
          if (noCalls && optional) {
            this.raise(
              this.lastTokStart,
              "Optional chaining cannot appear in the callee of new expressions",
            );
          }
          var computed = this.eat(types$1.bracketL);
          if (
            computed ||
            (optional &&
              this.type !== types$1.parenL &&
              this.type !== types$1.backQuote) ||
            this.eat(types$1.dot)
          ) {
            var node = this.startNodeAt(startPos, startLoc);
            node.object = base;
            if (computed) {
              node.property = this.parseExpression();
              this.expect(types$1.bracketR);
            } else if (
              this.type === types$1.privateId &&
              base.type !== "Super"
            ) {
              node.property = this.parsePrivateIdent();
            } else {
              node.property = this.parseIdent(
                this.options.allowReserved !== "never",
              );
            }
            node.computed = !!computed;
            if (optionalSupported) {
              node.optional = optional;
            }
            base = this.finishNode(node, "MemberExpression");
          } else if (!noCalls && this.eat(types$1.parenL)) {
            var refDestructuringErrors = new DestructuringErrors(),
              oldYieldPos = this.yieldPos,
              oldAwaitPos = this.awaitPos,
              oldAwaitIdentPos = this.awaitIdentPos;
            this.yieldPos = 0;
            this.awaitPos = 0;
            this.awaitIdentPos = 0;
            var exprList = this.parseExprList(
              types$1.parenR,
              this.options.ecmaVersion >= 8,
              false,
              refDestructuringErrors,
            );
            if (maybeAsyncArrow && !optional && this.shouldParseAsyncArrow()) {
              this.checkPatternErrors(refDestructuringErrors, false);
              this.checkYieldAwaitInDefaultParams();
              if (this.awaitIdentPos > 0) {
                this.raise(
                  this.awaitIdentPos,
                  "Cannot use 'await' as identifier inside an async function",
                );
              }
              this.yieldPos = oldYieldPos;
              this.awaitPos = oldAwaitPos;
              this.awaitIdentPos = oldAwaitIdentPos;
              return this.parseSubscriptAsyncArrow(
                startPos,
                startLoc,
                exprList,
                forInit,
              );
            }
            this.checkExpressionErrors(refDestructuringErrors, true);
            this.yieldPos = oldYieldPos || this.yieldPos;
            this.awaitPos = oldAwaitPos || this.awaitPos;
            this.awaitIdentPos = oldAwaitIdentPos || this.awaitIdentPos;
            var node$1 = this.startNodeAt(startPos, startLoc);
            node$1.callee = base;
            node$1.arguments = exprList;
            if (optionalSupported) {
              node$1.optional = optional;
            }
            base = this.finishNode(node$1, "CallExpression");
          } else if (this.type === types$1.backQuote) {
            if (optional || optionalChained) {
              this.raise(
                this.start,
                "Optional chaining cannot appear in the tag of tagged template expressions",
              );
            }
            var node$2 = this.startNodeAt(startPos, startLoc);
            node$2.tag = base;
            node$2.quasi = this.parseTemplate({ isTagged: true });
            base = this.finishNode(node$2, "TaggedTemplateExpression");
          }
          return base;
        };
        pp$5.parseExprAtom = function (
          refDestructuringErrors,
          forInit,
          forNew,
        ) {
          if (this.type === types$1.slash) {
            this.readRegexp();
          }
          var node,
            canBeArrow = this.potentialArrowAt === this.start;
          switch (this.type) {
            case types$1._super:
              if (!this.allowSuper) {
                this.raise(this.start, "'super' keyword outside a method");
              }
              node = this.startNode();
              this.next();
              if (this.type === types$1.parenL && !this.allowDirectSuper) {
                this.raise(
                  node.start,
                  "super() call outside constructor of a subclass",
                );
              }
              if (
                this.type !== types$1.dot &&
                this.type !== types$1.bracketL &&
                this.type !== types$1.parenL
              ) {
                this.unexpected();
              }
              return this.finishNode(node, "Super");
            case types$1._this:
              node = this.startNode();
              this.next();
              return this.finishNode(node, "ThisExpression");
            case types$1.name:
              var startPos = this.start,
                startLoc = this.startLoc,
                containsEsc = this.containsEsc;
              var id = this.parseIdent(false);
              if (
                this.options.ecmaVersion >= 8 &&
                !containsEsc &&
                id.name === "async" &&
                !this.canInsertSemicolon() &&
                this.eat(types$1._function)
              ) {
                this.overrideContext(types.f_expr);
                return this.parseFunction(
                  this.startNodeAt(startPos, startLoc),
                  0,
                  false,
                  true,
                  forInit,
                );
              }
              if (canBeArrow && !this.canInsertSemicolon()) {
                if (this.eat(types$1.arrow)) {
                  return this.parseArrowExpression(
                    this.startNodeAt(startPos, startLoc),
                    [id],
                    false,
                    forInit,
                  );
                }
                if (
                  this.options.ecmaVersion >= 8 &&
                  id.name === "async" &&
                  this.type === types$1.name &&
                  !containsEsc &&
                  (!this.potentialArrowInForAwait ||
                    this.value !== "of" ||
                    this.containsEsc)
                ) {
                  id = this.parseIdent(false);
                  if (this.canInsertSemicolon() || !this.eat(types$1.arrow)) {
                    this.unexpected();
                  }
                  return this.parseArrowExpression(
                    this.startNodeAt(startPos, startLoc),
                    [id],
                    true,
                    forInit,
                  );
                }
              }
              return id;
            case types$1.regexp:
              var value = this.value;
              node = this.parseLiteral(value.value);
              node.regex = { pattern: value.pattern, flags: value.flags };
              return node;
            case types$1.num:
            case types$1.string:
              return this.parseLiteral(this.value);
            case types$1._null:
            case types$1._true:
            case types$1._false:
              node = this.startNode();
              node.value =
                this.type === types$1._null
                  ? null
                  : this.type === types$1._true;
              node.raw = this.type.keyword;
              this.next();
              return this.finishNode(node, "Literal");
            case types$1.parenL:
              var start = this.start,
                expr = this.parseParenAndDistinguishExpression(
                  canBeArrow,
                  forInit,
                );
              if (refDestructuringErrors) {
                if (
                  refDestructuringErrors.parenthesizedAssign < 0 &&
                  !this.isSimpleAssignTarget(expr)
                ) {
                  refDestructuringErrors.parenthesizedAssign = start;
                }
                if (refDestructuringErrors.parenthesizedBind < 0) {
                  refDestructuringErrors.parenthesizedBind = start;
                }
              }
              return expr;
            case types$1.bracketL:
              node = this.startNode();
              this.next();
              node.elements = this.parseExprList(
                types$1.bracketR,
                true,
                true,
                refDestructuringErrors,
              );
              return this.finishNode(node, "ArrayExpression");
            case types$1.braceL:
              this.overrideContext(types.b_expr);
              return this.parseObj(false, refDestructuringErrors);
            case types$1._function:
              node = this.startNode();
              this.next();
              return this.parseFunction(node, 0);
            case types$1._class:
              return this.parseClass(this.startNode(), false);
            case types$1._new:
              return this.parseNew();
            case types$1.backQuote:
              return this.parseTemplate();
            case types$1._import:
              if (this.options.ecmaVersion >= 11) {
                return this.parseExprImport(forNew);
              } else {
                return this.unexpected();
              }
            default:
              return this.parseExprAtomDefault();
          }
        };
        pp$5.parseExprAtomDefault = function () {
          this.unexpected();
        };
        pp$5.parseExprImport = function (forNew) {
          var node = this.startNode();
          if (this.containsEsc) {
            this.raiseRecoverable(
              this.start,
              "Escape sequence in keyword import",
            );
          }
          this.next();
          if (this.type === types$1.parenL && !forNew) {
            return this.parseDynamicImport(node);
          } else if (this.type === types$1.dot) {
            var meta = this.startNodeAt(node.start, node.loc && node.loc.start);
            meta.name = "import";
            node.meta = this.finishNode(meta, "Identifier");
            return this.parseImportMeta(node);
          } else {
            this.unexpected();
          }
        };
        pp$5.parseDynamicImport = function (node) {
          this.next();
          node.source = this.parseMaybeAssign();
          if (this.options.ecmaVersion >= 16) {
            if (!this.eat(types$1.parenR)) {
              this.expect(types$1.comma);
              if (!this.afterTrailingComma(types$1.parenR)) {
                node.options = this.parseMaybeAssign();
                if (!this.eat(types$1.parenR)) {
                  this.expect(types$1.comma);
                  if (!this.afterTrailingComma(types$1.parenR)) {
                    this.unexpected();
                  }
                }
              } else {
                node.options = null;
              }
            } else {
              node.options = null;
            }
          } else {
            if (!this.eat(types$1.parenR)) {
              var errorPos = this.start;
              if (this.eat(types$1.comma) && this.eat(types$1.parenR)) {
                this.raiseRecoverable(
                  errorPos,
                  "Trailing comma is not allowed in import()",
                );
              } else {
                this.unexpected(errorPos);
              }
            }
          }
          return this.finishNode(node, "ImportExpression");
        };
        pp$5.parseImportMeta = function (node) {
          this.next();
          var containsEsc = this.containsEsc;
          node.property = this.parseIdent(true);
          if (node.property.name !== "meta") {
            this.raiseRecoverable(
              node.property.start,
              "The only valid meta property for import is 'import.meta'",
            );
          }
          if (containsEsc) {
            this.raiseRecoverable(
              node.start,
              "'import.meta' must not contain escaped characters",
            );
          }
          if (
            this.options.sourceType !== "module" &&
            !this.options.allowImportExportEverywhere
          ) {
            this.raiseRecoverable(
              node.start,
              "Cannot use 'import.meta' outside a module",
            );
          }
          return this.finishNode(node, "MetaProperty");
        };
        pp$5.parseLiteral = function (value) {
          var node = this.startNode();
          node.value = value;
          node.raw = this.input.slice(this.start, this.end);
          if (node.raw.charCodeAt(node.raw.length - 1) === 110) {
            node.bigint = node.raw.slice(0, -1).replace(/_/g, "");
          }
          this.next();
          return this.finishNode(node, "Literal");
        };
        pp$5.parseParenExpression = function () {
          this.expect(types$1.parenL);
          var val = this.parseExpression();
          this.expect(types$1.parenR);
          return val;
        };
        pp$5.shouldParseArrow = function (exprList) {
          return !this.canInsertSemicolon();
        };
        pp$5.parseParenAndDistinguishExpression = function (
          canBeArrow,
          forInit,
        ) {
          var startPos = this.start,
            startLoc = this.startLoc,
            val,
            allowTrailingComma = this.options.ecmaVersion >= 8;
          if (this.options.ecmaVersion >= 6) {
            this.next();
            var innerStartPos = this.start,
              innerStartLoc = this.startLoc;
            var exprList = [],
              first = true,
              lastIsComma = false;
            var refDestructuringErrors = new DestructuringErrors(),
              oldYieldPos = this.yieldPos,
              oldAwaitPos = this.awaitPos,
              spreadStart;
            this.yieldPos = 0;
            this.awaitPos = 0;
            while (this.type !== types$1.parenR) {
              first ? (first = false) : this.expect(types$1.comma);
              if (
                allowTrailingComma &&
                this.afterTrailingComma(types$1.parenR, true)
              ) {
                lastIsComma = true;
                break;
              } else if (this.type === types$1.ellipsis) {
                spreadStart = this.start;
                exprList.push(this.parseParenItem(this.parseRestBinding()));
                if (this.type === types$1.comma) {
                  this.raiseRecoverable(
                    this.start,
                    "Comma is not permitted after the rest element",
                  );
                }
                break;
              } else {
                exprList.push(
                  this.parseMaybeAssign(
                    false,
                    refDestructuringErrors,
                    this.parseParenItem,
                  ),
                );
              }
            }
            var innerEndPos = this.lastTokEnd,
              innerEndLoc = this.lastTokEndLoc;
            this.expect(types$1.parenR);
            if (
              canBeArrow &&
              this.shouldParseArrow(exprList) &&
              this.eat(types$1.arrow)
            ) {
              this.checkPatternErrors(refDestructuringErrors, false);
              this.checkYieldAwaitInDefaultParams();
              this.yieldPos = oldYieldPos;
              this.awaitPos = oldAwaitPos;
              return this.parseParenArrowList(
                startPos,
                startLoc,
                exprList,
                forInit,
              );
            }
            if (!exprList.length || lastIsComma) {
              this.unexpected(this.lastTokStart);
            }
            if (spreadStart) {
              this.unexpected(spreadStart);
            }
            this.checkExpressionErrors(refDestructuringErrors, true);
            this.yieldPos = oldYieldPos || this.yieldPos;
            this.awaitPos = oldAwaitPos || this.awaitPos;
            if (exprList.length > 1) {
              val = this.startNodeAt(innerStartPos, innerStartLoc);
              val.expressions = exprList;
              this.finishNodeAt(
                val,
                "SequenceExpression",
                innerEndPos,
                innerEndLoc,
              );
            } else {
              val = exprList[0];
            }
          } else {
            val = this.parseParenExpression();
          }
          if (this.options.preserveParens) {
            var par = this.startNodeAt(startPos, startLoc);
            par.expression = val;
            return this.finishNode(par, "ParenthesizedExpression");
          } else {
            return val;
          }
        };
        pp$5.parseParenItem = function (item) {
          return item;
        };
        pp$5.parseParenArrowList = function (
          startPos,
          startLoc,
          exprList,
          forInit,
        ) {
          return this.parseArrowExpression(
            this.startNodeAt(startPos, startLoc),
            exprList,
            false,
            forInit,
          );
        };
        var empty = [];
        pp$5.parseNew = function () {
          if (this.containsEsc) {
            this.raiseRecoverable(this.start, "Escape sequence in keyword new");
          }
          var node = this.startNode();
          this.next();
          if (this.options.ecmaVersion >= 6 && this.type === types$1.dot) {
            var meta = this.startNodeAt(node.start, node.loc && node.loc.start);
            meta.name = "new";
            node.meta = this.finishNode(meta, "Identifier");
            this.next();
            var containsEsc = this.containsEsc;
            node.property = this.parseIdent(true);
            if (node.property.name !== "target") {
              this.raiseRecoverable(
                node.property.start,
                "The only valid meta property for new is 'new.target'",
              );
            }
            if (containsEsc) {
              this.raiseRecoverable(
                node.start,
                "'new.target' must not contain escaped characters",
              );
            }
            if (!this.allowNewDotTarget) {
              this.raiseRecoverable(
                node.start,
                "'new.target' can only be used in functions and class static block",
              );
            }
            return this.finishNode(node, "MetaProperty");
          }
          var startPos = this.start,
            startLoc = this.startLoc;
          node.callee = this.parseSubscripts(
            this.parseExprAtom(null, false, true),
            startPos,
            startLoc,
            true,
            false,
          );
          if (this.eat(types$1.parenL)) {
            node.arguments = this.parseExprList(
              types$1.parenR,
              this.options.ecmaVersion >= 8,
              false,
            );
          } else {
            node.arguments = empty;
          }
          return this.finishNode(node, "NewExpression");
        };
        pp$5.parseTemplateElement = function (ref) {
          var isTagged = ref.isTagged;
          var elem = this.startNode();
          if (this.type === types$1.invalidTemplate) {
            if (!isTagged) {
              this.raiseRecoverable(
                this.start,
                "Bad escape sequence in untagged template literal",
              );
            }
            elem.value = {
              raw: this.value.replace(/\r\n?/g, "\n"),
              cooked: null,
            };
          } else {
            elem.value = {
              raw: this.input
                .slice(this.start, this.end)
                .replace(/\r\n?/g, "\n"),
              cooked: this.value,
            };
          }
          this.next();
          elem.tail = this.type === types$1.backQuote;
          return this.finishNode(elem, "TemplateElement");
        };
        pp$5.parseTemplate = function (ref) {
          if (ref === void 0) ref = {};
          var isTagged = ref.isTagged;
          if (isTagged === void 0) isTagged = false;
          var node = this.startNode();
          this.next();
          node.expressions = [];
          var curElt = this.parseTemplateElement({ isTagged });
          node.quasis = [curElt];
          while (!curElt.tail) {
            if (this.type === types$1.eof) {
              this.raise(this.pos, "Unterminated template literal");
            }
            this.expect(types$1.dollarBraceL);
            node.expressions.push(this.parseExpression());
            this.expect(types$1.braceR);
            node.quasis.push(
              (curElt = this.parseTemplateElement({ isTagged })),
            );
          }
          this.next();
          return this.finishNode(node, "TemplateLiteral");
        };
        pp$5.isAsyncProp = function (prop) {
          return (
            !prop.computed &&
            prop.key.type === "Identifier" &&
            prop.key.name === "async" &&
            (this.type === types$1.name ||
              this.type === types$1.num ||
              this.type === types$1.string ||
              this.type === types$1.bracketL ||
              this.type.keyword ||
              (this.options.ecmaVersion >= 9 && this.type === types$1.star)) &&
            !lineBreak.test(this.input.slice(this.lastTokEnd, this.start))
          );
        };
        pp$5.parseObj = function (isPattern, refDestructuringErrors) {
          var node = this.startNode(),
            first = true,
            propHash = {};
          node.properties = [];
          this.next();
          while (!this.eat(types$1.braceR)) {
            if (!first) {
              this.expect(types$1.comma);
              if (
                this.options.ecmaVersion >= 5 &&
                this.afterTrailingComma(types$1.braceR)
              ) {
                break;
              }
            } else {
              first = false;
            }
            var prop = this.parseProperty(isPattern, refDestructuringErrors);
            if (!isPattern) {
              this.checkPropClash(prop, propHash, refDestructuringErrors);
            }
            node.properties.push(prop);
          }
          return this.finishNode(
            node,
            isPattern ? "ObjectPattern" : "ObjectExpression",
          );
        };
        pp$5.parseProperty = function (isPattern, refDestructuringErrors) {
          var prop = this.startNode(),
            isGenerator,
            isAsync,
            startPos,
            startLoc;
          if (this.options.ecmaVersion >= 9 && this.eat(types$1.ellipsis)) {
            if (isPattern) {
              prop.argument = this.parseIdent(false);
              if (this.type === types$1.comma) {
                this.raiseRecoverable(
                  this.start,
                  "Comma is not permitted after the rest element",
                );
              }
              return this.finishNode(prop, "RestElement");
            }
            prop.argument = this.parseMaybeAssign(
              false,
              refDestructuringErrors,
            );
            if (
              this.type === types$1.comma &&
              refDestructuringErrors &&
              refDestructuringErrors.trailingComma < 0
            ) {
              refDestructuringErrors.trailingComma = this.start;
            }
            return this.finishNode(prop, "SpreadElement");
          }
          if (this.options.ecmaVersion >= 6) {
            prop.method = false;
            prop.shorthand = false;
            if (isPattern || refDestructuringErrors) {
              startPos = this.start;
              startLoc = this.startLoc;
            }
            if (!isPattern) {
              isGenerator = this.eat(types$1.star);
            }
          }
          var containsEsc = this.containsEsc;
          this.parsePropertyName(prop);
          if (
            !isPattern &&
            !containsEsc &&
            this.options.ecmaVersion >= 8 &&
            !isGenerator &&
            this.isAsyncProp(prop)
          ) {
            isAsync = true;
            isGenerator =
              this.options.ecmaVersion >= 9 && this.eat(types$1.star);
            this.parsePropertyName(prop);
          } else {
            isAsync = false;
          }
          this.parsePropertyValue(
            prop,
            isPattern,
            isGenerator,
            isAsync,
            startPos,
            startLoc,
            refDestructuringErrors,
            containsEsc,
          );
          return this.finishNode(prop, "Property");
        };
        pp$5.parseGetterSetter = function (prop) {
          prop.kind = prop.key.name;
          this.parsePropertyName(prop);
          prop.value = this.parseMethod(false);
          var paramCount = prop.kind === "get" ? 0 : 1;
          if (prop.value.params.length !== paramCount) {
            var start = prop.value.start;
            if (prop.kind === "get") {
              this.raiseRecoverable(start, "getter should have no params");
            } else {
              this.raiseRecoverable(
                start,
                "setter should have exactly one param",
              );
            }
          } else {
            if (
              prop.kind === "set" &&
              prop.value.params[0].type === "RestElement"
            ) {
              this.raiseRecoverable(
                prop.value.params[0].start,
                "Setter cannot use rest params",
              );
            }
          }
        };
        pp$5.parsePropertyValue = function (
          prop,
          isPattern,
          isGenerator,
          isAsync,
          startPos,
          startLoc,
          refDestructuringErrors,
          containsEsc,
        ) {
          if ((isGenerator || isAsync) && this.type === types$1.colon) {
            this.unexpected();
          }
          if (this.eat(types$1.colon)) {
            prop.value = isPattern
              ? this.parseMaybeDefault(this.start, this.startLoc)
              : this.parseMaybeAssign(false, refDestructuringErrors);
            prop.kind = "init";
          } else if (
            this.options.ecmaVersion >= 6 &&
            this.type === types$1.parenL
          ) {
            if (isPattern) {
              this.unexpected();
            }
            prop.kind = "init";
            prop.method = true;
            prop.value = this.parseMethod(isGenerator, isAsync);
          } else if (
            !isPattern &&
            !containsEsc &&
            this.options.ecmaVersion >= 5 &&
            !prop.computed &&
            prop.key.type === "Identifier" &&
            (prop.key.name === "get" || prop.key.name === "set") &&
            this.type !== types$1.comma &&
            this.type !== types$1.braceR &&
            this.type !== types$1.eq
          ) {
            if (isGenerator || isAsync) {
              this.unexpected();
            }
            this.parseGetterSetter(prop);
          } else if (
            this.options.ecmaVersion >= 6 &&
            !prop.computed &&
            prop.key.type === "Identifier"
          ) {
            if (isGenerator || isAsync) {
              this.unexpected();
            }
            this.checkUnreserved(prop.key);
            if (prop.key.name === "await" && !this.awaitIdentPos) {
              this.awaitIdentPos = startPos;
            }
            prop.kind = "init";
            if (isPattern) {
              prop.value = this.parseMaybeDefault(
                startPos,
                startLoc,
                this.copyNode(prop.key),
              );
            } else if (this.type === types$1.eq && refDestructuringErrors) {
              if (refDestructuringErrors.shorthandAssign < 0) {
                refDestructuringErrors.shorthandAssign = this.start;
              }
              prop.value = this.parseMaybeDefault(
                startPos,
                startLoc,
                this.copyNode(prop.key),
              );
            } else {
              prop.value = this.copyNode(prop.key);
            }
            prop.shorthand = true;
          } else {
            this.unexpected();
          }
        };
        pp$5.parsePropertyName = function (prop) {
          if (this.options.ecmaVersion >= 6) {
            if (this.eat(types$1.bracketL)) {
              prop.computed = true;
              prop.key = this.parseMaybeAssign();
              this.expect(types$1.bracketR);
              return prop.key;
            } else {
              prop.computed = false;
            }
          }
          return (prop.key =
            this.type === types$1.num || this.type === types$1.string
              ? this.parseExprAtom()
              : this.parseIdent(this.options.allowReserved !== "never"));
        };
        pp$5.initFunction = function (node) {
          node.id = null;
          if (this.options.ecmaVersion >= 6) {
            node.generator = node.expression = false;
          }
          if (this.options.ecmaVersion >= 8) {
            node.async = false;
          }
        };
        pp$5.parseMethod = function (isGenerator, isAsync, allowDirectSuper) {
          var node = this.startNode(),
            oldYieldPos = this.yieldPos,
            oldAwaitPos = this.awaitPos,
            oldAwaitIdentPos = this.awaitIdentPos;
          this.initFunction(node);
          if (this.options.ecmaVersion >= 6) {
            node.generator = isGenerator;
          }
          if (this.options.ecmaVersion >= 8) {
            node.async = !!isAsync;
          }
          this.yieldPos = 0;
          this.awaitPos = 0;
          this.awaitIdentPos = 0;
          this.enterScope(
            functionFlags(isAsync, node.generator) |
              SCOPE_SUPER |
              (allowDirectSuper ? SCOPE_DIRECT_SUPER : 0),
          );
          this.expect(types$1.parenL);
          node.params = this.parseBindingList(
            types$1.parenR,
            false,
            this.options.ecmaVersion >= 8,
          );
          this.checkYieldAwaitInDefaultParams();
          this.parseFunctionBody(node, false, true, false);
          this.yieldPos = oldYieldPos;
          this.awaitPos = oldAwaitPos;
          this.awaitIdentPos = oldAwaitIdentPos;
          return this.finishNode(node, "FunctionExpression");
        };
        pp$5.parseArrowExpression = function (node, params, isAsync, forInit) {
          var oldYieldPos = this.yieldPos,
            oldAwaitPos = this.awaitPos,
            oldAwaitIdentPos = this.awaitIdentPos;
          this.enterScope(functionFlags(isAsync, false) | SCOPE_ARROW);
          this.initFunction(node);
          if (this.options.ecmaVersion >= 8) {
            node.async = !!isAsync;
          }
          this.yieldPos = 0;
          this.awaitPos = 0;
          this.awaitIdentPos = 0;
          node.params = this.toAssignableList(params, true);
          this.parseFunctionBody(node, true, false, forInit);
          this.yieldPos = oldYieldPos;
          this.awaitPos = oldAwaitPos;
          this.awaitIdentPos = oldAwaitIdentPos;
          return this.finishNode(node, "ArrowFunctionExpression");
        };
        pp$5.parseFunctionBody = function (
          node,
          isArrowFunction,
          isMethod,
          forInit,
        ) {
          var isExpression = isArrowFunction && this.type !== types$1.braceL;
          var oldStrict = this.strict,
            useStrict = false;
          if (isExpression) {
            node.body = this.parseMaybeAssign(forInit);
            node.expression = true;
            this.checkParams(node, false);
          } else {
            var nonSimple =
              this.options.ecmaVersion >= 7 &&
              !this.isSimpleParamList(node.params);
            if (!oldStrict || nonSimple) {
              useStrict = this.strictDirective(this.end);
              if (useStrict && nonSimple) {
                this.raiseRecoverable(
                  node.start,
                  "Illegal 'use strict' directive in function with non-simple parameter list",
                );
              }
            }
            var oldLabels = this.labels;
            this.labels = [];
            if (useStrict) {
              this.strict = true;
            }
            this.checkParams(
              node,
              !oldStrict &&
                !useStrict &&
                !isArrowFunction &&
                !isMethod &&
                this.isSimpleParamList(node.params),
            );
            if (this.strict && node.id) {
              this.checkLValSimple(node.id, BIND_OUTSIDE);
            }
            node.body = this.parseBlock(
              false,
              undefined,
              useStrict && !oldStrict,
            );
            node.expression = false;
            this.adaptDirectivePrologue(node.body.body);
            this.labels = oldLabels;
          }
          this.exitScope();
        };
        pp$5.isSimpleParamList = function (params) {
          for (var i = 0, list = params; i < list.length; i += 1) {
            var param = list[i];
            if (param.type !== "Identifier") {
              return false;
            }
          }
          return true;
        };
        pp$5.checkParams = function (node, allowDuplicates) {
          var nameHash = Object.create(null);
          for (var i = 0, list = node.params; i < list.length; i += 1) {
            var param = list[i];
            this.checkLValInnerPattern(
              param,
              BIND_VAR,
              allowDuplicates ? null : nameHash,
            );
          }
        };
        pp$5.parseExprList = function (
          close,
          allowTrailingComma,
          allowEmpty,
          refDestructuringErrors,
        ) {
          var elts = [],
            first = true;
          while (!this.eat(close)) {
            if (!first) {
              this.expect(types$1.comma);
              if (allowTrailingComma && this.afterTrailingComma(close)) {
                break;
              }
            } else {
              first = false;
            }
            var elt = void 0;
            if (allowEmpty && this.type === types$1.comma) {
              elt = null;
            } else if (this.type === types$1.ellipsis) {
              elt = this.parseSpread(refDestructuringErrors);
              if (
                refDestructuringErrors &&
                this.type === types$1.comma &&
                refDestructuringErrors.trailingComma < 0
              ) {
                refDestructuringErrors.trailingComma = this.start;
              }
            } else {
              elt = this.parseMaybeAssign(false, refDestructuringErrors);
            }
            elts.push(elt);
          }
          return elts;
        };
        pp$5.checkUnreserved = function (ref) {
          var start = ref.start;
          var end = ref.end;
          var name = ref.name;
          if (this.inGenerator && name === "yield") {
            this.raiseRecoverable(
              start,
              "Cannot use 'yield' as identifier inside a generator",
            );
          }
          if (this.inAsync && name === "await") {
            this.raiseRecoverable(
              start,
              "Cannot use 'await' as identifier inside an async function",
            );
          }
          if (
            this.currentThisScope().inClassFieldInit &&
            name === "arguments"
          ) {
            this.raiseRecoverable(
              start,
              "Cannot use 'arguments' in class field initializer",
            );
          }
          if (
            this.inClassStaticBlock &&
            (name === "arguments" || name === "await")
          ) {
            this.raise(
              start,
              "Cannot use " + name + " in class static initialization block",
            );
          }
          if (this.keywords.test(name)) {
            this.raise(start, "Unexpected keyword '" + name + "'");
          }
          if (
            this.options.ecmaVersion < 6 &&
            this.input.slice(start, end).indexOf("\\") !== -1
          ) {
            return;
          }
          var re = this.strict ? this.reservedWordsStrict : this.reservedWords;
          if (re.test(name)) {
            if (!this.inAsync && name === "await") {
              this.raiseRecoverable(
                start,
                "Cannot use keyword 'await' outside an async function",
              );
            }
            this.raiseRecoverable(
              start,
              "The keyword '" + name + "' is reserved",
            );
          }
        };
        pp$5.parseIdent = function (liberal) {
          var node = this.parseIdentNode();
          this.next(!!liberal);
          this.finishNode(node, "Identifier");
          if (!liberal) {
            this.checkUnreserved(node);
            if (node.name === "await" && !this.awaitIdentPos) {
              this.awaitIdentPos = node.start;
            }
          }
          return node;
        };
        pp$5.parseIdentNode = function () {
          var node = this.startNode();
          if (this.type === types$1.name) {
            node.name = this.value;
          } else if (this.type.keyword) {
            node.name = this.type.keyword;
            if (
              (node.name === "class" || node.name === "function") &&
              (this.lastTokEnd !== this.lastTokStart + 1 ||
                this.input.charCodeAt(this.lastTokStart) !== 46)
            ) {
              this.context.pop();
            }
            this.type = types$1.name;
          } else {
            this.unexpected();
          }
          return node;
        };
        pp$5.parsePrivateIdent = function () {
          var node = this.startNode();
          if (this.type === types$1.privateId) {
            node.name = this.value;
          } else {
            this.unexpected();
          }
          this.next();
          this.finishNode(node, "PrivateIdentifier");
          if (this.options.checkPrivateFields) {
            if (this.privateNameStack.length === 0) {
              this.raise(
                node.start,
                "Private field '#" +
                  node.name +
                  "' must be declared in an enclosing class",
              );
            } else {
              this.privateNameStack[this.privateNameStack.length - 1].used.push(
                node,
              );
            }
          }
          return node;
        };
        pp$5.parseYield = function (forInit) {
          if (!this.yieldPos) {
            this.yieldPos = this.start;
          }
          var node = this.startNode();
          this.next();
          if (
            this.type === types$1.semi ||
            this.canInsertSemicolon() ||
            (this.type !== types$1.star && !this.type.startsExpr)
          ) {
            node.delegate = false;
            node.argument = null;
          } else {
            node.delegate = this.eat(types$1.star);
            node.argument = this.parseMaybeAssign(forInit);
          }
          return this.finishNode(node, "YieldExpression");
        };
        pp$5.parseAwait = function (forInit) {
          if (!this.awaitPos) {
            this.awaitPos = this.start;
          }
          var node = this.startNode();
          this.next();
          node.argument = this.parseMaybeUnary(null, true, false, forInit);
          return this.finishNode(node, "AwaitExpression");
        };
        var pp$4 = Parser.prototype;
        pp$4.raise = function (pos, message) {
          var loc = getLineInfo(this.input, pos);
          message += " (" + loc.line + ":" + loc.column + ")";
          var err = new SyntaxError(message);
          err.pos = pos;
          err.loc = loc;
          err.raisedAt = this.pos;
          throw err;
        };
        pp$4.raiseRecoverable = pp$4.raise;
        pp$4.curPosition = function () {
          if (this.options.locations) {
            return new Position(this.curLine, this.pos - this.lineStart);
          }
        };
        var pp$3 = Parser.prototype;
        var Scope = function Scope(flags) {
          this.flags = flags;
          this.var = [];
          this.lexical = [];
          this.functions = [];
          this.inClassFieldInit = false;
        };
        pp$3.enterScope = function (flags) {
          this.scopeStack.push(new Scope(flags));
        };
        pp$3.exitScope = function () {
          this.scopeStack.pop();
        };
        pp$3.treatFunctionsAsVarInScope = function (scope) {
          return (
            scope.flags & SCOPE_FUNCTION ||
            (!this.inModule && scope.flags & SCOPE_TOP)
          );
        };
        pp$3.declareName = function (name, bindingType, pos) {
          var redeclared = false;
          if (bindingType === BIND_LEXICAL) {
            var scope = this.currentScope();
            redeclared =
              scope.lexical.indexOf(name) > -1 ||
              scope.functions.indexOf(name) > -1 ||
              scope.var.indexOf(name) > -1;
            scope.lexical.push(name);
            if (this.inModule && scope.flags & SCOPE_TOP) {
              delete this.undefinedExports[name];
            }
          } else if (bindingType === BIND_SIMPLE_CATCH) {
            var scope$1 = this.currentScope();
            scope$1.lexical.push(name);
          } else if (bindingType === BIND_FUNCTION) {
            var scope$2 = this.currentScope();
            if (this.treatFunctionsAsVar) {
              redeclared = scope$2.lexical.indexOf(name) > -1;
            } else {
              redeclared =
                scope$2.lexical.indexOf(name) > -1 ||
                scope$2.var.indexOf(name) > -1;
            }
            scope$2.functions.push(name);
          } else {
            for (var i = this.scopeStack.length - 1; i >= 0; --i) {
              var scope$3 = this.scopeStack[i];
              if (
                (scope$3.lexical.indexOf(name) > -1 &&
                  !(
                    scope$3.flags & SCOPE_SIMPLE_CATCH &&
                    scope$3.lexical[0] === name
                  )) ||
                (!this.treatFunctionsAsVarInScope(scope$3) &&
                  scope$3.functions.indexOf(name) > -1)
              ) {
                redeclared = true;
                break;
              }
              scope$3.var.push(name);
              if (this.inModule && scope$3.flags & SCOPE_TOP) {
                delete this.undefinedExports[name];
              }
              if (scope$3.flags & SCOPE_VAR) {
                break;
              }
            }
          }
          if (redeclared) {
            this.raiseRecoverable(
              pos,
              "Identifier '" + name + "' has already been declared",
            );
          }
        };
        pp$3.checkLocalExport = function (id) {
          if (
            this.scopeStack[0].lexical.indexOf(id.name) === -1 &&
            this.scopeStack[0].var.indexOf(id.name) === -1
          ) {
            this.undefinedExports[id.name] = id;
          }
        };
        pp$3.currentScope = function () {
          return this.scopeStack[this.scopeStack.length - 1];
        };
        pp$3.currentVarScope = function () {
          for (var i = this.scopeStack.length - 1; ; i--) {
            var scope = this.scopeStack[i];
            if (scope.flags & SCOPE_VAR) {
              return scope;
            }
          }
        };
        pp$3.currentThisScope = function () {
          for (var i = this.scopeStack.length - 1; ; i--) {
            var scope = this.scopeStack[i];
            if (scope.flags & SCOPE_VAR && !(scope.flags & SCOPE_ARROW)) {
              return scope;
            }
          }
        };
        var Node = function Node(parser, pos, loc) {
          this.type = "";
          this.start = pos;
          this.end = 0;
          if (parser.options.locations) {
            this.loc = new SourceLocation(parser, loc);
          }
          if (parser.options.directSourceFile) {
            this.sourceFile = parser.options.directSourceFile;
          }
          if (parser.options.ranges) {
            this.range = [pos, 0];
          }
        };
        var pp$2 = Parser.prototype;
        pp$2.startNode = function () {
          return new Node(this, this.start, this.startLoc);
        };
        pp$2.startNodeAt = function (pos, loc) {
          return new Node(this, pos, loc);
        };
        function finishNodeAt(node, type, pos, loc) {
          node.type = type;
          node.end = pos;
          if (this.options.locations) {
            node.loc.end = loc;
          }
          if (this.options.ranges) {
            node.range[1] = pos;
          }
          return node;
        }
        pp$2.finishNode = function (node, type) {
          return finishNodeAt.call(
            this,
            node,
            type,
            this.lastTokEnd,
            this.lastTokEndLoc,
          );
        };
        pp$2.finishNodeAt = function (node, type, pos, loc) {
          return finishNodeAt.call(this, node, type, pos, loc);
        };
        pp$2.copyNode = function (node) {
          var newNode = new Node(this, node.start, this.startLoc);
          for (var prop in node) {
            newNode[prop] = node[prop];
          }
          return newNode;
        };
        var scriptValuesAddedInUnicode =
          "Gara Garay Gukh Gurung_Khema Hrkt Katakana_Or_Hiragana Kawi Kirat_Rai Krai Nag_Mundari Nagm Ol_Onal Onao Sunu Sunuwar Todhri Todr Tulu_Tigalari Tutg Unknown Zzzz";
        var ecma9BinaryProperties =
          "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS";
        var ecma10BinaryProperties =
          ecma9BinaryProperties + " Extended_Pictographic";
        var ecma11BinaryProperties = ecma10BinaryProperties;
        var ecma12BinaryProperties =
          ecma11BinaryProperties + " EBase EComp EMod EPres ExtPict";
        var ecma13BinaryProperties = ecma12BinaryProperties;
        var ecma14BinaryProperties = ecma13BinaryProperties;
        var unicodeBinaryProperties = {
          9: ecma9BinaryProperties,
          10: ecma10BinaryProperties,
          11: ecma11BinaryProperties,
          12: ecma12BinaryProperties,
          13: ecma13BinaryProperties,
          14: ecma14BinaryProperties,
        };
        var ecma14BinaryPropertiesOfStrings =
          "Basic_Emoji Emoji_Keycap_Sequence RGI_Emoji_Modifier_Sequence RGI_Emoji_Flag_Sequence RGI_Emoji_Tag_Sequence RGI_Emoji_ZWJ_Sequence RGI_Emoji";
        var unicodeBinaryPropertiesOfStrings = {
          9: "",
          10: "",
          11: "",
          12: "",
          13: "",
          14: ecma14BinaryPropertiesOfStrings,
        };
        var unicodeGeneralCategoryValues =
          "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu";
        var ecma9ScriptValues =
          "Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb";
        var ecma10ScriptValues =
          ecma9ScriptValues +
          " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd";
        var ecma11ScriptValues =
          ecma10ScriptValues +
          " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho";
        var ecma12ScriptValues =
          ecma11ScriptValues +
          " Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi";
        var ecma13ScriptValues =
          ecma12ScriptValues +
          " Cypro_Minoan Cpmn Old_Uyghur Ougr Tangsa Tnsa Toto Vithkuqi Vith";
        var ecma14ScriptValues =
          ecma13ScriptValues + " " + scriptValuesAddedInUnicode;
        var unicodeScriptValues = {
          9: ecma9ScriptValues,
          10: ecma10ScriptValues,
          11: ecma11ScriptValues,
          12: ecma12ScriptValues,
          13: ecma13ScriptValues,
          14: ecma14ScriptValues,
        };
        var data = {};
        function buildUnicodeData(ecmaVersion) {
          var d = (data[ecmaVersion] = {
            binary: wordsRegexp(
              unicodeBinaryProperties[ecmaVersion] +
                " " +
                unicodeGeneralCategoryValues,
            ),
            binaryOfStrings: wordsRegexp(
              unicodeBinaryPropertiesOfStrings[ecmaVersion],
            ),
            nonBinary: {
              General_Category: wordsRegexp(unicodeGeneralCategoryValues),
              Script: wordsRegexp(unicodeScriptValues[ecmaVersion]),
            },
          });
          d.nonBinary.Script_Extensions = d.nonBinary.Script;
          d.nonBinary.gc = d.nonBinary.General_Category;
          d.nonBinary.sc = d.nonBinary.Script;
          d.nonBinary.scx = d.nonBinary.Script_Extensions;
        }
        for (
          var i = 0, list = [9, 10, 11, 12, 13, 14];
          i < list.length;
          i += 1
        ) {
          var ecmaVersion = list[i];
          buildUnicodeData(ecmaVersion);
        }
        var pp$1 = Parser.prototype;
        var BranchID = function BranchID(parent, base) {
          this.parent = parent;
          this.base = base || this;
        };
        BranchID.prototype.separatedFrom = function separatedFrom(alt) {
          for (var self = this; self; self = self.parent) {
            for (var other = alt; other; other = other.parent) {
              if (self.base === other.base && self !== other) {
                return true;
              }
            }
          }
          return false;
        };
        BranchID.prototype.sibling = function sibling() {
          return new BranchID(this.parent, this.base);
        };
        var RegExpValidationState = function RegExpValidationState(parser) {
          this.parser = parser;
          this.validFlags =
            "gim" +
            (parser.options.ecmaVersion >= 6 ? "uy" : "") +
            (parser.options.ecmaVersion >= 9 ? "s" : "") +
            (parser.options.ecmaVersion >= 13 ? "d" : "") +
            (parser.options.ecmaVersion >= 15 ? "v" : "");
          this.unicodeProperties =
            data[
              parser.options.ecmaVersion >= 14 ? 14 : parser.options.ecmaVersion
            ];
          this.source = "";
          this.flags = "";
          this.start = 0;
          this.switchU = false;
          this.switchV = false;
          this.switchN = false;
          this.pos = 0;
          this.lastIntValue = 0;
          this.lastStringValue = "";
          this.lastAssertionIsQuantifiable = false;
          this.numCapturingParens = 0;
          this.maxBackReference = 0;
          this.groupNames = Object.create(null);
          this.backReferenceNames = [];
          this.branchID = null;
        };
        RegExpValidationState.prototype.reset = function reset(
          start,
          pattern,
          flags,
        ) {
          var unicodeSets = flags.indexOf("v") !== -1;
          var unicode = flags.indexOf("u") !== -1;
          this.start = start | 0;
          this.source = pattern + "";
          this.flags = flags;
          if (unicodeSets && this.parser.options.ecmaVersion >= 15) {
            this.switchU = true;
            this.switchV = true;
            this.switchN = true;
          } else {
            this.switchU = unicode && this.parser.options.ecmaVersion >= 6;
            this.switchV = false;
            this.switchN = unicode && this.parser.options.ecmaVersion >= 9;
          }
        };
        RegExpValidationState.prototype.raise = function raise(message) {
          this.parser.raiseRecoverable(
            this.start,
            "Invalid regular expression: /" + this.source + "/: " + message,
          );
        };
        RegExpValidationState.prototype.at = function at(i, forceU) {
          if (forceU === void 0) forceU = false;
          var s = this.source;
          var l = s.length;
          if (i >= l) {
            return -1;
          }
          var c = s.charCodeAt(i);
          if (
            !(forceU || this.switchU) ||
            c <= 55295 ||
            c >= 57344 ||
            i + 1 >= l
          ) {
            return c;
          }
          var next = s.charCodeAt(i + 1);
          return next >= 56320 && next <= 57343
            ? (c << 10) + next - 56613888
            : c;
        };
        RegExpValidationState.prototype.nextIndex = function nextIndex(
          i,
          forceU,
        ) {
          if (forceU === void 0) forceU = false;
          var s = this.source;
          var l = s.length;
          if (i >= l) {
            return l;
          }
          var c = s.charCodeAt(i),
            next;
          if (
            !(forceU || this.switchU) ||
            c <= 55295 ||
            c >= 57344 ||
            i + 1 >= l ||
            (next = s.charCodeAt(i + 1)) < 56320 ||
            next > 57343
          ) {
            return i + 1;
          }
          return i + 2;
        };
        RegExpValidationState.prototype.current = function current(forceU) {
          if (forceU === void 0) forceU = false;
          return this.at(this.pos, forceU);
        };
        RegExpValidationState.prototype.lookahead = function lookahead(forceU) {
          if (forceU === void 0) forceU = false;
          return this.at(this.nextIndex(this.pos, forceU), forceU);
        };
        RegExpValidationState.prototype.advance = function advance(forceU) {
          if (forceU === void 0) forceU = false;
          this.pos = this.nextIndex(this.pos, forceU);
        };
        RegExpValidationState.prototype.eat = function eat(ch, forceU) {
          if (forceU === void 0) forceU = false;
          if (this.current(forceU) === ch) {
            this.advance(forceU);
            return true;
          }
          return false;
        };
        RegExpValidationState.prototype.eatChars = function eatChars(
          chs,
          forceU,
        ) {
          if (forceU === void 0) forceU = false;
          var pos = this.pos;
          for (var i = 0, list = chs; i < list.length; i += 1) {
            var ch = list[i];
            var current = this.at(pos, forceU);
            if (current === -1 || current !== ch) {
              return false;
            }
            pos = this.nextIndex(pos, forceU);
          }
          this.pos = pos;
          return true;
        };
        pp$1.validateRegExpFlags = function (state) {
          var validFlags = state.validFlags;
          var flags = state.flags;
          var u = false;
          var v = false;
          for (var i = 0; i < flags.length; i++) {
            var flag = flags.charAt(i);
            if (validFlags.indexOf(flag) === -1) {
              this.raise(state.start, "Invalid regular expression flag");
            }
            if (flags.indexOf(flag, i + 1) > -1) {
              this.raise(state.start, "Duplicate regular expression flag");
            }
            if (flag === "u") {
              u = true;
            }
            if (flag === "v") {
              v = true;
            }
          }
          if (this.options.ecmaVersion >= 15 && u && v) {
            this.raise(state.start, "Invalid regular expression flag");
          }
        };
        function hasProp(obj) {
          for (var _ in obj) {
            return true;
          }
          return false;
        }
        pp$1.validateRegExpPattern = function (state) {
          this.regexp_pattern(state);
          if (
            !state.switchN &&
            this.options.ecmaVersion >= 9 &&
            hasProp(state.groupNames)
          ) {
            state.switchN = true;
            this.regexp_pattern(state);
          }
        };
        pp$1.regexp_pattern = function (state) {
          state.pos = 0;
          state.lastIntValue = 0;
          state.lastStringValue = "";
          state.lastAssertionIsQuantifiable = false;
          state.numCapturingParens = 0;
          state.maxBackReference = 0;
          state.groupNames = Object.create(null);
          state.backReferenceNames.length = 0;
          state.branchID = null;
          this.regexp_disjunction(state);
          if (state.pos !== state.source.length) {
            if (state.eat(41)) {
              state.raise("Unmatched ')'");
            }
            if (state.eat(93) || state.eat(125)) {
              state.raise("Lone quantifier brackets");
            }
          }
          if (state.maxBackReference > state.numCapturingParens) {
            state.raise("Invalid escape");
          }
          for (
            var i = 0, list = state.backReferenceNames;
            i < list.length;
            i += 1
          ) {
            var name = list[i];
            if (!state.groupNames[name]) {
              state.raise("Invalid named capture referenced");
            }
          }
        };
        pp$1.regexp_disjunction = function (state) {
          var trackDisjunction = this.options.ecmaVersion >= 16;
          if (trackDisjunction) {
            state.branchID = new BranchID(state.branchID, null);
          }
          this.regexp_alternative(state);
          while (state.eat(124)) {
            if (trackDisjunction) {
              state.branchID = state.branchID.sibling();
            }
            this.regexp_alternative(state);
          }
          if (trackDisjunction) {
            state.branchID = state.branchID.parent;
          }
          if (this.regexp_eatQuantifier(state, true)) {
            state.raise("Nothing to repeat");
          }
          if (state.eat(123)) {
            state.raise("Lone quantifier brackets");
          }
        };
        pp$1.regexp_alternative = function (state) {
          while (
            state.pos < state.source.length &&
            this.regexp_eatTerm(state)
          ) {}
        };
        pp$1.regexp_eatTerm = function (state) {
          if (this.regexp_eatAssertion(state)) {
            if (
              state.lastAssertionIsQuantifiable &&
              this.regexp_eatQuantifier(state)
            ) {
              if (state.switchU) {
                state.raise("Invalid quantifier");
              }
            }
            return true;
          }
          if (
            state.switchU
              ? this.regexp_eatAtom(state)
              : this.regexp_eatExtendedAtom(state)
          ) {
            this.regexp_eatQuantifier(state);
            return true;
          }
          return false;
        };
        pp$1.regexp_eatAssertion = function (state) {
          var start = state.pos;
          state.lastAssertionIsQuantifiable = false;
          if (state.eat(94) || state.eat(36)) {
            return true;
          }
          if (state.eat(92)) {
            if (state.eat(66) || state.eat(98)) {
              return true;
            }
            state.pos = start;
          }
          if (state.eat(40) && state.eat(63)) {
            var lookbehind = false;
            if (this.options.ecmaVersion >= 9) {
              lookbehind = state.eat(60);
            }
            if (state.eat(61) || state.eat(33)) {
              this.regexp_disjunction(state);
              if (!state.eat(41)) {
                state.raise("Unterminated group");
              }
              state.lastAssertionIsQuantifiable = !lookbehind;
              return true;
            }
          }
          state.pos = start;
          return false;
        };
        pp$1.regexp_eatQuantifier = function (state, noError) {
          if (noError === void 0) noError = false;
          if (this.regexp_eatQuantifierPrefix(state, noError)) {
            state.eat(63);
            return true;
          }
          return false;
        };
        pp$1.regexp_eatQuantifierPrefix = function (state, noError) {
          return (
            state.eat(42) ||
            state.eat(43) ||
            state.eat(63) ||
            this.regexp_eatBracedQuantifier(state, noError)
          );
        };
        pp$1.regexp_eatBracedQuantifier = function (state, noError) {
          var start = state.pos;
          if (state.eat(123)) {
            var min = 0,
              max = -1;
            if (this.regexp_eatDecimalDigits(state)) {
              min = state.lastIntValue;
              if (state.eat(44) && this.regexp_eatDecimalDigits(state)) {
                max = state.lastIntValue;
              }
              if (state.eat(125)) {
                if (max !== -1 && max < min && !noError) {
                  state.raise("numbers out of order in {} quantifier");
                }
                return true;
              }
            }
            if (state.switchU && !noError) {
              state.raise("Incomplete quantifier");
            }
            state.pos = start;
          }
          return false;
        };
        pp$1.regexp_eatAtom = function (state) {
          return (
            this.regexp_eatPatternCharacters(state) ||
            state.eat(46) ||
            this.regexp_eatReverseSolidusAtomEscape(state) ||
            this.regexp_eatCharacterClass(state) ||
            this.regexp_eatUncapturingGroup(state) ||
            this.regexp_eatCapturingGroup(state)
          );
        };
        pp$1.regexp_eatReverseSolidusAtomEscape = function (state) {
          var start = state.pos;
          if (state.eat(92)) {
            if (this.regexp_eatAtomEscape(state)) {
              return true;
            }
            state.pos = start;
          }
          return false;
        };
        pp$1.regexp_eatUncapturingGroup = function (state) {
          var start = state.pos;
          if (state.eat(40)) {
            if (state.eat(63)) {
              if (this.options.ecmaVersion >= 16) {
                var addModifiers = this.regexp_eatModifiers(state);
                var hasHyphen = state.eat(45);
                if (addModifiers || hasHyphen) {
                  for (var i = 0; i < addModifiers.length; i++) {
                    var modifier = addModifiers.charAt(i);
                    if (addModifiers.indexOf(modifier, i + 1) > -1) {
                      state.raise("Duplicate regular expression modifiers");
                    }
                  }
                  if (hasHyphen) {
                    var removeModifiers = this.regexp_eatModifiers(state);
                    if (
                      !addModifiers &&
                      !removeModifiers &&
                      state.current() === 58
                    ) {
                      state.raise("Invalid regular expression modifiers");
                    }
                    for (var i$1 = 0; i$1 < removeModifiers.length; i$1++) {
                      var modifier$1 = removeModifiers.charAt(i$1);
                      if (
                        removeModifiers.indexOf(modifier$1, i$1 + 1) > -1 ||
                        addModifiers.indexOf(modifier$1) > -1
                      ) {
                        state.raise("Duplicate regular expression modifiers");
                      }
                    }
                  }
                }
              }
              if (state.eat(58)) {
                this.regexp_disjunction(state);
                if (state.eat(41)) {
                  return true;
                }
                state.raise("Unterminated group");
              }
            }
            state.pos = start;
          }
          return false;
        };
        pp$1.regexp_eatCapturingGroup = function (state) {
          if (state.eat(40)) {
            if (this.options.ecmaVersion >= 9) {
              this.regexp_groupSpecifier(state);
            } else if (state.current() === 63) {
              state.raise("Invalid group");
            }
            this.regexp_disjunction(state);
            if (state.eat(41)) {
              state.numCapturingParens += 1;
              return true;
            }
            state.raise("Unterminated group");
          }
          return false;
        };
        pp$1.regexp_eatModifiers = function (state) {
          var modifiers = "";
          var ch = 0;
          while (
            (ch = state.current()) !== -1 &&
            isRegularExpressionModifier(ch)
          ) {
            modifiers += codePointToString(ch);
            state.advance();
          }
          return modifiers;
        };
        function isRegularExpressionModifier(ch) {
          return ch === 105 || ch === 109 || ch === 115;
        }
        pp$1.regexp_eatExtendedAtom = function (state) {
          return (
            state.eat(46) ||
            this.regexp_eatReverseSolidusAtomEscape(state) ||
            this.regexp_eatCharacterClass(state) ||
            this.regexp_eatUncapturingGroup(state) ||
            this.regexp_eatCapturingGroup(state) ||
            this.regexp_eatInvalidBracedQuantifier(state) ||
            this.regexp_eatExtendedPatternCharacter(state)
          );
        };
        pp$1.regexp_eatInvalidBracedQuantifier = function (state) {
          if (this.regexp_eatBracedQuantifier(state, true)) {
            state.raise("Nothing to repeat");
          }
          return false;
        };
        pp$1.regexp_eatSyntaxCharacter = function (state) {
          var ch = state.current();
          if (isSyntaxCharacter(ch)) {
            state.lastIntValue = ch;
            state.advance();
            return true;
          }
          return false;
        };
        function isSyntaxCharacter(ch) {
          return (
            ch === 36 ||
            (ch >= 40 && ch <= 43) ||
            ch === 46 ||
            ch === 63 ||
            (ch >= 91 && ch <= 94) ||
            (ch >= 123 && ch <= 125)
          );
        }
        pp$1.regexp_eatPatternCharacters = function (state) {
          var start = state.pos;
          var ch = 0;
          while ((ch = state.current()) !== -1 && !isSyntaxCharacter(ch)) {
            state.advance();
          }
          return state.pos !== start;
        };
        pp$1.regexp_eatExtendedPatternCharacter = function (state) {
          var ch = state.current();
          if (
            ch !== -1 &&
            ch !== 36 &&
            !(ch >= 40 && ch <= 43) &&
            ch !== 46 &&
            ch !== 63 &&
            ch !== 91 &&
            ch !== 94 &&
            ch !== 124
          ) {
            state.advance();
            return true;
          }
          return false;
        };
        pp$1.regexp_groupSpecifier = function (state) {
          if (state.eat(63)) {
            if (!this.regexp_eatGroupName(state)) {
              state.raise("Invalid group");
            }
            var trackDisjunction = this.options.ecmaVersion >= 16;
            var known = state.groupNames[state.lastStringValue];
            if (known) {
              if (trackDisjunction) {
                for (var i = 0, list = known; i < list.length; i += 1) {
                  var altID = list[i];
                  if (!altID.separatedFrom(state.branchID)) {
                    state.raise("Duplicate capture group name");
                  }
                }
              } else {
                state.raise("Duplicate capture group name");
              }
            }
            if (trackDisjunction) {
              (known || (state.groupNames[state.lastStringValue] = [])).push(
                state.branchID,
              );
            } else {
              state.groupNames[state.lastStringValue] = true;
            }
          }
        };
        pp$1.regexp_eatGroupName = function (state) {
          state.lastStringValue = "";
          if (state.eat(60)) {
            if (this.regexp_eatRegExpIdentifierName(state) && state.eat(62)) {
              return true;
            }
            state.raise("Invalid capture group name");
          }
          return false;
        };
        pp$1.regexp_eatRegExpIdentifierName = function (state) {
          state.lastStringValue = "";
          if (this.regexp_eatRegExpIdentifierStart(state)) {
            state.lastStringValue += codePointToString(state.lastIntValue);
            while (this.regexp_eatRegExpIdentifierPart(state)) {
              state.lastStringValue += codePointToString(state.lastIntValue);
            }
            return true;
          }
          return false;
        };
        pp$1.regexp_eatRegExpIdentifierStart = function (state) {
          var start = state.pos;
          var forceU = this.options.ecmaVersion >= 11;
          var ch = state.current(forceU);
          state.advance(forceU);
          if (
            ch === 92 &&
            this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)
          ) {
            ch = state.lastIntValue;
          }
          if (isRegExpIdentifierStart(ch)) {
            state.lastIntValue = ch;
            return true;
          }
          state.pos = start;
          return false;
        };
        function isRegExpIdentifierStart(ch) {
          return isIdentifierStart(ch, true) || ch === 36 || ch === 95;
        }
        pp$1.regexp_eatRegExpIdentifierPart = function (state) {
          var start = state.pos;
          var forceU = this.options.ecmaVersion >= 11;
          var ch = state.current(forceU);
          state.advance(forceU);
          if (
            ch === 92 &&
            this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)
          ) {
            ch = state.lastIntValue;
          }
          if (isRegExpIdentifierPart(ch)) {
            state.lastIntValue = ch;
            return true;
          }
          state.pos = start;
          return false;
        };
        function isRegExpIdentifierPart(ch) {
          return (
            isIdentifierChar(ch, true) ||
            ch === 36 ||
            ch === 95 ||
            ch === 8204 ||
            ch === 8205
          );
        }
        pp$1.regexp_eatAtomEscape = function (state) {
          if (
            this.regexp_eatBackReference(state) ||
            this.regexp_eatCharacterClassEscape(state) ||
            this.regexp_eatCharacterEscape(state) ||
            (state.switchN && this.regexp_eatKGroupName(state))
          ) {
            return true;
          }
          if (state.switchU) {
            if (state.current() === 99) {
              state.raise("Invalid unicode escape");
            }
            state.raise("Invalid escape");
          }
          return false;
        };
        pp$1.regexp_eatBackReference = function (state) {
          var start = state.pos;
          if (this.regexp_eatDecimalEscape(state)) {
            var n = state.lastIntValue;
            if (state.switchU) {
              if (n > state.maxBackReference) {
                state.maxBackReference = n;
              }
              return true;
            }
            if (n <= state.numCapturingParens) {
              return true;
            }
            state.pos = start;
          }
          return false;
        };
        pp$1.regexp_eatKGroupName = function (state) {
          if (state.eat(107)) {
            if (this.regexp_eatGroupName(state)) {
              state.backReferenceNames.push(state.lastStringValue);
              return true;
            }
            state.raise("Invalid named reference");
          }
          return false;
        };
        pp$1.regexp_eatCharacterEscape = function (state) {
          return (
            this.regexp_eatControlEscape(state) ||
            this.regexp_eatCControlLetter(state) ||
            this.regexp_eatZero(state) ||
            this.regexp_eatHexEscapeSequence(state) ||
            this.regexp_eatRegExpUnicodeEscapeSequence(state, false) ||
            (!state.switchU &&
              this.regexp_eatLegacyOctalEscapeSequence(state)) ||
            this.regexp_eatIdentityEscape(state)
          );
        };
        pp$1.regexp_eatCControlLetter = function (state) {
          var start = state.pos;
          if (state.eat(99)) {
            if (this.regexp_eatControlLetter(state)) {
              return true;
            }
            state.pos = start;
          }
          return false;
        };
        pp$1.regexp_eatZero = function (state) {
          if (state.current() === 48 && !isDecimalDigit(state.lookahead())) {
            state.lastIntValue = 0;
            state.advance();
            return true;
          }
          return false;
        };
        pp$1.regexp_eatControlEscape = function (state) {
          var ch = state.current();
          if (ch === 116) {
            state.lastIntValue = 9;
            state.advance();
            return true;
          }
          if (ch === 110) {
            state.lastIntValue = 10;
            state.advance();
            return true;
          }
          if (ch === 118) {
            state.lastIntValue = 11;
            state.advance();
            return true;
          }
          if (ch === 102) {
            state.lastIntValue = 12;
            state.advance();
            return true;
          }
          if (ch === 114) {
            state.lastIntValue = 13;
            state.advance();
            return true;
          }
          return false;
        };
        pp$1.regexp_eatControlLetter = function (state) {
          var ch = state.current();
          if (isControlLetter(ch)) {
            state.lastIntValue = ch % 32;
            state.advance();
            return true;
          }
          return false;
        };
        function isControlLetter(ch) {
          return (ch >= 65 && ch <= 90) || (ch >= 97 && ch <= 122);
        }
        pp$1.regexp_eatRegExpUnicodeEscapeSequence = function (state, forceU) {
          if (forceU === void 0) forceU = false;
          var start = state.pos;
          var switchU = forceU || state.switchU;
          if (state.eat(117)) {
            if (this.regexp_eatFixedHexDigits(state, 4)) {
              var lead = state.lastIntValue;
              if (switchU && lead >= 55296 && lead <= 56319) {
                var leadSurrogateEnd = state.pos;
                if (
                  state.eat(92) &&
                  state.eat(117) &&
                  this.regexp_eatFixedHexDigits(state, 4)
                ) {
                  var trail = state.lastIntValue;
                  if (trail >= 56320 && trail <= 57343) {
                    state.lastIntValue =
                      (lead - 55296) * 1024 + (trail - 56320) + 65536;
                    return true;
                  }
                }
                state.pos = leadSurrogateEnd;
                state.lastIntValue = lead;
              }
              return true;
            }
            if (
              switchU &&
              state.eat(123) &&
              this.regexp_eatHexDigits(state) &&
              state.eat(125) &&
              isValidUnicode(state.lastIntValue)
            ) {
              return true;
            }
            if (switchU) {
              state.raise("Invalid unicode escape");
            }
            state.pos = start;
          }
          return false;
        };
        function isValidUnicode(ch) {
          return ch >= 0 && ch <= 1114111;
        }
        pp$1.regexp_eatIdentityEscape = function (state) {
          if (state.switchU) {
            if (this.regexp_eatSyntaxCharacter(state)) {
              return true;
            }
            if (state.eat(47)) {
              state.lastIntValue = 47;
              return true;
            }
            return false;
          }
          var ch = state.current();
          if (ch !== 99 && (!state.switchN || ch !== 107)) {
            state.lastIntValue = ch;
            state.advance();
            return true;
          }
          return false;
        };
        pp$1.regexp_eatDecimalEscape = function (state) {
          state.lastIntValue = 0;
          var ch = state.current();
          if (ch >= 49 && ch <= 57) {
            do {
              state.lastIntValue = 10 * state.lastIntValue + (ch - 48);
              state.advance();
            } while ((ch = state.current()) >= 48 && ch <= 57);
            return true;
          }
          return false;
        };
        var CharSetNone = 0;
        var CharSetOk = 1;
        var CharSetString = 2;
        pp$1.regexp_eatCharacterClassEscape = function (state) {
          var ch = state.current();
          if (isCharacterClassEscape(ch)) {
            state.lastIntValue = -1;
            state.advance();
            return CharSetOk;
          }
          var negate = false;
          if (
            state.switchU &&
            this.options.ecmaVersion >= 9 &&
            ((negate = ch === 80) || ch === 112)
          ) {
            state.lastIntValue = -1;
            state.advance();
            var result;
            if (
              state.eat(123) &&
              (result = this.regexp_eatUnicodePropertyValueExpression(state)) &&
              state.eat(125)
            ) {
              if (negate && result === CharSetString) {
                state.raise("Invalid property name");
              }
              return result;
            }
            state.raise("Invalid property name");
          }
          return CharSetNone;
        };
        function isCharacterClassEscape(ch) {
          return (
            ch === 100 ||
            ch === 68 ||
            ch === 115 ||
            ch === 83 ||
            ch === 119 ||
            ch === 87
          );
        }
        pp$1.regexp_eatUnicodePropertyValueExpression = function (state) {
          var start = state.pos;
          if (this.regexp_eatUnicodePropertyName(state) && state.eat(61)) {
            var name = state.lastStringValue;
            if (this.regexp_eatUnicodePropertyValue(state)) {
              var value = state.lastStringValue;
              this.regexp_validateUnicodePropertyNameAndValue(
                state,
                name,
                value,
              );
              return CharSetOk;
            }
          }
          state.pos = start;
          if (this.regexp_eatLoneUnicodePropertyNameOrValue(state)) {
            var nameOrValue = state.lastStringValue;
            return this.regexp_validateUnicodePropertyNameOrValue(
              state,
              nameOrValue,
            );
          }
          return CharSetNone;
        };
        pp$1.regexp_validateUnicodePropertyNameAndValue = function (
          state,
          name,
          value,
        ) {
          if (!hasOwn(state.unicodeProperties.nonBinary, name)) {
            state.raise("Invalid property name");
          }
          if (!state.unicodeProperties.nonBinary[name].test(value)) {
            state.raise("Invalid property value");
          }
        };
        pp$1.regexp_validateUnicodePropertyNameOrValue = function (
          state,
          nameOrValue,
        ) {
          if (state.unicodeProperties.binary.test(nameOrValue)) {
            return CharSetOk;
          }
          if (
            state.switchV &&
            state.unicodeProperties.binaryOfStrings.test(nameOrValue)
          ) {
            return CharSetString;
          }
          state.raise("Invalid property name");
        };
        pp$1.regexp_eatUnicodePropertyName = function (state) {
          var ch = 0;
          state.lastStringValue = "";
          while (isUnicodePropertyNameCharacter((ch = state.current()))) {
            state.lastStringValue += codePointToString(ch);
            state.advance();
          }
          return state.lastStringValue !== "";
        };
        function isUnicodePropertyNameCharacter(ch) {
          return isControlLetter(ch) || ch === 95;
        }
        pp$1.regexp_eatUnicodePropertyValue = function (state) {
          var ch = 0;
          state.lastStringValue = "";
          while (isUnicodePropertyValueCharacter((ch = state.current()))) {
            state.lastStringValue += codePointToString(ch);
            state.advance();
          }
          return state.lastStringValue !== "";
        };
        function isUnicodePropertyValueCharacter(ch) {
          return isUnicodePropertyNameCharacter(ch) || isDecimalDigit(ch);
        }
        pp$1.regexp_eatLoneUnicodePropertyNameOrValue = function (state) {
          return this.regexp_eatUnicodePropertyValue(state);
        };
        pp$1.regexp_eatCharacterClass = function (state) {
          if (state.eat(91)) {
            var negate = state.eat(94);
            var result = this.regexp_classContents(state);
            if (!state.eat(93)) {
              state.raise("Unterminated character class");
            }
            if (negate && result === CharSetString) {
              state.raise("Negated character class may contain strings");
            }
            return true;
          }
          return false;
        };
        pp$1.regexp_classContents = function (state) {
          if (state.current() === 93) {
            return CharSetOk;
          }
          if (state.switchV) {
            return this.regexp_classSetExpression(state);
          }
          this.regexp_nonEmptyClassRanges(state);
          return CharSetOk;
        };
        pp$1.regexp_nonEmptyClassRanges = function (state) {
          while (this.regexp_eatClassAtom(state)) {
            var left = state.lastIntValue;
            if (state.eat(45) && this.regexp_eatClassAtom(state)) {
              var right = state.lastIntValue;
              if (state.switchU && (left === -1 || right === -1)) {
                state.raise("Invalid character class");
              }
              if (left !== -1 && right !== -1 && left > right) {
                state.raise("Range out of order in character class");
              }
            }
          }
        };
        pp$1.regexp_eatClassAtom = function (state) {
          var start = state.pos;
          if (state.eat(92)) {
            if (this.regexp_eatClassEscape(state)) {
              return true;
            }
            if (state.switchU) {
              var ch$1 = state.current();
              if (ch$1 === 99 || isOctalDigit(ch$1)) {
                state.raise("Invalid class escape");
              }
              state.raise("Invalid escape");
            }
            state.pos = start;
          }
          var ch = state.current();
          if (ch !== 93) {
            state.lastIntValue = ch;
            state.advance();
            return true;
          }
          return false;
        };
        pp$1.regexp_eatClassEscape = function (state) {
          var start = state.pos;
          if (state.eat(98)) {
            state.lastIntValue = 8;
            return true;
          }
          if (state.switchU && state.eat(45)) {
            state.lastIntValue = 45;
            return true;
          }
          if (!state.switchU && state.eat(99)) {
            if (this.regexp_eatClassControlLetter(state)) {
              return true;
            }
            state.pos = start;
          }
          return (
            this.regexp_eatCharacterClassEscape(state) ||
            this.regexp_eatCharacterEscape(state)
          );
        };
        pp$1.regexp_classSetExpression = function (state) {
          var result = CharSetOk,
            subResult;
          if (this.regexp_eatClassSetRange(state));
          else if ((subResult = this.regexp_eatClassSetOperand(state))) {
            if (subResult === CharSetString) {
              result = CharSetString;
            }
            var start = state.pos;
            while (state.eatChars([38, 38])) {
              if (
                state.current() !== 38 &&
                (subResult = this.regexp_eatClassSetOperand(state))
              ) {
                if (subResult !== CharSetString) {
                  result = CharSetOk;
                }
                continue;
              }
              state.raise("Invalid character in character class");
            }
            if (start !== state.pos) {
              return result;
            }
            while (state.eatChars([45, 45])) {
              if (this.regexp_eatClassSetOperand(state)) {
                continue;
              }
              state.raise("Invalid character in character class");
            }
            if (start !== state.pos) {
              return result;
            }
          } else {
            state.raise("Invalid character in character class");
          }
          for (;;) {
            if (this.regexp_eatClassSetRange(state)) {
              continue;
            }
            subResult = this.regexp_eatClassSetOperand(state);
            if (!subResult) {
              return result;
            }
            if (subResult === CharSetString) {
              result = CharSetString;
            }
          }
        };
        pp$1.regexp_eatClassSetRange = function (state) {
          var start = state.pos;
          if (this.regexp_eatClassSetCharacter(state)) {
            var left = state.lastIntValue;
            if (state.eat(45) && this.regexp_eatClassSetCharacter(state)) {
              var right = state.lastIntValue;
              if (left !== -1 && right !== -1 && left > right) {
                state.raise("Range out of order in character class");
              }
              return true;
            }
            state.pos = start;
          }
          return false;
        };
        pp$1.regexp_eatClassSetOperand = function (state) {
          if (this.regexp_eatClassSetCharacter(state)) {
            return CharSetOk;
          }
          return (
            this.regexp_eatClassStringDisjunction(state) ||
            this.regexp_eatNestedClass(state)
          );
        };
        pp$1.regexp_eatNestedClass = function (state) {
          var start = state.pos;
          if (state.eat(91)) {
            var negate = state.eat(94);
            var result = this.regexp_classContents(state);
            if (state.eat(93)) {
              if (negate && result === CharSetString) {
                state.raise("Negated character class may contain strings");
              }
              return result;
            }
            state.pos = start;
          }
          if (state.eat(92)) {
            var result$1 = this.regexp_eatCharacterClassEscape(state);
            if (result$1) {
              return result$1;
            }
            state.pos = start;
          }
          return null;
        };
        pp$1.regexp_eatClassStringDisjunction = function (state) {
          var start = state.pos;
          if (state.eatChars([92, 113])) {
            if (state.eat(123)) {
              var result = this.regexp_classStringDisjunctionContents(state);
              if (state.eat(125)) {
                return result;
              }
            } else {
              state.raise("Invalid escape");
            }
            state.pos = start;
          }
          return null;
        };
        pp$1.regexp_classStringDisjunctionContents = function (state) {
          var result = this.regexp_classString(state);
          while (state.eat(124)) {
            if (this.regexp_classString(state) === CharSetString) {
              result = CharSetString;
            }
          }
          return result;
        };
        pp$1.regexp_classString = function (state) {
          var count = 0;
          while (this.regexp_eatClassSetCharacter(state)) {
            count++;
          }
          return count === 1 ? CharSetOk : CharSetString;
        };
        pp$1.regexp_eatClassSetCharacter = function (state) {
          var start = state.pos;
          if (state.eat(92)) {
            if (
              this.regexp_eatCharacterEscape(state) ||
              this.regexp_eatClassSetReservedPunctuator(state)
            ) {
              return true;
            }
            if (state.eat(98)) {
              state.lastIntValue = 8;
              return true;
            }
            state.pos = start;
            return false;
          }
          var ch = state.current();
          if (
            ch < 0 ||
            (ch === state.lookahead() &&
              isClassSetReservedDoublePunctuatorCharacter(ch))
          ) {
            return false;
          }
          if (isClassSetSyntaxCharacter(ch)) {
            return false;
          }
          state.advance();
          state.lastIntValue = ch;
          return true;
        };
        function isClassSetReservedDoublePunctuatorCharacter(ch) {
          return (
            ch === 33 ||
            (ch >= 35 && ch <= 38) ||
            (ch >= 42 && ch <= 44) ||
            ch === 46 ||
            (ch >= 58 && ch <= 64) ||
            ch === 94 ||
            ch === 96 ||
            ch === 126
          );
        }
        function isClassSetSyntaxCharacter(ch) {
          return (
            ch === 40 ||
            ch === 41 ||
            ch === 45 ||
            ch === 47 ||
            (ch >= 91 && ch <= 93) ||
            (ch >= 123 && ch <= 125)
          );
        }
        pp$1.regexp_eatClassSetReservedPunctuator = function (state) {
          var ch = state.current();
          if (isClassSetReservedPunctuator(ch)) {
            state.lastIntValue = ch;
            state.advance();
            return true;
          }
          return false;
        };
        function isClassSetReservedPunctuator(ch) {
          return (
            ch === 33 ||
            ch === 35 ||
            ch === 37 ||
            ch === 38 ||
            ch === 44 ||
            ch === 45 ||
            (ch >= 58 && ch <= 62) ||
            ch === 64 ||
            ch === 96 ||
            ch === 126
          );
        }
        pp$1.regexp_eatClassControlLetter = function (state) {
          var ch = state.current();
          if (isDecimalDigit(ch) || ch === 95) {
            state.lastIntValue = ch % 32;
            state.advance();
            return true;
          }
          return false;
        };
        pp$1.regexp_eatHexEscapeSequence = function (state) {
          var start = state.pos;
          if (state.eat(120)) {
            if (this.regexp_eatFixedHexDigits(state, 2)) {
              return true;
            }
            if (state.switchU) {
              state.raise("Invalid escape");
            }
            state.pos = start;
          }
          return false;
        };
        pp$1.regexp_eatDecimalDigits = function (state) {
          var start = state.pos;
          var ch = 0;
          state.lastIntValue = 0;
          while (isDecimalDigit((ch = state.current()))) {
            state.lastIntValue = 10 * state.lastIntValue + (ch - 48);
            state.advance();
          }
          return state.pos !== start;
        };
        function isDecimalDigit(ch) {
          return ch >= 48 && ch <= 57;
        }
        pp$1.regexp_eatHexDigits = function (state) {
          var start = state.pos;
          var ch = 0;
          state.lastIntValue = 0;
          while (isHexDigit((ch = state.current()))) {
            state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
            state.advance();
          }
          return state.pos !== start;
        };
        function isHexDigit(ch) {
          return (
            (ch >= 48 && ch <= 57) ||
            (ch >= 65 && ch <= 70) ||
            (ch >= 97 && ch <= 102)
          );
        }
        function hexToInt(ch) {
          if (ch >= 65 && ch <= 70) {
            return 10 + (ch - 65);
          }
          if (ch >= 97 && ch <= 102) {
            return 10 + (ch - 97);
          }
          return ch - 48;
        }
        pp$1.regexp_eatLegacyOctalEscapeSequence = function (state) {
          if (this.regexp_eatOctalDigit(state)) {
            var n1 = state.lastIntValue;
            if (this.regexp_eatOctalDigit(state)) {
              var n2 = state.lastIntValue;
              if (n1 <= 3 && this.regexp_eatOctalDigit(state)) {
                state.lastIntValue = n1 * 64 + n2 * 8 + state.lastIntValue;
              } else {
                state.lastIntValue = n1 * 8 + n2;
              }
            } else {
              state.lastIntValue = n1;
            }
            return true;
          }
          return false;
        };
        pp$1.regexp_eatOctalDigit = function (state) {
          var ch = state.current();
          if (isOctalDigit(ch)) {
            state.lastIntValue = ch - 48;
            state.advance();
            return true;
          }
          state.lastIntValue = 0;
          return false;
        };
        function isOctalDigit(ch) {
          return ch >= 48 && ch <= 55;
        }
        pp$1.regexp_eatFixedHexDigits = function (state, length) {
          var start = state.pos;
          state.lastIntValue = 0;
          for (var i = 0; i < length; ++i) {
            var ch = state.current();
            if (!isHexDigit(ch)) {
              state.pos = start;
              return false;
            }
            state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
            state.advance();
          }
          return true;
        };
        var Token = function Token(p) {
          this.type = p.type;
          this.value = p.value;
          this.start = p.start;
          this.end = p.end;
          if (p.options.locations) {
            this.loc = new SourceLocation(p, p.startLoc, p.endLoc);
          }
          if (p.options.ranges) {
            this.range = [p.start, p.end];
          }
        };
        var pp = Parser.prototype;
        pp.next = function (ignoreEscapeSequenceInKeyword) {
          if (
            !ignoreEscapeSequenceInKeyword &&
            this.type.keyword &&
            this.containsEsc
          ) {
            this.raiseRecoverable(
              this.start,
              "Escape sequence in keyword " + this.type.keyword,
            );
          }
          if (this.options.onToken) {
            this.options.onToken(new Token(this));
          }
          this.lastTokEnd = this.end;
          this.lastTokStart = this.start;
          this.lastTokEndLoc = this.endLoc;
          this.lastTokStartLoc = this.startLoc;
          this.nextToken();
        };
        pp.getToken = function () {
          this.next();
          return new Token(this);
        };
        if (typeof Symbol !== "undefined") {
          pp[Symbol.iterator] = function () {
            var this$1$1 = this;
            return {
              next: function () {
                var token = this$1$1.getToken();
                return { done: token.type === types$1.eof, value: token };
              },
            };
          };
        }
        pp.nextToken = function () {
          var curContext = this.curContext();
          if (!curContext || !curContext.preserveSpace) {
            this.skipSpace();
          }
          this.start = this.pos;
          if (this.options.locations) {
            this.startLoc = this.curPosition();
          }
          if (this.pos >= this.input.length) {
            return this.finishToken(types$1.eof);
          }
          if (curContext.override) {
            return curContext.override(this);
          } else {
            this.readToken(this.fullCharCodeAtPos());
          }
        };
        pp.readToken = function (code) {
          if (
            isIdentifierStart(code, this.options.ecmaVersion >= 6) ||
            code === 92
          ) {
            return this.readWord();
          }
          return this.getTokenFromCode(code);
        };
        pp.fullCharCodeAtPos = function () {
          var code = this.input.charCodeAt(this.pos);
          if (code <= 55295 || code >= 56320) {
            return code;
          }
          var next = this.input.charCodeAt(this.pos + 1);
          return next <= 56319 || next >= 57344
            ? code
            : (code << 10) + next - 56613888;
        };
        pp.skipBlockComment = function () {
          var startLoc = this.options.onComment && this.curPosition();
          var start = this.pos,
            end = this.input.indexOf("*/", (this.pos += 2));
          if (end === -1) {
            this.raise(this.pos - 2, "Unterminated comment");
          }
          this.pos = end + 2;
          if (this.options.locations) {
            for (
              var nextBreak = void 0, pos = start;
              (nextBreak = nextLineBreak(this.input, pos, this.pos)) > -1;

            ) {
              ++this.curLine;
              pos = this.lineStart = nextBreak;
            }
          }
          if (this.options.onComment) {
            this.options.onComment(
              true,
              this.input.slice(start + 2, end),
              start,
              this.pos,
              startLoc,
              this.curPosition(),
            );
          }
        };
        pp.skipLineComment = function (startSkip) {
          var start = this.pos;
          var startLoc = this.options.onComment && this.curPosition();
          var ch = this.input.charCodeAt((this.pos += startSkip));
          while (this.pos < this.input.length && !isNewLine(ch)) {
            ch = this.input.charCodeAt(++this.pos);
          }
          if (this.options.onComment) {
            this.options.onComment(
              false,
              this.input.slice(start + startSkip, this.pos),
              start,
              this.pos,
              startLoc,
              this.curPosition(),
            );
          }
        };
        pp.skipSpace = function () {
          loop: while (this.pos < this.input.length) {
            var ch = this.input.charCodeAt(this.pos);
            switch (ch) {
              case 32:
              case 160:
                ++this.pos;
                break;
              case 13:
                if (this.input.charCodeAt(this.pos + 1) === 10) {
                  ++this.pos;
                }
              case 10:
              case 8232:
              case 8233:
                ++this.pos;
                if (this.options.locations) {
                  ++this.curLine;
                  this.lineStart = this.pos;
                }
                break;
              case 47:
                switch (this.input.charCodeAt(this.pos + 1)) {
                  case 42:
                    this.skipBlockComment();
                    break;
                  case 47:
                    this.skipLineComment(2);
                    break;
                  default:
                    break loop;
                }
                break;
              default:
                if (
                  (ch > 8 && ch < 14) ||
                  (ch >= 5760 &&
                    nonASCIIwhitespace.test(String.fromCharCode(ch)))
                ) {
                  ++this.pos;
                } else {
                  break loop;
                }
            }
          }
        };
        pp.finishToken = function (type, val) {
          this.end = this.pos;
          if (this.options.locations) {
            this.endLoc = this.curPosition();
          }
          var prevType = this.type;
          this.type = type;
          this.value = val;
          this.updateContext(prevType);
        };
        pp.readToken_dot = function () {
          var next = this.input.charCodeAt(this.pos + 1);
          if (next >= 48 && next <= 57) {
            return this.readNumber(true);
          }
          var next2 = this.input.charCodeAt(this.pos + 2);
          if (this.options.ecmaVersion >= 6 && next === 46 && next2 === 46) {
            this.pos += 3;
            return this.finishToken(types$1.ellipsis);
          } else {
            ++this.pos;
            return this.finishToken(types$1.dot);
          }
        };
        pp.readToken_slash = function () {
          var next = this.input.charCodeAt(this.pos + 1);
          if (this.exprAllowed) {
            ++this.pos;
            return this.readRegexp();
          }
          if (next === 61) {
            return this.finishOp(types$1.assign, 2);
          }
          return this.finishOp(types$1.slash, 1);
        };
        pp.readToken_mult_modulo_exp = function (code) {
          var next = this.input.charCodeAt(this.pos + 1);
          var size = 1;
          var tokentype = code === 42 ? types$1.star : types$1.modulo;
          if (this.options.ecmaVersion >= 7 && code === 42 && next === 42) {
            ++size;
            tokentype = types$1.starstar;
            next = this.input.charCodeAt(this.pos + 2);
          }
          if (next === 61) {
            return this.finishOp(types$1.assign, size + 1);
          }
          return this.finishOp(tokentype, size);
        };
        pp.readToken_pipe_amp = function (code) {
          var next = this.input.charCodeAt(this.pos + 1);
          if (next === code) {
            if (this.options.ecmaVersion >= 12) {
              var next2 = this.input.charCodeAt(this.pos + 2);
              if (next2 === 61) {
                return this.finishOp(types$1.assign, 3);
              }
            }
            return this.finishOp(
              code === 124 ? types$1.logicalOR : types$1.logicalAND,
              2,
            );
          }
          if (next === 61) {
            return this.finishOp(types$1.assign, 2);
          }
          return this.finishOp(
            code === 124 ? types$1.bitwiseOR : types$1.bitwiseAND,
            1,
          );
        };
        pp.readToken_caret = function () {
          var next = this.input.charCodeAt(this.pos + 1);
          if (next === 61) {
            return this.finishOp(types$1.assign, 2);
          }
          return this.finishOp(types$1.bitwiseXOR, 1);
        };
        pp.readToken_plus_min = function (code) {
          var next = this.input.charCodeAt(this.pos + 1);
          if (next === code) {
            if (
              next === 45 &&
              !this.inModule &&
              this.input.charCodeAt(this.pos + 2) === 62 &&
              (this.lastTokEnd === 0 ||
                lineBreak.test(this.input.slice(this.lastTokEnd, this.pos)))
            ) {
              this.skipLineComment(3);
              this.skipSpace();
              return this.nextToken();
            }
            return this.finishOp(types$1.incDec, 2);
          }
          if (next === 61) {
            return this.finishOp(types$1.assign, 2);
          }
          return this.finishOp(types$1.plusMin, 1);
        };
        pp.readToken_lt_gt = function (code) {
          var next = this.input.charCodeAt(this.pos + 1);
          var size = 1;
          if (next === code) {
            size =
              code === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2;
            if (this.input.charCodeAt(this.pos + size) === 61) {
              return this.finishOp(types$1.assign, size + 1);
            }
            return this.finishOp(types$1.bitShift, size);
          }
          if (
            next === 33 &&
            code === 60 &&
            !this.inModule &&
            this.input.charCodeAt(this.pos + 2) === 45 &&
            this.input.charCodeAt(this.pos + 3) === 45
          ) {
            this.skipLineComment(4);
            this.skipSpace();
            return this.nextToken();
          }
          if (next === 61) {
            size = 2;
          }
          return this.finishOp(types$1.relational, size);
        };
        pp.readToken_eq_excl = function (code) {
          var next = this.input.charCodeAt(this.pos + 1);
          if (next === 61) {
            return this.finishOp(
              types$1.equality,
              this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2,
            );
          }
          if (code === 61 && next === 62 && this.options.ecmaVersion >= 6) {
            this.pos += 2;
            return this.finishToken(types$1.arrow);
          }
          return this.finishOp(code === 61 ? types$1.eq : types$1.prefix, 1);
        };
        pp.readToken_question = function () {
          var ecmaVersion = this.options.ecmaVersion;
          if (ecmaVersion >= 11) {
            var next = this.input.charCodeAt(this.pos + 1);
            if (next === 46) {
              var next2 = this.input.charCodeAt(this.pos + 2);
              if (next2 < 48 || next2 > 57) {
                return this.finishOp(types$1.questionDot, 2);
              }
            }
            if (next === 63) {
              if (ecmaVersion >= 12) {
                var next2$1 = this.input.charCodeAt(this.pos + 2);
                if (next2$1 === 61) {
                  return this.finishOp(types$1.assign, 3);
                }
              }
              return this.finishOp(types$1.coalesce, 2);
            }
          }
          return this.finishOp(types$1.question, 1);
        };
        pp.readToken_numberSign = function () {
          var ecmaVersion = this.options.ecmaVersion;
          var code = 35;
          if (ecmaVersion >= 13) {
            ++this.pos;
            code = this.fullCharCodeAtPos();
            if (isIdentifierStart(code, true) || code === 92) {
              return this.finishToken(types$1.privateId, this.readWord1());
            }
          }
          this.raise(
            this.pos,
            "Unexpected character '" + codePointToString(code) + "'",
          );
        };
        pp.getTokenFromCode = function (code) {
          switch (code) {
            case 46:
              return this.readToken_dot();
            case 40:
              ++this.pos;
              return this.finishToken(types$1.parenL);
            case 41:
              ++this.pos;
              return this.finishToken(types$1.parenR);
            case 59:
              ++this.pos;
              return this.finishToken(types$1.semi);
            case 44:
              ++this.pos;
              return this.finishToken(types$1.comma);
            case 91:
              ++this.pos;
              return this.finishToken(types$1.bracketL);
            case 93:
              ++this.pos;
              return this.finishToken(types$1.bracketR);
            case 123:
              ++this.pos;
              return this.finishToken(types$1.braceL);
            case 125:
              ++this.pos;
              return this.finishToken(types$1.braceR);
            case 58:
              ++this.pos;
              return this.finishToken(types$1.colon);
            case 96:
              if (this.options.ecmaVersion < 6) {
                break;
              }
              ++this.pos;
              return this.finishToken(types$1.backQuote);
            case 48:
              var next = this.input.charCodeAt(this.pos + 1);
              if (next === 120 || next === 88) {
                return this.readRadixNumber(16);
              }
              if (this.options.ecmaVersion >= 6) {
                if (next === 111 || next === 79) {
                  return this.readRadixNumber(8);
                }
                if (next === 98 || next === 66) {
                  return this.readRadixNumber(2);
                }
              }
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
              return this.readNumber(false);
            case 34:
            case 39:
              return this.readString(code);
            case 47:
              return this.readToken_slash();
            case 37:
            case 42:
              return this.readToken_mult_modulo_exp(code);
            case 124:
            case 38:
              return this.readToken_pipe_amp(code);
            case 94:
              return this.readToken_caret();
            case 43:
            case 45:
              return this.readToken_plus_min(code);
            case 60:
            case 62:
              return this.readToken_lt_gt(code);
            case 61:
            case 33:
              return this.readToken_eq_excl(code);
            case 63:
              return this.readToken_question();
            case 126:
              return this.finishOp(types$1.prefix, 1);
            case 35:
              return this.readToken_numberSign();
          }
          this.raise(
            this.pos,
            "Unexpected character '" + codePointToString(code) + "'",
          );
        };
        pp.finishOp = function (type, size) {
          var str = this.input.slice(this.pos, this.pos + size);
          this.pos += size;
          return this.finishToken(type, str);
        };
        pp.readRegexp = function () {
          var escaped,
            inClass,
            start = this.pos;
          for (;;) {
            if (this.pos >= this.input.length) {
              this.raise(start, "Unterminated regular expression");
            }
            var ch = this.input.charAt(this.pos);
            if (lineBreak.test(ch)) {
              this.raise(start, "Unterminated regular expression");
            }
            if (!escaped) {
              if (ch === "[") {
                inClass = true;
              } else if (ch === "]" && inClass) {
                inClass = false;
              } else if (ch === "/" && !inClass) {
                break;
              }
              escaped = ch === "\\";
            } else {
              escaped = false;
            }
            ++this.pos;
          }
          var pattern = this.input.slice(start, this.pos);
          ++this.pos;
          var flagsStart = this.pos;
          var flags = this.readWord1();
          if (this.containsEsc) {
            this.unexpected(flagsStart);
          }
          var state =
            this.regexpState ||
            (this.regexpState = new RegExpValidationState(this));
          state.reset(start, pattern, flags);
          this.validateRegExpFlags(state);
          this.validateRegExpPattern(state);
          var value = null;
          try {
            value = new RegExp(pattern, flags);
          } catch (e) {}
          return this.finishToken(types$1.regexp, { pattern, flags, value });
        };
        pp.readInt = function (radix, len, maybeLegacyOctalNumericLiteral) {
          var allowSeparators =
            this.options.ecmaVersion >= 12 && len === undefined;
          var isLegacyOctalNumericLiteral =
            maybeLegacyOctalNumericLiteral &&
            this.input.charCodeAt(this.pos) === 48;
          var start = this.pos,
            total = 0,
            lastCode = 0;
          for (
            var i = 0, e = len == null ? Infinity : len;
            i < e;
            ++i, ++this.pos
          ) {
            var code = this.input.charCodeAt(this.pos),
              val = void 0;
            if (allowSeparators && code === 95) {
              if (isLegacyOctalNumericLiteral) {
                this.raiseRecoverable(
                  this.pos,
                  "Numeric separator is not allowed in legacy octal numeric literals",
                );
              }
              if (lastCode === 95) {
                this.raiseRecoverable(
                  this.pos,
                  "Numeric separator must be exactly one underscore",
                );
              }
              if (i === 0) {
                this.raiseRecoverable(
                  this.pos,
                  "Numeric separator is not allowed at the first of digits",
                );
              }
              lastCode = code;
              continue;
            }
            if (code >= 97) {
              val = code - 97 + 10;
            } else if (code >= 65) {
              val = code - 65 + 10;
            } else if (code >= 48 && code <= 57) {
              val = code - 48;
            } else {
              val = Infinity;
            }
            if (val >= radix) {
              break;
            }
            lastCode = code;
            total = total * radix + val;
          }
          if (allowSeparators && lastCode === 95) {
            this.raiseRecoverable(
              this.pos - 1,
              "Numeric separator is not allowed at the last of digits",
            );
          }
          if (this.pos === start || (len != null && this.pos - start !== len)) {
            return null;
          }
          return total;
        };
        function stringToNumber(str, isLegacyOctalNumericLiteral) {
          if (isLegacyOctalNumericLiteral) {
            return parseInt(str, 8);
          }
          return parseFloat(str.replace(/_/g, ""));
        }
        function stringToBigInt(str) {
          if (typeof BigInt !== "function") {
            return null;
          }
          return BigInt(str.replace(/_/g, ""));
        }
        pp.readRadixNumber = function (radix) {
          var start = this.pos;
          this.pos += 2;
          var val = this.readInt(radix);
          if (val == null) {
            this.raise(this.start + 2, "Expected number in radix " + radix);
          }
          if (
            this.options.ecmaVersion >= 11 &&
            this.input.charCodeAt(this.pos) === 110
          ) {
            val = stringToBigInt(this.input.slice(start, this.pos));
            ++this.pos;
          } else if (isIdentifierStart(this.fullCharCodeAtPos())) {
            this.raise(this.pos, "Identifier directly after number");
          }
          return this.finishToken(types$1.num, val);
        };
        pp.readNumber = function (startsWithDot) {
          var start = this.pos;
          if (!startsWithDot && this.readInt(10, undefined, true) === null) {
            this.raise(start, "Invalid number");
          }
          var octal =
            this.pos - start >= 2 && this.input.charCodeAt(start) === 48;
          if (octal && this.strict) {
            this.raise(start, "Invalid number");
          }
          var next = this.input.charCodeAt(this.pos);
          if (
            !octal &&
            !startsWithDot &&
            this.options.ecmaVersion >= 11 &&
            next === 110
          ) {
            var val$1 = stringToBigInt(this.input.slice(start, this.pos));
            ++this.pos;
            if (isIdentifierStart(this.fullCharCodeAtPos())) {
              this.raise(this.pos, "Identifier directly after number");
            }
            return this.finishToken(types$1.num, val$1);
          }
          if (octal && /[89]/.test(this.input.slice(start, this.pos))) {
            octal = false;
          }
          if (next === 46 && !octal) {
            ++this.pos;
            this.readInt(10);
            next = this.input.charCodeAt(this.pos);
          }
          if ((next === 69 || next === 101) && !octal) {
            next = this.input.charCodeAt(++this.pos);
            if (next === 43 || next === 45) {
              ++this.pos;
            }
            if (this.readInt(10) === null) {
              this.raise(start, "Invalid number");
            }
          }
          if (isIdentifierStart(this.fullCharCodeAtPos())) {
            this.raise(this.pos, "Identifier directly after number");
          }
          var val = stringToNumber(this.input.slice(start, this.pos), octal);
          return this.finishToken(types$1.num, val);
        };
        pp.readCodePoint = function () {
          var ch = this.input.charCodeAt(this.pos),
            code;
          if (ch === 123) {
            if (this.options.ecmaVersion < 6) {
              this.unexpected();
            }
            var codePos = ++this.pos;
            code = this.readHexChar(
              this.input.indexOf("}", this.pos) - this.pos,
            );
            ++this.pos;
            if (code > 1114111) {
              this.invalidStringToken(codePos, "Code point out of bounds");
            }
          } else {
            code = this.readHexChar(4);
          }
          return code;
        };
        pp.readString = function (quote) {
          var out = "",
            chunkStart = ++this.pos;
          for (;;) {
            if (this.pos >= this.input.length) {
              this.raise(this.start, "Unterminated string constant");
            }
            var ch = this.input.charCodeAt(this.pos);
            if (ch === quote) {
              break;
            }
            if (ch === 92) {
              out += this.input.slice(chunkStart, this.pos);
              out += this.readEscapedChar(false);
              chunkStart = this.pos;
            } else if (ch === 8232 || ch === 8233) {
              if (this.options.ecmaVersion < 10) {
                this.raise(this.start, "Unterminated string constant");
              }
              ++this.pos;
              if (this.options.locations) {
                this.curLine++;
                this.lineStart = this.pos;
              }
            } else {
              if (isNewLine(ch)) {
                this.raise(this.start, "Unterminated string constant");
              }
              ++this.pos;
            }
          }
          out += this.input.slice(chunkStart, this.pos++);
          return this.finishToken(types$1.string, out);
        };
        var INVALID_TEMPLATE_ESCAPE_ERROR = {};
        pp.tryReadTemplateToken = function () {
          this.inTemplateElement = true;
          try {
            this.readTmplToken();
          } catch (err) {
            if (err === INVALID_TEMPLATE_ESCAPE_ERROR) {
              this.readInvalidTemplateToken();
            } else {
              throw err;
            }
          }
          this.inTemplateElement = false;
        };
        pp.invalidStringToken = function (position, message) {
          if (this.inTemplateElement && this.options.ecmaVersion >= 9) {
            throw INVALID_TEMPLATE_ESCAPE_ERROR;
          } else {
            this.raise(position, message);
          }
        };
        pp.readTmplToken = function () {
          var out = "",
            chunkStart = this.pos;
          for (;;) {
            if (this.pos >= this.input.length) {
              this.raise(this.start, "Unterminated template");
            }
            var ch = this.input.charCodeAt(this.pos);
            if (
              ch === 96 ||
              (ch === 36 && this.input.charCodeAt(this.pos + 1) === 123)
            ) {
              if (
                this.pos === this.start &&
                (this.type === types$1.template ||
                  this.type === types$1.invalidTemplate)
              ) {
                if (ch === 36) {
                  this.pos += 2;
                  return this.finishToken(types$1.dollarBraceL);
                } else {
                  ++this.pos;
                  return this.finishToken(types$1.backQuote);
                }
              }
              out += this.input.slice(chunkStart, this.pos);
              return this.finishToken(types$1.template, out);
            }
            if (ch === 92) {
              out += this.input.slice(chunkStart, this.pos);
              out += this.readEscapedChar(true);
              chunkStart = this.pos;
            } else if (isNewLine(ch)) {
              out += this.input.slice(chunkStart, this.pos);
              ++this.pos;
              switch (ch) {
                case 13:
                  if (this.input.charCodeAt(this.pos) === 10) {
                    ++this.pos;
                  }
                case 10:
                  out += "\n";
                  break;
                default:
                  out += String.fromCharCode(ch);
                  break;
              }
              if (this.options.locations) {
                ++this.curLine;
                this.lineStart = this.pos;
              }
              chunkStart = this.pos;
            } else {
              ++this.pos;
            }
          }
        };
        pp.readInvalidTemplateToken = function () {
          for (; this.pos < this.input.length; this.pos++) {
            switch (this.input[this.pos]) {
              case "\\":
                ++this.pos;
                break;
              case "$":
                if (this.input[this.pos + 1] !== "{") {
                  break;
                }
              case "`":
                return this.finishToken(
                  types$1.invalidTemplate,
                  this.input.slice(this.start, this.pos),
                );
              case "\r":
                if (this.input[this.pos + 1] === "\n") {
                  ++this.pos;
                }
              case "\n":
              case "\u2028":
              case "\u2029":
                ++this.curLine;
                this.lineStart = this.pos + 1;
                break;
            }
          }
          this.raise(this.start, "Unterminated template");
        };
        pp.readEscapedChar = function (inTemplate) {
          var ch = this.input.charCodeAt(++this.pos);
          ++this.pos;
          switch (ch) {
            case 110:
              return "\n";
            case 114:
              return "\r";
            case 120:
              return String.fromCharCode(this.readHexChar(2));
            case 117:
              return codePointToString(this.readCodePoint());
            case 116:
              return "\t";
            case 98:
              return "\b";
            case 118:
              return "\v";
            case 102:
              return "\f";
            case 13:
              if (this.input.charCodeAt(this.pos) === 10) {
                ++this.pos;
              }
            case 10:
              if (this.options.locations) {
                this.lineStart = this.pos;
                ++this.curLine;
              }
              return "";
            case 56:
            case 57:
              if (this.strict) {
                this.invalidStringToken(
                  this.pos - 1,
                  "Invalid escape sequence",
                );
              }
              if (inTemplate) {
                var codePos = this.pos - 1;
                this.invalidStringToken(
                  codePos,
                  "Invalid escape sequence in template string",
                );
              }
            default:
              if (ch >= 48 && ch <= 55) {
                var octalStr = this.input
                  .substr(this.pos - 1, 3)
                  .match(/^[0-7]+/)[0];
                var octal = parseInt(octalStr, 8);
                if (octal > 255) {
                  octalStr = octalStr.slice(0, -1);
                  octal = parseInt(octalStr, 8);
                }
                this.pos += octalStr.length - 1;
                ch = this.input.charCodeAt(this.pos);
                if (
                  (octalStr !== "0" || ch === 56 || ch === 57) &&
                  (this.strict || inTemplate)
                ) {
                  this.invalidStringToken(
                    this.pos - 1 - octalStr.length,
                    inTemplate
                      ? "Octal literal in template string"
                      : "Octal literal in strict mode",
                  );
                }
                return String.fromCharCode(octal);
              }
              if (isNewLine(ch)) {
                if (this.options.locations) {
                  this.lineStart = this.pos;
                  ++this.curLine;
                }
                return "";
              }
              return String.fromCharCode(ch);
          }
        };
        pp.readHexChar = function (len) {
          var codePos = this.pos;
          var n = this.readInt(16, len);
          if (n === null) {
            this.invalidStringToken(codePos, "Bad character escape sequence");
          }
          return n;
        };
        pp.readWord1 = function () {
          this.containsEsc = false;
          var word = "",
            first = true,
            chunkStart = this.pos;
          var astral = this.options.ecmaVersion >= 6;
          while (this.pos < this.input.length) {
            var ch = this.fullCharCodeAtPos();
            if (isIdentifierChar(ch, astral)) {
              this.pos += ch <= 65535 ? 1 : 2;
            } else if (ch === 92) {
              this.containsEsc = true;
              word += this.input.slice(chunkStart, this.pos);
              var escStart = this.pos;
              if (this.input.charCodeAt(++this.pos) !== 117) {
                this.invalidStringToken(
                  this.pos,
                  "Expecting Unicode escape sequence \\uXXXX",
                );
              }
              ++this.pos;
              var esc = this.readCodePoint();
              if (
                !(first ? isIdentifierStart : isIdentifierChar)(esc, astral)
              ) {
                this.invalidStringToken(escStart, "Invalid Unicode escape");
              }
              word += codePointToString(esc);
              chunkStart = this.pos;
            } else {
              break;
            }
            first = false;
          }
          return word + this.input.slice(chunkStart, this.pos);
        };
        pp.readWord = function () {
          var word = this.readWord1();
          var type = types$1.name;
          if (this.keywords.test(word)) {
            type = keywords[word];
          }
          return this.finishToken(type, word);
        };
        var version = "8.14.0";
        Parser.acorn = {
          Parser,
          version,
          defaultOptions,
          Position,
          SourceLocation,
          getLineInfo,
          Node,
          TokenType,
          tokTypes: types$1,
          keywordTypes: keywords,
          TokContext,
          tokContexts: types,
          isIdentifierChar,
          isIdentifierStart,
          Token,
          isNewLine,
          lineBreak,
          lineBreakG,
          nonASCIIwhitespace,
        };
        function parse(input, options) {
          return Parser.parse(input, options);
        }
        function parseExpressionAt(input, pos, options) {
          return Parser.parseExpressionAt(input, pos, options);
        }
        function tokenizer(input, options) {
          return Parser.tokenizer(input, options);
        }
        exports.Node = Node;
        exports.Parser = Parser;
        exports.Position = Position;
        exports.SourceLocation = SourceLocation;
        exports.TokContext = TokContext;
        exports.Token = Token;
        exports.TokenType = TokenType;
        exports.defaultOptions = defaultOptions;
        exports.getLineInfo = getLineInfo;
        exports.isIdentifierChar = isIdentifierChar;
        exports.isIdentifierStart = isIdentifierStart;
        exports.isNewLine = isNewLine;
        exports.keywordTypes = keywords;
        exports.lineBreak = lineBreak;
        exports.lineBreakG = lineBreakG;
        exports.nonASCIIwhitespace = nonASCIIwhitespace;
        exports.parse = parse;
        exports.parseExpressionAt = parseExpressionAt;
        exports.tokContexts = types;
        exports.tokTypes = types$1;
        exports.tokenizer = tokenizer;
        exports.version = version;
      });
    },
    6615: (module, __unused_webpack_exports, __nccwpck_require__) => {
      var Stream = __nccwpck_require__(2203);
      var writeMethods = ["write", "end", "destroy"];
      var readMethods = ["resume", "pause"];
      var readEvents = ["data", "close"];
      var slice = Array.prototype.slice;
      module.exports = duplex;
      function forEach(arr, fn) {
        if (arr.forEach) {
          return arr.forEach(fn);
        }
        for (var i = 0; i < arr.length; i++) {
          fn(arr[i], i);
        }
      }
      function duplex(writer, reader) {
        var stream = new Stream();
        var ended = false;
        forEach(writeMethods, proxyWriter);
        forEach(readMethods, proxyReader);
        forEach(readEvents, proxyStream);
        reader.on("end", handleEnd);
        writer.on("drain", function () {
          stream.emit("drain");
        });
        writer.on("error", reemit);
        reader.on("error", reemit);
        stream.writable = writer.writable;
        stream.readable = reader.readable;
        return stream;
        function proxyWriter(methodName) {
          stream[methodName] = method;
          function method() {
            return writer[methodName].apply(writer, arguments);
          }
        }
        function proxyReader(methodName) {
          stream[methodName] = method;
          function method() {
            stream.emit(methodName);
            var func = reader[methodName];
            if (func) {
              return func.apply(reader, arguments);
            }
            reader.emit(methodName);
          }
        }
        function proxyStream(methodName) {
          reader.on(methodName, reemit);
          function reemit() {
            var args = slice.call(arguments);
            args.unshift(methodName);
            stream.emit.apply(stream, args);
          }
        }
        function handleEnd() {
          if (ended) {
            return;
          }
          ended = true;
          var args = slice.call(arguments);
          args.unshift("end");
          stream.emit.apply(stream, args);
        }
        function reemit(err) {
          stream.emit("error", err);
        }
      }
    },
    3520: (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      const fs = __nccwpck_require__(9896);
      const stream = __nccwpck_require__(2203);
      const zlib = __nccwpck_require__(3106);
      const { promisify } = __nccwpck_require__(9023);
      const duplexer = __nccwpck_require__(6615);
      const getOptions = (options) => ({ level: 9, ...options });
      const gzip = promisify(zlib.gzip);
      module.exports = async (input, options) => {
        if (!input) {
          return 0;
        }
        const data = await gzip(input, getOptions(options));
        return data.length;
      };
      module.exports.sync = (input, options) =>
        zlib.gzipSync(input, getOptions(options)).length;
      module.exports.stream = (options) => {
        const input = new stream.PassThrough();
        const output = new stream.PassThrough();
        const wrapper = duplexer(input, output);
        let gzipSize = 0;
        const gzip = zlib
          .createGzip(getOptions(options))
          .on("data", (buf) => {
            gzipSize += buf.length;
          })
          .on("error", () => {
            wrapper.gzipSize = 0;
          })
          .on("end", () => {
            wrapper.gzipSize = gzipSize;
            wrapper.emit("gzip-size", gzipSize);
            output.end();
          });
        input.pipe(gzip);
        input.pipe(output, { end: false });
        return wrapper;
      };
      module.exports.file = (path, options) =>
        new Promise((resolve, reject) => {
          const stream = fs.createReadStream(path);
          stream.on("error", reject);
          const gzipStream = stream.pipe(module.exports.stream(options));
          gzipStream.on("error", reject);
          gzipStream.on("gzip-size", resolve);
        });
      module.exports.fileSync = (path, options) =>
        module.exports.sync(fs.readFileSync(path), options);
    },
    2443: (__unused_webpack_module, exports) => {
      const mimes = {
        "3g2": "video/3gpp2",
        "3gp": "video/3gpp",
        "3gpp": "video/3gpp",
        "3mf": "model/3mf",
        aac: "audio/aac",
        ac: "application/pkix-attr-cert",
        adp: "audio/adpcm",
        adts: "audio/aac",
        ai: "application/postscript",
        aml: "application/automationml-aml+xml",
        amlx: "application/automationml-amlx+zip",
        amr: "audio/amr",
        apng: "image/apng",
        appcache: "text/cache-manifest",
        appinstaller: "application/appinstaller",
        appx: "application/appx",
        appxbundle: "application/appxbundle",
        asc: "application/pgp-keys",
        atom: "application/atom+xml",
        atomcat: "application/atomcat+xml",
        atomdeleted: "application/atomdeleted+xml",
        atomsvc: "application/atomsvc+xml",
        au: "audio/basic",
        avci: "image/avci",
        avcs: "image/avcs",
        avif: "image/avif",
        aw: "application/applixware",
        bdoc: "application/bdoc",
        bin: "application/octet-stream",
        bmp: "image/bmp",
        bpk: "application/octet-stream",
        btf: "image/prs.btif",
        btif: "image/prs.btif",
        buffer: "application/octet-stream",
        ccxml: "application/ccxml+xml",
        cdfx: "application/cdfx+xml",
        cdmia: "application/cdmi-capability",
        cdmic: "application/cdmi-container",
        cdmid: "application/cdmi-domain",
        cdmio: "application/cdmi-object",
        cdmiq: "application/cdmi-queue",
        cer: "application/pkix-cert",
        cgm: "image/cgm",
        cjs: "application/node",
        class: "application/java-vm",
        coffee: "text/coffeescript",
        conf: "text/plain",
        cpl: "application/cpl+xml",
        cpt: "application/mac-compactpro",
        crl: "application/pkix-crl",
        css: "text/css",
        csv: "text/csv",
        cu: "application/cu-seeme",
        cwl: "application/cwl",
        cww: "application/prs.cww",
        davmount: "application/davmount+xml",
        dbk: "application/docbook+xml",
        deb: "application/octet-stream",
        def: "text/plain",
        deploy: "application/octet-stream",
        dib: "image/bmp",
        "disposition-notification": "message/disposition-notification",
        dist: "application/octet-stream",
        distz: "application/octet-stream",
        dll: "application/octet-stream",
        dmg: "application/octet-stream",
        dms: "application/octet-stream",
        doc: "application/msword",
        dot: "application/msword",
        dpx: "image/dpx",
        drle: "image/dicom-rle",
        dsc: "text/prs.lines.tag",
        dssc: "application/dssc+der",
        dtd: "application/xml-dtd",
        dump: "application/octet-stream",
        dwd: "application/atsc-dwd+xml",
        ear: "application/java-archive",
        ecma: "application/ecmascript",
        elc: "application/octet-stream",
        emf: "image/emf",
        eml: "message/rfc822",
        emma: "application/emma+xml",
        emotionml: "application/emotionml+xml",
        eps: "application/postscript",
        epub: "application/epub+zip",
        exe: "application/octet-stream",
        exi: "application/exi",
        exp: "application/express",
        exr: "image/aces",
        ez: "application/andrew-inset",
        fdf: "application/fdf",
        fdt: "application/fdt+xml",
        fits: "image/fits",
        g3: "image/g3fax",
        gbr: "application/rpki-ghostbusters",
        geojson: "application/geo+json",
        gif: "image/gif",
        glb: "model/gltf-binary",
        gltf: "model/gltf+json",
        gml: "application/gml+xml",
        gpx: "application/gpx+xml",
        gram: "application/srgs",
        grxml: "application/srgs+xml",
        gxf: "application/gxf",
        gz: "application/gzip",
        h261: "video/h261",
        h263: "video/h263",
        h264: "video/h264",
        heic: "image/heic",
        heics: "image/heic-sequence",
        heif: "image/heif",
        heifs: "image/heif-sequence",
        hej2: "image/hej2k",
        held: "application/atsc-held+xml",
        hjson: "application/hjson",
        hlp: "application/winhlp",
        hqx: "application/mac-binhex40",
        hsj2: "image/hsj2",
        htm: "text/html",
        html: "text/html",
        ics: "text/calendar",
        ief: "image/ief",
        ifb: "text/calendar",
        iges: "model/iges",
        igs: "model/iges",
        img: "application/octet-stream",
        in: "text/plain",
        ini: "text/plain",
        ink: "application/inkml+xml",
        inkml: "application/inkml+xml",
        ipfix: "application/ipfix",
        iso: "application/octet-stream",
        its: "application/its+xml",
        jade: "text/jade",
        jar: "application/java-archive",
        jhc: "image/jphc",
        jls: "image/jls",
        jp2: "image/jp2",
        jpe: "image/jpeg",
        jpeg: "image/jpeg",
        jpf: "image/jpx",
        jpg: "image/jpeg",
        jpg2: "image/jp2",
        jpgm: "image/jpm",
        jpgv: "video/jpeg",
        jph: "image/jph",
        jpm: "image/jpm",
        jpx: "image/jpx",
        js: "text/javascript",
        json: "application/json",
        json5: "application/json5",
        jsonld: "application/ld+json",
        jsonml: "application/jsonml+json",
        jsx: "text/jsx",
        jt: "model/jt",
        jxl: "image/jxl",
        jxr: "image/jxr",
        jxra: "image/jxra",
        jxrs: "image/jxrs",
        jxs: "image/jxs",
        jxsc: "image/jxsc",
        jxsi: "image/jxsi",
        jxss: "image/jxss",
        kar: "audio/midi",
        ktx: "image/ktx",
        ktx2: "image/ktx2",
        less: "text/less",
        lgr: "application/lgr+xml",
        list: "text/plain",
        litcoffee: "text/coffeescript",
        log: "text/plain",
        lostxml: "application/lost+xml",
        lrf: "application/octet-stream",
        m1v: "video/mpeg",
        m21: "application/mp21",
        m2a: "audio/mpeg",
        m2t: "video/mp2t",
        m2ts: "video/mp2t",
        m2v: "video/mpeg",
        m3a: "audio/mpeg",
        m4a: "audio/mp4",
        m4p: "application/mp4",
        m4s: "video/iso.segment",
        ma: "application/mathematica",
        mads: "application/mads+xml",
        maei: "application/mmt-aei+xml",
        man: "text/troff",
        manifest: "text/cache-manifest",
        map: "application/json",
        mar: "application/octet-stream",
        markdown: "text/markdown",
        mathml: "application/mathml+xml",
        mb: "application/mathematica",
        mbox: "application/mbox",
        md: "text/markdown",
        mdx: "text/mdx",
        me: "text/troff",
        mesh: "model/mesh",
        meta4: "application/metalink4+xml",
        metalink: "application/metalink+xml",
        mets: "application/mets+xml",
        mft: "application/rpki-manifest",
        mid: "audio/midi",
        midi: "audio/midi",
        mime: "message/rfc822",
        mj2: "video/mj2",
        mjp2: "video/mj2",
        mjs: "text/javascript",
        mml: "text/mathml",
        mods: "application/mods+xml",
        mov: "video/quicktime",
        mp2: "audio/mpeg",
        mp21: "application/mp21",
        mp2a: "audio/mpeg",
        mp3: "audio/mpeg",
        mp4: "video/mp4",
        mp4a: "audio/mp4",
        mp4s: "application/mp4",
        mp4v: "video/mp4",
        mpd: "application/dash+xml",
        mpe: "video/mpeg",
        mpeg: "video/mpeg",
        mpf: "application/media-policy-dataset+xml",
        mpg: "video/mpeg",
        mpg4: "video/mp4",
        mpga: "audio/mpeg",
        mpp: "application/dash-patch+xml",
        mrc: "application/marc",
        mrcx: "application/marcxml+xml",
        ms: "text/troff",
        mscml: "application/mediaservercontrol+xml",
        msh: "model/mesh",
        msi: "application/octet-stream",
        msix: "application/msix",
        msixbundle: "application/msixbundle",
        msm: "application/octet-stream",
        msp: "application/octet-stream",
        mtl: "model/mtl",
        mts: "video/mp2t",
        musd: "application/mmt-usd+xml",
        mxf: "application/mxf",
        mxmf: "audio/mobile-xmf",
        mxml: "application/xv+xml",
        n3: "text/n3",
        nb: "application/mathematica",
        nq: "application/n-quads",
        nt: "application/n-triples",
        obj: "model/obj",
        oda: "application/oda",
        oga: "audio/ogg",
        ogg: "audio/ogg",
        ogv: "video/ogg",
        ogx: "application/ogg",
        omdoc: "application/omdoc+xml",
        onepkg: "application/onenote",
        onetmp: "application/onenote",
        onetoc: "application/onenote",
        onetoc2: "application/onenote",
        opf: "application/oebps-package+xml",
        opus: "audio/ogg",
        otf: "font/otf",
        owl: "application/rdf+xml",
        oxps: "application/oxps",
        p10: "application/pkcs10",
        p7c: "application/pkcs7-mime",
        p7m: "application/pkcs7-mime",
        p7s: "application/pkcs7-signature",
        p8: "application/pkcs8",
        pdf: "application/pdf",
        pfr: "application/font-tdpfr",
        pgp: "application/pgp-encrypted",
        pkg: "application/octet-stream",
        pki: "application/pkixcmp",
        pkipath: "application/pkix-pkipath",
        pls: "application/pls+xml",
        png: "image/png",
        prc: "model/prc",
        prf: "application/pics-rules",
        provx: "application/provenance+xml",
        ps: "application/postscript",
        pskcxml: "application/pskc+xml",
        pti: "image/prs.pti",
        qt: "video/quicktime",
        raml: "application/raml+yaml",
        rapd: "application/route-apd+xml",
        rdf: "application/rdf+xml",
        relo: "application/p2p-overlay+xml",
        rif: "application/reginfo+xml",
        rl: "application/resource-lists+xml",
        rld: "application/resource-lists-diff+xml",
        rmi: "audio/midi",
        rnc: "application/relax-ng-compact-syntax",
        rng: "application/xml",
        roa: "application/rpki-roa",
        roff: "text/troff",
        rq: "application/sparql-query",
        rs: "application/rls-services+xml",
        rsat: "application/atsc-rsat+xml",
        rsd: "application/rsd+xml",
        rsheet: "application/urc-ressheet+xml",
        rss: "application/rss+xml",
        rtf: "text/rtf",
        rtx: "text/richtext",
        rusd: "application/route-usd+xml",
        s3m: "audio/s3m",
        sbml: "application/sbml+xml",
        scq: "application/scvp-cv-request",
        scs: "application/scvp-cv-response",
        sdp: "application/sdp",
        senmlx: "application/senml+xml",
        sensmlx: "application/sensml+xml",
        ser: "application/java-serialized-object",
        setpay: "application/set-payment-initiation",
        setreg: "application/set-registration-initiation",
        sgi: "image/sgi",
        sgm: "text/sgml",
        sgml: "text/sgml",
        shex: "text/shex",
        shf: "application/shf+xml",
        shtml: "text/html",
        sieve: "application/sieve",
        sig: "application/pgp-signature",
        sil: "audio/silk",
        silo: "model/mesh",
        siv: "application/sieve",
        slim: "text/slim",
        slm: "text/slim",
        sls: "application/route-s-tsid+xml",
        smi: "application/smil+xml",
        smil: "application/smil+xml",
        snd: "audio/basic",
        so: "application/octet-stream",
        spdx: "text/spdx",
        spp: "application/scvp-vp-response",
        spq: "application/scvp-vp-request",
        spx: "audio/ogg",
        sql: "application/sql",
        sru: "application/sru+xml",
        srx: "application/sparql-results+xml",
        ssdl: "application/ssdl+xml",
        ssml: "application/ssml+xml",
        stk: "application/hyperstudio",
        stl: "model/stl",
        stpx: "model/step+xml",
        stpxz: "model/step-xml+zip",
        stpz: "model/step+zip",
        styl: "text/stylus",
        stylus: "text/stylus",
        svg: "image/svg+xml",
        svgz: "image/svg+xml",
        swidtag: "application/swid+xml",
        t: "text/troff",
        t38: "image/t38",
        td: "application/urc-targetdesc+xml",
        tei: "application/tei+xml",
        teicorpus: "application/tei+xml",
        text: "text/plain",
        tfi: "application/thraud+xml",
        tfx: "image/tiff-fx",
        tif: "image/tiff",
        tiff: "image/tiff",
        toml: "application/toml",
        tr: "text/troff",
        trig: "application/trig",
        ts: "video/mp2t",
        tsd: "application/timestamped-data",
        tsv: "text/tab-separated-values",
        ttc: "font/collection",
        ttf: "font/ttf",
        ttl: "text/turtle",
        ttml: "application/ttml+xml",
        txt: "text/plain",
        u3d: "model/u3d",
        u8dsn: "message/global-delivery-status",
        u8hdr: "message/global-headers",
        u8mdn: "message/global-disposition-notification",
        u8msg: "message/global",
        ubj: "application/ubjson",
        uri: "text/uri-list",
        uris: "text/uri-list",
        urls: "text/uri-list",
        vcard: "text/vcard",
        vrml: "model/vrml",
        vtt: "text/vtt",
        vxml: "application/voicexml+xml",
        war: "application/java-archive",
        wasm: "application/wasm",
        wav: "audio/wav",
        weba: "audio/webm",
        webm: "video/webm",
        webmanifest: "application/manifest+json",
        webp: "image/webp",
        wgsl: "text/wgsl",
        wgt: "application/widget",
        wif: "application/watcherinfo+xml",
        wmf: "image/wmf",
        woff: "font/woff",
        woff2: "font/woff2",
        wrl: "model/vrml",
        wsdl: "application/wsdl+xml",
        wspolicy: "application/wspolicy+xml",
        x3d: "model/x3d+xml",
        x3db: "model/x3d+fastinfoset",
        x3dbz: "model/x3d+binary",
        x3dv: "model/x3d-vrml",
        x3dvz: "model/x3d+vrml",
        x3dz: "model/x3d+xml",
        xaml: "application/xaml+xml",
        xav: "application/xcap-att+xml",
        xca: "application/xcap-caps+xml",
        xcs: "application/calendar+xml",
        xdf: "application/xcap-diff+xml",
        xdssc: "application/dssc+xml",
        xel: "application/xcap-el+xml",
        xenc: "application/xenc+xml",
        xer: "application/patch-ops-error+xml",
        xfdf: "application/xfdf",
        xht: "application/xhtml+xml",
        xhtml: "application/xhtml+xml",
        xhvml: "application/xv+xml",
        xlf: "application/xliff+xml",
        xm: "audio/xm",
        xml: "text/xml",
        xns: "application/xcap-ns+xml",
        xop: "application/xop+xml",
        xpl: "application/xproc+xml",
        xsd: "application/xml",
        xsf: "application/prs.xsf+xml",
        xsl: "application/xml",
        xslt: "application/xml",
        xspf: "application/xspf+xml",
        xvm: "application/xv+xml",
        xvml: "application/xv+xml",
        yaml: "text/yaml",
        yang: "application/yang",
        yin: "application/yin+xml",
        yml: "text/yaml",
        zip: "application/zip",
      };
      function lookup(extn) {
        let tmp = ("" + extn).trim().toLowerCase();
        let idx = tmp.lastIndexOf(".");
        return mimes[!~idx ? tmp : tmp.substring(++idx)];
      }
      exports.mimes = mimes;
      exports.lookup = lookup;
    },
    8565: (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      var childProcess = __nccwpck_require__(5317);
      var os = __nccwpck_require__(857);
      module.exports = function opener(args, options, callback) {
        var platform = process.platform;
        if (platform === "linux" && os.release().indexOf("Microsoft") !== -1) {
          platform = "win32";
        }
        var command;
        switch (platform) {
          case "win32": {
            command = "cmd.exe";
            break;
          }
          case "darwin": {
            command = "open";
            break;
          }
          default: {
            command = "xdg-open";
            break;
          }
        }
        if (typeof args === "string") {
          args = [args];
        }
        if (typeof options === "function") {
          callback = options;
          options = {};
        }
        if (options && typeof options === "object" && options.command) {
          if (platform === "win32") {
            args = [options.command].concat(args);
          } else {
            command = options.command;
          }
        }
        if (platform === "win32") {
          args = args.map(function (value) {
            return value.replace(/[&^]/g, "^$&");
          });
          args = ["/c", "start", '""'].concat(args);
        }
        return childProcess.execFile(command, args, options, callback);
      };
    },
    9456: (module) => {
      let p = process || {},
        argv = p.argv || [],
        env = p.env || {};
      let isColorSupported =
        !(!!env.NO_COLOR || argv.includes("--no-color")) &&
        (!!env.FORCE_COLOR ||
          argv.includes("--color") ||
          p.platform === "win32" ||
          ((p.stdout || {}).isTTY && env.TERM !== "dumb") ||
          !!env.CI);
      let formatter =
        (open, close, replace = open) =>
        (input) => {
          let string = "" + input,
            index = string.indexOf(close, open.length);
          return ~index
            ? open + replaceClose(string, close, replace, index) + close
            : open + string + close;
        };
      let replaceClose = (string, close, replace, index) => {
        let result = "",
          cursor = 0;
        do {
          result += string.substring(cursor, index) + replace;
          cursor = index + close.length;
          index = string.indexOf(close, cursor);
        } while (~index);
        return result + string.substring(cursor);
      };
      let createColors = (enabled = isColorSupported) => {
        let f = enabled ? formatter : () => String;
        return {
          isColorSupported: enabled,
          reset: f("[0m", "[0m"),
          bold: f("[1m", "[22m", "[22m[1m"),
          dim: f("[2m", "[22m", "[22m[2m"),
          italic: f("[3m", "[23m"),
          underline: f("[4m", "[24m"),
          inverse: f("[7m", "[27m"),
          hidden: f("[8m", "[28m"),
          strikethrough: f("[9m", "[29m"),
          black: f("[30m", "[39m"),
          red: f("[31m", "[39m"),
          green: f("[32m", "[39m"),
          yellow: f("[33m", "[39m"),
          blue: f("[34m", "[39m"),
          magenta: f("[35m", "[39m"),
          cyan: f("[36m", "[39m"),
          white: f("[37m", "[39m"),
          gray: f("[90m", "[39m"),
          bgBlack: f("[40m", "[49m"),
          bgRed: f("[41m", "[49m"),
          bgGreen: f("[42m", "[49m"),
          bgYellow: f("[43m", "[49m"),
          bgBlue: f("[44m", "[49m"),
          bgMagenta: f("[45m", "[49m"),
          bgCyan: f("[46m", "[49m"),
          bgWhite: f("[47m", "[49m"),
          blackBright: f("[90m", "[39m"),
          redBright: f("[91m", "[39m"),
          greenBright: f("[92m", "[39m"),
          yellowBright: f("[93m", "[39m"),
          blueBright: f("[94m", "[39m"),
          magentaBright: f("[95m", "[39m"),
          cyanBright: f("[96m", "[39m"),
          whiteBright: f("[97m", "[39m"),
          bgBlackBright: f("[100m", "[49m"),
          bgRedBright: f("[101m", "[49m"),
          bgGreenBright: f("[102m", "[49m"),
          bgYellowBright: f("[103m", "[49m"),
          bgBlueBright: f("[104m", "[49m"),
          bgMagentaBright: f("[105m", "[49m"),
          bgCyanBright: f("[106m", "[49m"),
          bgWhiteBright: f("[107m", "[49m"),
        };
      };
      module.exports = createColors();
      module.exports.createColors = createColors;
    },
    6008: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const fs = __nccwpck_require__(9896);
      const { join, normalize, resolve } = __nccwpck_require__(6928);
      const { totalist } = __nccwpck_require__(8794);
      const { parse } = __nccwpck_require__(9847);
      const { lookup } = __nccwpck_require__(2443);
      const noop = () => {};
      function isMatch(uri, arr) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].test(uri)) return true;
        }
      }
      function toAssume(uri, extns) {
        let i = 0,
          x,
          len = uri.length - 1;
        if (uri.charCodeAt(len) === 47) {
          uri = uri.substring(0, len);
        }
        let arr = [],
          tmp = `${uri}/index`;
        for (; i < extns.length; i++) {
          x = extns[i] ? `.${extns[i]}` : "";
          if (uri) arr.push(uri + x);
          arr.push(tmp + x);
        }
        return arr;
      }
      function viaCache(cache, uri, extns) {
        let i = 0,
          data,
          arr = toAssume(uri, extns);
        for (; i < arr.length; i++) {
          if ((data = cache[arr[i]])) return data;
        }
      }
      function viaLocal(dir, isEtag, uri, extns) {
        let i = 0,
          arr = toAssume(uri, extns);
        let abs, stats, name, headers;
        for (; i < arr.length; i++) {
          abs = normalize(join(dir, (name = arr[i])));
          if (abs.startsWith(dir) && fs.existsSync(abs)) {
            stats = fs.statSync(abs);
            if (stats.isDirectory()) continue;
            headers = toHeaders(name, stats, isEtag);
            headers["Cache-Control"] = isEtag ? "no-cache" : "no-store";
            return { abs, stats, headers };
          }
        }
      }
      function is404(req, res) {
        return (res.statusCode = 404), res.end();
      }
      function send(req, res, file, stats, headers) {
        let code = 200,
          tmp,
          opts = {};
        headers = { ...headers };
        for (let key in headers) {
          tmp = res.getHeader(key);
          if (tmp) headers[key] = tmp;
        }
        if ((tmp = res.getHeader("content-type"))) {
          headers["Content-Type"] = tmp;
        }
        if (req.headers.range) {
          code = 206;
          let [x, y] = req.headers.range.replace("bytes=", "").split("-");
          let end = (opts.end = parseInt(y, 10) || stats.size - 1);
          let start = (opts.start = parseInt(x, 10) || 0);
          if (end >= stats.size) {
            end = stats.size - 1;
          }
          if (start >= stats.size) {
            res.setHeader("Content-Range", `bytes */${stats.size}`);
            res.statusCode = 416;
            return res.end();
          }
          headers["Content-Range"] = `bytes ${start}-${end}/${stats.size}`;
          headers["Content-Length"] = end - start + 1;
          headers["Accept-Ranges"] = "bytes";
        }
        res.writeHead(code, headers);
        fs.createReadStream(file, opts).pipe(res);
      }
      const ENCODING = { ".br": "br", ".gz": "gzip" };
      function toHeaders(name, stats, isEtag) {
        let enc = ENCODING[name.slice(-3)];
        let ctype = lookup(name.slice(0, enc && -3)) || "";
        if (ctype === "text/html") ctype += ";charset=utf-8";
        let headers = {
          "Content-Length": stats.size,
          "Content-Type": ctype,
          "Last-Modified": stats.mtime.toUTCString(),
        };
        if (enc) headers["Content-Encoding"] = enc;
        if (isEtag)
          headers["ETag"] = `W/"${stats.size}-${stats.mtime.getTime()}"`;
        return headers;
      }
      module.exports = function (dir, opts = {}) {
        dir = resolve(dir || ".");
        let isNotFound = opts.onNoMatch || is404;
        let setHeaders = opts.setHeaders || noop;
        let extensions = opts.extensions || ["html", "htm"];
        let gzips = opts.gzip && extensions.map((x) => `${x}.gz`).concat("gz");
        let brots =
          opts.brotli && extensions.map((x) => `${x}.br`).concat("br");
        const FILES = {};
        let fallback = "/";
        let isEtag = !!opts.etag;
        let isSPA = !!opts.single;
        if (typeof opts.single === "string") {
          let idx = opts.single.lastIndexOf(".");
          fallback += !!~idx ? opts.single.substring(0, idx) : opts.single;
        }
        let ignores = [];
        if (opts.ignores !== false) {
          ignores.push(/[/]([A-Za-z\s\d~$._-]+\.\w+){1,}$/);
          if (opts.dotfiles) ignores.push(/\/\.\w/);
          else ignores.push(/\/\.well-known/);
          [].concat(opts.ignores || []).forEach((x) => {
            ignores.push(new RegExp(x, "i"));
          });
        }
        let cc = opts.maxAge != null && `public,max-age=${opts.maxAge}`;
        if (cc && opts.immutable) cc += ",immutable";
        else if (cc && opts.maxAge === 0) cc += ",must-revalidate";
        if (!opts.dev) {
          totalist(dir, (name, abs, stats) => {
            if (/\.well-known[\\+\/]/.test(name)) {
            } else if (!opts.dotfiles && /(^\.|[\\+|\/+]\.)/.test(name)) return;
            let headers = toHeaders(name, stats, isEtag);
            if (cc) headers["Cache-Control"] = cc;
            FILES["/" + name.normalize().replace(/\\+/g, "/")] = {
              abs,
              stats,
              headers,
            };
          });
        }
        let lookup = opts.dev
          ? viaLocal.bind(0, dir, isEtag)
          : viaCache.bind(0, FILES);
        return function (req, res, next) {
          let extns = [""];
          let pathname = parse(req).pathname;
          let val = req.headers["accept-encoding"] || "";
          if (gzips && val.includes("gzip")) extns.unshift(...gzips);
          if (brots && /(br|brotli)/i.test(val)) extns.unshift(...brots);
          extns.push(...extensions);
          if (pathname.indexOf("%") !== -1) {
            try {
              pathname = decodeURI(pathname);
            } catch (err) {}
          }
          let data =
            lookup(pathname, extns) ||
            (isSPA && !isMatch(pathname, ignores) && lookup(fallback, extns));
          if (!data) return next ? next() : isNotFound(req, res);
          if (isEtag && req.headers["if-none-match"] === data.headers["ETag"]) {
            res.writeHead(304);
            return res.end();
          }
          if (gzips || brots) {
            res.setHeader("Vary", "Accept-Encoding");
          }
          setHeaders(res, pathname, data.stats);
          send(req, res, data.abs, data.stats, data.headers);
        };
      };
    },
    8794: (__unused_webpack_module, exports, __nccwpck_require__) => {
      const { join, resolve } = __nccwpck_require__(6928);
      const { readdirSync, statSync } = __nccwpck_require__(9896);
      function totalist(dir, callback, pre = "") {
        dir = resolve(".", dir);
        let arr = readdirSync(dir);
        let i = 0,
          abs,
          stats;
        for (; i < arr.length; i++) {
          abs = join(dir, arr[i]);
          stats = statSync(abs);
          stats.isDirectory()
            ? totalist(abs, callback, join(pre, arr[i]))
            : callback(join(pre, arr[i]), abs, stats);
        }
      }
      exports.totalist = totalist;
    },
    5258: (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      const fs = __nccwpck_require__(9896);
      const path = __nccwpck_require__(6928);
      const { bold } = __nccwpck_require__(9456);
      const Logger = __nccwpck_require__(7087);
      const viewer = __nccwpck_require__(2257);
      const utils = __nccwpck_require__(3762);
      const { writeStats } = __nccwpck_require__(4839);
      class BundleAnalyzerPlugin {
        constructor(opts = {}) {
          this.opts = {
            analyzerMode: "server",
            analyzerHost: "127.0.0.1",
            reportFilename: null,
            reportTitle: utils.defaultTitle,
            defaultSizes: "parsed",
            openAnalyzer: true,
            generateStatsFile: false,
            statsFilename: "stats.json",
            statsOptions: null,
            excludeAssets: null,
            logLevel: "info",
            startAnalyzer: true,
            analyzerUrl: utils.defaultAnalyzerUrl,
            ...opts,
            analyzerPort:
              "analyzerPort" in opts
                ? opts.analyzerPort === "auto"
                  ? 0
                  : opts.analyzerPort
                : 8888,
          };
          this.server = null;
          this.logger = new Logger(this.opts.logLevel);
        }
        apply(compiler) {
          this.compiler = compiler;
          const done = (stats, callback) => {
            callback = callback || (() => {});
            const actions = [];
            if (this.opts.generateStatsFile) {
              actions.push(() =>
                this.generateStatsFile(stats.toJson(this.opts.statsOptions)),
              );
            }
            if (
              this.opts.analyzerMode === "server" &&
              !this.opts.startAnalyzer
            ) {
              this.opts.analyzerMode = "disabled";
            }
            if (this.opts.analyzerMode === "server") {
              actions.push(() => this.startAnalyzerServer(stats.toJson()));
            } else if (this.opts.analyzerMode === "static") {
              actions.push(() => this.generateStaticReport(stats.toJson()));
            } else if (this.opts.analyzerMode === "json") {
              actions.push(() => this.generateJSONReport(stats.toJson()));
            }
            if (actions.length) {
              setImmediate(async () => {
                try {
                  await Promise.all(actions.map((action) => action()));
                  callback();
                } catch (e) {
                  callback(e);
                }
              });
            } else {
              callback();
            }
          };
          if (compiler.hooks) {
            compiler.hooks.done.tapAsync("webpack-bundle-analyzer", done);
          } else {
            compiler.plugin("done", done);
          }
        }
        async generateStatsFile(stats) {
          const statsFilepath = path.resolve(
            this.compiler.outputPath,
            this.opts.statsFilename,
          );
          await fs.promises.mkdir(path.dirname(statsFilepath), {
            recursive: true,
          });
          try {
            await writeStats(stats, statsFilepath);
            this.logger.info(
              `${bold("Webpack Bundle Analyzer")} saved stats file to ${bold(statsFilepath)}`,
            );
          } catch (error) {
            this.logger.error(
              `${bold("Webpack Bundle Analyzer")} error saving stats file to ${bold(statsFilepath)}: ${error}`,
            );
          }
        }
        async startAnalyzerServer(stats) {
          if (this.server) {
            (await this.server).updateChartData(stats);
          } else {
            this.server = viewer.startServer(stats, {
              openBrowser: this.opts.openAnalyzer,
              host: this.opts.analyzerHost,
              port: this.opts.analyzerPort,
              reportTitle: this.opts.reportTitle,
              bundleDir: this.getBundleDirFromCompiler(),
              logger: this.logger,
              defaultSizes: this.opts.defaultSizes,
              excludeAssets: this.opts.excludeAssets,
              analyzerUrl: this.opts.analyzerUrl,
            });
          }
        }
        async generateJSONReport(stats) {
          await viewer.generateJSONReport(stats, {
            reportFilename: path.resolve(
              this.compiler.outputPath,
              this.opts.reportFilename || "report.json",
            ),
            bundleDir: this.getBundleDirFromCompiler(),
            logger: this.logger,
            excludeAssets: this.opts.excludeAssets,
          });
        }
        async generateStaticReport(stats) {
          await viewer.generateReport(stats, {
            openBrowser: this.opts.openAnalyzer,
            reportFilename: path.resolve(
              this.compiler.outputPath,
              this.opts.reportFilename || "report.html",
            ),
            reportTitle: this.opts.reportTitle,
            bundleDir: this.getBundleDirFromCompiler(),
            logger: this.logger,
            defaultSizes: this.opts.defaultSizes,
            excludeAssets: this.opts.excludeAssets,
          });
        }
        getBundleDirFromCompiler() {
          if (
            typeof this.compiler.outputFileSystem.constructor === "undefined"
          ) {
            return this.compiler.outputPath;
          }
          switch (this.compiler.outputFileSystem.constructor.name) {
            case "MemoryFileSystem":
              return null;
            case "AsyncMFS":
              return null;
            default:
              return this.compiler.outputPath;
          }
        }
      }
      module.exports = BundleAnalyzerPlugin;
    },
    7087: (module) => {
      "use strict";
      const LEVELS = ["debug", "info", "warn", "error", "silent"];
      const LEVEL_TO_CONSOLE_METHOD = new Map([
        ["debug", "log"],
        ["info", "log"],
        ["warn", "log"],
      ]);
      class Logger {
        constructor(level = Logger.defaultLevel) {
          this.activeLevels = new Set();
          this.setLogLevel(level);
        }
        setLogLevel(level) {
          const levelIndex = LEVELS.indexOf(level);
          if (levelIndex === -1)
            throw new Error(
              `Invalid log level "${level}". Use one of these: ${LEVELS.join(", ")}`,
            );
          this.activeLevels.clear();
          for (const [i, level] of LEVELS.entries()) {
            if (i >= levelIndex) this.activeLevels.add(level);
          }
        }
        _log(level, ...args) {
          console[LEVEL_TO_CONSOLE_METHOD.get(level) || level](...args);
        }
      }
      Logger.levels = LEVELS;
      Logger.defaultLevel = "info";
      LEVELS.forEach((level) => {
        if (level === "silent") return;
        Logger.prototype[level] = function (...args) {
          if (this.activeLevels.has(level)) this._log(level, ...args);
        };
      });
      module.exports = Logger;
    },
    5433: (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      const fs = __nccwpck_require__(9896);
      const path = __nccwpck_require__(6928);
      const gzipSize = __nccwpck_require__(3520);
      const { parseChunked } = __nccwpck_require__(7229);
      const Logger = __nccwpck_require__(7087);
      const Folder = __nccwpck_require__(5266).A;
      const { parseBundle } = __nccwpck_require__(9451);
      const { createAssetsFilter } = __nccwpck_require__(3762);
      const FILENAME_QUERY_REGEXP = /\?.*$/u;
      const FILENAME_EXTENSIONS = /\.(js|mjs|cjs)$/iu;
      module.exports = { getViewerData, readStatsFromFile };
      function getViewerData(bundleStats, bundleDir, opts) {
        const { logger = new Logger(), excludeAssets = null } = opts || {};
        const isAssetIncluded = createAssetsFilter(excludeAssets);
        if (
          (bundleStats.assets == null || bundleStats.assets.length === 0) &&
          bundleStats.children &&
          bundleStats.children.length > 0
        ) {
          const { children } = bundleStats;
          bundleStats = bundleStats.children[0];
          for (let i = 1; i < children.length; i++) {
            children[i].assets.forEach((asset) => {
              asset.isChild = true;
              bundleStats.assets.push(asset);
            });
          }
        } else if (bundleStats.children && bundleStats.children.length > 0) {
          bundleStats.children.forEach((child) => {
            child.assets.forEach((asset) => {
              asset.isChild = true;
              bundleStats.assets.push(asset);
            });
          });
        }
        bundleStats.assets = bundleStats.assets.filter((asset) => {
          if (asset.type && asset.type !== "asset") {
            return false;
          }
          asset.name = asset.name.replace(FILENAME_QUERY_REGEXP, "");
          return (
            FILENAME_EXTENSIONS.test(asset.name) &&
            asset.chunks.length > 0 &&
            isAssetIncluded(asset.name)
          );
        });
        let bundlesSources = null;
        let parsedModules = null;
        if (bundleDir) {
          bundlesSources = {};
          parsedModules = {};
          for (const statAsset of bundleStats.assets) {
            const assetFile = path.join(bundleDir, statAsset.name);
            let bundleInfo;
            try {
              bundleInfo = parseBundle(assetFile);
            } catch (err) {
              const msg = err.code === "ENOENT" ? "no such file" : err.message;
              logger.warn(`Error parsing bundle asset "${assetFile}": ${msg}`);
              continue;
            }
            bundlesSources[statAsset.name] = {
              src: bundleInfo.src,
              runtimeSrc: bundleInfo.runtimeSrc,
            };
            Object.assign(parsedModules, bundleInfo.modules);
          }
          if (Object.keys(bundlesSources).length === 0) {
            bundlesSources = null;
            parsedModules = null;
            logger.warn(
              "\nNo bundles were parsed. Analyzer will show only original module sizes from stats file.\n",
            );
          }
        }
        const assets = bundleStats.assets.reduce((result, statAsset) => {
          const assetBundles = statAsset.isChild
            ? getChildAssetBundles(bundleStats, statAsset.name)
            : bundleStats;
          const modules = assetBundles ? getBundleModules(assetBundles) : [];
          const asset = (result[statAsset.name] = { size: statAsset.size });
          const assetSources =
            bundlesSources &&
            Object.prototype.hasOwnProperty.call(bundlesSources, statAsset.name)
              ? bundlesSources[statAsset.name]
              : null;
          if (assetSources) {
            asset.parsedSize = Buffer.byteLength(assetSources.src);
            asset.gzipSize = gzipSize.sync(assetSources.src);
          }
          let assetModules = modules.filter((statModule) =>
            assetHasModule(statAsset, statModule),
          );
          if (parsedModules) {
            const unparsedEntryModules = [];
            for (const statModule of assetModules) {
              if (parsedModules[statModule.id]) {
                statModule.parsedSrc = parsedModules[statModule.id];
              } else if (isEntryModule(statModule)) {
                unparsedEntryModules.push(statModule);
              }
            }
            if (unparsedEntryModules.length && assetSources) {
              if (unparsedEntryModules.length === 1) {
                unparsedEntryModules[0].parsedSrc = assetSources.runtimeSrc;
              } else {
                assetModules = assetModules.filter(
                  (mod) => !unparsedEntryModules.includes(mod),
                );
                assetModules.unshift({
                  identifier: "./entry modules",
                  name: "./entry modules",
                  modules: unparsedEntryModules,
                  size: unparsedEntryModules.reduce(
                    (totalSize, module) => totalSize + module.size,
                    0,
                  ),
                  parsedSrc: assetSources.runtimeSrc,
                });
              }
            }
          }
          asset.modules = assetModules;
          asset.tree = createModulesTree(asset.modules);
          return result;
        }, {});
        const chunkToInitialByEntrypoint =
          getChunkToInitialByEntrypoint(bundleStats);
        return Object.entries(assets).map(([filename, asset]) => {
          var _chunkToInitialByEntr;
          return {
            label: filename,
            isAsset: true,
            statSize: asset.tree.size || asset.size,
            parsedSize: asset.parsedSize,
            gzipSize: asset.gzipSize,
            groups: Object.values(asset.tree.children).map((i) =>
              i.toChartData(),
            ),
            isInitialByEntrypoint:
              (_chunkToInitialByEntr = chunkToInitialByEntrypoint[filename]) !==
                null && _chunkToInitialByEntr !== void 0
                ? _chunkToInitialByEntr
                : {},
          };
        });
      }
      function readStatsFromFile(filename) {
        return parseChunked(
          fs.createReadStream(filename, { encoding: "utf8" }),
        );
      }
      function getChildAssetBundles(bundleStats, assetName) {
        return flatten(
          (bundleStats.children || []).find((c) =>
            Object.values(c.assetsByChunkName),
          ),
        ).includes(assetName);
      }
      function getBundleModules(bundleStats) {
        var _bundleStats$chunks;
        const seenIds = new Set();
        return flatten(
          (
            ((_bundleStats$chunks = bundleStats.chunks) === null ||
            _bundleStats$chunks === void 0
              ? void 0
              : _bundleStats$chunks.map((chunk) => chunk.modules)) || []
          )
            .concat(bundleStats.modules)
            .filter(Boolean),
        ).filter((mod) => {
          if (isRuntimeModule(mod)) {
            return false;
          }
          if (seenIds.has(mod.id)) {
            return false;
          }
          seenIds.add(mod.id);
          return true;
        });
      }
      function assetHasModule(statAsset, statModule) {
        return (statModule.chunks || []).some((moduleChunk) =>
          statAsset.chunks.includes(moduleChunk),
        );
      }
      function isEntryModule(statModule) {
        return statModule.depth === 0;
      }
      function isRuntimeModule(statModule) {
        return statModule.moduleType === "runtime";
      }
      function createModulesTree(modules) {
        const root = new Folder(".");
        modules.forEach((module) => root.addModule(module));
        root.mergeNestedFolders();
        return root;
      }
      function getChunkToInitialByEntrypoint(bundleStats) {
        if (bundleStats == null) {
          return {};
        }
        const chunkToEntrypointInititalMap = {};
        Object.values(bundleStats.entrypoints || {}).forEach((entrypoint) => {
          for (const asset of entrypoint.assets) {
            var _chunkToEntrypointIni;
            chunkToEntrypointInititalMap[asset.name] =
              (_chunkToEntrypointIni =
                chunkToEntrypointInititalMap[asset.name]) !== null &&
              _chunkToEntrypointIni !== void 0
                ? _chunkToEntrypointIni
                : {};
            chunkToEntrypointInititalMap[asset.name][entrypoint.name] = true;
          }
        });
        return chunkToEntrypointInititalMap;
      }
      function flatten(arr) {
        if (!arr) return [];
        const len = arr.length;
        if (!len) return [];
        let cur;
        const res = [];
        for (let i = 0; i < len; i++) {
          cur = arr[i];
          if (Array.isArray(cur)) {
            res.push(...cur);
          } else {
            res.push(cur);
          }
        }
        return res;
      }
    },
    8791: (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      const { start } = __nccwpck_require__(2257);
      module.exports = {
        start,
        BundleAnalyzerPlugin: __nccwpck_require__(5258),
      };
    },
    9451: (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      const fs = __nccwpck_require__(9896);
      const acorn = __nccwpck_require__(8024);
      const walk = __nccwpck_require__(9703);
      module.exports = { parseBundle };
      function parseBundle(bundlePath) {
        const content = fs.readFileSync(bundlePath, "utf8");
        const ast = acorn.parse(content, {
          sourceType: "script",
          ecmaVersion: 2050,
        });
        const walkState = { locations: null, expressionStatementDepth: 0 };
        walk.recursive(ast, walkState, {
          ExpressionStatement(node, state, c) {
            if (state.locations) return;
            state.expressionStatementDepth++;
            if (
              state.expressionStatementDepth === 1 &&
              ast.body.includes(node) &&
              isIIFE(node)
            ) {
              const fn = getIIFECallExpression(node);
              if (fn.arguments.length === 0 && fn.callee.params.length === 0) {
                const firstVariableDeclaration = fn.callee.body.body.find(
                  (node) => node.type === "VariableDeclaration",
                );
                if (firstVariableDeclaration) {
                  for (const declaration of firstVariableDeclaration.declarations) {
                    if (declaration.init) {
                      state.locations = getModulesLocations(declaration.init);
                      if (state.locations) {
                        break;
                      }
                    }
                  }
                }
              }
            }
            if (!state.locations) {
              c(node.expression, state);
            }
            state.expressionStatementDepth--;
          },
          AssignmentExpression(node, state) {
            if (state.locations) return;
            const { left, right } = node;
            if (
              left &&
              left.object &&
              left.object.name === "exports" &&
              left.property &&
              left.property.name === "modules" &&
              isModulesHash(right)
            ) {
              state.locations = getModulesLocations(right);
            }
          },
          CallExpression(node, state, c) {
            if (state.locations) return;
            const args = node.arguments;
            if (
              node.callee.type === "FunctionExpression" &&
              !node.callee.id &&
              args.length === 1 &&
              isSimpleModulesList(args[0])
            ) {
              state.locations = getModulesLocations(args[0]);
              return;
            }
            if (
              node.callee.type === "Identifier" &&
              mayBeAsyncChunkArguments(args) &&
              isModulesList(args[1])
            ) {
              state.locations = getModulesLocations(args[1]);
              return;
            }
            if (isAsyncChunkPushExpression(node)) {
              state.locations = getModulesLocations(args[0].elements[1]);
              return;
            }
            if (isAsyncWebWorkerChunkExpression(node)) {
              state.locations = getModulesLocations(args[1]);
              return;
            }
            args.forEach((arg) => c(arg, state));
          },
        });
        const modules = {};
        if (walkState.locations) {
          Object.entries(walkState.locations).forEach(([id, loc]) => {
            modules[id] = content.slice(loc.start, loc.end);
          });
        }
        return {
          modules,
          src: content,
          runtimeSrc: getBundleRuntime(content, walkState.locations),
        };
      }
      function getBundleRuntime(content, modulesLocations) {
        const sortedLocations = Object.values(modulesLocations || {}).sort(
          (a, b) => a.start - b.start,
        );
        let result = "";
        let lastIndex = 0;
        for (const { start, end } of sortedLocations) {
          result += content.slice(lastIndex, start);
          lastIndex = end;
        }
        return result + content.slice(lastIndex, content.length);
      }
      function isIIFE(node) {
        return (
          node.type === "ExpressionStatement" &&
          (node.expression.type === "CallExpression" ||
            (node.expression.type === "UnaryExpression" &&
              node.expression.argument.type === "CallExpression"))
        );
      }
      function getIIFECallExpression(node) {
        if (node.expression.type === "UnaryExpression") {
          return node.expression.argument;
        } else {
          return node.expression;
        }
      }
      function isModulesList(node) {
        return isSimpleModulesList(node) || isOptimizedModulesArray(node);
      }
      function isSimpleModulesList(node) {
        return isModulesHash(node) || isModulesArray(node);
      }
      function isModulesHash(node) {
        return (
          node.type === "ObjectExpression" &&
          node.properties.map((node) => node.value).every(isModuleWrapper)
        );
      }
      function isModulesArray(node) {
        return (
          node.type === "ArrayExpression" &&
          node.elements.every((elem) => !elem || isModuleWrapper(elem))
        );
      }
      function isOptimizedModulesArray(node) {
        return (
          node.type === "CallExpression" &&
          node.callee.type === "MemberExpression" &&
          node.callee.object.type === "CallExpression" &&
          node.callee.object.callee.type === "Identifier" &&
          node.callee.object.callee.name === "Array" &&
          node.callee.object.arguments.length === 1 &&
          isNumericId(node.callee.object.arguments[0]) &&
          node.callee.property.type === "Identifier" &&
          node.callee.property.name === "concat" &&
          node.arguments.length === 1 &&
          isModulesArray(node.arguments[0])
        );
      }
      function isModuleWrapper(node) {
        return (
          ((node.type === "FunctionExpression" ||
            node.type === "ArrowFunctionExpression") &&
            !node.id) ||
          isModuleId(node) ||
          (node.type === "ArrayExpression" &&
            node.elements.length > 1 &&
            isModuleId(node.elements[0]))
        );
      }
      function isModuleId(node) {
        return (
          node.type === "Literal" &&
          (isNumericId(node) || typeof node.value === "string")
        );
      }
      function isNumericId(node) {
        return (
          node.type === "Literal" &&
          Number.isInteger(node.value) &&
          node.value >= 0
        );
      }
      function isChunkIds(node) {
        return (
          node.type === "ArrayExpression" && node.elements.every(isModuleId)
        );
      }
      function isAsyncChunkPushExpression(node) {
        const { callee, arguments: args } = node;
        return (
          callee.type === "MemberExpression" &&
          callee.property.name === "push" &&
          callee.object.type === "AssignmentExpression" &&
          args.length === 1 &&
          args[0].type === "ArrayExpression" &&
          mayBeAsyncChunkArguments(args[0].elements) &&
          isModulesList(args[0].elements[1])
        );
      }
      function mayBeAsyncChunkArguments(args) {
        return args.length >= 2 && isChunkIds(args[0]);
      }
      function isAsyncWebWorkerChunkExpression(node) {
        const { callee, type, arguments: args } = node;
        return (
          type === "CallExpression" &&
          callee.type === "MemberExpression" &&
          args.length === 2 &&
          isChunkIds(args[0]) &&
          isModulesList(args[1])
        );
      }
      function getModulesLocations(node) {
        if (node.type === "ObjectExpression") {
          const modulesNodes = node.properties;
          return modulesNodes.reduce((result, moduleNode) => {
            const moduleId = moduleNode.key.name || moduleNode.key.value;
            result[moduleId] = getModuleLocation(moduleNode.value);
            return result;
          }, {});
        }
        const isOptimizedArray = node.type === "CallExpression";
        if (node.type === "ArrayExpression" || isOptimizedArray) {
          const minId = isOptimizedArray
            ? node.callee.object.arguments[0].value
            : 0;
          const modulesNodes = isOptimizedArray
            ? node.arguments[0].elements
            : node.elements;
          return modulesNodes.reduce((result, moduleNode, i) => {
            if (moduleNode) {
              result[i + minId] = getModuleLocation(moduleNode);
            }
            return result;
          }, {});
        }
        return {};
      }
      function getModuleLocation(node) {
        return { start: node.start, end: node.end };
      }
    },
    4839: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      const { createWriteStream } = __nccwpck_require__(9896);
      const { Readable } = __nccwpck_require__(2203);
      class StatsSerializeStream extends Readable {
        constructor(stats) {
          super();
          this._indentLevel = 0;
          this._stringifier = this._stringify(stats);
        }
        get _indent() {
          return "  ".repeat(this._indentLevel);
        }
        _read() {
          let readMore = true;
          while (readMore) {
            const { value, done } = this._stringifier.next();
            if (done) {
              this.push(null);
              readMore = false;
            } else {
              readMore = this.push(value);
            }
          }
        }
        *_stringify(obj) {
          if (
            typeof obj === "string" ||
            typeof obj === "number" ||
            typeof obj === "boolean" ||
            obj === null
          ) {
            yield JSON.stringify(obj);
          } else if (Array.isArray(obj)) {
            yield "[";
            this._indentLevel++;
            let isFirst = true;
            for (let item of obj) {
              if (item === undefined) {
                item = null;
              }
              yield `${isFirst ? "" : ","}\n${this._indent}`;
              yield* this._stringify(item);
              isFirst = false;
            }
            this._indentLevel--;
            yield obj.length ? `\n${this._indent}]` : "]";
          } else {
            yield "{";
            this._indentLevel++;
            let isFirst = true;
            const entries = Object.entries(obj);
            for (const [itemKey, itemValue] of entries) {
              if (itemValue === undefined) {
                continue;
              }
              yield `${isFirst ? "" : ","}\n${this._indent}${JSON.stringify(itemKey)}: `;
              yield* this._stringify(itemValue);
              isFirst = false;
            }
            this._indentLevel--;
            yield entries.length ? `\n${this._indent}}` : "}";
          }
        }
      }
      exports.StatsSerializeStream = StatsSerializeStream;
      exports.writeStats = writeStats;
      async function writeStats(stats, filepath) {
        return new Promise((resolve, reject) => {
          new StatsSerializeStream(stats)
            .on("end", resolve)
            .on("error", reject)
            .pipe(createWriteStream(filepath));
        });
      }
    },
    5713: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      const path = __nccwpck_require__(6928);
      const fs = __nccwpck_require__(9896);
      const { escape } = __nccwpck_require__(8214);
      const projectRoot = path.resolve(__dirname, "..");
      const assetsRoot = __nccwpck_require__.ab + "public";
      exports.renderViewer = renderViewer;
      function escapeJson(json) {
        return JSON.stringify(json).replace(/</gu, "\\u003c");
      }
      function getAssetContent(filename) {
        const assetPath = __nccwpck_require__.ab + "public/" + filename;
        if (!assetPath.startsWith(__nccwpck_require__.ab + "public")) {
          throw new Error(`"${filename}" is outside of the assets root`);
        }
        return fs.readFileSync(assetPath, "utf8");
      }
      function html(strings, ...values) {
        return strings
          .map((string, index) => `${string}${values[index] || ""}`)
          .join("");
      }
      function getScript(filename, mode) {
        if (mode === "static") {
          return `\x3c!-- ${escape(filename)} --\x3e\n<script>${getAssetContent(filename)}<\/script>`;
        } else {
          return `<script src="${escape(filename)}"><\/script>`;
        }
      }
      function renderViewer({
        title,
        enableWebSocket,
        chartData,
        entrypoints,
        defaultSizes,
        mode,
      } = {}) {
        return html`<!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
              />
              <title>${escape(title)}</title>
              <link
                rel="shortcut icon"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAABrVBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+O1foceMD///+J0/qK1Pr7/v8Xdr/9///W8P4UdL7L7P0Scr2r4Pyj3vwad8D5/f/2/f+55f3E6f34+/2H0/ojfMKpzOd0rNgQcb3F3O/j9f7c8v6g3Pz0/P/w+v/q+P7n9v6T1/uQ1vuE0vqLut/y+v+Z2fvt+f+15Pzv9fuc2/vR7v2V2Pvd6/bg9P7I6/285/2y4/yp3/zp8vk8i8kqgMT7/P31+fyv4vxGkcz6/P6/6P3j7vfS5PNnpNUxhcbO7f7F6v3O4vHK3/DA2u631Ouy0eqXweKJud5wqthfoNMMbLvY8f73+v2dxeR8sNtTmdDx9/zX6PSjyeaCtd1YnNGX2PuQveCGt95Nls42h8dLlM3F4vBtAAAAM3RSTlMAAyOx0/sKBvik8opWGBMOAe3l1snDm2E9LSb06eHcu5JpHbarfHZCN9CBb08zzkdNS0kYaptYAAAFV0lEQVRYw92X51/aYBDHHS2O2qqttVbrqNq9m+TJIAYIShBkWwqIiCgoWvfeq7Z2/s29hyQNyUcR7LveGwVyXy6XH8/9rqxglLfUPLxVduUor3h0rfp2TYvpivk37929TkG037hffoX0+peVtZQc1589rigVUdXS/ABSAyEmGIO/1XfvldSK8vs3OqB6u3m0nxmIrvgB0dj7rr7Y9IbuF68hnfFaiHA/sxqm0wciIG43P60qKv9WXWc1RXGh/mFESFABTSBi0sNAKzqet17eCtOb3kZIDwxEEU0oAIJGYxNBDhBND29e0rtXXbcpuPmED9IhEAAQ/AXEaF8EPmnrrKsv0LvWR3fg5sWDNAFZOgAgaKvZDogHNU9MFwnnYROkc56RD5CjAbQX9Ow4g7upCsvYu55aSI/Nj0H1akgKQEUM94dwK65hYRmFU9MIcH/fqJYOZYcnuJSU/waKDgTOEVaVKhwrTRP5XzgSpAITYzom7UvkhFX5VutmxeNnWDjjswTKTyfgluNDGbUpWissXhF3s7mlSml+czWkg3D0l1nNjGNjz3myOQOa1KM/jOS6ebdbAVTCi4gljHSFrviza7tOgRWcS0MOUX9zdNgag5w7rRqA44Lzw0hr1WqES36dFliSJFlh2rXIae3FFcDDgKdxrUIDePr8jGcSClV1u7A9xeN0ModY/pHMxmR1EzRh8TJiwqsHmKW0l4FCEZI+jHio+JdPPE9qwQtTRxku2D8sIeRL2LnxWSllANCQGOIiqVHAz2ye2JR0DcH+HoxDkaADLjgxjKQ+AwCX/g0+DNgdG0ukYCONAe+dbc2IAc6fwt1ARoDSezNHxV2Cmzwv3O6lDMV55edBGwGK9n1+x2F8EDfAGCxug8MhpsMEcTEAWf3rx2vZhe/LAmtIn/6apE6PN0ULKgywD9mmdxbmFl3OvD5AS5fW5zLbv/YHmcsBTjf/afDz3MaZTVCfAP9z6/Bw6ycv8EUBWJIn9zYcoAWWlW9+OzO3vkTy8H+RANLmdrpOuYWdZYEXpo+TlCJrW5EARb7fF+bWdqf3hhyZI1nWJQHgznErZhbjoEsWqi8dQNoE294aldzFurwSABL2XXMf9+H1VQGke9exw5P/AnA5Pv5ngMul7LOvO922iwACu8WkCwLCafvM4CeWPxfA8lNHcWZSoi8EwMAIciKX2Z4SWCMAa3snCZ/G4EA8D6CMLNFsGQhkkz/gQNEBbPCbWsxGUpYVu3z8IyNAknwJkfPMEhLyrdi5RTyUVACkw4GSFRNWJNEW+fgPGwHD8/JxnRuLabN4CGNRkAE23na2+VmEAUmrYymSGjMAYqH84YUIyzgzs3XC7gNgH36Vcc4zKY9o9fgPBXUAiHHwVboBHGLiX6Zcjp1f2wu4tvzZKo0ecPnDtQYDQvJXaBeNzce45Fp28ZQLrEZVuFqgBwOalArKXnW1UzlnSusQKJqKYNuz4tOnI6sZG4zanpemv+7ySU2jbA9h6uhcgpfy6G2PahirDZ6zvq6zDduMVFTKvzw8wgyEdelwY9in3XkEPs3osJuwRQ4qTkfzifndg9Gfc4pdsu82+tTnHZTBa2EAMrqr2t43pguc8tNm7JQVQ2S0ukj2d22dhXYP0/veWtwKrCkNoNimAN5+Xr/oLrxswKbVJjteWrX7eR63o4j9q0GxnaBdWgGA5VStpanIjQmEhV0/nVt5VOFUvix6awJhPcAaTEShgrG+iGyvb5a0Ndb1YGHFPEwoqAinoaykaID1o1pdPNu7XsnCKQ3R+hwWIIhGvORcJUBYXe3Xa3vq/mF/N9V13ugufMkfXn+KHsRD0B8AAAAASUVORK5CYII="
                type="image/x-icon"
              />

              <script>
                window.enableWebSocket = ${escapeJson(enableWebSocket)};
              </script>
              ${getScript("viewer.js", mode)}
            </head>

            <body>
              <div id="app"></div>
              <script>
                window.chartData = ${escapeJson(chartData)};
                window.entrypoints = ${escapeJson(entrypoints)};
                window.defaultSizes = ${escapeJson(defaultSizes)};
              </script>
            </body>
          </html>`;
      }
    },
    5943: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports["default"] = void 0;
      var _Node = _interopRequireDefault(__nccwpck_require__(5954));
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      class BaseFolder extends _Node.default {
        constructor(name, parent) {
          super(name, parent);
          this.children = Object.create(null);
        }
        get src() {
          if (!Object.prototype.hasOwnProperty.call(this, "_src")) {
            this._src = this.walk(
              (node, src) => (src += node.src || ""),
              "",
              false,
            );
          }
          return this._src;
        }
        get size() {
          if (!Object.prototype.hasOwnProperty.call(this, "_size")) {
            this._size = this.walk((node, size) => size + node.size, 0, false);
          }
          return this._size;
        }
        getChild(name) {
          return this.children[name];
        }
        addChildModule(module) {
          const { name } = module;
          const currentChild = this.children[name];
          if (currentChild && currentChild instanceof BaseFolder) return;
          if (currentChild) {
            currentChild.mergeData(module.data);
          } else {
            module.parent = this;
            this.children[name] = module;
          }
          delete this._size;
          delete this._src;
        }
        addChildFolder(folder) {
          folder.parent = this;
          this.children[folder.name] = folder;
          delete this._size;
          delete this._src;
          return folder;
        }
        walk(walker, state = {}, deep = true) {
          let stopped = false;
          Object.values(this.children).forEach((child) => {
            if (deep && child.walk) {
              state = child.walk(walker, state, stop);
            } else {
              state = walker(child, state, stop);
            }
            if (stopped) return false;
          });
          return state;
          function stop(finalState) {
            stopped = true;
            return finalState;
          }
        }
        mergeNestedFolders() {
          if (!this.isRoot) {
            let childNames;
            while ((childNames = Object.keys(this.children)).length === 1) {
              const childName = childNames[0];
              const onlyChild = this.children[childName];
              if (onlyChild instanceof this.constructor) {
                this.name += `/${onlyChild.name}`;
                this.children = onlyChild.children;
              } else {
                break;
              }
            }
          }
          this.walk(
            (child) => {
              child.parent = this;
              if (child.mergeNestedFolders) {
                child.mergeNestedFolders();
              }
            },
            null,
            false,
          );
        }
        toChartData() {
          return {
            label: this.name,
            path: this.path,
            statSize: this.size,
            groups: Object.values(this.children).map((child) =>
              child.toChartData(),
            ),
          };
        }
      }
      exports["default"] = BaseFolder;
    },
    6217: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports["default"] = void 0;
      var _Module = _interopRequireDefault(__nccwpck_require__(3186));
      var _ContentModule = _interopRequireDefault(__nccwpck_require__(4749));
      var _ContentFolder = _interopRequireDefault(__nccwpck_require__(2305));
      var _utils = __nccwpck_require__(2109);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      class ConcatenatedModule extends _Module.default {
        constructor(name, data, parent) {
          super(name, data, parent);
          this.name += " (concatenated)";
          this.children = Object.create(null);
          this.fillContentModules();
        }
        get parsedSize() {
          var _this$getParsedSize;
          return (_this$getParsedSize = this.getParsedSize()) !== null &&
            _this$getParsedSize !== void 0
            ? _this$getParsedSize
            : this.getEstimatedSize("parsedSize");
        }
        get gzipSize() {
          var _this$getGzipSize;
          return (_this$getGzipSize = this.getGzipSize()) !== null &&
            _this$getGzipSize !== void 0
            ? _this$getGzipSize
            : this.getEstimatedSize("gzipSize");
        }
        getEstimatedSize(sizeType) {
          const parentModuleSize = this.parent[sizeType];
          if (parentModuleSize !== undefined) {
            return Math.floor(
              (this.size / this.parent.size) * parentModuleSize,
            );
          }
        }
        fillContentModules() {
          this.data.modules.forEach((moduleData) =>
            this.addContentModule(moduleData),
          );
        }
        addContentModule(moduleData) {
          const pathParts = (0, _utils.getModulePathParts)(moduleData);
          if (!pathParts) {
            return;
          }
          const [folders, fileName] = [
            pathParts.slice(0, -1),
            pathParts[pathParts.length - 1],
          ];
          let currentFolder = this;
          folders.forEach((folderName) => {
            let childFolder = currentFolder.getChild(folderName);
            if (!childFolder) {
              childFolder = currentFolder.addChildFolder(
                new _ContentFolder.default(folderName, this),
              );
            }
            currentFolder = childFolder;
          });
          const ModuleConstructor = moduleData.modules
            ? ConcatenatedModule
            : _ContentModule.default;
          const module = new ModuleConstructor(fileName, moduleData, this);
          currentFolder.addChildModule(module);
        }
        getChild(name) {
          return this.children[name];
        }
        addChildModule(module) {
          module.parent = this;
          this.children[module.name] = module;
        }
        addChildFolder(folder) {
          folder.parent = this;
          this.children[folder.name] = folder;
          return folder;
        }
        mergeNestedFolders() {
          Object.values(this.children).forEach((child) => {
            if (child.mergeNestedFolders) {
              child.mergeNestedFolders();
            }
          });
        }
        toChartData() {
          return {
            ...super.toChartData(),
            concatenated: true,
            groups: Object.values(this.children).map((child) =>
              child.toChartData(),
            ),
          };
        }
      }
      exports["default"] = ConcatenatedModule;
    },
    2305: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports["default"] = void 0;
      var _BaseFolder = _interopRequireDefault(__nccwpck_require__(5943));
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      class ContentFolder extends _BaseFolder.default {
        constructor(name, ownerModule, parent) {
          super(name, parent);
          this.ownerModule = ownerModule;
        }
        get parsedSize() {
          return this.getSize("parsedSize");
        }
        get gzipSize() {
          return this.getSize("gzipSize");
        }
        getSize(sizeType) {
          const ownerModuleSize = this.ownerModule[sizeType];
          if (ownerModuleSize !== undefined) {
            return Math.floor(
              (this.size / this.ownerModule.size) * ownerModuleSize,
            );
          }
        }
        toChartData() {
          return {
            ...super.toChartData(),
            parsedSize: this.parsedSize,
            gzipSize: this.gzipSize,
            inaccurateSizes: true,
          };
        }
      }
      exports["default"] = ContentFolder;
    },
    4749: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports["default"] = void 0;
      var _Module = _interopRequireDefault(__nccwpck_require__(3186));
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      class ContentModule extends _Module.default {
        constructor(name, data, ownerModule, parent) {
          super(name, data, parent);
          this.ownerModule = ownerModule;
        }
        get parsedSize() {
          return this.getSize("parsedSize");
        }
        get gzipSize() {
          return this.getSize("gzipSize");
        }
        getSize(sizeType) {
          const ownerModuleSize = this.ownerModule[sizeType];
          if (ownerModuleSize !== undefined) {
            return Math.floor(
              (this.size / this.ownerModule.size) * ownerModuleSize,
            );
          }
        }
        toChartData() {
          return { ...super.toChartData(), inaccurateSizes: true };
        }
      }
      exports["default"] = ContentModule;
    },
    5266: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      var __webpack_unused_export__;
      __webpack_unused_export__ = { value: true };
      exports.A = void 0;
      var _gzipSize = _interopRequireDefault(__nccwpck_require__(3520));
      var _Module = _interopRequireDefault(__nccwpck_require__(3186));
      var _BaseFolder = _interopRequireDefault(__nccwpck_require__(5943));
      var _ConcatenatedModule = _interopRequireDefault(
        __nccwpck_require__(6217),
      );
      var _utils = __nccwpck_require__(2109);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      class Folder extends _BaseFolder.default {
        get parsedSize() {
          return this.src ? this.src.length : 0;
        }
        get gzipSize() {
          if (!Object.prototype.hasOwnProperty.call(this, "_gzipSize")) {
            this._gzipSize = this.src ? _gzipSize.default.sync(this.src) : 0;
          }
          return this._gzipSize;
        }
        addModule(moduleData) {
          const pathParts = (0, _utils.getModulePathParts)(moduleData);
          if (!pathParts) {
            return;
          }
          const [folders, fileName] = [
            pathParts.slice(0, -1),
            pathParts[pathParts.length - 1],
          ];
          let currentFolder = this;
          folders.forEach((folderName) => {
            let childNode = currentFolder.getChild(folderName);
            if (!childNode || !(childNode instanceof Folder)) {
              childNode = currentFolder.addChildFolder(new Folder(folderName));
            }
            currentFolder = childNode;
          });
          const ModuleConstructor = moduleData.modules
            ? _ConcatenatedModule.default
            : _Module.default;
          const module = new ModuleConstructor(fileName, moduleData, this);
          currentFolder.addChildModule(module);
        }
        toChartData() {
          return {
            ...super.toChartData(),
            parsedSize: this.parsedSize,
            gzipSize: this.gzipSize,
          };
        }
      }
      exports.A = Folder;
    },
    3186: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports["default"] = void 0;
      var _gzipSize = _interopRequireDefault(__nccwpck_require__(3520));
      var _Node = _interopRequireDefault(__nccwpck_require__(5954));
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      class Module extends _Node.default {
        constructor(name, data, parent) {
          super(name, parent);
          this.data = data;
        }
        get src() {
          return this.data.parsedSrc;
        }
        set src(value) {
          this.data.parsedSrc = value;
          delete this._gzipSize;
        }
        get size() {
          return this.data.size;
        }
        set size(value) {
          this.data.size = value;
        }
        get parsedSize() {
          return this.getParsedSize();
        }
        get gzipSize() {
          return this.getGzipSize();
        }
        getParsedSize() {
          return this.src ? this.src.length : undefined;
        }
        getGzipSize() {
          if (!("_gzipSize" in this)) {
            this._gzipSize = this.src
              ? _gzipSize.default.sync(this.src)
              : undefined;
          }
          return this._gzipSize;
        }
        mergeData(data) {
          if (data.size) {
            this.size += data.size;
          }
          if (data.parsedSrc) {
            this.src = (this.src || "") + data.parsedSrc;
          }
        }
        toChartData() {
          return {
            id: this.data.id,
            label: this.name,
            path: this.path,
            statSize: this.size,
            parsedSize: this.parsedSize,
            gzipSize: this.gzipSize,
          };
        }
      }
      exports["default"] = Module;
    },
    5954: (__unused_webpack_module, exports) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports["default"] = void 0;
      class Node {
        constructor(name, parent) {
          this.name = name;
          this.parent = parent;
        }
        get path() {
          const path = [];
          let node = this;
          while (node) {
            path.push(node.name);
            node = node.parent;
          }
          return path.reverse().join("/");
        }
        get isRoot() {
          return !this.parent;
        }
      }
      exports["default"] = Node;
    },
    2109: (__unused_webpack_module, exports) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.getModulePathParts = getModulePathParts;
      const MULTI_MODULE_REGEXP = /^multi /u;
      function getModulePathParts(moduleData) {
        if (MULTI_MODULE_REGEXP.test(moduleData.identifier)) {
          return [moduleData.identifier];
        }
        const loaders = moduleData.name.split("!");
        const parsedPath = loaders[loaders.length - 1]
          .split("/")
          .slice(1)
          .map((part) => (part === "~" ? "node_modules" : part));
        return parsedPath.length ? parsedPath : null;
      }
    },
    3762: (__unused_webpack_module, exports, __nccwpck_require__) => {
      "use strict";
      const { inspect, types } = __nccwpck_require__(9023);
      const opener = __nccwpck_require__(8565);
      const MONTHS = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      exports.createAssetsFilter = createAssetsFilter;
      function createAssetsFilter(excludePatterns) {
        const excludeFunctions = (
          Array.isArray(excludePatterns) ? excludePatterns : [excludePatterns]
        )
          .filter(Boolean)
          .map((pattern) => {
            if (typeof pattern === "string") {
              pattern = new RegExp(pattern, "u");
            }
            if (types.isRegExp(pattern)) {
              return (asset) => pattern.test(asset);
            }
            if (typeof pattern !== "function") {
              throw new TypeError(
                `Pattern should be either string, RegExp or a function, but "${inspect(pattern, { depth: 0 })}" got.`,
              );
            }
            return pattern;
          });
        if (excludeFunctions.length) {
          return (asset) => excludeFunctions.every((fn) => fn(asset) !== true);
        } else {
          return () => true;
        }
      }
      exports.defaultTitle = function () {
        const time = new Date();
        const year = time.getFullYear();
        const month = MONTHS[time.getMonth()];
        const day = time.getDate();
        const hour = `0${time.getHours()}`.slice(-2);
        const minute = `0${time.getMinutes()}`.slice(-2);
        const currentTime = `${day} ${month} ${year} at ${hour}:${minute}`;
        return `${process.env.npm_package_name || "Webpack Bundle Analyzer"} [${currentTime}]`;
      };
      exports.defaultAnalyzerUrl = function (options) {
        const { listenHost, boundAddress } = options;
        return `http://${listenHost}:${boundAddress.port}`;
      };
      exports.open = function (uri, logger) {
        try {
          opener(uri);
        } catch (err) {
          logger.debug(`Opener failed to open "${uri}":\n${err}`);
        }
      };
    },
    2257: (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      const path = __nccwpck_require__(6928);
      const fs = __nccwpck_require__(9896);
      const http = __nccwpck_require__(8611);
      const WebSocket = __nccwpck_require__(9073);
      const sirv = __nccwpck_require__(6008);
      const { bold } = __nccwpck_require__(9456);
      const Logger = __nccwpck_require__(7087);
      const analyzer = __nccwpck_require__(5433);
      const { open } = __nccwpck_require__(3762);
      const { renderViewer } = __nccwpck_require__(5713);
      const projectRoot = path.resolve(__dirname, "..");
      function resolveTitle(reportTitle) {
        if (typeof reportTitle === "function") {
          return reportTitle();
        } else {
          return reportTitle;
        }
      }
      module.exports = {
        startServer,
        generateReport,
        generateJSONReport,
        getEntrypoints,
        start: startServer,
      };
      async function startServer(bundleStats, opts) {
        const {
          port = 8888,
          host = "127.0.0.1",
          openBrowser = true,
          bundleDir = null,
          logger = new Logger(),
          defaultSizes = "parsed",
          excludeAssets = null,
          reportTitle,
          analyzerUrl,
        } = opts || {};
        const analyzerOpts = { logger, excludeAssets };
        let chartData = getChartData(analyzerOpts, bundleStats, bundleDir);
        const entrypoints = getEntrypoints(bundleStats);
        if (!chartData) return;
        const sirvMiddleware = sirv(__nccwpck_require__.ab + "public", {
          dev: true,
        });
        const server = http.createServer((req, res) => {
          if (req.method === "GET" && req.url === "/") {
            const html = renderViewer({
              mode: "server",
              title: resolveTitle(reportTitle),
              chartData,
              entrypoints,
              defaultSizes,
              enableWebSocket: true,
            });
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
          } else {
            sirvMiddleware(req, res);
          }
        });
        await new Promise((resolve) => {
          server.listen(port, host, () => {
            resolve();
            const url = analyzerUrl({
              listenPort: port,
              listenHost: host,
              boundAddress: server.address(),
            });
            logger.info(
              `${bold("Webpack Bundle Analyzer")} is started at ${bold(url)}\n` +
                `Use ${bold("Ctrl+C")} to close it`,
            );
            if (openBrowser) {
              open(url, logger);
            }
          });
        });
        const wss = new WebSocket.Server({ server });
        wss.on("connection", (ws) => {
          ws.on("error", (err) => {
            if (err.errno) return;
            logger.info(err.message);
          });
        });
        return { ws: wss, http: server, updateChartData };
        function updateChartData(bundleStats) {
          const newChartData = getChartData(
            analyzerOpts,
            bundleStats,
            bundleDir,
          );
          if (!newChartData) return;
          chartData = newChartData;
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  event: "chartDataUpdated",
                  data: newChartData,
                }),
              );
            }
          });
        }
      }
      async function generateReport(bundleStats, opts) {
        const {
          openBrowser = true,
          reportFilename,
          reportTitle,
          bundleDir = null,
          logger = new Logger(),
          defaultSizes = "parsed",
          excludeAssets = null,
        } = opts || {};
        const chartData = getChartData(
          { logger, excludeAssets },
          bundleStats,
          bundleDir,
        );
        const entrypoints = getEntrypoints(bundleStats);
        if (!chartData) return;
        const reportHtml = renderViewer({
          mode: "static",
          title: resolveTitle(reportTitle),
          chartData,
          entrypoints,
          defaultSizes,
          enableWebSocket: false,
        });
        const reportFilepath = path.resolve(
          bundleDir || process.cwd(),
          reportFilename,
        );
        fs.mkdirSync(path.dirname(reportFilepath), { recursive: true });
        fs.writeFileSync(reportFilepath, reportHtml);
        logger.info(
          `${bold("Webpack Bundle Analyzer")} saved report to ${bold(reportFilepath)}`,
        );
        if (openBrowser) {
          open(`file://${reportFilepath}`, logger);
        }
      }
      async function generateJSONReport(bundleStats, opts) {
        const {
          reportFilename,
          bundleDir = null,
          logger = new Logger(),
          excludeAssets = null,
        } = opts || {};
        const chartData = getChartData(
          { logger, excludeAssets },
          bundleStats,
          bundleDir,
        );
        if (!chartData) return;
        await fs.promises.mkdir(path.dirname(reportFilename), {
          recursive: true,
        });
        await fs.promises.writeFile(reportFilename, JSON.stringify(chartData));
        logger.info(
          `${bold("Webpack Bundle Analyzer")} saved JSON report to ${bold(reportFilename)}`,
        );
      }
      function getChartData(analyzerOpts, ...args) {
        let chartData;
        const { logger } = analyzerOpts;
        try {
          chartData = analyzer.getViewerData(...args, analyzerOpts);
        } catch (err) {
          logger.error(`Could't analyze webpack bundle:\n${err}`);
          logger.debug(err.stack);
          chartData = null;
        }
        if (chartData && !Array.isArray(chartData)) {
          logger.error(
            "Could't find any javascript bundles in provided stats file",
          );
          chartData = null;
        }
        return chartData;
      }
      function getEntrypoints(bundleStats) {
        if (
          bundleStats === null ||
          bundleStats === undefined ||
          !bundleStats.entrypoints
        ) {
          return [];
        }
        return Object.values(bundleStats.entrypoints).map(
          (entrypoint) => entrypoint.name,
        );
      }
    },
    9073: (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      const WebSocket = __nccwpck_require__(6958);
      WebSocket.createWebSocketStream = __nccwpck_require__(4605);
      WebSocket.Server = __nccwpck_require__(4536);
      WebSocket.Receiver = __nccwpck_require__(8804);
      WebSocket.Sender = __nccwpck_require__(2716);
      module.exports = WebSocket;
    },
    1412: (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      const { EMPTY_BUFFER } = __nccwpck_require__(1168);
      function concat(list, totalLength) {
        if (list.length === 0) return EMPTY_BUFFER;
        if (list.length === 1) return list[0];
        const target = Buffer.allocUnsafe(totalLength);
        let offset = 0;
        for (let i = 0; i < list.length; i++) {
          const buf = list[i];
          target.set(buf, offset);
          offset += buf.length;
        }
        if (offset < totalLength) return target.slice(0, offset);
        return target;
      }
      function _mask(source, mask, output, offset, length) {
        for (let i = 0; i < length; i++) {
          output[offset + i] = source[i] ^ mask[i & 3];
        }
      }
      function _unmask(buffer, mask) {
        const length = buffer.length;
        for (let i = 0; i < length; i++) {
          buffer[i] ^= mask[i & 3];
        }
      }
      function toArrayBuffer(buf) {
        if (buf.byteLength === buf.buffer.byteLength) {
          return buf.buffer;
        }
        return buf.buffer.slice(
          buf.byteOffset,
          buf.byteOffset + buf.byteLength,
        );
      }
      function toBuffer(data) {
        toBuffer.readOnly = true;
        if (Buffer.isBuffer(data)) return data;
        let buf;
        if (data instanceof ArrayBuffer) {
          buf = Buffer.from(data);
        } else if (ArrayBuffer.isView(data)) {
          buf = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
        } else {
          buf = Buffer.from(data);
          toBuffer.readOnly = false;
        }
        return buf;
      }
      try {
        const bufferUtil = __nccwpck_require__(1098);
        const bu = bufferUtil.BufferUtil || bufferUtil;
        module.exports = {
          concat,
          mask(source, mask, output, offset, length) {
            if (length < 48) _mask(source, mask, output, offset, length);
            else bu.mask(source, mask, output, offset, length);
          },
          toArrayBuffer,
          toBuffer,
          unmask(buffer, mask) {
            if (buffer.length < 32) _unmask(buffer, mask);
            else bu.unmask(buffer, mask);
          },
        };
      } catch (e) {
        module.exports = {
          concat,
          mask: _mask,
          toArrayBuffer,
          toBuffer,
          unmask: _unmask,
        };
      }
    },
    1168: (module) => {
      "use strict";
      module.exports = {
        BINARY_TYPES: ["nodebuffer", "arraybuffer", "fragments"],
        GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
        kStatusCode: Symbol("status-code"),
        kWebSocket: Symbol("websocket"),
        EMPTY_BUFFER: Buffer.alloc(0),
        NOOP: () => {},
      };
    },
    2827: (module) => {
      "use strict";
      class Event {
        constructor(type, target) {
          this.target = target;
          this.type = type;
        }
      }
      class MessageEvent extends Event {
        constructor(data, target) {
          super("message", target);
          this.data = data;
        }
      }
      class CloseEvent extends Event {
        constructor(code, reason, target) {
          super("close", target);
          this.wasClean = target._closeFrameReceived && target._closeFrameSent;
          this.reason = reason;
          this.code = code;
        }
      }
      class OpenEvent extends Event {
        constructor(target) {
          super("open", target);
        }
      }
      class ErrorEvent extends Event {
        constructor(error, target) {
          super("error", target);
          this.message = error.message;
          this.error = error;
        }
      }
      const EventTarget = {
        addEventListener(type, listener, options) {
          if (typeof listener !== "function") return;
          function onMessage(data) {
            listener.call(this, new MessageEvent(data, this));
          }
          function onClose(code, message) {
            listener.call(this, new CloseEvent(code, message, this));
          }
          function onError(error) {
            listener.call(this, new ErrorEvent(error, this));
          }
          function onOpen() {
            listener.call(this, new OpenEvent(this));
          }
          const method = options && options.once ? "once" : "on";
          if (type === "message") {
            onMessage._listener = listener;
            this[method](type, onMessage);
          } else if (type === "close") {
            onClose._listener = listener;
            this[method](type, onClose);
          } else if (type === "error") {
            onError._listener = listener;
            this[method](type, onError);
          } else if (type === "open") {
            onOpen._listener = listener;
            this[method](type, onOpen);
          } else {
            this[method](type, listener);
          }
        },
        removeEventListener(type, listener) {
          const listeners = this.listeners(type);
          for (let i = 0; i < listeners.length; i++) {
            if (
              listeners[i] === listener ||
              listeners[i]._listener === listener
            ) {
              this.removeListener(type, listeners[i]);
            }
          }
        },
      };
      module.exports = EventTarget;
    },
    5496: (module) => {
      "use strict";
      const tokenChars = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 0, 1, 0, 1, 0,
      ];
      function push(dest, name, elem) {
        if (dest[name] === undefined) dest[name] = [elem];
        else dest[name].push(elem);
      }
      function parse(header) {
        const offers = Object.create(null);
        if (header === undefined || header === "") return offers;
        let params = Object.create(null);
        let mustUnescape = false;
        let isEscaping = false;
        let inQuotes = false;
        let extensionName;
        let paramName;
        let start = -1;
        let end = -1;
        let i = 0;
        for (; i < header.length; i++) {
          const code = header.charCodeAt(i);
          if (extensionName === undefined) {
            if (end === -1 && tokenChars[code] === 1) {
              if (start === -1) start = i;
            } else if (code === 32 || code === 9) {
              if (end === -1 && start !== -1) end = i;
            } else if (code === 59 || code === 44) {
              if (start === -1) {
                throw new SyntaxError(`Unexpected character at index ${i}`);
              }
              if (end === -1) end = i;
              const name = header.slice(start, end);
              if (code === 44) {
                push(offers, name, params);
                params = Object.create(null);
              } else {
                extensionName = name;
              }
              start = end = -1;
            } else {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
          } else if (paramName === undefined) {
            if (end === -1 && tokenChars[code] === 1) {
              if (start === -1) start = i;
            } else if (code === 32 || code === 9) {
              if (end === -1 && start !== -1) end = i;
            } else if (code === 59 || code === 44) {
              if (start === -1) {
                throw new SyntaxError(`Unexpected character at index ${i}`);
              }
              if (end === -1) end = i;
              push(params, header.slice(start, end), true);
              if (code === 44) {
                push(offers, extensionName, params);
                params = Object.create(null);
                extensionName = undefined;
              }
              start = end = -1;
            } else if (code === 61 && start !== -1 && end === -1) {
              paramName = header.slice(start, i);
              start = end = -1;
            } else {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
          } else {
            if (isEscaping) {
              if (tokenChars[code] !== 1) {
                throw new SyntaxError(`Unexpected character at index ${i}`);
              }
              if (start === -1) start = i;
              else if (!mustUnescape) mustUnescape = true;
              isEscaping = false;
            } else if (inQuotes) {
              if (tokenChars[code] === 1) {
                if (start === -1) start = i;
              } else if (code === 34 && start !== -1) {
                inQuotes = false;
                end = i;
              } else if (code === 92) {
                isEscaping = true;
              } else {
                throw new SyntaxError(`Unexpected character at index ${i}`);
              }
            } else if (code === 34 && header.charCodeAt(i - 1) === 61) {
              inQuotes = true;
            } else if (end === -1 && tokenChars[code] === 1) {
              if (start === -1) start = i;
            } else if (start !== -1 && (code === 32 || code === 9)) {
              if (end === -1) end = i;
            } else if (code === 59 || code === 44) {
              if (start === -1) {
                throw new SyntaxError(`Unexpected character at index ${i}`);
              }
              if (end === -1) end = i;
              let value = header.slice(start, end);
              if (mustUnescape) {
                value = value.replace(/\\/g, "");
                mustUnescape = false;
              }
              push(params, paramName, value);
              if (code === 44) {
                push(offers, extensionName, params);
                params = Object.create(null);
                extensionName = undefined;
              }
              paramName = undefined;
              start = end = -1;
            } else {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
          }
        }
        if (start === -1 || inQuotes) {
          throw new SyntaxError("Unexpected end of input");
        }
        if (end === -1) end = i;
        const token = header.slice(start, end);
        if (extensionName === undefined) {
          push(offers, token, params);
        } else {
          if (paramName === undefined) {
            push(params, token, true);
          } else if (mustUnescape) {
            push(params, paramName, token.replace(/\\/g, ""));
          } else {
            push(params, paramName, token);
          }
          push(offers, extensionName, params);
        }
        return offers;
      }
      function format(extensions) {
        return Object.keys(extensions)
          .map((extension) => {
            let configurations = extensions[extension];
            if (!Array.isArray(configurations))
              configurations = [configurations];
            return configurations
              .map((params) =>
                [extension]
                  .concat(
                    Object.keys(params).map((k) => {
                      let values = params[k];
                      if (!Array.isArray(values)) values = [values];
                      return values
                        .map((v) => (v === true ? k : `${k}=${v}`))
                        .join("; ");
                    }),
                  )
                  .join("; "),
              )
              .join(", ");
          })
          .join(", ");
      }
      module.exports = { format, parse };
    },
    77: (module) => {
      "use strict";
      const kDone = Symbol("kDone");
      const kRun = Symbol("kRun");
      class Limiter {
        constructor(concurrency) {
          this[kDone] = () => {
            this.pending--;
            this[kRun]();
          };
          this.concurrency = concurrency || Infinity;
          this.jobs = [];
          this.pending = 0;
        }
        add(job) {
          this.jobs.push(job);
          this[kRun]();
        }
        [kRun]() {
          if (this.pending === this.concurrency) return;
          if (this.jobs.length) {
            const job = this.jobs.shift();
            this.pending++;
            job(this[kDone]);
          }
        }
      }
      module.exports = Limiter;
    },
    4989: (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      const zlib = __nccwpck_require__(3106);
      const bufferUtil = __nccwpck_require__(1412);
      const Limiter = __nccwpck_require__(77);
      const { kStatusCode, NOOP } = __nccwpck_require__(1168);
      const TRAILER = Buffer.from([0, 0, 255, 255]);
      const kPerMessageDeflate = Symbol("permessage-deflate");
      const kTotalLength = Symbol("total-length");
      const kCallback = Symbol("callback");
      const kBuffers = Symbol("buffers");
      const kError = Symbol("error");
      let zlibLimiter;
      class PerMessageDeflate {
        constructor(options, isServer, maxPayload) {
          this._maxPayload = maxPayload | 0;
          this._options = options || {};
          this._threshold =
            this._options.threshold !== undefined
              ? this._options.threshold
              : 1024;
          this._isServer = !!isServer;
          this._deflate = null;
          this._inflate = null;
          this.params = null;
          if (!zlibLimiter) {
            const concurrency =
              this._options.concurrencyLimit !== undefined
                ? this._options.concurrencyLimit
                : 10;
            zlibLimiter = new Limiter(concurrency);
          }
        }
        static get extensionName() {
          return "permessage-deflate";
        }
        offer() {
          const params = {};
          if (this._options.serverNoContextTakeover) {
            params.server_no_context_takeover = true;
          }
          if (this._options.clientNoContextTakeover) {
            params.client_no_context_takeover = true;
          }
          if (this._options.serverMaxWindowBits) {
            params.server_max_window_bits = this._options.serverMaxWindowBits;
          }
          if (this._options.clientMaxWindowBits) {
            params.client_max_window_bits = this._options.clientMaxWindowBits;
          } else if (this._options.clientMaxWindowBits == null) {
            params.client_max_window_bits = true;
          }
          return params;
        }
        accept(configurations) {
          configurations = this.normalizeParams(configurations);
          this.params = this._isServer
            ? this.acceptAsServer(configurations)
            : this.acceptAsClient(configurations);
          return this.params;
        }
        cleanup() {
          if (this._inflate) {
            this._inflate.close();
            this._inflate = null;
          }
          if (this._deflate) {
            const callback = this._deflate[kCallback];
            this._deflate.close();
            this._deflate = null;
            if (callback) {
              callback(
                new Error(
                  "The deflate stream was closed while data was being processed",
                ),
              );
            }
          }
        }
        acceptAsServer(offers) {
          const opts = this._options;
          const accepted = offers.find((params) => {
            if (
              (opts.serverNoContextTakeover === false &&
                params.server_no_context_takeover) ||
              (params.server_max_window_bits &&
                (opts.serverMaxWindowBits === false ||
                  (typeof opts.serverMaxWindowBits === "number" &&
                    opts.serverMaxWindowBits >
                      params.server_max_window_bits))) ||
              (typeof opts.clientMaxWindowBits === "number" &&
                !params.client_max_window_bits)
            ) {
              return false;
            }
            return true;
          });
          if (!accepted) {
            throw new Error("None of the extension offers can be accepted");
          }
          if (opts.serverNoContextTakeover) {
            accepted.server_no_context_takeover = true;
          }
          if (opts.clientNoContextTakeover) {
            accepted.client_no_context_takeover = true;
          }
          if (typeof opts.serverMaxWindowBits === "number") {
            accepted.server_max_window_bits = opts.serverMaxWindowBits;
          }
          if (typeof opts.clientMaxWindowBits === "number") {
            accepted.client_max_window_bits = opts.clientMaxWindowBits;
          } else if (
            accepted.client_max_window_bits === true ||
            opts.clientMaxWindowBits === false
          ) {
            delete accepted.client_max_window_bits;
          }
          return accepted;
        }
        acceptAsClient(response) {
          const params = response[0];
          if (
            this._options.clientNoContextTakeover === false &&
            params.client_no_context_takeover
          ) {
            throw new Error(
              'Unexpected parameter "client_no_context_takeover"',
            );
          }
          if (!params.client_max_window_bits) {
            if (typeof this._options.clientMaxWindowBits === "number") {
              params.client_max_window_bits = this._options.clientMaxWindowBits;
            }
          } else if (
            this._options.clientMaxWindowBits === false ||
            (typeof this._options.clientMaxWindowBits === "number" &&
              params.client_max_window_bits > this._options.clientMaxWindowBits)
          ) {
            throw new Error(
              'Unexpected or invalid parameter "client_max_window_bits"',
            );
          }
          return params;
        }
        normalizeParams(configurations) {
          configurations.forEach((params) => {
            Object.keys(params).forEach((key) => {
              let value = params[key];
              if (value.length > 1) {
                throw new Error(
                  `Parameter "${key}" must have only a single value`,
                );
              }
              value = value[0];
              if (key === "client_max_window_bits") {
                if (value !== true) {
                  const num = +value;
                  if (!Number.isInteger(num) || num < 8 || num > 15) {
                    throw new TypeError(
                      `Invalid value for parameter "${key}": ${value}`,
                    );
                  }
                  value = num;
                } else if (!this._isServer) {
                  throw new TypeError(
                    `Invalid value for parameter "${key}": ${value}`,
                  );
                }
              } else if (key === "server_max_window_bits") {
                const num = +value;
                if (!Number.isInteger(num) || num < 8 || num > 15) {
                  throw new TypeError(
                    `Invalid value for parameter "${key}": ${value}`,
                  );
                }
                value = num;
              } else if (
                key === "client_no_context_takeover" ||
                key === "server_no_context_takeover"
              ) {
                if (value !== true) {
                  throw new TypeError(
                    `Invalid value for parameter "${key}": ${value}`,
                  );
                }
              } else {
                throw new Error(`Unknown parameter "${key}"`);
              }
              params[key] = value;
            });
          });
          return configurations;
        }
        decompress(data, fin, callback) {
          zlibLimiter.add((done) => {
            this._decompress(data, fin, (err, result) => {
              done();
              callback(err, result);
            });
          });
        }
        compress(data, fin, callback) {
          zlibLimiter.add((done) => {
            this._compress(data, fin, (err, result) => {
              done();
              callback(err, result);
            });
          });
        }
        _decompress(data, fin, callback) {
          const endpoint = this._isServer ? "client" : "server";
          if (!this._inflate) {
            const key = `${endpoint}_max_window_bits`;
            const windowBits =
              typeof this.params[key] !== "number"
                ? zlib.Z_DEFAULT_WINDOWBITS
                : this.params[key];
            this._inflate = zlib.createInflateRaw({
              ...this._options.zlibInflateOptions,
              windowBits,
            });
            this._inflate[kPerMessageDeflate] = this;
            this._inflate[kTotalLength] = 0;
            this._inflate[kBuffers] = [];
            this._inflate.on("error", inflateOnError);
            this._inflate.on("data", inflateOnData);
          }
          this._inflate[kCallback] = callback;
          this._inflate.write(data);
          if (fin) this._inflate.write(TRAILER);
          this._inflate.flush(() => {
            const err = this._inflate[kError];
            if (err) {
              this._inflate.close();
              this._inflate = null;
              callback(err);
              return;
            }
            const data = bufferUtil.concat(
              this._inflate[kBuffers],
              this._inflate[kTotalLength],
            );
            if (this._inflate._readableState.endEmitted) {
              this._inflate.close();
              this._inflate = null;
            } else {
              this._inflate[kTotalLength] = 0;
              this._inflate[kBuffers] = [];
              if (fin && this.params[`${endpoint}_no_context_takeover`]) {
                this._inflate.reset();
              }
            }
            callback(null, data);
          });
        }
        _compress(data, fin, callback) {
          const endpoint = this._isServer ? "server" : "client";
          if (!this._deflate) {
            const key = `${endpoint}_max_window_bits`;
            const windowBits =
              typeof this.params[key] !== "number"
                ? zlib.Z_DEFAULT_WINDOWBITS
                : this.params[key];
            this._deflate = zlib.createDeflateRaw({
              ...this._options.zlibDeflateOptions,
              windowBits,
            });
            this._deflate[kTotalLength] = 0;
            this._deflate[kBuffers] = [];
            this._deflate.on("error", NOOP);
            this._deflate.on("data", deflateOnData);
          }
          this._deflate[kCallback] = callback;
          this._deflate.write(data);
          this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
            if (!this._deflate) {
              return;
            }
            let data = bufferUtil.concat(
              this._deflate[kBuffers],
              this._deflate[kTotalLength],
            );
            if (fin) data = data.slice(0, data.length - 4);
            this._deflate[kCallback] = null;
            this._deflate[kTotalLength] = 0;
            this._deflate[kBuffers] = [];
            if (fin && this.params[`${endpoint}_no_context_takeover`]) {
              this._deflate.reset();
            }
            callback(null, data);
          });
        }
      }
      module.exports = PerMessageDeflate;
      function deflateOnData(chunk) {
        this[kBuffers].push(chunk);
        this[kTotalLength] += chunk.length;
      }
      function inflateOnData(chunk) {
        this[kTotalLength] += chunk.length;
        if (
          this[kPerMessageDeflate]._maxPayload < 1 ||
          this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload
        ) {
          this[kBuffers].push(chunk);
          return;
        }
        this[kError] = new RangeError("Max payload size exceeded");
        this[kError].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH";
        this[kError][kStatusCode] = 1009;
        this.removeListener("data", inflateOnData);
        this.reset();
      }
      function inflateOnError(err) {
        this[kPerMessageDeflate]._inflate = null;
        err[kStatusCode] = 1007;
        this[kCallback](err);
      }
    },
    8804: (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      const { Writable } = __nccwpck_require__(2203);
      const PerMessageDeflate = __nccwpck_require__(4989);
      const { BINARY_TYPES, EMPTY_BUFFER, kStatusCode, kWebSocket } =
        __nccwpck_require__(1168);
      const { concat, toArrayBuffer, unmask } = __nccwpck_require__(1412);
      const { isValidStatusCode, isValidUTF8 } = __nccwpck_require__(9506);
      const GET_INFO = 0;
      const GET_PAYLOAD_LENGTH_16 = 1;
      const GET_PAYLOAD_LENGTH_64 = 2;
      const GET_MASK = 3;
      const GET_DATA = 4;
      const INFLATING = 5;
      class Receiver extends Writable {
        constructor(binaryType, extensions, isServer, maxPayload) {
          super();
          this._binaryType = binaryType || BINARY_TYPES[0];
          this[kWebSocket] = undefined;
          this._extensions = extensions || {};
          this._isServer = !!isServer;
          this._maxPayload = maxPayload | 0;
          this._bufferedBytes = 0;
          this._buffers = [];
          this._compressed = false;
          this._payloadLength = 0;
          this._mask = undefined;
          this._fragmented = 0;
          this._masked = false;
          this._fin = false;
          this._opcode = 0;
          this._totalPayloadLength = 0;
          this._messageLength = 0;
          this._fragments = [];
          this._state = GET_INFO;
          this._loop = false;
        }
        _write(chunk, encoding, cb) {
          if (this._opcode === 8 && this._state == GET_INFO) return cb();
          this._bufferedBytes += chunk.length;
          this._buffers.push(chunk);
          this.startLoop(cb);
        }
        consume(n) {
          this._bufferedBytes -= n;
          if (n === this._buffers[0].length) return this._buffers.shift();
          if (n < this._buffers[0].length) {
            const buf = this._buffers[0];
            this._buffers[0] = buf.slice(n);
            return buf.slice(0, n);
          }
          const dst = Buffer.allocUnsafe(n);
          do {
            const buf = this._buffers[0];
            const offset = dst.length - n;
            if (n >= buf.length) {
              dst.set(this._buffers.shift(), offset);
            } else {
              dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
              this._buffers[0] = buf.slice(n);
            }
            n -= buf.length;
          } while (n > 0);
          return dst;
        }
        startLoop(cb) {
          let err;
          this._loop = true;
          do {
            switch (this._state) {
              case GET_INFO:
                err = this.getInfo();
                break;
              case GET_PAYLOAD_LENGTH_16:
                err = this.getPayloadLength16();
                break;
              case GET_PAYLOAD_LENGTH_64:
                err = this.getPayloadLength64();
                break;
              case GET_MASK:
                this.getMask();
                break;
              case GET_DATA:
                err = this.getData(cb);
                break;
              default:
                this._loop = false;
                return;
            }
          } while (this._loop);
          cb(err);
        }
        getInfo() {
          if (this._bufferedBytes < 2) {
            this._loop = false;
            return;
          }
          const buf = this.consume(2);
          if ((buf[0] & 48) !== 0) {
            this._loop = false;
            return error(
              RangeError,
              "RSV2 and RSV3 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_2_3",
            );
          }
          const compressed = (buf[0] & 64) === 64;
          if (
            compressed &&
            !this._extensions[PerMessageDeflate.extensionName]
          ) {
            this._loop = false;
            return error(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1",
            );
          }
          this._fin = (buf[0] & 128) === 128;
          this._opcode = buf[0] & 15;
          this._payloadLength = buf[1] & 127;
          if (this._opcode === 0) {
            if (compressed) {
              this._loop = false;
              return error(
                RangeError,
                "RSV1 must be clear",
                true,
                1002,
                "WS_ERR_UNEXPECTED_RSV_1",
              );
            }
            if (!this._fragmented) {
              this._loop = false;
              return error(
                RangeError,
                "invalid opcode 0",
                true,
                1002,
                "WS_ERR_INVALID_OPCODE",
              );
            }
            this._opcode = this._fragmented;
          } else if (this._opcode === 1 || this._opcode === 2) {
            if (this._fragmented) {
              this._loop = false;
              return error(
                RangeError,
                `invalid opcode ${this._opcode}`,
                true,
                1002,
                "WS_ERR_INVALID_OPCODE",
              );
            }
            this._compressed = compressed;
          } else if (this._opcode > 7 && this._opcode < 11) {
            if (!this._fin) {
              this._loop = false;
              return error(
                RangeError,
                "FIN must be set",
                true,
                1002,
                "WS_ERR_EXPECTED_FIN",
              );
            }
            if (compressed) {
              this._loop = false;
              return error(
                RangeError,
                "RSV1 must be clear",
                true,
                1002,
                "WS_ERR_UNEXPECTED_RSV_1",
              );
            }
            if (this._payloadLength > 125) {
              this._loop = false;
              return error(
                RangeError,
                `invalid payload length ${this._payloadLength}`,
                true,
                1002,
                "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH",
              );
            }
          } else {
            this._loop = false;
            return error(
              RangeError,
              `invalid opcode ${this._opcode}`,
              true,
              1002,
              "WS_ERR_INVALID_OPCODE",
            );
          }
          if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
          this._masked = (buf[1] & 128) === 128;
          if (this._isServer) {
            if (!this._masked) {
              this._loop = false;
              return error(
                RangeError,
                "MASK must be set",
                true,
                1002,
                "WS_ERR_EXPECTED_MASK",
              );
            }
          } else if (this._masked) {
            this._loop = false;
            return error(
              RangeError,
              "MASK must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_MASK",
            );
          }
          if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
          else if (this._payloadLength === 127)
            this._state = GET_PAYLOAD_LENGTH_64;
          else return this.haveLength();
        }
        getPayloadLength16() {
          if (this._bufferedBytes < 2) {
            this._loop = false;
            return;
          }
          this._payloadLength = this.consume(2).readUInt16BE(0);
          return this.haveLength();
        }
        getPayloadLength64() {
          if (this._bufferedBytes < 8) {
            this._loop = false;
            return;
          }
          const buf = this.consume(8);
          const num = buf.readUInt32BE(0);
          if (num > Math.pow(2, 53 - 32) - 1) {
            this._loop = false;
            return error(
              RangeError,
              "Unsupported WebSocket frame: payload length > 2^53 - 1",
              false,
              1009,
              "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH",
            );
          }
          this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
          return this.haveLength();
        }
        haveLength() {
          if (this._payloadLength && this._opcode < 8) {
            this._totalPayloadLength += this._payloadLength;
            if (
              this._totalPayloadLength > this._maxPayload &&
              this._maxPayload > 0
            ) {
              this._loop = false;
              return error(
                RangeError,
                "Max payload size exceeded",
                false,
                1009,
                "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH",
              );
            }
          }
          if (this._masked) this._state = GET_MASK;
          else this._state = GET_DATA;
        }
        getMask() {
          if (this._bufferedBytes < 4) {
            this._loop = false;
            return;
          }
          this._mask = this.consume(4);
          this._state = GET_DATA;
        }
        getData(cb) {
          let data = EMPTY_BUFFER;
          if (this._payloadLength) {
            if (this._bufferedBytes < this._payloadLength) {
              this._loop = false;
              return;
            }
            data = this.consume(this._payloadLength);
            if (this._masked) unmask(data, this._mask);
          }
          if (this._opcode > 7) return this.controlMessage(data);
          if (this._compressed) {
            this._state = INFLATING;
            this.decompress(data, cb);
            return;
          }
          if (data.length) {
            this._messageLength = this._totalPayloadLength;
            this._fragments.push(data);
          }
          return this.dataMessage();
        }
        decompress(data, cb) {
          const perMessageDeflate =
            this._extensions[PerMessageDeflate.extensionName];
          perMessageDeflate.decompress(data, this._fin, (err, buf) => {
            if (err) return cb(err);
            if (buf.length) {
              this._messageLength += buf.length;
              if (
                this._messageLength > this._maxPayload &&
                this._maxPayload > 0
              ) {
                return cb(
                  error(
                    RangeError,
                    "Max payload size exceeded",
                    false,
                    1009,
                    "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH",
                  ),
                );
              }
              this._fragments.push(buf);
            }
            const er = this.dataMessage();
            if (er) return cb(er);
            this.startLoop(cb);
          });
        }
        dataMessage() {
          if (this._fin) {
            const messageLength = this._messageLength;
            const fragments = this._fragments;
            this._totalPayloadLength = 0;
            this._messageLength = 0;
            this._fragmented = 0;
            this._fragments = [];
            if (this._opcode === 2) {
              let data;
              if (this._binaryType === "nodebuffer") {
                data = concat(fragments, messageLength);
              } else if (this._binaryType === "arraybuffer") {
                data = toArrayBuffer(concat(fragments, messageLength));
              } else {
                data = fragments;
              }
              this.emit("message", data);
            } else {
              const buf = concat(fragments, messageLength);
              if (!isValidUTF8(buf)) {
                this._loop = false;
                return error(
                  Error,
                  "invalid UTF-8 sequence",
                  true,
                  1007,
                  "WS_ERR_INVALID_UTF8",
                );
              }
              this.emit("message", buf.toString());
            }
          }
          this._state = GET_INFO;
        }
        controlMessage(data) {
          if (this._opcode === 8) {
            this._loop = false;
            if (data.length === 0) {
              this.emit("conclude", 1005, "");
              this.end();
            } else if (data.length === 1) {
              return error(
                RangeError,
                "invalid payload length 1",
                true,
                1002,
                "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH",
              );
            } else {
              const code = data.readUInt16BE(0);
              if (!isValidStatusCode(code)) {
                return error(
                  RangeError,
                  `invalid status code ${code}`,
                  true,
                  1002,
                  "WS_ERR_INVALID_CLOSE_CODE",
                );
              }
              const buf = data.slice(2);
              if (!isValidUTF8(buf)) {
                return error(
                  Error,
                  "invalid UTF-8 sequence",
                  true,
                  1007,
                  "WS_ERR_INVALID_UTF8",
                );
              }
              this.emit("conclude", code, buf.toString());
              this.end();
            }
          } else if (this._opcode === 9) {
            this.emit("ping", data);
          } else {
            this.emit("pong", data);
          }
          this._state = GET_INFO;
        }
      }
      module.exports = Receiver;
      function error(ErrorCtor, message, prefix, statusCode, errorCode) {
        const err = new ErrorCtor(
          prefix ? `Invalid WebSocket frame: ${message}` : message,
        );
        Error.captureStackTrace(err, error);
        err.code = errorCode;
        err[kStatusCode] = statusCode;
        return err;
      }
    },
    2716: (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      const net = __nccwpck_require__(9278);
      const tls = __nccwpck_require__(4756);
      const { randomFillSync } = __nccwpck_require__(6982);
      const PerMessageDeflate = __nccwpck_require__(4989);
      const { EMPTY_BUFFER } = __nccwpck_require__(1168);
      const { isValidStatusCode } = __nccwpck_require__(9506);
      const { mask: applyMask, toBuffer } = __nccwpck_require__(1412);
      const mask = Buffer.alloc(4);
      class Sender {
        constructor(socket, extensions) {
          this._extensions = extensions || {};
          this._socket = socket;
          this._firstFragment = true;
          this._compress = false;
          this._bufferedBytes = 0;
          this._deflating = false;
          this._queue = [];
        }
        static frame(data, options) {
          const merge = options.mask && options.readOnly;
          let offset = options.mask ? 6 : 2;
          let payloadLength = data.length;
          if (data.length >= 65536) {
            offset += 8;
            payloadLength = 127;
          } else if (data.length > 125) {
            offset += 2;
            payloadLength = 126;
          }
          const target = Buffer.allocUnsafe(
            merge ? data.length + offset : offset,
          );
          target[0] = options.fin ? options.opcode | 128 : options.opcode;
          if (options.rsv1) target[0] |= 64;
          target[1] = payloadLength;
          if (payloadLength === 126) {
            target.writeUInt16BE(data.length, 2);
          } else if (payloadLength === 127) {
            target.writeUInt32BE(0, 2);
            target.writeUInt32BE(data.length, 6);
          }
          if (!options.mask) return [target, data];
          randomFillSync(mask, 0, 4);
          target[1] |= 128;
          target[offset - 4] = mask[0];
          target[offset - 3] = mask[1];
          target[offset - 2] = mask[2];
          target[offset - 1] = mask[3];
          if (merge) {
            applyMask(data, mask, target, offset, data.length);
            return [target];
          }
          applyMask(data, mask, data, 0, data.length);
          return [target, data];
        }
        close(code, data, mask, cb) {
          let buf;
          if (code === undefined) {
            buf = EMPTY_BUFFER;
          } else if (typeof code !== "number" || !isValidStatusCode(code)) {
            throw new TypeError(
              "First argument must be a valid error code number",
            );
          } else if (data === undefined || data === "") {
            buf = Buffer.allocUnsafe(2);
            buf.writeUInt16BE(code, 0);
          } else {
            const length = Buffer.byteLength(data);
            if (length > 123) {
              throw new RangeError(
                "The message must not be greater than 123 bytes",
              );
            }
            buf = Buffer.allocUnsafe(2 + length);
            buf.writeUInt16BE(code, 0);
            buf.write(data, 2);
          }
          if (this._deflating) {
            this.enqueue([this.doClose, buf, mask, cb]);
          } else {
            this.doClose(buf, mask, cb);
          }
        }
        doClose(data, mask, cb) {
          this.sendFrame(
            Sender.frame(data, {
              fin: true,
              rsv1: false,
              opcode: 8,
              mask,
              readOnly: false,
            }),
            cb,
          );
        }
        ping(data, mask, cb) {
          const buf = toBuffer(data);
          if (buf.length > 125) {
            throw new RangeError(
              "The data size must not be greater than 125 bytes",
            );
          }
          if (this._deflating) {
            this.enqueue([this.doPing, buf, mask, toBuffer.readOnly, cb]);
          } else {
            this.doPing(buf, mask, toBuffer.readOnly, cb);
          }
        }
        doPing(data, mask, readOnly, cb) {
          this.sendFrame(
            Sender.frame(data, {
              fin: true,
              rsv1: false,
              opcode: 9,
              mask,
              readOnly,
            }),
            cb,
          );
        }
        pong(data, mask, cb) {
          const buf = toBuffer(data);
          if (buf.length > 125) {
            throw new RangeError(
              "The data size must not be greater than 125 bytes",
            );
          }
          if (this._deflating) {
            this.enqueue([this.doPong, buf, mask, toBuffer.readOnly, cb]);
          } else {
            this.doPong(buf, mask, toBuffer.readOnly, cb);
          }
        }
        doPong(data, mask, readOnly, cb) {
          this.sendFrame(
            Sender.frame(data, {
              fin: true,
              rsv1: false,
              opcode: 10,
              mask,
              readOnly,
            }),
            cb,
          );
        }
        send(data, options, cb) {
          const buf = toBuffer(data);
          const perMessageDeflate =
            this._extensions[PerMessageDeflate.extensionName];
          let opcode = options.binary ? 2 : 1;
          let rsv1 = options.compress;
          if (this._firstFragment) {
            this._firstFragment = false;
            if (rsv1 && perMessageDeflate) {
              rsv1 = buf.length >= perMessageDeflate._threshold;
            }
            this._compress = rsv1;
          } else {
            rsv1 = false;
            opcode = 0;
          }
          if (options.fin) this._firstFragment = true;
          if (perMessageDeflate) {
            const opts = {
              fin: options.fin,
              rsv1,
              opcode,
              mask: options.mask,
              readOnly: toBuffer.readOnly,
            };
            if (this._deflating) {
              this.enqueue([this.dispatch, buf, this._compress, opts, cb]);
            } else {
              this.dispatch(buf, this._compress, opts, cb);
            }
          } else {
            this.sendFrame(
              Sender.frame(buf, {
                fin: options.fin,
                rsv1: false,
                opcode,
                mask: options.mask,
                readOnly: toBuffer.readOnly,
              }),
              cb,
            );
          }
        }
        dispatch(data, compress, options, cb) {
          if (!compress) {
            this.sendFrame(Sender.frame(data, options), cb);
            return;
          }
          const perMessageDeflate =
            this._extensions[PerMessageDeflate.extensionName];
          this._bufferedBytes += data.length;
          this._deflating = true;
          perMessageDeflate.compress(data, options.fin, (_, buf) => {
            if (this._socket.destroyed) {
              const err = new Error(
                "The socket was closed while data was being compressed",
              );
              if (typeof cb === "function") cb(err);
              for (let i = 0; i < this._queue.length; i++) {
                const callback = this._queue[i][4];
                if (typeof callback === "function") callback(err);
              }
              return;
            }
            this._bufferedBytes -= data.length;
            this._deflating = false;
            options.readOnly = false;
            this.sendFrame(Sender.frame(buf, options), cb);
            this.dequeue();
          });
        }
        dequeue() {
          while (!this._deflating && this._queue.length) {
            const params = this._queue.shift();
            this._bufferedBytes -= params[1].length;
            Reflect.apply(params[0], this, params.slice(1));
          }
        }
        enqueue(params) {
          this._bufferedBytes += params[1].length;
          this._queue.push(params);
        }
        sendFrame(list, cb) {
          if (list.length === 2) {
            this._socket.cork();
            this._socket.write(list[0]);
            this._socket.write(list[1], cb);
            this._socket.uncork();
          } else {
            this._socket.write(list[0], cb);
          }
        }
      }
      module.exports = Sender;
    },
    4605: (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      const { Duplex } = __nccwpck_require__(2203);
      function emitClose(stream) {
        stream.emit("close");
      }
      function duplexOnEnd() {
        if (!this.destroyed && this._writableState.finished) {
          this.destroy();
        }
      }
      function duplexOnError(err) {
        this.removeListener("error", duplexOnError);
        this.destroy();
        if (this.listenerCount("error") === 0) {
          this.emit("error", err);
        }
      }
      function createWebSocketStream(ws, options) {
        let resumeOnReceiverDrain = true;
        let terminateOnDestroy = true;
        function receiverOnDrain() {
          if (resumeOnReceiverDrain) ws._socket.resume();
        }
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", function open() {
            ws._receiver.removeAllListeners("drain");
            ws._receiver.on("drain", receiverOnDrain);
          });
        } else {
          ws._receiver.removeAllListeners("drain");
          ws._receiver.on("drain", receiverOnDrain);
        }
        const duplex = new Duplex({
          ...options,
          autoDestroy: false,
          emitClose: false,
          objectMode: false,
          writableObjectMode: false,
        });
        ws.on("message", function message(msg) {
          if (!duplex.push(msg)) {
            resumeOnReceiverDrain = false;
            ws._socket.pause();
          }
        });
        ws.once("error", function error(err) {
          if (duplex.destroyed) return;
          terminateOnDestroy = false;
          duplex.destroy(err);
        });
        ws.once("close", function close() {
          if (duplex.destroyed) return;
          duplex.push(null);
        });
        duplex._destroy = function (err, callback) {
          if (ws.readyState === ws.CLOSED) {
            callback(err);
            process.nextTick(emitClose, duplex);
            return;
          }
          let called = false;
          ws.once("error", function error(err) {
            called = true;
            callback(err);
          });
          ws.once("close", function close() {
            if (!called) callback(err);
            process.nextTick(emitClose, duplex);
          });
          if (terminateOnDestroy) ws.terminate();
        };
        duplex._final = function (callback) {
          if (ws.readyState === ws.CONNECTING) {
            ws.once("open", function open() {
              duplex._final(callback);
            });
            return;
          }
          if (ws._socket === null) return;
          if (ws._socket._writableState.finished) {
            callback();
            if (duplex._readableState.endEmitted) duplex.destroy();
          } else {
            ws._socket.once("finish", function finish() {
              callback();
            });
            ws.close();
          }
        };
        duplex._read = function () {
          if (
            (ws.readyState === ws.OPEN || ws.readyState === ws.CLOSING) &&
            !resumeOnReceiverDrain
          ) {
            resumeOnReceiverDrain = true;
            if (!ws._receiver._writableState.needDrain) ws._socket.resume();
          }
        };
        duplex._write = function (chunk, encoding, callback) {
          if (ws.readyState === ws.CONNECTING) {
            ws.once("open", function open() {
              duplex._write(chunk, encoding, callback);
            });
            return;
          }
          ws.send(chunk, callback);
        };
        duplex.on("end", duplexOnEnd);
        duplex.on("error", duplexOnError);
        return duplex;
      }
      module.exports = createWebSocketStream;
    },
    9506: (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      function isValidStatusCode(code) {
        return (
          (code >= 1e3 &&
            code <= 1014 &&
            code !== 1004 &&
            code !== 1005 &&
            code !== 1006) ||
          (code >= 3e3 && code <= 4999)
        );
      }
      function _isValidUTF8(buf) {
        const len = buf.length;
        let i = 0;
        while (i < len) {
          if ((buf[i] & 128) === 0) {
            i++;
          } else if ((buf[i] & 224) === 192) {
            if (
              i + 1 === len ||
              (buf[i + 1] & 192) !== 128 ||
              (buf[i] & 254) === 192
            ) {
              return false;
            }
            i += 2;
          } else if ((buf[i] & 240) === 224) {
            if (
              i + 2 >= len ||
              (buf[i + 1] & 192) !== 128 ||
              (buf[i + 2] & 192) !== 128 ||
              (buf[i] === 224 && (buf[i + 1] & 224) === 128) ||
              (buf[i] === 237 && (buf[i + 1] & 224) === 160)
            ) {
              return false;
            }
            i += 3;
          } else if ((buf[i] & 248) === 240) {
            if (
              i + 3 >= len ||
              (buf[i + 1] & 192) !== 128 ||
              (buf[i + 2] & 192) !== 128 ||
              (buf[i + 3] & 192) !== 128 ||
              (buf[i] === 240 && (buf[i + 1] & 240) === 128) ||
              (buf[i] === 244 && buf[i + 1] > 143) ||
              buf[i] > 244
            ) {
              return false;
            }
            i += 4;
          } else {
            return false;
          }
        }
        return true;
      }
      try {
        let isValidUTF8 = __nccwpck_require__(5643);
        if (typeof isValidUTF8 === "object") {
          isValidUTF8 = isValidUTF8.Validation.isValidUTF8;
        }
        module.exports = {
          isValidStatusCode,
          isValidUTF8(buf) {
            return buf.length < 150 ? _isValidUTF8(buf) : isValidUTF8(buf);
          },
        };
      } catch (e) {
        module.exports = { isValidStatusCode, isValidUTF8: _isValidUTF8 };
      }
    },
    4536: (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      const EventEmitter = __nccwpck_require__(4434);
      const http = __nccwpck_require__(8611);
      const https = __nccwpck_require__(5692);
      const net = __nccwpck_require__(9278);
      const tls = __nccwpck_require__(4756);
      const { createHash } = __nccwpck_require__(6982);
      const PerMessageDeflate = __nccwpck_require__(4989);
      const WebSocket = __nccwpck_require__(6958);
      const { format, parse } = __nccwpck_require__(5496);
      const { GUID, kWebSocket } = __nccwpck_require__(1168);
      const keyRegex = /^[+/0-9A-Za-z]{22}==$/;
      const RUNNING = 0;
      const CLOSING = 1;
      const CLOSED = 2;
      class WebSocketServer extends EventEmitter {
        constructor(options, callback) {
          super();
          options = {
            maxPayload: 100 * 1024 * 1024,
            perMessageDeflate: false,
            handleProtocols: null,
            clientTracking: true,
            verifyClient: null,
            noServer: false,
            backlog: null,
            server: null,
            host: null,
            path: null,
            port: null,
            ...options,
          };
          if (
            (options.port == null && !options.server && !options.noServer) ||
            (options.port != null && (options.server || options.noServer)) ||
            (options.server && options.noServer)
          ) {
            throw new TypeError(
              'One and only one of the "port", "server", or "noServer" options ' +
                "must be specified",
            );
          }
          if (options.port != null) {
            this._server = http.createServer((req, res) => {
              const body = http.STATUS_CODES[426];
              res.writeHead(426, {
                "Content-Length": body.length,
                "Content-Type": "text/plain",
              });
              res.end(body);
            });
            this._server.listen(
              options.port,
              options.host,
              options.backlog,
              callback,
            );
          } else if (options.server) {
            this._server = options.server;
          }
          if (this._server) {
            const emitConnection = this.emit.bind(this, "connection");
            this._removeListeners = addListeners(this._server, {
              listening: this.emit.bind(this, "listening"),
              error: this.emit.bind(this, "error"),
              upgrade: (req, socket, head) => {
                this.handleUpgrade(req, socket, head, emitConnection);
              },
            });
          }
          if (options.perMessageDeflate === true)
            options.perMessageDeflate = {};
          if (options.clientTracking) this.clients = new Set();
          this.options = options;
          this._state = RUNNING;
        }
        address() {
          if (this.options.noServer) {
            throw new Error('The server is operating in "noServer" mode');
          }
          if (!this._server) return null;
          return this._server.address();
        }
        close(cb) {
          if (cb) this.once("close", cb);
          if (this._state === CLOSED) {
            process.nextTick(emitClose, this);
            return;
          }
          if (this._state === CLOSING) return;
          this._state = CLOSING;
          if (this.clients) {
            for (const client of this.clients) client.terminate();
          }
          const server = this._server;
          if (server) {
            this._removeListeners();
            this._removeListeners = this._server = null;
            if (this.options.port != null) {
              server.close(emitClose.bind(undefined, this));
              return;
            }
          }
          process.nextTick(emitClose, this);
        }
        shouldHandle(req) {
          if (this.options.path) {
            const index = req.url.indexOf("?");
            const pathname = index !== -1 ? req.url.slice(0, index) : req.url;
            if (pathname !== this.options.path) return false;
          }
          return true;
        }
        handleUpgrade(req, socket, head, cb) {
          socket.on("error", socketOnError);
          const key =
            req.headers["sec-websocket-key"] !== undefined
              ? req.headers["sec-websocket-key"].trim()
              : false;
          const upgrade = req.headers.upgrade;
          const version = +req.headers["sec-websocket-version"];
          const extensions = {};
          if (
            req.method !== "GET" ||
            upgrade === undefined ||
            upgrade.toLowerCase() !== "websocket" ||
            !key ||
            !keyRegex.test(key) ||
            (version !== 8 && version !== 13) ||
            !this.shouldHandle(req)
          ) {
            return abortHandshake(socket, 400);
          }
          if (this.options.perMessageDeflate) {
            const perMessageDeflate = new PerMessageDeflate(
              this.options.perMessageDeflate,
              true,
              this.options.maxPayload,
            );
            try {
              const offers = parse(req.headers["sec-websocket-extensions"]);
              if (offers[PerMessageDeflate.extensionName]) {
                perMessageDeflate.accept(
                  offers[PerMessageDeflate.extensionName],
                );
                extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
              }
            } catch (err) {
              return abortHandshake(socket, 400);
            }
          }
          if (this.options.verifyClient) {
            const info = {
              origin:
                req.headers[
                  `${version === 8 ? "sec-websocket-origin" : "origin"}`
                ],
              secure: !!(req.socket.authorized || req.socket.encrypted),
              req,
            };
            if (this.options.verifyClient.length === 2) {
              this.options.verifyClient(
                info,
                (verified, code, message, headers) => {
                  if (!verified) {
                    return abortHandshake(
                      socket,
                      code || 401,
                      message,
                      headers,
                    );
                  }
                  this.completeUpgrade(key, extensions, req, socket, head, cb);
                },
              );
              return;
            }
            if (!this.options.verifyClient(info))
              return abortHandshake(socket, 401);
          }
          this.completeUpgrade(key, extensions, req, socket, head, cb);
        }
        completeUpgrade(key, extensions, req, socket, head, cb) {
          if (!socket.readable || !socket.writable) return socket.destroy();
          if (socket[kWebSocket]) {
            throw new Error(
              "server.handleUpgrade() was called more than once with the same " +
                "socket, possibly due to a misconfiguration",
            );
          }
          if (this._state > RUNNING) return abortHandshake(socket, 503);
          const digest = createHash("sha1")
            .update(key + GUID)
            .digest("base64");
          const headers = [
            "HTTP/1.1 101 Switching Protocols",
            "Upgrade: websocket",
            "Connection: Upgrade",
            `Sec-WebSocket-Accept: ${digest}`,
          ];
          const ws = new WebSocket(null);
          let protocol = req.headers["sec-websocket-protocol"];
          if (protocol) {
            protocol = protocol.split(",").map(trim);
            if (this.options.handleProtocols) {
              protocol = this.options.handleProtocols(protocol, req);
            } else {
              protocol = protocol[0];
            }
            if (protocol) {
              headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
              ws._protocol = protocol;
            }
          }
          if (extensions[PerMessageDeflate.extensionName]) {
            const params = extensions[PerMessageDeflate.extensionName].params;
            const value = format({
              [PerMessageDeflate.extensionName]: [params],
            });
            headers.push(`Sec-WebSocket-Extensions: ${value}`);
            ws._extensions = extensions;
          }
          this.emit("headers", headers, req);
          socket.write(headers.concat("\r\n").join("\r\n"));
          socket.removeListener("error", socketOnError);
          ws.setSocket(socket, head, this.options.maxPayload);
          if (this.clients) {
            this.clients.add(ws);
            ws.on("close", () => this.clients.delete(ws));
          }
          cb(ws, req);
        }
      }
      module.exports = WebSocketServer;
      function addListeners(server, map) {
        for (const event of Object.keys(map)) server.on(event, map[event]);
        return function removeListeners() {
          for (const event of Object.keys(map)) {
            server.removeListener(event, map[event]);
          }
        };
      }
      function emitClose(server) {
        server._state = CLOSED;
        server.emit("close");
      }
      function socketOnError() {
        this.destroy();
      }
      function abortHandshake(socket, code, message, headers) {
        if (socket.writable) {
          message = message || http.STATUS_CODES[code];
          headers = {
            Connection: "close",
            "Content-Type": "text/html",
            "Content-Length": Buffer.byteLength(message),
            ...headers,
          };
          socket.write(
            `HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r\n` +
              Object.keys(headers)
                .map((h) => `${h}: ${headers[h]}`)
                .join("\r\n") +
              "\r\n\r\n" +
              message,
          );
        }
        socket.removeListener("error", socketOnError);
        socket.destroy();
      }
      function trim(str) {
        return str.trim();
      }
    },
    6958: (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      const EventEmitter = __nccwpck_require__(4434);
      const https = __nccwpck_require__(5692);
      const http = __nccwpck_require__(8611);
      const net = __nccwpck_require__(9278);
      const tls = __nccwpck_require__(4756);
      const { randomBytes, createHash } = __nccwpck_require__(6982);
      const { Readable } = __nccwpck_require__(2203);
      const { URL } = __nccwpck_require__(7016);
      const PerMessageDeflate = __nccwpck_require__(4989);
      const Receiver = __nccwpck_require__(8804);
      const Sender = __nccwpck_require__(2716);
      const {
        BINARY_TYPES,
        EMPTY_BUFFER,
        GUID,
        kStatusCode,
        kWebSocket,
        NOOP,
      } = __nccwpck_require__(1168);
      const { addEventListener, removeEventListener } =
        __nccwpck_require__(2827);
      const { format, parse } = __nccwpck_require__(5496);
      const { toBuffer } = __nccwpck_require__(1412);
      const readyStates = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"];
      const protocolVersions = [8, 13];
      const closeTimeout = 30 * 1e3;
      class WebSocket extends EventEmitter {
        constructor(address, protocols, options) {
          super();
          this._binaryType = BINARY_TYPES[0];
          this._closeCode = 1006;
          this._closeFrameReceived = false;
          this._closeFrameSent = false;
          this._closeMessage = "";
          this._closeTimer = null;
          this._extensions = {};
          this._protocol = "";
          this._readyState = WebSocket.CONNECTING;
          this._receiver = null;
          this._sender = null;
          this._socket = null;
          if (address !== null) {
            this._bufferedAmount = 0;
            this._isServer = false;
            this._redirects = 0;
            if (Array.isArray(protocols)) {
              protocols = protocols.join(", ");
            } else if (typeof protocols === "object" && protocols !== null) {
              options = protocols;
              protocols = undefined;
            }
            initAsClient(this, address, protocols, options);
          } else {
            this._isServer = true;
          }
        }
        get binaryType() {
          return this._binaryType;
        }
        set binaryType(type) {
          if (!BINARY_TYPES.includes(type)) return;
          this._binaryType = type;
          if (this._receiver) this._receiver._binaryType = type;
        }
        get bufferedAmount() {
          if (!this._socket) return this._bufferedAmount;
          return (
            this._socket._writableState.length + this._sender._bufferedBytes
          );
        }
        get extensions() {
          return Object.keys(this._extensions).join();
        }
        get onclose() {
          return undefined;
        }
        set onclose(listener) {}
        get onerror() {
          return undefined;
        }
        set onerror(listener) {}
        get onopen() {
          return undefined;
        }
        set onopen(listener) {}
        get onmessage() {
          return undefined;
        }
        set onmessage(listener) {}
        get protocol() {
          return this._protocol;
        }
        get readyState() {
          return this._readyState;
        }
        get url() {
          return this._url;
        }
        setSocket(socket, head, maxPayload) {
          const receiver = new Receiver(
            this.binaryType,
            this._extensions,
            this._isServer,
            maxPayload,
          );
          this._sender = new Sender(socket, this._extensions);
          this._receiver = receiver;
          this._socket = socket;
          receiver[kWebSocket] = this;
          socket[kWebSocket] = this;
          receiver.on("conclude", receiverOnConclude);
          receiver.on("drain", receiverOnDrain);
          receiver.on("error", receiverOnError);
          receiver.on("message", receiverOnMessage);
          receiver.on("ping", receiverOnPing);
          receiver.on("pong", receiverOnPong);
          socket.setTimeout(0);
          socket.setNoDelay();
          if (head.length > 0) socket.unshift(head);
          socket.on("close", socketOnClose);
          socket.on("data", socketOnData);
          socket.on("end", socketOnEnd);
          socket.on("error", socketOnError);
          this._readyState = WebSocket.OPEN;
          this.emit("open");
        }
        emitClose() {
          if (!this._socket) {
            this._readyState = WebSocket.CLOSED;
            this.emit("close", this._closeCode, this._closeMessage);
            return;
          }
          if (this._extensions[PerMessageDeflate.extensionName]) {
            this._extensions[PerMessageDeflate.extensionName].cleanup();
          }
          this._receiver.removeAllListeners();
          this._readyState = WebSocket.CLOSED;
          this.emit("close", this._closeCode, this._closeMessage);
        }
        close(code, data) {
          if (this.readyState === WebSocket.CLOSED) return;
          if (this.readyState === WebSocket.CONNECTING) {
            const msg =
              "WebSocket was closed before the connection was established";
            return abortHandshake(this, this._req, msg);
          }
          if (this.readyState === WebSocket.CLOSING) {
            if (
              this._closeFrameSent &&
              (this._closeFrameReceived ||
                this._receiver._writableState.errorEmitted)
            ) {
              this._socket.end();
            }
            return;
          }
          this._readyState = WebSocket.CLOSING;
          this._sender.close(code, data, !this._isServer, (err) => {
            if (err) return;
            this._closeFrameSent = true;
            if (
              this._closeFrameReceived ||
              this._receiver._writableState.errorEmitted
            ) {
              this._socket.end();
            }
          });
          this._closeTimer = setTimeout(
            this._socket.destroy.bind(this._socket),
            closeTimeout,
          );
        }
        ping(data, mask, cb) {
          if (this.readyState === WebSocket.CONNECTING) {
            throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
          }
          if (typeof data === "function") {
            cb = data;
            data = mask = undefined;
          } else if (typeof mask === "function") {
            cb = mask;
            mask = undefined;
          }
          if (typeof data === "number") data = data.toString();
          if (this.readyState !== WebSocket.OPEN) {
            sendAfterClose(this, data, cb);
            return;
          }
          if (mask === undefined) mask = !this._isServer;
          this._sender.ping(data || EMPTY_BUFFER, mask, cb);
        }
        pong(data, mask, cb) {
          if (this.readyState === WebSocket.CONNECTING) {
            throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
          }
          if (typeof data === "function") {
            cb = data;
            data = mask = undefined;
          } else if (typeof mask === "function") {
            cb = mask;
            mask = undefined;
          }
          if (typeof data === "number") data = data.toString();
          if (this.readyState !== WebSocket.OPEN) {
            sendAfterClose(this, data, cb);
            return;
          }
          if (mask === undefined) mask = !this._isServer;
          this._sender.pong(data || EMPTY_BUFFER, mask, cb);
        }
        send(data, options, cb) {
          if (this.readyState === WebSocket.CONNECTING) {
            throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
          }
          if (typeof options === "function") {
            cb = options;
            options = {};
          }
          if (typeof data === "number") data = data.toString();
          if (this.readyState !== WebSocket.OPEN) {
            sendAfterClose(this, data, cb);
            return;
          }
          const opts = {
            binary: typeof data !== "string",
            mask: !this._isServer,
            compress: true,
            fin: true,
            ...options,
          };
          if (!this._extensions[PerMessageDeflate.extensionName]) {
            opts.compress = false;
          }
          this._sender.send(data || EMPTY_BUFFER, opts, cb);
        }
        terminate() {
          if (this.readyState === WebSocket.CLOSED) return;
          if (this.readyState === WebSocket.CONNECTING) {
            const msg =
              "WebSocket was closed before the connection was established";
            return abortHandshake(this, this._req, msg);
          }
          if (this._socket) {
            this._readyState = WebSocket.CLOSING;
            this._socket.destroy();
          }
        }
      }
      Object.defineProperty(WebSocket, "CONNECTING", {
        enumerable: true,
        value: readyStates.indexOf("CONNECTING"),
      });
      Object.defineProperty(WebSocket.prototype, "CONNECTING", {
        enumerable: true,
        value: readyStates.indexOf("CONNECTING"),
      });
      Object.defineProperty(WebSocket, "OPEN", {
        enumerable: true,
        value: readyStates.indexOf("OPEN"),
      });
      Object.defineProperty(WebSocket.prototype, "OPEN", {
        enumerable: true,
        value: readyStates.indexOf("OPEN"),
      });
      Object.defineProperty(WebSocket, "CLOSING", {
        enumerable: true,
        value: readyStates.indexOf("CLOSING"),
      });
      Object.defineProperty(WebSocket.prototype, "CLOSING", {
        enumerable: true,
        value: readyStates.indexOf("CLOSING"),
      });
      Object.defineProperty(WebSocket, "CLOSED", {
        enumerable: true,
        value: readyStates.indexOf("CLOSED"),
      });
      Object.defineProperty(WebSocket.prototype, "CLOSED", {
        enumerable: true,
        value: readyStates.indexOf("CLOSED"),
      });
      [
        "binaryType",
        "bufferedAmount",
        "extensions",
        "protocol",
        "readyState",
        "url",
      ].forEach((property) => {
        Object.defineProperty(WebSocket.prototype, property, {
          enumerable: true,
        });
      });
      ["open", "error", "close", "message"].forEach((method) => {
        Object.defineProperty(WebSocket.prototype, `on${method}`, {
          enumerable: true,
          get() {
            const listeners = this.listeners(method);
            for (let i = 0; i < listeners.length; i++) {
              if (listeners[i]._listener) return listeners[i]._listener;
            }
            return undefined;
          },
          set(listener) {
            const listeners = this.listeners(method);
            for (let i = 0; i < listeners.length; i++) {
              if (listeners[i]._listener)
                this.removeListener(method, listeners[i]);
            }
            this.addEventListener(method, listener);
          },
        });
      });
      WebSocket.prototype.addEventListener = addEventListener;
      WebSocket.prototype.removeEventListener = removeEventListener;
      module.exports = WebSocket;
      function initAsClient(websocket, address, protocols, options) {
        const opts = {
          protocolVersion: protocolVersions[1],
          maxPayload: 100 * 1024 * 1024,
          perMessageDeflate: true,
          followRedirects: false,
          maxRedirects: 10,
          ...options,
          createConnection: undefined,
          socketPath: undefined,
          hostname: undefined,
          protocol: undefined,
          timeout: undefined,
          method: undefined,
          host: undefined,
          path: undefined,
          port: undefined,
        };
        if (!protocolVersions.includes(opts.protocolVersion)) {
          throw new RangeError(
            `Unsupported protocol version: ${opts.protocolVersion} ` +
              `(supported versions: ${protocolVersions.join(", ")})`,
          );
        }
        let parsedUrl;
        if (address instanceof URL) {
          parsedUrl = address;
          websocket._url = address.href;
        } else {
          parsedUrl = new URL(address);
          websocket._url = address;
        }
        const isUnixSocket = parsedUrl.protocol === "ws+unix:";
        if (!parsedUrl.host && (!isUnixSocket || !parsedUrl.pathname)) {
          const err = new Error(`Invalid URL: ${websocket.url}`);
          if (websocket._redirects === 0) {
            throw err;
          } else {
            emitErrorAndClose(websocket, err);
            return;
          }
        }
        const isSecure =
          parsedUrl.protocol === "wss:" || parsedUrl.protocol === "https:";
        const defaultPort = isSecure ? 443 : 80;
        const key = randomBytes(16).toString("base64");
        const get = isSecure ? https.get : http.get;
        let perMessageDeflate;
        opts.createConnection = isSecure ? tlsConnect : netConnect;
        opts.defaultPort = opts.defaultPort || defaultPort;
        opts.port = parsedUrl.port || defaultPort;
        opts.host = parsedUrl.hostname.startsWith("[")
          ? parsedUrl.hostname.slice(1, -1)
          : parsedUrl.hostname;
        opts.headers = {
          "Sec-WebSocket-Version": opts.protocolVersion,
          "Sec-WebSocket-Key": key,
          Connection: "Upgrade",
          Upgrade: "websocket",
          ...opts.headers,
        };
        opts.path = parsedUrl.pathname + parsedUrl.search;
        opts.timeout = opts.handshakeTimeout;
        if (opts.perMessageDeflate) {
          perMessageDeflate = new PerMessageDeflate(
            opts.perMessageDeflate !== true ? opts.perMessageDeflate : {},
            false,
            opts.maxPayload,
          );
          opts.headers["Sec-WebSocket-Extensions"] = format({
            [PerMessageDeflate.extensionName]: perMessageDeflate.offer(),
          });
        }
        if (protocols) {
          opts.headers["Sec-WebSocket-Protocol"] = protocols;
        }
        if (opts.origin) {
          if (opts.protocolVersion < 13) {
            opts.headers["Sec-WebSocket-Origin"] = opts.origin;
          } else {
            opts.headers.Origin = opts.origin;
          }
        }
        if (parsedUrl.username || parsedUrl.password) {
          opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
        }
        if (isUnixSocket) {
          const parts = opts.path.split(":");
          opts.socketPath = parts[0];
          opts.path = parts[1];
        }
        if (opts.followRedirects) {
          if (websocket._redirects === 0) {
            websocket._originalUnixSocket = isUnixSocket;
            websocket._originalSecure = isSecure;
            websocket._originalHostOrSocketPath = isUnixSocket
              ? opts.socketPath
              : parsedUrl.host;
            const headers = options && options.headers;
            options = { ...options, headers: {} };
            if (headers) {
              for (const [key, value] of Object.entries(headers)) {
                options.headers[key.toLowerCase()] = value;
              }
            }
          } else {
            const isSameHost = isUnixSocket
              ? websocket._originalUnixSocket
                ? opts.socketPath === websocket._originalHostOrSocketPath
                : false
              : websocket._originalUnixSocket
                ? false
                : parsedUrl.host === websocket._originalHostOrSocketPath;
            if (!isSameHost || (websocket._originalSecure && !isSecure)) {
              delete opts.headers.authorization;
              delete opts.headers.cookie;
              if (!isSameHost) delete opts.headers.host;
              opts.auth = undefined;
            }
          }
          if (opts.auth && !options.headers.authorization) {
            options.headers.authorization =
              "Basic " + Buffer.from(opts.auth).toString("base64");
          }
        }
        let req = (websocket._req = get(opts));
        if (opts.timeout) {
          req.on("timeout", () => {
            abortHandshake(websocket, req, "Opening handshake has timed out");
          });
        }
        req.on("error", (err) => {
          if (req === null || req.aborted) return;
          req = websocket._req = null;
          emitErrorAndClose(websocket, err);
        });
        req.on("response", (res) => {
          const location = res.headers.location;
          const statusCode = res.statusCode;
          if (
            location &&
            opts.followRedirects &&
            statusCode >= 300 &&
            statusCode < 400
          ) {
            if (++websocket._redirects > opts.maxRedirects) {
              abortHandshake(websocket, req, "Maximum redirects exceeded");
              return;
            }
            req.abort();
            let addr;
            try {
              addr = new URL(location, address);
            } catch (err) {
              emitErrorAndClose(websocket, err);
              return;
            }
            initAsClient(websocket, addr, protocols, options);
          } else if (!websocket.emit("unexpected-response", req, res)) {
            abortHandshake(
              websocket,
              req,
              `Unexpected server response: ${res.statusCode}`,
            );
          }
        });
        req.on("upgrade", (res, socket, head) => {
          websocket.emit("upgrade", res);
          if (websocket.readyState !== WebSocket.CONNECTING) return;
          req = websocket._req = null;
          const upgrade = res.headers.upgrade;
          if (upgrade === undefined || upgrade.toLowerCase() !== "websocket") {
            abortHandshake(websocket, socket, "Invalid Upgrade header");
            return;
          }
          const digest = createHash("sha1")
            .update(key + GUID)
            .digest("base64");
          if (res.headers["sec-websocket-accept"] !== digest) {
            abortHandshake(
              websocket,
              socket,
              "Invalid Sec-WebSocket-Accept header",
            );
            return;
          }
          const serverProt = res.headers["sec-websocket-protocol"];
          const protList = (protocols || "").split(/, */);
          let protError;
          if (!protocols && serverProt) {
            protError = "Server sent a subprotocol but none was requested";
          } else if (protocols && !serverProt) {
            protError = "Server sent no subprotocol";
          } else if (serverProt && !protList.includes(serverProt)) {
            protError = "Server sent an invalid subprotocol";
          }
          if (protError) {
            abortHandshake(websocket, socket, protError);
            return;
          }
          if (serverProt) websocket._protocol = serverProt;
          const secWebSocketExtensions =
            res.headers["sec-websocket-extensions"];
          if (secWebSocketExtensions !== undefined) {
            if (!perMessageDeflate) {
              const message =
                "Server sent a Sec-WebSocket-Extensions header but no extension " +
                "was requested";
              abortHandshake(websocket, socket, message);
              return;
            }
            let extensions;
            try {
              extensions = parse(secWebSocketExtensions);
            } catch (err) {
              const message = "Invalid Sec-WebSocket-Extensions header";
              abortHandshake(websocket, socket, message);
              return;
            }
            const extensionNames = Object.keys(extensions);
            if (extensionNames.length) {
              if (
                extensionNames.length !== 1 ||
                extensionNames[0] !== PerMessageDeflate.extensionName
              ) {
                const message =
                  "Server indicated an extension that was not requested";
                abortHandshake(websocket, socket, message);
                return;
              }
              try {
                perMessageDeflate.accept(
                  extensions[PerMessageDeflate.extensionName],
                );
              } catch (err) {
                const message = "Invalid Sec-WebSocket-Extensions header";
                abortHandshake(websocket, socket, message);
                return;
              }
              websocket._extensions[PerMessageDeflate.extensionName] =
                perMessageDeflate;
            }
          }
          websocket.setSocket(socket, head, opts.maxPayload);
        });
      }
      function emitErrorAndClose(websocket, err) {
        websocket._readyState = WebSocket.CLOSING;
        websocket.emit("error", err);
        websocket.emitClose();
      }
      function netConnect(options) {
        options.path = options.socketPath;
        return net.connect(options);
      }
      function tlsConnect(options) {
        options.path = undefined;
        if (!options.servername && options.servername !== "") {
          options.servername = net.isIP(options.host) ? "" : options.host;
        }
        return tls.connect(options);
      }
      function abortHandshake(websocket, stream, message) {
        websocket._readyState = WebSocket.CLOSING;
        const err = new Error(message);
        Error.captureStackTrace(err, abortHandshake);
        if (stream.setHeader) {
          stream.abort();
          if (stream.socket && !stream.socket.destroyed) {
            stream.socket.destroy();
          }
          stream.once("abort", websocket.emitClose.bind(websocket));
          websocket.emit("error", err);
        } else {
          stream.destroy(err);
          stream.once("error", websocket.emit.bind(websocket, "error"));
          stream.once("close", websocket.emitClose.bind(websocket));
        }
      }
      function sendAfterClose(websocket, data, cb) {
        if (data) {
          const length = toBuffer(data).length;
          if (websocket._socket) websocket._sender._bufferedBytes += length;
          else websocket._bufferedAmount += length;
        }
        if (cb) {
          const err = new Error(
            `WebSocket is not open: readyState ${websocket.readyState} ` +
              `(${readyStates[websocket.readyState]})`,
          );
          cb(err);
        }
      }
      function receiverOnConclude(code, reason) {
        const websocket = this[kWebSocket];
        websocket._closeFrameReceived = true;
        websocket._closeMessage = reason;
        websocket._closeCode = code;
        if (websocket._socket[kWebSocket] === undefined) return;
        websocket._socket.removeListener("data", socketOnData);
        process.nextTick(resume, websocket._socket);
        if (code === 1005) websocket.close();
        else websocket.close(code, reason);
      }
      function receiverOnDrain() {
        this[kWebSocket]._socket.resume();
      }
      function receiverOnError(err) {
        const websocket = this[kWebSocket];
        if (websocket._socket[kWebSocket] !== undefined) {
          websocket._socket.removeListener("data", socketOnData);
          process.nextTick(resume, websocket._socket);
          websocket.close(err[kStatusCode]);
        }
        websocket.emit("error", err);
      }
      function receiverOnFinish() {
        this[kWebSocket].emitClose();
      }
      function receiverOnMessage(data) {
        this[kWebSocket].emit("message", data);
      }
      function receiverOnPing(data) {
        const websocket = this[kWebSocket];
        websocket.pong(data, !websocket._isServer, NOOP);
        websocket.emit("ping", data);
      }
      function receiverOnPong(data) {
        this[kWebSocket].emit("pong", data);
      }
      function resume(stream) {
        stream.resume();
      }
      function socketOnClose() {
        const websocket = this[kWebSocket];
        this.removeListener("close", socketOnClose);
        this.removeListener("data", socketOnData);
        this.removeListener("end", socketOnEnd);
        websocket._readyState = WebSocket.CLOSING;
        let chunk;
        if (
          !this._readableState.endEmitted &&
          !websocket._closeFrameReceived &&
          !websocket._receiver._writableState.errorEmitted &&
          (chunk = websocket._socket.read()) !== null
        ) {
          websocket._receiver.write(chunk);
        }
        websocket._receiver.end();
        this[kWebSocket] = undefined;
        clearTimeout(websocket._closeTimer);
        if (
          websocket._receiver._writableState.finished ||
          websocket._receiver._writableState.errorEmitted
        ) {
          websocket.emitClose();
        } else {
          websocket._receiver.on("error", receiverOnFinish);
          websocket._receiver.on("finish", receiverOnFinish);
        }
      }
      function socketOnData(chunk) {
        if (!this[kWebSocket]._receiver.write(chunk)) {
          this.pause();
        }
      }
      function socketOnEnd() {
        const websocket = this[kWebSocket];
        websocket._readyState = WebSocket.CLOSING;
        websocket._receiver.end();
        this.end();
      }
      function socketOnError() {
        const websocket = this[kWebSocket];
        this.removeListener("error", socketOnError);
        this.on("error", NOOP);
        if (websocket) {
          websocket._readyState = WebSocket.CLOSING;
          this.destroy();
        }
      }
    },
    1098: (module) => {
      module.exports = eval("require")("bufferutil");
    },
    5643: (module) => {
      module.exports = eval("require")("utf-8-validate");
    },
    3344: (module) => {
      "use strict";
      module.exports = require("./package.json");
    },
    5317: (module) => {
      "use strict";
      module.exports = require("child_process");
    },
    6982: (module) => {
      "use strict";
      module.exports = require("crypto");
    },
    4434: (module) => {
      "use strict";
      module.exports = require("events");
    },
    9896: (module) => {
      "use strict";
      module.exports = require("fs");
    },
    8611: (module) => {
      "use strict";
      module.exports = require("http");
    },
    5692: (module) => {
      "use strict";
      module.exports = require("https");
    },
    9278: (module) => {
      "use strict";
      module.exports = require("net");
    },
    857: (module) => {
      "use strict";
      module.exports = require("os");
    },
    6928: (module) => {
      "use strict";
      module.exports = require("path");
    },
    3480: (module) => {
      "use strict";
      module.exports = require("querystring");
    },
    2203: (module) => {
      "use strict";
      module.exports = require("stream");
    },
    4756: (module) => {
      "use strict";
      module.exports = require("tls");
    },
    7016: (module) => {
      "use strict";
      module.exports = require("url");
    },
    9023: (module) => {
      "use strict";
      module.exports = require("util");
    },
    3106: (module) => {
      "use strict";
      module.exports = require("zlib");
    },
    8214: (__unused_webpack_module, exports) => {
      "use strict";
      var replace = "".replace;
      var ca = /[&<>'"]/g;
      var es = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34);/g;
      var esca = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      };
      var unes = {
        "&amp;": "&",
        "&#38;": "&",
        "&lt;": "<",
        "&#60;": "<",
        "&gt;": ">",
        "&#62;": ">",
        "&apos;": "'",
        "&#39;": "'",
        "&quot;": '"',
        "&#34;": '"',
      };
      function escape(es) {
        return replace.call(es, ca, pe);
      }
      exports.escape = escape;
      function unescape(un) {
        return replace.call(un, es, cape);
      }
      exports.unescape = unescape;
      function pe(m) {
        return esca[m];
      }
      function cape(m) {
        return unes[m];
      }
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
  var __webpack_exports__ = __nccwpck_require__(8791);
  module.exports = __webpack_exports__;
})();
