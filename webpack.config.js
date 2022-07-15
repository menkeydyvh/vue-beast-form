const path = require('path');

const distFileBaseName = "vbf"

module.exports = {
    resolve: {
        extensions: ['.ts', '.js'],
    },
    // devtool: 'source-map',
    mode: 'production',
    entry: {
        index: "./index.ts",
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