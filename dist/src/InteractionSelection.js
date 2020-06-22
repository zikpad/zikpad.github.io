import { Drawing } from './Drawing.js';
export class InteractionSelection {
    constructor(score, evt) {
        this.svgRectangle = undefined;
        this.score = score;
        this.evtBegin = evt;
        this.svgRectangle = undefined;
    }
    mouseMove(evt) {
        const THRESHOLD = 4;
        if ((this.svgRectangle == undefined) &&
            ((Math.abs(evt.clientX - this.evtBegin.clientX) > THRESHOLD) || (Math.abs(evt.clientY - this.evtBegin.clientY) > THRESHOLD))) {
            this.svgRectangle = Drawing.rectangle(0, 0, 0, 0);
            this.svgRectangle.classList.add("selectionRectangle");
        }
        if (this.svgRectangle) {
            let x1 = Math.min(this.evtBegin.clientX, evt.clientX) + document.getElementById("svg-wrapper").scrollLeft;
            let y1 = Math.min(this.evtBegin.clientY, evt.clientY);
            let x2 = Math.max(this.evtBegin.clientX, evt.clientX) + document.getElementById("svg-wrapper").scrollLeft;
            let y2 = Math.max(this.evtBegin.clientY, evt.clientY);
            this.x = x1;
            this.y = y1;
            this.width = (x2 - x1);
            this.height = (y2 - y1);
            this.svgRectangle.setAttribute("x", "" + this.x);
            this.svgRectangle.setAttribute("y", "" + this.y);
            this.svgRectangle.setAttribute("width", "" + this.width);
            this.svgRectangle.setAttribute("height", "" + this.height);
        }
    }
    isActive() {
        return (this.svgRectangle != undefined);
    }
    getSelection() {
        if (this.svgRectangle) {
            let s = [];
            for (let voice of this.score.voices)
                for (let note of voice.notes) {
                    if (this.x <= note.x && note.x <= this.x + this.width &&
                        this.y <= note.y && note.y <= this.y + this.height)
                        s.push(note);
                }
            console.log(s.length);
            document.getElementById("svg").removeChild(this.svgRectangle);
            return s;
        }
        else
            return [];
    }
}
//# sourceMappingURL=InteractionSelection.js.map