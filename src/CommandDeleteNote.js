export class CommandDeleteNote {
    constructor(note) {
        this.note = note;
    }
    do() { this.note.voice.removeNote(this.note); }
    undo() { this.note.voice.addNote(this.note); }
}
//# sourceMappingURL=CommandDeleteNote.js.map