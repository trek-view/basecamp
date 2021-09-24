---
date: 2021-09-24
title: "Reverse Engineering GoPro's 360 Video File Format (Part 3)"
description: "More taking apart of a .360 file and then trying to rebuild it as equirectangular (without GoPro software)."
categories: guides
tags: [GoPro, equirectangular, EAC, ffmpeg, exiftool, imagemagick, cubemap]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-09-24/gopro-cubemap-meta.jpg
featured_image: /assets/images/blog/2021-09-24/gopro-cubemap-sm.jpg
layout: post
published: true
---

**More taking apart of a .360 file and then trying to rebuild it as equirectangular (without GoPro software).**

[After extracting the video tracks from GoPro's .360 format in last weeks post](/blog/2021/reverse-engineering-gopro-360-file-format-part-2), this week I wanted to better understand the structure of each frame.

I suspected there might be duplicate frames after [reading GoPro's post about their .360 format](https://gopro.com/en/au/news/max-tech-specs-stitching-resolution), and looking at the dimensions of the frames extracted last week.

<img class="img-fluid" src="/assets/images/blog/2021-09-24/annotated-gopro-eac.jpg" alt="GoPro EAC annotated" title="GoPro EAC annotated" />

Looking at the widths of each of the 3 squares in each frame in track 0 and track 5, you can see the two outer squares, where the stitch lines are present, are wider (1376px) than that in the middle (1344px). The middle being a true square (1344x1344).

The outer squares are 32 px wider (1376-1344). And measure 688 pixels to the stitch line.

Using [imagemagick](https://imagemagick.org/script/index.php) I decided to break the two tracks into the 6 squares used to take a closer look.

**Track 0:**

```
$ convert -crop 1376x1344+0+0 track0/img1.jpg pre_cubefaces/left_img1.jpg
$ convert -crop 1344x1344+1376+0 track0/img1.jpg final_cubefaces/forward_img1.jpg
$ convert -crop 1376x1344+2720+0 track0/img1.jpg pre_cubefaces/right_img1.jpg
```

**Track 5:**

```
$ convert -crop 1376x1344+0+0 track5/img1.jpg -rotate pre_cubefaces/bottom_img1.jpg
$ convert -crop 1344x1344+1376+0 track5/img1.jpg -rotate final_cubefaces/back_img1.jpg
$ convert -crop 1376x1344+2720+0 track5/img1.jpg pre_cubefaces/top_img1.jpg
```

Take the image below taken from the right frame of a video shot in my backgarden.

<img class="img-fluid" src="/assets/images/blog/2021-09-24/gopro-eac-overlap.jpg" alt="GoPro EAC overlap" title="GoPro EAC overlap" />

Here, we can clearly see the overlapping area, and it in fact measures 64 pixels (in a video shot at 5.6k). So we have 32 overlapping pixels of each side of the center of the image.

<img class="img-fluid" src="/assets/images/blog/2021-09-24/annotated-gopro-eac.jpg" alt="GoPro EAC annotated 2" title="GoPro EAC annotated 2" />

It is this 64 pixels that needs to be blended. Which makes sense. The 64 overlap, gives 2 strips of 32 pixel overlap each side of the center. 32 pixels being the extra width of the overlapping frame (1376 vs 1344). So after blending, 32 pixels are removed, and the squares of these cubefaces reduced by 32 pixels to make a square, as required.


<img class="img-fluid" src="/assets/images/blog/2021-09-24/gopro-eac-overlap-process.jpg
" alt="GoPro EAC overlap process" title="GoPro EAC overlap process" />

You might be thinking; why can't we just remove one strip of duplicated 32 pixels? It's not that simple.

Let's look at an example. First by splitting the left cubeface into two at the stitch line:

```
$ convert -crop 688x1344+0+0 pre_cubefaces/left_img1.jpg precut_cubefaces/left_l_img1.jpg
$ convert -crop 688x1344+688+0 pre_cubefaces/left_img1.jpg precut_cubefaces/left_r_img1.jpg
```

Then by placing the right side on-top of the left side (over the duplicate pixel area):

```
$ convert -size 1344x1344 xc:transparent PNG32:precut_cubefaces/left_l_r_img1.png
$ convert precut_cubefaces/left_l_r_img1.png precut_cubefaces/left_l_img1.jpg -geometry +0+0 -composite PNG32:precut_cubefaces/left_l_r_img1.png
$ convert precut_cubefaces/left_l_r_img1.png precut_cubefaces/left_r_img1.jpg -geometry +640+0 -composite PNG32:precut_cubefaces/left_l_r_img1.png

```

<img class="img-fluid" src="/assets/images/blog/2021-09-24/gopro-eac-simple-overlap.png" alt="GoPro EAC simple overlap" title="GoPro EAC simple overlap" />

If you look closely you can still see duplicate pixels, and a clear stitch line.

<img class="img-fluid" src="/assets/images/blog/2021-09-24/gopro-eac-simple-overlap-zoom.png" alt="GoPro EAC simple overlap zoom" title="GoPro EAC simple overlap zoom" />

Therefore we need to apply a blend.

The actual process to do this only requires one more step than above:

1. Overlap the two images by 32 pixels, as above
2. Then blend using [alpha compositing](https://en.wikipedia.org/wiki/Alpha_compositing) (alpha + (1-alpha)

This will leave us with 6 perfect square cubefaces (1344x1344).

Once we blend the left, right, bottom, and top images, we can then rebuild as the cubemap with the new dimensions (4032x2688).

First we create the image

```
convert -size 4032x2688 xc:transparent PNG32:img1_cubemap.png
```

And then by placing each cube within it:

```
# top row
$ convert img1_cubemap.png cubefaces/left_img1.jpg -geometry +0+0 -composite PNG32:img1_cubemap.png
$ convert img1_cubemap.png cubefaces/forward_img1.jpg -geometry +1344+0 -composite PNG32:img1_cubemap.png
$ convert img1_cubemap.png cubefaces/right_img1.jpg -geometry +2688+0 -composite PNG32:img1_cubemap.png
# bottom row
$ convert img1_cubemap.png cubefaces/bottom_img1.jpg -geometry +0+1344 -composite PNG32:img1_cubemap.png
$ convert img1_cubemap.png cubefaces/back_img1.jpg -geometry +1344+1344 -composite PNG32:img1_cubemap.png
$ convert img1_cubemap.png cubefaces/top_img1.jpg -geometry +2688+1344 -composite PNG32:img1_cubemap.png
```

Now we have a blended EAC cubemap that is ready to be converted to an equirectangular projection.

## MAX2sphere

Don't want to wait until the end of this series to start converting your `.360`'s? 

MAX2sphere takes 2 raw GoPro .360 frames (with GoPro EAC projection) and converts them to a more widely recognised equirectangular projection.

[Download it here](https://github.com/trek-view/MAX2sphere).

## Rebuilding a .360 into an equirectangular projection

Stay tuned for next weeks post. Or subscribe to the newsletter below and we'll let you know when it's live.