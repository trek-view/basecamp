---
date: 2021-09-17
title: "Reverse Engineering GoPro's 360 Video File Format (Part 3)"
description: "More taking apart of a .360 file and then trying to rebuild it as equirectangular (without GoPro software)."
categories: guides
tags: [GoPro]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-09-24/
featured_image: /assets/images/blog/2021-09-24/
layout: post
published: false
---

**More taking apart of a .360 file and then trying to rebuild it as equirectangular (without GoPro software).**

[After extracting the video tracks from GoPro's .360 format in last weeks post](/blog/2021/reverse-engineering-gopro-360-file-format-part-2), this week I wanted to better understand the structure of each frame.

I suspected there might be duplicate frames after [reading GoPro's post about their .360 format](https://gopro.com/en/au/news/max-tech-specs-stitching-resolution), and looking at the dimensions of the frames extracted last week.

<img class="img-fluid" src="/assets/images/blog/2021-09-10/" alt="" title="" />

Looking at the widths of each of the 3 squares in each frame in track 0 and track 5, you can see the two outer squares, where the stitch lines are present, are wider (1376px) than that in the middle (1344px). The middle being a true square (1344x1344).

The outer squares are 32 px wider (1376-1344). And measure 688 pixels to the stitch line.

If you look closely at those middle 32 pixels (especially in the left and right images) you can clearly see the duplicate pixels.

Using [imagemagick](https://imagemagick.org/script/index.php) I decided to break the two tracks into the 6 squares used to construct the cube for the entire frame.

**Track 0:**

```
$ convert -crop 1376x1344+0+0 track0/img1.jpg pre_cubefaces/left_img1.jpg
$ convert -crop 1344x1344+1376+0 track0/img1.jpg final_cubefaces/forward_img1.jpg
$ convert -crop 1376x1344+2720+0 track0/img1.jpg pre_cubefaces/right_img1.jpg
```

**Track 5:**

For track 5 I include a rotations so that I can model them in a complete cubemap (see following steps). Rotations do not change any image dimensions.

```
$ convert -crop 1376x1344+0+0 track5/img1.jpg -rotate -180 pre_cubefaces/bottom_img1.jpg
$ convert -crop 1344x1344+1376+0 track5/img1.jpg -rotate -90 final_cubefaces/back_img1.jpg
$ convert -crop 1376x1344+2720+0 track5/img1.jpg pre_cubefaces/top_img1.jpg
```

Take note, I place the images with no ovelapping pixel (forward and back) into a `final_cubefaces` directory as no additional processing is required.

Now we need to deal with the overlapping pixels. Let's start by breaking the cubefaces into 2.

```
$ convert -crop 688x1344+0+0 pre_cubefaces/left_img1.jpg precut_cubefaces/left_l_img1.jpg
$ convert -crop 688x1344+688+0 pre_cubefaces/left_img1.jpg precut_cubefaces/left_r_img1.jpg
$ convert -crop 688x1344+0+0 pre_cubefaces/right_img1.jpg precut_cubefaces/right_l_img1.jpg
$ convert -crop 688x1344+688+0 pre_cubefaces/right_img1.jpg precut_cubefaces/right_r_img1.jpg
$ convert -crop 688x1344+0+0 pre_cubefaces/bottom_img1.jpg precut_cubefaces/bottom_l_img1.jpg
$ convert -crop 688x1344+688+0 pre_cubefaces/bottom_img1.jpg precut_cubefaces/bottom_r_img1.jpg
$ convert -crop 688x1344+0+0 pre_cubefaces/top_img1.jpg precut_cubefaces/top_l_img1.jpg
$ convert -crop 688x1344+688+0 pre_cubefaces/top_img1.jpg precut_cubefaces/top_r_img1.jpg
```

Now it's not just as simple as overlapping pixels to create a cubeface. To show you why, let me demonstrate what it would turn out like

```
$ convert -size 1344x1344 xc:transparent PNG32:precut_cubefaces/left_l_r_img1.png
$ convert precut_cubefaces/left_l_r_img1.png precut_cubefaces/left_l_img1.jpg -geometry +0+0 -composite PNG32:precut_cubefaces/left_l_r_img1.png
$ convert precut_cubefaces/left_l_r_img1.png precut_cubefaces/left_r_img1.jpg -geometry +640+0 -composite PNG32:precut_cubefaces/left_l_r_img1.png

```

It looks better than the original, but not perfect.

So we

+624

1344/2


Now 


The following command creates a flat cubemap from the images (to help demonstrate)

**Create new image:**

Height=(1344x3)=4032, Width=(1376x2)+(1344x2)=5440

```
convert -size 5440x4032 xc:transparent PNG32:img1_cubemap.png
```

**Place each cube:**

```
$ convert img1_cubemap.png cubefaces/top_img1.jpg -geometry +0+0 -composite PNG32:img1_cubemap.png
$ convert img1_cubemap.png cubefaces/left_img1.jpg -geometry +0+1344 -composite PNG32:img1_cubemap.png
$ convert img1_cubemap.png cubefaces/bottom_img1.jpg -geometry +0+2688 -composite PNG32:img1_cubemap.png
$ convert img1_cubemap.png cubefaces/forward_img1.jpg -geometry +1376+1344 -composite PNG32:img1_cubemap.png
$ convert img1_cubemap.png cubefaces/right_img1.jpg -geometry +2720+1344 -composite PNG32:img1_cubemap.png
$ convert img1_cubemap.png cubefaces/back_img1.jpg -geometry +4096+1344 -composite PNG32:img1_cubemap.png
```

Now we have a format slightly easier to visualise:




