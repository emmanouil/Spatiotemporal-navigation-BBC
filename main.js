"use strict";
//var globalSetIndex = [];	//in helper.js holds EVERYTHING parsed
//var map;	//in maps.js holds MAP

/**
 * Playlist & File Parameters
 */
//Files and folders
const PLAYLIST_FILE = 'playlist.txt'; //holds the base names of the recordings
const INPUT_DIR = 'parsing';	//holds the video and original files
const PARSER_DIR = 'script_out';	//holds the parser output (location, orientation, descriptor) jsons
const DASH_DIR = 'segmented';	//contains the segments, inits and mpd init of the video files

//extensions, suffixes and prefixes
const DASH_MPD_SUFFIX = '_dash'	//i.e. NAMEOFRECORDING_dash.mpd
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
var mediaSource = new MediaSource();
//var skeleton_worker = new Worker( 'parser.js' );
var selector, video, main_view, video_mse, main_view_tracks = [], main_view_startTime, playlist, items_fetched = 0;

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
	main_view = document.getElementById('v_main');
	video_mse = document.getElementById('video_mse');
	video_mse.ms = mediaSource;
	mediaSource.video = video_mse;

	//fetch playlist and parse elements (IDs) in 'playlist' array
	fetch_promise('/' + PLAYLIST_FILE, 'no-type', true).
		then(
		//then fetch the descriptor jsons and build the globalSetIndex[]
		function (response, mpd) {
			parse_playlist(response);
			var promises = [];
			for (var i = 0; i < playlist.length; i++) {
				promises.push(fetch_promise(PARSER_DIR + '/' + playlist[i] + PL_DESCRIPTOR_SUFFIX + '.json', 'json', true));
			}
			//load descriptors and update globalSetIndex
			Promise.all(promises).then(function (values) {
				for (var i = 0; i < values.length; i++) {
					parse_pl_descriptor(values[i]);
				}
			}).then(
				//then fetch the mpds and construct the mpd[]	
				function () {
					var promises = [];
					for (var i = 0; i < playlist.length; i++) {
						promises.push(fetch_promise(DASH_DIR + '/' + globalSetIndex[i].id + DASH_MPD_SUFFIX + '.mpd', 'no-type', true));
					}
					Promise.all(promises).then(function (values) {
						console.log(values);
						for (var i = 0; i < values.length; i++) {
							if (values[i].status === 200) {
								for (var j = 0; j < globalSetIndex.length; j++) {
									if (values[i].responseURL.search(globalSetIndex[j].id) > -1) {
										globalSetIndex[j].mpd = new MPD(values[i].responseURL);
										globalSetIndex[j].mpd.fullDocument = mpd_parse(values[i].response);
										globalSetIndex[j].mpd.initSegment = mpd_getInitSegURL(globalSetIndex[j].mpd.fullDocument);
										var t_rep = mpd_getRepresentationNodeByID(globalSetIndex[j].mpd.fullDocument, 1);
										globalSetIndex[j].mpd.representations.push(mpd_getRepresentationByNode(t_rep));
										break;
									}
								}
							} else {
								logERR('request for ' + values[i].responseURL + ' failed');
							}
						}
						logINFO('done parsing mpds')
					}).then(function () {
						logINFO('TODO create and start managing MSE and SourceBuffers')
						document.getElementById('init_ts_btn').disabled = false;
					}).catch(function (err) { logERR(err); });
				}).catch(function (err) { logERR(err); });
		}).then(function () {
			console.log('parley')
		}).then(function (response) {
			//mpd = response;
		}).catch(function (err) { logWARN('Failed promise - Error log: '); console.log(err); });
}

function parse_playlist(request) {
	BASE_URL = request.responseURL.slice(0, request.responseURL.indexOf(PORT) + PORT.length)
	playlist = request.responseText.split(/\r\n|\r|\n/); //split on break-line
	var req_status = request.status;
	if (req_status == 200 && playlist.length > 0) {
		Promise.resolve();
	} else if (req_status == 200) {
		logWARN("Fetching " + PLAYLIST_FILE + " returned with an empty file");
		Promise.reject('Empty playlist');
	} else {
		logWARN("Fetching " + PLAYLIST_FILE + " unsuccessful");
		Promise.reject('No Playlist found')
	}
}

