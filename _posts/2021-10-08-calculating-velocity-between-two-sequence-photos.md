---
date: 2021-10-08
title: "Using trigonometry to calculate how north, east, and vertical velocity"
description: "Speed = distance / time. But what about speed along the x (east, west), y (north, south), z (altitude) axes?"
categories: guides
tags: [heading, yaw, bearing, pitch, roll, speed, velocity]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-10-08/velocity-x-y-meta.jpg
featured_image: /assets/images/blog/2021-10-08/velocity-x-y-sm.jpg
layout: post
published: true
---

**Speed = distance / time. But what about speed along the x (east, west), y (north, south), z (altitude) axes?**

Over the last few weeks I've been digging into creating and injecting [CAMM telemetry](/blog/2021/metadata-exif-xmp-360-video-files-camm-camera-motion-metadata-spec) from [videos created from static frames](/blog/2021/turn-360-photos-into-360-video).

[The CAMM spec requires](https://developers.google.com/streetview/publish/camm-spec), in addition to latitude, longitude, and altitude:

* Velocity North (m/s)
* Velocity East
* Velocity Up

For the old school followers of our work, you might remember our old CLI tool, [Sequence Maker](https://github.com/trek-view/sequence-maker).

This generated speed between photos as well as a whole host of other values like photo heading. [This post explains everything](/blog/2020/what-direction-are-you-facing).

Speed in this example was simplistically calculated (speed = distance/time) from point A to point B (the photo co-ordinates) along a 2D plane (no concept of the vertical axis).

However, for the CAMM values, I needed to convert speed into velocity... which is not the same as speed, as my old physics teacher would protest; velocity is speed with a direction.

<img class="img-fluid" src="/assets/images/blog/2021-10-08/velocity-east-north.jpg
" alt="Velocity East North" title="Velocity East North" />

We already know the angles inside the right angle triangle (from working out heading).

Thus, we can use a bit of trigonometry to work out all lengths of the triangle (in addition from distance from A to B, which we already know).

We know Velocity = Displacement / Time in a direction.

So Velocity East = (distance photo A to point C) / Time (between photo A to photo B)

So Velocity North = (distance point C to photo B) / Time (between photo A to photo B)

Note, this calculation can result in a negative output. North and East are positive directions. If you travel West/South, in terms of an East/North vector, you will be traveling in both a negative East/North velocity.

To illustrate the point; If I drive from home to work (defining my positive direction), then my velocity is positive if I go to work, but negative when I go home from work. It is all about direction seen from how I defined my positive axis. 

<img class="img-fluid" src="/assets/images/blog/2021-10-08/velocity-east-north-negative-example.jpg
" alt="Example negative Velocity East North" title="Example negative Velocity East North" />

Look at this example to demonstrate. Whilst the time between A and B is really representative of 10 second / 10 meters, the North and Eastern velocity is actualy negative.

Velocity East = (distance photo A to point C) / Time (between photo A to photo B)

so 

Velocity East = -5 / 10 = -0.5 m/s

and 

Velocity North = (distance point C to photo B) / Time (between photo A to photo B)

Velocity North = -8.66025 / 10 = -0.8 m/s

Now need to to the same for vertical velocity. It's done in exactly the same way, except we now use the z axis (altitude)

So Velocity Up = (elevation change) / Time (between photo A to photo B)

Again, if the elevation change is negative, the resulting Up velocity will be negative (because you're descending).

<img class="img-fluid" src="/assets/images/blog/2021-10-08/velocity-up.jpg
" alt="Velocity Up" title="Velocity Up" />

And that's enough maths for a Friday... or whenever you're reading this!

[All the diagrams used in this post are available here](https://docs.google.com/presentation/d/1otcjbxGghKLqzOcEjfzHsXf22VG8zQVvknpMOKcccDY/edit).