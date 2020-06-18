import { Layout } from "./Layout.js";
import { Drawing } from "./Drawing.js";
export class Note {
    constructor(x, pitch) {
        this.silence = false;
        this.color = "black";
        this.alteration = "";
        this.x = x, this.pitch = pitch;
        this.svgCircle = Drawing.circle(this.x, this.y, Layout.getNoteRadius());
        this.svtTextAlteration = Drawing.text(this.x - Layout.NOTERADIUS * 2, this.y + Layout.NOTERADIUS / 2, this.alteration);
        this.svgCircle.note = this;
    }
    delete() {
    }
    setColor(color) {
        this.color = color;
        this.svgCircle.setAttribute('stroke', this.color);
    }
    ;
    draw() {
        document.getElementById("svg").appendChild(this.svgCircle);
        document.getElementById("svg").appendChild(this.svtTextAlteration);
    }
    toggle() {
        this.silence = !this.silence;
        if (this.svgCircle.classList.contains("silence"))
            this.svgCircle.classList.remove("silence");
        else
            this.svgCircle.classList.add("silence");
    }
    isSilence() {
        return this.silence;
    }
    set duration(d) {
        if (this.isSilence()) {
            this.svgCircle.setAttribute('fill', this.color);
        }
        else {
            if (d < 0.5) {
                this.svgCircle.setAttribute('stroke', "black");
                this.svgCircle.setAttribute('fill', this.color);
            }
            else {
                this.svgCircle.setAttribute('fill', "white");
                this.svgCircle.setAttribute('stroke', this.color);
            }
        }
    }
    update(x, pitch) {
        this.x = x, this.pitch = pitch;
        this.svgCircle.setAttribute('cx', x.toString());
        this.svgCircle.setAttribute('cy', this.y.toString());
        this.svtTextAlteration.setAttribute('x', (this.x - Layout.NOTERADIUS * 2).toString());
        this.svtTextAlteration.setAttribute('y', (this.y + Layout.NOTERADIUS / 2).toString());
    }
    get y() {
        return Layout.getY(this.pitch);
    }
    getPitchName() {
        let octave = 0;
        switch (this.pitch % 7) {
            case 0: return "c";
            case 1: return "d";
            case 2: return "e";
            case 3: return "f";
            case 4: return "g";
            case 5: return "a";
            case 6: return "b";
        }
        return "e";
    }
}
//# sourceMappingURL=Note.js.map