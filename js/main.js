/**
 * Created by Rick on 6/17/2016.
 */

//http://gamedevelopment.tutsplus.com/tutorials/when-worlds-collide-simulating-circle-circle-collisions--gamedev-769

(function () {
    'use strict';
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var colors = ['FF3727', '09B418', 'FFFF01', '00AAF3'];
    var FPS = 60;
    var BALLS_TO_MAKE = 4;
    var RADIUS = 70;
    var MIN_SPEED = 80;
    var MAX_SPEED = 200;
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

    /* Constructor function for a ball object */
    function Ball(x, y, r, vx, vy, color) {
        this.x = x;                                              // x coordinate of the circle.
        this.y = y;                                              // y coordinate of the circle.
        this.r = r;                                              // radius of the circle.
        this.area = Math.PI * r * r;                                // area of the circle.
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
        for (var i = 0; i < BALLS_TO_MAKE; i++) {
            var x = Math.random() * canvas.width;                // random starting x coordinate.
            var y = Math.random() * canvas.height;               // random starting y coordinate.
            var r = RADIUS;
            var vx = (MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED)) * [1, -1][Math.floor(Math.random() + 0.5)]; // set velocity X direction.
            var vy = (MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED)) * [1, -1][Math.floor(Math.random() + 0.5)]; // set velocity y direction.
            var ball = new Ball(x, y, r, vx, vy, '#' + colors[i]);
            balls.push(ball);                                    // store new ball.
        }
        for (var k = 0; k < balls.length - 1; k++) {             // find and store all 6 possible pair combinations of 4 balls.
            for (var j = k + 1; j < balls.length; j++) {
                pairs.push([balls[k], balls[j], 0]);             // add counter to each pair to track how many loops ago a collision occurred.
            }
        }
    }

    function update(ball) {
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
        //if (Math.abs(ball_A.x - ball_B.x) <= 2 * RADIUS && Math.abs(ball_A.y - ball_B.y) <= 2 * RADIUS) {
        if (distance(ball_A, ball_B) <= 2 * RADIUS) {            // if balls touching.
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
            if(pairs[j][2] > 0) {                                // if this pair already recorded a collision, increment counter.
                pairs[j][2]++;
            }
            if(pairs[j][2] === 30) {                             // if this pair sat out 20 loops allow pair to be tested for another collision.
                pairs[j][2] = 0;
            }
            if (isTouching(ball_A, ball_B) && pairs[j][2] === 0) {                       // test if balls in pair are touching if collision counter is zero.
                var theta = Math.atan((ball_B.y - ball_A.y) / (ball_B.x - ball_A.x));    // find the angle between the two points in radians.
                ravx = Math.cos(theta) * (ball_A.vx) - Math.sin(theta) * (ball_A.vy);    // calculate the elastic collision results.
                ravy = Math.cos(theta) * (ball_A.vy) + Math.sin(theta) * (ball_A.vx);
                rbvx = Math.cos(theta) * (ball_B.vx) - Math.sin(theta) * (ball_B.vy);
                rbvy = Math.cos(theta) * (ball_B.vy) + Math.sin(theta) * (ball_B.vx);
                ravx2 = (ball_A.area - ball_B.area) / (ball_A.area + ball_B.area) * ravx + (2 * ball_B.area) / (ball_A.area + ball_B.area) * rbvx;
                ravy2 = ravy;
                rbvx2 = (2 * ball_A.area) / (ball_A.area + ball_B.area) * ravx + (ball_B.area - ball_A.area) / (ball_A.area + ball_B.area) * rbvx;
                rbvy2 = rbvy;
                ball_A.vx = Math.cos(theta) * ravx2 - Math.sin(theta) * ravy2;           // new ball A velocity in x direction.
                ball_A.vy = Math.cos(theta) * ravy2 + Math.sin(theta) * ravx2;           // new ball A velocity in y direction.
                ball_B.vx = Math.cos(theta) * rbvx2 - Math.sin(theta) * rbvy2;           // new ball B velocity in x direction.
                ball_B.vy = Math.cos(theta) * rbvy2 + Math.sin(theta) * rbvx2;           // new ball y velocity in x direction.
                pairs[j][2]++ ;                                                          // increment loop counter to show collision occurred.
            }
        }
    }

    init();
})();