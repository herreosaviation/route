import { } from 'googlemaps';
import * as mapHandler from './mapHandler';
import { Airport } from './flights';
import { ActiveRouteSelection } from './ActiveRouteSelection';
import { Copter } from './copter';


export enum ActiveRouteType {
    Start, Stop, End
}

export class RouteObjectWrapper {
    marker?: google.maps.Marker;
    geoCoderResult?: google.maps.GeocoderResult;
    airportResult?: Airport;
    constructor(geoCoderResult: google.maps.GeocoderResult, airportResult: Airport) {
        this.geoCoderResult = geoCoderResult;
        this.airportResult = airportResult;
    }

    getLatLng(): google.maps.LatLng {
        if (this.geoCoderResult != null) {
            return this.geoCoderResult.geometry.location;
        }
        else {
            return new google.maps.LatLng(this.airportResult.Latitude, this.airportResult.Longitude);
        }
    }

    getName(): string {
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

export var currentStart: RouteObjectWrapper;
export var currentStops: RouteObjectWrapper[] = [];
export var currentEnd: RouteObjectWrapper;

export var currentCopter: Copter = null;

export function setCurrentCopter(cpt: Copter) {
    this.currentCopter = cpt;
}

export function getCurrentRoute(): RouteObjectWrapper[] {
    var st: RouteObjectWrapper[] = [];
    if (currentStart != null) {
        st.push(currentStart);
    }
    currentStops.forEach(x => { if (x != null) { st.push(x) } });
    if (currentEnd != null) {
        st.push(currentEnd);
    }
    return st;
}

export function setCurrentRouteObject() {

    getCurrentRoute().forEach(x => {
        if (x.marker != null) {
            x.marker.setMap(null);
        }
    });

    activeRouteSelector.removeCurrentmarker();

    var wr: RouteObjectWrapper = new RouteObjectWrapper(
        activeRouteSelector.currentSelectedSearchValue,
        activeRouteSelector.currentAirportMarker == null ? null : activeRouteSelector.currentAirportMarker.airport
    );
    switch (activeRouteSelector.type) {
        case ActiveRouteType.Start:
            currentStart = wr;
            break;
        case ActiveRouteType.Stop:
            currentStops[activeRouteSelector.stopIndex] = wr
            break;
        case ActiveRouteType.End:
            currentEnd = wr;
            break;
    }
    activeRouteSelector.setCurrentSelectedSearchValue(null, null);

    mapHandler.drawMarkers(getCurrentRoute().map(x => {
        var mk = new google.maps.Marker({
            position: x.getLatLng(),
            clickable: true,
            title: x.getName()
        });
        var obj: mapHandler.MarkerWrapper = {
            airport: x.airportResult,
            marker: mk
        };

        return obj;
    }), x => {

    });
}

export function addStop() {
    currentStops.push(null);
}

export function removeStop(index: number) {
    if (index >= currentStops.length) { return }
    currentStops.splice(index, 1);
}

export function clearStops(index: number) {
    currentStops[index] = null;
}

export var activeRouteSelector: ActiveRouteSelection;

export function prepareRouteSelector(next: ActiveRouteSelection, removeOldEntrys: Boolean = true) {

    if (removeOldEntrys && activeRouteSelector != null) {
        activeRouteSelector.setCurrentSelectedSearchValue(null, null);
    }

    activeRouteSelector = next;
}