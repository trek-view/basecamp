---
date: 2022-04-08
title: "The Evolution of GoPro Camera Sensors"
description: "And the data they produce in the GPMF streams."
categories: developers
tags: [exiftool, ffmpeg, gmpd, telemetry, metadata, gpmf]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-04-08/GOPRO_MAX_Teardown-meta.jpg
featured_image: /assets/images/blog/2022-04-08/GOPRO_MAX_Teardown-sm.jpg
layout: post
published: true
---

**And the data they produce in the GPMF stream.**
 
Videos shot on GoPro HERO5 (and newer), Fusion, and MAX cameras all contain a GPMF telemetry track in their metadata.

The GPMF track (often referred to as a stream) contains various sensor telemetry from the camera, depending on the camera, model, settings and accessories used.

Generally, the newer the GoPro, the more telemetry available and in some cases, improved. Watch out for the latter where sensor values between different cameras are sometimes printed in different orders and with different units.

In this post I take a look at the sensor streams available by camera, and that can be extracted using tools like gopro-telemetry [(explained here)](/blog/2022/gopro-telemetry-exporter-getting-started).

### HERO5 Black and Session 

| ID | Property | approximate frequency (Hz) | SIUN or UNIT | Comment |
| --- | --- | --- | --- | --- |
| ACCL | 3-axis accelerometer | 200 | m/s² | Data order Z,X,Y  |
| GYRO | 3-axis gyroscope | 400 | rad/s | Data order Z,X,Y |
| ISOG | Image sensor gain | 24, 25 or 30 (based video frame rate) | n/a | HERO5 v2 or greater firmware |   
| SHUT | Exposure time | 24, 25 or 30 (based video frame rate) | s | HERO5 v2 or greater firmware |  

### HERO5 Black with GPS Enabled Adds

| ID | Property | approximate frequency (Hz) | SIUN or UNIT | Comment |
| --- | --- | --- | --- | --- |
| GPS5 | latitude, longitude, altitude (WGS 84), 2D ground speed, and 3D speed | 18 | deg, deg, m, m/s, m/s |  |  
| GPSU | UTC time and data from GPS | 1 | n/a | Within the GPS stream |  
| GPSF | GPS Fix | 1 | n/a | Within the GPS stream: 0 - no lock, 2 or 3 - 2D or 3D Lock |  
| GPSP | GPS Precision - Dilution of Precision (DOP x100) | 1 | n/a | Within the GPS stream, under 500 is good |

