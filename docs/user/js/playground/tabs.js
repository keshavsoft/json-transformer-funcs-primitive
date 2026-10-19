/**
 * Manages tab switching between JSON AST, Live DOM Preview, and window.ks Inspector.
 */
export const initTabs = ({ tabAst, tabDom, tabTree, resultEditor, domPreviewBox, inspectorContent, onInspect }) => {
    const switchTab = (mode) => {
        tabAst.classList.toggle("active", mode === "ast");
        tabDom.classList.toggle("active", mode === "dom");
        tabTree.classList.toggle("active", mode === "tree");

        resultEditor.style.display = mode === "ast" ? "block" : "none";
        domPreviewBox.style.display = mode === "dom" ? "block" : "none";
        inspectorContent.style.display = mode === "tree" ? "block" : "none";

        if (mode === "tree" && typeof onInspect === "function") {
            onInspect();
        }
    };

    tabAst.addEventListener("click", () => switchTab("ast"));
    tabDom.addEventListener("click", () => switchTab("dom"));
    tabTree.addEventListener("click", () => switchTab("tree"));

    return { switchTab };
};

export default initTabs;
