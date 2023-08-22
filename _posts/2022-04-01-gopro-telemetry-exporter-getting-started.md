---
date: 2022-04-01
title: "Getting started with GoPro Telemetry to parse GPMD"
description: "A more comprehensive alternative to exiftool when working with GPMD."
categories: developers
tags: [exiftool, ffmpeg, gmpd, telemetry, metadata, gpmf]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-04-01/gopro-telemetry-overlay.jpeg
featured_image: /assets/images/blog/2022-04-01/gopro-telemetry-overlay-sm.jpeg
layout: post
published: true
---

**A more comprehensive alternative to exiftool when working with GPMD.**

If you follow this blog you will have seen me use exiftool to extract telemetry (and other data) from video files many times.

As we work exclusively with GoPro cameras, I wanted to try out another way to do this, specifically designed for GoPro cameras.

Occasionally I have used [`gpmf-extract`](https://github.com/JuanIrache/gpmf-extract) from Juan Irache. For a long time I have also wanted to test his [`gopro-telemetry`](https://github.com/JuanIrache/gopro-telemetry) script which is used to power [goprotelemetryextractor.com/](https://goprotelemetryextractor.com/).

Here is some useful information and code snippets to help you get started quickly and to understand the key parts of the scripts capabilities.

## Follow along

For this example I will be using the following equirectangular video (`GS018422.mp4`) with GPS enabled, though any GoPro video can be used in the same way. Note, in the case of dual GoPro Fusion fisheyes, the front video file (`GPFR`) should be used, as this is where the gpmf stream is stored.

## 1. Install required modules

First-things-first, you'll need node.js installed. [Everything you need to do this is here](https://nodejs.org/en/download/).

`gopro-telemetry` takes extracted telemetry from a video file (using [`gpmf-extract`](https://github.com/JuanIrache/gpmf-extract)).

To do this, first clone the repository and install the required node modules:

```shell
# cloning the repository is not necessary for this tutorial as a clean place for the code
git clone https://github.com/JuanIrache/gopro-telemetry
cd gopro-telemetry
npm init -y
npm i gpmf-extract gopro-telemetry --save
```

## 2. Copy the example

In the [repository you will find the following example code](https://github.com/JuanIrache/gopro-telemetry#options) (that I have slightly changed it with `path_to_your_file.mp4` replaced with `GS018422.mp4` and `output_path.json` with `GS018422-full-telemetry.json`);

```js
const gpmfExtract = require('gpmf-extract');
const goproTelemetry = require(`gopro-telemetry`);
const fs = require('fs');

const file = fs.readFileSync('GS018422.mp4');

gpmfExtract(file)
.then(extracted => {
goproTelemetry(extracted, {}, telemetry => {
fs.writeFileSync('GS018422-full-telemetry.json', JSON.stringify(telemetry));
console.log('Telemetry saved as JSON');
});
})
.catch(error => console.error(error));
```

Paste this code into a new file `GS018422-full-telemetry.js`;

```shell
vi GS018422-full-telemetry.js 
```

Now copy `GS018422.mp4` into the directory;

```shell
pip install gdown
cd samples
# Use test 360 GS018421.360
gdown --id 1SYjVOwQcALg8gQLq8BLLbALEW33PlVT2
```

## 3. Run the example

And finally, run the newly created `.js` file like so;

```shell
node GS018422-full-telemetry.js
```

If all has been successful, you will see a message like this;

```
Telemetry saved as JSON
```

And in the directory, you should see a `.json` file called `GS018422-full-telemetry.json` (you can modify the filename in `GS018422-full-telemetry.js` by replacing the value `GS018422-full-telemetry.json` with your desired filename).

[Here is a prettified version of the output file](https://gist.github.com/himynamesdave/9ff529f92d3c091eca18bda6388a4685).

## 4. Examining the output

Depending on the camera, model, settings and accessories used, you will see values reported for various `streams`, e.g. (`ACCL`: 3-axis accelerometer, `GYRO`: 3-axis gyroscope, `GPS5`: Latitude, longitude, altitude (WGS 84), 2D ground speed, and 3D speed...).

It's also worth pointing out, older cameras report the same type of data in different ways. For example, the `GPS5` stream is used on newer GoPro cameras, whereas I'm told (although the only place I can validate this stream ever existed is in the [exiftool docs](https://exiftool.org/TagNames/GoPro.html)) for HERO 4 and older cameras this is reported as `GLPI`.

[You can find information on what many sensors are called (and what cameras / modes produce data for them) here](https://github.com/gopro/gpmf-parser#where-to-find-gpmf-data).

For our work we're mainly interested values from the GPS, accelerometer and gyroscope sensors. Here are some snippets of how this data is presented for a GoPro MAX (I have added comments into the code to describe some of the values too).

For reference, here is GoPro sensor `x`, `y`, and `z` axis configuration;

<img class="img-fluid" src="/assets/images/blog/2022-04-01/CameraIMUOrientationSM.png" alt="GoPro IMU Orientation" title="GoPro IMU Orientation" />

### GPS `GPS5`

```json
"GPS5": {
  "samples": [
    {
      "value": [
        51.2725456, // latitude
        -0.8459696, // longitude
        82.008, // altitude
        0.044, // 2D ground speed
        0.04 // 3D speed
      ],
      "cts": 162.33, // milliseconds since first frame
      "date": "2021-09-04T07:24:07.744Z",
      "sticky": {
        "fix": 3, // 0, 2D, 3D
        "precision": 164, // geometric dilution of precision * 100
        "altitude system": "MSLV"
      }
    },
```

Which is reported like so (snippet from end of file);

```json
        "name":"GPS (Lat., Long., Alt., 2D speed, 3D speed)",
        "units":["deg","deg","m","m/s","m/s"]},
```

### Accelerometer `ACCL`

```json
"ACCL": {
  "samples": [
    {
      "value": [
        -9.424460431654676, // x
        -0.47721822541966424, // y
        -1.4004796163069544 // z
      ],
      "cts": 176.875, // milliseconds since first frame
      "date": "2021-09-04T07:24:07.744Z",
      "sticky": {
        "temperature [°C]": 28.021484375
      }
    },
```

Which is reported like so;

```json
        "name":"Accelerometer (z,x,y)",
        "units":"m/s2"},
```

### Gyroscope `GYRO`

```json
"GYRO": {
  "samples": [
    {
      "value": [
        -0.07348242811501597, // x
        -0.03194888178913738, // y
        0.003194888178913738 // z
      ],
      "cts": 176.073, // milliseconds since first frame
      "date": "2021-09-04T07:24:07.744Z",
      "sticky": {
        "temperature [°C]": 28.021484375
      }
    },
```

Which is reported like so;

```json
        "name":"Gyroscope (z,x,y)",
        "units":"rad/s"}
```

### Camera / video information

At the end of the JSON document you'll also find the camera and framerate used to create the video, like so

```json
    "device name":"GoPro Max"
  },
  "frames/second":23.976023976023978
}
```

## 5. Experiment with some custom options

Using the script as defined above will output all available data.

There is also [a comprehensive set of options that can also be used in the script to filter the type and date values produced](https://github.com/JuanIrache/gopro-telemetry#options).

To help understand how these can be passed, take a look in [the options shown in the readme here](https://github.com/JuanIrache/gopro-telemetry#options).

[`example.js`](https://github.com/JuanIrache/gopro-telemetry/blob/master/samples/example.js) in the `/samples` directory shows how some of the options can be used too.

Let us use these in our script by modifying it like so;

```js
const gpmfExtract = require('gpmf-extract');
const goproTelemetry = require(`gopro-telemetry`);
const fs = require('fs');

const file = fs.readFileSync('GS018422.mp4');

gpmfExtract(file)
.then(extracted => {
goproTelemetry(extracted, {
stream: ['GPS5','ACCL'],
GPS5Fix: 3,
GPS5Precision: 500,
WrongSpeed: 50
}, telemetry => {
fs.writeFileSync('GS018422-gps-acl-only.json', JSON.stringify(telemetry));
console.log('Telemetry saved as JSON');
});
})
.catch(error => console.error(error));
```

Here are the custom options I have used:

* `stream`: Filters the results by device stream (often a sensor) name. 
  * I am using the GPS stream (`GPS5`) and the accelerometer stream (`ACCL`)
* `GPS5Fix`: Will filter out GPS5 samples where the type of GPS lock is lower than specified (0: no lock, 2: 2D lock, 3: 3D Lock).
  * I only want a good fix to avoid noise (3D / `3`)
* `GPS5Precision`: Will filter out GPS5 samples where the [Dilution of Precision](https://en.wikipedia.org/wiki/Dilution_of_precision_(navigation)) is higher than specified (this DOP value is * 100, e.g. 500 = 5)
  * I want a fairly good DOP, again for reducing noise (5 / `500`)
* `WrongSpeed`: will filter out GPS positions that generate higher speeds than indicated in meters per second
  * I want to remove any two consecutive points where speed between them is greater than 50 m/s (180 km/h) as these are clearly erroneous (I was walking when shooting the video)

Now paste this code into a new file called `GS018422-gps-acl-only.js`;

```shell
vi GS018422-gps-acl-only.js
```

Once this is done, run it in the same way as before;

```shell
node GS018422-gps-acl-only.js
```

You should notice the difference in the two files (`GS018422-full-telemetry.json` and `GS018422-gps-acl-only.json`) -- mainly the smaller file of the latter, due to the fact it only contains GPS and accelerometer data as defined by the `stream` filter.

## 6. Change the output format

You can also change the schema of the output too using the [presets available](https://github.com/JuanIrache/gopro-telemetry#presets).

This can be useful to use with other software the accepts standard geo formats like `.gpx` or `.kml` for example.

Below is an example, again using only the `GPS5` stream, but this time exporting to `.gpx` not `.json`:

```js
const gpmfExtract = require('gpmf-extract');
const goproTelemetry = require(`gopro-telemetry`);
const fs = require('fs');

const file = fs.readFileSync('GS018422.mp4');

// AS KML

gpmfExtract(file)
.then(extracted => {
goproTelemetry(extracted, {
stream: 'GPS5',
GPS5Fix: 3,
GPS5Precision: 500,
WrongSpeed: 50,
preset: 'kml'
}, telemetry => {
fs.writeFileSync('GS018422-gps-only.kml', JSON.stringify(telemetry));
console.log('Telemetry saved as KML');
});
})
.catch(error => console.error(error));

// AS GPX

gpmfExtract(file)
.then(extracted => {
goproTelemetry(extracted, {
stream: 'GPS5',
GPS5Fix: 3,
GPS5Precision: 500,
WrongSpeed: 50,
preset: 'gpx'
}, telemetry => {
fs.writeFileSync('GS018422-gps-only.gpx', JSON.stringify(telemetry));
console.log('Telemetry saved as GPX');
});
})
.catch(error => console.error(error));
```

Here I've set two outputs using the additon of the `preset` field, one set as `gpx` the other as `kml`, that output to files to `GS018422-gps-only.kml` and `GS018422-gps-only.gpx` respectively.

The `trkpt`'s in the resulting `.gpx` file are printed like so;

```xml
<trkpt lat=\"28.7015115\" lon=\"-13.9204121\">\n              
  <ele>243.304</ele>\n              
  <time>2020-08-02T11:59:05.905Z</time>\n              
  <fix>3d</fix>\n              
  <hdop>107</hdop>\n              
  <cmt>altitude system: MSLV; 2dSpeed: 1.067; 3dSpeed: 0.73</cmt>\n          
</trkpt>
```

And the `Placemark`'s in the resulting `.kml` are printed like so;

```xml
<Placemark>\n            
  <description>GPS Fix: 3; GPS Accuracy: 164; altitude system: MSLV; 2D Speed: 0.044; 3D Speed: 0.04</description>\n            
  <Point>\n                
    <altitudeMode>absolute</altitudeMode>\n                
    <coordinates>-0.8459696,51.2725456,82.008</coordinates>\n            
  </Point>\n            
  <TimeStamp>\n                
    <when>2021-09-04T07:24:07.744Z</when>\n            
  </TimeStamp>\n        
</Placemark>\
```

Hopefully this post has given you enough to get started. Now it is time for you to play with the settings for your own requirements.

## A note on videos larger than 2GB

When working with large videos, you will run into an error that looks something like this:

```
node:fs:419
      throw new ERR_FS_FILE_TOO_LARGE(size);
      ^

RangeError [ERR_FS_FILE_TOO_LARGE]: File size (3027585470) is greater than 2 GB
    at new NodeError (node:internal/errors:371:5)
    at tryCreateBuffer (node:fs:419:13)
    at Object.readFileSync (node:fs:464:14)
    at Object.<anonymous> (/Users/dgreenwood/gfm-telemetry.js:15:17)
    at Module._compile (node:internal/modules/cjs/loader:1103:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1157:10)
    at Module.load (node:internal/modules/cjs/loader:981:32)
    at Function.Module._load (node:internal/modules/cjs/loader:822:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:77:12)
    at node:internal/main/run_main_module:17:47 {
  code: 'ERR_FS_FILE_TOO_LARGE'
}

```

It is an issue caused mostly by Node's size limitations.

There is an easy way around this to obtain the telemetry file; make a copy of the input video, stripping out its video and audio streams but keeping the telemetry stream to reduce the filesize. This can be done using ffmpeg like so:

```shell
ffmpeg -i INPUT.mp4 -map 0:2 OUTPUT-telemetry-only.MP4
```

This will reduce a 4GB video to a video of 30MB containing only telemetry.

Note, in this example the telemetry is in the stream `0:2`. You should check the correct telemetry stream for your video using ffprobe (because it can vary for cameras and modes used). [How to do this is described here](/blog/ffmpeg-video-to-frame-cheat-sheet).

Now you can run gopro-telemetry on the newly created video (`OUTPUT-telemetry-only.MP4`) to obtain the telemetry output without issue.