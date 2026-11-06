let editor = null;

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

function setEditorContent(content, filename = "file.json") {
    if (!editor || !window.monaco) return;

    const language = filename.endsWith(".js") ? "javascript" : "json";
    const model = window.monaco.editor.createModel(content, language);
    editor.setModel(model);

    const label = document.getElementById("activeFileName");
    if (label) {
        label.textContent = filename;
    }
}

async function initMonaco() {
    const monaco = await loadMonaco();

    const container = document.getElementById("jsonEditor");
    if (!container) {
        console.error("DOM container #jsonEditor not found");
        return null;
    }

    // Blank initial state with zero predefined files
    const defaultModel = monaco.editor.createModel("{\n  \n}", "json");

    editor = monaco.editor.create(container, {
        theme: "vs-dark",
        model: defaultModel,
        automaticLayout: true,
        tabSize: 2,
        fontSize: 13,
        minimap: { enabled: false },
        scrollBeyondLastLine: false
    });

    const label = document.getElementById("activeFileName");
    if (label) {
        label.textContent = "No file selected";
    }

    return editor;
}

export default initMonaco;
export { initMonaco, editor, setEditorContent };
