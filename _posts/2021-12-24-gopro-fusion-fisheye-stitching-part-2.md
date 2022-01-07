---
date: 2021-12-24
title: "Stitching GoPro Fusion Images Without GoPro Fusion Studio (Part 2)"
description: "Understanding the Fusion's fish-eye projections with the aim of turning them into a single equirectangular image."
categories: developers
tags: [GoPro, Max, Fusion, stitching, Fusion Studio, fish-eye]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-12-24/GF064364-photoshop-guides.png
featured_image: /assets/images/blog/2021-12-24/GF064364-photoshop-guides-sm.jpg
layout: post
published: true
---

**Understanding the Fusion's fish-eye projections with the aim of turning them into a single equirectangular image.**

[Last week I took a look at the GoPro Fusion imagery produced by the camera](/blog/2021/gopro-fusion-fisheye-stitching-part-1).

We figured out that the Fusion produces dual fish-eye images. Lets start this week by quickly introducing fish-eye projections...

## Fish-eye projections 101

[Panotools give a nice description of fish-eye types](https://wiki.panotools.org/Fisheye_Projection):

> Commonly there are two types of fisheye distinguished: circular fisheyes and fullframe fisheyes. However, both follow the same projection geometrics. The only difference is one of Field of View: for a circular fisheye the circular image fits (more or less) completely in the frame, leaving blank areas in the corner. For the full frame variety, the image is over-filled by the circular fisheye image, leaving no blank space on the film or detector. A circular fisheye can be made full frame if you use it with a smaller sensor/film size (and vice versa), or by zooming a fisheye adaptor on a zoom lens.

The Fusion produces full fish-eye circular images.

Fish-eye images can have different fields of view, dependent on the lens.

<img class="img-fluid" src="/assets/images/blog/2021-12-24/fisheye_equidistant_220_180.jpeg" alt="Circular fish-eye guides" title="Circular fish-eye guides" />

In the image above, you can see the field of view illustrated very nicely.

The field of view is greater than 180 (it is actually 220). You can see this as the image goes beyond the annotated world [zenith and nadir](/blog/2020/what-is-a-nadir).

It's important to note, this is a very specific example. Different lenses will produce different field of views (and even different fish-eye distortions).

Luckily for us both the Fusion lenses are identical.

## Fusion Fish-eye Lenses

<img class="img-fluid" src="/assets/images/blog/2021-12-24/GF089220-16mp-img-sm.jpg" alt="Fusion Fish-eye Lenses" title="Fusion Fish-eye Lenses" />

The image above was taken by the Fusion's front camera in photo mode.

The Fusion has two identical fish-eye lenses. The Fusions lenses are also offset on either side (front/back) to ensure that, together, all 360 degrees are captured in any given scene.

Though the offset means the back and front images, whilst the same resolution, do not necessarily have the fish-eye projection in the same pixel spaces.

As noted last week, the GoPro Fusion produces 3 image resolutions depending on the capture mode:

* Photo: 3104 x 3000
* 5.2k video: 2704 x 2624
* 3k video: 1568 x 1504

Therefore, each fish-eye projection will have different dimensions dependent on the mode. 

## Fusion Fish-eye Image Measurements

<img class="img-fluid" src="/assets/images/blog/2021-12-24/annotated-guides.jpg" alt="GoPro Fusion Fisheye Guides" title="GoPro Fusion Fisheye Guides" />

I wanted to take some real examples to look at the image differences.

To calculate the center and radius values of front and back images for each image resolution I simply used Photoshop guides (I'm sure someone can suggest a more efficient and accurate way to do it).

Here's a description of the values reported:

* Fish-eye edges (l,t,r,b): for left (l) and right (r) the x co-ordinate of edge of fish-eye. For top (t) and bottom (b) the y co-ordinate of edge of fish-eye.
* Fish-eye center: from left (l) edge to center of fish-eye for the x co-ordinate. From top (t) edge to center of fish-eye for the y co-ordinate.
* Fish-eye radius: pixel distance from left (l) edge to center of fish-eye. Note, the fish-eye is a slight oval shape (not a perfect circle), so this is a simplistic radius estimation at this point.

### 18mp photo

**Front image ([GF089220-16mp-img.JPG](/assets/images/blog/2021-12-24/GF089220-16mp-img.JPG]))** 

* Image resolution (w x h): 3104 x 3000
* Fish-eye edges (l,t,r,b): 18,-32,3068,3000
* Fish-eye resolution (w x h): 3050 (3068-18) x 3032 (3000+32)
* Fish-eye center (x,y): 1543,1484
* Fish-eye radius x (px): 1525 (1543-18)
* Fish-eye radius y (px): 1516 (1484+32)

**Back image ([GB089220-16mp-img.JPG](/assets/images/blog/2021-12-24/GB089220-16mp-img.JPG]))** 

