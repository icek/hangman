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

import {
    AbstractMesh,
    Camera,
    Color4,
    DirectionalLight,
    Engine,
    Light,
    Mesh,
    OimoJSPlugin,
    PhysicsImpostor,
    Scene,
    ShadowGenerator,
    StandardMaterial,
    TargetCamera,
    Texture,
    Vector3
} from "babylonjs";


import Gallows from "./Gallows";
import VisualKeyboard from "./VisualKeyboard";
import Hangman from "./Hangman";
import { dirtImageDiffuse, heightMap, keysImageDiffuse, wallImageDiffuse } from "./textures";

import WordDisplay from "./WordDisplay";


export default class HangmanScene extends Scene {

    private camera:Camera;
    private light:Light;
    private renderList:AbstractMesh[];
    private letterMaterial:StandardMaterial;

    public hangman:Hangman;
    public keyboard:VisualKeyboard;
    public wordDisplay:WordDisplay;


    constructor( engine:Engine ) {
        super( engine );

        this.clearColor = Color4.FromHexString( '#ffffffff' );

        /*
         * Setup camera
         */
        let camera = this.camera = new TargetCamera( 'camera', new Vector3( 0, 2.5, -10 ), this );
        camera.setTarget( new Vector3( 0, 1, 0 ) );
        // camera.attachControl( <HTMLCanvasElement>engine.getRenderingCanvas() );

        /*
         * Setup Light
         */
        let light = this.light = new DirectionalLight( 'light', new Vector3( 5, -5, 10 ), this );
        light.intensity = 2;

        /*
         * Setup Shadows generator
         */
        let shadowGenerator = new ShadowGenerator( 1024, light );
        shadowGenerator.usePoissonSampling = true;
        let { renderList } = shadowGenerator.getShadowMap();
        this.renderList = renderList;


        // this.workerCollisions = true;
        this.enablePhysics( new Vector3( 0, -9.81, 0 ), new OimoJSPlugin() );
        this.collisionsEnabled = false;

        // this.forceShowBoundingBoxes = true;
    }

    public init() {

        /*
         * Setup ground
         */
        let diffuseTexture = new Texture( dirtImageDiffuse, this );
        diffuseTexture.uScale = 16;
        diffuseTexture.vScale = 16;

        // let ambientTexture = new Texture( dirtImageAmbient, this );
        // ambientTexture.uScale = 16;
        // ambientTexture.vScale = 16;

        // let bumpTexture = new Texture( TEXTURE.dirtImageBump, this );
        // bumpTexture.uScale = 16;
        // bumpTexture.vScale = 16;

        let material = new StandardMaterial( 'ground-material', this );
        material.diffuseTexture = diffuseTexture;
        // material.ambientTexture = ambientTexture;
        // material.bumpTexture = bumpTexture;
        // material.emissiveColor.set( 0, 0, 0 );
        material.specularColor.set( 0.25, 0.25, 0.25 );
        // material.specularColor = Color3.FromHexString( '#9b4acf' );
        // material.emissiveColor = Color3.FromHexString( '#380857' );

        let ground = Mesh.CreateGroundFromHeightMap( 'ground', heightMap, 40, 20, 80, -.25, .25, this );
        ground.material = material;
        ground.receiveShadows = true;
        ground.physicsImpostor = new PhysicsImpostor( ground, PhysicsImpostor.HeightmapImpostor, { mass: 0 }, this );


        /*
         * Setup Wall
         */
        diffuseTexture = new Texture( wallImageDiffuse, this );
        diffuseTexture.uScale = 8;
        diffuseTexture.vScale = 4;

        // ambientTexture = new Texture( wallImageAmbient, this );
        // ambientTexture.uScale = 8;
        // ambientTexture.vScale = 4;
        //
        // let bumpTexture = new Texture( wallImageBump, this );
        // bumpTexture.uScale = 8;
        // bumpTexture.vScale = 4;

        material = new StandardMaterial( 'wall-material', this );
        material.diffuseTexture = diffuseTexture;
        // material.ambientTexture = ambientTexture;
        // material.bumpTexture = bumpTexture;
        // material.emissiveColor.set( 0, 0, 0 );
        material.specularColor.set( 0, 0, 0 );

        let wall = Mesh.CreatePlane( 'wall', 20, this );
        wall.position.set( 0, 5, 2 );
        wall.scaling.set( 1, .5, 1 );
        wall.material = material;
        wall.receiveShadows = true;

        /*
         * Setup Gallows
         */
        let gallows = new Gallows( this );
        gallows.position.set( -2, 0, 0 );
        gallows.meshes.forEach( mesh => this.renderList.push( mesh ) );

        /*
         * Setup Visual keyboard
         */
        material = this.letterMaterial = new StandardMaterial( 'letter-material', this );
        material.diffuseTexture = new Texture( keysImageDiffuse, this );
        material.specularColor.set( 0, 0, 0 );

        let keyboard = new VisualKeyboard( this, material );
        keyboard.position.set( 0, 1.8, -7.5 );
        keyboard.rotate( Vector3.Right(), Math.PI * .2 );

        let wordDisplay = new WordDisplay( this, material );
        wordDisplay.position.set( 0, 4, -7.5 );

        let hangman = new Hangman( 'hangman', this );
        hangman.meshes.forEach( mesh => this.renderList.push( mesh ) );

        this.keyboard = keyboard;
        this.wordDisplay = wordDisplay;
        this.hangman = hangman;
    }

    // TODO: show recent words
    // public addWord( word:string ) {
    //     let size = 1;
    //     let spacing = 1.1;
    //
    //     let meshes = word.split( '' ).map( ( letter, index ) => {
    //         let mesh = MeshBuilder.CreateBox( `letter-${letter}`, {
    //             size,
    //             faceUV: letterToUV( letter )
    //         }, this );
    //         mesh.position.set( (length - 1) * spacing, 0, 0 );
    //         mesh.rotation.set( Math.PI, 0, 0 );
    //         mesh.parent = this;
    //         mesh.material = this.letterMaterial;
    //
    //         return mesh;
    //     } );
    // }
    //
    // public resetWords() {
    //
    // }
}
