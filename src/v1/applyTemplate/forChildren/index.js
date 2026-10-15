import parentIndex from "../index.js";

const startFunc = (inTemplateChildren, inElement) => {
    const localTemplateChildren = structuredClone(inTemplateChildren);
    // console.log("localTemplateChildren : ", localTemplateChildren);

    if (!Array.isArray(localTemplateChildren)) return;

    const newChildren = localTemplateChildren.map(element => {
        const loopInsideObject = parentIndex(element, inElement);
        return loopInsideObject;
    });

    return newChildren;
};

export default startFunc;
