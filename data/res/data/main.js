define(["require", "exports", "./uihandler", "./mapHandler"], function (require, exports, uihandler_1, mapHandler_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    uihandler_1.initilizeUI();
    mapHandler_1.addMapsScript(function () { });
    Number.prototype.toHHMM = function () {
        var dt = new Date(this * 1000).toISOString();
        return dt.substr(11, 5);
    };
    Number.prototype.toKMMM = function () {
        var km = this / 1000;
        return km.toFixed(1) + " km";
    };
});
//# sourceMappingURL=main.js.map