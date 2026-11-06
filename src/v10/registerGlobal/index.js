import meta from "./meta.js";

const registerGlobal = (definition) => {
    if (typeof globalThis === "undefined" || !definition) return;

    // globalThis.ks ??= {};

    // Direct access shortcut
    // globalThis.ks.applyTemplate ??= definition;

    globalThis.ks ??= {};
    globalThis.ks.transformer ??= {};
    globalThis.ks.transformer.funcs ??= {};

    // Transformer funcs family tree
    // globalThis.ks.transformerFuncs ??= {};
    globalThis.ks.transformer.funcs.primitive = {
        meta,
        applyTemplate: definition
    };
};

export { registerGlobal, meta };
export default registerGlobal;
