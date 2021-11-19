---
date: 2021-11-12
title: "What are GoPro LRV, THM and WAV Files?"
description: "An explanation of the LRV, THM and WAV files that are generated when you shoot GoPro videos."
categories: guides
tags: [GoPro, MAX, Fusion, Hero, video, mp4, 360]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-11-12/gopro-360-thm-lrv-files.png
featured_image: /assets/images/blog/2021-11-12/gopro-360-thm-lrv-files-sm.png
layout: post
published: true
---

**An explanation of the LRV, THM and WAV files that are generated when you shoot GoPro videos.**

When you download videos from your GoPro’s memory card, you might have noticed in addition to the `.mp4` or `.360` files, `.lrv`, `.thm` and `.wav` files.

`.thm` and `.lrv` files are both GoPro specific, and used by GoPro software (on the camera screen and in mobile apps).

<img class="img-fluid" src="/assets/images/blog/2021-11-12/gopro-360-thm-lrv-files-sm.png" alt="GoPro LRV and THM Files" title="GoPro LRV and THM Files" />

`.thm` files are JPG thumbnails (THM) used by GoPro software as a still photo preview of the video.

They're tiny files (usually less than 100Kb), typically with a resolution of 160 by 120 pixels.

`.lrv` files are Low-Resolution Video (LRV) files are used by GoPro software to display video previews, without having to load the high-resolution version.

The reason these are used rather than the original `.mp4` or `.360` videos comes down to filesize. The high-resolution video files that the GoPro shoots create very large files. For example, 1 minute of 360 video at 5.6K generates a file of about 1GB in size.

Streaming and rendering files of that size would be very intensive for the device (doing this on many phones would cause them to crash -- try it on your phone).

A `.360` of 4GB has an accompanying `.lrv` file size of 170Mb, or about 5% of the `.360` version. The `.lrv` file has the same video content of the `.360` but at a much lower resolution.

If you don't use the GoPro mobile apps, and simply export content to your PC from a memory card then the `.thm` and `.lrv` files can be safely deleted.

<img class="img-fluid" src="/assets/images/blog/2021-11-12/" alt="GoPro WAV Files" title="GoPro WAV Files" />

`.wav` files are created when shooting video on the GoPro Fusion.

`.wav` files are the audio recording of the video. These can be played by other audio software (it's a widely understood audio format). The `.wav` audio track is added to the final `.mp4` video when it is stitched in GoPro Fusion Studio.