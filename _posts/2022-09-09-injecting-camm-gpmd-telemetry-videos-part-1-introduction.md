---
date: 2022-09-09
title: "Injecting Telemetry into Video Files (Part 1): An Introduction"
description: "In this post I will explain why we, finally, have decided to figure out how to write geo-telemetry into video files created using ffmpeg."
categories: developers
tags: [gpmd, camm, telemetry, gpmf, gpx]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-09-09/gmpf-telemetry-ffprobe-meta.jpg
featured_image: /assets/images/blog/2022-09-09/gmpf-telemetry-ffprobe-sm.jpg
layout: post
published: true
redirect_from:
  - /blog/2022/injecting-camm-gpmd-telemetry-videos-part-1-introduction
---

**In this post I will explain why we, finally, have decided to figure out how to write geo-telemetry into video files created using ffmpeg.**

Before reading this series of posts I recommend some pre-reading;

* [An Introduction to the GoPro Metadata Format (GPMF) standard (video telemetry)](/blog/metadata-exif-xmp-360-video-files-gopro-gpmd/)
* [An Introduction to the Camera Motion Metadata (CAMM) standard (video telemetry)](/blog/metadata-exif-xmp-360-video-files-camm-camera-motion-metadata-spec/)

I wanted a way for users to upload sequences to Google Street View. After a bit of digging I realised you could upload videos alongside a GPX files to be published. This process is described in our blog; [Creating a Video File Ready to be Uploaded to the Google Street View API](/blog/create-google-street-view-video-publish-api/).

Now, this approach works and there is nothing wrong with it per-se. However, it always slightly bugged me that the video need to be kept alongside the GPX file when sharing if you wanted to use it elsewhere. In many cases, using it elsewhere was also problematic.

For example, YouTube can pick up embedded location information in videos. However, there is no way to upload a separate GPX file.

In short, we had to bite the bullet and learn how to inject telemetry into the video using Street View supported standards (CAMM and GPMD).

## What we already know (and can reuse)

We can pack the video and prepare the GPS in the same way as described in; [Creating a Video File Ready to be Uploaded to the Google Street View API](/blog/create-google-street-view-video-publish-api/).

Which leaves us needing to;

1. Convert the GPX into CAMM or GPMF
2. Inject that into the video somehow

Clearly there are still a lot of unknowns.

Before we get into each of the standards, it is important to understand how telemetry is stored inside a video.

## What embedded telemetry "looks like"

### GPMF

Lets look at an example GoPro video wrapper using ffprobe;

```shell
ffprobe GS018423.mp4
```

Which prints;

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

We can see in stream `0:2` shows the data should be `gpmd` (GoPro Metadata).

Using exiftool, we can look at the telemetry in the `gpmd` track (`2`);

```shell
exiftool -ee -G3 -api LargeFileSupport=1 -X GS018423.mp4 > GS018423-exiftool.xml
```

Here is a snippet of the output, containing GPMF data;

```xml
 <Track3:ColorTemperatures>6763 6787 6787 6787 6787 6787 6787 6787 6787 6787</Track3:ColorTemperatures>
 <Track3:TimeStamp>0.137931</Track3:TimeStamp>
 <Track3:WhiteBalanceRGB>(Binary data 221 bytes, use -b option to extract)</Track3:WhiteBalanceRGB>
 <Track3:TimeStamp>0.132114</Track3:TimeStamp>
 <Track3:ISOSpeeds>100 100 100 100 100 101 101 100 100 100 100 101 100 100 100 101 100 100 100 100 101 101 101 100 100 101 100 100 100</Track3:ISOSpeeds>
 <Track3:TimeStamp>0.137931</Track3:TimeStamp>
 <Track3:InputUniformity>0 0 0 0 0 0 0 0 0 0</Track3:InputUniformity>
 <Track3:TimeStamp>0.131738</Track3:TimeStamp>
 <Track3:GPSMeasureMode>3-Dimensional Measurement</Track3:GPSMeasureMode>
 <Track3:GPSDateTime>2021:09:04 07:25:17.484</Track3:GPSDateTime>
 <Track3:GPSHPositioningError>1.39</Track3:GPSHPositioningError>
 <Track3:GPSLatitude>51 deg 16&#39; 21.21&quot; N</Track3:GPSLatitude>
 <Track3:GPSLongitude>0 deg 50&#39; 45.58&quot; W</Track3:GPSLongitude>
 <Track3:GPSAltitude>84.067 m</Track3:GPSAltitude>
 <Track3:GPSSpeed>0.094</Track3:GPSSpeed>
 <Track3:GPSSpeed3D>0.12</Track3:GPSSpeed3D>
```

