import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		css: true,
		environment: "jsdom",
		setupFiles: "./src/tests/setup.js",
		include:["./src/tests/*.test.js","./src/tests/*.test.jsx"],

		reporters:["default",['json',{outputFile: "test-results.json"}]]
		
	},
});
