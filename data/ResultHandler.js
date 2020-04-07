define(["require", "exports", "./mapHandler", "./texts", "./timespan"], function (require, exports, mapHandler, texts_1, timespan_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.tableId = "RouteResultTable";
    function performRoute(route, copter, success, failure) {
        var steps;
        if (route.length > 1) {
            steps = route.slice(1, route.length).map(function (_x, index) {
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
            var numberOfCopterStops = Math.floor((steps.map(function (x) { return x.copterDistance / 1000; }).reduce(function (x, y) { return x + y; }) / copter.speed) / copter.flightTime);
            mapHandler.calculateCarRoute(route.map(function (x) { return x.getLatLng(); }), function (result) {
                if (result.routes.length < 1) {
                    failure();
                }
                else {
                    result.routes[0].legs.forEach(function (x, i) {
                        steps[i].carDistance = x.distance.value;
                        steps[i].carDuration = x.duration.value;
                    });
                    success({
                        originalRoute: route,
                        steps: steps,
                        table: createTable(steps, numberOfCopterStops, copter.isPlane),
                        carDirectionResult: result,
                        copterDirections: route.map(function (x) { return x.getLatLng(); }),
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
    function createTable(steps, numberOfStops, isPlane) {
        var table = document.createElement('table');
        table.id = exports.tableId;
        var data = [];
        var columnNames = [texts_1.getText(texts_1.Texts.tablePlace), texts_1.getText(texts_1.Texts.tableFlightroute), texts_1.getText(texts_1.Texts.tableFlightTime, null, isPlane), texts_1.getText(texts_1.Texts.tableCarTime), texts_1.getText(texts_1.Texts.tableCarRoute), texts_1.getText(texts_1.Texts.tableTimeSaving)];
        data.push(columnNames);
        data.push([]);
        if (steps.length >= 1) {
            data.push([steps[0].from.getName(), "-", "-", "-", "-", "-"]);
        }
        steps.forEach(function (x) {
            var cur = [];
            cur.push(x.to.getName());
            cur.push(x.copterDistance.toKMMM());
            cur.push(x.copterDuration.toHHMM());
            cur.push(x.carDuration.toHHMM());
            cur.push(x.carDistance.toKMMM());
            cur.push((x.carDuration - x.copterDuration).toHHMM());
            data.push(cur);
        });
        var gesamt = [texts_1.getText(texts_1.Texts.tableFinal)];
        gesamt.push(steps.map(function (x) { return x.copterDistance; }).reduce(function (x, y) { return x + y; }).toKMMM());
        var copterDuration = steps.map(function (x) { return x.copterDuration; }).reduce(function (x, y) { return x + y; });
        var cDTs = timespan_1.TimeSpan.fromSeconds(copterDuration);
        if (numberOfStops != 0) {
            var minutes = numberOfStops * 45;
            var ts = timespan_1.TimeSpan.fromMinutes(minutes);
            cDTs = cDTs.add(ts);
            copterDuration = cDTs.totalSeconds;
        }
        gesamt.push(copterDuration.toHHMM());
        var carDuration = steps.map(function (x) { return x.carDuration; }).reduce(function (x, y) { return x + y; });
        gesamt.push(carDuration.toHHMM());
        gesamt.push(steps.map(function (x) { return x.carDistance; }).reduce(function (x, y) { return x + y; }).toKMMM());
        gesamt.push((carDuration - copterDuration).toHHMM());
        data.push([]);
        data.push(gesamt);
        data.push([texts_1.getText(texts_1.Texts.tableCaValuesInfo)]);
        if (numberOfStops == 1) {
            data.push([texts_1.getText(texts_1.Texts.tableNeededStopsInfo, 1)]);
        }
        else if (numberOfStops > 1) {
            data.push([texts_1.getText(texts_1.Texts.tableNeededStopsInfo, numberOfStops)]);
        }
        data.forEach(function (x) {
            var index = 0;
            var row = table.insertRow();
            if (x.length == 0) {
                row.className = "border_bottom";
                var cell = row.insertCell();
                cell.colSpan = data[0].length;
            }
            x.forEach(function (y) {
                var cell = row.insertCell();
                row.style.paddingTop = "0px";
                row.style.paddingBottom = "0px";
                cell.innerHTML = y;
                if (x.length == 1) {
                    cell.colSpan = data[0].length;
                }
                else if (index == 1 || index == 3 || index == 5) {
                    // cell.style.borderLeft = "1pt solid white";
                    cell.className = "border_left";
                    cell.style.paddingLeft = "10px";
                    cell.style.paddingRight = "10px";
                }
                index++;
            });
        });
        return table;
    }
    function calculateDistances(start, end) {
        return mapHandler.getDistanceFromLatLonInKm(start.lat(), start.lng(), end.lat(), end.lng());
    }
});
//# sourceMappingURL=ResultHandler.js.map