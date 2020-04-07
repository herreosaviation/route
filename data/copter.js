define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Copter = /** @class */ (function () {
        function Copter(name, shortName, fuel, flightTime, speed, isPlane) {
            if (isPlane === void 0) { isPlane = false; }
            this.isPlane = false;
            this.name = name;
            this.shortName = shortName;
            this.fuel = fuel;
            this.flightTime = flightTime;
            this.speed = speed;
            this.isPlane = isPlane;
        }
        return Copter;
    }());
    exports.Copter = Copter;
    exports.copters = [
        new Copter("Agusta AW109SP", "AW109SP", 270, 2.5, 250),
        new Copter("Bell 407GXP", "407GXP", 450, 4, 220),
        new Copter("Pilatus PC12", "PC12", 0, 5.8, 500, true)
    ];
});
//# sourceMappingURL=copter.js.map