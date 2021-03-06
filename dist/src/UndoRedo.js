export class UndoRedo {
    constructor() {
        this.commands = [];
        this.commandLast = -1;
    }
    do(command) {
        if (this.commands[this.commandLast] == command) {
            command.do();
        }
        else {
            this.commands = this.commands.slice(0, this.commandLast + 1);
            this.commands.push(command);
            command.do();
            this.commandLast++;
        }
    }
    undo() {
        if (this.commandLast >= 0) {
            this.commands[this.commandLast].undo();
            this.commandLast--;
        }
    }
    redo() {
        if (this.commandLast < this.commands.length - 1) {
            this.commandLast++;
            this.commands[this.commandLast].do();
        }
    }
}
//# sourceMappingURL=UndoRedo.js.map