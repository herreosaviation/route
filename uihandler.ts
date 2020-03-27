import { ActiveRouteSelection } from "./ActiveRouteSelection";
import { Copter, copters } from "./copter";
import { Airport, data } from "./flights";
import * as mapHandler from './mapHandler';
import { searchForLocation } from "./requestHandler";
import { performRoute, tableId } from "./ResultHandler";
import * as session from './session';
import { plainCountries } from "./convertcsv";
import * as bla from 'html2canvas';
import { Language, getText, Texts, setAppLanguage, language } from "./texts";
// import * as html2canvas from "html2canvas";

class StopGroup {
    outerDiv: HTMLDivElement;
    clearButton: HTMLButtonElement;
    selectedStopDiv: HTMLDivElement;
    selectStopButton: HTMLButtonElement;
    headerElement: HTMLHeadingElement;
};

var background = document.getElementById('routeSelectionBackground');
var dropdownAddress = <HTMLInputElement>document.getElementById("dropdownAddress");
var dropdownNearby = <HTMLInputElement>document.getElementById("dropdownNearby");
var dropdownAirport = <HTMLInputElement>document.getElementById("dropdownAirport");
var selectCountry = <HTMLSelectElement>document.getElementById("selectCountry");

var continueButton = <HTMLButtonElement>document.getElementById("buttonContinue");
var buttonStart = <HTMLButtonElement>document.getElementById('buttonSelectStart');
var buttonStop = <HTMLButtonElement>document.getElementById('buttonSelectStop');
var buttonEnd = <HTMLButtonElement>document.getElementById('buttonSelectEnd');
var buttonAttachStop = <HTMLButtonElement>document.getElementById('buttonAttachStop');
var labelStart = <HTMLDivElement>document.getElementById('selectedStart');
var labelStop = <HTMLDivElement>document.getElementById('selectedStop');
var labelEnd = <HTMLDivElement>document.getElementById('selectedEnd');
var copterSelect = <HTMLSelectElement>document.getElementById('copterSelect');
var routeSearchBackgroundDiv = <HTMLDivElement>document.getElementById('routeSearchBackgroundDiv');
routeSearchBackgroundDiv.style.height = "0";
var tabButton1 = document.getElementById("tabButtonAddress");
var tabButton2 = document.getElementById("tabButtonAirport");


var clearStopButton = <HTMLButtonElement>document.getElementById("clearStop");
var cancelSearchButton = document.getElementById("buttonCancelSearch");

var wrapperStops: StopGroup[] = [];

var inputMail = <HTMLInputElement>document.getElementById("inputMail");
var inputPrint = <HTMLInputElement>document.getElementById("inputPrint");
var inputCall = <HTMLInputElement>document.getElementById('inputCall');

