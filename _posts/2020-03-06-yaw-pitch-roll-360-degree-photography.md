---
date: 2020-03-06
title: "Yaw, Pitch, Roll"
description: "Three spatial concepts that are important to understand in 360 photography."
categories: developers
tags: [yaw, pitch, roll, heading, azimuth]
author_staff_member: dgreenwood
image: /assets/images/blog/2020-03-06/aircraft-flight-dynamics-meta.jpg
featured_image: /assets/images/blog/2020-03-06/aircraft-flight-dynamics-sm.jpg
layout: post
published: true
redirect_from:
  - /blog/2020/yaw-pitch-roll-360-degree-photography
---

**Three spatial concepts that are important to understand in 360 photography.**

[Last year in my DIY Google Street View post](/blog/diy-google-street-view-part-4-processing-photos), I introduced the concepts of yaw, pitch, and roll.

After receiving a common theme of questions, I'll dig a bit deeper into these concepts in this post.

We'll treat it as a flying lesson.

## Pitch (`x` axis on GoPro's) (up to down)

<img class="img-fluid" src="/assets/images/blog/2020-03-06/aircraft-pitch.jpg" alt="Aircraft pitch diagram" title="Aircraft pitch diagram" />

Imagine sitting on the runway, waiting to take off. The plane speed down the runway, and then the nose rises. Suddenly it feels like your looking up as the plane climbs.

The angle the plane is facing from the horizon is the pitch. On the runway the pitch is 0. You are level with the ground. As the plane takes off, the pitch will be somewhere between 10-15 degrees (though it usually feels steeper!).

Here's a visual example of pitch changing:

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/xCjSPYIKN68" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Roll (`y` axis on GoPro's) (side to side)

<img class="img-fluid" src="/assets/images/blog/2020-03-06/aircraft-roll.jpg" alt="Aircraft roll diagram" title="Aircraft roll diagram" />

Now we're in the air. Imagine the plane turning. One wing drops as the plane banks into a turn. This is called roll.

The angle of the wings, measured from a level position on the horizon, is the roll. If you're upside down (hopefully not!) the roll is 180 degrees.

Here's a visual example of roll changing (roll along the y axis):

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/GDtz_K6k-Dg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Yaw (always `z` axis) (left to right)

<img class="img-fluid" src="/assets/images/blog/2020-03-06/aircraft-yaw.jpg" alt="Aircraft yaw diagram" title="Aircraft yaw diagram" />

Yaw is the hardest to "feel" in flight. Have you ever seen a video of a plane landing in high winds?

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/ZPn3MBNt7Rc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

You'll see the fuselage of the plane is not parallel with the runway. It's at an angle (yaw) to the runway.

Commonly yaw and heading are used interchangeable, however, they are not the same thing. Heading is absolute measurement from magnetic north, whereas yaw is relative (to whatever point you want to measure from).

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/kBlqZx21_6g" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

For example, in the video above you can measure yaw from the start of the video at 0, adding to the yaw angle as I turn until a full circle (360 degrees is completed). Whereas I am actually roughly facing South East (towards the mountains).

## 360-Degree photos

Now you know how to fly, you might be questioning why this applies to 360-degree photography because the viewer can decide their own yaw, pitch and roll in the viewer (like a pilot).

And you'd be correct.

However, these concepts do have some value when processing your images because they can help you manipulate them to improve the viewers experience.

The original field of view is what the viewer first sees when they view your 360-degree photo in a 360-degree photo viewer (before they start looking around).

<img class="img-fluid" src="/assets/images/blog/2020-03-06/original-field-of-view-example.jpg" alt="360-degree photo original field of view" title="360-degree photo original field of view" />

By adjusting yaw, pitch, and roll;

* if the camera was leaning to the right, you might adjust the roll to make the horizon level (you'll often see a horizon leveling feature in stitching software)
* if the camera was facing up, you might adjust the pitch so that the horizon was across the center of the image
* if the forward view was not facing the most interesting area of the photo, you might adjust the yaw to position another part of the photo in the center