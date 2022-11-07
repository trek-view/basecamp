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

If you look at it as a whole, all the data of mp4 is stored in a box structure (you will often here to boxes referred to as atoms, but I will use the term boxes for simplicity in this post).

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

Remember in the last post that ffprobe showed the GPMF sample video had 3 tracks;

```
Stream #0:0[0x1](eng): Video: h264 (High) (avc1 / 0x31637661), yuv420p(tv, bt709, progressive), 3072x1536 [SAR 1:1 DAR 2:1], 38042 kb/s, 59.94 fps, 59.94 tbr, 600 tbn (default)
Stream #0:1[0x2](eng): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 188 kb/s (default)
Stream #0:2[0x3](eng): Data: bin_data (gpmd / 0x646D7067), 117 kb/s (default)
```

These map to the `trak`s `vide` (`0:0`), `soun` (`0:1`) and `meta` (`0:2`). 

Note, the `tmcd` track is missing (as it's not applicable to this video type -- you tend to see this on unprocessed .360 videos). Another point to note is that there might be more than one of the track type depending on the video mode (e.g. .360's (which follow the mp4 standard, and thus mp4s in all but name) have two `vide` tracks).

We will go into GPMF in the next post, but the point I am trying to make is here being there is a box structure nested in each of these 3 boxes `vide`, `soun`, and `meta`.

```
├── moov
    ├── vide
    │   └── ...
    ├── soun
    │   └── ...
    └── meta
        ├── tkhd
        └── mdia
            ├── ...
```

Writing data into nested boxes inside the `meta` box is what we're interested in for this exercise.

Without revealing the CAMM structure (before the full post) the box structure is very similar. CAMM data is nested under `moov` -> `meta`;

> The video file should contain the following sample entry box to indicate the custom metadata track, and the subComponentType of the track should be set to meta.

<img class="img-fluid" src="/assets/images/blog/2022-09-09/Camera-Motion-Metadata-Spec-Street-View-Publish-API-Google-Developers.jpeg" alt="CAMM Spec" title="CAMM Spec" />

_[CAMM Specification](https://developers.google.com/streetview/publish/camm-spec)._

Each box also has a size in bytes. Let's take a look at this using the help of [Google's Spatial Media tool](https://github.com/google/spatial-media/tree/master/spatialmedia);

```shell
git clone https://github.com/google/spatial-media
cd spatial-media
source spatial-media_venv/bin/activate
cd spatialmedia
curl https://gist.githubusercontent.com/himynamesdave/6220ed9b3ab29770c9a5c9019da470e7/raw/0e77d28cc3a00d1f6c801ad01d91c09ce0c13610/print_media.py > print_media.py
python3 print_media.py GS018423.mp4 
```

Which shows prints;

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

Here we can see the mp4 file has size 89002995 (bytes). As expected, most of this is taken up by the `mdat` box (the actual movie) at 88922385 bytes.

You can the size of each box as the last digit of the square brackets. The `moov` box is 20114 bytes, which includes the sum of all boxes inside it.

Each box has a header, shown above as the first digit in square brackets (always `8` above). The minimum size of an atom is 8 bytes (the first 4 bytes specify size (which I just explained) and the next 4 bytes specify box type).

You will notice nested in the `moov` box are 3 `trak` boxes -- these cover metadata for each stream (including the audio and video stream). Still unsure? Remember back to the ffprobe output for this video, it had three streams (audio, video, and metadata in GPMF). We have three `trak` boxes to cover these.

There can be a varying number of `trak` boxes depending on how the video is created. For example, if there is only video and no audio/metadata track then there would be only one `trak` box present.

In this case (because we know the video contains GPMF) we can identify the metadata `trak` by looking for the GoPro definition. We can find it in the last `trak` (as ordered above); `moov` > `trak` > `mdia` > `minf` > `gmhd`.

Finally, one final thing to think about is timing. Videos are not static, they run over a period of time. Almost all boxes contain a concept of time (or a stream). The most obvious is the content in the `mdat` box -- the audio and imagery in the video is streamed over time. This is the same for other boxes too, including those of interest to this exercise for the metadata streams (more on that next week when I talk a bit more about what is in "a box").

Now that is slightly clearer (hopefully), in the next post I will dive into the specifics of GPMF "boxes".