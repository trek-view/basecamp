---
date: 2020-06-19
title: "Adding a Custom Nadir to a 360 Photo or Video"
description: "Branding your public images can be a great way to promote your other work. A custom nadir is perfect for this."
categories: developers
tags: [nadir]
author_staff_member: dgreenwood
image: /assets/images/blog/2020-06-19/gimp-create-nadir-meta.jpg
featured_image: /assets/images/blog/2020-06-19/gimp-create-nadir-sm.jpg
layout: post
published: true
---

**Some shameless self-promotion**

Uploading your 360 imagery to Google Street View can be a great promotional tool for your business or project.

Federico, our chief photographers, knows this well.

<iframe src="https://www.google.com/maps/embed?pb=!4v1590090267926!6m8!1m7!1sCAoSLEFGMVFpcE1qNm0zcGtYZjJIbHpkeUZLMkdIWmhOSS1uWkNjWjhJMU1GVjdw!2m2!1d37.74584360580534!2d-119.5333779671922!3f277.84883955807237!4f-0.17394242234139767!5f0.7820865974627469" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>

In embedded Street View `<iframes>` you can see the photographers name in the top left and top right.

When clicking the "[View on Google Maps](https://www.google.com/maps/@37.7458457,-119.5333831,0a,82.2y,277.85h,89.83t/data=!3m4!1e1!3m2!1sAF1QipMj6m3pkXf2HlzdyFK2GHZhNI-nZCcZ8I1MFV7p!2e10?source=apiv3)" link, you'll also see the icon associated with the Google account. In this case, a headshot of Federico.

<img class="img-fluid" src="/assets/images/blog/2020-06-19/federico-google-maps-headshot.png" alt="Federico Google Maps headshot" title="Federico Google Maps headshot" />

Sometimes you want something more striking. Or if you're not using Google, something that stands out.

A custom nadir is perfect for achieving this. What is a nadir? [This post explains more](2020-03-13-what-is-a-nadir).

Google allows custom nadirs in 360 imagery, [as long as they follow their branding guidelines](https://www.google.co.uk/streetview/sales/).

Some manufacturer or propriety apps will allow you to do this in their own tools.

This post explains how the processing of adding a nadir works, and how to do it yourself for free. 

For those that have lots of photos to tag, we've built a free piece of software that will help -- more on that at the end of this post.

## Equirectangular and Cartesian projection 

The worlds most famous equirectangular image -- the world map.

But have you ever thought about how it was produced. If you've every looked at a flat equirectangular photo you will have seen how distorted it is at the top and bottom of the image, but less around the centre. Here's why:

<img class="img-fluid" src="/assets/images/blog/2020-06-19/equirectangular-image.jpg" alt="Equirectangular graph" title="Equirectangular graph" />

Cartesian images are taken by regular single sensor cameras. They're less hard to get your head _around_. They produce 'flat' images on a 2D Cartesian plane (x,y). Here's a 3D Cartesian plane with (x,y,z axis).

<img class="img-fluid" src="/assets/images/blog/2020-06-19/cartesian_coordinate_axes_3d.png" alt="Cartesian 3D graph" title="Cartesian 3D graph" />

Your logo, for a proposed nadir will start out as a Cartesian image.

Overlaying the nadir around the middle of the photo won't cause too many issues -- there is less distortion.

Try adding a Cartesian image to the nadir or zenith (bottom or top) of the image and when rendered in a 360 viewer, will cause distortion of the overlaid nadir.

To solve this problem, you first need to convert the proposed nadir image into an equirectangular projection and adjust to match the width of the original panoramic image for it to display as intended.

## How to create your own nadir

Now you understand the problems associated with overlaying Cartesian projections on equirectangular projections, here's how to process a nadir to display correctly in a equirectangular image.

### Step 0: Download GIMP 2.10 (other programs are available)

You can make little planets in most graphical programs, including Adobe Photoshop.

In this example I'll us GIMP because it's completely free and easy to use.

[You can download it here](https://www.gimp.org/).

### Step 1: Create a nadir image

Aim to create a logo with a large resolution. For 4K images 500 pixels x 500 pixels will suffice.

If you want to create a circular image in the nadir, make sure to use a transparent background and to save as a `.png` image.

[Here are some example nadir logos](https://github.com/trek-view/nadir-patcher/tree/master/nadir-library).

I'll be using this one...

<img class="img-fluid" src="/assets/images/blog/2020-06-19/trek-view-circle-nadir.png" alt="Trek View Circle Nadir" title="Trek View Circle Nadir" />

### Step 2: Turn the nadir image into an equirectangular projection

Rotate the image 180 degrees (Image > Transform > Rotate 180).

<img class="img-fluid" src="/assets/images/blog/2020-06-19/gimp-nadir-equirectangular-conversion.jpg" alt="GIMP create equirectangular nadir polar coordinates" title="GIMP create equirectangular nadir polar coordinates" />

And create the equirectangular projection (Filters > Distorts > Polar Coordinates...).

In the Polar Coordinate options select:

* Circle depth in percent: 100
* Offset angle: 360
* Map backwards: false
* Map from top: false
* To polar: false

And select OK.

### Step 3: Overlay equirectangular nadir onto equirectangular photo

Now move to your equirectangular photo in GIMP and create a new layer on the image (Layer > New Layer).

Copy the square equirectangular nadir you've just generated in GIMP and paste onto the new layer created on your equirectangular photo.

Now we can adjust the width of the nadir to the width of the photo so that it appears as a circle again when loaded in a 360 viewer.

First find the size of the photo (Image > Image Properties).

The photo I'm using is 5760 x 2880.

Now we can scale the nadir. First make sure you are working on the correct layer of the image, the one with the nadir in.

<img class="img-fluid" src="/assets/images/blog/2020-06-19/gimp-nadir-equirectangular-conversion-2.jpg" alt="Add equirectangular nadir to equirectangular photo" title="Add equirectangular nadir to equirectangular photo" />

Then scale the image so that the width of the layer size matches the width of the equirectangular photo. Make sure to 'unlock' the aspect ratio, otherwise the height of the nadir will be increased by the same ratio.

You can also adjust the height of the nadir. The greater the height of the nadir overlay, the more area at the bottom of the image will be covered. As a general rule a nadir height of between 5% to 15% of the photo image height looks best.

Once adjusted, click scale. The overlaid nadir should now be as wide as the photo.

All that's left to do is to snap the nadir to the bottom and left of the photo (Tools > Transform Tools Align).

Now set it so that your nadir layer is aligned to your photo layer (target layer):

* Align left edge of target
* Align bottom edge of target

### Step 4: Export the result

Save the image (Export > Save).

Now open up the image in your favourite 360 viewer to check it's what you're expecting. Here's what mine looks like:

<iframe width="600" height="400" allowfullscreen style="border-style:none;" src="https://www.trekview.org/trekviewer.htm#panorama=https://www.trekview.org/assets/images/blog/2020-06-19/MULTISHOT_9698_000003-nadir.jpgg&amp;autoLoad=true"></iframe>

## Nadir Patcher (automated processing)

Using GIMP is perfect for one or two photos. For a tour of hundreds of 360's, you're going to need something a bit quicker.

That's where Nadir Patcher comes in.

It's a command line Python script that 1) takes logo file, 2) converts to equirectangular image, 3) transforms to desired size, and 4) overlays on-top of an equirectangular photo or video as a nadir.

It'll brand 100's of 360 photos with custom nadirs in under a minute.

[Download it for free here](https://github.com/trek-view/nadir-patcher).