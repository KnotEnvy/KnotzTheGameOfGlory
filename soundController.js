export class SoundController {
    constructor(game) {
        this.sounds = {};
    }

    loadSound(key, src, volume = 1) {
        let sound = new Audio(src);
        sound.volume = volume;
        this.sounds[key] = sound;
    }
    
    playSound(key) {
        if (this.sounds[key]) {
            let sound = new Audio(this.sounds[key].src);
            sound.volume = this.sounds[key].volume;
            sound.play();
        }
    }
    
    setVolume(key, volume) {
        if (this.sounds[key]) {
            this.sounds[key].volume = volume;
        }
    }

    stopSound(key) {
        if (this.sounds[key]) {
            this.sounds[key].pause();
            this.sounds[key].currentTime = 0;
        }
    }

    loopSound(key) {
        if (this.sounds[key]) {
            this.sounds[key].loop = true;
            this.sounds[key].play();
        }
    }
    playSoundLoop(key) {
        if (this.sounds[key]) {
            let sound = this.sounds[key].cloneNode();
            sound.loop = true;
            sound.play();
            return sound;
        }
    }
    isPlaying(key) {
        return this.sounds[key] && !this.sounds[key].paused;
    }
    setPlaybackRate(key, rate) {
        if (this.sounds[key]) {
            this.sounds[key].playbackRate = rate;
        }
    }
    resetSounds() {
        for(let key in this.sounds) {
            if(this.sounds[key]) {
                this.sounds[key].pause();
                this.sounds[key].currentTime = 0;
            }
        }
    }
    stopAllSounds() {
        for (let key in this.sounds) {
            this.stopSound(key);
        }
    }
    
    
}
