export class Time {
    static getMeasureDuration() {
        const v = document.getElementById("time").value.split("/");
        return parseInt(v[0]) / parseInt(v[1]);
    }
    static getMeasureNumber(t) {
        return Math.floor(t / Time.getMeasureDuration());
    }
}
//# sourceMappingURL=Time.js.map