define(["require", "exports", "./ActiveRouteSelection", "./copter", "./flights", "./mapHandler", "./requestHandler", "./ResultHandler", "./session", "./convertcsv", "html2canvas"], function (require, exports, ActiveRouteSelection_1, copter_1, flights_1, mapHandler, requestHandler_1, ResultHandler_1, session, convertcsv_1, bla) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // import * as html2canvas from "html2canvas";
    var background = document.getElementById('routeSelectionBackground');
    var dropdownAddress = document.getElementById("dropdownAddress");
    var dropdownNearby = document.getElementById("dropdownNearby");
    var dropdownAirport = document.getElementById("dropdownAirport");
    var selectCountry = document.getElementById("selectCountry");
    var continueButton = document.getElementById("buttonContinue");
    var buttonStart = document.getElementById('buttonSelectStart');
    var buttonStop = document.getElementById('buttonSelectStop');
    var buttonEnd = document.getElementById('buttonSelectEnd');
    var labelStart = document.getElementById('selectedStart');
    var labelStop = document.getElementById('selectedStop');
    var labelEnd = document.getElementById('selectedEnd');
    var copterSelect = document.getElementById('copterSelect');
    var routeSearchBackgroundDiv = document.getElementById('routeSearchBackgroundDiv');
    routeSearchBackgroundDiv.style.height = "0";
    var tabButton1 = document.getElementById("tabButtonAddress");
    var tabButton2 = document.getElementById("tabButtonAirport");
    var clearStopButton = document.getElementById("clearStop");
    var cancelSearchButton = document.getElementById("buttonCancelSearch");
    var inputMail = document.getElementById("inputMail");
    var inputPrint = document.getElementById("inputPrint");
    var inputCall = document.getElementById('inputCall');
    function initilizeUI() {
        tabButton1.addEventListener("click", (e) => tabButtonClicked(e, "address"));
        tabButton2.addEventListener("click", (e) => tabButtonClicked(e, "airport"));
        continueButton.addEventListener('click', (e) => buttonContinueClicked(e));
        buttonStart.addEventListener('click', x => {
            openRouteSelector(x);
        });
        buttonStop.addEventListener('click', x => {
            openRouteSelector(x);
        });
        buttonEnd.addEventListener('click', x => {
            openRouteSelector(x);
        });
        dropdownAddress.addEventListener("input", () => { dropDownTextChanged(event); });
        dropdownAddress.addEventListener("change", () => { dropDownInputSelected(event); });
        dropdownNearby.addEventListener("change", () => { dropDownInputSelected(event); });
        dropdownAirport.addEventListener("change", () => { dropDownInputSelected(event); });
        selectCountry.addEventListener("change", () => { selectCountryDidChange(event); });
        copterSelect.addEventListener('change', () => {
            try {
                var cpt = copterSelect.options[copterSelect.selectedIndex].value;
                var val = JSON.parse(cpt);
                session.setCurrentCopter(val);
                redrawView();
            }
            catch (_a) {
            }
        });
        clearStopButton.addEventListener('click', () => { session.clearStops(); redrawView(); });
        cancelSearchButton.addEventListener('click', () => { removeRouteSearch(false, null); });
        inputMail.addEventListener('click', () => {
            var mailBody = "Hallo, ich hätte gerne weiter Informationen.";
            var route = session.getCurrentRoute();
            route.forEach((x, index) => {
                if (index == 0) {
                    mailBody += `
                    Start: 
                ` + x.getName() + "\n" + x.getLatLng();
                }
                else if (index == route.length - 1) {
                    mailBody += `
                Zwischenstopp: 
            ` + x.getName() + "\n" + x.getLatLng();
                }
                else {
                    mailBody += `
                Ziel: 
            ` + x.getName() + "\n" + x.getLatLng();
                }
            });
            var mailSubject = "Anfrage";
            if (session.currentCopter != null) {
                mailSubject += " " + session.currentCopter.name;
            }
            function sendMail() {
                var link = "mailto:sales@herreos.com"
                    + "?cc="
                    + "&subject=" + escape(mailSubject)
                    + "&body=" + encodeURIComponent(mailBody);
                window.location.href = link;
            }
            sendMail();
        });
        inputPrint.addEventListener('click', () => {
            if (session.getCurrentRoute().length > 1) {
                var image = document.getElementById("mapimg");
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
        prefillCoptersSelect(copter_1.copters);
        prefillCountrySelect(flights_1.data);
        if (copter_1.copters.length > 0) {
            session.setCurrentCopter(copter_1.copters[0]);
        }
        redrawView();
    }
    exports.initilizeUI = initilizeUI;
    function redrawView() {
        if (session.currentStart != null) {
            labelStart.innerHTML = session.currentStart.airportResult != null ? session.currentStart.airportResult.Station : session.currentStart.geoCoderResult.formatted_address;
        }
        else {
            labelStart.innerHTML = "Kein Startpunkt ausgewählt";
        }
        if (session.currentStops.length > 0) {
            labelStop.innerHTML = session.currentStops[0].airportResult != null ? session.currentStops[0].airportResult.Station : session.currentStops[0].geoCoderResult.formatted_address;
            clearStopButton.disabled = false;
        }
        else {
            labelStop.innerHTML = "Kein Zwischenstopp ausgewählt";
            clearStopButton.disabled = true;
        }
        if (session.currentEnd != null) {
            labelEnd.innerHTML = session.currentEnd.airportResult != null ? session.currentEnd.airportResult.Station : session.currentEnd.geoCoderResult.formatted_address;
        }
        else {
            labelEnd.innerHTML = "Kein Ziel ausgewählt";
        }
        var currentRoute = session.getCurrentRoute();
        if (currentRoute.length < 2) {
            return;
        }
        else {
            var cpt = session.currentCopter != null ? session.currentCopter : copter_1.copters[0];
            ResultHandler_1.performRoute(currentRoute, cpt, x => {
                mapHandler.drawCarRoute(x.carDirectionResult);
                mapHandler.drawCopterRoute(x.copterDirections);
                var tbl = getActiveTable();
                if (tbl != null) {
                    tbl.parentNode.removeChild(tbl);
                }
                var wrapper = document.getElementById("wrapper");
                wrapper.appendChild(x.table);
            }, () => {
                alert("Route konnte nicht berechnet werden.");
            });
        }
    }
    function openRouteSelector(event) {
        var sender = event.srcElement;
        selectCountry.value = "Alle";
        var sel = new ActiveRouteSelection_1.ActiveRouteSelection("Start", sender == buttonStart ? session.ActiveRouteType.Start : sender == buttonStop ? session.ActiveRouteType.Middle : session.ActiveRouteType.End, () => {
            session.setCurrentRouteObject();
            redrawView();
        }, () => { alert('mhm'); });
        setActiveRouteSelector(sel);
        removeRouteSearch(true, session.activeRouteSelector.type);
        tabButton1.click();
        routeSearchBackgroundDiv.style.height = "auto";
        routeSearchBackgroundDiv.style.visibility = "visible";
    }
    function setActiveRouteSelector(selector) {
        if (session.activeRouteSelector != null && selector.type == session.activeRouteSelector.type) {
            return;
        }
        session.prepareRouteSelector(selector);
        dropdownNearby.disabled = true;
        dropdownAddress.value = null;
        dropdownNearby.value = null;
        continueButton.disabled = true;
    }
    function removeRouteSearch(moove, to) {
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
            case session.ActiveRouteType.Middle:
                document.getElementById('wrapperStop').appendChild(routeSearchBackgroundDiv);
                break;
            case session.ActiveRouteType.End:
                document.getElementById('wrapperEnd').appendChild(routeSearchBackgroundDiv);
                break;
        }
    }
    function buttonContinueClicked(sender) {
        session.activeRouteSelector.onValueSelected(session.activeRouteSelector);
        removeRouteSearch(false, null);
    }
    function tabButtonClicked(sender, tabid) {
        changeTabContent(sender, tabid);
    }
    var timer;
    function dropDownTextChanged(event) {
        var inputElement = event.srcElement;
        if (timer != null) {
            window.clearTimeout(timer);
        }
        timer = window.setTimeout(() => {
            switch (inputElement) {
                case dropdownAddress:
                    requestHandler_1.searchForLocation(inputElement.value, (response) => {
                        updateAddressDataList(getDataListForInputElement(inputElement), response, inputElement.value);
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
    var countrySelection = null;
    function selectCountryDidChange(event) {
        countrySelection = selectCountry.value == "Alle" ? null : selectCountry.value;
        updateAirportDropdownByCountry(countrySelection);
    }
    function updateAirportDropdownByCountry(country) {
        if (country == null) {
            updateAirportDataList(getDataListForInputElement(dropdownAirport), flights_1.data);
        }
        else {
            updateAirportDataList(getDataListForInputElement(dropdownAirport), flights_1.data.filter(x => {
                return x.Country == country;
            }));
        }
    }
    function dropDownInputSelected(event) {
        var input = event.srcElement;
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
                        var parsedAirport = JSON.parse(item);
                        session.activeRouteSelector.setCurrentSelectedAirport(parsedAirport, x => { });
                        continueButton.disabled = false;
                    }
                    catch (_a) {
                        continueButton.disabled = true;
                    }
                }
                break;
            case dropdownAirport:
                if (dl.options.length > 0) {
                    try {
                        // var item = getDataListForInputElement(input).options[dl.index].;
                        var item = dl.options.namedItem(input.value).getAttribute("data");
                        var parsedAirport = JSON.parse(item);
                        session.activeRouteSelector.setCurrentSelectedAirport(parsedAirport, x => { });
                        continueButton.disabled = false;
                    }
                    catch (_b) {
                        continueButton.disabled = true;
                    }
                }
                break;
        }
    }
    function parseGeolocationFromString(data) {
        var anyjson = JSON.parse(data);
        anyjson.geometry.location = new google.maps.LatLng(anyjson.geometry.location.lat, anyjson.geometry.location.lng);
        return anyjson;
    }
    function getActiveTable() {
        return document.getElementById(ResultHandler_1.tableId);
    }
    function getDataListForInputElement(sender) {
        switch (sender) {
            case dropdownAddress:
                return document.getElementById('listAddress');
            case dropdownNearby:
                return document.getElementById('listNearby');
            case dropdownAirport:
                return document.getElementById('listAirport');
            default:
                return null;
        }
    }
    function updateAddressDataList(dl, options, initial) {
        while (dl.children.length != 0) {
            dl.children[0].remove();
        }
        options.forEach(x => {
            var opt = document.createElement('option');
            opt.value = x.formatted_address;
            opt.textContent = initial;
            opt.setAttribute("data", JSON.stringify(x));
            dl.appendChild(opt);
        });
        console.log(dl.children.length);
    }
    function updateAirportDataList(dl, options) {
        while (dl.children.length != 0) {
            dl.children[0].remove();
        }
        options.forEach(x => {
            var opt = document.createElement('option');
            var name = x.getName();
            opt.value = name;
            opt.setAttribute("name", name);
            opt.setAttribute("data", JSON.stringify(x));
            dl.appendChild(opt);
        });
    }
    function changeTabContent(event, to) {
        var divToUse;
        switch (to) {
            case "address":
                divToUse = document.getElementById('addressTabContent');
                break;
            case "airport":
                divToUse = document.getElementById('airportTabContent');
                updateAirportDataList(getDataListForInputElement(dropdownAirport), flights_1.data);
                break;
            default:
                return;
        }
        var i, tabcontent, tablinks;
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
        event.currentTarget.className += " active";
        continueButton.disabled = true;
        dropdownAddress.value = "";
        dropdownNearby.value = "";
        dropdownAirport.value = "";
        dropdownNearby.disabled = true;
        updateAddressDataList(getDataListForInputElement(dropdownAddress), [], "");
        updateAirportDataList(getDataListForInputElement(dropdownNearby), []);
        session.activeRouteSelector.clear();
    }
    function prefillCoptersSelect(copters) {
        while (copterSelect.children.length > 0) {
            copterSelect.removeChild(copterSelect.children[0]);
        }
        copters.forEach(x => {
            var option = document.createElement('option');
            option.innerHTML = x.name;
            option.value = JSON.stringify(x);
            copterSelect.options.add(option);
        });
    }
    function prefillCountrySelect(airports) {
        while (selectCountry.children.length > 0) {
            selectCountry.removeChild(selectCountry.children[0]);
        }
        var allOption = document.createElement('option');
        var option = document.createElement('option');
        option.innerHTML = "Alle";
        option.value = "Alle";
        selectCountry.options.add(option);
        convertcsv_1.plainCountries.forEach(x => {
            var opt = document.createElement('option');
            opt.innerHTML = x.name;
            opt.value = x.code;
            selectCountry.options.add(opt);
        });
    }
    function fullMap(map) {
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
        div.innerHTML = ishidden ? "Flugplaner einblenden" : "Flugplaner ausblenden";
    });
});
