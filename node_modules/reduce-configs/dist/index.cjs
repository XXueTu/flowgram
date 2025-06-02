"use strict";
// The require scope
var __webpack_require__ = {};
/************************************************************************/ // webpack/runtime/define_property_getters
(()=>{
    __webpack_require__.d = function(exports1, definition) {
        for(var key in definition)if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports1, key)) Object.defineProperty(exports1, key, {
            enumerable: true,
            get: definition[key]
        });
    };
})();
// webpack/runtime/has_own_property
(()=>{
    __webpack_require__.o = function(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    };
})();
// webpack/runtime/make_namespace_object
(()=>{
    // define __esModule on exports
    __webpack_require__.r = function(exports1) {
        if ('undefined' != typeof Symbol && Symbol.toStringTag) Object.defineProperty(exports1, Symbol.toStringTag, {
            value: 'Module'
        });
        Object.defineProperty(exports1, '__esModule', {
            value: true
        });
    };
})();
/************************************************************************/ var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
    reduceConfigs: function() {
        return reduceConfigs;
    },
    reduceConfigsAsyncWithContext: function() {
        return reduceConfigsAsyncWithContext;
    },
    reduceConfigsMergeContext: function() {
        return reduceConfigsMergeContext;
    },
    reduceConfigsWithContext: function() {
        return reduceConfigsWithContext;
    }
});
const isNil = (o)=>null == o;
const isFunction = (func)=>'function' == typeof func;
const isObject = (obj)=>null !== obj && 'object' == typeof obj;
const isPlainObject = (obj)=>isObject(obj) && '[object Object]' === Object.prototype.toString.call(obj);
/**
 * Merge one or more configs into a final config,
 * and allow to modify the config object via a function.
 */ function reduceConfigs({ initial, config, mergeFn = Object.assign }) {
    if (isNil(config)) return initial;
    if (isPlainObject(config)) return isPlainObject(initial) ? mergeFn(initial, config) : config;
    if (isFunction(config)) return config(initial) ?? initial;
    if (Array.isArray(config)) return config.reduce((initial, config)=>reduceConfigs({
            initial,
            config,
            mergeFn
        }), initial);
    return config ?? initial;
}
/**
 * Merge one or more configs into a final config,
 * and allow to modify the config object via a function, the function accepts a context object.
 */ function reduceConfigsWithContext({ initial, config, ctx, mergeFn = Object.assign }) {
    if (isNil(config)) return initial;
    if (isPlainObject(config)) return isPlainObject(initial) ? mergeFn(initial, config) : config;
    if (isFunction(config)) return config(initial, ctx) ?? initial;
    if (Array.isArray(config)) return config.reduce((initial, config)=>reduceConfigsWithContext({
            initial,
            config,
            ctx,
            mergeFn
        }), initial);
    return config ?? initial;
}
/**
 * Merge one or more configs into a final config,
 * and allow to modify the config object via an async function, the function accepts a context object.
 */ async function reduceConfigsAsyncWithContext({ initial, config, ctx, mergeFn = Object.assign }) {
    if (isNil(config)) return initial;
    if (isPlainObject(config)) return isPlainObject(initial) ? mergeFn(initial, config) : config;
    if (isFunction(config)) return await config(initial, ctx) ?? initial;
    if (Array.isArray(config)) return config.reduce((initial, config)=>reduceConfigsWithContext({
            initial,
            config,
            ctx,
            mergeFn
        }), initial);
    return config ?? initial;
}
/**
 * Merge one or more configs into a final config,
 * and allow to modify the config object via an async function, the function accepts a merged object.
 */ function reduceConfigsMergeContext({ initial, config, ctx, mergeFn = Object.assign }) {
    if (isNil(config)) return initial;
    if (isPlainObject(config)) return isPlainObject(initial) ? mergeFn(initial, config) : config;
    if (isFunction(config)) return config({
        value: initial,
        ...ctx
    }) ?? initial;
    if (Array.isArray(config)) return config.reduce((initial, config)=>reduceConfigsMergeContext({
            initial,
            config,
            ctx,
            mergeFn
        }), initial);
    return config ?? initial;
}
var __webpack_export_target__ = exports;
for(var i in __webpack_exports__)__webpack_export_target__[i] = __webpack_exports__[i];
if (__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, '__esModule', {
    value: true
});
