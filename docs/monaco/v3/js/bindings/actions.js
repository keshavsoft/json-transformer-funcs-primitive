import { models, activateTab } from "../monacoEditor/index.js";
// import loopWithIndividualTemplate from "https://keshavsoft.github.io/json-transformer-funcs-one-dimension/dist/v9/min.js";

export const actions = {
    loadRaka: async () => {
        const response = await fetch("./column.json");
        const json = await response.json();

        models.columns.setValue(JSON.stringify(json, null, 2));
        activateTab("tabColumns", models.columns);
    },

    loadTemplate: async () => {
        const response = await fetch("./template.json");
        const json = await response.json();

        models.template.setValue(JSON.stringify(json, null, 2));
        activateTab("tabTemplate", models.template);
    },

    build: () => {
        const columns = JSON.parse(models.columns.getValue());
        const template = JSON.parse(models.template.getValue());

        const spec = window.ks.transformer.funcs.primitive.applyTemplate(columns, template);

        models.output.setValue(JSON.stringify(spec, null, 2));
        activateTab("tabOutput", models.output);
    },

    specJsonShow: () => {
        const json = window.ks.specs.jsonFiles.spec;

        models.specJson.setValue(JSON.stringify(json, null, 2));
        activateTab("specOutput", models.specJson);
    },

    showTabColumns: () => {
        activateTab("tabColumns", models.columns);
    },

    showTabTemplate: () => {
        activateTab("tabTemplate", models.template);
    },

    showTabOutput: () => {
        activateTab("tabOutput", models.output);
    },

    showSpecOutput: () => {
        activateTab("specOutput", models.specJson);
    }
};

export default actions;