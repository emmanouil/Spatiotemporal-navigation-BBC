'use strict'
/**
 * This file contains functions used to fetch and parse mpd containing segments
 * Tested with files generated using MP4Box of the GPAC suite (www.gpac.io)
 * 
 * 
 */

//Example MPD Object
function MPD(sourceURL) {
    this.sourceURL = sourceURL;
    this.representations = [];
}
MPD.prototype = {
    get fullDocument() {
        return this.document;
    },
    set fullDocument(document) {
        console.log(document);
        this.document = document;
    },
    get initSegment() {
        return this.init_seg;
    },
    set initSegment(init_seg) {
        this.init_seg = init_seg;
    },
    get representationCount() {
        return this.representations.length;
    }
};

//STARTOF TESTS

//this var holds the MPD Document Element, as set by mpd_parse //TODO remove it
var mpd;

function mpd_test_fetch() {

    //vars used for testing
    var t_initURL, t_rep, t_repAn;


    fetch_promise("segmented/20140325_121238_dash.mpd", 'no-type').then(function (response, mpd) {
        //create MPD Object
        mpd = new MPD("segmented/20140325_121238_dash.mpd");
        //set mpd full text - as fetched
        mpd.fullDocument = mpd_parse(response);
        //get initialization segment url for the first representation
        mpd.initSegment = mpd_getInitSegURL(mpd.fullDocument);
        //get Node for the first representation
        t_rep = mpd_getRepresentationNodeByID(mpd.fullDocument, 1);
        //analyze Node to get representation Attributes
        mpd.representations.push(mpd_getRepresentationByNode(t_rep));
        return (mpd);
    }).then(function (response) {
        mpd = response;
    }).catch(function (err) { console.log(err); });

}


//ENDOF TESTS

/**
 * Get a String of an mpd file (e.g. from the XHR reponse of fetch_promise(url)) and returns the reference
 * @param {String} mpd_string
 * @returns {null} if not found; sets the `mpd` var otherwise
 */
function mpd_parse(mpd_string) {
    var oParser = new DOMParser();
    var oDOM = oParser.parseFromString(mpd_string, "text/xml");
    return oDOM.documentElement;
}

/**
 * Find a representation in an MPD using the representation ID
 * @param {Object} mpd_in mpd document to be scanned for the representation 
 * @param {number} r_id the representation id
 * @returns {Object} a Node with the representation
 */
function mpd_getRepresentationNodeByID(mpd_in, r_id) {
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
 * Parses the attributes and segment info/urls from a representation Node to an Object
 * @param {Object} rep_in representation Node (as returned by mpd_getRepresentationNodeByID)
 * @returns {Object} an object containing the representation attributes
 */
function mpd_getRepresentationByNode(rep_in) {
    var tmp_rep = new Object();
    //get representation properties
    for (var i = 0; i < rep_in.attributes.length; i++) {
        tmp_rep[rep_in.attributes[i].name] = rep_in.attributes[i].value
    }

    //get segment properties (duration, timescale)
    var tmp_seg = rep_in.getElementsByTagName("SegmentList")[0]; //we should have only 1 SegmentList
    tmp_rep['SegmentList'] = new Object();
    for (var i = 0; i < tmp_seg.attributes.length; i++) {
        tmp_rep['SegmentList'][tmp_seg.attributes[i].name] = tmp_seg.attributes[i].value;
    }

    //get segment list
    var tmp_segs = rep_in.getElementsByTagName("SegmentURL")
    tmp_rep['SegmentList']['Segments'] = new Array();
    for (var i = 0; i < tmp_segs.length; i++) {
        tmp_rep['SegmentList']['Segments'][i] = tmp_segs[i].getAttribute("media");
    }

    return tmp_rep;
}


/**
 * Looks for an "Initialization" element inside a Node
 * @param {Object} node_in
 * @returns {String} initialization segment URL
 */
function mpd_getInitSegURL(node_in) {
    var initSegElem = node_in.getElementsByTagName("Initialization");
    if (initSegElem.length > 1) {
        logINFO("More than 1 Initialization URLs found (possibly due to multiple representations), returning the first")
    } else if (initSegElem.length != 1) {
        logERR("Initialization segment URL not found")
        return null;
    }
    return initSegElem[0].getAttribute("sourceURL");
}

/**
 * Returns segment numbers (starting counting at 1 )corresponding to the specified time (in s)
 */
function mpd_getSegmentNumAtTime(representation_in, t_sec) {
    let time_factor = representation_in.SegmentList.duration / representation_in.SegmentList.timescale;
    return Math.round(t_sec / time_factor);
}

/**
 * Returns segment index (starting counting at 0 )corresponding to the specified time (in s)
 */
function mpd_getSegmentIndexAtTime(representation_in, t_sec) {
    return mpd_getSegmentNumAtTime(representation_in, t_sec) - 1;
}