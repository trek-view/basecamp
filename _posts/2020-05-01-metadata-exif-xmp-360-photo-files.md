---
date: 2020-05-01
title: "A deeper look into a 360 photo and the metadata it holds"
description: "Every photo you take is filled with metadata. Here's why it's important for outdoor 360 street-level photography."
categories: developers
tags: [GPS, XMP, EXIF, exiftool, Ricoh, Theta Z1, GoPro, Fusion, jpg]
author_staff_member: dgreenwood
image: /assets/images/blog/2020-05-01/apolloone-example-meta.jpg
featured_image: /assets/images/blog/2020-05-01/apolloone-example-sm.png
layout: post
published: true
---

**Every photo you take is filled with metadata. Here's why it's important for outdoor 360 street-level photography.**

Well that sounds boring, but it is actually very cool. Every photo you take, on any camera, is likely filled with metadata. This data often contains location, camera model, lens type, and general information about how the image was taken.  It is this data that makes your photo library easier to browse, events are automatically grouped, and exposures auto corrected. 

I've talked previously about having to [manually stitch GPS tracks into photos taken underwater](/blog/underwater-google-street-view) (because GPS does not work below the surface) and about [manually calculating (estimating) the direction the camera was facing in a time lapse capture](/blog/what-direction-are-you-facing) when it is not recorded by the camera.

But where and how is this information stored?

## Metadata, EXIF, or XMP?

Metadata is any data that helps describe the content or characteristics of a file.

For image and video files, embedded metadata provides more information about the file, for example the camera model used to take the photo.

There are many different formats and standards of metadata in the world of photography. Two of the most commonly used formats by camera manufacturers are: 

