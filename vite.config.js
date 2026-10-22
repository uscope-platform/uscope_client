import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import * as child from "child_process";

const commitHash = child.execSync('git rev-parse --short HEAD').toString().trimEnd();

export default defineConfig({
    server:{
        port:3004
    },
    resolve:{
        // the #aliases of the tsconfig paths
        tsconfigPaths: true
    },
    plugins: [
        react()
    ],
    build:{
        outDir:"build",
        sourcemap:true
    },
    define: {
        __USCOPE_CLIENT_VERSION__: JSON.stringify(commitHash),
        // plotly.js's has-hover dependency references the Node-only `global`
        global: 'globalThis',
    },
    optimizeDeps: {
        rolldownOptions: {
            // the dev server pre-bundles dependencies separately from `define` above
            transform: {
                define: {
                    global: 'globalThis',
                },
            },
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './test/client_core/jest.setup.js',
        coverage: {
            reporter: ['text', 'html'],
            exclude: [
                'node_modules/',
                './test/client_core/jest.setup.js'
            ],
        },
    },
});
