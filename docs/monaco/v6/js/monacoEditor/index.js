let editor = null;

const models = {
    "template.json": null,
    "column.json": null
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

function showFile(filename) {
    if (editor && models[filename]) {
        editor.setModel(models[filename]);
        const label = document.getElementById("activeFileName");
        if (label) {
            label.textContent = filename;
        }
    }
}

async function initMonaco() {
    const monaco = await loadMonaco();

    // Preload the two JSON files
    try {
        const [tplRes, colRes] = await Promise.all([
            fetch("./template.json"),
            fetch("./column.json")
        ]);

        const [tplText, colText] = await Promise.all([
            tplRes.text(),
            colRes.text()
        ]);

        models["template.json"] = monaco.editor.createModel(tplText, "json");
        models["column.json"] = monaco.editor.createModel(colText, "json");
    } catch (err) {
        console.warn("Could not preload json files, creating empty models:", err);
        models["template.json"] = models["template.json"] || monaco.editor.createModel("{}\n", "json");
        models["column.json"] = models["column.json"] || monaco.editor.createModel("{}\n", "json");
    }

    const container = document.getElementById("jsonEditor");
    if (!container) {
        console.error("DOM container #jsonEditor not found");
        return null;
    }

    editor = monaco.editor.create(container, {
        theme: "vs-dark",
        model: models["template.json"],
        automaticLayout: true,
        tabSize: 2,
        fontSize: 13,
        minimap: { enabled: false },
        scrollBeyondLastLine: false
    });

    const label = document.getElementById("activeFileName");
    if (label) {
        label.textContent = "template.json";
    }

    return editor;
}

export default initMonaco;
export { initMonaco, editor, models, showFile };
