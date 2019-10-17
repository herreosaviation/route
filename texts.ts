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
    showPlaner,
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
            if (index == null || index == 0) return "";
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