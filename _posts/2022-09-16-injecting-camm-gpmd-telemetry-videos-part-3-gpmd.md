---
date: 2022-09-16
title: "Injecting Telemetry into Video Files (Part 3): GPMF"
description: "In this post I will the structure of GoPro's GPMF standard, how to create a GPMF binary, and how to inject it into a mp4 video file."
categories: developers
tags: [gpmd, camm, telemetry, gpmf, gpx]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-09-16/gopro-gpmf-structure-meta.jpg
featured_image: /assets/images/blog/2022-09-16/gopro-gpmf-structure-sm.jpg
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

Let us start by picking up where the last post left off, the box structure of GMPF;

```
ftyp [type ‘mp41’]
mdat [all the data for all tracks are interleaved]
moov [all the header/index info]
    ‘trak’ subtype ‘vide’, name “GoPro AVC”, H.264 video data 
    ‘trak’ subtype ‘soun’, name “GoPro AAC”, to AAC audio data
    ‘trak’ subtype ‘tmcd’, name “GoPro TCD”, starting timecode (time of day as frame since midnight)
    ‘trak’ subtype ‘meta’, name “GoPro MET”, GPMF telemetry
```

Inside the `meta` `trak` box you'll see more nested boxes;

```
'moov'
	'meta'
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

Turning back to the books ([aka the mp4 specification](https://drive.google.com/file/d/1ZdSwSrFzjXeL-6Syw1PjLsyYSln09mPh/view?usp=share_link)) for a second.

* `trak` (track) box: a container box, and its sub-boxes contain references and descriptions of the track's media data. The media in an MP4 file can contain multiple tracks, and there is at least one track. These tracks are independent of each other and have their own time and space information. `trak` must contain a `tkhd` and a `mdia`, in addition to many optional boxes (omitted).
	* `tkhd` (track header) box: for the track described by tkhd, if it is a video, it will have width and height information, as well as file creation time, modification time, etc.
	* `mdia` (track media structure) box: describes the main information of the media data sample of this audio and video track/stream (`trak`), and is a very important box for the player...
		* `mdhd` (media header) box: The overall information of the current audio/video track/stream (`trak`). The box has a duration field and a timescale field. The value of duration/timescale is the duration of the current stream.
		* `hdlr` (handler) box: is used to specify the type of the stream (in this case always `GoPro MET`)
		* `minf`: (media info) box; media information container. This is where the main telemetry is housed...

## A deeper look at the `minf` (media info) box

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





