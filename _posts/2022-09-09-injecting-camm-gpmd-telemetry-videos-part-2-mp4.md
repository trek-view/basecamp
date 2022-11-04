---
date: 2022-09-09
title: "Injecting Telemetry into Video Files (Part 2): mp4 Structure"
description: "In this post I will introduce the structure of mp4 files and where video telemetry is boxed."
categories: developers
tags: [gpmd, camm, telemetry, gpmf, gpx]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-09-09/mp4-root-level-boxes-meta.jpeg
featured_image: /assets/images/blog/2022-09-09/mp4-root-level-boxes.jpeg
layout: post
published: true
---

**In this post I will introduce the structure of mp4 files and where video telemetry is boxed.**

MP4, aka MPEG-4, [is a standard](https://www.iso.org/obp/ui/#iso:std:iso-iec:14496:-14:ed-3:v1:en) that defines the container format for compressed digital audio and visual data. In addition to video and audio, the MP4 format container also holds still images and subtitles.

Simply put, MP4 acts like a wrapper around multimedia files and associated data that's necessary for playing the file correctly. But note that, MP4 stores data instead of compressing them, so it has to work with other codecs, for example, H.264/AVC and HEVC for video, AAC, and MP3 for audio, and CAMM or GPMD for telemetry.

If you look at it as a whole, all the data of mp4 is stored in a box structure.

<img class="img-fluid" src="/assets/images/blog/2022-09-09/mp4-box-structure.png" alt="mp4 box structure" title="mp4 box structure" />

You can put more boxes in a box (assuming it conforms to the mp4 specification). Each box has a type which defines different meanings and functions of that box.

To demonstrate we can use a really useful online tool; [Online MP4 file parser](https://www.onlinemp4parser.com/).

<img class="img-fluid" src="/assets/images/blog/2022-09-09/mp4-root-level-boxes.jpeg" alt="mp4 root boxes" title="mp4 root boxes" />

In my sample video (equirectangular with GPMF telemetry) you can see 5 top level boxes (`fytp`, `skip`, `free`, `mdat`, `moov` -- note `skip`, `free` and free space and should never contain data). You will also see the nested boxes in `moov` box in the above screenshot.

* `fytp` (file type) box: contains no nested boxes. It simply identifies the video itself as an MP4 and provides additional compatibility information for players.
* `mdat` (media) box: contains the audio/video payload.
* `moov` (movie) box: contains metadata organised in a nested structure of other boxes -- this is where the telemetry is nested

To help my own understanding, I took the [mp4 specification](https://drive.google.com/file/d/1ZdSwSrFzjXeL-6Syw1PjLsyYSln09mPh/view?usp=share_link) and copied the box structure (and box descriptions) [into a spreadsheet to demo the nested box structure](https://docs.google.com/spreadsheets/d/1QDWCgIl2nnM65IfzSnqk_igMd1jeJCTT0rJFD5MdPfs/edit?usp=sharing). If you're new to the subject, I'm certain you'll find it useful too.

[GoPro themselves describe the box structure of their telemetry in their docs](https://github.com/gopro/gpmf-parser/blob/main/docs/README.md#gopros-mp4-structure);

```
ftyp [type ‘mp41’]
mdat [all the data for all tracks are interleaved]
moov [all the header/index info]
    ‘trak’ subtype ‘vide’, name “GoPro AVC”, H.264 video data 
    ‘trak’ subtype ‘soun’, name “GoPro AAC”, to AAC audio data
    ‘trak’ subtype ‘tmcd’, name “GoPro TCD”, starting timecode (time of day as frame since midnight)
    ‘trak’ subtype ‘meta’, name “GoPro MET”, GPMF telemetry
```

We will go into GPMF in the next post, but the point I am trying to make is here being there is a box structure.

```
+-- moov
    +-- vide
        +-- ...
    +-- soun
        +-- ...
    +-- tmcd
        +-- ...
    +-- meta
        +-- tkhd
        +-- mdia
            +-- ...
```

Without revealing the CAMM structure (before the full post) the box structure is very similar. CAMM data is nested under `moov` -> `meta`;

> The video file should contain the following sample entry box to indicate the custom metadata track, and the subComponentType of the track should be set to meta.

<img class="img-fluid" src="/assets/images/blog/2022-09-09/Camera-Motion-Metadata-Spec-Street-View-Publish-API-Google-Developers.jpeg" alt="CAMM Spec" title="CAMM Spec" />

_[CAMM Specification](https://developers.google.com/streetview/publish/camm-spec)._

Now that's a bit cleared (hopefully), in the next post I will dive into the specifics of GPMF "boxes".