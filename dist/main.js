/**
 * This file will be transformed in the main.js included in dist/index.html
 */
import { KeyEvent } from './src/KeyEvent.js';
import { Lilypond } from './src/Lilypond.js';
import { OpenFileDragDrop } from './src/OpenFileDragDrop.js';
import { InteractionScore } from "./src/Interaction.js";
import { Score } from "./src/Score.js";
import { Layout } from "./src/Layout.js";
window.onload = init;
/**
 * when the window is resized
 */
function resize() {
    document.getElementById("svg-wrapper").style.height =
        (window.innerHeight - document.getElementById("palette").clientHeight - 16).toString();
}
let score = new Score();
let interactionScore;
function init() {
    score = new Score();
    document.getElementById("svg").setAttribute("height", Layout.HEIGHT.toString());
    document.getElementById("lilypond").addEventListener("click", () => document.getElementById("lilypond").select());
    interactionScore = new InteractionScore(score);
    window.onresize = resize;
    resize();
    document.getElementById("downloadLilypond").style.visibility = "hidden";
    try {
        /** setting when desktop app*/
        const ipc = require('electron').ipcRenderer;
        ipc.on("new", () => init());
        ipc.on("open", (evt, data) => {
            init();
            Lilypond.getScore(score, data);
            interactionScore = new InteractionScore(score);
        });
        ipc.on("save", () => ipc.send("save", Lilypond.getCode(score)));
        ipc.on("undo", () => interactionScore.undo());
        ipc.on("redo", () => interactionScore.redo());
        new OpenFileDragDrop((file) => {
            ipc.send("open", file.path);
        });
    }
    catch (e) {
        /** setting when online web app*/
        document.getElementById("downloadLilypond").style.visibility = "visible";
        document.getElementById("downloadLilypond").onclick = () => {
            download("myscore.ly", Lilypond.getCode(score));
        };
        document.addEventListener("keydown", (evt) => {
            if (evt.ctrlKey && evt.keyCode == KeyEvent.DOM_VK_Z) {
                interactionScore.undo();
            }
            else if (evt.ctrlKey && evt.shiftKey && evt.keyCode == KeyEvent.DOM_VK_Z) {
                interactionScore.redo();
            }
        });
        new OpenFileDragDrop((file) => {
            console.log("Open file " + file.path);
            let reader = new FileReader();
            reader.addEventListener('load', function () {
                init();
                Lilypond.getScore(score, reader.result);
                interactionScore = new InteractionScore(score);
            });
            reader.readAsText(file, 'UTF-8');
        });
    }
}
/**
 *
 * @param filename
 * @param textContent
 * @fires (for online version) it makes start a download of a file called filename whose content is textContent
 */
function download(filename, textContent) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(textContent));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
//# sourceMappingURL=main.js.map