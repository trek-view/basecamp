---
date: 2022-04-01
title: "Lat,lon or Lon,lat?"
description: "The biggest pain of working with geospatial software; determining the way they present latitude and longitude... or is that longitude and latitude?"
categories: guides
tags: []
author_staff_member: dgreenwood
image: /assets/images/blog/2022-04-01/
featured_image: /assets/images/blog/2022-04-01/
layout: post
published: false
---

**The biggest pain of working with geospatial software; determining the way they present latitude and longitude... or is that longitude and latitude?**

Geospatial software has a fundamental inconsistency: the order in which longitude and latitude is displayed.

For example, Google search expect [decimal co-ordinates](/blog/2021/reading-decimal-gps-coordinates-like-a-computer) provided as `lat,lon`.

Mount Everest:

```
[27.986065,86.922623](https://www.google.com/search?q=86.922623%2C27.986065)
```

is not the same as 


86.922623,27.986065




reading-decimal-gps-coordinates-like-a-computer




Below, a table of each format and technology's decision, and below that, some explanations.


lon lat lon lat