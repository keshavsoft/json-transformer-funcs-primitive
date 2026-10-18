import applyTemplate from "../../src/index.js";
import data from "./data.json" with { type: "json" };
import template from "./template.json" with { type: "json" };

const result = applyTemplate(data, template);
console.log("=== Simple Element Sample ===");
console.log(JSON.stringify(result, null, 2));
