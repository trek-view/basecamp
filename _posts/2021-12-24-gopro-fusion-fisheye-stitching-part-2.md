---
date: 2021-12-24
title: "Stitching GoPro Fusion Images Without GoPro Fusion Studio (Part 2)"
description: ""
categories: developers
tags: []
author_staff_member: dgreenwood
image: /assets/images/blog/2021-12-17/
featured_image: /assets/images/blog/2021-12-17/
layout: post
published: false
---





Through the help of Photoshop guides (I'm sure someone can suggest a more effecient way to do it), I get the center of the front image being 1546 on the x axis (width) an 1480 pixels on the y height.

THe right image is different again. Remember earlier;

> The lenses are offset on each side to ensure that, together, all 360 degrees are captured in any given scene. 

The assumption might be that GoPro simply have a mirror image on the reverse side, though it's not quite simple. 

On the back image I get the center of the left image being 1544 on the x axis (width) an 1487 pixels on the y height.

I suspect these values will also change ever-so-slightly between different GoPro Fusion cameras too.

In both images the radius of the circle is 1520.