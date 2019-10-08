define(["require", "exports", "./mapHandler"], function (require, exports, mapHandler) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.tableId = "RouteResultTable";
    function performRoute(route, copter, success, failure) {
        var steps;
        if (route.length > 1) {
            steps = route.slice(1, route.length).map((_x, index) => {
                var cptDistance = calculateDistances(route[index].getLatLng(), route[index + 1].getLatLng());
                var cptDuration = cptDistance / copter.speed;
                var step = {
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
    exports.performRoute = performRoute;
    function createTable(steps, numberOfStops) {
        var table = document.createElement('table');
        table.id = exports.tableId;
        var data = [];
        var columnNames = ["Ort", "Luftlinie", "Flugzeit", "Fahrtzeit", "Fahrtstrecke", "Zeitersparnis"];
        data.push(columnNames);
        if (steps.length >= 1) {
            data.push([steps[0].from.getName(), "-", "-", "-", "-", "-"]);
        }
        steps.forEach(x => {
            var cur = [];
            cur.push(x.to.getName());
            cur.push(x.copterDistance.toKMMM());
            cur.push(x.copterDuration.toHHMM());
            cur.push(x.carDuration.toHHMM());
            cur.push(x.carDistance.toKMMM());
            cur.push((x.carDuration - x.copterDuration).toHHMM());
            data.push(cur);
        });
        var gesamt = ["Gesamt"];
        gesamt.push(steps.map(x => x.copterDistance).reduce((x, y) => x + y).toKMMM());
        gesamt.push(steps.map(x => x.copterDuration).reduce((x, y) => x + y).toHHMM());
        gesamt.push(steps.map(x => x.carDuration).reduce((x, y) => x + y).toHHMM());
        gesamt.push(steps.map(x => x.carDistance).reduce((x, y) => x + y).toKMMM());
        gesamt.push(steps.map(x => x.carDuration - x.copterDuration).reduce((x, y) => x + y).toHHMM());
        data.push(gesamt);
        data.push(["Die angezeigten Werte sind Richtwerte. Schwankungen, bspw. aufgrund der aktuellen Wetterlage, können auftreten."]);
        if (numberOfStops == 1) {
            data.push(["Es ist voraussichtlich eine Zwischenlandung erforderlich."]);
        }
        else if (numberOfStops > 1) {
            data.push(["Es sind voraussichtlich " + numberOfStops + " Zwischenlandungen erforderlich."]);
        }
        data.forEach(x => {
            var row = table.insertRow();
            x.forEach(y => {
                var cell = row.insertCell();
                cell.innerHTML = y;
                if (x.length == 1) {
                    cell.colSpan = data[0].length;
                }
            });
        });
        return table;
    }
    function calculateDistances(start, end) {
        return mapHandler.getDistanceFromLatLonInKm(start.lat(), start.lng(), end.lat(), end.lng());
    }
});
