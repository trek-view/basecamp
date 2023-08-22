---
date: 2022-04-22
title: "Turning a GoPro TimeLapse Video into Photo Frames"
description: "TimeLapse video mode is perfect for creating beautiful TimeLapses, but poses some unique challenges when trying to split them into individual frames."
categories: developers
tags: [FFMpeg, exiftool, metadata, XMP, EXIF, GoPro, timewarp, timelapse, Fusion]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-04-22/gopro-hero5-black-time-lapse-settings-meta.jpeg
featured_image: /assets/images/blog/2022-04-22/gopro-hero5-black-time-lapse-settings-sm.jpg
layout: post
published: true
redirect_from:
  - /blog/2022/turn-gopro-timelapse-video-into-timelapse-images
---

**TimeLapse video mode is perfect for creating beautiful TimeLapses, but poses some unique challenges when trying to split them into individual frames.**

[Earlier in the year I talked about turning videos shot on HERO and MAX cameras in TimeWarp mode into still frames](/blog/turn-gopro-timewarp-video-into-timelapse-images).

The GoPro Fusion camera was released before TimeWarp mode was introduced by GoPro into their lineup of cameras ([TimeWarp 1.0 with the Hero 7 in 2019](https://community.gopro.com/s/article/what-is-timewarp-video) and [TimeWarp 2.0 with HERO 8 Black in 2020](https://community.gopro.com/s/article/HERO8-Black-TimeWarp-2-0?language=en_US)).

TimeLapse video mode, available on all GoPro cameras (HERO cameras 7 and older), is more suited to recordings when you're not moving (the benefit of TimeWarp is the stability/smoothing it adds to the video).

Like with TimeWarp videos, when it comes to turning GoPro TimeLapse videos into photo frames, there are a few extra things to consider when compared to normal GoPro videos (non-TimeLapse/TimeWarp).

If you've reached this post looking to convert a regular video into frames, [the process for doing so is described in this post from 2021](/blog/turn-360-video-into-timelapse-images-part-1).

## TimeLapse 101

From the GoPro user manuals:

> Use this preset to capture timelapse video when your camera is mounted and still. It’s great for sunsets, street scenes, art projects, and other shots that unfold over a long period of time.

There are 6 interval options; `0.5s`, `1s`, `2s`, `5s`, `10s`, `30s`, and `60s`.

The interval determines how often a frame is captured. For example, setting the interval to `10s` captures one frame every 10 seconds.

GoPro then pack the resulting .mp4 (or dual .mp4's from the Fusion or .360 from the MAX) to a video with a frame rate of 30 FPS (29.97).

The interval setting therefore also determines how fast the real world time is sped up.

Here are more examples using each TimeLapse interval settings and the resulting times for output TimeLapse videos (for a 600 second video);

<table class="tableizer-table">
<thead><tr class="tableizer-firstrow"><th>Interval (secs)</th><th>Recording time (secs)</th><th>TimeLapse Video length (secs)</th></tr></thead><tbody>
 <tr><td>0.5</td><td>600</td><td>40</td></tr>
 <tr><td>1</td><td>600</td><td>20</td></tr>
 <tr><td>2</td><td>600</td><td>10</td></tr>
 <tr><td>5</td><td>600</td><td>4</td></tr>
 <tr><td>10</td><td>600</td><td>2</td></tr>
 <tr><td>30</td><td>600</td><td>0.6666666667</td></tr>
 <tr><td>60</td><td>600</td><td>0.3333333333</td></tr>
</tbody></table>

The calculation to work out Video length (secs) in the table above is; `recording time (secs) / (interval (secs) * 30 (fps))`.

You can see when shooting at a 60 second interval, even 10 mins of recording (600 seconds) produces just 0.3 seconds worth of TimeLapse video (to get a second, you'd need to record for 30 minutes!).

It's also possible to calculate actual recording time according to mode. We know the timelapse frames are packed at 29.97 per second. So we can multiply the interval by frame rate.

Using TimeLapse 0.5 second mode as an example; `29.97` * `0.5` = actual recording time for 1 second = 59.94 seconds.

Or for TimeLapse mode 60 seconds; `29.97` * `60` = actual recording time for 1 second = 1798.2 seconds (29.97 minutes).

Still a little confused? Here I cycled round my block in each TimeLapse mode to demonstrate what the output of the same circuit looks like (you can see the actual recording times are all very similar)...

### GoPro MAX 360 Timelapse 0.5s (2_1) Sample

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/HEnMVB7aQFU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

* Duration (`.360`): 10.88 s
* Number of frames (`.360`): `10.88 * 29.97` = 326
* Actual recording length (`.360`): `10.88 * (0.5 * 29.97)` = 163.0368s
* [Download video files and metadata here (GS016145)](https://drive.google.com/open?id=1y5Fr12-WBOC92CfXuXbm_IF4bNpc--Ih&authuser=dgreenwood%40trekview.org&usp=drive_fs)

### GoPro MAX 360 Timelapse 1s (1_1) Sample

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/NBZD49z4B9A" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

* Duration (`.360`): 5.07 s
* Number of frames (`.360`): `5.07 * 29.97` = 151.9479
* Actual recording length (`.360`): `5.07 * (1 * 29.97)` = 151.9479s
* [Download video files and metadata here (GS016146)](https://drive.google.com/open?id=1p02nkRbkRXuGcjaJfVCi6EdKd7TqtlU0&authuser=dgreenwood%40trekview.org&usp=drive_fs)

### GoPro MAX 360 Timelapse 2s (1_2) Sample

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/16FoWbEzW7U" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

* Duration (`.360`): 2.60 s
* Number of frames (`.360`): `2.60 * 29.97` = 77.922
* Actual recording length (`.360`): `2.60 * (2 * 29.97)` = 155.844s
* [Download video files and metadata here (GS016147)](https://drive.google.com/open?id=1-nDq42ZCbGnCp_U7g-yeBKQ6kUeMk1PE&authuser=dgreenwood%40trekview.org&usp=drive_fs)

### GoPro MAX 360 Timelapse 5s (1_5) Sample

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/onyXxat9DAI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

* Duration (`.360`): 1.07 s
* Number of frames (`.360`): `1.07 * 29.97` = 32.0679
* Actual recording length (`.360`): `1.07 * (5 * 29.97)` = 160.3395s

* [Download video files and metadata here (GS016148)](https://drive.google.com/open?id=1Og3y76m9xPkqwg0AD7V_0APBzu1Epyey&authuser=dgreenwood%40trekview.org&usp=drive_fs)

### GoPro MAX 360 Timelapse 10s (1_10) Sample

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/JcatPT2jPWw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

* Duration (`.360`): 0.57 s
* Number of frames (`.360`): `0.57 * 29.97` = 17.0829
* Actual recording length (`.360`): `0.57 * (10 * 29.97)` = 170.829s

* [Download video files and metadata here (GS016149)](https://drive.google.com/open?id=1Blneavuy9yHPA8lbv2VABg7lAUch8sVV&authuser=dgreenwood%40trekview.org&usp=drive_fs)

### GoPro MAX 360 Timelapse 30s (1_30) Sample

* Duration (`.360`): 0.20 s
* Number of frames (`.360`): `0.2 * 29.97` = 5.994
* Actual recording length (`.360`): `0.20 * (30 * 29.97)` = 179.82s

Too short for YouTube upload (but can be processed by GoPro Player).

* [Download video files and metadata here (GS016150)](https://drive.google.com/open?id=1hoFOTtojoPvRilLLtK_zORRMqUS-1eur&authuser=dgreenwood%40trekview.org&usp=drive_fs)

### GoPro MAX 360 Timelapse 60s (1_60) Sample

* Duration (`.360`): 0.10 s
* Number of frames (`.360`): `0.1 * 29.97` = 2.997
* Actual recording length (`.360`): `0.10 * (60 * 29.97)` = 179.82s)

Too short to be processed by GoPro Player.

* [Download video files and metadata here (GS016152)](https://drive.google.com/open?id=1eTvMf8WTa9E9VA3W90emYddEiQe_u6vH&authuser=dgreenwood%40trekview.org&usp=drive_fs)

## Identifying videos shot in TimeLapse

GoPro expose if the video was shot in TimeLapse mode using the `GoPro:Rate` metatag as follows; 0.5s = `2_1SEC`, 1s = `1_1SEC`, 2s = `1_2SEC`, 5s = `1_5SEC`, 10s = `1_10SEC`, 30s = `1_30SEC`, 60s = `1_60SEC`

As an example; `<GoPro:Rate>2_1SEC</GoPro:Rate>`, identifies the video being shot in TimeLapse mode at a `0.5s` interval.

* FUSION:
  * for dual fisheye mp4 videos, in the front file (`GPFR`) file metadata
    * note, this tag is not in the single processed .mp4 from GoPro Fusion Studio software -- it is therefore impossible to automatically detect if these files were shot in TimeLapse and what interval setting was used. 
* MAX:
  * for 360 videos, in the raw .360 file metadata
    * note, this tag is not in the processed .mp4 from GoPro Player software -- it is therefore impossible to automatically detect if these files were shot in TimeLapse and what interval setting was used. 
  * for HERO videos, in the .mp4 file metadata.
* HERO:
  * for HERO videos, in the .mp4 file metadata.

[Be careful, the `GoPro:Rate` metatag is used to identify TimeWarp videos too (but the values are different)](/blog/turn-gopro-timewarp-video-into-timelapse-images)).

Also, a secondary check can be made to validate the videos do not have an audio track (no TimeLapse videos, in any mode, contain an audio track). If the below was present in the video metadata, it would confirm the video was shot in normal video mode (not TimeLapse mode);

```
<TrackN:HandlerClass>Media Handler</TrackN:HandlerClass>
<TrackN:HandlerType>Audio Track</TrackN:HandlerType>
```

## Choosing the right framerate for extraction

We already know GoPro packs frames at 30 FPS in the final video.

However, GPS points (and other video metadata) are recorded in real-world time.

What this means is that the video track is sped up, but telemetry track is in normal time.

Therefore, when frames are extracted, we also need to normalise the timestamp assigned to each frame to match the real-world time it was taken.

We can work out the real-world time spacing of the extracted frames using framerate of ffmpeg extraction value and the GoPro TimeLapse mode (as demonstrated in the last table) using the calculation `(30 fps * interval setting) / extraction rate`.

The table below gives some examples;

<table class="tableizer-table">
<thead><tr class="tableizer-firstrow"><th>Timelapse mode (e.g 0.5 sec)</th><th>Each photo spacing (sec) @ 0.1 FPS extraction rate</th><th>Each photo spacing (sec) @ 0.2 FPS extraction rate</th><th>Each photo spacing (sec) @ 0.5 FPS extraction rate</th><th>Each photo spacing (sec) @ 1 FPS extraction rate</th><th>Each photo spacing (sec) @ 2 FPS extraction rate</th><th>Each photo spacing (sec) @ 5 FPS extraction rate</th></tr></thead><tbody>
 <tr><td>0.5</td><td>150</td><td>75</td><td>30</td><td>15</td><td>7.5</td><td>3</td></tr>
 <tr><td>1</td><td>300</td><td>150</td><td>60</td><td>30</td><td>15</td><td>6</td></tr>
 <tr><td>2</td><td>600</td><td>300</td><td>120</td><td>60</td><td>30</td><td>12</td></tr>
 <tr><td>5</td><td>1500</td><td>750</td><td>300</td><td>150</td><td>75</td><td>30</td></tr>
 <tr><td>10</td><td>3000</td><td>1500</td><td>600</td><td>300</td><td>150</td><td>60</td></tr>
 <tr><td>60</td><td>18000</td><td>9000</td><td>3600</td><td>1800</td><td>900</td><td>360</td></tr>
</tbody></table>

For example, if a video was shot at a 2 second interval, and we extract frames from the video at 5 FPS using ffmpeg, each frame extracted by ffmpeg will be exactly 12 seconds apart in real-world time.

The ffmpeg command for this would be something like;

```
$ ffmpeg -i GS019006.mp4 -r 5 -q:v 2 FRAMES/img%d.jpg
```

* `-r`: Set frame rate (Hz value, fraction or abbreviation).
* `-q:v`: [Controls the quality of output](https://stackoverflow.com/questions/10225403/how-can-i-extract-a-good-quality-jpeg-image-from-a-video-file-with-ffmpeg/10234065#10234065)

## Setting frame times

The other crucial piece of information required to timestamp the frames is when the recording started. 

To assign first photo time, we can use the first `GPSDateTime` value reported in telemetry.

Using the known time-spacing between photos, you can then incrementally add the times to all subsequent photos extracted (why it is important to logically name your sequences when extracting using ffmpeg -- e.g. in numerical order; `img%d.jpg`)

For example, if the time spacing between images is 12 seconds and the first GPSDateTime is 12:00:00; then `image1` time is 12:00:00, `image2` time is 12:00:12, `image3` 12:00:24, and so on.

All that is left to do now is actually write the correct times into the photos.

[The steps to do this are described in this post (as well as how to extract and write GPS points extracted from the Timewarp video to each image)](/blog/turn-360-video-into-timelapse-images-part-2).