export const formField = {
    data: {
        fieldId: "user-name",
        label: "Full Name",
        placeholder: "e.g. Marie Curie",
        inputClass: "form-control",
        helpText: "Enter your legal name as shown on passport."
    },
    template: {
        tagName: "div",
        attributes: { class: "mb-3" },
        children: [
            {
                tagName: "label",
                attributes: { for: "${fieldId}", class: "form-label fw-bold text-dark" },
                textContent: "${label}"
            },
            {
                tagName: "input",
                attributes: {
                    type: "text",
                    id: "${fieldId}",
                    class: "${inputClass}",
                    placeholder: "${placeholder}"
                }
            },
            {
                tagName: "div",
                attributes: { class: "form-text" },
                textContent: "${helpText}"
            }
        ]
    }
};

export default formField;
