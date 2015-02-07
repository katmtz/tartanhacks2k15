// GAME CONSTANTS

var MAX_TIME = 1000;
var WIDTH = 600;
var HEIGHT = 500;
var PENALTY = .9;

onload = function() {
    'use strict';
    
    var canvas = document.getElementById('canvas');

    var game = new Phaser.Game(600,500, Phaser.AUTO, canvas,
        { preload: preload, 
          create: create,
          update: update,
          render: render
        });

    // load media
    function preload() {
        game.load.image('bkg', 'static/debug-grid-1920x1920.png');
        game.load.image('player','static/notme.png');
        game.paused = true;
    }

    // some important variables.    
    var player;
    var cursors;
    var interacting = false;
    var mistake = false;
    var outOfTime = false;
    var timeLeft = MAX_TIME;
    var t;

    var currSec = 0;
    var lastSec = 0;

    // heartbeat initially at 80bps
    var heartrate = 90;
    var beatTimer;
    
    // game setup
    function playBeat() {
        console.log("BEAT");
    }
    
    function create() {
        // Sprites & Physics
        game.add.tileSprite(0,0,1920,1920,'bkg');
        game.world.setBounds(0,0,1920,1920);
        game.physics.startSystem(Phaser.Physics.P2JS);
        player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        game.physics.p2.enable(player);
        cursors = game.input.keyboard.createCursorKeys();
        game.camera.follow(player);
       
        // Time Left Creation
        var text = "Time Left: " + timeLeft.toString() + "s";
        var style = { font: "12px Consolas", fill: "#ffffff", align: "right" };
        t = game.add.text(0,0, text, style);
        t.fixedToCamera = true;
        t.cameraOffset = new Phaser.Point(WIDTH-150, 20);

        // Heartbeat Timer
        beatTimer = game.timer;
        beatTimer.add(1000/heartrate, playBeat);
    }

    /*
     * UPDATES:
     * update functions for player, time
     */
    function updatePlayer() {
        player.body.setZeroVelocity();
        if (cursors.up.isDown)
        {
            player.body.moveUp(300)
        }
        else if (cursors.down.isDown)
        {
            player.body.moveDown(300);
        }

        if (cursors.left.isDown)
        {
            player.body.velocity.x = -300;
        }
        else if (cursors.right.isDown)
        {
            player.body.moveRight(300);
        }
    }

    /*
     * TIMER MATH
     * currSec holds the current second in clock, and lastSec holds the last second.
     * When the current second is no longer the same as the last second, decrement
     * the amount of time left, then set lastSec equal to currSec. If mistake flag is
     * active, penalize time then reset the mistake flag. Finally, update the time
     * display.
     */
    function updateTime() {
        currSec = Math.floor(game.time.time/1000) % 60;
        //console.log("currsec = " + currSec.toString());
        //console.log("lastsec = " + lastSec.toString());
        if (timeLeft > 0) {
            if (currSec != lastSec) {
                timeLeft--;
                lastSec = currSec;
            }
            if (mistake) {
                timeLeft = Math.floor(PENALTY*timeLeft);
                mistake = false;
            }
            t.setText("Time Left: " + timeLeft.toString() + "s");
        }
        else {
            outOfTime = true;
            // reset game?
        }
    }

    /*
     * HEARTRATE
     * heartrate is a logarithmic decay function of timeLeft.
     */
    function updateHeartbeat() {
        heartrate = Math.floor(-45*Math.log(timeLeft - 100) + 405);
        beatTimer.add(1000/heartrate, playBeat);
    } 
        

    // Main Update Function - calls update helpers
    function update() {
        updatePlayer();
        updateTime();
        updateHeartbeat();
        // for debugging: x simulates mistake being made
        if (game.input.keyboard.isDown(Phaser.Keyboard.X)) {
            mistake = true;
        }        
    }

    function render() {
        game.debug.cameraInfo(game.camera, 32, 32);
        game.debug.spriteCoords(player, 32, 500);
        
    }

    // start button functionality
    document.getElementById('start').addEventListener('click', function() {
        console.log("start clicked"); //debug
        document.getElementById('menu').style.display = 'none';
        document.getElementById('canvas').style.display = 'block';
        console.log("canvas: " + document.getElementById('canvas').style.display); //debug
        console.log("menu: " + document.getElementById('menu').style.display);  // debug
        game.paused = false;
    });
};
