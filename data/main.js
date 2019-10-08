define(["require", "exports", "./uihandler", "./mapHandler", "./texts"], function (require, exports, uihandler_1, mapHandler_1, texts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    uihandler_1.initilizeUI();
    mapHandler_1.addMapsScript(() => { });
    Number.prototype.toHHMM = function () {
        var s = 100000000;
        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        s = (s - secs) / 60;
        var mins = s % 60;
        var hrs = (s - mins) / 60;
        return hrs + ":" + mins + " " + texts_1.getText(texts_1.Texts.hhmmend);
    };
    Number.prototype.toKMMM = function () {
        var km = this / 1000;
        return km.toFixed(1) + " km";
    };
});
//# sourceMappingURL=main.js.map