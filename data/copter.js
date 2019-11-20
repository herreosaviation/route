define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Copter = /** @class */ (function () {
        function Copter(name, shortName, fuel, flightTime, speed) {
            this.name = name;
            this.shortName = shortName;
            this.fuel = fuel;
            this.flightTime = flightTime;
            this.speed = speed;
        }
        return Copter;
    }());
    exports.Copter = Copter;
    exports.copters = [
        new Copter("Agusta AW109SP", "AW109SP", 270, 2.5, 250)
    ];
});
//# sourceMappingURL=copter.js.map