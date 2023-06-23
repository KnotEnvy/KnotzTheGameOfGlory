import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import { FlyingEnemy, ClimbingEnemy, GroundEnemy } from './enemy.js';
import { UI } from './UI.js';

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
            this.groundMargin = 40
            this.speed = 0
            this.maxSpeed = 3
            this.background = new Background(this)
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.UI = new UI(this)
            this.enemies = []
            this.particles = []
            this.collisions = [];
            this.floatingMessages = [];
            this.maxParticles = 200;
            this.enemyTimer = 0;
            this.enemyInterval = 1000
            this.debug = false
            this.score = 0
            this.winningScore = 50;
            this.fontColor = 'black'
            this.time = 0;
            this.maxTime = 60000;
            this.gameOver = false
            this.lives = 3;
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter()
        }
        start() {
            this.isGameStarted = true;
        }
        
        update(deltaTime){
            if (!this.isGameStarted || this.gameOver) return;
            this.time += deltaTime
            if (this.time > this.maxTime) this.gameOver = true
            this.background.update()
            this.player.update(this.input.keys, deltaTime)
            //handle enemies
            if (this.enemyTimer > this.enemyInterval){
                this.addEnemy();
                this.enemyTimer = 0
            } else {
                this.enemyTimer += deltaTime
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


        }
        draw(c){
            this.background.draw(c)
            this.player.draw(c)
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

        }
        restart() {
            this.groundMargin = 40;
            this.speed = 0;
            this.maxSpeed = 3;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.UI = new UI(this);
            this.enemies = [];
            this.particles = [];
            this.collisions = [];
            this.floatingMessages = [];
            this.maxParticles = 200;
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.debug = false;
            this.score = 0;
            this.winningScore = 50;
            this.fontColor = 'black';
            this.time = 0;
            this.maxTime = 60000;
            this.gameOver = false;
            this.lives = 3;
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
            animate(0);
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
        if (!game.gameOver) requestId = requestAnimationFrame(animate);
    }
    
    const startScreen = document.getElementById('startScreen');
    const startButton = document.getElementById('startButton');
    const restartButton = document.getElementById('restartButton');
    
    startButton.addEventListener('click', function() {
        startScreen.style.display = 'none';
        game.start();  // Start your game here
    });
    restartButton.addEventListener('click', function() {
        cancelAnimationFrame(requestId);
        restartButton.style.display = 'none';
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
    
    

    animate(0);
});
