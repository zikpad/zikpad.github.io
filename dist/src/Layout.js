import { Pitch } from './Pitch.js';
let Layout = /** @class */ (() => {
    class Layout {
        static getY(pitch) {
            let v;
            if (pitch instanceof Pitch)
                v = pitch.value;
            else
                v = pitch;
            return this.BASELINE - Layout.NOTERADIUS * v;
        }
        static getPitchValue(y) {
            return Math.round((this.BASELINE - y) / Layout.NOTERADIUS);
        }
        static getT(x) {
            return Math.max(0, (x - Layout.XBEGINDEFAULT) / (Layout.WIDTHONE - Layout.XBEGINDEFAULT));
        }
        static getX(t) {
            return Layout.XBEGINDEFAULT + (Layout.WIDTHONE - Layout.XBEGINDEFAULT) * t;
        }
    }
    Layout.NOTERADIUS = 16;
    Layout.WIDTHONE = 800;
    Layout.WIDTH = 20000;
    Layout.HEIGHT = 800;
    Layout.BASELINE = Layout.HEIGHT * 2 / 4;
    Layout.RYTHMY = -4 * Layout.NOTERADIUS;
    Layout.RYTHMYNOLET = Layout.RYTHMY - 2;
    Layout.RYTHMX = 16;
    Layout.RYTHMLINESSEP = 16;
    Layout.LANDMARKHEIGHT = 800;
    Layout.XBEGINDEFAULT = 64;
    return Layout;
})();
export { Layout };
//# sourceMappingURL=Layout.js.map