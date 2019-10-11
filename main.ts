import { } from 'googlemaps';
import { initilizeUI } from './uihandler';
import { addMapsScript } from './mapHandler';
import { getText, Texts } from './texts';
import { TimeSpan } from './timespan';

initilizeUI();
addMapsScript(() => { });


Number.prototype.toHHMM = function () {
    var ts = TimeSpan.fromSeconds(this);
    var hours = (Math.floor(ts.totalHours)).toString();
    var minutes = (Math.floor(ts.minutes)).toString();
    if (minutes.length == 1) {
        minutes = "0" + minutes;
    }
    return hours + ":" + minutes + " " + getText(Texts.hhmmend);
    // ts.totalHours
    // var s = this * 1000;
    // var ms = s % 1000;
    // s = (s - ms) / 1000;
    // var secs = s % 60;
    // s = (s - secs) / 60;
    // var mins = s % 60;
    // var hrs = (s - mins) / 60;

    // return hrs + ":" + mins + " " + getText(Texts.hhmmend);
}

Number.prototype.toKMMM = function () {
    var km = this / 1000;
    return km.toFixed(1) + " km";
}

