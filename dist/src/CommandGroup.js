export class CommandGroup {
    constructor() {
        this.commands = [];
    }
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