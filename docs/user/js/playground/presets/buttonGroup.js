export const buttonGroup = {
    data: {
        saveClass: "btn btn-primary px-4",
        cancelClass: "btn btn-outline-secondary",
        saveLabel: "Submit Order",
        cancelLabel: "Cancel"
    },
    template: {
        tagName: "div",
        attributes: { class: "d-flex gap-2 justify-content-start" },
        children: [
            { tagName: "button", attributes: { type: "submit", class: "${saveClass}" }, textContent: "${saveLabel}" },
            { tagName: "button", attributes: { type: "button", class: "${cancelClass}" }, textContent: "${cancelLabel}" }
        ]
    }
};

export default buttonGroup;
