---
date: 2023-08-25
title: "Open-Sourcing gopro2gsv"
description: "Our internal tool that processes images and videos shot on GoPro 360 cameras and uploads them to Google Street View is now available for everyone to use and modify."
categories: developers
tags: [Google, Street View]
author_staff_member: dgreenwood
image: /assets/images/blog/2023-08-25/
featured_image: /assets/images/blog/2023-08-25/
layout: post
published: false
redirect_from:
  - 
---

**Our internal tool that processes images and videos shot on GoPro 360 cameras and uploads them to Google Street View is now available for everyone to use and modify.**

Trek View started as a project with a simple aim; shoot 360 footage and upload it to Google Street View.

Not much has really changed over the last 4 years.

From Trek View's inception, I've attempted to build various tools around Street View, including my ongoing attempt at creating an "off-road Street View".

In that time the type of images available on Street View and the way they are uploaded has also changed.

In 2020, Street View only accepted photo uploads (which was somewhat problematic). Street View allowed 


Then the brialliant Stafford Marquidt showed me the then in beta

Now those API methods are generally available to anyone. As such I've now decided to release (and open-source) gopro2gsv built on said video upload methods.

gopro2gsv takes 360 timelapse photos and videos shot on GoPro cameras (currently the Fusion and MAX) and uploads them to Google Street View. You can also use gopro2gsv to optionally add your own nadir to the uploaded content.

## Videos shot on GoPro

Currently gopro2gsv works with 




## An insight into our workflow

Often we will shoot multiple timelapses with thousands of photos, or hour of video footage (often chaptered by the camera into many videos).

To aid us automate this process we 
