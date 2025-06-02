import * as __WEBPACK_EXTERNAL_MODULE__hmr_702ad2d3__ from "./hmr";
function _define_property(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
const { HTMLElement = class {
}, customElements } = 'undefined' != typeof window ? window : globalThis;
class ErrorOverlay extends HTMLElement {
    constructor(html){
        var _this;
        var _root_querySelector, _root_querySelector1;
        super(), _this = this, _define_property(this, "close", function() {
            let immediate = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : false;
            const remove = ()=>{
                var _this_parentNode;
                return null == (_this_parentNode = _this.parentNode) ? void 0 : _this_parentNode.removeChild(_this);
            };
            if (_this.animate && true !== immediate) _this.animate([
                {
                    opacity: 1
                },
                {
                    opacity: 0
                }
            ], {
                duration: 300,
                easing: 'ease-out'
            }).addEventListener('finish', remove);
            else remove();
        });
        if (!this.attachShadow) return void console.warn('[Rsbuild] Current browser version does not support displaying error overlay');
        const root = this.attachShadow({
            mode: 'open'
        });
        root.innerHTML = html;
        null == (_root_querySelector = root.querySelector('.close')) || _root_querySelector.addEventListener('click', this.close);
        this.addEventListener('click', this.close);
        null == (_root_querySelector1 = root.querySelector('.container')) || _root_querySelector1.addEventListener('click', (e)=>{
            if (e.target) {
                const { file } = e.target.dataset;
                if (file) fetch(`/__open-in-editor?file=${encodeURIComponent(file)}`);
            }
            e.stopPropagation();
        });
        const onEscKeydown = (e)=>{
            if ('Escape' === e.key || 'Escape' === e.code) this.close();
            document.removeEventListener('keydown', onEscKeydown);
        };
        document.addEventListener('keydown', onEscKeydown);
    }
}
const overlayId = 'rsbuild-error-overlay';
if (customElements && !customElements.get(overlayId)) customElements.define(overlayId, ErrorOverlay);
function createOverlay(html) {
    clearOverlay();
    document.body.appendChild(new ErrorOverlay(html));
}
function clearOverlay() {
    document.querySelectorAll(overlayId).forEach((n)=>n.close(true));
}
if ('undefined' != typeof document) (0, __WEBPACK_EXTERNAL_MODULE__hmr_702ad2d3__.registerOverlay)(createOverlay, clearOverlay);
else console.info('[Rsbuild] Failed to display error overlay as document is not available, you can disable the `dev.client.overlay` option.');
