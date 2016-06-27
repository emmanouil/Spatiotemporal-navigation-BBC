function calcBearing(lat1, lng1, lat2, lng2){
	var y = Math.sin(lat2-lat1) * Math.cos(lng2);
	var x = Math.cos(lng1)*Math.sin(lng2) -
			Math.sin(lng1)*Math.cos(lng2)*Math.cos(lat2-lat1);
	var brng = Math.atan2(y, x); //in rad
	var brngDgr = brng / (Math.PI / 180);
	return brngDgr;
}