---
date: 2022-09-02
title: "Injecting Telemetry into Video Files (Part 1): The Challenges"
description: "In this post I will explain why we, finally, have decided to figure out how to write geo-telemetry into video files created using ffmpeg."
categories: developers
tags: [gpmd, camm, telemetry, gpmf, gpx]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-09-02/gpmf-hex-meta.jpg
featured_image: /assets/images/blog/2022-09-02/gpmf-hex-sm.jpg
layout: post
published: true
---

**In this post I will explain why we, finally, have decided to figure out how to write geo-telemetry into video files created using ffmpeg.**

Before reading this series of posts I recommend some pre-reading;

* [An Introduction to the GoPro Metadata Format (GPMF) standard (video telemetry)](https://www.trekview.org/blog/2020/metadata-exif-xmp-360-video-files-gopro-gpmd/)
* [An Introduction to the Camera Motion Metadata (CAMM) standard (video telemetry)](https://www.trekview.org/blog/2021/metadata-exif-xmp-360-video-files-camm-camera-motion-metadata-spec/)

When building Explorer we wanted a way for users to upload sequences to Google Street View. After a bit of digging we realised you could upload videos alongside a GPX files to be published. This process is described in our blog; [Creating a Video File Ready to be Uploaded to the Google Street View API](https://www.trekview.org/blog/2022/create-google-street-view-video-publish-api/).

Now, this approach works and there is nothing wrong with it per se. However, it always slightly bugged me that the video need to be kept alongside the GPX file when sharing if you wanted to use it elsewhere. In many cases, using it elsewhere was also problematic.

For example, YouTube can pick up embedded location information in videos. However, there is no way to upload a separate GPX file.

In short, we had to bite the bullet and learn how to inject telemetry into the video using Street View supported standards (CAMM and GPMD).

## What we already know (and can reuse)

We can pack the video and prepare the GPS in the same way as described in; [Creating a Video File Ready to be Uploaded to the Google Street View API](https://www.trekview.org/blog/2022/create-google-street-view-video-publish-api/).

Which leaves us needing to;

1. (Maybe?) Convert the GPX into CAMM or GPMD
2. Inject that into the video somehow

## What embedded telemetry "looks like"

Before we get into each of the standards, it is important to understand how telemetry is stored inside a video.

Lets look at an example video wrapper using ffprobe;

```shell
ffprobe GS018423.mp4
```

```
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from 'GS018423.mp4':
  Metadata:
    major_brand     : qt  
    minor_version   : 0
    compatible_brands: qt  
    creation_time   : 2021-09-04T08:25:53.000000Z
  Duration: 00:00:18.57, start: 0.000000, bitrate: 38349 kb/s
  Stream #0:0[0x1](eng): Video: h264 (High) (avc1 / 0x31637661), yuv420p(tv, bt709, progressive), 3072x1536 [SAR 1:1 DAR 2:1], 38042 kb/s, 59.94 fps, 59.94 tbr, 600 tbn (default)
    Metadata:
      creation_time   : 2021-09-04T08:25:53.000000Z
      handler_name    : Core Media Video
      vendor_id       : [0][0][0][0]
      encoder         : H.264
    Side data:
      spherical: equirectangular (0.000000/0.000000/0.000000) 
  Stream #0:1[0x2](eng): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 188 kb/s (default)
    Metadata:
      creation_time   : 2021-09-04T08:25:53.000000Z
      vendor_id       : [0][0][0][0]
  Stream #0:2[0x3](eng): Data: bin_data (gpmd / 0x646D7067), 117 kb/s (default)
    Metadata:
      creation_time   : 2021-09-04T08:25:53.000000Z
      handler_name    : GoPro MET
```

We can see in stream (track) 4 (`[0x3]`) contains the telemetry information.

You will notice that the stream wrapper contains `bin_data`. Essentially this tells us how the data is packed -- as binary. This is true for CAMM too.

We can export it to take a look at it;

```shell
ffmpeg -i GS018423.mp4 -map 0:2 -c copy -f data GS018423-telemetry.dat
```

If with open up the outputted binary file `GS018423-telemetry.dat` in [Hex Fiend](https://hexfiend.com/) (or another HEX viewer) we can see the output.

<img class="img-fluid" src="/assets/images/blog/2022-09-02/gpmf-hex-sm.jpg" alt="GPMF HEX" title="GPMF HEX" />

The parsed output might look messy at this point, however, over the coming weeks I will explain how GPMD and CAMM can be written and embedded into videos.

In the next post we'll go back to basics (while, maybe for you, not me) as I attempt to explain the mp4 standard and why it's important when embedding telemetry.