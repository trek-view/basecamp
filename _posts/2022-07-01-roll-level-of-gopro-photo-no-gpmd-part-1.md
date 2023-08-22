---
date: 2022-07-01
title: "Automatic horizon leveling of GoPro 360 photos (with no GPMD) (Part 1)"
description: "Analysing what camera roll looks like in equirectangular photos and how to account for it."
categories: developers
tags: [ffmpeg, yaw, pitch, roll, equirectangular, photo]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-07-01/GS018421_000003-meta.jpg
featured_image: /assets/images/blog/2022-07-01/GS018421_000003-sm.jpg
layout: post
published: true
redirect_from:
  - /blog/2022/roll-level-of-gopro-photo-no-gpmd-part-1
---

**Analysing what camera roll looks like in equirectangular photos and how to account for it.**

As I have mentioned on the blog many times, almost all 360 cameras include the following [GPS tags](https://exiftool.org/TagNames/GPS.html) in the metadata of photos they take;

* `GPS:GPSLatitude`: [decimal Latitude](/blog/reading-decimal-gps-coordinates-like-a-computer)
* `GPS:GPSLatitudeRef`: `E` (East) or `W` (West)
* `GPS:GPSLongitude`: decimal Longitude
* `GPS:GPSLongitudeRef`: `N` (North) or `S` (South)
* `GPS:GPSAltitude`: decimal Altitude
* `GPS:GPSAltitudeRef`: `0` (Above Sea Level) or `1` (Below Sea Level)
* `GPS:GPSTimeStamp`: UTC time of GPS fix
* `GPS:GPSDateStamp`: Date of GPS fix

I have also previously touched on how some manufacturers include additional [`GPS`](https://exiftool.org/TagNames/GPS.html), [`EXIF`](https://exiftool.org/TagNames/EXIF.html) and [`XMP-GPano`](https://exiftool.org/TagNames/XMP.html#GPano) metadata in photos derived from other sensors in the camera. These include:

* `XMP-GPano:PoseHeadingDegrees`: Heading in degrees
* `XMP-GPano:PosePitchDegrees`: Pitch in degrees
* `XMP-GPano:PoseRollDegrees`: Roll in degrees
* `GPS:GPSImgDirection`: Heading in degrees
* `GPS:GPSImgDirectionRef`: either `T` (True direction) or `M` (Magnetic direction)
* `GPS:GPSPitch`: Pitch angle in degrees
* `GPS:GPSRoll`: Roll angle in degrees
* `EXIF:CameraElevationAngle`: Pitch angle in degrees with positive pitch upwards

Note, it is important to note the difference between `XMP-GPano:Pose...` and `XMP-GPano:InitialView...` tags;

* `XMP-GPano:InitialViewHeadingDegrees`: Heading offset in degrees
* `XMP-GPano:InitialViewPitchDegrees`: Pitch offset in degrees
* `XMP-GPano:InitialViewRollDegrees`: Roll offset in degrees

As touched on in the last few posts, `XMP-GPano:InitialView...`, is only concerned with the viewer. Any value (in degrees) set for these fields will offset the viewer from corresponding `XMP-GPano:Pose...` values, but have no relation to the actual heading, pitch, or roll in the real world.

Where as `XMP-GPano:Pose...` considers the real world heading, pitch, or roll (and not the viewer).

If `XMP-GPano:Pose...` values are not set, the `XMP-GPano:InitialView...` values entered will be offset from 0 (its default value if none set). If `XMP-GPano:Pose...` values are set, the respective `XMP-GPano:InitialView...` values will be offset from the `XMP-GPano:Pose...` values set.

All that being said, GoPro 360 Cameras do not include any information in photos beyond GPS positional information (`lat`, `lon`, and `alt`).

[I've talked previously about calculating rough values for heading and pitch when other sensor telemetry is not available](/blog/what-direction-are-you-facing) by working out the heading and the pitch to the next photo in a photo sequence (using latitude, longitude, and altitude).

In an attempt to try an level the horizon of my 360 photos I need to be able to determine the camera roll, however, `lat`, `lon`, and `alt` values cannot be used to do this.

So down the rabbit whole I went.

The following posts detail my attempt to try and estimate roll in photos taken on GoPro 360 cameras (or any 360 camera where limited metadata is written into the photos).

## What roll looks like in equirectangular projections

When you have look at enough equirectangular photos outside of a 360 viewer you begin to identify roll by eye.

Let me demonstrate...

Using my example roll video from a few weeks ago;

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/GDtz_K6k-Dg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

I have extracted frames at roughly (done by eye) at 0 degrees, 45 degrees, 90 degrees, 135 degrees, 180 degrees, 225 degrees, 270 degrees, and 315 degrees.

You can see the timestamps I used to capture the frames in ffmpeg command;

```shell
ffmpeg -ss HH:MM:SS -i GS010011.mp4 -frames:v 1 -q:v 40 GS018421_HHMMSS.jpg
```

I've also annotated the horizon in red in each frame.

#### 0 degrees (`00:00:01`)

```shell
ffmpeg -ss 00:00:01 -i GS010011.mp4 -frames:v 1 -q:v 40 GS018421_000001.jpg
```

<img class="img-fluid" src="/assets/images/blog/2022-07-01/GS018421_000001-annotated.jpg" alt="Example Roll 0 Degrees" title="Example Roll 0 Degrees" />

#### 45 degrees (`00:00:03`)

```shell
ffmpeg -ss 00:00:03 -i GS010011.mp4 -frames:v 1 -q:v 40 GS018421_000003.jpg
```

<img class="img-fluid" src="/assets/images/blog/2022-07-01/GS018421_000003-annotated.jpg" alt="Example Roll 45 Degrees" title="Example Roll 45 Degrees" />

#### 90 degrees (`00:00:06`)

```shell
ffmpeg -ss 00:00:06 -i GS010011.mp4 -frames:v 1 -q:v 40 GS018421_000006.jpg
```

<img class="img-fluid" src="/assets/images/blog/2022-07-01/GS018421_000006-annotated.jpg" alt="Example Roll 90 Degrees" title="Example Roll 90 Degrees" />

#### 135 degrees (`00:00:08`)

```shell
ffmpeg -ss 00:00:08 -i GS010011.mp4 -frames:v 1 -q:v 40 GS018421_000008.jpg
```

<img class="img-fluid" src="/assets/images/blog/2022-07-01/GS018421_000008-annotated.jpg" alt="Example Roll 135 Degrees" title="Example Roll 135 Degrees" />

#### 180 degrees (`00:00:10`)

```shell
ffmpeg -ss 00:00:10 -i GS010011.mp4 -frames:v 1 -q:v 40 GS018421_000010.jpg
```

<img class="img-fluid" src="/assets/images/blog/2022-07-01/GS018421_000010-annotated.jpg" alt="Example Roll 180 Degrees" title="Example Roll 180 Degrees" />

#### 225 degrees (`00:00:12`)

```shell
ffmpeg -ss 00:00:12 -i GS010011.mp4 -frames:v 1 -q:v 40 GS018421_000012.jpg
```

<img class="img-fluid" src="/assets/images/blog/2022-07-01/GS018421_000012-annotated.jpg" alt="Example Roll 225 Degrees" title="Example Roll 225 Degrees" />

#### 270 degrees (`00:00:14`)

```shell
ffmpeg -ss 00:00:14 -i GS010011.mp4 -frames:v 1 -q:v 40 GS018421_000014.jpg
```

<img class="img-fluid" src="/assets/images/blog/2022-07-01/GS018421_000014-annotated.jpg" alt="Example Roll 270 Degrees" title="Example Roll 270 Degrees" />

#### 315 degrees (`00:00:16`)

```shell
ffmpeg -ss 00:00:16 -i GS010011.mp4 -frames:v 1 -q:v 40 GS018421_000016.jpg
```

<img class="img-fluid" src="/assets/images/blog/2022-07-01/GS018421_000016-annotated.jpg" alt="Example Roll 315 Degrees" title="Example Roll 315 Degrees" />

## Reviewing the wave (with a clear horizon)

You can see clear patterns as the camera rolls around the `y` axis.

As the roll increases to 45 degrees the sine wave gets increasingly distorted. As it reaches 90 degrees the curve gets closer to a square wave. As it gets closer to 135 degrees, the sine wave flattens again (and is a horizontal mirror of the 45 degree wave).

As a human, this pattern is fairly easy to spot assuming a good proportion of a horizon is visible and fairly level. It gets a bit more complicated when there are obstructions to the horizon or the photos is in an enclosed space.

## Dealing with obstructions to the horizon

As almost all our photos are taken outdoors, I won't consider photos taken indoors in these posts.

Regarding obstructions, here is a photo taken along a ridge line.

<img class="img-fluid" src="/assets/images/blog/2022-07-01/GSAD0340-annotated.jpg" alt="Example Roll 315 Degrees" title="Example Roll 315 Degrees" />

The camera is fairly level, as you can see from the annotated horizon. However, without the annotation, the rising ridge in front of the camera makes it a little harder to spot as a human at first glance.

But what about a computer? I will take a look at that next week...