const compilationId = RSBUILD_COMPILATION_NAME;
const hmr_config = RSBUILD_CLIENT_CONFIG;
const resolvedConfig = RSBUILD_RESOLVED_CLIENT_CONFIG;
function formatURL(config) {
    const { location } = self;
    const hostname = config.host || location.hostname;
    const port = config.port || location.port;
    const protocol = config.protocol || ('https:' === location.protocol ? 'wss' : 'ws');
    const pathname = config.path || '/rsbuild-hmr';
    if ('undefined' != typeof URL) {
        const url = new URL('http://localhost');
        url.port = String(port);
        url.hostname = hostname;
        url.protocol = protocol;
        url.pathname = pathname;
        url.searchParams.append('compilationId', compilationId);
        return url.toString();
    }
    const colon = -1 === protocol.indexOf(':') ? ':' : '';
    return `${protocol}${colon}//${hostname}:${port}${pathname}`;
}
let isFirstCompilation = true;
let lastCompilationHash = null;
let hasCompileErrors = false;
function clearOutdatedErrors() {
    if (console.clear && hasCompileErrors) console.clear();
}
let createOverlay;
let clearOverlay;
const registerOverlay = (createFn, clearFn)=>{
    createOverlay = createFn;
    clearOverlay = clearFn;
};
function handleSuccess() {
    clearOutdatedErrors();
    const isHotUpdate = !isFirstCompilation;
    isFirstCompilation = false;
    hasCompileErrors = false;
    if (isHotUpdate) tryApplyUpdates();
}
function handleWarnings(param) {
    let { text } = param;
    clearOutdatedErrors();
    const isHotUpdate = !isFirstCompilation;
    isFirstCompilation = false;
    hasCompileErrors = false;
    for(let i = 0; i < text.length; i++){
        if (5 === i) {
            console.warn('There were more warnings in other files, you can find a complete log in the terminal.');
            break;
        }
        console.warn(text[i]);
    }
    if (isHotUpdate) tryApplyUpdates();
}
function handleErrors(param) {
    let { text, html } = param;
    clearOutdatedErrors();
    isFirstCompilation = false;
    hasCompileErrors = true;
    for (const error of text)console.error(error);
    if (createOverlay) createOverlay(html);
}
const isUpdateAvailable = ()=>lastCompilationHash !== __webpack_hash__;
const handleApplyUpdates = (err, updatedModules)=>{
    const forcedReload = err || !updatedModules;
    if (forcedReload) {
        if (err) console.error('[HMR] Forced reload caused by: ', err);
        reloadPage();
        return;
    }
    if (isUpdateAvailable()) tryApplyUpdates();
};
function tryApplyUpdates() {
    if (!isUpdateAvailable()) return;
    if (import.meta.webpackHot) {
        if ('idle' !== import.meta.webpackHot.status()) return;
        import.meta.webpackHot.check(true).then((updatedModules)=>handleApplyUpdates(null, updatedModules), (err)=>handleApplyUpdates(err, null));
        return;
    }
    reloadPage();
}
let connection = null;
let reconnectCount = 0;
function onOpen() {
    console.info('[HMR] connected.');
}
function onMessage(e) {
    const message = JSON.parse(e.data);
    if (message.compilationId && message.compilationId !== compilationId) return;
    switch(message.type){
        case 'hash':
            lastCompilationHash = message.data;
            if (clearOverlay && isUpdateAvailable()) clearOverlay();
            break;
        case 'ok':
            handleSuccess();
            break;
        case 'static-changed':
        case 'content-changed':
            reloadPage();
            break;
        case 'warnings':
            handleWarnings(message.data);
            break;
        case 'errors':
            handleErrors(message.data);
            break;
    }
}
function onClose() {
    if (reconnectCount >= hmr_config.reconnect) {
        if (hmr_config.reconnect > 0) console.info('[HMR] connection failure after maximum reconnect limit exceeded.');
        return;
    }
    console.info('[HMR] disconnected. Attempting to reconnect.');
    removeListeners();
    connection = null;
    reconnectCount++;
    setTimeout(connect, 1000 * 1.5 ** reconnectCount);
}
function onError() {
    if (formatURL(hmr_config) !== formatURL(resolvedConfig)) {
        console.error('[HMR] WebSocket connection error, attempting direct fallback.');
        removeListeners();
        connection = null;
        connect(true);
    }
}
function connect() {
    let fallback = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : false;
    const socketUrl = formatURL(fallback ? resolvedConfig : hmr_config);
    connection = new WebSocket(socketUrl);
    connection.addEventListener('open', onOpen);
    connection.addEventListener('close', onClose);
    connection.addEventListener('message', onMessage);
    if (!fallback) connection.addEventListener('error', onError);
}
function removeListeners() {
    if (connection) {
        connection.removeEventListener('open', onOpen);
        connection.removeEventListener('close', onClose);
        connection.removeEventListener('message', onMessage);
        connection.removeEventListener('error', onError);
    }
}
function reloadPage() {
    if (RSBUILD_DEV_LIVE_RELOAD) window.location.reload();
}
connect();
export { registerOverlay };
