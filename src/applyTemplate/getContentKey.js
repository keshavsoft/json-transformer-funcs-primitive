const startFunc = (inContent) => {
    let localContent = inContent;

    if (!localContent) return;

    if (localContent.startsWith("$")) {
        return localContent?.replace("${", "").replace("}", "");
    };
};

export default startFunc;