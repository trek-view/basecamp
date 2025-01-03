---
date: 2022-10-21
title: "Injecting Telemetry into Video Files (Part 4): CAMM"
description: "In this post I will take what we learned in the last post and use it to write some telemetry into a video."
categories: developers
tags: [gpmd, camm, telemetry, gpmf, gpx, mp4]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-10-21/writting-camm-6-telemetry-meta.jpg
featured_image: /assets/images/blog/2022-10-21/writting-camm-6-telemetry-sm.jpg
layout: post
published: true
redirect_from:
  - /blog/2022/injecting-camm-gpmd-telemetry-videos-part-4-camm
---

**In this post I will take what we learned in the last post and use it to write some telemetry into a video.**

After reading last weeks post, you're now ready to start writing some telemetry of your own.

Lets start by writing telemetry in CAMM standard, seeing as I briefly introduced it in the previous posts.

It will prove handy to have a copy of [Google's CAMM Specification](https://developers.google.com/streetview/publish/camm-spec) open as a reference.

## CAMM cases 

<img class="img-fluid" src="/assets/images/blog/2022-10-21/camm-case6-specification-meta.jpg" alt="CAMM Spec case6" title="CAMM Spec case6" />

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

## Writing telemetry samples as binary (for `mdat` box)

As you now know from last week, each telemetry samples need to be turned into binary for injection into the `mdat` box.

The [Python3 struct library](https://docs.python.org/3/library/struct.html) can be used to perform conversions between Python values and C structs represented as Python bytes objects which can be written into `mdat`. 

Lets use this CAMM case 6 sample to demonstrate;

**Sample 0**

```json
{"time_gps_epoch": "1553343930000.0", "gps_fix_type": 3, "latitude": 51.26006666666667, "longitude": -0.9531388888888889, "altitude": 127.7, "horizontal_accuracy": 1.0, "vertical_accuracy": 1.0, "velocity_east": -0.42552019866750024, "velocity_north": 0.2466133528597531, "velocity_up": 0.0, "speed_accuracy": 0.0}
```

Here's how we can convert the values to Python bytes using struct;

```python
python3
import struct

time_gps_epoch_0 = struct.pack('<d', 1553343930000.0)
gps_fix_type_0 = struct.pack('<i', 3)
latitude_0 = struct.pack('<d', 51.26006666666667)
longitude_0 = struct.pack('<d', -0.9531388888888889)
altitude_0 = struct.pack('<f', 127.7)
horizontal_accuracy_0 = struct.pack('<f', 1.0)
vertical_accuracy_0 = struct.pack('<f', 1.0)
velocity_east_0 = struct.pack('<f', -0.42552019866750024)
velocity_north_0 = struct.pack('<f', 0.2466133528597531)
velocity_up_0 = struct.pack('<f', 0.0)
speed_accuracy_0 = struct.pack('<f', 0.0)
```

[The `<` defines the string as little endian](https://docs.python.org/3/library/struct.html#byte-order-size-and-alignment), this is defined in the CAMM specification;

> All fields are little-endian (least significant byte first), and the 32-bit floating points are of IEEE 754-1985 format.

Following the `<` character is either `d`, `i`, or `f`, this defines the data type; either double, int32 or float. The datatype required for each property is also defined in the CAMM spec.

You'll notice don't need to write the property name (e.g. `latitude`) into the binary. The structure of the telemetry (CAMM) will be defined later in the telemetry `trak` box where someone (or something) can understand what these value represent. You only need to write the actual values of these properties into binary.

If we print one of these fields to examine it, we get a response in Python bytes, for example;

```python
print(time_gps_epoch_0)
b'\x00\x00\xe95\xa8\x9avB'
```

We can also decode it to check;

```python
struct.unpack('<d', time_gps_epoch_0)[0]
1553343930000.0
```

To create the telemetry data we can concatenate these together into a single sample;

```python
sample_0_no_head = (time_gps_epoch_0+gps_fix_type_0+latitude_0+longitude_0+altitude_0+horizontal_accuracy_0+vertical_accuracy_0+velocity_east_0+velocity_north_0+velocity_up_0+speed_accuracy_0)
```

Which looks like this;

```python
print(sample_0_no_head)
b'\x00\x00\xe95\xa8\x9avB\x03\x00\x00\x00y\x0eR\xddI\xa1I@\x91Z\x8a \x1d\x80\xee\xbfff\xffB\x00\x00\x80?\x00\x00\x80?\xc9\xdd\xd9\xbe6\x88|>\x00\x00\x00\x00\x00\x00\x00\x00'
```

Now we also need to account for the header to define the CAMM case as per the specification (in this example, case 6).

<img class="img-fluid" src="/assets/images/blog/2022-10-21/camm-header.png" alt="camm specification header" title="camm specification header" />

The header consists of 2 parts: the first 2 bytes contains `0` as defined by the specification and next 2 bytes contains CAMM case number. We can write this like so;

```python
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
sample_0=(header+sample_0_no_head)
```

Which encoded looks like this;

```python
print(sample_0)
b'\x00\x00\x06\x00\x00\x00\xe95\xa8\x9avB\x03\x00\x00\x00y\x0eR\xddI\xa1I@\x91Z\x8a \x1d\x80\xee\xbfff\xffB\x00\x00\x80?\x00\x00\x80?\xc9\xdd\xd9\xbe6\x88|>\x00\x00\x00\x00\x00\x00\x00\x00'
```

I know from the CAMM spec that CAMM case 6 samples are always 60 bytes (3 `double` values of 8 bytes + 1 `int32` value of 4 bytes + 7 `float` values of 4 bytes + 4 byte header). We can be sure of the byte sizes of each CAMM 6 case sample will be the same as shown above, as all field values must be reported in the payload.

Now let's continue the example. Imagine there are 5 more samples reported by the GPS sensor as follows;

**Sample 1**

Input values:

```json
{"time_gps_epoch": "1553343930200.0", "gps_fix_type": 3, "latitude": 51.26007777777778, "longitude": -0.9531694444444444, "altitude": 126.2, "horizontal_accuracy": 1.0, "vertical_accuracy": 1.0, "velocity_east": -0.2960776004545653, "velocity_north": 0.18875339246390743, "velocity_up": 0, "speed_accuracy": 0}
```

Binary output:

```python
print(sample_1)
b'\x00\x00\x06\x00\x00\x80\xf55\xa8\x9avB\x03\x00\x00\x00h\xfc\x86:J\xa1I@\x9d\xee\xed4]\x80\xee\xbfff\xfcB\x00\x00\x80?\x00\x00\x80?|\x97\x97\xbe\x92HA>\x00\x00\x00\x00\x00\x00\x00\x00'
```

**Sample 2**

Input values:

```json
{"time_gps_epoch": "1553343930400.0", "gps_fix_type": 3, "latitude": 51.26009444444445, "longitude": -0.9532111111111111, "altitude": 124.3, "horizontal_accuracy": 1.0, "vertical_accuracy": 1.0, "velocity_east": -0.30465075085200577, "velocity_north": 0.1477752379350783, "velocity_up": 0, "speed_accuracy": 0}
```

Binary output:

```python
print(sample_2)
b'\x00\x00\x06\x00\x00\x80\xf55\xa8\x9avB\x03\x00\x00\x00h\xfc\x86:J\xa1I@\x9d\xee\xed4]\x80\xee\xbfff\xfcB\x00\x00\x80?\x00\x00\x80?|\x97\x97\xbe\x92HA>\x00\x00\x00\x00\x00\x00\x00\x00'
```

**Sample 3**

Input values:

```json
{"time_gps_epoch": "1553343930600.0", "gps_fix_type": 3, "latitude": 51.26011388888889, "longitude": -0.953275, "altitude": 122.6, "horizontal_accuracy": 1.0, "vertical_accuracy": 1.0, "velocity_east": -0.20935273424251769, "velocity_north": 0.11122101212837258, "velocity_up": 0, "speed_accuracy": 0}
```

Binary output:

```python
print(sample_3)
b'\x00\x00\x06\x00\x00\x00\x026\xa8\x9avB\x03\x00\x00\x00NaV\xc6J\xa1I@Q\xfe\x8c\x96\xb4\x80\xee\xbf\x9a\x99\xf8B\x00\x00\x80?\x00\x00\x80?/\xfb\x9b\xbedR\x17>\x00\x00\x00\x00\x00\x00\x00\x00'
```

**Sample 4**

Input values:

```json
{"time_gps_epoch": "1553343930800.0", "gps_fix_type": 3, "latitude": 51.260133333333336, "longitude": -0.9533333333333333, "altitude": 120.8, "horizontal_accuracy": 1.0, "vertical_accuracy": 1.0, "velocity_east": -0.1918253910417178, "velocity_north": 0.11464815023472924, "velocity_up": 0, "speed_accuracy": 0}
```

Binary output:

```python
print(sample_4)
b'\x00\x00\x06\x00\x00\x80\x0e6\xa8\x9avB\x03\x00\x00\x00\xaf\x01siK\xa1I@S\x05\xa3\x92:\x81\xee\xbf33\xf5B\x00\x00\x80?\x00\x00\x80?\x90`V\xbe\xd8\xc7\xe3=\x00\x00\x00\x00\x00\x00\x00\x00'
```

**Sample 5**

Input values:

```json
{"time_gps_epoch": "1553343931000.0", "gps_fix_type": 3, "latitude": 51.26015833333334, "longitude": -0.9533999999999999, "altitude": 120.1, "horizontal_accuracy": 1.0, "vertical_accuracy": 1.0, "velocity_east": -0.18010009841425276, "velocity_north": 0.11694262588071799, "velocity_up": 0, "speed_accuracy": 0}
```

Binary output:

```python
print(sample_5)
b'\x00\x00\x06\x00\x00\x00\x1b6\xa8\x9avB\x03\x00\x00\x00\x11\xa2\x8f\x0cL\xa1I@\x81N\x1b\xe8\xb4\x81\xee\xbf\x9a\x99\xf1B\x00\x00\x80?\x00\x00\x80?\xe0mD\xbe\xa6\xcc\xea=\x00\x00\x00\x00\x00\x00\x00\x00'
```

To help demonstrate it, try downloading and running this script (`example-camm6-telemetry.py`) showing how I obtain all the values above:

```
curl https://gist.githubusercontent.com/himynamesdave/ca819516d4dad7b96d602d0531945227/raw/87fd6593dab7f8044322c16dd8ba499fc8d45b0c/example-camm6-telemetry.py  > example-camm6-telemetry.py
python3 example-camm6-telemetry.py
```

Now that we have our binary samples we can add them to the `mdat` box.

Firstly, remember last week I talked about how `mdat` usually contained an interleaved mix of video, audio and telemetry (and more possibly other) byte data. As I explained, this is because on cameras with limited memory, it is essential to write the data being generated from all sensors as quickly as possible.

However, there is no requirement to do this. One of the advantages of post-processing of telemetry and adding it to an mp4 is that we can simply append the entire telemetry binary data to the end of the bytes that already exist in the `mdat` box. For example, if the video only contained audio and video, we could add the telemetry after all those bytes in the `mdat` box.

Lets walk through an example of that.

Take the `GS018421.mp4` video, it has no telemetry. How do I know? Let's look at the output of Telemetry Injector tools script `print_video_atoms_overview.py`;

```shell
python3 print_video_atoms_overview.py GS018421.mp4
```

```
mpeg4 [294220070]
 ├── b'ftyp' [8, 12]
 ├── b'wide' [8, 0]
 ├── b'mdat' [8, 294196360]
 ├── b'skip' [8, 11602]
 └── b'moov' [8, 12056]
     ├── b'mvhd' [8, 100]
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
     │   │       └── b'stbl' [8, 6122]
     │   │           ├── b'stsd' [8, 177]
     │   │           │   └── b'avc1' [8, 161]
     │   │           ├── b'stts' [8, 208]
     │   │           ├── b'stss' [8, 92]
     │   │           ├── b'sdtp' [8, 609]
     │   │           ├── b'stsc' [8, 1220]
     │   │           ├── b'stsz' [8, 2432]
     │   │           └── b'stco' [8, 1328]
     │   └── b'uuid' [8, 446]
     └── b'trak' [8, 4943]
         ├── b'tkhd' [8, 84]
         ├── b'edts' [8, 28]
         └── b'mdia' [8, 4807]
             ├── b'mdhd' [8, 24]
             ├── b'hdlr' [8, 41]
             └── b'minf' [8, 4718]
                 ├── b'smhd' [8, 8]
                 ├── b'hdlr' [8, 48]
                 ├── b'dinf' [8, 28]
                 └── b'stbl' [8, 4602]
                     ├── b'stsd' [8, 150]
                     │   └── b'mp4a' [8, 134]
                     │       └── b'wave' [8, 82]
                     │           ├── b'frma' [8, 4]
                     │           ├── b'mp4a' [8, 4]
                     │           ├── b'esds' [8, 42]
                     │           └── b'\x00\x00\x00\x00' [8, 0]
                     ├── b'stts' [8, 16]
                     ├── b'stsc' [8, 428]
                     ├── b'stsz' [8, 3800]
                     └── b'stco' [8, 168]
```

You can only see an audio (`avc1`) `trak` and video (`mp4a`) `trak` in the metadata box (`moov`).

So lets add some. We know the `mdat` track it `294196360` bytes long and we want to append the telemetry data to the end of this file (first byte of telemetry will be at `294196361` bytes in the `mdat`).

In total we have 6 telemetry samples of 60 bytes (so 360 bytes total of telemetry to add).

```python3
all_samples = (sample_0+sample_1+sample_2+sample_3+sample_4+sample_5)
```

Which is:

```python3
print(all_samples)
\x00\x00\x06\x00\x00\x00\xe95\xa8\x9avB\x03\x00\x00\x00y\x0eR\xddI\xa1I@\x91Z\x8a \x1d\x80\xee\xbfff\xffB\x00\x00\x80?\x00\x00\x80?\xc9\xdd\xd9\xbe6\x88|>\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x06\x00\x00\x80\xf55\xa8\x9avB\x03\x00\x00\x00h\xfc\x86:J\xa1I@\x9d\xee\xed4]\x80\xee\xbfff\xfcB\x00\x00\x80?\x00\x00\x80?|\x97\x97\xbe\x92HA>\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x06\x00\x00\x00\x026\xa8\x9avB\x03\x00\x00\x00NaV\xc6J\xa1I@Q\xfe\x8c\x96\xb4\x80\xee\xbf\x9a\x99\xf8B\x00\x00\x80?\x00\x00\x80?/\xfb\x9b\xbedR\x17>\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x06\x00\x00\x80\x0e6\xa8\x9avB\x03\x00\x00\x00\xaf\x01siK\xa1I@S\x05\xa3\x92:\x81\xee\xbf33\xf5B\x00\x00\x80?\x00\x00\x80?\x90`V\xbe\xd8\xc7\xe3=\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x06\x00\x00\x00\x1b6\xa8\x9avB\x03\x00\x00\x00\x11\xa2\x8f\x0cL\xa1I@\x81N\x1b\xe8\xb4\x81\xee\xbf\x9a\x99\xf1B\x00\x00\x80?\x00\x00\x80?\xe0mD\xbe\xa6\xcc\xea=\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x06\x00\x00\x80'6\xa8\x9avB\x03\x00\x00\x00j\xb9F\xdeL\xa1I@m4\x80\xb7@\x82\xee\xbf33\xf0B\x00\x00\x80?\x00\x00\x80?)l8\xbe\x9e\x7f\xef=\x00\x00\x00\x00\x00\x00\x00\x00
```

Now all that's left to do is append `all_samples` to the `mdat` media (starting at `294196361` bytes)

To do this is easy, take the `mdat` binary and just simple add `all_samples` (e.g. `mdat` + `all_samples`).

Now this is complete, we need to describe the data that's been added (appended) to the `mdat` binary so that the telemetry is contains can be decoded and processed correctly.

## Writing metadata samples as binary (for `moov` box)

We've now added CAMM case 5 telemetry to the `mdat` media. Now we need to describe it.

In the last post, using a sample CAMM video we saw how we need to update the boxes nested in the `stbl`. 

```
 └── b'moov' [8, 5171]
     ├── b'mvhd' [8, 100]
     ├── b'meta' [8, 111]
     ├── b'trak' [8, 2565]
     │   ├── b'tkhd' [8, 84]
     │   └── b'mdia' [8, 2465]
     │       ├── b'mdhd' [8, 24]
     │       ├── b'hdlr' [8, 36]
     │       └── b'minf' [8, 2381]
     │           ├── b'nmhd' [8, 4]
     │           ├── b'dinf' [8, 28]
     │           └── b'stbl' [8, 2325]
     │               ├── b'stsd' [8, 33]
     │               │   └── b'camm' [8, 17]
     │               ├── b'stts' [8, 1352]
     │               ├── b'stsz' [8, 724]
     │               ├── b'stsc' [8, 80]
     │               └── b'co64' [8, 96]
```

To do this we first need to write the `stbl` box; which contains `stsd` (and `camm`), `stts`, `stsz`, `stsc`, and `co64` boxes. Note, it is also required to write to other boxes, but I will cover these in the standard specific posts.

<img class="img-fluid" src="/assets/images/blog/2022-10-21/stbl-children.png" alt="stbl children boxes" title="stbl children boxes" />

Lets walk through this using the earlier example by first explaining each box. I will then cover how to write these as binary.

### `stbl`

> The sample table atom contains information for converting from media time to sample number to sample location. This atom also indicates how to interpret the sample (for example, whether to decompress the video data and, if so, how). This section describes the format and content of the sample table atom.

Source: [Quicktime specification](https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/QTFFChap2/qtff2.html)

In short this box has a size (of all nested atoms) and type (`stbl`) but then it simply acts as a container for the boxes that follow.

As we don't know the types or size of the other boxes that will be nested yet (we'll work that out in a minute), we can't write it just yet.

Writing some basic code to illustrate this, it would look something like so;

```python3
stbl_box=(stbl_size+stbl_type+stsd_box+stts_box+stsz_box+stsc_box+co64_box)
```

Here is how to create those variables...

### `stsd` (and `camm`) box

Unlike the `stbl` container box, the `stsd` box has no more nested boxes, and thus can be written into binary.

In short, for telemetry, the sample table box contains information about the telemetry, including the different types and structure of data that can be found in reported samples (e.g. from different sensors) and how it can be interpreted.

Here's an example of the data elements contained in the `stsd` box for CAMM telemetry;

* atom size (32-bit integer): the total size in bytes of this box (and all child boxes)
* type (32-bit integer): sets the box type, always `stsd`
* version (1-byte specification): default `0` (meets our requirements), if version is 1 then date and duration values are 8 bytes in length
* flags (3-byte space): always set to `0,0,0`
* number of entries (32-bit integer): number of entries in the sample descriptions that follow (`1` in my example)
* sample description table: An array of sample descriptions

A basic sample description table (for CAMM) looks as follows;

```
8,camm,0,1
```

That is, the row is `8` bytes, the data type is `camm`, format reserved data `0`, and the data reference index is `1`.

### `stts` (time to sample box) box

Let's assume the timescale in the `mdhd` box is defined as 90000.

As we have one point every 0.2 seconds, each sample covers 18000 (`90000/5`).

Therefore we get the following time-to-sample table

```
[6,18000]
```

6 points, each covering 18000.

The `stts` box also requires the following data elements;

* atom size (32-bit integer): the total size in bytes of this atom (no nested atom, so sum of box)
* type (32-bit integer): sets the box type, always `stts`
* version (1-byte specification): default `0` (meets our requirements), if version is 1 then date and duration values are 8 bytes in length
* flags (3-byte space): always set to `0,0,0`
* number of entries (32-bit integer): number of entries in the sample descriptions that follow (in our example `1`)
* sample description table: An array of sample descriptions (see above)

So taking all this information, we can write the binary for this entry.

To simplify things you can use the tools in our telemetry injector script to see exactly how this works.

First you need supply the unknown variables in a json file, like so;

```shell
vi stts.json
{"version": 0, "flags": [0, 0, 0], "entries": [[6,18000]]}
```

Which can then be passed to the script;

```python3
python3 sttsBox.py -l stts.json
b'\x00\x00\x00\x18stts\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x06\x00\x00FP'
```

If you're still not sure how this is working, [check out the code implementation](https://github.com/trek-view/telemetry-injector/).

### `stsz` (sample size box)

As we're dealing with CAMM case 6 telemetry we know that each sample is exactly 60 bytes, which gives a sample size table of;

```
60
60
60
60
60
60
```

The `stsz` box also requires the following data elements;

* atom size (32-bit integer): the total size in bytes of this atom (no nested atom, so sum of box)
* type (32-bit integer): sets the box type, always `stsz`
* version (1-byte specification): default `0` (meets our requirements), if version is 1 then date and duration values are 8 bytes in length
* flags (3-byte space): always set to `0,0,0`
* sample size: the size of each sample (in our example `6`)
* number of entries (32-bit integer): number of entries in the sample descriptions that follow (in our example `5`)
* sample size table: An array of sample descriptions (see above)

Again, creating the binary with telemetry injector;

```shell
vi stsz.json
{"version": 0, "flags": [0, 0, 0], "block_size": 0, "entries": [60, 60, 60, 60, 60]}
```

```python3
python3 stszBox.py -l stsz.json
b'\x00\x00\x00$stsz\x00\x00\x00\x00\x00\x00\x00\x05\x00\x00\x00<\x00\x00\x00<\x00\x00\x00<\x00\x00\x00<\x00\x00\x00<'
```

### `stsc` (sample to chunk box)

To keep things simple, mainly because our telemetry is simple (just one CAMM case), I will assign each sample to a chunk, giving a sample to chunk data element in the `stsc` box as follows;

```
1,1,1
```

Each table entry corresponds to a set of consecutive chunks, each of which contains the same number of samples (thus we only need one line).

This translates to; Chunk 1 has 1 sample in it, and the sample is described in the `stsd` under sample description table where the data reference index column is 1. Chunk 2 has 1 sample in it and the data reference is one, and so on...

The `stsc` box also requires the following data elements;

* atom size (32-bit integer): the total size in bytes of this atom (no nested atom, so sum of box)
* type (32-bit integer): sets the box type, always `stsc`
* version (1-byte specification): default `0` (meets our requirements), if version is 1 then date and duration values are 8 bytes in length
* flags (3-byte space): always set to `0,0,0`
* number of entries: in our example `1`
* number of entries (32-bit integer): number of entries in the sample to chunk table 
* sample to chunk table table: An array of sample descriptions (see above)

```shell
vi stsc.json
{"version": 0, "flags": [0, 0, 0], "entries": [[1, 1, 1]]}
```

```python3
python3 stscBox.py -l stsc.json
b'\x00\x00\x00\x1cstsc\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x01\x00\x00\x00\x01\x00\x00\x00\x01'
```

### `co64` (chunk offset box)

Firstly we use the `co64` box (not not the `stco`) box, as CAMM can use up to 64 bits.

The chunk offset table is fairly easy to write in our example as we appended the telemetry to the end of the `mdat` file.

Remember earlier in the post;

> first byte of telemetry will be at `294196361` bytes in the `mdat`

Thus we get a `co64` chunk offset table as follows;

```
294196361
294196421
294196481
294196541
294196601
294196661
```

The `co64` box also requires the following data elements;

* atom size (32-bit integer): the total size in bytes of this atom (no nested atom, so sum of box)
* type (32-bit integer): sets the box type, always `co64`
* version (1-byte specification): default `0` (meets our requirements), if version is 1 then date and duration values are 8 bytes in length
* flags (3-byte space): always set to `0`
* number of entries (32-bit integer): number of entries in the sample descriptions that follow (in our example `6`)
* chunk offset table: An array of sample descriptions (see above)

So taking all this information, we can write the following binary;

```shell
vi co64.json
{"version": 0, "flags": [0, 0, 0], "entries": [294196361, 294196421, 294196481, 294196541, 294196601, 294196661]}
```

```python3
python3 co64Box.py -l co64.json
b'\x00\x00\x00(co64\x00\x00\x00\x00\x00\x00\x00\x06\x11\x89\x14\x89\x11\x89\x14\xc5\x11\x89\x15\x01\x11\x89\x15=\x11\x89\x15y\x11\x89\x15\xb5'
```

### Going back to `stbl`

Remember earlier I said..

```python3
stbl_box=(stbl_size+stbl_type+stsd_box+stts_box+stsz_box+stsc_box+co64_box)
```

Now we (almost) have all the information we need. Now all we need is to work out the length of each of the boxes created (to write as the `stbl` size value)

```python3
python3
import struct


stsd_box_len = len(b'\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x19cammapplication/gyro\x00')
print(stts_box_len)
33

stts_box_len = len('\x00\x00\x00\x18stts\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x06\x00\x00FP')
print(stts_box_len)
24

stsz_box_len = len('\x00\x00\x00$stsz\x00\x00\x00\x00\x00\x00\x00\x05\x00\x00\x00<\x00\x00\x00<\x00\x00\x00<\x00\x00\x00<\x00\x00\x00<')
print(stsz_box_len)
36

stsc_box_len = len('\x00\x00\x00\x1cstsc\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x01\x00\x00\x00\x01\x00\x00\x00\x01')
print(stsc_box_len)
38

co64_box_len = len('\x00\x00\x00(co64\x00\x00\x00\x00\x00\x00\x00\x06\x11\x89\x14\x89\x11\x89\x14\xc5\x11\x89\x15\x01\x11\x89\x15=\x11\x89\x15y\x11\x89\x15\xb5')
print(co64_box_len)
40

total_len = 33 + 24 + 36 + 38 + 40
print(total_len)
171
```

So now we have all the data to build the `stbl` box

```python3
stbl_box=(stbl_size+stbl_type+stsd_box+stts_box+stsz_box+stsc_box+co64_box)
```

## Writing the final telemetry meta boxes

I haven't covered these boxes yet;

```
 └── b'moov' [8, 5171]
     ├── b'mvhd' [8, 100]
     ├── b'meta' [8, 111]
     ├── b'trak' [8, 2565]
     │   ├── b'tkhd' [8, 84]
     │   └── b'mdia' [8, 2465]
     │       ├── b'mdhd' [8, 24]
     │       ├── b'hdlr' [8, 36]
     │       └── b'minf' [8, 2381]
     │           ├── b'nmhd' [8, 4]
     │           ├── b'dinf' [8, 28]
```

So far we've written some of the required boxes. In order to ensure telemetry is read correctly you will also need to write data into some of the other boxes shown in the structure earlier.

Hopefully the examples have given you enough information to follow along with the mp4 specification to write all required telemetry boxes.

Next week I'll show you a similar exercise, but using GPMF as the target telemetry type. 

In the sixth and final post I will introduce [Telemetry Injector](https://github.com/trek-view/telemetry-injector) properly (which handles the entire injection of telemetry to mp4s).

## A special thanks to...

...the Apple team who wrote [a brilliant overview to video files atoms (boxes) here](https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/QTFFChap2/qtff2.html) that significantly helped me understand the topic and write this post.