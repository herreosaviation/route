export class Copter {
    name: string;
    shortName: string;
    fuel: number; //litres
    flightTime: number; //litres per minute
    speed: number; //kmh
    isPlane: boolean = false;
    constructor(name: string, shortName: string, fuel: number, flightTime: number, speed: number, isPlane: boolean = false) {
        this.name = name;
        this.shortName = shortName;
        this.fuel = fuel;
        this.flightTime = flightTime;
        this.speed = speed;
        this.isPlane = isPlane;
    }
}

export var copters: Copter[] = [
    new Copter("Agusta AW109SP", "AW109SP", 270, 2.5, 250),
    new Copter("Bell 407GXP", "407GXP", 450, 4, 220),
    new Copter("Pilatus PC12", "PC12", 0, 5.8, 500, true)
];