---
date: 2020-05-08
title: "A deeper look into a 360 video and the metadata it holds"
description: "Every video you take, on any camera, is filled with metadata. Here's why it's important for outdoor 360 tour photography."
categories: developers
tags: [GPS, XMP, EXIF, mp4]
author_staff_member: dgreenwood
image: /assets/images/blog/2020-05-08/exif-tool-command-line-mp4-meta.jpg
featured_image: /assets/images/blog/2020-05-08/exif-tool-command-line-mp4-sm.png
layout: post
published: true
---

**Video > Time lapse?**

[Last week I explained the metadata typically found in 360 photos](/blog/2020/metadata-exif-xmp-360-photo-files), and promised a post on video metadata. Well, here it is.

_If you haven't already read that post, it is well worth wrapping your head around some of the concepts discussed before you jump into video data. You have been warned!_

The real benefit of capturing 360 sequences (like walks or bike rides) using video over time lapse is the larger amount of frames typically generated when compared to photo time lapses. 

More frames gives you (or software) the flexibility to cherry-pick the ones you want to use in your tour.

For example, you might want to use frames that are 1 meter apart. Using the GPS in each frame, software can easily extract photos that are 1 meter apart.

When shooting in time lapse mode, especially if moving quickly, the capture interval will provide varying distances between photos (unless you're travelling at a constant speed), and photos might have larger distance between them than you might want.

You then have 2 options; 1) admit defeat then go back and re-shoot, 2) accept the uneven distances between photos and remember perfection is the enemy of done.

