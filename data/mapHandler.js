define(["require", "exports", "./globals", "./flights", "./mapstyle"], function (require, exports, globals_1, flights_1, mapstyle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function setFullMapAction(action) {
        fullMapAction = action;
    }
    exports.setFullMapAction = setFullMapAction;
    var fullMapAction = null;
    var url = globals_1.globals.mapsUrl + "key=" + globals_1.globals.apiKey + "&" + "v=3";
    exports.currentMarkers = [];
    var currentCopterPolyLines = [];
    var currentDirections = [];
    function GetNearbyAirports(lat, lng, distance) {
        return flights_1.data.map(function (cur) {
            return {
                distance: getDistanceFromLatLonInKm(lat, lng, cur.Latitude, cur.Longitude),
                airport: cur
            };
        }).filter(function (cur) {
            return cur.distance <= distance;
        }).sort(function (x, y) { return x.distance > y.distance ? 1 : x.distance == y.distance ? 0 : -1; });
    }
    exports.GetNearbyAirports = GetNearbyAirports;
    function GetNearestAirports(pos, results) {
        return flights_1.data.map(function (cur) {
            return {
                distance: getDistanceFromLatLonInKm(pos.lat, pos.lng, cur.Latitude, cur.Longitude),
                airport: cur
            };
        }).sort(function (x, y) { return x.distance > y.distance ? 1 : x.distance == y.distance ? 0 : -1; }).slice(0, results - 1);
    }
    exports.GetNearestAirports = GetNearestAirports;
    function calculateCarRoute(route, success, failure) {
        var service = new google.maps.DirectionsService();
        var mapped = route.map(function (x) { return x; });
        var start = mapped[0];
        var end = mapped[mapped.length - 1];
        var between = mapped.length > 2 ? mapped.slice(1, mapped.length - 1).map(function (x) {
            var obj = {
                location: x,
                stopover: true
            };
            return obj;
        }) : null;
        service.route({
            origin: start,
            destination: end,
            waypoints: between,
            travelMode: google.maps.TravelMode.DRIVING
        }, function (result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                success(result);
            }
            else {
                console.debug(status);
                failure();
            }
        });
    }
    exports.calculateCarRoute = calculateCarRoute;
    function drawCarRoute(calculationResponse) {
        currentDirections.forEach(function (x) {
            x.setMap(null);
        });
        currentDirections = [];
        var display = new google.maps.DirectionsRenderer();
        currentDirections.push(display);
        display.setMap(exports.map);
        display.setDirections(calculationResponse);
        var bounds = display.getDirections().routes[0].bounds;
        exports.map.fitBounds(bounds);
        // setCenter(bounds.getCenter());
    }
    exports.drawCarRoute = drawCarRoute;
    function drawCopterRoute(coordinates) {
        currentCopterPolyLines.forEach(function (x) { return x.setMap(null); });
        currentCopterPolyLines = [];
        var polyLine = new google.maps.Polyline({
            path: coordinates,
            geodesic: true,
            strokeColor: 'FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        currentCopterPolyLines.push(polyLine);
        polyLine.setMap(exports.map);
    }
    exports.drawCopterRoute = drawCopterRoute;
    function drawMarkers(markers, markerSelected) {
        markers.forEach(function (x) {
            exports.currentMarkers.push(x.marker);
            x.marker.setMap(exports.map);
            x.marker.addListener('click', function (event) {
                markerSelected(x);
            });
        });
    }
    exports.drawMarkers = drawMarkers;
    function removeAllMarkers() {
        exports.currentMarkers.forEach(function (x) {
            x.setMap(null);
        });
        exports.currentMarkers = [];
    }
    exports.removeAllMarkers = removeAllMarkers;
    function drawCircle(location, radius) {
        var circle = new google.maps.Circle({
            center: location,
            radius: radius,
            fillColor: "#000000"
        });
        circle.setMap(exports.map);
        return circle;
    }
    exports.drawCircle = drawCircle;
    function setCenter(location, offsetX, offsetY) {
        if (offsetX === void 0) { offsetX = null; }
        if (offsetY === void 0) { offsetY = null; }
        if (offsetX == null) {
            offsetX = 0;
        }
        if (offsetY == null) {
            offsetY = -document.getElementById('routeSelectionBackground').offsetHeight / 2;
        }
        var scale = Math.pow(2, exports.map.getZoom());
        var worldCoordinateCenter = exports.map.getProjection().fromLatLngToPoint(location);
        var pixelOffset = new google.maps.Point((offsetX / scale) || 0, (offsetY / scale) || 0);
        var worldCoordinateNewCenter = new google.maps.Point(worldCoordinateCenter.x - pixelOffset.x, worldCoordinateCenter.y + pixelOffset.y);
        var newCenter = exports.map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);
        exports.map.setCenter(newCenter);
    }
    exports.setCenter = setCenter;
    function setBounds(bounds) {
        exports.map.fitBounds(bounds);
    }
    exports.setBounds = setBounds;
    function initMap() {
        exports.map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 52.520008, lng: 13.404954 },
            disableDefaultUI: true,
            zoom: 8,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: mapstyle_1.style,
            gestureHandling: 'cooperative'
        });
        var viewportmeta = document.querySelector('meta[name=viewport]');
        exports.map.addListener("click", function () {
            if (fullMapAction != null) {
                fullMapAction(exports.map);
            }
            viewportmeta.setAttribute('content', "initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0");
        });
        exports.map.addListener("drag", function () {
            if (fullMapAction != null) {
                fullMapAction(exports.map);
            }
            viewportmeta.setAttribute('content', "initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0");
        });
    }
    function addMapsScript(completion) {
        if (!document.querySelectorAll("[src=\"" + url + "\"]").length) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = url;
            script.onload = function () { initMap(); completion(); };
            document.body.appendChild(script);
        }
        else {
            this.doMapInitLogic();
        }
    }
    exports.addMapsScript = addMapsScript;
    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1); // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }
    exports.getDistanceFromLatLonInKm = getDistanceFromLatLonInKm;
    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
});
//# sourceMappingURL=mapHandler.js.map