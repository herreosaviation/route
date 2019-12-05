define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // Converts JSON strings to/from your types
    // and asserts the results of JSON.parse at runtime
    var Convert = /** @class */ (function () {
        function Convert() {
        }
        Convert.toGeometry = function (json) {
            return cast(JSON.parse(json), r("Geometry"));
        };
        Convert.geometryToJson = function (value) {
            return JSON.stringify(uncast(value, r("Geometry")), null, 2);
        };
        return Convert;
    }());
    exports.Convert = Convert;
    function invalidValue(typ, val) {
        throw Error("Invalid value " + JSON.stringify(val) + " for type " + JSON.stringify(typ));
    }
    function jsonToJSProps(typ) {
        if (typ.jsonToJS === undefined) {
            var map = {};
            typ.props.forEach(function (p) { return map[p.json] = { key: p.js, typ: p.typ }; });
            typ.jsonToJS = map;
        }
        return typ.jsonToJS;
    }
    function jsToJSONProps(typ) {
        if (typ.jsToJSON === undefined) {
            var map = {};
            typ.props.forEach(function (p) { return map[p.js] = { key: p.json, typ: p.typ }; });
            typ.jsToJSON = map;
        }
        return typ.jsToJSON;
    }
    function transform(val, typ, getProps) {
        function transformPrimitive(typ, val) {
            if (typeof typ === typeof val)
                return val;
            return invalidValue(typ, val);
        }
        function transformUnion(typs, val) {
            // val must validate against one typ in typs
            var l = typs.length;
            for (var i = 0; i < l; i++) {
                var typ = typs[i];
                try {
                    return transform(val, typ, getProps);
                }
                catch (_) { }
            }
            return invalidValue(typs, val);
        }
        function transformEnum(cases, val) {
            if (cases.indexOf(val) !== -1)
                return val;
            return invalidValue(cases, val);
        }
        function transformArray(typ, val) {
            // val must be an array with no invalid elements
            if (!Array.isArray(val))
                return invalidValue("array", val);
            return val.map(function (el) { return transform(el, typ, getProps); });
        }
        function transformDate(typ, val) {
            if (val === null) {
                return null;
            }
            var d = new Date(val);
            if (isNaN(d.valueOf())) {
                return invalidValue("Date", val);
            }
            return d;
        }
        function transformObject(props, additional, val) {
            if (val === null || typeof val !== "object" || Array.isArray(val)) {
                return invalidValue("object", val);
            }
            var result = {};
            Object.getOwnPropertyNames(props).forEach(function (key) {
                var prop = props[key];
                var v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
                result[prop.key] = transform(v, prop.typ, getProps);
            });
            Object.getOwnPropertyNames(val).forEach(function (key) {
                if (!Object.prototype.hasOwnProperty.call(props, key)) {
                    result[key] = transform(val[key], additional, getProps);
                }
            });
            return result;
        }
        if (typ === "any")
            return val;
        if (typ === null) {
            if (val === null)
                return val;
            return invalidValue(typ, val);
        }
        if (typ === false)
            return invalidValue(typ, val);
        while (typeof typ === "object" && typ.ref !== undefined) {
            console.log("geometry");
            typ = typeMap[typ.ref];
        }
        if (Array.isArray(typ))
            return transformEnum(typ, val);
        if (typeof typ === "object") {
            return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
                : typ.hasOwnProperty("arrayItems") ? transformArray(typ.arrayItems, val)
                    : typ.hasOwnProperty("props") ? transformObject(getProps(typ), typ.additional, val)
                        : invalidValue(typ, val);
        }
        // Numbers can be parsed by Date but shouldn't be.
        if (typ === Date && typeof val !== "number")
            return transformDate(typ, val);
        return transformPrimitive(typ, val);
    }
    function cast(val, typ) {
        return transform(val, typ, jsonToJSProps);
    }
    function uncast(val, typ) {
        return transform(val, typ, jsToJSONProps);
    }
    function a(typ) {
        return { arrayItems: typ };
    }
    function u() {
        var typs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            typs[_i] = arguments[_i];
        }
        return { unionMembers: typs };
    }
    function o(props, additional) {
        return { props: props, additional: additional };
    }
    function m(additional) {
        return { props: [], additional: additional };
    }
    function r(name) {
        return { ref: name };
    }
    var typeMap = {
        "Geometry": o([
            { json: "results", js: "results", typ: a(r("Result")) },
            { json: "status", js: "status", typ: "" },
        ], false),
        "Result": o([
            { json: "address_components", js: "address_components", typ: a(r("AddressComponent")) },
            { json: "formatted_address", js: "formatted_address", typ: "" },
            { json: "geometry", js: "geometry", typ: r("GeometryClass") },
            { json: "place_id", js: "place_id", typ: "" },
            { json: "types", js: "types", typ: a("") },
        ], false),
        "AddressComponent": o([
            { json: "long_name", js: "long_name", typ: "" },
            { json: "short_name", js: "short_name", typ: "" },
            { json: "types", js: "types", typ: a("") },
        ], false),
        "GeometryClass": o([
            { json: "bounds", js: "bounds", typ: r("Bounds") },
            { json: "location", js: "location", typ: r("Location") },
            { json: "location_type", js: "location_type", typ: "" },
            { json: "viewport", js: "viewport", typ: r("Bounds") },
        ], false),
        "Bounds": o([
            { json: "northeast", js: "northeast", typ: r("Location") },
            { json: "southwest", js: "southwest", typ: r("Location") },
        ], false),
        "Location": o([
            { json: "lat", js: "lat", typ: 3.14 },
            { json: "lng", js: "lng", typ: 3.14 },
        ], false),
    };
});
