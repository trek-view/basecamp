---
date: 2022-09-09
title: "Injecting Telemetry into Video Files (Part 2): GPMF"
description: "In this post I will the structure of GoPro's GPMF standard, how to create a GPMF binary, and how to inject it into a mp4 video file."
categories: developers
tags: [gpmd, camm, telemetry, gpmf, gpx]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-09-09/
featured_image: /assets/images/blog/2022-09-09/
layout: post
published: false
---

**In this post I will the structure of GoPro's GPMF standard, how to create a GPMF binary, and how to inject it into a mp4 video file.**

In [my last post I showed an example of a GPMF binary](/blog/2022/injecting-camm-gpmd-telemetry-videos-part-1-challenges).

To understand what was shown at the end of the post, we need to understand the structure of GPMF. Luckily GoPro have written extensively on the subject. In fact, their [gpmf-write](https://github.com/gopro/gpmf-write) repository shows how to create GPMF binaries, and their [gpmf-parser](https://github.com/gopro/gpmf-parser) shows how to parse it.

> GPMF -- GoPro Metadata Format or General Purpose Metadata Format -- is a modified Key, Length, Value solution, with a 32-bit aligned payload, that is both compact, full extensible and somewhat human readable in a hex editor. GPMF allows for dependent creation of new FourCC tags, without requiring central registration to define the contents and whether the data is in a nested structure. GPMF is optimized as a time of capture storage format for the collection of sensor data as it happens.

_[https://github.com/gopro/gpmf-write](https://github.com/gopro/gpmf-write)_

> 32-bit aligned payload

If you open up the binary file, [example in last post](/blog/2022/injecting-camm-gpmd-telemetry-videos-part-1-challenges), you will see each line is 32 characters long.





