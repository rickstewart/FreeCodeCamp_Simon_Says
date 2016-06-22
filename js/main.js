/**
 * Created by Rick on 6/17/2016.
 */

(function () {
    'use strict';
    var FLASH_INTERVAL;
    var ctx;
    var colors;
    var simonColorPattern;
    var sounds;
    var audioElement;

    function init() {
        audioElement = document.createElement('audio');
        colors = ['9c121c', '03A64B', 'CBA60C', '094A8F'];
        simonColorPattern = simonPatternGenerator();
        sounds = ['sounds/simon_164Hz_1s.mp3', 'sounds/simon_220Hz_1s.mp3', 'sounds/simon_261Hz_1s.mp3', 'sounds/simon_329Hz_1s.mp3'];
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
        balls[0].color = '#ff1c2b';
        playSound(0);
        setTimeout(function () {
            balls[0].color = '#9c121c';
        }, FLASH_INTERVAL);
    }

    function flashGreen() {
        balls[1].color = '#00ff6e';
        playSound(1);
        setTimeout(function () {
            balls[1].color = '#03A64B';
        }, FLASH_INTERVAL);
    }

    function flashYellow() {
        balls[2].color = '#f6ff00';
        playSound(2);
        setTimeout(function () {
            balls[2].color = '#CBA60C';
        }, FLASH_INTERVAL);
    }

    function flashBlue() {
        balls[3].color = '#1188ff';
        playSound(3);
        setTimeout(function () {
            balls[3].color = '#094A8F';
        }, FLASH_INTERVAL);
    }

    function playSound(num) {
        audioElement.setAttribute('src', sounds[num]);
        audioElement.play();
    }

    function simonPlays(turn) {
        var temp;
        for (var i = 0; i < turn; i++) {
            setTimeout(function () {
                temp = simonColorPattern[i];
                switch (temp) {
                    case 0:
                        flashRed();
                        break;
                    case 1:
                        flashGreen();
                        break;
                    case 3:
                        flashYellow();
                        break;
                    case 4:
                        flashBlue();
                        break;
                }
            }, 1000);
        }
    }


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