# Spatiotemporal-Navigation

Start the server on top domain, and navigate to hello-map.html


## Parsers
Parsers format the data as it is from the dataset, in a form suitable for consumption from the map visualization engine. 
There are two parsers:

### Parser Input

1. `parser_single_file` run with the name _NAMEOFFILE_ as an argument (without extension). For example, for a file ABC123.mp4 in the folder 'parsing', it should be executed as `python3 parser_single_file.py parsing/ABC123`. Each entry should have at least a video file and an associated EbuCore timing file (in xml)
2. ~~parser.py runing using a playlist~~ deprecated

### Parser Output

1. _NAMEOFFILE_`_DESCRIPTOR.json`, containing information about the recording
2. _NAMEOFFILE_`_ORIENT.json`, containg the timestamped orientation samples of the recording
3. _NAMEOFFILE_`_LOC.json`, containg the timestamped location samples of the recording


## Client
The client is a modified version of the client used for the _"Extended Video Streams for Spatiotemporal Video Navigation"_, presented at The Graphical Web 2016, part of the project _"Streaming And Presentation Architectures for Extended Video Streams"_ presented at the TVX '17.

## Architecture flow of the client
When the client is launched it does the following, in the corresponding order:
1. Load items from the _playlist.txt_, containing the <NAMEOFFILE> of relevant recordings. And then, for each <NAMEOFFILE> entry:
    1. Construct `globalSetIndex` where all the information/data on the recordings is placed
    2. Fetch the corresponding <NAMEOFFILE>_DESCRIPTOR.json file, containing information on the recordings about its timing, location of its video / location / orientation files.
    3. Fetch the corresponding <NAMEOFFILE>_dash.mpd file
2. Fetch <NAMEOFFILE>_LOC.json containing the location data (placed in the `globalSetIndex`)
3. Fetch <NAMEOFFILE>_ORIENT.json containing the orientation data (placed in the `globalSetIndex`)
4. With the acquired timed location/orientation pairs
    1. Place the markers on the map from the location/orientation pairs
    2. Add the cues for updating the markers
5. Fetch <NAMEOFFILE>_dash.mpd with the information on the segmented files (placed in the `globalSetIndex`)
6. Adjust MSE accordingly



=====

=====

The following part is still under development 

=====

### Client Input:
A `playlist.txt` located in top-level containing names of files.

For each _NAMEOFFILE_ there should exist in a subfolder named `parsing` a:

1. `VID_NAMEOFFILE.mp4` (or `VID_NAMEOFFILE.webm`) video file
2. `OUT_NAMEOFFILE_SENSORDATA.xml` data file, that contains the timed sensors data





=====

=====

The following description is for the original repository https://github.com/emmanouil/Beta-App-Client 

=====

# Beta-App-Client

###Input:
A `playlist.txt` located in a top-level subfolder named `parsing` with names of files.

For each _NAMEOFFILE_ there should exist (in the same folder as `playlist.txt`) a:

1. `VID_NAMEOFFILE.mp4` video file
2. `OUT_NAMEOFFILE.txt` data file (output of the parser), that contains an array of JSON Object [like this](#location-and-sensor-pairs)

=====

###Data In Use
####Global Pairs Holder
global variable name: ```globalSetIndex```
decription: an Array of recordings - the Location/Sensor Pair Objects of each recording are stored in the ```set``` field)
```JSON
    {
        id: "1234567_12345"
        index: 0
        set: Array[12]
        textFile: "OUT_1234567_12345.txt"
        textFileURL: "http://137.194.232.162:8080/parsing/OUT_1234567_12345.txt"
        videoFile: "OUT_1234567_12345.mp4"
    }
```


####Location and Sensor Pairs
decription: An Object holding Orientation and Location information for a POI
```JSON
    {
        "id": 1,
        "Sensor": {
            "Y": -0.083974324,
            "LocalTimestamp": 1466187515309,
            "Type": "ORIENTATION",
            "X": 2.5136049,
            "Z": -1.4016464
        },
        "Location": {
            "Time": 1466187920000,
            "LocalNanostamp": 27814219216825,
            "Longitude": 2.3506619881858737,
            "Latitude": 48.83000039044928,
            "Altitude": 111.77508694140864,
            "Bearing": 213.30880737304688,
            "Provider": "gps",
            "Accuracy": 16,
            "LocalTimestamp": 1466187515321,
            "Velocity": 1.0693713426589966
        }
    }
```
