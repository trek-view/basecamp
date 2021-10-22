---
date: 2021-10-22
title: "How to Add a Custom Nadir to a 360 Photo"
description: "Programmatically add a custom branded nadir to your all your equirectangular photos using Imagemagick."
categories: guides
tags: [nadir, equirectangular, imagemagick]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-10-22/example-nadir-percentage-of-pano-meta.jpeg
featured_image: /assets/images/blog/2021-10-22/example-nadir-percentage-of-pano-sm.jpeg
layout: post
published: true
---

**Programmatically add a custom branded nadir to your all your equirectangular photos using Imagemagick.**

[Last year I showed you how to use GIMP to manually add a branded nadir to your photos](/blog/2020/adding-a-custom-nadir-to-360-video-photo).

In many cases, you will want to add a branded nadir to all of your photos, not just one or two. Using GIMP to do this manually isn't viable -- unless you have A LOT of time on your hands.

For those that have a large amount of images, it's relatively simple to do this programmatically with the help of [Imagemagick](https://imagemagick.org/index.php).

Imagemagick provides a huge variety of functions to manipulate image files. If you're a follower of this blog, [you might have seen me use it previously to create a cubemap](/blog/2021/reverse-engineering-gopro-360-file-format-part-3).

This time I'll show you how to use it to overlay a logo file onto an equirectangular photo to create a branded nadir.

Here is the photo I will use (taken along the South West Coast Path, Cornwall, England earlier this year using the [Trek Pack v2](/trek-pack)), and the Trek View logo I will use for this exercise.

<img class="img-fluid" src="/assets/images/blog/2021-10-22/GSAD0049-resize-1200.JPG" alt="South West Coast Path equirectangular image" title="South West Coast Path equirectangular image" />

<img class="img-fluid" src="/assets/images/blog/2021-10-22/trek-view-square-nadir.png" alt="Trek View Nadir" title="Trek View Nadir" />

If you want to use your own logo, make sure its dimensions are square, and is at least 500px x 500px (ideally larger if your photo has a resolution above 4K).

You can use a logo with a transparent background (in `.png` format), but in my experience, I find a solid background works best.

## Step 1: Convert the logo to an equirectangular projection

[I explain why we need to do this in the previous post detailing how to add a branded nadir using GIMP](/blog/2020/adding-a-custom-nadir-to-360-video-photo).

Here's how to do it with Imagemagick:

### 1.1 Rotate 180 degrees
```
magick trek-view-square-nadir.png -rotate 180 -strip trek-view-square-nadir-1.png
```

<img class="img-fluid" src="/assets/images/blog/2021-10-22/trek-view-square-nadir-1.png" alt="Rotate 180 degrees" title="Rotate 180 degrees" />

### 1.2 DePolar Distortion

```
magick trek-view-square-nadir-1.png -distort DePolar 0  trek-view-square-nadir-2.png
```

<img class="img-fluid" src="/assets/images/blog/2021-10-22/trek-view-square-nadir-2.png" alt="DePolar Distortion" title="DePolar Distortion" />

[See Imagemagick for more docs in DePolar Distortion](https://legacy.imagemagick.org/Usage/distorts/).

### 1.3 Flip

```
magick trek-view-square-nadir-2.png -flip  trek-view-square-nadir-3.png
```

<img class="img-fluid" src="/assets/images/blog/2021-10-22/trek-view-square-nadir-3.png" alt="Flip" title="Flip" />

Flip vertically.

### 1.4 Flop

```
magick trek-view-square-nadir-3.png -flop  trek-view-square-nadir-4.png
```

<img class="img-fluid" src="/assets/images/blog/2021-10-22/trek-view-square-nadir-4.png" alt="Flop" title="Flop" />

_Flip_ horizontally.

## Step 2: Resize the nadir

The first step here is to obtain the image resolution (width x height).

<img class="img-fluid" src="/assets/images/blog/2021-10-22/example-nadir-percentage-of-pano.jpeg" alt="Example nadir overlay guide" title="Example nadir overlay guide" />

My example image is 1200x600.

So the nadir needs to be 1200 wide.

```
magick trek-view-square-nadir-4.png -geometry 1200x500! trek-view-square-nadir-5.png
```

Note the `!` in the dimensions instructing Imagemagick to ignore aspect ratio. [See the Imagemagick docs for more information](https://legacy.imagemagick.org/Usage/resize/#geometry).

Now the nadir is 1200px wide, and 500px in height.

My equirectangular image is 600 in height, so we need to reduce the nadir size (because our nadir is almost as large as the photo right now!).

Generally a nadir covers 10% to 20% of the photo. Let's use 20% for this example. 

600 (height of photo) * 0.2 (percentage size) = 120

Now we can resize the nadir to be 120 in height.

```
magick trek-view-square-nadir-5.png -geometry 1200x120! trek-view-square-nadir-6.png
```

<img class="img-fluid" src="/assets/images/blog/2021-10-22/trek-view-square-nadir-6.png" alt="Resized nadir" title="Resized nadir" />

## Step 3: Overlay the nadir

All that's left to do now is overlay the equirectangular nadir created onto the photo.

We need to know where to place the nadir vertically. To calculate this; we know the photo is 600 in height and the nadir 120 in height, so:

600 - 120 = 480 (our vertical offset position).

```
composite trek-view-square-nadir-6.png GSAD0049-resize-1200.JPG -geometry +0+480 GSAD0049-resize-1200-nadir.JPG
```

<iframe width="600" height="400" allowfullscreen style="border-style:none;" src="https://www.trekview.org/trekviewer.htm#panorama=https://www.trekview.org/assets/images/blog/2021-10-22/GSAD0049-resize-1200-nadir.JPG&amp;autoLoad=true"></iframe>

_Look down..._

What's great is that approach retains all metadata between source and final image.

## Step 4: Script it

Now all you need to do is run the final command (step 3) on all your equirectangular photos to add the nadir (that is, assuming all your photos are the same dimensions and you want the same nadir size overlaid on each).

To save you some time here's one we prepared earlier, [our Nadir Patcher script](https://github.com/trek-view/nadir-patcher/).