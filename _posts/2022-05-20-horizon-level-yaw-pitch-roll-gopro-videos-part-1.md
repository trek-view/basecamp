---
date: 2022-05-20
title: "Automatic horizon leveling of GoPro 360 videos (Part 1)"
description: "Analysing what camera roll looks like equirectangular videos and how to account for it."
categories: developers
tags: [ffmpeg, yaw, pitch, roll, equirectangular, video, gopro studio]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-05-20/gopro-video-horizon-level-meta.jpg
featured_image: /assets/images/blog/2022-05-20/gopro-video-horizon-level-sm.jpg
layout: post
published: true
---

**Analysing what camera roll looks like equirectangular videos and how to account for it.**

I've talked previously about the concepts of [yaw, pitch, and roll](/blog/2020/yaw-pitch-roll-360-degree-photography) in 360 imagery.

A lot of software now ships with automatic horizon levelling.

For example, when converting .360's shot on the GoPro MAX [using GoPro Studio software you can select "Horizon level" that will automatically adjust the roll of the camera to ensure the horizon remains level](/blog/2021/using-gopro-studio-process-360-files).

## An example of a bad horizon

Here is a video I recorded it with a GoPro MAX with a 45 degree horizontal tilt (roll) to the right (0:02), then almost level (0:05), then a 45 degree tilt to the left (0:08).

<iframe width="560" height="315" src="https://www.youtube.com/embed/lEHA91gu3TQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Here are screenshots to show how this looks for the entire equirectangular frame (not in a 360 viewer), extracted using ffmpeg (`ffmpeg -i GS016143.mp4 -r 1 -q:v 2 img%d.jpg`);

### Roll 45 degrees (right roll) (0:02)

<img class="img-fluid" src="/assets/images/blog/2022-05-20/roll-video-tilt-right-45.jpg" alt="Equirectangular tilt 45 degrees right" title="Equirectangular tilt 45 degrees right" />

### Level 0 degrees (no roll) (0:05)

<img class="img-fluid" src="/assets/images/blog/2022-05-20/roll-video-center.jpg" alt="Equirectangular level" title="Equirectangular level" />

### Roll -45 degrees (left roll) (0:08)

<img class="img-fluid" src="/assets/images/blog/2022-05-20/roll-video-tilt-left-45.jpg" alt="Equirectangular tilt 45 degrees left" title="Equirectangular tilt 45 degrees left" />

## Identifying roll visually

You can easily identify roll (and it's severity) after looking at a few equirectangular images. To really demonstrate it, I've highlighted how the horizon looks at varying roll angles below:

### Roll -90 degrees (left roll)

<img class="img-fluid" src="/assets/images/blog/2022-05-20/roll-minus90.jpg" alt="Equirectangular roll -90 horizon annotated" title="Equirectangular roll -90 horizon annotated" />

### Roll -45 degrees (left roll)

<img class="img-fluid" src="/assets/images/blog/2022-05-20/roll-minus45.jpg" alt="Equirectangular roll -45 horizon annotated" title="Equirectangular roll -45 horizon annotated" />

### Roll -0 level (no roll)

<img class="img-fluid" src="/assets/images/blog/2022-05-20/roll-0.jpg" alt="Equirectangular roll 0 horizon annotated" title="Equirectangular roll 0 horizon annotated" />

_Note, this photo is not truly level. A level horizon on flat ground would cross then center of the image as a flat line._

### Roll 45 degrees (right roll)

<img class="img-fluid" src="/assets/images/blog/2022-05-20/roll-plus45.jpg" alt="Equirectangular roll 45 horizon annotated" title="Equirectangular roll 45 horizon annotated" />

### Roll 90 degrees (right roll)

<img class="img-fluid" src="/assets/images/blog/2022-05-20/roll-plus90.jpg" alt="Equirectangular roll 90 horizon annotated" title="Equirectangular roll 90 horizon annotated" />

## Dealing with roll uniformly

In cases where the roll is fixed throughout the video, for example, where the camera is mounted to a fixed point, but the mount point is not level, can be trivial.

In ffmpeg the `v360` video filter (`-vf`) can be used with various output adjustment options.

For adjusting the horizon `roll` is the most important.

Taking the previous demo video, I can adjust for the right roll (roughly 45 degrees) by offsetting the roll by -45 degrees (`roll=-45`) like so;

```shell
ffmpeg -i GS016143.mp4 -vf v360=e:e:yaw=0:pitch=0:roll=-45 -c:v libx265 GS016143rollminus45.mp4
````

Breaking down the arguments passed to the video filter flag `-vf`:

* `v360` : filter name
  * `e` : abbreviation for "equirectangular" (this is the input format)
  * `e` : abbreviation for "equirectangular" (this is the desired output format)
  * `yaw`: horizontal center of equirectangular output [`0` - `360`]
  * `pitch`: vertical center of equirectangular output [`-90` - `90`]
  * `roll`: horizontal roll of the camera (tilt side-side) [`-180` - `180`]

Note, passing 0 for `yaw`, `pitch` or `roll` essentially means leave it unchanged, so passing `yaw=0` and `pitch=0` has no effect here. I just include them as a demo of passing multiple parameters to the filter.

[Check out the full documentation for the `v360` filter here](https://ffmpeg.org/ffmpeg-filters.html#v360).

This command results in a video like this:

<iframe width="560" height="315" src="https://www.youtube.com/embed/FnutdM47OmQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

See how the right roll (at 0:02) is removed and the video is now level. However, the level position (at 0:05) now rolls to the left by 45 degrees, and the left roll position (at 0:08) now rolls to the left by 180 degrees.

## Dealing with roll dynamically

Generally videos we record suffer from the type of roll in the example above -- as trekkers move left and right the camera rolls in different directions.

Therefore we need a dynamic way to read each frame and set the roll adjustment accordingly.

I'll be looking into that more next week, but here's a clue -- [the GoPro's gyroscope sensor tells us exactly how much the camera is rolling at any given point in time](/blog/2020/360-camera-sensors-imu-accelerometer-gyroscope-magnetometer).