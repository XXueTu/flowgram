function ignoreCssLoader(source) {
    return (null === this || void 0 === this || this.cacheable(!0), source.includes('___CSS_LOADER_EXPORT___')) ? '' : source;
}
export { ignoreCssLoader as default };
