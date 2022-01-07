---
date: 2022-01-07
title: "Stitching GoPro Fusion Images Without GoPro Fusion Studio (Part 4)"
description: "Taking what we've learned over the last 3 weeks and putting it all together to create a script to convert 2 GoPro Fusion fish-eye to one equirectangular image."
categories: developers
tags: [GoPro, Max, Fusion, stitching, Fusion Studio, fish-eye, fusion2sphere, max2sphere]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-01-07/front-equirectangular-blend-annotated-meta.jpg
featured_image: /assets/images/blog/2022-01-07/front-equirectangular-blend-annotated-sm.jpg
layout: post
published: true
---

**Taking what we've learned over the last 3 weeks and putting it all together to create a script to convert 2 GoPro Fusion fish-eye to one equirectangular image.**

[I finished last weeks post talking about field of view](/blog/2021/gopro-fusion-fisheye-stitching-part-3).

It was clear we needed to understand the field of view of the lenses on the Fusion in order for stitching to work correctly (because the FOV will determine the blend zone).

## Stitching photos

Once both fish-eye images are mapped into equirectangular space, as shown last week, stitching of both images can happen to create a single equirectangular image.

The FOV on the Fusion is about 190 degrees, so a blend zone of 5 degrees on the left and right side of the front image exists (180 + 5 + 5).

<img class="img-fluid" src="/assets/images/blog/2022-01-07/front-equirectangular-blend-annotated.png" alt="Fisheye front to equirectangular" title="Fisheye front to equirectangular" />

The back image, once mapped into equirectangular space, is split into two; the left side goes left, the right side right. 

<img class="img-fluid" src="/assets/images/blog/2022-01-07/back-equirectangular-blend-annotated.png" alt="Fisheye back to equirectangular" title="Fisheye back to equirectangular" />

The FOV for the back lens is the same (190), so there will be a blend zone of 5 degrees either side, where the images should overlap nicely.

## Blending photos

Generally FOV angles of at least 190 degrees or more are required for a satisfactory blend zone.

Note: the actual blending zone is larger at the top and the bottom of the image, as shown in the world mapped in a fish-eye with a 220 degree FOV in last weeks post -- but these areas are cut off when image is mapped into equirectangular space.

A bit of blending is required to map/smooth the duplicate pixels in the blend zones. This can be done in a number of ways.

Remember GoPro mentioned their D.WARP algorithm in the first post of this series? This algorithm identifies duplicate pixels and normalises the colour between the front and back images (due to lighting differences on either side of the camera).

We used alpha blending in our [MAX2Sphere script](/blog/2021/reverse-engineering-gopro-360-file-format-part-3).

There are many more open-source blending algorithms available too.

## Putting it all together

In summarising the last four weeks of content, the process to convert dual GoPro Fusion fish-eye photos into a single equirectangular image is as follows;

1. Take matching front and back fish-eye images on the Fusion
2. Determine resolution of the images (what camera mode they were shot in)
3. Convert both fish-eyes into the equirectangular space
4. Map converted fish-eyes to single equirectangular image
5. Blend any duplicate pixel areas to create a smooth 360 image

The fusion2sphere script has been built to do exactly the steps described above.

## fusion2sphere

[fusion2sphere can be downloaded here](https://github.com/trek-view/fusion2sphere).

You should read the documentation for a more detailed description, but at a high level...

The script takes a `parameter.txt` file defining the field of view and other variables we've described during this series of posts. We've added the 3 variations you'll need in example `parameter.txt` files. [The one you select will depend on the Fusion camera mode you used](https://github.com/trek-view/fusion2sphere/tree/main/parameter-examples).

The `-b` flag allows you to determine the blend zone (using longitude, in degrees). We know the blend zone on the Fusion is equal to 5 degrees either side (190 degree field of view) so this value should usually be set at 5, but depending on photo conditions (namely how noisy the scene is) you might want to experiment with the value used.

You can also set the width of the resulting photo using the `-w` flag. Generally we recommend sticking to the defaults provided. The script has not been designed to upscale or downscale images from their default resolutions. I'd recommend using other software to do this. We recommended settings based on the GoPro Fusion Studio:

* Photo mode (18mp) input = 5120 (5.2k)
* Video mode (5.2k) input = 3840 (4k)
* Video mode (3k) input = 3072 (3k)

Beyond these settings, the only other thing you need to include in the argument is the path to the front and back images from the Fusion.

Here's an example using imagery created when the Fusion was in timelapse photo mode:

```
fusion2sphere -w 5120 -b 5 -f GPFR0001.JPG GPBK0004.JPG -o GP0001.jpg parameter-examples/photo-mode.txt
```

### A note on video files

If you're using video files, you should first convert them to frames using ffmpeg.

An example (at an extraction rate of 1 FPS).

```
ffmpeg -i GPFR0002.MP4 -r 1 -q:v 1 track0/front_img_%d.jpg 
ffmpeg -i GPBK0002.MP4 -r 1 -q:v 1 track1/back_img_%d.jpg 
```

If desired, you can then recreate an equirectangular mp4 video from the frames after processing to equirectangular images, [as described in this post](/blog/2021/turn-360-photos-into-360-video).

### Improvements

The current script does not carry over any of the metadata retained in the original fish-eyes. [You will therefore need to write the 360 metadata into the outputted image files created](/blog/2020/metadata-exif-xmp-360-photo-file) to make sure they are rendered properly by 360 viewers (or accepted as 360's by products like Street View).

Another feature missing that is present in GoPro Fusion Studio is the horizon leveling feature. GoPro Fusion Studio does this by allowing you to adjust the [roll, pitch, and yaw](/blog/2020/yaw-pitch-roll-360-degree-photography) before processing. Other tools like PtGui (and others) do this too. It is something I'm considering adding in the future.

It's likely this missing functionality will be included in Explorer, [but more on that soon](https://landing.mailerlite.com/webforms/landing/p3p7h9)...