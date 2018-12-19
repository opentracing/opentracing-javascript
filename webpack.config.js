// @ts-check

const webpack = require("webpack");

// Pass in the build configuration as environment variables
const CONFIG = process.env.BUILD_CONFIG

// Modify the webpack settings based on the configuration
const plugins = [];
let bundleSuffix = '';
let devtool;

if (CONFIG === 'debug') {
    devtool = "source-map";
} else {
    bundleSuffix = ".min";
}

//
// Webpack configuration
//

/** @type {import('webpack').Configuration} */
module.exports = {
    entry: './src/index.ts',
    target: 'web',
    devtool,
    mode: CONFIG === 'debug' ? 'development' : 'production',
    output: {
        path: __dirname + '/dist/',
        filename: 'opentracing-browser' + bundleSuffix + '.js',
        library: 'opentracing',
        libraryTarget: 'umd',
    },
    optimization: {
        minimize: CONFIG !== 'debug',
    },
    plugins,
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    compilerOptions: {
                        declaration: false,
                        declarationMap: false,
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.ts']
    },
};
