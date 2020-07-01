export class CommandChangeVoiceNote {
    constructor(note, voice) {
        this.note = note;
        this.voice = voice;
        this.previousVoice = note.voice;
    }
    do() {
        this.previousVoice.removeNote(this.note);
        this.voice.addNote(this.note);
    }
    undo() {
        this.voice.removeNote(this.note);
        this.previousVoice.addNote(this.note);
    }
}
//# sourceMappingURL=CommandChangeVoiceNote.js.map