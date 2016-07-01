var curr_set;
var curr_set_index = 0;
var curr_timeout;

function initVideo(){
	video.muted=true;
	 // Capture the play event and set the button to say pause
	 video.addEventListener("play", function () {
		firstCheckPoint(active_video_id);
	   console.log( "Play");
	 }, false);

	 // Capture the pause event and set the button to say play
	 video.addEventListener("pause", function () {
	   console.log( "Pause");
	 }, false);
}

function addCheckPoint(){
	var local = curr_set.set[curr_set_index].Location;
	centerMap(local.Latitude, local.Longitude, 19);
	console.log(video.currentTime+'    '+curr_set.set[curr_set_index].Sensor.DurationTotal/1000)
	curr_set_index++;
	window.setTimeout(addCheckPoint, curr_set.set[curr_set_index].Sensor.Duration)
}

function firstCheckPoint(id){
	curr_set = getSetByVideoId(id);
	addCheckPoint();
}

function resetCheckPoints(){
	curr_set = null;
	curr_set_index = 0;
	window.clearTimeout(curr_timeout);
}