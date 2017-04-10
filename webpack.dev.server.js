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
const Express = require( 'express' );
const webpack = require( 'webpack' );
const devMiddleware = require( 'webpack-dev-middleware' );
const hotMiddleware = require( 'webpack-hot-middleware' );
const config = require( './webpack.config.dev' );

const compiler = webpack( config );

const host = process.env.HOST || 'localhost';
const port = +process.env.PORT || 3000;

const serverOptions = {
    contentBase: 'http://' + host + ':' + port,
    hot: true,
    inline: true,
    lazy: false,
    publicPath: config.output.publicPath,
    headers: { 'Access-Control-Allow-Origin': '*' },
    stats: {
        colors: true,
        hash: false,
        version: false,
        timings: false,
        assets: false,
        chunks: false,
        modules: false,
        reasons: true,
        children: false,
        source: true,
        errors: true,
        errorDetails: true,
        warnings: true,
        publicPath: false
    }
};

Express.static.mime.define({'text/xml': ['xml']});
Express.static.mime.define({'text/xsl': ['xsl']});

new Express()
    .use( devMiddleware( compiler, serverOptions ) )
    .use( hotMiddleware( compiler ) )
    .use( Express.static( path.resolve( __dirname, 'dist' ) ) )
    .use( ( req, res ) => {
        res.sendFile( path.resolve( __dirname, 'dist/index.html' ) )
    } )
    .listen( port, host, ( err ) => {
        if( err ) return console.error( err );
        console.log( 'Webpack development server listening on port %s', port );
    } );
