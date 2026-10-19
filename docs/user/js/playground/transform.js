import renderAstToDom from "./domRender.js";
import updateInspector from "./inspector.js";

/**
 * Executes applyTemplate with live performance timing, DOM rendering, and error handling.
 */
export const executeTransform = ({
    engine,
    dataEditor,
    templateEditor,
    resultEditor,
    domPreviewBox,
    inspectorContent,
    statusDot,
    statusText,
    timingText
}) => {
    try {
        const rawData = JSON.parse(dataEditor.value);
        let rawTemplate;
        try {
            rawTemplate = JSON.parse(templateEditor.value);
        } catch {
            rawTemplate = templateEditor.value;
        }

        const start = performance.now();
        // Prefer global window.ks shortcut to verify live registration, falling back to loaded engine
        const fn = (window.ks && window.ks.applyTemplate) || engine;
        const result = fn(rawData, rawTemplate);
        const duration = (performance.now() - start).toFixed(2);

        resultEditor.value = typeof result === "string"
            ? result
            : JSON.stringify(result, null, 2);

        // Render real DOM elements into preview box
        domPreviewBox.innerHTML = "";
        const domResult = renderAstToDom(result);
        if (domResult) domPreviewBox.appendChild(domResult);

        statusDot.className = "dot";
        statusText.textContent = "Resolved Successfully";
        timingText.textContent = `${duration}ms`;

        updateInspector(inspectorContent);
    } catch (err) {
        resultEditor.value = `Error: ${err.message}`;
        domPreviewBox.innerHTML = `<div class="alert alert-danger mb-0">${err.message}</div>`;
        statusDot.className = "dot error";
        statusText.textContent = err.message;
        timingText.textContent = "Failed";
    }
};

export default executeTransform;
