const path = require('path');

module.exports = {
    resolve: {
        extensions: ['.js', '.ts', '.json'],
    },
    devtool: 'inline-source-map',
    mode: 'production',
    entry: {
        index: "./components/index.ts"
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        library: "JsonLayout",
        libraryTarget: "umd"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node-modules/,
            }
        ]
    }

};