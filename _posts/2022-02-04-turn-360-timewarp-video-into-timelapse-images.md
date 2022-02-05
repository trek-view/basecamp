---
date: 2022-02-04
title: "Turning a GoPro Timewarp Video into Photo Frames"
description: "Timewarp videos are perfect for creating beautiful timelapses, but pose some unique challenges when trying to split them into individual frames."
categories: developers
tags: [FFMpeg, exiftool, metadata, XMP, EXIF, GoPro, timewarp, timelapse, MAX, HERO]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-02-04/gopro-timewarp-reference-meta.jpg
featured_image: /assets/images/blog/2022-02-04/gopro-timewarp-reference-sm.jpg
layout: post
published: true
---

**Timewarp videos are perfect for creating beautiful timelapses, but pose some unique challenges when trying to split them into individual frames.**

The GoPro MAX camera and GoPro HERO cameras come with a Timelapse mode called Timewarp.

> TimeWarp is HyperSmooth applied to TimeLapse Video. It allows you to Capture super stabilized time lapse videos while you move about a scene. Increase the speed up to 30x to turn longer activities into shareable moments. 

_[Via GoPro](https://gopro.com/help/articles/block/what-is-timewarp-video?sf95804036=1)_

When it comes to turning GoPro timewarp videos into photo frames, there are a few extra things to consider when compared to normal GoPro videos (non-timelapse).

If you've reached this post looking to convert a regular video into frames, [the process for doing so is described in this post from 2021](/blog/2021/turn-360-video-into-timelapse-images-part-1).

## Timewarp 101

Timewarp is a particularly useful mode when you want to share long content, like a mountain bike trail, as a video.

When configuring a TimeWarp timelapse, you need to select a Timewarp speed.

There are 6 speed options; `2X`, `5X`, `10X`, `15X`, `30X`, and `AUTO` (only in HERO mode).

The speed setting determines how fast the real world time is sped up.

For example, if you selected a speed mode of `2X` and the recording will be twice as fast as real world time -- with a recording time is 5 minutes (300 seconds), the resulting Timewarp video will be 2.5 minutes (150 seconds) long.

Here are examples for other Timewarp speed options;

<table class="tableizer-table">
<thead><tr class="tableizer-firstrow"><th>Speed</th><th>Recording time</th><th>Video length</th></tr></thead><tbody>
 <tr><td>2x</td><td>300 seconds</td><td>150 seconds</td></tr>
 <tr><td>5x</td><td>300 seconds</td><td>60 seconds</td></tr>
 <tr><td>10x</td><td>300 seconds</td><td>30 seconds</td></tr>
 <tr><td>15x</td><td>300 seconds</td><td>20 seconds</td></tr>
 <tr><td>30x</td><td>300 seconds</td><td>10 seconds</td></tr>
</tbody></table>

Auto mode (HERO mode only and not shown in the above table) automatically adjusts the recording speed based on motion, scene detection, and lighting. However, I will ignore Auto mode for this post as we're only considering 360 videos.

Still a little confused? Here I cycled round my block 5 times in each Timewarp mode to demonstrate what the output of the same circuit looks like...

### GoPro MAX 360 Timewarp 30x Sample

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/_LUMzQpl2cM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

* [Download processed GS019004.mp4](https://drive.google.com/open?id=13f_z-PmKTdzsJtue873JVZ24p6eVDCVy&authuser=dgreenwood%40trekview.org&usp=drive_fs) ([see metadata here](https://drive.google.com/open?id=149VOmNJtkn5JSgUiEUxudTwAwlpZRjXQ&authuser=dgreenwood%40trekview.org&usp=drive_fs))
* [Download raw GS019004.360](https://drive.google.com/open?id=11mo4Ks_d6MjayTBR8EH35f_0sr05GjR4&authuser=dgreenwood%40trekview.org&usp=drive_fs) ([see metadata here](https://drive.google.com/open?id=12rLKXvXpHOyR-LN-xr_Wc3EWVbTEyhVA&authuser=dgreenwood%40trekview.org&usp=drive_fs))

### GoPro MAX 360 Timewarp 15x Sample

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/FLlXZZcKn-k" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

* [Download processed GS019005.mp4](https://drive.google.com/open?id=13fMr5bpJsO9no5z7qKPZMY0qQ1RG3L0o&authuser=dgreenwood%40trekview.org&usp=drive_fs) ([see metadata here](https://drive.google.com/open?id=14-rkw14_uBc4uysRsx7qdCSc19DANNkj&authuser=dgreenwood%40trekview.org&usp=drive_fs))
* [Download raw GS019005.360](https://drive.google.com/open?id=11qsl3T7gZ4YBBpsm7selJKyxJexUUYJ_&authuser=dgreenwood%40trekview.org&usp=drive_fs) ([see metadata here](https://drive.google.com/open?id=133GITrOM8YqhNolqL7f7M4ip51nVyLO9&authuser=dgreenwood%40trekview.org&usp=drive_fs))

### GoPro MAX 360 Timewarp 10x Sample

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/z6KENviZq_w" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

* [Download processed GS019006.mp4](https://drive.google.com/open?id=13c9nzS6-KJHMDCSCumyZt_GfZqI9JIRP&authuser=dgreenwood%40trekview.org&usp=drive_fs) ([see metadata here](https://drive.google.com/open?id=13u3zBlXUOpC2VFDDsraKLTGCOb2hZs7Z&authuser=dgreenwood%40trekview.org&usp=drive_fs))
* [Download raw GS019006.360](https://drive.google.com/open?id=12EWI7DAdLmSZmTOuKv62h6q6_yoMMot0&authuser=dgreenwood%40trekview.org&usp=drive_fs) ([see metadata here](https://drive.google.com/open?id=12xUteOsdFhPrnEtpzMrr5g_w1AXN8Gbv&authuser=dgreenwood%40trekview.org&usp=drive_fs))

### GoPro MAX 360 Timewarp 5x Sample

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/R17wvnr9FaQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

* [Download processed GS019007.mp4](https://drive.google.com/open?id=13YBp6zCdUzjfBbqWM9BZoh-J6nDuAYEY&authuser=dgreenwood%40trekview.org&usp=drive_fs) ([see metadata here](https://drive.google.com/open?id=13jXc4xXtme2sl_0Bk4Xehz64WIxsP_EF&authuser=dgreenwood%40trekview.org&usp=drive_fs))
* [Download raw GS019007.360](https://drive.google.com/open?id=12Q03iji0mlOd9dI9DVEkmwILbQXv4saj&authuser=dgreenwood%40trekview.org&usp=drive_fs) ([see metadata here](https://drive.google.com/open?id=13A9UXnyyFL_CYDRfrFVzU7GewbfGl75E&authuser=dgreenwood%40trekview.org&usp=drive_fs))

### GoPro MAX 360 Timewarp 2x Sample

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/j7UUVRFXFns" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

* [Download processed GS019008.mp4](https://drive.google.com/open?id=13XaXCKxyYF4wOzYH2sPo_ICt3aJNsEUZ&authuser=dgreenwood%40trekview.org&usp=drive_fs) ([see metadata here](https://drive.google.com/open?id=13nLub7Ympd3ElggcL-2HvydekhXhGtRW&authuser=dgreenwood%40trekview.org&usp=drive_fs))
* [Download raw GS019008.360](https://drive.google.com/open?id=12_NVfiuxW09xSWtwrScZ2EvtEdv4chH2&authuser=dgreenwood%40trekview.org&usp=drive_fs) ([see metadata here](https://drive.google.com/open?id=13XYODbZ4aif_moSKQBnwSlIG8SGziOdo&authuser=dgreenwood%40trekview.org&usp=drive_fs))

## Identifying videos shot in Timewarp

[As I described last week](/blog/2022/gopro-camera-modes-metadata-tests), videos shot in Timelapse mode (vs. normal video mode) and the setting used can be identified using the `<GoPro:Rate>` tag. 

As an example; `<GoPro:Rate>2X</GoPro:Rate>`, identifies the video being shot in Timewarp mode at `2X` speed.

* MAX: for 360 videos, in the raw .360 file metadata (not the processed .mp4 from GoPro Player software). For HERO videos, in the .mp4 file metadata.
* HERO: in the .mp4 file metadata.

Also, a secondary check can be made to validate the videos do not have an audio track (no timelapse videos, in any mode, contain an audio track). If the below was present in the video metadata, it would confirm the video was shot in normal video mode (not timelapse mode);

```
<TrackN:HandlerClass>Media Handler</TrackN:HandlerClass>
<TrackN:HandlerType>Audio Track</TrackN:HandlerType>
```

## Choosing the right frame-rate for extraction

Whatever the speed selected at capture, Timewarp mode creates a video file with a final frame rate of 30 FPS, as defined in the `VideoFrameRate` tag.

```
<Track1:VideoFrameRate>29.971</Track1:VideoFrameRate> 
```

Put another way, at `30X`, 1 second of processed video is the equivalent to 30 seconds of footage (so each frame in processed video is spaced 1 second apart in real world time).

At `2X`, these 30 frames are spaced 0.066 seconds apart in real world time.

At normal speed, 30 frames per second is the equivalent of frames being spaced 0.033 seconds apart.

Therefore you will probably want higher extraction rates for Timewarp videos shot at higher speeds. Extracting 1 frame every second would result in final frames being 30 seconds apart.

The table below gives some example values where 1, 2, and 5 FPS values are used during ffmpeg extraction of frames for each Timewarp mode.

<table class="tableizer-table">
<thead><tr class="tableizer-firstrow"><th>Timewarp mode</th><th>Each photo true time (sec) @1 FPS</th><th>Each photo true time (sec) @2 FPS</th><th>Each photo true time (sec) @5 FPS</th></tr></thead><tbody>
 <tr><td>2x</td><td>2</td><td>1</td><td>0.4</td></tr>
 <tr><td>5x</td><td>5</td><td>2.5</td><td>1</td></tr>
 <tr><td>10x</td><td>10</td><td>5</td><td>2</td></tr>
 <tr><td>15x</td><td>15</td><td>7.5</td><td>3</td></tr>
 <tr><td>30x</td><td>30</td><td>15</td><td>6</td></tr>
</tbody></table>

For example, if a video was shot at 10x, and we extract at 5 FPS using ffmpeg (shown below), each frame extracted by ffmpeg will be exactly 2 seconds apart in real-world time.

 In short, we can use ffmpeg like so;

```
$ ffmpeg -i GS019006.mp4 -r 5 -q:v 2 FRAMES/img%d.jpg
```

* -r: Set frame rate (Hz value, fraction or abbreviation).
* -q:v: [Controls the quality of output](https://stackoverflow.com/questions/10225403/how-can-i-extract-a-good-quality-jpeg-image-from-a-video-file-with-ffmpeg/10234065#10234065)

## Ensuring time positioning is correct

As I've already covered, Timewarp frames are sped up. However time and GPS points (in video metadata) are recorded in real-world time.

That means you need to account for the real world time when assigning the datetime of the extracted frames. This is essential if you want to geotag the photos.

We can work out the real-world time spacing of the extracted frames using framerate of ffmpeg extraction value and the GoPro Timewarp mode (as demonstrated in the last table).

The other crucial piece of information is when the recording started. 

To assign first photo time, we can use the first `GPSDateTime` value reported in telemetry.

Using the known time-spacing between photos, you can then incrementally add the times to all subsequent photos in the sequence (why it's important to logically name your sequences when extracting using ffmpeg -- e.g. in numerical order; `img%d.jpg`)

For example, if the time spacing between images is 2 seconds and the first GPSDateTime is 12:00:02; then `image1` time is 12:00:00, `image2` time is 12:00:02, `image3` 12:00:04, and so on.

All that's left to do now is actually write the correct times into the photos.

[The steps to do this are described in this post (as well as how to extract and write GPS extracted from the Timewarp video to each image)](/blog/2021/turn-360-video-into-timelapse-images-part-2).