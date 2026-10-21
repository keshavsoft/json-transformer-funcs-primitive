const startFunc = (inStringTemplate, inElement, showLog) => {
    // console.log("inStringTemplate, inElement : ", inStringTemplate, inElement);

    if (inStringTemplate === "${agg:count}" && "rowData" in inElement) {
        if (Array.isArray(inElement?.rowData)) {
            return inElement?.rowData.length;
        };
    } else {


        if (inStringTemplate === "${rowValue}" && "rowData" in inElement) {
            return inElement?.rowData;
        } else {
            return inStringTemplate.replace(/\$\{(\w+)\}/g, (match, key) => {
                return inElement[key] !== undefined ? inElement[key] : match;
            });

        };
    };
};

export default startFunc;