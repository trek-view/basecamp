---
date: 2022-07-15
title: "Automatic horizon leveling of GoPro 360 photos (with no GPMD) (Part 3)"
description: "Analysing what camera roll looks like in equirectangular photos and how to account for it."
categories: developers
tags: [ffmpeg, yaw, pitch, roll, equirectangular, photo]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-07-01/GS018421_000003-meta.jpg
featured_image: /assets/images/blog/2022-07-01/GS018421_000003-sm.jpg
layout: post
published: false
redirect_from:
  - /blog/2022/roll-level-of-gopro-photo-no-gpmd-part-3
---

The easiest way to to train a computer is using real (and labelled) training data.

As mentioned in the last post, to do this I went and bought a Ricoh Theta which automatically "labels" images with roll and pitch in the `XMP` tags of each image;

```json
  "XMP:PosePitchDegrees": {
    "id": "PosePitchDegrees",
    "table": "XMP::GPano",
    "val": -9.6
  },
  "XMP:PoseRollDegrees": {
    "id": "PoseRollDegrees",
    "table": "XMP::GPano",
    "val": -131.6
  },
```

A computer will "look" at these `XMP` tags and compare them to the pattern of pixels in the photo they belong too (what we see as an image). Over time, and with enough images, a computer will be able to start to estimate the patterns of pixels to give an estimate of roll and pitch.

My first task was to go out and capture some images for my training set. As the final leveling software (what I'm hoping to build) will take images of all different kinds of conditions, landscapes, and colours the more variety in my training set, the better the algrorithm will be at handling adjusting for roll and pitch in many different 360 landscapes.












