import { Drawing } from './Drawing.js';
import { Layout } from './Layout.js';
/**
 * handle the selection
 */
export class InteractionSelection {
    constructor(score, evt) {
        this.svgRectangle = undefined;
        this.score = score;
        this.pointBegin = Layout.clientToXY(evt);
        this.svgRectangle = undefined;
    }
    mouseMove(evt) {
        const THRESHOLD = 4;
        let p = Layout.clientToXY(evt);
        //if there is no rectangle but the mouse moved enough then setup a rectangle
        if ((this.svgRectangle == undefined) &&
            ((Math.abs(p.x - this.pointBegin.x) > THRESHOLD) || (Math.abs(p.y - this.pointBegin.y) > THRESHOLD))) {
            this.svgRectangle = Drawing.rectangle(0, 0, 0, 0);
            this.svgRectangle.classList.add("selectionRectangle");
        }
        if (this.svgRectangle) {
            let x1 = Math.min(this.pointBegin.x, p.x) + Layout.xLeftScreen;
            let y1 = Math.min(this.pointBegin.y, p.y) + Layout.yLeftScreen;
            let x2 = Math.max(this.pointBegin.x, p.x) + Layout.xLeftScreen;
            let y2 = Math.max(this.pointBegin.y, p.y) + Layout.yLeftScreen;
            this.x = x1;
            this.y = y1;
            this.width = (x2 - x1);
            this.height = (y2 - y1);
            this.svgRectangle.setAttribute("x", "" + x1);
            this.svgRectangle.setAttribute("y", "" + this.y);
            this.svgRectangle.setAttribute("width", "" + this.width);
            this.svgRectangle.setAttribute("height", "" + this.height);
        }
    }
    /**
     * @returns true iff the selection tool is active (i.e. there is a rectangle)
     */
    isActive() { return (this.svgRectangle != undefined); }
    /**
     * @returns the notes in the rectangle if there is one
     */
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
            if (document.getElementById("svg").contains(this.svgRectangle))
                document.getElementById("svg").removeChild(this.svgRectangle);
            return s;
        }
        else
            return [];
    }
}
//# sourceMappingURL=InteractionSelection.js.map