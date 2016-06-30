var map;
var marker_icon = 'assets/icon_48px.svg'

var test_icon={
	path: 'm 5,22 h 14 v 2 H 5 z M 12,10 5.33,20 h 13.34 z',
//    strokeColor: '#F00',
    fillColor: '#000',
    fillOpacity: 1
};

function initMap() {
    map = new google.maps.Map( document.getElementById( 'map' ), {
        center: {
            lat: -34.397,
            lng: 150.644
        },
		mapTypeControl: true,
		mapTypeControlOptions: {
		  style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
		  mapTypeIds: [
			google.maps.MapTypeId.ROADMAP,
			google.maps.MapTypeId.TERRAIN,
			google.maps.MapTypeId.HYBRID,
			google.maps.MapTypeId.SATELLITE,
		  ]
		},
		scaleControl: true,
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
		map.panTo( { lat: latitude, lng: longitude });
	}

	if( zoom )
		if( zoom > 0 && zoom < 21 )
			map.setZoom( zoom )
}

function addMarker(lat, lng, label, bearing){
	if(!lat || !lng){
		return;
	}else if(!label){
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(lat,lng),
		});
	}else if(!bearing){
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(lat,lng),
			title: label
		});
	}else{
		var local_icon = test_icon;
		local_icon.rotation = bearing;
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(lat,lng),
			title: label,
			icon: local_icon
		});
	}
	marker.setMap(map);
}