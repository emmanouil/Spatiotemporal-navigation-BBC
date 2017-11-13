# Spatiotemporal-Navigation

Start the server on top domain, and navigate to hello-map.html

###Input:
A `playlist.txt` located in a top-level subfolder named `parsing` with names of files.

For each _NAMEOFFILE_ there should exist (in the same folder as `playlist.txt`) a:

1. `VID_NAMEOFFILE.mp4` video file
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
