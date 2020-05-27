---
date: 2020-06-12
title: "FPS, Bit rate, and 360 Video Quality"
description: "The image quality of video frames can vary significantly between two cameras offering the same resolution, but why?"
categories: guides
tags: [cameras]
author_staff_member: dgreenwood
image: /assets/images/blog/2020-06-12/
featured_image: /assets/images/blog/2020-06-12/
layout: post
published: false
---

**"It said 4K (8.5 megapixels) on the box."**

"But this video is only 7.4 megapixels."

[Said me when looking at the metadata of a video created using a GoPro Fusion](/blog/2020/metadata-exif-xmp-360-video-files).

So what is going on here?

A large part of the answer comes down to what happens to the image data after it hits [the sensor](/blog/2020/what-is-global-shutter-rolling-shutter-360-cameras). 

Bit rate being a critical factor.

## Bit rate 101

All technology is limited by the amount of data it can transfer.

You are probably familiar with paying for your internet connection in packages based on Mbps (Mega bits per second), Or Gbps (Gigabits per second) if you're really lucky!

Bit rate is the number of bits that are conveyed or processed per unit of time. Mbps = MegaBITs per second (not to be confused with megaBYTES) is one of those units.

1 megaBIT = 0.125 megaBYTES.

_Beware, manufacturers like to get very wordy when in comes to data transfer speeds. For example, 3,500MBps = 3.5GBps, but 3,500MBps _sounds better than_ 3.5GBps, right?_

In this context, bit rate refers to the amount of data a camera records per second. A single sensor on the GoPro Fusion shooting at the highest quality ([18 megapixels](/blog/2020/metadata-exif-xmp-360-photo-files)) gives a final image of about 2.5 Megabytes or 20 Megabits. If I take one photo every second, that's a shooting bit rate of 20 Megabit per second.

In short, a higher bit rate equates to a higher quiality output. It allows the camera to record more details about each frame.

## Bit rate and video files

Shooting single photos won't trouble the Fusion's maximum bit rate. But video is a different story. Offering 30 frames per second (FPS), or 30 photos per second, bit rate becomes much more of a concern.

 Cameras process tons of data about every single second of a video. After all, each second contains multiple frames composed of millions of bits of information.

