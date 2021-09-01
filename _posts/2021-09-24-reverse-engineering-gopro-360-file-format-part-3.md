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

[After extracting the video tracks from GoPro's .360 format in last weeks post](/blog/2021/reverse-engineering-gopro-360-file-format-part-2), this week I wanted to go a bit deeper.

I knew there were duplicate pixels in the frames of the .360 video track. Although as you'll see, they're not easy to spot using the naked eye.

Track 0:

<img class="img-fluid" src="/assets/images/blog/2021-09-17/img1-track0.jpg" alt="GoPro EAC video frame top track 0" title="GoPro EAC video frame top track 0" />

Track 5:

<img class="img-fluid" src="/assets/images/blog/2021-09-17/img1-track5.jpg" alt="GoPro EAC video frame top track 5" title="GoPro EAC video frame top track 5" />

So I needed the help of software to identify and remove duplicate pixels.

Lucklily the team at Pixel8 had been through a similar excercise. [In reading their write up](https://pixel8earth.medium.com/a-user-centered-engineering-journey-to-escape-gopros-software-shackles-4369e84aa31e), they removed the duplicate pixels with a 3D library called [pyredner](https://github.com/BachiLi/redner) (a differentiable ray tracer).









fmpeg -i GS070135-dUxe_tYCTL0.mkv -r 1 mkv/img%d.jpg





Above, I've uploaded the output straight to YouTube without any metadata added to the video.


https://github.com/ytdl-org/youtube-dl/issues/15267

https://github.com/naver/egjs-view360/wiki/Supported-Projection-Type

So why did GoPro create the .360

After which