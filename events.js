function activateMapEvents(){

	map.addListener('zoom_changed', function() {
		if(!LOCK_ZOOM){
			current_zoom = map.getZoom();
		}
	});



}