"use strict";
//var globalSetIndex = [];	//in helper.js holds EVERYTHING parsed
//var map;	//in maps.js holds MAP

/**
 * Playlist & File Parameters
 */
var INPUT_DIR = 'parsing';	//holds the video and original files
var PARSER_DIR = 'script_out';	//holds the parser output (location, orientation) jsons
var PLAYLIST_FILE = 'playlist.txt';
var PL_SENSORS_SUFFIX = '_SENSOR_DATA';
var PL_SENSORS_EXTENSION = '.xml';
var PL_VIDEO_SUFFIX = '';
//var PL_VIDEO_EXTENSION = '.mp4';
var PL_VIDEO_EXTENSION = '.webm';
var PL_LOCATION_SUFFIX = '_LOC';
var PL_ORIENTATION_SUFFIX = '_ORIENT';
var PL_DESCRIPTOR_SUFFIX = '_DESCRIPTOR';
var PORT = '8000'
var BASE_URL = '';	//set when parse_playlist is called (e.g. 192.0.0.1:8000)

/**
 * Script Parameters & Objs
 */
var active_video_id = null;
var mediaSource = new MediaSource();	//Not used for now
//var skeleton_worker = new Worker( 'parser.js' );
var selector, video, playlist, items_fetched = 0;

/**
 * Entry point
 */
//after window loads do the init
window.onload = init;

/**
 * Initialize
 */
function init() {
	video = document.getElementById('v');
	initVideo();	//in video.js
	mediaSource.video = video;
	video.ms = mediaSource;
	fetch('/' + PLAYLIST_FILE, parse_playlist);
}

function parse_playlist() {
	BASE_URL = this.responseURL.slice(0, this.responseURL.indexOf(PORT) + PORT.length)
	playlist = this.responseText.split(/\r\n|\r|\n/); //split on break-line
	var req_status = this.status;
	if (req_status == 200 && playlist.length > 0) {
		logNOTE("Fetching " + PLAYLIST_FILE + " OK  - total received elements: " + playlist.length);
		logNOTE("Fetching playlist elements...")
		for (var i = 0; i < playlist.length; i++) {
			fetch(PARSER_DIR + '/' + playlist[i] + PL_DESCRIPTOR_SUFFIX + '.json', parse_pl_descriptor, 'json');
			//fetch(input_dir + '/' + pl_element_prefix + playlist[i] + pl_element_extension, parse_pl_element, 'json');	//Original - using json generated from the parser

			//new - replaced by parce_pl_descriptor
			//			fetch(input_dir + '/' + playlist[i] + pl_video_suffix + pl_video_extension, parse_pl_video);
			//			fetch(parser_dir + '/' + playlist[i] + pl_location_suffix + '.json', parse_pl_location, 'json')
			//			fetch(parser_dir + '/' + playlist[i] + pl_orientation_suffix + '.json', parse_pl_orientation, 'json')
			/*
			//fetch video file
			*/
		}
	} else if (req_status == 200) {
		logNOTE("Fetching " + PLAYLIST_FILE + " returned with an empty file");
	} else {
		logNOTE("Fetching " + PLAYLIST_FILE + " unsuccessful");
	}
}

function parse_pl_descriptor() {
	if (this.status == 200) {
		var tmp_obj = addVideoToIndex(this);	//add to globalSetIndex
		if(tmp_obj.id != reference_recordingID){
			addOption(INPUT_DIR + '/' + tmp_obj.videoFile, tmp_obj.id);	//add option to the dropdown
		}else{
			logINFO('We got our main view with ID '+tmp_obj.id+', skipping dropdown');
		}
	}
	logINFO(this)
	items_fetched++;	//count playlist entries fetched
	if (items_fetched == playlist.length) {	//when everything's loaded go to first video
		goToVideoAndTime(0, 0);
	}
}

/**
 * Revised version of the function - only for video files
 * TODO: we handle a lot of stuff here, refacture
 * @param {*Object} XMLHttpRequest_in
 */
