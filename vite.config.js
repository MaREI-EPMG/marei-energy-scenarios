// contains EPMG customisation
import path from "path";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//import viteTsconfigPaths from 'vite-tsconfig-paths'
import eslint from "vite-plugin-eslint";
import svgr from "vite-plugin-svgr";

export default defineConfig({
    base: '/',
    build: {
        minify: false,
        minifyIdentifiers: false,
        outDir: "dist"
    },
    plugins: [
        eslint(),
        react(),
//        viteTsconfigPaths(),
        svgr({ svgrOptions: { icon: true } })
    ],
    resolve: {
        alias: {
          "~": path.resolve(__dirname, "./src")
        }
    },
    server: {    
        open: true,
        port: 3001, 
    },
    test: {
        globals: true,
        //setupFiles: "./tests/setup.js",
        environment: "jsdom"
    }
})