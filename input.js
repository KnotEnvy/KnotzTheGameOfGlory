export class InputHandler {
    constructor(game) {
        this.game = game
        this.keys = [];
        this.touchY = '';
        this.touchThreshold = 30;
        let doubleTap = false;
        let lastTouchTime = 0
        let swipeThreshold = 100; 
        this.touchXStart = 0;
        this.touchYStart = 0;
        this.touchXEnd = 0;
        this.touchYEnd = 0;

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
        let targetX = null;

        window.addEventListener('touchstart', e => {
            // Record the initial touch position
            this.touchXStart = e.changedTouches[0].pageX;
            this.touchYStart = e.changedTouches[0].pageY;
            
            targetX = e.changedTouches[0].pageX; // record the x-coordinate of the tap

            // Determine if this is a double tap
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTouchTime;
            lastTouchTime = currentTime;
            
            if (tapLength < 500 && tapLength > 0) {
                doubleTap = true;
                // Double tap detected
                if (this.keys.indexOf('double tap') === -1) this.keys.push('double tap');
            } 
        });

        window.addEventListener('touchmove', e => {
            targetX = e.changedTouches[0].pageX;
            this.touchXEnd = e.changedTouches[0].pageX;
            this.touchYEnd = e.changedTouches[0].pageY;

            const swipeDistanceX = this.touchXEnd - this.touchXStart;
            const swipeDistanceY = this.touchYEnd - this.touchYStart;

            // Check if it was a vertical swipe (up or down)
            if (Math.abs(swipeDistanceY) > Math.abs(swipeDistanceX)) {
                if (swipeDistanceY < -swipeThreshold) {
                    // Swipe up
                    if (this.keys.indexOf('swipe up') === -1) this.keys.push('swipe up');
                } else if (swipeDistanceY > swipeThreshold) {
                    // Swipe down
                    if (this.keys.indexOf('swipe down') === -1) this.keys.push('swipe down');
                }
            } else {
                // For horizontal swipes or taps, move the player
                if (this.touchXEnd > this.touchXStart) {
                    // Move right
                    if (this.keys.indexOf('move right') === -1) this.keys.push('move right');
                } else {
                    // Move left
                    if (this.keys.indexOf('move left') === -1) this.keys.push('move left');
                }
            }
        });

        window.addEventListener('touchend', e => {
            targetX = null;
            // Record the end touch position
            this.touchXEnd = e.changedTouches[0].pageX;
            this.touchYEnd = e.changedTouches[0].pageY;

            // On release, remove the 'double tap' action
            if (doubleTap) {
                this.keys = this.keys.filter(key => !key.startsWith('double tap'));
                doubleTap = false;
            }

            // Handle swipes based on the difference between start and end touch positions
            const swipeDistanceX = this.touchXEnd - this.touchXStart;
            const swipeDistanceY = this.touchYEnd - this.touchYStart;

            // Check if it was a vertical swipe (up or down)
            if (Math.abs(swipeDistanceY) > Math.abs(swipeDistanceX)) {
                if (swipeDistanceY < -this.touchThreshold) {
                    // Swipe up
                    if (!this.keys.includes('swipe up')) {
                        this.keys.push('swipe up');
                    }
                } else if (swipeDistanceY > this.touchThreshold) {
                    // Swipe down
                    if (!this.keys.includes('swipe down')) {
                        this.keys.push('swipe down');
                    }
                }
            }

            // After the swipe has been handled, remove it from the keys array
            this.keys = this.keys.filter(key => key !== 'swipe up' && key !== 'swipe down');

            // Remove movement keys
            this.keys = this.keys.filter(key => key !== 'move left' && key !== 'move right');
        });
    }
}
