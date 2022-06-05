---
date: 2022-06-09
title: "Automatic horizon leveling of GoPro 360 videos (Part 1)"
description: "Analysing what camera roll looks like in equirectangular videos and how to account for it."
categories: developers
tags: [ffmpeg, yaw, pitch, roll, equirectangular, video, gopro studio]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-05-20/gopro-video-horizon-level-meta.jpg
featured_image: /assets/images/blog/2022-05-20/gopro-video-horizon-level-sm.jpg
layout: post
published: false
---


## 2. Use calculated heading (complex, highest accuracy)

I've talked about extracting GoPro telemetry previously with regards to GPS points.

[The GPMD telemetry includes a whole host of data](/blog/2022/evolution-of-gopro-camera-sensors-gpmf), including `CORI` or Camera Orientation.

In GMPD, Camera orientation is a relative measurement (the orientation relative to the orientation the sensor had when the acquisition started), as opposed to an absoute measurement, like we calculated for heading in a previous step (the orientation absolute to magnetic north).

Camera Orientation is measured in Quaternions since capture start. I won't try explaining Quaternions here, but recommend this video which helped me to understand the concept and why they're needed (because of Gimbal Lock):

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/zjMuIxRvygQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

As you will have seen Quaternions contain 4 scalar variables  (sometimes known as Euler Parameters not to be confused with Euler angles); `x`,`y`,`z`,`w`.

We can see this reported in the GPMD telemetry json for `CORI` samples. Here's an example of the first `CORI` sample for the demo video;


```
TODO
```

In short, we we need to convert the relative quarternation measurement to absolute degrees from magnetic North measurement to get a heading value.

Nicely for us, Camera Orientation is reported at the same frame rate as the video (which can vary depending on what framerate setting was set on the camera, and is also reported in the telemetry as `"frames/second"`). This means we can calculate a heading for every single frame in the video.


