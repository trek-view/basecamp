---
date: 2021-02-26
title: "Turning a 360 Video into Timelapse Images (Part 2/2)"
description: ""
categories: 
tags: [FFMpeg]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-02-26/
featured_image: /assets/images/blog/2021-02-26/
layout: post
published: false
---


## 1. Extract metadata track from video file (for telemetry information)

ffmpeg strips frames of metadata when converting from a video file (step 2).

Therefore the first step is to extract the metadata from the video file so we have a copy of it to re-embed into the extracted frames (step 3).

[The details of this are detailed here (and you should read this before continuing)](/blog/2020/metadata-exif-xmp-360-video-files).

In short we can use exiftool to do this.

I'll do it in two part.

### Extract global metadata

Described in more detail in the section of this post titled, [extracting metadata for video level](/blog/2020/metadata-exif-xmp-360-video-files):

CLI input: 

```
$ exiftool -ee -G3 -s VIDEO_7152.mp4 > VIDEO_7152_track_metadata_tagnames_full.txt
```

This command includes the following arguments:

* -ee: Extract embedded data from mp0 files (and others).
* -G3: Identify the originating document for extracted information. Embedded documents containing sub-documents are indicated with dashes in the family 3 group name. (eg. Doc2-3 is the 3rd sub-document of the 2nd embedded document.)
* -s: Descriptions, not tag names, are shown by default when extracting information. Use the -s option to see the tag names instead.

