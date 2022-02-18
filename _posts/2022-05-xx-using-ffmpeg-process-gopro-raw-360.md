---
date: 2022-03-xx
title: "Using ffmpeg to Process Raw GoPro 360's"
description: ""
categories: developers
tags: []
author_staff_member: dgreenwood
image: /assets/images/blog/2022-03-xx/
featured_image: /assets/images/blog/2022-03-xx/
layout: post
published: false
---


You might have seen my previous series of posts

* [Reversing engieering GoPro MAX .360 videos (convet to equirectangular projection)](/blog/2021/reverse-engineering-gopro-360-file-format-part-1)
* [Turning dual GoPro Fusion Fisheye videos and images into equirectangular projections](/blog/2021/gopro-fusion-fisheye-stitching-part-1)

In both of these posts, the outcome was two custom built scripts that implemented a proof-of-concept for our research.

Recently, I've seen a few ffmpeg builds for GoPro .360 conversion. There has also been the option in ffmpeg to convert dual fisheyes for a while.

I decided to see if this conversion could be completed exclusively in ffmpeg.

_Note: I'm using Ubuntu, so you will need to tweak the commands used in this post if you're using a different OS._






## Converting dual fisheye videos

The GoPro Fusion produces a front and back fisheye `.mp4` file.

Here is an example of the files (shot at 5.2k, each with a resolution of 2704x2624):

* [GPFR0002.MP4](https://drive.google.com/file/d/1bbyvicY2b_KkSf-0MaKISwyR4fHr5Aqf/view?usp=sharing)
* [GPBK0002.MP4](https://drive.google.com/file/d/1bZQyCc0ci7bnXahlJxppf1E08nQC023C/view?usp=sharing)


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
ffmpeg -y -i GP0002-dualfisheye.MP4 -vf v360=dfisheye:equirect:ih_fov=190:iv_fov=180 -c:v libx265 GP0002-equirectangular-noblend.mp4
```



* `v360` : filter name
	* `dfisheye` : double fisheye (rectangular image containing two spheres/fisheye)
	* `e` : abbreviation for "equirectangular"
	* `ih_fov` : input horizontal Field Of View ([see our last post on GoPro field of view](/blog/2021/gopro-fusion-fisheye-stitching-part-4))
	* `iv_fov` : input vertical Field Of View, usually identical to ih_fov

Other useful options that might be useful for editing the output

* `yaw`: view direction (=azimut) of center of equirectangular output (=look left/right) [0 - 360]
* `pitch`: look up/down [-90 - 90]
* `roll`: horizontal roll of the camera (tilt side-side) [-180 - 180]
* `h_fov` : output horizontal FOV
* `v_fov` : output vertical FOV



The output looks like this;



Note, how the clear stitch line, and the there are still some dupelicate pixels.

<img class="img-fluid" src="/assets/images/blog/2022-02-11/ffmpeg-gopro-fusion-stitch-line.png" alt="ffmpeg GoPro Fusion Stitch line" title="ffmpeg GoPro Fusion Stitch line" />

The stitch lines can be calculated using origianl frame widths (2704px). Cut in half the back file is 1352px (2704px).

Therefore the first vertical line is at width 1352px. The second is at 4056px (1352px+2704px).

It is at these points we need to provide a blend. The blend zone is around 5 degrees (full photo width is 360 degrees).











%FF% -i %IN% -vf "geq=cb_expr='cb(X,Y)':cr_expr='cr(X,Y)':lum_expr='lum(X,Y)+between(X,%B1%-%W%,%B1%)*lerp((X-%B1%+%W%)/%W%,0,lum(%B1%,Y)-lum(%B1%+1,Y))+between(X,%B2%-%W%,%B2%)*lerp((X-%B2%+%W%)/%W%,0,lum(%B2%,Y)-lum(%B2%+1,Y))',format=rgb24" -y out.png

It's 5408x2624


Note, the clear line seperating left and right (and some duplicate pixels)








https://stackoverflow.com/questions/37796911/is-there-a-fisheye-or-dual-fisheye-to-equirectangular-filter-for-ffmpeg

Now you need to build and compile.



ffmpeg -y -i in.mp4 -vf v360=dfisheye:e:yaw=-90 -c:v libx265 -b:v 40000k -bufsize 5000k -preset ultrafast -c:a copy out.mp4


## Converting GoPro MAX .360 videos (EAC projection) to equirectangular projections using ffmpeg

The GoPro MAX produces a single .360 files (GoPro's EAC projection type) for 360 videos.

Sadly the master ffmpeg software does not contain the right filters to convert GoPro's EAC format out of the box (at the time of writing). Therefore you first need to build a custom fork built with this filter.

### Build and install ffmpeg

First grab this custom fork. 

You should run this install in a virtual/seperate environment, so as not to cause conflicts with your stable ffmpeg install.


```shell
git clone https://github.com/gmat/goproMax-ffmpeg-v5
cd goproMax-ffmpeg-v5
```

Now you need to install the ffmpeg dependencies, [as detailed here](https://trac.ffmpeg.org/wiki/CompilationGuide/Ubuntu).


Now build ffmpeg using the makefile (this will take a long time);

```shell
make
```

If build is successful (fingers crossed!), go ahead and install FFmpeg;

```shell
sudo make install
```

After installation, type ffmpeg command to verify the installation.

```
ffmpeg
```

### Convert .360 to equirectangular mp4

I'll use the following file as an example:

* [GS018421.360](https://drive.google.com/file/d/1FT1oth6HHMFnzP_2jk8JpGPmlzjeBhIb/view?usp=sharing)

OK, now we can run ffmpeg the ffmpeg conversion:

```shell
ffmpeg -i INPUT.360 -hwaccel auto -hwaccel auto -init_hw_device opencl:0.1 -filter_hw_device opencl0 -v verbose  -filter_complex '[0:0]format=yuv420p,hwupload[a] , [0:4]format=yuv420p,hwupload[b], [a][b]gopromax_opencl, hwdownload,format=yuv420p' OUTPUT.mp4
```

Where `INPUT.360` is the .360 video (EAC projection) you want to convert to equirectangular projection as a widely recognised .mp4.

## More ffmpeg

[In researching this post I found an amazing resource full of ffmpeg examples by Michael Koch](http://www.astro-electronic.de/FFmpeg_Book.pdf).
