import { editor, setEditorContent } from "../monacoEditor/index.js";

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
    // 📂 1. Open native system file picker
    openSystemFilePicker: () => {
        const fileInput = document.getElementById("fileInput");
        if (fileInput) {
            fileInput.value = ""; // Reset so same file can be re-selected
            fileInput.click();
        }
    },

    // 📄 2. Handle file selection from local system
    handleFileSelection: (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result;
            if (typeof content === "string") {
                setEditorContent(content, file.name);
            }
        };
        reader.readAsText(file);
    },

    // ⚡ 3. Center Render Button: compile and mount into right stage
    render: () => {
        const stage = document.getElementById("renderOutput");
        if (!stage || !editor) return;

        try {
            const raw = editor.getValue();
            const parsed = JSON.parse(raw);

            stage.innerHTML = "";

            // Check if it's a direct JSON-to-DOM AST node (has tagName)
            if (parsed && typeof parsed === "object" && parsed.tagName) {
                const domNode = renderAstToDom(parsed);
                if (domNode) stage.appendChild(domNode);
                return;
            }

            // Fallback for generic JSON structure
            const card = document.createElement("div");
            card.className = "alert alert-success border shadow-sm p-3 mb-0";
            card.innerHTML = `
                <div class="d-flex align-items-center gap-2 mb-2">
                    <i class="bi bi-check-circle-fill text-success fs-5"></i>
                    <strong>JSON Loaded Successfully</strong>
                </div>
                <pre class="bg-dark text-light p-3 rounded font-monospace small mb-0">${JSON.stringify(parsed, null, 2)}</pre>
            `;
            stage.appendChild(card);

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
