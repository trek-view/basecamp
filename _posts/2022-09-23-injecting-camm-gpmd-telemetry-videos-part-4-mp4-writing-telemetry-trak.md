---
date: 2022-09-23
title: "Injecting Telemetry into Video Files (Part 4): Writing telemetry trak's into mp4 videos"
description: "In this post I will take what we learned in the last post and use it to write some telemetry into a video."
categories: developers
tags: [gpmd, camm, telemetry, gpmf, gpx, mp4]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-09-23/writting-camm-6-telemetry-meta.jpg
featured_image: /assets/images/blog/2022-09-23/writting-camm-6-telemetry-sm.jpg
layout: post
published: true
---

**In this post I will take what we learned in the last post and use it to write some telemetry into a video.**

After reading last weeks post, you're now ready to start writing some telemetry of your own.

Lets start with the telemetry itself;

## Writing telemetry samples as binary (for `mdat` box)

As you now now, each telemetry samples need to be turned into binary for injection into the `mdat` box.

The [Python3 struct library](https://docs.python.org/3/library/struct.html) can be used to perform conversions between Python values and C structs represented as Python bytes objects which can be written into `mdat`. 

Lets use this CAMM case 6 sample to demonstrate;

**Sample 0**

```json
{"time_gps_epoch": "1553343930000.0", "gps_fix_type": 3, "latitude": 51.26006666666667, "longitude": -0.9531388888888889, "altitude": 127.7, "horizontal_accuracy": 1.0, "vertical_accuracy": 1.0, "velocity_east": -0.42552019866750024, "velocity_north": 0.2466133528597531, "velocity_up": 0.0, "speed_accuracy": 0.0}
```

Here's how we can convert the values to Python bytes using struct;

```shell
python3
```

```python
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

<img class="img-fluid" src="/assets/images/blog/2022-09-23/camm-header.png" alt="camm specification header" title="camm specification header" />

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

To do this is easy, take the `mdat` binary and add the `all_samples`

TODO - HOW DO WE ACTUALLY DO THIS IN CODE? -- TAKE THIS BINARY AND APPEND IT TO PRODUCE THE ABOVE?

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

<img class="img-fluid" src="/assets/images/blog/2022-09-23/stbl-children.png" alt="stbl children boxes" title="stbl children boxes" />

Lets walk through this using the earlier example by first explaining each box. I will then cover how to write these as binary.

### `stbl` (and `camm`) box

> The sample table atom contains information for converting from media time to sample number to sample location. This atom also indicates how to interpret the sample (for example, whether to decompress the video data and, if so, how). This section describes the format and content of the sample table atom.

Source: [Quicktime specification](https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/QTFFChap2/qtff2.html)

In short this box has a size (of all nested atoms) and type (`stbl`) but then it simply acts as a containter for the boxes that follow.

For example, when writing as binary, I would fitst convert the size and type like so;

```python3
TODO
stbl_hearer=x
```

Then I would simply append the nested boxes described from the next section onwards.

```python3
stbl_box=(stbl_hearer+stsd_box+stts_box+stsz_box+stsc_box+co64_box)
```

Here is how to create those variables...

### `stsd` (and `camm`) box

In short, for telemetry, the sample table box contains information about the telemetry, including the different types and structure of data that can be found in reported samples (e.g. from different sensors) and how it can be interpreted.

Here's an example of the data elements contained in the `stsd` box for CAMM telemetry;

* atom size (32-bit integer): the total size in bytes of this box (and all child boxes)
* type (32-bit integer): sets the box type, always `stsd`
* version (1-byte specification): default `0` (meets our requirements), if version is 1 then date and duration values are 8 bytes in length
* flags (3-byte space): always set to `0`
* number of entries (32-bit integer): number of entries in the sample descriptions that follow (1 in my example)
* sample description table: An array of sample descriptions

A basic sample description table (for CAMM) looks as follows;

```
8,camm,0,1
```

That is, the row is `8` bytes, the data type is `camm`, format reserved data `0`, and the data reference index is `1`.

TODO -- CAN YOU SUPPLY CODE TO DEMO CREATING THE STSD BOX

### `stts` (time to sample box) box

Let's assume the timescale in the `mdhd` box is defined as 90000.

As we have one point every 0.2 seconds, each sample covers 18000 (`90000/5`).

Therefore we get the following time-to-sample table

```
6,18000
```

6 points, each covering 18000.

The `stts` box also requires the following data elements;

* atom size (32-bit integer): the total size in bytes of this atom (no nested atom, so sum of box)
* type (32-bit integer): sets the box type, always `stts`
* version (1-byte specification): default `0` (meets our requirements), if version is 1 then date and duration values are 8 bytes in length
* flags (3-byte space): always set to `0`
* number of entries (32-bit integer): number of entries in the sample descriptions that follow (in our example `1`)
* sample description table: An array of sample descriptions (see above)

So taking all this information, we can write the following binary;

TODO -- CAN YOU SUPPLY CODE TO DEMO CREATING THE STTS BOX

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
* flags (3-byte space): always set to `0`
* sample size: count of samples (in our example `6`)
* number of entries (32-bit integer): number of entries in the sample descriptions that follow (in our example `1`)
* sample size table: An array of sample descriptions (see above)

So taking all this information, we can write the following binary;

TODO -- CAN YOU SUPPLY CODE TO DEMO CREATING THE STSZ BOX

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
* flags (3-byte space): always set to `0`
* number of entries: in our example `1`
* number of entries (32-bit integer): number of entries in the sample to chunk table 
* sample to chunk table table: An array of sample descriptions (see above)

TODO -- CAN YOU SUPPLY CODE TO DEMO CREATING THE STSC BOX

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

TODO -- CAN YOU SUPPLY CODE TO DEMO CREATING THE CO64 BOX

## Writing the final boxes

So far we've written some of the required boxes. In order to ensure telemetry is read correctly you will also need to write data into some of the other boxes shown in the structure earlier.

In the coming 2 weeks I will finish off the series of posts by showing you what these boxes should contain and how they should be written for CAMM and GPMF.