---
date: 2022-09-16
title: "Injecting Telemetry into Video Files (Part 3): CAMM"
description: "In this post I will the structure of Google's CAMM standard, how to create a CAMM binary, and how to inject it into a mp4 video file."
categories: developers
tags: [gpmd, camm, telemetry, gpmf, gpx]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-09-16/
featured_image: /assets/images/blog/2022-09-16/
layout: post
published: false
---

**In this post I will the structure of Google's CAMM standard, how to create a CAMM binary, and how to inject it into a mp4 video file.**

To first understand CAMM we first need to understand what makes an mp4 file.

Without revealing the CAMM structure (before the full post) the box structure is very similar. CAMM data is nested under `moov` -> `meta`;

> The video file should contain the following sample entry box to indicate the custom metadata track, and the subComponentType of the track should be set to meta.

<img class="img-fluid" src="/assets/images/blog/2022-09-09/Camera-Motion-Metadata-Spec-Street-View-Publish-API-Google-Developers.jpeg" alt="CAMM Spec" title="CAMM Spec" />

_[CAMM Specification](https://developers.google.com/streetview/publish/camm-spec)._