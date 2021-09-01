---
date: 2021-09-10
title: "Reverse Engineering GoPro's 360 Video File Format (Part 1)"
description: "A deeper look into GoPro's proprietary .360 video format (with the aim of reducing our reliance on GoPro's software)."
categories: guides
tags: [GoPro]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-09-10/
featured_image: /assets/images/blog/2021-09-10/
layout: post
published: false
---

**A deeper look into GoPro's proprietary .360 video format (with the aim of reducing our reliance on GoPro's software).**

As I described in last weeks post, I've been trying to better understand the world of 360 videos.

One that we've been aware of for a long time is GoPro's proprietary `.360` video format.

All video files captured on the GoPro MAX are outputted as `.360` files.

There are a number of issues I've seen voiced

* As it's a propreitary codec, only GoPro software can natively understand it
* To convert to a more widely understood codec you need to use GoPro Player
	* Is an added step requiring mode time
	* Can be very CPU intensive (requiring a well powered machine)
	* Relies solely on GoPro software ([which can be buggy](https://campfire.trekview.org/t/no-gps-data-on-gopro-max-360-mp4s-gopro-max-exporter-windows/247))
	* Limited functionlity based on GoPro's feature choices

My suspicion is the `.360` format is used as a more effecient codec to capture high-quality / frame-rate videos than would otherwise be possible (see my post on [FPS, Bit rate, Compression and 360 Video Quality](/blog/2020/fps-bitrate-compression-360-virtual-tours)).

I decided to take a deeper look and see if it was possible to remove the GoPro middleman.

## Analysing the GoPro MAX and `.360 ` tech specs

The .360 format was released with the launch of the GoPro MAX camera.

[GoPro posted a nice summary of the goals they set out for the MAX camera, and how they achieved them, here](https://gopro.com/en/au/news/max-tech-specs-stitching-resolution).

Some of the key points from that 

> For example, once you have a 5.6K stitched equirectangular video, that is equivalent to a resolution of 5376x2688, which is near impossible to encode with a modern encoder and, to make things more challenging, most high-end devices (PCs and smartphones alike) struggle to decode such a large file.

As suspected, encoding and decoding such large equirectangular images was the key driving force behind the .360 format.

> The best projection for this is Google’s Equal Area Cubemap, or EAC. EAC has a 25 percent drop in pixels for the same resolution as equirectangular. 

[I wrote a post last week providing an explanation of various projection types, EAC being one](/blog/2021/projection-type-360-photography).

But GoPro then went one step further to account for issues an decoder might face when playing the video...

> By breaking the top and bottom faces of the cube map into two separate video tracks, this creates two videos at the resolution of 4032x1344. 4032x1344 is very easy for all UHD decoders play back.

As noted before, the MAX shoots at 6K but the stitched resolution of the EAC image is smaller at 5.6K (the MAX does this on camera).

> we built a special player that can decode both streams in real time and re-project them into a sphere.

The realisty is, although it might be easy to playback (from a computational point of view), none currently, except GoPro's own software understands this codec correctly to play it back.

> With MAX, we are proud to say we are again setting the bar by retaining the small overlapped areas inside the EAC projection. While the stitching is completed in MAX, the blending is enhanced by retaining a small overlap in post

The images below shows overlap areas outlined in red.

_First video track frame_

<img class="img-fluid" src="/assets/images/blog/2021-09-10/GoPro-MAX-EAC-overlap-top.jpeg" alt="GoPro MAX EAC Overlap top" title="GoPro MAX EAC Overlap top" />

_Second video track frame_

<img class="img-fluid" src="/assets/images/blog/2021-09-10/GoPro-MAX-EAC-overlap-bottom.jpeg" alt="GoPro MAX EAC Overlap bottom" title="GoPro MAX EAC Overlap bottom" />

The GoPro stitches these 2 EAC tracks (example frames above) on the camera.

However, the blending, or removal of the stitch lines is blended in post processing when you convert the `.360` to `.mp4` by GoPro's software.

And finally, the blended equirectangular mp4 frame looks like this:

<img class="img-fluid" src="/assets/images/blog/2021-09-10/GoPro-MAX-equirectangular.jpeg" alt="GoPro MAX equirectangular smoothing" title="GoPro MAX equirectangular smoothing" />

Interestingly they also note...

> Once more tools start to support EAC, we will be able to skip this conversion step altogether and save even more time since no reprojection is needed.

Since the MAX launched 2 years ago (and the GoPro post these quotes are taken from was written), adoption of EAC in the world of video has been slow. 

[YouTube pioneered the standard in production around 2017/18 to improve quality and save bandwidth](https://youtube-eng.googleblog.com/2017/03/improving-vr-videos.html).

When using YouTube-dl to download videos, EAC was the format delivered in the download by default ([causing a few annoyances at the time](https://github.com/ytdl-org/youtube-dl/issues/15267)). 

Here's an example of YouTube serving EAC (I don't own this video):

```
https://www.youtube.com/watch?v=uHAysQ7nVok

```

However, the following video has no EAC copy at time of test, it returns an equirectangular projection (it is my video shot on a GoPro MAX and was uploaded as equirectangular mp4):

```
youtube-dl -k https://www.youtube.com/watch?v=dUxe_tYCTL0

```

It seems that other older MAX videos on YouTube (6 months old+) still return equirectangular projections too, so it doesn't seem to be a processing issue.

In the world of mapping, EAX is none-existent in mapping software. Google Street View and Mapillary still only support equirectangular projections for upload and displaying imagery.

## Examining a real .360 file

Stay tuned for next weeks post. Or subscribe to the newsletter below and we'll let you know when it's live.