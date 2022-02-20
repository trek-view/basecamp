---
date: 2021-08-06
title: "What are XMP Namespaces?"
description: "Adobe's eXtensible Metadata Platform (XMP) is a labeling technology that allows you to embed data about a file, known as metadata, into the file itself."
categories: developers
tags: [ffmpeg, exiftool, Adobe, XMP, EXIF, Map the Paths]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-08-06/gpano-reference-docs-meta.jpg
featured_image: /assets/images/blog/2021-08-06/gpano-reference-docs-sm.jpg
layout: post
published: true
---

**[Adobe's eXtensible Metadata Platform (XMP)](https://www.adobe.com/products/xmp.html) is a labeling technology that allows you to embed data about a file, known as metadata, into the file itself.**

In the context of 360 videos and photos, XMP can be used to define location information, equipment used to shoot, times of capture, and much more... as you'll see in this post. 

However, it's important to realise XMP is used far beyond the world of image and video files. PDF's for example, where XMP can contain titles and descriptions, searchable keywords, and up-to-date author and copyright information.

As an open source technology, it is freely available to developers. [You can browse the full specification here](https://www.adobe.com/devnet/xmp.html).

[An XMP namespaces defines a set of properties (tags)](https://github.com/adobe/xmp-docs/blob/master/Namespaces.md).

Think of a namespace like a standard for a specific use. 

For example, the [`XMP-Device`](https://exiftool.org/TagNames/XMP.html#Device) namespace contains Google depth-map Device tags ([see this page for the namespace specification](https://developer.android.com/training/camera2/Dynamic-depth-v1.0.pdf). These are tags like `CameraImagingModel` and `CameraDepthMap`, as well as many other very useful for augmented reality applications.

<img class="img-fluid" src="/assets/images/blog/2021-08-06/gpano-reference-docs-sm.jpg
" alt="GPano parameter reference" title="GPano parameter reference" />

_Source: [https://developers.google.com/streetview/spherical-metadata](https://developers.google.com/streetview/spherical-metadata)_

Or for 360 photos, the [`XMP-GPano`](https://exiftool.org/TagNames/XMP.html#GPano) is a namespace used for panorama photo tags written by Google Photosphere ([see this page for the namespace specification](https://developers.google.com/panorama/metadata/). In this namespace you will find tags like `PoseHeadingDegrees` and `FullPanoHeightPixels` used for rendering 360 photos properly.

Here's an example of `XMP-GPano`, `GPS`, and `IFD0` namespace tags from my post last year, [A deeper look into a 360 photo and the metadata it holds](/blog/2020/metadata-exif-xmp-360-photo-files).

CLI:

```
$ exiftool -X MULTISHOT_8302_000052.jpg > MULTISHOT_8302_000052_metadata.txt
```

Output (cropped):

```
<?xml version='1.0' encoding='UTF-8'?>
[...]
 <IFD0:ImageWidth>5760</IFD0:ImageWidth>
 <IFD0:ImageHeight>2880</IFD0:ImageHeight>
 <IFD0:Make>GoPro</IFD0:Make>
 <IFD0:Model>GoPro Fusion FS1.04.01.80.00</IFD0:Model>
 <IFD0:Software>GoPro Fusion Studio 1.3.0.400</IFD0:Software>
 <IFD0:ModifyDate>2020:02:05 20:20:33</IFD0:ModifyDate>
 <IFD0:Artist>https://www.trekview.org</IFD0:Artist>
 <IFD0:Copyright>https://www.trekview.org</IFD0:Copyright>
 <ExifIFD:DateTimeOriginal>2020:02:05 10:38:26</ExifIFD:DateTimeOriginal>
 <ExifIFD:UserComment>Please contact hq@trekview.org if you want to use this photograph commercially.</ExifIFD:UserComment>
 <GPS:GPSLatitudeRef>North</GPS:GPSLatitudeRef>
 <GPS:GPSLatitude>28 deg 21&#39; 0.60&quot;</GPS:GPSLatitude>
 <GPS:GPSLongitudeRef>West</GPS:GPSLongitudeRef>
 <GPS:GPSLongitude>16 deg 54&#39; 13.88&quot;</GPS:GPSLongitude>
 <GPS:GPSAltitudeRef>Above Sea Level</GPS:GPSAltitudeRef>
 <GPS:GPSAltitude>467.03 m</GPS:GPSAltitude>
 <GPS:GPSTimeStamp>10:32:38</GPS:GPSTimeStamp>
 <GPS:GPSDateStamp>2020:02:05</GPS:GPSDateStamp>
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
 <Composite:GPSAltitude>467 m Above Sea Level</Composite:GPSAltitude>
 <Composite:GPSDateTime>2020:02:05 10:32:38Z</Composite:GPSDateTime>
 <Composite:GPSLatitude>28 deg 21&#39; 0.60&quot; N</Composite:GPSLatitude>
 <Composite:GPSLongitude>16 deg 54&#39; 13.88&quot; W</Composite:GPSLongitude>
 <Composite:GPSPosition>28 deg 21&#39; 0.60&quot; N, 16 deg 54&#39; 13.88&quot; W</Composite:GPSPosition>
</rdf:Description>
</rdf:RDF>
```

In the world of 360 videos, [`XMP-GSpherical`](https://exiftool.org/TagNames/XMP.html#GSpherical) is the most widely adopted standard. Strictly speaking this is not actually XMP data. 

`XMP-GSpherical` are written into the video track of MOV/MP4 files, and not at the top level like other XMP tags ([see this page for the namespace specification](https://github.com/google/spatial-media/blob/master/docs/spherical-video-rfc.md). They are RDF/XML tags, for example:

```
<rdf:SphericalVideo
  xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  xmlns:GSpherical="http://ns.google.com/videos/1.0/spherical/">
  <GSpherical:Spherical>true</GSpherical:Spherical>
  <GSpherical:Stitched>true</GSpherical:Stitched>
  <GSpherical:StitchingSoftware>
    OpenCV for Windows v2.4.9
  </GSpherical:StitchingSoftware>
  <GSpherical:ProjectionType>equirectangular</GSpherical:ProjectionType>
  <GSpherical:SourceCount>6</GSpherical:SourceCount>
  <GSpherical:InitialViewHeadingDegrees>90</GSpherical:InitialViewHeadingDegrees>
  <GSpherical:InitialViewPitchDegrees>0</GSpherical:InitialViewPitchDegrees>
  <GSpherical:InitialViewRollDegrees>0</GSpherical:InitialViewRollDegrees>
  <GSpherical:Timestamp>1400454971</GSpherical:Timestamp>
  <GSpherical:CroppedAreaImageWidthPixels>
    1920
  </GSpherical:CroppedAreaImageWidthPixels>
  <GSpherical:CroppedAreaImageHeightPixels>
    1080
  </GSpherical:CroppedAreaImageHeightPixels>
  <GSpherical:FullPanoWidthPixels>1900</GSpherical:FullPanoWidthPixels>
  <GSpherical:FullPanoHeightPixels>960</GSpherical:FullPanoHeightPixels>
  <GSpherical:CroppedAreaLeftPixels>15</GSpherical:CroppedAreaLeftPixels>
  <GSpherical:CroppedAreaTopPixels>60</GSpherical:CroppedAreaTopPixels>
</rdf:SphericalVideo>
```

## XMP vs. EXIF

You might have also noticed [`XMP-exif`](https://exiftool.org/TagNames/XMP.html#exif) in the XMP specification.

It's important to point out, the `XMP-exif` namespace differs from [the EXIF data standard developed by CIPA](https://www.cipa.jp/std/std-sec_e.html).

[See the exiftool list of tags for an easy way to understand the differences](https://exiftool.org/TagNames/).

EXIF is another standard (like XMP) designed for image and sound files, whereas XMP covers a much broader spectrum of file types.

XMP is also broader in the tags that can be used because of the namespaces that have been developed. The EXIF standard on the other hand is a closed specification with a defined number of tags. The upside being of having a single namespace is that the standard is widely understood by other products (some more niche XMP namespaces are not).

[You can see the full EXIF standard and available tags here](https://www.cipa.jp/std/documents/e/DC-X008-Translation-2019-E.pdf).

## Writing XMP tags to files

Using [EXIFtool](https://exiftool.org/) it's possible to write XMP data into photo, image and video files, in addition to EXIF data.

For example, lets say I wanted to write to the `XMP-GPano` namespace with the tag `ProjectionType` for a photo:

```
exiftool -XMP-GPano:ProjectionType=equirectangular my_photo.jpg
```

It's likely I would want to add more than one `XMP-GPano` tag. Doing this is easy, like so:

```
exiftool -XMP-GPano:FullPanoHeightPixels=2880 -XMP-GPano:FullPanoHeightWidth=5760 -XMP-GPano:StitchingSoftware='exiftool' my_photo.jpg
```

**A note on `XMP-GSpherical` tags in videos**

As I mentioned earlier, `XMP-GSpherical` is not really XMP. As such, [exiftool is unable to write these tags into video files](https://exiftool.org/forum/index.php?topic=8286.0). If you're working with 360 video files, you will need to use another way. 

Luckily Google has created a Python script for [injecting required `XMP-GSpherical` metadata tags](https://github.com/google/spatial-media/blob/master/docs/spherical-video-rfc.md#allowed-global-metadata-elements) into videos, the [Spatial Media Metadata Injector](https://github.com/google/spatial-media/tree/master/spatialmedia).

<img class="img-fluid" src="/assets/images/blog/2021-08-06/spatial-metadata-injector-tool.png
" alt="Spatial Media Metadata Injector" title="Spatial Media Metadata Injector" />

You can run the Spatial Media Metadata Injector's simple interface once you've cloned the repo:

```
$ git clone https://github.com/google/spatial-media.git
$ cd spatialmedia
$ python gui.py
```

Selecting "My video is spherical (360)" will add the following tags:

```
Spherical = true
Stitched = true
StitchingSoftware = Spherical Metadata Tool
ProjectionType = equirectangular
```

There is the option to inject via the command line too:

```
python spatialmedia -i demo-video-no-meta.mp4 demo-video-with-meta.mp4
```

## Coming soon to Map the Paths Uploader...

<img class="img-fluid" src="/assets/images/blog/2021-08-06/mapthepaths-uploader-integrations-sm.jpg" alt="Map the Paths Uploader integrations" title="Map the Paths Uploader integrations" />

I'm working on turning a sequence of images into videos automatically (with full metadata) using the [Map the Paths Uploader](https://www.mapthepaths.com/uploader) ([to better support Google Street View uploads](/blog/2021/preparing-360-video-upload-street-view-publish-api)).

Stay tuned for the release announcement by signing up for Trek View updates below.