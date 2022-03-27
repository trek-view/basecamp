---
date: 2022-03-18
title: "Gettting started with GoPro Telemetry Exporter"
description: "An alternative to exiftool when working with GPMD."
categories: developers
tags: [exiftool, ffmpeg, gmpd, telemetry, metadata, gpmf]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-03-18/
featured_image: /assets/images/blog/2022-03-18/
layout: post
published: false
---

**An alternative to exiftool when working with GPMD.**

If you follow this blog you will have seen me use exiftool to extract telemetry (and other data from video files).

As we work exclusively with GoPro cameras, I wanted to try out another way to do this, specifically designed for GoPro cameras.

Occasionally I've used [`gpmf-extract`](https://github.com/JuanIrache/gpmf-extract) from Juan Irache. For a long time I've also wanted to test his [`gopro-telemetry`](https://github.com/JuanIrache/gopro-telemetry) script which is used to power [goprotelemetryextractor.com/](https://goprotelemetryextractor.com/).

Here's some useful information I've created to help you get started quickly and to understand some of the scripts capabilities.

## Follow along

For this example I will be using the following equirectangular video (`GS018422.mp4`) with GPS enabled.

It is 264mb video (18 seconds long) and was shot at 24 FPS on a GoPro MAX Camera and stitched using GoPro Player at 5.6k (5376×2688).

[You can download it here to follow along](https://drive.google.com/file/d/1SYjVOwQcALg8gQLq8BLLbALEW33PlVT2/view?usp=sharing).

## 1. Extract GPMD telemetry data

`gopro-telemetry` takes extracted telemetry from a video file from [`gpmf-extract`](https://github.com/JuanIrache/gpmf-extract).

To do this, first clone the repository:

```shell
git clone https://github.com/JuanIrache/gpmf-extract
cd gpmf-extract
```

In the `samples/` directory you will find a file called `example.js`. It gives a simple implementation of the script, which is all we need.

Copy the file.

```shell
cp samples/example.js samples/GS018422.js  
```

Then edit the file, 

```shell
vi samples/GS018422.js
```

Replacing the line;

```js
const file = fs.readFileSync('./samples/karma.mp4');
```

With the path to your video, e.g.

```js
const file = fs.readFileSync('./samples/GS018422.mp4');
```

Now this is correct, the script can be run like so,

```shell
TODO
```

The output of this command will print a `.json` file to the console that looks like this:

```
TODO
```

To save the console output to a file (which you will need for the next step), run the script like this:

```
TODO
```

## 2. Run `gopro-telemetry`

Now we can use the telemetry `.json` generated at step 1 with `gopro-telemetry`.

First clone the repository:

```shell
git clone https://github.com/JuanIrache/gopro-telemetry
cd gopro-telemetry
```

Like `gpmf-extract`, `gopro-telemetry` comes with a [comprehensive set of examples and documentation](https://github.com/JuanIrache/gopro-telemetry#options).

At it's most basic, you can use the script like so


If you're interested in the code behind this, you can see it here.


IGNORE FOLLOWING LINES, OLD CONTENT

---



You can do this using ffmpeg as follows:

```shell
ffmpeg -y -i GS018422.mp4 -codec copy -map 0:2 -f rawvideo GS018422.bin
```

Here the telemetry is in stream 0:2. Note, this is not the same for different GoPro cameras (or even different modes on the same camera. If you're unsure, read last weeks post; [FFmpeg Cheat Sheet for virtual 360 tours](/blog/2022/ffmpeg-video-to-frame-cheat-sheet).

You won't be able to open or read `GS018422.bin` just yet...

## 2. Clone the GoPro Utils scripts

First, download a local copy of [GoPro Utils](https://github.com/JuanIrache/gopro-utils).

```shell
git clone https://github.com/JuanIrache/gopro-utils
cd gopro-utils
```

## 3. Convert binary to `.csv` files

GoPro Utils comes with a useful `gpmd2csv` command.

This can be used in its simplest for like so: 

```
gpmd2csv -i GS018422.bin -o GS018422.csv
```



gpmd2csv -i GOPR0001.bin -o GOPR0001.csv

Aditionally to -i and -o, the gopro2gpx and gopro2kml tools allow for an -a accuracy option for filtering out bad GPS locations (default 1000, the lower the more accurate) and -f for type of fix (default 3. 0- no fix, 2 - 2D fix, 3 - 3D fix)

gopro2gpx -i GOPR0001.bin -a 500 -f 2 -o GOPR0001.gpx

The gpmd2csv instead allows for a -s option to select which data to export. It accepts the following:

a: Accelerometer
g: GPS
y: Gyroscope
t: Camera temperature
For example, in order to export gyroscope and GPS data only we would do

gpmd2csv -i GOPR0001.bin -s yg

If -s is not specified, it will export all available data





