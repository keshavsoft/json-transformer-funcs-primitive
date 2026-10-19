export const card = {
    data: {
        cardClass: "card shadow-sm border border-secondary-subtle p-3",
        headerClass: "d-flex justify-content-between align-items-center mb-2",
        title: "Account Overview",
        badgeClass: "badge text-bg-success",
        badgeText: "Active SLA",
        bodyClass: "text-muted",
        description: "All enterprise services operating within standard SLA parameters."
    },
    template: {
        tagName: "div",
        attributes: { class: "${cardClass}", "data-role": "status-card" },
        children: [
            {
                tagName: "div",
                attributes: { class: "${headerClass}" },
                children: [
                    { tagName: "h5", attributes: { class: "mb-0 text-dark fw-bold" }, textContent: "${title}" },
                    { tagName: "span", attributes: { class: "${badgeClass}" }, textContent: "${badgeText}" }
                ]
            },
            {
                tagName: "div",
                attributes: { class: "${bodyClass}" },
                children: [
                    { tagName: "p", attributes: { class: "mb-0" }, textContent: "${description}" }
                ]
            }
        ]
    }
};

export default card;
