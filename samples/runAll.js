import applyTemplate from "../src/index.js";
import simpleData from "./simple/data.json" with { type: "json" };
import simpleTemplate from "./simple/template.json" with { type: "json" };
import cardData from "./nestedCard/data.json" with { type: "json" };
import cardTemplate from "./nestedCard/template.json" with { type: "json" };
import tokenData from "./specialTokens/data.json" with { type: "json" };
import tokenTemplate from "./specialTokens/template.json" with { type: "json" };

console.log("--------------------------------------------------");
console.log("Running json-transformer-funcs-primitive Samples");
console.log("--------------------------------------------------\n");

// 1. Simple element test
console.log("1. Testing Simple Element...");
const res1 = applyTemplate(simpleData, simpleTemplate);
if (res1.attributes.class !== "badge bg-primary fs-6" || res1.textContent !== "Status: Active") {
  throw new Error("Sample 1 Failed!");
}
console.log("   ✓ Simple Element passed.");

// 2. Nested Card test
console.log("2. Testing Nested Card Component...");
const res2 = applyTemplate(cardData, cardTemplate);
if (res2.attributes.class !== "card shadow-sm border-0") {
  throw new Error("Sample 2 Root Class Failed!");
}
if (res2.children[0].children[0].textContent !== "Account Settings") {
  throw new Error("Sample 2 Nested Title Failed!");
}
console.log("   ✓ Nested Card Component passed.");

// 3. Special token tests
console.log("3. Testing Special Tokens...");
const res3 = applyTemplate(tokenData, tokenTemplate);
if (res3.children[1].textContent !== 4) {
  throw new Error("Sample 3 ${agg:count} Failed!");
}
const res3b = applyTemplate({ rowData: { test: true } }, "${rowValue}");
if (res3b.test !== true) {
  throw new Error("Sample 3 ${rowValue} Failed!");
}
console.log("   ✓ Special Tokens passed.");

// 4. Guard validations
console.log("4. Testing Guard Validations...");
let guard1Passed = false;
try {
  applyTemplate(null, simpleTemplate);
} catch (e) {
  guard1Passed = e instanceof TypeError;
}
if (!guard1Passed) throw new Error("Guard 1 (null inElement) Failed!");

let guard2Passed = false;
try {
  applyTemplate(simpleData, null);
} catch (e) {
  guard2Passed = e instanceof TypeError;
}
if (!guard2Passed) throw new Error("Guard 2 (null inTemplate) Failed!");
console.log("   ✓ Guard Validations passed.");

console.log("\n==================================================");
console.log("🎉 ALL SAMPLES & VERIFICATIONS PASSED SUCCESSFULLY!");
console.log("==================================================");
