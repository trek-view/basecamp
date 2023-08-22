---
date: 2022-06-10
title: "Using ffmpeg to dynamically adjust the yaw of GoPro 360 videos (Part 3)"
description: "Using calculated heading values to ensure videos are shown in 360 players facing the same direction as they were shot."
categories: developers
tags: [ffmpeg, yaw, pitch, roll, equirectangular, video, gopro studio]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-06-10/gopro-rpy-meta.jpg
featured_image: /assets/images/blog/2022-06-10/gopro-rpy-sm.jpg
layout: post
published: true
redirect_from:
  - /blog/2022/calculating-heading-of-gopro-video-using-gpmf-part-3
---

**Using calculated heading values to ensure videos are shown in 360 players facing the same direction as they were shot.**

Now that we have the heading values for each frame in the video ([see last weeks post](/blog/calculating-heading-of-gopro-video-using-gpmf-part-2)), we can use them to adjust the yaw in our World Lock video to reverse the effect.

To do this, we can take exactly the same approach as I showed you for images in the post; [Adjusting the yaw of an equirectangular 360 photo using ImageMagick](/blog/adjusting-yaw-equirectangular-images).

That is;

1. take the first heading reported in the calculated telemetry file, and assume that as the World Lock heading
2. calculate the yaw adjustment needed using the calculation `true heading` (reported in telemetry .json) - `World Lock heading` (calculated at step 1) for each frame
3. use this value with ffmpeg to adjust yaw

It's easy to align frames to heading values, because we have a `HEAD` value (heading in degrees) for each frame (with `date` and `cts` times) reported in the updated telemetry file. All that's needed is to iterate through frames and `HEAD` values to make the yaw adjustment.

I couldn't find any documentation referencing if the `v360` filter supports a time option, so our implementation works by first extracting the frames and applying the filter to them one-by-one.

My proposed ffmpeg workflow is as follows;

1. Extract all the frames in the video using ffmpeg
	* `ffmpeg -i <videopath> -r <frame_rate_str> -q:v 2 <extract_dir>/%9d.jpg`
2. Take the framerate information to compare against `cts` values in the telemetry to get the right sensor value for each frame
3. Take the first frames heading from the telemetry `HEAD` stream (the World Lock heading)
4. Take each frames heading value from the telemetry `HEAD` stream
5. Calculate the delta (frame `HEAD` value - first frames `HEAD` value)
6. Adjust each frame using ffmpeg `v360` filter with the `yaw` `Z` value set to the delta calculated at step 5 for each frame
	* `ffmpeg -i <frame_path> -vf v360=input=e:e:yaw=Z <out_path>`
7. Rebuild the video from frames adjusted in the last step
	* `ffmpeg -y -r <frame_rate_str> -f concat -safe 0 -i images.txt -c:v libx264 -vf "fps=<frame_rate_str>,format=yuv420p" <out.mp4>`
7. Copy the other video streams (audio and telemetry) to the newly processed video (with adjusted yaw) from the original video
	* [See my ffmpeg cheat sheet for how to do this](/blog/ffmpeg-video-to-frame-cheat-sheet)

Reviewing the original World Lock video I built this proof-of-concept for:

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/3Hces_LyGZU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

And now, here it is after adjusting for World Lock (or as I like to call it, UnWorld Lock):

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/nCFRQ0pFDNc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

It works!

However, you will notice it is shaky along the horizontal plane.

This is likely due to noise registered by the sensors in the camera (gyroscope, accelerometer, and magnetometer) used to perform the adjustment calculations shown below:

<img class="img-fluid" src="/assets/images/blog/2022-06-10/GS010013-worldlock-RPY.png" alt="GS010013-worldlock roll pitch yaw" title="GS010013-worldlock roll pitch yaw" />

<img class="img-fluid" src="/assets/images/blog/2022-06-10/GS010013-worldlock-heading.png" alt="GS010013-worldlock heading" title="GS010013-worldlock heading" />

## High and low pass filters

One simple, and probably quite effective solution would be to implement a low and/or high pass filter on the telemetry values used to calculate roll, pitch, yaw and heading values.

High and low pass filters, filter out or smooth the desired extreme frequencies (based and the high and low end values) found in the telemetry.

These types of filter are used by a lot of software, including the all current GoPro camera firmware and in GoPro's post-processing tools.

Though it sounds simple, this topic gets complex very quickly. If I wanted to, I could use post-processing to stabilise horizontal jitter in the video (using the original telemetry). Whilst I won't for this post, if I did, [Gyroflow, in my limited experience, is a useful tool for non-360 action cameras (and supports a variety of cameras)](https://gyroflow.xyz/).

## Is dynamic yaw adjustment only useful for World Lock mode?

When World Lock mode is not used, yaw=0 will always be the direction the front lens is facing. 

Many smoothing algorithms that stabilise the footage, for example GoPro's Hypersmooth, use yaw (`z`), roll (`y`), and pitch (`x`) as inputs. Having the whole panorama available means these algorithms can take advantage of these three planes combined to create the smoothest visual output.

The other main use-case for dynamic yaw adjustment in non-World Lock modes is target fixation, a technique that is becoming increasingly popular.

For example, lets say in my video I wanted the camera to stay fixed on a car as I moved.

To do this, you need to know the position (GPS co-ordinates) of the object in relationship to the camera.

<img class="img-fluid" src="/assets/images/blog/2022-06-10/yaw-adjustment-target.jpg" alt="Yaw adjustment for target" title="Yaw adjustment for target" />

With these values, you can calculate the heading of the object from each frame.

With actual heading for each frame, and heading of the object you can then find the yaw offset (delta) value in the same way (`actual heading` - `target heading`).

## tl;dr scripted proof-of-concept

The implementation discussed over the last 3 weeks was fully implemented by us as proof-of-concept code.

If you want to give it a try for yourself, [check out our GoPro RPY repository on GitHub](https://github.com/trek-view/gopro-rpy/), which will perform the UnWorld Lock process described using the following command;

```shell
python3 main.py TELEMETRY.json --plot true --video_input VIDEO.mp4 --mode unworldlock
```