### CAMM

Now an example of a video containing CAMM structured telemetry;

```shell
ffprobe 200619_161801314.mp4 
```

Which prints;

```
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from '200619_161801314.mp4':
  Metadata:
    major_brand     : mp42
    minor_version   : 0
    compatible_brands: isommp42
    creation_time   : 2020-06-19T15:18:18.000000Z
    com.android.version: 7.0
    make            : Pisofttech
    make-eng        : Pisofttech
    model           : Pilot Era
    model-eng       : Pilot Era
    firmware        : 5020
  Duration: 00:00:12.00, start: 0.000000, bitrate: 103315 kb/s
  Stream #0:0[0x1](eng): Data: none (camm / 0x6D6D6163), 2 kb/s (default)
    Metadata:
      creation_time   : 2020-06-19T15:18:18.000000Z
      handler_name    : MetadHandle
  Stream #0:1[0x2](eng): Video: h264 (Baseline) (avc1 / 0x31637661), yuv420p(tv, bt2020nc/bt2020/bt709, progressive), 7680x3840, 103310 kb/s, SAR 1:1 DAR 2:1, 7 fps, 7 tbr, 90k tbn (default)
    Metadata:
      creation_time   : 2020-06-19T15:18:18.000000Z
      handler_name    : VideoHandle
      vendor_id       : [0][0][0][0]
    Side data:
      spherical: equirectangular (0.000000/0.000000/0.000000) 
```

Here we can see stream `0:0` shows the data should be `camm` (Camera Motion Metadata Spec).

Using exiftool, we can look at the telemetry in the `camm` track (`0`);

```shell
exiftool -ee -G3 -api LargeFileSupport=1 -X 200619_161801314.mp4 > 200619_161801314-exiftool.xml
```

See the `MetaFormat` declared as CAMM;

```xml
<Track1:MetaFormat>camm</Track1:MetaFormat>
```

And here is a snippet of the output, containing CAMM data;

```xml
 <Track1:SampleTime>0 s</Track1:SampleTime>
 <Track1:SampleDuration>0 s</Track1:SampleDuration>
 <Track1:GPSDateTime>1980:01:06 00:00:05.028566Z</Track1:GPSDateTime>
 <Track1:GPSMeasureMode>3-Dimensional Measurement</Track1:GPSMeasureMode>
 <Track1:GPSLatitude>53 deg 10&#39; 55.30&quot; N</Track1:GPSLatitude>
 <Track1:GPSLongitude>2 deg 51&#39; 40.64&quot; W</Track1:GPSLongitude>
 <Track1:GPSAltitude>22.8 m</Track1:GPSAltitude>
 <Track1:GPSHorizontalAccuracy>1.02999997138977</Track1:GPSHorizontalAccuracy>
 <Track1:GPSVerticalAccuracy>1.02999997138977</Track1:GPSVerticalAccuracy>
 <Track1:GPSVelocityEast>0</Track1:GPSVelocityEast>
 <Track1:GPSVelocityNorth>0.0926000028848648</Track1:GPSVelocityNorth>
 <Track1:GPSVelocityUp>0</Track1:GPSVelocityUp>
 <Track1:GPSSpeedAccuracy>0</Track1:GPSSpeedAccuracy>
```

## BUT... it's not all this simple

At this point you might simply assume you can import metadata to an mp4 video file easily (because it is easy to print it using exiftool).

Unfortunately not. This is due to the structure of mp4 files.

Before we can even start talking about telemetry, it is first important to understand the structure of of mp4 files. I will leave that explanation until next week.