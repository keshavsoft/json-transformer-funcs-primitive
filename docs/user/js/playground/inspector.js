/**
 * Inspects the live window.ks global tree and updates the inspector panel.
 */
export const updateInspector = (containerEl) => {
    if (!containerEl) return;
    if (!window.ks) {
        containerEl.innerHTML = `<div style="color: #ef4444; padding: 12px;">window.ks is not initialized</div>`;
        return;
    }

    const prim = window.ks.transformerFuncs?.primitive;
    containerEl.innerHTML = `
        <div class="inspector-row">
            <span class="inspector-key">window.ks.applyTemplate</span>
            <span class="inspector-val">[Function: applyTemplate]</span>
        </div>
        <div class="inspector-row">
            <span class="inspector-key">window.ks.transformerFuncs.primitive.meta</span>
            <span class="inspector-val">${JSON.stringify(prim?.meta || {}, null, 2)}</span>
        </div>
        <div class="inspector-row">
            <span class="inspector-key">window.ks["json-transformer-funcs-primitive"]</span>
            <span class="inspector-val">{ meta, applyTemplate }</span>
        </div>
        <div class="inspector-row">
            <span class="inspector-key">Status</span>
            <span class="inspector-val" style="color: #10b981;">Ready &bull; Type: ${typeof window.ks.applyTemplate}</span>
        </div>
    `;
};

export default updateInspector;
