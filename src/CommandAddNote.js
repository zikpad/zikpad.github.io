export class CommandAddNote {
    constructor(voice, note) {
        this.voice = voice;
        this.note = note;
    }
    do() { this.voice.addNote(this.note); }
    undo() { this.voice.removeNote(this.note); }
}
//# sourceMappingURL=CommandAddNote.js.map