export function initilizeUI() {
    var lng = getLanguage();
    setLanguage(lng);

    wrapperStops.push({
        clearButton: clearStopButton,
        outerDiv: <HTMLDivElement>document.getElementById("wrapperStop"),
        selectedStopDiv: labelStop,
        selectStopButton: buttonStop,
        headerElement: null
    });

    tabButton1.addEventListener("click", (e: MouseEvent) => tabButtonClicked(e, "address"));
    tabButton2.addEventListener("click", (e: MouseEvent) => tabButtonClicked(e, "airport"));

    continueButton.addEventListener('click', (e: MouseEvent) => buttonContinueClicked(e));
    buttonStart.addEventListener('click', x => {
        openRouteSelector(x);
    })
    buttonStop.addEventListener('click', x => {
        openRouteSelector(x, wrapperStops[0]);
    })
    buttonEnd.addEventListener('click', x => {
        openRouteSelector(x);
    })

    dropdownAddress.addEventListener("input", () => { dropDownTextChanged(event) });
    dropdownAddress.addEventListener("change", () => { dropDownInputSelected(event) });
    dropdownNearby.addEventListener("change", () => { dropDownInputSelected(event) });
    dropdownAirport.addEventListener("change", () => { dropDownInputSelected(event) });
    selectCountry.addEventListener("change", () => { selectCountryDidChange(event) });
    copterSelect.addEventListener('change', () => {
        try {
            var cpt = copterSelect.options[copterSelect.selectedIndex].value;
            var val = <Copter>JSON.parse(cpt);
            session.setCurrentCopter(val);
            redrawView();
        }
        catch{

        }
    });

    clearStopButton.addEventListener('click', () => { clearStop(wrapperStops[0]); });
    cancelSearchButton.addEventListener('click', () => { removeRouteSearch(false, null) });

    inputMail.addEventListener('click', () => {
        var mailBody = getText(Texts.mailHeader);
        var nl = "\n";
        mailBody += nl;
        var route = session.getCurrentRoute();

        route.forEach((x, index) => {
            if (index == 0) {
                mailBody += nl;
                mailBody += getText(Texts.mailStart);
                mailBody += nl;
                mailBody += x.getName();
                mailBody += nl;
                mailBody += x.getLatLng();
            }
            else if (index < route.length - 1) {
                mailBody += nl;
                mailBody += getText(Texts.mailStop, index);
                mailBody += nl;
                mailBody += x.getName();
                mailBody += nl;
                mailBody += x.getLatLng();
            }
            else {
                mailBody += nl;
                mailBody += getText(Texts.mailDestination);
                mailBody += nl;
                mailBody += x.getName();
                mailBody += nl;
                mailBody += x.getLatLng();
            }

            mailBody += nl;
        });

        var mailSubject = getText(Texts.mailSubject);
        if (session.currentCopter != null) {
            mailSubject += " " + session.currentCopter.name;
        }

        function sendMail() {
            var link = "mailto:sales@herreos.com"
                + "?cc="
                + "&subject=" + escape(mailSubject)
                + "&body=" + encodeURIComponent(mailBody)
                ;

            window.location.href = link;
        }

        sendMail();

    });

    inputPrint.addEventListener('click', () => {
        if (session.getCurrentRoute().length > 1) {
            var image = <HTMLImageElement>document.getElementById("mapimg");
            bla(document.getElementById("map"), {
                useCORS: true,
            }).then(canvas => {
                var img = canvas.toDataURL("image/png");
                var listened = () => {
                    window.print();
                    image.removeEventListener("load", listened);
                };
                image.addEventListener("load", listened);
                image.src = img;
                // var url = canvas.toDataURL("image/jpeg");

                // img.src = url;
            });

        }
        else {
            alert("Keine Route zum Drucken ausgewählt");
        }
    });

    inputCall.addEventListener('click', () => {
        window.location.href = "tel:+491717137167";
    });

    background.addEventListener('click', () => {
        fullBackground();
    });

    mapHandler.setFullMapAction((map) => {
        fullMap(map);
    });

    buttonAttachStop.addEventListener("click", () => {
        var newstop = createStopElement();

        var last = wrapperStops[wrapperStops.length - 1];
        wrapperStops.push(newstop);
        insertAfter(newstop.outerDiv, last.outerDiv);
        newstop.clearButton.addEventListener("click", () => {
            clearStop(newstop);
        });

        newstop.selectStopButton.addEventListener("click", x => {
            openRouteSelector(x, newstop);
        });
    });

    prefillCoptersSelect(copters);
    prefillCountrySelect(data);
    if (copters.length > 0) {
        session.setCurrentCopter(copters[0]);
    }
    redrawView();
}

function clearStop(group: StopGroup) {
    var index = wrapperStops.indexOf(group);
    if (index == 0) {
        session.clearStops(0);
    }
    else {
        session.removeStop(index);
        group.outerDiv.parentNode.removeChild(group.outerDiv);
        wrapperStops.splice(index, 1);
    }

    redrawView();
}