[The GoPro Fusion camera can shoot 360 video in 5.2k (no Protune) at maximum bit rate of 60 Mbps per sensor](https://havecamerawilltravel.com/gopro/sd-card-recommendations-for-the-gopro-fusion/). Put another way, the sensors and other components in the camera cannot handle data transfer rates greater than 60 Mbps.S

<table class="tableizer-table">
<thead><tr class="tableizer-firstrow"><th>MODE / FPS</th><th>Bit rate (no Protune)</th><th>Bit rate (Protune)</th></tr></thead><tbody>
 <tr><td>5.2K30</td><td>45</td><td>60</td></tr>
 <tr><td>3K60</td><td>45</td><td>60</td></tr>
</tbody></table>

You can see the problem. If each photo at 18 megapixels is 20 Megabits we can only write 3 per second (20Mbps * 3 images per second = 60Mbps).

And the bit rate of the main video stream isn’t the whole story when it comes to what’s being written to the SD cards. The main MP4 video stream also includes a 128Kbps stereo AAC audio stream. Recorded at the same time (only to the card in slot 1) is a 1 Mpbs, 32-bit, 4-channel PCM WAV audio stream. There’s also the preview version of the video, the LRV file, that records at about 2.8 Mpbs (variable bit rate, video stream target 2.5 Mbps with a 128 Kpbs stereo AAC audio stream.

[Though the GoPro Fusion will always capture [_almost (29.97 / 59.97)_](/blog/2020/metadata-exif-xmp-360-video-files) 30 or 60 frames per second, so how is this possible?

## Image compression

When set to shoot video, the GoPro Fusion knows that it can't produce 30, let alone 60, 18 megapixel frames per second.

One of the easiest ways to do this is to shrink the image size, and thus data tranmission is to reduce the image size. Smaller images produce smaller amounts of data.

You can see as the frame rate increases on the GoPro Fusion, the video resolution decreases (5.2K30 vs. 3K60).

Though this still doesn't explain why my video had a lower resolution than advertised.

Here's the video I shot.

<iframe width="560" height="315" src="https://www.youtube.com/embed/iyIkDRERzz8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Clue: It is an `.mp4` video filmed using a GoPro Fusion with GPS enabled shot at 5.2K and the final file encoded using H.264 at 4K at 30 FPS using GoPro Fusion Studio **(no Protune)**. The file size is 86.2MB and runs for 16 seconds.

## Compression algorithms

Video compression algorithms (codecs) work in many interesting and unique ways to take a raw sensor input and produce an output of lower filesize, without reducing image quality at the same rate.

One consideration that isn’t immediately apparent from the GoPro camera menu options is that enabling Protune for video usually switches to higher bit rate recording. Basically, that means that the video has less compression applied, meaning that better image quality. 

If you want the higest video quality on the Fusion (4K), Protune needs to be enabled for this reason.

The next thing you're probably wondering is; why are non-Protune shot videos unable to use the higher bit rate?

It's down to control.

The Protune algoritm can manage the amount of data being generated by the sensor.

This is not possible when shooting RAW photos, with no algorithms applied.

When shooting a video, each frame captured by the sensor holds a differing amount of information.

Noise increases file sizes. A busy image with lots of trees and people will be larger then a photo of a clear blue sky.

With compression (e.g. Protune), in images with less noise, there are more areas of consistent patterns (i.e. the clear blue sky) that can be compressed less agressively. Conversely, in noiseyr images more agressive compression needs to be complied to ensure the maximum bit rate is not exceeded.

Without compression (e.g. raw files), no compression is applied. If the camera offered the maximum camera bit rate to the sensors in this scenario, there would be a high potential the absolute maximum bit rate (what the components in the camera can handle) would be exceeded.

Consequently, the camera is advertised with a lower _advertised_ maxiumum bit rate when shooting raw files. In reality the bit rate will vary up and down, and the extra room means it is possible the _advertised_ maxiumum bit rate will be exceeded safely, without troubling the absolute maximum.

This is why average bit rate is reported in the metadata, because the bit rate at any point in time might differe.

## Avoiding loss in image quality

First of all, make sure any storage devices aren't causing a data bottlenecl. It’s especially important that you have a SD card or external hard drive that’s fast enough to write the data generate by the camera.

[The SanDisk Extreme microSDXC UHS-I Memory Cards](https://www.amazon.co.uk/SanDisk-Extreme-microSDXC-Adapter-Performance/dp/B07FCMBLV6/) used in the [GoPro Fusion cameras on our Trek Packs](/trek-pack) write data up to 90Mbps.

The point being, is that each part of the camera from sensor from storage can constrain the amount of data that can be transferred, the bit rate. _And is why you should always buy an SD Card that is faster than the maximum bit rate of your camera._

As adressed in previous posts, it appears Google are pushing towards video capture for Steet View. Many cameras have native Street View functionality built around video captures.

At a high-level; more FPS = a smoother visual experience.

[Film and TV is shown at 24 FPS](https://en.wikipedia.org/wiki/Frame_rate).

Super slow motion videos (like those from the [Slow Mo Guys](https://www.youtube.com/user/theslowmoguys)), are shot using cameras with a very high frame rate (this might see countintuive).

But for 360 virtual tours, such high frame rate are excessibe.

[For Street View tours Google recommends](https://support.google.com/maps/answer/7662671?hl=en-GB):

> If supported by your camera, consider setting the frame rate to 5 frames per second at driving or biking speeds and 1 frame per second for walking speeds.

Therefore, one easy way to reduce data transfer is to lower the numver of frames being captured, if possible. Unfortuntaly the GoPro Fusion offers two frame rates for videos, 30 or 60.

You could turn on compression, like Protune. But be careful, [photos and videos are subject to various stylistic criteia, including](https://support.google.com/contributionpolicy/answer/7411351):

> Stylistic adjustments (such as applied filters) are acceptable, provided that these stylistic changes are minimal and are not appended elements such as borders, text, collaged images, etc.

With Protune, you can apply manual settings which can start to _stylise_ the image. Small modifications won't have an impact, if you start getting creative with ISO speeds, etc. you might run the risk of rejection.

Alternatively, you can use timelapse imagery.

You'll get higher image quality, it will be easier to process them, the real downsids is that you might not have as much flexibility in defining the spacing of photos before publishing.