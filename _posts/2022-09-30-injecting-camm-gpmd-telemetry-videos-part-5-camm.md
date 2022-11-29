---
date: 2022-09-30
title: "Injecting Telemetry into Video Files (Part 5): CAMM"
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

The CAMM specification is quite a bit simpler to GPMF in its design. In fact, you're probably pretty familiar with it aleady from the examples in the previous weeks. In this post I will go into a bit more detail.  

It will prove handy to have a copy of [Google's CAMM Specification](https://developers.google.com/streetview/publish/camm-spec) open as a reference.

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

## What we know about CAMM cases

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

As mention previously, not all case types need to be present in telemetry. For example, if the device logging the data only has an accelerometer, only CAMM case 3 data could be reported.

Similarly, the more sensors a camera has, the more cases that are reported. On 360 cameras you will often see case 2, 3 and 6 reported.

## Writing CAMM metadata in `moov`

[Last week](/blog/2022/injecting-camm-gpmd-telemetry-videos-part-4-mp4-writing-telemetry-trak) I wrote into the `mdat` media 6 CAMM case 6 samples (each of 60 bytes). I also showed you how to write the data in the `stbl` box, and all its nested boxes.

All thats left to write is the following boxes inside the `trak` box;

```
     ├── b'trak' [8, 6989]
     │   ├── b'tkhd' [8, 84]
     │   ├── b'tapt' [8, 60]
     │   ├── b'edts' [8, 28]
     │   ├── b'mdia' [8, 6331]
     │   │   ├── b'mdhd' [8, 24]
     │   │   ├── b'hdlr' [8, 41]
     │   │   └── b'minf' [8, 6242]
     │   │       ├── b'vmhd' [8, 12]
     │   │       ├── b'hdlr' [8, 48]
     │   │       ├── b'dinf' [8, 28]
```

Let's work from the bottom of the tree upwards.

### dinf

### hdlr

### vmhd






