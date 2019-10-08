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
        Texts[Texts["selectorTabAddress"] = 22] = "selectorTabAddress";
        Texts[Texts["selectorTabAirport"] = 23] = "selectorTabAirport";
        Texts[Texts["selectorTabCancel"] = 24] = "selectorTabCancel";
        Texts[Texts["selectorSelect"] = 25] = "selectorSelect";
        Texts[Texts["selectorFieldAddress"] = 26] = "selectorFieldAddress";
        Texts[Texts["selectorFieldNearbyAirport"] = 27] = "selectorFieldNearbyAirport";
        Texts[Texts["selectorFieldAirport"] = 28] = "selectorFieldAirport";
        Texts[Texts["selectorSelectTitleCountry"] = 29] = "selectorSelectTitleCountry";
        Texts[Texts["selectorSelectCountry"] = 30] = "selectorSelectCountry";
        Texts[Texts["routeError"] = 31] = "routeError";
        Texts[Texts["mailSubject"] = 32] = "mailSubject";
        Texts[Texts["mailHeader"] = 33] = "mailHeader";
        Texts[Texts["mailStart"] = 34] = "mailStart";
        Texts[Texts["mailStop"] = 35] = "mailStop";
        Texts[Texts["mailDestination"] = 36] = "mailDestination";
        Texts[Texts["hhmmend"] = 37] = "hhmmend";
    })(Texts = exports.Texts || (exports.Texts = {}));
    function setAppLanguage(lang) {
        exports.language = lang;
    }
    exports.setAppLanguage = setAppLanguage;
    function getText(type, count = null) {
        var isde = exports.language == Language.de;
        switch (type) {
            case Texts.selectedCopter:
                return isde ? "Gewünschter Helikopter" : "";
            case Texts.startTitle:
                return isde ? "START:" : "";
            case Texts.noStart:
                return isde ? "Kein Start ausgewählt" : "";
            case Texts.selectStart:
                return isde ? "Start auswählen" : "";
            case Texts.stopTitle:
                return (isde ? "ZWISCHENSTOPP " : " ") + ((count != null && count > 1) ? count : "");
            case Texts.selectStop:
                return isde ? "Zwischenstopp auswählen" : "";
            case Texts.removeStop:
                return isde ? "entfernen" : "";
            case Texts.attachStop:
                return isde ? "Weiteren Zwischenstopp hinzufügen" : "";
            case Texts.noStop:
                return isde ? "Kein Zwischenstopp ausgewählt" : "";
            case Texts.destinationTitle:
                return isde ? "ZIEL" : "";
            case Texts.selectDestination:
                return isde ? "Ziel auswählen" : "";
            case Texts.noDestination:
                return isde ? "Kein Ziel ausgewählt" : "";
            case Texts.tablePlace:
                return isde ? "Ort" : "";
            case Texts.tableFlightroute:
                return isde ? "Luftlinie" : "";
            case Texts.tableFlightTime:
                return isde ? "Flugzeit" : "";
            case Texts.tableCarRoute:
                return isde ? "Fahrtstrecke" : "";
            case Texts.tableCarTime:
                return isde ? "Fahrtzeit" : "";
            case Texts.tableTimeSaving:
                return isde ? "Zeitersparnis" : "";
            case Texts.tableFinal:
                return isde ? "Gesamt" : "";
            case Texts.tableCaValuesInfo:
                return isde ? "Die angezeigten Werte sind Richtwerte. Schwankungen, bspw. aufgrund der aktuellen Wetterlage, können auftreten" : "";
            case Texts.tableNeededStopsInfo:
                if (count == null || count == 0)
                    return "";
                else {
                    if (isde) {
                        if (count == 1) {
                            return "Es muss voraussichtlich ein Tankstop durchgeführt werden, für den ca. 45 Minuten eingeplant werden muss";
                        }
                        else {
                            return "Es müssen vorraussichtlich " + count.toString() + " Tankstops durchgeführt werden, für die jeweils ca. 45 Minuten eingeplant werden müssen";
                        }
                    }
                    else {
                        return "";
                        if (count == 1) {
                            return "Es muss voraussichtlich ein Tankstop durchgeführt werden, für den ca. 45 Minuten eingeplant werden muss";
                        }
                        else {
                            return "Es müssen vorraussichtlich " + count.toString() + " Tankstops durchgeführt werden, für die jeweils ca. 45 Minuten eingeplant werden müssen";
                        }
                    }
                }
            case Texts.hidePlaner:
                return isde ? "Flugplaner ausblenden" : "";
            case Texts.selectorTabAddress:
                return isde ? "Aus Addresse wählen" : "";
            case Texts.selectorTabAirport:
                return isde ? "Flugplatz wählen" : "";
            case Texts.selectorTabCancel:
                return isde ? "Abbrechen" : "";
            case Texts.selectorSelect:
                return isde ? "Auswahl übernehmen" : "";
            case Texts.selectorFieldAddress:
                return isde ? "Addresse, Postleitzahl oder Ort eingeben" : "";
            case Texts.selectorFieldNearbyAirport:
                return isde ? "(Optional) Flugplatz in der Nähe wählen" : "";
            case Texts.selectorFieldAirport:
                return isde ? "Flugplatz auswählen" : "";
            case Texts.selectorSelectTitleCountry:
                return isde ? "Land auswählen" : "";
            case Texts.selectorSelectCountry:
                return isde ? "Alle" : "";
            case Texts.routeError:
                return isde ? "Route konnte nicht berechnet werden." : "Could not calculate route.";
            case Texts.mailSubject:
                return isde ? "Anfrage" : "";
            case Texts.mailHeader:
                return isde ? "Hallo, ich hätte gerne weiter Informationen." : "";
            case Texts.mailStart:
                return isde ? "Start" : "";
            case Texts.mailStop:
                return isde ? "Zwischenstopp " + ((count != null && count > 0 ? count : "")) : "";
            case Texts.mailDestination:
                return isde ? "Ziel" : "";
            case Texts.hhmmend:
                return isde ? "Std." : "Hrs.";
        }
    }
    exports.getText = getText;
});
//# sourceMappingURL=texts.js.map