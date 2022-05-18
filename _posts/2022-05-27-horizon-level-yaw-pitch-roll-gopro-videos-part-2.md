---
date: 2022-05-27
title: "Automatic horizon leveling of GoPro 360 videos (Part 2)"
description: "A proof-of-concept to dynamically adjust for camera roll in equirectangular videos."
categories: developers
tags: [ffmpeg, yaw, pitch, roll, equirectangular, video]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-05-27/
featured_image: /assets/images/blog/2022-05-27/
layout: post
published: false
---

**A proof-of-concept to dynamically adjust for camera roll in equirectangular videos.**

As touched on last week, in many cases roll needs to be adjusted for dynamically. 

Luckily, each GoPro has a accelerometer that gives us the information needed to perform these adjustments.

## Extracting Accelerometer telemetry

[Accelerometer telemetry can be extracted using gopro-telemetry](/blog/2022/gopro-telemetry-exporter-getting-started).

I'll use the same example video as last week that demonstrates left and right roll.

<iframe width="560" height="315" src="https://www.youtube.com/embed/lEHA91gu3TQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

[And here are the settings I used to extract the telemetry using gopro-telemetry](https://gist.github.com/himynamesdave/42c7724a65d931fe92a731c6fa64d21c), which creates a file `GS016143-accl-only.json` in the following format;

```json
{"1":
	{"streams":
		{"ACCL":
			{"samples":[
				{"value":[-9.741007194244604,0.8513189448441247,-2.1247002398081536],"cts":176.04,"date":"2022-05-17T13:34:47.234Z","sticky":
					{"temperature [°C]":26.7109375}
				},
```

[As documented in this post](/blog/2022/gopro-telemetry-exporter-getting-started), the values are reported in Meters per second for each axis in the order z,x,y.

<img class="img-fluid" src="/assets/images/blog/2022-05-27/CameraIMUOrientationSM.png" alt="GoPro IMU Orientation" title="GoPro IMU Orientation" />

For roll we're mainly interested in the `y` axis.

## Converting Acceleration to Roll

The accelerometer measures and tells you the amount of force (acceleration) it is experiencing in X, Y and Z direction.

Now, this data makes sense in orientation because of gravity. We know that if an object is not moving it will experience acceleration only due to gravity (neglect the other minimal forces).

The direction of gravitational force is always same with respect to the Earth’s frame but based on the orientation of IMU, it will experience different amount of acceleration along the three axes (this means you can't calculate roll using the horizontal (`x`) axis alone).

To calculate pitch using accelerometer values we can use the following calculation ([source](https://wiki.dfrobot.com/How_to_Use_a_Three-Axis_Accelerometer_for_Tilt_Sensing));

`roll = atan2(y_Buff , z_Buff) * 57.3`

(_57.3 converts radians to degrees -- 180 degrees/PI_).

So to calculate roll for the first point in the telemetry (shown above);

```
roll = atan2(-2.1247002398081536, -9.741007194244604) * (180/PI)


roll = -1.785551908873 * (180/PI)
roll = -102.30458848

```




acc_total_vector = sqrt((acc_x * acc_x) + (acc_y * acc_y) + (acc_z * acc_z))



angle_roll = asin(acc_y / acc_total_vector)



angle_pitch = asin(acc_x / acc_total_vector)



Now all that's needed is to calculate the same roll for each Accelerometer reading (2286 reported for the 11 second demo video).

This will give us a list of roll values and time.

## Adjusting roll dynamically

To account for roll we can just multiply the roll value by `-1` to get a roll offset value to create a level horizon.

In the last post I showed a real example of how to use the `v360` ffmpeg video filter to adjust roll. The command was structured like so;

```shell
ffmpeg -i INPUT.mp4 -vf v360=e:e:roll=ROLL_OFFSET -c:v libx265 OUTPUT.mp4
```

In this case, we need to pass the `ROLL_OFFSET` value based on the time of the video and roll value reported calculate previously.



