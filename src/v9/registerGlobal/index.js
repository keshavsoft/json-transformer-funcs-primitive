import meta from "./meta.js";

const registerGlobal = (definition) => {
    if (typeof globalThis === "undefined" || !definition) return;

    globalThis.ks ??= {};

    // Direct access shortcut
    globalThis.ks.applyTemplate ??= definition;

    // Transformer funcs family tree
    globalThis.ks.transformerFuncs ??= {};
    globalThis.ks.transformerFuncs.primitive = {
        meta,
        applyTemplate: definition
    };
};

export { registerGlobal, meta };
export default registerGlobal;
