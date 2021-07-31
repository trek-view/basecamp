---
date: 2021-08-06
title: "How to Create a 360 Video from a Timelapse of 360 Images"
description: "A lesson, mostly, in wrangling metadata to ensure proper playback of 360 videos you've just created from a series of photos."
categories: developers
tags: [ffmpeg, exiftool, xmp, exif, google, youtube, video]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-08-06
featured_image: /assets/images/blog/2021-08-06
layout: post
published: false
---

**A lesson, mostly, in wrangling metadata to ensure proper playback of 360 videos you've just created from a series of photos.**

In previous posts I've covered, turning 360 videos into a series of timelapse images ([part 1](/blog/2021/turn-360-video-into-timelapse-images-part-1) and [part 2](/blog/2021/turn-360-video-into-timelapse-images-part-2))

You might also want to do the reverse; turn photos into a 360 video.

For example, [when you want to upload them to the Street View Publish API](/blog/2021/preparing-360-video-upload-street-view-publish-api).

In this post I want to outline the process of turning your timelapse 360's into a video and some of the additional considerations to be aware of for Street View, Facebook, YouTube, or wherever else you might want to share them.

## 1. Preparation

For this guide I'll be using [ffmpeg](https://ffmpeg.org/), a free and open-source project consisting of a vast software suite of libraries and programs for handling video, audio, and other multimedia files and streams.

You'll also need [EXIFtool](https://exiftool.org/) to write metadata (e.g. `ProjectionType`) into the resulting video.

