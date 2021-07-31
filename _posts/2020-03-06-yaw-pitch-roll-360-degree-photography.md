---
date: 2020-03-06
title: "Yaw, Pitch, Roll"
description: "Three spatial concepts that are important to understand in 360 photography."
categories: developers
tags: [processing]
author_staff_member: dgreenwood
image: /assets/images/blog/2020-03-06/aircraft-flight-dynamics-meta.jpg
featured_image: /assets/images/blog/2020-03-06/aircraft-flight-dynamics-sm.jpg
layout: post
published: true
---

**Three spatial concepts that are important to understand in 360 photography.**

[Last year in my DIY Google Street View post](/blog/2019/diy-google-street-view-part-4-processing-photos), I introduced the concepts of yaw, pitch, and roll.

After receiving a common theme of questions, I'll dig a bit deeper into these concepts in this post.

We'll treat it as a flying lesson.

## Pitch (up to down)

<img class="img-fluid" src="/assets/images/blog/2020-03-06/aircraft-pitch.jpg" alt="Aircraft pitch diagram" title="Aircraft pitch diagram" />

Imagine sitting on the runway, waiting to take off. The plane speed down the runway, and then the nose rises. Suddenly it feels like your looking up as the plane climbs.

The angle the plane is facing from the horizon is the pitch. On the runway the pitch is 0. You are level with the ground. As the plane takes off, the pitch will be somewhere between 10-15 degrees (though it usually feels steeper!).

## Roll (side to side)

<img class="img-fluid" src="/assets/images/blog/2020-03-06/aircraft-roll.jpg" alt="Aircraft roll diagram" title="Aircraft roll diagram" />

Now we're in the air. Imagine the plane turning. One wing drops as the plane banks into a turn. This is called roll.

The angle of the wings, measured from a level position on the horizon, is the roll. If you're upside down (hopefully not!) the roll is 180 degrees.

## Yaw (left to right)

<img class="img-fluid" src="/assets/images/blog/2020-03-06/aircraft-yaw.jpg" alt="Aircraft yaw diagram" title="Aircraft yaw diagram" />

Yaw is the hardest to "feel" in flight. Have you ever seen a video of a plane landing in high winds?

<iframe width="560" height="315" src="https://www.youtube.com/embed/ZPn3MBNt7Rc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

You have now.

You'll see the fuselage of the plane is not parallel with the runway. It's at an angle (yaw) to the runway.

## 360-Degree photos

Now you know how to fly, you might be questioning why this applies to 360-degree photography because the viewer can decide their own yaw, pitch and roll in the viewer (like a pilot).

And you'd be correct.

However, these concepts do have some value when processing your images because they can help you manipulate the original field of view for your photos.

The original field of view is what the viewer first sees when they view your 360-degree photo in a 360-degree photo viewer (before they start looking around).

<img class="img-fluid" src="/assets/images/blog/2020-03-06/original-field-of-view-example.jpg" alt="360-degree photo original field of view" title="360-degree photo original field of view" />

For example...

* if the camera was leaning to the right, you might adjust the roll.
* if the camera was facing up, you might adjust the pitch.
* if the forward view was not facing the most interesting area of the photo, you might adjust the yaw 

## Horizon-levelling

You might have heard terms like auto-horizon or horizon-levelling.

In 360 photography, generally these terms refer to automatic levelling of an 360 image against a fixed horizon to adjust for roll and pitch deviations.

This data is reported by a gyroscope inside the camera. The gyroscope measures the roll or pitch at the time of capture and writes the data into the image file. By knowing how far the camera was rolling or pitching, software can then adjust for this when creating the final 360 image.

## Heading (azimuth)

For outdoor, Street View 360 photography, the yaw is typically the same as the heading (azimuth) of the camera at capture time. This value is reported using a compass inside the camera, [but can also be estimated if you have more than one photo taken in a series (for example, a walk.)](/blog/2020/what-direction-are-you-facing).