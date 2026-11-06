let editor = null;

const models = {
    columns: null,
    template: null,
    output: null,
    spec: null
};

// Compatibility getter/setter for specJson
Object.defineProperty(models, "specJson", {
    get: () => models.spec,
    set: (val) => { models.spec = val; },
    enumerable: true,
    configurable: true
});

function loadMonaco() {
    return new Promise((resolve, reject) => {
        if (window.monaco && window.monaco.editor) {
            resolve(window.monaco);
            return;
        }

        require.config({
            paths: {
                vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs"
            }
        });

        require(["vs/editor/editor.main"], () => resolve(window.monaco), reject);
    });
}

/**
 * Universal Tab Activator
 * Accepts any of:
 * 1. Model key: "columns" | "template" | "output" | "spec"
 * 2. Clicked Element: matchElement (from dom-primitive-bindings)
 * 3. Legacy Tab ID: "tabColumns" | "tabTemplate" | "tabOutput" | "specOutput"
 */
function activateTab(target, optionalModel) {
    let modelKey = target;
    let targetEl = null;

    if (target instanceof Element) {
        targetEl = target;
        modelKey = target.dataset.model || target.id;
    } else if (typeof target === "string") {
        targetEl = document.querySelector(`.editor-tabs [data-model="${target}"]`) 
                || document.getElementById(target);
        if (targetEl && targetEl.dataset.model) {
            modelKey = targetEl.dataset.model;
        }
    }

    const model = optionalModel || models[modelKey];
    if (editor && model) {
        editor.setModel(model);
    }

    // Dynamic, array-free active class toggle across all tabs
    document.querySelectorAll(".editor-tabs .tab-item").forEach(tab => {
        const isActive = tab === targetEl 
                      || (modelKey && tab.dataset.model === modelKey) 
                      || (typeof target === "string" && tab.id === target);
        tab.classList.toggle("active", Boolean(isActive));
    });
}

async function initMonaco() {
    const monaco = await loadMonaco();

    models.columns = monaco.editor.createModel("[]\n", "json");
    models.template = monaco.editor.createModel("{}\n", "json");
    models.output = monaco.editor.createModel("[]\n", "json");
    models.spec = monaco.editor.createModel("[]\n", "json");

    editor = monaco.editor.create(document.getElementById("jsonEditor"), {
        theme: "vs-dark",
        model: models.columns,
        automaticLayout: true,
        tabSize: 2,
        fontSize: 13,
        minimap: { enabled: false },
        scrollBeyondLastLine: false
    });

    return editor;
}

export default initMonaco;
export { initMonaco, editor, models, activateTab };
