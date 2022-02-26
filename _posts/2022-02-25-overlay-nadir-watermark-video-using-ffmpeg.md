---
date: 2022-02-25
title: "Using ffmpeg to overlay a custom nadir or watermark on GoPro videos"
description: "Add your logo to the nadir of an equirectangular video or as a watermark to HERO videos."
categories: developers
tags: [nadir, ffmpeg, imagemagick]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-02-25/youtube-gopro-nadir-meta.png
featured_image: /assets/images/blog/2022-02-25/youtube-gopro-nadir-sm.png
layout: post
published: true
---

**Add your logo to the nadir of an equirectangular video or as a watermark to HERO videos.**

In previous post I have covered how to add a nadir to equirectangular images:

* [manually (using GIMP)](/blog/2020/adding-a-custom-nadir-to-360-video-photo), and here:
* [programmatically (using ImageMagick)](/blog/2021/adding-a-custom-nadir-to-360-video-photo)

And how to add a watermark to normal photos:

* [programmatically (using ImageMagick)](/blog/2022/adding-a-custom-watermark-to-hero-photo-video)

All of these approaches required breaking videos down into frames, overlaying the nadir or watermark, and then re-rendering into a video.

When doing this for videos shot at 24FPS the number of frames that need to be processed quickly increases. For example, one minute of footage shot at 24 FPS will produce 1440 frames (`24*60`).

As I get more familiar with ffmpeg, I realised it could be used to create a much simpler approach to add such an overlay on video files.

```shell
$ ffmpeg -i INPUT.mp4 -i IMAGE_OVERLAY.png \
-filter_complex "[0:v][1:v] overlay=XXXX:YYYY" \
-pix_fmt yuv420p -c:a copy \
output.mp4
```

Where:

