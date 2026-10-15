# json-transformer-funcs-primitive

> The atom. One template + one data object = one JSON element node.

[![npm](https://img.shields.io/npm/v/json-transformer-funcs-primitive)](https://www.npmjs.com/package/json-transformer-funcs-primitive)

---

## Install

```bash
npm install json-transformer-funcs-primitive
```

---

## What it does

Takes a JSON template describing an HTML element and a plain object of data values.
Returns a new JSON node with every `${key}` placeholder resolved against the data object.

It clones the template, then resolves three fields:

- **`textContent`** — `${key}` replaced with the matching data value
- **`attributes`** — every attribute value resolved the same way
- **`children`** — each child resolved recursively with the same data

---

## Signature

```javascript
import applyTemplate from "json-transformer-funcs-primitive";

applyTemplate(inTemplate, inElement)
```

| Argument | Type | Description |
| :--- | :--- | :--- |
| `inTemplate` | object or string | The element shape with `${placeholder}` slots |
| `inElement` | plain object | The data values that fill the placeholders |

**Returns:** a new object — the resolved element.

**Guards (throw `TypeError` on violation):**
- `inTemplate` cannot be `null` or `undefined`
- `inTemplate` must be an object or string
- `inElement` must be a plain object (not null, not array)

---

## Example

```javascript
import applyTemplate from "json-transformer-funcs-primitive";

const template = {
    "tagName": "col",
    "attributes": { "width": "${width}" }
};

const element = { "width": "300px" };

const result = applyTemplate(template, element);
// { tagName: "col", attributes: { width: "300px" } }
```

---

## When to use

Use `applyTemplate` when you have **one data object** and want **one element node**.

For a list of elements from a list of objects, use
[`json-transformer-funcs-one-dimension`](https://www.npmjs.com/package/json-transformer-funcs-one-dimension).

For a grid of rows from columns and data rows, use
[`json-transformer-funcs-two-dimensions`](https://www.npmjs.com/package/json-transformer-funcs-two-dimensions).

For the complete story — all three engines working together — see
[`json-transformer-funcs`](https://www.npmjs.com/package/json-transformer-funcs).

---

## License

MIT (c) KeshavSoft
