import { isMobileDevice } from './device.js';
export class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = [];

        // On-screen controls
        this.controls = {
            left: document.getElementById('left-button'),
            right: document.getElementById('right-button'),
            up: document.getElementById('up-button'),
            down: document.getElementById('down-button'),
            action: document.getElementById('action-button')
        };

        // If on mobile, display controls


        if (isMobileDevice()) {
            document.getElementById('controls-left').classList.add('visible');
            document.getElementById('controls-right').classList.add('visible');
        }

        // Add event listeners for on-screen controls
        for (let control in this.controls) {
            this.controls[control].addEventListener('touchstart', () => {
                event.preventDefault(); 
                if (!this.keys.includes(control)) {
                    this.keys.push(control);
                }
            });
            this.controls[control].addEventListener('touchend', () => {
                this.keys = this.keys.filter(key => key !== control);
            });
        }
        //Keyboard controls
        window.addEventListener('keydown', e => {

            if ((e.key === 'ArrowDown' || 
                e.key === 'ArrowUp' || 
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight' ||
                e.key === 'Enter'
                ) && this.keys.indexOf(e.key) === -1){
                this.keys.push(e.key)
            } else if (e.key === 'd') this.game.debug = !this.game.debug

        })
        window.addEventListener('keyup', e => {
            if (e.key === 'ArrowDown' ||
                e.key === 'ArrowUp' ||
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight' ||
                e.key === 'Enter') {
                this.keys.splice(this.keys.indexOf(e.key), 1)
            } 
        });
    }
    // Method to update the position of the on-screen controls
    updateControlPosition(control, x, y) {
        this.controls[control].style.left = x + 'px';
        this.controls[control].style.top = y + 'px';
    }
}

