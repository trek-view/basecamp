---
date: 2022-06-17
title: "Automatic horizon and pitch leveling of GoPro 360 videos"
description: "A proof-of-concept to dynamically adjust for camera roll and pitch in equirectangular videos."
categories: developers
tags: [ffmpeg, yaw, pitch, roll, equirectangular, video, mp4]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-06-17/gopro-max-roll-examples-roll-front-meta.jpg
featured_image: /assets/images/blog/2022-06-17/gopro-max-roll-examples-roll-front-meta.jpg
layout: post
published: true
---

**A proof-of-concept to dynamically adjust for camera roll and pitch in equirectangular videos.**

In my last series of posts, [Using ffmpeg to dynamically adjust the yaw of GoPro 360 videos](/blog/2022/calculating-heading-of-gopro-video-using-gpmf-part-2) part of the process required converting `CORI` samples into yaw, pitch, and roll (for the intent of fixing yaw).

Of course, this data can also be used to fix pitch and roll issues.

## Roll (horizon level) (`y` axis)

Fixing roll is commonly an option for in post-processing video software (like GoPro Player for the GoPro MAX) -- it is a feature known as horizon leveling (or roll lock).

For example, when converting .360's shot on the GoPro MAX [using GoPro Studio software you can select "Horizon level"](/blog/2021/using-gopro-studio-process-360-files) that will automatically adjust the roll of the camera to ensure the horizon remains level.

Action cameras are often mounted to moving objects, like people, which have a tendency to roll left and right when moving.

Unlike movement around the `x` (pitch) and `z` (yaw) axis, a video (or photo) that is rolling (anywhere around the `y` axis other than 0) can create a feeling of "seasickness" in the viewer.

A good way to think of this is to move your head.

<img class="img-fluid" src="/assets/images/blog/2022-06-17/pitch-roll-yaw-head.png" alt="Roll pitch yaw head" title="Roll pitch yaw head" />

1. Shake your head side-to-side along the `z` axis (yaw)
2. Nod your head up-and-down along the `x` axis (pitch)
3. Roll your head left-and right along the `y` axis (roll)

The last should feel the most unnatural, which is in part what leads to the seasickness effect.

Like with yaw, in 360 videos we can account for roll as the whole panoramic view is available to work with. To perform horizon leveling all you need to know the offset of the camera from the ground (0 degrees), or more scientifically put; roll along the `y` axis.

<img class="img-fluid" src="/assets/images/blog/2022-06-17/gopro-max-roll-examples-roll-front.jpg" alt="Roll examples GoPro MAX" title="Roll examples GoPro MAX front" />

_If my diagram is unclear (very likely), to clarify; the `y` axis is pointing directly at you in this view._

In these examples (left to right), the first GoPro MAX is rolling about 10 degrees, the second about 135 degrees, and the third about 340 degrees (I am measuring this from the `z` axis, above).

It is important to point out that horizon leveling isn't actually leveling against an horizon in the video. The cameras gyroscope is measuring roll in relation to a level camera.

The `y` axis is somewhat of an imaginary measurement, but think of it this way; if the camera was sitting on completely flat ground the roll would be 0. Therefore the top (width ways) would be parallel with the `x` axis, and the top (length ways) would be parallel with the `y` axis.

To level the camera to `y=0` in the 3 examples above, all that is needed is to adjust roll in; example one by -10 degrees, the second by -135 degrees, and the third by -340 degrees to make `y=0`.

[As we know from the previous posts](/blog/2022/calculating-heading-of-gopro-video-using-gpmf-part-2), we know that roll for each frame can be calculated from measurements captured by the gyroscope.

As such, to adjust for roll we can use [a similar approach with ffmpeg as implemented for adjusting yaw](/blog/2022/calculating-heading-of-gopro-video-using-gpmf-part-3) that is; extract all the frames, adjust each frame based on roll measurement using the ffmpeg `v360` `roll` filter (`ffmpeg -i <frame_path> -vf v360=input=e:e:roll=Y <out_path>`) and then rebuild the video.

