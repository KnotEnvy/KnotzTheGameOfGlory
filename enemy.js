class Enemy {
    constructor(soundController){
        this.frameX = 0
        this.frameY = 0
        this.fps = 20
        this.frameInterval = 1000/this.fps
        this.frameTimer = 0;
        this.markedForDeletion = false
        this.soundController = soundController
        
    }
    stopSound() {
        if (this.sound) {
            this.sound.pause();
            this.sound = null;
        }
    }
    update(deltaTime){
        //movement
        this.x -= this.speedX + this.game.speed;
        this.y += this.speedY;
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this. frameX++;
            else this.frameX = 0
        } else {
            this.frameTimer += deltaTime;
        }
        //check if offscreen
        if (this.x + this.width < 0) this.markedForDeletion = true
    }
    draw(c){
        if (this.game.debug) c.strokeRect(this.x, this.y, this.width, this.height)
        c.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height)

    }
}
export class FlyingEnemy extends Enemy {
    constructor(game){
        super();
        this.game = game;
        this.width = 60;
        this.height = 44;
        this.x = this.game.width + Math.random() * this.game.width *0.5;
        this.y = Math.random() * this.game.height * 0.5;
        this.speedX = Math.random() +1;
        this.speedY = 0
        this.maxFrame = 5;
        this.image = enemy_fly
        this.angle = 0
        this.va = Math.random() * 0.1+0.1;
        this.sound = game.soundController.playSoundLoop('fly');
        
        
    }
    stopSound(game) {
        super.stopSound(game);
        // If there are any additional sounds for this enemy, stop them here.
    }
    update(deltaTime){
        super.update(deltaTime);
        this.angle += this.va;
        this.y += Math.sin(this.angle);
    }

}
export class WormEnemy extends Enemy {
    constructor(game){
        super();
        this.game = game;
        this.width = 80.33;
        this.height = 60;
        this.x = this.game.width;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.image = enemy_worm; // replace with your worm image
        this.speedX = Math.random() + 2; // faster than the fly enemy
        this.speedY = 0;
        this.maxFrame = 5;
    }
    stopSound() {
        super.stopSound();
        // If there are any additional sounds for this enemy, stop them here.
    }
    update(deltaTime){
        super.update(deltaTime);
    }
}
export class ClimbingEnemy extends Enemy {
    constructor(game){
        super();
        this.game = game
        this.width = 120
        this.height = 144
        this.x = this.game.width
        this.y = Math.random() * this.game.height * 0.5
        this.image = enemy_spider_big
        this.speedX= 0
        this.speedY = Math.random() > 0.5 ? 1 : -1;
        this.maxFrame = 5

    }
    stopSound() {
        super.stopSound();
        // If there are any additional sounds for this enemy, stop them here.
    }
    update(deltaTime){
        super.update(deltaTime);
        if (this.y > this.game.height - this.height - this.game.groundMargin) this.speedY *= -1;
        if (this.y < -this.height) this.markedForDeletion = true
    }
    draw(c){
        super.draw(c)
        c.beginPath();
        c.moveTo(this.x + this.width/2,0)
        c.lineTo(this.x +this.width/2, this.y+50)
        c.stroke()

    }
    
}
export class BatEnemy extends Enemy {
    constructor(game){
        super();
        this.game = game;
        this.width = 83.17;
        this.height = 44;
        this.x = this.game.width + Math.random() * this.game.width * 0.5;
        this.y = Math.random() * this.game.height * 0.5;
        this.speedX = Math.random() +.1;
        this.speedY = 0;
        this.maxFrame = 5;
        this.image = bat1 // replace with your bat image
        this.type = 'bat1';
        this.angle = 0
        this.va = Math.random() * 0.01+0.02;

    }
    stopSound() {
        super.stopSound();
        // If there are any additional sounds for this enemy, stop them here.
    }
    update(deltaTime){
        super.update(deltaTime);
        this.angle += this.va;
        this.y += Math.sin(this.angle);
        ;
    }

}    