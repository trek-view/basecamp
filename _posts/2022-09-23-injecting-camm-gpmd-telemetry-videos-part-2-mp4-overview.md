---
date: 2022-09-23
title: "Injecting Telemetry into Video Files (Part 2): A high-level introduction to the mp4 specification"
description: "In this post I will introduce the structure of an mp4 file and describe how players use this structure to decode the its contents."
categories: developers
tags: [gpmd, camm, telemetry, gpmf, gpx]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-09-23/mp4-root-level-boxes-meta.jpeg
featured_image: /assets/images/blog/2022-09-23/mp4-root-level-boxes.jpeg
layout: post
published: true
redirect_from:
  - /blog/2022/injecting-camm-gpmd-telemetry-videos-part-2-mp4-overview
---

**In this post I will introduce the structure of an mp4 file and describe how players use this structure to decode the its contents.**

MP4, aka MPEG-4, [is a standard](https://www.iso.org/obp/ui/#iso:std:iso-iec:14496:-14:ed-3:v1:en) that defines the container format for compressed digital audio and visual data. In addition to video and audio, the MP4 format container also holds still images and subtitles.

Simply put, MP4 acts like a wrapper around multimedia files and associated data that's necessary for playing the file correctly. But note that, MP4 stores data instead of compressing them, so it has to work with other codecs, for example, H.264/AVC and HEVC for video, AAC, and MP3 for audio, and CAMM or GPMD for telemetry.

If you look at it as a whole, all the data of mp4 is stored in a box structure (you will often here to boxes referred to as atoms, but I will use the term boxes for simplicity in this post).

<img class="img-fluid" src="/assets/images/blog/2022-09-23/mp4-box-structure.png" alt="mp4 box structure" title="mp4 box structure" />

You can put more boxes in a box (assuming it conforms to the mp4 specification). Each box has a type which defines different meanings and functions of that box.

To demonstrate we can use a really useful online tool; [Online MP4 file parser](https://www.onlinemp4parser.com/).

<img class="img-fluid" src="/assets/images/blog/2022-09-23/mp4-root-level-boxes.jpeg" alt="mp4 root boxes" title="mp4 root boxes" />

In my sample video (equirectangular with GPMF telemetry) you can see 5 top level boxes (`fytp`, `skip`, `free`, `mdat`, `moov` -- note `skip`, `free` and free space and can be ignored here).

_Before I continue, it is important to point out this post is written from the perspective on understanding telemetry data in videos. As such, I will gloss over video and audio structures inside mp4's._

[The GoPro documentation describes the box structure of their mp4 videos using these top level boxes](https://github.com/gopro/gpmf-parser/blob/main/docs/README.md#gopros-mp4-structure);

```
ftyp [type ‘mp41’]
mdat [all the data for all tracks are interleaved]
moov [all the header/index info]
    ‘trak’ subtype ‘vide’, name “GoPro AVC”, H.264 video data 
    ‘trak’ subtype ‘soun’, name “GoPro AAC”, to AAC audio data
    ‘trak’ subtype ‘tmcd’, name “GoPro TCD”, starting timecode (time of day as frame since midnight)
    ‘trak’ subtype ‘meta’, name “GoPro MET”, GPMF telemetry
```

[The mp4 specification also describes each of these boxes in more detail](https://drive.google.com/file/d/1ZdSwSrFzjXeL-6Syw1PjLsyYSln09mPh/view?usp=share_link), but at a high level

* `fytp` (file type) box: contains no nested boxes. It simply identifies the video itself as an MP4 and provides additional compatibility information for players.
* `mdat` (media) box: contains the audio, video and in our case the telemetry payload as binary. It is encoded as binary to mp4 specification, and is not human-readable. Each data type (e.g. video, audio) can appear anywhere in the binary. To make sense of it, the boxes in the `moov` file are needed.
* `moov` (movie) box: contains metadata of the file organised in a nested structure. IMPORTANT: in the case of telemetry, this is not the raw telemetry -- it is description about data inside the `mdat` (e.g. `stsd` describes the telemetry type, etc) and what you can find where (e.g. `stco`/`co64` details where to find each value in the telemetry). 

The relationship between `mdat` and `moov` boxes might be hard to grasp. Stay with me, it will become clear as we dive into the `moov` box. Though let me start by addressing some confusion you might have on this topic.

In the last post that ffprobe I showed my GPMF sample video had 3 tracks;

```shell
ffprobe GS018423.mp4
```

```
Stream #0:0[0x1](eng): Video: h264 (High) (avc1 / 0x31637661), yuv420p(tv, bt709, progressive), 3072x1536 [SAR 1:1 DAR 2:1], 38042 kb/s, 59.94 fps, 59.94 tbr, 600 tbn (default)
Stream #0:1[0x2](eng): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 188 kb/s (default)
Stream #0:2[0x3](eng): Data: bin_data (gpmd / 0x646D7067), 117 kb/s (default)
```

And my CAMM video had 2 track;

```shell
ffprobe 200619_161801314.mp4 
```

```
Stream #0:0[0x1](eng): Data: none (camm / 0x6D6D6163), 2 kb/s (default)
Stream #0:1[0x2](eng): Video: h264 (Baseline) (avc1 / 0x31637661), yuv420p(tv, bt2020nc/bt2020/bt709, progressive), 7680x3840, 103310 kb/s, SAR 1:1 DAR 2:1, 7 fps, 7 tbr, 90k tbn (default)
```

At first I thought this meant there would be 3 (GPMF) and 2 (CAMM) distinct streams of data in these videos. This is wrong. All the raw data for the streams is together in binary found in the `mdat` box. ffprobe knows there are 3 and 2 streams (types of data) in each video because of the description (metadata) of the `mdat` box nested in the `moov` box.

The `moov` box itself can contain a lot of data. To help grasp its complexity I first took the [mp4 specification](https://drive.google.com/file/d/1ZdSwSrFzjXeL-6Syw1PjLsyYSln09mPh/view?usp=share_link) and copied the entirety of all possible box structures (and box descriptions) [into a spreadsheet to demo the nested box structure](https://docs.google.com/spreadsheets/d/1QDWCgIl2nnM65IfzSnqk_igMd1jeJCTT0rJFD5MdPfs/edit?usp=sharing). If you're new to the subject, I'm certain you'll find it a useful stating point too.

The following image will also help you to visualise the nested structure of common `moov` boxes;

<img class="img-fluid" src="/assets/images/blog/2022-09-23/qtff_08.gif" alt="MP4 movie box structure" title="MP4 movie box structure" />

_[Image source](https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/QTFFChap2/qtff2.html)._

And finally, to help further understand this structure I've built some basic tools inside Telemetry Injector (more on that to follow) to show what they look like in actual videos. You can follow along by installing them like so;

```shell
git clone https://github.com/trek-view/telemetry-injector
cd telemetry-injector
python3 -m venv telemetry-injector_venv
source telemetry-injector_venv/bin/activate
pip3 install -r requirements.txt
cd tools
```

To demonstrate I will use my example GPMF video;

```shell
python3 print_video_atoms_overview.py GS018423.mp4
```

Which prints;

```
mpeg4 [89002995]
 ├── b'ftyp' [8, 12]
 ├── b'skip' [8, 19660]
 ├── b'free' [8, 40784]
 ├── b'mdat' [8, 88922385]
 └── b'moov' [8, 20114]
     ├── b'mvhd' [8, 100]
     ├── b'trak' [8, 11882]
     │   ├── b'tkhd' [8, 84]
     │   ├── b'mdia' [8, 10838]
     │   │   ├── b'mdhd' [8, 24]
     │   │   ├── b'hdlr' [8, 41]
     │   │   └── b'minf' [8, 10749]
     │   │       ├── b'vmhd' [8, 12]
     │   │       ├── b'hdlr' [8, 25]
     │   │       ├── b'dinf' [8, 28]
     │   │       └── b'stbl' [8, 10652]
     │   │           ├── b'stsd' [8, 182]
     │   │           │   └── b'avc1' [8, 166]
     │   │           ├── b'stsz' [8, 4464]
     │   │           ├── b'stsc' [8, 20]
     │   │           ├── b'stco' [8, 4460]
     │   │           ├── b'stts' [8, 192]
     │   │           ├── b'stss' [8, 160]
     │   │           └── b'sdtp' [8, 1118]
     │   ├── b'edts' [8, 28]
     │   ├── b'uuid' [8, 446]
     │   └── b'uuid' [8, 446]
     ├── b'trak' [8, 7526]
     │   ├── b'tkhd' [8, 84]
     │   ├── b'mdia' [8, 7390]
     │   │   ├── b'mdhd' [8, 24]
     │   │   ├── b'hdlr' [8, 25]
     │   │   └── b'minf' [8, 7317]
     │   │       ├── b'smhd' [8, 8]
     │   │       ├── b'hdlr' [8, 25]
     │   │       ├── b'dinf' [8, 28]
     │   │       └── b'stbl' [8, 7224]
     │   │           ├── b'stsd' [8, 160]
     │   │           │   └── b'mp4a' [8, 144]
     │   │           │       └── b'wave' [8, 92]
     │   │           │           ├── b'frma' [8, 4]
     │   │           │           ├── b'enda' [8, 2]
     │   │           │           ├── b'esds' [8, 42]
     │   │           │           ├── b'\x00\x00\x00\x00' [8, 0]
     │   │           │           └── b'mp4a' [8, 4]
     │   │           ├── b'stsz' [8, 3496]
     │   │           ├── b'stsc' [8, 20]
     │   │           ├── b'stco' [8, 3492]
     │   │           └── b'stts' [8, 16]
     │   └── b'edts' [8, 28]
     └── b'trak' [8, 574]
         ├── b'tkhd' [8, 84]
         ├── b'mdia' [8, 438]
         │   ├── b'mdhd' [8, 24]
         │   ├── b'hdlr' [8, 34]
         │   └── b'minf' [8, 356]
         │       ├── b'gmhd' [8, 24]
         │       ├── b'dinf' [8, 28]
         │       └── b'stbl' [8, 280]
         │           ├── b'stsd' [8, 24]
         │           │   └── b'gpmd' [8, 8]
         │           ├── b'stsz' [8, 88]
         │           ├── b'stsc' [8, 20]
         │           ├── b'stco' [8, 84]
         │           └── b'stts' [8, 24]
         └── b'edts' [8, 28]
```

This is a similar output to the [Online MP4 file parser](https://www.onlinemp4parser.com/) I used earlier, but shows all the boxes fully expanded.

You can also see the size of each box in bytes as the number to the right of the comma `,` in the square brackets. Above the `mdat` box is 88922385 bytes.

Each box has a header, shown above as the first number to the left of the comma `,` in square brackets. It is always `8` in the example video boxes printed above. This is because the minimum size of an atom is 8 bytes -- the first 4 bytes specify size (which I just explained) and the next 4 bytes specify box type, e.g. `moov`.

The output printed above demonstrates clearly that only the `moov` box has nested boxes. You'll also see that beneath the `moov` box are 3 `trak` boxes. Each of these `trak` boxes represents each stream shown by ffprobe shown earlier (video `0:0`, audio `0:1`, and telemetry `0:2`). For our CAMM example where ffprobe showed 2 streams, only 2 `trak` boxes would exist.

It is from these `moov` > `trak` boxes the ffprobe is pulling all the stream information from. It knows what the stream contains by interrogating the correct boxes.

In the case of telemetry for our GoPro video, this comes from the last `trak` container box;

```
     └── b'trak' [8, 574]
         ├── b'tkhd' [8, 84]
         ├── b'mdia' [8, 438]
         │   ├── b'mdhd' [8, 24]
         │   ├── b'hdlr' [8, 34]
         │   └── b'minf' [8, 356]
         │       ├── b'gmhd' [8, 24]
         │       ├── b'dinf' [8, 28]
         │       └── b'stbl' [8, 280]
         │           ├── b'stsd' [8, 24]
         │           │   └── b'gpmd' [8, 8]
         │           ├── b'stsz' [8, 88]
         │           ├── b'stsc' [8, 20]
         │           ├── b'stco' [8, 84]
         │           └── b'stts' [8, 24]
         └── b'edts' [8, 28]
```

Each of these boxes is responsible for different things but the `stsd` box (Sample Description Atom) contains the information that defines the data structure in this `trak` and ultimately the `mdat` binary. In this case that's `gpmd` (`moov` > `trak` > `mdia` > `minf` > `stbl` > `stsd` > `gpmd`). When I come on to each standard (camm and gpmf), I will explain the content inside of these boxes in a bit.

In the case of video and audio `trak`s the `stsd` box is where describes the encoding (e.g H265) using the boxes. I mention this as it might be helpful to think as CAMM or GPMF in this way (as a sort of codec).

These telemetry `trak` boxes are not unique to each codec (h265, camm, gpmf, etc), and the data each box contains is indistinguishable, regardless of the codec. I will attempt to explain that in the next post.

## A special thanks to...

...the Apple team who wrote [a brilliant overview to video files atoms (boxes) here](https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/QTFFChap2/qtff2.html) that significantly helped me understand the topic and write this post.