# json-transformer-funcs-primitive

> **The Atom.** One data object + one JSON-to-DOM template = one fully-resolved element node.

[![npm](https://img.shields.io/npm/v/json-transformer-funcs-primitive)](https://www.npmjs.com/package/json-transformer-funcs-primitive)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)]()

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

### Basic Example

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
| `inTemplate === null` or `undefined` | `TypeError: inTemplate is required` | Prevents operating on missing blueprints. |
| `typeof inTemplate !== "object"` and `!== "string"` | `TypeError: inTemplate must be an object or string` | Blueprint must be a valid AST or string. |
| `!inElement` or `typeof inElement !== "object"` | `TypeError: inElement must be an object` | Data source must be a valid dictionary. |
| `Array.isArray(inElement)` | `TypeError: inElement must be an object` | Arrays belong in 1D/2D mappers, not the primitive atom. |

### Immutability Guarantee
`applyTemplate` **never** mutates your original `inTemplate`. It immediately executes:
```javascript
const localClonedTemplate = structuredClone(localTemplate);
```
Guaranteeing complete immutability across repeated calls and shared caches.

---

## 🧩 The 4 Resolution Engines

`applyTemplate` recursively inspects the cloned template and dispatches to 4 specialized handlers:

### 1. `commonReplace` (String Token Replacement)
Scans any string using the regex `/\$\{(\w+)\}/g`.
- If `inElement[key]` exists, replaces `${key}` with its value.
- If undefined, preserves `${key}` untouched for downstream passes.
- Can replace multiple placeholders within the same attribute (e.g. `class="${baseClass} ${activeClass}"`).

### 2. `forAttributes` (Attribute Map Resolution)
Iterates through all key-value pairs of `template.attributes`:
```javascript
for (const [key, value] of Object.entries(inAttributes)) {
    newObject[key] = parentIndex(inSource, value);
}
```
Attribute values can be plain strings or nested objects; both are resolved recursively.

### 3. `forTextContent` (Text Content Resolution)
Resolves inner text of tags via `commonReplace`, supporting both inline strings and dynamic bindings.

### 4. `forChildren` (Recursive Tree Resolution)
Recursively maps over `template.children`, preserving parent-child DOM hierarchy:
```javascript
const newChildren = localTemplateChildren.map(element => {
    return parentIndex(inElement, element);
});
```

---

## 🌟 Special Built-in Tokens

`json-transformer-funcs-primitive` includes two specialized enterprise tokens designed for table and list aggregation:

### 1. `${agg:count}` (Numeric Row Counter)
When `inTemplate` is exactly `"${agg:count}"` and `inElement.rowData` is an Array, the engine returns the **numeric length** of the array rather than a string:

```javascript
const data = {
  label: "Active Users",
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

## 📚 Real-World Recipes

### Recipe 1: Complex Nested Component (Card with Header & Actions)

```javascript
import applyTemplate from "json-transformer-funcs-primitive";

const componentData = {
  cardClass: "card shadow-sm border-0",
  headerClass: "card-header bg-transparent d-flex justify-content-between align-items-center",
  title: "Account Settings",
  badgeClass: "badge text-bg-success",
  badgeText: "Verified",
  bodyClass: "card-body",
  description: "Manage your security settings and notifications.",
  buttonClass: "btn btn-primary px-4",
  buttonText: "Save Changes"
};

const componentTemplate = {
  tagName: "div",
  attributes: {
    class: "${cardClass}",
    "data-role": "card-root"
  },
  children: [
    {
      tagName: "div",
      attributes: { class: "${headerClass}" },
      children: [
        {
          tagName: "h5",
          attributes: { class: "card-title mb-0" },
          textContent: "${title}"
        },
        {
          tagName: "span",
          attributes: { class: "${badgeClass}" },
          textContent: "${badgeText}"
        }
      ]
    },
    {
      tagName: "div",
      attributes: { class: "${bodyClass}" },
      children: [
        {
          tagName: "p",
          attributes: { class: "card-text text-muted" },
          textContent: "${description}"
        },
        {
          tagName: "button",
          attributes: { type: "button", class: "${buttonClass}" },
          textContent: "${buttonText}"
        }
      ]
    }
  ]
};

const cardAst = applyTemplate(componentData, componentTemplate);
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
