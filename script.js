"use strict";
//var globalSetIndex = [];	//in helper.js holds EVERYTHING parsed
//var map;	//in maps.js holds MAP

/**
 * Playlist & File Parameters
 */
var input_dir = 'parsing';
var playlist_file = 'playlist.txt';
var pl_sensors_suffix = '_SENSOR_DATA';
var pl_sensors_extension = '.xml';
var pl_video_suffix = '';
var pl_video_extension = '.mp4';

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
	fetch('/' + input_dir + '/' + playlist_file, parse_playlist);
}

/**
 * Content loading function
 */
function fetch(what, where, resp_type) {
	logINFO("fetching " + what);
	if (what.length < 2) {
		logERR("erroneous request");
	}
	var req = new XMLHttpRequest();
	req.addEventListener("load", where);
	req.open("GET", what);
	if (typeof (resp_type) != 'undefined') {
		req.responseType = resp_type;
	}
	console.log(where)
	logINFO("fetched " + what + " of type " + resp_type + ", for function " + where.name)
	req.send();
}

function parse_playlist() {
	playlist = this.responseText.split(/\r\n|\r|\n/); //split on break-line
	var req_status = this.status;
	if (req_status == 200 && playlist.length > 0) {
		logNOTE("Fetching " + playlist_file + " OK  - total received elements: " + playlist.length);
		logNOTE("Fetching playlist elements...")
		for (var i = 0; i < playlist.length; i++) {
			fetch(input_dir + '/' + pl_element_prefix + playlist[i] + pl_element_extension, parse_pl_element, 'json');
			fetch(input_dir + '/' + pl_element_prefix + playlist[i] + pl_element_extension, parse_pl_element, 'json');
		}
	} else if (req_status == 200) {
		logNOTE("Fetching " + playlist_file + " returned with an empty file");
	} else {
		logNOTE("Fetching " + playlist_file + " unsuccessful");
	}
}

function parse_pl_element() {
	if (this.status == 200) {
		var tmp_obj = addToIndex(this);	//add to globalSetIndex
		addOption(input_dir + '/' + tmp_obj.videoFile, tmp_obj.id);	//add option to the dropdown
		addMarkers(tmp_obj.set, tmp_obj.index, tmp_obj.id);
		if (HIGHLIGHT_CURRENT_MARKER) {
			addMarkersToIndex();
		}
	}
	logINFO(this)
	items_fetched++;	//count playlist entries fetched
	if (items_fetched == playlist.length) {	//when everything's loaded go to first video
		goToVideoAndTime(0, 0);
	}
}