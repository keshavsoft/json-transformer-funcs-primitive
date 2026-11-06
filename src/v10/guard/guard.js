const guardFunc = (inElement, inTemplate, showLog) => {
    if (showLog) console.log("inElement : ", inElement);
    if (showLog) console.log("inTemplate : ", inTemplate);

    if (inTemplate === undefined || inTemplate === null) {
        throw new TypeError("inTemplate is required");
    }

    if (typeof inTemplate !== "object" && typeof inTemplate !== "string") {
        throw new TypeError("inTemplate must be an object or string");
    }

    if (!inElement || typeof inElement !== "object" || Array.isArray(inElement)) {
        throw new TypeError("inElement must be an object");
    }

    return true;
};

export default guardFunc;
