"use strict";
var globalSetIndex = [];
var globalMarkerIndex = [];

function logERR(msg) {
    console.log("[ERROR] " + msg);
}

function logNOTE(msg) {
    console.log("[NOTE] " + msg);
}

function logINFO(msg) {
    console.log("[INFO] " + msg);
}

/**
 * Content loading function
 */
function fetch(what, where, resp_type) {
    logINFO("fetching " + what + "   for " + where.name);
    if (what.length < 2) {
        logERR("erroneous request");
    }
    var req = new XMLHttpRequest();
    req.addEventListener("load", where);
    req.open("GET", what);
    if (typeof (resp_type) != 'undefined') {
        req.responseType = resp_type;
    }
    logINFO("fetched " + what + " of type " + resp_type + ", for function " + where.name)
    req.send();
}

function calcBearing(lat1, lng1, lat2, lng2) {
    var y = Math.sin(lat2 - lat1) * Math.cos(lng2);
    var x = Math.cos(lng1) * Math.sin(lng2) -
        Math.sin(lng1) * Math.cos(lng2) * Math.cos(lat2 - lat1);
    var brng = Math.atan2(y, x); //in rad
    var brngDgr = brng / (Math.PI / 180);
    return brngDgr;
}

function calcDistanceBetweenCoords(lat1, lng1, lat2, lng2) {
    var earthRadiusM = 6371000;

    var dLat = degToRad(lat2 - lat1);
    var dLon = degToRad(lng2 - lng1);

    lat1 = degToRad(lat1);
    lat2 = degToRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusM * c;
}

function radToDeg(rad_in) {
    return rad_in / (Math.PI / 180);
}

function degToRad(rad_in) {
    return rad_in * (Math.PI / 180);
}

function getSetByVideoId(id_in) {
    for (let item in globalSetIndex) {
        if (globalSetIndex[item].id === id_in.toString())
            return globalSetIndex[item];
    }
}