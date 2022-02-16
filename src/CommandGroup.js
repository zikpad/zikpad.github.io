/**
 * A command that contains other commands
 */
export class CommandGroup {
    constructor() {
        this.commands = [];
    }
    push(command) {
        this.commands.push(command);
    }
    get(i) {
        return this.commands[i];
    }
    get size() { return this.commands.length; }
    do() {
        for (let i = 0; i < this.commands.length; i++)
            this.commands[i].do();
    }
    undo() {
        for (let i = this.commands.length - 1; i >= 0; i--)
            this.commands[i].undo();
    }
}
//# sourceMappingURL=CommandGroup.js.map