function redrawView() {
    if (session.currentStart != null) {
        labelStart.innerHTML = session.currentStart.airportResult != null ? session.currentStart.airportResult.Station : session.currentStart.geoCoderResult.formatted_address;
        labelStart.classList.add("HasValue");
    }
    else {
        labelStart.innerHTML = getText(Texts.noStart);
        labelStart.classList.remove("HasValue");
    }
    for (var i = 0; i < session.currentStops.length; i++) {
        var cur = session.currentStops[i];
        var corr = wrapperStops[i];
        if (cur == null) {
            if (i == 0) {
                corr.clearButton.disabled = true;
            }
            corr.selectedStopDiv.innerHTML = getText(Texts.noStop);
            corr.selectedStopDiv.classList.remove("HasValue");
        }
        else {
            if (i == 0) {
                corr.clearButton.disabled = false;
            }
            corr.selectedStopDiv.innerHTML = cur.airportResult != null ? cur.airportResult.Station : cur.geoCoderResult.formatted_address;
            corr.selectedStopDiv.classList.add("HasValue");
        }
    }
    if (session.currentEnd != null) {
        labelEnd.innerHTML = session.currentEnd.airportResult != null ? session.currentEnd.airportResult.Station : session.currentEnd.geoCoderResult.formatted_address;
        labelEnd.classList.add("HasValue");
    }
    else {
        labelEnd.innerHTML = getText(Texts.noDestination);
        labelEnd.classList.remove("HasValue");
    }

    var currentRoute = session.getCurrentRoute();

    if (currentRoute.length < 2) {
        // return;
    }
    else {
        var cpt = session.currentCopter != null ? session.currentCopter : copters[0];
        performRoute(currentRoute, cpt, x => {
            mapHandler.drawCarRoute(x.carDirectionResult);
            mapHandler.drawCopterRoute(x.copterDirections);
            var tbl = getActiveTable();
            if (tbl != null) {
                tbl.parentNode.removeChild(tbl);
            }

            var wrapper = document.getElementById("wrapper");
            wrapper.appendChild(x.table);
        }, () => {
            alert(getText(Texts.routeError));
        });
    }

    for (var i = 0; i < wrapperStops.length; i++) {
        var header = wrapperStops[i].headerElement;
        if (header != null) {
            header.innerHTML = getText(Texts.stopTitle, i);
        }
    }
}

function openRouteSelector(event: MouseEvent, stopGroup: StopGroup = null) {
    if (session.activeRouteSelector != null) {
        session.activeRouteSelector.removeCurrentmarker();
    }

    var sender = event.srcElement;
    selectCountry.value = getText(Texts.selectorSelectCountry);
    var sel: ActiveRouteSelection;
    if (stopGroup == null) {
        var marker: google.maps.Marker;
        if (sender == buttonStart) {
            if (session.currentStart != null) {
                marker = session.currentStart.marker;
            }
        }
        else {
            if (session.currentEnd != null) {
                marker = session.currentEnd.marker;
            }
        }

        sel = new ActiveRouteSelection("Start",
            sender == buttonStart ? session.ActiveRouteType.Start : session.ActiveRouteType.End,
            () => {
                if (marker != null) {
                    marker.setMap(null);
                }
                session.setCurrentRouteObject();
                redrawView();
            },
            () => { }, null)
    }
    else {
        var currentIndex = wrapperStops.indexOf(stopGroup);
        var marker: google.maps.Marker;
        if (session.currentStops[currentIndex] != null) {
            marker = session.currentStops[currentIndex].marker;
        }
        sel = new ActiveRouteSelection("Start", session.ActiveRouteType.Stop, () => {
            if (marker != null) {
                marker.setMap(null);
            }
            session.setCurrentRouteObject();
            redrawView();
        }, () => { }, wrapperStops.indexOf(stopGroup));
    }

    setActiveRouteSelector(sel);

    removeRouteSearch(true, session.activeRouteSelector.type);
    tabButton1.click();

    routeSearchBackgroundDiv.style.height = "auto";
    routeSearchBackgroundDiv.style.visibility = "visible";
}

function setActiveRouteSelector(selector: ActiveRouteSelection) {
    if (session.activeRouteSelector != null && selector.type == session.activeRouteSelector.type && selector.stopIndex == session.activeRouteSelector.stopIndex) {
        return;
    }

    session.prepareRouteSelector(selector);
    dropdownNearby.disabled = true;
    dropdownAddress.value = null;
    dropdownNearby.value = null;
    continueButton.disabled = true;
}

