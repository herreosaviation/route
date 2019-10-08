import { plaindata, plainCountries } from './convertcsv';

export enum AirportType {
    closed, heliport, smallAirport, mediumAirport, largeAirport
}

export class Airport {
    Station: string;
    Code: string;
    Latitude: number;
    Longitude: number;
    Country: string;
    Type: AirportType;

    getName() {
        if (this.Code != null) {
            return this.Code + " - " + this.Station;
        }
        return this.Station;
    }

    constructor(Station: string, Code: string, Latitude: number, Longitude: number, country: string, type: AirportType) {
        this.Station = Station;
        this.Code = Code;
        this.Country = country;
        this.Latitude = Latitude;
        this.Longitude = Longitude;
        this.Type = type;
    }
}

export class Country {
    Code: string;
    Name: string;
    constructor(Code: string, Name: String) {
        this.Code = Code;
        this.Name = name;
    }
}

export var data: Airport[] = plaindata.map(x => {
    var type: AirportType;
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
    return new Airport(
        x["n"], x["co"], x["la"], x["lo"], x["cn"], type
    )
});

export var countries: Country[] = plainCountries.map(x => {
    return new Country(x["code"], x["name"]);
})