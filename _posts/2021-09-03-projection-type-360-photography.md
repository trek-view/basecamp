---
date: 2021-09-03
title: "A deeper look at 360 video projections"
description: "Equirectangular, non-equalangle cubemap, equi-angular cubemap, pyramid..."
categories: guides
tags: [Google, Facebook, YouTube, VR, virtual reality, video, encoding]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-09-03/globe-cubemap-projection-meta.jpg
featured_image: /assets/images/blog/2021-09-03/globe-cubemap-projection-sm.jpg
layout: post
published: true
---

**Equirectangular, non-equalangle cubemap, equi-angular cubemap, pyramid...**

Recently I've been doing a lot of research on 360 video encoding.

There are a lots of ways 360 videos are encoded and displayed, including the projection type used.

In 360 photography, a projection type is a way to map a spherical field of view to a flat image.

Different projection types have different benefits. In the world of 360 videos (which can often be very large), video sharing services are always looking to optimise the size of content they serve to a viewer.

## Equirectangular projections

I talked about equirectangular projections [in my post last year about adding a custom nadir to a 360 photo](/blog/2020/adding-a-custom-nadir-to-360-video-photo).

To recap...

The worlds most famous equirectangular projection -- the world map.

<img class="img-fluid" src="/assets/images/blog/2021-09-03/Equirectangular_projection_SW.jpg" alt="World equirectangular projection" title="World equirectangular projection" />

If you've every looked at a equirectangular projected 360 photo in a "flat" view you will have clearly seen how distorted it is at the top and bottom of the image, but less around the center. You'll see why when you look at how an equirectangular projection is formed...

<img class="img-fluid" src="/assets/images/blog/2021-09-03/equirectangular-image.jpg" alt="Equirectangular graph" title="Equirectangular graph" />

The next diagram below might help you visualise this better (see how the top circles in right equirectangular projection are distorted from spherical globe):

<img class="img-fluid" src="/assets/images/blog/2021-09-03/equirectangular-globe-projection.png" alt="Equirectangular transformation" title="Equirectangular transformation" />

Many of you will be familiar with equirectangular projection types. Most 360 cameras used this projection type for outputting image and videos. Most 360 image software also understands how to render equirectangular projection types ([when this projection type is present in the metadata](/blog/2020/metadata-exif-xmp-360-photo-files)).

**Example Equirectangular projection**

<img class="img-fluid" src="/assets/images/blog/2021-09-03/example-equirectangular.jpeg" alt="Example Equirectangular projection" title="Example Equirectangular projection" />

## Cubemap projections (non-equalangle cubemaps)

In the world of video games and virtual reality cubemaps are generally the default projection type.

In large part this is because equirectangular images contain a lot of redundant pixels (whereas cubemap can deliver the same image as smaller file, thus saving bandwidth costs) and distortion (around the poles, as shown above, which can be made worse when images are edited).

Cubemaps (or cubic format) uses six cube faces to fill the whole sphere around the viewer.

<img class="img-fluid" src="/assets/images/blog/2021-09-03/cubemap-projection.png" alt="Cubemap projection" title="Cubemap projection" />

This is conceptually simple: deform a sphere into a cube, then unfold the cube’s six faces and lay them flat.

<img class="img-fluid" src="/assets/images/blog/2021-09-03/globe-cubemap-projection.png
" alt="Cubemap projection transformation" title="Cubemap projection transformation" />

This is an improvement over equirectangular projections, but it still causes substantial variation in pixel density as is evident looking at the transformation from globe, to cube, to open cube. You can see the edges of the cubes (shown with circles) are more deformed on the left, right, forward and back sides of the cube faces.

**Example Cubemap projection (non-equalangle)**

<img class="img-fluid" src="/assets/images/blog/2021-09-03/non-equalangle-cubemap-equi-angular-compare.jpeg" alt="Example Cubemap projection" title="Example Cubemap projection" />

**A note about cubemap formats**

<img class="img-fluid" src="/assets/images/blog/2021-09-03/cubemap-projection-formats.png" alt="Cubemap projection formats" title="Cubemap projection formats" />

