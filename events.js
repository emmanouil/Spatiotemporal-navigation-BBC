"use strict";
var toggleZoom, zoomLvl, tmpZoom, initiated = false;

function activateMapEvents() {

    map.addListener('zoom_changed', function () {
        tmpZoom = map.getZoom();
        if (!LOCK_ZOOM) {
            current_zoom = tmpZoom;
        }
    });

}

function activateUI() {
    toggleZoom = document.getElementsByName('toggleZoom')[0];
    selector = document.getElementsByName('select')[0];

    toggleZoom.checked = LOCK_ZOOM;

}

//called when file is selected from the dropdown
//arg: selected index
//TODO: update commented out section to match changes
function selectFile(index_in) {
    var loc;
    video.src = selector[index_in].value;
    active_video_id = selector[index_in].text;
    /*
    loc = getSetByVideoId(active_video_id).set[0].Location;
    if (loc) {
        centerMap(loc.Latitude, loc.Longitude);
    } else {
        logERR(selector.selectedIndex + "  not found");
    }
    */
}

function toggleDefaultZoom(e) {
    LOCK_ZOOM = e.checked;
}

function setDefaultZoom(e) {
    DEFAULT_ZOOM = current_zoom = tmpZoom;
}

//called when a marker is clicked
//TODO fix without breaking API (currently only sets video)
function goToVideoAndTime(i_in, time_in) {
    console.log('[WARNING] called depricated function goToVideoAndTime with args ' + i_in + ',  ' + time_in);
    console.log("video with index: " + i_in + " seeking to time " + time_in + "ms");
    selector.selectedIndex = i_in;
    selectFile(i_in);
    video.currentTime = time_in / 1000;
}

/**
 * Called 
 * @param {*} e 
 */
function initTimeAndSpace(e) {
    document.getElementById('init_ts_btn').disabled = true;
    document.getElementById('init_mk_btn').disabled = false;
    loadSpatialData();
    setMainViewStartTime();
}


/**
 * Called when Init Markers button is clicked
 * @param {*} e 
 */
function initMarkers(e) {
    document.getElementById('init_mk_btn').disabled = true;
    document.getElementById('play_btn').disabled = false;
    document.getElementById('play_btn').innerText = 'Go To ' + main_view_startTime + ', and Play';
    logINFO('Initializing markers for reference start time (ms): ' + main_view_startTime);
    document.getElementById('start_time_input').value = main_view_startTime;
    /* Setup main view */
	centerMap(reference_location[0], reference_location[1], 20)
    analyzeGeospatialData();
}

/**
 * Called when GoToAndPlay button is clicked
 * @param {*} e 
 */
function goToAndPlay(e) {
    document.getElementById('play_btn').disabled = true;
    logINFO('starting playback from (ms): ' + main_view_startTime);
    startPlayback();
}