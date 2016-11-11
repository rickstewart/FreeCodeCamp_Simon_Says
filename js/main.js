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
    var timeout;
    var level;
    var correctPlayerResponse;
    var winPattern;
    var notStarted;
    var strict;
    var redSegment = $('#game-top-left');                 // create references to HTML screen areas.
    var greenSegment = $('#game-top-right');
    var yellowSegment = $('#game-bottom-left');
    var blueSegment = $('#game-bottom-right');
    var fccLink = $('#fcc-link');
    var levelCounterDisplay = $('#level-display');
    var startBtn = $('#start-btn');
    var strictBtn = $('#strict-btn');
    var powerOn;

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
        computerLoopRun = false;
        postComputerLoopCleanup = true;
        playerLoopRun = false;
        clickEnabled = false;
        maskClickEvents = false;
        correctPlayerResponse = false;
        timeout = 0;
        powerOn = false;
        notStarted = true;
        strict = false;
        $('#slider-left').show();
        $('#slider-right').hide();
        redSegment.css('background-color', '#700d14');
        greenSegment.css('background-color', '#027a36');
        yellowSegment.css('background-color', '#9e8009');
        blueSegment.css('background-color', '#073667');
        winPattern = [3, 3, 2, 1, 3, 3, 2, 1, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3];
        pattern = simonPatternGenerator();
        loopCounter = level = 0;
        setTimeout(function () {
            gameLoop();                     // delay game start so that display finishes initialization.
        }, 600);
    }

    function gameLoop() {
        setInterval(function () {
            timeout++;
            if (computerLoopRun) {
                computerLoopRun = false;
                clickEnabled = false;
                computersTurn = true;
                timeout = 0;
                computersTurnTimingLoop();
                postComputerLoopCleanup = true;
            }
            if (postComputerLoopCleanup && playedToneCount === level + 1) {
                postComputerLoopCleanup = false;
                computersTurn = false;
                setTimeout(function () {
                    clickEnabled = true;
                }, 100);
                playerLoopRun = true;
                playedToneCount = 0;
                timeout = 0;
                clearTimeout(setTimeoutOne);
                console.log('computers loop done...');
            }
            if (playersMoves.length === level + 1 && playerLoopRun) {
                console.log('player made all moves...');
                playerLoopRun = false;
                clickEnabled = false;
                timeout = 0;
                setTimeout(function () {
                    testPlayersResponse();
                }, 100);
            }
            if (correctPlayerResponse) {
                console.log('correctPlayerResponse() firing.');
                console.log('level: ' + level + ' loopCounter: ' + loopCounter + ' playersMoves: ' + playersMoves);
                correctPlayerResponse = false;
                timeout = 0;
                if (level === 19) {
                    console.log('winner() setTimeout firing.');
                    loopCounter = 40;
                    setTimeout(function () {
                        winner();
                    }, 200);
                    setTimeout(function () {
                        playTone(800, FLASH_INTERVAL);
                        pattern = simonPatternGenerator();
                        playersMoves = [];
                        loopCounter = level = 0;
                        levelCounterDisplay.text(pad(level + 1));      // update level counter on the display.
                        computerLoopRun = true;
                    }, 12000);
                }
                else {
                    level++;
                    loopCounter = level;
                    playersMoves = [];
                    console.log('level: ' + level + ' loopCounter: ' + loopCounter + ' playersMoves: ' + playersMoves);
                    levelCounterDisplay.text(pad(level + 1));      // update level counter on the display.
                    computerLoopRun = true;
                }
            }
        }, 800);
    }

    function computersTurnTimingLoop() {
        setTimeoutOne = setTimeout(function () {
            console.log('loopCounter: ' + loopCounter);
            chooseColorAndPlay(pattern[loopCounter], 'computer');
            if (loopCounter >= 0) {
                loopCounter--;
                console.log('loopCounter2: ' + loopCounter);
                computersTurnTimingLoop();
            }
            else {
                return;
            }
        }, 500);
    }

    function testPlayersResponse() {
        if (playersMoves.length >= level) {
            console.log('testPlayersResponse() firing player made moves');
            for (var i = 0; i <= level; i++) {
                if (playersMoves[i] !== pattern[i]) {
                    playersMoves = [];
                    if (strict) {
                        pattern = simonPatternGenerator();
                        playersMoves = [];
                        loopCounter = level = 0;
                        levelCounterDisplay.text(pad(level + 1));      // update level counter on the display.
                    }
                    else {
                        loopCounter = level;
                    }
                    computerLoopRun = true;
                    setTimeout(function () {
                        errorFlash();
                    }, 200);
                    return;
                }
            }
        }
        correctPlayerResponse = true;
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
            timeout = 0;
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

    function playTone(freq, toneLength) {
        oscillator = audioCtx.createOscillator();
        oscillator.type = 'sine';
        oscillator.connect(audioCtx.destination);
        oscillator.frequency.value = freq;
        oscillator.start();
        if (computersTurn) {
            playedToneCount++;
        }
        setTimeout(function () {
            oscillator.disconnect(audioCtx.destination);
            oscillator = null;
        }, toneLength);
    }

    function errorFlash() {
        redSegment.css('background-color', '#ff1c2b');
        greenSegment.css('background-color', '#00ff6e');
        yellowSegment.css('background-color', '#f6ff00');
        blueSegment.css('background-color', '#1188ff');
        playTone(800, FLASH_INTERVAL);
        setTimeout(function () {
            redSegment.css('background-color', '#9c121c');
            greenSegment.css('background-color', '#03A64B');
            yellowSegment.css('background-color', '#CBA60C');
            blueSegment.css('background-color', '#094A8F');
        }, FLASH_INTERVAL);
    }

    function winner() {
        console.log('winner() firing.');
        setTimeoutOne = setTimeout(function () {
            chooseColorAndPlay(winPattern[loopCounter], 'computer');
            if (loopCounter >= 0) {
                loopCounter--;
                winner();
            }
            else {
                return;
            }
        }, 220);
    }

    function flashRed() {
        redSegment.css('background-color', '#ff1c2b');
        playTone(164, FLASH_INTERVAL);
        setTimeout(function () {
            redSegment.css('background-color', '#9c121c');
        }, FLASH_INTERVAL);
        setTimeout(function () {
            maskClickEvents = false;
        }, 200);
    }

    function flashGreen() {
        greenSegment.css('background-color', '#00ff6e');
        playTone(220, FLASH_INTERVAL);
        setTimeout(function () {
            greenSegment.css('background-color', '#03A64B');
        }, FLASH_INTERVAL);
        setTimeout(function () {
            maskClickEvents = false;
        }, 200);
    }

    function flashYellow() {
        yellowSegment.css('background-color', '#f6ff00');
        playTone(261, FLASH_INTERVAL);
        setTimeout(function () {
            yellowSegment.css('background-color', '#CBA60C');
        }, FLASH_INTERVAL);
        setTimeout(function () {
            maskClickEvents = false;
        }, 200);
    }

    function flashBlue() {
        blueSegment.css('background-color', '#1188ff');
        playTone(329, FLASH_INTERVAL);
        setTimeout(function () {
            blueSegment.css('background-color', '#094A8F');
        }, FLASH_INTERVAL);
        setTimeout(function () {
            maskClickEvents = false;
        }, 200);
    }

    function simonPatternGenerator() {
        var randomColor;
        var twentyRandomColors = [];
        for (var i = 0; i < 20; i++) {
            randomColor = Math.floor(Math.random() * 4);   // random number 0 - 3 inclusive.
            twentyRandomColors.push(randomColor);
        }
        return twentyRandomColors;
    }

    function pad(number) {
        var str = number + '';
        while (str.length < 2) {
            str = '0' + str;
        }
        return str;
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

    $('#switch-outer').click(function () {
        if (!powerOn) {
            powerOn = true;
            notStarted = true;
            levelCounterDisplay.text('--');
            redSegment.css('background-color', '#9c121c');
            greenSegment.css('background-color', '#03A64B');
            yellowSegment.css('background-color', '#CBA60C');
            blueSegment.css('background-color', '#094A8F');
            $('#slider-left').hide();
            $('#slider-right').show();
        }
        else {
            powerOn = false;
            levelCounterDisplay.text('');
            playedToneCount = 0;
            playersMoves = [];
            computerLoopRun = false;
            postComputerLoopCleanup = true;
            playerLoopRun = false;
            clickEnabled = false;
            maskClickEvents = false;
            correctPlayerResponse = false;
            timeout = 0;
            notStarted = false;
            $('#slider-left').show();
            $('#slider-right').hide();
            redSegment.css('background-color', '#700d14');
            greenSegment.css('background-color', '#027a36');
            yellowSegment.css('background-color', '#9e8009');
            blueSegment.css('background-color', '#073667');
            pattern = simonPatternGenerator();
            loopCounter = level = 0;
        }
    });

    startBtn.click(function () {
        if (powerOn) {
            playedToneCount = 0;
            playersMoves = [];
            postComputerLoopCleanup = true;
            playerLoopRun = false;
            clickEnabled = false;
            maskClickEvents = false;
            correctPlayerResponse = false;
            timeout = 0;
            computerLoopRun = true;
            pattern = simonPatternGenerator();
            loopCounter = level = 0;
            notStarted = false;
            levelCounterDisplay.text(pad(level + 1));
            startBtn.css('background-color', '#bcbcbc');
            startBtn.css('border', '3px solid #db731e');
            setTimeout(function () {
                startBtn.css('background-color', '#808080');
                startBtn.css('border', '3px solid #CBA60C');
            }, 300);
        }
    });

    strictBtn.click(function () {
        if (powerOn && !strict) {
            strict = true;
            strictBtn.css('background-color', '#bcbcbc');
            strictBtn.css('border', '3px solid #db731e');
        }
        else if (powerOn && strict) {
            strict = false;
            strictBtn.css('background-color', '#808080');
            strictBtn.css('border', '3px solid #CBA60C');
        }
    });

    init();
})();
