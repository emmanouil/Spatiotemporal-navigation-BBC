# Beta-App-Client

###Input:
A `playlist.txt` located in a top-level subfolder named `parsing` with names of files.

For each _NAMEOFFILE_ there should exist (in the same folder as `playlist.txt`) a:

1. `VID_NAMEOFFILE.mp4` video file
2. `OUT_NAMEOFFILE.txt` data file (output of the parser), that contains an array of JSON Object as follows:

```
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
