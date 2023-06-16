import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: "tests/*.spec.ts",
    supportFile: false,
    video: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
