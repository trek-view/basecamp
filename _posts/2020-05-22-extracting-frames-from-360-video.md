---
date: 2020-05-22
title: "Extracting Frames From 360 Videos"
description: "FFMPEG "
categories: developers
tags: [GPS, XMP, EXIF]
author_staff_member: dgreenwood
image: /assets/images/blog/2020-05-01/apolloone-example-meta.jpg
featured_image: /assets/images/blog/2020-05-01/apolloone-example-sm.png
layout: post
published: false
---

**Video to images (_to video again_)**

In the last few weeks I've covered topics [about the metadata found in a 360 video](/blog/2020/metadata-exif-xmp-360-video-files) and the [approval required to publish videos to the Street View Publish API](/blog/2020/street-view-publish-api-quick-start-guide).

tl;dr: we haven't got approval to upload video to the Google Street View Publish API.

No problem, we'll just convert our videos and the metadata they hold to images (with the help of [EXIFtool](https://exiftool.org/) and [FFmpeg](https://ffmpeg.org/)) and then upload as images instead.

The workflow will look like this:

1. Extract metadata track from video file (for telemetry information)
2. Split video into frames (individual photo files)
3. Choose frames you want to use (distance between frames / frame count)
4. Add telemetry data to selected frames
	- A note on vide
5. Upload images to 360 platforms (Explorer, Google Street View, Mapillary, etc.)

For this post I'm going to use an `.mp4` video filmed using a GoPro Fusion with GPS enabled and the file encoded using H.264 at 4K (@30 FPS).

<iframe width="560" height="315" src="https://www.youtube.com/embed/iyIkDRERzz8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


## 1. Extract metadata track from video file (for telemetry information)

Inverse or reverse geotagging creates a GPS track file from a series of geotagged images. 

Luckily for us, [the brillaint EXIFtool supports inverse geotagging](https://exiftool.org/geotag.html#Inverse).

ExifTool also has the ability to The -p option can be used to [output files in variations of `.gpx` and `.kml` formats](https://github.com/exiftool/exiftool/tree/master/fmt_files).

CLI input: 

```
$ exiftool -ee -p gpx.fmt VIDEO_7152.mp4 > VIDEO_7152.gpx
```

This command includes the following arguments:

* -ee: Extract embedded data from mp0 files (and others).
* -p FMTFILE: Print output in specified format

[Full reference here](https://exiftool.org/exiftool_pod.html).

_Make sure you reference the correct path to the `fmt_file`. [This tripped mem up -- thanks, Phil](https://exiftool.org/forum/index.php?topic=11189.msg59877#msg59877)!_

CLI output:

```
<?xml version="1.0" encoding="utf-8"?>
<gpx version="1.0"
 creator="ExifTool 11.99"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 xmlns="http://www.topografix.com/GPX/1/0"
 xsi:schemaLocation="http://www.topografix.com/GPX/1/0 http://www.topografix.com/GPX/1/0/gpx.xsd">
<trk>
<number>1</number>
<trkseg>
<trkpt lat="51.2485" lon="-0.7824">
</trkpt>
<trkpt lat="51.248479" lon="-0.782468">
  <ele>156.968</ele>
  <time>2020-04-13T15:37:22.444Z</time>
</trkpt>
<trkpt lat="51.2484785" lon="-0.7824932">
  <ele>155.943</ele>
  <time>2020-04-13T15:37:23.489Z</time>
</trkpt>
[...]
<trkpt lat="51.2484698" lon="-0.7827668">
  <ele>153.819</ele>
  <time>2020-04-13T15:37:35.534Z</time>
</trkpt>
<trkpt lat="51.2484656" lon="-0.7827818">
  <ele>154.364</ele>
  <time>2020-04-13T15:37:36.524Z</time>
</trkpt>
<trkpt lat="51.2484591" lon="-0.7828009">
  <ele>154.95</ele>
  <time>2020-04-13T15:37:37.514Z</time>
</trkpt>
</trkseg>
</trk>
</gpx>
```

[Entire output for reference](https://gitlab.com/snippets/1971839).

## 2. Split video into frames (individual photo files)

[FFmpeg](https://ffmpeg.org/) is a free and open-source project consisting of a vast software suite of libraries and programs for handling video, audio, and other multimedia files and streams.

Taking the `.mp4` file, I can break it down into 1 second frames in `.png` format.

CLI input:

```
ffmpeg -i VIDEO_7152.mp4 -r 1 FRAMES/img%04d.png
```

This command includes the following arguments:

* -r: Set frame rate (Hz value, fraction or abbreviation).

[Full reference here](https://www.ffmpeg.org/ffmpeg.html).

_Make sure you reference an existing directory path for the output (e.g. `FRAMES`)._

[In total this gives me 18 files](https://drive.google.com/drive/u/1/folders/1hPCYAluasG58moLQsFPo-On5IA6guRS9).

So now 


img0001

CLI input: 

```
$ exiftool -G -a FRAMES/img0001.png > FRAMES/img0001_metadata.txt
```


exiftool -G -a exiftool img0001.png > img0001_metadata.txt


## 4. Add telemetry data to selected frames

The ExifTool geotagging feature adds GPS tags to images based on data from a GPS track log file.

The GPS track log file is loaded, and linear interpolation is used to determine the GPS position at the time of the image, then the following tags are written to the image (if the corresponding information is available):



C:\Program Files\ffmpeg


When I first started looking at thw 

One of the reasons the first Trek Pack 

## A quick overview to the workflow

The a





shot photos over video was because for most, working with individual photos is much easier than video files -- there is less technical skill and computer processing required.

Video files are essentially lots of photos played back at a set speed with sound added.

As we discovered last week, metadata in video and photo files is handled differently.

In that post, I mentioned how some software took out frames (or photos) from videos, for example, to extract individual frames 1 meter apart for mapping.

This week I'm going to show you how that can be achieved, whilst preserving metadata.




ffmpeg -i VIDEO_7152.mp4 -filter:v fps=fps=1/60 ffmpeg_%0d.bmp


time for i in {0..39} ; do ffmpeg -accurate_seek -ss `echo $i*60.0 | bc` -i input.mp4   -frames:v 1 period_down_$i.bmp ; done
