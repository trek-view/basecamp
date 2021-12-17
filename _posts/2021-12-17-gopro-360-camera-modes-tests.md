---
date: 2021-12-17
title: "Building a library of GoPro 360 camera test cases"
description: "A detailed list of all available GoPro MAX and Fusion modes."
categories: guides
tags: [GoPro, MAX, Fusion, gpmf, gpmd]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-12-17/gopro-max-modes.jpg
featured_image: /assets/images/blog/2021-12-17/gopro-max-modes-sm.jpg
layout: post
published: true
---

**A detailed list of all available GoPro MAX and Fusion modes.**

As we approach the Explorer release in early 2022, we're now well underway with testing the software.

One of the most important parts of any software release is testing, making sure the app works as expected.

For Explorer, a large part of testing requires us to ensure all GoPro camera modes are supported.

In order to do this, we've created some detailed test cases with sample content from each mode available on the cameras.

You can find the modes listed below, with links to our 

## GoPro MAX

<img class="img-fluid" src="/assets/images/blog/2021-12-17/gopro-max-modes.jpg" alt="GoPro MAX modes" title="GoPro MAX modes" />

### Video mode

* 360 video 5.2k
	* 30 FPS, 24 FPS
* 360 video 3k
	* 60 FPS
* HERO vieo 1440
	* 60 FPS, 30 FPS 24 FPS
		* wide, narrow, linear, max superview
* HERO vieo 1080
	* 60 FPS, 30 FPS 24 FPS
		* wide, narrow, linear, max superview

### Photo mode

* 360 video
* HERO photo
	* Max Superview, Wide
* HERO powerpano
	* 0 seconds, 3 seconds, 10 seconds

### Timelapse mode

* 360 timelapse photo
	* 2 seconds, 5 seconds, 10 seconds, 30 seconds, 60 seconds
* 360 timelapse video
	* 0.5 second, 1 second, 2 seconds, 5 seconds, 10 seconds, 30 seconds, 60 seconds
* 360 timewarp photo 5.6k
	* 2x speed, 5x speed, 10x speed, 15x speed, 30x speed

## GoPro Fusion

<img class="img-fluid" src="/assets/images/blog/2021-12-17/gopro-fusion-modes.jpg" alt="GoPro Fusion modes" title="GoPro Fusion modes" />

### Video mode

* 360 video 5.2k
	* 25 FPS
* 360 video 3k
	* 50 FPS

### Photo mode

* 360 Photo
* 360 Burst
	* 30/1, 30/2, 30/3, 30/6, 10/1, 10/2, 10/3, 5/1, 3/1
* 360 Night

### Timelapse mode

* 360 NT L Photo
* 360 Timelapse photo
	* 0.5 second, 1 second, 2 seconds, 5 seconds, 10 seconds, 30 seconds, 60 seconds	* 
* 360 Timelapse video 3k
	* 25 FPS
		* 0.5 second, 1 second, 2 seconds, 5 seconds, 10 seconds, 30 seconds, 60 seconds
* 360 Timelapse video 5.2k
	* 25 FPS
		* 0.5 second, 1 second, 2 seconds, 5 seconds, 10 seconds, 30 seconds, 60 seconds

## Grab the samples

All our test cases for the above are released under CC BY 4.0 license.

[You can find the download links to all our samples (and the camera user guides) in our GoPro metadata repository on Github](https://github.com/trek-view/gopro-metadata).