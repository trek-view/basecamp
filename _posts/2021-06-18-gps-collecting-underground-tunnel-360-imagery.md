---
date: 2021-06-11
title: "Solutions for GPS when underground or under-canopy"
description: "How to keep track of your position when line-of-sight to the sky is impeded."
categories: guides
tags: []
author_staff_member: dgreenwood
image: /assets/images/blog/2021-06-11/
featured_image: /assets/images/blog/2021-06-11/
layout: post
published: true
---

**N

I've talked many times about the minor problems of GPS recievers built into cameras.

Overall they're very good. Especially when you consider almost all 360 cameras were not designed with mapping in mind.

However, in situations where your under a tree canopy, or even worse, a tunnel, it is very likely you'll see a few erronous positioning measurements. [This is because GPS recievers need a clear line of site to a minimum of 4 GPS satellites](/blog/2020/gps-101).

For our work, accurate positioning is important, but in most cases we can allow for some anomolous points, either discarding the image entierly or guessing what path it was taken on using existing OSM map data.

However, recently I've bumped into a number of occassions where this was not so easy.

Take for example the Bath to Bristol Railway Path. It's an immensely popular traffic-free route providing a mainly tranquil walking and cycling path between the two cities.

Shortly after leaving Bristol (or about to arrive in Bristol, depending on direction) you'll find the 0.5 km long Staple Hill Tunnel.


About 

This ride was inspired by Map the Paths user Jim Gayes who has been working with [Sustrans](https://www.sustrans.org.uk/national-cycle-network), the charity responsible for the UK’s national cycle network.

Not only did he covered this route, he also covered another famous nearby route, also on disused railway tracks, [the Bath Two Tunnels Circuit](https://www.sustrans.org.uk/find-a-route-on-the-national-cycle-network/bath-two-tunnels-circuit).

The Combe Down Tunnel, the longest of the two tunnels at an impressive 1,672 metres, is the UK's longest cycling and walking tunnel.

Over 3 times longer than Staple Hill Tunnel.

Thanks to some careful planning and forethought to equipment, Jim was able to capture a GPS track through the entire tunnel! Wow.

So how did he do it? 

tl;dr, with the help of an external [IMU](/blog/2020/360-camera-sensors-imu-accelerometer-gyroscope-magnetometer).


Jim’s solution was to pair up his Labpano Pilot One 360° camera with the [ArduSimple simpleRTK2B-F9R module](https://www.ardusimple.com/product/simplertk2b-f9r-v3/) (yes, it's not cheap).

The ArduSimple simpleRTK2B-F9R's IMU combined with it's Inertial Sensor Fusion calculates a reasonably accurate location when all statilliet signals are lost.

The module is well protected from the British weather in Jim's custom built enclosure, also housing a battery as a power source.

It seems this simpleRTK2B-F9R has been quite a popular choice amongst those mapping street-level images of roads

Hopefully over time we;







Travelling through the Combe Down Tunnel for the first time is an incredible experience, heightened by the extraordinary audio-visual installation, ‘Passage’ by United Visual Artists. A Portrait Bench sits at the entrance of the Devonshire Tunnel.

He recently rode the Ba


Along the route you'


 we believe the value

Jim’s solution was to pair up his Labpano Pilot One 360 camera with the ArduSimple simpleRTK2B-F9R module. The IMU and Fusion processing resolves this challenge as it can have a reasonably accurate location calculated by the IMU when all GNSS signals are lost.