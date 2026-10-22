import { defineConfig } from 'vite';
import react, {reactCompilerPreset} from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

import * as child from "child_process";

// the React Compiler memoizes the components, REACT_COMPILER=0 builds without it
const use_react_compiler = process.env.REACT_COMPILER !== '0';

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
        react(),
        ...(use_react_compiler ? [babel({presets: [reactCompilerPreset()]})] : [])
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
