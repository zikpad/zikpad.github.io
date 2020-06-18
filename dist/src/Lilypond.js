import { Layout } from "./Layout.js";
var Lilypond = /** @class */ (function () {
    function Lilypond() {
    }
    Lilypond.getLilypond = function (score) {
        score.notes.sort(function (n1, n2) { return n1.x - n2.x; });
        var timeSteps = getTimeSteps(score);
        computeTime(timeSteps);
        var s = "";
        for (var i = 0; i < timeSteps.length; i++) {
            s += timeSteps[i].getPitchs();
            if (i < timeSteps.length - 1)
                s += getDurationInfo(timeSteps[i + 1].t - timeSteps[i].t);
            else
                s += getDurationInfo(1 - timeSteps[i].t);
            s += " ";
        }
        return s;
    };
    return Lilypond;
}());
export { Lilypond };
function getDurationInfo(dt) {
    if (dt < 0.25 / 2)
        return "8";
    else if (dt < 0.25)
        return "4";
    else if (dt < 0.5)
        return "2";
    else
        return "1";
}
var TimeStep = /** @class */ (function () {
    function TimeStep(note) {
        this.t = undefined;
        this.x = note.x;
        this.notes = [note];
    }
    TimeStep.prototype.getPitchs = function () {
        if (this.notes.length > 1) {
            var s = "<";
            for (var _i = 0, _a = this.notes; _i < _a.length; _i++) {
                var note = _a[_i];
                s += note.getPitchName() + " ";
            }
            s += ">";
            return s;
        }
        else
            return this.notes[0].getPitchName();
    };
    return TimeStep;
}());
function getTimeSteps(score) {
    var timeSteps = [];
    var previousNote = undefined;
    for (var _i = 0, _a = score.notes; _i < _a.length; _i++) {
        var note = _a[_i];
        if (previousNote) {
            if (Math.abs(note.x - previousNote.x) < 2 * Layout.NOTERADIUS)
                timeSteps[timeSteps.length - 1].notes.push(note);
            else {
                previousNote = note;
                timeSteps.push(new TimeStep(note));
            }
        }
        else {
            timeSteps.push(new TimeStep(note));
            previousNote = note;
        }
    }
    return timeSteps;
}
function computeTime(timeSteps) {
    if (timeSteps.length == 0)
        return;
    for (var _i = 0, timeSteps_1 = timeSteps; _i < timeSteps_1.length; _i++) {
        var ts = timeSteps_1[_i];
        ts.x -= timeSteps[0].x;
    }
    for (var _a = 0, timeSteps_2 = timeSteps; _a < timeSteps_2.length; _a++) {
        var ts = timeSteps_2[_a];
        ts.t = ts.x / Layout.WIDTH;
    }
}
//# sourceMappingURL=Lilypond.js.map