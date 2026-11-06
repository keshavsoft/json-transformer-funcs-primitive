import { models, activateTab } from "../monacoEditor/index.js";

export const actions = {
    // 🎯 Universal Tab Switcher: handles clicks on ANY tab automatically
    switchTab: (event, matchElement) => {
        activateTab(matchElement);
    },

    // Legacy tab actions for backward compatibility
    showTabColumns: () => activateTab("columns"),
    showTabTemplate: () => activateTab("template"),
    showTabOutput: () => activateTab("output"),
    showSpecOutput: () => activateTab("spec"),

    // 🚀 Action Triggers: populate data and activate target model in 1 call
    loadRaka: async () => {
        const response = await fetch("./column.json");
        const json = await response.json();

        models.columns.setValue(JSON.stringify(json, null, 2));
        activateTab("columns");
    },

    loadTemplate: async () => {
        const response = await fetch("./template.json");
        const json = await response.json();

        models.template.setValue(JSON.stringify(json, null, 2));
        activateTab("template");
    },

    build: () => {
        const columns = JSON.parse(models.columns.getValue());
        const template = JSON.parse(models.template.getValue());

        const spec = window.ks.transformer.funcs.primitive.applyTemplate(columns, template);

        models.output.setValue(JSON.stringify(spec, null, 2));
        activateTab("output");
    },

    specJsonShow: () => {
        const json = window.ks.specs.jsonFiles.spec;

        models.spec.setValue(JSON.stringify(json, null, 2));
        activateTab("spec");
    }
};

export default actions;
