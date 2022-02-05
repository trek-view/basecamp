---
date: 2022-02-04
title: "Turning a GoPro Timewarp Video into Frames"
description: ""
categories: developers
tags: [FFMpeg, exiftool, metadata, XMP, EXIF]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-02-04/
featured_image: /assets/images/blog/2022-02-04/
layout: post
published: true
---

The newer GoPro MAX camera and GoPro HERO cameras come with a Timelapse mode called Timewarp.

> TimeWarp is HyperSmooth applied to TimeLapse Video. It allows you to Capture super stabilized time lapse videos while you move about a scene. Increase the speed up to 30x to turn longer activities into shareable moments. 

_[Via GoPro](https://gopro.com/help/articles/block/what-is-timewarp-video?sf95804036=1)_

Timewarp mode creates a video file based on the speed settings. For example, if you selected a speed mode of `2X` and the recording time is 1 minute, the Timewarp video will be 30 seconds long. Essentially Timewarp mode speeds up time (in this case, by 2X).

<table class="tableizer-table">
<thead><tr class="tableizer-firstrow"><th>Speed</th><th>Recording time</th><th>Video length</th></tr></thead><tbody>
 <tr><td>2x</td><td>300 seconds</td><td>150 seconds</td></tr>
 <tr><td>5x</td><td>300 seconds</td><td>60 seconds</td></tr>
 <tr><td>10x</td><td>300 seconds</td><td>30 seconds</td></tr>
 <tr><td>15x</td><td>300 seconds</td><td>20 seconds</td></tr>
 <tr><td>30x</td><td>300 seconds</td><td>10 seconds</td></tr>
</tbody></table>


It's a paticularly useful mode when you want to share long content, like a day-long mountain bike trail. At `30x`  you want to upload to YouTube, recording in Timewarp for 1 hour (3600 seconds) will give a final video of 2 minutes (120 seconds).

Put another way, at `30X`, 1 second of processed video is the equiviland to 30 seconds of footage. At `2X`, 1 second of processed video is the equivialnt of 2 seconds.

To hightlight this, the following bits of footage were shot going back and forth on the same track.

### GoPro MAX 360 Timewarp 30x Sample


* Download processed .mp4 (see metadata here)
* Download raw .360 (see metadata here)

### GoPro MAX 360 Timewarp 15x Sample


* Download processed .mp4 (see metadata here)
* Download raw .360 (see metadata here)

### GoPro MAX 360 Timewarp 10x Sample


* Download processed .mp4 (see metadata here)
* Download raw .360 (see metadata here)

### GoPro MAX 360 Timewarp 5x Sample


* Download processed .mp4 (see metadata here)
* Download raw .360 (see metadata here)


### GoPro MAX 360 Timewarp 2x Sample


* Download processed .mp4 (see metadata here)
* Download raw .360 (see metadata here)

##

As we touched on last week, videos shot in Timelapse mode (vs. normal video mode) and the setting used can be identified using the `<GoPro:Rate>` tag. 

As an example; `<GoPro:Rate>2X</GoPro:Rate>`, identifies the video being shot in Timewarp mode at `2X` speed.

* MAX: for 360 videos, in the raw .360 file metadata (not the processed .mp4 from GoPro Player software). For HERO videos, in the .mp4 file metadata.
* HERO: in the .mp4 file metadata.

## Choosing the right framerate for extraction

[This process is the same as I've described previously for normal videos here](/blog/2021/turn-360-video-into-timelapse-images-part-1). In short, we can use ffmpeg like so;;

```
$ ffmpeg -i VIDEO_7152.mp4 -r 1 -q:v 2  FRAMES/img%d.jpg
```

* -r: Set frame rate (Hz value, fraction or abbreviation).
* -q:v: [Controls the quality of output](https://stackoverflow.com/questions/10225403/how-can-i-extract-a-good-quality-jpeg-image-from-a-video-file-with-ffmpeg/10234065#10234065)

One important thing to bear in mind is that the frame rate. Timelapse videos are always outputted at 30FPS, as defined in the `VideoFrameRate` tag.

```
<Track1:VideoFrameRate>29.971</Track1:VideoFrameRate> 
```

So 

The table below gives some example values where 1, 2, and 5 FPS values are used during ffmpeg extraction of frames.

<table class="tableizer-table">
<thead><tr class="tableizer-firstrow"><th>Timewarp mode</th><th>Each photo true time (sec) @1 FPS</th><th>Each photo true time (sec) @2 FPS</th><th>Each photo true time (sec) @5 FPS</th></tr></thead><tbody>
 <tr><td>2x</td><td>2</td><td>1</td><td>0.4</td></tr>
 <tr><td>5x</td><td>5</td><td>2.5</td><td>1</td></tr>
 <tr><td>10x</td><td>10</td><td>5</td><td>2</td></tr>
 <tr><td>15x</td><td>15</td><td>7.5</td><td>3</td></tr>
 <tr><td>30x</td><td>30</td><td>15</td><td>6</td></tr>
</tbody></table>


My point being, you might want higher extraction rates for Timewarp videos shot at higher speeds. Extracting 1 frame every second, like shown in the example command above, would result in final frames being 30 seconds apart.

## Ensuring time positioning is correct

Whilst Timewarp frames in the video are sped up, time and GPS points (in video metadata) are recorded in real world time.

That means you need to account for the real world time when assigning the datetime of the extracted frames. This is essential if you want to geotag the photos.

At `30X`, each 30 frames every second spaced 1 second apart in real world time. At `2X`, these 30 frames are spaced 0.066 seconds apart.



The ta







2021-02-26-turn-360-video-into-timelapse-images-part-2.md
