---
date: 2022-05-28
title: "Automatic horizon leveling of GoPro 360 videos (Part 2)"
description: "A proof-of-concept to dynamically adjust for camera roll in equirectangular videos."
categories: developers
tags: [ffmpeg, yaw, pitch, roll, equirectangular, video]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-05-28/
featured_image: /assets/images/blog/2022-05-28/
layout: post
published: false
---


[I've talked previously on a simplistic way to calculate the heading from a series of photos](/blog/2020/what-direction-are-you-facing).

In short you plot the two image co-ordinates and find the angle (bearing) between the two.

Recently I was posed a challenge; determine the heading of frames of a GoPro MAX 360 video that was processed in GoPro Studio with World Lock enabled.

For those unfamilar, World Lock fixed the video will fix the orientation toward a fixed compass direction (the initial orientation of the video), regardless of where the camera is pointed.

There's a nice demonstration of World Lock enabled (and disabled) in my post; [GoPro Studio Settings for Creating Virtual Tour Content](/blog/2021/using-gopro-studio-process-360-files).

There are two options to do this;

## 1. Use estimated heading (simple, lower accuracy)

We can extract frames from a the video, embed GPS into the photos (from video telemetry), and then use [the same method employed in the post linked previously - calcate heading between photo points](/blog/2021/using-gopro-studio-process-360-files).

<img class="img-fluid" src="/assets/images/blog/2022-05-28/gopro-world-lock-heading-calculation.jpg" alt="GoPro World Lock heading adjustment" title="GoPro World Lock heading adjustment" />

However for videos shot in World Lock you only need to calculate the heading from photo 1 to photo 2. Why? If you rememeber back, World Lock fixes the heading of the video to the initial heading at video start time. As a result, this means all the photo headings will be, roughly, the same as the first heading calculated.

It's also possible to reverse engineer from World Lock and display the as if World Lock was disabled using a yaw adjustment.

To do this you'll need both the actual heading and the World Lock heading (P1 - P2).

First you need to calculate the difference in angle; `Actual heading` - `World Lock heading`

The value from this calculaion is the yaw adjustment you need to apply to the photo.

As noted in the previous post, the accuracy of this approach depends on

1. The spacing between photos
2. The amount of direction change at the start of the video

So if you're turning quickly, you'll need to decrease the spacing between photos to ensure the initial heading calculation (which is subsequently applied to photos) is as accurate as possible.

In our case, most sequences are captured walking or cycling trails where the direction change is minimal at the start of a video.

Though to improve accuracy (or if you want to keep the video intact), you can call on the [GoPro MAX's IMU](/blog/2020/360-camera-sensors-imu-accelerometer-gyroscope-magnetometer).

## 2. Use calculated heading (complex, highest accuracy)

I've talked about extracting GoPro telemetry previously with regards to GPS points.

[The GPMD telemetry includes a whole host of data](/blog/2022/evolution-of-gopro-camera-sensors-gpmf), including samples;

* ACCL z,x,y in m/s2 (approximate frequency 200Hz)
* GYRO z,x,y in rad/s (approximate frequency 200Hz)
* MAGN z,x,y in 5T (approximate frequency 24Hz)

With this information we can calculate heading like so....

TODO







