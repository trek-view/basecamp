---
date: 2022-03-18
title: "Using ffmpeg to Process Raw GoPro 360's to Equirectangular Projections"
description: "In our continued effort to avoid reliance on GoPro software, I look at how ffmpeg can be used to process raw Fusion and MAX 360 video outputs."
categories: developers
tags: [ffmpeg, MAX, GoPro, Player, Fusion Studio]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-03-xx/
featured_image: /assets/images/blog/2022-03-xx/
layout: post
published: false
---

**In our continued effort to avoid reliance on GoPro software, I look at how ffmpeg can be used to process raw Fusion and MAX 360 video outputs.**

You might have seen my previous series of posts:

* [Reversing engineering GoPro MAX .360 videos (convert to equirectangular projection)](/blog/2021/reverse-engineering-gopro-360-file-format-part-1)
* [Turning dual GoPro Fusion Fisheye videos and images into equirectangular projections](/blog/2021/gopro-fusion-fisheye-stitching-part-1)

In both of these posts, the outcome was two custom built scripts that implemented a proof-of-concept for our research.

Recently, I've seen a few ffmpeg builds for GoPro .360 conversion. There has also been the option in ffmpeg to convert dual fisheyes for a while.

I decided to see if this conversion could be completed exclusively in ffmpeg.

_Note: I'm using Ubuntu, so you will need to tweak the commands used in this post if you're using a different OS._

I'm going to start with the MAX, because it requires the install of a custom ffmpeg fork. This fork can be used on both MAX and Fusion content. If you just want to process Fusion movies, a regular ffmpeg install is fine.

_Note: no equirectangular metadata has been added to the videos shown as examples (hence no 360 controls). [See how to do this here](/blog/2021/turn-360-photos-into-360-video)._

## Converting GoPro MAX .360 videos (EAC projection) to equirectangular projections using ffmpeg

The GoPro MAX produces a single `.360` file (GoPro's EAC projection type) for 360 videos. [I've talked about these in detail previously](/blog/2021/everse-engineering-gopro-360-file-format-part-1).

Sadly the master ffmpeg software does not contain the right filters to convert GoPro's EAC format out of the box (at the time of writing). Therefore you first need to build a custom fork built with this filter.

### 1. Build and install ffmpeg

First grab this custom fork of ffmpeg.

You should run this install in a virtual/seperate environment, so as not to cause conflicts with your stable ffmpeg install.

```shell
git clone https://github.com/gmat/goproMax-ffmpeg-v5
cd goproMax-ffmpeg-v5
```

