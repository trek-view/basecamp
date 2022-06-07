---
date: 2022-06-03
title: "Using ffmpeg to dynamically adjust the yaw of GoPro 360 videos (Part 2)"
description: "Converting GoPro telemetry into magnetic heading values to ensure videos are shown in 360 players facing the same direction as they were shot."
categories: developers
tags: [ffmpeg, yaw, pitch, roll, equirectangular, video, gopro studio]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-06-03/GSAD1297-roll180-meta.JPG
featured_image: /assets/images/blog/2022-06-03/GSAD1297-roll180-sm.JPG
layout: post
published: false
---

**Converting GoPro telemetry into magnetic heading values to ensure videos are shown in 360 players facing the same direction as they were shot.**

[Last weeks post teased you with the mathematics that were ahead](/blog/2022/calculating-heading-of-gopro-video-using-gpmf-part-1). Now that day has come.

In that post I wrote;

> Using the `x`, `y` components of Magnetometer samples in addition to the ro;; and pitch angles calculated from the `ACCL` samples, we can calculate the absolute degrees the camera was facing from magnetic North (it's heading).

So let's start by calculating roll and pitch.

## Calculation Roll, Pitch (and Yaw) from `CORI` samples

To calculate these values we take the four Quarternation values (Euler Parameters) and convert them into Euler angles on each axis.

Now the equations to do this are somewhat complex, as you'll see from a cursory scan of this Wikipedia article; [Conversion between Quaternions and Euler angles](
https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles).

As we have data for all three axis it is possible to calculate yaw in addition to roll and pitch as `roll_x`, `pitch_y`, `yaw_z` in radians for every frame in the video (remember the sample rate for `CORI` data matches the framerate of the video).

We can store this in a new stream value `RPYR`. We can also convert it to degrees knowing that `1Rad × 180/π` = `57.296` degrees as a field `RPYD`.

`yaw_z` calculated using this approach depends on the frame of reference where the sensor was initially calibrated from (at camera startup), it can tell the deviation in the angle from this reference but it does not necessarily account for magnetic angular deviation (in other words it does not 'truly' show the magnetic heading).

Therefore, we can also use the magnetometer samples (in addition to roll and pitch values just calculated) to better determine the heading.

## Calculation Yaw from `MAGN` and `CORI` samples

The first challenge is the difference is sampling rates.

`CORI` reports samples at the same framerate the video was shot. The magnetometer `MAGN` samples are taken at an approximate frequency of 24Hz.

Therefore we first need to synchronise the sample times. A simple and crude way to do this (this is designed a proof-of-concept) is to find which `CORI` times each `MAGN` is closest too and assign that time to the value of the calculated heading.

For example, lets say we have a `MAGN` time equal to `2022-05-26T08:35:42.485Z` and 3 `CORI` times, `2022-05-26T08:35:42.400Z`, `2022-05-26T08:35:42.500Z`, and `2022-05-26T08:35:42.600Z`.

The closest `CORI` time to the `MAGN` time is 2022-05-26T08:35:42.500Z, therefore the `MAGN` timestamp is updated to consider this value.

Once the times have been synced and each `MAGN` sample has a corresponding `CORI` sample we can use calculate the magnetic heading.

```
Mx = mx * cos(p) + my * sin(p)
My = mx * cos(r) * sin(p) + my * cos(r) + mz * sin(r) * cos (p)
M_yaw = atan2(My,Mx)
```

Where:

* `mx` = magnetometer x reading
* `my` = magnetometer y reading
* `mz` = magnetometer z reading
* `r` = roll angle
* `p` = pitch angle

Be careful not to confuse `My` and `my` / `Mx` and `mx` (they are different variables). For clarity; `my` is the magnetic component in y direction, `My` is the output of the second equation which is approximately corrected y component of the magnetic field. The same explanation applies for `Mx` and `mx`.

We can store the `M_yaw` values in a new stream `HEAR` which reports the magnetic heading in radians, and `HEAD` which reports the magnetic heading in degrees.

In summary this gives us 5 new streams in the telemetry file

* `RPYR`:
	* name: roll, pitch, yaw (x,y,z)
	* units: radians
* `RPYD`
	* name: roll, pitch, yaw (x,y,z)
	* units: degrees
* `HEAR`
	* name: magnetic heading
	* units: radians
* `HEAD`
	* name: magnetic heading
	* units: degrees

## Some examples

Let's take a look at what this data looks like for some sample videos where I've deliberately exagerated yaw, pitch and roll (sorry about the wind noise!).

### Pitch change (GS010010.mp4)

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/xCjSPYIKN68" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

* [Original telemetry file](https://drive.google.com/file/d/1ILaUw0bmgUb1qJh_q1G5ffwY_W2FClD0/view?usp=sharing)
* Processed telemetry file

Insert graphs here

### Roll change (GS010011.mp4)

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/GDtz_K6k-Dg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

* [Original telemetry file](https://drive.google.com/file/d/1zJpFSf-d0D7uptsy9iEGLV-UE-w3hzO3/view?usp=sharing)
* Processed telemetry file

Insert graphs here

### Yaw change (GS010012.mp4)

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/kBlqZx21_6g" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

* [Original telemetry file](https://drive.google.com/file/d/1ncZIhTg-jm7eXdsuVzN2ZWz6Us7GUHkv/view?usp=sharing)
* Processed telemetry file

Insert graphs here

## In summary

The `HEAD` value now reported for each frame tells us what compass direction the camera is pointing.

Next week I will use the calculated `HEAD` samples with an ffmpeg filter to dynamically adjust the yaw of our World Lock video (to reverse the World Lock effect).

_A big shoutout to Kanishk K who helped me understand the mathematics that contibuted to this post._