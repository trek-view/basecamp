---
date: 2022-06-10
title: "Using ffmpeg to dynamically adjust the yaw of GoPro 360 videos (Part 4)"
description: "Using calculated heading values to ensure videos are shown in 360 players facing the same direction as they were shot."
categories: developers
tags: [ffmpeg, yaw, pitch, roll, equirectangular, video, gopro studio]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-06-10/gopro-rpy-meta.jpg
featured_image: /assets/images/blog/2022-06-10/gopro-rpy-sm.jpg
layout: post
published: true
---

**Using calculated heading values to ensure videos are shown in 360 players facing the same direction as they were shot.**

Now that we have the heading values for each frame in the video ([see last weeks post](/blog/2022/calculating-heading-of-gopro-video-using-gpmf-part-2)), we can use them to adjust the yaw in our World Lock video to reverse the effect.

To do this, we can take exactly the same approach as I showed you for images in the post; [Adjusting the yaw of an equirectangular 360 photo using ImageMagick](/blog/2022/adjusting-yaw-equirectangular-images).

That is;

1. take the first heading reported in the calculated telemetry file, and assume that as the World Lock heading
2. calculate the yaw adjustment needed using the calculation `true heading` (reported in telemetry .json) - `World Lock heading` (calculated at step 1)
3. pass the value to ffmpeg

It's easy to align frames to heading values, because we have a `HEAD` value (heading in degrees) for each frame (with `date` and `cts` times) and the framerate of the video reported in the telemetry, so we just iterate through frames and `HEAD` values to make the adjustment.

I couldn't find any documentation referencing if the `v360` filter to say that it supports a time option so the process works by first extracting the frames and applying the filter to them one-by-one.

In summary my proposed ffmpeg workflow is as follows;

1. Extract all the frames in the video using ffmpeg
	* `ffmpeg -i <videopath> -r <frame_rate_str> -q:v 2 <extract_dir>/%9d.jpg`
2. Take the framerate information so I know each frames time to compare against cts value in the telemetry to get the right sensor value for each frame
3. Take the first frames heading from the telemetry `HEAD` stream (the World Lock heading)
4. Take the frames heading value from the telemetry `HEAD` stream
5. Calculate the delta (frame `HEAD` value - first frames `HEAD` value)
6. Adjust frames using ffmpeg `v360` filter with the `yaw` value to the delta calculated at step 5 for each frame
	* `ffmpeg -i <frame_path> -vf v360=input=e:e:<yaw:roll:pitch> <out_path>`
7. Rebuild the video from frames adjusted in the last step
	* `ffmpeg -y -r <frame_rate_str> -f concat -safe 0 -i images.txt -c:v libx264 -vf "fps=<frame_rate_str>,format=yuv420p" <out.mp4>`
7. Copy the other streams (audio and telemetry) to the newly processed video (with adjusted yaw)
	* [See my ffmpeg cheat sheet for how to do this](/blog/2022/ffmpeg-video-to-frame-cheat-sheet)

So, going back to our original World Lock video I built this proof-of-concept for:

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/3Hces_LyGZU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

And now, here it is after adjusting for World Lock (or as I like to call it, UnWorld Locked):

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/rZxu6p-ABJk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

It works!

However, you will notice it is shaky along the horizontal plane. This is likely due to noise registered by the sensors in the camera (gyroscope, accelerometer, and magnetometer) used to perform the adjustment calculations.

You can see a bit of that in the graphs shared last week, here's one for heading (note some jolts)

## High and low pass filters

One simple, and probably quite effective solution would be to implement a low and high pass filter on the telemetry values used to calculate roll, pitch, yaw and heading values from.

High and low pass filters, filter out or smooth the desired extreme frequencies (based and the high and low end values) found in the telemetry.

These types of filter are used by a lot of software, including the all current GoPro camera firmware and in GoPro's post-processing tools.

Though it sounds simple, this topic gets complex very quickly. If I wanted to, I could use post-processing to stabilise the video (as it still contains the original telemetry). Whilst I won't for this post, if I did, [Gyroflow in my limited experience is a useful tool for this (and supports a variety of cameras)](https://gyroflow.xyz/).

## Is dynamic yaw adjustment only useful for World Lock mode?

Unlike pitch and roll adjustments (that I will talk about next week), yaw is much more subjective. 

When World Lock mode is not used, yaw=0 will always be the direction the front lens is facing. 99% of the time this is fine.

The other use-case for dynamic yaw adjustment in non-World Lock modes is target fixation.

For example, lets say in my video I wanted the camera to stay fixed on a car. 

To do this, you need to know the position (GPS co-ordinates) of the object in relationship to the camera.

<img class="img-fluid" src="/assets/images/blog/2022-06-10/yaw-adjustment-target.jpg" alt="Yaw adjustment for target" title="Yaw adjustment for target" />

With these values, you can calculate the heading of the object. With true heading, and heading of the object you can then find the yaw offset (delta) value in the same way (`true heading` - `target heading`).

## tl;dr scripted proof-of-concept

The implementation discussed over the last 3 weeks was fully implemented by us as proof-of-concept code.

If you want to give it a try for yourself, [check out our GoPro RPY repository on GitHub](https://github.com/trek-view/gopro-rpy/), which will perform the UnWorld Lock process described earlier in this post.