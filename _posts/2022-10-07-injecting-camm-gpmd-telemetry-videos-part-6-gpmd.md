---
date: 2022-10-07
title: "Injecting Telemetry into Video Files (Part 6): GPMF"
description: "In this post I will the structure of GoPro's GPMF standard, how to create a GPMF binary and accompanying metadata, and finally how to inject it into a mp4 video file."
categories: developers
tags: [gpmd, camm, telemetry, gpmf, gpx]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-10-07/gopro-gpmf-structure-meta.jpg
featured_image: /assets/images/blog/2022-10-07/gopro-gpmf-structure-sm.jpg
layout: post
published: true
---

**In this post I will the structure of GoPro's GPMF standard, how to create a GPMF binary and accompanying metadata, and finally how to inject it into a mp4 video file.**

In [my last post I showed how to write CAMM (a telemetry standard) into videos so that sensor data (including GPS) from the camera could be captured](/blog/2022/injecting-camm-gpmd-telemetry-videos-part-5-camm).

The past five posts have given you a good amount of fundamental knowledge to understand how to write GPMF into videos, all that's left is to cover the specifics.

## A short intro to GPMF

Two great places to start are the following repositories;

1. [gpmf-write](https://github.com/gopro/gpmf-write): writes GPMF
2. [gpmf-parser](https://github.com/gopro/gpmf-parser) parses GPMF 

What GoPro say inside gpmf-write;

> GPMF -- GoPro Metadata Format or General Purpose Metadata Format -- is a modified Key, Length, Value solution, with a 32-bit aligned payload, that is both compact, full extensible and somewhat human readable in a hex editor. GPMF allows for dependent creation of new FourCC tags, without requiring central registration to define the contents and whether the data is in a nested structure. GPMF is optimized as a time of capture storage format for the collection of sensor data as it happens.

_[https://github.com/gopro/gpmf-write](https://github.com/gopro/gpmf-write)_

OK, that's quite a mouthful. I promise by the end of this post it will all make sense.

Let us start by going back to basics, and the boxes used by GMPF;

```
ftyp [type ‘mp41’]
mdat [all the data for all tracks are interleaved]
moov [all the header/index info]
    ‘trak’ subtype ‘vide’, name “GoPro AVC”, H.264 video data 
    ‘trak’ subtype ‘soun’, name “GoPro AAC”, to AAC audio data
    ‘trak’ subtype ‘tmcd’, name “GoPro TCD”, starting timecode (time of day as frame since midnight)
    ‘trak’ subtype ‘meta’, name “GoPro MET”, GPMF telemetry
```

This should all look familiar from the previous posts.

The biggest difference between CAMM and GPMF is the way the telemetry samples are written in the `mdat` binary.

## Raw telemetry (inside `mdat` media)

To begin with, it is worth familiarising yourself with the data that GPMF supports (put another way, the types and values of telemetry that can be recorded).

[You can see the specifics of what each GoPro camera writes (generally, the newer the GoPro camera, the more telemetry data is written because there are more sensors in the camera)](https://github.com/gopro/gpmf-parser#where-to-find-gpmf-data).

<img class="img-fluid" src="/assets/images/blog/2022-10-07/gpmf-max-camera-telemetry.png" alt="GoPro MAX GPMF" title="GoPro MAX GPMF" />

Above is a snippet of what telemetry the GoPro MAX writes into GPMF as it builds the video file.

This is written into the `mdat` as a stream in the following structure;

<img class="img-fluid" src="/assets/images/blog/2022-10-07/gpmf-devc-tree.png" alt="GoPro MAX GPMF DEVC tree" title="GoPro MAX GPMF DEVC tree" />

<img class="img-fluid" src="/assets/images/blog/2022-10-07/gopro-klv-breakout.png" alt="GoPro GPMF Key Length Value breakout design" title="GoPro GPMF Key Length Value breakout design" />

Each part of the tree has a Key, Length Value structure.

<img class="img-fluid" src="/assets/images/blog/2022-10-07/gopro-gpmf-structure-sm.jpg" alt="GoPro GPMF Key Length Value design" title="GoPro GPMF Key Length Value design" />

* [Four Character Key](https://github.com/gopro/gpmf-parser#fourcc) (FourCC): for the sample type (FourCC column shown in the MAX example above has `CORI`, `IORI`, `GRAV`, `DISP`, and `MAGN`)
* [Length](https://github.com/gopro/gpmf-parser#length-type-size-repeat-structure): length of the entry split into 3 parts
	* Type: The final 8-bits, Type, is used to describe the data format within the sample. Just as FOURCC Keys are human readable, the TYPE is using a ASCII character to describe the data stored. [All box types are described here](https://github.com/gopro/gpmf-parser#type))
	* Structure Size: Size of sample. 8-bits is used for a sample size, each sample is limited to 255 bytes or less.
	* Repeat: total number of samples from all telemetry streams. 16-bits is used to indicate the number of samples in a GPMF payload, this is the Repeat field.
* [Value](https://github.com/gopro/gpmf-parser#alignment-and-storage): the actual sample data (or in the case of containers, the nested box)

I'll jump into some of the key FourCC entries below needed for our use case (write a GPX file into a video), but be warned, this is not an exhaustive explanation and things are missing as a result. Be sure to review the full GPMF specification.

### Telemetry descriptions in `mdat`

Let's start with the `DEVC` box (unique device source for metadata) at the top of the tree. A separate `DEVC` is used for each data generating device. In the case of GoPro cameras (with no accessories), there will be one `DEVC` entry, for the camera.

Taking the structure we need to write the following data for the entry;

* FourCC: `DEVC` is Four Character Key.
* Length:
	* Type: 0 (`\x00`) which means that this segment is a container (it holds other boxes in the tree) -- see in spec; _"Optionally NULL terminated - size/repeat sets the length"_
	* Structure size: 1 (`\x01`), again because is container
	* Repeat: 6 (`\x01\x06`) because in this demo, assume we have 6 telemetry sample
* Value: As this is a container box, there is no value, the next box will follow.

Which put together gives `DEVC\x00\x01\x01\x06`

We can now convert the length property values to binary and write this in preparation for adding to the `mdat` media;

```python
python3
import struct

DEVC_python_bytes = b''
DEVC_key = b'DEVC'
DEVC_type = struct.pack(">b", 0)
DEVC_structure = struct.pack(">b", 1)
DEVC_repeat = struct.pack('>H', 6)
DEVC_data = (DEVC_python_bytes+DEVC_key+DEVC_type+DEVC_structure+DEVC_repeat)

print(DEVC_data)
```

As you'll see this prints `b'DEVC\x00\x01\x01\x06'` -- the start of our telemetry.

Now we can add the `DVID` fourCC data. This is an auto generated unique-ID for managing a large number of connect devices, camera, ect. For this explanation I'll keep it simple and assume we have a single device (as GoPro cameras do). The ID will equal 1.

So writing this again, we follow the same approach;

* FourCC: `DVID` is Four character key.
* Length:
	* Type: `L` (a 32-bit unsigned integer)
	* Structure size: length is 4 (`\x04`) and the type is not a container instead segment.
	* Repeat: is 1 (`\x00\x01`) because only one ID in this example
* Value: value is 1 (`\x00\x00\x00\x01`) that's the ID we'll give to our sample

Which put together gives; `DVIDL\x04\x00\x01\x00\x00\x00\x01`

Writing this out;

```python
python3
import struct

DVID_python_bytes = b''
DVID_key = b'DVID'
DVID_type = b'L'
DVID_structure = struct.pack(">b", 4)
DVID_repeat = struct.pack('>H', 1)
DVID_value = struct.pack('>I', 1)
DVID_data = (DVID_python_bytes+DVID_key+DVID_type+DVID_structure+DVID_repeat+DVID_value)

print(DVID_data)
```

Which prints; `b'DVIDL\x04\x00\x01\x00\x00\x00\x01'`

Finally, the other more descriptive box is `DVNM`.

This simply displays the name of the device. If it was produced by a GoPro MAX camera you would see. This entry is for communicating to the user the data recorded, so it should be informative.

Following the same approach as before;

* FourCC: `DVNM` is Four character key.
* Length:
	* Type: `c` (a character)
	* Structure size: length is 9 (`\t`) because there are 9 characters in "GoPro MAX" (the value)
	* Repeat: is `1`, (`\x00\x01`) because only one value (GoPro MAX)
* Value: value is `GoPro Max`

Put together this gives; `DVNMc\t\x00\x01GoPro MAX`

```python
python3
import struct

DVNM_python_bytes = b''
DVNM_key = b'DVNM'
DVNM_type = b'c'
DVNM_structure = struct.pack(">b", 9)
DVNM_repeat = struct.pack('>H', 1)
DVNM_value = b'GoPro MAX'
DVNM_data = (DVNM_python_bytes+DVNM_key+DVNM_type+DVNM_structure+DVNM_repeat+DVNM_value)

print(DVNM_data)
```

Which prints; `b'DVNMc\t\x00\x01GoPro MAX'`


But there is another important consideration here. The structure should be representative of the type type and each sample is limited to 255 bytes or less.

So structure length = 9 is alright, but more proper way to use would be Length: 1 and Repeat: 9, e.g.

```
DVNM_structure_new = struct.pack(">b", 1)
DVNM_repeat_new = struct.pack('>H', 9)
DVNM_data = (DVNM_python_bytes+DVNM_key+DVNM_type+DVNM_structure_new+DVNM_repeat_new+DVNM_value)

print(DVNM_data)
```

Which prints; `b'DVNMc\x01\x00\tGoPro MAX'`

Now there's something important when printing values, they must be 32 bit aligned (see the image of the KLV design above) -- this also explains why we use the `stco` box in the telemetry metadata (and not `co64` like CAMM).

> For instance, in a 32-bit architecture, the data may be aligned if the data is stored in four consecutive bytes and the first byte lies on a 4-byte boundary

_[Wikipedia](https://en.wikipedia.org/wiki/Data_structure_alignment)_

In the `DVID` the value was 4 bytes, so this was 32 bit aligned. In our example, the value is 9 bytes. The next 4-byte boundary is at 12 bytes, thus we need to pad the value with three zeros, which gives a final value `DVNM_value` of `b'GoPro MAX\x00\x00\x00'` and a complete `DVID` box; `b'DVNMc\x01\x00\tGoPro MAX\x00\x00\x00''`

Now these informational boxes are covered lets move to the `STRM`.

### Actual telemetry samples in `mdat`

Now these informational boxes are covered lets move to the `STRM` (stream) box, that captures the raw telemetry.

Each metadata device can have multiple streams on sensor data, for example a camera could have GPS, Accelerometer and Gyroscope sensors producing three individual streams of telemetry.

[As linked earlier these are all described here](https://github.com/gopro/gpmf-parser#where-to-find-gpmf-data).

Jumping straight into it, here's a raw example of GPMF telemetry taken from a GoPro MAX;

```
STRM\x00\x01\x05\\
	STMPJ\x08\x00\x01\x00\x00\x00\x00\x1c\xc4\xc4\x19
	TSMPL\x04\x00\x01\x00\x01z\xe8
	STNMc\r\x00\x01Accelerometer\x00\x00\x00
	MTRXf$\x00\x01\x00\x00\x00\x00\xbf\x80\x00\x00\x00
	ORINc\x03\x00\x01XzY\x00
	ORIOc\x03\x00\x01ZXY\x00
	SIUNc\x04\x00\x01m/s\xb2
	SCALs\x02\x00\x01\x01\xa1\x00\x00
	TMPCf\x04\x00\x01A\xfd\x84\x00
	ACCLs\x06\x00\xc9\xfa\xf0\xf5\xd4\

STRM\x00\x01\x13x
	STMPJ\x08\x00\x01\x00\x00\x00\x00\x1c\xc4\xca\xb3
	TSMPL\x04\x00\x01\x00\x05\xeb\xa0
	STNMc\t\x00\x01Gyroscope\x00\x00\x00
	MTRXf$\x00\x01\x00\x00\x00\x00\xbf\x80\x00\x00\x00
	ORINc\x03\x00\x01XzY\x00
	ORIOc\x03\x00\x01ZXY\x00
	SIUNc\x05\x00\x01rad/s\x00\x00\x00
	SCALs\x02\x00\x01\x03\xab\x00\x00
	TMPCf\x04\x00\x01A\xfd\x84\x00
	GYROs\x06\x03#\x00\xbb\xfdu\x00N\x00\xbc\xfd}
```

_Note, the values above have been cut in places for brevity in this post._

Hopefully this has your brain whirring. Let me break this down.

Samples are each nested within a `STRM`. Multiple entries can be captured in a `STRM` (if they occur at the same time), but generally each `STRM` box tends to contain a measurement from a single sensor. For example, in the above example there are two `STRM` entries, one with `GYRO` (gyroscope) and one with `ACCL` (accelerometer). These sensors reports many samples per second, so there will be many more `STRM` entries for these samples to follow.

The `STRM` box itself is written like so;

* FourCC: STRM is Four character key.
* Length:
	* Type: 0 (`\x00`) as like `DEVC` this segment is a container.
	* Structure: length is `1` (`\x01`).
	* Repeat: in my example is `1`, (`\x00\x01`) because my samples do not repeat, but if identical samples were recorded, repeat could be used.
* Value: none as box is container

```python
python3
import struct

python_bytes_wrapper = b''
STRM_key = b'STRM'
STRM_type = struct.pack(">b", 0)
STRM_structure = struct.pack(">b", 9)
STRM_repeat = struct.pack('>H', 1)
STRM_value = struct.pack('>I', 1)
STRM_data = (python_bytes_wrapper+STRM_key+STRM_type+STRM_structure+STRM_repeat+STRM_value)

print(STRM_data)
```

Now we have the nested boxes. The types of boxes actually contained in `STRM`. As noted earlier for GoPro cameras this is dependent on the camera used. Below I'll work through some of the more common FourCC boxes used.

If you look at the two sample above you will see many of the FourCCs in each `STRM` are found in both entries (e.g. `STMP`, `TSMP`, etc.).

`STMP` holds microsecond timestamp values.

* FourCC: `STMP` is Four character key.
* Length:
	* Type: `J` is 64-bit unsigned unsigned number.
	* Structure: length of the value (is 8 (`\x08`) in the example I will show 1001)
 	* Repeat: how many time sample value repeats (is 1 (`\x01`) in the example I will show)
* Data: In my example `1001` (microseconds) (`\x00\x00\x00\x00\x00\x00\x03\xe9`) which has a length of 8 bytes (see Structure)

I won't go through the code for this example -- hopefully it should start to make sense.

Similarly, I won't go through each FourCC type, you should consult the specifications for this. I will however finish off by detailing how to add a `GPS5` sample to give a final, slightly more complex example of writing telemetry.

`GPS5` holds GPS samples with the following data:

* latitude
* longitude
* altitude (WGS 84)
* 2D ground speed
* 3D speed

To write this box;

* FourCC: `GPS5` is Four character key.
* Length:
	* Type: `l` is a 32-bit signed integer.
	* Structure: length of the value (is 14 (`\x14`) in the example I will show)
 	* Repeat: how many time sample value repeats (is 1 (`\x01`) in the example I will show)
* Data: Let me explain this below...

The `GPS5` requires the 5 sample values above. Let's use the following GPS samples as an example;

* latitude = 51.2600777
* longitude = -0.9531694
* altitude (WGS 84) = 126.2
* 2D ground speed = 0.865
* 3D speed = 0.89 * 100

BUT, these value are not written into the telemetry as you see above, the GPMF standard requires them to be converted into integers.

This is where the `SCAL` box comes into play.

> Sensor data often needs to be scaled to be presented with the correct units. SCAL is a divisor.

Essentially we need a scale that turns these values to integers. For our values above;

* latitude = 51.2600777 * 10000000 (scale) = 512600777
* longitude = -0.9531694 * 10000000 (scale) = -9531694
* altitude (WGS 84) = 126.2 * 10 (scale) = 1262
* 2D ground speed = 0.865 * 1000 (scale) = 865
* 3D speed = 0.89 * 100 (scale) = 89

We can then write these as values into the `SCAL` box.

* FourCC: `SCAL` is Four character key.
* Length:
	* Type: `l` is a 32-bit signed integer.
	* Structure: length of the value (is 4 (`\x14`) because 4 entries)
 	* Repeat: how many time sample value repeats (is 1 (`\x01`) in the example I will show)
* Data: Let me explain this below...


```python
python3
import struct

python_bytes_wrapper = b''
SCAL_key = b'SCAL'
SCAL_type = b'l'
SCAL_structure = struct.pack(">b", 4)
SCAL_repeat = struct.pack('>H', 5)

SCAL_value_latitude = struct.pack('>I', 512600777)
SCAL_value_longitude = struct.pack('>I', -0.9531694444444444)
SCAL_value_altitude = struct.pack('>I', 126.2)
SCAL_value_2d_speed = struct.pack('>I', 0.2)
SCAL_value_3d_speed = struct.pack('>I', 1)

GPS5_samples = (GPS5_value_latitude+GPS5_value_longitude+GPS5_value_altitude+GPS5_value_2d_speed+GPS5_value_3d_speed)

GPS5_data = (python_bytes_wrapper+GPS5_key+GPS5_type+GPS5_structure+GPS5_repeat+GPS5_samples)

print(GPS5_data)
```


SCALl\x04\x00\x05
b'\x00\x98\x96\x80'
b'\x00\x98\x96\x80'
b'\x00\x00\x03\xe8'
b'\x00\x00\x03\xe8'
b'\x00\x00\x00d'
FourCC: SCAL is Four character key.
Type: L is 32-bit unsigned integer.
Length: length is \x04, 4.
Repeat: is 5.
Data:



Which we can write into the `mdat` media like so;

```python
python3
import struct

python_bytes_wrapper = b''
GPS5_key = b'GPS5'
GPS5_type = b'l'
GPS5_structure = struct.pack(">b", 14)
GPS5_repeat = struct.pack('>H', 1)

GPS5_value_latitude = struct.pack('>d', 51.26007777777778)
GPS5_value_longitude = struct.pack('>d', -0.9531694444444444)
GPS5_value_altitude = struct.pack('>f', 126.2)
GPS5_value_2d_speed = struct.pack('>f', 0.2)
GPS5_value_3d_speed = struct.pack('>f', 1)

GPS5_samples = (GPS5_value_latitude+GPS5_value_longitude+GPS5_value_altitude+GPS5_value_2d_speed+GPS5_value_3d_speed)

GPS5_data = (python_bytes_wrapper+GPS5_key+GPS5_type+GPS5_structure+GPS5_repeat+GPS5_samples)

print(GPS5_data)
```

Which prints 




DEVC null 4 7

* Length: length is \x01, 1 and the type is a character so DEVC is a container and
Repeat: is 260. How? we have b'\x01\x04' as repeat and if we unpack it we will get the length as 260.


How to write this as 

So we get the line

```
b'DEVC\x00\x01\x01\x04
```




To Describe the above data, let go step by step according to KLV structure: KLV is FourCC--Length--Value Here,








Note how the first column is titled "FourCC". e.g. the data for the 3-axis accelerometer is recorded under "ACCL" in the format; Z,X,Y.

Now lets start thinking about representing this data;



As shown above, GPMF samples are represented with entries in the following structure;



Lets break each of those components down even further;



As you can see, there are quite a few bits that make up each part of the structure, but lets work through 












Here we can see the FourCC value is the Key (so in the previous example, `key` = `ACCL`). The key has a Length and a Value.




So lets look an example, of GPS data to start with. [In GPMF the key for this data is recorded under the key `GPS5`](https://github.com/gopro/gpmf-parser#hero11-changes-otherwise-supports-all-hero10-metadata) which can be used to record the values; latitude (degrees), longitude (degrees), altitude (meters), 2D ground speed (meters/second), and 3D speed (meters/second).

Let us assume we start with a GPX file with the following;

```xml
<?xml version="1.0" encoding="UTF-8"?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1" creator="https://github.com/juanirache/gopro-telemetry">
    <trk>
        <name>undefined</name>
        <desc>GPS (Lat., Long., Alt., 2D speed, 3D speed) - [deg,deg,m,m/s,m/s]</desc>
        <src>GoPro Max</src>
        <trkseg>
            <trkpt lat="51.2725595" lon="-0.8459936">
                <ele>84.067</ele>
            <time>2021-09-04T07:25:17.352Z</time>
              <fix>3d</fix>
              <hdop>139</hdop>
              <cmt>altitude system: MSLV; 2dSpeed: 0.094; 3dSpeed: 0.12</cmt>
            </trkpt>
```

If this looks familiar, it's the output from [GoPro Telemetry](/blog/2021/gopro-telemetry-exporter-getting-started).

It gives us all the values needed for the `GPS5` key.

* latitude = 51.2725595 degrees
* longitude = -0.8459936 degrees
* altitude = 84.067 meters
* 2dSpeed = 0.094 meters/second
* 3dSpeed = 0.12 meters/second



We know in 









TO DO

## Telemetry metadata (inside `moov` box)

Inside the `meta` `trak` box you'll see more nested boxes;

```
'moov'
	'trak'
	    'tkhd' < track header data >
	    'mdia' 
	        'mdhd' < media header data >
	        'hdlr' < ... Component type = 'mhlr', Component subtype = 'meta', ... Component name = “GoPro MET” ... >
	        'minf' 
		        'gmhd' 
		            'gmin' < media info data >
		            'gpmd' < the type for GPMF data >
		        'dinf' < data information >
		        'stbl' < sample table within >
		            'stsd' < sample description with data format 'gpmd', the type used for GPMF >
		            'stts' < GPMF sample duration for each payload >
		            'stsz' < GPMF byte size for each payload >
		            'stco' < GPMF byte offset with the MP4 for each payload >
```

I won't go over `trak`s again, [this was covered last week](/blog/2022/injecting-camm-gpmd-telemetry-videos-part-2-mp4). Today I will focus exclusively on the `meta` `trak`.

But let us recap just one thing; the boxes in the meta `trak` describe data inside the `mdat` (e.g. duration, track type etc.) and what you can find where.

Let's have a look at out sample video

* `tkhd` (track header) box: this is the track header data, for 
	* `mdia` (track media structure) box: describes the main information of the media data sample of this audio and video track/stream (`trak`), and is a very important box for the player...


* description about data inside the `mdat` (e.g. duration, track type etc.) and what you can find where (e.g. `stco`/`co64` which provides the offset value to fetch the right data from the `mdat` `trak`).



 (e.g. `stco`/`co64` which provides the offset value to fetch the right data from the `mdat` `trak`).

Turning back to the books ([aka the mp4 specification](https://drive.google.com/file/d/1ZdSwSrFzjXeL-6Syw1PjLsyYSln09mPh/view?usp=share_link)) for a second and looking at the boxes nested in the GMPF meta `trak`;





## A deeper look at the `minf` (media info) box


The boxes Almost all boxes contain a concept of time (or a stream). The most obvious is the content in the `mdat` box -- the audio and imagery in the video is streamed over time. This is the same for other boxes too, including those of interest to this exercise for the metadata streams (more on that next week when I talk a bit more about what is in "a box").

		* `mdhd` (media header) box: The overall information of the current audio/video track/stream (`trak`). The box has a duration field and a timescale field. The value of duration/timescale is the duration of the current stream.
		* `hdlr` (handler) box: is used to specify the type of the stream (in this case always `GoPro MET`)
		* `minf`: (media info) box; media information container. This is where the main telemetry is housed...

In the case of GPMF, `minf` contains 3 nested boxes:

### `gmhd`

TODO


### `dinf`

TODO


### `stbl`

The sample table box `stbl`, you can find the corresponding sample description information (`stsd`), timing information (`stts`), sample size information (`stsz`), chunk location information (`stco`), and GoPro metadata (`gpmd`).

`stsd`, `stts`, `stsz`, and `stts` are all box types in the mp4 specification. `gpmd` is custom.

TODO

## Writing values into boxes





Lets start with a simple examp

* 

	   '' < sample table within >
	      'stsd' < sample description with data format 'gpmd', the type used for GPMF >
	      'stts' < GPMF sample duration for each payload >
	      'stsz' < GPMF byte size for each payload >
	      'stco'




> 32-bit aligned payload

If you open up the binary file, [example in last post](/blog/2022/injecting-camm-gpmd-telemetry-videos-part-1-challenges), you will see each line is 32 characters long.



starting point for our script will be at end of video/audio binary data as we append telemetry binary to the end of this binary


The GPMF defined `trak`s in the `moov` box map to `vide` (`0:0`), `soun` (`0:1`) and `meta` (`0:2`) in ffprobe -- each stream in the `mdat` track has its own corresponding metadata `moov` metadata `trak`.

Note, the `tmcd` `trak` shown in the GPMF spec in the sample video is missing (as it is not applicable to this video type -- I've only seen this in unprocessed GoPro `.360` video files).

There can be a varying number of `trak` boxes depending on how the video is created. For example, if there is only video and no audio/metadata track then there would be only one `trak` box present.

Another point to note is that there might be more than one of the stream of the same type depending on the video mode, e.g a `.360` output (note, 360's follow the mp4 standard, and thus are mp4s in all but name) from ffprobe which contains two video streams in the `mdat` box;

```
Stream #0:0[0x1](eng): Video: h264 (High) (avc1 / 0x31637661), yuv420p(tv, bt709, progressive), 3072x1536 [SAR 1:1 DAR 2:1], 38042 kb/s, 59.94 fps, 59.94 tbr, 600 tbn (default)
Stream #0:1[0x2](eng): Video: h264 (High) (avc1 / 0x31637661), yuv420p(tv, bt709, progressive), 3072x1536 [SAR 1:1 DAR 2:1], 38042 kb/s, 59.94 fps, 59.94 tbr, 600 tbn (default)
```

Thus this video will have two `trak` boxes in the `moov` box to describe the metadata of the two video streams in the `mdat` box.

I will go into GPMF in the next post, but back to the main point I am trying to make; the metadata for the telemetry (not the telemetry itself) is housed in the `moov` box. In the `moov` box is nested `trak` files for the streams held in the `mdat` file.

```
├── b'mdat'
└── b'moov'
    ├── b'mvhd'
    ├── b'trak' (vide)
    │   └── ...
    ├── b'trak' (soun)
    │   └── ...
    └── b'trak' (meta)
        └── ...
```

Writing data into 1) nested boxes inside the `trak` (meta) boxes and 2) raw telemetry in the `mdat` is what we're interested in for this exercise.

I'll leave the raw telemetry (`mdat`) aside for a minute.



As noted, more than one `trak` box (aka atom) can exist -- in our sample video there are three `trak` boxes.

