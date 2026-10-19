/**
 * Dual loader for applyTemplate:
 * 1. Attempts to import local repository src/index.js when running in local dev.
 * 2. Automatically falls back to the live npm CDN on GitHub Pages (where /src is not deployed).
 */
export const loadEngine = async () => {
    try {
        const mod = await import("../../../../src/index.js");
        return mod.default || mod.startFunc || mod;
    } catch (err) {
        console.warn("Local src not available (GitHub Pages). Loading from jsDelivr CDN...", err);
        const mod = await import("https://cdn.jsdelivr.net/npm/json-transformer-funcs-primitive@latest/+esm");
        return mod.default || mod.startFunc || mod;
    }
};

export default loadEngine;
