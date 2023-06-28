import { Sitting, Running, Jumping, Falling, Rolling, Diving, Hit } from './playerStates.js';
import { CollisionAnimation } from './collisionAnimation.js';
import { FloatingMessage } from './floatingMessages.js';

export class Player {
    constructor(game, soundController){
        this.game = game;
        this.soundController = soundController;
        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0;
        this.weight = 1;
        this.image = player
        this.frameX = 0
        this.frameY = 0
        this.maxFrame;
        this.fps = 20
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0
        this.speed = 0;
        this.maxSpeed = 10;
        this.initialJumpY = null;
        this.maxJumpHeight = 27;  // This is the maximum jump height, adjust as needed
        this.energy = 100; // Assuming energy is a percentage
        this.energyLossRate = 5; // Amount of energy lost per second
        this.energyGainRate = 1
        this.divingEnergyCost = 150; // Energy lost when diving
        this.rollingEnergyCost = 25; // Energy lost when rolling
        this.hitEnergyCost = 20; // Energy lost when hit
        this.states = [new Sitting(this.game), new Running(this.game), new Jumping(this.game), 
            new Falling(this.game), new Rolling(this.game), new Diving(this.game), new Hit(this.game)]; //this order must match states in playerStates
        this.currentState = null;

        


    }
    update(input, deltaTime){
        this.checkCollision()
        this.currentState.handleInput(input);
        
        if (this.currentState !== this.states[0]) {

            //horizontal movement
            this.x += this.speed;
            if ((input.includes('ArrowRight') || input.includes('move right')) && this.currentState !== this.states[6]) this.speed = this.maxSpeed;
            else if ((input.includes('ArrowLeft') || input.includes('move left')) && this.currentState !== this.states[6]) this.speed = -this.maxSpeed;
            else this.speed = 0;
        }
        //horizontal boundaries
        if  (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        // vertical movement
        this.y += this.vy;
        if (!this.onGround()) this.vy += this.weight
        else this.vy = 0
        //vertical boundaries
        if (this.y > this.game.height - this.height - this.game.groundMargin) this.y = 
        this.game.height - this.height - this.game.groundMargin

        //sprite animation
        if (this.frameTimer > this.frameInterval){
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0
        } else {
            this.frameTimer += deltaTime
        }
        this.reduceEnergy(deltaTime);

    }
    draw(c) {
        if (this.game.debug) c.strokeRect(this.x, this.y, this.width, this.height)
        c.drawImage(this.image, this.frameX*this.width, this.frameY *this.height, this.width, this.height, this.x, this.y, this.width, this.height)
    }
    reset() {
        this.energy = 100; // reset energy to its maximum value
        // reset other properties as needed
    }
    reduceEnergy(deltaTime){
        // Energy reduction over time
        this.energy += this.energyLossRate * (deltaTime / 1000);
        // Energy gain is sitting
        if (this.currentState instanceof Sitting) {
            // Energy gain while sitting
            this.energy += this.energyGainRate;
        }
        //Energy loss when attacking
        if (this.currentState instanceof Rolling) {
            // Energy loss while rolling
            this.energy -= this.rollingEnergyCost * (deltaTime / 1000);
        }
        if (this.currentState instanceof Diving) {
            // Energy loss while diving
            this.energy -= this.divingEnergyCost * (deltaTime / 1000);
        }
        
        // Energy can't go below 0 or above 100
        if (this.energy < 0) this.energy = 0;
        if (this.energy > 100) this.energy = 100;
    }

    onGround(){
        return this.y >= this.game.height - this.height - this.game.groundMargin;

    }
    setState(state, speed){
        this.currentState = this.states[state]
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter()
    }
    checkCollision(){
        this.game.enemies.forEach(enemy => {
            if (
                enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y
            ){
                //collision detected with enemies
                enemy.markedForDeletion = true;
                this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height *.5))
                // attacking enemies
                if (this.currentState === this.states[4] || this.currentState === this.states[5]){
                    this.game.score++
                    this.game.floatingMessages.push(new FloatingMessage('+1', enemy.x, enemy.y, 125, 50))
                    this.game.soundController.playSound('pop');
                    // Add time to maxTime when a bat enemy is killed
                    // Check if enemy is a bat and if it provides extra time
                if (enemy.type === 'bat1' && enemy.providesExtraTime) {
                    this.game.maxTime += 5000;
                    this.game.floatingMessages.push(new FloatingMessage('+5', enemy.x, enemy.y, 160, 85))

                    }
                } else {
                    // enemies hitting player
                    this.energy -= this.hitEnergyCost;
                    this.setState(6,0)
                    this.vx = 0; // Set horizontal velocity to zero
                    this.vy = 0; // Set vertical velocity to zero
                    this.speed = 0; // Set speed to zero
                    this.game.score -= 3
                    this.game.lives--;
                    if (this.game.lives <= 0) this.game.gameOver = true
                }
            }
        }) 
    }
    drawEnergyBar(c) {
        const barWidth = 200;
        const barHeight = 10;
        const x = 10;
        const y = 10;
        c.fillStyle = 'black';
        c.fillRect(x, y, barWidth, barHeight);
        c.fillStyle = 'gold';
        c.fillRect(x, y, this.energy / 100 * barWidth, barHeight);
    }
}