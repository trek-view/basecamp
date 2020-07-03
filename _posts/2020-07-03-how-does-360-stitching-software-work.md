---
date: 2020-07-03
title: "How Does 360 Stitching Software Work?"
description: "An ELI5 description of how a camera takes 2 or more photos to create a 360 image."
categories: developers
tags: []
author_staff_member: dgreenwood
image: /assets/images/blog/2020-07-03/hugin-screenshot-meta.jpg
featured_image: /assets/images/blog/2020-07-03/hugin-screenshot-sm.jpg
layout: post
published: true
---

**From sensors to 360 photo.**

Most 360 cameras have stitching software to turn the photos it has taken into panoramas.

This is either done on the camera, or done using software on your computer.

For example, to stitch photos from GoPro Fusion cameras on our [Trek Pack v1](/trek-pack) we use a piece of software called [GoPro Fusion Studio](https://gopro.com/en/us/shop/softwareandapp/gopro-fusion-studio-app/fusion-studio.html).

On the GoPro MAX cameras we use for the [Trek Pack v2](/trek-pack) this stitching is done on the camera for photos and using the [GoPro MAX Exporter software for videos](https://community.gopro.com/t5/en/GoPro-MAX-Exporter/ta-p/413311).

If you're anything like me, you will have pondered how this process actually works.

[As I mentioned a few weeks ago](/blog/2020/what-is-global-shutter-rolling-shutter-360-cameras), software is often where many manufacturers are competing, and there are some very good stitching tools that have been developed by manufacturers.

Unfortunately all of this software is proprietary, but the general workflows to process images into 360 projections are all very similar.

### Building a camera

The team at [Open Path View](https://openpathview.fr/) built their own 360 camera using 6 GoPro Hero 2 cameras (5 facing outward, 1 upwards).

<img class="img-fluid" src="/assets/images/blog/2020-07-03/open-path-view-camera.jpg" alt="Open Path View camera" title="Open Path View camera" />

[They've open-sourced all their work](https://github.com/OpenPathView), including the [3D printed parts for the camera housing](https://github.com/OpenPathView/3Dparts).

<img class="img-fluid" src="/assets/images/blog/2020-07-03/horizontal-field-of-view.png" alt="Horizontal Field of View" title="Horizontal Field of View" />

Source: [Bryan M Mathers](https://bryanmmathers.com/field-of-view/)

The Hero 2 cameras offer a 170 degree horizontal field of view.

I could not find data for the vertical field of view, but would estimate it being somewhere between 50 - 70 degrees.

Looking at horizontal field of view there is an overlap between the images taken on the Open Path VIew camera (170 * 5 = 850 degrees). Simply put, the sensors (each GoPro) are catching parts of the same image (there is an overlap).

The Open Path View cameras have roughly a 20% overlap.

Based on my experience, it seems for two consecutive photos to stitch easily and automatically, they must present an overlap surface of at least 15% with 20% - 30% being ideal.

Generally speaking, a high overlap is really only required when shooting in enclosed places (especially indoor tours). For outdoor imagery, this is not such an issue.

### Control points

Control points are the reason image overlap important.

Imagine you have 6 photos taken by a 360 camera. 

Creating a 360 projection is not as simple as putting the images side by side.

Lighting, movement, timing and a whole host of other things (even if the fields of view lined up perfectly) make this a more complex task.

Control points are points (or regions) of two images that refer to the same point in space and are used to stitch images.

<img class="img-fluid" src="/assets/images/blog/2020-07-03/hugin-screenshot-02.jpg" alt="Hugin Screenshot Control Points Comparison" title="Hugin Screenshot Control Points Comparison" />

By including an overlap in each photo for each period of time, you can use these control points to create a smooth transition (stitch) between the photos. The better the overlap, the smoother the join.

You might have seen "stitch lines" where control points haven't worked as intended. “Stitch lines” in 360 photos are the areas of overlap between the lenses that have been stitched together, and appear as disconnected lines that are clearly meant to be continuous. This is often caused by differences in lighting between images, or where a detailed subjects (for example a person) are very close to the camera.

## Introducing Hugin

Whilst a lot stitching software is proprietary, there are many open-source tools that are very good too (and in fact are used by many camera manufacturers in their own software).

[Hugin can stitch a series of overlapping pictures into a complete immersive panorama](http://hugin.sourceforge.net/).

Hugin is graphical front-end for [Helmut Dersch's Panorama Tools](https://www.panotools.org/dersch/) and [Andrew Mihal's Enblend and Enfuse](http://enblend.sourceforge.net/).

Enfuse is the part of Hugin that handles the stitching process.

<img class="img-fluid" src="/assets/images/blog/2020-07-03/hugin-screenshot-01.jpg" alt="Hugin Screenshot Control Points" title="Hugin Screenshot Control Points" />

<img class="img-fluid" src="/assets/images/blog/2020-07-03/hugin-screenshot-03.jpg" alt="Hugin Screenshot Control Points Stitching" title="Hugin Screenshot Control Points Stitching" />

What's more, Hugin is suitable for people who like tinkering with either basic or more advanced technical skills, with options from fully automated to manual stitching workflows.

[Here's a great tutorial that will get you started](http://hugin.sourceforge.net/tutorials/enfuse-360/en.shtml). All you need is a camera... and most of us all have one of those built into our phones.