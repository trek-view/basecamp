---
date: 2022-08-26
title: "Programmatically creating a thumbnail image from a equirectangular image"
description: "In this post I will show you two approaches you can use to create thumbnails from any part of an equirectangular image."
categories: developers
tags: [imagemagick, thumbnail]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-08-26/GSAA4862-meta.jpg
featured_image: /assets/images/blog/2022-08-26/GSAA4862-sm.jpg
layout: post
published: true
---

**In this post I will show you two approaches you can use to create thumbnails from any part of an equirectangular image.**

Last year I showed how to turn a 360 photo into a traditional flat image [using GoPro Player, Insta360 Studio, and GIMP](/blog/2021/turn-360-photo-into-non-360-photo).

However, being able to do this programmatically became a requirement for us when processing sequences of photos.

Depending on output desired, I have two recommended approaches;

## Simplest method (works when crop along vertical center of image is required)

This approach assumes you want the thumbnail in the center of the images, and the thumbnail is no more than 25% of the length and width of the equirectangular image.

The reason for these two considerations comes down to the distortion and effects of roll in equirectangular images as you move away from the center of the photo vertically. 

More on that in this post [A deeper look at 360 video projections](/blog/2021/projection-type-360-photography). You can see this distortion clearly in the top and bottom image below.

Here's an example of an image I want to crop from the center;

<img class="img-fluid" src="/assets/images/blog/2022-08-26/GSAA4862-sm.jpg" alt="GSAA4862 illustrated crop" title="GSAA4862 illustrated crop" />

_Just to reiterate the point, I could move the crop window left and right if needed without having to worry about distortion._

Using imagemagick I can crop the center of the photo (in this case GSAA4862.JPG with dimensions 5760x2888) to get the desired result of a thumbnail in the center of the image measuring 1200x675 in the following format;

```shell
magick INPUT.JPG -crop <CROP_WIDTH>x<CROP_HEIGHT>+<LEFT_OFFSET>+<RIGHT_OFFSET) OUTPUT.JPG
```

First I need to work of the offet from left side and top side of image using the following calculations;

(`<EQUIRECTANGUAR WIDTH>` - `<CROP WIDTH>`)/2 - left offset
(`<EQUIRECTANGUAR HEIGHT>` - `<CROP HEIGHT>`)/2 - top offset

Which in this case gives;

(5760-1200)/2 = 2280 (left offset)
(2888-675)/2 = 1106 (top offset)

With this information, the imagemagick command is;

```shell
magick GSAA4862.JPG -crop 1200x675+2280+1106 GSAA4862-crop.JPG
```

And produces the following image;

<img class="img-fluid" src="/assets/images/blog/2022-08-26/GSAA4862-crop.JPG" alt="GSAA4862 image thumbnail" title="GSAA4862 image thumbnail" />

If needed, you could also resize the crop. You might want to do this if storing the images in a web app to reduce content size;

```shell
convert -resize 50% GSAA4862-crop.JPG GSAA4862-crop-50.JPG
```

In this case `GSAA4862-crop-50.jpg` (295kb) has dimensions 50% smaller than `GSAA4862-crop.JPG` (128kb).

However, this approach won't work if you want a thumbnail at the bottom or top of the image...

## Conversion method (works when crop at top / bottom of image is required)

Using the above to create a thumbnail at the top and bottom of the image would result in a distorted thumbnail.

<img class="img-fluid" src="/assets/images/blog/2022-08-26/GSAA4862-distorted-thumb-top.jpg" alt="GSAA4862 distorted thumbnail" title="GSAA4862 distorted thumbnail" />

Lets say I wanted to create a thumbnail at the top of the image. Using the previously described approach would give me a command;

```shell
magick GSAA4862.JPG -crop 1200x675+2280+0 GSAA4862-crop-top.JPG
```

Which gives the following thumbnail;

<img class="img-fluid" src="/assets/images/blog/2022-08-26/GSAA4862-crop-top.JPG" alt="GSAA4862 distorted thumbnail crop" title="GSAA4862 distorted thumbnail crop" />

This is because of the equirectangular projection. If I roughly annotate how a Cartesian image is mapped in the equirectangular space it would look something like;

<img class="img-fluid" src="/assets/images/blog/2022-08-26/GSAA4862-distorted-thumb-top-annotated.jpg" alt="GSAA4862 Equirectangular to Cartesian" title="GSAA4862 Equirectangular to Cartesian" />

The top of the selected area for the thumbnail is stretched when compared to the bottom.

Introducing [pano2thumb](https://github.com/trek-view/pano2thumb/).

I couldn't find a way to convert a selected area in an equirectangular image to Cartesian co-ordinates in imagemagick, so I decided to take a custom approach.

Using pano2thumb you can select the latitude and longitude for the center of the thumbnail, the length and width of the desired thumbnail output, and the field of view to be captured from the center (latitude / longitude);

```shell
python3 pano2thumb.py --input GSAD6231.JPG --width=1200 --height=675 --fov=120 --latitude=90 --longitude=90 --output GSAD6231-up.JPG
```

Which produces an un-distorted thumbnail facing straight up;

<img class="img-fluid" src="/assets/images/blog/2022-08-26/GSAD6231-up.JPG" alt="GSAD6231 up" title="GSAD6231 up" />

pano2thumb will also produce a better result for the first example of the thumbnail facing directly forward (because it will remove any distortion, however minimal), like so;

```shell
python3 pano2thumb.py --input GSAD6231.JPG --width=1200 --height=675 --fov=120 --latitude=0 --longitude=-90 --output GSAD6231-forward.JPG
```

<img class="img-fluid" src="/assets/images/blog/2022-08-26/GSAD6231-forward.JPG" alt="GSAD6231 forward" title="GSAD6231 forward" />

Give it a try. [Download pano2thumb here](https://github.com/trek-view/pano2thumb/).