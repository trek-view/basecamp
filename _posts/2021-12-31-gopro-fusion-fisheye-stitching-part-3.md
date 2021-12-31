---
date: 2021-12-31
title: "Stitching GoPro Fusion Images Without GoPro Fusion Studio (Part 3)"
description: "Preparing to create an equirectangular projection from two GoPro Fusion fish-eye images."
categories: developers
tags: [GoPro, Max, Fusion, stitching, Fusion Studio, fish-eye]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-12-31/fish2sphere220b.jpeg
featured_image: /assets/images/blog/2021-12-31/fish2sphere220b-sm.jpg
layout: post
published: true
---

**Preparing to create an equirectangular projection from two GoPro Fusion fish-eye images.**

[Last week I explained some of the theory behind fish-eye images and what the GoPro Fusion fish-eye images look like](/blog/2021/gopro-fusion-fisheye-stitching-part-2).

Now we know some of the fundamentals, this week, lets look at how we can merge the two fish-eyes together into a single equirectangular projection.

## Angle of view and field of view

[Nikon describes AOV as](https://imaging.nikon.com/lineup/dslr/basics/19/01.htm):

> The angle of view is the visible extent of the scene captured by the image sensor, stated as an angle. Wide angle of views capture greater areas, small angles smaller areas.

Angle of view (AOV) is often referred to as field of view (FOV).

<img class="img-fluid" src="/assets/images/blog/2021-12-31/Field-of-View-diagram.jpg" alt="Angle of view and field of view" title="Angle of view and field of view" />

For the purpose of this post (due to the sources cited) I'll use FOV, but what I am actually referring to AOV as shown in the above diagram.

## Fish-eye field of view and stitching

The field of view is vital during stitching of the front and back images as it defines how much of the two images overlap.

### 180 degree field of view

Here's the world mapped in a fish-eye with a 180 degree field of view.

<img class="img-fluid" src="/assets/images/blog/2021-12-31/fish2sphere180.jpeg" alt="Fisheye 180 projection guides" title="Fisheye 180 projection guides" />

It makes sense that it occupies half of a spherical (equirectangular) projection, which captures the entire visible universe from a single position, when correctly distorted, below showing the front image mapped in the equirectangular space;

<img class="img-fluid" src="/assets/images/blog/2021-12-31/fish2sphere180b.jpeg" alt="Fisheye 180 equirectangular projection guides" title="Fisheye 180 equirectangular projection guides" />

Note how the distortion of the horizontal is almost zero, whilst distortion along the vertical (y) axis increase as you move away from the centre. We've already covered projection types and why this happens previously ([here](/blog/2021/projection-type-360-photography)).

Looking at this transformation in a real photo.

Source fish-eye image;

<img class="img-fluid" src="/assets/images/blog/2021-12-31/spherical0.jpeg" alt="Source 180 fish-eye" title="Source 180 fish-eye" />

Image credit: [Paul Bourke](http://paulbourke.net/dome/fish2/)

Transformed to equirectangular;

<img class="img-fluid" src="/assets/images/blog/2021-12-31/spherical1.jpeg" alt="180 equirectangular fish-eye conversion" title="180 equirectangular fish-eye conversion" />

Image credit: [Paul Bourke](http://paulbourke.net/dome/fish2/)

### 220 degree field of view

Many cameras use lenses with a field of view greater than 180 degrees. This results in areas of overlap when creating a single image from both photos (assuming both fish-eye lenses have the same field of view).

Here's the world mapped in a fish-eye projection with a 220 degree field of view.

<img class="img-fluid" src="/assets/images/blog/2021-12-31/fish2sphere220.jpeg" alt="Fisheye 220 projection guides" title="Fisheye 220 projection guides" />

You can see there are more squares along each axis. That's because the 220 degree field of view captures more of the world.

<img class="img-fluid" src="/assets/images/blog/2021-12-31/fish2sphere220b.jpeg" alt="Fisheye 220 equirectangular projection guides" title="Fisheye 220 equirectangular projection guides" />

When transformed to an equirectangular projection, you can see the squares of the fish-eye go beyond the square edges of the 180 degree example. Again, this is because the 220 degree field of view captures more of the world. These are the areas of overlaps.

## Stitching photos

The front fish-eye is first mapped into equirectangular space, as shown previously.

If view the field is 190 degrees, a blend zone of 5 degrees either side will exist.

<img class="img-fluid" src="/assets/images/blog/2021-12-31/front-equirectangular-blend-annotated.png" alt="Fisheye front to equirectangular" title="Fisheye front to equirectangular" />

The back image, once mapped into equirectangular space, is split into two; the left side goes left, the right side right. 

<img class="img-fluid" src="/assets/images/blog/2021-12-31/back-equirectangular-blend-annotated.png" alt="Fisheye back to equirectangular" title="Fisheye back to equirectangular" />

Again, assuming the field of view for this lens is the same (190), there will be a blend zone of 5 degrees either side, where the images should overlap nicely with the 5 degrees either side of the front image.

Generally field of view angles of at least 190 degrees or more for each lens are required for a satisfactory blend zone.

Note: the actual blending zone is larger at the top and the bottom of the image, as shown in he world mapped in a fish-eye with a 220 degree field of view above.

A bit of blending will still be required to map/smooth the duplicate pixels in either space. This can be done in a number of ways.

Remember GoPro mentioned their D.WARP algorithm in the first post of this series?

We used alpha blending in our [MAX2Sphere script](/blog/2021/reverse-engineering-gopro-360-file-format-part-3).

There are many more open-source blending algorithms available too.

Though more on blending in the final part of this series next week.