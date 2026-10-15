# json-transformer-funcs-primitive

Primitive template interpolation engine for `json-transformer-funcs`.

Interpolates scalar values, placeholders (`${field}`, `${agg:count}`, `${rowValue}`), attributes, and nested children against a source object.

## Installation

```bash
npm install json-transformer-funcs-primitive
```

## Usage

```javascript
import applyTemplate from "json-transformer-funcs-primitive";

const template = {
    tagName: "th",
    textContent: "${columnName}",
    attributes: {
        class: "header-cell"
    }
};

const data = { columnName: "Item Name" };

const result = applyTemplate(template, data);
console.log(result);
```

## License

MIT
