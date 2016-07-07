var globalSetIndex = [];

function logERR(msg) {
    console.log("[ERROR] " + msg);
}

function calcBearing(lat1, lng1, lat2, lng2) {
    var y = Math.sin(lat2 - lat1) * Math.cos(lng2);
    var x = Math.cos(lng1) * Math.sin(lng2) -
        Math.sin(lng1) * Math.cos(lng2) * Math.cos(lat2 - lat1);
    var brng = Math.atan2(y, x); //in rad
    var brngDgr = brng / (Math.PI / 180);
    return brngDgr;
}

function radToDeg(rad_in) {
    return rad_in / (Math.PI / 180);
}

function degToRad(rad_in) {
    return rad_in * (Math.PI / 180);
}

function addOption(value, text) {
    var option = document.createElement("option");
    if (text) {
        option.text = text;
        if (!selector.length) {
            active_video_id = text;
        }
    } else {
        logERR("text required - used as video id");
    }
    option.value = value;
    selector.add(option);
}

function addToIndex(XMLHttpRequest_in) {
    var loc_obj = new Object();
    loc_obj.index = globalSetIndex.length;
    loc_obj.textFileURL = XMLHttpRequest_in.responseURL;
    loc_obj.id = loc_obj.textFileURL.slice(loc_obj.textFileURL.indexOf(pl_element_prefix) + pl_element_prefix.length, loc_obj.textFileURL.indexOf(pl_element_extension));
    loc_obj.textFile = pl_element_prefix + loc_obj.id + pl_element_extension;
    loc_obj.videoFile = pl_video_prefix + loc_obj.id + pl_video_extension;
    loc_obj.set = XMLHttpRequest_in.response;
    globalSetIndex.push(loc_obj);
}

function getSetByVideoId(id_in) {
    for (item in globalSetIndex) {
        if (globalSetIndex[item].id === id_in.toString())
            return globalSetIndex[item];
    }
}
