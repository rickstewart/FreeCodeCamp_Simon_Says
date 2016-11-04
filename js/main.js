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
    var redSegment;
    var greenSegment;
    var yellowSegment;
    var blueSegment;
    var pattern;
    var loopCounter;

    function init() {
        redSegment = $('#game-top-left');                 // create references to HTML screen areas.
        greenSegment = $('#game-top-right');
        yellowSegment = $('#game-bottom-left');
        blueSegment = $('#game-bottom-right');
        colors = ['9c121c', '03A64B', 'CBA60C', '094A8F'];
        if (!window.AudioContext) {
            alert('you browser does not support Web Audio API');
        }
        AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
        FLASH_INTERVAL = 200;
        setTimeout(function() {
            go();
        }, 600);
    }

    function go() {
        pattern = simonPatternGenerator();
        loopCounter = pattern.length;
        timingLoop();
    }

    function timingLoop() {
        setTimeout(function() {
            simonPlays(pattern[loopCounter]);
            loopCounter--;
            if(loopCounter >= 0) {
                timingLoop();
            }
        },600);
    }

    function playTone(freq, toneLength) {
        oscillator = audioCtx.createOscillator();
        oscillator.type = 'sine';
        oscillator.connect(audioCtx.destination);
        oscillator.frequency.value = freq;
        oscillator.start();
        setTimeout(function() {
            oscillator.disconnect(audioCtx.destination);
            oscillator = null;
        }, toneLength);
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

    function flashRed() {
        redSegment.css('background-color', '#ff1c2b');
        playTone(164, 200);
        setTimeout(function () {
            redSegment.css('background-color', '#9c121c');
        }, FLASH_INTERVAL);
    }

    function flashGreen() {
        greenSegment.css('background-color', '#00ff6e');
        playTone(220, 200);
        setTimeout(function () {
            greenSegment.css('background-color', '#03A64B');
        }, FLASH_INTERVAL);
    }

    function flashYellow() {
        yellowSegment.css('background-color', '#f6ff00');
        playTone(261, 200);
        setTimeout(function () {
            yellowSegment.css('background-color', '#CBA60C');
        }, FLASH_INTERVAL);
    }

    function flashBlue() {
        blueSegment.css('background-color', '#1188ff');
        playTone(329, 200);
        setTimeout(function () {
            blueSegment.css('background-color', '#094A8F');
        }, FLASH_INTERVAL);
    }

    function simonPlays(color) {
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

    $('#game-top-left').click(function() {
        simonPlays(0);
    });

    $('#game-top-right').click(function() {
        simonPlays(1);
    });

    $('#game-bottom-left').click(function() {
        simonPlays(2);
    });

    $('#game-bottom-right').click(function() {
        simonPlays(3);
    });

    $('#fcc-link').mouseover(function () {
        this.style.color = 'yellow';
    });

    $('#fcc-link').mouseout(function () {
        this.style.color = '#795151';
    });

    $('#fcc-link').click(function () {
        window.open('https://www.freecodecamp.com/challenges/build-a-simon-game');
    });

    init();
})();