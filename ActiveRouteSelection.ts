import { Airport } from './flights';
import { ActiveRouteType, currentEnd } from './session';
import * as mapHandler from './mapHandler';

export class ActiveRouteSelection {
    title: String; type: ActiveRouteType;
    stopIndex: number = null;
    onValueSelected: (cls: ActiveRouteSelection) => void;
    didCancelbla: () => void;
    currentSelectedSearchValue?: google.maps.GeocoderResult;
    currentAirportMarker: mapHandler.MarkerWrapper;
    currentMarkers: mapHandler.MarkerWrapper[];
    currentCircles: google.maps.Circle[];

    setCurrentSelectedAirport(airport: Airport, markerSelected: (wr: mapHandler.MarkerWrapper) => void) {
        if (airport == null) return;

        this.currentAirportMarker = {
            airport: airport,
            marker: new google.maps.Marker({
                position: {
                    lat: airport.Latitude,
                    lng: airport.Longitude
                },
                title: airport.Station,
                clickable: true
            })
        };

        mapHandler.drawMarkers([this.currentAirportMarker], markerSelected);
        mapHandler.setCenter(new google.maps.LatLng(this.currentAirportMarker.airport.Latitude,
            this.currentAirportMarker.airport.Longitude));
    }

    removeCurrentmarker() {
        if (this.currentAirportMarker != null) {
            this.currentAirportMarker.marker.setMap(null);
        }
        if (this.currentCircles != null) {
            this.currentCircles.forEach(x => x.setMap(null));
        }
        if (this.currentMarkers != null) {
            this.currentMarkers.forEach(x => {
                if (x.marker != null) {
                    x.marker.setMap(null);
                }
            })
        }
    }

    setCurrentSelectedSearchValue(val: google.maps.GeocoderResult, markerSelected: (wr: mapHandler.MarkerWrapper) => void) {
        if (this.currentAirportMarker != null) this.currentAirportMarker.marker.setMap(null);
        this.currentMarkers.forEach(x => x.marker.setMap(null));
        this.currentCircles.forEach(x => x.setMap(null));
        this.currentSelectedSearchValue = val;
        if (val == null) return;
        var kmRadius = 30;
        this.currentCircles = [(mapHandler.drawCircle(val.geometry.location, kmRadius * 1000))];

        var nearbyAirports = mapHandler.GetNearbyAirports(val.geometry.location.lat(), val.geometry.location.lng(), kmRadius);

        this.setDisplayedAirportMarkers(nearbyAirports.map(x => x.airport), markerSelected);
        mapHandler.setBounds(this.currentCircles[0].getBounds());
    }

    setDisplayedAirportMarkers(objs: Airport[], markerSelected: (wr: mapHandler.MarkerWrapper) => void) {

        var wrapped = objs.map(x => {
            var wrap: mapHandler.MarkerWrapper = {
                airport: x,
                marker: new google.maps.Marker({
                    position: {
                        lat: x.Latitude,
                        lng: x.Longitude
                    },
                    title: x.Station,
                    clickable: true
                })
            }
            return wrap;
        });

        mapHandler.drawMarkers(wrapped, x => {
            markerSelected(x);
        });
        this.currentMarkers = wrapped;
    }

    constructor(title: String, type: ActiveRouteType, onValueSelected: (cls: ActiveRouteSelection) => void, onCancel: () => void, stopindex: number) {
        this.title = title;
        this.type = type;
        this.stopIndex = stopindex;
        this.onValueSelected = onValueSelected;

        this.currentMarkers = [];
        this.currentCircles = [];
    }

    clear() {
        this.setCurrentSelectedAirport(null, null);
        this.setCurrentSelectedSearchValue(null, null);
        this.setDisplayedAirportMarkers([], null);
    }
}
