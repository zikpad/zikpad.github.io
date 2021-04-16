export class CommandToggleNote {
    constructor(note) {
        this.note = note;
    }
    do() { this.note.toggle(); }
    undo() { this.note.toggle(); }
}
//# sourceMappingURL=CommandToggleNote.js.map