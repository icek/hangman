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

const webpack = require( 'webpack' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const CleanWebpackPlugin = require( 'clean-webpack-plugin' );

const path = require( 'path' );

module.exports = {
    entry: {
        app: [ path.resolve( __dirname, 'src' ) ],
        vendor: ['./Oimo', 'babylonjs']
    },

    output: {
        // filesystem path for static files
        path: path.resolve( __dirname, 'dist' ),

        // network path for static files
        publicPath: '',

        // file name pattern for entry scripts
        filename: '[name].[hash].js',

        // file name pattern for chunk scripts
        chunkFilename: '[name].js'
    },

    resolve: {
        extensions: [ '.js', '.ts', '.json', '.scss', '.css', '.jpg', '.png', '.gif', '.xml' ]
    },

    module: {
        rules: [ {
            test: /\.ts$/,
            exclude: '/node_modules/',
            use: 'ts-loader'
        }, {
            test: /\.(jpg|png|gif|mp3)$/,
            use: 'file-loader?name=[name].[hash:20].[ext]'
        }, {
            test: /words\.json$/,
            use: 'file-loader?name=words.json'
        }, {
            test: /\.htaccess$/,
            use: 'file-loader?name=.htaccess'
        } ]
    },

    plugins: [
        new CleanWebpackPlugin( 'dist' ),
        new HtmlWebpackPlugin( {
            xhtml: true,
            filename: 'index.html',
            template: 'src/assets/template.ejs'
        } )
    ]
};




