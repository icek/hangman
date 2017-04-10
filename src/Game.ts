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

import HangmanScene from "./HangmanScene";
export default class Game {

    private looseScreen:HTMLElement;
    private winScreen:HTMLElement;

    private currentWordList:string[];
    private currentWord:string;
    private lettersToGuess:number;
    private pressedLetters:string[];
    private level:number;
    private partsVisible:number;

    private gameTime:number;

    constructor( private wordList:string[], private scene:HangmanScene ) {
        let looseScreen = this.looseScreen = document.getElementById( 'loose-screen' );
        let winScreen = this.winScreen = document.getElementById( 'win-screen' );

        this.onLetterPressed = this.onLetterPressed.bind( this );

        looseScreen.getElementsByTagName( 'button' )[ 0 ].addEventListener( 'click', this.restart( looseScreen ) );
        winScreen.getElementsByTagName( 'button' )[ 0 ].addEventListener( 'click', this.restart( winScreen ) );

    }

    public startNew() {
        console.log('-- NEW GAME --')
        this.currentWordList = this.wordList.slice( 0 );
        this.level = 0;

        this.scene.keyboard.keyPressed.add( this.onLetterPressed );

        this.gameTime = Date.now();

        this.newWord();
    }

    public newWord() {
        if( this.level < 5 ) {
            let { scene, currentWordList } = this;
            let index = Math.floor( Math.random() * currentWordList.length );
            let word = this.currentWord = currentWordList.splice( index, 1 )[ 0 ].toUpperCase();
            console.log( 'NEXT WORD:', word );
            this.lettersToGuess = word.length;
            this.pressedLetters = [];
            this.partsVisible = 0;
            this.level++;

            scene.hangman.reset();
            scene.keyboard.reset();
            scene.wordDisplay.showWord( word );
        } else {
            this.showScreen( this.winScreen );
        }
    }

    private onLetterPressed( letter ) {
        let { currentWord, pressedLetters, scene } = this;
        let delay = 0;

        if( pressedLetters.indexOf( letter ) == -1 ) {
            pressedLetters.push( letter );
            if( currentWord.indexOf( letter ) > -1 ) {
                for( let i = 0, len = currentWord.length; i < len; i++ ) {
                    if( currentWord[ i ] === letter ) {
                        setTimeout( () => scene.wordDisplay.showLetter( i ), delay * 1000 );
                        delay++;
                        this.lettersToGuess--;
                    }
                }
            } else {
                this.partsVisible++;
                scene.hangman.showNextPart();
            }
        }

        if( this.lettersToGuess == 0 ) {
            this.scene.keyboard.disable();
            setTimeout( () => {
                this.scene.wordDisplay.hideWord();
                // TODO: show recent words
                // this.scene.addWord( this.currentWord );
                setTimeout( () => this.newWord(), 3000 );
            }, delay * 1000 + 3000 );
        } else if( this.partsVisible > 5 ) {
            this.scene.keyboard.disable();
            this.endGame();
        }
    }

    public endGame() {
        let delay = 0;

        this.currentWord.split('').forEach( (letter, index) => {
            if( this.pressedLetters.indexOf( letter ) == -1 ) {
                setTimeout( () => this.scene.wordDisplay.showLetter( index ), delay * 1000 );
                delay++
            }
        });
        setTimeout( () => {
            this.scene.wordDisplay.hideWord();
            setTimeout( () => this.showScreen( this.looseScreen ), 1000 );
        }, delay * 1000 + 3000 );
    }

    public showScreen( screen:HTMLElement ) {
        let time = (Date.now() - this.gameTime) / 1000;
        let seconds = Math.round( time % 60 );
        let minutes = Math.round( time / 60 );
        screen.getElementsByClassName( 'time' )[ 0 ].innerHTML = minutes ? `${minutes}m ${seconds}s.` : `${seconds}s.`;
        screen.classList.remove( 'hidden' );
        setTimeout( () => screen.classList.remove( 'invisible' ), 0 );
    }

    public hideScreen( screen:HTMLElement ) {
        screen.classList.add( 'invisible' );
        let handler = () => {
            screen.removeEventListener( 'transitionend', handler );
            screen.classList.add( 'hidden' )
        };
        screen.addEventListener( 'transitionend', handler );
    }

    private restart( fromScreen:HTMLElement ) {
        return () => {
            this.hideScreen( fromScreen );
            this.startNew();
        }
    }
}