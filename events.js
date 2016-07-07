var selector, toggleZoom, zoomLvl, tmpZoom;

function activateMapEvents(){

	map.addListener('zoom_changed', function() {
	    tmpZoom = map.getZoom();
		if(!LOCK_ZOOM){
			current_zoom = tmpZoom;
		}
	});

/*
  map.addListener('rightclick', function(e) {
    console.log(e)
  });
*/


}

function activateUI(){
    toggleZoom = document.getElementsByName('toggleZoom')[0];
    selector = document.getElementsByName( 'select')[0];

    toggleZoom.checked = LOCK_ZOOM;

}

//called when file is selected from the dropdown
//arg: selected index
function selectFile(index_in) {
    resetCheckPoints();
    video.src = selector[index_in].value;
    active_video_id = selector[index_in].text;
    if (loc = getSetByVideoId(active_video_id).set[0].Location) {
        centerMap(loc.Latitude, loc.Longitude);
    } else {
        logERR(selector.selectedIndex + "  not found");
    }
}

function toggleDefaultZoom(e) {
    LOCK_ZOOM = e.checked;
}

function setDefaultZoom(e){
    DEFAULT_ZOOM = current_zoom = tmpZoom;
}

//called when a marker is clicked
function goToVideoAndTime(i_in, time_in){
	console.log("video with index: "+i_in +" seeking to time "+time_in+"ms");
	selector.selectedIndex = i_in;
	selectFile(i_in);
	video.currentTime = time_in/1000;
}