[Download this diagram from Google Drawings here](https://docs.google.com/drawings/d/1nDh0mrrDXnOllttC8mGDY4WVtf2ifnz6kVZyRdXOgEY/edit?usp=sharing)

You should be aware there are a variety of cubemap layouts used, as shown above.

**Equirectangular To Cubemap conversions**

There are lots of free web apps online that convert images using equirectangular projections to cubemaps, for example, [this one created by Lucas Crane](https://github.com/jaxry/panorama-to-cubemap).

## Equi-Angular Cubemap projection (EAC)

In light of the above problems, the Equi-Angular Cubemap (EAC) projection was created by Google's engineering team (see this [Google blog post for the announcement](https://blog.google/products/google-ar-vr/bringing-pixels-front-and-center-vr-video/)).

<img class="img-fluid" src="/assets/images/blog/2021-09-03/non-equalangle-cubemap-equi-angular.png" alt="Equi-Angular Cubemap vs cubemap" title="Equi-Angular Cubemap vs cubemap" />

EAC is not too different to the non-equalangle cubemap projection, except you'll see the traditional cubemap has samples of varying length depending on the sample’s location on the cube face. EAC is s

<img class="img-fluid" src="/assets/images/blog/2021-09-03/eac-transform.jpg
" alt="Equi-Angular Cubemap transform" title="Equi-Angular Cubemap transform" />

You can see in the Equi-Angular Cubemap transformation that the corners of each cube are not distorted, as they were in the non-equalangle cubemap projection.

[360 videos uploaded to YouTube are converted to EAC and served using this projection type](https://youtube-eng.googleblog.com/2017/03/improving-vr-videos.html).

**Example Equi-Angular projection**

<img class="img-fluid" src="/assets/images/blog/2021-09-03/equi-angular-cubemap.jpeg" alt="Example EAC projection" title="Example EAC projection" />

**Example non-equalangle vs Equi-Angular projection**

The non-equalangle and Equi-Angular projections might look identical in the example images above.

<img class="img-fluid" src="/assets/images/blog/2021-09-03/equi-angular-cubemap.jpeg" alt="Example non-equalangle vs EAC projection" title="Example non-equalangle vs EAC projection" />

In this final example image above image I've overlaid the Equi-Angular cubemap example image with 50% transparency over the non-equalangle example image. 

You can now see the images are indeed quite different, although the edges still match perfectly. It can be seen that the EAC version has a "zoom" effect on the interior of the cube faces, this results in a higher resolution there compared to the standard non-equalangle cube map.

## Pyramid projection

The Pyramid projection was announced by Facebook in 2016, mainly aimed at VR video.

> When a 360 video is uploaded, we transform it from an equirectangular layout to the pyramid format for each of the 30 viewports, and we create five different resolutions for each stream, for a total of 150 different versions of the same video.

Source: [Facebook engineering blog](https://engineering.fb.com/2016/01/21/virtual-reality/next-generation-video-encoding-techniques-for-360-video-and-vr/)

I won't attempt to explain this projection type in this blog post as it is fairly complex. This video from the Facebook team gives a very good explanation though:

<iframe src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2FEngineering%2Fvideos%2F10153781047207200%2F&show_text=0&width=560" width="560" height="315" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>

Facebook claims a massive 80% reduction in bandwidth using the Pyramid projection (against the original equirectangular projected video).

## A note on Google Street View

<img class="img-fluid" src="/assets/images/blog/2021-09-03/google-street-view-load-image-pieces.jpg" alt="Google Street View load quadrants" title="Google Street View load quadrants" />

Google Street View loads images with an equirectangular projection, and they optimise the way they load based on your device and available bandwidth.

Part of this optimisation involves loading different parts of the image as quadrants, versus the whole image at once. You can see an example of this in the image above. If you have a fast connection and moderately powerful machine, you have probably never seen this because all quadrants have downloaded very quickly.

This optimisation technique is not to be confused with a cubemap projection.

## Acknowledgements

Image credits for this post: 

* [Google Blog post; Bringing pixels front and center in VR video](https://blog.google/products/google-ar-vr/bringing-pixels-front-and-center-vr-video/)
* [Paul Bourke; Converting to/from cubemaps](http://paulbourke.net/panorama/cubemaps/)