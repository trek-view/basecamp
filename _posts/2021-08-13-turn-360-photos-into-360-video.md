---
date: 2021-08-13
title: "How to Create a 360 Video from a Timelapse of 360 Images (using ffmpeg)"
description: "A lesson, mostly, in wrangling metadata to ensure proper playback of 360 videos created from a series of photos."
categories: developers
tags: [ffmpeg, exiftool, xmp, exif, google, youtube, video, camm, gpmd, Camera Motion Metadata]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-08-13/youtube-360-video-meta.jpg
featured_image: /assets/images/blog/2021-08-13/youtube-360-video-sm.jpg
layout: post
published: true
---

**A lesson, mostly, in wrangling metadata to ensure proper playback of 360 videos created from a series of photos.**

In previous posts I've covered, turning 360 videos into a series of timelapse images ([part 1](/blog/turn-360-video-into-timelapse-images-part-1) and [part 2](/blog/turn-360-video-into-timelapse-images-part-2))

You might also want to do the reverse; turn photos into a 360 video.

In this post I want to outline the process of turning your timelapse 360 photo's into a 360 video and some of the additional considerations to be aware of for playback.

## 1. Preparation

For this guide I'll be using [ffmpeg](https://ffmpeg.org/), a free and open-source project consisting of a vast software suite of libraries and programs for handling video, audio, and other multimedia files and streams.

You'll also need [EXIFtool](https://exiftool.org/) to write metadata (e.g. `ProjectionType`) into the resulting video.

