---
date: 2021-12-24
title: "Stitching GoPro Fusion Images Without GoPro Fusion Studio (Part 2)"
description: "Understanding the Fusion's fish-eye projections with the aim of turning them into a single equirectangular image."
categories: developers
tags: [GoPro, Max, Fusion, stitching, Fusion Studio, fish-eye]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-12-24/ GF064364-photoshop-guides.png
featured_image: /assets/images/blog/2021-12-24/ GF064364-photoshop-guides-sm.jpg
layout: post
published: true
---

**Understanding the Fusion's fish-eye projections with the aim of turning them into a single equirectangular image.**

[Last week I took a look at the GoPro Fusion imagery produced by the camera](/blog/2021/gopro-fusion-fisheye-stitching-part-1).

We figured out that the Fusion produces dual fish-eye images. Let's start this week by quickly introducing fish-eye projections...

## Fish-eye projections 101

<img class="img-fluid" src="/assets/images/blog/2021-12-24/circ_fisheye_panotools.jpeg" alt="Circular fish-eye guides" title="Circular fish-eye guides" />

> Commonly there are two types of fisheye distinguished: circular fisheyes and fullframe fisheyes. However, both follow the same projection geometrics. The only difference is one of Field of View: for a circular fisheye the circular image fits (more or less) completely in the frame, leaving blank areas in the corner. For the full frame variety, the image is over-filled by the circular fisheye image, leaving no blank space on the film or detector. A circular fisheye can be made full frame if you use it with a smaller sensor/film size (and vice versa), or by zooming a fisheye adaptor on a zoom lens.

- [Panotools](https://wiki.panotools.org/Fisheye_Projection)

The Fusion produces circular fish-eye images.

## Fusion Fish-eye Lenses

<img class="img-fluid" src="/assets/images/blog/2021-12-24/GF064364-photoshop-guides.png" alt="Photoshop Guides" title="Photoshop Guides" />

The image above was taken by the Fusion's front camera in photo mode.

The Fusion has two identical fish-eye lenses.

The images produced are not square. Nor is the center of the images (minus non-image areas) perfectly centered (the margins on the left and right are not equal).

The Fusions lenses are also offset on either side (front/back) to ensure that, together, all 360 degrees are captured in any given scene. This means the back and front images, whilst the same resolution, do not have the fish-eye projection in the same pixel spaces.

## Fusion Fish-eye Image Measurements

<img class="img-fluid" src="/assets/images/blog/2021-12-24/diagram-fusion2sphere.jpg" alt="GoPro Fusion Fisheye diagram" title="GoPro Fusion Fisheye diagram" />

As noted last week, the GoPro Fusion produces 3 image resolutions depending on the capture mode:

* Photo: 3104 x 3000
* 5.2k video: 2704 x 2624
* 3k video: 1568 x 1504

Therefore, each fish-eye projection will have different dimensions dependent on the mode. To calculate the center and radius values of front and back images for each image resolution I simply used Photoshop guides (I'm sure someone can suggest a more efficient and accurate way to do it).

### Photo

**Front image** 

* Image resolution: 3104 x 3000
* Fish-eye radius: 1520
* Fish-eye center (x,y): 1544,1487
* Fish-eye field of view: 190

**Back image** 

* Image resolution: 3104 x 3000
* Fish-eye radius: 1520
* Fish-eye center (x,y): 1546,1480
* Fish-eye field of view: 190

### 5.2k video

**Front image** 

* Image resolution: 2704 x 2624
* Fish-eye radius: 1330
* Fish-eye center (x,y): 1346,1302
* Fish-eye field of view: 191

**Back image** 

* Image resolution: 2704 x 2624
* Fish-eye radius: 1330
* Fish-eye center (x,y): 1346,1302
* Fish-eye field of view: 191

### 3k video

**Front image** 

* Image resolution: 1568 x 1504
* Fish-eye radius: 
* Fish-eye center (x,y): 
* Fish-eye field of view: 

**Back image** 

* Image resolution: 1568 x 1504
* Fish-eye radius: 
* Fish-eye center (x,y): 
* Fish-eye field of view: 

I'll show you why these values are important next week...