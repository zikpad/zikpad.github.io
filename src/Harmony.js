import { Pitch } from './Pitch.js';
const MIDISHIFT = 12 * 2 + 6;
export class Harmony {
    /**
     *
     * @param frequency
     * @returns the pitch that matches the most the frequency
     */
    static freqToPitch(frequency) {
        const FREQBASE = 440;
        const midiPitch = 2 + Math.round(Math.log2(Math.pow(frequency * Math.pow(2, 1 / 30) / FREQBASE, 12)));
        //* Math.pow(2, 1/30) => for making the frequency higher
        return Harmony.midiPitchToPitch(midiPitch + MIDISHIFT);
    }
    /**
     *
     * @param midiPitch
     * @returns the pitch that corresponds to midiPitch (in the key C major)
     */
    static midiPitchToPitch(midiPitch) {
        midiPitch = midiPitch - MIDISHIFT;
        let octave = Math.floor(midiPitch / 12);
        let midiPitchM = midiPitch % 12;
        if (midiPitchM < 0)
            midiPitchM = midiPitchM + 12;
        return new Pitch(Harmony.midiPitchMTopitchM(midiPitchM) + octave * 7, Harmony.midiPitchMToAccidental(midiPitchM));
    }
    /**
     *
     * @param midiPitchM  (between 0 and 11)
     * @returns the value of the pitch between 0 and 6 (0 = C, 1 = D, etc.)
     */
    static midiPitchMTopitchM(midiPitchM) {
        switch (midiPitchM) {
            case 0:
            case 1: return 0;
            case 2:
            case 3: return 1;
            case 4: return 2;
            case 5:
            case 6: return 3;
            case 7:
            case 8: return 4;
            case 9:
            case 10: return 5;
            case 11: return 6;
            default: throw "midiPitchMTopitchM: argument not between 0 and 11";
        }
    }
    /**
     *
     * @param midiPitchM (between 0 and 11)
     * @returns 0 or 1 (0 means that the note is natural, 1 = sharp)
     *
     */
    static midiPitchMToAccidental(midiPitchM) {
        return [1, 3, 6, 8, 10].indexOf(midiPitchM) >= 0 ? 1 : 0;
    }
    /**
     *
     * @param pitch1
     * @param pitch2
     * @return the sum of the two pitch.
     * @example add(D, E) = F# because D = one tone, D = two tones => the result is three tones, so F#
     */
    static add(pitch1, pitch2) {
        let result = new Pitch(pitch1.value + pitch2.value, 0);
        let nbHalfTone = result.nbHalfTones - pitch1.nbHalfTones;
        result.accidental = pitch2.nbHalfTones - nbHalfTone;
        return result;
    }
    /**
     *
     * @param pitch
     * @returns the same pitch but in the normal octave
     */
    static modulo(pitch) {
        return new Pitch(pitch.value % 7, pitch.accidental);
    }
    /**
     *
     * @param pitch
     * @param key
     * @returns the same pitch but in the key (e.g. G# in Eb is Ab)
     */
    static enharmonic(pitch, key) {
        const pitch0 = Harmony.add(pitch, new Pitch(-key.value, -key.accidental));
        const pitch0e = Harmony.midiPitchToPitch(pitch0.nbHalfTones);
        return Harmony.add(pitch0e, key);
    }
    /**
     *
     * @param key
     * @returns the array of accidentals in the key
    
     */
    static getAccidentals(key) {
        const array = [];
        for (let i = 0; i < 7; i++) {
            let newPitch = Harmony.modulo(Harmony.add(new Pitch(i, 0), key));
            array[newPitch.value] = newPitch.accidental;
        }
        return array;
    }
    /**
     * @param pitch
     * @param key
     * @return the pitch with the accidental that is natural in the key
     * @example accidentalize(C, E) => C# because C has a # in E major
     */
    static accidentalize(pitch, key) {
        return new Pitch(pitch.value, Harmony.getAccidentals(key)[pitch.valueM]);
    }
}
//# sourceMappingURL=Harmony.js.map