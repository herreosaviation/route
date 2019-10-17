import { RouteObjectWrapper } from "./session";
import { Copter } from "./copter";
import * as mapHandler from './mapHandler';
import { getText, Texts } from "./texts";
import { TimeSpan } from "./timespan";

export interface RouteResult {
    table: HTMLTableElement;
    steps: SingleStep[];
    originalRoute: RouteObjectWrapper[];
    carDirectionResult: google.maps.DirectionsResult;
    copterDirections: google.maps.LatLng[];
    copterNumberOfStops: number;
}

interface SingleStep {
    copterDistance: number,
    copterDuration: number,
    carDistance: number,
    carDuration: number,
    from: RouteObjectWrapper,
    to: RouteObjectWrapper
}

export var tableId = "RouteResultTable";

export function performRoute(route: RouteObjectWrapper[], copter: Copter, success: (result: RouteResult) => void, failure: () => void) {

    var steps: SingleStep[]
    if (route.length > 1) {
        steps = route.slice(1, route.length).map((_x, index) => {
            var cptDistance = calculateDistances(route[index].getLatLng(), route[index + 1].getLatLng());
            var cptDuration = cptDistance / copter.speed;
            var step: SingleStep = {
                copterDistance: cptDistance * 1000,
                copterDuration: cptDuration * 60 * 60,
                from: route[index],
                to: route[index + 1],
                carDistance: null,
                carDuration: null
            };
            return step;
        });

        var numberOfCopterStops = Math.floor((steps.map(x => x.copterDistance / 1000).reduce((x, y) => x + y) / copter.speed) / copter.flightTime);

        mapHandler.calculateCarRoute(route.map(x => x.getLatLng()), result => {
            if (result.routes.length < 1) {
                failure();
            }
            else {
                result.routes[0].legs.forEach((x, i) => {
                    steps[i].carDistance = x.distance.value;
                    steps[i].carDuration = x.duration.value;
                });

                success({
                    originalRoute: route,
                    steps: steps,
                    table: createTable(steps, numberOfCopterStops),
                    carDirectionResult: result,
                    copterDirections: route.map(x => x.getLatLng()),
                    copterNumberOfStops: numberOfCopterStops
                });
            }
        }, failure);
    }
    else {
        return;
    }
}

function createTable(steps: SingleStep[], numberOfStops: number): HTMLTableElement {
    var table = document.createElement('table');
    table.id = tableId;
    var data: String[][] = [];
    var columnNames = [getText(Texts.tablePlace), getText(Texts.tableFlightroute), getText(Texts.tableFlightTime), getText(Texts.tableCarTime), getText(Texts.tableCarRoute), getText(Texts.tableTimeSaving)];
    data.push(columnNames);
    data.push([])
    if (steps.length >= 1) {
        data.push([steps[0].from.getName(), "-", "-", "-", "-", "-"])
    }

    steps.forEach(x => {
        var cur: String[] = [];
        cur.push(x.to.getName());
        cur.push(x.copterDistance.toKMMM());
        cur.push(x.copterDuration.toHHMM());
        cur.push(x.carDuration.toHHMM());
        cur.push(x.carDistance.toKMMM());
        cur.push((x.carDuration - x.copterDuration).toHHMM());
        data.push(cur);
    })

    var gesamt: String[] = [getText(Texts.tableFinal)];
    gesamt.push(steps.map(x => x.copterDistance).reduce((x, y) => x + y).toKMMM());
    var copterDuration = steps.map(x => x.copterDuration).reduce((x, y) => x + y);
    var cDTs = TimeSpan.fromSeconds(copterDuration);
    if (numberOfStops != 0) {
        var minutes = numberOfStops * 45;
        var ts = TimeSpan.fromMinutes(minutes);
        cDTs = cDTs.add(ts);
        copterDuration = cDTs.totalSeconds;
    }
    gesamt.push(copterDuration.toHHMM());
    var carDuration = steps.map(x => x.carDuration).reduce((x, y) => x + y);
    gesamt.push(carDuration.toHHMM());
    gesamt.push(steps.map(x => x.carDistance).reduce((x, y) => x + y).toKMMM());
    gesamt.push((carDuration - copterDuration).toHHMM());

    data.push([]);
    data.push(gesamt);

    data.push([getText(Texts.tableCaValuesInfo)]);
    if (numberOfStops == 1) {
        data.push([getText(Texts.tableNeededStopsInfo, null)])
    }
    else if (numberOfStops > 1) {
        data.push([getText(Texts.tableNeededStopsInfo, numberOfStops)])
    }

    data.forEach(x => {
        var index = 0;
        var row = table.insertRow();
        if (x.length == 0) {
            row.className = "border_bottom";
            var cell = row.insertCell();
            cell.colSpan = data[0].length;
        }
        x.forEach(y => {
            var cell = row.insertCell();
            cell.innerHTML = <string>y;
            if (x.length == 1) {
                cell.colSpan = data[0].length;
            }
            else if (index == 1 || index == 3 || index == 5) {
                cell.style.borderLeft = "1pt solid white";
                cell.style.paddingLeft = "10px";
                cell.style.paddingRight = "10px";
            }

            index++;
        });
    });


    return table;
}



function calculateDistances(start: google.maps.LatLng, end: google.maps.LatLng): number {
    return mapHandler.getDistanceFromLatLonInKm(start.lat(), start.lng(), end.lat(), end.lng());
}