Now you need to install the ffmpeg dependencies, [as detailed here](https://trac.ffmpeg.org/wiki/CompilationGuide/Ubuntu).


Now build ffmpeg using the makefile (this will take a long time);

```shell
$ sudo apt-get install -y ocl-icd-opencl-dev
$ ./configure --enable-opencl --enable-opengl --enable-sdl2
$ make
$ sudo make install
# test ffmpeg works
$ ffmpeg
```

### 2. Convert .360 to equirectangular mp4

I'll use the following file as an example:

* [GS018421.360](https://drive.google.com/file/d/1FT1oth6HHMFnzP_2jk8JpGPmlzjeBhIb/view?usp=sharing)

Quickly grab it using `gdown` like so:

```shell
$ pip install gdown
# Use test 360 GS018421.360
$ gdown --id 1FT1oth6HHMFnzP_2jk8JpGPmlzjeBhIb
```

OK, now we can run ffmpeg the ffmpeg conversion on the `.360` file:

```shell
ffmpeg -i GS018421.360 -hwaccel auto -init_hw_device opencl:0.1 -filter_hw_device opencl0 -v verbose  -filter_complex '[0:0]format=yuv420p,hwupload[a] , [0:4]format=yuv420p,hwupload[b], [a][b]gopromax_opencl, hwdownload,format=yuv420p' -c:v libx265 GS018421.mp4
```

Let's break this down;

```shell
ffmpeg -i GS018421.360
```

Where `GS018421.360` is the .360 video (EAC projection) you want to convert to an `.mp4` as an equirectangular projection.

```shell
-hwaccel auto -init_hw_device opencl:0.1 -filter_hw_device opencl0
```

TODO

```shell
-v verbose
```

Set logging level and flags used by the library. Useful because this is an unmerged fork to debug any issues.

```shell
-filter_complex '[0:0]format=yuv420p,hwupload[a] , [0:4]format=yuv420p,hwupload[b], [a][b]gopromax_opencl, hwdownload,format=yuv420p'
```

TODO

```shell
-c:v libx265 GS018421.mp4
```

You can put any final output settings you want here, for example, encoding settings, and finally the output file name.

This gives a final output that looks like this:

TODO

## Converting dual fisheye videos

The GoPro Fusion produces a front and back fisheye `.mp4` file.

Here is an example of the files (shot at 5.2k, each with a resolution of 2704x2624):

* [GPFR0002.MP4](https://drive.google.com/file/d/1bbyvicY2b_KkSf-0MaKISwyR4fHr5Aqf/view?usp=sharing)
* [GPBK0002.MP4](https://drive.google.com/file/d/1bZQyCc0ci7bnXahlJxppf1E08nQC023C/view?usp=sharing)

I have previosuly covered converted GoPro Fusion dual fisheye photo frames in detail. [You should read these posts first to understand the dual fisheyes the Fusion camera creates](/blog/2021/gopro-fusion-fisheye-stitching-part-1).

### Using ffmpeg natively (proof of concept method)

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

Now this needs to be converted to an equirectagular projection:

```shell
ffmpeg -y -i GP0002-dualfisheye.MP4 -vf v360=dfisheye:equirect:ih_fov=190:iv_fov=190 -c:v libx265 GP0002-equirectangular-noblend.mp4
```

Breaking this down:

* `v360` : filter name (for video filter flag `-vf`)
  * `dfisheye` : double fisheye (rectangular image containing two spheres/fisheye)
  * `e` : abbreviation for "equirectangular"
  * `ih_fov` : input horizontal Field Of View ([see our last post on GoPro field of view](/blog/2021/gopro-fusion-fisheye-stitching-part-4))
  * `iv_fov` : input vertical Field Of View, usually identical to ih_fov (as above)

The output looks like this;

<iframe width="560" height="315" src="https://www.youtube.com/embed/uZxi-PUTJnY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

The [yaw, pitch, and roll](/blog/2020/yaw-pitch-roll-360-degree-photography) can be improved. You can pass these to ffmpeg like so;

* `yaw`: view direction (=azimut) of center of equirectangular output (=look left/right) [0 - 360]
* `pitch`: look up/down [-90 - 90]
* `roll`: horizontal roll of the camera (tilt side-side) [-180 - 180]

Some extreme examples to demonstrate...

For example using roll (set to 180) and yaw (set to -90));

```shell
ffmpeg -y -i GP0002-dualfisheye.MP4 -vf v360=dfisheye:equirect:ih_fov=190:iv_fov=190:roll=180:yaw=-90 -c:v libx265 GP0002-equirectangular-noblend-roll180-yaw-90.mp4
```

Which produces:

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/8WPaxnKj9-8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

But more obviously, see the clear stitch lines, and some duplicate pixels visible in both outputs (this one taken from the first stitched video):

<img class="img-fluid" src="/assets/images/blog/2022-02-11/ffmpeg-gopro-fusion-stitch-line.png" alt="ffmpeg GoPro Fusion Stitch line" title="ffmpeg GoPro Fusion Stitch line" />

Some of this is due to overlapping pixels and slight variations in the field of view.

It is at these points we need to provide a blend. The blend zone is around 5 degrees (full photo width is 360 degrees). _[You can see why it's 5 degrees in our previous series on converting dual fisheye frames from the Fusion here](/blog/2021/gopro-fusion-fisheye-stitching-part-1)._

It is possible to use ffmpeg filters to eliminate this.

### Using Fusion specific ffmpeg filters (recommended method)

To do this, we will use `.pgm` (Portable Gray Map) files for each fisheye. These files tell ffmpeg how to map the fisheye onto an equirectangular projection.

The fusion2sphere repository has these pre-generated for each camera mode on the GoPro Fusion camera:

* [photo mode (18mp)](https://github.com/trek-view/fusion2sphere/tree/main/pgm/photo-mode)
* [video mode (5.2k)](https://github.com/trek-view/fusion2sphere/tree/main/pgm/video-5_2k)
* [video mode (3k)](https://github.com/trek-view/fusion2sphere/tree/main/pgm/video-3k)

_Note: I've also included files for photo mode that can be used if you want to turn GoPro Fusion fisheye images into a video, [like described in this post](/blog/2021/turn-360-photos-into-360-video)._

You also need two blend mask files, one for the front, the other for the back.

To generate them you need to know the 1/4 and 3/4 positions of the output equirectangular output video horizontally.

I then create a centered rectangular selection of the blend width I want, must be less than the blend width used in fusion2sphere (which is currently 5 degrees). To work out the pixel blend width you can used the calculation `(output width / 360)*5`, e.g. `(5760/360)*5)=80px`.

I apply a linear ramp within the first selection, white to black, flip and replicate for the other selection.

`backmask.png` and `frontmask.png` are the inverse of each other and the same dimensions as the equirectangular output.

The mask files look like this (remember, the size of mask is important for desired output so don't just save these files):

<img class="img-fluid" src="/assets/images/blog/2022-03-18/frontmask.png" alt="Front ffmpeg mask" title="Back ffmpeg mask" />

Again, I use the GoPro defaults for these, which I have made available to download in the fusion2sphere repo linked below:

* [photo mode masks](https://github.com/trek-view/fusion2sphere/tree/main/pgm/photo-mode) = output width 5760 (1/4w = 1440, 3/4w = 4320
* [video mode masks](https://github.com/trek-view/fusion2sphere/tree/main/pgm/video-5_2k) (5.2k) = output width 5228 (1/4w = 1307, 3/4w = 3921)
* [video mode masks](https://github.com/trek-view/fusion2sphere/tree/main/pgm/video-3k) (3k) = output width 3072 (1/4w = 768, 3/4w = 2304)

Once you have the correct `.pgm` and mask `.png` files for the mode used, you can pass them like so:

```shell
ffmpeg -i GPFR0002.mp4 -i fusion2sphere0_x.pgm -i fusion2sphere0_y.pgm -i frontmask.png -i GPBK0002.mp4 -i fusion2sphere1_x.pgm -i fusion2sphere1_y.pgm -i backmask.png -filter_complex "[0:v][1:v][2:v] remap [front]; [4:v][5:v][6:v] remap [back]; [front] format=rgba [frontrgb]; [back] format=rgba [backrgb]; [frontrgb][3:v] blend=all_mode='multiply':all_opacity=1 [frontmask]; [backrgb][7:v] blend=all_mode='multiply':all_opacity=1 [backmask]; [frontmask][backmask] blend=all_mode='addition':all_opacity=1, format=rgba" -pix_fmt yuv420p GP0002-1.mp4
```

Let's break this down;

```shell
ffmpeg -i GPFR0002.mp4 -i fusion2sphere0_x.pgm -i fusion2sphere0_y.pgm -i frontmask.png \
-i GPBK0002.mp4 -i fusion2sphere1_x.pgm -i fusion2sphere1_y.pgm -i backmask.png
````

These two lines define the files required. Two movie files (the two fisheyes from the Fusion), 4 `.pgm` files from fusion2sphere and the two masks.

```shell
\ -filter_complex " \
```

Start of the complex filter.

```shell
[0:v][1:v][2:v] remap [front]; \
```

Maps the first fisheye (item 0) video to equirectangular, calls it “front”.


```shell
[4:v][5:v][6:v] remap [back]; \
```

 Maps the second fisheye (item 4) video to equirectangular, calls it “back”.

```shell
[front] format=rgba [frontrgb]; \
```

Converts “front” to rgba, required for blending, calls it “frontrgb”.


```shell
[back] format=rgba [backrgb]; \
```

Converts “back” to rgba, required for blending, calls it “backrgb”.

```shell
[frontrgb][3:v] blend=all_mode='multiply':all_opacity=1 [frontmask]; \
```

Applies frontmask (item 3) to “frontrgb”, calls it “frontmask”.

```shell
[backrgb][7:v] blend=all_mode='multiply':all_opacity=1 [backmask]; \
```

Apples backmask (item 7) to “backrgb” , calls it “backmask”.


```shell
[frontmask][backmask] blend=all_mode='addition':all_opacity=1, format=rgba \
```

Adds “frontmask” and “backmask”. During processing, each image gets multiplied by the mask (0=black, 1-white) and eventually both images added together. The masks are generated such that the contributions from each image will implement the blend.

```shell
" \
-pix_fmt yuv420p -c:v libx265 GP002.mp4
```

Ends the complex filter. Like before, you can put any final output settings you want here, for example, encoding settings, and finally the output file name.

If any of these commands are still a little hard to understand, [I recommend taking a look at my ffmpeg cheat sheet post which covers some of the concepts used](/blog/2022/ffmpeg-video-to-frame-cheat-sheet).

Here's what the output looks like:

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/sSeV3XcnWWw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Much better!

You can also modify the yaw, pitch and roll in the same way as before. As an example;

```shell
ffmpeg -i GPFR0002.mp4 -i fusion2sphere0_x.pgm -i fusion2sphere0_y.pgm -i frontmask.png -i GPBK0002.mp4 -i fusion2sphere1_x.pgm -i fusion2sphere1_y.pgm -i backmask.png -filter_complex "[0:v][1:v][2:v] remap [front]; [4:v][5:v][6:v] remap [back]; [front] format=rgba [frontrgb]; [back] format=rgba [backrgb]; [frontrgb][3:v] blend=all_mode='multiply':all_opacity=1 [frontmask]; [backrgb][7:v] blend=all_mode='multiply':all_opacity=1 [backmask]; [frontmask][backmask] blend=all_mode='addition':all_opacity=1, format=rgba" -vf roll=180:yaw=-90 -pix_fmt yuv420p GP0002-roll180-yaw.mp4
```