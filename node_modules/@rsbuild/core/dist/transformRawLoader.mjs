let transformRawLoader = async function(source, map) {
    var _this__compiler___rsbuildTransformer, _this__compiler;
    let callback = this.async(), bypass = ()=>callback(null, source, map), { id: transformId, getEnvironment } = this.getOptions();
    if (!transformId) return bypass();
    let transform = null == (_this__compiler = this._compiler) || null == (_this__compiler___rsbuildTransformer = _this__compiler.__rsbuildTransformer) ? void 0 : _this__compiler___rsbuildTransformer[transformId];
    if (!transform) return bypass();
    try {
        let result = await transform({
            code: source,
            context: this.context,
            resource: this.resource,
            resourcePath: this.resourcePath,
            resourceQuery: this.resourceQuery,
            environment: getEnvironment(),
            addDependency: this.addDependency.bind(this),
            addMissingDependency: this.addMissingDependency.bind(this),
            addContextDependency: this.addContextDependency.bind(this),
            emitFile: this.emitFile.bind(this),
            importModule: this.importModule.bind(this),
            resolve: this.resolve.bind(this)
        });
        if (null == result) return bypass();
        if ('string' == typeof result) return callback(null, result, map);
        let useMap = null != map, finalMap = result.map ?? map;
        callback(null, result.code, useMap ? finalMap : void 0);
    } catch (error) {
        error instanceof Error ? callback(error) : callback(Error(String(error)));
    }
}, raw = !0;
export { transformRawLoader as default, raw };
