export enum Language {
    de, en
}

export var language: Language = Language.de;

export enum Texts {
    selectedCopter,
    startTitle,
    selectStart,
    noStart,
    stopTitle,
    selectStop,
    removeStop,
    attachStop,
    noStop,
    destinationTitle,
    selectDestination,
    noDestination,
    tablePlace,
    tableFlightroute,
    tableFlightTime,
    tableCarRoute,
    tableCarTime,
    tableTimeSaving,
    tableFinal,
    tableCaValuesInfo,
    tableNeededStopsInfo,
    hidePlaner,
    selectorTabAddress,
    selectorTabAirport,
    selectorTabCancel,
    selectorSelect,
    selectorFieldAddress,
    selectorFieldNearbyAirport,
    selectorFieldAirport,
    selectorSelectTitleCountry,
    selectorSelectCountry,
    routeError,
    mailSubject,
    mailHeader,
    mailStart,
    mailStop,
    mailDestination,
    hhmmend
}

export function setAppLanguage(lang: Language) {
    language = lang;
}

export function getText(type: Texts, index: number = null): string {
    var isde = language == Language.de;
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
            return (isde ? "ZWISCHENSTOPP " : " ") + ((index != null && index >= 1) ? index + 1 : "");
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
            if (index == null || index == 0) return "";
            else {
                if (isde) {
                    if (index == 1) {
                        return "Es muss voraussichtlich ein Tankstop durchgeführt werden, für den ca. 45 Minuten eingeplant werden muss";
                    }
                    else {
                        return "Es müssen vorraussichtlich " + index.toString() + " Tankstops durchgeführt werden, für die jeweils ca. 45 Minuten eingeplant werden müssen";
                    }
                }
                else {
                    return "";
                    if (index == 1) {
                        return "Es muss voraussichtlich ein Tankstop durchgeführt werden, für den ca. 45 Minuten eingeplant werden muss";
                    }
                    else {
                        return "Es müssen vorraussichtlich " + index.toString() + " Tankstops durchgeführt werden, für die jeweils ca. 45 Minuten eingeplant werden müssen";
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
            return isde ? "Zwischenstopp " + ((index != null && index > 0 ? index : "")) : "";
        case Texts.mailDestination:
            return isde ? "Ziel" : "";
        case Texts.hhmmend:
            return isde ? "Std." : "Hrs.";
    }
}