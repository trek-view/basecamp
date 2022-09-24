---
date: 2022-08-19
title: ""
description: "Community Questions: Episode 1"
categories: developers
tags: []
author_staff_member: dgreenwood
image: /assets/images/blog/2022-08-19/
featured_image: /assets/images/blog/2022-08-19/
layout: post
published: false
---






ffmpeg -i GS018422.mp4 -vcodec copy -an GS018422-1.mp4


This is a two part process.

Firstly, use ffprobe to check what video stream the audio is stored. Note, this is not always the same in all GoPro `.360` videos -- different modes write the audio into different streams.



In this case its steam `0:1`, where the `handler_name` is `GoPro AAC`.

