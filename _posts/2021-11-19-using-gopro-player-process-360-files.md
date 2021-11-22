---
date: 2021-11-19
title: "Using GoPro Player to Process .360's"
description: "The good, the bad, and the very, very slow."
categories: guides
tags: [GoPro, GoPro Studio, MAX, GMPF, GPMD, GPS, 360, mp4]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-11-19/gopro-player-processing.png
featured_image: /assets/images/blog/2021-11-19/gopro-player-processing-sm.png
layout: post
published: true
---

**The good, the bad, and the very, very slow.**

[I've talked before about how (and why) the GoPro Max, when using a 360 video mode, creates a `.360` file format of the recording](/blog/2021/reverse-engineering-gopro-360-file-format-part-1).

To convert a `.360` to a more widely understood codec (like `.mp4`) GoPro have built GoPro Player.

You can import the `.360` shot on your MAX, and select a variety of useful options during conversion, including;

* World lock: minimises the rotation in your footage with framing locked to the real world (if you aim at a target in the horizon, this target will never move during the reframing)
* Horizon level: levels your videos on the horizontal axis (very useful for backpack mounted cameras where they sway side-to-side whilst walking, like the [Trek Pack](/trek-pack))
* Mount optimisation: improves the stitch line underneath the camera at the ["Nadir”](/blog/2020/what-is-a-nadir). Applying this should remove views of the mount in the final video.
* 360 audio: creates a spherical audio track in final video versus a standard stereo audio track.
* Retain GPMF: retains the GPS data to the final `.mp4` (essential for street-level mapping)

<img class="img-fluid" src="/assets/images/blog/2021-11-19/gopro-player-options.png" alt="GoPro Player Export Options" title="GoPro Player Export Options" />

Though it's not perfect.

<img class="img-fluid" src="/assets/images/blog/2021-11-19/gopro-player-processing.png" alt="GoPro Player Processing" title="GoPro Player Processing" />

For one, it's very CPU intensive (requiring a well powered machine). On a 2.9GhZ i7 Macbook Pro with 16GB of RAM, it can take me 6 hours to process 2 hours of 5.6K `.360` video!

There are also many longstanding bugs in the software. For example, [the Windows version of GoPro Player still won't allow you to retain GMPF in the final video when exporting to H.264](https://community.gopro.com/t5/GoPro-Apps-for-Desktop/How-to-retain-GoPro-max-GPS/td-p/938860) -- this only works on the Mac version.

[In September we spent a long time researching the `.360` file format](/blog/2021/reverse-engineering-gopro-360-file-format-part-1). The result of the work was [a proof-of-concept script that could convert `.360`'s to equirectangular geotagged images](https://github.com/trek-view/gopro-frame-maker) (which could then be converted to a video).

The script doesn't offer the levelling functions of Studio, yet. Not including this feature means it's faster than GoPro Studio, but still pretty slow.

We're currently working on a new product, Explorer, that will allow you to upload your `.360`'s to the web app and it will then convert them for you in the backgroun on our cloud servers.

No more waiting hours for your computer to complete the conversions (and running very slow in the process). More info soon! Stay tuned by signing up for the newsletter below.