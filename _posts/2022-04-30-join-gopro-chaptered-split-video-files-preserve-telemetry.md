---
date: 2022-04-14
title: "Concatenating Chaptered GoPro Videos Whilst Preserving Telemetry"
description: "Use ffmpeg to create full length GoPro footage which retains full GPS information."
categories: developers
tags: [exiftool, ffmpeg, gmpd, telemetry, metadata, gpmf]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-04-14/
featured_image: /assets/images/blog/2022-04-14/
layout: post
published: false
---

**Use ffmpeg to create full length GoPro footage which retains full GPS information.**

If you have ever recorded longer sections of video on your GoPro camera, you will have found that video gets split up into smaller segments. Precisely how long the chunks are depends on the video mode you’re using and which camera model.

[This is because of chaptering employed by GoPro](https://community.gopro.com/s/article/GoPro-Camera-File-Chaptering-Information?language=en_US).

## GoPro Chaptering 101

As you will read via the link above, the newer models of GoPro use chapters of a maximum size of 4GB. Earlier models use smaller sizes.

Chaptering serves an important purpose to ensure compatibility with filesystem used on your memory card. 

By far the most widely compatible filesystem these days is known as FAT32 (for 32-bit File Allocation Table).

FAT32 is quite old–Microsoft first rolled it out with Windows 95–and it lacks some of the sophistication and features of newer file systems such as exFAT. Nevertheless, it has things going for it: it’s reliable, it offers solid performance, and, most importantly, it is very widely compatible.

That last point is crucial, because it means that you can put your memory card in pretty much any computer and be able to read it without having to install extra software. Whether you’re using Windows, Mac, or Linux, a FAT32 external hard drive or thumb drive or memory card should work. So nearly all consumer devices aim to be compatible with FAT32.

But FAT32 has a limitation hardcoded into it: the maximum file size that it can handle is 4GB. Back in Windows 95 days, that seemed pretty huge. These days, not so much.

If you’re recording a 5.6k 360 video on a GoPro MAX you are going to fill up 4GB pretty quickly (in about 8 minutes). If you’re using smaller or lower quality settings, you’ll get more footage before you hit that 4GB threshold, but not by much.

Once you get to 4GB, it’ll tie off that segment and start a new one. Once that new one gets to 4GB, it’ll start another. And so on, until you stop the recording, the card fills up, or your battery runs out.

As a concrete example, here is a list of the output files filmed in a single 18 minute and 28 second video on the GoPro MAX (30FPS / 5.6k).

* [GS010141.360](https://drive.google.com/file/d/1-Ikg4TOwYOb8g5sAwWThxvLJKuJPA6eH/view?usp=sharing) - 3.73GB - 08min:02sec
* [GS020141.360](https://drive.google.com/file/d/1-NgfbU5juFUtLxkD6eQG2_K82zMJl_VQ/view?usp=sharing) - 3.73GB - 08min:02sec
* [GS030141.360](https://drive.google.com/file/d/1-SV4tKwTh7MiX48wkmXP7ctJKP3_XN9V/view?usp=sharing) - 1.12GB - 02min:24sec

_Note how the first two digits determine the chapter number (`GS01`, `GS02`. `GS03`)._

## Joining chaptered GoPro vidoes

Whilst chaptering serves a technical purpose, it is annoying when you want to show a single video.

### GoPro mp4 videos (most GoPro cameras)

For this demo I will also use examples with the stitched `.mp4` versions of these files which retain GPMF ([as stitched with our recommended settings in GoPro Studio outlined here](/blog/2021/using-gopro-studio-process-360-files)).

These instructions will work for most HERO cameras (version 5 and newer) and stiched 360 videos from the Fusion and MAX cameras. This method could also be employed for dual GoPro Fusion fisheye `.mp4` videos.

Here are the demo files I'll use:

* [GS010141.mp4](https://drive.google.com/file/d/191priNLqmOTLWKlsVkjq1FTbkgC5gs3P/view?usp=sharing) - 3.81GB - 08min:02sec
* [GS020141.mp4](https://drive.google.com/file/d/19MPh4fR1P2GiyUDH-KtVONJXcu-WP7jc/view?usp=sharing) - 3.81GB - 08min:02sec
* [GS030141.mp4](https://drive.google.com/file/d/19jcPzpa4I1vEIwhqPdVsJCJ6gVcFu5cf/view?usp=sharing) - 1.14GB - 02min:24sec

These videos are all in the same format, and with the same structure (the output of ffprobe for GS030141.mp4 is shown below):

```
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from 'GS030141.mp4':
  Metadata:
    major_brand     : qt  
    minor_version   : 0
    compatible_brands: qt  
    creation_time   : 2020-08-02T12:45:54.000000Z
  Duration: 00:02:24.28, start: 0.000000, bitrate: 67767 kb/s
  Stream #0:0[0x1](eng): Video: hevc (Main) (hvc1 / 0x31637668), yuv420p(tv, bt709, progressive), 4096x2048 [SAR 1:1 DAR 2:1], 67538 kb/s, 29.97 fps, 29.97 tbr, 600 tbn (default)
    Metadata:
      creation_time   : 2020-08-02T12:45:54.000000Z
      handler_name    : Core Media Video
      vendor_id       : [0][0][0][0]
      encoder         : HEVC
    Side data:
      spherical: equirectangular (0.000000/0.000000/0.000000) 
  Stream #0:1[0x2](eng): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 189 kb/s (default)
    Metadata:
      creation_time   : 2020-08-02T12:45:54.000000Z
      vendor_id       : [0][0][0][0]
  Stream #0:2[0x3](eng): Data: bin_data (gpmd / 0x646D7067), 90 kb/s (default)
    Metadata:
      creation_time   : 2020-08-02T12:45:54.000000Z
      handler_name    : GoPro MET
Unsupported codec with id 98314 for input stream 2
```

There are 3 streams in each of the 3 chaptered `.mp4` videos containing:

* `0:0` = video
* `0:1` = audio
* `0:2` = gpmf telemetry

This information makes is easy to join the video streams with ffmpeg.

First create a file (e.g. `GS0141.txt`) with all the files you want to have concatenated, e.g.

```
file 'GS010141.mp4'
file 'GS020141.mp4'
file 'GS030141.mp4'
```

Now use the following ffmpeg command to concatenate the videos;

```shell
ffmpeg -f concat -safe 0 -i GS0141.txt -c copy -map 0:0 -map 0:1 -map 0:2 -c:v libx264 -pix_fmt yuv420p GS0141-mp4.mp4
```

Breaking this down;


* `-f concat -safe 0 -i GS0141.txt`: If you have media files with exactly the same codec and codec parameters you can concatenate them. [This is described in detail here](https://trac.ffmpeg.org/wiki/Concatenate). The `-safe 0` above is not required if the paths to video files in GS0141.txt are relative.
* `-c copy`: which means set all codec operations to copy i.e. video, audio, subtitles, data and attachments, if any. `-c` is short for `-codec`.
* `-map 0:0 -map 0:1 -map 0:2`: map the streams defined to the output video
* `-c:v libx264 -pix_fmt yuv420p GS0141.mp4`: sets the output file codecs, etc, and the output file itself.

Let us probe the output `GS0141-mp4.mp4` using ffprobe to ensure everything looks OK in the final video:

```shell
ffprobe -show_format GS0141-mp4.mp4
```

Which prints;

```
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from 'GS0141-mp4.mp4':
  Metadata:
    major_brand     : isom
    minor_version   : 512
    compatible_brands: isomiso2avc1mp41
    encoder         : Lavf59.16.100
  Duration: 00:18:29.24, start: 0.000000, bitrate: 29267 kb/s
  Stream #0:0[0x1](eng): Video: h264 (High) (avc1 / 0x31637661), yuv420p(tv, bt709, progressive), 4096x2048 [SAR 1:1 DAR 2:1], 28981 kb/s, 29.97 fps, 29.97 tbr, 30k tbn (default)
    Metadata:
      handler_name    : Core Media Video
      vendor_id       : [0][0][0][0]
  Stream #0:1[0x2](eng): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 189 kb/s (default)
    Metadata:
      handler_name    : SoundHandler
      vendor_id       : [0][0][0][0]
  Stream #0:2[0x3](eng): Data: bin_data (gpmd / 0x646D7067), 90 kb/s
    Metadata:
      handler_name    : GoPro MET
Unsupported codec with id 98314 for input stream 2
[FORMAT]
filename=GS0141-mp4.mp4
nb_streams=3
nb_programs=0
format_name=mov,mp4,m4a,3gp,3g2,mj2
format_long_name=QuickTime / MOV
start_time=0.000000
duration=1109.240000
size=4058022237
bit_rate=29267045
probe_score=100
TAG:major_brand=isom
TAG:minor_version=512
TAG:compatible_brands=isomiso2avc1mp41
TAG:encoder=Lavf59.16.100
[/FORMAT]
```

You can see the output video contains the same 3 streams as the inputs, and the length is 1109.240000 seconds (or just over 18 minutes and 29 seconds, matching the sum of the 3 inputs).

Playing the video, you can do one final check to ensure video 

Now let us double check the telemetry looks good using exiftool ([you could also use gopro-telemetry](/blog/2022/gopro-telemetry-exporter-getting-started));

```shell
exiftool exiftool -ee -X GS0141-mp4.mp4 > GS0141-mp4.xml
```

In this file the first GPS DateTime is:

```xml
<Track3:GPSDateTime>2020:08:02 11:43:00.160</Track3:GPSDateTime>
```

And the last GPS DateTime:

```xml
<Track3:GPSDateTime>2020:08:02 12:01:30.060</Track3:GPSDateTime>
```

Which gives GPS time range of 00:18:29.900 (`12:01:30.060`-`11:43:00.160`), which correctly matches the length of the video.

#### A note on global metadata

In the ffmpeg command I don't use `-map_metadata 0` (which maps all me)

And that is it.

### Unstitched `.360` files (GoPro MAX only)

As I started by talking about `.360`'s from the GoPro MAX, I also wanted to show how these chaptered files from raw videos can also be concatenated in the same way.

As before, let us examine the first video (`GS010141.360`) using ffprobe;

```
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from 'GS010141.360':
  Metadata:
    major_brand     : mp41
    minor_version   : 538120216
    compatible_brands: mp41
    creation_time   : 2020-08-02T12:45:54.000000Z
    location        : +28.7013-013.9193/
    location-eng    : +28.7013-013.9193/
    firmware        : H19.03.01.50.00
  Duration: 00:08:02.50, start: 0.000000, bitrate: 66400 kb/s
  Stream #0:0[0x1](eng): Video: hevc (Main) (hvc1 / 0x31637668), yuvj420p(pc, bt709), 4096x1344 [SAR 1:1 DAR 64:21], 29968 kb/s, 29.97 fps, 29.97 tbr, 90k tbn (default)
    Metadata:
      creation_time   : 2020-08-02T12:45:54.000000Z
      handler_name    : GoPro H.265
      vendor_id       : [0][0][0][0]
      encoder         : GoPro H.265 encoder
      timecode        : 12:45:09:01
  Stream #0:1[0x2](eng): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 189 kb/s (default)
    Metadata:
      creation_time   : 2020-08-02T12:45:54.000000Z
      handler_name    : GoPro AAC  
      vendor_id       : [0][0][0][0]
      timecode        : 12:45:09:01
  Stream #0:2[0x3](eng): Data: none (tmcd / 0x64636D74) (default)
    Metadata:
      creation_time   : 2020-08-02T12:45:54.000000Z
      handler_name    : GoPro TCD  
      timecode        : 12:45:09:01
  Stream #0:3[0x4](eng): Data: bin_data (gpmd / 0x646D7067), 90 kb/s (default)
    Metadata:
      creation_time   : 2020-08-02T12:45:54.000000Z
      handler_name    : GoPro MET  
  Stream #0:4[0x5](eng): Data: none (fdsc / 0x63736466), 19 kb/s (default)
    Metadata:
      creation_time   : 2020-08-02T12:45:54.000000Z
      handler_name    : GoPro SOS  
  Stream #0:5[0x6](eng): Video: hevc (Main) (hvc1 / 0x31637668), yuvj420p(pc, bt709), 4096x1344 [SAR 1:1 DAR 64:21], 29971 kb/s, 29.97 fps, 29.97 tbr, 90k tbn (default)
    Metadata:
      creation_time   : 2020-08-02T12:45:54.000000Z
      handler_name    : GoPro H.265
      vendor_id       : [0][0][0][0]
      encoder         : GoPro H.265 encoder
      timecode        : 12:45:09:01
    Side data:
      displaymatrix: rotation of nan degrees
  Stream #0:6[0x7](eng): Audio: pcm_s32le (in32 / 0x32336E69), 48000 Hz, 4 channels, s32, 6144 kb/s (default)
    Metadata:
      creation_time   : 2020-08-02T12:45:54.000000Z
      handler_name    : GoPro AMB  
      vendor_id       : [0][0][0][0]
Unsupported codec with id 0 for input stream 2
Unsupported codec with id 98314 for input stream 3
Unsupported codec with id 0 for input stream 4
```

Here there are 6 streams in each of the 3 chaptered `.360` videos as follows:

* `0:0` = video track 1
* `0:1` = audio
* `0:2` = starting timecode
* `0:3` = gpmf telemetry
* `0:4` SOS (used in file recovery)
* `0:5` = video track 1

Streams 0:2 and 0:4 are not really useful for anything at this point (they are used in GoPro's own software), so these will be ignored.

As before, create a file (e.g. `GS0141-360.txt`) with all the files you want to have concatenated, e.g.

```
file 'GS010141.360'
file 'GS020141.360'
file 'GS030141.360'
```

Now use the following ffmpeg command to concatenate the videos, the only difference between the .mp4 example and this one being the change in mappings as per the ffprobe output;

```
ffmpeg -f concat -safe 0 -i GS0141-360.txt -c copy -map 0:0 -map 0:1 -map 0:3 -map 0:5 -c:v libx264 -pix_fmt yuv420p GS0141-360.mp4
```

Note, this time we are outputting the video as an .mp4 again. This is because ffmpeg cannot natively write into the `.360` file format (which is really just an psuedo mp4, but with two video tracks).

Once processing is finished, you can copy it to have a .360 file extension like so;

```shell
cp GS0141-360.mp4 GS0141-360.360
```

This will ensure your newly concatenated .360 can be read properly by GoPro software if needed. 