As exiftool cannot write in `XMP-GSpherical` tags (more on that later), [you'll also need a copy of this set of scripts (Spatial Media Metadata Injector) from Google on your machine](https://github.com/google/spatial-media).

I'll use a series of 55 timelapse photos shot using a GoPro Fusion at 5 second intervals and stitched as `.jpg` files at 5.8K. [Grab them here if you want to follow along](https://drive.google.com/drive/u/1/folders/10IUugn77hfiUjPG-p70knRdZb_u37TB5).

Of course, you are free to use your own timelapse photos too.

If you choose to use your own images, be aware this post assumes your images are:

* in sequential ascending order by filename (e.g. MULTISHOT_9698_000000.jpg, MULTISHOT_9698_000001.jpg, MULTISHOT_9698_000002.jpg, etc.)
* all placed in a single directory containing only images you want in the video

## 2. Create the video

Now we can create a video called `demo-video-no-meta.mp4` using all the images in the directory:

```
$ ffmpeg -r 1 -i MULTISHOT_9698_%06d.jpg -c:v libx264 -pix_fmt yuv420p demo-video-no-meta.mp4
```

Let's break that down:

* `-i MULTISHOT_9698_%06d.jpg`: the filenames to match on. `%06d` means capture 6 digits. `%03d` would mean capture 3 digits.
* `-r 1`: the output framerate per second. Here I want 1 frame every 1 second. If the `-r` option is omitted the default will input and output 25 frames per second.
* `-pix_fmt yuv420p`: _[When outputting H.264, adding -vf format=yuv420p or -pix_fmt yuv420p will ensure compatibility so crappy players can decode the video.](https://trac.ffmpeg.org/wiki/Slideshow)_
* `-c:v libx264` is an abbreviated version of codec:v. Encodes the video using the libx264 codec (H264).

The video is looking good. There are 55 images in my sequence and the video is 55 seconds long. However, it's not showing as a 360 video... yet.

<iframe width="560" height="315" src="https://www.youtube.com/embed/KCUG5A3vBZU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 3. Add the required metadata

[As I talked about last year](/blog/metadata-exif-xmp-360-video-files-gopro-gpmd), video files, and specifically 360 video files, hold metadata that is important for video players to render and display the video correctly. 

Looking at the metadata of the video I just created using exiftool:

```
$ exiftool -X demo-video-no-meta.mp4 > demo-video-no-meta-metadata.xml
```

Gives a .xml file with the contents:

```
<?xml version='1.0' encoding='UTF-8'?>
<rdf:RDF xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#'>

<rdf:Description rdf:about='demo-video-no-meta.mp4'
  xmlns:et='http://ns.exiftool.ca/1.0/' et:toolkit='Image::ExifTool 12.10'
  xmlns:ExifTool='http://ns.exiftool.ca/ExifTool/1.0/'
  xmlns:System='http://ns.exiftool.ca/File/System/1.0/'
  xmlns:File='http://ns.exiftool.ca/File/1.0/'
  xmlns:QuickTime='http://ns.exiftool.ca/QuickTime/QuickTime/1.0/'
  xmlns:Track1='http://ns.exiftool.ca/QuickTime/Track1/1.0/'
  xmlns:ItemList='http://ns.exiftool.ca/QuickTime/ItemList/1.0/'
  xmlns:Composite='http://ns.exiftool.ca/Composite/1.0/'>
 <ExifTool:ExifToolVersion>12.10</ExifTool:ExifToolVersion>
 <System:FileName>demo-video-no-meta.mp4</System:FileName>
 <System:Directory>.</System:Directory>
 <System:FileSize>119 MB</System:FileSize>
 <System:FileModifyDate>2021:07:31 20:50:06+01:00</System:FileModifyDate>
 <System:FileAccessDate>2021:07:31 20:49:05+01:00</System:FileAccessDate>
 <System:FileInodeChangeDate>2021:07:31 20:50:06+01:00</System:FileInodeChangeDate>
 <System:FilePermissions>rw-r--r--</System:FilePermissions>
 <File:FileType>MP4</File:FileType>
 <File:FileTypeExtension>mp4</File:FileTypeExtension>
 <File:MIMEType>video/mp4</File:MIMEType>
 <QuickTime:MajorBrand>MP4  Base Media v1 [IS0 14496-12:2003]</QuickTime:MajorBrand>
 <QuickTime:MinorVersion>0.2.0</QuickTime:MinorVersion>
 <QuickTime:CompatibleBrands>
  <rdf:Bag>
   <rdf:li>isom</rdf:li>
   <rdf:li>iso2</rdf:li>
   <rdf:li>avc1</rdf:li>
   <rdf:li>mp41</rdf:li>
  </rdf:Bag>
 </QuickTime:CompatibleBrands>
 <QuickTime:MediaDataSize>124504510</QuickTime:MediaDataSize>
 <QuickTime:MediaDataOffset>48</QuickTime:MediaDataOffset>
 <QuickTime:MovieHeaderVersion>0</QuickTime:MovieHeaderVersion>
 <QuickTime:CreateDate>0000:00:00 00:00:00</QuickTime:CreateDate>
 <QuickTime:ModifyDate>0000:00:00 00:00:00</QuickTime:ModifyDate>
 <QuickTime:TimeScale>1000</QuickTime:TimeScale>
 <QuickTime:Duration>0:00:55</QuickTime:Duration>
 <QuickTime:PreferredRate>1</QuickTime:PreferredRate>
 <QuickTime:PreferredVolume>100.00%</QuickTime:PreferredVolume>
 <QuickTime:MatrixStructure>1 0 0 0 1 0 0 0 1</QuickTime:MatrixStructure>
 <QuickTime:PreviewTime>0 s</QuickTime:PreviewTime>
 <QuickTime:PreviewDuration>0 s</QuickTime:PreviewDuration>
 <QuickTime:PosterTime>0 s</QuickTime:PosterTime>
 <QuickTime:SelectionTime>0 s</QuickTime:SelectionTime>
 <QuickTime:SelectionDuration>0 s</QuickTime:SelectionDuration>
 <QuickTime:CurrentTime>0 s</QuickTime:CurrentTime>
 <QuickTime:NextTrackID>2</QuickTime:NextTrackID>
 <QuickTime:HandlerType>Metadata</QuickTime:HandlerType>
 <QuickTime:HandlerVendorID>Apple</QuickTime:HandlerVendorID>
 <Track1:TrackHeaderVersion>0</Track1:TrackHeaderVersion>
 <Track1:TrackCreateDate>0000:00:00 00:00:00</Track1:TrackCreateDate>
 <Track1:TrackModifyDate>0000:00:00 00:00:00</Track1:TrackModifyDate>
 <Track1:TrackID>1</Track1:TrackID>
 <Track1:TrackDuration>0:00:55</Track1:TrackDuration>
 <Track1:TrackLayer>0</Track1:TrackLayer>
 <Track1:TrackVolume>0.00%</Track1:TrackVolume>
 <Track1:MatrixStructure>1 0 0 0 1 0 0 0 1</Track1:MatrixStructure>
 <Track1:ImageWidth>5760</Track1:ImageWidth>
 <Track1:ImageHeight>2880</Track1:ImageHeight>
 <Track1:MediaHeaderVersion>0</Track1:MediaHeaderVersion>
 <Track1:MediaCreateDate>0000:00:00 00:00:00</Track1:MediaCreateDate>
 <Track1:MediaModifyDate>0000:00:00 00:00:00</Track1:MediaModifyDate>
 <Track1:MediaTimeScale>16384</Track1:MediaTimeScale>
 <Track1:MediaDuration>0:00:55</Track1:MediaDuration>
 <Track1:MediaLanguageCode>und</Track1:MediaLanguageCode>
 <Track1:HandlerType>Video Track</Track1:HandlerType>
 <Track1:HandlerDescription>VideoHandler</Track1:HandlerDescription>
 <Track1:GraphicsMode>srcCopy</Track1:GraphicsMode>
 <Track1:OpColor>0 0 0</Track1:OpColor>
 <Track1:CompressorID>avc1</Track1:CompressorID>
 <Track1:SourceImageWidth>5760</Track1:SourceImageWidth>
 <Track1:SourceImageHeight>2880</Track1:SourceImageHeight>
 <Track1:XResolution>72</Track1:XResolution>
 <Track1:YResolution>72</Track1:YResolution>
 <Track1:BitDepth>24</Track1:BitDepth>
 <Track1:BufferSize>0</Track1:BufferSize>
 <Track1:MaxBitrate>18109746</Track1:MaxBitrate>
 <Track1:AverageBitrate>18109746</Track1:AverageBitrate>
 <Track1:VideoFrameRate>1</Track1:VideoFrameRate>
 <ItemList:Encoder>Lavf58.76.100</ItemList:Encoder>
 <Composite:ImageSize>5760x2880</Composite:ImageSize>
 <Composite:Megapixels>16.6</Composite:Megapixels>
 <Composite:AvgBitrate>18.1 Mbps</Composite:AvgBitrate>
 <Composite:Rotation>0</Composite:Rotation>
</rdf:Description>
</rdf:RDF>

```

There is already a lot here. We can see the video resolution, the duration, and lots of other default fields that are not really required for our use-case.

[Let's start by looking inside the first photo used in the video to see some of the metadata we'll need to add to the video](/blog/metadata-exif-xmp-360-photo-files).

```
$ exiftool -X MULTISHOT_9698_000000.jpg > MULTISHOT_9698_000000_metadata.xml
```
Gives a .xml file with the contents:

```
<?xml version='1.0' encoding='UTF-8'?>
<rdf:RDF xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#'>

<rdf:Description rdf:about='MULTISHOT_9698_000000.jpg'
  xmlns:et='http://ns.exiftool.ca/1.0/' et:toolkit='Image::ExifTool 12.10'
  xmlns:ExifTool='http://ns.exiftool.ca/ExifTool/1.0/'
  xmlns:System='http://ns.exiftool.ca/File/System/1.0/'
  xmlns:File='http://ns.exiftool.ca/File/1.0/'
  xmlns:JFIF='http://ns.exiftool.ca/JFIF/JFIF/1.0/'
  xmlns:IFD0='http://ns.exiftool.ca/EXIF/IFD0/1.0/'
  xmlns:ExifIFD='http://ns.exiftool.ca/EXIF/ExifIFD/1.0/'
  xmlns:GPS='http://ns.exiftool.ca/EXIF/GPS/1.0/'
  xmlns:XMP-x='http://ns.exiftool.ca/XMP/XMP-x/1.0/'
  xmlns:XMP-GPano='http://ns.exiftool.ca/XMP/XMP-GPano/1.0/'
  xmlns:Composite='http://ns.exiftool.ca/Composite/1.0/'>
 <ExifTool:ExifToolVersion>12.10</ExifTool:ExifToolVersion>
 <System:FileName>MULTISHOT_9698_000000.jpg</System:FileName>
 <System:Directory>.</System:Directory>
 <System:FileSize>13 MB</System:FileSize>
 <System:FileModifyDate>2020:05:16 12:40:02+01:00</System:FileModifyDate>
 <System:FileAccessDate>2021:07:30 21:06:12+01:00</System:FileAccessDate>
 <System:FileInodeChangeDate>2021:07:30 21:06:12+01:00</System:FileInodeChangeDate>
 <System:FilePermissions>rw-rw-r--</System:FilePermissions>
 <File:FileType>JPEG</File:FileType>
 <File:FileTypeExtension>jpg</File:FileTypeExtension>
 <File:MIMEType>image/jpeg</File:MIMEType>
 <File:ExifByteOrder>Little-endian (Intel, II)</File:ExifByteOrder>
 <File:ImageWidth>5760</File:ImageWidth>
 <File:ImageHeight>2880</File:ImageHeight>
 <File:EncodingProcess>Baseline DCT, Huffman coding</File:EncodingProcess>
 <File:BitsPerSample>8</File:BitsPerSample>
 <File:ColorComponents>3</File:ColorComponents>
 <File:YCbCrSubSampling>YCbCr4:4:4 (1 1)</File:YCbCrSubSampling>
 <JFIF:JFIFVersion>1.01</JFIF:JFIFVersion>
 <JFIF:ResolutionUnit>inches</JFIF:ResolutionUnit>
 <JFIF:XResolution>0</JFIF:XResolution>
 <JFIF:YResolution>0</JFIF:YResolution>
 <IFD0:ImageWidth>5760</IFD0:ImageWidth>
 <IFD0:ImageHeight>2880</IFD0:ImageHeight>
 <IFD0:Make>GoPro</IFD0:Make>
 <IFD0:Model>GoPro Fusion FS1.04.01.80.00</IFD0:Model>
 <IFD0:Software>GoPro Fusion Studio 1.3.0.400</IFD0:Software>
 <IFD0:ModifyDate>2019:11:29 20:41:18</IFD0:ModifyDate>
 <IFD0:Artist>https://www.trekview.org</IFD0:Artist>
 <IFD0:Copyright>https://www.trekview.org</IFD0:Copyright>
 <ExifIFD:DateTimeOriginal>2019:11:29 13:07:17</ExifIFD:DateTimeOriginal>
 <ExifIFD:UserComment>Please contact hq@trekview.org if you want to use this photograph commercially.</ExifIFD:UserComment>
 <GPS:GPSLatitudeRef>North</GPS:GPSLatitudeRef>
 <GPS:GPSLatitude>28 deg 17&#39; 55.14&quot;</GPS:GPSLatitude>
 <GPS:GPSLongitudeRef>West</GPS:GPSLongitudeRef>
 <GPS:GPSLongitude>16 deg 32&#39; 44.90&quot;</GPS:GPSLongitude>
 <GPS:GPSAltitudeRef>Above Sea Level</GPS:GPSAltitudeRef>
 <GPS:GPSAltitude>2323.621 m</GPS:GPSAltitude>
 <GPS:GPSTimeStamp>13:06:48</GPS:GPSTimeStamp>
 <GPS:GPSDateStamp>2019:11:29</GPS:GPSDateStamp>
 <XMP-x:XMPToolkit>XMP Core 4.4.0-Exiv2</XMP-x:XMPToolkit>
 <XMP-GPano:StitchingSoftware>GoPro Fusion Studio 1.3.0.400</XMP-GPano:StitchingSoftware>
 <XMP-GPano:SourcePhotosCount>2</XMP-GPano:SourcePhotosCount>
 <XMP-GPano:UsePanoramaViewer>True</XMP-GPano:UsePanoramaViewer>
 <XMP-GPano:ProjectionType>equirectangular</XMP-GPano:ProjectionType>
 <XMP-GPano:CroppedAreaImageHeightPixels>2880</XMP-GPano:CroppedAreaImageHeightPixels>
 <XMP-GPano:CroppedAreaImageWidthPixels>5760</XMP-GPano:CroppedAreaImageWidthPixels>
 <XMP-GPano:FullPanoHeightPixels>2880</XMP-GPano:FullPanoHeightPixels>
 <XMP-GPano:FullPanoWidthPixels>5760</XMP-GPano:FullPanoWidthPixels>
 <XMP-GPano:CroppedAreaLeftPixels>0</XMP-GPano:CroppedAreaLeftPixels>
 <XMP-GPano:CroppedAreaTopPixels>0</XMP-GPano:CroppedAreaTopPixels>
 <Composite:ImageSize>5760x2880</Composite:ImageSize>
 <Composite:Megapixels>16.6</Composite:Megapixels>
 <Composite:GPSAltitude>2323.6 m Above Sea Level</Composite:GPSAltitude>
 <Composite:GPSDateTime>2019:11:29 13:06:48Z</Composite:GPSDateTime>
 <Composite:GPSLatitude>28 deg 17&#39; 55.14&quot; N</Composite:GPSLatitude>
 <Composite:GPSLongitude>16 deg 32&#39; 44.90&quot; W</Composite:GPSLongitude>
 <Composite:GPSPosition>28 deg 17&#39; 55.14&quot; N, 16 deg 32&#39; 44.90&quot; W</Composite:GPSPosition>
</rdf:Description>
</rdf:RDF>
```

Here we can see a lot of data that will prove useful for copying over to the video, including...

* [GPS] `GPS:GPSDataStamp` / `GPS:GPSTimeStamp`: gives us start time (note `ModifyDate` shows stitching date, not capture date, so GPS Date/Time recorded from the satellite is much more accurate)
* [XMP] `XMP-GPano:SourcePhotosCount`: tells us the number of cameras originally used to create the image
* [XMP] `XMP-GPano:StitchingSoftware`: defines the software used to stitch images into a 360 image
* [XMP] `XMP-GPano:ProjectionType`: tells us it's a panoramic image if value equals `equirectangular` (more useful when automating this process, and this needs to be validated)

In fact, for our purposes, all the `XMP-GPano` namespace tags from the photo are useful to copy over to the video. However, `XMP-GPano` is the namespace for photos, we need to use `XMP-GSpherical` for video files.

If you didn't read last weeks post introducing XMP namespaces, [I recommend taking a look before continuing with this post](/blog/introduction-to-xmp-namespaces).

Let's first use the [Spatial Media Metadata Injector](https://github.com/google/spatial-media/tree/master/spatialmedia) to embed the essential `XMP-GSpherical` tags required for Google (inc. YouTube) to correctly detect that it is a 360 video. [Running this script (and why exiftool can't be used) was also described in last weeks post](/blog/introduction-to-xmp-namespaces), so I won't cover it here.

