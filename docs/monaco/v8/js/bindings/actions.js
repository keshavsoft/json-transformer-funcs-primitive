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

function updateTargetDropdown() {
    const stage = document.getElementById("renderOutput");
    const targetSelect = document.getElementById("targetSelect");
    if (!stage || !targetSelect) return;

    const currentVal = targetSelect.value || "renderOutput";
    const foundIds = new Set(["renderOutput"]);

    targetSelect.innerHTML = `<option value="renderOutput">#renderOutput (Root Stage)</option>`;

    // Only scan within the right-side renderOutput stage, not the whole DOM
    const idNodes = stage.querySelectorAll("[id]");
    idNodes.forEach((node) => {
        const id = node.id;
        if (id && !foundIds.has(id)) {
            foundIds.add(id);
            const opt = document.createElement("option");
            opt.value = id;
            opt.textContent = `#${id} (${node.tagName.toLowerCase()})`;
            targetSelect.appendChild(opt);
        }
    });

    // Retain previous target selection if still present
    if (foundIds.has(currentVal)) {
        targetSelect.value = currentVal;
    } else {
        targetSelect.value = "renderOutput";
    }
}

export const actions = {
    // 📂 1. Open native system file picker
    openSystemFilePicker: () => {
        const fileInput = document.getElementById("fileInput");
        if (fileInput) {
            fileInput.value = "";
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

    // ⚡ 3. Center Render Button: Mount into selected Target ID & Harvest IDs
    render: () => {
        const stage = document.getElementById("renderOutput");
        if (!stage || !editor) return;

        try {
            const raw = editor.getValue();
            const parsed = JSON.parse(raw);

            // Determine target container from dropdown
            const targetSelect = document.getElementById("targetSelect");
            const targetId = targetSelect?.value || "renderOutput";
            const targetEl = document.getElementById(targetId) || stage;

            // Remove placeholder if targeting root for the first time
            const placeholder = stage.querySelector(".stage-placeholder");
            if (placeholder && targetEl === stage) {
                stage.innerHTML = "";
            }

            // Render AST or fallback data card
            if (parsed && typeof parsed === "object" && parsed.tagName) {
                const domNode = renderAstToDom(parsed);
                if (domNode) {
                    targetEl.appendChild(domNode);
                }
            } else {
                const card = document.createElement("div");
                card.className = "alert alert-success border shadow-sm p-3 mb-2";
                card.innerHTML = `
                    <div class="d-flex align-items-center gap-2 mb-2">
                        <i class="bi bi-check-circle-fill text-success fs-5"></i>
                        <strong>JSON Mounted into #${targetId}</strong>
                    </div>
                    <pre class="bg-dark text-light p-3 rounded font-monospace small mb-0">${JSON.stringify(parsed, null, 2)}</pre>
                `;
                targetEl.appendChild(card);
            }

            // 🎯 Harvest all IDs inside the right render tab and populate the dropdown
            updateTargetDropdown();

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
