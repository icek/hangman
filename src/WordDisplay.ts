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
    Animation, CircleEase, EasingFunction, Mesh, MeshBuilder, QuadraticEase, Scene, SineEase, Sound, StandardMaterial,
    Texture,
    Vector3
} from "babylonjs";
import { letterToUV } from "./letterTools";
import { rotationSound } from "./sounds";
import { boxImageDiffuse } from "./textures";

export default class WordDisplay extends Mesh {

    letters:Mesh[] = [];
    rotationSound:Sound;
    // scene:Scene;

    constructor( scene:Scene, material:StandardMaterial ) {
        super( 'word-display', scene );

        this.material = material;

        let barMaterial = new StandardMaterial( 'bar-material', scene );
        barMaterial.diffuseTexture = new Texture( boxImageDiffuse, scene );
        barMaterial.specularColor.set( 0, 0, 0 );

        let mesh = Mesh.CreateCylinder( 'horizontal-bar', 2.06, 0.03, 0.03, 12, 12, scene );
        mesh.rotate( Vector3.Forward(), -Math.PI / 2 );
        mesh.parent = this;
        mesh.material = barMaterial;

        mesh = Mesh.CreateCylinder( 'left-bar', 1, 0.03, 0.03, 12, 12, scene );
        mesh.position.set( -1, .5, 0 );
        mesh.parent = this;
        mesh.material = barMaterial;

        mesh = Mesh.CreateCylinder( 'right-bar', 1, 0.03, 0.03, 12, 12, scene );
        mesh.position.set( 1, .5, 0 );
        mesh.parent = this;
        mesh.material = barMaterial;

        this.setPivotPoint( new Vector3( 0, 1, 0 ) );
        this.rotation.set( -Math.PI * .5, 0, 0 );

        this.rotationSound = new Sound( 'rotation-sound', rotationSound, scene, null, {
            autoplay: false,
            loop: false
        } );
    }

    private resetLetters() {
        this.letters.forEach( mesh => mesh.dispose() );
    }

    public showWord( word:string ) {
        let length = word.length;
        let size = 0.1;
        let spacing = size + 0.03;

        this.resetLetters();

        this.letters = word.split( '' ).map( ( letter, index ) => {
            let mesh = MeshBuilder.CreateBox( `letter-${letter}`, {
                size,
                faceUV: letterToUV( letter )
            }, this.getScene() );
            mesh.position.set( (index - (length - 1) * .5) * spacing, 0, 0 );
            mesh.rotation.set( Math.PI, 0, 0 );
            mesh.parent = this;
            mesh.material = this.material;

            return mesh;
        } );

        let ease = new QuadraticEase();
        ease.setEasingMode( QuadraticEase.EASINGMODE_EASEINOUT );
        Animation.CreateAndStartAnimation( 'word-anim', this, 'rotation', 60, 100,
            new Vector3( -Math.PI * .5, 0, 0 ), Vector3.Zero(), Animation.ANIMATIONLOOPMODE_CONSTANT, ease );
    }

    public hideWord() {
        let ease = new QuadraticEase();
        ease.setEasingMode( QuadraticEase.EASINGMODE_EASEINOUT );
        Animation.CreateAndStartAnimation( 'word-anim', this, 'rotation', 60, 100,
            Vector3.Zero(), new Vector3( -Math.PI * .5, 0, 0 ), Animation.ANIMATIONLOOPMODE_CONSTANT, ease,
            () => this.resetLetters()
        );
    }

    public showLetter( index:number ) {
        this.rotationSound.play();
        Animation.CreateAndStartAnimation( `anim-letter-${index}`, this.letters[ index ], 'rotation', 30, 80,
            new Vector3( Math.PI, 0, 0 ), Vector3.Zero(), Animation.ANIMATIONLOOPMODE_CONSTANT );
    }
}
