---
date: 2021-12-24
title: "Stitching GoPro Fusion Images Without GoPro Fusion Studio (Part 2)"
description: "Understanding the Fusion's fisheye projections with the aim of turning them into a single equirectangular image."
categories: developers
tags: [GoPro, Max, Fusion, stitching, Fusion Studio, fisheye]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-12-24/GF064364-photoshop-guides.png
featured_image: /assets/images/blog/2021-12-24/GF064364-photoshop-guides-sm.jpg
layout: post
published: true
---

**Understanding the Fusion's fisheye projections with the aim of turning them into a single equirectangular image.**

[Last week I took a look at the GoPro Fusion imagery produced by the camera](/blog/2021/gopro-fusion-fisheye-stitching-part-1).

We figured out that the Fusion produces dual fisheye images. Lets start this week by quickly introducing fisheye projections...

## Fisheye projections 101

[Panotools give a nice description of fisheye types](https://wiki.panotools.org/Fisheye_Projection):

> Commonly there are two types of fisheye distinguished: circular fisheyes and fullframe fisheyes. However, both follow the same projection geometrics. The only difference is one of Field of View: for a circular fisheye the circular image fits (more or less) completely in the frame, leaving blank areas in the corner. For the full frame variety, the image is over-filled by the circular fisheye image, leaving no blank space on the film or detector.

Full frame fisheye:

<img class="img-fluid" src="/assets/images/blog/2021-12-24/full-frame-fisheye.jpeg" alt="Full frame fisheye" title="Full frame fisheye" />

Full circular fisheye:

<img class="img-fluid" src="/assets/images/blog/2021-12-24/full-circular-fisheye.jpeg" alt="Full circular fisheye" title="Full circular fisheye" />

The Fusion produces circular fisheye images. 

As noted, the resulting fisheye images can have different fields of view, dependent on the lens and sensor.

<img class="img-fluid" src="/assets/images/blog/2021-12-24/fisheye_equidistant_220_180.jpeg" alt="Circular fisheye guides" title="Circular fisheye guides" />

In the image above, you can see the field of view illustrated very nicely.

The field of view is greater than 180 (it is actually 220). You can see this as the image goes "behind" the [zenith (top) and nadir (bottom)](/blog/2020/what-is-a-nadir) (and also left and right too).

It's important to note, this is a very specific example. Different lenses will produce different field of views.

## Fusion Fisheye Lenses

<img class="img-fluid" src="/assets/images/blog/2021-12-24/GF089220-16mp-img-sm.jpg" alt="Fusion Fisheye Lenses" title="Fusion Fisheye Lenses" />

The image above was taken by the Fusion's front camera in photo mode.

The Fusion has two identical fisheye lenses. The Fusion's lenses are also slightly offset. When looking from above with the front lens facing away, the front lens is offset to the left and back lens to the right.

<img class="img-fluid" src="/assets/images/blog/2021-12-24/fusion-lens-offset.jpg" alt="GoPro Fusion Lens offset" title="GoPro Fusion Lens offset" />

As noted last week, the GoPro Fusion produces 3 image resolutions depending on the capture mode:

* Photo: 3104 x 3000
* 5.2k video: 2704 x 2624
* 3k video: 1568 x 1504

Therefore, each fisheye projection will have different dimensions dependent on the mode.

It's also worth pointing out the images are not square. The images are wider than they are tall (I'll explain more about that next week).

## Fusion Fisheye Image Measurements

<img class="img-fluid" src="/assets/images/blog/2021-12-24/annotated-guides.jpg" alt="GoPro Fusion Fisheye Guides" title="GoPro Fusion Fisheye Guides" />

I wanted to take some real examples to look at the image differences.

