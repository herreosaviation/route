define(["require", "exports", "./mapHandler"], function (require, exports, mapHandler) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ActiveRouteSelection {
        setCurrentSelectedAirport(airport, markerSelected) {
            if (this.currentAirportMarker != null) {
                this.currentAirportMarker.marker.setMap(null);
            }
            if (airport == null)
                return;
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
            mapHandler.setCenter(new google.maps.LatLng(this.currentAirportMarker.airport.Latitude, this.currentAirportMarker.airport.Longitude));
        }
        setCurrentSelectedSearchValue(val, markerSelected) {
            if (this.currentAirportMarker != null)
                this.currentAirportMarker.marker.setMap(null);
            this.currentMarkers.forEach(x => x.marker.setMap(null));
            this.currentCircles.forEach(x => x.setMap(null));
            this.currentSelectedSearchValue = val;
            if (val == null)
                return;
            var kmRadius = 30;
            this.currentCircles = [(mapHandler.drawCircle(val.geometry.location, kmRadius * 1000))];
            var nearbyAirports = mapHandler.GetNearbyAirports(val.geometry.location.lat(), val.geometry.location.lng(), kmRadius);
            this.setDisplayedAirportMarkers(nearbyAirports.map(x => x.airport), markerSelected);
            mapHandler.setBounds(this.currentCircles[0].getBounds());
        }
        setDisplayedAirportMarkers(objs, markerSelected) {
            var wrapped = objs.map(x => {
                var wrap = {
                    airport: x,
                    marker: new google.maps.Marker({
                        position: {
                            lat: x.Latitude,
                            lng: x.Longitude
                        },
                        title: x.Station,
                        clickable: true
                    })
                };
                return wrap;
            });
            mapHandler.drawMarkers(wrapped, x => {
                markerSelected(x);
            });
            this.currentMarkers = wrapped;
        }
        constructor(title, type, onValueSelected, onCancel) {
            this.title = title;
            this.type = type;
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
    exports.ActiveRouteSelection = ActiveRouteSelection;
});
//# sourceMappingURL=ActiveRouteSelection.js.map