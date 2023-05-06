/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';

export default defineConfig({
    server:{
        port:3004
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
