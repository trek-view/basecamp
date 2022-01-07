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

The field of view is vital during stitching of the front and back images as it defines how much of the two images will overlap (duplicate pixels).

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

## Calculating field of view (mathematically)

Generally, manufacturers normally publish their FOV values. Sadly for us, I cannot find the exact brand of lenses used in the Fusion to do this.

Field of view can be calculated both horizontally (how far the lens can capture left and right) and vertically (up and down). In the case of full fish-eye circular images (what the Fusion produces), the FOV is linear.

For a true 360 (without guessing missing pixels), the front and back lens need an angle of view of 180 degrees both horizontally and vertically.

The marketing material advertises a FOV of 360, but I am doubtful both lenses have a FOV equal to exactly 180. As noted in part one of this series, [GoPro themselves mentions the FOV of each lens is greater than 180](https://gopro.com/en/us/news/the-art-of-stitching-spherical-content):

Luckily for us, there are a few ways FOV for a lens can be calculated.

According to [Unique Photo](https://www.uniquephoto.com/goprofusion):

> The GoPro Fusion features two cameras, both of them having 3mm focal length and aperture of f/2.8

And [DPReview](https://www.dpreview.com/products/gopro/actioncams/gopro_fusion) gives us the sensor dimensions on the Fusion:

> 6.17 x 4.55 mm (width x height)

Using these values, [Bob Atkins provides four calculations for working out a fish-eye lens FOV depending on the type of fish-eye projection used](http://www.bobatkins.com/photography/technical/field_of_view.html).

More on that next week...

# Update 2021-01-07

[Stitching GoPro Fusion Images Without GoPro Fusion Studio (Part 4)](/blog/2022/gopro-fusion-fisheye-stitching-part-4)