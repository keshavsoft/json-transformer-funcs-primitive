export const globalTree = {
    data: {
        engineStatus: "Connected",
        calledVia: "window.ks.transformerFuncs.primitive"
    },
    template: {
        tagName: "div",
        attributes: { class: "alert alert-success d-flex align-items-center gap-2 mb-0" },
        children: [
            { tagName: "strong", textContent: "Status: ${engineStatus}!" },
            { tagName: "span", textContent: "Dispatched through ${calledVia}" }
        ]
    }
};

export default globalTree;
