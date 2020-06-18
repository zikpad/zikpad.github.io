export class Player {
    constructor(score) {
        this.stopped = false;
        this.t = 0;
        this.score = score;
    }
    _loop() {
        if (this.stopped)
            return;
        this.t += 0.01;
        requestAnimationFrame(() => this._loop());
    }
    stop() {
        this.stopped = true;
    }
}
//# sourceMappingURL=Player.js.map