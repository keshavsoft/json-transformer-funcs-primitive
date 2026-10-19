import loadEngine from "./loader.js";
import presets from "./presets/index.js";
import initTabs from "./tabs.js";
import executeTransform from "./transform.js";
import updateInspector from "./inspector.js";

const initPlayground = async () => {
    const dataEditor = document.getElementById("dataEditor");
    const templateEditor = document.getElementById("templateEditor");
    const resultEditor = document.getElementById("resultEditor");
    const domPreviewBox = document.getElementById("domPreviewBox");
    const inspectorContent = document.getElementById("inspectorContent");
    const presetSelect = document.getElementById("presetSelect");
    const runBtn = document.getElementById("runBtn");
    const copyBtn = document.getElementById("copyBtn");
    const statusDot = document.getElementById("statusDot");
    const statusText = document.getElementById("statusText");
    const timingText = document.getElementById("timingText");

    const tabAst = document.getElementById("tabAst");
    const tabDom = document.getElementById("tabDom");
    const tabTree = document.getElementById("tabTree");

    // 1. Load engine (dual-loader: local src -> CDN fallback)
    const engine = await loadEngine();

    // 2. Initialize output pane tabs
    initTabs({
        tabAst,
        tabDom,
        tabTree,
        resultEditor,
        domPreviewBox,
        inspectorContent,
        onInspect: () => updateInspector(inspectorContent)
    });

    const run = () => {
        executeTransform({
            engine,
            dataEditor,
            templateEditor,
            resultEditor,
            domPreviewBox,
            inspectorContent,
            statusDot,
            statusText,
            timingText
        });
    };

    const loadPreset = (name) => {
        const preset = presets[name];
        if (!preset) return;
        dataEditor.value = JSON.stringify(preset.data, null, 2);
        templateEditor.value = typeof preset.template === "string"
            ? preset.template
            : JSON.stringify(preset.template, null, 2);
        run();
    };

    // 3. Bind UI event listeners
    presetSelect.addEventListener("change", (e) => loadPreset(e.target.value));
    runBtn.addEventListener("click", run);
    dataEditor.addEventListener("input", run);
    templateEditor.addEventListener("input", run);

    // Ctrl+Enter or Cmd+Enter to run
    window.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            run();
        }
    });

    // 1-Click Clipboard copy button
    copyBtn.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(resultEditor.value);
            copyBtn.innerHTML = "<span>✓</span> Copied!";
            setTimeout(() => {
                copyBtn.innerHTML = "<span>📋</span> Copy AST";
            }, 1500);
        } catch (err) {
            console.error("Copy failed: ", err);
        }
    });

    // 4. Initial load with default preset
    loadPreset("card");
};

// Auto-run on DOM ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPlayground);
} else {
    initPlayground();
}

export { initPlayground };
export default initPlayground;
