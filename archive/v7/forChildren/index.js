import parentIndex from "../index.js";

const startFunc = (inTemplateChildren, inElement) => {
    const localTemplateChildren = structuredClone(inTemplateChildren);


    if (!Array.isArray(localTemplateChildren)) return;

    const newChildren = localTemplateChildren.map(element => {
        const loopInsideObject = parentIndex(inElement, element);

        return loopInsideObject;
    });

    return newChildren;
};

export default startFunc;
