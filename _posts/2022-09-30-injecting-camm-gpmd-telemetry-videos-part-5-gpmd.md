---
date: 2022-09-30
title: "Injecting Telemetry into Video Files (Part 5): GPMF"
description: "In this post I will the structure of GoPro's GPMF standard, how to create a GPMF binary, and how to inject it into a mp4 video file."
categories: developers
tags: [gpmd, camm, telemetry, gpmf, gpx]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-09-30/gopro-gpmf-structure-meta.jpg
featured_image: /assets/images/blog/2022-09-30/gopro-gpmf-structure-sm.jpg
layout: post
published: true
---

**In this post I will the structure of GoPro's GPMF standard, how to create a GPMF binary, and how to inject it into a mp4 video file.**

In [my last post I teased an example of how GPMF boxes are housed in an mp4 file](/blog/2022/injecting-camm-gpmd-telemetry-videos-part-2-mp4).

To understand what was shown at the end of the post, we need to understand the structure of GPMF. Luckily GoPro have written extensively on the subject.

## A recap on GPMF

In fact, their [gpmf-write](https://github.com/gopro/gpmf-write) repository creates GPMF, and their [gpmf-parser](https://github.com/gopro/gpmf-parser) parses it.

What GoPro say;

> GPMF -- GoPro Metadata Format or General Purpose Metadata Format -- is a modified Key, Length, Value solution, with a 32-bit aligned payload, that is both compact, full extensible and somewhat human readable in a hex editor. GPMF allows for dependent creation of new FourCC tags, without requiring central registration to define the contents and whether the data is in a nested structure. GPMF is optimized as a time of capture storage format for the collection of sensor data as it happens.

_[https://github.com/gopro/gpmf-write](https://github.com/gopro/gpmf-write)_

OK, that's quite a mouthful. I promise by the end of this post it will all make sense.

Let us start by picking up where the last post left off, the box specification of GMPF;

```
ftyp [type ‘mp41’]
mdat [all the data for all tracks are interleaved]
moov [all the header/index info]
    ‘trak’ subtype ‘vide’, name “GoPro AVC”, H.264 video data 
    ‘trak’ subtype ‘soun’, name “GoPro AAC”, to AAC audio data
    ‘trak’ subtype ‘tmcd’, name “GoPro TCD”, starting timecode (time of day as frame since midnight)
    ‘trak’ subtype ‘meta’, name “GoPro MET”, GPMF telemetry
```

## Raw telemetry (inside `mdat` box)

To begin with, it is worth familiarising yourself with the data that GPMF supports (put another way, the types and values of telemetry that can be recorded).

[You can see the specifics of what each GoPro camera writes (generally, the newer the GoPro camera, the more telemetry data is written because there are more sensors)](https://github.com/gopro/gpmf-parser#where-to-find-gpmf-data).

<img class="img-fluid" src="/assets/images/blog/2022-09-30/gpmf-max-camera-telemetry.png" alt="GoPro MAX GPMF" title="GoPro MAX GPMF" />

Above is a snippet of what telemetry the GoPro MAX writes into GPMF.

Note how the first column is titled "FourCC". e.g. the data for the 3-axis accelerometer is recorded under "ACCL" in the format; Z,X,Y.

Now lets start thinking about representing this as binary...

<img class="img-fluid" src="/assets/images/blog/2022-09-30/gopro-gpmf-structure-sm.jpg" alt="GoPro GPMF Key Length Value design" title="GoPro GPMF Key Length Value design" />

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

