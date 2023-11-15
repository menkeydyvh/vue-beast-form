import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import alias from '@rollup/plugin-alias'
import { terser } from 'rollup-plugin-terser'
import vuePlugin from '@vitejs/plugin-vue'
import { defineConfig } from 'rollup'

const pkgName = 'vbf';

export default defineConfig([
    // esm
    {
        external: ['vue'],
        input: {
            "index": 'src/index.ts',
            "tool": 'src/tool.ts',
            "config/frameworks": 'src/config/frameworks.ts',
        },
        output: {
            dir: "esm",
            format: 'es',
            entryFileNames: '[name].js'
        },
        plugins: [
            typescript({
                tsconfig: './tsconfig.json',
                outDir: "esm",
            }),
            vuePlugin(),
            alias({
                resolve: [".js"]
            }),
            resolve(),
        ]
    },
    // umd
    {
        external: ['vue'],
        input: 'src/index.ts',
        output: {
            dir: 'umd',
            format: 'umd',
            globals: {
                "vue": "Vue"
            },
            name: pkgName,
        },
        plugins: [
            typescript({
                tsconfig: './tsconfig.json',
                outDir: "umd",
                declaration: false,
            }),
            vuePlugin(),
            alias({
                resolve: [".js"]
            }),
            resolve(),
            terser(),
        ]
    }
]);