* `INPUT.mp4`: is the video file (note, this post only considers stitched mp4 files from the GoPro 360 cameras -- Fusion and MAX)
* `IMAGE_OVERLAY.png`: is the nadir (for equirectangular videos) or watermark (for normal videos)
* `overlay=XXXX:YYYY` the position to overlay the image. `XXXX` is the horizontal pixels and `YYYY` is the vertical pixels (from top left corner `0:0`)
* `[0:v][1:v]`: here we create 2 video tracks for the output, where `[0:v]` is the original video input and `[1:v]` is the image to be overlaid as another video track (`IMAGE_OVERLAY.png`).
* `-pix_fmt yuv420p`: _[When outputting H.264, adding -vf format=yuv420p or -pix_fmt yuv420p will ensure compatibility so crappy players can decode the video.](https://trac.ffmpeg.org/wiki/Slideshow)_
* `-c:v libx264` is an abbreviated version of codec:v. Encodes the video using the libx264 codec (H264).
* The -acodec copy / -c:a copy that you have in your command f.e. would simply re-use the audio from the source file. Though you can't do that with the video of course (in this case), that has to be transcoded because we are creating a new video source.

## Implementing this programmatically

Below walks through a pipeline of determining how to process each video 

### 1. Determine projection type

Using exiftool;

```shell
$ exiftool -ee -G3 -api LargeFileSupport=1 -X  -XMP-GSpherical:ProjectionType GS018421-5_6k-output.mp4
````

Gives'
```
 <XMP-GSpherical:ProjectionType>equirectangular</XMP-GSpherical:ProjectionType>
```

If a value is returned, it's a 360 video.

If no value returned, we would know it is a HERO video, if input is a GoPro .mp4 file.

### 2. Determine video resolution

Using exiftool;

```shell
$ exiftool -ee -G3 -api LargeFileSupport=1 -X -ImageWidth -ImageHeight GS018421-5_6k-output.mp4
````

Gives;

```xml
 <Track1:ImageWidth>5376</Track1:ImageWidth>
 <Track1:ImageHeight>2688</Track1:ImageHeight>
```

### 3. Identify video tracks

Each GoPro camera contains a range of tracks (video track, audio track, [gpmd](/blog/2020/metadata-exif-xmp-360-video-files-gopro-gpmd) track).

The types of tracks included depend on the camera and mode used.

For example, videos shot in timewarp mode do not contain an audio track.

You first need to read what tracks exist in the mp4 files to decide what needs to be copied.

For our purposes only video, audio and gpmd (telemetry) tracks are required.

It is possible to identify these using `ffprobe`;

```shell
$ ffprobe -i GS028461.mp4
```

Which returns;

```
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from 'GS028461.mp4':
  Metadata:
    major_brand     : qt  
    minor_version   : 0
    compatible_brands: qt  
    creation_time   : 2021-09-19T14:49:46.000000Z
  Duration: 00:08:02.48, start: 0.000000, bitrate: 116347 kb/s
  Stream #0:0[0x1](eng): Video: h264 (High) (avc1 / 0x31637661), yuvj420p(pc, bt709, progressive), 5376x2688 [SAR 1:1 DAR 2:1], 116169 kb/s, 23.98 fps, 23.98 tbr, 600 tbn (default)
    Metadata:
      creation_time   : 2021-09-19T14:49:46.000000Z
      handler_name    : Core Media Video
      vendor_id       : [0][0][0][0]
      encoder         : H.264
    Side data:
      spherical: equirectangular (0.000000/0.000000/0.000000) 
  Stream #0:1[0x2](eng): Audio: aac (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 189 kb/s (default)
    Metadata:
      creation_time   : 2021-09-19T14:49:46.000000Z
      vendor_id       : [0][0][0][0]
  Stream #0:2[0x3](eng): Data: bin_data (gpmd / 0x646D7067), 87 kb/s (default)
    Metadata:
      creation_time   : 2021-09-19T14:49:46.000000Z
      handler_name    : GoPro MET
Unsupported codec with id 98314 for input stream 2
```

I worked with exiftool previously in this post, which can also be used to identify tracks that exist in the video

```shell
$ exiftool -ee -G3 -api LargeFileSupport=1 -X GS028461.mp4 > GS028461.xml 
```

Which returns and `.xml` file with the following sections;

**Metadata (metadata)**

```xml
...
 <XMP-GSpherical:Spherical>true</XMP-GSpherical:Spherical>
 <XMP-GSpherical:Stitched>true</XMP-GSpherical:Stitched>
 <XMP-GSpherical:StitchingSoftware>Spherical Metadata Tool</XMP-GSpherical:StitchingSoftware>
 <XMP-GSpherical:ProjectionType>equirectangular</XMP-GSpherical:ProjectionType>
 <XMP-GSpherical:Spherical>true</XMP-GSpherical:Spherical>
 <XMP-GSpherical:Stitched>true</XMP-GSpherical:Stitched>
 <XMP-GSpherical:StitchingSoftware>Spherical Metadata Tool</XMP-GSpherical:StitchingSoftware>
 <XMP-GSpherical:ProjectionType>equirectangular</XMP-GSpherical:ProjectionType>
 ....
 ```

**Track1 - Video track (Stream #0:0)**

```xml
 <Track1:HandlerClass>Media Handler</Track1:HandlerClass>
 <Track1:HandlerType>Video Track</Track1:HandlerType>
 <Track1:HandlerVendorID>Apple</Track1:HandlerVendorID>
 <Track1:HandlerDescription>Core Media Video</Track1:HandlerDescription>
```

**Track2 - Audio track (Stream #0:1)**

```xml
 <Track2:HandlerClass>Media Handler</Track2:HandlerClass>
 <Track2:HandlerType>Audio Track</Track2:HandlerType>
 <Track2:HandlerVendorID>Apple</Track2:HandlerVendorID>
 <Track2:AudioFormat>mp4a</Track2:AudioFormat>
```

**Track3 - Telemetry (GPMD) track (Stream #0:2)**

```xml
 <Track3:HandlerClass>Media Handler</Track3:HandlerClass>
 <Track3:HandlerType>NRT Metadata</Track3:HandlerType>
 <Track3:HandlerVendorID>Apple</Track3:HandlerVendorID>
 <Track3:HandlerDescription>GoPro MET</Track3:HandlerDescription>
```

**Note on GoPro TCD**

HERO videos also contain a `tmcd` (`GoPro TCD`) track.

```xml
 <Track3:HandlerClass>Media Handler</Track3:HandlerClass>
 <Track3:HandlerType>Time Code</Track3:HandlerType>
 <Track3:HandlerDescription>GoPro TCD  </Track3:HandlerDescription>
```

I was not able to figure out how to copy this track across to the new video using ffmpeg. This track seems to be related to timecodes. As noted earlier, I am fine ignoring it as it is not required for what I want to do.

### 4. Create nadir (equirectangular only)

If during step 1 video was identified to be equirectangular the logo used for the nadir overlay needs to first be converted into an equirectangular projection so that it renders correctly in a 360 viewer.

[I describe how to do this using ImageMagick here](/blog/2021/adding-a-custom-nadir-to-360-video-photo)

### 5. Adjust size of nadir (equirectangular) or watermark (flat)

You want the nadir or watermark to be scaled based on the video resolution.

It is easy to do this using the video track where `ImageWidth` and `ImageHeight` is reported.

```
 <Track1:ImageWidth>5376</Track1:ImageWidth>
 <Track1:ImageHeight>2688</Track1:ImageHeight>
```

You can then use these values to adjust the nadir / watermark image accordingly using ImageMagick. Again this is described in two previous posts:

* [For equirectangular videos (nadir)](/blog/2021/adding-a-custom-nadir-to-360-video-photo)
* [For normal videos (watermarks)](/blog/2022/adding-a-custom-watermark-to-hero-photo-video)


### 6. Overlay nadir or watermark image using ffmpeg

To do this, you use the same command described at the start of this post.

```shell
$ ffmpeg -i INPUT.mp4 -i IMAGE_OVERLAY.png \
-filter_complex "[0:v][1:v] overlay=XXXX:YYYY" \
-pix_fmt yuv420p -c:a copy -map_metadata 0 -map 0:NNNN \
output.mp4
```

First, replace `NNNN` with the GMPD stream number (identified at step 3).

Secondly, now the video size, and nadir / watermark size is known you can calculate the overlay position.

**Nadir example**

The video measures `5376x2688` and the nadir is `5376x268` (10% of image height).

Therefore `XXXX` = `0` and `YYYY` = `2420` (`2688-268`).

Try it for yourself:

* [`GS018421-5_6k-output.mp4` (5376x2688)](https://drive.google.com/file/d/1FPSUY8KMsCL_UfEzbTOsjFVSUHZiBobK/view?usp=sharing)
  * [Metadata to identify video streams (track 3 is gpmd)](https://drive.google.com/file/d/1HGwhK4SH_Wl1eN_mBj1PMFlI8cescto_/view?usp=sharing)
* [`trek-view-square-nadir-5376.png` (5376x268) (already processed by ImageMagick @ 10% of height)](https://drive.google.com/file/d/1Nu8hUakDbOk82pVDFMayHmapNEpwGc01/view?usp=sharing)

```shell
$ ffmpeg -i GS018421-5_6k-output.mp4 -i trek-view-square-nadir-5376.png \
-filter_complex "[0:v][1:v] overlay=0:2420" \
-pix_fmt yuv420p -c:a copy -map_metadata 0 -map 0:1 -map 0:2 -copy_unknown -tag:2 gpmd \
GS018421-5_6k-output-nadir.mp4
```

I was not able to figure out how to use to copy `XMP-GSpherical` tags, used by most video software to identify equirectangular content.

[You can use Google's Spatial Media Metadata Injector tool to do this](https://github.com/google/spatial-media/tree/master/spatialmedia).

 ```shell
$ git clone https://github.com/google/spatial-media.git
$ cd spatialmedia
$ python spatialmedia -i GS018421-5_6k-output-nadir.mp4 GS018421-5_6k-output-nadir-gspherical.mp4
```

Gives;

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/vE1DH1Tt-sA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

And you will see all the original tracks and spatial metadata is present in the metadata;


```shell
$ exiftool -ee -G3 -api LargeFileSupport=1 -X GS018421-5_6k-output-nadir-gspherical.mp4 > GS018421-5_6k-output-nadir-gspherical.xml
````

[Download GS018421-5_6k-output-nadir-gspherical.xml](https://drive.google.com/file/d/1T4zoHBSltEPaLzuPXnow4x2G8pChNu8q/view?usp=sharing)

**Watermark example**

Therefore, the horizontal offset required 

The video measures `1920x1440` and the watermark is `144x144` (10% of image height).

If you wanted to place the logo in the bottom left hand corner of the image you would set `XXXX` = `1776` (`1920-144`) and `YYYY` = `1296` (`1440-144`).

Try it for yourself:

* [`GH018658.MP4` (1920x1440)](https://drive.google.com/file/d/1E0C__X6UixzxcCEda9UJ4u0VUrBZPEqf/view?usp=sharing)
  * [Metadata to identify streams (track 4 is gpmd)](https://drive.google.com/file/d/1ADOthul_OmGPY1pnB3lR4FJLpPGXAXDk/view?usp=sharing)
* [`trek-view-square-watermark-144.png` (144x144) (already processed by ImageMagick @ 10% of height)](https://drive.google.com/file/d/1b0LzXAUxozqh9SXyF8p5h5Zbn3-NldZp/view?usp=sharing)

```shell
$ ffmpeg -i GH018658.MP4 -i trek-view-square-watermark-144.png \
-filter_complex "[0:v][1:v] overlay=1776:1296" \
-pix_fmt yuv420p -c:a copy -map_metadata 0 -map 0:1 -map 0:3 -map 0:3 -copy_unknown -tag:3 gpmd \
GH018658-nadir.mp4
```

Gives;

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/cp3W1z8I_wU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

And you will see all the original tracks and spatial metadata is present in the metadata;

```shell
$ exiftool -ee -G3 -api LargeFileSupport=1 -X GH018658-nadir.mp4 > GH018658-nadir.xml
````

[Download GH018658-nadir.xml](https://drive.google.com/file/d/125aMNHwuFX1agA3NZvgFJPwgJEMgpS9L/view?usp=sharing)