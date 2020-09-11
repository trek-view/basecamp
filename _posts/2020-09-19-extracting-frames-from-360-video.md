---
date: 2020-09-19
title: "Turning a geo-tagged 360 video into geo-tagged 360 photos"
description: "Its easier to work with your street-level photos as individual photos rather than a single video."
categories: developers
tags: [GPS, XMP, EXIF]
author_staff_member: dgreenwood
image: /assets/images/blog/2020-09-19/map-the-paths-desktop-uploader-meta.jpg
featured_image: /assets/images/blog/2020-09-19/map-the-paths-desktop-uploader.jpg
layout: post
published: false
---

**Two solutions to convert videos to images**

In the last year I've covered topics [about the metadata found in a 360 video](/blog/2020/metadata-exif-xmp-360-video-files) and [how to extract a GPS track from them](/blog/2020/extracting-gps-track-from-360-timelapse-video).

The problem with video files is they're often difficult to work with as a beginner. Let's say you wanted to cut the first 20 seconds of video from your capture whilst standing still. Removing the first 20 seconds is trivial in many programs. The problem; some software programs will completely strip the GPS telemetry from the video if you do this, others will remove other important metadata from the video, such as [XMP] ProjectionType (used by software to recognise the video as either 360 or 2D).

I'm yet to find the perfect 360 video editing tool for street-level imagery mapping. [This is one (or a few) reasons we don't recommend capturing in video mode](https://guides.trekview.org/mtp-web/user-guide/sequences/capture#camera-capture-mode-settings).

That said, sometimes you might have captured a brilliant video of a trail -- perhaps skiing a piste or a downhill MTB trail -- where your intention was not to use the images for mapping, but to share with friends on YouTube, however, now realise that video would be great to use on Mapillary.

In such cases it's possible to convert the video and the metadata they hold to images (with the help of [EXIFtool](https://exiftool.org/) and [FFmpeg](https://ffmpeg.org/)).

The workflow will look like this:

1. Extract metadata track from video file (global data and GPS data)
2. Split video into frames (individual photo files)
3. Add metadata to frames

For this guide I'll be using [FFmpeg](https://ffmpeg.org/), a free and open-source project consisting of a vast software suite of libraries and programs for handling video, audio, and other multimedia files and streams.

The demo video will be an `.mp4` video filmed using a GoPro Fusion with GPS enabled shot at 5.2K and the final file encoded using H.264 at 4K at 30 FPS using GoPro Fusion Studio (no Protune). The file size is 86.2MB and runs for 16 seconds.

<iframe width="560" height="315" src="https://www.youtube.com/embed/iyIkDRERzz8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

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

## 2. Split video into frames (individual photo files)

Taking the `.mp4` file, I can break it down into 1 second frames at desired intervals using ffmpeg.

I'm going to use `.jpg` for the output. 

CLI input:

```
ffmpeg -i VIDEO_7152.mp4 -r 1 FRAMES/img%04d.jpg
```


```
$ ffmpeg -i VIDEO_7152.mp4 -r 1 -vsync 0 -frame_pts true FRAMES/img%d.jpg
```

This command includes the following arguments:

* -r: Set frame rate (Hz value, fraction or abbreviation).

[Full reference here](https://www.ffmpeg.org/ffmpeg.html).

_Make sure you reference an existing directory path for the image file output (e.g. `FRAMES/`)._

<img class="img-fluid" src="/assets/images/blog/2020-06-05/img0001-sm.jpg" alt="ffmpeg extracted frame example" title="ffmpeg extracted frame exampler" />

[In total this gives me 18 `.jpg` files](https://drive.google.com/drive/u/1/folders/1hPCYAluasG58moLQsFPo-On5IA6guRS9).

If you want a higher (or lower) sampling rate, just change the `-r` value (e.g. `-r 0.5` = 2 frames per second).

**A note on video capture and quality**

I mentioned at the start this video was show in 4K.

> 4K (3840 x 2160 or 4096 x 2160) is about 8.5 megapixels.

[Source](https://www.lifewire.com/4k-resolution-overview-and-perspective-1846842)

Looking at the metadata of the video, the reported image size is 3840x1920 or 7.4MP.

```
[Main]          ImageSize                       : 3840x1920
[Main]          Megapixels                      : 7.4
[Main]          AvgBitrate                      : 45.2 Mbps
```

So why is this happening?

Essentially your camera and the components inside it can only transfer data at a certain speed. Usually the better (often newer) components can transfer data more quickly from sensor capture to getting the photo on whatever storage medium the camera uses (why you should buy fast SD cards). This is measure as bitrate (you might also here the term bandwidth used interchangeably).

Bit rate is the number of bits that are conveyed or processed per unit of time. Mbps = MegaBITs per second (not to be confused with megaBYTES). You are probably familiar with paying for your internet connection in packages based on Mbps (Or Gbps - Gigabits per second if you're really lucky!).

1 megaBIT = 0.125 megaBYTES.

<table class="tableizer-table">
<thead><tr class="tableizer-firstrow"><th>MODE / FPS</th><th>BITRATE / NO PROTUNE</th><th>BITRATE / WITH PROTUNE</th></tr></thead><tbody>
 <tr><td>5.2K30</td><td>45</td><td>60</td></tr>
 <tr><td>3K60</td><td>45</td><td>60</td></tr>
</tbody></table>

The GoPro Fusion has two video modes, each of which can be used with Protune turned on or off (Protune was off for this video). Turning on Protune increases the bitrate of the recording. It uses a variable bitrate codec with target average bitrates of either 60 Mbps or 45 Mbps, depending on the video mode (this is for each sensor/lens).

45 megaBITS = 5.625 megaBYTES.

And without getting too technical in this post, that's why there you face a tradeoff in video mode between FPS and image quality. In video files it's not as noticable as when extracting frames, especially when comparing them to still photos the camera can take. In that case of the Fusion still images (5.8k / 5760x2880 / 16.6 megapixels) are over double the quality of extracted video frames.

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

<img class="img-fluid" src="/assets/images/blog/2020-09-19/" alt="Map the Paths Desktop Uploader" title="Map the Paths Desktop Uploader" />

If you're not technical, or simply want an easy way to turn geo-tagged videos into geo-tagged photos, you should use the Map the Paths Desktop Uploader.

You can use the Map the Paths Desktop Uploader to modify the resulting photos to be included in the sequence of images. For example, removing photos you don't need (perhaps at the start and end of the video). At the end, it's also possible to upload you images to a range of online platforms, including Map the Paths, Mapillary, and Google Street View.

[**Download the Map the Paths Desktop Uploader for free**](http://mtp.trekview.org/uploader).






https://superuser.com/questions/1421133/extract-i-frames-to-images-quickly/1421195#1421195