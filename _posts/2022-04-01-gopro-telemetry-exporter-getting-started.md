---
date: 2022-03-18
title: "Gettting started with GoPro Telemetry Exporter"
description: "An alternative to exiftool when working with GPMD."
categories: developers
tags: [exiftool, ffmpeg, gmpd, telemetry, metadata, gpmf]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-03-18/gopro-telemetry-overlay.jpeg
featured_image: /assets/images/blog/2022-03-18/gopro-telemetry-overlay-sm.jpeg
layout: post
published: false
---

**An alternative to exiftool when working with GPMD.**

If you follow this blog you will have seen me use exiftool to extract telemetry (and other data from video files).

As we work exclusively with GoPro cameras, I wanted to try out another way to do this, specifically designed for GoPro cameras.

Occasionally I've used [`gpmf-extract`](https://github.com/JuanIrache/gpmf-extract) from Juan Irache. For a long time I've also wanted to test his [`gopro-telemetry`](https://github.com/JuanIrache/gopro-telemetry) script which is used to power [goprotelemetryextractor.com/](https://goprotelemetryextractor.com/).

Here's some useful information I've created to help you get started quickly and to understand the key parts of the scripts capabilities.

## Follow along

For this example I will be using the following equirectangular video (`GS018422.mp4`) with GPS enabled.

It is 264mb video (18 seconds long) and was shot at 24 FPS on a GoPro MAX Camera and stitched using GoPro Player at 5.6k (5376×2688).

[You can download it here to follow along](https://drive.google.com/file/d/1SYjVOwQcALg8gQLq8BLLbALEW33PlVT2/view?usp=sharing).

## 1. Install required modules

`gopro-telemetry` takes extracted telemetry from a video file (using [`gpmf-extract`](https://github.com/JuanIrache/gpmf-extract)).

To do this, first clone the repositorys and install them:

```shell
# cloning the repository is not necessary for this tutorial as a clean place for the code
git clone https://github.com/JuanIrache/gopro-telemetry
cd gopro-telemetry
npm init -y
npm i gpmf-extract gopro-telemetry --save
```

## 2. Copy the example

In the [repository you will find the following example code](https://github.com/JuanIrache/gopro-telemetry#options) (I've slightly changed it with `path_to_your_file.mp4` replaced with `GS018422.mp4`);

```js
const gpmfExtract = require('gpmf-extract');
const goproTelemetry = require(`gopro-telemetry`);
const fs = require('fs');

const file = fs.readFileSync('GS018422.mp4');

gpmfExtract(file)
  .then(extracted => {
    goproTelemetry(extracted, {}, telemetry => {
      fs.writeFileSync('output_path.json', JSON.stringify(telemetry));
      console.log('Telemetry saved as JSON');
    });
  })
  .catch(error => console.error(error));
```

Paste this code into a new file `GS018422.js`;

```shell
vi GS018422.js 
```

Now copy `GS018422.mp4` into the directory;

```shell
pip install gdown
cd samples
# Use test 360 GS018421.360
gdown --id 1SYjVOwQcALg8gQLq8BLLbALEW33PlVT2
```

## 3. Run the example

And finally, run the newly created `.js` file like so:

```shell
node GS018422.js
```

If all has been successful, you will see a message like this

```
Telemetry saved as JSON
```

And in the directory, you should see a `.json` file called `output_path.json` (you can modify the filename in `GS018422.js` by replacing the line with `output_path.json` with your desired filename).

## 4. Examining the output

[Here's a prettified version of the output file](https://gist.github.com/himynamesdave/9ff529f92d3c091eca18bda6388a4685).

Depending on the camera, model, settings and accessories, you will see values reported for some or all of the following streams:

* `ACCL`: 3-axis accelerometer
* `GYRO`: 3-axis gyroscope
* `ISOG`: Image sensor gain
* `SHUT`: Exposure time
* `GPS5`: Latitude, longitude, altitude (WGS 84), 2D ground speed, and 3D speed
* `GPSU`: UTC time and data from GPS
* `GPSF`: GPS Fix
* `GPSP`: GPS Precision - Dilution of Precision (DOP x100)
* `STMP`: Microsecond timestamps
* `MAGN`: Magnetometer
* `FACE`: Face detection boundaring boxes
* `FCNM`: Faces counted per frame
* `ISOE`: Sensor ISO
* `ALLD`: Auto Low Light frame Duration
* `WBAL`: White Balance in Kelvin
* `WRGB`: White Balance RGB gains
* `YAVG`: Luma (Y) Average over the frame
* `HUES`: Predominant hues over the frame
* `UNIF`: Image uniformity
* `SCEN`: Scene classifier in probabilities

For our work we're mainly interested values from the GPS, accelerometer and gyroscope sensors. Here are some snippets of how this data is presented (I've added comments into the code to describe the definition of the date value where it's vague):

### GPS

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

### Accelerometer

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

### Gyroscope

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

## 5. Custom options

Using the script as defined above will output all available data.

There is also [a comprehensive set of options that can also be used with the script to filter the type and date values produced](https://github.com/JuanIrache/gopro-telemetry#options).

To help understand how these can be passed, take a look in [the options shown in the readme here](https://github.com/JuanIrache/gopro-telemetry#options).


[`example.js`](https://github.com/JuanIrache/gopro-telemetry/blob/master/samples/example.js) in the `/samples` directory shows how some of the options can be used:

```js
async function toJSON(filename) {
  try {
    const file = await readFileAsync(path.join(__dirname, filename));
    const result = await goproTelemetry(
      { rawData: file },
      {
        stream: 'GPS5',
        GPS5Fix: 3,
        GPS5Precision: 500
      }
    );
```

Here the custom options used:

* `stream`: Filters the results by device stream (often a sensor) name. [You can find information on what many sensors are called here](https://github.com/gopro/gpmf-parser#where-to-find-gpmf-data).
  * I am using the GPS stream (`GPS5`)
* `GPS5Fix`: Will filter out GPS5 samples where the type of GPS lock is lower than specified (0: no lock, 2: 2D lock, 3: 3D Lock).
  * I only want a good fix (3D / `3`)
* `GPS5Precision`: Will filter out GPS5 samples where the [Dilution of Precision](https://en.wikipedia.org/wiki/Dilution_of_precision_(navigation)) is higher than specified (this DOP value is * 100, e.g. 500 = 5)
  * I want a fairly good DOP (5 / `500`)

Paste the last code snippet to the bottom of `GS018422.js`.

[The final file `GS018422.js` should look like this]().

Running it in the same way as before;

```shell
node GS018422.js
```

You should notice the difference (mainly the smaller file, due to only printing GPS data).

This post has hopefully given you enough to get started. Now it's time for you to play with it.