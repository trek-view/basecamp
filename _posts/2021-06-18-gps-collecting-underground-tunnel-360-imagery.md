---
date: 2021-06-18
title: "Solutions for tracking your position when underground or under-canopy"
description: "How to keep track of your position when your line-of-sight to the sky is impeded."
categories: guides
tags: [GPS, ArduSimple, GoPro, LabPano]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-06-18/jim-david-bath-to-bristol-tunnel-sm.png
featured_image: /assets/images/blog/2021-06-18/jim-david-bath-to-bristol-tunnel-sm.png
layout: post
published: true
---

**How to keep track of your position when your line-of-sight to the sky is impeded.**

I've talked many times about the minor problems of GPS receivers built into cameras.

Overall they're very good. Especially when you consider almost all 360 cameras were not designed with mapping in mind.

However, in situations where your under a tree canopy, or even worse, a tunnel, it is very likely you'll see a few erroneous positioning measurements.

This is not an issue with GPS receiver per se. [It is because GPS receivers need a clear line of site to a minimum of 4 GPS satellites](/blog/gps-101).

For our work, accurate positioning is important, but in most cases we can allow for some anomalous points, either discarding the image entirely or guessing what path it was taken on using existing OSM map data.

However, recently I've bumped into a number of occasions where this was not so easy.

Take for example the Bath to Bristol Railway Path. It's an immensely popular traffic-free route providing a mainly tranquil walking and cycling path between the two cities.

Shortly after leaving Bristol (or about to arrive in Bristol, depending on direction) you'll find the 0.5 km long Staple Hill Tunnel. It's part of the [Sustrans National Cycle Network](https://www.sustrans.org.uk/national-cycle-network) -- [Route 4](https://www.sustrans.org.uk/find-a-route-on-the-national-cycle-network/route-4).

The tunnel was originally built for trains carrying coal. With the requirements for inner city coal a thing of the past, and the trainline now removed, it now makes for an brilliant cycle path (even if you do get a bit wet from groundwater dripping from the roof in place).

Though 0.5 km, and fairly deep underground it introduces problems of GPS tracking.

I rode the route a few weeks ago. I did not manage to get one accurate GPS position from my GoPro MAX in the tunnel.

Thanks to some careful planning and forethought to equipment, Jim was able to capture a GPS track through the entire tunnel, as shown below!

<iframe width="600" height="400" allowfullscreen style="border-style:none;" src="https://www.trekview.org/trekviewer.htm#panorama=https://www.trekview.org/assets/images/blog/2021-06-18/staple-hill-tunnel-jim-gayes.jpeg&amp;autoLoad=true"></iframe>

Wow.

Here you can clearly see the difference between my ride (blue) and Jim's ride (green)

<img class="img-fluid" src="/assets/images/blog/2021-06-18/jim-david-bath-to-bristol-tunnel.png" alt="Bath to Bristol Railway Path - Staple Hill Tunnel" title="Bath to Bristol Railway Path - Staple Hill Tunnel" />

But how did he do it? 

Jim’s solution was to pair up his Labpano Pilot One 360° camera with the [ArduSimple simpleRTK2B-F9R module](https://www.ardusimple.com/product/simplertk2b-f9r-v3/) (_yes, it's not cheap_).

<img class="img-fluid" src="/assets/images/blog/2021-06-18/jim-gayes-bike.jpg" alt="Jim Gayes ArduSimple simpleRTK2B-F9R" title="Jim Gayes ArduSimple simpleRTK2B-F9R" />

The ArduSimple simpleRTK2B-F9R's [IMU](/blog/360-camera-sensors-imu-accelerometer-gyroscope-magnetometer) combined with it's Inertial Sensor Fusion calculates a reasonably accurate location when all satellite signals are lost.

To be clear, this is not GPS resolving the position.

Inertial sensor fusion algorithms are used to estimate orientation and position over time. 

Using the IMU measurements (such as acceleration, roll, pitch.), the algorithms try to assume where you've been to find your current position.

The algorithms can get complex, but at they're most simplistic they are easy to understand. If you move 10 m/s due North with no elevation or pitch, you will be 10 metres north of your original position (ignoring curvature of the earth) -- the algorithms take the sensor measurements to perform this same calculation logic.

It seems the simpleRTK2B-F9R has been quite a popular choice amongst those mapping street-level images of roads from their cars (where tunnels are often an issue).

In fact, Jim notes some issues leading to inaccuracy with the ArduSimple simpleRTK2B-F9R being mounted to a bike due to ride vibrations, not seen so much on a car or other transportation types with full suspension. I am told that ArduSimple are planning a firmware update to account for vibration issues like this soon.

Whilst consumer 360 camera's have IMU's they don't have the inertial sensor fusion elements (mainly due to added cost and size), or if they do, they are nowhere near advanced (manufacturers tend to focus on image quality and these algorithms require a lot of processing power for which image processing takes precedence).

As such, I can't see this technology being implemented in consumer cameras anytime soon, but as prices for this technology start to come down and/or dedicated mapping cameras enter the market we might start seeing improved telemetry capture from 360 cameras.

Whilst we've got no plans for such advanced positioning technology on our [Trek Packs](/trek-pack), if you're planning to do a professional job, you should seriously consider this technology.