function removeRouteSearch(moove: Boolean, to: session.ActiveRouteType) {

    if (session.activeRouteSelector != null) {
        session.activeRouteSelector.removeCurrentmarker();
    }

    if (routeSearchBackgroundDiv.parentNode != null) {
        routeSearchBackgroundDiv.parentNode.removeChild(routeSearchBackgroundDiv);
    }
    if (!moove) {
        return;
    }

    switch (to) {
        case session.ActiveRouteType.Start:
            document.getElementById('wrapperStart').appendChild(routeSearchBackgroundDiv);
            break;
        case session.ActiveRouteType.Stop:
            var index = session.activeRouteSelector.stopIndex;

            wrapperStops[index].outerDiv.appendChild(routeSearchBackgroundDiv);
            break;
        case session.ActiveRouteType.End:
            document.getElementById('wrapperEnd').appendChild(routeSearchBackgroundDiv);
            break;
    }
}

function buttonContinueClicked(sender: MouseEvent) {
    session.activeRouteSelector.onValueSelected(session.activeRouteSelector);
    removeRouteSearch(false, null);
}

function tabButtonClicked(sender: MouseEvent, tabid: String) {
    changeTabContent(sender, tabid);
}

var timer: number;
function dropDownTextChanged(event: Event) {
    var inputElement = <HTMLInputElement>event.srcElement;
    if (timer != null) {
        window.clearTimeout(timer);
    }
    timer = window.setTimeout(() => {
        switch (inputElement) {
            case dropdownAddress:
                searchForLocation(inputElement.value, (response) => {
                    updateAddressDataList(getDataListForInputElement(inputElement), response, inputElement.value)
                    if (response.length == 1) {
                        var parsed = response[0];
                        dropdownNearby.value = null;
                        session.activeRouteSelector.setCurrentSelectedSearchValue(parsed, x => {
                            dropdownNearby.value = x.airport.getName();
                            session.activeRouteSelector.setCurrentSelectedAirport(x.airport, y => { });
                        });

                        var datalist = getDataListForInputElement(dropdownNearby);
                        updateAirportDataList(datalist, session.activeRouteSelector.currentMarkers.map(x => x.airport));
                        dropdownNearby.disabled = datalist.options.length == 0;

                        continueButton.disabled = false;

                    }
                }, () => console.log("no results..."));
                break;
        }
        window.clearTimeout(timer);
    }, 300);
}


var countrySelection: string = null;
function selectCountryDidChange(event: Event) {
    countrySelection = selectCountry.value == getText(Texts.selectorSelectCountry) ? null : selectCountry.value;
    updateAirportDropdownByCountry(countrySelection);
}

function updateAirportDropdownByCountry(country: string) {
    if (country == null) {
        updateAirportDataList(getDataListForInputElement(dropdownAirport), data);
    }
    else {
        updateAirportDataList(getDataListForInputElement(dropdownAirport), data.filter(x => {
            return x.Country == country;
        }));
    }
}

function dropDownInputSelected(event: Event) {
    var input = <HTMLInputElement>event.srcElement;
    var dl = getDataListForInputElement(input);

    switch (input) {
        case dropdownAddress:
            if (dl.options.length > 0) {
                var item = getDataListForInputElement(input).options[0].getAttribute("data");
                var parsed = parseGeolocationFromString(item);
                dropdownNearby.value = null;
                session.activeRouteSelector.setCurrentSelectedSearchValue(parsed, x => {
                    dropdownNearby.value = x.airport.getName();
                    session.activeRouteSelector.setCurrentSelectedAirport(x.airport, y => { });
                });

                var datalist = getDataListForInputElement(dropdownNearby);
                updateAirportDataList(datalist, session.activeRouteSelector.currentMarkers.map(x => x.airport));
                dropdownNearby.disabled = datalist.options.length == 0;

                continueButton.disabled = false;
            }
            break;
        case dropdownNearby:
            if (dl.options.length > 0) {
                try {
                    var item = dl.options.namedItem(input.value).getAttribute("data");
                    var parsedAirport = <Airport>JSON.parse(item);
                    session.activeRouteSelector.setCurrentSelectedAirport(parsedAirport, x => { });
                    continueButton.disabled = false;
                }
                catch{
                    continueButton.disabled = true;
                }
            }
            break;
        case dropdownAirport:
            if (dl.options.length > 0) {
                try {
                    // var item = getDataListForInputElement(input).options[dl.index].;
                    var item = dl.options.namedItem(input.value).getAttribute("data");
                    var parsedAirport = <Airport>JSON.parse(item);
                    session.activeRouteSelector.setCurrentSelectedAirport(parsedAirport, x => { });
                    continueButton.disabled = false;
                }
                catch{
                    continueButton.disabled = true;
                }
            }
            break;
    }
}

