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

For this example I will be using the following equirectangular video (`GS018422.mp4`) with GPS enabled.

It is 264mb video (18 seconds long) and was shot at 24 FPS on a GoPro MAX Camera and stitched using GoPro Player at 5.6k (5376×2688).

[You can download it here to follow along](https://drive.google.com/file/d/1SYjVOwQcALg8gQLq8BLLbALEW33PlVT2/view?usp=sharing).

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

Depending on the camera, model, settings and accessories used, you will see values reported for various `streams`, e.g. (`ACCL`: 3-axis accelerometer, `GYRO`: 3-axis gyroscope, `GPS5`: Latitude, longitude, altitude (WGS 84), 2D ground speed, and 3D speed...)

[You can find information on what many sensors are called (and what cameras / modes produce data for them) here](https://github.com/gopro/gpmf-parser#where-to-find-gpmf-data).

For our work we're mainly interested values from the GPS, accelerometer and gyroscope sensors. Here are some snippets of how this data is presented (I have added comments into the code to describe some of the values too):

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

### `x`, `y`, and `z` axes

<img class="img-fluid" src="/assets/images/blog/2022-04-01/CameraIMUOrientationSM.png" alt="GoPro IMU Orientation" title="GoPro IMU Orientation" />

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

```shell
TODO
```

This post has hopefully given you enough to get started. Now it is time for you to play with the settings for your own requirements.

## Update 2022-04-21

See a real world use-case of how the `.json` telemetry can be used in this post; [Overlaying GoPro Telemetry Dynamically onto Videos](/blog/2022/overlay-gopro-telemetry-data-video)