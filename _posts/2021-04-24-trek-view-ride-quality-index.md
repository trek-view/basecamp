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

> Trail Roughness Index is measured by riding a trail with a device called an accelerometer mounted on the bike’s handle bars. When the bicyclist hits a crack or bump in the trail, the accelerometer measures the force of the jolt felt by the bicyclist. The TRI is a statistical summary of the accelerometer data that indicates the roughness of the ride. Low TRI scores indicate trails in excellent condition (TRI < 30) and high TRI scores indicate trails in very poor condition (TRI > 75) 

<img class="img-fluid" src="/assets/images/blog/2021-04-24/cartesian_coordinate_axes_3d.png" alt="Six degrees of freedom" title="Six degrees of freedom" />

[I strongly recommend reading about Acceleromers in this post if you're new to their functionality](/blog/2020/360-camera-sensors-imu-accelerometer-gyroscope-magnetometer/).

The TRI created by the Parks & Trails Council of Minnesota measures the variation in g-forces felt by a bicyclist (and accelerometer) riding on a trail on the vertical (Z) axis.
I use 10Hz (ten measurements every second), which is a nice trade-off between measurement interval and battery life (as more measurements results in shorted battery life due to the extra powered required).


To create these reports they use [the SensorLog app](/blog/2021/measuring-condition-cycle-paths-phone-update).

us Minnosota







2 STATE of the TRAILS
recorded by an iPhone app.
