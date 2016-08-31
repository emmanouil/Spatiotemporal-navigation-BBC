var curr_set;
var curr_set_index = 0;
var curr_timeout;
var isPlaying = false;

function initVideo() {
	video.muted = true;
	// Capture the play event
	video.addEventListener( "play", function() {
		if( isPlaying ) {
			console.log( "Play RESUME" );
			resumeCheckPoint();
		} else {
			firstCheckPoint( active_video_id );
			console.log( "Play FIRST" );
		}
		console.log( "Play - seeking:" + video.seeking );
	}, false );

	video.addEventListener( "playing", function() {
		console.log( "PlayING - empty" );
	}, false );

	// Capture the pause event
	video.addEventListener( "pause", function() {
		pauseCheckPoint();
	   	   console.log( "pause" );
	}, false );

	// Capture the seek (start) event
	video.addEventListener( "seeking", function() {
		//	   pauseCheckPoint();
		if( video.paused ) seekCheckPoint();
		console.log( "seeking - empty" );
	}, false );
	/*
		 // Capture the seek (end) event
		 video.addEventListener("seeked", function () {
		   seekCheckPoint();
					 console.log( "seek - seekend");
		 }, false);
		 */
}

function nextCheckPoint() {
	followTimeline();
	console.log( video.currentTime + '    ' + curr_set.set[ curr_set_index ].Sensor.DurationTotal / 1000 );
	curr_set_index++;
	if( curr_set.set[ curr_set_index ] == null ) {
		isPlaying = false;
		return;
	}
	curr_timeout = window.setTimeout( nextCheckPoint, curr_set.set[ curr_set_index ].Sensor.Duration );
}

function firstCheckPoint( id ) {
	isPlaying = true;
	curr_set = getSetByVideoId( id );
	nextCheckPoint();
}

function resumeCheckPoint() {
	seekCheckPoint();
	followTimeline();
	curr_timeout = window.setTimeout( nextCheckPoint, curr_set.set[ curr_set_index ].Sensor.Duration );
}

function seekCheckPoint() {
	console.log( "seek checkpoint " + curr_set_index );
	var seekUP;
	var seekDiff;
	var prevDiff;

	if(LOCK_ZOOM)current_zoom = DEFAULT_ZOOM;

	if( video.currentTime == 0 ) {
		resetCheckPoints();
		return;
	}
	
	if(curr_set == null){ curr_set = getSetByVideoId( active_video_id );
	}else if( curr_set.set[ curr_set_index ] == null ){
		curr_set_index = 0;}

	seekDiff = video.currentTime - ( curr_set.set[ curr_set_index ].Sensor.DurationTotal / 1000 );
	if( seekDiff > 0 ) {
		seekUP = true;
	} else {
		seekUP = false;
	}

	console.log( "videotime: " + video.currentTime + "   seektime: " + curr_set.set[ curr_set_index ].Sensor.DurationTotal / 1000 + "   seekup: " + seekUP );
	if( seekUP ) {
		while( ( curr_set.set[ curr_set_index ] != null ) && seekDiff > 0 ) {
			curr_set_index++;
			seekDiff = video.currentTime - curr_set.set[ curr_set_index ].Sensor.DurationTotal / 1000;
		}
		prevDiff = video.currentTime - curr_set.set[ curr_set_index-1 ].Sensor.DurationTotal / 1000;
		if(Math.abs(seekDiff)>Math.abs(prevDiff))curr_set_index--;
	} else {
		while( ( curr_set.set[ curr_set_index ] != null ) && seekDiff < 0 ) {
			curr_set_index--;
			seekDiff = video.currentTime - curr_set.set[ curr_set_index ].Sensor.DurationTotal / 1000;
		}
		prevDiff = video.currentTime - curr_set.set[ curr_set_index-1 ].Sensor.DurationTotal / 1000;
		if(Math.abs(seekDiff)>Math.abs(prevDiff))curr_set_index--;
	}
	followTimeline();
	console.log( "seeked checkpoint " + curr_set_index );
	/*	if(video.paused)return;
		var local = curr_set.set[ curr_set_index ].Location;
		centerMap( local.Latitude, local.Longitude, 19 );
		curr_timeout = window.setTimeout( nextCheckPoint, curr_set.set[ curr_set_index ].Sensor.Duration );*/
}

function pauseCheckPoint() {
	//-	console.log('pause')
	if( video.ended ) {
		resetCheckPoints();
		return;
	} else {
		window.clearTimeout( curr_timeout );
	}
}


function resetCheckPoints() {
	curr_set = null;
	curr_set_index = 0;
	window.clearTimeout( curr_timeout );
	isPlaying = false;
}

function followTimeline(){
	var local = curr_set.set[ curr_set_index ].Location;
	centerMap( local.Latitude, local.Longitude, current_zoom );
}