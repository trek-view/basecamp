---
date: 2021-10-01
title: "Handling Large File Uploads in a Browser"
description: "."
categories: guides
tags: []
author_staff_member: dgreenwood
image: /assets/images/blog/2021-10-01/
featured_image: /assets/images/blog/2021-10-01/
layout: post
published: false
---

I remember when Brian Redmnobnd first showed me the output from his Insta360 Pro2 camera. It was 5Gb for around 10 minutes of video.

[The Federico Debetto showed me the Insta360 Titan](/blog/2020/trek-pack-pro):

> The Titan uses 9 (8+1) SD cards and I opted for a few sets of 128Gb cards. Each set of cards is able to record just under 2 hours of video footage in Street View mode, so 11K, 5fps..

That's about 1.15TB's of video for 2 hours!

One of the reasons I've previously chosen to shoot in timelapse mode with the GoPro MAX Trek Pack cameras is due to video size. A stitched 360 .mp4 shot in 5K (4992 x 2496) at 30FPS comes out a little over 4GB's.

When I was first ideating Map the Paths two years ago this was a major consideration (and headache). Working with files of this size is both computational expensive and complex, but also potentially very financially expensive. Ultimatley this was the reason I decided to create the Map the Paths Uploader as a tool to preprocess and compress imagery before upload. The tradeoff being I'd also have to support lot's of local issues caused by local differences om the machines the Uploader was installed.

Over the past few months I've been planning a rework of Map the Paths Web and the Uploader, including merging the uploader into the web app (be).

Let's take a look at some of the probelsm

## Network Bandwidth & File Size

In one article the author roughly defined an equation to estimate time to upload a file as:

```
time_to_upload = file_size / effective_bandwidth + overhead
```








