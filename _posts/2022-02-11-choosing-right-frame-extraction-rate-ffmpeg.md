---
date: 2022-02-11
title: "Choosing the right frame rate for extractions"
description: "How to optimise the process of turning a video into frames"
categories: developers
tags: [FFMpeg, video]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-02-11/
featured_image: /assets/images/blog/2022-02-11/
layout: post
published: false
---

**How to optimise the process of turning a video into frames.**

[Last week I talked about the importance of considering framerate for timewarp videos when extracting frames from it](/blog/2022/turn-360-timewarp-video-into-timelapse-images).

Though it's something to consider when 

## Drea

With the Trek Pack v1 we shot in timelapse mode, [where the inteval setting was determined by the transport used during shooting](/blog/2019/diy-google-street-view-part-3-preparing-to-shoot)

<table class="tableizer-table">
<thead><tr class="tableizer-firstrow"><th>Timelapse setting (secs)</th><th>Sport</th></tr></thead><tbody>
 <tr><td>0.5</td><td>Downhill sports (skiing, MTB, etc)</td></tr>
 <tr><td>1</td><td>Bi-cyling (flat), kayaking (downstream)</td></tr>
 <tr><td>2</td><td>Hiking (downhill)</td></tr>
 <tr><td>5</td><td>Hiking (uphill), walking, paddleboarding</td></tr>
</tbody></table>

One reasons we started to shoot in video mode was because the lowest timelapse interval on the MAX camera used on the v2 Trek Pack was 2 seconds. 

## Why framerate is importants

The further apart images are in a virtual tower, the worse the viewing experience is.

As technology develops having more data available is advantageous. For example, mapping objects in real space using photgrammetry. The resulting 3D model is more accurate when there are more data points (photos) with slightly different angles.

Considering viewing experiences alone, [as indicated by this post on the Google support forum](https://support.google.com/maps/forum/AAAAQuUrST8X8OxIdF011I/?hl=en&gpf=d/topic/maps/X8OxIdF011I), Google Street View paths (photos connected with a blue line) should not be greater than 5 meters apart.

Though 5 meters is still a big gap, expesically in enclosed spaces.

We decides a gap of a meter between photos is optimal.

To be able to space photos at a desired interval, you must also know the speed of travel.

The table above gives some rough averages. 

<table class="tableizer-table">
<thead><tr class="tableizer-firstrow"><th>Sport</th><th>Ave speed km/h</th><th>Ave speed m/s</th></tr></thead><tbody>
 <tr><td>Downhill sports (skiing, MTB, etc)</td><td>30</td><td>8.3</td></tr>
 <tr><td>Bi-cyling (flat), kayaking (downstream)</td><td>20</td><td>2.5</td></tr>
 <tr><td>Hiking (downhill)</td><td>6</td><td>1.6</td></tr>
 <tr><td>Hiking (uphill), walking, paddleboarding</td><td>3</td><td>0.8</td></tr>
</tbody></table>

Using



The benefit of video is that this framerate can be defined in post-pressing, which can accoutn

In Explorer, we wanted to find a way to optimally extract frames from video f

## Travelling speed of capture

On of the main problems with timelapse captures is that your speed of travel is not uniform. Often you will start and stop. Be climing or descending. All of which will chage the rate at which you're moving across the ground.

GoPro videos offer an advantage here. The speed of travel is actually reported in the metadata ([GPMF](/blog/2020/metadata-exif-xmp-360-video-files-gopro-gpmd)).

[Here is the metadata of a sample video shot on the MAX](https://github.com/trek-view/gopro-metadata/blob/main/max/max-360-vid-001s1/GS018421-5_6k-output.xml).

You'll see two types of GPSSpeed values are regularly reported alongside position, `GPSSpeed` and `GPSSpeed3D`.

```
 <Track3:GPSLatitude>51 deg 16&#39; 21.22&quot; N</Track3:GPSLatitude>
 <Track3:GPSLongitude>0 deg 50&#39; 45.55&quot; W</Track3:GPSLongitude>
 <Track3:GPSAltitude>81.072 m</Track3:GPSAltitude>
 <Track3:GPSSpeed>0.488</Track3:GPSSpeed>
 <Track3:GPSSpeed3D>0.51</Track3:GPSSpeed3D>
```

`GPSSpeed` is the horizontal speed (2 Dimensional -- latitude and longitude). `GPSSpeed3D` accounts for horizontal and vertical changes (3 Dimensional -- latitude and longitude and altitude).

`GPSSpeed3D` takes into account that Earth is round, and the ground on the planet is not flat. 

<img class="img-fluid" src="/assets/images/blog/2022-02-11/gps-speed-3d-2d.jpg" alt="GPS Speed 3D and GPS Speed 2D" title="GPS Speed 3D and GPS Speed 2D" />

The above illustates this perfectly. Travelling 



## Fffmpeg

ffmpeg does not have an easy way to tie the GoPro speed value for framerate.

In previous posts I've talke about using ffmpeg to extract at a fixed framerate, e.g. 5 FPS;

```
$ ffmpeg -i GS019006.mp4 -r 5 -q:v 2 FRAMES/img%d.jpg
```

* -r: Set frame rate (Hz value, fraction or abbreviation).
* -q:v: [Controls the quality of output](https://stackoverflow.com/questions/10225403/how-can-i-extract-a-good-quality-jpeg-image-from-a-video-file-with-ffmpeg/10234065#10234065)

Unfortunatley (and as expected), it does not account for extraction at variable framerates in a single video. Most videos, including those, shot on GoPro's are shot at the same framerate from start to finish. Defined in the framerate

Mo
-r[:stream_specifier] fps (input/output,per-stream)
Set frame rate (Hz value, fraction or abbreviation).

https://ffmpeg.org/ffmpeg.html#Video-Options

As an input option, ignore any timestamps stored in the file and instead generate timestamps assuming constant frame rate fps. This is not the same as the -framerate option used for some input formats like image2 or v4l2 (it used to be the same in older versions of FFmpeg). If in doubt use -framerate instead of the input option -r.

As an output option, duplicate or drop input frames to achieve constant output frame rate fps, e.g

```
<Track1:VideoFrameRate>29.971</Track1:VideoFrameRate> 
```

This means the easiest way to define spacing is to:

1. Extract all frames from the video (using the framerate reported in the video metadata)
2. Geotag all frames (using GPS telemetry stream)
	2.1 A note on this: GPS does not report at the same framerate
3. Calculate distance between photos using positional information.
2020-01-17-what-direction-are-you-facing.md
4. Set defined spacing (e.g. 1 meter) and discard photos between points that this value.


Show example.

This 

