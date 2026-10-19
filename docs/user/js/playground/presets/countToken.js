export const countToken = {
    data: {
        widgetTitle: "Pending Approvals",
        rowData: ["Claim #101", "Claim #102", "Claim #105", "Claim #109"]
    },
    template: {
        tagName: "div",
        attributes: { class: "d-flex align-items-center justify-content-between p-3 border rounded bg-light" },
        children: [
            { tagName: "span", attributes: { class: "fw-bold text-dark" }, textContent: "${widgetTitle}:" },
            { tagName: "span", attributes: { class: "badge bg-danger rounded-pill fs-6" }, textContent: "${agg:count}" }
        ]
    }
};

export default countToken;
