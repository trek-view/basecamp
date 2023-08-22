---
date: 2023-02-03
title: "360 Video Stabilisation: The Basics (part 1)"
description: "In this post I will share my initial research into the field of video stabilisation (as a layperson)."
categories: guides
tags: [YouTube, Meta, Mapillary, Facebook, GoPro, OpenSFM]
author_staff_member: dgreenwood
image: /assets/images/blog/2023-02-03/hybrid-3d-2d-stabilization.jpeg
featured_image: /assets/images/blog/2023-02-03/hybrid-3d-2d-stabilization.jpeg
layout: post
published: true
---

**In this post I will share my initial research into the field of video stabilisation (as a layperson).**

HyperSmooth is GoPro's in-camera stabilization and is available on HERO 7 Black cameras (and newer) and the MAX cameras.

Here's a great video of it in action...

<iframe width="560" height="315" src="https://www.youtube.com/embed/DEEBotPnd2c" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

See [1:09](https://youtu.be/DEEBotPnd2c?t=69) for a good comparison of HyperSmooth disabled, and HyperSmooth enabled (with horizon level also set).

Horizon level can be set on the camera pre-shoot on the MAX, and can also be done in post production using GoPro Player.

<img class="img-fluid" src="/assets/images/blog/2023-02-03/max-horizon-level.png" alt="GoPro MAX horizon level" title="GoPro MAX horizon level" />

<img class="img-fluid" src="/assets/images/blog/2023-02-03/gopro-player-horizon-level.png" alt="GoPro Player Horizon Level" title="GoPro Player Horizon Level" />

HyperSmooth must be set on the camera (it can't be applied post production, at least in GoPro Player);

<img class="img-fluid" src="/assets/images/blog/2023-02-03/max-hypersmooth.png" alt="GoPro MAX HyperSmooth" title="GoPro MAX HyperSmooth" />

Almost all camera manufacturers offer some version of stabilisation. Insta360 call their version FlowState.

<iframe width="560" height="315" src="https://www.youtube.com/embed/geMw1sn9XrA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Note, all on camera stabilisation is only available for regular video mode, and is not available for 360 video (more on that later).

There are third party tools that do a great job of stabilisation in post production too. Here's some nice before/after demos of stabilisation using Adobe After Effects.

<iframe width="560" height="315" src="https://www.youtube.com/embed/76AsZBuwBG0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Though like with everything on the blog, I wanted to figure out how this technology works (even if it's to a superficial level).

After authoring, [Automatic horizon and pitch leveling of GoPro 360 videos](/blog/roll-pitch-level-of-gopro-video-using-gpmf), I am fairly sure the Gyroscope, Accelerometer and Magnetometer samples are responsible for stabilisation. On the face of it, it makes perfect sense. If the camera is bouncing around, then these samples will fluctuate wildly. By calculating how much they are fluctuating, you can adjust the image frame accordingly.

## Video stabilisation 101

The brilliant Tom Scott has a good overview of video stabilisation (recorded in 2015);

<iframe width="560" height="315" src="https://www.youtube.com/embed/BgAdeuxkUyY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

In summary Tom talks through the evolution of post-processing stabilisation;

* fixed point: uses on or more control points to lock video (not good for lots of movement as hard to have consistent control points)
* de-shaker: uses all pixels to try and determine the movement of each pixel between frames and uses zooming/cropping/rotating to try and reduce movement. However, is not very good with newer cameras due to the way [rolling shutters work](/blog/what-is-global-shutter-rolling-shutter-360-cameras)
* subspace warp: attempts to warp various parts of the frame differently to stabilise the entire frame. [See Adobe docs for more information](https://helpx.adobe.com/uk/premiere-pro/using/stabilize-motion-warp-stabilizer-effect.html)
* YouTube: tries to map the frame in 3D (to see "behind" objects in frame) to try and smooth the movement. Full information in the research paper; [Auto-Directed Video Stabilization with Robust L1 Optimal Camera Paths](https://research.google.com/pubs/archive/37041.pdf)

Note, YouTube stabilisation has since been removed as a feature (source: [Google Support](https://support.google.com/youtube/thread/48224089/why-have-youtube-removed-the-stabilization-and-rotate-video-features?hl=en))

One comment on that video stood out to me;

<img class="img-fluid" src="/assets/images/blog/2023-02-03/youtube-tom-scott-stabilisation.png" alt="Tom Scott video stabilisation" title="Tom Scott video stabilisation" />

Turning to Wikipedia it seems stabilisation technology can be split into two categories...

The first; real-time stabilisation (e.g. GoPro HyperSmooth, Insta360 FlowState);

> Real-time digital image stabilization, also called electronic image stabilization (EIS), is used in some video cameras. This technique shifts the electronic image from frame to frame of video, enough to counteract the motion. It uses pixels outside the border of the visible frame to provide a buffer for the motion. This technique reduces distracting vibrations from videos by smoothing the transition from one frame to another.

Source: [Wikipedia](https://en.wikipedia.org/wiki/Image_stabilization#Digital_image_stabilization)

Looking more deeply at real-time stabilisation, it can be achieved in three ways: optical, sensor-shift and digital (as described above);

1. Optical stabilisation: systems are built into some lenses and work by incorporating a floating lens element, which moves to compensate for camera shakiness. Gyro-sensors detect and relay the motion to a microcomputer which controls motors that shift the floating element so as to counteract the movement of the camera.
2. Sensor-shift stabilisation: in-body, or sensor shift, stabilization works on the same principle as lens-based optical stabilization, though, in this case, the technology is built into the camera body. Gyros are again used to relay information about the cameras movement to a microprocessor which controls motors to move the cameras image sensor to compensate for shake or wobble.
3. Digital stabilisation: an in-camera version of the image stabilisation that is included with some non-linear editing software. Rather than using the full area of the cameras image sensing chip to record an image, a digital stabilization system only uses around 90 percent in the centre of the chip. When camera movement is detected, the portion of the image sensor used to record the image shifts in the opposite direction to compensate for the motion.

Note, optical, sensor-shift are always performed on camera.

Digital stabilisation can also be carried out in post stabilisation too (e.g. YouTube, Adobe Effects);

> Many video non-linear editing systems use stabilization filters that can correct a non-stabilized image by tracking the movement of pixels in the image and correcting the image by moving the frame. The process is similar to digital image stabilization but since there is no larger image to work with the filter either crops the image down to hide the motion of the frame or attempts to recreate the lost image at the edge through spatial or temporal extrapolation.

Source: [Wikipedia](https://en.wikipedia.org/wiki/Image_stabilization#Stabilization_filters)

The clear advantage of real-time stabilisation (in camera) is that the area outside of the frame can be used (because most sensors have a larger resolution than the resulting video, usually achieved through a slight enforced zoom). In post-processing, the same approach can be applied -- the resulting frame can be cropped -- although this often leads to non-standard video resolutions. For example, 1080p = 1920×1080. If you crop a frame from the camera in post to use 20 pixels on either size the resulting video is 1880x1040.

GoPro themselves have a nice write up of this here too, [The Hype Behind HyperSmooth](https://gopro.com/en/is/news/hero7-black-hypersmooth-technology).

> It proactively analyzes movement in real time, so the available stabilization margin is used in the best possible way – eliminating the shake you don’t want, while maintaining the subject you do want. This combined with our proprietary rolling shutter correction algorithm, allows HERO7 Black to deliver gimbal-like stabilization without the dreaded jello effect”.

The "stabilization margin" being the extra areas on the sensor.

It is interesting at the end they note "Zoom in for extremely shaky activities", as this will provide even more of a stabilization margin.

## GyroFlow (and some other research)

To get a feel for how digital stabilisation works, I'd recommend experimenting with a shaky video and some of the settings in [GyroFlow](https://gyroflow.xyz/).

<img class="img-fluid" src="/assets/images/blog/2023-02-03/gyroflow-with-graph.jpeg" alt="GyroFlow with Graph" title="GyroFlow with Graph" />

The graph at the bottom shows roll, pitch, and yaw (the movement) used by GyroFlow to digitally stabilise the video.

For more detailed research around stabilisation techniques I would recommend [this curated list of links](https://github.com/yaochih/awesome-video-stabilization).

One important thing to note, [GyroFlow and the links in the repository linked in the last sentence, do not work with 360 videos yet](https://docs.gyroflow.xyz/app/advanced-usage/360-cameras). My assumption is this is for a few reasons unique to 360's...

## 360 video stabilisation

When it comes to 360 video the stabilisation margin does exist, but it's much smaller. 360 cameras typically have an overlap between areas captured in the vision of their lenses (e.g. [the field of view on each of the GoPro Fusion lenses is about 190 degrees](/blog/gopro-fusion-fisheye-stitching-part-3)).

So if the camera was to first crop the input from both lenses, before stitching, the field of view will be reduced, thus [there will be fewer control points to work from](/blog/how-does-360-stitching-software-work), and as a result, the output quality after stitching the two videos might degrade (and the computation to account for cropping between frames would increase required power to stitch).

In 2016, [the Meta team showed off some of their 360 video stabilisation research](https://engineering.fb.com/2016/08/31/ai-research/360-video-stabilization-a-new-algorithm-for-smoother-360-video-viewing/) (note, many of the images are broken in that post, [luckily TechCrunch captured them here](https://techcrunch.com/2016/08/31/facebook-shows-commitment-to-video-with-new-360-video-stabilization-demo/)).

> The new technology combines traditional 2D motion models with 3D models and a new “deformed-rotation” model.

It's somewhat similar to the YouTube approach described by Tom Scott.

> The team decided to only use 3D analysis for key frames. Rather than equally spacing out the key frames, a tracker identifies specific frames with spikes in activity. Kopf explains that once the 3D reconstruction is applied, the system can differentiate rotational and translational camera motion. This effectively allows the final 2D optimization to be more effective. Once aligned, the key frames are locked and used as reference points. This is when the deformed-rotation model comes into play, and local deformations are fixed.

tl;dr;

1. extract key frames (where there are spikes in activity)
2. apply 3D reconstruction to those frames
3. analyse camera motion
4. identify control points between frames
5. apply the deformed-rotation model to smooth (or "stabilise") them.

This GIF explains it nicely;

<img class="img-fluid" src="/assets/images/blog/2023-02-03/06-hybrid-3d-2d-stabilization.gif" alt="Facebook 360 stabilisation" title="Facebook 360 stabilisation" />

Mapillary's (now part of Meta) [OpenSFM](https://opensfm.org/) provides a good explanation (and of course, implementation), as to how 3D positions of points in a frame can be determined.

<img class="img-fluid" src="/assets/images/blog/2023-03-02/openSFM.png" alt="Mapillary OpenSFM" title="Mapillary OpenSFM" />

OpenSfM finds the relative positions of images and creates smooth transitions between them. That process is called [Structure from Motion](https://en.wikipedia.org/wiki/Structure_from_motion). It works using photogrammetry by matching a few thousand points between images, and then figuring out the 3D positions of those points as well as the positions of the cameras simultaneously.

What's not clear to me with Meta's approach is if; recorded movement (in the telemetry) is used as an input to analyse motion (in addition to the visual motion detected)

[Almost all 360 cameras contain basic IMUs](/blog/360-camera-sensors-imu-accelerometer-gyroscope-magnetometer).

Using these sensors movement can be reported to a high-degree of precision using the sensors in the camera increasing the data available for the smoothing algorithms to make a highly accurate understand the amount of movement they need to adjust for.

Much of this telemetry can is now stored in metadata standards [CAMM](/blog/metadata-exif-xmp-360-video-files-camm-camera-motion-metadata-spec) and [GPMF](blog/metadata-exif-xmp-360-video-files-gopro-gpmd).

Both the YouTube and Facebook approaches were written up before these telemetry standards were adopted in consumer cameras, which makes me think at the time of writing, the algorithms detected movement using the only information available in the video (the pixels in each frame). I suspect in the (many) intervening years, many stabilisation algorithms use IMU data as an input.

## One final footnote (specifically for GoPro)

Another small takeaway from Meta's post (for the benefit of any GoPro employees reading)...

> Since our stabilized 360 videos are so smooth, they provide excellent source material for creating sped-up hyperlapse videos. Creating a 360 hyperlapse by simply dropping all but every nth frame in a sequence already looks great. However, a common element of hyperlapse videography is a smoothly balanced camera velocity. The varying camera velocity in the naively sped-up video clearly stands out, for example, when a skier stops repeatedly to take breaks while filming a skiing sequence. To simulate a constantly moving hyperlapse camera, we need to balance out the velocity temporally and skip over breaks.

This could be a feature for GoPro HyperLapase videos!

## Next up: a proof-of-concept implementation

In the next few months I am going to play around with my own implementations of post-processing 360 video stabilisation.

Expect to see one or two more posts in the future with a deep-dive into my work.