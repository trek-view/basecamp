---
date: 2021-04-16
title: "Measuring the Condition of Cycle Paths With Only Your Phone (an update)"
description: "Two consumer apps that can measure sensor data on your phone to record trail quality."
categories: guides
tags: [rRuf, data bike, DMAMPO]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-04-16/physics-toolbox-sensor-suite-pro-meta.jpeg
featured_image: /assets/images/blog/2021-04-16/physics-toolbox-sensor-suite-pro-sm.jpeg
layout: post
published: false
---

**Two alternative apps to rRuf.**

[Last month I wrote about measuring trail quality with your phone using an app called rRuf](/blog/2021/measuring-condition-cycle-paths-phone).

We chose rRuf as it had been used to great effect by the [DMAMPO Data Bike team](https://dmampo.org/data-bike/) (thanks to Gunnar and Zhi for all their help).

The problem is, the rRuf app requires a paid subscription to really obtain any value from it. Without a subscription you will not receive the aggregate `PavementType` and `PavementCondition` values. The sampling rate on the free app is also much reduced at 1Hz (1 measurement p/sec) vs. 100Hz (100 measurements p/sec) on the paid app.

Unfortunately, a paid subscription costs many thousands-of-Pounds that we don't have, and our trekkers don't have, or don't want to spend!

So here are two cheap but reliable options that do a similar thing, one for iOS users, the other for Android.

## SensorLog

<img class="img-fluid" src="/assets/images/blog/2021-04-16/sensorlog.jpeg" alt="SensorLog iOS app" title="SensorLog iOS app" />

This is a really flexible app and offers lots of advanced features to integrate raw data from the sensors onto your iPhone, iPad or Apple Watch into other software. 

Sensor data can be sampled with up to 100Hz (depending on the version of your iOS device and fore or background mode). Note, not all sensors on the device can sample at such a high rate. For example, almost all mobile devices including all Apple devices receive GPS at the rate of 1Hz.

The raw sensor data can then be exported into csv or JSON files for analysis in other products. Critically the raw sensor data contains `acceleration.x`, `acceleration.y`, `acceleration.z` reported by the accelerometer.

[This app is employed on an existing data bike operated by the Parks & Trails Council of Minnesota to create a Trail Roughness Index](https://www.parksandtrails.org/2018/07/31/researchbike-adventure-underway/).

**Available on:**

* [iOS](https://apps.apple.com/gb/app/sensorlog/id388014573)

**Cost:**

* £4.99

## Physics Toolbox Sensor Suite Pro

<img class="img-fluid" src="/assets/images/blog/2021-04-16/Physics-Toolbox-Accelerometer-app.png" alt="Physics Toolbox Accelerometer app" title="Physics Toolbox Accelerometer app" />

Another very powerful app with the ability to capture raw data from all the sensors on your Android phone or tablet and display it in many beautiful visualisations.

This app can sample at a very high resolution, up to 409Hz on my phone (which is overkill for what I want to measure). You can set the frequency manually between 1Hz - 409Hz (or whatever your device can support). Somewhere between 1Hz and 10Hz suits most requirements. As with iOS devices, not all sensors on the phone can sample at the maximum resolution (noteably, GPS for our requirements).

The raw sensor data can then be exported into a csv file for analysis in other products. [Here's a sample (in multi-record mode with g-Force, linear accelerometer and GPS enabled)](https://docs.google.com/spreadsheets/d/1IkbSO9RulsnjQ96o9nOZjmstZ1gmCnF9bo5q22K5ASQ/edit#gid=1315472714).

**Available on:**

* [Android](https://play.google.com/store/apps/details?id=net.vieyrasoftware.physicstoolboxsuitepro&hl=en_GB&gl=US)

**Cost:**

£2.79

## A footnote on working with data

Both of these apps provide raw data from the phones [IMU (Inertial Measurement Unit)](/blog/2020/360-camera-sensors-imu-accelerometer-gyroscope-magnetometer).

Paid subscriptions on apps like rRuf provide `PavementCondition` or similar values that are an aggregated measurement of sensor data.

Next week I'll share a post detailing how we turn raw accelerometer data into a Trek View Trail Quality Index to provide a similar measure to rRuf's `PavementCondition` score.