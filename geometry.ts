export interface Geometry {
    results: Result[];
    status:  string;
}

export interface Result {
    address_components: AddressComponent[];
    formatted_address:  string;
    geometry:           GeometryClass;
    place_id:           string;
    types:              string[];
}

export interface AddressComponent {
    long_name:  string;
    short_name: string;
    types:      string[];
}

export interface GeometryClass {
    bounds:        Bounds;
    location:      Location;
    location_type: string;
    viewport:      Bounds;
}

export interface Bounds {
    northeast: Location;
    southwest: Location;
}

export interface Location {
    lat: number;
    lng: number;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toGeometry(json: string): Geometry {
        return cast(JSON.parse(json), r("Geometry"));
    }

    public static geometryToJson(value: Geometry): string {
        return JSON.stringify(uncast(value, r("Geometry")), null, 2);
    }
}

function invalidValue(typ: any, val: any): never {
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`);
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        var map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        var map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        var l = typs.length;
        for (var i = 0; i < l; i++) {
            var typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(typ: any, val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        var result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(typ, val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
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