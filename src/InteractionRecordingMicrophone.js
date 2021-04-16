import { Layout } from './Layout.js';
import { MicrophoneInput } from "./MicrophoneInput.js";
export class InteractionRecordingMicrophone {
    constructor() {
        this.microphoneInput = new MicrophoneInput();
        this.onNote = undefined;
        this.onSound = undefined;
        this.onNoSound = undefined;
        this.microphoneInput.onNote = (freq) => this.onNote(freq);
        this.microphoneInput.onSound = (freq) => this.onSound(freq);
        this.microphoneInput.onNoSound = () => this.onNoSound();
        this.microphoneInput.onError = () => {
            alert("Error with the microphone. Probably you run the page with HTTP instead of HTTPS.");
        };
        document.getElementById("recordMicrophoneButton").onclick =
            () => {
                this.microphoneInput.start();
                document.getElementById("microphoneInput").style.visibility = "visible";
                document.getElementById("recordMicrophoneButton").style.display = "none";
                document.getElementById("stopRecordMicrophoneButton").style.display = "initial";
            };
        document.getElementById("stopRecordMicrophoneButton").onclick = () => {
            this.microphoneInput.stop();
            document.getElementById("microphoneInput").style.visibility = "hidden";
            document.getElementById("recordMicrophoneButton").style.display = "initial";
            document.getElementById("stopRecordMicrophoneButton").style.display = "none";
        };
        document.getElementById("microphoneInput").style.visibility = "hidden";
        document.getElementById("stopRecordMicrophoneButton").style.display = "none";
        document.getElementById("recordMicrophoneButton").style.display = "initial";
    }
    set x(x) {
        document.getElementById("microphoneInput").style.left = "" + (x - Layout.NOTERADIUS);
    }
    get x() {
        return parseInt(document.getElementById("microphoneInput").style.left) + Layout.NOTERADIUS;
    }
    pause() {
        this.microphoneInput.pause();
    }
    unpause() {
        this.microphoneInput.unpause();
    }
    isActive() {
        return this.microphoneInput.isActive();
    }
}
//# sourceMappingURL=InteractionRecordingMicrophone.js.map