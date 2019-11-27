define(["require", "exports", "./ActiveRouteSelection", "./copter", "./flights", "./mapHandler", "./requestHandler", "./ResultHandler", "./session", "./convertcsv", "html2canvas", "./texts"], function (require, exports, ActiveRouteSelection_1, copter_1, flights_1, mapHandler, requestHandler_1, ResultHandler_1, session, convertcsv_1, bla, texts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // import * as html2canvas from "html2canvas";
    var StopGroup = /** @class */ (function () {
        function StopGroup() {
        }
        return StopGroup;
    }());
    ;
    var background = document.getElementById('routeSelectionBackground');
    var dropdownAddress = document.getElementById("dropdownAddress");
    var dropdownNearby = document.getElementById("dropdownNearby");
    var dropdownAirport = document.getElementById("dropdownAirport");
    var selectCountry = document.getElementById("selectCountry");
    var continueButton = document.getElementById("buttonContinue");
    var buttonStart = document.getElementById('buttonSelectStart');
    var buttonStop = document.getElementById('buttonSelectStop');
    var buttonEnd = document.getElementById('buttonSelectEnd');
    var buttonAttachStop = document.getElementById('buttonAttachStop');
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
    var wrapperStops = [];
    var inputMail = document.getElementById("inputMail");
    var inputPrint = document.getElementById("inputPrint");
    var inputCall = document.getElementById('inputCall');
    function initilizeUI() {
        var lng = getLanguage();
        setLanguage(lng);
        wrapperStops.push({
            clearButton: clearStopButton,
            outerDiv: document.getElementById("wrapperStop"),
            selectedStopDiv: labelStop,
            selectStopButton: buttonStop,
            headerElement: null
        });
        tabButton1.addEventListener("click", function (e) { return tabButtonClicked(e, "address"); });
        tabButton2.addEventListener("click", function (e) { return tabButtonClicked(e, "airport"); });
        continueButton.addEventListener('click', function (e) { return buttonContinueClicked(e); });
        buttonStart.addEventListener('click', function (x) {
            openRouteSelector(x);
        });
        buttonStop.addEventListener('click', function (x) {
            openRouteSelector(x, wrapperStops[0]);
        });
        buttonEnd.addEventListener('click', function (x) {
            openRouteSelector(x);
        });
        dropdownAddress.addEventListener("input", function () { dropDownTextChanged(event); });
        dropdownAddress.addEventListener("change", function () { dropDownInputSelected(event); });
        dropdownNearby.addEventListener("change", function () { dropDownInputSelected(event); });
        dropdownAirport.addEventListener("change", function () { dropDownInputSelected(event); });
        selectCountry.addEventListener("change", function () { selectCountryDidChange(event); });
        copterSelect.addEventListener('change', function () {
            try {
                var cpt = copterSelect.options[copterSelect.selectedIndex].value;
                var val = JSON.parse(cpt);
                session.setCurrentCopter(val);
                redrawView();
            }
            catch (_a) {
            }
        });
        clearStopButton.addEventListener('click', function () { clearStop(wrapperStops[0]); });
        cancelSearchButton.addEventListener('click', function () { removeRouteSearch(false, null); });
        inputMail.addEventListener('click', function () {
            var mailBody = texts_1.getText(texts_1.Texts.mailHeader);
            var nl = "\n";
            mailBody += nl;
            var route = session.getCurrentRoute();
            route.forEach(function (x, index) {
                if (index == 0) {
                    mailBody += nl;
                    mailBody += texts_1.getText(texts_1.Texts.mailStart);
                    mailBody += nl;
                    mailBody += x.getName();
                    mailBody += nl;
                    mailBody += x.getLatLng();
                }
                else if (index < route.length - 1) {
                    mailBody += nl;
                    mailBody += texts_1.getText(texts_1.Texts.mailStop, index);
                    mailBody += nl;
                    mailBody += x.getName();
                    mailBody += nl;
                    mailBody += x.getLatLng();
                }
                else {
                    mailBody += nl;
                    mailBody += texts_1.getText(texts_1.Texts.mailDestination);
                    mailBody += nl;
                    mailBody += x.getName();
                    mailBody += nl;
                    mailBody += x.getLatLng();
                }
            });
            var mailSubject = texts_1.getText(texts_1.Texts.mailSubject);
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
        inputPrint.addEventListener('click', function () {
            if (session.getCurrentRoute().length > 1) {
                var image = document.getElementById("mapimg");
                bla(document.getElementById("map"), {
                    useCORS: true,
                }).then(function (canvas) {
                    var img = canvas.toDataURL("image/png");
                    var listened = function () {
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
        inputCall.addEventListener('click', function () {
            window.location.href = "tel:+491717137167";
        });
        background.addEventListener('click', function () {
            fullBackground();
        });
        mapHandler.setFullMapAction(function (map) {
            fullMap(map);
        });
        buttonAttachStop.addEventListener("click", function () {
            var newstop = createStopElement();
            var last = wrapperStops[wrapperStops.length - 1];
            wrapperStops.push(newstop);
            insertAfter(newstop.outerDiv, last.outerDiv);
            newstop.clearButton.addEventListener("click", function () {
                clearStop(newstop);
            });
            newstop.selectStopButton.addEventListener("click", function (x) {
                openRouteSelector(x, newstop);
            });
        });
        prefillCoptersSelect(copter_1.copters);
        prefillCountrySelect(flights_1.data);
        if (copter_1.copters.length > 0) {
            session.setCurrentCopter(copter_1.copters[0]);
        }
        redrawView();
    }
    exports.initilizeUI = initilizeUI;
    function clearStop(group) {
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
            labelStart.innerHTML = texts_1.getText(texts_1.Texts.noStart);
            labelStart.classList.remove("HasValue");
        }
        for (var i = 0; i < session.currentStops.length; i++) {
            var cur = session.currentStops[i];
            var corr = wrapperStops[i];
            if (cur == null) {
                if (i == 0) {
                    corr.clearButton.disabled = true;
                }
                corr.selectedStopDiv.innerHTML = texts_1.getText(texts_1.Texts.noStop);
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
            labelEnd.innerHTML = texts_1.getText(texts_1.Texts.noDestination);
            labelEnd.classList.remove("HasValue");
        }
        var currentRoute = session.getCurrentRoute();
        if (currentRoute.length < 2) {
            // return;
        }
        else {
            var cpt = session.currentCopter != null ? session.currentCopter : copter_1.copters[0];
            ResultHandler_1.performRoute(currentRoute, cpt, function (x) {
                mapHandler.drawCarRoute(x.carDirectionResult);
                mapHandler.drawCopterRoute(x.copterDirections);
                var tbl = getActiveTable();
                if (tbl != null) {
                    tbl.parentNode.removeChild(tbl);
                }
                var wrapper = document.getElementById("wrapper");
                wrapper.appendChild(x.table);
            }, function () {
                alert(texts_1.getText(texts_1.Texts.routeError));
            });
        }
        for (var i = 0; i < wrapperStops.length; i++) {
            var header = wrapperStops[i].headerElement;
            if (header != null) {
                header.innerHTML = texts_1.getText(texts_1.Texts.stopTitle, i);
            }
        }
    }
    function openRouteSelector(event, stopGroup) {
        if (stopGroup === void 0) { stopGroup = null; }
        if (session.activeRouteSelector != null) {
            session.activeRouteSelector.removeCurrentmarker();
        }
        var sender = event.srcElement;
        selectCountry.value = texts_1.getText(texts_1.Texts.selectorSelectCountry);
        var sel;
        if (stopGroup == null) {
            var marker;
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
            sel = new ActiveRouteSelection_1.ActiveRouteSelection("Start", sender == buttonStart ? session.ActiveRouteType.Start : session.ActiveRouteType.End, function () {
                if (marker != null) {
                    marker.setMap(null);
                }
                session.setCurrentRouteObject();
                redrawView();
            }, function () { }, null);
        }
        else {
            var currentIndex = wrapperStops.indexOf(stopGroup);
            var marker;
            if (session.currentStops[currentIndex] != null) {
                marker = session.currentStops[currentIndex].marker;
            }
            sel = new ActiveRouteSelection_1.ActiveRouteSelection("Start", session.ActiveRouteType.Stop, function () {
                if (marker != null) {
                    marker.setMap(null);
                }
                session.setCurrentRouteObject();
                redrawView();
            }, function () { }, wrapperStops.indexOf(stopGroup));
        }
        setActiveRouteSelector(sel);
        removeRouteSearch(true, session.activeRouteSelector.type);
        tabButton1.click();
        routeSearchBackgroundDiv.style.height = "auto";
        routeSearchBackgroundDiv.style.visibility = "visible";
    }
    function setActiveRouteSelector(selector) {
        if (session.activeRouteSelector != null && selector.type == session.activeRouteSelector.type && selector.stopIndex == session.activeRouteSelector.stopIndex) {
            return;
        }
        session.prepareRouteSelector(selector);
        dropdownNearby.disabled = true;
        dropdownAddress.value = null;
        dropdownNearby.value = null;
        continueButton.disabled = true;
    }
    function removeRouteSearch(moove, to) {
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
        timer = window.setTimeout(function () {
            switch (inputElement) {
                case dropdownAddress:
                    requestHandler_1.searchForLocation(inputElement.value, function (response) {
                        updateAddressDataList(getDataListForInputElement(inputElement), response, inputElement.value);
                        if (response.length == 1) {
                            var parsed = response[0];
                            dropdownNearby.value = null;
                            session.activeRouteSelector.setCurrentSelectedSearchValue(parsed, function (x) {
                                dropdownNearby.value = x.airport.getName();
                                session.activeRouteSelector.setCurrentSelectedAirport(x.airport, function (y) { });
                            });
                            var datalist = getDataListForInputElement(dropdownNearby);
                            updateAirportDataList(datalist, session.activeRouteSelector.currentMarkers.map(function (x) { return x.airport; }));
                            dropdownNearby.disabled = datalist.options.length == 0;
                            continueButton.disabled = false;
                        }
                    }, function () { return console.log("no results..."); });
                    break;
            }
            window.clearTimeout(timer);
        }, 300);
    }
    var countrySelection = null;
    function selectCountryDidChange(event) {
        countrySelection = selectCountry.value == texts_1.getText(texts_1.Texts.selectorSelectCountry) ? null : selectCountry.value;
        updateAirportDropdownByCountry(countrySelection);
    }
    function updateAirportDropdownByCountry(country) {
        if (country == null) {
            updateAirportDataList(getDataListForInputElement(dropdownAirport), flights_1.data);
        }
        else {
            updateAirportDataList(getDataListForInputElement(dropdownAirport), flights_1.data.filter(function (x) {
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
                    session.activeRouteSelector.setCurrentSelectedSearchValue(parsed, function (x) {
                        dropdownNearby.value = x.airport.getName();
                        session.activeRouteSelector.setCurrentSelectedAirport(x.airport, function (y) { });
                    });
                    var datalist = getDataListForInputElement(dropdownNearby);
                    updateAirportDataList(datalist, session.activeRouteSelector.currentMarkers.map(function (x) { return x.airport; }));
                    dropdownNearby.disabled = datalist.options.length == 0;
                    continueButton.disabled = false;
                }
                break;
            case dropdownNearby:
                if (dl.options.length > 0) {
                    try {
                        var item = dl.options.namedItem(input.value).getAttribute("data");
                        var parsedAirport = JSON.parse(item);
                        session.activeRouteSelector.setCurrentSelectedAirport(parsedAirport, function (x) { });
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
                        session.activeRouteSelector.setCurrentSelectedAirport(parsedAirport, function (x) { });
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
            if (isIE()) {
                dl.children[0] = null;
            }
            else {
                dl.children[0].remove();
            }
        }
        options.forEach(function (x) {
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
            dl.children[0] = null;
        }
        options.forEach(function (x) {
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
        copters.forEach(function (x) {
            var option = document.createElement('option');
            option.innerHTML = x.name;
            option.value = JSON.stringify(x);
            copterSelect.options.add(option);
        });
    }
    function createStopElement() {
        var id = "wrapperStop" + wrapperStops.length;
        var div = document.createElement("div");
        div.id = id;
        var h3 = document.createElement("h3");
        h3.className = "clearFloat";
        h3.innerHTML = texts_1.getText(texts_1.Texts.stopTitle, wrapperStops.length);
        var selectedStopDiv = document.createElement("div");
        selectedStopDiv.id = "selectedStop" + wrapperStops.length;
        selectedStopDiv.className = "btn";
        selectedStopDiv.innerHTML = texts_1.getText(texts_1.Texts.noStop);
        var selectedStopButton = document.createElement("button");
        selectedStopButton.className = "selectButton";
        selectedStopButton.id = "ButtonSelectStop" + wrapperStops.length;
        selectedStopButton.innerHTML = texts_1.getText(texts_1.Texts.selectStop);
        var selectedStopClearButton = document.createElement("button");
        selectedStopClearButton.className = "selectButton";
        selectedStopClearButton.id = "clearStop" + wrapperStops.length;
        selectedStopClearButton.style.marginLeft = "3px";
        selectedStopClearButton.innerHTML = texts_1.getText(texts_1.Texts.removeStop);
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
    function prefillCountrySelect(airports) {
        while (selectCountry.children.length > 0) {
            selectCountry.removeChild(selectCountry.children[0]);
        }
        var allOption = document.createElement('option');
        var option = document.createElement('option');
        option.innerHTML = texts_1.getText(texts_1.Texts.selectorSelectCountry);
        option.value = texts_1.getText(texts_1.Texts.selectorSelectCountry);
        selectCountry.options.add(option);
        convertcsv_1.plainCountries.forEach(function (x) {
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
    div.addEventListener("click", function () {
        ishidden = !ishidden;
        if (ishidden) {
            document.getElementById("wrapper").style.height = "0px";
            document.getElementById("wrapper").style.display = "none";
        }
        else {
            document.getElementById("wrapper").style.height = "auto";
            document.getElementById("wrapper").style.display = "unset";
        }
        div.innerHTML = texts_1.getText(ishidden ? texts_1.Texts.showPlaner : texts_1.Texts.hidePlaner);
    });
    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    function setLanguage(lng) {
        texts_1.setAppLanguage(lng);
        s("copterSelectLabel").innerHTML = texts_1.getText(texts_1.Texts.selectedCopter);
        s("headerStart").innerHTML = texts_1.getText(texts_1.Texts.startTitle);
        s("selectedStart").innerHTML = texts_1.getText(texts_1.Texts.noStart);
        s("buttonSelectStart").innerHTML = texts_1.getText(texts_1.Texts.selectStart);
        s("headerStop").innerHTML = texts_1.getText(texts_1.Texts.stopTitle);
        s("selectedStop").innerHTML = texts_1.getText(texts_1.Texts.noStop);
        s("buttonSelectStop").innerHTML = texts_1.getText(texts_1.Texts.selectStop);
        s("clearStop").innerHTML = texts_1.getText(texts_1.Texts.removeStop);
        s("buttonAttachStop").innerHTML = texts_1.getText(texts_1.Texts.attachStop);
        s("destinationTitle").innerHTML = texts_1.getText(texts_1.Texts.destinationTitle);
        s("selectedEnd").innerHTML = texts_1.getText(texts_1.Texts.noDestination);
        s("buttonSelectEnd").innerHTML = texts_1.getText(texts_1.Texts.selectDestination);
        s("ausblenden").innerHTML = texts_1.getText(texts_1.Texts.hidePlaner);
        s("tabButtonAddress").innerHTML = texts_1.getText(texts_1.Texts.selectorTabAddress);
        s("tabButtonAirport").innerHTML = texts_1.getText(texts_1.Texts.selectorTabAirport);
        s("buttonCancelSearch").innerHTML = texts_1.getText(texts_1.Texts.selectorTabCancel);
        i("dropdownAddress").placeholder = texts_1.getText(texts_1.Texts.selectorFieldAddress);
        i("dropdownNearby").placeholder = texts_1.getText(texts_1.Texts.selectorFieldNearbyAirport);
        i("dropdownAirport").placeholder = texts_1.getText(texts_1.Texts.selectorFieldAirport);
        s("buttonContinue").innerHTML = texts_1.getText(texts_1.Texts.selectorSelect);
        s("labelSelectCountry").innerHTML = texts_1.getText(texts_1.Texts.selectorSelectTitleCountry);
    }
    function s(id) {
        return document.getElementById(id);
    }
    function i(id) {
        return document.getElementById(id);
    }
    function getLanguage() {
        // var url = new URL(window.location.href);
        // var parsed = new URLSearchParams(url.search);
        // url
        // var found = Language.en;
        // var param: string = parsed.get("ln");
        // var num = Language[param];
        var param = window.location.href.split("ln=");
        if (param.length > 0) {
            var last = param[1];
            var casted = texts_1.Language[last];
            return casted;
        }
        return texts_1.Language.de;
    }
    function isIE() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");
        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
            return true;
        }
        else {
            return false;
        }
        return false;
    }
});
//# sourceMappingURL=uihandler.js.map