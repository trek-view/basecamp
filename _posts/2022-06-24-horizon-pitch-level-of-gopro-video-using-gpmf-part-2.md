---
date: 2022-05-27
title: "Automatic horizon leveling of GoPro 360 videos (Part 2)"
description: "A proof-of-concept to dynamically adjust for camera roll in equirectangular videos."
categories: developers
tags: [ffmpeg, yaw, pitch, roll, equirectangular, video]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-05-27/
featured_image: /assets/images/blog/2022-05-27/
layout: post
published: false
---

**A proof-of-concept to dynamically adjust for camera roll in equirectangular videos.**

As touched on last week, in many cases roll needs to be adjusted for dynamically. 

Luckily, each GoPro has a accelerometer that gives us the information needed to perform these adjustments.





* `v360` : filter name
  * `e` : abbreviation for "equirectangular" (this is the input format)
  * `e` : abbreviation for "equirectangular" (this is the desired output format)
  * `yaw`: horizontal center of equirectangular output [`0` - `360`] relative to current yaw (`0`)


## Adjusting roll dynamically

To account for roll we can just multiply the roll value by `-1` to get a roll offset value to create a level horizon.

In the last post I showed a real example of how to use the `v360` ffmpeg video filter to adjust roll. The command was structured like so;

```shell
ffmpeg -i INPUT.mp4 -vf v360=e:e:roll=ROLL_OFFSET -c:v libx265 OUTPUT.mp4
```

In this case, we need to pass the `ROLL_OFFSET` value based on the time of the video and roll value reported calculate previously.



