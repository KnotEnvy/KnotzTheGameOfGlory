export class UI {
    constructor(game){
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'Creepster';
        this.livesImage = lives;
        // dimensions and position for energy bar
        this.barWidth = 200;
        this.barHeight = 10;
        this.x = 10;
        this.y = 10;
        this.prevEnergy = this.game.player.energy;
    }
    draw(c){
        c.save();
        c.shadowOffsetX = 2;
        c.shadowOffsetY = 2
        c.shadowColor = 'white';
        c.shadowBlur = 10
        c.font = this.fontSize + 'px ' + this.fontFamily;
        c.textAlign = 'left'
        c.fillStyle = this.game.fontColor;
        //score
        c.fillText('Score: ' + this.game.score, 20, 50);
        // timer
        c.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
        c.fillText('Time: ' + (this.game.time *.001).toFixed(1), 20, 80)
        //lives
        for (let i = 0; i < this.game.lives; i++){
            c.drawImage(this.livesImage, 25 * i + 20,470,25,25)
        }
        // game over messages
        if (this.game.gameOver){
            c.shadowBlur = 10; // Apply the glow effect
            const time = Date.now() * 0.002; // Current time in seconds, for the animation
            const scale = Math.sin(time) * 0.3 + 1.0; // Scale varies between 0.7 and 1.3
            c.textAlign = 'center';
            c.font = (this.fontSize * 2 * scale) + 'px ' + this.fontFamily; // Apply scale to font size
            if (this.game.score > this.game.winningScore) {
                c.fillText('Boo-yah', this.game.width * .5, this.game.height * 0.5 -20);
                c.font = (this.fontSize * 0.7 * scale) + 'px ' + this.fontFamily; // Apply scale to font size
                c.fillText('What are creatures of the night afraid of? YOU!!', 
                this.game.width * 0.5, this.game.height *0.5 +20);
            } else {
                c.fillText('Love at first Bite?', this.game.width * .5, this.game.height *0.5 -20);
                c.font = (this.fontSize * 0.7 * scale) + 'px ' + this.fontFamily; // Apply scale to font size
                c.fillText('Nope! Better luck next time!', 
                this.game.width * 0.5, this.game.height *0.5 +20);
            }
            document.getElementById('restartButton').style.display = 'block'; // Show the restart button
        } else {
            document.getElementById('restartButton').style.display = 'none'; // Hide the restart button
        }
        /// Energy bar
        this.drawEnergyBar(c);
        c.restore();
    }
    drawEnergyBar(c) {
        c.fillStyle = 'black';
        c.fillRect(this.x, this.y, this.barWidth, this.barHeight);
    
        // Reset shadow properties
        c.shadowOffsetX = 0;
        c.shadowOffsetY = 0;
        c.shadowBlur = 0;
    
        // If energy is increasing and less than 100, apply a gold glow
        if (this.game.player.currentState === this.game.player.states[0] && this.game.player.energy < 100 && this.game.player.energy > this.prevEnergy) {
            c.shadowOffsetX = 2;
            c.shadowOffsetY = 2;
            c.shadowColor = 'gold';  // Gold glow
            c.shadowBlur = 10;
        } 
        // If energy is decreasing, apply a red glow
        else if (this.game.player.energy < this.prevEnergy) {
            c.shadowOffsetX = 2;
            c.shadowOffsetY = 2;
            c.shadowColor = 'red';  // Red glow
            c.shadowBlur = 10;
            // this.game.particles.unshift(new Fire(this.game, this.x + this.game.player.energy / 100 * this.barWidth, this.y, true));
        }
    
        c.fillStyle = 'gray';  // Energy bar is always gold
        c.fillRect(this.x, this.y, this.game.player.energy / 100 * this.barWidth, this.barHeight);
    
        // Update prevEnergy for the next frame
        this.prevEnergy = this.game.player.energy;
    }
    
    
    
    
    update(deltaTime) {
        // Update the UI state here, if necessary
        // this.draw(c)
    }

}