function parse_pl_descriptor(req) {
	if (req.status == 200) {
		var tmp_obj = addVideoToIndex(req);	//add to globalSetIndex
		if (tmp_obj.id != reference_recordingID) {
			addOption(INPUT_DIR + '/' + tmp_obj.videoFile, tmp_obj.id);	//add option to the dropdown
		} else {
			logINFO('We got our main view with ID ' + tmp_obj.id + ', skipping dropdown');
		}
	}
	logINFO(req)
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
	if (loc_obj.id == reference_recordingID) {
		reference_recording_set = globalSetIndex[globalSetIndex.length - 1];
	}
	return loc_obj;
}

/* Called when "Init Time & Space" btn is clicked and fetches location and orientation sets */
function loadSpatialData() {
	for (var i = 0; i < globalSetIndex.length; i++) {
		fetch(globalSetIndex[i].descriptor.locationFilename, loadCoords, 'json');
		fetch(globalSetIndex[i].descriptor.orientationFilename, loadLocs, 'json');
	}
}

/* Called when "Init Time & Space" btn is clicked and calculates relative time between views */
function setMainViewStartTime() {
	var tmp_time = globalSetIndex[0].descriptor.startTimeMs - reference_recording_set.descriptor.startTimeMs;
	for (var i = 1; i < globalSetIndex.length; i++) {
		if (globalSetIndex[i].descriptor.startTimeMs - reference_recording_set.descriptor.startTimeMs > tmp_time && globalSetIndex[i].id != reference_recordingID) {
			tmp_time = globalSetIndex[i].descriptor.startTimeMs - reference_recording_set.descriptor.startTimeMs;
		}
	}
	main_view.currentTime = main_view_startTime = (tmp_time / 1000);	//in seconds
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
	/* Setup main view */
	centerMap(reference_location[0], reference_location[1], 20)
	main_view.src = INPUT_DIR + '/' + reference_recording_set.videoFile;
	main_view.id = reference_recording_set.id;

	/**
	 * Add initial markers (TODO specify initial loc and orient)
	 */
	for (var i = 0; i < globalSetIndex.length; i++) {
		var s = globalSetIndex[i];
		if (s.id != reference_recordingID) {
			addLiveMarker(s.coordSet[0].Latitude, s.coordSet[0].Longitude,
				s.index, s.id, s.orientSet[0].X, true);
		} else {
			addLiveMarker(s.coordSet[0].Latitude, s.coordSet[0].Longitude,
				s.index, s.id, s.orientSet[0].X, false);
		}
	}


	/**
	 * Add marker updates
	 */
	for (var i = 0; i < globalSetIndex.length; i++) {
		var s = globalSetIndex[i];
		if (s.id != reference_recordingID) {
			var tmp_index = main_view_tracks.push(main_view.addTextTrack("metadata", s.id))
			addMarkerUpdates(s, tmp_index - 1);
			globalSetIndex[i].main_view_tracks_no = tmp_index - 1;
			main_view_tracks[tmp_index - 1].oncuechange = function () {
				for (var i = 0; i < this.activeCues.length; i++) {
					updateMarkerByLabel(this.activeCues[i].track.label, Number(this.activeCues[i].text));
				}
			}
		} else {
			logINFO('main view has no changes in loc/orient, skipping addMarkerUpdates for set')
			continue;
		}
	}
}

function addMarkerUpdates(set_in, tmp_index) {
	//TODO; I messed it up
	/* locate and init track */
	var tmp_track = main_view_tracks[tmp_index];

	/* analyze orientations to cues */
	/* use as main (a.k.a. reference) view */
	var tmp_start = set_in.descriptor.startTimeMs;
	var t_diff = tmp_start - reference_recording_set.descriptor.startTimeMs;
	if (reference_start_time == 0) {
		reference_start_time = t_diff / 1000;
		main_view.currentTime = reference_start_time;
	}
	var cur_t = set_in.orientSet[0].PresentationTime;
	for (var i = 0; i < set_in.orientSet.length - 1; i++) {
		var tmp_orient = set_in.orientSet[i];
		cur_t = tmp_orient.PresentationTime;
		//TODO handle cues according to main vid time (not relevant to the take time)
		tmp_track.addCue(new VTTCue((t_diff + cur_t) / 1000, (t_diff + set_in.orientSet[i + 1].PresentationTime) / 1000, String(tmp_orient.X)));
	}

	/*
	var t_start = set_in.descriptor.startTimeMs;
	for( var i =0; i< set_in.orientSet; i++){

	}
	*/
	console.log(tmp_track)
}


function startPlayback() {
	//called when the play button is pressed
	//TODO
}

function switchToStream(index, recordingID) {
	//called when marker is clicked
	//TODO
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