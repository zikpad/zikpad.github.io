import { Analyzer } from "./Analyzer.js";
import { Layout } from "./Layout.js";
let Voice = /** @class */ (() => {
    class Voice {
        constructor(color) {
            this.notes = [];
            this.timeSteps = [];
            this.color = color;
        }
        isEmpty() {
            return this.notes.length == 0;
        }
        getNotesBetween(t1, t2) {
            let result = [];
            for (let timeStep of this.timeSteps) {
                if ((t1 <= timeStep.t) && (timeStep.t < t2))
                    result = result.concat(timeStep.notes);
            }
            return result;
        }
        removeNote(note) {
            const index = this.notes.indexOf(note);
            if (index > -1) {
                this.notes.splice(index, 1);
            }
        }
        draw() {
            for (let note of this.notes)
                note.draw();
        }
        addNote(note) {
            note.setColor(this.color);
            note.setVoice(this);
            this.notes.push(note);
        }
        update() {
            let analyzer = new Analyzer();
            this.timeSteps = getTimeSteps(this);
            this.draw();
            analyzer.analyze(this);
            // (<HTMLInputElement>document.getElementById("lilypond")).value = analyzer.getLilypond();
        }
        isTrioletStartingFrom(i) {
            return this.timeSteps.length - i > 3 && equalReal(this.timeSteps[i].duration, 0.25 / 3)
                && equalReal(this.timeSteps[i + 1].duration, 0.25 / 3)
                && equalReal(this.timeSteps[i + 2].duration, 0.25 / 3);
        }
        /**
         *
         * @param x
         * @param pitch
         * @returns true if there is a note at abscisse x and at pitch pitch
         */
        contains(x, pitch) {
            for (let note of this.notes) {
                if (Math.abs(note.x - x) < 2 && (note.pitch.accidental == pitch.accidental) && (note.pitch.value == pitch.value))
                    return true;
            }
            return false;
        }
    }
    Voice.voiceColors = ["black", "red", "brown", "orange", "green"];
    return Voice;
})();
export { Voice };
export class TimeStep {
    constructor(note) {
        this.t = undefined;
        this._duration = undefined;
        this._x = note.x;
        this.notes = [note];
    }
    isDot() {
        if (equalReal(this._duration, 0.75))
            return true;
        if (equalReal(this._duration, 0.75 / 2))
            return true;
        if (equalReal(this._duration, 0.75 / 4))
            return true;
        if (equalReal(this._duration, 0.75 / 8))
            return true;
        return false;
    }
    isSilence() {
        return this.notes.every((note) => note.isSilence());
    }
    getPitchs() {
        if (this.notes.length > 1) {
            let s = "<";
            for (let note of this.notes)
                s += note.pitchName + " ";
            s += ">";
            return s;
        }
        else
            return this.notes[0].pitchName;
    }
    set duration(d) {
        this._duration = d;
        for (let note of this.notes)
            note.duration = d;
    }
    get duration() {
        return this._duration;
    }
    get x() {
        let s = 0;
        for (let note of this.notes)
            s += note.x;
        return s / this.notes.length;
    }
    get xLine() {
        const x = this.x;
        let minX = 1000000;
        let maxX = -1000000;
        for (let note of this.notes) {
            minX = Math.min(note.x, minX);
            maxX = Math.max(note.x, maxX);
        }
        if (Math.abs(minX - maxX) < Layout.NOTERADIUSX / 2)
            return x + Layout.NOTERADIUSX;
        else
            return x;
    }
    get yDown() {
        let y = -100000;
        for (let note of this.notes) {
            y = Math.max(y, Layout.getY(note.pitch));
        }
        return y;
    }
    get yTop() {
        let y = 100000;
        for (let note of this.notes) {
            y = Math.min(y, Layout.getY(note.pitch));
        }
        return y;
    }
    get yRythm() {
        return this.yTop + Layout.RYTHMY;
    }
}
function getTimeSteps(score) {
    let timeSteps = [];
    let previousNote = undefined;
    score.notes.sort((n1, n2) => n1.x - n2.x);
    for (let note of score.notes) {
        if (previousNote) {
            if (Math.abs(note.x - previousNote.x) < 2 * Layout.NOTERADIUS)
                timeSteps[timeSteps.length - 1].notes.push(note);
            else {
                previousNote = note;
                timeSteps.push(new TimeStep(note));
            }
        }
        else {
            timeSteps.push(new TimeStep(note));
            previousNote = note;
        }
    }
    return timeSteps;
}
function equalReal(v, v2) {
    return Math.abs(v - v2) < 0.001;
}
//# sourceMappingURL=Voice.js.map