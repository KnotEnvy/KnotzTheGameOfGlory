export class UI {
    constructor(game){
        this.game = game
        this.fontSize = 30
        this.fontFamily = 'Helvetica';
    }
    draw(c){
        c.font = this.fontSize + 'px ' + this.fontFamily;
        c.textAlign = 'left'
        c.fillStyle = this.game.fontColor;
        //score
        c.fillText('Score: ' + this.game.score, 20, 50);

    }

}