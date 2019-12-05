import { } from 'googlemaps';
import { globals } from './globals';
import { data, Airport } from './flights';
import { style } from './mapstyle';
import { ActiveRouteSelection } from './ActiveRouteSelection';
import { currentStart, currentStops, currentEnd } from "./session"
export var map: google.maps.Map;

export function setFullMapAction(action: ((map: google.maps.Map) => void)) {
    fullMapAction = action;
}
var fullMapAction: ((map: google.maps.Map) => void) = null;

var url = globals.mapsUrl + "key=" + globals.apiKey + "&" + "v=3";

export var currentMarkers: google.maps.Marker[] = [];
var currentCopterPolyLines: google.maps.Polyline[] = [];
var currentDirections: google.maps.DirectionsRenderer[] = [];

export interface MarkerWrapper {
    airport?: Airport,
    googleResult?: google.maps.GeocoderResult,
    marker: google.maps.Marker
}

export function GetNearbyAirports(lat: number, lng: number, distance: number): { airport: Airport, distance: number }[] {
    return data.map(cur => {
        return {
            distance: getDistanceFromLatLonInKm(lat, lng, cur.Latitude, cur.Longitude),
            airport: cur
        };
    }).filter(cur => {
        return cur.distance <= distance;
    }).sort((x, y) => x.distance > y.distance ? 1 : x.distance == y.distance ? 0 : - 1);
}

export function GetNearestAirports(pos: google.maps.LatLngLiteral, results: number): { airport: Airport, distance: number }[] {
    return data.map(cur => {
        return {
            distance: getDistanceFromLatLonInKm(pos.lat, pos.lng, cur.Latitude, cur.Longitude),
            airport: cur
        };
    }).sort((x, y) => x.distance > y.distance ? 1 : x.distance == y.distance ? 0 : - 1).slice(0, results - 1);
}

export function calculateCarRoute(route: google.maps.LatLng[], success: (result: google.maps.DirectionsResult) => void, failure: () => void) {
    var service = new google.maps.DirectionsService();
    var mapped = route.map(x => x);
    var start = mapped[0];
    var end = mapped[mapped.length - 1];
    var between: google.maps.DirectionsWaypoint[] = mapped.length > 2 ? mapped.slice(1, mapped.length - 1).map(x => {
        var obj: google.maps.DirectionsWaypoint = {
            location: x,
            stopover: true
        };
        return obj
    }) : null;
    service.route({
        origin: start,
        destination: end,
        waypoints: between,
        travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
        if (status == google.maps.DirectionsStatus.OK) {
            success(result);
        }
        else {
            console.debug(status);
            failure();
        }
    });
}

export function drawCarRoute(calculationResponse: google.maps.DirectionsResult) {
    currentDirections.forEach(x => {
        x.setMap(null);
    });
    currentDirections = [];

    var display = new google.maps.DirectionsRenderer();
    currentDirections.push(display);
    display.setMap(map);
    display.setDirections(calculationResponse);

    var bounds = display.getDirections().routes[0].bounds;
    map.fitBounds(bounds);
    // setCenter(bounds.getCenter());
}

export function drawCopterRoute(coordinates: google.maps.LatLng[]) {
    currentCopterPolyLines.forEach(x => x.setMap(null));
    currentCopterPolyLines = [];
    var polyLine = new google.maps.Polyline({
        path: coordinates,
        geodesic: true,
        strokeColor: 'FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    currentCopterPolyLines.push(polyLine);
    polyLine.setMap(map);
}

export function drawMarkers(markers: MarkerWrapper[], markerSelected: (marker: MarkerWrapper) => void) {
    markers.forEach(x => {
        currentMarkers.push(x.marker);
        x.marker.setMap(map);
        x.marker.addListener('click', event => {
            markerSelected(x);
        });
    });
}

export function removeAllMarkers() {
    currentMarkers.forEach(x => {
        x.setMap(null);
    })

    currentMarkers = [];
}

export function drawCircle(location: google.maps.LatLng, radius: number): google.maps.Circle {
    var circle = new google.maps.Circle({
        center: location,
        radius: radius, //your radius in meters
        fillColor: "#000000"
    });
    circle.setMap(map);
    return circle;
}

export function setCenter(location: google.maps.LatLng, offsetX: number = null, offsetY: number = null) {


    map.setCenter(location);
    return;
    if (offsetX == null) {
        offsetX = 0;
    }
    if (offsetY == null) {
        offsetY = -document.getElementById('routeSelectionBackground').offsetHeight / 2;
    }
    var scale = Math.pow(2, map.getZoom());

    var worldCoordinateCenter = map.getProjection().fromLatLngToPoint(location);
    var pixelOffset = new google.maps.Point((offsetX / scale) || 0, (offsetY / scale) || 0);

    var worldCoordinateNewCenter = new google.maps.Point(
        worldCoordinateCenter.x - pixelOffset.x,
        worldCoordinateCenter.y + pixelOffset.y
    );

    var newCenter = map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);

    map.setCenter(newCenter);
}

export function setBounds(bounds: google.maps.LatLngBounds) {
    map.fitBounds(bounds);
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 52.520008, lng: 13.404954 },
        disableDefaultUI: true,
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: style,
        gestureHandling: 'cooperative'
    });

    const viewportmeta = document.querySelector('meta[name=viewport]');

    map.addListener("click", () => {
        if (fullMapAction != null) {
            fullMapAction(map);
        }

        viewportmeta.setAttribute('content', "initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0");
    });
    map.addListener("drag", () => {
        if (fullMapAction != null) {
            fullMapAction(map);
        }

        viewportmeta.setAttribute('content', "initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0");
    });
}

export function addMapsScript(completion: () => void) {
    if (!document.querySelectorAll(`[src="${url}"]`).length) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.onload = function () { initMap(); completion(); }
        document.body.appendChild(script);
    } else {
        this.doMapInitLogic();
    }
}

export function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180)
}