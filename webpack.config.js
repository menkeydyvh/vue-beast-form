const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    resolve: {
        extensions: ['.js', '.ts', '.json'],
    },
    devtool: 'inline-source-map',
    mode: 'production',
    entry: {
        index: "./index.ts"
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        // library: "BeastForm",
        // libraryTarget: "umd"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node-modules/,
            },
            {
                test: /\.vue$/,
                use: 'vue-loader',
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]

};