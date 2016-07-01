//var globalSetIndex = [];	//in helper.js holds EVERYTHING parsed
//var map;	//in maps.js holds MAP

var input_dir = 'parsing';
var playlist_file = 'playlist.txt';
var pl_element_prefix = 'OUT_';
var pl_video_prefix = 'VID_';
var pl_element_extension = '.txt';
var pl_video_extension = '.mp4';
var active_video_id;
var mediaSource = new MediaSource();	//Not used for now
//var skeleton_worker = new Worker( 'parser.js' );
var selector;

//after window loads do the init
window.onload = function() {
	video = document.getElementById( 'v' );
	initVideo();	//in video.js
	selector = document.getElementsByName( 'select' )[0];
	mediaSource.video = video;
	video.ms = mediaSource;

	fetch( '/' + input_dir + '/' + playlist_file, parse_playlist );

	//	fetch(input_dir+'/'+sample_in, parse_sample, "json");


	//	video.src = window.URL.createObjectURL(mediaSource);
	//	initMSE();
	//	if (withReverb) fetch(reverbFile, initReverb, "arraybuffer");
}

//Content-loading functions
function fetch( what, where, resp_type ) {
	console.log( "fetching " + what );
	if( what.length < 2 ) {
		console.log( "erroneous request" );
	}
	var req = new XMLHttpRequest();
	req.addEventListener( "load", where );
	req.open( "GET", what );
	if( typeof ( resp_type ) != 'undefined' ) {
		req.responseType = resp_type;
	}
	req.send();
}

function parse_sample( resp ) {
	console.log( "got it" );
	sampleData = resp.target.response;
}

function parse_playlist() {
	playlist = this.responseText.split( /\r\n|\r|\n/ ); //split on break-line
	req_status = this.status;
	if( req_status == 200 && playlist.length > 0 ) {
		console.log( "[NOTE] Fetching " + playlist_file + " OK  - total received elements: " + playlist.length );
		console.log( "[NOTE] Fetching playlist elements..." )
		for( i = 0;i < playlist.length;i++ ) {
			fetch( input_dir + '/' + pl_element_prefix + playlist[ i ] + pl_element_extension, parse_pl_element, 'json' );
			addOption(input_dir + '/' + pl_video_prefix + playlist[ i ] + pl_video_extension, playlist[ i ]);
		}
	} else if( req_status == 200 ) {
		console.log( "[NOTE] Fetching " + playlist_file + " returned with an empty file" );
	} else {
		console.log( "[NOTE] Fetching " + playlist_file + " unsuccessful" );
	}
}

function parse_pl_element() {
	if( this.status == 200 ) {
		addMarkers(this.response);
		addToIndex(this);		
//		console.log( "[NOTE] Received " + this.response.length + " entries " )
//		tmp = this.response[ 0 ].Location;
//		centerMap( tmp.Latitude, tmp.Longitude, 34 );
	}
	console.log( this )
}

function addMarkers(loc_set){
	tmp = loc_set[ 0 ].Location;
	centerMap( tmp.Latitude, tmp.Longitude, 19 );
	for(i =0; i<loc_set.length; i++){
		if(loc_set[i].Location){
			lllo = loc_set[i]
//			console.log(new google.maps.LatLng(loc_set[i].Location.Latitude,loc_set[i].Location.Longitude))
			addMarker(loc_set[i].Location.Latitude, loc_set[i].Location.Longitude, "Marker "+i, radToDeg(loc_set[i].Sensor.X)-90);
		}
	}
}