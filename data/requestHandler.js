define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var geoCoder;
    var regions = [
        "AT", "BE", "BG", "CY", "CZ", "DK", "DE", "EE", "ES", "FI", "FR", "GB", "GR",
        "HU", "HR", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PO", "PT", "RO", "SE",
        "SI", "SK", "AL", "AD", "AM", "BA", "BY", "CH", "FO", "GE", "GI", "IS", "MC",
        "MK", "NO", "RU", "SM", "TR", "UA", "VA"
    ];
    function searchForLocation(location, success, error) {
        if (geoCoder == null) {
            geoCoder = new google.maps.Geocoder();
        }
        geoCoder.geocode({
            address: location
        }, function (results, status) {
            if (results != null && results.length != 0 && regions.indexOf(getCountry(results[0].address_components)) != -1) {
                console.log(getCountry(results[0].address_components));
                while (results.length > 1) {
                    results.pop();
                }
                success(results);
            }
            else {
                error();
            }
        });
    }
    exports.searchForLocation = searchForLocation;
    function getCountry(addrComponents) {
        for (var i = 0; i < addrComponents.length; i++) {
            if (addrComponents[i].types[0] == "country") {
                return addrComponents[i].short_name;
            }
        }
        return null;
    }
    function performXMLHTTPRequest(address, success, error, method) {
        if (method === void 0) { method = "GET"; }
        var req = new XMLHttpRequest();
        req.open(method, address);
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    success(req.responseText);
                }
                else if (req.status != 0) {
                    error();
                }
            }
        };
        req.send(null);
        return req;
    }
});
//# sourceMappingURL=requestHandler.js.map