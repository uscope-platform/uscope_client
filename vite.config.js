/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import path from 'path';

import * as child from "child_process";

const commitHash = child.execSync('git rev-parse --short HEAD').toString().trimEnd();

export default defineConfig({
    server:{
        port:3004
    },
    resolve:{
        alias:{
            "@src": path.resolve(__dirname, "./src"),
            "@client_core": path.resolve(__dirname, "./src/client_core"),
            "@components": path.resolve(__dirname, "./src/components"),
            "@UI": path.resolve(__dirname, "./src/components/UI_elements"),
        }
    },
    plugins: [
        react(),
        viteTsconfigPaths(),
        svgrPlugin()
    ],
    build:{
        outDir:"build",
        sourcemap:true
    },
    define: {
        __USCOPE_CLIENT_VERSION__: JSON.stringify(commitHash),
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
