---
date: 2021-10-01
title: "Reverse Engineering GoPro's 360 Video File Format (Part 4)"
description: "In the final part of this series, I convert a GoPro EAC projected frame into an equirectangular projection to be displayed in other software."
categories: guides
tags: [GoPro, equirectangular, EAC, ffmpeg, exiftool]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-10-01/gopro-eac-output-equirectangular-meta.jpg
featured_image: /assets/images/blog/2021-10-01/gopro-eac-output-equirectangular-sm.jpg
layout: post
published: true
---

**In the final part of this series, I convert a GoPro EAC projected frame into an equirectangular projection to be displayed in other software.**

[Last week I blended the overlapping pixels in .360 cubefaces](/blog/2021/reverse-engineering-gopro-360-file-format-part-3). For the final step, I need to convert into equirectangular frames (the most widely understood projection type in software for 360 images).

Luckily, [I discovered that Paul Bourke has published a significant amount of his work on converting to/from cubemaps](http://paulbourke.net/panorama/cubemaps/), as well as lots of other related works.

Taking inspiration from this work and with the help of Paul himself, MAX2sphere takes the 2 GoPro EAC tracks and converts them to equirectangular (as well as performing the blending mentioned last week).

Used in its simplest form for what we need:

```
$ @SYSTEM_PATH/MAX2sphere track0/img1.jpg track5/img1.jpg
```

All that's left to do now is add the correct metadata to the new equirectangular frame, all of which has been lost during processing.

For more details about injection metadata (most importantly telemetry), [read this post](/blog/2021/turn-360-video-into-timelapse-images-part-2/), but at a minimum, we need to add the `projectiontype` tag so the image is rendered correctly in 360 viewers.

```
exiftool -ProjectionType=equirectangular img1.jpg
```

And voila, we have a equirectangular frames from the `.360` file.

<iframe width="600" height="400" allowfullscreen style="border-style:none;" src="https://www.trekview.org/trekviewer.htm#panorama=https://www.trekview.org/assets/images/blog/2021-10-01/gopro-eac-output-equirectangular-sm.jpg&amp;autoLoad=true"></iframe>

Now, many of you might want a video, not frames. That is, after all, what GoPro Studio outputs.

In this case, we can rebuild a video from all the frames extracted:

```
ffmpeg -i FRAMES/%d.jpg -c:v libx264 -framerate 1 -pix_fmt yuv420p GS070135.mp4
```
_Note: I use a 1 second framerate, as we extracted 1 FPS at step one. Whatever framerate value selected during extraction should **probably** be used here._

Like the images, metadata will need to be written into the video to ensure video players read it correctly. Read my post, [Turn 360 photos into 360 videos](/blog/2021/turn-360-photos-into-360-video), to see how this can be done.

## tl;dr

1. Broke .360 down into 2 frames using ffmpeg ([see part 2](/blog/2021/reverse-engineering-gopro-360-file-format-part-2))
2. Blended cubefaces in each frame with overlapping pixels ([see part 3](/blog/2021/reverse-engineering-gopro-360-file-format-part-3))
3. Rebuilt each frame as a cubemap ([see part 3](/blog/2021/reverse-engineering-gopro-360-file-format-part-3))
4. Converted each cubemap to equirectangular frames and added metadata (this post)
5. Converted frames to a video and added metadata (this post)

## Future improvements

One feature missing is GoPro Studio's horizon leveling feature. It does this by automatically by analysing the frame and working out the horizon and then adjusting the [roll, pitch, and yaw](/blog/2020/yaw-pitch-roll-360-degree-photography). This is what things like PtGui (and others) do too. It is something I'm considering adding in the future.

For now though, these two options will turn your images or videos with GoPro EAC projections into equirectangular ones...

### 1. MAX2sphere (EAC frames to equirectangular frames)

MAX2sphere takes a raw GoPro .360 frame (both tracks of EAC projection) and converts them to a more widely recognised equirectangular projection.

[Download it here](https://github.com/trek-view/MAX2sphere).

### 2. FFMpeg (EAC video to equirectangular video)

[This fork of FFMpeg takes a .360 video and converts it to a h264 `.mp4` with an equirectangular projection](https://github.com/trek-view/FFmpeg).