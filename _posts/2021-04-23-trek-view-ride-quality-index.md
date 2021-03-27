---
date: 2021-04-24
title: "Trek View Trail Quality Index"
description: ""
categories: guides
tags: [rRuf, data bike, DMAMPO]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-04-24/
featured_image: /assets/images/blog/2021-04-24/
layout: post
published: false
---

**Simple calculations**

[In the previous post I considered some apps that can be used to record raw data from your phones IMU](/blog/2021/measuring-condition-cycle-paths-phone-update).

<img class="img-fluid" src="/assets/images/blog/2021-04-24/ResearchBikeInfographic-sm.jpeg" alt="Minnesota Research Bike" title="Minnesota Research Bike" />

[The Parks & Trails Council of Minnesota operate a Research Bike that documents the state of their bike trails](https://www.parksandtrails.org/mn-state-trails/). In addition to their intractive maps, [you can view their previous State of the Trails reports here](https://www.parksandtrails.org/advocacy/research/ptc/state-of-the-trails-report/).

These reports contain a Trail Roughness Index (TRI), an aggregated score created by the Parks & Trails Council of Minnesota:

> Trail Roughness Index is measured by riding a trail with a device called an accelerometer mounted on the bike’s handle bars. When the bicyclist hits a crack or bump in the trail, the accelerometer measures the force of the jolt felt by the bicyclist. The TRI is a statistical summary of the accelerometer data that indicates the roughness of the ride. Low TRI scores indicate trails in excellent condition (TRI < 30) and high TRI scores indicate trails in very poor condition (TRI > 75).

This posts aims will outline a Trail Quality Index you can use yourself using your phone and an app to measure data from its accelerometer. 

## Orientation

[I strongly recommend reading about Acceleromers in this post if you're new to their functionality](/blog/2020/360-camera-sensors-imu-accelerometer-gyroscope-magnetometer/).

<img class="img-fluid" src="/assets/images/blog/2021-04-24/accelerometer-axes.png" alt="Accelerometer Phone Orientation" title="Accelerometer Phone Orientation" />

We know that accelerometer measeures change in velocity across 3 planes; x, y, and z. The diagram shows how these planes are orientated in relation to your phone or tablet. This orientation is uniform across devices, so apps can read the data in an expected standard.

The orientation of the phone has an impact on the way we measure trail quality. The main data point we're looking to identify is the veritcal (up and down) motion caused by uneven surface trail.

If we were to lay the phone on its side, we would be measuring change in velocity along the x axis to measure change in vertical acceleration whilst bumping up and down.

If the phone was standing up-right this measurement would be taken from the y axis, and lastly, if the phone was on its back, we would be measuring the z axis.

A more complex calculation would consider change accross all axis against the orientation of the phone (captured by the gyroscope). However, because our capture conditions are somewhat controlled on fairly level trails, I'm keeping it simple for now.

What this does require is for us to mount the phone in secure and snug mount as flat as possible to the ground as I'll be measuring change in velocity along the z axis.

## Interpreting the data

To capture data I used [the Physics Toolbox Sensor Suite Pro app on my phone](/blog/2021/measuring-condition-cycle-paths-phone-update), but any raw acceloremeter data, regardless of the app used to capture it, should work.

I setup the app to record data at 10Hz (ten measurements every second), which is a nice trade-off between measurement interval and battery life (as more measurements result in shorter battery life due to the extra powered required).

The linear accelerometer measures acceleration in a straight line in three different dimensions. Linear acceleration changes whenever the mobile device speeds up, slows down, or changes direction. When the mobile device is at rest with respect to the surface of the earth, it reads acceleration values of 0, 0, 0.

The linear accelerometer measures acceleration as m/s^2 along the three planes:

1. `ax`
2. `ay`
3. `az`

[Here's a sample I recorded riding around my neg](https://docs.google.com/spreadsheets/d/1kcVHjkM5s-gFTnoz6k-BmhGYMtucfQSvzbmXQIT9ZKo/edit#gid=401179418).

You can see where the phone is laid down flat on the first few rows measuring 0 across all axes, then is picked up causing changes in acceleration, to being violently shaken alone the z axis at 20:36:49:127.





## Capturing the data

Controlling for speed is important to ensure TRI scores are comparable across data samples. Imagine travelling fast on a bike, you tend to cruise over the smaller bumps in the road similar


## Baselining the data

When I was most violently shaking the phone (20:36:52:928), az=-42.9025 m/s^2.

However, to put this into the context of a bicycle ride I needed to baseline what was 

Both the Parks & Trails Council of Minnesota and DMAMPO data bikes have and index that ranges from 0-100. 



Trail condition ratings are based on TRI scores. TRI is
equal to the standard deviation of the g-force felt along
the vertical (Z) axis of the Research Bike while riding a
given trail segment (excluding road intersections and
wood-decked bridges), multiplied by 100 for scale, and
adjusted for speed. T

Linear acceleration is measuresd

Let's start 

The TRI created by the Parks & Trails Council of Minnesota measures the variation in g-forces felt by a bicyclist (and accelerometer) riding on a trail on the vertical (Z) axis.
I use 10Hz (ten measurements every second), which is a nice trade-off between measurement interval and battery life (as more measurements results in shorted battery life due to the extra powered required).


To create these reports they use [the SensorLog app](/blog/2021/measuring-condition-cycle-paths-phone-update).

us Minnosota


What our the TRI does not measure
Our ratings only answer a simple question: How smooth are Minnesota’s
State Trails to ride? While we use this question as a proxy for the overall
condition of each trail, there are several components of a safe, wellmaintained trail system that our ratings don’t capture. Our ratings do
not consider the integrity of trail bridges, culverts or the underlying
trail foundation. Our ratings do not consider the condition of
parking areas, interpretive displays or signage. And our ratings
only consider day-to-day upkeep to the extent it impacts the
smoothness of the ride (e.g., debris on an unswept trail is
rougher to ride than a freshly swept trail).



2 STATE of the TRAILS
recorded by an iPhone app.
