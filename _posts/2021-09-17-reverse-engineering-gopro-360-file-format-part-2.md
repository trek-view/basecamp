---
date: 2021-09-17
title: "Reverse Engineering GoPro's 360 Video File Format (Part 2)"
description: "Taking apart a .360 file to reveal its contents to try and understand how it can be processed (without GoPro software)."
categories: guides
tags: [GoPro]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-09-17/img-track0-5-grid-marked.jpg
featured_image: /assets/images/blog/2021-09-17/img-track0-5-grid-marked-sm.jpg
layout: post
published: false
---

**Taking apart a .360 file to reveal its contents to try and understand how it can be processed (without GoPro software).**

[Last week I looked at some of the theory behind the GoPro's proprietary .360 format]((/blog/2021/reverse-engineering-gopro-360-file-format-part-1). 

This week I'll use a video I shot on a [Trek Pack v2 (GoPro Max)](/trek-pack) to try and understand how to work with .360's in practice.

Here's a GoPro video shot at 6K / 30 FPS on the MAX camera.

<iframe width="560" height="315" src="https://www.youtube.com/embed/dUxe_tYCTL0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

It was uploaded to YouTube after being converted from .360 to .mp4 (EAC to equirectangular projection) in GoPro Studio. 

[You can download the mp4 file (GS070135.mp4) here](https://drive.google.com/open?id=1ZYyfeGyqtV2bnkRnWPXNlTUyau8fWer_&authuser=dgreenwood%40trekview.org&usp=drive_fs).

I can extract a frames from this .mp4 video with ffmpeg by following the instruction in my post; [Turning a 360 Video into Timelapse Images](/blog/2021/turn-360-video-into-timelapse-images-part-1).

For this example, I'll use 1 frame every second:

```
$ ffmpeg -i GS070135.mp4 -r 1 MP4-FRAMES/img%d.jpg
```

<img class="img-fluid" src="/assets/images/blog/2021-09-17/img1.jpg" alt="GoPro equirectangular video frame mp4" title="GoPro equirectangular video frame mp4" />

Above is the first frame (reduced in resolution for this post, original = 4096x2048) from the extraction, `img1.jpg`.

[Although it is equirectangular, I have not injected any spatial metadata (as described in the linked post) to this image file. Therefore, it won't render in a 360 viewer correctly](/blog/2021/turn-360-video-into-timelapse-images-part-2).


Now going back a step, let's look at the .360 file ([download it here](https://drive.google.com/open?id=1X_IRW-ut3yew97Ep3HkZ0DuZrZGzUsCW&authuser=dgreenwood%40trekview.org&usp=drive_fs)). 

We know from last weeks post, there are two video tracks in the file.

Running the command used before, e.g.

```
$ ffmpeg -i GS070135.360 -r 1 FRAMES/img%d.jpg
```

Would run, but would only extract one track. 

Looking at the metadata from a .360 file, you can see why:

```
$ exiftool -ee -G3 -api LargeFileSupport=1 -X GS070135.360 > GS070135-360.txt
```

Although it's a .360 file format, GoPro actually declare it as an .mp4:

```
<File:FileType>MP4</File:FileType>
<File:FileTypeExtension>mp4</File:FileTypeExtension>
<File:MIMEType>video/mp4</File:MIMEType>
```

[Full output here](https://drive.google.com/open?id=1YExyB30HwEJHLboW0cu2WKi6_xuEPsyg&authuser=dgreenwood%40trekview.org&usp=drive_fs).

Thus, the above command only looks for a single video track to extract (as mp4's typically contain a single video track).

Therefore we need to explictly define the tracks for extraction. In the case of .360's this is track 0 and 5:

```
$ ffmpeg -i GS070135.360 -map 0:0 -r 1 track0/img%d.jpg -map 0:5 -r 1 track5/img%d.jpg
```

Note, this extracts at 1 FPS (-r 1). You can also copy the video file from each track, if needed:

```
$ ffmpeg -i GS070135.360 -map 0:0 -vcodec copy -acodec copy track0.mp4 -map 0:5 -vcodec copy -acodec copy track5.mp4
```

Track 0:

<img class="img-fluid" src="/assets/images/blog/2021-09-17/img1-track0.jpg" alt="GoPro EAC video frame top track 0" title="GoPro EAC video frame top track 0" />

Track 5:

<img class="img-fluid" src="/assets/images/blog/2021-09-17/img1-track5.jpg" alt="GoPro EAC video frame top track 5" title="GoPro EAC video frame top track 5" />

Above is the first frame (reduced in resolution for this post, originals = 4096x1344) for each track of the extraction, `img1.jpg`.

<img class="img-fluid" src="/assets/images/blog/2021-09-17/img-track0-5-grid-marked.jpg" alt="GoPro EAC video frame top track 0 and 5 marked" title="GoPro EAC video frame top track 0 and 5 marked" />

[Download on Google Drawings here](https://docs.google.com/drawings/d/1DpMUfO6RL601SCuJfZ9uTiE0XcTBApLJssmOs2BcAZw/edit?usp=sharing).

Above are the two images in one track (0 at top, 5 at bottom). I have also added a grid to display each cube annotated with its direction and rotation.

You can create a video file of the two track jpgs in ffmpeg to get this frame like so:

```
$ ffmpeg -i GS070135.360 -filter_complex "[0:0]pad=4096:2688[put],[put][0:5]overlay=x=0:y=1344" GS070135-eac.mp4
```

<iframe width="560" height="315" src="https://www.youtube.com/embed/qIBc_s6W47I" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

But really this video is useless. In EAC (or GoPro EAC) projection, other software won't be able to read it. It needs to be converted to equirectangular.