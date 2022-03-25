---
date: 2022-03-11
title: "Extracting GoPro GPS and other Telemetry Data using ffmpeg"
description: "A guide that shows some of the commands we use most for processing 360 virtual tour videos."
categories: developers
tags: [exiftool, ffmpeg, gmpd, telemetry, metadata]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-03-11/ffmpeg-virtual-tour-cheat-sheet-meta.jpg
featured_image: /assets/images/blog/2022-03-11/ffmpeg-virtual-tour-cheat-sheet-sm.jpg
layout: post
published: false
---


Step 3
Type cmd on the folder location until it opens a command prompt window. Furthermore, type and run the command below:
ffmpeg -y -i xxxx.MP4 -codec copy -map 0:3 -f rawvideo xxxx.bin


If you follow this blog you will have seen me use exiftool to extract telemetry (and other data from video files).

As we work exclusively with GoPro cameras, I wanted to try out another way to do this, specifically designed for GoPro cameras.

## Introducing GoPro Utils



Turning a 360 Timelapse or Video into a GPX or KML track




For this example I will be using the following equirectangular video (`GS018422.mp4`). 

It is 264mb video (18 seconds long) and was shot at 24 FPS on a GoPro MAX Camera and stitched using GoPro Player at 5.6k (5376×2688).

[You can download it here to follow along](https://drive.google.com/file/d/1SYjVOwQcALg8gQLq8BLLbALEW33PlVT2/view?usp=sharing).

## 1. Extract GPMD telemetry binary

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





