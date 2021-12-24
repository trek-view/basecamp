---
date: 2021-12-31
title: "Stitching GoPro Fusion Images Without GoPro Fusion Studio (Part 3)"
description: "Understanding the Fusion's fish-eye projections and turning them into a single equirectangular image."
categories: developers
tags: [GoPro, Max, Fusion, stitching, Fusion Studio, fish-eye]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-12-24/
featured_image: /assets/images/blog/2021-12-24/
layout: post
published: false
---

## Preparing to create the equirectangular projection

The values above are now useful to 

Since a 190 degree (in this case) fish-eye captures half the visible universe (and a slight overlap of 5 degrees either side) from a single position, it makes sense that it occupies half of a spherical (equirectangular) projection, which captures the entire visible universe from a single position.

In our  fish-eyes have a field of view greater than 180 degrees there is some image overlap to blend the two halves together. 



<img class="img-fluid" src="/assets/images/blog/2021-12-24/spherical0.jpeg" alt="Source fish-eye image" title="Source fish-eye image" />

Image credit: [Paul Bourke](http://paulbourke.net/dome/fish2/)



<img class="img-fluid" src="/assets/images/blog/2021-12-24/spherical1.jpeg" alt="Equirectangular output" title="Equirectangular output" />

Image credit: [Paul Bourke](http://paulbourke.net/dome/fish2/)


Now we know the cim

 I get the center of the front image being 1546 on the x axis (width) an 1480 pixels on the y height.

THe right image is different again. Remember earlier;





In both images the radius of the circle is 1520.