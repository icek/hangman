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

import "./assets/index.scss";

// HACK
window[ 'OIMO' ] = require( '../Oimo' );


import { AssetsManager, BinaryFileAssetTask, Engine, Sound, TextFileAssetTask } from "babylonjs";
import HangmanScene from "./HangmanScene";

import * as TEXTURES from "./textures";
import * as SOUNDS from "./sounds";
import Game from "./Game";

// This is just path for webpack to copy asset, it's not required
const wordsList = require( './assets/words.json' );

window.addEventListener( 'load', () => {

    /*
     * Setup babylon engine
     */
    let canvas = document.getElementById( 'hangman' ) as HTMLCanvasElement;
    let engine = new Engine( canvas );

    let scene = new HangmanScene( engine );

    /*
     * Setup preloader
     */
    let assetManager = new AssetsManager( scene );
    assetManager.useDefaultLoadingScreen = false;

    /*
     * Preload images
     */
    assetManager.addImageTask( 'dirt-diffuse', TEXTURES.dirtImageDiffuse );
    // assetManager.addImageTask( 'dirt-ambient', TEXTURES.dirtImageAmbient );
    assetManager.addImageTask( 'wall-diffuse', TEXTURES.wallImageDiffuse );
    // assetManager.addImageTask( 'wall-ambient', TEXTURES.wallImageAmbient );
    // assetManager.addImageTask( 'wall-bump', TEXTURES.wallImageBump );
    assetManager.addImageTask( 'height-map', TEXTURES.heightMap );
    assetManager.addImageTask( 'hangman-diffuse', TEXTURES.hangmanImageDiffuse );
    assetManager.addImageTask( 'box-diffuse', TEXTURES.boxImageDiffuse );

    /*
     * Preload sounds
     */
    assetManager.addBinaryFileTask( 'button-down-sound', SOUNDS.buttonDownSound );
    assetManager.addBinaryFileTask( 'button-up-sound', SOUNDS.buttonUpSound );
    assetManager.addBinaryFileTask( 'rotation-sound', SOUNDS.rotationSound );
    let musicTask = assetManager.addBinaryFileTask( 'wind-sound', SOUNDS.windSound );
    musicTask.onSuccess = ( task:BinaryFileAssetTask ) => {
        new Sound( 'music', task.data, scene, null, { autoplay: true, loop: true } );
    };

    /*
     * Preload JSON containing words
     */
    let game;
    let jsonTask = assetManager.addTextFileTask( 'words', wordsList );
    jsonTask.onSuccess = ( task:TextFileAssetTask ) => game = new Game( JSON.parse( task.text ), scene );

    /*
     * Init scene when everything is loaded
     */
    assetManager.onFinish = () => {
        scene.init();
        scene.executeWhenReady( () => {
            let screen = document.getElementById( 'preloader' );
            screen.classList.add( 'invisible' );
            screen.addEventListener( 'transitionend', () => screen.remove() );
            engine.runRenderLoop( () => scene.render() );
            game.startNew();
        } );
    };


    assetManager.load();

    window.addEventListener( 'resize', () => engine.resize() );
} );

