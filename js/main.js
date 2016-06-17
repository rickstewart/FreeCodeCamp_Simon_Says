/**
 * Created by Rick on 6/17/2016.
 */

//http://gamedevelopment.tutsplus.com/tutorials/when-worlds-collide-simulating-circle-circle-collisions--gamedev-769

(function () {
    'use strict';
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var colors = ['FF3727', '09B418', 'FFFF01', '00AAF3'];
    var FPS = 120;
    var NUMBER_OF_BALLS = 4;
    var RADIUS = 40;
    var MIN_SPEED = 60;
    var MAX_SPEED = 140;
    var width = canvas.width = '800';
    var height = canvas.height = '600';
    var balls = [];
    var pairs = [];
    var ravx;
    var ravy;
    var rbvx;
    var rbvy;
    var ravx2;
    var ravy2;
    var rbvx2;
    var rbvy2;

    function init() {
        setInterval(main_loop, 1000 / FPS);
        createBalls();
    }

    window.onresize = function () {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };

    function Ball(x, y, r, vx, vy, color) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.m = Math.PI * r * r;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.draw = function () {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);  // create a circle
            ctx.fill();
        };
    }

    function createBalls() {
        for (var i = 0; i < NUMBER_OF_BALLS; i++) {
            var x = Math.random() * canvas.width;                   // random starting x coordinate.
            var y = Math.random() * canvas.height;                  // random starting y coordinate.
            var r = RADIUS;
            var vx = (MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED)) * [1, -1][Math.floor(Math.random() + 0.5)];
            var vy = (MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED)) * [1, -1][Math.floor(Math.random() + 0.5)];
            var ball = new Ball(x, y, r, vx, vy, '#' + colors[i]);
            balls.push(ball);
        }
        for (var k = 0; k < balls.length - 1; k++) {
            for (var j = k + 1; j < balls.length; j++) {
                pairs.push([balls[k], balls[j]]);
            }
        }
    }

    function update(ball) {
        ball.x += ball.vx / FPS;
        ball.y += ball.vy / FPS;

        if (ball.x + ball.vx / FPS + ball.r > canvas.width) {   // ball hits the right wall.
            ball.vx = Math.abs(ball.vx) * -1;
        }
        else if (ball.x + ball.vx / FPS - ball.r < 0) {       // ball hits the left wall?
            ball.vx = Math.abs(ball.vx);
        }
        if (ball.y + ball.vy / FPS + ball.r > canvas.height) {  // ball hits top of canvas.
            ball.vy = Math.abs(ball.vy) * -1;
        }
        else if (ball.y + ball.vy / FPS - ball.r < 0) {        // ball hits the bottom of the canvas.
            ball.vy = Math.abs(ball.vy);
        }
    }

    /* distance formula for 2 points on x - y coordinate system. */
    function distance(ball1, ball2) {
        return Math.sqrt((ball1.x - ball2.x) * (ball1.x - ball2.x) + (ball1.y - ball2.y) * (ball1.y - ball2.y));
    }

    function isTouching(ball_A, ball_B) {
        //if (Math.abs(ball_A.x - ball_B.x) <= 2 * RADIUS && Math.abs(ball_A.y - ball_B.y) <= 2 * RADIUS) {
        if (distance(ball_A, ball_B) <= 2 * RADIUS) {        // if balls touching.
            return true;
        }
        //}
    }

    function main_loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);        // clear the canvas.
        for (var i = 0; i < balls.length; i++) {
            balls[i].draw();                                     // render each ball.
            update(balls[i]);                                    // update each ball position before next render.
        }
        for (var j = 0; j < pairs.length; j++) {                 // test each possible ball pairing.
            var ball_A = pairs[j][0];
            var ball_B = pairs[j][1];
            if (isTouching(ball_A, ball_B)) {                    // test if balls in pair are touching.
                var theta = Math.atan((ball_B.y - ball_A.y) / (ball_B.x - ball_A.x)); // find the angle between the two points in radians.
                console.log(theta);
                console.log([
                    ravx = Math.cos(theta) * (ball_A.vx) - Math.sin(theta) * (ball_A.vy),
                    ravy = Math.cos(theta) * (ball_A.vy) + Math.sin(theta) * (ball_A.vx),
                    rbvx = Math.cos(theta) * (ball_B.vx) - Math.sin(theta) * (ball_B.vy),
                    rbvy = Math.cos(theta) * (ball_B.vy) + Math.sin(theta) * (ball_B.vx)
                ]);

                console.log([
                    ravx2 = (ball_A.m - ball_B.m) / (ball_A.m + ball_B.m) * ravx + (2 * ball_B.m) / (ball_A.m + ball_B.m) * rbvx,
                    ravy2 = ravy,
                    rbvx2 = (2 * ball_A.m) / (ball_A.m + ball_B.m) * ravx + (ball_B.m - ball_A.m) / (ball_A.m + ball_B.m) * rbvx,
                    rbvy2 = rbvy
                ]);

                console.log([
                    ball_A.vx = Math.cos(theta) * ravx2 - Math.sin(theta) * ravy2,
                    ball_A.vy = Math.cos(theta) * ravy2 + Math.sin(theta) * ravx2,
                    ball_B.vx = Math.cos(theta) * rbvx2 - Math.sin(theta) * rbvy2,
                    ball_B.vy = Math.cos(theta) * rbvy2 + Math.sin(theta) * rbvx2
                ]);
            }
        }
    }

    init();
})();