let editor = null;

const models = {
    columns: null,
    template: null,
    output: null
};

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

function activateTab(tabId, model) {
    if (editor && model) {
        editor.setModel(model);
    }

    const tabIds = ["tabColumns", "tabTemplate", "tabOutput"];
    for (const id of tabIds) {
        const el = document.getElementById(id);
        if (el) {
            el.classList.toggle("active", id === tabId);
        }
    }
}

async function initMonaco() {
    const monaco = await loadMonaco();

    models.columns = monaco.editor.createModel("[]\n", "json");
    models.template = monaco.editor.createModel("{}\n", "json");
    models.output = monaco.editor.createModel("[]\n", "json");

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

