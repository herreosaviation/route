define(["require", "exports", "./uihandler", "./mapHandler", "./texts", "./timespan"], function (require, exports, uihandler_1, mapHandler_1, texts_1, timespan_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    uihandler_1.initilizeUI();
    mapHandler_1.addMapsScript(function () { });
    Number.prototype.toHHMM = function () {
        var ts = timespan_1.TimeSpan.fromSeconds(this);
        var hours = (Math.floor(ts.totalHours)).toString();
        var minutes = (Math.floor(ts.minutes)).toString();
        if (minutes.length == 1) {
            minutes = "0" + minutes;
        }
        return hours + ":" + minutes + " " + texts_1.getText(texts_1.Texts.hhmmend);
        // ts.totalHours
        // var s = this * 1000;
        // var ms = s % 1000;
        // s = (s - ms) / 1000;
        // var secs = s % 60;
        // s = (s - secs) / 60;
        // var mins = s % 60;
        // var hrs = (s - mins) / 60;
        // return hrs + ":" + mins + " " + getText(Texts.hhmmend);
    };
    Number.prototype.toKMMM = function () {
        var km = this / 1000;
        return km.toFixed(1) + " km";
    };
});