For about a year now the [Google Street View app (Android version)](https://play.google.com/store/apps/details?id=com.google.android.street&hl=en_GB) has allowed users to [automatically connect their 360 camera filming video to their phone and publish it straight to Street View using the app](https://support.google.com/maps/answer/7546470?hl=en&ref_topic=6275604).

[Google also support video uploads pragmatically via the Street View Publish API](https://developers.google.com/streetview/ready/specs-svready).

All signals point to cameras now being at a point where they are able to handle high quality video content for outdoor virtual tour photography, and I’m now really starting to think about recommending shooting in video (vs. time lapse) in the next iteration of our [Trek Pack](/trek-pack) (_coming soon!_).

Though before I make a decision, the geek in me wants to get down into the nuts and bolts, I mean bits and bytes of 360 video files...

## An introduction to video metadata

[Like photos](/blog/2020/metadata-exif-xmp-360-photo-files.md), videos contain metadata.

Video files have metadata for the complete video (e.g. file name) and for different times in the video (e.g. GPS values at a specific time in the video).

Data is not written into each frame in videos. This is different to how metadata is written in photos, where cameras embed data inside every single photo file.

The metadata is written as a metadata track, and the metadata track is split into subdirectories. 

Videos typically also contain an audio track, the sound of the video, and  other tracks we won't go into today.

If you've ever wanted to extract a GPS track or audio from a video file, you are extracting the corresponding track.

All these tracks run in parallel so that the data matches up correctly; image with sound, with metadata (e.g. GPS), etc.

Here's a visual example of the GoPro Metadata format (we'll cover more in this later in this post).

<img class="img-fluid" src="/assets/images/blog/2020-05-08/gopro-metadata-format-video-metadata-frame-diagram.png" alt="GoPro Metadata Format diagram" title="360 video frame metadata diagram" />

[Download / modify this diagram](https://docs.google.com/presentation/d/1bkpC0CTOMnYN0yIIFh0WyvaLczslLQfUf1W9hOd2K5Q/edit#slide=id.g76f6e7ae08_0_27)

When the GoPro Metadata Format was first published, there was no widespread standard for recording telemetry data in videos, [as the company noted](https://gopro.com/en/us/news/gopro-video-metadata-open-source-explained):

> The popular consumer video file format MP4 had no clear provision to store telemetry or any time varying metadata.

Since that post was written just under 3 years ago, things have changed as a result of the increasing capabilities of action cams...

## 360 video metadata examples

I'm going to be using the [open-source EXIF tool](https://exiftool.org/) to extract and normalise metadata.

_Note, if your file is encoded in some proprietary format it might not be [properly supported by EXIF tool](https://exiftool.org/#supported)._

There is a significant amount of data contained in the metadata of a video, for this post I've only included the most relevant data. Where I've deleted part of the output you'll see a `[...]`. The full output is linked below each snippet should you want to take a deeper look.

### GoPro Fusion

For this first example I'm going to use an `.mp4` video filmed using a GoPro Fusion with GPS enabled encoded using H.264 at 4K (@30 FPS).

<iframe width="560" height="315" src="https://www.youtube.com/embed/iyIkDRERzz8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

GoPro writes telemetry metadata to videos in their own open-source standard, the [GoPro Metadata Format](https://gopro.com/en/us/news/gopro-video-metadata-open-source-explained). Fortunately for us, [EXIF tool has the logic to understand this format natively](https://exiftool.org/TagNames/GoPro.html). More on that later.

**Extracting metadata for video level**

Lets start by looking at the video level metadata:

CLI input: 

```
$ exiftool -G -a VIDEO_7152.mp4 
```

This command includes the following arguments:

* -a: Allow duplicate tags to be extracted
* -G: Print group name for each tag

[Full reference here](https://exiftool.org/exiftool_pod.html).

CLI output: 

```

[File]          File Name                       : VIDEO_7152.mp4
[File]          Directory                       : .
[File]          File Size                       : 86 MB
[...]
[QuickTime]     Major Brand                     : Apple QuickTime (.MOV/QT)
[QuickTime]     Minor Version                   : 2005.3.0
[QuickTime]     Compatible Brands               : qt
[...]
[QuickTime]     Image Width                     : 3840
[QuickTime]     Image Height                    : 1920
[QuickTime]     Media Header Version            : 0
[QuickTime]     Media Create Date               : 2020:04:15 09:14:04
[QuickTime]     Media Modify Date               : 2020:04:15 09:14:04
[QuickTime]     Media Time Scale                : 2997
[QuickTime]     Media Duration                  : 15.98 s
[...]
[QuickTime]     Compressor ID                   : avc1
[QuickTime]     Source Image Width              : 3840
[QuickTime]     Source Image Height             : 1920
[QuickTime]     X Resolution                    : 72
[QuickTime]     Y Resolution                    : 72
[QuickTime]     Bit Depth                       : 24
[QuickTime]     Video Frame Rate                : 29.97
[...]
[QuickTime]     Media Header Version            : 0
[QuickTime]     Media Create Date               : 2020:04:15 09:14:04
[QuickTime]     Media Modify Date               : 2020:04:15 09:14:04
[QuickTime]     Media Time Scale                : 48000
[QuickTime]     Media Duration                  : 15.96 s
[...]
[QuickTime]     Handler Class                   : Data Handler
[QuickTime]     Handler Type                    : Alias Data
[QuickTime]     Meta Format                     : gpmd
[QuickTime]     GPS Coordinates                 : 51 deg 14' 54.60" N, 0 deg 46' 56.64" W
[QuickTime]     Firmware Version                : FS1.04.01.80.00
[XMP]           Spherical                       : true
[XMP]           Stitched                        : true
[XMP]           Stitching Software              : Fusion Studio / GStreamer
[XMP]           Projection Type                 : equirectangular
[XMP]           Stereo Mode                     : mono
[XMP]           Source Count                    : 2
[XMP]           Initial View Heading Degrees    : 0
[XMP]           Initial View Pitch Degrees      : 0
[XMP]           Initial View Roll Degrees       : 0
[XMP]           XMP Toolkit                     : GStreamer
[Composite]     Image Size                      : 3840x1920
[Composite]     Megapixels                      : 7.4
[Composite]     Avg Bitrate                     : 45.2 Mbps
[Composite]     GPS Latitude                    : 51 deg 14' 54.60" N
[Composite]     GPS Longitude                   : 0 deg 46' 56.64" W
[Composite]     Rotation                        : 0
[Composite]     GPS Position                    : 51 deg 14' 54.60" N, 0 deg 46' 56.64" W
```

[Entire output for reference](https://gitlab.com/snippets/1971842).

You can see there is `[Quicktime]` data (because the .mp4 is H.264 encoded). You'll also see `[XMP]` metadata, and `[Composite]` metadata.

Think of this output as a wrapper, or description, of the video. It is `Media Duration=15.98 s` long, was filmed on `Media Create Date=2020:04:15 09:14:04`, at `Video Frame Rate=29.97`, at an `Avg Bitrate=45.2 Mbps`, at `Megapixels=7.4`. We also know it's a 360 video because `Projection Type=equirectangular`.

The eagle eyed might be wondering why `megapixels=7.4` (`Image Size=3840x1920`), which is less than the 4K the video was shot at. That requires another post entirely... which is already being drafted for next week.

If you look at the full output you'll see different `Handlers` responsible for each of these tracks. Here's the handler being defined for the metadata track:

```
[QuickTime]     Handler Class                   : Data Handler
[QuickTime]     Handler Type                    : Alias Data
[QuickTime]     Meta Format                     : gpmd
```

This is how EXIF tool (and other software) knows it's in GoPro Metadata Format.

**Extracting metadata for track level**

Using the same video, let's expand on the original command so that we can see the track information too.

CLI input: 

```
exiftool -ee -G3 VIDEO_7152.mp4 
```

This command includes the following flags:

* -ee: Extract embedded data from mp0 files (and others).
* -G3: Identify the originating document for extracted information. Embedded documents containing sub-documents are indicated with dashes in the family 3 group name. (eg. Doc2-3 is the 3rd sub-document of the 2nd embedded document.)

[Full reference here](https://exiftool.org/exiftool_pod.html).

CLI output:

```
[File]          File Name                       : VIDEO_7152.mp4
[File]          Directory                       : .
[...]
[Doc1]          Sample Time                     : 0 s
[Doc1]          Sample Duration                 : 1.00 s
[Doc1]          Device Name                     : Fusion
[Doc1]          Time Stamp                      : 1066.344245
[Doc1]          Camera Temperature              : 27.048828125 C
[Doc1]          Accelerometer                   : (Binary data 10226 bytes, use -b option to extract)
[Doc1]          Time Stamp                      : 1066.365138
[Doc1]          Camera Temperature              : 27.048828125 C
[Doc1]          Gyroscope                       : (Binary data 179297 bytes, use -b option to extract)
[Doc1]          Magnetometer                    : 11.4000005722046 -4.59999990463257 7.30000019073486 11 -4.59999990463257 8.90000057220459 11 -4 8.10000038146973 11 -4 7.30000019073486 9.90000057220459 -2.90000009536743 7 9.90000057220459 -2.90000009536743 7 9.90000057220459 -2.90000009536743 7 9.90000057220459 -4.80000019073486 7.70000028610229 8.30000019073486 -4.70000028610229 8.5 8.30000019073486 -4.70000028610229 8.5 10.6000003814697 -4.70000028610229 7.30000019073486 9.5 -3.20000004768372 7 8.30000019073486 -2.40000009536743 8.90000057220459 8.30000019073486 -2.40000009536743 8.90000057220459 9.90000057220459 -3.90000009536743 8.60000038146973 11 -4.70000028610229 7.09999990463257 11 -4.70000028610229 7.09999990463257 13.3000001907349 -5 9.30000019073486 13.3000001907349 -5 9.30000019073486 12.6000003814697 -5.40000009536743 6.59999990463257 11.4000005722046 -5.70000028610229 9.40000057220459 13.3000001907349 -6.09999990463257 7.40000009536743 12.5 -7.20000028610229 5.80000019073486 13.6999998092651 -5.70000028610229 7 13.3000001907349 -4.5 8.19999980926514
[Doc1]          GPS Measure Mode                : 3-Dimensional Measurement
[Doc1]          GPS Date Time                   : 2020:04:13 15:37:22.444
[Doc1]          GPS Horizontal Positioning Error: 2.03
[Doc1]          GPS Latitude                    : 51 deg 14' 54.51" N
[Doc1]          GPS Longitude                   : 0 deg 46' 56.80" W
[Doc1]          GPS Altitude                    : 157.641 m
[Doc1]          GPS Speed                       : 1.348
[Doc1]          GPS Speed 3D                    : 1.28
[Doc1]          GPS Latitude                    : 51 deg 14' 54.52" N
[Doc1]          GPS Longitude                   : 0 deg 46' 56.81" W
[Doc1]          GPS Altitude                    : 157.616 m
[Doc1]          GPS Speed                       : 1.57
[Doc1]          GPS Speed 3D                    : 1.38
[Doc1]          GPS Latitude                    : 51 deg 14' 54.52" N
[Doc1]          GPS Longitude                   : 0 deg 46' 56.81" W
[Doc1]          GPS Altitude                    : 157.627 m
[Doc1]          GPS Speed                       : 1.549
[Doc1]          GPS Speed 3D                    : 1.6
[...]
[Doc1]          Image Sensor Gain               : (Binary data 526 bytes, use -b option to extract)

[Doc1]          Time Stamp                      : 1066.333437
[Doc1]          Exposure Times                  : 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517
[Doc2]          Sample Time                     : 1.00 s
[Doc2]          Sample Duration                 : 1.00 s
[Doc2]          Device Name                     : Fusion
[Doc2]          Time Stamp                      : 1067.374416
[Doc2]          Camera Temperature              : 27.046875 C
[Doc2]          Accelerometer                   : (Binary data 9703 bytes, use -b option to extract)
[Doc2]          Time Stamp                      : 1067.380297
[Doc2]          Camera Temperature              : 27.046875 C
[Doc2]          Gyroscope                       : (Binary data 178490 bytes, use -b option to extract)
[Doc2]          Magnetometer                    : 15.1999998092651 -4.90000009536743 7 16.3000011444092 -4.5 6.59999990463257 14 -5.30000019073486 6.59999990463257 13.6000003814697 -6.70000028610229 8.90000057220459 13.6000003814697 -6.70000028610229 8.90000057220459 14 -6 7 13.6000003814697 -6.40000009536743 7.40000009536743 13.1999998092651 -4.90000009536743 9.40000057220459 13.1999998092651 -4.90000009536743 9.40000057220459 13.1999998092651 -7.09999990463257 5.80000019073486 11.3000001907349 -7.5 7.70000028610229 13.1999998092651 -6.30000019073486 9.30000019073486 12.4000005722046 -5.59999990463257 7.80000019073486 12.4000005722046 -5.59999990463257 7.80000019073486 11.6000003814697 -6.40000009536743 9.40000057220459 12.3000001907349 -7.30000019073486 9.30000019073486 12.3000001907349 -7.40000009536743 5.80000019073486 12.6999998092651 -8.5 7.40000009536743 11.5 -8.10000038146973 8.90000057220459 12.6999998092651 -9.19999980926514 7.40000009536743 11.1000003814697 -8.5 7.40000009536743 11.1999998092651 -7.70000028610229 7 11.1000003814697 -7 9.40000057220459 10 -7.80000019073486 7.40000009536743
[Doc2]          GPS Measure Mode                : 3-Dimensional Measurement
[Doc2]          GPS Date Time                   : 2020:04:13 15:37:23.489
[Doc2]          GPS Horizontal Positioning Error: 2.03
[Doc2]          GPS Latitude                    : 51 deg 14' 54.53" N
[Doc2]          GPS Longitude                   : 0 deg 46' 56.89" W
[Doc2]          GPS Altitude                    : 156.899 m
[Doc2]          GPS Speed                       : 1.679
[Doc2]          GPS Speed 3D                    : 1.8
[Doc2]          GPS Latitude                    : 51 deg 14' 54.53" N
[Doc2]          GPS Longitude                   : 0 deg 46' 56.89" W
[Doc2]          GPS Altitude                    : 156.827 m
[Doc2]          GPS Speed                       : 1.565
[Doc2]          GPS Speed 3D                    : 1.73
[Doc2]          GPS Latitude                    : 51 deg 14' 54.53" N
[Doc2]          GPS Longitude                   : 0 deg 46' 56.89" W
[Doc2]          GPS Altitude                    : 156.727 m
[Doc2]          GPS Speed                       : 1.505
[Doc2]          GPS Speed 3D                    : 1.63
[...]
[Doc2]          Image Sensor Gain               : (Binary data 509 bytes, use -b option to extract)
[Doc2]          Time Stamp                      : 1067.367742
[Doc2]          Exposure Times                  : 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517
[Doc3]          Sample Time                     : 2.00 s
[Doc3]          Sample Duration                 : 1.00 s
[Doc3]          Device Name                     : Fusion
[Doc3]          Time Stamp                      : 1068.372783
[Doc3]          Camera Temperature              : 27.041015625 C
[Doc3]          Accelerometer                   : (Binary data 9877 bytes, use -b option to extract)
[Doc3]          Time Stamp                      : 1068.395456
[Doc3]          Camera Temperature              : 27.041015625 C
[Doc3]          Gyroscope                       : (Binary data 173317 bytes, use -b option to extract)
[Doc3]          Magnetometer                    : 10 -7.80000019073486 7.40000009536743 10.8000001907349 -7 7.70000028610229 12.6999998092651 -5.90000009536743 7 11.1999998092651 -7 7 11.1999998092651 -5.90000009536743 7 11.1999998092651 -5.5 8.90000057220459 11.1999998092651 -5.5 8.90000057220459 11.1999998092651 -6.30000019073486 5.80000019073486 11.1000003814697 -6.90000009536743 10.1000003814697 11.1000003814697 -7.30000019073486 8.90000057220459 10.8000001907349 -7.70000028610229 8.19999980926514 10.3000001907349 -6.30000019073486 7 8.80000019073486 -3.90000009536743 10.1999998092651 10.6999998092651 -3.90000009536743 9.40000057220459 11.1000003814697 -5.5 6.70000028610229 11.1000003814697 -6.90000009536743 7.40000009536743 12.1999998092651 -8 9.30000019073486 12.6000003814697 -8 7 12.6000003814697 -8 6.30000019073486 12.6000003814697 -8 6.30000019073486 11.8000001907349 -6.90000009536743 8.30000019073486 13 -8 8.19999980926514 11.1000003814697 -8.80000019073486 6.30000019073486 10.6999998092651 -8.40000057220459 6.70000028610229
[Doc3]          GPS Measure Mode                : 3-Dimensional Measurement
[Doc3]          GPS Date Time                   : 2020:04:13 15:37:24.479
[Doc3]          GPS Horizontal Positioning Error: 2.21
[Doc3]          GPS Latitude                    : 51 deg 14' 54.53" N
[Doc3]          GPS Longitude                   : 0 deg 46' 56.98" W
[Doc3]          GPS Altitude                    : 155.903 m
[Doc3]          GPS Speed                       : 1.589
[Doc3]          GPS Speed 3D                    : 1.82
[Doc3]          GPS Latitude                    : 51 deg 14' 54.53" N
[Doc3]          GPS Longitude                   : 0 deg 46' 56.99" W
[Doc3]          GPS Altitude                    : 155.899 m
[Doc3]          GPS Speed                       : 1.698
[Doc3]          GPS Speed 3D                    : 1.68
[Doc3]          GPS Latitude                    : 51 deg 14' 54.53" N
[Doc3]          GPS Longitude                   : 0 deg 46' 56.99" W
[Doc3]          GPS Altitude                    : 155.868 m
[Doc3]          GPS Speed                       : 1.811
[Doc3]          GPS Speed 3D                    : 1.78
[...]
[Doc16]         Exposure Times                  : 1/607 1/607 1/603 1/603 1/603 1/603 1/603 1/603 1/603 1/603 1/603 1/603 1/603 1/603 1/603 1/603 1/603 1/603 1/603 1/599 1/599 1/599 1/596 1/596 1/596 1/592 1/592 1/592 1/588 1/588
```

[Entire output for reference](https://gitlab.com/snippets/1971839).

You can see in addition to the `[Main]` section (the video level information we looked at earlier), the output is split into [Doc]'s; `[Doc1]`, `[Doc2]`...

Each [Doc] covers a defined period of time.

`[Doc1]` starts at 0s (`Sample Time=0 s`) and covers 1 second of frames (`Sample Duration=1.00 s`)

`[Doc2]` starts at 0s (`Sample Time=1 s`) and covers 1 second of frames (`Sample Duration=1.00 s`)

`[Doc16]` starts at 15s (`Sample Time=1 s`) and covers 1 second of frames (`Sample Duration=1.00 s`).

Covering the whole `Media Duration=15.98 s`.

`[Doc1]` starts at:

```
[Doc1]          GPS Latitude                    : 51 deg 14' 54.51" N
[Doc1]          GPS Longitude                   : 0 deg 46' 56.80" W
[Doc1]          GPS Altitude                    : 157.641 m
[Doc1]          GPS Speed                       : 1.348
[Doc1]          GPS Speed 3D                    : 1.28
```

`[Doc16]` finishes at:

```
[Doc16]         GPS Latitude                    : 51 deg 14' 54.45" N
[Doc16]         GPS Longitude                   : 0 deg 46' 58.08" W
[Doc16]         GPS Altitude                    : 154.95 m
[Doc16]         GPS Speed                       : 1.411
[Doc16]         GPS Speed 3D                    : 1.32
```

For `[Doc1]` we have 19 GPS records (`GPS Longitude`, `GPS Latitude`, `GPS Altitude`, `GPS Speed`, and `GPS Speed 3D`). For `[Doc2]` we have only 18 GPS records.

GPS data is reported 291 times (or a mean average of 18.1875 times in each [Doc] between `[Doc1]` nd `[Doc16]`).

You might be thinking; but the camera was shooting at a fixed rate of 30FPS, why are there not 30 entries for each frame?

Three things might be going on here;

1. GPS signal was lost for some of the frames,
2. the frame rate was lower than 30FPS (consumer level the frame rates can slightly fluctuate during recordings for any number of reasons; heat, vibration, compute failures)
3. not all camera manufacturers write metadata for every single frame, for 2 reasons), 1) some sensors can't report this data at the same rate as frames are being shot, 2) to reduce size and processing costs when this data is not really necessary. Think; "does the average consumer really need GPS in 30 frames every second?". Travelling at 100 km/h you are travelling 27.777... m/s. That would get one frame every meter at 30FPS... but how many of you are you shooting non road imagery at this speed? _Let me know, it sounds like fun!_

One tell-tale sign that option 3.1 is the cause (_not all metadata is written to every frame and some sensors report at different speeds_), is looking at the reported shutter speeds:

```
[Doc1]          Exposure Times                  : 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 
```

Here we see 30 entries for `Exposure Times`, indicating that 30 frames were actually taken (30 distinct exposure times) across the 1 second of `[Doc 1]`. 30 entries are reported for `Exposure Times` in every [Doc], matching the 30FPS the camera was set to shoot. 

Another example of variation across the amount of data reported by different sensors in the camera can be seen in values reported by the magnetometer; a device that measures magnetism—the direction, strength, or relative change of a magnetic field at a particular location. Usually the magnetometer is used to find the yaw or to act a digital compass.

```
[Doc1]          Magnetometer                    : 11.4000005722046 -4.59999990463257 7.30000019073486 11 -4.59999990463257 8.90000057220459 11 -4 8.10000038146973 11 -4 7.30000019073486 9.90000057220459 -2.90000009536743 7 9.90000057220459 -2.90000009536743 7 9.90000057220459 -2.90000009536743 7 9.90000057220459 -4.80000019073486 7.70000028610229 8.30000019073486 -4.70000028610229 8.5 8.30000019073486 -4.70000028610229 8.5 10.6000003814697 -4.70000028610229 7.30000019073486 9.5 -3.20000004768372 7 8.30000019073486 -2.40000009536743 8.90000057220459 8.30000019073486 -2.40000009536743 8.90000057220459 9.90000057220459 -3.90000009536743 8.60000038146973 11 -4.70000028610229 7.09999990463257 11 -4.70000028610229 7.09999990463257 13.3000001907349 -5 9.30000019073486 13.3000001907349 -5 9.30000019073486 12.6000003814697 -5.40000009536743 6.59999990463257 11.4000005722046 -5.70000028610229 9.40000057220459 13.3000001907349 -6.09999990463257 7.40000009536743 12.5 -7.20000028610229 5.80000019073486 13.6999998092651 -5.70000028610229 7 13.3000001907349 -4.5 8.19999980926514
```

What you're looking at here requires another post to do it justice (coming soon!), but simply put, the  magnetometer reports 3 pieces of data each sample (for the x, y, z axes). The first measurement from the magnetometer sample taken from the Fusion video above is:

```
11.4000005722046 -4.59999990463257 7.30000019073486
```

In total there are 25 values recorded by the magnetometer in `[Doc1]` (75 `[Magnetometer]` fields values / 3 = 25 records).

Confused yet?

Let's pause for a moment (grab a drink), and next we'll look at another camera, the Insta360 Pro2, for comparison.

### Insta360 Pro2

For this example, I'll use a sample video shot earlier this year by Brian Redmond on the Insta360 Pro2 (as always, thanks Brian!).

<iframe width="560" height="315" src="https://www.youtube.com/embed/y3oHaGPzzK4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

The Insta360 Pro2 writes telemetry metadata to videos in the [Camera Motion Metadata Spec Format](https://developers.google.com/streetview/publish/camm-spec) (clearly Insta360 would not use the GoPro Metadata format, even if it is open source). Fortunately for us, [EXIF tool has the logic to understand this format in a good level of detail](https://exiftool.org/models.html). Again, more on standards later.

**Extracting metadata at frame level**

CLI input: 

```
exiftool -ee -G3 VID_20200420.mp4
```

CLI output: 

```
[...]
[Main]          File Name                       : VID_20200420.mp4
[...]
[Main]          Compatible Brands               : isom, iso2, avc1, mp41
[...]
[Main]          Time Scale                      : 1000
[Main]          Duration                        : 0:01:46
[...]
[Main]          Image Width                     : 7680
[Main]          Image Height                    : 3840
[...]
[Main]          Media Time Scale                : 360000
[Main]          Media Duration                  : 0:01:46
[...]
[Main]          X Resolution                    : 72
[Main]          Y Resolution                    : 72
[Main]          Bit Depth                       : 24
[Main]          Video Frame Rate                : 5
[Main]          Spherical                       : true
[Main]          Stitched                        : true
[Main]          Projection Type                 : equirectangular
[...]
[Main]          Handler Type                    : Camera Metadata
[Main]          Handler Description             : CameraMetadataMotionHandler
[Main]          Other Format                    : camm
[Main]          Make                            : Insta360
[Main]          Model                           : Insta360 Pro2
[Main]          Handler Type                    : Metadata
[Main]          Handler Vendor ID               : Apple
[...]
[Main]          Image Size                      : 7680x3840
[Main]          Megapixels                      : 29.5
[Main]          Avg Bitrate                     : 255 Mbps
[Main]          Rotation                        : 0
[Main]          GPS Position                    : 50 deg 27' 21.43" N, 30 deg 28' 47.74" E
[Doc1]          Sample Time                     : 0 s
[Doc1]          Sample Duration                 : 0.00 s
[Doc1]          GPS Date/Time                   : 2020:04:02 09:37:53.672108Z
[Doc1]          GPS Measure Mode                : 3-Dimensional Measurement
[Doc1]          GPS Latitude                    : 50 deg 27' 21.43" N
[Doc1]          GPS Longitude                   : 30 deg 28' 47.74" E
[Doc1]          GPS Altitude                    : 147.4 m
[Doc1]          GPS Horizontal Accuracy         : 1.27999997138977
[Doc1]          GPS Vertical Accuracy           : 1.27999997138977
[Doc1]          GPS Velocity East               : -0.392383813858032
[Doc1]          GPS Velocity North              : -1.50640165805817
[Doc1]          GPS Velocity Up                 : 0
[Doc1]          GPS Speed Accuracy              : 0
[Doc2]          Sample Time                     : 0.00 s
[Doc2]          Sample Duration                 : 0.00 s
[Doc2]          GPS Date/Time                   : 2020:04:02 09:37:53.777315Z
[Doc2]          GPS Measure Mode                : 3-Dimensional Measurement
[Doc2]          GPS Latitude                    : 50 deg 27' 21.43" N
[Doc2]          GPS Longitude                   : 30 deg 28' 47.74" E
[Doc2]          GPS Altitude                    : 148.4 m
[Doc2]          GPS Horizontal Accuracy         : 1.27999997138977
[Doc2]          GPS Vertical Accuracy           : 1.27999997138977
[Doc2]          GPS Velocity East               : -0.301319599151611
[Doc2]          GPS Velocity North              : -1.26973676681519
[Doc2]          GPS Velocity Up                 : 0
[Doc2]          GPS Speed Accuracy              : 0
[Doc3]          Sample Time                     : 0.00 s
[Doc3]          Sample Duration                 : 0.00 s
[Doc3]          Angular Velocity                : 0.0596548095345497 0.46658581495285 -0.171507567167282
[Doc4]          Sample Time                     : 0.00 s
[Doc4]          Sample Duration                 : 0.00 s
[Doc4]          Angular Velocity                : 0.05326322093606 0.520914316177368 -0.15659387409687
[Doc5]          Sample Time                     : 0.01 s
[Doc5]          Sample Duration                 : 0.00 s
[Doc5]          Angular Velocity                : 0.0426105782389641 0.576308071613312 -0.134223312139511
[Doc6]          Sample Time                     : 0.01 s
[Doc6]          Sample Duration                 : 0.00 s
[Doc6]          Angular Velocity                : 0.0298274047672749 0.63063657283783 -0.105461180210114
[Doc7]          Sample Time                     : 0.01 s
[Doc7]          Sample Duration                 : 0.00 s
[Doc7]          Angular Velocity                : 0.0170442312955856 0.682834506034851 -0.0756337717175484
[Doc8]          Sample Time                     : 0.01 s
[Doc8]          Sample Duration                 : 0.00 s
[Doc8]          Angular Velocity                : 0.00426105782389641 0.731836676597595 -0.0479369014501572
[Doc9]          Sample Time                     : 0.01 s
[Doc9]          Sample Duration                 : 0.00 s
[Doc9]          Angular Velocity                : -0.00852211564779282 0.776577770709991 -0.0245010815560818
[Doc10]         Sample Time                     : 0.01 s
[Doc10]         Sample Duration                 : 0.00 s
[Doc10]         Angular Velocity                : -0.0191747602075338 0.817057847976685 -0.010652644559741
[Doc11]         Sample Time                     : 0.02 s
[Doc11]         Sample Duration                 : 0.00 s
[Doc11]         Angular Velocity                : -0.0340884625911713 0.847950518131256 -0.00532632227987051
[Doc12]         Sample Time                     : 0.02 s
[Doc12]         Sample Duration                 : 0.00 s
[Doc12]         Angular Velocity                : -0.0511326938867569 0.872451543807983 -0.00852211564779282
[Doc13]         Sample Time                     : 0.02 s
[Doc13]         Sample Duration                 : 0.00 s
[Doc13]         Angular Velocity                : -0.0703074559569359 0.887365281581879 -0.0170442312955856
[Doc14]         Sample Time                     : 0.02 s
[Doc14]         Sample Duration                 : 0.00 s
[Doc14]         Angular Velocity                : -0.0852211564779282 0.892691612243652 -0.0308926682919264
[Doc15]         Sample Time                     : 0.03 s
[Doc15]         Sample Duration                 : 0.00 s
[Doc15]         Angular Velocity                : -0.0980043262243271 0.88949579000473 -0.0468716360628605
[...]
[Doc49]         Sample Time                     : 0.09 s
[Doc49]         Sample Duration                 : 0.00 s
[Doc49]         GPS Date/Time                   : 2020:04:02 09:37:53.870164Z
[Doc49]         GPS Measure Mode                : 3-Dimensional Measurement
[Doc49]         GPS Latitude                    : 50 deg 27' 21.44" N
[Doc49]         GPS Longitude                   : 30 deg 28' 47.74" E
[Doc49]         GPS Altitude                    : 149 m
[Doc49]         GPS Horizontal Accuracy         : 1.27999997138977
[Doc49]         GPS Vertical Accuracy           : 1.27999997138977
[Doc49]         GPS Velocity East               : -0.184439867734909
[Doc49]         GPS Velocity North              : -0.82177871465683
[Doc49]         GPS Velocity Up                 : 0
[Doc49]         GPS Speed Accuracy              : 0
[Doc50]         Sample Time                     : 0.09 s
[Doc50]         Sample Duration                 : 0 s
[Doc50]         GPS Date/Time                   : 2020:04:02 09:37:53.870178Z
[Doc50]         GPS Measure Mode                : 3-Dimensional Measurement
[Doc50]         GPS Latitude                    : 50 deg 27' 21.44" N
[Doc50]         GPS Longitude                   : 30 deg 28' 47.74" E
[Doc50]         GPS Altitude                    : 149 m
[Doc50]         GPS Horizontal Accuracy         : 1.27999997138977
[Doc50]         GPS Vertical Accuracy           : 1.27999997138977
[Doc50]         GPS Velocity East               : -0.184439867734909
[Doc50]         GPS Velocity North              : -0.82177871465683
[Doc50]         GPS Velocity Up                 : 0
[Doc50]         GPS Speed Accuracy              : 0
[Doc51]         Sample Time                     : 0.09 s
[Doc51]         Sample Duration                 : 0.00 s
[Doc51]         GPS Date/Time                   : 2020:04:02 09:37:53.870184Z
[Doc51]         GPS Measure Mode                : 3-Dimensional Measurement
[Doc51]         GPS Latitude                    : 50 deg 27' 21.44" N
[Doc51]         GPS Longitude                   : 30 deg 28' 47.74" E
[Doc51]         GPS Altitude                    : 149 m
[Doc51]         GPS Horizontal Accuracy         : 1.27999997138977
[Doc51]         GPS Vertical Accuracy           : 1.27999997138977
[Doc51]         GPS Velocity East               : -0.184439867734909
[Doc51]         GPS Velocity North              : -0.82177871465683
[Doc51]         GPS Velocity Up                 : 0
[Doc51]         GPS Speed Accuracy              : 0
[Doc52]         Sample Time                     : 0.09 s
[Doc52]         Sample Duration                 : 0.00 s
[Doc52]         Angular Velocity                : -0.0276968758553267 0.64555025100708 -0.0223705526441336
[Doc53]         Sample Time                     : 0.10 s
[Doc53]         Sample Duration                 : 0.00 s
[Doc53]         Angular Velocity                : -0.0149137023836374 0.6743124127388 -0.0181094948202372
[Doc54]         Sample Time                     : 0.10 s
[Doc54]         Sample Duration                 : 0.00 s
[Doc54]         Angular Velocity                : -0.0149137023836374 0.704139769077301 -0.00958738010376692
[Doc55]         Sample Time                     : 0.10 s
[Doc55]         Sample Duration                 : 0.00 s
[Doc55]         Angular Velocity                : -0.0234358180314302 0.730771422386169 0
[Doc56]         Sample Time                     : 0.10 s
[Doc56]         Sample Duration                 : 0.00 s
[Doc56]         Angular Velocity                : -0.0362189896404743 0.754207193851471 0.00852211564779282
[Doc57]         Sample Time                     : 0.10 s
[Doc57]         Sample Duration                 : 0.00 s
[Doc57]         Angular Velocity                : -0.0468716360628605 0.769120931625366 0.0117179090157151
[Doc58]         Sample Time                     : 0.10 s
[Doc58]         Sample Duration                 : 0.00 s
[Doc58]         Angular Velocity                : -0.0490021631121635 0.775512516498566 0.00639158673584461
[Doc59]         Sample Time                     : 0.11 s
[Doc59]         Sample Duration                 : 0.00 s
[Doc59]         Angular Velocity                : -0.0553937517106533 0.775512516498566 -0.00319579336792231
[Doc60]         Sample Time                     : 0.11 s
[Doc60]         Sample Duration                 : 0.00 s
[Doc60]         Angular Velocity                : -0.0660463944077492 0.773382008075714 -0.00639158673584461
[Doc61]         Sample Time                     : 0.11 s
[Doc61]         Sample Duration                 : 0.00 s
[Doc61]         Angular Velocity                : -0.0766990408301353 0.766990423202515 -0.00958738010376692
[Doc62]         Sample Time                     : 0.11 s
[Doc62]         Sample Duration                 : 0.00 s
[Doc62]         Angular Velocity                : -0.0809600949287415 0.755272507667542 -0.0149137023836374
[Doc63]         Sample Time                     : 0.12 s
[Doc63]         Sample Duration                 : 0.00 s
[Doc63]         Angular Velocity                : -0.0766990408301353 0.735032439231873 -0.02663161046803
[...]
[Doc56498]      Sample Time                     : 0:01:46
[Doc56498]      Sample Duration                 : 0.10 s
[Doc56498]      GPS Date/Time                   : 2020:04:02 09:39:40.176402Z
[Doc56498]      GPS Measure Mode                : 3-Dimensional Measurement
[Doc56498]      GPS Latitude                    : 50 deg 27' 21.79" N
[Doc56498]      GPS Longitude                   : 30 deg 28' 47.77" E
[Doc56498]      GPS Altitude                    : 148.2 m
[Doc56498]      GPS Horizontal Accuracy         : 1.27999997138977
[Doc56498]      GPS Vertical Accuracy           : 1.27999997138977
[Doc56498]      GPS Velocity East               : -0.27111604809761
[Doc56498]      GPS Velocity North              : -1.34460616111755
[Doc56498]      GPS Velocity Up                 : 0
[Doc56498]      GPS Speed Accuracy              : 0
```

[Entire output for reference](https://gitlab.com/snippets/1972711).

In this case we know the `Video Frame Rate=5` (FPS) covering `0:01:46` (1 min 46 seconds) shooting files at `Megapixels=29.5` with an `Avg Bitrate=255 Mbps`. Without seeing the video we know it is a 360 video because, again, `Projection Type=equirectangular`.

Going back to video level, notice how on the Insta360 Pro2 `Other Format=camm` (vs. `Meta Format=gpmd` on the Fusion)

```
[Main]          Handler Type                    : Camera Metadata
[Main]          Handler Description             : CameraMetadataMotionHandler
[Main]          Other Format                    : camm
[Main]          Make                            : Insta360
[Main]          Model                           : Insta360 Pro2
[Main]          Handler Type                    : Metadata
[Main]          Handler Vendor ID               : Apple
```

You'll notice the output is slightly different to the Fusion. It includes a lot more telemetry data, and it reports the data slightly differently. This is because it is not using the GoPro Metadata Format, it is using the Camera Motion Metadata Spec (CAMM) -- a standard widely adopted by almost all 360 camera manufacturers (except GoPro), [mainly because it is the standard supported by Street View](https://developers.google.com/streetview/spherical-metadata).

As a result, this time we get a 2 telemetry block descriptors containing GPS:

```
[Doc1]          Sample Time                     : 0 s
[Doc1]          Sample Duration                 : 0.00 s
[Doc1]          GPS Date/Time                   : 2020:04:02 09:37:53.672108Z
[Doc1]          GPS Measure Mode                : 3-Dimensional Measurement
[...]
[Doc2]          Sample Time                     : 0.00 s
[Doc2]          Sample Duration                 : 0.00 s
[Doc2]          GPS Date/Time                   : 2020:04:02 09:37:53.777315Z
[Doc2]          GPS Measure Mode                : 3-Dimensional Measurement
```

Followed by many `Angular Velocity` samples (`[Doc3]` - `[Doc48]`:

```
[Doc3]          Sample Time                     : 0.00 s
[Doc3]          Sample Duration                 : 0.00 s
[Doc3]          Angular Velocity                : 0.0596548095345497 0.46658581495285 -0.171507567167282
[Doc4]          Sample Time                     : 0.00 s
[Doc4]          Sample Duration                 : 0.00 s
[Doc4]          Angular Velocity                : 0.05326322093606 
[Doc5]          Sample Time                     : 0.01 s
[Doc5]          Sample Duration                 : 0.00 s
[Doc5]          Angular Velocity                : 0.0426105782389641 
```

Until we get to the next sample block descriptor 0.9s later:

```
[Doc49]         Sample Time                     : 0.09 s
[Doc49]         Sample Duration                 : 0.00 s
[Doc49]         GPS Date/Time                   : 2020:04:02 09:37:53.870164Z
[Doc49]         GPS Measure Mode                : 3-Dimensional Measurement

[Doc50]         Sample Time                     : 0.09 s
[Doc50]         Sample Duration                 : 0 s
[Doc50]         GPS Date/Time                   : 2020:04:02 09:37:53.870178Z
[Doc50]         GPS Measure Mode                : 3-Dimensional Measurement
```

The Fusion reported in 1 second blocks, with a block descriptor and all measurements in the same block having the same [Doc] identifier.

The Insta360 Pro2 reports a GPS block descriptor, the first ones being `[Doc2]` and `[Doc3]` in 0.1s intervals (the next being `[Doc49]` and `[Doc50]`), with `Angular velocity` being reported at a higher sample rate (46 times over the each 0.1s interval).

In this case, metadata is being recorded much faster than frames are being shot (5 FPS / 1 frame every 0.2s). 4 GPS measurements cover the time between the first frame and second frame. Why? This is advantageous in the case of erroneous GPS recordings, where software can identify and account for them (e.g. discard them).

Remember I mentioned space potentially being an issue for metadata. For this video of 1 minute and 46 second, 201675 lines of metadata were written in my uncompressed output (measuring about 15MB, [about the size of a 5.2K 360 image taken on a GoPro Fusion](/blog/2020/metadata-exif-xmp-360-photo-files)).

### A deeper look into telemetry metadata standards

So far we've considered data being reported in `[Doc]`'s. I've done this to match the normalised output of EXIF tool, but to demonstrate the differences in the standards, and illustrate why the patterns of the `[Doc]` outputs differ we need to look at the design of the standard.

**GoPro Fusion GPMD**

CLI input: 

```
$ exiftool -ee -V2 -G3 VIDEO_7152.mp4 
```

This command includes the following arguments:

* -ee: Extract embedded data from mp0 files (and others).
* -G3: Identify the originating document for extracted information. Embedded documents containing sub-documents are indicated with dashes in the family 3 group name. (eg. Doc2-3 is the 3rd sub-document of the 2nd embedded document.)
* -V2: list the Perl include directories

[Full reference here](https://exiftool.org/exiftool_pod.html).

CLI output:

```
[...] 
Track3 Type='meta' Format='gpmd', Sample 1 of 16 (23252 bytes)
SampleTime = 0
SampleDuration = 1.001
gpmd (SubDirectory) -->
- Tag 'gpmd' (23252 bytes)
+ [gpmd directory, 23252 bytes]
| DeviceContainer (SubDirectory) -->
| - Tag 'DEVC', type='\0' size=1 count=23244 (23244 bytes, undef)
| + [DeviceContainer directory, 23244 bytes]
| | DeviceID = 1
| | - Tag 'DVID', type='L' size=4 count=1 (4 bytes, int32u)
| | DeviceName = Fusion
| | - Tag 'DVNM', type='c' size=1 count=6 (6 bytes, string)
| | GoPro_TICK = 1066556
| | - Tag 'TICK', type='L' size=4 count=1 (4 bytes, int32u)
| | NestedSignalStream (SubDirectory) -->
| | - Tag 'STRM', type='\0' size=1 count=2508 (2508 bytes, undef)
| | + [NestedSignalStream directory, 2508 bytes]
| | | TimeStamp = 1066344245
| | | - Tag 'STMP', type='J' size=8 count=1 (8 bytes, int64u)
| | | TotalSamples = 197
| | | - Tag 'TSMP', type='L' size=4 count=1 (4 bytes, int32u)
| | | GoPro_TICK = 1066556
| | | - Tag 'TICK', type='L' size=4 count=1 (4 bytes, int32u)
| | | StreamName = Accelerometer (up/down, right/left, forward/back)
| | | - Tag 'STNM', type='c' size=1 count=50 (50 bytes, string)
| | | CameraTemperature = 27.048828125
| | | - Tag 'TMPC', type='f' size=4 count=1 (4 bytes, float)
| | | SIUnits = m/s.
| | | - Tag 'SIUN', type='c' size=4 count=1 (4 bytes, string)
| | | ScaleFactor = 1
| | | - Tag 'SCAL', type='s' size=2 count=1 (2 bytes, int16s)
| | | Accelerometer = 0.940191388130188 -1.41387557983398 8.96650695800781 1.5311005115[snip]
| | | - Tag 'ACCL', type='f' size=12 count=197 (2364 bytes, float)
| | NestedSignalStream (SubDirectory) -->
| | - Tag 'STRM', type='\0' size=1 count=19316 (19316 bytes, undef)
| | + [NestedSignalStream directory, 19316 bytes]
| | | TimeStamp = 1066365138
| | | - Tag 'STMP', type='J' size=8 count=1 (8 bytes, int64u)
| | | TotalSamples = 3200
| | | - Tag 'TSMP', type='L' size=4 count=1 (4 bytes, int32u)
| | | GoPro_TICK = 1066581
| | | - Tag 'TICK', type='L' size=4 count=1 (4 bytes, int32u)
| | | StreamName = Gyroscope (z,x,y)
| | | - Tag 'STNM', type='c' size=1 count=18 (18 bytes, string)
| | | CameraTemperature = 27.048828125
| | | - Tag 'TMPC', type='f' size=4 count=1 (4 bytes, float)
| | | SIUnits = rad/s
| | | - Tag 'SIUN', type='c' size=5 count=1 (5 bytes, string)
| | | ScaleFactor = 939
| | | - Tag 'SCAL', type='s' size=2 count=1 (2 bytes, int16s)
| | | Gyroscope = 0.0425985090521832 -0.137380191693291 0.274760383386581 0.03727369542[snip]
| | | - Tag 'GYRO', type='s' size=6 count=3200 (19200 bytes, int16s)
| | NestedSignalStream (SubDirectory) -->
| | - Tag 'STRM', type='\0' size=1 count=356 (356 bytes, undef)
| | + [NestedSignalStream directory, 356 bytes]
| | | TotalSamples = 25
| | | - Tag 'TSMP', type='L' size=4 count=1 (4 bytes, int32u)
| | | GoPro_TICK = 1066586
| | | - Tag 'TICK', type='L' size=4 count=1 (4 bytes, int32u)
| | | SIUnits = .T
| | | - Tag 'SIUN', type='c' size=2 count=1 (2 bytes, string)
| | | ScaleFactor = 1
| | | - Tag 'SCAL', type='s' size=2 count=1 (2 bytes, int16s)
| | | Magnetometer = 11.4000005722046 -4.59999990463257 7.30000019073486 11 -4.59999990[snip]
| | | - Tag 'MAGN', type='f' size=12 count=25 (300 bytes, float)
| | NestedSignalStream (SubDirectory) -->
| | - Tag 'STRM', type='\0' size=1 count=564 (564 bytes, undef)
| | + [NestedSignalStream directory, 564 bytes]
| | | TotalSamples = 19
| | | - Tag 'TSMP', type='L' size=4 count=1 (4 bytes, int32u)
| | | GoPro_TICK = 1066558
| | | - Tag 'TICK', type='L' size=4 count=1 (4 bytes, int32u)
| | | GPSMeasureMode = 3
| | | - Tag 'GPSF', type='L' size=4 count=1 (4 bytes, int32u)
| | | GPSDateTime = 200413153722.444
| | | - Tag 'GPSU', type='U' size=16 count=1 (16 bytes, undef)
| | | GPSHPositioningError = 203
| | | - Tag 'GPSP', type='S' size=2 count=1 (2 bytes, int16u)
| | | StreamName = GPS (Lat., Long., Alt., 2D speed, 3D speed)
| | | - Tag 'STNM', type='c' size=1 count=44 (44 bytes, string)
| | | Units = [deg,deg,m,m/s,m/s]
| | | - Tag 'UNIT', type='c' size=3 count=5 (15 bytes, string)
| | | ScaleFactor = 10000000 10000000 1000 1000 100
| | | - Tag 'SCAL', type='l' size=4 count=5 (20 bytes, int32s)
| | | GPSInfo (SubDirectory) -->
| | | - Tag 'GPS5', type='l' size=20 count=19 (380 bytes, int32s)
| | | + [GoPro structure directory]
| | | | GPSLatitude = 51.2484762
| | | | GPSLongitude = -0.7824453
| | | | GPSAltitude = 157.641
| | | | GPSSpeed = 1.348
| | | | GPSSpeed3D = 1.28
| | | | GPSLatitude = 51.2484766
| | | | GPSLongitude = -0.782447
| | | | GPSAltitude = 157.616
| | | | GPSSpeed = 1.57
| | | | GPSSpeed3D = 1.38
| | | | GPSLatitude = 51.2484766
| | | | GPSLongitude = -0.7824483
| | | | GPSAltitude = 157.627
| | | | GPSSpeed = 1.549
| | | | GPSSpeed3D = 1.6
| | | | GPSLatitude = 51.2484768
| | | | GPSLongitude = -0.7824496
| | | | GPSAltitude = 157.635
| | | | GPSSpeed = 1.527
| | | | GPSSpeed3D = 1.57
| | | | GPSLatitude = 51.2484766
| | | | GPSLongitude = -0.7824506
| | | | GPSAltitude = 157.637
| | | | GPSSpeed = 1.42
| | | | GPSSpeed3D = 1.55
[...] 
```

[Entire output for reference](https://gitlab.com/snippets/1972789).

The data you see here is the same as that shown for the GoPro video frame output earlier in this post, however, it has not been normalised by EXIF tool for analysis.

What this highlights is the nested structure of the data, the format defined by the GPMD. Try to visualise this output directories (folders) on your computer, from the enclosing directory, might more directories, `|`, and in them more directories, `| |`, etc

Propriety formats like the GPMD make it difficult for software developers to develop new tools (like EXIF tool) as they need to develop the logic to understand the format (the field names, the nested structure, and all the other nuances).

If every camera manufactured brought in their own standards, not only would it require more time and effort on their part, but also for the developers of software.

For big brands like GoPro, proprietary formats are not a big problem -- developers will put in the work because they have a large amount of customers. [Take Trailblazer](https://www.panoskin.com/trailblazer), a tool built specifically for uploading photos to Google Street View from the GoPro Fusion camera.

It's very unlikely anyone would put in a similar effort for smaller brands who might not be in existence a year later, thus making it hard for them to make their cameras attractive.

As such, the InstaPro2 uses the CAMM standard.

### Insta360 Pro2 CAMM

CLI input: 

```
$ exiftool -ee -V2 -G3 VIDEO_7152.mp4 
```

CLI output: 

```
camm2 (SubDirectory) -->
- Tag 'camm' (32 bytes)
+ [BinaryData directory, 32 bytes]
| AngularVelocity = 0.0703074559569359 -0.0543284863233566 -0.0170442312955856
| - Tag 0x0004 (12 bytes, float[3])
Track3 Type='camm' Format='camm', Sample 20272 of 61458 (60 bytes)
SampleTime = 28.6809222222222
SampleDuration = 7.77777777777778e-05
camm6 (SubDirectory) -->
- Tag 'camm' (60 bytes)
+ [BinaryData directory, 60 bytes]
| GPSDateTime = 1585820302.45822
| - Tag 0x0004 (8 bytes, double[1])
| GPSMeasureMode = 1
| - Tag 0x000c (4 bytes, int32u[1])
| GPSLatitude = 0
| - Tag 0x0010 (8 bytes, double[1])
| GPSLongitude = 0
| - Tag 0x0018 (8 bytes, double[1])
| GPSAltitude = 0
| - Tag 0x0020 (4 bytes, float[1])
| GPSHorizontalAccuracy = 0
| - Tag 0x0024 (4 bytes, float[1])
| GPSVerticalAccuracy = 0
| - Tag 0x0028 (4 bytes, float[1])
| GPSVelocityEast = 0
| - Tag 0x002c (4 bytes, float[1])
| GPSVelocityNorth = 0
| - Tag 0x0030 (4 bytes, float[1])
| GPSVelocityUp = 0
| - Tag 0x0034 (4 bytes, float[1])
| GPSSpeedAccuracy = 0
| - Tag 0x0038 (4 bytes, float[1])
```

[Entire output for reference](https://gitlab.com/snippets/1972792).

I won't go to deep into the format. You can see the same directory structure of the data (`|`), the main difference being between `gmpd` and `camm` are the values and how they are reported in the metadata track.

[Google have created a comprehensive page detailing the CAMM data format here](https://developers.google.com/streetview/publish/camm-spec#data-format).

New 360 cameras entering the market all appear to be writing metadata tracks in the in the `camm` format to support easy Google Street View integration. The manufacturers I know that are building cameras 

* Pilot
* Ricoh 
* Insta360
* Kandao

If you're manufacturer uses a different standard to this included in this post, good luck! And let us know about it...

## Help us Build Great Software

Unfortunately we don't have the budget to buy every single 360 camera to test the photos and videos they produce with our software.

Whilst having standards like EXIF and XMP is very helpful, many manufacturers do things slightly differently (especially given the flexibility of fields in XMP data).

In order to make sure our [free, open-source software works for everyone](https://github.com/trek-view/), we need to test it using 360 image and video files produced by a range of cameras and manufacturers.

And that's why we need your help.

If you have a 360 camera and want to support our work, [please share more information about your camera with us using this form](https://docs.google.com/forms/d/e/1FAIpQLScgOk1W5jpyrQuDF5FuKqUpKK0EIpSlokckZd3OB-r_ZOjZmQ/viewform). Thank you!