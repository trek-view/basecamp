---
date: 2022-09-30
title: "Injecting Telemetry into Video Files (Part 4): CAMM"
description: "In this post I will the structure of Google's CAMM standard, how to create a CAMM binary, and how to inject it into a mp4 video file."
categories: developers
tags: [gpmd, camm, telemetry, gpmf, gpx]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-09-30/camm-case6-specification-meta.jpg
featured_image: /assets/images/blog/2022-09-30/camm-case6-specification-meta.jpg
layout: post
published: true
---

**In this post I will the structure of Google's CAMM standard, how to create a CAMM binary, and how to inject it into a mp4 video file.**

The CAMM specification is quite a bit simpler to GPMF in its design, so I've decided to take the conceptual knowledge from the last few weeks, and use CAMM as the first standard I will walk-through an example of writing telemetry.

GPMF will follow next week. 

In this post it will prove useful to have the [Google CAMM Specification](https://developers.google.com/streetview/publish/camm-spec) open as a reference.

## CAMM cases 

<img class="img-fluid" src="/assets/images/blog/2022-09-30/camm-case6-specification-meta.jpg" alt="CAMM Spec case6" title="CAMM Spec case6" />

First it is important to understand the CAMM cases, and the data they hold. Each CAMM case reports different types of data (closely linked to the types of sensors inside cameras);

### CAMM case 0

Reports the angle axis orientation in radians representing the rotation from local camera coordinates to a world coordinate system.

```json
{"angle_axis": [0.9989318521683401,-0.024964140751365705,0.02621539963988159]}
```

### CAMM case 1 

Reports lens data and is recorded per video frame. 

```json
{"pixel_exposure_time": 100, "rolling_shutter_skew_time": 50}
```

### CAMM case 2

Reports Gyroscope samples. 

```json
{"gyro": [0.9989318521683401,-0.024964140751365705,0.02621539963988159]}
```

### CAMM case 3

Reports Accelerometer samples.

```json
{"acceleration": [0.9989318521683401,-0.024964140751365705,0.02621539963988159]}
```

### CAMM case 4 

Reports 3D position of the camera.

```json
{"position": [0.9989318521683401,-0.024964140751365705,0.02621539963988159]}
```

### CAMM case 5

Reports basic GPS samples. 

```json
{"latitude": 51.2725595, "longitude": -1.5853544, "altitude": 183.94700622558594}
```

### CAMM case 6

Reports richer GPS samples than CAMM case 5 (when available).

```json
{"time_gps_epoch": "2021-09-04T07:25:17.352000Z", "gps_fix_type": 3, "latitude": 51.2725595, "longitude": -1.5853544, "altitude": 183.94700622558594, "horizontal_accuracy": 0, "vertical_accuracy": 0, "velocity_east": 0, "velocity_north": 0, "velocity_up": 0, "speed_accuracy": 0}
```

### CAMM case 7

Reports the ambient magnetic field. 

```json
{"magnetic_field": [0.9989318521683401,-0.024964140751365705,0.02621539963988159]}
```



## Writing the `moov` `trak` data

I will start with what we covered last week the `co64`, `stsc`, `stsz`, and `stts` boxes.

### `co64` box (chunk offset box)

Here's what we know about all CAMM samples written into an `mdat` box based on the specifications;

* CAMM case 0 (angle axis orientation): each sample is 16 bytes (3 `float` values of 4 bytes + 4 byte header)
* CAMM case 1 (lens data): each sample is 12 bytes (2 `int32` values of 4 bytes + 4 byte header)
* CAMM case 2 (gyroscope): each sample is 16 bytes (3 `float` values of 4 bytes + 4 byte header)
* CAMM case 3 (accelerometer): each sample is 16 bytes (3 `float` values of 4 bytes + 4 byte header)
* CAMM case 4 (3D position): each sample is 16 bytes (3 `float` values of 4 bytes + 4 byte header)
* CAMM case 5 (basic GPS samples): each sample is 28 bytes (3 `double` values of 8 bytes + 4 byte header)
* CAMM case 6 (rich GPS samples): each sample is 60 bytes (3 `double` values of 8 bytes + 1 `int32` value of 4 bytes + 7 `float` values of 4 bytes + 4 byte header)
* CAMM case 7 (ambient magnetic field): each sample is 16 bytes (3 `double` values of 8 bytes + 4 byte header)

We can be sure of the byte sizes of each CAMM case sample will be the same as shown above, as all field values must be reported in the payload.

As mention previously, not all case types need to be present in telemetry. For example, if the device logging the data only has an accelerometer, only case 3 data could be reported.

The data we wrote into the `mdat` was 6 CAMM case 6 samples (each of 60 bytes).

We also know that there are 24 bytes of video.

Therefore the offset in bytes to the first telemetry is 24, the second 84 (60 bytes of telemetry in first sample + 24 bytes of video), 144, 204, 264, 324, and 384 bytes to the final telemetry point.

To give a chunk offset table that looks like this;

```
24
84
144
204
264
324
384
```

Last week I glossed over the other 5 data elements that make up the `co64` box in addition to the chunk offset table (above);

* atom size (32-bit integer): the total size in bytes of this atom, always `4`
* type (32-bit integer): sets the box type, always `stco`
* version (1-byte specification): default `0`, if version is 1 then date and duration values are 8 bytes in length
* flags (3-byte space): always set to `0`
* number of entries (32-bit integer): number of entries in the chunk offset table, above is `7`





To demonstrate this I'll turn to another script in the Telemetry Injector repository I introduced in the second post in this series. Once in the tools folder, you can run the `print_video_atoms_detail.py`. Let's try that on a sample CAMM video (`200619_161801314.mp4`);

```shell
python3 print_video_atoms_detail.py 200619_161801314.mp4 > 200619_161801314-atom-detail.txt
```

Now there's lots to this file, [but head to line 590](https://gist.github.com/himynamesdave/0525dd51c251990cb85a176a9e2ca3fc#file-200619_161801314-atom-detail-txt-L590).

Here the script prints the content of the telemetry `trak`.

TODO -- WHY DOES SCRIPT NOT PRINT ALL DATA ELEMENTS INSIDE THE TELEMETRY RACK? NEED TO FIX THIS IF MISSING

Now your next question will be, now you have all the data elements for the `co64` box; how do you structure them and write them into the box?

TODO -- WALKTHROUGH EXAMPLE OF HOW THIS IS DONE.















