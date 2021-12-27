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
published: false
---

**Preparing to create an equirectangular projection from two GoPro Fusion fish-eye images.**

[Last week I explained some of the theory behind fish-eye images and what the GoPro Fusion fish-eye images look like](/blog/2021/gopro-fusion-fisheye-stitching-part-2).

Now we know some of the fundamentals, this week, let's look at how we can merge the two fish-eyes together into a single equirectangular projection.

## Angle of view and field of view

[Nikon describes AOV as](https://imaging.nikon.com/lineup/dslr/basics/19/01.htm):

> The angle of view is the visible extent of the scene captured by the image sensor, stated as an angle. Wide angle of views capture greater areas, small angles smaller areas.

Angle of view (AOV) is often referred to as field of view (FOV).

<img class="img-fluid" src="/assets/images/blog/2021-12-31/Field-of-View-diagram.jpg" alt="Angle of view and field of view" title="Angle of view and field of view" />

According to [Unique Photo](https://www.uniquephoto.com/goprofusion):

> The GoPro Fusion features two cameras, both of them having 3mm focal length and aperture of f/2.8

And [DPReview](https://www.dpreview.com/products/gopro/actioncams/gopro_fusion) gives us the sensor dimensions on the Fusion:

> 6.17 x 4.55 mm (width x height)

Angle of view can be calculated horizonatally (how far the lends can see left and right) and vertically (up and down). For a true 360 (without guessing missing pixels), the front and back lense need an angle of view of 180 degrees both horizontally and vertically.

[According to Shutterview](https://shuttermuse.com/calculate-field-of-view-camera-lens/), AOV can be calculated using the equation:

```
Angle of view (in degrees) = 2 ArcTan( sensor width / (2 X focal length)) * (180/π)
```

Which gives us a calculation for Horizontal AOV of:

```
Horizontal AOV = 2*ArcTan(6.17/(2x3))*(180/π)
Horizontal AOV = 2*ArcTan*58.9191599326
Horizontal AOV = 2*89.027646
Horizontal AOV = 178.055292 degrees
```

And Verical AOV of:

```
Vertical AOV = 2*ArcTan(4.55/(2x3))*(180/π)
Vertical AOV = 2*ArcTan*43.4492994641
Vertical AOV = 2*88.681551 
Vertical AOV = 177.363102 degrees
```


https://vrphotography.com/data/pages/askexperts/pano/fovfisheye.html



fov = 4 * arcsin (image size/(focal length * 4))







0.0617 / 0.06 = 1.02833333333


58.9191599324





This is typically what man 




Angle of view (in degrees) = 2 ArcTan( sensor width / (2 X focal length)) * (180/π)
This is the formula that is most commonly cited for angle of view, and it agrees with the way in which lens specifications are presented by all the major camera manufacturers.



## Fish-eye field of view

The field of view is vital to consider during blending.

### 180 degree field of view

Here's the world mapped in a fish-eye with a 180 degree field of view.

<img class="img-fluid" src="/assets/images/blog/2021-12-31/fish2sphere180.jpeg" alt="Fisheye 180 projection guides" title="Fisheye 180 projection guides" />

It makes sense that it occupies half of a spherical (equirectangular) projection, which captures the entire visible universe from a single position, when corrctly distorted, below;

<img class="img-fluid" src="/assets/images/blog/2021-12-31/fish2sphere180b.jpeg" alt="Fisheye 180 equirectangular projection guides" title="Fisheye 180 equirectangular projection guides" />

Note how the distortion of the horizonal is almost zero, whilst distortion along the vertical (y) axis increase as you move away from the centre. We've already covered projection types previpusly, [that could help with this](/blog/2021/projection-type-360-photography).

Looking at this transformation in a real photo.

Source fisheye image;

<img class="img-fluid" src="/assets/images/blog/2021-12-31/spherical0.jpeg" alt="Source 180 fish-eye" title="Source 180 fish-eye" />

Image credit: [Paul Bourke](http://paulbourke.net/dome/fish2/)

Transformed to equirectangular;

<img class="img-fluid" src="/assets/images/blog/2021-12-31/spherical1.jpeg" alt="180 equirectangular fish-eye conversion" title="180 equirectangular fish-eye conversion" />

Image credit: [Paul Bourke](http://paulbourke.net/dome/fish2/)

### 220 degree field of view

Many cameras use lenses with a field of view greater than 180 degrees. This results in areas of overlap when creating a single image from both photos (assuming both fish-eye lenses have the same field of view).

Here's the world mapped in a fish-eye with a 180 degree field of view.

<img class="img-fluid" src="/assets/images/blog/2021-12-31/fish2sphere220.jpeg" alt="Fisheye 220 projection guides" title="Fisheye 220 projection guides" />

You can see there are more squares along each axis. That's because the 220 degree field of view captures more of the world.

<img class="img-fluid" src="/assets/images/blog/2021-12-31/fish2sphere220b.jpeg" alt="Fisheye 220 equirectangular projection guides" title="Fisheye 220 equirectangular projection guides" />

When transformed to an equirectangular projection, you can see the squares of the fisheye go beyone a square. Again, because the 220 degree field of view captures more of the world. These are the areas of overlaps.

## Calculating GoPro Fusion's field of view


I realized that in the past I had used the two terms somewhat interchangeably, but I began to wonder if that w

Field-of-View-diagram.jpg

Now it's time to figure out the exa

The field of view can

```
fov = 4 * arcsin (image size/(focal length * 4))
```



And from last weeks post, we know the image sizes produced by the Fusion.

* Photo: 3104 x 3000
* 5.2k video: 2704 x 2624
* 3k video: 1568 x 1504

We must normalise the measurements for this calculation. For this we know, 1 pixel = 0.2645833333. So this gives us:

* Photo: 3104 x 3000 (4317)
* 5.2k video: 2704 x 2624
* 3k video: 1568 x 1504



For the Fusion:

* focal length = 3mm. This is i


3mm

, but based on my experiments it about 190 degrees
