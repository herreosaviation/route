define(["require", "exports", "./mapHandler"], function (require, exports, mapHandler) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ActiveRouteType;
    (function (ActiveRouteType) {
        ActiveRouteType[ActiveRouteType["Start"] = 0] = "Start";
        ActiveRouteType[ActiveRouteType["Middle"] = 1] = "Middle";
        ActiveRouteType[ActiveRouteType["End"] = 2] = "End";
    })(ActiveRouteType = exports.ActiveRouteType || (exports.ActiveRouteType = {}));
    var RouteObjectWrapper = /** @class */ (function () {
        function RouteObjectWrapper(geoCoderResult, airportResult) {
            this.geoCoderResult = geoCoderResult;
            this.airportResult = airportResult;
        }
        RouteObjectWrapper.prototype.getLatLng = function () {
            if (this.geoCoderResult != null) {
                return this.geoCoderResult.geometry.location;
            }
            else {
                return new google.maps.LatLng(this.airportResult.Latitude, this.airportResult.Longitude);
            }
        };
        RouteObjectWrapper.prototype.getName = function () {
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
        };
        return RouteObjectWrapper;
    }());
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
        exports.currentStops.forEach(function (x) { return st.push(x); });
        if (exports.currentEnd != null) {
            st.push(exports.currentEnd);
        }
        return st;
    }
    exports.getCurrentRoute = getCurrentRoute;
    function setCurrentRouteObject() {
        getCurrentRoute().forEach(function (x) {
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
        mapHandler.drawMarkers(getCurrentRoute().map(function (x) {
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
        }), function (x) {
        });
    }
    exports.setCurrentRouteObject = setCurrentRouteObject;
    function clearStops() {
        exports.currentStops = [];
    }
    exports.clearStops = clearStops;
    function prepareRouteSelector(next, removeOldEntrys) {
        if (removeOldEntrys === void 0) { removeOldEntrys = true; }
        if (removeOldEntrys && exports.activeRouteSelector != null) {
            exports.activeRouteSelector.setCurrentSelectedSearchValue(null, null);
        }
        exports.activeRouteSelector = next;
    }
    exports.prepareRouteSelector = prepareRouteSelector;
});
//# sourceMappingURL=session.js.map