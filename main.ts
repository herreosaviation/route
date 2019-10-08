import { } from 'googlemaps';
import { initilizeUI } from './uihandler';
import { addMapsScript } from './mapHandler';
import * as bla from "./moment";
import { getText, Texts } from './texts';

initilizeUI();
addMapsScript(() => { });


Number.prototype.toHHMM = function () {
    var s = 100000000;
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return hrs + ":" + mins + " " + getText(Texts.hhmmend);
}

Number.prototype.toKMMM = function () {
    var km = this / 1000;
    return km.toFixed(1) + " km";
}