Our GoPro RPY script performs all these steps automatically using the command;

```shell
python3 main.py TELEMETRY.json --plot true --video_input VIDEO.mp4 --mode level_roll
```

Using my example roll video from a few weeks ago;

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/GDtz_K6k-Dg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

And then implementing the steps described to level roll gives an output like so;

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/sLwrGJQMIxk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

It works, but like with yaw, it is a bit shaky, hence a high or low pass filter on the telemetry during calculations should really be considered ([see last weeks post for more on that subject](/blog/2022/calculating-heading-of-gopro-video-using-gpmf-part-3)).

## Pitch (`x` axis)

In addition to video smoothing, adjusting pitch can also used to account for camera mounting errors.

For example, if the camera was mounted at an angle facing at towards the ground, pitch could be adjusted at a fixed rate to account for that, as shown below;

<img class="img-fluid" src="/assets/images/blog/2022-06-17/gopro-max-roll-examples-pitch-side.jpg" alt="Pitch examples GoPro MAX" title="Pitch examples GoPro MAX front" />

Like with yaw and roll, you can offset pitch in a fixed way using ffmpeg, replacing `Y` with the desired pitch offset to account for the mounting error;

```shell
ffmpeg -i <frame_path> -vf v360=input=e:e:pitch=X <out_path>
```

I also tried (in GoPro RPY) to dynamically leveling pitch in each frame using the same approach as before. Essentially this means there is no concept of up and down. It is very similar to World Lock mode (`z` axis) and horizon lock mode (`y`) axis.

As a reminder, here's the original pitching video:

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/xCjSPYIKN68" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

And the output of GoPro RPY with pitch level:

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/9fwi2JO08D4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Important note: our GoPro RPY script does not account for pitch outside of `-90` to `90` degrees (that is, when camera is upside down).

<img class="img-fluid" src="/assets/images/blog/2022-06-17/GS010010-pitch-RPY-marked.png" alt="Pitch graph GS010010-pitch marked" title="Pitch graph GS010010-pitch marked" />

You'll see as camera enters negative pitch, the pitch starts to decrease from 90. It is not hard to account for the camera being upside down (I just haven't implemented it). All that is needed is to also account for yaw values too (to determine what way up the camera is).

## A note on `XMP-GSpherical` metadata tags for fixed (not dynamic) roll and pitch offsets

A better way to account for fixed pitch or roll offset is to use the [`XMP-GSpherical` `InitialViewPitchDegrees` or `InitialViewRollDegrees` video metadata tags](https://exiftool.org/TagNames/XMP.html#GSpherical) respectively to achieve the same result.

The `InitialViewPitchDegrees` determines the starting pitch of the camera. It will default to the center of the image. However, if you know there is a fixed offset you can account for it here.

For example `InitialViewPitchDegrees` = 20, will tilt the viewer 20 degrees up for the default view (until user starts using the panning controls).

It is the same concept for `InitialViewRollDegrees`.

The benefit of this method is that no video processing is required. The downside is, it can't perform dynamic adjustments during the video.

## Horizon (roll) leveling in photos

GPMF is very verbose. The GoPro sensor data allows us to adjust yaw, pitch and roll for every frame of a video using the data it saves.

Many 360 cameras embed a subset of sensor data in photo metadata too.

Unfortunately in the case of GoPro's 360 cameras this is not the case. When shooting in timelapse photo or photo mode on the MAX or Fusion non of the sensor data is stored.

[I've talked previously about calculating rough values](/blog/2020/what-direction-are-you-facing) for heading and pitch by working out the heading and the pitch to the next photo in a photo sequence (using latitude, longitude, and altitude values which are reported in the photos metadata).

Though knowing where the next photo is does not give us anything to go on in terms of calculating camera roll.

In next weeks post I'll explore methods you can use to estimate camera roll when no sensor data is available.