function parseGeolocationFromString(data: string): google.maps.GeocoderResult {
    var anyjson = JSON.parse(data);
    anyjson.geometry.location = new google.maps.LatLng(anyjson.geometry.location.lat, anyjson.geometry.location.lng);
    return <google.maps.GeocoderResult>anyjson;
}

function getActiveTable(): HTMLTableElement {
    return <HTMLTableElement>document.getElementById(tableId);
}

function getDataListForInputElement(sender: HTMLInputElement): HTMLDataListElement {
    switch (sender) {
        case dropdownAddress:
            return <HTMLDataListElement>document.getElementById('listAddress');
        case dropdownNearby:
            return <HTMLDataListElement>document.getElementById('listNearby');
        case dropdownAirport:
            return <HTMLDataListElement>document.getElementById('listAirport');
        default:
            return null;
    }
}

function updateAddressDataList(dl: HTMLDataListElement, options: google.maps.GeocoderResult[], initial: string) {
    while (dl.children.length != 0) {
        dl.children[0].remove();
    }
    options.forEach(x => {
        var opt = <HTMLOptionElement>document.createElement('option');
        opt.value = x.formatted_address;
        opt.textContent = initial;
        opt.setAttribute("data", JSON.stringify(x));
        dl.appendChild(opt);
    });
    console.log(dl.children.length);
}

function updateAirportDataList(dl: HTMLDataListElement, options: Airport[]) {
    while (dl.children.length != 0) {
        dl.children[0].remove();
    }
    options.forEach(x => {
        var opt = <HTMLOptionElement>document.createElement('option');
        var name = x.getName();
        opt.value = name;
        opt.setAttribute("name", name);
        opt.setAttribute("data", JSON.stringify(x));
        dl.appendChild(opt);
    });
}


function changeTabContent(event: MouseEvent, to: String) {

    var divToUse: HTMLElement
    switch (to) {
        case "address":
            divToUse = document.getElementById('addressTabContent');
            break;
        case "airport":
            divToUse = document.getElementById('airportTabContent');
            updateAirportDataList(getDataListForInputElement(dropdownAirport), data);
            break;
        default:
            return;
    }

    var i: number, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    divToUse.style.display = "block";
    (<HTMLElement>event.currentTarget).className += " active";

    continueButton.disabled = true;
    dropdownAddress.value = "";
    dropdownNearby.value = "";
    dropdownAirport.value = "";
    dropdownNearby.disabled = true;
    updateAddressDataList(getDataListForInputElement(dropdownAddress), [], "");
    updateAirportDataList(getDataListForInputElement(dropdownNearby), []);

    session.activeRouteSelector.clear();
}

function prefillCoptersSelect(copters: Copter[]) {
    while (copterSelect.children.length > 0) {
        copterSelect.removeChild(copterSelect.children[0]);
    }

    copters.forEach(x => {
        var option = document.createElement('option');
        option.innerHTML = x.name;
        option.value = JSON.stringify(x);
        copterSelect.options.add(option);
    })
}

function createStopElement(): StopGroup {

    var id = "wrapperStop" + wrapperStops.length;
    var div = document.createElement("div");
    div.id = id;

    var h3 = document.createElement("h3");
    h3.className = "clearFloat";
    h3.innerHTML = getText(Texts.stopTitle, wrapperStops.length);

    var selectedStopDiv = document.createElement("div");
    selectedStopDiv.id = "selectedStop" + wrapperStops.length;
    selectedStopDiv.className = "btn";
    selectedStopDiv.innerHTML = getText(Texts.noStop);

    var selectedStopButton = document.createElement("button");
    selectedStopButton.className = "selectButton";
    selectedStopButton.id = "ButtonSelectStop" + wrapperStops.length;
    selectedStopButton.innerHTML = getText(Texts.selectStop);

    var selectedStopClearButton = document.createElement("button");
    selectedStopClearButton.className = "selectButton";
    selectedStopClearButton.id = "clearStop" + wrapperStops.length;
    selectedStopClearButton.style.marginLeft = "3px";
    selectedStopClearButton.innerHTML = getText(Texts.removeStop);

    div.appendChild(h3);
    div.appendChild(selectedStopDiv);
    div.appendChild(selectedStopButton);
    div.appendChild(selectedStopClearButton);

    return {
        clearButton: selectedStopClearButton,
        outerDiv: div,
        selectedStopDiv: selectedStopDiv,
        selectStopButton: selectedStopButton,
        headerElement: h3
    };
}

