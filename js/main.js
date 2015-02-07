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
        
        game.load.image('bkg', 'assets/debug-grid-1920x1920.png');
        game.load.image('player','assets/notme.png');
        game.load.tilemap('hall', 'assets/maps/hall.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'assets/sprites/tilesheet.png');
        game.load.image('small_table_U', 'assets/sprites/table_small_U.png');
        game.load.image('small_table_L', 'assets/sprites/table_small_L.png');
        game.load.image('wallU_switch', 'assets/sprites/wallU_switch.png');
        //game.load.audio('heartbeat', 'static/heartbeat.mp3');
        game.paused = true;
    }

    // some important variables.    
    var player;
    var cursors;
    var map;
    var interacting = false;
    var mistake = false;
    var outOfTime = false; 
    var timeLeft = MAX_TIME;
    var t;

    var currSec = 0;
    var lastSec = 0;

    // heartbeat initially at 80bps
    //var heartrate = 90;
    //var heartTimer;
    //var beatSprite;    

    // game setup
    /*
    function playBeat() {
        beatSprite.play();
    }
    */
    
    function create() {
        // Sprites & Physics
        map = game.add.tilemap('hall');
        map.addTilesetImage('tilesheet', 'tiles');
        game.floor = map.createLayer('floor');
        game.wall = map.createLayer('wall');
        map.setCollisionBetween(1, 10000, true, 'wall');
        game.floor.resizeWorld();
        game.add.tileSprite(0,0,1920,1920,'bkg');
        game.world.setBounds(0,0,1920,1920);
        game.physics.startSystem(Phaser.Physics.P2JS);
        player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        game.physics.arcade.enable(player);
        cursors = game.input.keyboard.createCursorKeys();
        game.camera.follow(player);
        
       
        // Time Left Creation
        var text = "Time Left: " + timeLeft.toString() + "s";
        var style = { font: "12px Consolas", fill: "#ffffff", align: "right" };
        t = game.add.text(0,0, text, style);
        t.fixedToCamera = true;
        t.cameraOffset = new Phaser.Point(WIDTH-150, 20);

        // Heartbeat Timer
        //beatSprite = game.add.audio('heartbeat');
        //heartTimer = game.time.events.loop(Phaser.Timer.SECOND * 1/heartrate, playBeat);
    }

    /*
     * UTILITIES
     * functions u can call for various checks & whatnot
     */


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
     * ditching this for now in the interest of time?
     */
    function updateHeartbeat() {
        heartrate = Math.floor(-45*Math.log(timeLeft - 100) + 405);
        heartTimer.delay = (Phaser.Timer.SECOND * heartrate);
    } 
        

    // Main Update Function - calls update helpers
    function update() {
        updatePlayer();
        updateTime();
        //updateHeartbeat();
        // for debugging: x simulates mistake being made
        if (game.input.keyboard.onRelease(Phaser.Keyboard.X)) {
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
