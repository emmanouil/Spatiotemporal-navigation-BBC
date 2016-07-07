/* Display Default Google Maps Marker for each Location Point */
var USE_DEFAULT_MARKERS = true;

/* Zoom Level [0,20] when viewing videos */
var DEFAULT_ZOOM = 20;

/* Reset zoom level to default when viewing a video */
var LOCK_ZOOM = false;

/* Show/Hide Highlight for current Location */
var ENABLE_HIGHLIGHTER = false;


/* Other Global vars that hold/set elements: */

/**
 *  in maps. js
 *
 *  map         (Object) Holds Google Map
 *  test_icon   (Object) Holds SVG icon for camera markers
 *  current_zoom (int)   Holds current zoom level
 **/

/**
 *  in helper.js
 *
 *  globalSetIndex  (Array of Objects) Holds all Location/Sensor data
 **/

/**
 *  in video.js
 *
 *  curr_set        (Object)    DURING PLAYBACK Holds the Object from "globalSetIndex" for current video
 *  curr_set_index  (int)       DURING PLAYBACK index of curr_set at current time
 *  curr_timeout, isPlaying
 **/

/**
 *  in script.js
 *
 *  active_video_id (String)    The id of selected file
 *  mediaSource                 Not used for now
 *  playlist        (Array of Strings)  Holds IDs
 *  video           (Element)   The video
 *  selector        (Element)   The "Select File"
 *
 * File-in related vars:
 * input_dir = 'parsing'
 * playlist_file = 'playlist.txt'
 * pl_element_prefix = 'OUT_'
 * pl_video_prefix = 'VID_'
 * pl_element_extension = '.txt'
 * pl_video_extension = '.mp4'
 **/