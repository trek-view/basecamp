---
date: 2020-07-03
title: "How Does 360 Stitching Software Work?"
description: "From two or more sensors to one photo."
categories: developers
tags: []
author_staff_member: dgreenwood
image: /assets/images/blog/2020-07-03/hugin-screenshot-meta.jpg
featured_image: /assets/images/blog/2020-07-03/hugin-screenshot-sm.jpg
layout: post
published: false
---

**From sensors to photo.**

Most 360 cameras have stitching software to stitch the photos taken by your 360 camera.

This is either on the camera, or done using software on your computer.

For example, to stitch photos from GoPro Fusion cameras on our [Trek Pack](/trek-pack) we use a piece of software called [GoPro Fusion Studio](https://gopro.com/en/us/shop/softwareandapp/gopro-fusion-studio-app/fusion-studio.html) to stitch photos. On the GoPro MAX this stitching is partly done on the camera and the [GoPro MAX Exporter software](https://community.gopro.com/t5/en/GoPro-MAX-Exporter/ta-p/413311).

If you're anything like me, you will have pondered how this process actually works.

[As I mentioned a few weeks ago](/blog/2020/what-is-global-shutter-rolling-shutter-360-cameras), software is often where many manufacturers are competing, and there asre some very good stitching tools that have been developed by manufacturer

Unfortunately all of this software is proprietary, but the general workflows to process images into 360 projections are all very similar.

### Building a camera

The team at [Open Path View](https://openpathview.fr/) built their own 360 camera using 6 GoPro Hero 2 cameras (5 facing outward, 1 upwards).

<img class="img-fluid" src="/assets/images/blog/2020-07-03/open-path-view-camera.jpg" alt="Open Path View camera" title="Open Path View camera" />

[They've open-sourced all their work](https://github.com/OpenPathView), including the [3D printed parts for the camera housing](https://github.com/OpenPathView/3Dparts).

<img class="img-fluid" src="/assets/images/blog/2020-07-03/horizontal-field-of-view.png" alt="Horizontal Field of View" title="Horizontal Field of View" />

Source: [Bryan M Mathers](https://bryanmmathers.com/field-of-view/)

The Hero 2 cameras offer a 170 degree horizontal field of view. I could not find vertical field of view, but would estimate it being somewhere between 50 - 70 degrees.

Looking at horizontal field of view there is an overlap between the images (170 * 5 = 850 degrees). Simply put, cameras are catching part of the same image.

The Open Path View cameras have roughly a 20% overlap.

Generally you'll read for a very well stitched images for two consecutive photos to stitch easily and automatically, they must present an overlap surface of at least 15/20% - 30% being ideal. However, the higher overlap is really only required when shooting in enclosed places (especially indoor tour). For less detailed outdoor imagery, this is not such an issue,.

### Control points

So why is overlap important.

Imagine you have 6 photos taken by a 360 camera. 

Creating a 360 projection is not as simple as putting the images side by side. Lighting, movement, timing and a whole host of other things make (even if the fields of view lined up perfectly).

Control points are points are regions of two camera photos that refer to the same point in space used to join images.

<img class="img-fluid" src="/assets/images/blog/2020-07-03/hugin-screenshot-02.jpg" alt="Hugin Screenshot Control Points Comparison" title="Hugin Screenshot Control Points Comparison" />

By including n overlap you can use these control points in the overlapped parts of the image and create a smooth transition (stitch) between photos. The better the overlap, the smoother the join. You might have seen 'stitching lines' where control points haven't worked as intended.


“Stitch lines” in 360 are the areas of overlap between the lenses that have been stitched together, and appear as disconnected lines that are clearly meant to be continuous. The areas on either side of stitch lines might look a bit discolored in contrast to one another, because the cameras were automatically set to different light settings. In the picture below, the subject was standing directly in the overlap between two lenses, and his face got caught in a stitch line.

## Introducing Hugin

And whilst many stitching software is propritry, many others have worked on open-source tools that are very good.

[Hugin can stitch any series of overlapping pictures into a complete immersive panorama](http://hugin.sourceforge.net/). The screenshot above is of Hugin.

Hugin is graphical front-end for [Helmut Dersch's Panorama Tools](https://www.panotools.org/dersch/) and [Andrew Mihal's Enblend and Enfuse](http://enblend.sourceforge.net/).

Enfuse is the part of Hugin that handles the stitching process.

<img class="img-fluid" src="/assets/images/blog/2020-07-03/hugin-screenshot-01.jpg" alt="Hugin Screenshot Control Points" title="Hugin Screenshot Control Points" />

<img class="img-fluid" src="/assets/images/blog/2020-07-03/hugin-screenshot-03.jpg" alt="Hugin Screenshot Control Points Stitching" title="Hugin Screenshot Control Points Stitching" />

What's more, Hugin is suitable for people who like tinkering both basic or advanced technical skills, with options from fully automated to manual stitching.

[Here's a great tutorial that will get you started quickly](http://hugin.sourceforge.net/tutorials/enfuse-360/en.shtml). All you need is a camera (and most of us all have one on our phone).