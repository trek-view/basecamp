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

I've talked previously about having to [manually stitch GPS tracks into photos taken underwater](/blog/2020/underwater-google-street-view) (because GPS does not work below the surface) and about [manually calculating (estimating) the direction the camera was facing in a time lapse capture](/blog/2020/what-direction-are-you-facing) when it is not recorded by the camera.

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
$ exiftool -G -a  MULTISHOT_8302_000052.jpg > MULTISHOT_8302_000052_metadata.txt
```

This command includes the following arguments:

* -a: Allow duplicate tags to be extracted
* -G: Print group name for each tag

[Full reference here](https://exiftool.org/exiftool_pod.html).

CLI output: 

```
[...]
[EXIF]          Image Width                     : 5760
[EXIF]          Image Height                    : 2880
[EXIF]          Make                            : GoPro
[EXIF]          Camera Model Name               : GoPro Fusion FS1.04.01.80.00
[EXIF]          Software                        : GoPro Fusion Studio 1.3.0.400
[EXIF]          Modify Date                     : 2020:02:05 20:20:33
[EXIF]          Artist                          : https://www.trekview.org
[EXIF]          Copyright                       : https://www.trekview.org
[EXIF]          Date/Time Original              : 2020:02:05 10:38:26
[EXIF]          User Comment                    : Please contact hq@trekview.org if you want to use this photograph commercially.
[EXIF]          GPS Latitude Ref                : North
[EXIF]          GPS Latitude                    : 28 deg 21' 0.60"
[EXIF]          GPS Longitude Ref               : West
[EXIF]          GPS Longitude                   : 16 deg 54' 13.88"
[EXIF]          GPS Altitude Ref                : Above Sea Level
[EXIF]          GPS Altitude                    : 467.03 m
[EXIF]          GPS Time Stamp                  : 10:32:38
[EXIF]          GPS Date Stamp                  : 2020:02:05
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
[...]
```

[Entire output for reference](https://gitlab.com/snippets/1971624).

**Pro tip**: EXIF Tool users, you can filter the metadata type and fields to be included in the response. For example:

Return only `EXIF` data in a photo file:

```
$ exiftool -G -a -exif:all MULTISHOT_8302_000052.jpg > MULTISHOT_8302_000052_exif_metadata.txt
```

Return only `XMP` data with a `ProjectionType` tag in a photo file:

```
$ exiftool -G -a -xmp:ProjectionType MULTISHOT_8302_000052.jpg > MULTISHOT_8302_000052_xmp_projectiontype_metadata.txt
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
$ exiftool -G -a exiftool R0013800.JPG > R0013800_metadata.txt
```

CLI output:

```
[...]
[EXIF]          Image Description               : 
[EXIF]          Make                            : RICOH
[EXIF]          Camera Model Name               : RICOH THETA Z1
[EXIF]          Orientation                     : Horizontal (normal)
[EXIF]          X Resolution                    : 300
[EXIF]          Y Resolution                    : 300
[EXIF]          Resolution Unit                 : inches
[EXIF]          Software                        : RICOH THETA Z1 Ver 1.40.1
[EXIF]          Modify Date                     : 2020:03:28 13:03:52
[EXIF]          Y Cb Cr Positioning             : Centered
[EXIF]          Copyright                       : 
[EXIF]          Exposure Time                   : 1/640
[EXIF]          F Number                        : 5.6
[EXIF]          Exposure Program                : Program AE
[EXIF]          ISO                             : 80
[EXIF]          Sensitivity Type                : Standard Output Sensitivity
[EXIF]          Exif Version                    : 0230
[EXIF]          Date/Time Original              : 2020:03:28 13:03:52
[EXIF]          Create Date                     : 2020:03:28 13:03:52
[EXIF]          Components Configuration        : Y, Cb, Cr, -
[EXIF]          Aperture Value                  : 5.6
[EXIF]          Brightness Value                : 9.6
[EXIF]          Exposure Compensation           : 0
[EXIF]          Max Aperture Value              : 2.1
[EXIF]          Metering Mode                   : Multi-segment
[EXIF]          Light Source                    : Unknown
[EXIF]          Flash                           : No flash function
[EXIF]          Focal Length                    : 2.6 mm
[EXIF]          Flashpix Version                : 0100
[EXIF]          Color Space                     : sRGB
[EXIF]          Exif Image Width                : 6720
[EXIF]          Exif Image Height               : 3360
[EXIF]          Interoperability Index          : R98 - DCF basic file (sRGB)
[EXIF]          Interoperability Version        : 0100
[EXIF]          Exposure Mode                   : Auto
[EXIF]          White Balance                   : Auto
[EXIF]          Scene Capture Type              : Standard
[EXIF]          Sharpness                       : Normal
[EXIF]          GPS Version ID                  : 2.3.0.0
[EXIF]          GPS Latitude Ref                : North
[EXIF]          GPS Latitude                    : 45 deg 28' 58.32"
[EXIF]          GPS Longitude Ref               : West
[EXIF]          GPS Longitude                   : 75 deg 45' 30.24"
[EXIF]          GPS Altitude Ref                : Above Sea Level
[EXIF]          GPS Altitude                    : 75.78 m
[EXIF]          GPS Time Stamp                  : 17:02:06
[EXIF]          GPS Img Direction Ref           : Magnetic North
[EXIF]          GPS Img Direction               : 68.8
[EXIF]          GPS Map Datum                   : WGS-84
[EXIF]          GPS Date Stamp                  : 2020:03:28
[EXIF]          Compression                     : JPEG (old-style)
[EXIF]          X Resolution                    : 300
[EXIF]          Y Resolution                    : 300
[EXIF]          Resolution Unit                 : inches
[EXIF]          Thumbnail Offset                : 2526
[EXIF]          Thumbnail Length                : 6840
[EXIF]          Thumbnail Image                 : (Binary data 6840 bytes, use -b option to extract)
[...]
[XMP]           XMP Toolkit                     : RICOH THETA Z1 Ver1.40.1
[XMP]           Projection Type                 : equirectangular
[XMP]           Use Panorama Viewer             : True
[XMP]           Cropped Area Image Width Pixels : 6720
[XMP]           Cropped Area Image Height Pixels: 3360
[XMP]           Full Pano Width Pixels          : 6720
[XMP]           Full Pano Height Pixels         : 3360
[XMP]           Cropped Area Left Pixels        : 0
[XMP]           Cropped Area Top Pixels         : 0
[XMP]           Pose Heading Degrees            : 68.8
[XMP]           Pose Pitch Degrees              : 0.0
[XMP]           Pose Roll Degrees               : 0.0
[...]
```

[Entire output for reference](https://gitlab.com/snippets/1971626).

One of the first things I want to highlight is the variation in amount of metadata written into the image files; 58 tags for the Fusion compared to 110 tags for the Z1.

The manufacturer of the camera (or developer of processing software) defines the tags written into the metadata, and is often dependant on the camera features or intended uses (e.g. if uploading to Google Street View it will  contain GPS information, whilst photos taken indoors will not have this information due to lack of GPS signal).

You'll see the the Ricoh Theta Z1 writes much more positing information into the photo. Unlike the Fusion, the Theta Z1 includes heading (azimuth), pitch and roll information at the time of capture in the XMP data; 

```
Pose Heading Degrees            : 68.8
Pose Pitch Degrees              : 0.0
Pose Roll Degrees               : 0.0
```

This information is reported by the gyroscope on the Z1.

Whilst the Fusion has a GPS receiver, along with an accelerometer, gyroscope and compass, GoPro decided not to write this information reported by these measurement devices into photo files (though the Fusion does for video files).

Having this information reported at time of capture by the Z1 is much more accurate than [manual calculations required when it's omitted](/blog/2020/what-direction-are-you-facing).

Other XMP 360 photo tags include:

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

[A deeper look into a 360 video and the metadata it holds](/blog/2020/metadata-exif-xmp-360-video-files-gopro-gpmd).

## Update 2021-08-06

If you'd like to read more about XMP namespaces, [read my latest introductory post here](/blog/2021/introduction-to-xmp-namspaces).