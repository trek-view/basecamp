---
date: 2022-09-30
title: "Injecting Telemetry into Video Files (Part 5): Telemetry Injector"
description: "In this post I will show you a proof of concept that can be used to turn a series of geotagged images into a video with a CAMM or GPMD telemetry track."
categories: developers
tags: [gpmd, camm, telemetry, gpmf, gpx]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-09-23/
featured_image: /assets/images/blog/2022-09-23/
layout: post
published: true
---

Over the last month I've introduced the concepts of how telemetry is stored in mp4 video files in both CAMM and GPMF standards. If you missed any of the posts, start by reading them in order here;

* Part 1: The Challenges
* Part 2: MP4
* Part 3: GPMF
* Part 4: CAMM

The aim of this excercise was to learn how telemetry is housed in videos so we could create videos with embedded telemetry using Trail Maker.

Generally when we build out a new feature like this we build out a proof-of-concept script to test our implementation.

## Overview

The logic in Telemetry Injector has been purposely designed to be fairly simplistic for the proof-of-concept. At a high-level it works as follows:

1. takes a series of geotagged images
2. parses out the telemetry into a gpx file
3. creates a video file from photos
4. creates a camm / gpmd binary file from gpx
5. injects the telemtetry binary and metadata boxes into the video

The logic for part 1 - 3 has already been covered in previous posts, and I won't explain here/

## Installing Telemetry Injector

First, lets start by installing the software

```shell
git clone https://github.com/trek-view/telemetry-injector
cd telemetry-injector
python3 -m venv telemetry-injector_venv
source telemetry-injector_venv/bin/activate
pip3 install -r requirements.txt
```

## Injecting CAMM data

The script is fairly simplistic. It assumes you have a series of geotagged images (either equirectangular or cartesian).

In this example, I will use a directory containing 96 geotagged photos (`NLAB009v204`). If you want to follow along, [you can download them here](https://drive.google.com/drive/folders/1Dvz1vwoO2hdsGCkerjAsExu3DdJ-bA_p?usp=sharing).

```shell
python3 telemetry-injector.py -c -i NLAB009v204/ -o NLAB009v204.mp4
```
