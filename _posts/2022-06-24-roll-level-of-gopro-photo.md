---
date: 2022-06-24
title: "Automatic horizon leveling of GoPro 360 videos (Part 2)"
description: "Analysing what camera roll looks like in equirectangular videos and how to account for it."
categories: developers
tags: [ffmpeg, yaw, pitch, roll, equirectangular, video]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-06-24/
featured_image: /assets/images/blog/2022-06-24/
layout: post
published: false
---

Analysing what camera roll looks like in equirectangular videos and how to account for it.

As I've mentioned on the blog many times, almost all cameras include the following [GPS tags](https://exiftool.org/TagNames/GPS.html) in the metadata of photos they take;

* `GPS:GPSLatitudeRef`
* `GPS:GPSLatitude`
* `GPS:GPSLongitudeRef`
* `GPS:GPSLongitude`
* `GPS:GPSAltitudeRef`
* `GPS:GPSAltitude`
* `GPS:GPSTimeStamp`
* `GPS:GPSDateStamp`

I have also previously mentioned, [including in my last 4 posts looking at roll, pitch and yaw](/blog/2022/calculating-heading-of-gopro-video-using-gpmf-part-1), how some manufacturers include additional [`GPS`](https://exiftool.org/TagNames/GPS.html),
 [EXIF](https://exiftool.org/TagNames/EXIF.html) and [`XMP-GPano`](https://exiftool.org/TagNames/XMP.html#GPano) metadata in photos taken that contain information or have been derived from information by other sensors from the camera, in addition to GPS. In addition commonly these include:


* `XMP-GPano:PoseHeadingDegrees`
* `XMP-GPano:PosePitchDegrees`
* `XMP-GPano:PoseRollDegrees`
* `GPS:GPSImgDirection`
* `GPS:GPSImgDirectionRef`
* `GPS:GPSPitch`      
* `GPS:GPSRoll`
* `EXIF:CameraElevationAngle`

Note, it is important to note the difference between `XMP-GPano:Pose...` and `XMP-GPano:InitialView...` tags;

* `XMP-GPano:InitialViewHeadingDegrees`
* `XMP-GPano:InitialViewPitchDegrees`
* `XMP-GPano:InitialViewRollDegrees`

As touched on in the last few posts, `XMP-GPano:InitialView...`, is only concerned with the viewer. Any value (in degrees) set for these fields will offset the viewer, but have no relation to the actual heading, pitch, or roll in the real world.

Where as `XMP-GPano:Pose...` considers the real world heading, pitch, or roll.

If `XMP-GPano:Pose...` values are not set, the `XMP-GPano:InitialView...` values entered will be offset from 0 (it's default). If `XMP-GPano:Pose...` values are set, the respective `XMP-GPano:InitialView...` values will be offset from the `XMP-GPano:Pose...` values set.

All being said, GoPro 360 Cameras do not include any information in photos taken on the MAX and Fusion 360 cameras beyond GPS positional information.

[I've talked previously about calculating rough values](/blog/2020/what-direction-are-you-facing) for heading and pitch by working out the heading and the pitch to the next photo in a photo sequence (using latitude, longitude, and altitude values which are reported in the photos metadata).

In an attempt to try an level the horizon of my 360 photos (like I did for videos), I need to the calculate roll values, however, non of the aforementioned data captured helps to determine this like pitch and yaw.

Therefore the following posts detail my attempt to try and estimate roll in photos taken from my GoPro 360 cameras.

## What roll looks like in equirectangular projections

When you have look at enough equirectangular photos outside of a 360 viewer, you begin to identify roll by eye.

Let me demonstrate.

Using my example roll video from a few weeks ago;

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/GDtz_K6k-Dg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

I have extracted frames at roughly (done by eye) 0 degrees, 45 degrees, 90 degrees, 135 degrees, 180 degrees, 225 degrees, 270 degrees, and 315 degrees.

You can see the timestamps I used to capture the frames in ffmpeg command;

```shell
ffmpeg -ss HH:MM:SS -i GS010011.mp4 -frames:v 1 -q:v 40 GS018421_HHMMSS.jpg
```

I've also annotated the horizon in red in each frame.

#### 0 degrees (`00:00:01`)

```shell
ffmpeg -ss 00:00:01 -i GS010011.mp4 -frames:v 1 -q:v 40 GS018421_000001.jpg
```

<img class="img-fluid" src="/assets/images/blog/2022-06-24/GS018421_000001-annotated.jpg" alt="Example Roll 0 Degrees" title="Example Roll 0 Degrees" />

#### 45 degrees (`00:00:03`)

```shell
ffmpeg -ss 00:00:03 -i GS010011.mp4 -frames:v 1 -q:v 40 GS018421_000003.jpg
```

<img class="img-fluid" src="/assets/images/blog/2022-06-24/GS018421_000003-annotated.jpg" alt="Example Roll 45 Degrees" title="Example Roll 45 Degrees" />

#### 90 degrees (`00:00:06`)

```shell
ffmpeg -ss 00:00:06 -i GS010011.mp4 -frames:v 1 -q:v 40 GS018421_000006.jpg
```

<img class="img-fluid" src="/assets/images/blog/2022-06-24/GS018421_000006-annotated.jpg" alt="Example Roll 90 Degrees" title="Example Roll 90 Degrees" />

#### 135 degrees (`00:00:08`)

```shell
ffmpeg -ss 00:00:08 -i GS010011.mp4 -frames:v 1 -q:v 40 GS018421_000008.jpg
```

<img class="img-fluid" src="/assets/images/blog/2022-06-24/GS018421_000008-annotated.jpg" alt="Example Roll 135 Degrees" title="Example Roll 135 Degrees" />

#### 180 degrees (`00:00:10`)

```shell
ffmpeg -ss 00:00:10 -i GS010011.mp4 -frames:v 1 -q:v 40 GS018421_000010.jpg
```

<img class="img-fluid" src="/assets/images/blog/2022-06-24/GS018421_000010-annotated.jpg" alt="Example Roll 180 Degrees" title="Example Roll 180 Degrees" />

#### 225 degrees (`00:00:12`)

```shell
ffmpeg -ss 00:00:12 -i GS010011.mp4 -frames:v 1 -q:v 40 GS018421_000012.jpg
```

<img class="img-fluid" src="/assets/images/blog/2022-06-24/GS018421_000012-annotated.jpg" alt="Example Roll 225 Degrees" title="Example Roll 225 Degrees" />

#### 270 degrees (`00:00:14`)

```shell
ffmpeg -ss 00:00:14 -i GS010011.mp4 -frames:v 1 -q:v 40 GS018421_000014.jpg
```

<img class="img-fluid" src="/assets/images/blog/2022-06-24/GS018421_000014-annotated.jpg" alt="Example Roll 270 Degrees" title="Example Roll 270 Degrees" />

#### 315 degrees (`00:00:16`)

```shell
ffmpeg -ss 00:00:16 -i GS010011.mp4 -frames:v 1 -q:v 40 GS018421_000016.jpg
```

<img class="img-fluid" src="/assets/images/blog/2022-06-24/GS018421_000016-annotated.jpg" alt="Example Roll 315 Degrees" title="Example Roll 315 Degrees" />

## Reviewing the wave

You can see clear patterns as the camera rolls around the `y` axis. As the roll increases to 45 the sine wave gets increasingly distorted. As it reaches 90 degrees the curve gets flatter and it gets closer to a square wave. As it gets closer to 135 degrees, the sine wave flattens and is a mirror (horizontally) of the 45 degree wave.

As a human, this pattern is easy to spot assuming a good proportion of the ground is visible. Though could a computer detect this?


