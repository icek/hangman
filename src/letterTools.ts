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

import { Vector4 } from "babylonjs";

export const ALPHABET = 'AĄBCĆDEĘFGHIJKLŁMNŃOÓPQRSŚTUVWXYZŹŻ';
export function letterToUV( letter:string ):Vector4[] {
    let index = ALPHABET.indexOf( letter.toUpperCase() );
    let frame = new Vector4(
        (index % 6) / 6,
        (5 - Math.floor( index / 6 )) / 6,
        (index % 6 + 1) / 6,
        (6 - Math.floor( index / 6 )) / 6
    );
    let emptyFrame = new Vector4( 5 / 6, 0, 1, 1 / 6 );
    return [ emptyFrame, frame, emptyFrame, emptyFrame, emptyFrame, emptyFrame ];
}