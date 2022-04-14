---
date: 2022-04-22
title: "Turning a GoPro TimeLapse Video into Photo Frames"
description: "Time Lapse video mode is perfect for creating beautiful TimeLapses, but poses some unique challenges when trying to split them into individual frames."
categories: developers
tags: [FFMpeg, exiftool, metadata, XMP, EXIF, GoPro, timewarp, timelapse, Fusion]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-04-22/gopro-hero5-black-time-lapse-settings-meta.jpeg
featured_image: /assets/images/blog/2022-04-22/gopro-hero5-black-time-lapse-settings-sm.jpeg
layout: post
published: false
---

**Time Lapse video mode is perfect for creating beautiful TimeLapses, but poses some unique challenges when trying to split them into individual frames.**

[Earlier in the year I talked about turning videos shot on HERO and MAX cameras in Time Warp mode into still frames](/blog/2022/turn-gopro-timewarp-video-into-timelapse-images).

The GoPro Fusion camera came slightly before Time Warp mode was introduced by GoPro into their lineup of cameras ([TimeWarp 1.0 with the Hero 7 in 2019](https://community.gopro.com/s/article/what-is-timewarp-video) and [TimeWarp 2.0 with HERO 8 Black in 2020](https://community.gopro.com/s/article/HERO8-Black-TimeWarp-2-0?language=en_US)).

TimeLapse video mode available on all GoPro cameras is still very useful, especially when not moving (the benefit of TimeWarp is the stability/smooting it adds to the video).

Like with TimeWarp videos, when it comes to turning GoPro TimeLapse videos into photo frames, there are a few extra things to consider when compared to normal GoPro videos (non-TimeLapse/TimeWarp).

If you've reached this post looking to convert a regular video into frames, [the process for doing so is described in this post from 2021](/blog/2021/turn-360-video-into-timelapse-images-part-1).

## TimeLapse 101

From the GoPro user manuals:

> Use this preset to capture time lapse video when your camera is mounted and still. It’s great for sunsets, street scenes, art projects, and other shots that unfold over a long period of time.

There are 6 interval options; `0.5s`, `1s`, `2s`, `5s`, `10s`, `30s`, and `60s`.

The interval determines how often a frame is captured. For example, setting the interval to `10s` captures one frame every 10 seconds.

GoPro then pack the resulting .mp4 (or dual .mp4's from the Fusison or .360 from the MAX) to a video with a frame rate of 30 FPS (29.97).

The interval setting therefore also determines how fast the real world time is sped up.

Here are more examples using each TimeLapse interval settings and the resulting times for output TimeLapse videos (for a 600 second video);

<table class="tableizer-table">
<thead><tr class="tableizer-firstrow"><th>Interval (secs)</th><th>Recording time (secs)</th><th>Video length (secs)</th></tr></thead><tbody>
 <tr><td>0.5</td><td>600</td><td>40</td></tr>
 <tr><td>1</td><td>600</td><td>20</td></tr>
 <tr><td>2</td><td>600</td><td>10</td></tr>
 <tr><td>5</td><td>600</td><td>4</td></tr>
 <tr><td>10</td><td>600</td><td>2</td></tr>
 <tr><td>30</td><td>600</td><td>0.6666666667</td></tr>
 <tr><td>60</td><td>600</td><td>0.3333333333</td></tr>
</tbody></table>

The calculation to work out Video length (secs) in the table above is; `recording time (secs) / (interval (secs) * 30 (fps))`.

You can see when shooting at a 60 second interval, even 10 mins of recording (600 seconds) produces 0.3 seconds worth of TimeLapse video (to get a second, you'd need to record for 30 minutes!).

## Identifying videos shot in TimeLapse

GoPro expose if the video was shot in TimeLapse mode using the `GoPro:Rate` metatag as follows; 0.5s = `2_1SEC`, 1s = `1_1SEC`, 2s = `1_2SEC`, 5s = `1_5SEC`, 10s = `1_10SEC`, 30s = `1_30SEC`, 60s = `1_60SEC`

As an example; `<GoPro:Rate>2_1SEC</GoPro:Rate>`, identifies the video being shot in TimeLapse mode at a `0.5s` interval.

* FUSION:
  * for dual fisheye mp4 videos, in the front file (`GPFR`) file metadata
    * note, this tag is not in the processed .mp4 from GoPro Fusion Studio software -- it is impossible to automatically detect if these files were shot in TimeLapse and what interval setting was used. 
* MAX:
  * for 360 videos, in the raw .360 file metadata
    * note, this tag is not in the processed .mp4 from GoPro Player software -- it is impossible to automatically detect if these files were shot in TimeLapse and what interval setting was used. 
  * for HERO videos, in the .mp4 file metadata.
* HERO:
  * for HERO videos, in the .mp4 file metadata.

[Be careful, this tag is used to identify TimeWarp videos too (but the values are different)](/blog/2022/turn-gopro-timewarp-video-into-timelapse-images)).

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

We can work out the real-world time spacing of the extracted frames using framerate of ffmpeg extraction value and the GoPro TimeLapse mode (as demonstrated in the last table) using the calculation `30 * interval setting) / extraction rate`.

The table below gives some examples;

<table class="tableizer-table">
<thead><tr class="tableizer-firstrow"><th>Time lapse mode (e.g 0.5 sec)</th><th>Each photo spacing (sec) @ 0.1 FPS extraction rate</th><th>Each photo spacing (sec) @ 0.2 FPS extraction rate</th><th>Each photo spacing (sec) @ 0.5 FPS extraction rate</th><th>Each photo spacing (sec) @ 1 FPS extraction rate</th><th>Each photo spacing (sec) @ 2 FPS extraction rate</th><th>Each photo spacing (sec) @ 5 FPS extraction rate</th></tr></thead><tbody>
 <tr><td>0.5</td><td>150</td><td>75</td><td>30</td><td>15</td><td>7.5</td><td>3</td></tr>
 <tr><td>1</td><td>300</td><td>150</td><td>60</td><td>30</td><td>15</td><td>6</td></tr>
 <tr><td>2</td><td>600</td><td>300</td><td>120</td><td>60</td><td>30</td><td>12</td></tr>
 <tr><td>5</td><td>1500</td><td>750</td><td>300</td><td>150</td><td>75</td><td>30</td></tr>
 <tr><td>10</td><td>3000</td><td>1500</td><td>600</td><td>300</td><td>150</td><td>60</td></tr>
 <tr><td>60</td><td>18000</td><td>9000</td><td>3600</td><td>1800</td><td>900</td><td>360</td></tr>
</tbody></table>

For example, if a video was shot at a 2 second interval, and we extract at 5 FPS using ffmpeg, each frame extracted by ffmpeg will be exactly 12 seconds apart in real-world time.

The ffmpeg command for this would be something like;

```
$ ffmpeg -i GS019006.mp4 -r 5 -q:v 2 FRAMES/img%d.jpg
```

* -r: Set frame rate (Hz value, fraction or abbreviation).
* -q:v: [Controls the quality of output](https://stackoverflow.com/questions/10225403/how-can-i-extract-a-good-quality-jpeg-image-from-a-video-file-with-ffmpeg/10234065#10234065)

## Setting frame times

The other crucial piece of information required to timestamp the frames is when the recording started. 

To assign first photo time, we can use the first `GPSDateTime` value reported in telemetry.

Using the known time-spacing between photos, you can then incrementally add the times to all subsequent photos in the sequence (why it's important to logically name your sequences when extracting using ffmpeg -- e.g. in numerical order; `img%d.jpg`)

For example, if the time spacing between images is 12 seconds and the first GPSDateTime is 12:00:00; then `image1` time is 12:00:00, `image2` time is 12:00:12, `image3` 12:00:24, and so on.

All that's left to do now is actually write the correct times into the photos.

[The steps to do this are described in this post (as well as how to extract and write GPS extracted from the Timewarp video to each image)](/blog/2021/turn-360-video-into-timelapse-images-part-2).