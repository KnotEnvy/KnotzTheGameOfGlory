import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import { FlyingEnemy, ClimbingEnemy, GroundEnemy, BatEnemy } from './enemy.js';
import { UI } from './UI.js';
import { SoundController } from './soundController.js';


window.addEventListener('load', function(){
    const canvas = this.document.getElementById('canvas1');
    const ctx = canvas.getContext('2d')
    canvas.width = 900
    canvas.height = 500

    
    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.isGameStarted = false;
            this.groundMargin = 40;
            this.speed = 0;
            this.maxSpeed = 5;
            this.soundController = new SoundController(this);
            this.background = new Background(this);
            this.player = new Player(this,  this.soundController);
            this.input = new InputHandler(this);
            this.UI = new UI(this);
            this.enemies = [];
            this.particles = [];
            this.collisions = [];
            this.floatingMessages = [];
            this.winningScore = 50;
            // Define instructions for desktop and mobile
            this.desktopInstructions = [
                'Left, right, up, down arrow moves',
                'Press Enter to attack',
                'Down arrow builds power',
                
                'GOOD LUCK!!'
            ];

            this.mobileInstructions = [
                'Swipe left, right, up, down to move',
                'Double Tap and hold to attack',
                'Swipe down builds power',
                'GOOD LUCK!!'
            ];

            // Choose the correct instructions based on device
            this.instructions = isMobileDevice() ? this.mobileInstructions : this.desktopInstructions;
            this.instructionTimer = 0;
            this.instructionAlpha = 1;

            this.maxParticles = 200;
            this.enemyTimer = 0;
            this.enemyInterval = 2000;
            this.debug = false;
            this.score = 0;
            this.fontColor = 'black'
            this.time = 0;
            this.maxTime = 60000;
            this.gameOver = false;
            this.lives = 5;
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();

            //load sounds
            this.soundController.loadSound('bg', 'sounds/chromo.mp3');
            this.soundController.setVolume('bg', 0.3);
            this.soundController.loadSound('roll', 'sounds/jump2.mp3');
            this.soundController.loadSound('pop', 'sounds/pop.mp3');

            

            
        }
        start() {
            this.isGameStarted = true;
            // Play background music
            this.soundController.loopSound('bg')
        }
        showInstructions(c) {
            if (!this.instructions.length) return;
        
            const instruction = this.instructions[0];
            c.save();
            c.shadowOffsetX = 2;
            c.shadowOffsetY = 2;
            c.shadowColor = 'gold';
            c.shadowBlur = 10;
            c.font = '30px Creepster';
            c.textAlign = 'center';
            c.fillStyle = `rgba(255, 255, 255, ${this.instructionAlpha})`;

            c.fillText(instruction, this.width / 2, 450);
            c.restore();
        }
        
        
        update(deltaTime){
            if (!this.isGameStarted || this.gameOver) return;
            this.time += deltaTime
            if (this.time > this.maxTime) this.gameOver = true
            this.background.update()
            this.player.update(this.input.keys, deltaTime)
            //display instructions on screen
            if (this.instructions.length && this.instructionTimer > 3000) {
                this.instructions.shift();
                this.instructionTimer = 0;
                this.instructionAlpha = 1;
            } else {
                this.instructionAlpha = 1 - this.instructionTimer / 3000;  // Alpha will go from 1 to 0 over 3 seconds
                this.instructionTimer += deltaTime;
            }
            //handle enemies
            if (this.enemyTimer > this.enemyInterval){
                this.addEnemy();
                this.enemyTimer = 0;
                // After each enemy spawn, decrease the interval by a certain amount (e.g., 0.1%)
                this.enemyInterval *= 0.999;
            } else {
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(enemy  => {
                enemy.update(deltaTime);
            })
            //floating messages
            this.floatingMessages.forEach(message => {
                message.update();
            });
            //update particles
            this.particles.forEach((particle, index) => {
                particle.update();
            })
            if (this.particles.length > this.maxParticles) {
               this.particles.length = this.maxParticles;
            }
            // handle explosions
            this.collisions.forEach((collision, index) => {
                collision.update(deltaTime);
                if (collision.markedForDeletion) this.collisions.splice(index, 1);
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion)
            this.particles = this.particles.filter(particle => !particle.markedForDeletion)
            this.collisions = this.collisions.filter(collision => !collision.markedForDeletion)
            this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion)
            this.instructions = this.instructions.filter(message => !message.markedForDeletion)

            //handle sounds
            if (this.player.onGround()) {
                this.player.jumpSoundPlayed = false;
            }

            this.UI.update(deltaTime);


        }
        draw(c){
            this.background.draw(c)

            this.player.draw(c)
            // this.player.drawEnergyBar(c);
            this.showInstructions(c);
            this.enemies.forEach(enemy  => {
                enemy.draw(c);
            });
            this.particles.forEach(particle  => {
                particle.draw(c);
            });
            this.collisions.forEach(collision  => {
                collision.draw(c);
            });
            this.floatingMessages.forEach(message => {
                message.draw(c);
            });

            this.UI.draw(c)
        }
        addEnemy(){
            if (this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this))
            else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this))
            this.enemies.push(new FlyingEnemy(this))

            if (this.time > 20000) {
                const bat = new BatEnemy(this);
                // 10% chance for the bat to provide extra time
                bat.providesExtraTime = Math.random() < 0.1;
                this.enemies.push(bat);
            }

        }
        restart() {
            this.groundMargin = 40;
            this.speed = 0;
            // this.maxSpeed = 5;
            this.background = new Background(this);
            this.player = new Player(this, this.soundController);
            this.input = new InputHandler(this);
            this.UI = new UI(this);
            this.player.reset();
            this.enemies = [];
            this.particles = [];
            this.collisions = [];
            this.floatingMessages = [];
            this.maxParticles = 200;
            this.enemyTimer = 0;
            this.enemyInterval = 2000;
            // this.debug = false;
            this.score = 0;
            // this.winningScore = 50;
            // this.fontColor = 'black';
            this.time = 0;
            this.lastTime = 0
            this.maxTime = 60000;
            this.gameOver = false;
            this.lives = 5;

            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
            this.start()
            animate(0)
        }
        
    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;
    let requestId;

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
    
        lastTime = timeStamp;
        if (!game.isRestarting) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        game.update(deltaTime);
        game.draw(ctx);
        if (!game.isRestarting) requestId = requestAnimationFrame(animate); // Keep updating until the game is restarted
    }
    
    //buttons
    const startScreen = document.getElementById('startScreen');
    const startButton = document.getElementById('startButton');
    const restartButton = document.getElementById('restartButton');
    const quitButton = document.getElementById('quitButton');
    const exitFullscreenButton = document.getElementById('exitFullscreenButton');
    
    const fullscreenButton = document.getElementById('fullscreenButton');
    const isFullscreen = false;
    
    //state button actions
    startButton.addEventListener('click', function() {
        startScreen.style.display = 'none';
        // quitButton.style.display = 'block';
        game.start();
        if (isMobileDevice()) {
            requestFullscreen(document.documentElement);
        }
    });
    // fullscreenButton.addEventListener('click', function() {
    // });
    

    //restart  button actions
    restartButton.addEventListener('click', function() {
        cancelAnimationFrame(requestId);
        restartButton.style.display = 'none';
        quitButton.style.display = 'none';
        game.isRestarting = true;
        // add fade class to canvas
        canvas.classList.add('fade');
        // wait 0.5 seconds before restarting game
        setTimeout(function() {
            game.isRestarting = false;
            game.restart();
            // remove fade class from canvas
            canvas.classList.remove('fade');
        }, 500);
    });
    //quit button actions
    quitButton.addEventListener('click', function() {
        startScreen.style.display = 'block';
        restartButton.style.display = 'none';
        quitButton.style.display = 'none';
        game.restart();
        exitFullscreen();
    });

    exitFullscreenButton.addEventListener('click', function() {
        game.gameOver = true;
        restartButton.style.display = 'block';
        quitButton.style.display = 'block';
    });
    //detect if on mobile and add fullscreen button
    function requestFullscreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) { // Firefox
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) { // IE/Edge
            element.msRequestFullscreen();
        }
    }
    function exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mosExitFullscreen) { /* firefox */
            document.mozExitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
    }
    function isMobileDevice() {
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    }
    // if (isMobileDevice()) {
    //     fullscreenButton.style.display = "block";
    // }


    exitFullscreenButton.style.display = "block";
    // document.addEventListener('fullscreenchange', function() {
    //     if (document.fullscreenElement) {
    //     } //else {
    //     //     exitFullscreenButton.style.display = "none";
    //     // }
    // });

    animate(0);
});
