define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MILLIS_PER_SECOND = 1000;
    var MILLIS_PER_MINUTE = MILLIS_PER_SECOND * 60; //     60,000
    var MILLIS_PER_HOUR = MILLIS_PER_MINUTE * 60; //  3,600,000
    var MILLIS_PER_DAY = MILLIS_PER_HOUR * 24; // 86,400,000
    var TimeSpan = /** @class */ (function () {
        function TimeSpan(millis) {
            this._millis = millis;
        }
        TimeSpan.interval = function (value, scale) {
            var tmp = value * scale;
            var millis = TimeSpan.round(tmp + (value >= 0 ? 0.5 : -0.5));
            if ((millis > TimeSpan.maxValue.totalMilliseconds) || (millis < TimeSpan.minValue.totalMilliseconds)) {
                console.log("Timespan too long");
                return null;
            }
            return new TimeSpan(millis);
        };
        TimeSpan.round = function (n) {
            if (n < 0) {
                return Math.ceil(n);
            }
            else if (n > 0) {
                return Math.floor(n);
            }
            return 0;
        };
        TimeSpan.timeToMilliseconds = function (hour, minute, second) {
            var totalSeconds = (hour * 3600) + (minute * 60) + second;
            if (totalSeconds > TimeSpan.maxValue.totalSeconds || totalSeconds < TimeSpan.minValue.totalSeconds) {
                console.log("Timespan too long");
                return null;
            }
            return totalSeconds * MILLIS_PER_SECOND;
        };
        Object.defineProperty(TimeSpan, "zero", {
            get: function () {
                return new TimeSpan(0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimeSpan, "maxValue", {
            get: function () {
                return new TimeSpan(9007199254740991);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimeSpan, "minValue", {
            get: function () {
                return new TimeSpan(-9007199254740991);
            },
            enumerable: true,
            configurable: true
        });
        TimeSpan.fromDays = function (value) {
            return TimeSpan.interval(value, MILLIS_PER_DAY);
        };
        TimeSpan.fromHours = function (value) {
            return TimeSpan.interval(value, MILLIS_PER_HOUR);
        };
        TimeSpan.fromMilliseconds = function (value) {
            return TimeSpan.interval(value, 1);
        };
        TimeSpan.fromMinutes = function (value) {
            return TimeSpan.interval(value, MILLIS_PER_MINUTE);
        };
        TimeSpan.fromSeconds = function (value) {
            return TimeSpan.interval(value, MILLIS_PER_SECOND);
        };
        TimeSpan.fromTime = function (daysOrHours, hoursOrMinutes, minutesOrSeconds, seconds, milliseconds) {
            if (milliseconds != undefined) {
                return this.fromTimeStartingFromDays(daysOrHours, hoursOrMinutes, minutesOrSeconds, seconds, milliseconds);
            }
            else {
                return this.fromTimeStartingFromHours(daysOrHours, hoursOrMinutes, minutesOrSeconds);
            }
        };
        TimeSpan.fromTimeStartingFromHours = function (hours, minutes, seconds) {
            var millis = TimeSpan.timeToMilliseconds(hours, minutes, seconds);
            return new TimeSpan(millis);
        };
        TimeSpan.fromTimeStartingFromDays = function (days, hours, minutes, seconds, milliseconds) {
            var totalMilliSeconds = (days * MILLIS_PER_DAY) +
                (hours * MILLIS_PER_HOUR) +
                (minutes * MILLIS_PER_MINUTE) +
                (seconds * MILLIS_PER_SECOND) +
                milliseconds;
            if (totalMilliSeconds > TimeSpan.maxValue.totalMilliseconds || totalMilliSeconds < TimeSpan.minValue.totalMilliseconds) {
                console.log("Timespan too long");
                return null;
            }
            return new TimeSpan(totalMilliSeconds);
        };
        Object.defineProperty(TimeSpan.prototype, "days", {
            get: function () {
                return TimeSpan.round(this._millis / MILLIS_PER_DAY);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimeSpan.prototype, "hours", {
            get: function () {
                return TimeSpan.round((this._millis / MILLIS_PER_HOUR) % 24);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimeSpan.prototype, "minutes", {
            get: function () {
                return TimeSpan.round((this._millis / MILLIS_PER_MINUTE) % 60);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimeSpan.prototype, "seconds", {
            get: function () {
                return TimeSpan.round((this._millis / MILLIS_PER_SECOND) % 60);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimeSpan.prototype, "milliseconds", {
            get: function () {
                return TimeSpan.round(this._millis % 1000);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimeSpan.prototype, "totalDays", {
            get: function () {
                return this._millis / MILLIS_PER_DAY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimeSpan.prototype, "totalHours", {
            get: function () {
                return this._millis / MILLIS_PER_HOUR;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimeSpan.prototype, "totalMinutes", {
            get: function () {
                return this._millis / MILLIS_PER_MINUTE;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimeSpan.prototype, "totalSeconds", {
            get: function () {
                return this._millis / MILLIS_PER_SECOND;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimeSpan.prototype, "totalMilliseconds", {
            get: function () {
                return this._millis;
            },
            enumerable: true,
            configurable: true
        });
        TimeSpan.prototype.add = function (ts) {
            var result = this._millis + ts.totalMilliseconds;
            return new TimeSpan(result);
        };
        TimeSpan.prototype.subtract = function (ts) {
            var result = this._millis - ts.totalMilliseconds;
            return new TimeSpan(result);
        };
        return TimeSpan;
    }());
    exports.TimeSpan = TimeSpan;
});
//# sourceMappingURL=timespan.js.map