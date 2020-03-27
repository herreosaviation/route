define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Language;
    (function (Language) {
        Language[Language["de"] = 0] = "de";
        Language[Language["en"] = 1] = "en";
    })(Language = exports.Language || (exports.Language = {}));
    exports.language = Language.de;
    var Texts;
    (function (Texts) {
        Texts[Texts["selectedCopter"] = 0] = "selectedCopter";
        Texts[Texts["startTitle"] = 1] = "startTitle";
        Texts[Texts["selectStart"] = 2] = "selectStart";
        Texts[Texts["noStart"] = 3] = "noStart";
        Texts[Texts["stopTitle"] = 4] = "stopTitle";
        Texts[Texts["selectStop"] = 5] = "selectStop";
        Texts[Texts["removeStop"] = 6] = "removeStop";
        Texts[Texts["attachStop"] = 7] = "attachStop";
        Texts[Texts["noStop"] = 8] = "noStop";
        Texts[Texts["destinationTitle"] = 9] = "destinationTitle";
        Texts[Texts["selectDestination"] = 10] = "selectDestination";
        Texts[Texts["noDestination"] = 11] = "noDestination";
        Texts[Texts["tablePlace"] = 12] = "tablePlace";
        Texts[Texts["tableFlightroute"] = 13] = "tableFlightroute";
        Texts[Texts["tableFlightTime"] = 14] = "tableFlightTime";
        Texts[Texts["tableCarRoute"] = 15] = "tableCarRoute";
        Texts[Texts["tableCarTime"] = 16] = "tableCarTime";
        Texts[Texts["tableTimeSaving"] = 17] = "tableTimeSaving";
        Texts[Texts["tableFinal"] = 18] = "tableFinal";
        Texts[Texts["tableCaValuesInfo"] = 19] = "tableCaValuesInfo";
        Texts[Texts["tableNeededStopsInfo"] = 20] = "tableNeededStopsInfo";
        Texts[Texts["hidePlaner"] = 21] = "hidePlaner";
        Texts[Texts["showPlaner"] = 22] = "showPlaner";
        Texts[Texts["selectorTabAddress"] = 23] = "selectorTabAddress";
        Texts[Texts["selectorTabAirport"] = 24] = "selectorTabAirport";
        Texts[Texts["selectorTabCancel"] = 25] = "selectorTabCancel";
        Texts[Texts["selectorSelect"] = 26] = "selectorSelect";
        Texts[Texts["selectorFieldAddress"] = 27] = "selectorFieldAddress";
        Texts[Texts["selectorFieldNearbyAirport"] = 28] = "selectorFieldNearbyAirport";
        Texts[Texts["selectorFieldAirport"] = 29] = "selectorFieldAirport";
        Texts[Texts["selectorSelectTitleCountry"] = 30] = "selectorSelectTitleCountry";
        Texts[Texts["selectorSelectCountry"] = 31] = "selectorSelectCountry";
        Texts[Texts["routeError"] = 32] = "routeError";
        Texts[Texts["mailSubject"] = 33] = "mailSubject";
        Texts[Texts["mailHeader"] = 34] = "mailHeader";
        Texts[Texts["mailStart"] = 35] = "mailStart";
        Texts[Texts["mailStop"] = 36] = "mailStop";
        Texts[Texts["mailDestination"] = 37] = "mailDestination";
        Texts[Texts["hhmmend"] = 38] = "hhmmend";
    })(Texts = exports.Texts || (exports.Texts = {}));
    function setAppLanguage(lang) {
        exports.language = lang;
    }
    exports.setAppLanguage = setAppLanguage;
    function getText(type, index = null) {
        var isde = exports.language == Language.de;
        switch (type) {
            case Texts.selectedCopter:
                return isde ? "Helikopter Typ" : "Helicopter Type";
            case Texts.startTitle:
                return isde ? "Start-Ort" : "Place of Departure";
            case Texts.noStart:
                return isde ? "Kein Start-Ort ausgewählt" : "No place of departure selected";
            case Texts.selectStart:
                return isde ? "Start-Ort auswählen" : "Select place of departure";
            case Texts.stopTitle:
                return (isde ? "Zwischenstopp " : "Intermediate Stop ") + ((index != null && index >= 1) ? index + 1 : "");
            case Texts.selectStop:
                return isde ? "Zwischenstopp auswählen" : "Select intermediate stop";
            case Texts.removeStop:
                return isde ? "Entfernen" : "Clear";
            case Texts.attachStop:
                return isde ? "Weiteren Zwischenstopp hinzufügen" : "Add additional intermediate stop";
            case Texts.noStop:
                return isde ? "Kein Zwischenstopp ausgewählt" : "No intermediate stop selected";
            case Texts.destinationTitle:
                return isde ? "Ziel" : "Destination";
            case Texts.selectDestination:
                return isde ? "Ziel auswählen" : "Select destination";
            case Texts.noDestination:
                return isde ? "Kein Ziel ausgewählt" : "No destination selected";
            case Texts.tablePlace:
                return isde ? "Ort" : "Destination";
            case Texts.tableFlightroute:
                return isde ? "Luftlinie" : "Distance Traveled in Flight";
            case Texts.tableFlightTime:
                return isde ? "Flugzeit" : "Travel Time by Helicopter";
            case Texts.tableCarRoute:
                return isde ? "Fahrtstrecke" : "Distance Traveled by Car";
            case Texts.tableCarTime:
                return isde ? "Fahrtzeit" : "Travel Time by Car";
            case Texts.tableTimeSaving:
                return isde ? "Zeitersparnis" : "Time saved";
            case Texts.tableFinal:
                return isde ? "Gesamt" : "Total";
            case Texts.tableCaValuesInfo:
                return isde ? "Die angegebenen Werte sind Richtwerte. Abweichungen beispielsweise aufgrund der aktuellen Wetterlage können auftreten."
                    : "The displayed values are standard values. Discrepancies may arise, for example due to current weather conditions.";
            case Texts.tableNeededStopsInfo:
                if (index == null || index == 0)
                    return "";
                else {
                    if (isde) {
                        if (index == 1) {
                            return "Es ist voraussichtlich ein Tankstop erforderlich. Für den Tankstop müssen ca. 45 Minuten eingeplant werden. Dies ist in der Reisezeit inbegriffen.";
                        }
                        else {
                            return "Es müssen vorraussichtlich " + index.toString() + " Tankstops durchgeführt werden. Für die Tankstops müssen jeweils ca. 45 Minuten eingeplant werden. Dies ist in der Reisezeit inbegriffen.";
                        }
                    }
                    else {
                        if (index == 1) {
                            return "An intermediate stop for refuelling is expected on this trip. The stop is calculated with 45 Minutes and has been added to your travel time.";
                        }
                        else {
                            return index.toString() + " intermediate stops for refuelling are expected on this trip. The stops are calculated with 45 minutes each and have been added to your traveltime";
                            // return "Es müssen vorraussichtlich " + index.toString() + " Tankstops durchgeführt werden, für die jeweils ca. 45 Minuten eingeplant werden müssen";
                        }
                    }
                }
            case Texts.hidePlaner:
                return isde ? "Flugplaner ausblenden" : "Hide Flightplanner";
            case Texts.showPlaner:
                return isde ? "Flugplaner einblenden" : "Show Flightplanner";
            case Texts.selectorTabAddress:
                return isde ? "Aus Addresse wählen" : "Select from address";
            case Texts.selectorTabAirport:
                return isde ? "Flugplatz wählen" : "Select Airfield";
            case Texts.selectorTabCancel:
                return isde ? "Abbrechen" : "Cancel";
            case Texts.selectorSelect:
                return isde ? "Auswahl übernehmen" : "Apply Selection";
            case Texts.selectorFieldAddress:
                return isde ? "Addresse, Postleitzahl oder Ort eingeben" : "Enter Adress, Zip-Code or Place";
            case Texts.selectorFieldNearbyAirport:
                return isde ? "(Optional) Flugplatz in der Nähe wählen" : "(Optional) Select nearby Airfield";
            case Texts.selectorFieldAirport:
                return isde ? "Flugplatz auswählen" : "Select Airfield";
            case Texts.selectorSelectTitleCountry:
                return isde ? "Land auswählen" : "Select Country";
            case Texts.selectorSelectCountry:
                return isde ? "Alle" : "All";
            case Texts.routeError:
                return isde ? "Route konnte nicht berechnet werden." : "Could not calculate route.";
            case Texts.mailSubject:
                return isde ? "Anfrage" : "";
            case Texts.mailHeader:
                return isde ? `Hallo,

ich hätte gerne weitere Informationen.
` : `Hello,

I'd like to recieve more information.
`;
            case Texts.mailStart:
                return isde ? "Start-Ort" : "Place of Departure";
            case Texts.mailStop:
                return isde ? "Zwischenstopp " + ((index != null && index > 0 ? index : "")) : "Intermediate Stop " + ((index != null && index > 0 ? index : ""));
            case Texts.mailDestination:
                return isde ? "Ziel" : "Destination";
            case Texts.hhmmend:
                return isde ? "Std." : "Hrs.";
        }
    }
    exports.getText = getText;
});
