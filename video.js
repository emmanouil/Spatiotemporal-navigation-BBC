var curr_set;
var curr_set_index = 0;
var curr_timeout;
var isPlaying = false; 

function initVideo(){
	video.muted=true;
	 // Capture the play event and set the button to say pause
	 video.addEventListener("play", function () {
	 	if(isPlaying){
	 		resumeCheckPoint();
	 	}else{
			firstCheckPoint(active_video_id);
	 	}
	   console.log( "Play");
	 }, false);

	 // Capture the pause event and set the button to say play
	 video.addEventListener("pause", function () {
	   pauseCheckPoint();
	 }, false);
}

function nextCheckPoint(){
	var local = curr_set.set[curr_set_index].Location;
	centerMap(local.Latitude, local.Longitude, 19);
	console.log(video.currentTime+'    '+curr_set.set[curr_set_index].Sensor.DurationTotal/1000);
	curr_set_index++;
	if(curr_set.set[curr_set_index]==null){
		isPlaying = false;
		return;
	}
	curr_timeout = window.setTimeout(nextCheckPoint, curr_set.set[curr_set_index].Sensor.Duration);
}

function firstCheckPoint(id){
	isPlaying = true;
	curr_set = getSetByVideoId(id);
	nextCheckPoint();
}

function resumeCheckPoint(){
	while((curr_set.set[curr_set_index]!=null) && (video.currentTime > curr_set.set[curr_set_index].Sensor.DurationTotal/1000)){
		curr_set_index++;
	}
	var local = curr_set.set[curr_set_index].Location;
	centerMap(local.Latitude, local.Longitude, 19);
	curr_timeout = window.setTimeout(nextCheckPoint, curr_set.set[curr_set_index].Sensor.Duration);
}

function pauseCheckPoint(){
	console.log('pause')
	if(video.ended){
		resetCheckPoints();
		return;
	}else{
		window.clearTimeout(curr_timeout);
	}
}


function resetCheckPoints(){
	curr_set = null;
	curr_set_index = 0;
	window.clearTimeout(curr_timeout);
	isPlaying = false;
}