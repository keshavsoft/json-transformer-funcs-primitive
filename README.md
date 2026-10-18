# json-transformer-funcs-primitive

> **The Atom.** One data object + one JSON-to-DOM template = one fully-resolved, immutable element node.

[![npm](https://img.shields.io/npm/v/json-transformer-funcs-primitive)](https://www.npmjs.com/package/json-transformer-funcs-primitive)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)]()
[![tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)]()

---

## 📚 Extreme Documentation Portal

Experience the rich documentation portal and interactive in-browser playground:

* 📖 [**The Story & Ecosystem**](docs/index.html) — Mental model of The Data & The Mold.
* 📘 [**User Guide**](docs/user/index.html) — Contract signatures, guards, and parameter conventions.
* 🌳 [**Global Registry & Family Tree**](docs/user/global-registry.html) — Deep architectural tour of `window.ks` and the non-destructive registrant.
* 🔤 [**Token Reference**](docs/user/tokens.html) — Complete guide to `${key}`, multi-tokens, `${agg:count}`, and `${rowValue}`.
* 🍳 [**Enterprise Cookbook**](docs/user/examples.html) — Real-world recipes for cards, form fields, button toolbars, and microfrontends.
* 🧪 [**Live Interactive Studio**](docs/user/playground.html) — In-browser playground with live JSON AST generation, real-time DOM rendering, and live `window.ks` tree inspector!
* 🛠️ [**Developer Internals**](docs/developer/index.html) — v9 pipeline architecture, `registerGlobal/`, `meta.js`, and recursive AST cloning.

---

## 📖 The Big Picture: The Data & The Mold

In the **json-renderers** and **json-transformer-funcs** ecosystem, UI components are declared as pure, serializable JSON abstract syntax trees (ASTs). 

Before rendering to the real DOM, these templates need to be populated with dynamic values (CSS classes, labels, IDs, data attributes, counts).

Think of it this way:

* **The Mold (`inTemplate`)**: The structural blueprint of the HTML element containing `${placeholder}` tokens in its tag, attributes, textContent, or nested children.
* **The Filling (`inElement`)**: A plain data dictionary providing the dynamic values for those tokens.
* **The Engine (`applyTemplate`)**: Injects the data into the mold with zero side-effects, returning an immutable, fully resolved element tree.

```
       inElement (Data Dictionary)           inTemplate (The Mold)
        { "title": "Save", "btnClass": "btn-primary" }     { "tagName": "button", "attributes": { "class": "${btnClass}" }, "textContent": "${title}" }
                    │                                             │
                    └──────────────────────┬──────────────────────┘
                                           │
                                           ▼
                                 applyTemplate(...)
                                           │
                                           ▼
                               Resolved Element JSON AST
           { "tagName": "button", "attributes": { "class": "btn-primary" }, "textContent": "Save" }
```

---

## ⚡ Quick Start

### Installation

```bash
npm install json-transformer-funcs-primitive
```

### Basic Example (ES Module)

```javascript
import applyTemplate from "json-transformer-funcs-primitive";

const data = {
  className: "badge text-bg-success",
  statusText: "Connected"
};

const template = {
  tagName: "span",
  attributes: {
    class: "${className}",
    "data-status": "${statusText}"
  },
  textContent: "Status: ${statusText}"
};

const element = applyTemplate(data, template);
console.log(element);
```

**Output:**
```json
{
  "tagName": "span",
  "attributes": {
    "class": "badge text-bg-success",
    "data-status": "Connected"
  },
  "textContent": "Status: Connected"
}
```

---

## 🌲 Global Registry: The `window.ks` Family Tree

Starting in **v1.9.0**, `json-transformer-funcs-primitive` automatically registers onto `globalThis.ks` (or `window.ks` in browsers) into a structured transformer family tree:

```
window.ks
├── applyTemplate(inElement, inTemplate)            <-- Direct Shortcut
├── transformerFuncs
│   └── primitive                                    <-- Family Tree Branch
│       ├── meta { name, version }
│       └── applyTemplate
└── ["json-transformer-funcs-primitive"]           <-- Package Key Lookup
    ├── meta { name, version }
    └── applyTemplate
```

### Consuming via the Tree:

```javascript
// 1. Direct shortcut
const node = window.ks.applyTemplate(data, template);

// 2. Family tree call with version metadata
const { meta, applyTemplate } = window.ks.transformerFuncs.primitive;
console.log(`Using ${meta.name} v${meta.version}`);
const node = applyTemplate(data, template);
```

---

## 🔍 Function Signature

```javascript
import applyTemplate from "json-transformer-funcs-primitive";

const resolved = applyTemplate(inElement, inTemplate, showLog);
```

### Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `inElement` | `Object` | **Yes** | Plain object dictionary providing values for `${tokens}`. |
| `inTemplate` | `Object` \| `String` | **Yes** | JSON-to-DOM template node or template string to interpolate. |
| `showLog` | `Boolean` | No | Optional debug flag to log incoming arguments to console. |

**Returns:** `Object | String | Number` — A fresh, cloned object with all matching placeholders replaced.

---

## 🛡️ Strict Guards & Invariants

The engine protects your pipeline with strict, non-negotiable guards (throwing `TypeError` on contract violation):

| Input Condition | Thrown Error | Rationale |
| :--- | :--- | :--- |
| `inTemplate === null` or `undefined` | `TypeError: inTemplate is undefined or null` | Prevents operating on missing blueprints. |
| `typeof inTemplate !== "object"` and `!== "string"` | `TypeError: inTemplate is not an object or string` | Blueprint must be a valid AST or string. |
| `!inElement` or `typeof inElement !== "object"` | `TypeError: inElement is not an object` | Data source must be a valid dictionary. |
| `Array.isArray(inElement)` | `TypeError: inElement is an array` | Arrays belong in 1D/2D mappers, not the primitive atom. |

### Immutability Guarantee
`applyTemplate` **never** mutates your original `inTemplate`. It immediately executes:
```javascript
const localClonedTemplate = structuredClone(localTemplate);
```
Guaranteeing complete immutability across repeated calls and shared caches.

---

## 🌟 Special Built-in Tokens

### 1. `${agg:count}` (Numeric Row Counter)
When `inTemplate` is exactly `"${agg:count}"` and `inElement.rowData` is an Array, the engine returns the **numeric length** of the array rather than a string:

```javascript
const data = {
  rowData: ["Alice", "Bob", "Charlie", "Diana"]
};

const template = {
  tagName: "span",
  attributes: { class: "badge bg-info" },
  textContent: "${agg:count}"
};

const result = applyTemplate(data, template);
// result.textContent === 4  (number, not string!)
```

### 2. `${rowValue}` (Raw Object Extraction)
When `inTemplate` is exactly `"${rowValue}"` and `inElement.rowData` exists, the engine returns the **raw data value** directly (even if it is an object):

```javascript
const data = {
  rowData: { id: 101, sku: "A-992", stock: 45 }
};

const result = applyTemplate(data, "${rowValue}");
// result === { id: 101, sku: "A-992", stock: 45 }
```

---

## 🌐 The Ecosystem Hierarchy

`json-transformer-funcs-primitive` is the foundational atom of the KeshavSoft transformation suite:

```
┌─────────────────────────────────────────────────────────────┐
│                 json-renderers-build-form                   │  High-level Form Spec Builder
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   json-transformer-funcs                    │  Full Umbrella Toolkit
│  ├── 1D Engine:  json-transformer-funcs-one-dimension       │
│  ├── 2D Engine:  json-transformer-funcs-two-dimensions      │
│  └── Primitive:  json-transformer-funcs-primitive ◄─────────┼── (YOU ARE HERE)
└─────────────────────────────────────────────────────────────┘
```

| Engine | Responsibility | Cardinality |
| :--- | :--- | :--- |
| **`json-transformer-funcs-primitive`** | Resolves tokens on a single element node | `1 Data Object + 1 Template -> 1 Node` |
| **`json-transformer-funcs-one-dimension`** | Maps array of items across a row template | `Array of Data -> Array of Nodes` |
| **`json-transformer-funcs-two-dimensions`** | Maps 2D grid matrix across cell templates | `Columns x Rows -> Complete Grid` |

---

## 🧪 Testing

Run the included verification suite:

```bash
npm test
```

---

## 📄 License

MIT © KeshavSoft