To calculate the center and radius values of front and back images for each image resolution I simply used Photoshop guides (I'm sure someone can suggest a more efficient and accurate way to do it).

Here's a description of the values reported:

* Fisheye edges (l,t,r,b): for left (l) and right (r) the x co-ordinate of edge of fisheye (note, left and right are considered from the photo viewer -- not the actual left / right orientation of the real world in the photo). For top (t) and bottom (b) the y co-ordinate of edge of fisheye.
* Fisheye center: from left (l) edge to center of fisheye for the x co-ordinate. From top (t) edge to center of fisheye for the y co-ordinate.
* Fisheye radius: pixel distance from left (l) edge to center of fisheye. Note, the fisheye is a slight oval shape (not a perfect circle), so this is a simplistic radius estimation at this point.

### 18mp photo

**Front image ([GF089220-16mp-img.JPG](/assets/images/blog/2021-12-24/GF089220-16mp-img.JPG]))** 

* Image resolution (w x h): 3104 x 3000
* Fisheye edges (l,t,r,b): 18,-32,3068,3000
* Fisheye resolution (w x h): 3050 (3068-18) x 3032 (3000+32)
* Fisheye center (x,y): 1543,1484
* Fisheye radius x (px): 1525 (1543-18)
* Fisheye radius y (px): 1516 (1484+32)

**Back image ([GB089220-16mp-img.JPG](/assets/images/blog/2021-12-24/GB089220-16mp-img.JPG]))** 

* Image resolution (w x h): 3104 x 3000
* Fisheye edges (l,t,r,b): 0,-32,3072,3032
* Fisheye resolution (w x h): 3072 (3072-0) x 3064 (3032+32)
* Fisheye center (x,y): 1536,1500
* Fisheye radius x (px): 1536 (1536-0)
* Fisheye radius y (px): 1532 (1500+32)

### 5.2k video

**Front image ([GPFR7152-5_2k-vid_1.jpg](/assets/images/blog/2021-12-24/GPFR7152-5_2k-vid_1.jpg))**

* Image resolution (w x h): 2704 x 2624
* Fisheye edges (l,t,r,b): 16,-36,2675,2643
* Fisheye resolution (w x h): 2659 (2675-16) x 2679 (2643+36)
* Fisheye center (x,y): 1345, 1303
* Fisheye radius x (px): 1329 (1345-16)
* Fisheye radius y (px): 1339 (1303+36)

**Back image ([GPBK7152-5_2k-vid_1.jpg](/assets/images/blog/2021-12-24/GPBK7152-5_2k-vid_1.jpg))** 

* Image resolution (w x h): 2704 x 2624
* Fisheye edges (l,t,r,b): 0,-36,2675,2643
* Fisheye resolution (w x h): 2675 (2675-0) x 2679 (2643+36)
* Fisheye center (x,y): 1337,1303
* Fisheye radius x (px): 1337 (1337-0)
* Fisheye radius y (px): 1339 (1303+36)

### 3k video

**Front image ([GPFR0001-3k-vid_1.jpg](/assets/images/blog/2021-12-24/GPFR0001-3k-vid_1.jpg))** 

* Image resolution (w x h): 1568 x 1504
* Fisheye edges (l,t,r,b): 18,-27,1540,1512
* Fisheye resolution (w x h): 1522 (1540-18) x 1539 (1512+27)
* Fisheye center (x,y): 779,742
* Fisheye radius x (px): 761 (779-18)
* Fisheye radius y (px): 769 (742+27)

**Back image ([GPBK0001-3k-vid_1.jpg](/assets/images/blog/2021-12-24/GPBK0001-3k-vid_1.jpg))** 

* Image resolution (w x h): 1568 x 1504
* Fisheye edges (l,t,r,b): 18,-27,1540,1512
* Fisheye resolution (w x h): 1522 (1540-18) x 1539 (1512+27)
* Fisheye center (x,y): 779,742
* Fisheye radius x (px): 761 (779-18)
* Fisheye radius y (px): 769 (742+27)

I'll need some of these values for next weeks post.

## Update 2021-12-24

[Stitching GoPro Fusion Images Without GoPro Fusion Studio (Part 3)](/blog/2021/gopro-fusion-fisheye-stitching-part-3)