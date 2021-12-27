---
date: 2021-12-31
title: "Stitching GoPro Fusion Images Without GoPro Fusion Studio (Part 3)"
description: "Preparing to create an equirectangular projection from two GoPro Fusion fish-eye images."
categories: developers
tags: [GoPro, Max, Fusion, stitching, Fusion Studio, fish-eye]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-12-31/
featured_image: /assets/images/blog/2021-12-31/
layout: post
published: false
---

**Preparing to create an equirectangular projection from two GoPro Fusion fish-eye images.**

[Last week I explained some of the theory behind fish-eye images and what the GoPro Fusion fish-eye images look like](/blog/2021/gopro-fusion-fisheye-stitching-part-2).

Now we know some of the fundamentals, this week, let's look at how we can merge the two fish-eyes together into a single equirectangular projection.

## Fish-eye field of view

The field of view is vital to consider during blending.

### 180 degree field of view

Here's the world mapped in a fish-eye with a 180 degree field of view.

<img class="img-fluid" src="/assets/images/blog/2021-12-24/fish2sphere180.jpeg" alt="Fisheye 180 projection guides" title="Fisheye 180 projection guides" />

It makes sense that it occupies half of a spherical (equirectangular) projection, which captures the entire visible universe from a single position, when corrctly distorted, below;

<img class="img-fluid" src="/assets/images/blog/2021-12-24/fish2sphere180b.jpeg" alt="Fisheye 180 equirectangular projection guides" title="Fisheye 180 equirectangular projection guides" />

Note how the distortion of the horizonal is almost zero, whilst distortion along the vertical (y) axis increase as you move away from the centre. We've already covered projection types previpusly, [that could help with this](/blog/2021/projection-type-360-photography).

Looking at this transformation in a real photo.

Source fisheye image;

<img class="img-fluid" src="/assets/images/blog/2021-12-24/spherical0.jpeg" alt="Source 180 fish-eye" title="Source 180 fish-eye" />

Image credit: [Paul Bourke](http://paulbourke.net/dome/fish2/)

Transformed to equirectangular;

<img class="img-fluid" src="/assets/images/blog/2021-12-24/spherical1.jpeg" alt="180 equirectangular fish-eye conversion" title="180 equirectangular fish-eye conversion" />

Image credit: [Paul Bourke](http://paulbourke.net/dome/fish2/)

### 220 degree field of view

Many cameras use lenses with a field of view greater than 180 degrees. This results in areas of overlap when creating a single image from both photos (assuming both fish-eye lenses have the same field of view).

Here's the world mapped in a fish-eye with a 180 degree field of view.

<img class="img-fluid" src="/assets/images/blog/2021-12-24/fish2sphere220.jpeg" alt="Fisheye 220 projection guides" title="Fisheye 220 projection guides" />

You can see there are more squares along each axis. That's because the 220 degree field of view captures more of the world.

<img class="img-fluid" src="/assets/images/blog/2021-12-24/fish2sphere220b.jpeg" alt="Fisheye 220 equirectangular projection guides" title="Fisheye 220 equirectangular projection guides" />

When transformed to an equirectangular projection, you can see the squares of the fisheye go beyone a square. Again, because the 220 degree field of view captures more of the world. These are the areas of overlaps.

## Calculating field of view

Now it's time to figure out the exa

The field of view can

```
fov = 4 * arcsin (image size/(focal length * 4))
```

According to [Unique Photo](https://www.uniquephoto.com/goprofusion):

> The GoPro Fusion features two cameras, both of them having 3mm focal length and aperture of f/2.8



For the Fusion:

* focal length = 3mm. This is i


3mm

, but based on my experiments it about 190 degrees
