---
date: 2022-04-15
title: "Using ffmpeg to Process Raw GoPro Fusion Dual Fisheyes to Equirectangular Projections"
description: "In our continued effort to avoid reliance on GoPro software, I look at how ffmpeg can be used to process the GoPro Fusion's Dual Fisheyes videos to a single equirectangular video."
categories: developers
tags: [ffmpeg, MAX, GoPro, Player, Fusion Studio]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-04-15/dual-fisheye-fusion-meta.jpg
featured_image: /assets/images/blog/2022-04-15/dual-fisheye-fusion-sm.jpg
layout: post
published: true
---

**In our continued effort to avoid reliance on GoPro software, I look at how ffmpeg can be used to process the GoPro Fusion's Dual Fisheyes videos to a single equirectangular video.**

You might have seen my previous series of posts; [Turning dual GoPro Fusion Fisheye videos and images into equirectangular projections](/blog/2021/gopro-fusion-fisheye-stitching-part-1).

There is also the option in ffmpeg to convert dual fisheyes too.

## Fusion Fisheyes

The GoPro Fusion produces a front and back fisheye `.mp4` file.

Here is an example of the files (shot at 5.2k, each with a resolution of 2704x2624):

* [GPFR0002.MP4](https://drive.google.com/file/d/1bbyvicY2b_KkSf-0MaKISwyR4fHr5Aqf/view?usp=sharing)
* [GPBK0002.MP4](https://drive.google.com/file/d/1bZQyCc0ci7bnXahlJxppf1E08nQC023C/view?usp=sharing)

[Read my previous post with lots more detail about these fisheyes](/blog/2021/gopro-fusion-fisheye-stitching-part-1).

## Method 1: Using ffmpeg (proof of concept method)

The first step is to merge the input into a single dual fisheye (front and back videos side-by-side).

```shell
ffmpeg -i GPBK0002.MP4 -i GPFR0002.MP4 -filter_complex hstack -c:v libx265 GP0002-dualfisheye.MP4
```

Reference: 

* `-c:v` (codec): codec name (`:v` refers to video stream) for output video.
* [`hstack`](https://ffmpeg.org/ffmpeg-filters.html#hstack): horizontal stack

The output looks like this;

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/tXOiW1bAWqY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

The videos resolution is 5408x2624.

Now this can be converted to an equirectangular projection using ffmpeg like so:

```shell
ffmpeg -y -i GP0002-dualfisheye.MP4 -vf v360=dfisheye:equirect:ih_fov=190:iv_fov=190 -c:v libx265 GP0002-equirectangular-noblend.mp4
```

Breaking down the arguements passed to the video filter flag `-vf`:

* `v360` : filter name
  * `dfisheye` : double fisheye (rectangular image containing two spheres/fisheye)
  * `e` : abbreviation for "equirectangular"
  * `ih_fov` : input horizontal Field Of View ([see our last post on GoPro field of view](/blog/2021/gopro-fusion-fisheye-stitching-part-4))
  * `iv_fov` : input vertical Field Of View, usually (bit not always) identical to `ih_fov` (as above)

The output looks like this;

<iframe width="560" height="315" src="https://www.youtube.com/embed/uZxi-PUTJnY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Looking closely, you can the stitch lines as well as some duplicate pixels visible in both outputs (this one taken from the first stitched video):

<img class="img-fluid" src="/assets/images/blog/2022-04-15/ffmpeg-gopro-fusion-stitch-line.png" alt="ffmpeg GoPro Fusion Stitch line" title="ffmpeg GoPro Fusion Stitch line" />

Some of this is due to overlapping pixels and slight variations in the field of view.

It is at these points we need to provide a blend. The blend zone is around 5 degrees (full photo width is 360 degrees). _[You can see why it is 5 degrees in our previous series on converting dual fisheye frames from the Fusion here](/blog/2021/gopro-fusion-fisheye-stitching-part-1)._

It is possible to use ffmpeg filters to achieve a blend.

## Method 2: Using Fusion specific ffmpeg filters (recommended)

To do this, we will use `.pgm` (Portable Gray Map) files for each fisheye. These files tell ffmpeg how to map the fisheye onto an equirectangular projection.

The fusion2sphere repository has these pre-generated for each camera mode on the GoPro Fusion camera:

* [photo mode (18mp)](https://github.com/trek-view/fusion2sphere/tree/main/pgm-examples/photo-mode)
* [video mode (5.2k)](https://github.com/trek-view/fusion2sphere/tree/main/pgm-examples/video-5_2k)
* [video mode (3k)](https://github.com/trek-view/fusion2sphere/tree/main/pgm-examples/video-3k)

_Note: I've also included files for photo mode that can be used if you want to turn GoPro Fusion fisheye images into a video, [like described in this post](/blog/2021/turn-360-photos-into-360-video)._

You also need two blend mask files, one for the front, the other for the back.

To generate them you need to know the 1/4 and 3/4 positions (width) of the output equirectangular output video horizontally.

I then create a centered rectangular selection of the blend width I want, must be less than the blend width used in fusion2sphere (which is currently 5 degrees). To work out the pixel blend width you can used the calculation `(output width / 360)*5`, e.g. `(5760/360)*5)=80px`.

I apply a linear ramp within the first selection, white to black, flip and replicate for the other selection.

`backmask.png` and `frontmask.png` are the inverse of each other and the same dimensions as the equirectangular output.

The mask files look like this (remember, the size of mask is important for desired output so don't just save these files).

`frontmask.png`

<img class="img-fluid" src="/assets/images/blog/2022-04-15/frontmask.png" alt="Front ffmpeg mask" title="Front ffmpeg mask" />

`backmask.png`

<img class="img-fluid" src="/assets/images/blog/2022-04-15/backmask.png" alt="Back ffmpeg mask" title="Back ffmpeg mask" />

Again, I use the GoPro defaults for these, which I have made available to download in the fusion2sphere repo linked below:

* [photo mode masks](https://github.com/trek-view/fusion2sphere/tree/main/pgm-examples/photo-mode) = output width 5760 (1/4w = 1440, 3/4w = 4320
* [video mode masks](https://github.com/trek-view/fusion2sphere/tree/main/pgm-examples/video-5_2k) (5.2k) = output width 5228 (1/4w = 1307, 3/4w = 3921)
* [video mode masks](https://github.com/trek-view/fusion2sphere/tree/main/pgm-examples/video-3k) (3k) = output width 3072 (1/4w = 768, 3/4w = 2304)

Once you have the correct `.pgm` and mask `.png` files for the mode used, you can pass them to ffmpeg like so:

```shell
ffmpeg -i GPFR0002.mp4 -i fusion2sphere0_x.pgm -i fusion2sphere0_y.pgm -i frontmask.png -i GPBK0002.mp4 -i fusion2sphere1_x.pgm -i fusion2sphere1_y.pgm -i backmask.png -filter_complex "[0:v][1:v][2:v] remap [front]; [4:v][5:v][6:v] remap [back]; [front] format=rgba [frontrgb]; [back] format=rgba [backrgb]; [frontrgb][3:v] blend=all_mode='multiply':all_opacity=1 [frontmask]; [backrgb][7:v] blend=all_mode='multiply':all_opacity=1 [backmask]; [frontmask][backmask] blend=all_mode='addition':all_opacity=1, format=rgba" -pix_fmt yuv420p GP0002.mp4
```

Let me break this down;

```shell
ffmpeg -i GPFR0002.mp4 -i fusion2sphere0_x.pgm -i fusion2sphere0_y.pgm -i frontmask.png -i GPBK0002.mp4 -i fusion2sphere1_x.pgm -i fusion2sphere1_y.pgm -i backmask.png
````

Defines all the files required. Two movie files (the two fisheyes from the Fusion), 4 `.pgm` files and the two masks.

```shell
-filter_complex
```

Start of the complex filter used to apply the blend.

```shell
[0:v][1:v][2:v] remap [front];
```

Maps the first fisheye (item 0) video to equirectangular, calls it “front”.


```shell
[4:v][5:v][6:v] remap [back];
```

 Maps the second fisheye (item 4) video to equirectangular, calls it “back”.

```shell
[front] format=rgba [frontrgb]; [back] format=rgba [backrgb];
```

Converts “front” to rgba, required for blending, calls it “frontrgb”. Converts “back” to rgba, required for blending, calls it “backrgb”.

```shell
[frontrgb][3:v] blend=all_mode='multiply':all_opacity=1 [frontmask]; [backrgb][7:v] blend=all_mode='multiply':all_opacity=1 [backmask];
```

Applies frontmask (item 3) to “frontrgb”, calls it “frontmask”. Applies backmask (item 7) to “backrgb”, calls it "backmask".

```shell
[frontmask][backmask] blend=all_mode='addition':all_opacity=1, format=rgba
```

Takes “frontmask” and “backmask” for processing where each image gets multiplied by the mask (0=black, 1-white) until eventually both images added together. The masks are generated such that the contributions from each image will implement the blend.

```shell
-pix_fmt yuv420p -c:v libx265 GP002.mp4
```

The final output settings, for example, encoding settings. Then finally the output file name; `GP002.mp4`.

Here is what the output looks like:

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/sSeV3XcnWWw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

You can still see the stitch lines, especially as lighting levels have not been normalised between front and back, however, the stitch line is much smoother in this output.

## 6. Pros and cons of Fusion2Sphere vs ffmpeg

If you have tried using the above instructions on a longer video (more than 2 minutes), it is very likely it took a long time to process.

If you need to process an entire video, ffmpeg is the fastest and easiest approach (because it does not require separate frame extraction and stitching). You will just have to deal with the processing time (or buy bigger hardware).

However, if you only need a limited number of frames, for example 1 or 2 frames per second to create a virtual tour, then [Fusion2Sphere](https://github.com/trek-view/Fusion2sphere) is the way to go -- it will be much faster.