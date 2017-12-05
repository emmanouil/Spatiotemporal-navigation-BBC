"use strict";
//var globalSetIndex = [];	//in helper.js holds EVERYTHING parsed
//var map;	//in maps.js holds MAP

/**
 * Playlist & File Parameters
 */
var input_dir = 'parsing';	//holds the video and original files
var parser_dir = 'script_out';	//holds the parser output (location, orientation) jsons
var playlist_file = 'playlist.txt';
var pl_sensors_suffix = '_SENSOR_DATA';
var pl_sensors_extension = '.xml';
var pl_video_suffix = '';
//var pl_video_extension = '.mp4';
var pl_video_extension = '.webm';
var pl_location_suffix = '_LOC';
var pl_orientation_suffix = '_ORIENT';
var pl_descriptor_suffix = '_DESCRIPTOR';

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
	fetch('/' + playlist_file, parse_playlist);
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

function parse_playlist() {
	playlist = this.responseText.split(/\r\n|\r|\n/); //split on break-line
	var req_status = this.status;
	if (req_status == 200 && playlist.length > 0) {
		logNOTE("Fetching " + playlist_file + " OK  - total received elements: " + playlist.length);
		logNOTE("Fetching playlist elements...")
		for (var i = 0; i < playlist.length; i++) {
			fetch(parser_dir + '/' + playlist[i] + pl_descriptor_suffix + '.json', parse_pl_descriptor, 'json');
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
		logNOTE("Fetching " + playlist_file + " returned with an empty file");
	} else {
		logNOTE("Fetching " + playlist_file + " unsuccessful");
	}
}

function parse_pl_descriptor() {
	if (this.status == 200) {
		var tmp_obj = addVideoToIndex(this);	//add to globalSetIndex
		addOption(input_dir + '/' + tmp_obj.videoFile, tmp_obj.id);	//add option to the dropdown
	}
	logINFO(this)
	items_fetched++;	//count playlist entries fetched
	if (items_fetched == playlist.length) {	//when everything's loaded go to first video
		goToVideoAndTime(0, 0);
	}
}

/**
 * Revised version of the function - only for video files
 * @param {*Object} XMLHttpRequest_in 
 */
//returns recording id
function addVideoToIndex(XMLHttpRequest_in) {
	var loc_obj = new Object();
	loc_obj.index = globalSetIndex.length;
	loc_obj.videoFileURL = XMLHttpRequest_in.responseURL;
	loc_obj.id = loc_obj.videoFileURL.slice(loc_obj.videoFileURL.indexOf(input_dir) + input_dir.length + 1, loc_obj.videoFileURL.indexOf(pl_video_extension));
	loc_obj.videoFile = loc_obj.id + pl_video_extension;
	//this used to hold the coords/orient in previous version
	//	loc_obj.set = XMLHttpRequest_in.response;
	globalSetIndex.push(loc_obj);
	return loc_obj;
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