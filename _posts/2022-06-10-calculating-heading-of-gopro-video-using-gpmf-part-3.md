---
date: 2022-06-10
title: "Using ffmpeg to dynamically adjust the yaw of GoPro 360 videos (Part 4)"
description: "Using calculated heading values to ensure videos are shown in 360 players facing the same direction as they were shot."
categories: developers
tags: [ffmpeg, yaw, pitch, roll, equirectangular, video, gopro studio]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-06-10/
featured_image: /assets/images/blog/2022-06-10/
layout: post
published: false
---

**Using calculated heading values to ensure videos are shown in 360 players facing the same direction as they were shot.**

Now that we have the heading values for each frame in the video, we can use them to adjust the yaw in our World Lock video to reverse the effect.

To do this, we can take exactly the same approach as I showed you for images in the post; [Adjusting the yaw of an equirectangular 360 photo using ImageMagick](/blog/2022/adjusting-yaw-equirectangular-images).

That is;

1. take the first heading reported in telemetry, and assume that as the World Lock heading
2. calculate the yaw adjustment needed using the calculation `true heading` (reported in telemetry .json) - `World Lock heading` (calculated at step 1)
3. pass the value to ffmpeg

It's easy to align frames to heading values, because we have a `HEAD` value for each frame, so we just iterate through frames and `HEAD` values to make the adjustment.

`cts`