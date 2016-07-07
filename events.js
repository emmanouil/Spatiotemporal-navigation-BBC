var selector, toggleZoom, zoomLvl;

function activateMapEvents(){

	map.addListener('zoom_changed', function() {
		if(!LOCK_ZOOM){
			current_zoom = map.getZoom();
		}
	});

/*
  map.addListener('rightclick', function(e) {
    console.log(e)
  });
*/


}

function activateUI(){
    toggleZoom = document.getElementsByName("toggleZoom")[0];
    selector = document.getElementsByName( 'select' )[0];

    toggleZoom.checked = LOCK_ZOOM;


}


function selectFile() {
    resetCheckPoints();
    video.src = selector[selector.selectedIndex].value;
    active_video_id = selector[selector.selectedIndex].text;
    if (loc = getSetByVideoId(active_video_id).set[0].Location) {
        centerMap(loc.Latitude, loc.Longitude);
    } else {
        logERR(selector.selectedIndex + "  not found");
    }
}

function toggleDefaultZoom(e) {
    LOCK_ZOOM = e.checked;
}

}