1. [EXIF (Exchangeable Image File)](https://www.exif.org/): the "gold standard" of image metadata. All images captured with a digital camera typically contain some amount of EXIF data. 
2. [Extensible Metadata Platform](https://www.adobe.com/products/xmp.html): a more recent format, developed by Adobe. Unlike EXIF, it is not as widely used  -- manufacturers can decide if they want to include XMP data.

## Why add XMP if EXIF exists?

EXIF is an older format and is more limited in what it can store. The field names are already defined and manufacturers must conform to them.

The real advantage of EXIF data is that can be universally recognised and understood by 99.9% of software tools.

As digital photography progressed, and cameras added new features and functions (e.g. 360 images), XMP came along to fill in the gaps not covered by the EXIF data fields.

XMP allows manufacturers to be much more descriptive about the metadata they store for an image over EXIF alone.

It's important to note, a photo file can contain more than one type of metadata like EXIF and XMP.

In the world of 360 photography, most cameras and 360-generation tools include [XMP Photo Spherical metadata](https://developers.google.com/streetview/spherical-metadata) in saved photos. Similarly, almost all software that can load a 360-photo understands XMP Photo Sphere metadata.

By using a single standard, XMP (it is an ISO standard), it's much easier for developers to build software for viewing 360 images ([check out this pages from the [Facebook 360 team](https://facebook360.fb.com/editing-360-photos-injecting-metadata/) that illustrates why standards in 360 files are important).

## 360 photo metadata examples

Let's get our hands dirty and take a look at the metadata of a stitched photo from a [GoPro Fusion](/assets/images/blog/2020-05-01/MULTISHOT_8302_000052.jpg) and [Ricoh Theta Z1](/assets/images/blog/2020-05-01/R0013800.JPG) (thanks, Brian Redmond!).

I'm going to be using the open-source [EXIF tool](https://exiftool.org/) to extract metadata.

There is a significant amount of data contained in the metadata of a photos, for this post I've only included the data relevant to highlight the EXIF and XMP data. Where I've deleted part of the output you'll see a `[...]`. The full output is linked below each snippet should you want to take a deeper look.

**GoPro Fusion**

First, let's take a look at the `.jpg` image from a GoPro Fusion, the camera used on the [Trek Pack v1](/trek-pack):

CLI input: 

```
$ exiftool -X MULTISHOT_8302_000052.jpg > MULTISHOT_8302_000052_metadata.txt
```

This command includes the following arguments:

* `-X`: Use RDF/XML output format

[Full reference here](https://exiftool.org/exiftool_pod.html).

CLI output (cropped): 

```
<?xml version='1.0' encoding='UTF-8'?>
[...]
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

**Pro tip**: EXIF Tool users, you can filter the metadata type and fields to be included in the response. For example:

Return only `EXIF` data in a photo file:

```
$ exiftool -X -exif:all MULTISHOT_8302_000052.jpg > MULTISHOT_8302_000052_exif_metadata.txt
```

Return only `XMP` data with a `ProjectionType` tag in a photo file:

```
$ exiftool -X -xmp:ProjectionType MULTISHOT_8302_000052.jpg > MULTISHOT_8302_000052_xmp_projectiontype_metadata.txt
```

<img class="img-fluid" src="/assets/images/blog/2020-05-01/apolloone-example-sm.png" alt="ApolloOne XMP example" title="ApolloOne XMP example" />

If you're not comfortable with the command line, there is lots of software that will show this information graphically. For example, [ApolloOne](https://www.apollooneapp.com/) is popular app amongst Mac users.

Back to the photo...

You (and other software tools) can identify this photograph is 360 because it is defined by XMP tag; `Projection Type` = `equirectangular`.

The image resolution is `Full Pano Width Pixels` = `5760` x `Full Pano Height Pixels` = `2880`, or 16.6 megapixels. _Note, the GoPro Fusion can shoot `.raw` files at 18 megapixels, but this example was stitched as a `.jpg` where 16.6 megapixels is the maximum resolution possible_.


We also know it was taken above sea level because of the EXIF tags; `GPS Altitude` = `467.03` and `GPS Altitude Ref` = `Above Sea Level`

Other EXIF GPS data tags include:

* GPSLatitude
* GPSLongitude
* GPSAltitude
* GPSDateStamp
* GPSLatitudeRef
* GPSLongitudeRef
* GPSAltitudeRef
* GPSTimeStamp
* GPSTrack
* GPSSpeed
* GPSImgDirection
* GPSPitch        
* GPSTrackRef
* GPSSpeedRef
* GPSImgDirectionRef
* GPSRoll
* CameraElevationAngle

...but remember, manufactures don't need to write all of them (or any of them).

**Ricoh Theta Z1**

Now for the metadata output of a `.jpg` image from a Ricoh Theta Z1:

CLI input: 

```
$ exiftool -X exiftool R0013800.JPG > R0013800_metadata.txt
```

CLI output:

```
<?xml version='1.0' encoding='UTF-8'?>
[...]
 <File:FileType>JPEG</File:FileType>
 <File:FileTypeExtension>jpg</File:FileTypeExtension>
 <File:MIMEType>image/jpeg</File:MIMEType>
 <File:ExifByteOrder>Big-endian (Motorola, MM)</File:ExifByteOrder>
 <File:ImageWidth>6720</File:ImageWidth>
 <File:ImageHeight>3360</File:ImageHeight>
 <File:EncodingProcess>Baseline DCT, Huffman coding</File:EncodingProcess>
 <File:BitsPerSample>8</File:BitsPerSample>
 <File:ColorComponents>3</File:ColorComponents>
 <File:YCbCrSubSampling>YCbCr4:2:0 (2 2)</File:YCbCrSubSampling>
 <IFD0:ImageDescription>                                                               </IFD0:ImageDescription>
 <IFD0:Make>RICOH</IFD0:Make>
 <IFD0:Model>RICOH THETA Z1</IFD0:Model>
 <IFD0:Orientation>Horizontal (normal)</IFD0:Orientation>
 <IFD0:XResolution>300</IFD0:XResolution>
 <IFD0:YResolution>300</IFD0:YResolution>
 <IFD0:ResolutionUnit>inches</IFD0:ResolutionUnit>
 <IFD0:Software>RICOH THETA Z1 Ver 1.40.1</IFD0:Software>
 <IFD0:ModifyDate>2020:03:28 13:03:52</IFD0:ModifyDate>
 <IFD0:YCbCrPositioning>Centered</IFD0:YCbCrPositioning>
 <IFD0:Copyright></IFD0:Copyright>
 <ExifIFD:ExposureTime>1/640</ExifIFD:ExposureTime>
 <ExifIFD:FNumber>5.6</ExifIFD:FNumber>
 <ExifIFD:ExposureProgram>Program AE</ExifIFD:ExposureProgram>
 <ExifIFD:ISO>80</ExifIFD:ISO>
 <ExifIFD:SensitivityType>Standard Output Sensitivity</ExifIFD:SensitivityType>
 <ExifIFD:ExifVersion>0230</ExifIFD:ExifVersion>
 <ExifIFD:DateTimeOriginal>2020:03:28 13:03:52</ExifIFD:DateTimeOriginal>
 <ExifIFD:CreateDate>2020:03:28 13:03:52</ExifIFD:CreateDate>
 <ExifIFD:ComponentsConfiguration>Y, Cb, Cr, -</ExifIFD:ComponentsConfiguration>
 <ExifIFD:ApertureValue>5.6</ExifIFD:ApertureValue>
 <ExifIFD:BrightnessValue>9.6</ExifIFD:BrightnessValue>
 <ExifIFD:ExposureCompensation>0</ExifIFD:ExposureCompensation>
 <ExifIFD:MaxApertureValue>2.1</ExifIFD:MaxApertureValue>
 <ExifIFD:MeteringMode>Multi-segment</ExifIFD:MeteringMode>
 <ExifIFD:LightSource>Unknown</ExifIFD:LightSource>
 <ExifIFD:Flash>No flash function</ExifIFD:Flash>
 <ExifIFD:FocalLength>2.6 mm</ExifIFD:FocalLength>
 <ExifIFD:FlashpixVersion>0100</ExifIFD:FlashpixVersion>
 <ExifIFD:ColorSpace>sRGB</ExifIFD:ColorSpace>
 <ExifIFD:ExifImageWidth>6720</ExifIFD:ExifImageWidth>
 <ExifIFD:ExifImageHeight>3360</ExifIFD:ExifImageHeight>
 <ExifIFD:ExposureMode>Auto</ExifIFD:ExposureMode>
 <ExifIFD:WhiteBalance>Auto</ExifIFD:WhiteBalance>
 <ExifIFD:SceneCaptureType>Standard</ExifIFD:SceneCaptureType>
 <ExifIFD:Sharpness>Normal</ExifIFD:Sharpness>
 <Ricoh:MakerNoteType>Rdc</Ricoh:MakerNoteType>
 <Ricoh:FirmwareVersion>1.401</Ricoh:FirmwareVersion>
 <Ricoh:SerialNumber>(00000000)14102544</Ricoh:SerialNumber>
 <Ricoh:RecordingFormat>JPEG</Ricoh:RecordingFormat>
 <Ricoh:WhiteBalance>Auto</Ricoh:WhiteBalance>
 <Ricoh:ColorTempKelvin>5000</Ricoh:ColorTempKelvin>
 <Ricoh:Accelerometer>0 0</Ricoh:Accelerometer>
 <Ricoh:Compass>68.8</Ricoh:Compass>
 <Ricoh:TimeZone>-04:00</Ricoh:TimeZone>
 <InteropIFD:InteropIndex>R98 - DCF basic file (sRGB)</InteropIFD:InteropIndex>
 <InteropIFD:InteropVersion>0100</InteropIFD:InteropVersion>
 <GPS:GPSVersionID>2.3.0.0</GPS:GPSVersionID>
 <GPS:GPSLatitudeRef>North</GPS:GPSLatitudeRef>
 <GPS:GPSLatitude>45 deg 28&#39; 58.32&quot;</GPS:GPSLatitude>
 <GPS:GPSLongitudeRef>West</GPS:GPSLongitudeRef>
 <GPS:GPSLongitude>75 deg 45&#39; 30.24&quot;</GPS:GPSLongitude>
 <GPS:GPSAltitudeRef>Above Sea Level</GPS:GPSAltitudeRef>
 <GPS:GPSAltitude>75.78 m</GPS:GPSAltitude>
 <GPS:GPSTimeStamp>17:02:06</GPS:GPSTimeStamp>
 <GPS:GPSImgDirectionRef>Magnetic North</GPS:GPSImgDirectionRef>
 <GPS:GPSImgDirection>68.8</GPS:GPSImgDirection>
 <GPS:GPSMapDatum>WGS-84</GPS:GPSMapDatum>
 <GPS:GPSDateStamp>2020:03:28</GPS:GPSDateStamp>
 <IFD1:Compression>JPEG (old-style)</IFD1:Compression>
 <IFD1:XResolution>300</IFD1:XResolution>
 <IFD1:YResolution>300</IFD1:YResolution>
 <IFD1:ResolutionUnit>inches</IFD1:ResolutionUnit>
 <IFD1:ThumbnailOffset>2526</IFD1:ThumbnailOffset>
 <IFD1:ThumbnailLength>6840</IFD1:ThumbnailLength>
 <IFD1:ThumbnailImage>(Binary data 6840 bytes, use -b option to extract)</IFD1:ThumbnailImage>
 <XMP-x:XMPToolkit>RICOH THETA Z1 Ver1.40.1</XMP-x:XMPToolkit>
 <XMP-GPano:ProjectionType>equirectangular</XMP-GPano:ProjectionType>
 <XMP-GPano:UsePanoramaViewer>True</XMP-GPano:UsePanoramaViewer>
 <XMP-GPano:CroppedAreaImageWidthPixels>6720</XMP-GPano:CroppedAreaImageWidthPixels>
 <XMP-GPano:CroppedAreaImageHeightPixels>3360</XMP-GPano:CroppedAreaImageHeightPixels>
 <XMP-GPano:FullPanoWidthPixels>6720</XMP-GPano:FullPanoWidthPixels>
 <XMP-GPano:FullPanoHeightPixels>3360</XMP-GPano:FullPanoHeightPixels>
 <XMP-GPano:CroppedAreaLeftPixels>0</XMP-GPano:CroppedAreaLeftPixels>
 <XMP-GPano:CroppedAreaTopPixels>0</XMP-GPano:CroppedAreaTopPixels>
 <XMP-GPano:PoseHeadingDegrees>68.8</XMP-GPano:PoseHeadingDegrees>
 <XMP-GPano:PosePitchDegrees>0.0</XMP-GPano:PosePitchDegrees>
 <XMP-GPano:PoseRollDegrees>0.0</XMP-GPano:PoseRollDegrees>
 <Composite:Aperture>5.6</Composite:Aperture>
 <Composite:ImageSize>6720x3360</Composite:ImageSize>
 <Composite:Megapixels>22.6</Composite:Megapixels>
 <Composite:ShutterSpeed>1/640</Composite:ShutterSpeed>
 <Composite:GPSAltitude>75.7 m Above Sea Level</Composite:GPSAltitude>
 <Composite:GPSDateTime>2020:03:28 17:02:06Z</Composite:GPSDateTime>
 <Composite:GPSLatitude>45 deg 28&#39; 58.32&quot; N</Composite:GPSLatitude>
 <Composite:GPSLongitude>75 deg 45&#39; 30.24&quot; W</Composite:GPSLongitude>
 <Composite:RicohPitch>0</Composite:RicohPitch>
 <Composite:RicohRoll>0</Composite:RicohRoll>
 <Composite:FocalLength35efl>2.6 mm</Composite:FocalLength35efl>
 <Composite:GPSPosition>45 deg 28&#39; 58.32&quot; N, 75 deg 45&#39; 30.24&quot; W</Composite:GPSPosition>
 <Composite:LightValue>14.6</Composite:LightValue>
</rdf:Description>
</rdf:RDF>

```

One of the first things I want to highlight is the variation in amount of metadata written into the image files; 58 tags for the Fusion compared to 110 tags for the Z1.

The manufacturer of the camera (or developer of processing software) defines the tags written into the metadata, and is often dependant on the camera features or intended uses (e.g. if uploading to Google Street View it will  contain GPS information, whilst photos taken indoors will not have this information due to lack of GPS signal).

You'll see the the Ricoh Theta Z1 writes much more positing information into the photo. Unlike the Fusion, the Theta Z1 includes heading (azimuth), pitch and roll information at the time of capture in the XMP data; 

```
 <XMP-GPano:PoseHeadingDegrees>68.8</XMP-GPano:PoseHeadingDegrees>
 <XMP-GPano:PosePitchDegrees>0.0</XMP-GPano:PosePitchDegrees>
 <XMP-GPano:PoseRollDegrees>0.0</XMP-GPano:PoseRollDegrees>
```

This information is reported by the gyroscope on the Z1.

Whilst the Fusion has a GPS receiver, along with an accelerometer, gyroscope and compass, GoPro decided not to write this information reported by these measurement devices into photo files (though the Fusion does for video files).

Having this information reported at time of capture by the Z1 is much more accurate than [manual calculations required when it's omitted](/blog/what-direction-are-you-facing).

Other XMP `GPano` 360 photo tags include:

* UsePanoramaViewer
* CaptureSoftware
* StitchingSoftware
* CaptureSoftware
* ProjectionType
* PoseHeadingDegrees
* PosePitchDegrees
* PoseRollDegrees
* InitialViewHeadingDegrees
* InitialViewPitchDegrees
* InitialViewRollDegrees
* InitialHorizontalFOVDegrees
* InitialVerticalFOVDegrees
* InitialHorizontalFOVDegrees
* InitialVerticalFOVDegrees
* InitialHorizontalFOVDegrees
* FirstPhotoDate
* LastPhotoDate
* SourcePhotosCount
* ExposureLockUsed
* CroppedAreaImageWidthPixels
* CroppedAreaImageHeightPixels
* FullPanoWidthPixels
* FullPanoHeightPixels
* CroppedAreaLeftPixels
* CroppedAreaTopPixels
* InitialCameraDolly

And looking at these visually:

_Spherical projections_

<img class="img-fluid" src="/assets/images/blog/2020-05-01/XMP_pano_pixels.png" alt="XMP Spherical projections" title="XMP Spherical projections" />

_Cylindrical projections_

<img class="img-fluid" src="/assets/images/blog/2020-05-01/cylindrical_xmp_pixels.png" alt="XMP Cylindrical projections" title="XMP Cylindrical projections" />

_Diagrams: [Google](https://developers.google.com/streetview/spherical-metadata)_

...again, I stress, manufactures don't need to write all of them (or any of them... although this will cause compatibility issues with software).

### A note on XMP namespaces

This post is only intended as a brief introduction to the topic.

[Their are many XMP namespaces with differing XMP tags](https://exiftool.org/TagNames/XMP.html). For example, [`XMP-GPano`](https://exiftool.org/TagNames/XMP.html#GPano) for photos and [`XMP-GSpherical`](https://exiftool.org/TagNames/XMP.html#GSpherical) for video. 

I have omitted discussing XMP namespaces in this post as they are mostly important when writing metadata to files.

## Reading metadata in video files

Like photos, videos contain metadata too.

In fact, the information they contain is very similar to that found in individual photos -- videos are, after all, a series of photos (frames) often with accompanying audio.

In next weeks post, I'll take a deeper look at the metadata inside 360 video recordings. Stay tuned!

## Help us Build Great Software

Unfortunately we don't have the budget to buy every single 360 camera to test the photos and videos they produce with our software.

Whilst having standards like EXIF and XMP is very helpful, many manufacturers do things slightly differently (especially given the flexibility of fields in XMP data).

In order to make sure our [free, open-source software works for everyone](https://github.com/trek-view/), we need to test it using 360 image and video files produced by a range of cameras and manufacturers.

And that's why we need your help.

If you have a 360 camera and want to support our work, [please share more information about your camera with us using this form](https://docs.google.com/forms/d/e/1FAIpQLScgOk1W5jpyrQuDF5FuKqUpKK0EIpSlokckZd3OB-r_ZOjZmQ/viewform). Thank you!

## Update 2020-05-01

[A deeper look into a 360 video and the metadata it holds](/blog/metadata-exif-xmp-360-video-files-gopro-gpmd).

## Update 2021-08-06

If you'd like to read more about XMP namespaces, [read my latest introductory post here](/blog/introduction-to-xmp-namspaces).