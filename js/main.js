/**
 * Created by Rick on 6/17/2016.
 */

(function () {
    'use strict';
    var FLASH_INTERVAL;
    var colors;
    var AudioContext;
    var audioCtx;
    var oscillator;
    var pattern;
    var loopCounter;
    var playedToneCount;
    var computerLoopRun;
    var postComputerLoopCleanup;
    var playerLoopRun;
    var computersTurn;
    var playersMoves;
    var clickEnabled;
    var maskClickEvents;
    var setTimeoutOne;
    var trackLevel;
    var redSegment = $('#game-top-left');                 // create references to HTML screen areas.
    var greenSegment = $('#game-top-right');
    var yellowSegment = $('#game-bottom-left');
    var blueSegment = $('#game-bottom-right');
    var fccLink = $('#fcc-link');

    function init() {
        colors = ['9c121c', '03A64B', 'CBA60C', '094A8F'];
        if (!window.AudioContext) {
            alert('you browser does not support Web Audio API');
        }
        AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
        FLASH_INTERVAL = 200;
        playedToneCount = 0;
        playersMoves = [];
        computerLoopRun = true;
        postComputerLoopCleanup = true;
        playerLoopRun = false;
        clickEnabled = false;
        maskClickEvents = false;
        setTimeout(function () {
            gameLoop();                     // delay game start so that display finishes initialization.
        }, 600);
    }

    function gameLoop() {
        pattern = simonPatternGenerator();
        loopCounter = trackLevel = 3;
        setInterval(function () {
            if (computerLoopRun) {
                clickEnabled = false;
                computerLoopRun = false;
                computersTurn = true;
                computerTurnTimingLoop();
            }
            if (postComputerLoopCleanup && playedToneCount === trackLevel + 1) {
                postComputerLoopCleanup = false;
                computersTurn = false;
                setTimeout(function () {
                    clickEnabled = true;
                }, 400);
                playerLoopRun = true;
                playedToneCount = [];
                clearTimeout(setTimeoutOne);
                console.log('timingLoop done...');
            }
            if (playedToneCount === trackLevel + 1 && playerLoopRun) {
                console.log('player made third move...');
                playerLoopRun = false;
                clickEnabled = false;
                setTimeout(function () {
                    testPlayerResponse();
                }, 100);
            }
        }, 1000);
    }

    function testPlayerResponse() {
        if (playersMoves.length >= trackLevel) {
            console.log('testPlayerResponse() firing player made moves');
            for (var i = 0; i <= trackLevel; i++) {
                if (playersMoves[i] !== pattern[i]) {
                    playersMoves = [];
                    loopCounter = trackLevel;
                    setTimeout(function () {
                        errorFlash();
                    }, 600);
                    return;
                }
            }
            trackLevel++;
            loopCounter = trackLevel;
            playersMoves = [];
        }
    }

    function computerTurnTimingLoop() {
        setTimeoutOne = setTimeout(function () {
            chooseColorAndPlay(pattern[loopCounter], 'computer');
            loopCounter--;
            computerTurnTimingLoop();
        }, 900);
    }

    function playTone(freq, toneLength) {
        oscillator = audioCtx.createOscillator();
        oscillator.type = 'sine';
        oscillator.connect(audioCtx.destination);
        oscillator.frequency.value = freq;
        oscillator.start();
        playedToneCount++;
        setTimeout(function () {
            oscillator.disconnect(audioCtx.destination);
            oscillator = null;
        }, toneLength);
    }

    function chooseColorAndPlay(color, whoClicked) {
        if (whoClicked === 'computer') {
            console.log('chooseColorAndPlay() computers turn firing');
            switch (color) {
                case 0:
                    flashRed();
                    break;
                case 1:
                    flashGreen();
                    break;
                case 2:
                    flashYellow();
                    break;
                case 3:
                    flashBlue();
                    break;
            }
        }
        else if (whoClicked === 'player' && clickEnabled && !maskClickEvents) {
            console.log('chooseColorAndPlay() players turn firing');
            maskClickEvents = true;
            switch (color) {
                case 0:
                    flashRed();
                    playersMoves.unshift(0);
                    break;
                case 1:
                    flashGreen();
                    playersMoves.unshift(1);
                    break;
                case 2:
                    flashYellow();
                    playersMoves.unshift(2);
                    break;
                case 3:
                    flashBlue();
                    playersMoves.unshift(3);
                    break;
            }
        }
    }

    function errorFlash() {
        redSegment.css('background-color', '#ff1c2b');
        greenSegment.css('background-color', '#00ff6e');
        yellowSegment.css('background-color', '#f6ff00');
        blueSegment.css('background-color', '#1188ff');
        playTone(560, FLASH_INTERVAL);
        setTimeout(function () {
            redSegment.css('background-color', '#9c121c');
            greenSegment.css('background-color', '#03A64B');
            yellowSegment.css('background-color', '#CBA60C');
            blueSegment.css('background-color', '#094A8F');
        }, FLASH_INTERVAL);
    }

    function flashRed() {
            redSegment.css('background-color', '#ff1c2b');
            playTone(164, FLASH_INTERVAL);
            setTimeout(function () {
                redSegment.css('background-color', '#9c121c');
            }, FLASH_INTERVAL);
        setTimeout(function() {
            maskClickEvents = false;
        }, 400);
    }

    function flashGreen() {
            greenSegment.css('background-color', '#00ff6e');
            playTone(220, FLASH_INTERVAL);
            setTimeout(function () {
                greenSegment.css('background-color', '#03A64B');
            }, FLASH_INTERVAL);
        setTimeout(function() {
            maskClickEvents = false;
        }, 400);
    }

    function flashYellow() {
            yellowSegment.css('background-color', '#f6ff00');
            playTone(261, FLASH_INTERVAL);
            setTimeout(function () {
                yellowSegment.css('background-color', '#CBA60C');
            }, FLASH_INTERVAL);
        setTimeout(function() {
            maskClickEvents = false;
        }, 400);
    }

    function flashBlue() {
            blueSegment.css('background-color', '#1188ff');
            playTone(329, FLASH_INTERVAL);
            setTimeout(function () {
                blueSegment.css('background-color', '#094A8F');
            }, FLASH_INTERVAL);
        setTimeout(function() {
            maskClickEvents = false;
        }, 400);
    }

    function simonPatternGenerator() {
        var randomColor;
        var twentyRandomColors = [];
        for (var i = 0; i < 20; i++) {
            randomColor = Math.floor(Math.random() * 4);   // random number 0 - 3 inclusive.
            twentyRandomColors.push(randomColor);
        }
        //return twentyRandomColors;
        return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    redSegment.click(function () {
        chooseColorAndPlay(0, 'player');
    });

    greenSegment.click(function () {
        chooseColorAndPlay(1, 'player');
    });

    yellowSegment.click(function () {
        chooseColorAndPlay(2, 'player');
    });

    blueSegment.click(function () {
        chooseColorAndPlay(3, 'player');
    });

    fccLink.mouseover(function () {
        this.style.color = 'yellow';
    });

    fccLink.mouseout(function () {
        this.style.color = '#795151';
    });

    fccLink.click(function () {
        window.open('https://www.freecodecamp.com/challenges/build-a-simon-game');
    });

    init();
})();