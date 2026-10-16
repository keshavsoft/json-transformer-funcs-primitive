import parentIndex from "../index.js";

const isObject = val => typeof val === 'object' && val !== null && !Array.isArray(val);

const startFunc = (inAttributes, inSource) => {
    if (!isObject(inAttributes)) return;
    // console.log("object : ", inAttributes, inSource);
    let newObject = {};

    for (const [key, value] of Object.entries(inAttributes)) {
        newObject[key] = parentIndex(inSource, value);
    };

    return newObject;
};

export default startFunc;