/**
 * Created by Rick on 6/17/2016.
 */
/**
 * reference material for physics of bouncing and colliding balls:
 * http//:gamedevelopment.tutsplus.com/tutorials/when-worlds-collide-simulating-circle-circle-collisions--gamedev-769
**/

(function () {
    'use strict';
    var FPS;
    var BALLS_TO_MAKE;
    var RADIUS;
    var MIN_SPEED;
    var MAX_SPEED;
    var FLASH_INTERVAL;
    var canvas;
    var ctx;
    var colors;
    var width;
    var height;
    var balls;
    var pairs;
    var initialCoordinates;
    var simonColorPattern;
    var sounds;
    var audioElement;

    function init() {
        canvas = document.getElementById('canvas');
        audioElement = document.createElement('audio');
        ctx = canvas.getContext('2d');
        FPS = 120;
        BALLS_TO_MAKE = 4;
        RADIUS = 70;
        MIN_SPEED = 10;
        MAX_SPEED = 50;
        FLASH_INTERVAL = 200;
        colors = ['9c121c', '03A64B', 'CBA60C', '094A8F'];
        width = canvas.width = calculateCanvasDimensions();
        height = canvas.height = width;
        simonColorPattern = simonPatternGenerator();
        console.log('width: ' + width + ' height: ' + height);                                  // TODO: remove
        initialCoordinates = [[0.25, 0.25],[0.75,0.25],[0.25, 0.75],[0.75, 0.75]];
        sounds = ['sounds/simon_164Hz_1s.mp3', 'sounds/simon_220Hz_1s.mp3', 'sounds/simon_261Hz_1s.mp3', 'sounds/simon_329Hz_1s.mp3'];
        balls = [];
        pairs = [];
        setInterval(main_loop, 1000 / FPS);
        createBalls();
    }

    function simonPatternGenerator() {
        var randomColor;
        var twentyRandomColors = [];
        for(var i = 0; i < 20; i++) {
            randomColor = Math.floor(Math.random() * 4);   // random number 0 - 3 inclusive.
            twentyRandomColors.push(randomColor);
        }
        return twentyRandomColors;
    }

    function calculateCanvasDimensions() {
        var viewportHeight = window.innerHeight;                 // get current height of viewport.
        var viewportWidth = window.innerWidth;                   // get current width of viewport.
        var lengthOfSide;
        if (viewportWidth > viewportHeight) {                    // if viewport aspect ratio is landscape shaped.
            lengthOfSide = viewportHeight * 0.6;                 // calculate length of a side.
        }
        else {                                                   // else viewport aspect ratio is portrait shaped.
            lengthOfSide = viewportWidth * 0.6;                  // calculate length of a side.
        }
        return lengthOfSide;
    }

    $(window).on('resize orientationChange', function () {
        width = canvas.width = calculateCanvasDimensions();
        height = canvas.height = width;
    });

    /* Constructor function for a ball object */
    function Ball(x, y, r, vx, vy, color) {
        this.x = x;                                              // x coordinate of the circle.
        this.y = y;                                              // y coordinate of the circle.
        this.r = r;                                              // radius of the circle.
        this.area = Math.PI * r * r;                             // area of the circle.
        this.vx = vx;                                            // velocity x direction.
        this.vy = vy;                                            // velocity y direction.
        this.color = color;                                      // color of the circle.
        this.draw = function () {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);     // create a circle
            ctx.fill();
        };
    }

    function createBalls() {
        var x;
        var y;
        var vx;
        var vy;
        var ball;
        for (var i = 0; i < BALLS_TO_MAKE; i++) {
            x = initialCoordinates[i][0] * canvas.width;
            y = initialCoordinates[i][1] * canvas.height;
            vx = (MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED)) * [1, -1][Math.floor(Math.random() + 0.5)]; // set velocity X direction.
            vy = (MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED)) * [1, -1][Math.floor(Math.random() + 0.5)]; // set velocity y direction.
            console.log('x: ' + x + ' y: ' + y + ' vx: ' + vx + ' vy: ' + vy + ' r: ' + RADIUS);                            //TODO: remove
            ball = new Ball(x, y, RADIUS, vx, vy, '#' + colors[i]);
            balls.push(ball);                                    // store new ball.
        }
        for (var k = 0; k < balls.length - 1; k++) {             // find and store all 6 possible pair combinations of 4 balls.
            for (var j = k + 1; j < balls.length; j++) {
                pairs.push([balls[k], balls[j]]);
            }
        }
    }

    function updatePosition(ball) {
        ball.x += ball.vx / FPS;
        ball.y += ball.vy / FPS;

        if (ball.x + ball.vx / FPS + ball.r > canvas.width) {    // ball hits the right wall.
            ball.vx = Math.abs(ball.vx) * -1;
        }
        else if (ball.x + ball.vx / FPS - ball.r < 0) {          // ball hits the left wall?
            ball.vx = Math.abs(ball.vx);
        }
        if (ball.y + ball.vy / FPS + ball.r > canvas.height) {   // ball hits top of canvas.
            ball.vy = Math.abs(ball.vy) * -1;
        }
        else if (ball.y + ball.vy / FPS - ball.r < 0) {          // ball hits the bottom of the canvas.
            ball.vy = Math.abs(ball.vy);
        }
    }

    /* distance formula for 2 points on x - y coordinate system. */
    function distance(ball1, ball2) {
        return Math.sqrt((ball1.x - ball2.x) * (ball1.x - ball2.x) + (ball1.y - ball2.y) * (ball1.y - ball2.y));
    }

    function isTouching(ball_A, ball_B) {
        if (distance(ball_A, ball_B) <= (2 * RADIUS) + 3) {            // if balls touching.
            return true;
        }
    }

    function main_loop() {
        var delta_ax;
        var delta_ay;
        var delta_bx;
        var delta_by;
        var theta;
        var ball_A;
        var ball_B;

        ctx.clearRect(0, 0, canvas.width, canvas.height);        // clear the canvas.
        for (var j = 0; j < pairs.length; j++) {                 // test each possible ball pairing.
            ball_A = pairs[j][0];
            ball_B = pairs[j][1];

            if (isTouching(ball_A, ball_B)) {                           // test if balls in pair are touching if collision counter is zero.
                theta = Math.atan((ball_B.y - ball_A.y) / (ball_B.x - ball_A.x));            // find the angle between the two points in radians.
                delta_ax = Math.cos(theta) * (ball_A.vx) - Math.sin(theta) * (ball_A.vy);    // calculate the elastic collision results.
                delta_ay = Math.cos(theta) * (ball_A.vy) + Math.sin(theta) * (ball_A.vx);
                delta_bx = Math.cos(theta) * (ball_B.vx) - Math.sin(theta) * (ball_B.vy);
                delta_by = Math.cos(theta) * (ball_B.vy) + Math.sin(theta) * (ball_B.vx);
                                                                 // ball's area used in-leau of a ball mass for new velocity.
                ball_A.vx = delta_ax * (ball_A.area - ball_B.area) + (2 * ball_B.area * delta_bx) / (ball_A.area + ball_B.area);
                ball_A.vy = delta_ay * (ball_A.area - ball_B.area) + (2 * ball_B.area * delta_by) / (ball_A.area + ball_B.area);
                ball_B.vx = delta_bx * (ball_B.area - ball_A.area) + (2 * ball_A.area * delta_ax) / (ball_A.area + ball_B.area);
                ball_B.vy = delta_by * (ball_B.area - ball_A.area) + (2 * ball_A.area * delta_ay) / (ball_A.area + ball_B.area);
            }
        }
        for (var i = 0; i < balls.length; i++) {
                updatePosition(balls[i]);                        // update each ball position before next render.
                balls[i].draw();                                 // render each ball.
        }
    }

    function clickedBallTest(clickX, clickY) {
        for(var i = 0; i < balls.length; i++) {
            if(Math.sqrt((balls[i].x - clickX) * (balls[i].x - clickX) + (balls[i].y - clickY) * (balls[i].y - clickY)) < RADIUS) {
                return i;
            }
        }
        return -1;
    }

    function flashRed() {
        balls[0].color = '#ff1c2b';
        playSound(0);
        setTimeout(function() {
            balls[0].color = '#9c121c';
        }, FLASH_INTERVAL);
    }

    function flashGreen() {
        balls[1].color = '#00ff6e';
        playSound(1);
        setTimeout(function() {
            balls[1].color = '#03A64B';
        }, FLASH_INTERVAL);
    }

    function flashYellow() {
        balls[2].color = '#f6ff00';
        playSound(2);
        setTimeout(function() {
            balls[2].color = '#CBA60C';
        }, FLASH_INTERVAL);
    }

    function flashBlue() {
        balls[3].color = '#1188ff';
        playSound(3);
        setTimeout(function() {
            balls[3].color = '#094A8F';
        }, FLASH_INTERVAL);
    }

    function playSound(num) {
        audioElement.setAttribute('src', sounds[num]);
        audioElement.play();
    }

    function simonPlays(turn) {
        var temp;
        for(var i = 0; i < turn; i++ ) {
            setTimeout(function() {
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

    $('#canvas').mousedown(function(e) {
        console.log('x: ' + e.offsetX + ' y: ' + e.offsetY);
        var num = clickedBallTest(e.offsetX, e.offsetY);
        console.log('num: ' + num);
        if(num > -1) {
            if(num === 0) {
                flashRed();
            }
            else if ( num === 1) {
                flashGreen();
            }
            else if ( num === 2) {
                flashYellow();
            }
            else if ( num === 3) {
                flashBlue();
            }
        }
    });

    init();
    simonPlays(20);
})();