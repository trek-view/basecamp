---
date: 2022-07-01
title: "Automatic horizon leveling of GoPro 360 photos (with no GPMD) (Part 1)"
description: "Understanding the geometry of an equirectangular image and training a computer to detect the horizon."
categories: developers
tags: [ffmpeg, yaw, pitch, roll, equirectangular, photo]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-06-24/GS018421_000003-meta.jpg
featured_image: /assets/images/blog/2022-06-24/GS018421_000003-sm.jpg
layout: post
published: false
---

**Understanding the geometry of an equirectangular image and training a computer to detect the horizon.**

About a year ago, [I briefly touched on how various projection types for 360 photos](/blog/2021/projection-type-360-photography/).

In todays post I am going to go deeper into the geometry of equirectangular projections as a way to idenfify roll mathmatically (and with the help of a computer).

## The equirectagular planes

<img class="img-fluid" src="/assets/images/blog/2022-07-01/equirectangular-projection-graph.png" alt="Equirectangular graph" title="Equirectangular graph" />

At the most simplistic level, when you look at an equirectangular image (as a flat image), the `x` axis is the longitude (left and right from -180 to 180) and the `z` axis is the latitude (vertically up and down from -90 to 90).

Note: Before we continue, it is important to remember that pitch is rotation around the `x` axis and yaw is rotation around the `z` axis. The `x` and `z` co-ordinates above do not give us either of those values. We are simply seeing 

However, assuming the measurements relative to the photo (that yaw is 0 degrees and pitch is 0 degrees) we can estimate roll.

In the graph above you can see the waves representing roll (rotation around `y`). This is exactly the same as what I was showing last week.

The equation for roll (rotation around `y`) (assuming yaw is 0 degrees and pitch is 0 degrees)

`y = arctan(tan(ROLL)sin(x))`

<img class="img-fluid" src="/assets/images/blog/2022-07-01/desmos-equirectangular-roll-demo.png" alt="Equirectangular Desmos demo" title="Equirectangular Desmos demo" />

[Have a play for yourself adjusting the roll value and watching how the modelled horizon changes](https://www.desmos.com/calculator/gpdhdi8dsn).

Ofcourse, the visible horizon is not always going to be `z=0`, this requires further calculation to adjust, however, hopefully the general concept is clear.


## Using a computer to draw the horizon

The next step in the process is to get a computer to idenfify 

1. the horizon in the image, and
2. identify the orientation of the camera (right way up or upside down) 

The orientation of the camera is important. You'll notice that each roll horizon has an identical point

For example, when roll = 70 degrees;

<img class="img-fluid" src="/assets/images/blog/2022-07-01/roll-plus-70.png" alt="Equirectangular Roll 70 degrees" title="Equirectangular Roll 70 degrees" />

And roll = -110

<img class="img-fluid" src="/assets/images/blog/2022-07-01/roll-minus-110.png" alt="Equirectangular Roll -110 degrees" title="Equirectangular Roll -110 degrees" />


And 

the sky is to determine if the camera is upside down. That's important because you'll notice the graph has two identical, therefore the computer needs to know the camera orientation to decifer the correct roll


e.g. 110 70



