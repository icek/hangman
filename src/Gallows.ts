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

import { Color3, Mesh, Scene, StandardMaterial, Texture, Vector3 } from "babylonjs";
import { woodImageDiffuse } from "./textures";



export default class Gallows extends Mesh {

    public meshes:Mesh[] = [];

    constructor( scene:Scene ) {
        super( 'gallows', scene );

        // Setup Gallows
        let material = new StandardMaterial( 'beam-material', scene );
        material.diffuseTexture = new Texture( woodImageDiffuse, scene );
        material.specularColor = Color3.FromHexString( '#000000' );

        let mesh = Mesh.CreateBox( 'vertical-beam', 4, scene );
        mesh.scaling.set( 0.03, 1, 0.03 );
        mesh.setPivotPoint( new Vector3( 0, -2, 0 ) );
        mesh.position.set( 0, 0, 0 );
        mesh.material = material;
        mesh.parent = this;

        this.meshes.push( mesh );

        mesh = Mesh.CreateBox( 'horizontal-beam', 3, scene );
        mesh.scaling.set( 0.03, 1, 0.03 );
        mesh.setPivotPoint( new Vector3( 0, -1, 0 ) );
        mesh.position.set( 2, 4, 0 );
        mesh.rotate( Vector3.Forward(), Math.PI / 2 );
        mesh.material = material;
        mesh.parent = this;

        this.meshes.push( mesh );

        let SQRT2 = Math.sqrt( 2 );

        mesh = Mesh.CreateBox( 'top-diagonal-beam', SQRT2, scene );
        mesh.scaling.set( 0.08, 1, 0.08 );
        mesh.setPivotPoint( new Vector3( 0, -SQRT2 / 2, 0 ) );
        mesh.position.set( 1, 4, 0 );
        mesh.rotate( Vector3.Forward(), Math.PI * .75 );
        mesh.material = material;
        mesh.parent = this;

        this.meshes.push( mesh );

        mesh = Mesh.CreateBox( 'bottom-left-diagonal-beam', SQRT2, scene );
        mesh.scaling.set( 0.08, 1, 0.08 );
        mesh.setPivotPoint( new Vector3( 0, -SQRT2 / 2, 0 ) );
        mesh.position.set( 0, 1, 0 );
        mesh.rotate( Vector3.Forward(), Math.PI * .75 );
        mesh.material = material;
        mesh.parent = this;

        this.meshes.push( mesh );

        mesh = Mesh.CreateBox( 'bottom-left-diagonal-beam', SQRT2, scene );
        mesh.scaling.set( 0.08, 1, 0.08 );
        mesh.setPivotPoint( new Vector3( 0, -SQRT2 / 2, 0 ) );
        mesh.position.set( 0, 1, 0 );
        mesh.rotate( Vector3.Forward(), Math.PI * -.75 );
        mesh.material = material;
        mesh.parent = this;

        this.meshes.push( mesh );

        mesh = Mesh.CreateBox( 'bottom-front-diagonal-beam', SQRT2, scene );
        mesh.scaling.set( 0.08, 1, 0.08 );
        mesh.setPivotPoint( new Vector3( 0, -SQRT2 / 2, 0 ) );
        mesh.position.set( 0, 1, 0 );
        mesh.rotate( Vector3.Right(), Math.PI * -.75 );
        mesh.material = material;
        mesh.parent = this;

        this.meshes.push( mesh );

        mesh = Mesh.CreateBox( 'bottom-back-diagonal-beam', SQRT2, scene );
        mesh.scaling.set( 0.08, 1, 0.08 );
        mesh.setPivotPoint( new Vector3( 0, -SQRT2 / 2, 0 ) );
        mesh.position.set( 0, 1, 0 );
        mesh.rotate( Vector3.Right(), Math.PI * .75 );
        mesh.material = material;
        mesh.parent = this;

        this.meshes.push( mesh );
    }
}