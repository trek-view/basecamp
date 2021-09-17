---
date: 2021-09-10
title: "Reverse Engineering GoPro's 360 Video File Format (Part 1)"
description: "A deeper look into GoPro's proprietary .360 video format (with the aim of reducing our reliance on GoPro's software)."
categories: guides
tags: [GoPro]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-09-10/youtube-eac-meta.jpeg
featured_image: /assets/images/blog/2021-09-10/youtube-eac-sm.jpeg
layout: post
published: true
---

**A deeper look into GoPro's proprietary .360 video format (with the aim of reducing our reliance on GoPro's software).**

[As I described in last weeks post](/blog/2021/projection-type-360-photography), I've recently been trying to better understand the world of 360 videos.

One that we've been aware of for a long time is GoPro's proprietary `.360` video format.

All video files captured on the GoPro MAX are outputted as `.360` files.

There are a number of issues I've had with `.360's`:

* As it's a proprietary codec, only GoPro software can natively understand it
* To convert to a more widely understood codec you need to use GoPro Player
	* Is an added step requiring mode time
	* Can be very CPU intensive (requiring a well powered machine)
	* Relies solely on GoPro software (which can be buggy)
	* Limited functionality based on GoPro's feature choices

My suspicion is the `.360` format is used as a more efficient codec to capture high-quality / high-frame-rate videos than would otherwise be possible (see my post on [FPS, Bit rate, Compression and 360 Video Quality](/blog/2020/fps-bitrate-compression-360-virtual-tours)).

I decided to take a deeper look and see if it was possible to remove the GoPro middleman and improve the user experience in converting them into mp4's.

## Analysing the GoPro MAX and `.360 ` tech specs

The `.360` format was released with the launch of the GoPro MAX camera. The MAX is the only camera that currently uses it as an output format.

[GoPro posted a nice summary of the goals they set out for the MAX camera, and how they achieved them, here](https://gopro.com/en/au/news/max-tech-specs-stitching-resolution).

Some of the key points from that 

> For example, once you have a 5.6K stitched equirectangular video, that is equivalent to a resolution of 5376x2688, which is near impossible to encode with a modern encoder and, to make things more challenging, most high-end devices (PCs and smartphones alike) struggle to decode such a large file.

As suspected, encoding and decoding such large equirectangular images was the key driving force behind the creation of the .360 format.

> The best projection for this is Google’s Equal Area Cubemap, or EAC. EAC has a 25 percent drop in pixels for the same resolution as equirectangular. 

[I wrote a post last week providing an explanation of various projection types, EAC being one](/blog/2021/projection-type-360-photography).

But GoPro then went one step further to account for issues a decoder would face when playing the video...

> By breaking the top and bottom faces of the cube map into two separate video tracks, this creates two videos at the resolution of 4032x1344. 4032x1344 is very easy for all UHD decoders play back.

As noted before, the MAX shoots at 6K but the stitched resolution of the EAC image is smaller at 5.6K (the MAX does this on camera). Even then, this is too large as one file for decoders (according to GoPro), hence the .360 format consists of two video tracks (the top and bottom of the EAC projection).

> we built a special player that can decode both streams in real time and re-project them into a sphere.

The reality is, although it might be easy to playback (from a computational point of view), no other players as far as I am aware (except GoPro's own software) understands this codec correctly to play it back.

> With MAX, we are proud to say we are again setting the bar by retaining the small overlapped areas inside the EAC projection. While the stitching is completed in MAX, the blending is enhanced by retaining a small overlap in post

The images below shows overlap areas outlined in red.

_First video track frame_

<img class="img-fluid" src="/assets/images/blog/2021-09-10/GoPro-MAX-EAC-overlap-top.jpeg" alt="GoPro MAX EAC Overlap top" title="GoPro MAX EAC Overlap top" />

_Second video track frame_

<img class="img-fluid" src="/assets/images/blog/2021-09-10/GoPro-MAX-EAC-overlap-bottom.jpeg" alt="GoPro MAX EAC Overlap bottom" title="GoPro MAX EAC Overlap bottom" />

The GoPro stitches these 2 EAC tracks (example frames above) on the camera.

However, the blending (removal of the stitch lines) using this overlap is done in post processing when you convert the `.360` to `.mp4` in GoPro's software.

And finally, the blended equirectangular mp4 frame looks like this:

<img class="img-fluid" src="/assets/images/blog/2021-09-10/GoPro-MAX-equirectangular.jpeg" alt="GoPro MAX equirectangular smoothing" title="GoPro MAX equirectangular smoothing" />

Interestingly they also note...

> Once more tools start to support EAC, we will be able to skip this conversion step altogether and save even more time since no reprojection is needed.

Since the MAX launched 2 years ago, adoption of EAC in the world of video has been slow.

[YouTube pioneered the standard in production around 2017/18 to improve quality and save bandwidth](https://youtube-eng.googleblog.com/2017/03/improving-vr-videos.html).

EAC became the default streaming format for 360 videos on YouTube ([causing a few annoyances at the time for YouTube-dl users](https://github.com/ytdl-org/youtube-dl/issues/15267)). 

Here's an example of YouTube serving EAC (I don't own this video and not sure what camera was used / how it was shot):

```
$ youtube-dl -k https://www.youtube.com/watch?v=xBGBBRtcVJU

```

Though it's not always the case. The following video has no EAC copy at the time of test. It returns an equirectangular projection (it is my video shot on a GoPro MAX and was uploaded as equirectangular mp4):

```
$ youtube-dl -k https://www.youtube.com/watch?v=dUxe_tYCTL0

```

It seems that other older MAX videos on YouTube (uploaded over 6 months ago) still return equirectangular projections too, so it doesn't seem to be a processing issue. I am still trying to figure out what type of 360 files YouTube converts to EAC and what files it does not convert to EAC.

## A note on Google Street View and Mapillary

In the world of street-level mapping, EAC has seen no adoption. Google Street View and Mapillary still only support equirectangular projections for upload and displaying imagery.

## Update 2021-09-17 -- Examining a real .360 file

[Reverse Engineering GoPro's 360 Video File Format (Part 2)](/blog/2021/reverse-engineering-gopro-360-file-format-part-2)