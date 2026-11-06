import { editor, models, showFile } from "../monacoEditor/index.js";

function getBootstrapModal() {
    const el = document.getElementById("fileModal");
    return el && window.bootstrap ? window.bootstrap.Modal.getOrCreateInstance(el) : null;
}

function renderAstToDom(node) {
    if (!node) return null;
    if (typeof node === "string") return document.createTextNode(node);
    if (typeof node === "number") return document.createTextNode(String(node));

    const el = document.createElement(node.tagName || "div");
    if (node.attributes) {
        for (const [k, v] of Object.entries(node.attributes)) {
            if (v !== undefined) el.setAttribute(k, v);
        }
    }
    if (node.textContent !== undefined) {
        el.textContent = node.textContent;
    }
    if (Array.isArray(node.children)) {
        for (const child of node.children) {
            const childDom = renderAstToDom(child);
            if (childDom) el.appendChild(childDom);
        }
    }
    return el;
}

export const actions = {
    // 📂 1. Open File Selection Modal
    openFileModal: () => {
        const modal = getBootstrapModal();
        if (modal) modal.show();
    },

    // 📄 2. Select template.json
    selectTemplate: () => {
        showFile("template.json");
        const modal = getBootstrapModal();
        if (modal) modal.hide();
    },

    // 📄 3. Select column.json
    selectColumn: () => {
        showFile("column.json");
        const modal = getBootstrapModal();
        if (modal) modal.hide();
    },

    // ⚡ 4. Center Render Button: Compile and Mount DOM
    render: () => {
        const stage = document.getElementById("renderOutput");
        if (!stage) return;

        try {
            const columnText = models["column.json"] ? models["column.json"].getValue() : "{}";
            const templateText = models["template.json"] ? models["template.json"].getValue() : "{}";

            const column = JSON.parse(columnText);
            const template = JSON.parse(templateText);

            let resolvedAST = null;
            if (window.ks?.transformer?.funcs?.primitive?.applyTemplate) {
                resolvedAST = window.ks.transformer.funcs.primitive.applyTemplate(column, template);
            } else if (typeof window.applyTemplate === "function") {
                resolvedAST = window.applyTemplate(column, template);
            } else {
                throw new Error("applyTemplate function not found in window.ks.transformer.funcs.primitive");
            }

            stage.innerHTML = "";
            const dom = renderAstToDom(resolvedAST);
            if (dom) {
                stage.appendChild(dom);
            }
        } catch (err) {
            console.error("Render error:", err);
            stage.innerHTML = `
                <div class="alert alert-danger font-monospace small" role="alert">
                    <strong><i class="bi bi-exclamation-triangle me-1"></i>Render Error:</strong>
                    <div class="mt-1">${err.message}</div>
                </div>`;
        }
    }
};

export default actions;
