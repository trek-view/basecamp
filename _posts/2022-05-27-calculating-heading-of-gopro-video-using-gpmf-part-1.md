---
date: 2022-05-27
title: "Using ffmpeg to dynamically adjust the yaw of GoPro 360 videos (Part 1)"
description: "Understand the telemetry needed to ensure your 360 videos are loaded in 360 players facing the same direction as they were shot."
categories: developers
tags: [ffmpeg, yaw, pitch, roll, equirectangular, video, gopro studio]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-05-27/gopro-cori-telemetry-example-meta.jpg
featured_image: /assets/images/blog/2022-05-27/gopro-cori-telemetry-example-sm.jpg
layout: post
published: true
---

**Understand the telemetry needed to ensure your 360 videos are loaded in 360 players facing the same direction as they were shot.**

Did you see my post last week?; [Adjusting the yaw of an equirectangular 360 photo using ImageMagick](/blog/2022/adjusting-yaw-equirectangular-images).

The example used extracted equirectangular frames. However, in the case of videos there are more efficient ways to achieve the same thing, as I'll show you in this post.

Assuming the yaw is off by a fixed direction during the video, for example the camera was facing the wrong direction or the monopod was angled slightly left or right for the duration of the video, this is quite easy using ffmpeg.

I'll use the same World Lock example video from last week.

Here it is before yaw adjustment:

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/3Hces_LyGZU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

The `v360` filter takes a fixed `yaw` values to apply to all frames like so;

```shell
ffmpeg -i GS010013-worldlock.mp4 -vf v360=e:e:yaw=180 -c:v libx265 GS010013-worldlock-yaw180.mp4
```

* `v360` : filter name
  * `e` : abbreviation for "equirectangular" (this is the input format)
  * `e` : abbreviation for "equirectangular" (this is the desired output format)
  * `yaw`: horizontal center of equirectangular output [`0` - `360`] relative to current yaw (`0`)

_Don't forget to copy over global metadata too (the above ffmpeg command will only copy streams):_

```shell
exiftool -TagsFromFile GS010013-worldlock.mp4 "-all:all>all:all" GS010013-worldlock-yaw180.mp4
```

And the result:

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/sBFqLfqVLQQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

See how the video now faces in the opposite direction, because the yaw has been offset in each video frame by 180 degrees.

## A note on `XMP-GSpherical` metadata tags

A better way to account for fixed yaw offset is to use the [`XMP-GSpherical` `InitialViewHeadingDegrees` video metadata tag](https://exiftool.org/TagNames/XMP.html#GSpherical) to achieve the same result.

The `InitialViewHeadingDegrees` determines the starting yaw of the camera. It will default to the center of the image. However, if you know there is a fixed offset you can account for it here.

So using my previous example, I could set `XMP-GSpherical:InitialViewHeadingDegrees` to 180  and the video would play in the viewer in the same way as my ffmpeg processed video above (without any need for post-processing). 

End note.

Of course, in either case this does not my video processed in World Lock mode. Unlike a fixed offset for yaw, the World Lock offset is dynamic with each frame.

Luckily for us, the GoPro GPMD telemetry allows us to calculate true heading for each frame in the video. 

[I've talked about extracting GoPro telemetry previously with regards to GPS points](/blog/2022/gopro-telemetry-exporter-getting-started).

[The GPMD telemetry includes a whole host of data](/blog/2022/evolution-of-gopro-camera-sensors-gpmf), including `MAGN` (values recorded by the cameras Magnetometer) and `CORI` (Camera Orientation).

For reference here is the GoPro sensor axis configuration for the sensors;

<img class="img-fluid" src="/assets/images/blog/2022-05-27/CameraIMUOrientationSM.png" alt="GoPro Camera Axis Orientation" title="GoPro Camera Axis Orientation" />

* `x` = pitch
* `y` = roll
* `z` = yaw

### `CORI` (Camera orientation values)

In GMPD, Camera orientation is a relative measurement (the orientation relative to the orientation the sensor had when the acquisition started), as opposed to an absolute measurement (like orientation to magnetic north).

The first `CORI` value for our example World Lock video (`GS010013-worldlock.mp4`) looks like this ([extracted using gopro-telemetry](/blog/2022/gopro-telemetry-exporter-getting-started));

```json
"CORI":{
  "samples":[{
    "value":[0.9989318521683401,-0.024964140751365705,0.02621539963988159,0.029206213568529312],
    "cts":176.62,
    "date":"2022-05-26T08:35:42.485Z",
    "sticky":{
      "VPTS":1261037}
    },
```

The values shown (`0.9989318521683401,-0.024964140751365705,0.02621539963988159,0.029206213568529312`) are Quaternions.

Quaternions contain 4 scalar variables  (sometimes known as Euler Parameters not to be confused with Euler angles). For GoPro cameras these are printed in the following axis order; `w`,`x`,`y`,`z` (according to this thread](https://github.com/gopro/gpmf-parser/issues/100). `w` is a scalar that stores the rotation around the vector.

I won't try explaining Quaternions here, but recommend this video which helped me to understand the concept and why they're needed (because of Gimbal Lock):

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/zjMuIxRvygQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

I'd also recommend this post on the subject; [How to think about Quaternions](https://scriptinghelpers.org/blog/how-to-think-about-quaternions).

Camera Orientation (Quaternions) is reported at the same frame rate as the video (which can vary depending on what framerate setting was set on the camera, and is also reported in the telemetry as `"frames/second"`).

The relative Quarternation samples can therefore be used to calculate absolute yaw, pitch, and roll angles for each frame in the video.

### `MAGN` (Magnetometer values)

The first `MAGN` value for our original example video (`GS010013-worldlock.mp4`) looks like this ([extracted using gopro-telemetry](/blog/2022/gopro-telemetry-exporter-getting-started));


```json
"MAGN":{
	"samples":[{
		"value":[-4,88,27],
		"cts":163.461,
		"date":"2022-05-26T08:35:42.485Z"
	},
```

Values from the Magnetometer are reported in the axis order `z` (yaw),`x` (pitch),`y` (roll) in MicroTeslas. 

MicroTeslas measure magnetic flux density (often referred to as the magnetic fields).

`MAGN` samples are taken at an approximate frequency of 24Hz (which can be less than the framerate of the video -- thus, not each frame has a directly corresponding `MAGN` measurement).

Using the `x`, `y` components of Magnetometer samples in addition to the yaw and pitch angles calculated from the `CORI` samples, we can calculate the absolute degrees the camera was facing from magnetic North (it's heading).

## Calculating pitch, roll and yaw

Stay tuned for part 2 of this post next week showing a proof-of concept to calculate these values, and how to use the calculated yaw value to dynamically the adjust the yaw of each frame in ffmpeg.

## Update 2022-06-03

[Using ffmpeg to dynamically adjust the yaw of GoPro 360 videos (Part 2)](/blog/2022/calculating-heading-of-gopro-video-using-gpmf-part-2).