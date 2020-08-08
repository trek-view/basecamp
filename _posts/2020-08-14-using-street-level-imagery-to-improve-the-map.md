---
date: 2020-08-07
title: "Using Street-Level Imagery to improve the map"
description: "Some useful tools to help you make additions or modifactions to OpenStreetMap using Mapillary images."
categories: guides
tags: [OSM, OpenStreetMap, Mapillary]
author_staff_member: dgreenwood
image: /assets/images/blog/2020-08-14/osm-id-editor-meta.jpg
featured_image: /assets/images/blog/2020-08-14/osm-id-editor-sm.jpg
layout: post
published: false
---

**Mapillary, OpenStreetMap, JSOM, iD....**

Many of you might be familiar with the OpenStreetMap [iD Editor](https://wiki.openstreetmap.org/wiki/ID), the [Java OpenStreetMap (JSOM) editor](https://wiki.openstreetmap.org/wiki/Comparison_of_editors#JOSM), or perhaps [an entirely different editor altogether](https://wiki.openstreetmap.org/wiki/Comparison_of_editors).

Many thousands of contributors use it to add and update community submitted map data that powers OpenStreetMap (OSM).

## Why is street-level imagery important

<img class="img-fluid" src="/assets/images/blog/2020-08-14/enable-sat-imagery-jsom.gif" alt="JOSM Mapbox satellite" title="JOSM Mapbox satellite" />

Looking at the Mapbox satielliet imagery above, you can see how it allows users to mark buildings and other large objects as seen from above, on the map. 

Street level imagery offers a different perspective to visual editing.

The reolution of satiellite imagery can often make it hard to identify the detail at ground level (e.g path surface type), what the facade of objects look like (e.g signs on front of shops), or is useless where there is a canopy (e.g. under tree or building cover).

In these situations street-level imagery is incredibly helpful.

<img class="img-fluid" src="/assets/images/blog/2020-08-14/assets/images/blog/2020-08-14/osm-id-editor-sm.jpg" alt="OSM iD editor street level images" title="OSM iD editor street level images" />

Using our 360 images I can mark the surface type, the width of the path, the access rights, and many other settings allowing those using OSM data to navigate or plan their journeys.

For example, surface type, incline and obstructions can be vital to those with impairments.

## How to add this information to OSM

<img class="img-fluid" src="/assets/images/blog/2020-08-14/josm-street-level-image.jpg" alt="JOSM editor street level images" title="OSM iD editor street level images" />

For JOSM, a desktop application, [there are lots available](https://josm.openstreetmap.de/wiki/Plugins). [The Mapillary plugin](https://wiki.openstreetmap.org/wiki/JOSM/Plugins/Mapillary) that allows JSOM user to work with Mapillary images to provide additional context when editing the map.

Good news. The browser based editor, [OpenStreetMap iD Editor](https://wiki.openstreetmap.org/wiki/ID), also allows you to use Mapillary images to improve the map.

If you're new to editing OSM, go with the iD Editor to start with as it is the clearest.

<img class="img-fluid" src="/assets/images/blog/2020-08-14/mapillary-open-jsom-id-editor.jpg" alt="Mapillary and OSM" title="Mapillary and OSM" />

To get started, open up Mapillary, find the part of the map you want to edit ([maybe some of our images](https://www.mapillary.com/app/user/trekviewhq)), and click "..." > Editing > then selecting iD Editor.

It will open up a new window where you can start to add context to the map.

For example, click a path and look at how it has already been classified. Is the surface type noted? Are there any tags that might be useful?

After a few minutes of editing, you'll get the hang of it and will be an expert map maker in no time.