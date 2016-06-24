var map;

function initMap() {
    map = new google.maps.Map( document.getElementById( 'map' ), {
        center: {
            lat: -34.397,
            lng: 150.644
        },
        zoom: 10
		/**
		 Zoom levels (approx.)
		 
			1: World
			5: Landmass/continent
			10: City
			15: Streets
			20: Buildings
		
		 */
    });
}

function centerMap( latitude, longitude, zoom ) {
	if( !latitude || !longitude ) {
		console.log( "Lat and/or Lng not set" );
		return;
	} else {
		map.setCenter( { lat: latitude, lng: longitude });
	}

	if( zoom )
		if( zoom > 0 && zoom < 21 )
			map.setZoom( zoom )
}