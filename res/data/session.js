define(["require", "exports", "./mapHandler"], function (require, exports, mapHandler) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ActiveRouteType;
    (function (ActiveRouteType) {
        ActiveRouteType[ActiveRouteType["Start"] = 0] = "Start";
        ActiveRouteType[ActiveRouteType["Middle"] = 1] = "Middle";
        ActiveRouteType[ActiveRouteType["End"] = 2] = "End";
    })(ActiveRouteType = exports.ActiveRouteType || (exports.ActiveRouteType = {}));
    class RouteObjectWrapper {
        constructor(geoCoderResult, airportResult) {
            this.geoCoderResult = geoCoderResult;
            this.airportResult = airportResult;
        }
        getLatLng() {
            if (this.geoCoderResult != null) {
                return this.geoCoderResult.geometry.location;
            }
            else {
                return new google.maps.LatLng(this.airportResult.Latitude, this.airportResult.Longitude);
            }
        }
        getName() {
            if (this.geoCoderResult != null) {
                return this.geoCoderResult.formatted_address;
            }
            else {
                if (this.airportResult.Code != null) {
                    return this.airportResult.Code + " - " + this.airportResult.Station;
                }
                else {
                    return this.airportResult.Station;
                }
            }
        }
    }
    exports.RouteObjectWrapper = RouteObjectWrapper;
    exports.currentStops = [];
    exports.currentCopter = null;
    function setCurrentCopter(cpt) {
        this.currentCopter = cpt;
    }
    exports.setCurrentCopter = setCurrentCopter;
    function getCurrentRoute() {
        var st = [];
        if (exports.currentStart != null) {
            st.push(exports.currentStart);
        }
        exports.currentStops.forEach(x => st.push(x));
        if (exports.currentEnd != null) {
            st.push(exports.currentEnd);
        }
        return st;
    }
    exports.getCurrentRoute = getCurrentRoute;
    function setCurrentRouteObject() {
        getCurrentRoute().forEach(x => {
            if (x.marker != null) {
                x.marker.setMap(null);
            }
        });
        var wr = new RouteObjectWrapper(exports.activeRouteSelector.currentSelectedSearchValue, exports.activeRouteSelector.currentAirportMarker == null ? null : exports.activeRouteSelector.currentAirportMarker.airport);
        switch (exports.activeRouteSelector.type) {
            case ActiveRouteType.Start:
                exports.currentStart = wr;
                break;
            case ActiveRouteType.Middle:
                exports.currentStops.length > 0 ? exports.currentStops[0] = wr : exports.currentStops.push(wr);
                break;
            case ActiveRouteType.End:
                exports.currentEnd = wr;
                break;
        }
        exports.activeRouteSelector.setCurrentSelectedSearchValue(null, null);
        mapHandler.drawMarkers(getCurrentRoute().map(x => {
            var mk = new google.maps.Marker({
                position: x.getLatLng(),
                clickable: true,
                title: x.getName()
            });
            var obj = {
                airport: x.airportResult,
                marker: mk
            };
            return obj;
        }), x => {
        });
    }
    exports.setCurrentRouteObject = setCurrentRouteObject;
    function clearStops() {
        exports.currentStops = [];
    }
    exports.clearStops = clearStops;
    function prepareRouteSelector(next, removeOldEntrys = true) {
        if (removeOldEntrys && exports.activeRouteSelector != null) {
            exports.activeRouteSelector.setCurrentSelectedSearchValue(null, null);
        }
        exports.activeRouteSelector = next;
    }
    exports.prepareRouteSelector = prepareRouteSelector;
});
