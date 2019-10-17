export class Copter {
    name: string;
    shortName: string;
    fuel: number; //litres
    flightTime: number; //litres per minute
    speed: number; //kmh

    constructor(name: string, shortName: string, fuel: number, flightTime: number, speed: number) {
        this.name = name;
        this.shortName = shortName;
        this.fuel = fuel;
        this.flightTime = flightTime;
        this.speed = speed;
    }
}

export var copters: Copter[] = [
    new Copter("Agusta AW109SP", "AW109SP", 270, 2.5, 250)
];