var webpack = require("webpack");

// Pass in the build configuration as environment variables
const CONFIG = process.env.BUILD_CONFIG

// Modify the webpack settings based on the configuration
var plugins = [];
var bundleSuffix = '';
var devtool = undefined;

if (CONFIG === 'debug') {
    devtool = "source-map";
    plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"debug"'
            }
        })
    );
} else {
    bundleSuffix = ".min";
    plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress : {
                dead_code : true,
                unused : true,
                // Hide the dead code warnings. The defines intentionally create
                // dead code paths.
                warnings  : false,
            },
        }),
        new webpack.optimize.DedupePlugin()
    );
}

//
// Webpack configuration
//
module.exports = {
    entry   : "./src/index.js",
    target  : 'web',
    devtool : devtool,
    output  : {
        path          : "dist/",
        filename      : 'opentracing-browser' + bundleSuffix + ".js",
        library       : "opentracing",
        libraryTarget : 'umd',
    },
    plugins : plugins,
    module  : {
        loaders : [
            {
                test    : /\.js$/,
                loader  : "babel",
                include : /src\//,
                exclude : /node_modules/,
                query   : {
                    cacheDirectory : true,
                    presets : [ ],
                    plugins : [
                        "add-module-exports",

                        // Manually specify the *subset* of the ES2015 preset
                        // to use. This reduces the output file size and improves
                        // interoperability (e.g. Symbol on IE).
                        'babel-plugin-transform-es2015-template-literals',
                        'babel-plugin-transform-es2015-literals',
                        //'babel-plugin-transform-es2015-function-name',
                        'babel-plugin-transform-es2015-arrow-functions',
                        'babel-plugin-transform-es2015-block-scoped-functions',
                        'babel-plugin-transform-es2015-classes',
                        'babel-plugin-transform-es2015-object-super',
                        // 'babel-plugin-transform-es2015-shorthand-properties',
                        'babel-plugin-transform-es2015-duplicate-keys',
                        'babel-plugin-transform-es2015-computed-properties',
                        // 'babel-plugin-transform-es2015-for-of',
                        'babel-plugin-transform-es2015-sticky-regex',
                        'babel-plugin-transform-es2015-unicode-regex',
                        'babel-plugin-check-es2015-constants',
                        'babel-plugin-transform-es2015-spread',
                        'babel-plugin-transform-es2015-parameters',
                        'babel-plugin-transform-es2015-destructuring',
                        'babel-plugin-transform-es2015-block-scoping',
                        //'babel-plugin-transform-es2015-typeof-symbol',
                        'babel-plugin-transform-es2015-modules-commonjs',
                    ],
                }
            },
        ]
    },
};
