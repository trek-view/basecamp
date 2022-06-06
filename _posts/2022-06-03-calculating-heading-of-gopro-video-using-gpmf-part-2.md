---
date: 2022-06-03
title: "Using ffmpeg to dynamically adjust the yaw of GoPro 360 videos (Part 2)"
description: "Ensure your 360 videos are loaded in 360 players facing the same direction as they were shot. This week covers "
categories: developers
tags: [ffmpeg, yaw, pitch, roll, equirectangular, video, gopro studio]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-06-03/
featured_image: /assets/images/blog/2022-06-03/
layout: post
published: false
---



As noted earlier, to do 












U (in the sample above `x` = `88` , `y` = `27`) w for each `MAGN` sample using the calculation:

```
atan2(my/mx)
```

So using the example above gives:

```
atan2(my/mx)
```



In short, we we need to convert the relative Quarternation measurement to 








With this value, we can then dynamically update the corresponding frames in the video.

Nicely for us, . This means we can calculate a heading for every single frame in the video.