[Full reference here](https://exiftool.org/exiftool_pod.html).

[Here is the outputted file](https://gitlab.com/snippets/1979531).

### Extract GPS track

[The command below is described in more detail in this post](/blog/2020/extracting-gps-track-from-360-timelapse-video):

CLI input: 

```
$ exiftool -ee -p gpx.fmt VIDEO_7152.mp4 > VIDEO_7152.gpx
```

This command includes the following arguments:

* -ee: Extract embedded data from mp0 files (and others).
* -p FMTFILE: Print output in specified format

[Full reference here](https://exiftool.org/exiftool_pod.html).

[Here is the outputted file](https://gitlab.com/snippets/1977078).

_Note, this a simple extraction and only preserves `GPSLatitude`, `GPSLongitude`, `GPSAltitude` and `GPSDateTime` values. In many cases the telemetry track also includes other sensor data including pitch and heading._



## 3. Add telemetry data to selected frames

[You'll notice if you examine the metadata in the extracted frames](/blog/2020/metadata-exif-xmp-360-photo-files), it does not contain the metadata from the video file.

CLI input:

```
$ exiftool -G -a -s FRAMES/img0001.jpg > FRAMES/img0001_metadata.txt
```

[Here is the outputted file](https://gitlab.com/snippets/1979421).

Now this is problematic for a few reasons, namely because we don't know when the time image was captured which makes it impossible to re-embed timestamped GPS positions.

To calculate the time the image was taken two pieces of information are needed, the start time of the video, and the spacing (time) between frames defined when splitting the videos into frames. In this example, it's 1 second (`-r 1`).

**WARNING**

Videos are stiched on the GoPro Fusion, and many other cameras, after the date the time they shot.

This is also problematic.

The `CreateDate` of the video (extracted during step 1) shows:

```
[Main]          CreateDate                      : 2020:04:15 09:14:04
```

This is the date I stitched the file.

But if we look at the first GPS sample time:

```

[Doc1]          SampleTime                      : 0 s
[Doc1]          SampleDuration                  : 1.00 s
[Doc1]          DeviceName                      : Fusion
[Doc1]          TimeStamp                       : 1066.344245
[Doc1]          CameraTemperature               : 27.048828125 C
[Doc1]          Accelerometer                   : (Binary data 10227 bytes, use -b option to extract)
[Doc1]          TimeStamp                       : 1066.365138
[...]
[Doc1]          GPSMeasureMode                  : 3-Dimensional Measurement
[Doc1]          GPSDateTime                     : 2020:04:13 15:37:22.444
```

The GPS shows 2 days prior to the `CreateDate`. The `GPSDateTime` is the time I actually shot the video.

Therefore, be careful not to use the `CreateDate` before being absolutely sure it's correct.

**End of warning**


Using this logic, you know `img0001.jpg`, the first frame, was captured within +/-1 second of `2020:04:13 15:37:22.444` because the `SampleTime` = `0 s` and `SampleDuration` = `1.00 s`.

Using this as video start data time, we can therefore assume (given frames extracted 1 second apart using `-r 1`) that


`img0002.jpg` at `2020:04:13 15:37:23.444`, `img0003.jpg` at `2020:04:13 15:37:24.444` ..., `img0018.jpg` at `2020:04:13 15:37:39` which matches the video `Duration` of `15.98 s` (`2020:04:13 15:37:39.444` - `2020:04:13 15:37:22.444` =  `00:00:17`. _Don't forget to count from 0 (0s to 16s = 17s_).

We can use exiftool to do pragmatically this in two steps ([as I discovered thanks to this answer on the exiftool forum](https://exiftool.org/forum/index.php?topic=5621.0))

1) First set all images to the same date/time:

```
$ exiftool -datetimeoriginal="2020:04:13 15:37:22" FRAMES/
```

Which will create 18 files with the same `DateTimeOriginal` = `2020:04:13 15:37:24`.

You'll also notice exiftool preserved the original data creating a set of files with the extension `.jpg_original`. This is important to consider for step 2.

2) Increment the times by one additional minute for each file:

```
$ exiftool -fileorder FileName -ext jpg "-datetimeoriginal+<0:0:$filesequence" FRAMES/
```

_On Mac/Linux, use single quotes (') instead of double quotes (") around arguments containing a dollar sign ($) when using exiftool._

The response gives:

```
    1 directories scanned
   17 image files updated
    1 image files unchanged
```

`1 image files unchanged` because this is the first file (`img0001.jpg`) in the sequence with the correct date (set by making sure files are in ascending alphanumeric order using `-fileorder FileName)`. The original files were omitted because we only wanted files with `.jgp` extensions (`-ext jpg`) not the originals with `.jpg_original` extensions.

If you check the `datetimeoriginal` in the subsequent files (`img0002.jpg` - `img0018.jpg`) you should see they all update by +1, with `img0018.jpg` ending at `DateTimeOriginal` = `2020:04:13 15:37:39`.

Now we can geotag the photos, [again using exiftool](https://exiftool.org/geotag.html).

Currently exiftool supports the following GPS track log file formats:

* GPX
* NMEA (RMC, GGA, GLL and GSA sentences)
* KML
* IGC (glider format)
* Garmin XML and TCX
* Magellan eXplorist PMGNTRK
* Honeywell PTNTHPR (see Orientation)
* Bramor gEO log
* Winplus Beacon .TXT
* GPS/IMU .CSV
* [ExifTool .CSV file](https://exiftool.org/geotag.html#CSVFormat)

And now you know why we extracted the metadata during step one.

Using exiftool we can re-embed this data.]


exiftool -ext jpg -geotag VIDEO_7152.gpx FRAMES/



exiftool -TagsFromFile fromImage.jpg toImage.jpg



## Map the Paths Desktop Uploader

<img class="img-fluid" src="/assets/images/blog/2020-11-06/" alt="Map the Paths Desktop Uploader" title="Map the Paths Desktop Uploader" />

If you're not technical, or simply want an easy way to turn geo-tagged videos into geo-tagged photos, you should use the Map the Paths Desktop Uploader.

You can use the Map the Paths Desktop Uploader to modify the resulting photos to be included in the sequence of images. For example, removing photos you don't need (perhaps at the start and end of the video). At the end, it's also possible to upload you images to a range of online platforms, including Map the Paths, Mapillary, and Google Street View.

[**Download the Map the Paths Desktop Uploader for free**](https://www.mapthepaths.com/uploader).






https://superuser.com/questions/1421133/extract-i-frames-to-images-quickly/1421195#1421195