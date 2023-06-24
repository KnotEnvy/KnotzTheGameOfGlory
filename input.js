export class InputHandler {
    constructor(game) {
        this.game = game
        this.keys = [];
        this.touchY = '';
        this.touchThreshold = 30;
        let doubleTapTimer = null;
        let lastTouchTime = 0


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
        window.addEventListener('touchstart', e => {
            this.touchX = e.changedTouches[0].pageX;
            this.touchY = e.changedTouches[0].pageY;
        
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTouchTime;
            lastTouchTime = currentTime;
        
            if (tapLength < 500 && tapLength > 0) {
                // Double tap detected
                if (this.keys.indexOf('double tap') === -1) this.keys.push('double tap');
            }
        
            // If there is already a timer running, clear it
            if (doubleTapTimer) {
                clearTimeout(doubleTapTimer);
                doubleTapTimer = null;
            }
        
            // Start the timer when the touchstart event happens
            doubleTapTimer = setTimeout(() => {
                if (this.keys.indexOf('double tap') !== -1) this.keys.splice(this.keys.indexOf('double tap'), 1);
            }, 1000); // milliseconds = seconds
        });
        
        window.addEventListener('touchmove', e => {
            const swipeDistanceX = e.changedTouches[0].pageX - this.touchX;
            const swipeDistanceY = e.changedTouches[0].pageY - this.touchY;
            if (swipeDistanceY < -this.touchThreshold && this.keys.indexOf('swipe up') === -1) this.keys.push('swipe up');
            else if (swipeDistanceY > this.touchThreshold && this.keys.indexOf('swipe down') === -1) this.keys.push('swipe down');
            if (swipeDistanceX < -this.touchThreshold && this.keys.indexOf('swipe left') === -1) this.keys.push('swipe left');
            else if (swipeDistanceX > this.touchThreshold && this.keys.indexOf('swipe right') === -1) this.keys.push('swipe right');
        });
        
        window.addEventListener('touchend', e => {
            this.keys = this.keys.filter(key => !key.startsWith('swipe'));  // Remove all swipe keys
        });
        
    }
}