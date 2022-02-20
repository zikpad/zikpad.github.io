import { Layout } from "./Layout.js";
import { Drawing } from "./Drawing.js";
function accidentalToSymbol(a) {
    switch (a) {
        case -2: return "𝄫";
        case -1: return "♭";
        case 0: return "";
        case 1: return "♯";
        case 2: return "𝄪";
        default: throw `error ${a} is a wrong accidental`;
    }
}
export class Note {
    constructor(x, pitch, silence = false) {
        this.x = x;
        this.pitch = pitch;
        this.silence = silence;
        this.color = "black";
        this.domElement = Drawing.note(this.x, this.y, Layout.NOTERADIUS);
        this.svgTextAccidental = Drawing.text(this.x - Layout.NOTERADIUS * 2, this.y + Layout.NOTERADIUS / 2, accidentalToSymbol(this.accidental));
        this.svgRest = Drawing.text(this.x, this.y + Layout.NOTERADIUS, "");
        this.svgRest.classList.add("rest");
        this.svgRest.style.visibility = "hidden";
        this.domElement.note = this;
        if (this.silence)
            this.updateToggle();
    }
    setColor(color) {
        this.color = color;
        this.domElement.setAttribute('stroke', this.color);
    }
    setVoice(voice) {
        this.voice = voice;
    }
    get accidental() {
        return this.pitch.accidental;
    }
    set accidental(accidental) {
        this.pitch.accidental = accidental;
        this.svgTextAccidental.textContent = accidentalToSymbol(this.accidental);
    }
    ;
    draw() {
        document.getElementById("svg").appendChild(this.domElement);
        document.getElementById("svg").appendChild(this.svgTextAccidental);
        document.getElementById("svg").appendChild(this.svgRest);
    }
    updateToggle() {
        this.svgTextAccidental.style.visibility = this.silence ? "hidden" : "visible";
        this.svgRest.style.visibility = this.silence ? "visible" : "hidden";
        if (this.domElement.classList.contains("silence"))
            this.domElement.classList.remove("silence");
        else
            this.domElement.classList.add("silence");
    }
    /**
     * toggle Silence <-> Not Silence (Real note)
     */
    toggle() {
        this.silence = !this.silence;
        this.updateToggle();
    }
    isSilence() {
        return this.silence;
    }
    /**
     *
     * @returns the X radius that depends on the duration
     */
    rx() { return parseInt(this.domElement.getAttribute("rx")); }
    adaptRX(d) {
        function durationToRX(d) {
            const quarterquarter = 0.25 / 4;
            if (d >= quarterquarter)
                return Layout.NOTERADIUS;
            else
                return Math.max(4, Layout.NOTERADIUS * d / quarterquarter);
        }
        this.domElement.setAttribute("rx", "" + durationToRX(d));
    }
    set duration(d) {
        function durationToRestSymbol(d) {
            if (d >= 1)
                return "𝄻";
            if (d >= 0.5)
                return "𝄼";
            if (d >= 0.25)
                return "𝄽";
            if (d >= 0.25 / 2)
                return "𝄾";
            if (d >= 0.25 / 4)
                return "𝄿";
            return "𝅀";
        }
        this.svgRest.textContent = durationToRestSymbol(d);
        if (this.isSilence()) {
            this.domElement.setAttribute('fill', this.color);
        }
        else {
            if (d < 0.5) {
                this.domElement.setAttribute('stroke', "black");
                this.domElement.setAttribute('fill', this.color);
            }
            else {
                this.domElement.setAttribute('fill', "white");
                this.domElement.setAttribute('stroke', this.color);
            }
        }
    }
    update(x, pitch) {
        this.x = x, this.pitch = pitch;
        this.domElement.setAttribute('cx', x.toString());
        this.domElement.setAttribute('cy', this.y.toString());
        this.svgTextAccidental.setAttribute('x', (this.x - Layout.NOTERADIUS * 2).toString());
        this.svgTextAccidental.setAttribute('y', (this.y + Layout.NOTERADIUS / 2).toString());
        this.svgRest.setAttribute('x', (this.x).toString());
        this.svgRest.setAttribute('y', (this.y + Layout.NOTERADIUS).toString());
        this.svgTextAccidental.textContent = accidentalToSymbol(this.accidental);
    }
    get y() { return Layout.getY(this.pitch); }
    get t() { return Layout.getT(this.x); }
    get pitchName() { return (this.isSilence()) ? "r" : this.pitch.lilypondName; }
}
//# sourceMappingURL=Note.js.map