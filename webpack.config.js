/*
 *
 *        ______      __  ______          __
 *       / ____/___ _/ /_/ ____/___  ____/ /__
 *      / /_  / __ `/ __/ /   / __ \/ __  / _ \
 *     / __/ / /_/ / /_/ /___/ /_/ / /_/ /  __/
 *    /_/    \__,_/\__/\____/\____/\__,_/\___/
 *
 *  Copyright (c) 2017 FatCode Grzegorz Michlicki
 *
 */

const path = require( 'path' );
const webpack = require( 'webpack' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );

const extractCSS = new ExtractTextPlugin( { filename: 'styles.[hash].css', allChunks: true } );

const base = require( './webpack.config.base' );
const config = Object.assign( base, {
    devtool: 'none'
} );

config.plugins.push(
    extractCSS,
    new webpack.DefinePlugin( { 'process.env.NODE_ENV': '"production"' } ),
    new webpack.LoaderOptionsPlugin( { minimize: true, debug: false } ),
    new webpack.optimize.CommonsChunkPlugin( {
        name: 'vendor',
        filename: 'vendor.[hash].js',
        minChunks: function( module ) {
            return module.context
                && (module.context.indexOf( 'node_modules' ) !== -1
                || module.context.indexOf( 'OIMO' ) !== -1);
        }
    } ),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.UglifyJsPlugin( {
        compress: {
            warnings: false,
            screw_ie8: true,
            conditionals: true,
            unused: true,
            comparisons: true,
            sequences: true,
            dead_code: true,
            evaluate: true,
            if_return: true,
            join_vars: true,
        },
        output: {
            comments: false
        },
    } )
);

config.module.rules.push(
    {
        test: /\.scss$/,
        use: extractCSS.extract( {
            fallback: 'style-loader',
            use: 'css-loader?minimize=true!postcss-loader!sass-loader'
        } )
    }
);

module.exports = config;
