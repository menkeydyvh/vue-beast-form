const path = require('path');
// const { VueLoaderPlugin } = require('vue-loader');

const distFileBaseName = "vbf"

module.exports = {
    resolve: {
        extensions: ['.ts', '.js'],
    },
    devtool: 'inline-cheap-module-source-map',
    mode: 'development',
    // devtool: 'source-map',
    // mode: 'production',
    entry: {
        index: "./index.ts",
        tools: "./components/tool.ts",
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: {
            name: distFileBaseName,
            type: 'umd',
            export: "default",
            umdNamedDefine: true
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node-modules/,
            },
        ]
    },
    externals: {
        vue: {
            root: 'Vue',
            commonjs2: 'vue',
            commonjs: 'vue',
            amd: 'vue',
        }
    }
};