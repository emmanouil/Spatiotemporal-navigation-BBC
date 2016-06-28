function calcBearing(lat1, lng1, lat2, lng2){
	var y = Math.sin(lat2-lat1) * Math.cos(lng2);
	var x = Math.cos(lng1)*Math.sin(lng2) -
			Math.sin(lng1)*Math.cos(lng2)*Math.cos(lat2-lat1);
	var brng = Math.atan2(y, x); //in rad
	var brngDgr = brng / (Math.PI / 180);
	return brngDgr;
}

function radToDeg(rad_in){
	return rad_in/(Math.PI/180);
}

function degToRad(rad_in){
	return rad_in*(Math.PI/180);
}

function addOption(value, text){
	var option = document.createElement("option");
	if(text)
		option.text = text;
	option.value = value;
	selector.add(option);
}

function selectFile(){
	video.src = selector[selector.selectedIndex].value;
}