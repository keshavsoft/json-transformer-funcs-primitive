import forAttributes from "./forAttributes/index.js";
import forChildren from "./forChildren/index.js";
import forTextContent from "./forTextContent.js";
import commonReplace from "./commonReplace.js";
import guardFunc from "./guard/index.js";

const startFunc = (inElement, inTemplate) => {
    const localElement = inElement;
    const localTemplate = inTemplate;

    guardFunc(localTemplate, localElement);

    const localClonedTemplate = structuredClone(localTemplate);

    if (typeof localClonedTemplate === "string") return commonReplace(localClonedTemplate, localElement);
    if (localClonedTemplate === null || typeof localClonedTemplate !== "object") return localClonedTemplate;

    if ("textContent" in localClonedTemplate) localClonedTemplate.textContent = forTextContent(localClonedTemplate?.textContent, localElement);

    if ("attributes" in localClonedTemplate) {
        localClonedTemplate.attributes = forAttributes(localClonedTemplate?.attributes, localElement);
    };

    if ("children" in localClonedTemplate) localClonedTemplate.children = forChildren(localClonedTemplate?.children, localElement);

    return localClonedTemplate;
};

export default startFunc;