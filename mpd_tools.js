'use strict'
/**
 * This file contains functions used to fetch and parse mpd containing segments
 * Tested with files generated using MP4Box of the GPAC suite (www.gpac.io)
 */


//this var holds the MPD Document Element, as set by mpd_parse
var mpd;

function mpd_test() {
    fetch("segmented/20140325_121238_dash.mpd", mpd_parse);
}

/**
 * Get an XHR reponse of the mpd file and puts the reference in the `mpd` var
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

/**
 * Find a representation in an MPD using the representation ID
 * @param {Object} mpd_in mpd document to be scanned for the representation 
 * @param {number} r_id the representation id
 * @returns {Object} a Node with the representation
 */
function mpd_getRepresentationByID(mpd_in, r_id) {
    var tmp_reps = mpd_in.getElementsByTagName("Representation");
    if (tmp_reps === null || typeof tmp_reps === 'undefined' || tmp_reps.length < 1) {
        logERR("The mpd does not contain ANY representations - Aborting")
        return
    }
    var tmp_rep;
    for (var i = 0; i < tmp_reps.length; i++) {
        tmp_rep = tmp_reps[i];
        if (tmp_rep.getAttribute("id") === r_id.toString()) {
            console.log("representation found")
            return tmp_rep
        }
    }
    return null;
}


/**
 * Parses the attributes from a representation Node (as returned by mpd_getRepresentationByID) to an Object
 * @param {Object} rep_in representation Node
 * @returns {Object} an object containing the representation attributes
 */
function mpd_analyzeRepresentation(rep_in) {
    var tmp_rep = new Object();
    for (var i = 0; i < rep_in.attributes.length; i++) {
        tmp_rep[rep_in.attributes[i].name] = rep_in.attributes[i].value
    }
    return tmp_rep;
}


/**
 * Takes as parameter a MPD Document Element and returns the URL of the (first) initialization segment
 * @param {Object} mpd_in MPD Document Element
 * @returns {String} initialization segment URL
 */
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