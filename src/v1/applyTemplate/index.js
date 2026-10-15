import forAttributes from "./forAttributes/index.js";
import forChildren from "./forChildren/index.js";
import forTextContent from "./forTextContent.js";
import commonReplace from "./commonReplace.js";

const startFunc = (inTemplate, inElement) => {
    const localClonedTemplate = structuredClone(inTemplate);
    // console.log("applytemplate : ", typeof localClonedTemplate);

    if (typeof localClonedTemplate === "string") return commonReplace(localClonedTemplate, inElement);
    if (localClonedTemplate === null || typeof localClonedTemplate !== "object") return localClonedTemplate;
    // console.log("1111111 : ", inTemplate, typeof localClonedTemplate);
    if ("textContent" in localClonedTemplate) localClonedTemplate.textContent = forTextContent(localClonedTemplate?.textContent, inElement);

    if ("attributes" in localClonedTemplate) {
        localClonedTemplate.attributes = forAttributes(localClonedTemplate?.attributes, inElement);
    };
    // console.log("ccccccccc : ", localClonedTemplate.children);

    if ("children" in localClonedTemplate) localClonedTemplate.children = forChildren(localClonedTemplate?.children, inElement);

    return localClonedTemplate;
};

export default startFunc;