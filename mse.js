"use strict";
/*
    This file contains MSE-related functions
    It assumes that a MediaSource has been created (mediaSource) and assigned a .video with a compatible .src
*/
var sourceBuffer;


//Adds a sourceBuffer when the mediaSource is ready for the first time
function onSourceOpen(mime_codec) {

    if(mediaSource.video.canPlayType(mime_codec) == ""){
        logERR('Mime codec '+mime_codec+' is not supported. SourceBuffer will not be added to MSE');
    }

	if (mediaSource.sourceBuffers.length > 0){
        logWARN('onSourceOpen called with mediaSource.sourceBuffers.length > 0');
        return;
    }

	sourceBuffer = mediaSource.addSourceBuffer(mime_codec);
	sourceBuffer.ms = mediaSource;

	//we assume the first playlist element is the location of the init segment
	//sourceBuffer.addEventListener('updateend', fetch(playlist[0], addSegment, "arraybuffer"));
}