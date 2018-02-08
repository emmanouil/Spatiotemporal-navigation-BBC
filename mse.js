"use strict";
/*
    This file contains MSE-related functions
    It assumes that a MediaSource has been created (mediaSource) and assigned a .video with a compatible .src
*/
var sourceBuffer;


//Adds a sourceBuffer when the mediaSource is ready for the first time
function onSourceOpen(mime_codec) {

    if (mediaSource.video.canPlayType(mime_codec) == "") {
        logERR('Mime codec ' + mime_codec + ' is not supported. SourceBuffer will not be added to MSE');
    }

    if (mediaSource.sourceBuffers.length > 0) {
        logWARN('onSourceOpen called with mediaSource.sourceBuffers.length > 0');
        return;
    }

    sourceBuffer = mediaSource.addSourceBuffer(mime_codec);
    sourceBuffer.ms = mediaSource;

    //We also add the init element
    if (sourceBuffer.updating) {
        sourceBuffer.addEventListener('updateend', function () { fetch_res(DASH_DIR + '/' + globalSetIndex[PLAYLIST_MAIN_VIEW_INDEX].mpd.init_seg, addSegment, "arraybuffer"); }, { once: true });
    } else {
        fetch_res(DASH_DIR + '/' + globalSetIndex[PLAYLIST_MAIN_VIEW_INDEX].mpd.init_seg, addSegment, "arraybuffer")
    }
}

//Append the initialization segment.
function addSegment(seg_arrayBuffer) {
    if (seg_arrayBuffer == null) {
        // Error fetching the initialization segment. Signal end of stream with an error.
        console.log("[ERROR] endofstream?")
        mediaSource.endOfStream("network");
        return;
    }

    sourceBuffer.appendBuffer(seg_arrayBuffer);
    //    playlistPosition++;
    //    sourceBuffer.addEventListener('updateend', handleNextPlElement, { once: false });
}