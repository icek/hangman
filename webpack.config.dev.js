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
const WriteFilePlugin = require( 'write-file-webpack-plugin' );

const base = require( './webpack.config.base' );

const host = process.env.HOST || 'localhost';
const port = +process.env.DEV_PORT || 3000;

const config = Object.assign( base, {
    devtool: 'cheap-eval-source-map'
} );

config.entry.app.unshift( 'webpack-hot-middleware/client?reload=true&path=http://' + host + ':' + port + '/__webpack_hmr' );
config.output.filename = '[name].js';
config.output.publicPath = 'http://' + host + ':' + port + '/dist/';

config.plugins.push(
    new webpack.DefinePlugin( { 'process.env.NODE_ENV': '"development"' } ),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new WriteFilePlugin( {
        test: /(words\.json|\.(html|png|jpg|gif|mp3))$/,
        useHashIndex: true
    } )
);

config.module.rules.push(
    {
        test: /\.scss$/,
        use: [
            {
                loader: 'style-loader'
            },
            {
                loader: 'css-loader',
                options: {
                    sourceMap: true
                }
            },
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: 'inline'
                }
            },
            {
                loader: 'sass-loader',
                options: {
                    outputStyle: 'compact',
                    precision: '8',
                    sourceMap: true
                }
            }
        ]
    }
);

module.exports = config;
