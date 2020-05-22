---
date: 2020-05-22
title: "Extracting A GPS Track from a 360 Video"
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
]




## 2. Split video into frames (individual photo files)

[FFmpeg](https://ffmpeg.org/) is a free and open-source project consisting of a vast software suite of libraries and programs for handling video, audio, and other multimedia files and streams.

Taking the `.mp4` file, I can break it down into 1 second frames in `.png` format.

CLI input:

```
$ ffmpeg -i VIDEO_7152.mp4 -r 1 -map_metadata 0:g FRAMES/img%04d.png
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