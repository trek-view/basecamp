---
date: 2022-09-23
title: "Injecting Telemetry into Video Files (Part 4): CAMM"
description: "In this post I will the structure of Google's CAMM standard, how to create a CAMM binary, and how to inject it into a mp4 video file."
categories: developers
tags: [gpmd, camm, telemetry, gpmf, gpx]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-09-23/camm-case6-specification-meta.jpg
featured_image: /assets/images/blog/2022-09-23/camm-case6-specification-meta.jpg
layout: post
published: true
---

**In this post I will the structure of Google's CAMM standard, how to create a CAMM binary, and how to inject it into a mp4 video file.**

The CAMM specification is quite a bit simpler to GPMF in its design, so I've decided to take the conceptual knowledge from the last few weeks, and use CAMM as the first standard I will walk-through an example of writing telemetry.

GPMF will follow next week. 

In this post it will prove useful to have the [Google CAMM Specification](https://developers.google.com/streetview/publish/camm-spec) open as a reference.

## CAMM cases 

<img class="img-fluid" src="/assets/images/blog/2022-09-23/camm-case6-specification-meta.jpg" alt="CAMM Spec case6" title="CAMM Spec case6" />

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

## Writing as sample as binary (for `mdat` box)

As you now now, these samples need to be turned into binary for injection into the `mdat` box.

The [Python3 struct library](https://docs.python.org/3/library/struct.html) can be used to perform conversions between Python values and C structs represented as Python bytes objects which can be written into `mdat`. 

Lets use this CAMM case 6 sample to demonstrate;

**Sample 0**

```json
{"time_gps_epoch": "1553343930000.0", "gps_fix_type": 3, "latitude": 51.26006666666667, "longitude": -0.9531388888888889, "altitude": 127.7, "horizontal_accuracy": 1.0, "vertical_accuracy": 1.0, "velocity_east": -0.42552019866750024, "velocity_north": 0.2466133528597531, "velocity_up": 0.0, "speed_accuracy": 0.0}
```

Here's how we can convert the values to Python bytes using struct;

```python
import struct
time_gps_epoch_0 = struct.pack('>d', 1553343930000.0)
gps_fix_type_0 = struct.pack('>i', 3)
latitude_0 = struct.pack('>d', 51.26006666666667)
longitude_0 = struct.pack('>d', -0.9531388888888889)
altitude_0 = struct.pack('>f', 127.7)
horizontal_accuracy_0 = struct.pack('>f', 1.0)
vertical_accuracy_0 = struct.pack('>f', 1.0)
velocity_east_0 = struct.pack('>f', -0.42552019866750024)
velocity_north_0 = struct.pack('>f', 0.2466133528597531)
velocity_up_0 = struct.pack('>f', 0.0)
speed_accuracy_0 = struct.pack('>f', 0.0)
```

[The `>` defines the string as big endian](https://docs.python.org/3/library/struct.html#byte-order-size-and-alignment).

You'll notice don't need to write the property name (e.g. `latitude`) into the binary. The structure of the telemetry (CAMM) will be defined later in the telemetry `trak` box where someone (or something) can understand what these value represent. You only need to write the actual values of these properties into binary.

If we print one of these fields to examine it, we get a response in Python bytes, for example;

```python
print(time_gps_epoch_0)
b'Bv\x9a\xa85\xe9\x00\x00'
```

We can also decode it to check;

```python
struct.unpack('>d', time_gps_epoch_0)[0]
1553343930000.0
```

To create the telemetry data we can concatenate these together into a single sample;

```python
sample_data_0 = (time_gps_epoch_0+gps_fix_type_0+latitude_0+longitude_0+altitude_0+horizontal_accuracy_0+vertical_accuracy_0+velocity_east_0+velocity_north_0+velocity_up_0+speed_accuracy_0)
```

Which looks like this;

```python
print(sample_data_0)
b'Bv\x9a\xa85\xe9\x00\x00\x00\x00\x00\x03@I\xa1I\xddR\x0ey\xbf\xee\x80\x1d \x8aZ\x91B\xffff?\x80\x00\x00?\x80\x00\x00\xbe\xd9\xdd\xc9>|\x886\x00\x00\x00\x00\x00\x00\x00\x00'
```

Now we also need to account for the header to define the CAMM case as per the specification (in this example, case 6).

<img class="img-fluid" src="/assets/images/blog/2022-09-23/camm-specification-header.png" alt="camm specification header" title="camm specification header" />

The header consists of 2 parts: the first 2 bytes contains `0` as defined by the specification and next 2 bytes contains CAMM case number. We can write this like so;

```json
reserved = struct.pack('<H', 0)
camm_case = struct.pack('<H', 6)

header = (reserved+camm_case)
```

Which looks like this;

```python
print(header)
b'\x00\x00\x06\x00'
```

Therefore to create a valid CAMM case 6 sample;

```
sample_0 = (header+sample_data_0)
```

Which encoded looks like this;

```python
print(sample_0)
b'\x00\x00\x06\x00Bv\x9a\xa85\xe9\x00\x00\x00\x00\x00\x03@I\xa1I\xddR\x0ey\xbf\xee\x80\x1d \x8aZ\x91B\xffff?\x80\x00\x00?\x80\x00\x00\xbe\xd9\xdd\xc9>|\x886\x00\x00\x00\x00\x00\x00\x00\x00'
```

Now let's continue the example. Imagine there are 5 more samples reported by the GPS sensore as follows;

**Sample 1**

Input values:

```json
{"time_gps_epoch": "1553343930000.0", "gps_fix_type": 3, "latitude": 51.26006666666667, "longitude": -0.9531388888888889, "altitude": 127.7, "horizontal_accuracy": 1.0, "vertical_accuracy": 1.0, "velocity_east": -0.42552019866750024, "velocity_north": 0.2466133528597531, "velocity_up": 0.0, "speed_accuracy": 0.0}
```

Binary output:

```python3
b'\x00\x00\x06\x00Bv\x9a\xa85\xe9\x00\x00\x00\x00\x00\x03@I\xa1I\xddR\x0ey\xbf\xee\x80\x1d \x8aZ\x91B\xffff?\x80\x00\x00?\x80\x00\x00\xbe\xd9\xdd\xc9>|\x886\x00\x00\x00\x00\x00\x00\x00\x00'
```

**Sample 2**

Input values:

```json
{"time_gps_epoch": "1553343930200.0", "gps_fix_type": 3, "latitude": 51.26007777777778, "longitude": -0.9531694444444444, "altitude": 126.2, "horizontal_accuracy": 1.0, "vertical_accuracy": 1.0, "velocity_east": -0.2960776004545653, "velocity_north": 0.18875339246390743, "velocity_up": 0, "speed_accuracy": 0}
```

Binary output:

```python3
b'\x00\x00\x06\x00Bv\x9a\xa85\xf5\x80\x00\x00\x00\x00\x03@I\xa1J:\x86\xfch\xbf\xee\x80]4\xed\xee\x9dB\xfcff?\x80\x00\x00?\x80\x00\x00\xbe\x97\x97|>AH\x92\x00\x00\x00\x00\x00\x00\x00\x00'
```

**Sample 3**

Input values:

```json
{"time_gps_epoch": "1553343930400.0", "gps_fix_type": 3, "latitude": 51.26009444444445, "longitude": -0.9532111111111111, "altitude": 124.3, "horizontal_accuracy": 1.0, "vertical_accuracy": 1.0, "velocity_east": -0.30465075085200577, "velocity_north": 0.1477752379350783, "velocity_up": 0, "speed_accuracy": 0}
```

Binary output:

```python3
b'\x00\x00\x06\x00Bv\x9a\xa86\x02\x00\x00\x00\x00\x00\x03@I\xa1J\xc6VaN\xbf\xee\x80\xb4\x96\x8c\xfeQB\xf8\x99\x9a?\x80\x00\x00?\x80\x00\x00\xbe\x9b\xfb/>\x17Rd\x00\x00\x00\x00\x00\x00\x00\x00'
```

**Sample 4**

Input values:

```json
{"time_gps_epoch": "1553343930600.0", "gps_fix_type": 3, "latitude": 51.26011388888889, "longitude": -0.953275, "altitude": 122.6, "horizontal_accuracy": 1.0, "vertical_accuracy": 1.0, "velocity_east": -0.20935273424251769, "velocity_north": 0.11122101212837258, "velocity_up": 0, "speed_accuracy": 0}
```

Binary output:

```python3
b'\x00\x00\x06\x00Bv\x9a\xa86\x0e\x80\x00\x00\x00\x00\x03@I\xa1Kis\x01\xaf\xbf\xee\x81:\x92\xa3\x05SB\xf533?\x80\x00\x00?\x80\x00\x00\xbeV`\x90=\xe3\xc7\xd8\x00\x00\x00\x00\x00\x00\x00\x00'
```

**Sample 5**

Input values:

```json
{"time_gps_epoch": "1553343930800.0", "gps_fix_type": 3, "latitude": 51.260133333333336, "longitude": -0.9533333333333333, "altitude": 120.8, "horizontal_accuracy": 1.0, "vertical_accuracy": 1.0, "velocity_east": -0.1918253910417178, "velocity_north": 0.11464815023472924, "velocity_up": 0, "speed_accuracy": 0}
```

Binary output:

```python3
b'\x00\x00\x06\x00Bv\x9a\xa86\x1b\x00\x00\x00\x00\x00\x03@I\xa1L\x0c\x8f\xa2\x11\xbf\xee\x81\xb4\xe8\x1bN\x81B\xf1\x99\x9a?\x80\x00\x00?\x80\x00\x00\xbeDm\xe0=\xea\xcc\xa6\x00\x00\x00\x00\x00\x00\x00\x00'
```

**Sample 6**

Input values:

```json
{"time_gps_epoch": "1553343931000.0", "gps_fix_type": 3, "latitude": 51.26015833333334, "longitude": -0.9533999999999999, "altitude": 120.1, "horizontal_accuracy": 1.0, "vertical_accuracy": 1.0, "velocity_east": -0.18010009841425276, "velocity_north": 0.11694262588071799, "velocity_up": 0, "speed_accuracy": 0}
```

Binary output:

```python3
b"\x00\x00\x06\x00Bv\x9a\xa86'\x80\x00\x00\x00\x00\x03@I\xa1L\xdeF\xb9j\xbf\xee\x82@\xb7\x804mB\xf033?\x80\x00\x00?\x80\x00\x00\xbe8l)=\xef\x7f\x9e\x00\x00\x00\x00\x00\x00\x00\x00"
```

To help demonstrate it, try downloading and running this script (`example-camm6-telemetry.py`) showing how I obtain all the values above:

```
curl https://gist.githubusercontent.com/himynamesdave/ca819516d4dad7b96d602d0531945227/raw/87fd6593dab7f8044322c16dd8ba499fc8d45b0c/example-camm6-telemetry.py
python3 example-camm6-telemetry.py
```

Now that we have our binary samples we can add them to the `mdat` box.

Firstly, remember last week I talked about how `mdat` usually contained an interleaved mix of video, audio and telemetry (and more possibly other) byte data. As I explained, this is because on cameras with limited memory, it is essential to write the data being generated from all sensors as quickly as possible.

However, there is no requirement to do this. One of the advantages of post-processing of telemetry and adding it to an mp4 is that we can simply append the entire telemetry binary data to the end of the bytes that already exist in the `mdat` box. For example, if the video only contained audio and video, we could add the telemetry after all those bytes in the `mdat` box.

Therefore we can simply append the 7 lines of binary to the end of the `mdat` box.

Assume an example with only video bytes in the `mdat` as follows (this is not real video binary, but simply used to demonstrate the point);

```
\x00\x00\x00\x00\x00\x00\x00\x00
\x00\x00\x00\x00\x00\x00\x00\x00
\x00\x00\x00\x00\x00\x00\x00\x00
\x00\x00\x00\x00\x00\x00\x00\x00
\x00\x00\x00\x00\x00\x00\x00\x00
\x00\x00\x00\x00\x00\x00\x00\x00
```

Each example row (6 total) is a video sample (of 4 bytes). Therefore, a total of 24 bytes of video.

Now we just need to append our data to the bottom of the binary, as follows.

```
\x00\x00\x00\x00\x00\x00\x00\x00
\x00\x00\x00\x00\x00\x00\x00\x00
\x00\x00\x00\x00\x00\x00\x00\x00
\x00\x00\x00\x00\x00\x00\x00\x00
\x00\x00\x00\x00\x00\x00\x00\x00
\x00\x00\x00\x00\x00\x00\x00\x00
b'\x00\x00\x06\x00Bv\x9a\xa85\xe9\x00\x00\x00\x00\x00\x03@I\xa1I\xddR\x0ey\xbf\xee\x80\x1d \x8aZ\x91B\xffff?\x80\x00\x00?\x80\x00\x00\xbe\xd9\xdd\xc9>|\x886\x00\x00\x00\x00\x00\x00\x00\x00'
b'\x00\x00\x06\x00Bv\x9a\xa85\xe9\x00\x00\x00\x00\x00\x03@I\xa1I\xddR\x0ey\xbf\xee\x80\x1d \x8aZ\x91B\xffff?\x80\x00\x00?\x80\x00\x00\xbe\xd9\xdd\xc9>|\x886\x00\x00\x00\x00\x00\x00\x00\x00'
b'\x00\x00\x06\x00Bv\x9a\xa85\xf5\x80\x00\x00\x00\x00\x03@I\xa1J:\x86\xfch\xbf\xee\x80]4\xed\xee\x9dB\xfcff?\x80\x00\x00?\x80\x00\x00\xbe\x97\x97|>AH\x92\x00\x00\x00\x00\x00\x00\x00\x00'
b'\x00\x00\x06\x00Bv\x9a\xa86\x02\x00\x00\x00\x00\x00\x03@I\xa1J\xc6VaN\xbf\xee\x80\xb4\x96\x8c\xfeQB\xf8\x99\x9a?\x80\x00\x00?\x80\x00\x00\xbe\x9b\xfb/>\x17Rd\x00\x00\x00\x00\x00\x00\x00\x00'
b'\x00\x00\x06\x00Bv\x9a\xa86\x0e\x80\x00\x00\x00\x00\x03@I\xa1Kis\x01\xaf\xbf\xee\x81:\x92\xa3\x05SB\xf533?\x80\x00\x00?\x80\x00\x00\xbeV`\x90=\xe3\xc7\xd8\x00\x00\x00\x00\x00\x00\x00\x00'
b'\x00\x00\x06\x00Bv\x9a\xa86\x1b\x00\x00\x00\x00\x00\x03@I\xa1L\x0c\x8f\xa2\x11\xbf\xee\x81\xb4\xe8\x1bN\x81B\xf1\x99\x9a?\x80\x00\x00?\x80\x00\x00\xbeDm\xe0=\xea\xcc\xa6\x00\x00\x00\x00\x00\x00\x00\x00'
b"\x00\x00\x06\x00Bv\x9a\xa86'\x80\x00\x00\x00\x00\x03@I\xa1L\xdeF\xb9j\xbf\xee\x82@\xb7\x804mB\xf033?\x80\x00\x00?\x80\x00\x00\xbe8l)=\xef\x7f\x9e\x00\x00\x00\x00\x00\x00\x00\x00"
```

TODO - HOW DO WE ACTUALLY DO THIS -- TAKE THIS BINARY AND APPEND IT TO PRODUCE THE ABOVE?

Now this is complete, we need to describe the data that's been added to the `mdat` box so that it can be decoded and processed correctly.

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
* CAMM case 6 (rich GPS samples): each sample is 60 bytes (3 `double` values of 8 bytes + 1 `int` value of 4 bytes + 7 `float` values of 4 bytes + 4 byte header)
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

* atom size (32-bit integer): the total size in bytes of this atom
* type (32-bit integer): sets the box type, always `stco`
* version (1-byte specification): the version of this chunk offset atom. TODO
* flags (3-byte space): set to 0
* number of entries (32-bit integer): number of entries in the chunk offset table, above is 7

To demonstrate this I'll turn to another script in the Telemetry Injector repository I introduced in the second post in this series. Once in the tools folder, you can run the `print_video_boxes.py`. Let's try that on a sample CAMM video (`200619_161801314.mp4`);

```shell
python3 print_video_atoms_detail.py 200619_161801314.mp4 > 200619_161801314-atom-detail.txt
```

Now there's lots to this file, [but head to line 590](https://gist.github.com/himynamesdave/0525dd51c251990cb85a176a9e2ca3fc#file-200619_161801314-atom-detail-txt-L590).

Here the script prints the content of the telemetry `trak`.

TODO -- WHY DOES SCRIPT NOT PRINT ALL DATA ELEMENTS? NEED TO FIX THIS IF MISSING

Now your next question will be, now you have all the data elements for the `co64` box; how do you structure them and write them into the box?

TODO -- WALKTHROUGH EXAMPLE OF HOW THIS IS DONE.



`

### `stsd` box


### `stsd` box









For example, lets say a camera only has a GPS chip and produces GPS information.






The  can then be converted to binary embedded into the `mdat` box as follows

TODO


On CAMM Standard, lets say I wanted to include case 
















