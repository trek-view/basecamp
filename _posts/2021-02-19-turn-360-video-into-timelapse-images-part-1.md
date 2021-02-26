---
date: 2021-02-19
title: "Turning a 360 Video into Timelapse Images (Part 1/2)"
description: "In the first part of this post I will show you how to turn a video into a series of images for more flexible editing options."
categories: 
tags: [FFMpeg]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-02-19/360-video-to-image-meta.jpg
featured_image: /assets/images/blog/2021-02-19/360-video-to-image-sm.jpg
layout: post
published: true
---

**Grab the perfect frame**

In the last year I've covered topics [about the metadata found in a 360 video](/blog/2020/metadata-exif-xmp-360-video-files), [how to extract a GPS track from them](/blog/2020/extracting-gps-track-from-360-timelapse-video), and [video compression](/blog/2020/fps-bitrate-compression-360-virtual-tours).

The problem with video files is they're often difficult to work with as a beginner.

Let's say you wanted to cut the first 20 seconds of video from your capture whilst standing still. Removing the first 20 seconds is trivial in many programs.

The problem; many software programs will completely strip the GPS telemetry from the video if you do this, others will remove other important metadata from the video, [such as [XMP] ProjectionType](/blog/2020/metadata-exif-xmp-360-video-files) (used by software to recognise the video as either 360 or 2D).

I'm yet to find the perfect 360 video editing tool for mapping. [This is one of the reasons we don't recommend capturing virtual tours in video mode using the Trek Pack](https://guides.trekview.org/mtp-web/user-guide/sequences/capture#camera-capture-mode-settings).

That said, sometimes you might have captured a brilliant video of a trail -- perhaps skiing a piste or a downhill MTB trail -- where your intention was not to use the images for mapping, but to share with friends on YouTube, however, now realise that video would be great to use on Mapillary or Google Street View.

In such cases it's possible to convert the video to images (with the help of [ffmpeg](https://ffmpeg.org/)).

## 1. Preparation

For this guide I'll be using [ffmpeg](https://ffmpeg.org/), a free and open-source project consisting of a vast software suite of libraries and programs for handling video, audio, and other multimedia files and streams.

The demo video will be an `.mp4` video filmed using a GoPro Fusion with GPS enabled shot at 5.2K and the final file encoded using H.264 at 4K at 30 FPS using GoPro Fusion Studio (no Protune). The file size is 86.2MB and runs for 16 seconds.

<iframe width="560" height="315" src="https://www.youtube.com/embed/iyIkDRERzz8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 2. Split video into frames (individual photo files)

Taking the `.mp4` file, I can break it down into 1 second frames at desired intervals using ffmpeg.

I'm going to use `.jpg` for the output into a directory called `FRAMES` (note for filename, ‘%d’ is replaced by the image number).

CLI input:

```
$ ffmpeg -i VIDEO_7152.mp4 -r 1 FRAMES/img%d.jpg
```

This command includes the following arguments:

* -r: Set frame rate (Hz value, fraction or abbreviation).

[Full reference here](https://www.ffmpeg.org/ffmpeg.html).

<img class="img-fluid" src="/assets/images/blog/2021-02-19/img0001-sm.jpg" alt="ffmpeg extracted frame example" title="ffmpeg extracted frame exampler" />

[In total this gives me 18 `.jpg` files (img0001.jpg..., img0018.jpg)](https://drive.google.com/drive/u/1/folders/1hPCYAluasG58moLQsFPo-On5IA6guRS9).

If you want a higher (or lower) sampling rate, just change the `-r` value (e.g. `-r 0.5` = 2 frames per second). Don't forget to check the sampling rate is not greater than the framerate of the video.

**A note on video capture and quality**

I mentioned at the start this video was show in 4K.

> 4K (3840 x 2160 or 4096 x 2160) is about 8.5 megapixels.

[Source](https://www.lifewire.com/4k-resolution-overview-and-perspective-1846842)

Looking at the metadata of the video, the reported image size is 3840x1920 or 7.4MP.

```
[Main]          ImageSize                       : 3840x1920
[Main]          Megapixels                      : 7.4
[Main]          AvgBitrate                      : 45.2 Mbps
```

[The reason why this happens is described in this post](/blog/2020/fps-bitrate-compression-360-virtual-tours).

## 3. Re-embed metadata

ffmpeg strips frames of metadata when converting from a video file. The metadata includes things like timestamps and GPS, both are crucial pieces of information when mapping.

I'll show how to re-embed metadata next week...

## Map the Paths Uploader

<img class="img-fluid" src="/assets/images/blog/2021-02-19/mtpu-screenshot.jpg" alt="Map the Paths Uploader" title="Map the Paths Uploader" />

You can use the Map the Paths Uploader to easily split videos into meta/geotagged images (without having to upload them).

[Download the Map the Paths Uploader for free here](https://www.mapthepaths.com/uploader).

## Update 2021-02-26

[Turning a 360 Video into Timelapse Images (Part 2/2)](/blog/2021/turn-360-video-into-timelapse-images-part-2)