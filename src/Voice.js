import { Analyzer } from "./Analyzer.js";
import { Layout } from "./Layout.js";
let Voice = /** @class */ (() => {
    class Voice {
        constructor(color) {
            this.color = color;
            this.notes = [];
            this.timeSteps = [];
            this.color = color;
        }
        /**
         *
         * @returns true iff the voice contains notes
         */
        isEmpty() { return this.notes.length == 0; }
        /**
         * returns notes between time t1 and time t2
         */
        getNotesBetween(t1, t2) {
            let result = [];
            for (const timeStep of this.timeSteps) {
                if ((t1 <= timeStep.t) && (timeStep.t < t2))
                    result = result.concat(timeStep.notes);
            }
            return result;
        }
        /**
         *
         * @param note
         * @description remove the note from the voice, if that note belongs to the voice
         */
        removeNote(note) {
            const index = this.notes.indexOf(note);
            if (index > -1)
                this.notes.splice(index, 1);
        }
        draw() { for (const note of this.notes)
            note.draw(); }
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
         * @returns true if there is a note at abscisse x (~) and at pitch pitch
         */
        contains(x, pitch) {
            for (let note of this.notes) {
                if (Math.abs(note.x - x) < 2 && (note.pitch.accidental == pitch.accidental) && (note.pitch.value == pitch.value))
                    return true;
            }
            return false;
        }
    }
    Voice.voiceColors = ["black", "red", "orange", "green", "blue", "Pink", "SaddleBrown"]; /*["black", "DarkSlateGrey", "gray",  "lightgray",
    "red", "orange", "DarkOrange", "GoldenRod",
    "brown", "Maroon", "Peru", "SaddleBrown",
    "Pink", "RosyBrown", "SandyBrown", "Thistle"];*/
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
    isDoubleDot() {
        if (equalReal(this._duration, 0.875))
            return true;
        if (equalReal(this._duration, 0.875 / 2))
            return true;
        if (equalReal(this._duration, 0.875 / 4))
            return true;
        if (equalReal(this._duration, 0.875 / 8))
            return true;
        return false;
    }
    isSilence() { return this.notes.every((note) => note.isSilence()); }
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
    get duration() { return this._duration; }
    /**
     * compute the average of the x of the notes
     */
    get x() {
        let s = 0;
        for (const note of this.notes)
            s += note.x;
        return s / this.notes.length;
    }
    layout() {
        const x = this.x;
        const previousPitch = this.notes[0].pitch;
        const rx = this.notes[0].rx();
        let isShift = true;
        const SHIFT = rx;
        for (let i = 1; i < this.notes.length; i++) {
            const note = this.notes[i];
            if (Math.abs(previousPitch.value - note.pitch.value) <= 1 && isShift) {
                isShift = false;
                note.domElement.setAttribute("cx", "" + (x + SHIFT));
            }
            else {
                note.domElement.setAttribute("cx", "" + x);
                isShift = true;
            }
        }
    }
    get xLine() {
        const x = this.x;
        const notesAroundTheVerticalLine = () => {
            let minX = 1000000;
            let maxX = -1000000;
            for (const note of this.notes) {
                minX = Math.min(note.x, minX);
                maxX = Math.max(note.x, maxX);
            }
            return Math.abs(minX - maxX) < Layout.NOTERADIUSX / 2;
        };
        if (notesAroundTheVerticalLine())
            return x + this.notes[0].rx();
        else
            return x;
    }
    get yDown() {
        let y = -100000;
        for (const note of this.notes) {
            y = Math.max(y, Layout.getY(note.pitch));
        }
        return y;
    }
    get yTop() {
        let y = 100000;
        for (const note of this.notes) {
            y = Math.min(y, Layout.getY(note.pitch));
        }
        return y;
    }
    get yRythm() { return this.yTop + Layout.RYTHMY; }
}
function getTimeSteps(voice) {
    let timeSteps = [];
    let previousNote = undefined;
    voice.notes.sort((n1, n2) => n1.x - n2.x);
    const THESHOLD = 8;
    for (const note of voice.notes) {
        if (previousNote) {
            if (Math.abs(note.x - previousNote.x) < THESHOLD)
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
    for (const timestep of timeSteps) {
        timestep.layout();
    }
    return timeSteps;
}
function equalReal(v, v2) { return Math.abs(v - v2) < 0.001; }
//# sourceMappingURL=Voice.js.map