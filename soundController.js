export class SoundController {
    constructor(game) {
        this.sounds = {};
    }

    loadSound(key, src) {
        let sound = new Audio(src);
        this.sounds[key] = sound;
    }

    playSound(key) {
        if (this.sounds[key]) {
            this.sounds[key].play();
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
    setVolume(name, volume) {
        const sound = this.sounds[name];
        if (sound) {
            sound.volume = volume;
        }
    }
    
}