Checking the metadata after running the tool you should see 4 new tags:

```
$ exiftool -X demo-video-injected-meta.mp4 > demo-video-injected-meta.xml
```

```
<?xml version='1.0' encoding='UTF-8'?>
<rdf:RDF xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#'>

<rdf:Description 
 ...
 <XMP-GSpherical:Spherical>true</XMP-GSpherical:Spherical>
 <XMP-GSpherical:Stitched>true</XMP-GSpherical:Stitched>
 <XMP-GSpherical:StitchingSoftware>Spherical Metadata Tool</XMP-GSpherical:StitchingSoftware>
 <XMP-GSpherical:ProjectionType>equirectangular</XMP-GSpherical:ProjectionType>
 ...
</rdf:Description>
</rdf:RDF>
```

The above metadata will provide enough to render the 360 video correctly (with controls) in most online video players and generic desktop viewers ([I recommend VLC on your local machine](https://www.videolan.org/vlc/index.en_GB.html)).

Check it out on YouTube:

<iframe width="560" height="315" src="https://www.youtube.com/embed/EIEvoQu8JJI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Now we can add the other spatial and non-spatial XMP data to the video. For example, [XMP-tiff](https://exiftool.org/TagNames/XMP.html#tiff) fields:

```
$ exiftool XMP-tiff:Copyright:'https://www.trekview.org' XMP-tiff:Artist:'https://www.trekview.org' demo-video-injected-meta.mp4
```

## Update 2022-01-21

[How to Create a 360 Video from a Timelapse of 360 Images (using Adobe Premiere Pro)](/blog/turn-360-photos-into-360-video-adobe-premiere).

## Update 2022-03-11

[ffmpeg Cheat Sheet for virtual tours and 360 videos (includes how to use ffmpeg to copy telemetry streams to outputted video files)](/blog/ffmpeg-video-to-frame-cheat-sheet).

## Update 2022-05-13

[How to Create a Video File Ready to be Uploaded to the Google Street View API](/blog/create-google-street-view-video-publish-api).