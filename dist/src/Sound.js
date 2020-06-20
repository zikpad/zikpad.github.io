var context = new window.AudioContext();
let url = "";
class Timbre {
    constructor() {
        this.soundbuffers = new Array();
    }
    addWaveBuffer(frequency, name) {
        let timbre = this;
        var getSound = new XMLHttpRequest();
        console.log("starting creating XMLHttpRequest for file " + name);
        getSound.open("GET", url + name, true);
        getSound.responseType = "arraybuffer";
        getSound.onload = function () {
            context.decodeAudioData(getSound.response, function (buffer) {
                console.log("starting receiving buffer of file " + name);
                timbre.soundbuffers[frequency] = buffer;
                console.log("file for " + name + " loaded");
            });
        };
        getSound.send();
    }
    getBestBufferAndBestFrequency(frequency) {
        //     var frequencies = [110, 220, 440, 880];
        //    var buffername = ["A1", "A2", "A3", "A4"];
        var b = Number.MAX_VALUE;
        var freqBest;
        for (var freq in this.soundbuffers) {
            if (b > Math.abs(parseInt(freq) - frequency)) {
                freqBest = freq;
                b = Math.abs(parseInt(freq) - frequency);
            }
        }
        return { buffer: this.soundbuffers[freqBest], frequency: freqBest };
    }
    getAudio(context, frequency) {
        var o = this.getBestBufferAndBestFrequency(frequency);
        var audio = context.createBufferSource();
        audio.buffer = o.buffer;
        audio.playbackRate.value = frequency / o.frequency;
        return audio;
    }
}
let timbrePiano = getTimbrePiano();
//let timbreClarinet = getTimbreClarinet();
let getTimbre = (midiNote, velocity) => timbrePiano;
/**load piano sounds*/
function getTimbrePiano() {
    let timbre = new Timbre();
    timbre.addWaveBuffer(110, "sounds/Piano.mf.A1.ogg");
    timbre.addWaveBuffer(220, "sounds/Piano.mf.A2.ogg");
    timbre.addWaveBuffer(440, "sounds/Piano.mf.A3.ogg");
    timbre.addWaveBuffer(880, "sounds/Piano.mf.A4.ogg");
    return timbre;
}
function getTimbreClarinet() {
    let timbre = new Timbre();
    timbre.addWaveBuffer(440, "sounds/BbClarinet.ff.A3.ogg");
    timbre.addWaveBuffer(880, "sounds/BbClarinet.ff.A4.ogg");
    timbre.addWaveBuffer(880 * 2, "sounds/BbClarinet.ff.A5.ogg");
    timbre.addWaveBuffer(880 * 4, "sounds/BbClarinet.ff.A6.ogg");
    return timbre;
}
function getFrequencyTempered(midiNote, velocity) {
    var numero = (midiNote - (60));
    return 440 * Math.pow(2, 3 / 12) * Math.pow(2, numero / 12);
}
export class Sounds {
    constructor() {
        this.oscillator = {};
    }
    noteOn(midiNote, velocity) {
        let frequency = getFrequencyTempered(midiNote, velocity);
        //velocity = getVelocity(midiNote, velocity);
        let timbre = getTimbre(midiNote, velocity);
        let audio = timbre.getAudio(context, frequency);
        let gainNode = context.createGain();
        gainNode.gain.value = velocity / 64;
        audio.connect(gainNode);
        gainNode.connect(context.destination);
        audio.start(0);
        this.oscillator[midiNote] = audio;
    }
    stop() {
        for (let midiNote in this.oscillator)
            this.stopOscillator(midiNote);
    }
    stopOscillator(midiNote) {
        if (this.oscillator[midiNote] != undefined)
            this.oscillator[midiNote].stop(context.currentTime);
    }
}
//# sourceMappingURL=Sound.js.map