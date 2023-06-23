export class UI {
    constructor(game){
        this.game = game
        this.fontSize = 30
        this.fontFamily = 'Creepster';
        this.livesImage = lives
    }
    draw(c){
        c.save();
        c.shadowOffsetX = 2;
        c.shadowOffsetY = 2
        c.shadowColor = 'white';
        c.shadowBlue = 0
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
            c.drawImage(this.livesImage, 25 * i + 20,95,25,25)

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
        c.restore();
    }

}