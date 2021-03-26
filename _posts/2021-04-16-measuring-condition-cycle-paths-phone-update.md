---
date: 2021-04-16
title: "Measuring the Condition of Cycle Paths With Only Your Phone (an update)"
description: ""
categories: guides
tags: [rRuf, data bike, DMAMPO]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-04-16/
featured_image: /assets/images/blog/2021-04-16/
layout: post
published: false
---

**Some alternative apps to rRuf.**

[Last month I wrote about measuring ride quality with your phone using an app called rRuf](/blog/2021/measuring-condition-cycle-paths-phone).

We chose rRuf as it had been used to great effect by the [DMAMPO Data Bike team](https://dmampo.org/data-bike/) (thanks to Gunnar and Zhi for all their help).

The problem is, the rRuf app requires a paid subscription to really obtain any value from it. Without a subscription you will not receive the aggregate `PavementType` and `PavementCondition` values. The sampling rate on the free app is also much reduced at 1Hz (1 measurement p/sec) vs. 100Hz (100 measurements p/sec) on the paid app.

Unfortunately, a paid subscription costs many thousands-of-Pounds that we don't have, and our trekkers don't have, or don't want to spend!

So here's a list of tested apps that do a similar thing, minus the very expensive price tag.

## SensorLog

<img class="img-fluid" src="/assets/images/blog/2021-04-16/sensorlog.jpeg" alt="SensorLog iOS app" title="SensorLog iOS app" />

This is a really flexible app and offers lots of advanced features to integrate into other software. 

Sensor data can be sampled with up to 100Hz (depending on the version of your iOS device and fore or background mode).

The raw sensor data (which includes positioning information) can then be exported into csv or JSON files for consumption.

**Available on:**

* [iOS](https://apps.apple.com/gb/app/sensorlog/id388014573)

**Cost:**

* 4.99

https://apps.apple.com/gb/app/sensorlog/id388014573


## A footnote on working with data

Many of the apps provide raw data from the phones [IMU (Inertial Measurement Unit)](/blog/2020/360-camera-sensors-imu-accelerometer-gyroscope-magnetometer).

Paid subscriptions on apps like rRuf provide `PavementCondition` (and other standardised measurements) that are an aggregated measurement if sensor data.

Next week I'll share a post detailing how we turn raw data from the accelerometer into a Trek View Ride Quality Index.