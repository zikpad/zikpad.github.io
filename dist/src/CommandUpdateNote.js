export class CommandUpdateNote {
    constructor(note, x, pitch) {
        this.note = note;
        this.x = x;
        this.pitch = pitch;
        this.previousX = note.x;
        this.previousPitch = note.pitch;
    }
    update(x, pitch) {
        this.x = x;
        this.pitch = pitch;
    }
    do() { this.note.update(this.x, this.pitch); }
    undo() { this.note.update(this.previousX, this.previousPitch); }
}
//# sourceMappingURL=CommandUpdateNote.js.map