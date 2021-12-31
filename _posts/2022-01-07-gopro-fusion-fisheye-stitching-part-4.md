---
date: 2022-01-07
title: "Stitching GoPro Fusion Images Without GoPro Fusion Studio (Part 4)"
description: "Taking what we've learned over the last 3 weeks and putting it all together to create a script to convert 2 GoPro Fusion fish-eye to one equirectangular image."
categories: developers
tags: [GoPro, Max, Fusion, stitching, Fusion Studio, fish-eye]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-01-07/
featured_image: /assets/images/blog/2022-01-07/
layout: post
published: false
---

**Taking what we've learned over the last 3 weeks and putting it all together to create a script to convert 2 GoPro Fusion fish-eye to one equirectangular image.**

## Calculating field of view

There are a few ways FOV for a lens can be obtained.

Generally, manufacturers normally publish their FOV values. The trick is knowing the circle radius at which the FOV applies.

Sadly for us, I cannot find the exact brand of lenses used in the Fusion to do this.

The marketing material advertises a FOV of 360, but I am doubtful both lenses have a FOV equal to exactly 180. As noted in part one of this series, [GoPro themselves mentions the FOV of each lens is greater than 180](https://gopro.com/en/us/news/the-art-of-stitching-spherical-content):

> each lens on Fusion captures >180 degrees in field of view

So I turned back to my trigonometry to help. Various websites help with this.

According to [Unique Photo](https://www.uniquephoto.com/goprofusion):

> The GoPro Fusion features two cameras, both of them having 3mm focal length and aperture of f/2.8

And [DPReview](https://www.dpreview.com/products/gopro/actioncams/gopro_fusion) gives us the sensor dimensions on the Fusion:

> 6.17 x 4.55 mm (width x height)

Angle of view can be calculated both horizontally (how far the lends can see left and right) and vertically (up and down). For a true 360 (without guessing missing pixels), the front and back lens need an angle of view of 180 degrees both horizontally and vertically.

[Bob Atkins provides four calculations for working out a fish-eye lens FOV depending on the type of fish-eye projection used](http://www.bobatkins.com/photography/technical/field_of_view.html).

For the purpose of this exercise, I'm going to use a bit of trial and error during stitching to work out field of view (with the assumption it's between 180 - 200 degrees)... because I'm struggling a bit with the maths (any pointers very welcome!).