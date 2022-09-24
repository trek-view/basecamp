---
date: 2022-03-17
title: "FFmpeg Cheat Sheet for virtual 360 tours (Part 2)"
description: "A guide that shows some of the commands we use most for processing 360 virtual tour videos."
categories: developers
tags: [exiftool, ffmpeg, gmpd, telemetry, metadata]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-03-11/ffmpeg-virtual-tour-cheat-sheet-meta.jpg
featured_image: /assets/images/blog/2022-03-11/ffmpeg-virtual-tour-cheat-sheet-sm.jpg
layout: post
published: false
---

At the end of last weeks post I teased you with a possible part 2 of my post; [FFmpeg Cheat Sheet for virtual 360 tours](/blog/2022/ffmpeg-video-to-frame-cheat-sheet).

Well here it is.

In part one I talked about taking a video and turning it into frames, something we do to create a series of photos for a virtual tour.


Thi

If this sounds familiar, then it is. [I've talked briefly about doing this before](/blog/2021/turn-360-photos-into-360-video).

Though this didn't include modification of telemetry

or Google Street View submissions where the easiest way to submit content is in video format


If you're not part of our Slack commun

## Is it possible to remove sound from .360 video with ffmpeg?

Yes... but it requires a custom ffmpeg build.

The master ffmpeg software build does not contain the right filters to convert GoPro’s EAC format out of the box (at the time of writing). As the process to do this will require copying the video, you will therefore need a custom ffmpeg fork with a GoPro EAC filter.

[Early this year I showed how to install and run such an ffmpeg fork](/blog/2022/using-ffmpeg-process-gopro-max-360/) that will do this.

Once installed and running, you can use ffmpeg to remove the sound like so;

```shell
ffmpeg -i INPUT.360 -vcodec copy -an OUTPUT.360
```

If possible, I would generally advise removing the sound after processing the .360 into an .mp4 using the same method shown above as it can be done with vanilla ffmpeg.

```shell
ffmpeg -i INPUT.mp4 -vcodec copy -an OUTPUT.mp4
```

In both cases, you will need to copy over the global metadata tags;

```shell
exiftool -TagsFromFile INPUT.360 "-all:all>all:all" INPUT.360
```

## I want to create a 16:9 thumbnail from a 360 frame

The easy






```shell
ffprobe GS018423.360
```

```
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from 'GS018423.360':
  Metadata:
    major_brand     : mp41
    minor_version   : 538120216
    compatible_brands: mp41
    creation_time   : 2021-09-04T08:25:53.000000Z
    location        : +51.2726-000.8460/
    location-eng    : +51.2726-000.8460/
    firmware        : H19.03.02.00.00
  Duration: 00:00:18.59, start: 0.000000, bitrate: 66531 kb/s
  Stream #0:0[0x1](eng): Video: hevc (Main) (hvc1 / 0x31637668), yuvj420p(pc, bt709), 2272x736 [SAR 1:1 DAR 71:23], 29981 kb/s, 59.94 fps, 59.94 tbr, 60k tbn (default)
    Metadata:
      creation_time   : 2021-09-04T08:25:53.000000Z
      handler_name    : GoPro H.265
      vendor_id       : [0][0][0][0]
      encoder         : GoPro H.265 encoder
      timecode        : 08:25:23:20
  Stream #0:1[0x2](eng): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 188 kb/s (default)
    Metadata:
      creation_time   : 2021-09-04T08:25:53.000000Z
      handler_name    : GoPro AAC  
      vendor_id       : [0][0][0][0]
      timecode        : 08:25:23:20
  Stream #0:2[0x3](eng): Data: none (tmcd / 0x64636D74), 0 kb/s (default)
    Metadata:
      creation_time   : 2021-09-04T08:25:53.000000Z
      handler_name    : GoPro TCD  
      timecode        : 08:25:23:20
  Stream #0:3[0x4](eng): Data: bin_data (gpmd / 0x646D7067), 117 kb/s (default)
    Metadata:
      creation_time   : 2021-09-04T08:25:53.000000Z
      handler_name    : GoPro MET  
  Stream #0:4[0x5](eng): Data: none (fdsc / 0x63736466), 28 kb/s (default)
    Metadata:
      creation_time   : 2021-09-04T08:25:53.000000Z
      handler_name    : GoPro SOS  
  Stream #0:5[0x6](eng): Video: hevc (Main) (hvc1 / 0x31637668), yuvj420p(pc, bt709), 2272x736 [SAR 1:1 DAR 71:23], 30011 kb/s, 59.94 fps, 59.94 tbr, 60k tbn (default)
    Metadata:
      creation_time   : 2021-09-04T08:25:53.000000Z
      handler_name    : GoPro H.265
      vendor_id       : [0][0][0][0]
      encoder         : GoPro H.265 encoder
      timecode        : 08:25:23:20
    Side data:
      displaymatrix: rotation of nan degrees
  Stream #0:6[0x7](eng): Audio: pcm_s32le (in32 / 0x32336E69), 48000 Hz, ambisonic 1, s32, 6144 kb/s (default)
    Metadata:
      creation_time   : 2021-09-04T08:25:53.000000Z
      handler_name    : GoPro AMB  
      vendor_id       : [0][0][0][0]
```