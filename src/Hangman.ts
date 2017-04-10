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
    BoundingInfo,
    DistanceJointData,
    Mesh,
    PhysicsImpostor,
    PhysicsJoint,
    Scene,
    StandardMaterial,
    Texture,
    Vector3
} from "babylonjs";
import { hangmanImageDiffuse } from "./textures";

export default class Hangman extends Mesh {

    public meshes:Mesh[] = [];
    private partsVisible:number = 0;

    constructor( name:string, scene:Scene ) {
        super( name, scene );

        this.position.set( 0, 4, 0 );
        this.setBoundingInfo( new BoundingInfo( new Vector3( -.1, -.1, -.1 ), new Vector3( .1, .1, .1 ) ) );

        let material = new StandardMaterial( 'hangman-material', scene );
        material.diffuseTexture = new Texture( hangmanImageDiffuse, scene );
        material.specularColor.set( 0, 0, 0 );
        material.emissiveColor.set( .25, .25, .25 );

        this.physicsImpostor = new PhysicsImpostor( this, PhysicsImpostor.SphereImpostor, {
            mass: 0,
            restitution: 0.9
        } );

        let head = Mesh.CreateSphere( 'head', 12, .5, scene );
        // head.checkCollisions = true;
        head.material = material;
        head.position.set( 0, 3.5, 0 );
        head.isVisible = false;
        head.physicsImpostor = new PhysicsImpostor( head, PhysicsImpostor.SphereImpostor, {
            mass: 2,
            // friction: 1,
            restitution: 0.9
        }, scene );
        head.physicsImpostor.createJoint( this.physicsImpostor, PhysicsJoint.BallAndSocketJoint, {
            mainPivot: new Vector3( 0, .5, 0 ),
            connectedPivot: new Vector3( 0, 0, 0 ),
        } );

        // let body = Mesh.CreateSphere( 'body', 12, .5, scene );
        // body.scaling.set( 1, 2, 1 );
        let body = Mesh.CreateCylinder( 'body', 1, .5, .5, 12, 12, scene );
        // body.checkCollisions = true;
        body.material = material;
        body.position.set( 0, 2.65, 0 );
        body.isVisible = false;
        body.physicsImpostor = new PhysicsImpostor( body, PhysicsImpostor.CylinderImpostor, {
            mass: 4,
            // friction: 1,
            restitution: 0.9
        }, scene );
        body.physicsImpostor.createJoint( head.physicsImpostor, PhysicsJoint.BallAndSocketJoint, {
            mainPivot: new Vector3( 0, 0.55, 0 ),
            connectedPivot: new Vector3( 0, -0.3, 0 ),
        } );


        //
        //
        // console.log(body.getBoundingInfo());
        // console.log(body.physicsImpostor.physicsBody);
        //
        //
        // let leftHand = Mesh.CreateSphere( 'left-hand', 12, .25, scene );
        // leftHand.scaling.set( 1, 4, 1 );
        let leftHand = Mesh.CreateCylinder( 'left-hand', 1, .25, .25, 12, 12, scene );
        // leftHand.checkCollisions = true;
        leftHand.position.set( -.5, 2.65, 0 );
        leftHand.material = material;
        leftHand.isVisible = false;
        leftHand.physicsImpostor = new PhysicsImpostor( leftHand, PhysicsImpostor.CylinderImpostor, {
            mass: 1,
            // friction: 1,
            restitution: 0.9
        }, scene );
        leftHand.physicsImpostor.createJoint( body.physicsImpostor, PhysicsJoint.DistanceJoint, {
            maxDistance: .01,
            mainPivot: new Vector3( 0, 0.55, 0 ),
            // mainAxis: Vector3.Forward(),
            connectedPivot: new Vector3( -.3, 0.55, 0 ),
            // connectedAxis: Vector3.Forward()
        } as DistanceJointData );

        //
        // let rightHand = Mesh.CreateSphere( 'right-hand', 12, .25, scene );
        // rightHand.scaling.set( 1, 4, 1 );
        let rightHand = Mesh.CreateCylinder( 'right-hand', 1, .25, .25, 12, 12, scene );
        // rightHand.checkCollisions = true;
        rightHand.position.set( .5, 2.65, 0 );
        rightHand.material = material;
        rightHand.isVisible = false;
        rightHand.physicsImpostor = new PhysicsImpostor( rightHand, PhysicsImpostor.CylinderImpostor, {
            mass: 2,
            // friction: 1,
            restitution: 0.9
        }, scene );
        rightHand.physicsImpostor.createJoint( body.physicsImpostor, PhysicsJoint.BallAndSocketJoint, {
            mainPivot: new Vector3( 0, 0.55, 0 ),
            // mainAxis: Vector3.Forward(),
            connectedPivot: new Vector3( .3, 0.55, 0 ),
            // connectedAxis: Vector3.Forward()
        } );


        let leftLeg = Mesh.CreateCylinder( 'left-leg', 1, .25, .25, 12, 12, scene );
        // leftLeg.checkCollisions = true;
        leftLeg.position.set( -.5, 2, 0 );
        leftLeg.material = material;
        leftLeg.isVisible = false;
        leftLeg.physicsImpostor = new PhysicsImpostor( leftLeg, PhysicsImpostor.CylinderImpostor, {
            mass: 1,
            // friction: 1,
            restitution: 0.9
        }, scene );
        leftLeg.physicsImpostor.createJoint( body.physicsImpostor, PhysicsJoint.DistanceJoint, {
            maxDistance: .01,
            mainPivot: new Vector3( 0, 0.55, 0 ),
            // mainAxis: Vector3.Forward(),
            connectedPivot: new Vector3( -.15, -0.55, 0 ),
            // connectedAxis: Vector3.Forward()
        } as DistanceJointData );

        //
        // let rightLeg = Mesh.CreateSphere( 'right-hand', 12, .25, scene );
        // rightLeg.scaling.set( 1, 4, 1 );
        let rightLeg = Mesh.CreateCylinder( 'right-leg', 1, .25, .25, 12, 12, scene );
        // rightLeg.checkCollisions = true;
        rightLeg.position.set( .5, 2, 0 );
        rightLeg.material = material;
        rightLeg.isVisible = false;
        rightLeg.physicsImpostor = new PhysicsImpostor( rightLeg, PhysicsImpostor.CylinderImpostor, {
            mass: 2,
            // friction: 1,
            restitution: 0.9
        }, scene );
        rightLeg.physicsImpostor.createJoint( body.physicsImpostor, PhysicsJoint.BallAndSocketJoint, {
            mainPivot: new Vector3( 0, 0.55, 0 ),
            // mainAxis: Vector3.Forward(),
            connectedPivot: new Vector3( .15, -0.55, 0 ),
            // connectedAxis: Vector3.Forward()
        } );

        this.meshes.push( head, body, leftHand, rightHand, leftLeg, rightLeg );
    }

    public showNextPart():void {
        let mesh = this.meshes[ this.partsVisible ];
        this.partsVisible++;
        mesh.isVisible = true;
        mesh.physicsImpostor.applyImpulse( new Vector3( 1, 0, 1 ), mesh.getAbsolutePosition() );
    }

    public reset() {
        this.partsVisible = 0;
        this.meshes.forEach( mesh => mesh.isVisible = false );
    }
}