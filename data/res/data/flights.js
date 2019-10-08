define(["require", "exports", "./convertcsv"], function (require, exports, convertcsv_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AirportType;
    (function (AirportType) {
        AirportType[AirportType["closed"] = 0] = "closed";
        AirportType[AirportType["heliport"] = 1] = "heliport";
        AirportType[AirportType["smallAirport"] = 2] = "smallAirport";
        AirportType[AirportType["mediumAirport"] = 3] = "mediumAirport";
        AirportType[AirportType["largeAirport"] = 4] = "largeAirport";
    })(AirportType = exports.AirportType || (exports.AirportType = {}));
    class Airport {
        getName() {
            if (this.Code != null) {
                return this.Code + " - " + this.Station;
            }
            return this.Station;
        }
        constructor(Station, Code, Latitude, Longitude, country, type) {
            this.Station = Station;
            this.Code = Code;
            this.Country = country;
            this.Latitude = Latitude;
            this.Longitude = Longitude;
            this.Type = type;
        }
    }
    exports.Airport = Airport;
    class Country {
        constructor(Code, Name) {
            this.Code = Code;
            this.Name = name;
        }
    }
    exports.Country = Country;
    exports.data = convertcsv_1.plaindata.map(x => {
        var type;
        switch (x["t"]) {
            case "closed":
                type = AirportType.closed;
                break;
            case "small_airport":
                type = AirportType.smallAirport;
                break;
            case "medium_airport":
                type = AirportType.mediumAirport;
                break;
            case "large_airport":
                type = AirportType.largeAirport;
                break;
        }
        return new Airport(x["n"], x["co"], x["la"], x["lo"], x["cn"], type);
    });
    exports.countries = convertcsv_1.plainCountries.map(x => {
        return new Country(x["code"], x["name"]);
    });
});
//# sourceMappingURL=flights.js.map