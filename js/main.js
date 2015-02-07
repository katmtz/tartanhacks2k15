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
        game.load.image('player','static/Circle.png');
    }
    
    var player;
    var cursors;
    
    // game setup
    function create() {
        game.add.tileSprite(0,0,1920,1920,'bkg');
        game.world.setBounds(0,0,1920,1920);
        game.physics.startSystem(Phaser.Physics.P2JS);
        player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        player.height = 75;
        player.width = 75;
        game.physics.p2.enable(player);
        cursors = game.input.keyboard.createCursorKeys();
        game.camera.follow(player);
    }

    // game logic
    function update() {
        // PLAYER MOTION
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

    function render() {
        game.debug.cameraInfo(game.camera, 32, 32);
        game.debug.spriteCoords(player, 32, 500);
    }

    // start button functionality
    document.getElementById('start').addEventListener('click', function() {
        console.log("start clicked"); //debug
        document.getElementById('menu').style.display = 'none';
        document.getElementById('canvas').style.display = 'block';
        console.log("canvas: " + document.getElementById('canvas').style.display);
        console.log("menu: " + document.getElementById('menu').style.display);
    });
};
