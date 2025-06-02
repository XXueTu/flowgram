(() => {
  "use strict";
  var __webpack_modules__ = {
    997: (module) => {
      /*!
       * ee-first
       * Copyright(c) 2014 Jonathan Ong
       * MIT Licensed
       */
      module.exports = first;
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
    21: (module, __unused_webpack_exports, __nccwpck_require__) => {
      /*!
       * on-finished
       * Copyright(c) 2013 Jonathan Ong
       * Copyright(c) 2014 Douglas Christopher Wilson
       * MIT Licensed
       */
      module.exports = onFinished;
      module.exports.isFinished = isFinished;
      var asyncHooks = tryRequireAsyncHooks();
      var first = __nccwpck_require__(997);
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
    290: (module) => {
      module.exports = require("async_hooks");
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
  var __webpack_exports__ = __nccwpck_require__(21);
  module.exports = __webpack_exports__;
})();
