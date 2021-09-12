---
date: 2021-09-30
title: "Reverse Engineering GoPro's 360 Video File Format (Part 4)"
description: "In the final part of this series, I convert a GoPro EAC projected frame into an equirectangular projection to be displayed in other other software."
categories: guides
tags: [GoPro]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-09-30/
featured_image: /assets/images/blog/2021-09-30/
layout: post
published: false
---

**In the final part of this series, I convert a GoPro EAC projected frame into an equirectangular projection to be displayed in other other software.**

[Last week I blended the overlapping pixels in .360 cubefaces](/blog/2021/reverse-engineering-gopro-360-file-format-part-3). In the final step, I wanted to convert into equirectangular frames (the most widely understood projection type in software for 360 images).





Above, I've uploaded the output straight to YouTube without any metadata added to the video.


https://github.com/ytdl-org/youtube-dl/issues/15267

https://github.com/naver/egjs-view360/wiki/Supported-Projection-Type

So why did GoPro create the .360

After which