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


In the last few weeks I've covered topics on the metadata found in a 360 video and the approval required to publish videos to Street View.

But at

OK, so we're not allowed to upload video to the Google Street View Publish API for the next few months.

No problem, we'll just convert our videos and the metadata they hold to images (with the help of [EXIFtool](https://exiftool.org/) and [FFmpeg](https://ffmpeg.org/)) and then upload as images instead.

The workflow will look like this:

1. Extract metadata track from video file (for telemetry information)
2. Split video into frames (individual photo files)
3. Choose frames you want to use (distance between frames / frame count)
4. Add telemetry data to selected frames
	- A note on vide
5. Upload images to 360 platforms (Explorer, Google Street View, Mapillary, etc.)

## 1. Extract metadata track from video file (for telemetry information)

Inverse or reverse geotagging creates a GPS track file from a series of geotagged images. 

Luckily for us, [the brillaint EXIFtool supports inverse geotagging](https://exiftool.org/geotag.html#Inverse).

ExifTool also has the ability to The -p option may be used to output files in any number of formats. This section gives examples for creating GPX and KML output files from a set of geotagged images, or from a geotagged video file. (But note that the -ee option must be added to the commands below to extract the full track from a video file.)



exiftool -p gpx.fmt -ee -ext mp4 -w OUTDIR/%f.gpx DIR

## 2. Split video into frames (individual photo files)

[FFmpeg](https://ffmpeg.org/) is a free and open-source project consisting of a vast software suite of libraries and programs for handling video, audio, and other multimedia files and streams.



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