function prefillCountrySelect(airports: Airport[]) {
    while (selectCountry.children.length > 0) {
        selectCountry.removeChild(selectCountry.children[0]);
    }

    var allOption = document.createElement('option');
    var option = document.createElement('option');
    option.innerHTML = getText(Texts.selectorSelectCountry);
    option.value = getText(Texts.selectorSelectCountry);
    selectCountry.options.add(option);
    plainCountries.forEach(x => {
        var opt = document.createElement('option');
        opt.innerHTML = x.name;
        opt.value = x.code;
        selectCountry.options.add(opt);
    });
}

function fullMap(map: google.maps.Map) {
    background.className = "hiddenIfDesktop";
}

function fullBackground() {
    background.className = "";
}

var ishidden = false;
var div = document.getElementById("ausblenden");
div.addEventListener("click", () => {
    ishidden = !ishidden;
    if (ishidden) {
        document.getElementById("wrapper").style.height = "0px";
        document.getElementById("wrapper").style.display = "none";
    }
    else {
        document.getElementById("wrapper").style.height = "auto";
        document.getElementById("wrapper").style.display = "unset";
    }
    div.innerHTML = getText(ishidden ? Texts.showPlaner : Texts.hidePlaner);
});

function insertAfter(newNode: HTMLElement, referenceNode: HTMLElement) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function setLanguage(lng: Language) {
    setAppLanguage(lng);
    s("copterSelectLabel").innerHTML = getText(Texts.selectedCopter);
    s("headerStart").innerHTML = getText(Texts.startTitle);
    s("selectedStart").innerHTML = getText(Texts.noStart);
    s("buttonSelectStart").innerHTML = getText(Texts.selectStart);
    s("headerStop").innerHTML = getText(Texts.stopTitle);
    s("selectedStop").innerHTML = getText(Texts.noStop);
    s("buttonSelectStop").innerHTML = getText(Texts.selectStop);
    s("clearStop").innerHTML = getText(Texts.removeStop);
    s("buttonAttachStop").innerHTML = getText(Texts.attachStop);
    s("destinationTitle").innerHTML = getText(Texts.destinationTitle);
    s("selectedEnd").innerHTML = getText(Texts.noDestination);
    s("buttonSelectEnd").innerHTML = getText(Texts.selectDestination);
    s("ausblenden").innerHTML = getText(Texts.hidePlaner);

    s("tabButtonAddress").innerHTML = getText(Texts.selectorTabAddress);
    s("tabButtonAirport").innerHTML = getText(Texts.selectorTabAirport);
    s("buttonCancelSearch").innerHTML = getText(Texts.selectorTabCancel);

    i("dropdownAddress").placeholder = getText(Texts.selectorFieldAddress);
    i("dropdownNearby").placeholder = getText(Texts.selectorFieldNearbyAirport);
    i("dropdownAirport").placeholder = getText(Texts.selectorFieldAirport);

    s("buttonContinue").innerHTML = getText(Texts.selectorSelect);
    s("labelSelectCountry").innerHTML = getText(Texts.selectorSelectTitleCountry);
}

function s(id: string): HTMLElement {
    return document.getElementById(id);
}

function i(id: string): HTMLInputElement {
    return <HTMLInputElement>document.getElementById(id);
}

function getLanguage(): Language {
    var url = new URL(window.location.href);
    var parsed = new URLSearchParams(url.search);
    var found = Language.en;
    var param: string = parsed.get("ln");
    var num = Language[param];
    if (num != null) {
        switch (num) {
            case Language.de:
                found = Language.de;
                break;
            case Language.en:
                found = Language.en;
                break;
        }
    }

    return found;
}