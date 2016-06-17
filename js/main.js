/**
 * Created by Rick on 6/17/2016.
 */
(function () {
    'use strict';
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var colors = ['FF3727', '09B418', 'FFFF01', '00AAF3'];
    var FPS = 120;
    var NUMBER_OF_BALLS = 4;
    var MIN_RADIUS = 40;
    var MAX_RADIUS = 40;
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
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.draw = function () {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
            ctx.fill();
        };
    }

    function createBalls() {
        for (var i = 0; i < NUMBER_OF_BALLS; i++) {
            var x = Math.random() * canvas.width;
            var y = Math.random() * canvas.height;
            var r = MIN_RADIUS + Math.random() * (MAX_RADIUS - MIN_RADIUS);
            var vx = (MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED)) * [1, -1][Math.floor(Math.random() + 0.5)];
            var vy = (MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED)) * [1, -1][Math.floor(Math.random() + 0.5)];
            var ball = new Ball(x, y, r, vx, vy, '#' + colors[i]);
            balls.push(ball);
        }
        for (i = 0; i < balls.length - 1; i++) {
            for (var j = i + 1; j < balls.length; j++) {
                pairs.push([balls[i], balls[j]]);
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

    function distance(ball1, ball2) {
        return Math.sqrt((ball1.x - ball2.x) * (ball1.x - ball2.x) + (ball1.y - ball2.y) * (ball1.y - ball2.y));
    }

    function isColliding(a, b) {
        if (Math.abs(a.x - b.x) <= a.r + b.r && Math.abs(a.y - b.y) <= a.r + b.r) {
            if (distance(a, b) <= a.r + b.r) {
                return true;
            }
        }
    }

    function main_loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < balls.length; i++) {
            balls[i].draw();
            update(balls[i]);
            for (var j = i + 1; j < pairs.length; j++) {
                var a = pairs[i][0];
                var b = pairs[i][1];
                if (isColliding(a,b)){
                    var theta = Math.atan((b.y-a.y)/(b.x-a.x));
                    var error = (a.r+b.r)/(distance(a,b));
                    var ex = Math.cos(theta)*error;
                    var ey = Math.sin(theta);
                    console.log(theta);
                    console.log([
                        ravx = Math.cos(theta)*(a.vx)-Math.sin(theta)*(a.vy),
                        ravy = Math.cos(theta)*(a.vy)+Math.sin(theta)*(a.vx),
                        rbvx = Math.cos(theta)*(b.vx)-Math.sin(theta)*(b.vy),
                        rbvy = Math.cos(theta)*(b.vy)+Math.sin(theta)*(b.vx)
                    ]);

                    console.log([
                        ravx2 = (a.m-b.m)/(a.m+b.m)*ravx+(2*b.m)/(a.m+b.m)*rbvx,
                        ravy2 = ravy,
                        rbvx2 = (2*a.m)/(a.m+b.m)*ravx+(b.m-a.m)/(a.m+b.m)*rbvx,
                        rbvy2 = rbvy
                    ]);

                    console.log([
                        a.vx = Math.cos(theta)*ravx2-Math.sin(theta)*ravy2,
                        a.vy = Math.cos(theta)*ravy2+Math.sin(theta)*ravx2,
                        b.vx = Math.cos(theta)*rbvx2-Math.sin(theta)*rbvy2,
                        b.vy = Math.cos(theta)*rbvy2+Math.sin(theta)*rbvx2
                    ]);
                }
            }
        }
    }

    init();
})();