---
date: 2022-04-29
title: "Merging Chaptered GoPro Videos Whilst Preserving Telemetry"
description: "Use ffmpeg to create full length GoPro footage which retains full GPS information."
categories: developers
tags: [exiftool, ffmpeg, gmpd, telemetry, metadata, gpmf]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-04-29/merge-gopro-chaptered-videos-meta.jpg
featured_image: /assets/images/blog/2022-04-29/merge-gopro-chaptered-videos-sm.jpg
layout: post
published: true
---

**Use ffmpeg to create full length GoPro footage which retains full GPS information.**

If you have ever recorded longer sections of video on your GoPro camera, you will have found that the video gets split up into smaller segments. Precisely how long the chunks are depends on the video mode and camera you are using.

[This is because of chaptering employed by GoPro cameras](https://community.gopro.com/s/article/GoPro-Camera-File-Chaptering-Information?language=en_US).

## GoPro Chaptering 101

Newer GoPro cameras use chapters with a maximum size of 4GB. Earlier models use smaller chapter sizes.

Chaptering serves an important purpose to ensure compatibility with the filesystem used on your memory card. 

By far the most widely compatible filesystem these days is known as FAT32 (for 32-bit File Allocation Table).

FAT32 is quite old. Microsoft first rolled it out with Windows 95 and therefore it lacks some of the sophistication and features of newer file systems such as exFAT. Nevertheless, it has things going for it: it is reliable, it offers solid performance, and, most importantly, it is very widely compatible.

That last point is crucial, because it means that you can put your memory card in pretty much any computer and be able to read it without having to install extra software. Whether you are using Windows, Mac, or Linux, a FAT32 external hard drive or thumb drive or memory card should work. So nearly all consumer devices aim to be compatible with FAT32.

But FAT32 has a limitation hardcoded into it: the maximum file size that it can handle is 4GB. Back in Windows 95 days, that seemed pretty huge. These days, not so much.

If you are recording a 5.6k 360 video on a GoPro MAX you are going to fill up 4GB pretty quickly (in about 8 minutes). If you are using smaller or lower quality settings, you will get more footage before you hit that 4GB threshold, but not by much.

Once you get to 4GB, it will tie off that segment and start a new video. Once that new one gets to 4GB, it will start another. And so on, until you stop the recording, the card fills up, or your battery runs out.

As a concrete example, here is a list of the output files filmed in a single 18 minute and 28 second video on the GoPro MAX (30FPS / 5.6k).

* [GS010141.360](https://drive.google.com/file/d/1-Ikg4TOwYOb8g5sAwWThxvLJKuJPA6eH/view?usp=sharing) - 3.73GB - 08min:02sec
* [GS020141.360](https://drive.google.com/file/d/1-NgfbU5juFUtLxkD6eQG2_K82zMJl_VQ/view?usp=sharing) - 3.73GB - 08min:02sec
* [GS030141.360](https://drive.google.com/file/d/1-SV4tKwTh7MiX48wkmXP7ctJKP3_XN9V/view?usp=sharing) - 1.12GB - 02min:24sec

_Note how the first two digits determine the chapter number (`GS01`, `GS02`. `GS03`)._

## Joining chaptered GoPro videos

Whilst chaptering serves a technical purpose, it is annoying when you want to show a single video. 

None of the currently available GoPro software offers the functionality to merge chapters, so here is how to do it yourself.

### Merging GoPro mp4 videos (all GoPro cameras)

For this demo I will use examples of stitched `.mp4`'s shot on a GoPro MAX ([stitched with our recommended settings to retain gpmf telemetry in GoPro Studio, as outlined here](/blog/using-gopro-studio-process-360-files)).

These instructions will work for most HERO cameras (version 5 and newer) and stitched 360 videos from the Fusion and MAX cameras. This method could also be employed for dual GoPro Fusion fisheye `.mp4` videos.

Here are the demo files I'll use:

* [GS010141.mp4](https://drive.google.com/file/d/191priNLqmOTLWKlsVkjq1FTbkgC5gs3P/view?usp=sharing) - 4.11GB - 08min:02sec
* [GS020141.mp4](https://drive.google.com/file/d/19MPh4fR1P2GiyUDH-KtVONJXcu-WP7jc/view?usp=sharing) - 4.09GB - 08min:02sec
* [GS030141.mp4](https://drive.google.com/file/d/19jcPzpa4I1vEIwhqPdVsJCJ6gVcFu5cf/view?usp=sharing) - 1.22GB - 02min:24sec

These videos are all in the same format, and with the same structure (the output of ffprobe for GS030141.mp4 is shown below):

```
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from 'GS010141.mp4':
  Metadata:
    major_brand     : qt  
    minor_version   : 0
    compatible_brands: qt  
    creation_time   : 2020-08-02T12:45:54.000000Z
  Duration: 00:08:02.48, start: 0.000000, bitrate: 67904 kb/s
  Stream #0:0[0x1](eng): Video: hevc (Main) (hvc1 / 0x31637668), yuv420p(tv, bt709, progressive), 4096x2048 [SAR 1:1 DAR 2:1], 67678 kb/s, 29.97 fps, 29.97 tbr, 600 tbn (default)
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

* `0:0` = video (Core Media Video)
* `0:1` = audio (Audio: aac)
* `0:2` = gpmf telemetry (GoPro MET)

This information makes is easy to join the video streams with ffmpeg.

First create a text file (e.g. `GS0141-merged.txt`) with all the chaptered video files that you want to merge into a single video e.g.

```
file 'GS010141.mp4'
file 'GS020141.mp4'
file 'GS030141.mp4'
```

Now use the following ffmpeg command to concatenate the videos;

```shell
ffmpeg -f concat -safe 0 -i GS0141-mp4.txt -c copy -map 0:0 -map 0:1 -map 0:2 -c:v libx264 -pix_fmt yuv420p GS0141-merged.mp4
```

Breaking this down;


* `-f concat -safe 0 -i GS0141-mp4.txt`: If you have media files with exactly the same codec and codec parameters you can concatenate them. [This is described in detail here](https://trac.ffmpeg.org/wiki/Concatenate). The `-safe 0` above is not really required if the paths to video files in GS0141.txt are relative.
* `-c copy`: which means set all codec operations to copy i.e. video, audio, subtitles, data and attachments, if any. `-c` is short for `-codec`.
* `-map 0:0 -map 0:1 -map 0:2`: map the streams 0, 1, and 2 in the first input (which is the `.txt` file, thus takes these streams from all 3 videos)
* `-c:v libx264 -pix_fmt yuv420p GS0141.mp4`: sets the output file codecs, etc, and the output file itself.

Let us probe the output `GS0141-merged.mp4` using ffprobe to ensure everything looks OK in the final video:

```shell
ffprobe -show_format GS0141-merged.mp4
```

Which prints;

```
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from 'GS0141-merged.mp4':
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
filename=GS0141-merged.mp4
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

You can see it contains the same 3 streams as the inputs, and the length is 1109.240000 seconds (or just over 18 minutes and 29 seconds, matching the sum of the 3 inputs).

Playing the video, you can also check the video and sound track.

To double check the telemetry is concatenated correctly you can use exiftool ([or gopro-telemetry](/blog/gopro-telemetry-exporter-getting-started)).

Using exiftool;

```shell
exiftool -ee -X GS0141-merged.mp4 > GS0141-merged.xml
```

You can see in the output file (`GS0141-merged.xml`) the first `GPSDateTime` is:

```xml
<Track3:GPSDateTime>2020:08:02 11:43:00.160</Track3:GPSDateTime>
```

And the last `GPSDateTime` is:

```xml
<Track3:GPSDateTime>2020:08:02 12:01:30.060</Track3:GPSDateTime>
```

Which gives GPS time range of 00:18:29.900 (`12:01:30.060`-`11:43:00.160`), which correctly matches the length of the video.

Finally, all that's left to do is copy the global metadata. To do this I will only copy the metadata from the first video. This is because global metadata should be identical in each of the input videos (e.g. camera name, make).

Using exiftool for this job ([and not ffmpeg for the reasons described here](/blog/ffmpeg-video-to-frame-cheat-sheet)) I first make a copy of the newly merged video;

```shell
cp GS0141-merged.mp4 GS0141-merged-meta.mp4
````

Then copy the metadata from the first input (`GS010141.mp4`) video to the final merged video (`GS0141-merged-meta.mp4`);

```shell
exiftool -TagsFromFile GS010141.mp4 "-all:all>all:all" GS0141-merged-meta.mp4
```

And finally, I double check the global metadata;

```shell
exiftool -ee -X GS0141-merged-meta.mp4 > GS0141-merged-meta.xml
```

You'll see `XMP-GSpherical` tags have been written into the metadata now, ensuring this video will be rendered correctly by video players as a 360.

Hardcoded metadata like start time, video length, etc. have already been updated correctly by ffmpeg, and you can rest assured this command won't modify these values.