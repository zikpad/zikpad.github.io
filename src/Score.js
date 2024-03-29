import { Drawing } from './Drawing.js';
import { Layout } from './Layout.js';
import { Voice } from './Voice.js';
import { System } from './System.js';
export class Score {
    constructor() {
        this.voices = [];
        for (let c of Voice.voiceColors)
            this.voices.push(new Voice(c));
    }
    removeNote(note) {
        for (let voice of this.voices)
            voice.removeNote(note);
    }
    _draw() {
        clear();
        drawExtraLines();
        drawLandMark();
        for (let voice of this.voices)
            voice.draw();
        System.drawLines();
    }
    update() {
        clear();
        drawExtraLines();
        drawLandMark();
        for (let voice of this.voices)
            voice.update();
        System.drawLines();
    }
}
function clear() {
    document.getElementById("svg").innerHTML = "";
    document.getElementById("svg").appendChild(newRect(0, 0, Layout.WIDTH, Layout.HEIGHT));
    document.getElementById("data").innerHTML = "";
}
function drawExtraLines() {
    //extra lines
    for (let i = -20; i <= 20; i += 2) {
        let y = Layout.getY(i);
        Drawing.lineLight(0, y, Layout.WIDTH, y);
    }
}
/**
 * draw small vertical lines for landmarks for the beats
 */
function drawLandMark() {
    for (let t = 0; t < 50; t += 0.25) {
        const x = Layout.getX(t);
        Drawing.lineLight(x, 0, x, Layout.LANDMARKHEIGHT);
    }
}
function newRect(x1, y1, x2, y2) {
    var aRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    aRect.setAttribute('id', "svgBackground");
    aRect.setAttribute('x', x1);
    aRect.setAttribute('y', y1);
    aRect.setAttribute('width', x2);
    aRect.setAttribute('height', y2);
    aRect.setAttribute('fill', "white");
    return aRect;
}
//# sourceMappingURL=Score.js.map