As exiftool cannot write in `XMP-GSpherical` tags (more on that later), [you'll also need a copy of this set of scripts from Google on your machine](https://github.com/google/spatial-media).

I'll use a series of 55 timelapse photos shot using a GoPro Fusion at 5 second intervals and stitched as `.jpg` files at 5.8K. [Grab them here if you want to follow along](https://drive.google.com/drive/u/1/folders/10IUugn77hfiUjPG-p70knRdZb_u37TB5).

Of course, you are free to use your own too.

If you choose to use your own images, be aware this post assumes your images are:

* in sequential ascending order by filename (e.g. MULTISHOT_9698_000000.jpg, MULTISHOT_9698_000001.jpg, MULTISHOT_9698_000002.jpg, etc.)
* all placed in a single directory containing only images you want in the video

## 2. Create the video

Now we can create a video called `demo-video-no-meta.mp4` using all the images in the directory:

```
$ ffmpeg -start_number 000000 -framerate 1 -i MULTISHOT_9698_%06d.jpg -pix_fmt yuv420p demo-video-no-meta.mp4
```

Let's break that down:

* `-i MULTISHOT_9698_%06d.jpg`: the filenames to match on. `%06d` means capture 6 digits. `%03d` would mean capture 3 digits.
* `-start_number 000000`: if you want to start with a specific image then use the `-start_number` option. In our case this is not really required, as ffmpeg will start with the lowest alphanumeric filename. In this case first image `%06d`=`000000`.
* `-framerate 1`: the framerate per second. Here I want 1 frame every 1 second. If -framerate` option is omitted the default will input and output 25 frames per second.
* `-pix_fmt yuv420p`: _[When outputting H.264, adding -vf format=yuv420p or -pix_fmt yuv420p will ensure compatibility so crappy players can decode the video.](https://trac.ffmpeg.org/wiki/Slideshow)_

It's looking good. There are 55 images in my sequence and the video is 55 seconds long. However, it's not showing as a 360 video... yet.

<iframe width="560" height="315" src="https://www.youtube.com/embed/KCUG5A3vBZU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

**A note on framerate**

You will see I set framerate at 1 second, when the actual time spacing in the `datetimeoriginal` is 5 seconds between photos.

The video will still include all images, but playback will be faster than actual time spacing. 1 second, instead of 5 seconds (so 80% faster)

It is important that if you want to retain positional information with the video, for example, [to upload to Street View](/blog/2021/preparing-360-video-upload-street-view-publish-api), you also correctly modify the accompanying GPS track. In this case, I would rewrite the GPS times to be spaced 1 second apart, rather than 5. 

For example if the original spacing was 5 seconds between GPS times (e.g. 12:00:00, 12:00:05, 12:00:10, 12:00:15, 12:00:20), I would modify the times to increment by one second (e.g. 12:00:00, 12:00:01, 12:00:02, 12:00:03, 12:00:04, 12:00:05).

Of course, this will artificially increase travel speed between photos (as I said earlier -- 80% quicker), but will ensure positional information is correct (which is the most important for street-level image platforms).

## 3. Add the required metadata

[As I talked about last year](/blog/2020/metadata-exif-xmp-360-video-files), video files, and specifically 360 video files, hold metadata that's important for video players to render and display the video correctly. For example, 360 players will look for `ProjectionType=equirectangular` (amongst other things) to display 360 controls.

Looking at the metadata of the video I just created using exiftool:

```
$ exiftool -G -a demo-video-no-meta.mp4 > demo-video-no-meta-metadata.txt
```

Gives a .txt file with the contents:

```
[ExifTool]      ExifTool Version Number         : 12.10
[File]          File Name                       : demo-video-no-meta.mp4
[File]          Directory                       : .
[File]          File Size                       : 119 MB
[File]          File Modification Date/Time     : 2021:07:30 20:10:27+01:00
[File]          File Access Date/Time           : 2021:07:30 20:10:29+01:00
[File]          File Inode Change Date/Time     : 2021:07:30 20:10:27+01:00
[File]          File Permissions                : rw-r--r--
[File]          File Type                       : MP4
[File]          File Type Extension             : mp4
[File]          MIME Type                       : video/mp4
[QuickTime]     Major Brand                     : MP4  Base Media v1 [IS0 14496-12:2003]
[QuickTime]     Minor Version                   : 0.2.0
[QuickTime]     Compatible Brands               : isom, iso2, avc1, mp41
[QuickTime]     Media Data Size                 : 124504510
[QuickTime]     Media Data Offset               : 48
[QuickTime]     Movie Header Version            : 0
[QuickTime]     Create Date                     : 0000:00:00 00:00:00
[QuickTime]     Modify Date                     : 0000:00:00 00:00:00
[QuickTime]     Time Scale                      : 1000
[QuickTime]     Duration                        : 0:00:55
[QuickTime]     Preferred Rate                  : 1
[QuickTime]     Preferred Volume                : 100.00%
[QuickTime]     Matrix Structure                : 1 0 0 0 1 0 0 0 1
[QuickTime]     Preview Time                    : 0 s
[QuickTime]     Preview Duration                : 0 s
[QuickTime]     Poster Time                     : 0 s
[QuickTime]     Selection Time                  : 0 s
[QuickTime]     Selection Duration              : 0 s
[QuickTime]     Current Time                    : 0 s
[QuickTime]     Next Track ID                   : 2
[QuickTime]     Track Header Version            : 0
[QuickTime]     Track Create Date               : 0000:00:00 00:00:00
[QuickTime]     Track Modify Date               : 0000:00:00 00:00:00
[QuickTime]     Track ID                        : 1
[QuickTime]     Track Duration                  : 0:00:55
[QuickTime]     Track Layer                     : 0
[QuickTime]     Track Volume                    : 0.00%
[QuickTime]     Matrix Structure                : 1 0 0 0 1 0 0 0 1
[QuickTime]     Image Width                     : 5760
[QuickTime]     Image Height                    : 2880
[QuickTime]     Media Header Version            : 0
[QuickTime]     Media Create Date               : 0000:00:00 00:00:00
[QuickTime]     Media Modify Date               : 0000:00:00 00:00:00
[QuickTime]     Media Time Scale                : 16384
[QuickTime]     Media Duration                  : 0:00:55
[QuickTime]     Media Language Code             : und
[QuickTime]     Handler Type                    : Video Track
[QuickTime]     Handler Description             : VideoHandler
[QuickTime]     Graphics Mode                   : srcCopy
[QuickTime]     Op Color                        : 0 0 0
[QuickTime]     Compressor ID                   : avc1
[QuickTime]     Source Image Width              : 5760
[QuickTime]     Source Image Height             : 2880
[QuickTime]     X Resolution                    : 72
[QuickTime]     Y Resolution                    : 72
[QuickTime]     Bit Depth                       : 24
[QuickTime]     Buffer Size                     : 0
[QuickTime]     Max Bitrate                     : 18109746
[QuickTime]     Average Bitrate                 : 18109746
[QuickTime]     Video Frame Rate                : 1
[QuickTime]     Handler Type                    : Metadata
[QuickTime]     Handler Vendor ID               : Apple
[QuickTime]     Encoder                         : Lavf58.76.100
[Composite]     Image Size                      : 5760x2880
[Composite]     Megapixels                      : 16.6
[Composite]     Avg Bitrate                     : 18.1 Mbps
[Composite]     Rotation                        : 0
```

There's already a lot here. We can see the video resolution, the duration, and lots of other default fields that are not really required for our use-case.

[Let's start by looking inside the first photo to see some of the EXIF data we'll need to add to the video](/blog/2020/metadata-exif-xmp-360-photo-files).

```
$ exiftool -G -a MULTISHOT_9698_000000.jpg > MULTISHOT_9698_000000_metadata.txt
```
Gives a .txt file with the contents:

```
[ExifTool]      ExifTool Version Number         : 12.10
[File]          File Name                       : MULTISHOT_9698_000000.jpg
[File]          Directory                       : .
[File]          File Size                       : 13 MB
[File]          File Modification Date/Time     : 2020:05:16 12:40:02+01:00
[File]          File Access Date/Time           : 2021:07:30 19:57:27+01:00
[File]          File Inode Change Date/Time     : 2021:07:30 19:57:26+01:00
[File]          File Permissions                : rw-rw-r--
[File]          File Type                       : JPEG
[File]          File Type Extension             : jpg
[File]          MIME Type                       : image/jpeg
[File]          Exif Byte Order                 : Little-endian (Intel, II)
[File]          Image Width                     : 5760
[File]          Image Height                    : 2880
[File]          Encoding Process                : Baseline DCT, Huffman coding
[File]          Bits Per Sample                 : 8
[File]          Color Components                : 3
[File]          Y Cb Cr Sub Sampling            : YCbCr4:4:4 (1 1)
[JFIF]          JFIF Version                    : 1.01
[JFIF]          Resolution Unit                 : inches
[JFIF]          X Resolution                    : 0
[JFIF]          Y Resolution                    : 0
[EXIF]          Image Width                     : 5760
[EXIF]          Image Height                    : 2880
[EXIF]          Make                            : GoPro
[EXIF]          Camera Model Name               : GoPro Fusion FS1.04.01.80.00
[EXIF]          Software                        : GoPro Fusion Studio 1.3.0.400
[EXIF]          Modify Date                     : 2019:11:29 20:41:18
[EXIF]          Artist                          : https://www.trekview.org
[EXIF]          Copyright                       : https://www.trekview.org
[EXIF]          Date/Time Original              : 2019:11:29 13:07:17
[EXIF]          User Comment                    : Please contact hq@trekview.org if you want to use this photograph commercially.
[EXIF]          GPS Latitude Ref                : North
[EXIF]          GPS Latitude                    : 28 deg 17' 55.14"
[EXIF]          GPS Longitude Ref               : West
[EXIF]          GPS Longitude                   : 16 deg 32' 44.90"
[EXIF]          GPS Altitude Ref                : Above Sea Level
[EXIF]          GPS Altitude                    : 2323.621 m
[EXIF]          GPS Time Stamp                  : 13:06:48
[EXIF]          GPS Date Stamp                  : 2019:11:29
[XMP]           XMP Toolkit                     : XMP Core 4.4.0-Exiv2
[XMP]           Stitching Software              : GoPro Fusion Studio 1.3.0.400
[XMP]           Source Photos Count             : 2
[XMP]           Use Panorama Viewer             : True
[XMP]           Projection Type                 : equirectangular
[XMP]           Cropped Area Image Height Pixels: 2880
[XMP]           Cropped Area Image Width Pixels : 5760
[XMP]           Full Pano Height Pixels         : 2880
[XMP]           Full Pano Width Pixels          : 5760
[XMP]           Cropped Area Left Pixels        : 0
[XMP]           Cropped Area Top Pixels         : 0
[Composite]     Image Size                      : 5760x2880
[Composite]     Megapixels                      : 16.6
[Composite]     GPS Altitude                    : 2323.6 m Above Sea Level
[Composite]     GPS Date/Time                   : 2019:11:29 13:06:48Z
[Composite]     GPS Latitude                    : 28 deg 17' 55.14" N
[Composite]     GPS Longitude                   : 16 deg 32' 44.90" W
[Composite]     GPS Position                    : 28 deg 17' 55.14" N, 16 deg 32' 44.90" W
```
Values needed for our requirements are:

* [EXIF] GPS Time Stamp / GPS Date Stamp: gives us start time (note Modify Date shows stitching date, not capture date, so GPS Date/Time is most accurate)
* [XMP] Source Photos Count: tells us the number of cameras originally used to create the image
* [XMP] Stitching Software: defines the software used to stitch images into a 360 image
* [XMP] Projection Type: tells us it's a panorama if `equirectangular` (more useful when automating this process, and this needs to be validated)
* [XMP]Cropped Area Image Height Pixels/Cropped Area Image Width Pixels




Of course, other values like `[EXIF] Make`, `[EXIF] Camera Model Name`, etc. are also a good idea to write into the metadata ensure viewers have the full information about the video, however, I'll omit this for the blog post.

Video and photo metadata is slightly different. We need to use these values to write the following video metadata:

[XMP] Spherical
[XMP] Stitched
[XMP] Stitching Software
[XMP] Projection Type


https://github.com/google/spatial-media/tree/master/spatialmedia


https://exiftool.org/forum/index.php?topic=12024.0


I'll start by making a copy of the video file:

```
$ cp demo-video-no-meta.mp4 demo-video-with-meta.mp4
```

We will start by adding the following tag:

```
$ exiftool -XMP-GSpherical:Spherical=true demo-video-with-meta.mp4
```

To get it working on YouTube, [we need to Google's required metadata for sperichal videos](https://github.com/google/spatial-media/blob/master/docs/spherical-video-rfc.md#allowed-global-metadata-elements).

For completeness, I'll demonstrate adding all required and optional `XMP-GSpherical` tags.

```
$ exiftool -XMP-GSpherical:Stitched=true -XMP-GSpherical:StitchingSoftware='Fusion Studio / GStreamer' -XMP-GSpherical:ProjectionType=equirectangular -XMP-GSpherical:StereoMode=mono -XMP-GSpherical:SourceCount=2 -XMP-GSpherical:InitialViewHeadingDegrees=0 -XMP-GSpherical:InitialViewPitchDegrees=0 -XMP-GSpherical:InitialViewRollDegrees=0 -XMP-GSpherical:TimeStamp='2019:11:29 13:06:48+00:00' -XMP-GSpherical:FullPanoWidthPixels=5760 -XMP-GSpherical:FullPanoHeightPixels=2880 -XMP-GSpherical:CroppedAreaImageWidthPixels=0 -XMP-GSpherical:CroppedAreaImageHeightPixels=0 -XMP-GSpherical:CroppedAreaLeftPixels=0 -XMP-GSpherical:CroppedAreaTopPixels=0 demo-video-with-meta.mp4
```

Let's check these commands worked as intended:

```
$ exiftool -G -a demo-video-with-meta.mp4 > demo-video-with-meta-metadata.txt
```

Success:

```
[XMP]           Spherical                       : True
[XMP]           Stitched                        : True
[XMP]           Projection Type                 : equirectangular
[XMP]           Use Panorama Viewer             : True
[XMP]           Stitching Software              : Fusion Studio / GStreamer
```

OK, at this point your wondring what `XMP-GSpherical`, `XMP-GPano` are. Well, these reference various XMP namespaces ([of which there are many](https://exiftool.org/TagNames/XMP.html)).

The above commands will provide enough metadata to render the video in most generic viewers ([I recommend VLC](https://www.videolan.org/vlc/index.en_GB.html)).

I've noticed some manufacturerer viewers (e.g. GoPro Player) will only render 360 video correctly if their named in the metadata as the software is expecting (e.g. `-XMP-GPano:StitchingSoftware='Fusion Studio / GStreamer'`).



StitchingSoftware	

## A note on telemetry


I'm only adding video level data, and not telemetry in this video as this becomes a lot more complex, and is generally not required. It's a good idea to create a GPS track from your images that can be used alongside your video though.

2020-05-08-metadata-exif-xmp-360-video-files.md
