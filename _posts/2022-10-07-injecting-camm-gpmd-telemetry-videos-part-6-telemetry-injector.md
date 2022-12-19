---
date: 2022-10-07
title: "Injecting Telemetry into Video Files (Part 6): Telemetry Injector"
description: "In this post I will show you a proof of concept that can be used to turn a series of geo-tagged images into a video with a CAMM or GPMD telemetry track."
categories: developers
tags: [gpmd, camm, telemetry, gpmf, gpx]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-10-07/telemetry-injector-meta.jpg
featured_image: /assets/images/blog/2022-10-07/telemetry-injector-sm.jpg
layout: post
published: true
---

**In this post I will show you a proof of concept that can be used to turn a series of geo-tagged images into a video with a CAMM or GPMD telemetry track.**

Over the last month I've introduced the concepts of how telemetry is stored in mp4 video files in both CAMM and GPMF standards. If you missed any of the posts, start by reading them in order here;

* [Part 1: An introduction](/blog/2022/injecting-camm-gpmd-telemetry-videos-part-1-introduction)
* [Part 2: A high-level introduction to the mp4 specification](/blog/2022/injecting-camm-gpmd-telemetry-videos-part-2-mp4-overview)
* [Part 3: Structuring telemetry trak's in mp4 videos](/blog/2022/injecting-camm-gpmd-telemetry-videos-part-3-mp4-structure-telemetry-trak)
* [Part 4: CAMM](/blog/2022/injecting-camm-gpmd-telemetry-videos-part-4-camm)
* [Part 5: CAMM](/blog/2022/injecting-camm-gpmd-telemetry-videos-part-5-gpmf)

The aim of this exercise was to learn how telemetry is housed in videos so we could create videos with embedded telemetry using Trail Maker so that the telemetry would not be lost over time with GPX files going missing,

Telemetry Injector is a proof-of-concept script to try and implement our understanding.

## Overview

The logic in Telemetry Injector has been purposely designed to be fairly simplistic. At a high-level it works as follows:

1. takes a:
	* series of geo-tagged images;
	* or a video file with an accompanying GPX file
2. If image input, [parses out the telemetry into a GPX file](/blog/2020/extracting-gps-track-from-360-timelapse-video/)
3. If image input, [creates a video file from photos](/blog/2021/turn-360-photos-into-360-video/)
4. Creates a [CAMM](/blog/2022/injecting-camm-gpmd-telemetry-videos-part-4-camm) or [GPMF](/blog/2022/injecting-camm-gpmd-telemetry-videos-part-5-gpmf) binary file from GPX and appends it to any existing `mdat` media
5. Create a corresponding `moov`>`trak` box to describe the injected telemetry.

To demonstrate this, I'll first start by walking you through how to run the script;

## Installing Telemetry Injector

First, lets start by installing the software;

```shell
git clone https://github.com/trek-view/telemetry-injector
cd telemetry-injector
python3 -m venv telemetry-injector_venv
source telemetry-injector_venv/bin/activate
pip3 install -r requirements.txt
```

Once installed, Trail Maker can be used in the following way, for photos;

```shell
python3 telemetry-injector.py [-c|-g] -i INPUT_IMAGE_DIRECTORY/ -o OUTPUT_VIDEO_FILE.mp4
```

For videos;

```shell
python3 telemetry-injector.py [-c|-g] -v INPUT_VIDEO.mp4 -x FILE.GPX -o OUTPUT_VIDEO_FILE.mp4
```

Where;

* `-g`: Flag to use GPMF metadata injection.
* `-c`: Flag to use CAMM metadata injection.
* `-i`: Input image directory.
* `-v`: Input mp4 files, should be mp4 video.
* `-x`: Input GPX files, should be mp4 video.
* `-o`: Output video file containing metadata.

Note, Telemetry Injector can be used with either flat or equirectangular images (it will automatically detect these on input and write the correct spherical tags in video output if input is equirectangular).

## Injecting Telemetry

### Video input

Telemetry Injector allows you to input a video without existing telemetry and inject it using an accompanying GPX file.

There is one important considerations with video inputs owing to the fact this script is just a proof of concept; the count of frames in the video must match the number of GPX points in the file or you will receive an error. This is because Telemetry Injector uses the same time scale for the telemetry as per the original frame rate.

#### Video Input Example 1: CAMM (Equirectangular)

Check frames;

```shell
ffprobe -v error -select_streams v:0 -count_packets \
    -show_entries stream=nb_read_packets -of csv=p=0 GS018421.mp4
```

605 frames.

```shell
ffprobe GS018421.mp4
```

Looking at the tracks;

```
  Stream #0:0[0x1](und): Video: h264 (High) (avc1 / 0x31637661), yuv420p(tv, bt709, progressive), 5376x2688 [SAR 1:1 DAR 2:1], 116401 kb/s, 29.97 fps, 29.97 tbr, 600 tbn (default)
    Metadata:
      creation_time   : 2022-01-27T16:59:43.000000Z
      handler_name    : Core Media Video
      vendor_id       : [0][0][0][0]
      encoder         : H.264
    Side data:
      spherical: equirectangular (0.000000/0.000000/0.000000) 
  Stream #0:1[0x2](und): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 188 kb/s (default)
    Metadata:
      creation_time   : 2022-01-27T16:59:43.000000Z
      handler_name    : Core Media Audio
      vendor_id       : [0][0][0][0]
```

Only audio and video exist.

Equirectangular input with 605 frames, out is CAMM;

```shell
python3 telemetry-injector.py -c -v GS018421.mp4 -x 605-points.gpx -o GS018421-out-camm-equi.mp4
```

Checking the output using ffprobe;

```shell
ffprobe GS018421-out-camm-equi.mp4
```

Shows a new stream, the new CAMM track;

```
  Stream #0:2[0x2](und): Data: none (camm / 0x6D6D6163), 2 kb/s
    Metadata:
      creation_time   : 2020-08-08T14:48:25.000000Z
      handler_name    : CameraMetadataMotionHandler
```

Examining even more deeply with exiftool;

```
exiftool -ee -G3 -api LargeFileSupport=1 -X GS018421-out-camm-equi.mp4 > GS018421-out-camm-equi.xml
```

And taking a snippet of that output, we can see the injected telemetry;

```xml
<Track3:HandlerType>Camera Metadata</Track3:HandlerType>
<Track3:HandlerDescription>CameraMetadataMotionHandler</Track3:HandlerDescription>
<Track3:OtherFormat>camm</Track3:OtherFormat>
<Track3:SampleTime>0 s</Track3:SampleTime>
<Track3:SampleDuration>0.20 s</Track3:SampleDuration>
<Track3:AngleAxis>0 5.51012976947947e-40 -1610612736</Track3:AngleAxis>
<Track3:SampleTime>0.20 s</Track3:SampleTime>
<Track3:SampleDuration>0.20 s</Track3:SampleDuration>
<Track3:AngleAxis>0 5.51012976947947e-40 -2147483648</Track3:AngleAxis>
<Track3:SampleTime>0.40 s</Track3:SampleTime>
<Track3:SampleDuration>0.20 s</Track3:SampleDuration>
<Track3:AngleAxis>0 5.51012976947947e-40 -3221225472</Track3:AngleAxis>
```

#### Video Input Example 2: GPMF (Equirectangular)

Same input as example 1 with 605 frames, but now out is GPMF;

```shell
python3 telemetry-injector.py -g -v GS018421.mp4 -x 605-points.gpx -o GS018421-out-gpmf-equi.mp4
```

Looking at the output;

```shell
ffprobe GS018421-out-gpmf-equi.mp4
```

Now we have a gpmf stream;

```
  Stream #0:2[0x2](und): Data: bin_data (gpmd / 0x646D7067), 10 kb/s
    Metadata:
      creation_time   : 2020-08-08T14:48:25.000000Z
      handler_name    : GoPro MET  
```

Examining even more deeply with exiftool;

```shell
exiftool -ee -G3 -api LargeFileSupport=1 -X GS018421-out-gpmf-equi.mp4 > GS018421-out-gpmf-equi.xml
```

And taking a snippet of that output, we can see the injected telemetry;

```xml
<Track3:MetaFormat>gpmd</Track3:MetaFormat>
 <Track3:SampleTime>0 s</Track3:SampleTime>
 <Track3:SampleDuration>0 s</Track3:SampleDuration>
 <Track3:DeviceName>Trek View Telemetry Injector</Track3:DeviceName>
 <Track3:TimeStamp>0.001001</Track3:TimeStamp>
 <Track3:GPSMeasureMode>3-Dimensional Measurement</Track3:GPSMeasureMode>
 <Track3:GPSDateTime>2020:08:08 15:48:25.000</Track3:GPSDateTime>
 <Track3:GPSHPositioningError>5.37</Track3:GPSHPositioningError>
 <Track3:GPSLatitude>28 deg 44&#39; 28.69&quot; N</Track3:GPSLatitude>
 <Track3:GPSLongitude>13 deg 49&#39; 29.69&quot; W</Track3:GPSLongitude>
 <Track3:GPSAltitude>-2 m</Track3:GPSAltitude>
 <Track3:GPSSpeed>0.865</Track3:GPSSpeed>
 <Track3:GPSSpeed3D>0.89</Track3:GPSSpeed3D>
 <Track3:SampleTime>0 s</Track3:SampleTime>
 <Track3:SampleDuration>0.20 s</Track3:SampleDuration>
```

### Photo input

Telemetry Injector is hard-coded to write telemetry in at 5 FPS ([as per this implementation](/blog/2022/create-google-street-view-video-publish-api)). This means timings in the photo metadata is ignored, except for the first photo GPS time which is used for the first entry.

#### Photo Input Example 1: CAMM (Equirectangular image)

Looking at the first photo;

```shell
exiftool -X MULTISHOT_3688_000000.jpg > MULTISHOT_3688_000000.xml
```

Shows;

```xml
<GPS:GPSLatitudeRef>North</GPS:GPSLatitudeRef>
<GPS:GPSLatitude>51 deg 15&#39; 36.24&quot;</GPS:GPSLatitude>
<GPS:GPSLongitudeRef>West</GPS:GPSLongitudeRef>
<GPS:GPSLongitude>0 deg 57&#39; 11.30&quot;</GPS:GPSLongitude>
<GPS:GPSAltitudeRef>Above Sea Level</GPS:GPSAltitudeRef>
<GPS:GPSAltitude>127.726 m</GPS:GPSAltitude>
<GPS:GPSTimeStamp>12:25:30</GPS:GPSTimeStamp>
<GPS:GPSDateStamp>2019:03:23</GPS:GPSDateStamp>
<XMP-x:XMPToolkit>XMP Core 4.4.0-Exiv2</XMP-x:XMPToolkit>
<XMP-GPano:StitchingSoftware>GoPro Fusion Studio 1.3.0.400</XMP-GPano:StitchingSoftware>
<XMP-GPano:SourcePhotosCount>2</XMP-GPano:SourcePhotosCount>
<XMP-GPano:UsePanoramaViewer>True</XMP-GPano:UsePanoramaViewer>
<XMP-GPano:ProjectionType>equirectangular</XMP-GPano:ProjectionType>
<XMP-GPano:CroppedAreaImageHeightPixels>2880</XMP-GPano:CroppedAreaImageHeightPixels>
```

In total there are 57 image in the directory `UKBC003-in`.

Using this to create a CAMM video;

```shell
python3 telemetry-injector.py -c -i UKBC003-in/ -o UKBC003-out-camm.mp4
```

Looking at the new video with ffprobe;

```shell
ffprobe UKBC003-out-camm.mp4
```

Which shows;

```
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from 'UKBC003-out-camm.mp4':
  Metadata:
    major_brand     : isom
    minor_version   : 512
    compatible_brands: isomiso2avc1mp41
    encoder         : Lavf59.27.100
  Duration: 00:00:11.40, start: 0.000000, bitrate: 49261 kb/s
  Stream #0:0[0x1](und): Video: h264 (High) (avc1 / 0x31637661), yuv420p(tv, bt470bg/unknown/unknown, progressive), 5760x2880, 49256 kb/s, 5 fps, 5 tbr, 10240 tbn (default)
    Metadata:
      handler_name    : VideoHandler
      vendor_id       : [0][0][0][0]
      encoder         : Lavc59.37.100 libx264
    Side data:
      spherical: equirectangular (0.000000/0.000000/0.000000) 
  Stream #0:1[0x2](und): Data: none (camm / 0x6D6D6163), 2 kb/s
    Metadata:
      creation_time   : 2019-03-23T12:25:30.000000Z
      handler_name    : CameraMetadataMotionHandler
```

As expected, there's only a video and telemetry track and no audio (as it was created from photos).

Finally looking at it with exiftool;

```shell
exiftool -ee -G3 -api LargeFileSupport=1 -X UKBC003-out-camm.mp4 > UKBC003-out-camm.xml
```

Looking at the first telemetry entry;

```xml
<Track2:HandlerType>Camera Metadata</Track2:HandlerType>
<Track2:HandlerDescription>CameraMetadataMotionHandler</Track2:HandlerDescription>
<Track2:OtherFormat>camm</Track2:OtherFormat>
<Track2:SampleTime>0 s</Track2:SampleTime>
<Track2:SampleDuration>0 s</Track2:SampleDuration>
<Track2:GPSDateTime>2019:03:23 12:25:30Z</Track2:GPSDateTime>
<Track2:GPSMeasureMode>3-Dimensional Measurement</Track2:GPSMeasureMode>
<Track2:GPSLatitude>51 deg 15&#39; 36.24&quot; N</Track2:GPSLatitude>
<Track2:GPSLongitude>0 deg 57&#39; 11.30&quot; W</Track2:GPSLongitude>
<Track2:GPSAltitude>127.7 m</Track2:GPSAltitude>
<Track2:GPSHorizontalAccuracy>1</Track2:GPSHorizontalAccuracy>
<Track2:GPSVerticalAccuracy>1</Track2:GPSVerticalAccuracy>
<Track2:GPSVelocityEast>-0.425520211458206</Track2:GPSVelocityEast>
<Track2:GPSVelocityNorth>0.246613353490829</Track2:GPSVelocityNorth>
<Track2:GPSVelocityUp>-0.300000011920929</Track2:GPSVelocityUp>
```

As you can see the GPS time matches that of the first image. You'll also see the sample covers 0.2 seconds to match the fixed video frame rate used of 5FPS, as shown using ffprobe;

```shell
ffprobe -v error -select_streams v -of default=noprint_wrappers=1:nokey=1 -show_entries stream=r_frame_rate UKBC003-out-camm.mp4
```

5/1 (5 FPS per second).

Looking at the exiftool output created earlier the duration is 11.4 seconds;

```xml
<Track1:TrackDuration>11.40 s</Track1:TrackDuration>
```

Which matches our input frames (57) and video frame rate (0.2), 57 * 0.2 = 11.4.

#### Photo Input Example 2: GPMF (Equirectangular image)

This time I'll use the same input to create a video with GPMF telemetry;

```shell
python3 telemetry-injector.py -g -i UKBC003-in/ -o UKBC003-out-gpmf.mp4
```

Looking at the new video with ffprobe;

```shell
ffprobe UKBC003-out-gpmf.mp4
```

Which shows;

```
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from 'UKBC003-out-gpmf.mp4':
  Metadata:
    major_brand     : isom
    minor_version   : 512
    compatible_brands: isomiso2avc1mp41
    encoder         : Lavf59.27.100
  Duration: 00:00:11.20, start: 0.000000, bitrate: 49080 kb/s
  Stream #0:0[0x1](und): Video: h264 (High) (avc1 / 0x31637661), yuv420p(tv, bt470bg/unknown/unknown, progressive), 5760x2880, 49066 kb/s, 5 fps, 5 tbr, 10240 tbn (default)
    Metadata:
      handler_name    : VideoHandler
      vendor_id       : [0][0][0][0]
      encoder         : Lavc59.37.100 libx264
    Side data:
      spherical: equirectangular (0.000000/0.000000/0.000000) 
  Stream #0:1[0x2](und): Data: bin_data (gpmd / 0x646D7067), 11 kb/s
    Metadata:
      creation_time   : 2019-03-23T12:25:30.000000Z
      handler_name    : GoPro MET
```

Finally looking at it with exiftool;

```shell
exiftool -ee -G3 -api LargeFileSupport=1 -X UKBC003-out-gpmf.mp4 > UKBC003-out-gpmf.xml
```

And you can see the gpmf telemetry;

```xml
 <Track2:DeviceName>Trek View Telemetry Injector</Track2:DeviceName>
 <Track2:TimeStamp>0.001001</Track2:TimeStamp>
 <Track2:GPSMeasureMode>3-Dimensional Measurement</Track2:GPSMeasureMode>
 <Track2:GPSDateTime>2019:03:23 12:25:30.000</Track2:GPSDateTime>
 <Track2:GPSHPositioningError>5.37</Track2:GPSHPositioningError>
 <Track2:GPSLatitude>51 deg 15&#39; 36.24&quot; N</Track2:GPSLatitude>
 <Track2:GPSLongitude>0 deg 57&#39; 11.30&quot; W</Track2:GPSLongitude>
 <Track2:GPSAltitude>127.7 m</Track2:GPSAltitude>
 <Track2:GPSSpeed>0.865</Track2:GPSSpeed>
 <Track2:GPSSpeed3D>0.89</Track2:GPSSpeed3D>
 <Track2:SampleTime>0 s</Track2:SampleTime>
 <Track2:SampleDuration>0.20 s</Track2:SampleDuration>
```

## The helper tools

Throughout this series I've use a varietry of tools to explain how telemetry is stored and structured in videos. These are stored in this repository for reference (the full implementation of there purpose is in the four examples shown above).

To recap these, and use them to examine my newly created videos...

* `mp4_detail.py`: Creates a json file that shows the boxes inside the video and the data they contain. This is especially useful for trying to understand how metadata boxes are structured.
* `print_video_atoms_overview.py`: Prints an overview of the box structure and the size of each box
* `print_video_atoms_detail.py`: Prints the both `mp4_details.py` and `print_video_atoms_overview.py` as well as the raw binary telemetry samples.
* `/tutorial`: The scripts in these directories are explained in part three and part four.

## Wrapping things up

This series has been designed as a basic introduction to the topic of mp4 telemetry. As noted from the outset, I'm no expert and have been learning by hacking (please do point out any mistakes I'be made). I do hope you'll find them useful and perhaps inspire you to come up with some of your own projects.