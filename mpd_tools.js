'use strict'
/**
 * This file contains function used to fetch and parse mpd containing segments
 */


//this var holds the MPD Document Element, as set by mpd_parse
var mpd;

function mpd_test() {
    fetch("segmented/20140325_121238_dash.mpd", mpd_parse);
}

/**
 * 
 * @param {XHR response} mpd_resp the XHR response (as returned by fetch)
 * @returns {null} if not found; sets the `mpd` var otherwise
 */
function mpd_parse(mpd_resp) {
    if (!assert_fetch(mpd_resp)) {
        return;
    }
    var mpd_string = mpd_resp.target.response;
    var oParser = new DOMParser();
    var oDOM = oParser.parseFromString(mpd_string, "text/xml");

    mpd = oDOM.documentElement;
}

function mpd_getInitSegURL(mpd_in) {
    var initSegElem = mpd_in.getElementsByTagName("Initialization");
    if (initSegElem.length > 1) {
        logINFO("More than 1 Initialization URLs found (possibly due to multiple representations), returning the first")
    } else if (initSegElem.length != 1) {
        logERR("Initialization segment URL not found")
        return null;
    }
    return initSegElem[0].getAttribute("sourceURL");
}



/*

var oParser = new DOMParser();
var oDOM = oParser.parseFromString(sMyString, "text/xml");
// print the name of the root element or error message
dump(oDOM.documentElement.nodeName == "parsererror" ? "error while parsing" : oDOM.documentElement.nodeName);

// */