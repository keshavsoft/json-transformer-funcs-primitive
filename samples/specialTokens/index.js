import applyTemplate from "../../src/index.js";
import data from "./data.json" with { type: "json" };
import template from "./template.json" with { type: "json" };

console.log("=== Special Token: ${agg:count} ===");
const countResult = applyTemplate(data, template);
console.log(JSON.stringify(countResult, null, 2));

console.log("\n=== Special Token: ${rowValue} ===");
const rawValueTemplate = {
  tagName: "td",
  attributes: { "data-role": "cell-raw" },
  textContent: "${rowValue}"
};
const rawValueData = { rowData: { id: 101, name: "Item A", price: 49.99 } };
const rawResult = applyTemplate(rawValueData, rawValueTemplate);
console.log(rawResult);
