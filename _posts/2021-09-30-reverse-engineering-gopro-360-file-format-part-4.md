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



cubefaces/left_img1.jpg 







convert  background.jpg  tool_marker.png -geometry +50+50 -composite result4.jpg

Create 




convert -crop 1376x1344+0+0 img1.jpg -rotate -90 top_img1.jpg




And then extract the frames, as shown at the start of this post.

You can see the left, down, right and up facing images clerly show the stitch line which GoPro remove during the blending process in post processing using GoPro Player (Mac) / MAX Exporter (Windows) (to create mp4).

Now you might be wondering about the resolution of this dual track being 4096x2688, when infact the resulting mp4 is 4096x2048 (that is an extra height of 640 pixels (2688-2048.

My assumption is that these are duplicate pixels that are used for image alignment in GoPro's software, but more on that next week.

I suspected there were duplicate pixels in the frames of the .360 video track to blend the images. Although as you'll see, they're almost impossible to spot using the naked eye.

Track 0:

<img class="img-fluid" src="/assets/images/blog/2021-09-17/img1-track0.jpg" alt="GoPro EAC video frame top track 0" title="GoPro EAC video frame top track 0" />

Track 5:

<img class="img-fluid" src="/assets/images/blog/2021-09-17/img1-track5.jpg" alt="GoPro EAC video frame top track 5" title="GoPro EAC video frame top track 5" />

So I needed the help of software to identify and remove duplicate pixels.

First, I wanted to break up each EAC projection into 3 cubes.

convert -crop 1280x1024+0+0       $1 -flip -resize 1280x1280\!             frame_l.tga
convert -crop 1280x1024+1280+0    $1 -flip -resize 1280x1280\!             frame_f.tga
convert -crop 1280x1024+2560+0    $1 -flip -resize 1280x1280\!             frame_r.tga
convert -crop 1280x1024+0+1024    $1 -flip -rotate -90 -resize 1280x1280\! frame_d.tga
convert -crop 1280x1024+1280+1024 $1 -flip -rotate  90 -resize 1280x1280\! frame_b.tga
convert -crop 1280x1024+2560+1024 $1 -flip -rotate -90 -resize 1280x1280\! frame_t.tga 

Once 









fmpeg -i GS070135-dUxe_tYCTL0.mkv -r 1 mkv/img%d.jpg





Above, I've uploaded the output straight to YouTube without any metadata added to the video.


https://github.com/ytdl-org/youtube-dl/issues/15267

https://github.com/naver/egjs-view360/wiki/Supported-Projection-Type

So why did GoPro create the .360

After which