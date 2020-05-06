---
date: 2020-05-15
title: "Extracting data "
description: ""
categories: developers
tags: [GPS, XMP, EXIF]
author_staff_member: dgreenwood
image: /assets/images/blog/2020-05-01/apolloone-example-meta.jpg
featured_image: /assets/images/blog/2020-05-01/apolloone-example-sm.png
layout: post
published: false
---


One of the reasons the first Trek Pack shot photos over video was because for most, working with individual photos is much easier than video files -- there is less technical skill and computer processing required.

Video files are essentially lots of photos played back at a set speed with sound added.

As we discovered last week, metadata in video and photo files is handled differently.

In that post, I mentioned how some software took out frames (or photos) from videos, for example, to extract individual frames 1 meter apart for mapping.

This week I'm going to show you how that can be achieved, whilst preserving metadata.




ffmpeg -i VIDEO_7152.mp4 -filter:v fps=fps=1/60 ffmpeg_%0d.bmp


time for i in {0..39} ; do ffmpeg -accurate_seek -ss `echo $i*60.0 | bc` -i input.mp4   -frames:v 1 period_down_$i.bmp ; done
