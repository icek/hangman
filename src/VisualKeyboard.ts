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
    ActionManager,
    CombineAction,
    ExecuteCodeAction,
    InterpolateValueAction,
    Mesh,
    MeshBuilder,
    PlaySoundAction,
    Scene,
    SetValueAction,
    Sound,
    StandardMaterial,
    Texture,
    ValueCondition, Vector3
} from "babylonjs";
import { Signal } from "signals";

import { ALPHABET, letterToUV } from "./letterTools";
import { buttonDownSound, buttonUpSound } from "./sounds";
import { boxImageDiffuse } from "./textures";

export default class VisualKeyboard extends Mesh {

    public keyPressed:Signal = new Signal();

    private keys:Mesh[];

    constructor( scene:Scene, letterMaterial ) {
        super( 'visual-keyboard', scene );

        let lettersInRow = 7;
        let size = 0.1;
        let spacing = size + 0.03;

        let material = new StandardMaterial( 'box-material', scene );
        material.diffuseTexture = new Texture( boxImageDiffuse, scene );
        material.specularColor.set( 0, 0, 0 );

        let mesh = Mesh.CreateBox( 'box', (lettersInRow + 1) * spacing, scene );
        mesh.scaling.set( 1, 5 / 7, 0.2 );
        mesh.position.set( 0, -.25, 0.125 );
        mesh.parent = this;
        mesh.material = material;

        this.keys = ALPHABET.split( '' ).map( ( letter, index ) => {
            let mesh = MeshBuilder.CreateBox( `letter-${letter}`, {
                size,
                faceUV: letterToUV( letter )
            }, scene );
            mesh.position.set(
                (index % lettersInRow - Math.floor( lettersInRow * .5 )) * spacing,
                Math.ceil( -index / lettersInRow ) * spacing,
                0
            );
            mesh.parent = this;
            mesh.material = letterMaterial;

            let actionManager = mesh.actionManager = new ActionManager( scene );
            let originalPosition = mesh.position.clone();
            let pressedPosition = originalPosition.clone();
            pressedPosition.z += 0.05;
            let metadata = mesh.metadata = { isDown: false, letter };
            let noT = ActionManager.NothingTrigger;

            actionManager.registerAction( new CombineAction( ActionManager.OnPickDownTrigger, [
                new InterpolateValueAction( noT, mesh, 'position', pressedPosition, 50 ),
                new PlaySoundAction( noT, new Sound( 'keyboard-sound', buttonDownSound, scene ) ),
                new SetValueAction( noT, metadata, 'isDown', true )
            ] ) );

            actionManager.registerAction( new CombineAction( ActionManager.OnPickUpTrigger, [
                new InterpolateValueAction( noT, mesh, 'position', originalPosition, 50 ),
                new InterpolateValueAction( noT, mesh, 'rotation', new Vector3( Math.PI * .5, 0, 0 ), 50 ),
                new PlaySoundAction( noT, new Sound( 'keyboard-sound', buttonUpSound, scene ) ),
                new SetValueAction( noT, metadata, 'isDown', false ),
                new ExecuteCodeAction( noT, event => this.keyPressed.dispatch( mesh.metadata.letter ) )
            ], new ValueCondition( actionManager, metadata, 'isDown', true, ValueCondition.IsEqual ) ) );

            actionManager.registerAction( new CombineAction( ActionManager.OnPointerOutTrigger, [
                new InterpolateValueAction( noT, mesh, 'position', originalPosition, 50 ),
                new PlaySoundAction( noT, new Sound( 'keyboard-sound', buttonUpSound, scene ) ),
                new SetValueAction( noT, metadata, 'isDown', false )
            ], new ValueCondition( actionManager, metadata, 'isDown', true, ValueCondition.IsEqual ) ) );

            return mesh;
        } );
    }

    public disable() {
        this.keys.forEach( mesh => mesh.isPickable = false );
    }

    public reset() {
        this.keys.forEach( mesh => {
            mesh.rotation.set( 0, 0, 0 );
            mesh.isPickable = true;
            mesh.metadata.isDown = false;
        } );
    }
}