* Image resolution (w x h): 3104 x 3000
* Fish-eye edges (l,t,r,b): 0,-32,3072,3032
* Fish-eye resolution (w x h): 3072 (3072-0) x 3064 (3032+32)
* Fish-eye center (x,y): 1536,1500
* Fish-eye radius x (px): 1536 (1536-0)
* Fish-eye radius y (px): 1532 (1500+32)

### 5.2k video

**Front image ([GPFR7152-5_2k-vid_1.jpg](/assets/images/blog/2021-12-24/GPFR7152-5_2k-vid_1.jpg))**

* Image resolution (w x h): 2704 x 2624
* Fish-eye edges (l,t,r,b): 16,-36,2675,2643
* Fish-eye resolution (w x h): 2659 (2675-16) x 2679 (2643+36)
* Fish-eye center (x,y): 1345, 1303
* Fish-eye radius x (px): 1329 (1345-16)
* Fish-eye radius y (px): 1339 (1303+36)

**Back image ([GPBK7152-5_2k-vid_1.jpg](/assets/images/blog/2021-12-24/GPBK7152-5_2k-vid_1.jpg))** 

* Image resolution (w x h): 2704 x 2624
* Fish-eye edges (l,t,r,b): 0,-36,2675,2643
* Fish-eye resolution (w x h): 2675 (2675-0) x 2679 (2643+36)
* Fish-eye center (x,y): 1337,1303
* Fish-eye radius x (px): 1337 (1337-0)
* Fish-eye radius y (px): 1339 (1303+36)

### 3k video

**Front image ([GPFR0001-3k-vid_1.jpg](/assets/images/blog/2021-12-24/GPFR0001-3k-vid_1.jpg))** 

* Image resolution (w x h): 1568 x 1504
* Fish-eye edges (l,t,r,b): 18,-27,1540,1512
* Fish-eye resolution (w x h): 1522 (1540-18) x 1539 (1512+27)
* Fish-eye center (x,y): 779,742
* Fish-eye radius x (px): 761 (779-18)
* Fish-eye radius y (px): 769 (742+27)

**Back image ([GPBK0001-3k-vid_1.jpg](/assets/images/blog/2021-12-24/GPBK0001-3k-vid_1.jpg))** 

* Image resolution (w x h): 1568 x 1504
* Fish-eye edges (l,t,r,b): 18,-27,1540,1512
* Fish-eye resolution (w x h): 1522 (1540-18) x 1539 (1512+27)
* Fish-eye center (x,y): 779,742
* Fish-eye radius x (px): 761 (779-18)
* Fish-eye radius y (px): 769 (742+27)

## A brief evaluation

As you can see per the values reported, with each resolution the images produced are not square. Nor is the fisheye a perfect circular image. Nor is it always centered, or a complete fit in the image (sometimes there is a margin on either side, sometimes the fisheye has a blindspot at the top on the bottom cut off from the image)

## A note on aperture changes

I suspect all of the values reported above might change with the aperture setting. For example, in low light, the aperture will be wider than compared to very sunny conditions, perhaps leading to a larger fish-eye image.

## Update 2021-12-24

[Stitching GoPro Fusion Images Without GoPro Fusion Studio (Part 3)](/blog/2021/gopro-fusion-fisheye-stitching-part-3)