_[Wikipedia has a very helpful page on GPSP (or DOP) here](https://en.wikipedia.org/wiki/Dilution_of_precision_(navigation))_

### Fusion Adds and Changes

| ID | Property | approximate frequency (Hz) | SIUN or UNIT | Comment |
| --- | --- | --- | --- | --- |
| ACCL | 3-axis accelerometer | 200 | m/s² | Data order -Y,X,Z |
| GYRO | 3-axis gyroscope | 3200 | rad/s | Data order -Y,X,Z |
| STMP | microsecond timestampes | 1 | µs | Increased precision for post stablization | |
| MAGN | magnetometer  | 24 | µT | Camera pointing direction |
| ISOG | Image sensor gain | increased to 60 | n/a | per frame exposure metadata |   
| SHUT | Exposure time | increased to 60 | s | per frame exposure metadata | 

### HERO6 Black Adds and Changes, Otherwise Supports All HERO5 metadata

| ID | Property | approximate frequency (Hz) | SIUN or UNIT | Comment |
| --- | --- | --- | --- | --- |
| ACCL | 3-axis accelerometer | 200 | m/s² | Data order Y,-X,Z |
| GYRO | 3-axis gyroscope | 200 | rad/s | Data order Y,-X,Z |
| FACE | Face detection boundaring boxes | 12, 12.5 or 15 (based video frame rate) | n/a | struct ID,x,y,w,h -- not supported in HEVC modes |
| FCNM | Faces counted per frame| 12, 12.5 or 15 (based video frame rate) | n/a | Not supported in HEVC modes |
| ISOE | Sensor ISO | 24, 25 or 30 (based video frame rate) | n/a | replaces ISOG, has the same function |   
| ALLD | Auto Low Light frame Duration | 24, 25 or 30 (based video frame rate) | n/a | ALL extended exposure time |
| WBAL | White Balance in Kelvin |  24, 25 or 30 (based video frame rate) | n/a | Classic white balance info |
| WRGB | White Balance RGB gains |  24, 25 or 30 (based video frame rate) | n/a | Geeky white balance info |

### HERO7 Black (v1.8) Adds, Removes, Changes, Otherwise Supports All HERO6 metadata

| ID | Property | approximate frequency (Hz) | SIUN or UNIT | Comment |
| --- | --- | --- | --- | --- |
| FACE | Face boxes and smile confidence | at base frame rate 24/25/30 | n/a | struct ID,x,y,w,h,unused[17],smile |
| FCNM | removed| n/a | n/a |  |
| YAVG | Luma (Y) Average over the frame | 8 - 10 | n/a | range 0 (black) to 255 (white) |
| HUES | Predominant hues over the frame | 8 - 10 | n/a | struct ubyte hue, ubyte weight, HSV_Hue = hue x 360/255 |
| UNIF | Image uniformity | 8 - 10 | range 0 to 1.0 where 1.0 is a solid color |
| SCEN | Scene classifier in probabilities | 8 - 10 | n/a | ID scenes: SNOW, URBAn, INDOor, WATR, VEGEtation, BEACh |
| SROT | Sensor Read Out Time | at base frame rate 24/25/30  | n/a | this moves to a global value in HERO8 |

### HERO8 Black (v2.5) Adds, Removes, Changes, Otherwise Supports All HERO7 metadata

| ID | Property | approximate frequency (Hz) | SIUN or UNIT | Comment |
| --- | --- | --- | --- | --- |
| CORI | Camera ORIentation | frame rate | n/a | Quaternions for the camera orientation since capture start |
| IORI | Image ORIentation | frame rate | n/a | Quaternions for the image orientation relative to the camera body |
| GRAV | GRAvity Vector | frame rate | n/a | Vector for the direction for gravitiy |
| WNDM | Wind Processing | 10Hz | n/a | marks whether wind processing is active |
| MWET | Microphone is WET | 10Hz | n/a | marks whether some of the microphones are wet |
| AALP | Audio Levels | 10Hz | dBFS | RMS and peak audio levels in dBFS |

### GoPro MAX (v2.0) Adds, Removes, Changes, Otherwise Supports All HERO7 metadata

| ID | Property | approximate frequency (Hz) | SIUN or UNIT | Comment |
| --- | --- | --- | --- | --- |
| CORI | Camera ORIentation | frame rate | n/a | Quaternions for the camera orientation since capture start |
| IORI | Image ORIentation | frame rate | n/a | Quaternions for the image orientation relative to the camera body |
| GRAV | GRAvity Vector | frame rate | n/a | Vector for the direction for gravity |
| DISP | Disparity track (360 modes) | frame rate | n/a | 1-D depth map for the objects seen by the two lenses |
| MAGN | MAGNnetometer | 24 | µT | Camera pointing direction x,y,z (valid in v2.0 firmware.) |

### HERO9 & HERO10 Black Adds, Removes, Changes, Otherwise Supports All HERO8 metadata

| ID | Property | approximate frequency (Hz) | SIUN or UNIT | Comment |
| --- | --- | --- | --- | --- |
| MSKP | Main video frame SKiP | frame rate | n/a | GoPro internal usage. Number frames skips or duplicated from sensor image captured to encoded frame. Normally 0. This is used for visual effects when precision timing of the video frame is required. |
| LSKP | Low res video frame SKiP | frame rate | n/a | GoPro internal usage. Same as MSKP for the LRV video file (when present.) This improves sync with the main video when using the LRV as a proxy. |

I'd recommend taking a look at what the data from each of these sensors looks like using gopro-telemetry. [This post describes everything needed to do just that](/blog/2022/gopro-telemetry-exporter-getting-started). 