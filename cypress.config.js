import {defineConfig} from "cypress";
import codeCoverageTask from '@cypress/code-coverage/task.js';

export default defineConfig({
    e2e: {
        baseUrl: "https://kikcms.test:5173",
        setupNodeEvents(on, config) {
            codeCoverageTask(on, config);
            return config;
        },
    },
});
