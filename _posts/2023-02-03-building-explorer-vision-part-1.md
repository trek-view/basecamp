---
date: 2023-02-03
title: "Building Explorer (Part 1): The Vision"
description: ""
categories: guides
tags: []
author_staff_member: dgreenwood
image: /assets/images/blog/2023-01-20/trek-view-Street-View-Studio.png
featured_image: /assets/images/blog/2023-01-20/trek-view-Street-View-Studio.png
layout: post
published: false
---

If you've followed this blog for any period of time, you will have heard mentions to _Tourer_, _Map the Paths_, and _Explorer_.

Since I started the Trek View project I've started, slowed down and given up twice on building such a tool.

As the old adage goes, third time lucky. Here I go again, with one key difference...

This time is that I'll be doing it in an open manner. The posts on this blog will detail my progress on what I'm still calling Explorer.

This will include the logic, the architecture, the design decisions, the infrastructure, and everything in between.



 

As we've grown, many of you have asked for features not available on Google Street View (it is primarily designed for mapping roads after all!).

Many of the feature requests we've received revolved around:

* Support for grouping of 360-degree photos (tours, groups of photos with some relationship, etc.)
* Making photos searchable by attributes (e.g. features in photos, terrains, etc.)
* Provide sharing tools for uploaded photos (e.g. user profiles, embeddable images, etc.)
* Allow photos to be annotated with information (e.g. educational, location specific info, etc.)
