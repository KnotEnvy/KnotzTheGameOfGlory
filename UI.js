export class UI {
    constructor(game){
        this.game = game
        this.fontSize = 30
        this.fontFamily = 'Helvetica';
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
        // game over messages
        if (this.game.gameOver){
            c.textAlign = 'center';
            c.font = this.fontSize * 2 + 'px ' + this.fontFamily;
            if (this.game.score > 5) {
                c.fillText('Boo-yah', this.game.width * .5, this.game.height * 0.5 -20)
                c.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                c.fillText('What are creatures of the night afraid of? YOU!!', 
                this.game.width * 0.5, this.game.height *0.5 +20)

            } else {
                c.fillText('Love at first Bite?', this.game.width * .5, this.game.height *0.5 -20)
                c.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                c.fillText('Nope! Better luck next time!', 
                this.game.width * 0.5, this.game.height *0.5 +20)
            }

        }
        c.restore()
    }

}