//returns recording id
function addVideoToIndex(XMLHttpRequest_in) {
	var tmp_req = XMLHttpRequest_in;
	var loc_obj = new Object();
	loc_obj.descriptor = tmp_req.response;
	loc_obj.index = globalSetIndex.length;
	loc_obj.id = tmp_req.response.recordingID;
	loc_obj.videoFile = loc_obj.id + PL_VIDEO_EXTENSION;
	loc_obj.videoFileURL = BASE_URL + '/' + INPUT_DIR + '/' + loc_obj.videoFile;
	loc_obj.videoFile = loc_obj.id + PL_VIDEO_EXTENSION;
	//this used to hold the coords/orient in previous version
	//	loc_obj.set = XMLHttpRequest_in.response;
	globalSetIndex.push(loc_obj);
	//we check if it is our main view
	if(loc_obj.id == reference_recordingID){
		reference_recording_set = globalSetIndex[globalSetIndex.length - 1];
	}
	return loc_obj;
}

function loadSpatialData() {
	for (var i = 0; i < globalSetIndex.length; i++) {
		fetch(globalSetIndex[i].descriptor.locationFilename, loadCoords, 'json');
		fetch(globalSetIndex[i].descriptor.orientationFilename, loadLocs, 'json');
	}
}

function loadCoords(XMLHttpRequest_in) {
	loadAssets('_LOC', XMLHttpRequest_in.target)
}

function loadLocs(XMLHttpRequest_in) {
	loadAssets('_ORIENT', XMLHttpRequest_in.target)
}

function loadAssets(type, Xreq_target) {
	var tmp_name = Xreq_target.responseURL.split('/').pop().split('.')[0];
	for (var i = 0; i < globalSetIndex.length; i++) {
		if (globalSetIndex[i].descriptor.recordingID + type == tmp_name) {
			switch (type) {
				case '_LOC':
					globalSetIndex[i].coordSet = Xreq_target.response;
					break;
				case '_ORIENT':
					globalSetIndex[i].orientSet = Xreq_target.response;
					break;
				default:
					logERR('type ' + type + ' not recognized');
					break;
			}
			console.log('found coord set for ' + tmp_name);
			return;
		}
	}
}

/**
 * TODO replace addMarker with proper coordinate handling
 * NOTE: It adds INITIAL markers (not all markers - TODO)
 */
function analyzeGeospatialData() {
	centerMap(reference_location[0], reference_location[1], 20)
	for (var i = 0; i < globalSetIndex.length; i++) {
		var s = globalSetIndex[i];
		addMarker(reference_location[0] + i * 0.0001, reference_location[1], s.index,
			 s.orientSet[0].PresentationTime, 0, radToDeg(s.orientSet[0].X) - 90, false);
	}
}

function startPlayback(){

}

function switchToStream(index, recordingID){
	
}

/**
 * Original version of the function for adding video and sensor files - using the generated jsons
 * @param {*Object} XMLHttpRequest_in 
 */
/*
//returns loc_obj
function addToIndex(XMLHttpRequest_in) {
    var loc_obj = new Object();
    loc_obj.index = globalSetIndex.length;
    loc_obj.textFileURL = XMLHttpRequest_in.responseURL;
    loc_obj.id = loc_obj.textFileURL.slice(loc_obj.textFileURL.indexOf(pl_element_prefix) + pl_element_prefix.length, loc_obj.textFileURL.indexOf(pl_element_extension));
    loc_obj.textFile = pl_element_prefix + loc_obj.id + pl_element_extension;
    loc_obj.videoFile = pl_video_prefix + loc_obj.id + pl_video_extension;
    loc_obj.set = XMLHttpRequest_in.response;
    globalSetIndex.push(loc_obj);
    return loc_obj;
}
*/

function addOption(value, file_id) {
	var option = document.createElement("option");
	if (file_id) {
		option.text = file_id;
	} else {
		logERR("text required - used as video id");
	}
	option.value = value;
	selector.add(option);
}