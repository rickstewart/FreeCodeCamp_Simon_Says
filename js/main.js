/**
 * Created by Rick on 6/17/2016.
 */
(function () {
    'use strict';
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var colors = ['red', '#09B418', '#FFFF01', '#00AAF3'];
    var FPS = 60;
    var NUMBER_OF_BALLS = 4;
    var MIN_RADIUS = 100;
    var MAX_RADIUS = 100;
    var MIN_SPEED = 60;
    var MAX_SPEED = 140;
    var TRAILS = false;

    var width = canvas.width = window.innerWidth;
    var height = canvas.height = window.innerHeight;
    var balls = [];
    var pairs = [];

    var Ball = function (x, y, r, vx, vy, color) {
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
        balls.push(this);
    };

    function update(ball) {
        ball.x += ball.vx / FPS;
        ball.y += ball.vy / FPS;

        if (ball.x + ball.vx / FPS + ball.r > canvas.width) {
            ball.vx = Math.abs(ball.vx) * -1;
        } else if (ball.x + ball.vx / FPS - ball.r < 0) {
            ball.vx = Math.abs(ball.vx);
        }
        if (ball.y + ball.vy / FPS + ball.r > canvas.height) {
            ball.vy = Math.abs(ball.vy) * -1;
        } else if (ball.y + ball.vy / FPS - ball.r < 0) {
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

    for (var i = 0; i < NUMBER_OF_BALLS; i++) {
        new Ball(Math.random() * canvas.width, Math.random() * canvas.height, MIN_RADIUS +
            Math.random() * (MAX_RADIUS - MIN_RADIUS), (MIN_SPEED + Math.random() *
            (MAX_SPEED - MIN_SPEED)) * [1, -1][Math.floor(Math.random() + 0.5)], (MIN_SPEED +
            Math.random() * (MAX_SPEED - MIN_SPEED)) * [1, -1][Math.floor(Math.random() + 0.5)], '#' +
            colors[i]);
    }

    for (i = 0; i < balls.length - 1; i++) {
        for (var j = i + 1; j < balls.length; j++) {
            pairs.push([balls[i], balls[j]]);
        }
    }

    window.onresize = function () {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };

    function main_loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (i in balls) {
            balls[i].draw();
            update(balls[i]);
        }

        for (i in pairs) {
             var a = pairs[i][0];
            var b = pairs[i][1];
            if (isColliding(a, b)) {
                var theta = Math.atan((b.y - a.y) / (b.x - a.x));
                var error = (a.r + b.r) / (distance(a, b));
                var ex = Math.cos(theta) * error;
                var ey = Math.sin(theta);
            }
        }
    }

    setInterval(main_loop, 1000 / FPS);

})();