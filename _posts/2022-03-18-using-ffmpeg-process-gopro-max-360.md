---
date: 2022-03-18
title: "Using ffmpeg to Process Raw GoPro MAX .360's into Equirectangular Projections"
description: "In our continued effort to avoid reliance on GoPro software, I look at how ffmpeg can be used to process GoPro EAC projected videos (.360's) to equirectangular projections."
categories: developers
tags: [ffmpeg, MAX, GoPro, Player, Fusion Studio]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-03-18/ffmpeg-eac-360-console-meta.jpg
featured_image: /assets/images/blog/2022-03-18/ffmpeg-eac-360-console-sm.jpg
layout: post
published: true
redirect_from:
  - /blog/2022/using-ffmpeg-process-gopro-max-360
---

**In our continued effort to avoid reliance on GoPro software, I look at how ffmpeg can be used to process GoPro EAC projected videos (.360's) to equirectangular projections.**

You might have seen my previous series of posts; [Reversing engineering GoPro MAX .360 videos (convert to equirectangular projection)](/blog/reverse-engineering-gopro-360-file-format-part-1).

The outcome of this post was a proof-of-concept called [MAX2Sphere](https://github.com/trek-view/MAX2sphere).

Recently, I've seen a few ffmpeg builds for GoPro .360 conversions that do a similar thing.

Of course this meant I had to play with them... and here is what I found.

## 1. GoPro MAX `.360` input

The GoPro MAX produces a single `.360` file (GoPro's EAC projection type) for 360 videos. [I've talked about these in detail previously](/blog/everse-engineering-gopro-360-file-format-part-1).

In short GoPro's `.360`'s contain two video tracks which form a EAC custom cubemap projection. You can see the structure of `.360`'s using ffprobe:

```
  Duration: 00:00:20.22, start: 0.000000, bitrate: 66599 kb/s
  Stream #0:0[0x1](eng): Video: hevc (Main) (hvc1 / 0x31637668), yuvj420p(pc, bt709), 4096x1344 [SAR 1:1 DAR 64:21], 29985 kb/s, 29.97 fps, 29.97 tbr, 90k tbn (default)
    Metadata:
      creation_time   : 2021-09-04T08:23:32.000000Z
      handler_name    : GoPro H.265
      vendor_id       : [0][0][0][0]
      encoder         : GoPro H.265 encoder
      timecode        : 08:23:02:08
  Stream #0:1[0x2](eng): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 188 kb/s (default)
    Metadata:
      creation_time   : 2021-09-04T08:23:32.000000Z
      handler_name    : GoPro AAC  
      vendor_id       : [0][0][0][0]
      timecode        : 08:23:02:08
  Stream #0:2[0x3](eng): Data: none (tmcd / 0x64636D74), 0 kb/s (default)
    Metadata:
      creation_time   : 2021-09-04T08:23:32.000000Z
      handler_name    : GoPro TCD  
      timecode        : 08:23:02:08
  Stream #0:3[0x4](eng): Data: bin_data (gpmd / 0x646D7067), 91 kb/s (default)
    Metadata:
      creation_time   : 2021-09-04T08:23:32.000000Z
      handler_name    : GoPro MET  
  Stream #0:4[0x5](eng): Data: none (fdsc / 0x63736466), 20 kb/s (default)
    Metadata:
      creation_time   : 2021-09-04T08:23:32.000000Z
      handler_name    : GoPro SOS  
  Stream #0:5[0x6](eng): Video: hevc (Main) (hvc1 / 0x31637668), yuvj420p(pc, bt709), 4096x1344 [SAR 1:1 DAR 64:21], 30109 kb/s, 29.97 fps, 29.97 tbr, 90k tbn (default)
    Metadata:
      creation_time   : 2021-09-04T08:23:32.000000Z
      handler_name    : GoPro H.265
      vendor_id       : [0][0][0][0]
      encoder         : GoPro H.265 encoder
      timecode        : 08:23:02:08
    Side data:
      displaymatrix: rotation of nan degrees
  Stream #0:6[0x7](eng): Audio: pcm_s32le (in32 / 0x32336E69), 48000 Hz, 4 channels, s32, 6144 kb/s (default)
    Metadata:
      creation_time   : 2021-09-04T08:23:32.000000Z
      handler_name    : GoPro AMB  
      vendor_id       : [0][0][0][0]
Unsupported codec with id 0 for input stream 2
Unsupported codec with id 98314 for input stream
```

## 2. Build and install ffmpeg

As hinted at the top of this post, the master ffmpeg software build does not contain the right filters to convert GoPro's EAC format out of the box (at the time of writing). Therefore you first need to build a custom fork of ffmpeg which contains these filter.

[First grab this custom fork of ffmpeg](https://github.com/gmat/goproMax-ffmpeg-v5).

_You should run this install in a virtual/separate environment, so as not to cause conflicts with your stable ffmpeg install._

```shell
git clone https://github.com/gmat/goproMax-ffmpeg-v5
cd goproMax-ffmpeg-v5
```

Now you need to install the ffmpeg dependencies, [as detailed here (for Ubuntu)](https://trac.ffmpeg.org/wiki/CompilationGuide/Ubuntu).

Build ffmpeg using the makefile (this will take a long time);

```shell
$ sudo apt-get install -y ocl-icd-opencl-dev
$ ./configure --enable-opencl --enable-opengl --enable-sdl2 --enable-libx264 --enable-gpl --disable-x86asm
$ make
$ sudo make install
# test ffmpeg works
$ ffmpeg
```

## 3. Convert .360 to equirectangular mp4

I'll use the following `.360` file as an example:

* [GS018421.360](https://drive.google.com/file/d/1FT1oth6HHMFnzP_2jk8JpGPmlzjeBhIb/view?usp=sharing)

Quickly grab it using `gdown` like so:

```shell
$ pip install gdown
# Use test 360 GS018421.360
$ gdown --id 1FT1oth6HHMFnzP_2jk8JpGPmlzjeBhIb
```

Now we can run the ffmpeg conversion on `GS018421.360`:

```shell
ffmpeg -hwaccel opencl -v verbose -filter_complex '[0:0]format=yuv420p,hwupload[a] , [0:5]format=yuv420p,hwupload[b], [a][b]gopromax_opencl, hwdownload,format=yuv420p' -i GS018421.360 -c:v libx264 -pix_fmt yuv420p -map_metadata 0 -map 0:a -map 0:3 GS018421-stitched.mp4
```

Let me break this down;

```shell
-hwaccel opencl
```

Many platforms offer access to dedicated hardware to perform a range of video-related tasks. In this case I am using OpenCL. OpenCL (Open Computing Language) is a low-level API for heterogeneous computing that runs on CUDA-powered GPUs.

**A note on hardware acceleration**

This command requires the use of hardware acceleration in ffmpeg, [which you can read more about here](https://trac.ffmpeg.org/wiki/HWAccelIntro).

If you are using a general purpose laptop you might run into issues, like the one shown below;

```
[AVHWDeviceContext @ 0x55714eaff000] No matching devices found.
Device creation failed: -19.
Failed to set value 'opencl:0.1' for option 'init_hw_device': No such device
Error parsing global options: No such device
```

This is due to hardware issues, specifically the lack or mis-configuration of a GPU or vGPU (and usually occurs on laptops, which have no GPU). Due to the variety of hardware available, I can only point you to Google to debug (or to use a cloud server with a CPU like [AWS's NVIDIA GPU backed EC2 machines](https://aws.amazon.com/nvidia/)).

**End note**

```shell
-v verbose
```

Sets the logging level to verbose ([as detailed as possible](https://ffmpeg.org/ffmpeg-filters.html#toc-deshake_005fopencl)). This is useful because we are using a non-supported fork of ffmpeg and thus can help debug any issues that occur.

```shell
-filter_complex '[0:0]format=yuv420p,hwupload[a] , [0:5]format=yuv420p,hwupload[b], [a][b]gopromax_opencl, hwdownload,format=yuv420p'
```

Here the command calls the filter to convert the input to equirectangular.

Essentially it takes the two video tracks `0:0` and `0:5` as `[a]` and `[b]` respectively from the `.360` file, and passes them to the `gopromax_opencl` filter, [the logic (code) of which can be viewed here](https://github.com/gmat/goproMax-ffmpeg-v5/blob/main/libavfilter/vf_gopromax_opencl.c).

We know the video streams in this video are `0:0` and `0:5` for this video using ffprobe, but beware, if the video was shot in Time Warp mode the video streams are in `0:0` and `0:4` -- be sure to check with your video. This is because Time Warp videos do not contain an audio track (hence one less track).

```shell
-i GS018421.360 
```

Where `GS018421.360` is the `.360` input video (EAC projection) you want to convert to an `.mp4` as an equirectangular projection.

```shell
-c:v libx264 -pix_fmt yuv420p -map_metadata 0 -map 0:a -map 0:3 GS018421-stitched.mp4
```

And finally, we define the output settings, including encoding, mapping metadata and telemetry streams to create a final file, `GS018421-stitched.mp4`. 

We know the telemetry stream is `0:3` for this video using ffprobe, but beware, if the video was shot in Time Warp mode the telemetry stream is `0:2` -- be sure to check with your video. Again, this is because Time Warp videos do not contain an audio track.

## 5. The mp4 output

This command gives a final output that looks like this:

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/lLSQF6HEg9k" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

_Note: no equirectangular metadata has been added to the video (hence no 360 controls). [See how to do this here](/blog/turn-360-photos-into-360-video)._

Both video and audio look and sound good, it is equirectangular, but what about the streams?

```
  Duration: 00:00:20.48, start: 0.000000, bitrate: 89967 kb/s
  Stream #0:0[0x1](und): Video: h264 (High) (avc1 / 0x31637661), yuv420p(tv, bt709, progressive), 5376x2688 [SAR 1:1 DAR 2:1], 90627 kb/s, 29.97 fps, 29.97 tbr, 30k tbn (default)
    Metadata:
      creation_time   : 2021-09-04T08:23:32.000000Z
      handler_name    : VideoHandler
      vendor_id       : [0][0][0][0]
  Stream #0:1[0x2](eng): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 125 kb/s (default)
    Metadata:
      creation_time   : 2021-09-04T08:23:32.000000Z
      handler_name    : GoPro AAC  
      vendor_id       : [0][0][0][0]
  Stream #0:2[0x3](eng): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, 4.0, fltp, 263 kb/s (default)
    Metadata:
      creation_time   : 2021-09-04T08:23:32.000000Z
      handler_name    : GoPro AMB  
      vendor_id       : [0][0][0][0]
  Stream #0:3[0x4](eng): Data: bin_data (gpmd / 0x646D7067), 91 kb/s (default)
    Metadata:
      creation_time   : 2021-09-04T08:23:32.000000Z
      handler_name    : GoPro MET  
Unsupported codec with id 98314 for input stream 3
```

Here we can see the telemetry has also copied successfully into stream `0:3`. 

You will also see that a second audio track (GoPro specific -- `GoPro AMB` track in stream `0:3`) has also copied successfully.

The one thing I don't quite understand is why the output `.mp4` has a duration of `00:00:20.48`, yet the input `.360` has a duration of `00:00:20.22` -- a 0.26 second difference. If anyone reading this has any ideas as to why this occurs, please do drop me an email.

## 6. Pros and cons of MAX2Sphere vs ffmpeg

If you have tried using the above instructions on a longer video (more than 2 minutes), it is very likely it took a long time to process.

If you need to process an entire video, ffmpeg is the fastest and easiest approach (because it does not require separate frame extraction and stitching). You will just have to deal with the processing time (or buy bigger hardware).

However, if you only need a limited number of frames, for example 1 or 2 frames per second to create a virtual tour, then [MAX2Sphere](https://github.com/trek-view/MAX2sphere) is the way to go -- it will be much faster.