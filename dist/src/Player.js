import { Sounds } from './Sound.js';
export class Player {
    constructor(score) {
        this.stopped = false;
        this.t = 0;
        this.sounds = [];
        this.score = score;
        for (let i in this.score.voices)
            this.sounds[i] = new Sounds();
        this._loop();
    }
    _loop() {
        const WINDOW = 0.02;
        const DELAYMS = 2000 * WINDOW;
        if (this.stopped) {
            for (let i in this.score.voices)
                this.sounds[i].stop();
            return;
        }
        ;
        this.t += WINDOW;
        for (let i in this.score.voices) {
            let voice = this.score.voices[i];
            let notes = voice.getNotesBetween(this.t - WINDOW, this.t);
            if (notes.length > 0)
                this.sounds[i].stop();
            for (let note of notes)
                if (!note.isSilence())
                    this.sounds[i].noteOn(note.midiPitch, 128);
        }
        setTimeout(() => this._loop(), DELAYMS);
    }
    stop() {
        this.stopped = true;
    }
}
//# sourceMappingURL=Player.js.map