---
date: 2020-05-08
title: "An Introduction to the GoPro Metadata Format (GPMF) standard"
description: "With the help of a 360 video shot using a GoPro Fusion, I take a look at GoPro's GPMF video telemetry standard."
categories: developers
tags: [GPS, XMP, EXIF, mp4, GoPro, GPMF, GPMD, Fusion, exiftool]
author_staff_member: dgreenwood
image: /assets/images/blog/2020-05-08/exif-tool-command-line-mp4-meta.jpg
featured_image: /assets/images/blog/2020-05-08/exif-tool-command-line-mp4-sm.png
layout: post
published: true
---

**With the help of a 360 video shot using a GoPro Fusion, I take a look at GoPro's GPMF video telemetry standard.**

[Last week I explained the metadata found in 360 photos](/blog/2020/metadata-exif-xmp-360-photo-files), and promised a post on video metadata. Well, here it is.

_If you haven't already read that post, it is well worth wrapping your head around some of the concepts discussed before you jump into this one._

The real benefit of capturing 360 sequences (like walks or bike rides) using video over time lapse is the higher number of frames created when compared to photo time lapses. 

More frames gives you (or software) the flexibility to cherry-pick the ones you want to use in your tour.

For example, you want to use frames that are (almost) exactly 1 meter apart. Using the GPS in each frame, software can easily extract photos that are 1 meter apart.

Compare that to shooting in time lapse mode, especially if moving quickly, where the capture interval will provide varying distances between photos (unless you're travelling at a constant speed), and photos might have larger distance between them than the 1 meter you're aiming for.

You then have 2 options; 1) admit defeat and then go back and re-shoot or, 2) accept the uneven distances between photos and remember perfection is the enemy of done.

For about a year now the [Google Street View app (Android version)](https://play.google.com/store/apps/details?id=com.google.android.street&hl=en_GB) has allowed users to [automatically connect their 360 camera filming video to their phone and publish it straight to Street View using the app](https://support.google.com/maps/answer/7546470?hl=en&ref_topic=6275604).

[Google also support video uploads programmatically via the Street View Publish API](https://developers.google.com/streetview/ready/specs-svready).

All signals point to mid-level 360-cameras now being at a point where they are able to handle high quality video content for outdoor 360 mapping photography, and I’m now really starting to think about recommending shooting in video mode (vs. timelapse) in the next iteration of our [Trek Pack](/trek-pack) (_coming soon!_).

Though before I make a decision, the geek in me wants to get down into the nuts and bolts, I mean bits and bytes, of 360 video files...

## An introduction to video metadata

[Like photos](/blog/2020/metadata-exif-xmp-360-photo-files), videos contain metadata.

Video files have metadata for the complete video (e.g. file name) and for different times in the video (e.g. GPS values at a specific time in the video).

Data is not written into each frame in videos. This is different to how metadata is written in photos, where cameras embed data inside every single photo file.

Unlike photos, much of this metadata for videos is written as a track (a video track, an audio track, etc.).

If you've ever wanted to extract audio or a GPS track from a video file (_update [2020-05-22: Turning a 360 Timelapse or Video into a GPX or KML track](/blog/2020/extracting-gps-track-from-360-timelapse-video)_, you are extracting the corresponding track.

All these tracks run in parallel so that the data matches up correctly; image with sound, with metadata (e.g. GPS), etc.

But let's stop talking at such a high level and jump into a video file to see exactly what this looks like. Using a real example of a GoPro Fusion 360 .mp4, I'm going to use this post to explain more about video telemetry, and specifically the GoPro video telemetry standard.

I'm going to be using the [open-source EXIF tool](https://exiftool.org/) to extract and normalise metadata.

_Note, if your file is encoded in some proprietary format it might not be [properly supported by EXIF tool](https://exiftool.org/#supported)._

There is a significant amount of data contained in the metadata of a video, for this post I've only included the most relevant data. Where I've deleted part of the output you'll see a `[...]`. 

For this post I'm going to use an `.mp4` video filmed using a GoPro Fusion with GPS enabled shot at 5.2K and the final file encoded using H.264 at 4K at 30 FPS using GoPro Fusion Studio (no Protune). The file size is 86.2MB and runs for 16 seconds.

<iframe width="560" height="315" src="https://www.youtube.com/embed/iyIkDRERzz8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

If you want to follow along, [you can download the video I am using here](https://drive.google.com/file/d/1tGmvaWVNRo4ynR9FiMpQVX0tYBJt5ZsR/view?usp=sharing).

### GoPro Metadata Format (GPMF)

Like EXIF or XMP standards for static image (and also video, as you'll see in this post) metadata, telemetry metadata is usually written in a standardised way so that it can be properly understood by software replaying the video.

In the world of 360 cameras telemetry is generally reported in one of two standards GPMF (GoPro) or [CAMM (Google)](https://developers.google.com/streetview/publish/camm-spec).

GoPro writes telemetry metadata to videos in their own open-source standard, the [GoPro Metadata Format](https://gopro.com/en/us/news/gopro-video-metadata-open-source-explained). Despite being open-source, no other manufacturers have adopted GoPro's standard (understandably, for competitive reasons).

The benefit of GoPro being a widely used camera brand (and using a telemetry standard), [EXIF tool has the logic to understand this format natively](https://exiftool.org/TagNames/GoPro.html).

**Extracting metadata at frame level**

CLI input: 

```
$ exiftool -ee -G3 -X VIDEO_7152.mp4 > VIDEO_7152_track_metadata.txt
```

This command includes the following arguments:

* `-ee`: Extract embedded data from mp0 files (and others).
* `-G3`: Identify the originating document for extracted information. Embedded documents containing sub-documents are indicated with dashes in the family 3 group name. (eg. Doc2-3 is the 3rd sub-document of the 2nd embedded document.)
* -X: Use RDF/XML output format

[Full reference here](https://exiftool.org/exiftool_pod.html).

I'll go through the entire output in parts, to make it easier to understand. Many lines are cropped `[...]` because the full output is over 1,800 lines).

**File level data**

```
 <File:FileType>MP4</File:FileType>
 <File:FileTypeExtension>mp4</File:FileTypeExtension>
 <File:MIMEType>video/quicktime</File:MIMEType>
 <QuickTime:MajorBrand>Apple QuickTime (.MOV/QT)</QuickTime:MajorBrand>
 <QuickTime:MinorVersion>2005.3.0</QuickTime:MinorVersion>
 <QuickTime:CompatibleBrands>
  <rdf:Bag>
   <rdf:li>qt  </rdf:li>
  </rdf:Bag>
 </QuickTime:CompatibleBrands>
 <QuickTime:MediaDataSize>90384939</QuickTime:MediaDataSize>
 <QuickTime:MediaDataOffset>36</QuickTime:MediaDataOffset>
 <QuickTime:MovieHeaderVersion>0</QuickTime:MovieHeaderVersion>
 <QuickTime:CreateDate>2020:04:15 09:14:04</QuickTime:CreateDate>
 <QuickTime:ModifyDate>2020:04:15 09:14:04</QuickTime:ModifyDate>
 <QuickTime:TimeScale>2997</QuickTime:TimeScale>
 <QuickTime:Duration>15.98 s</QuickTime:Duration>

```

This information is comparable to the EXIF/XMP data in a photo. It contains information about the file, like `<File:FileType>` or `<QuickTime:CreateDate>`.

**Video specific data**

```
[...]
 <Track1:SourceImageWidth>3840</Track1:SourceImageWidth>
 <Track1:SourceImageHeight>1920</Track1:SourceImageHeight>
 <Track1:XResolution>72</Track1:XResolution>
 <Track1:YResolution>72</Track1:YResolution>
 <Track1:BitDepth>24</Track1:BitDepth>
 <Track1:VideoFrameRate>29.97</Track1:VideoFrameRate>
 <XMP-GSpherical:Spherical>true</XMP-GSpherical:Spherical>
 <XMP-GSpherical:Stitched>true</XMP-GSpherical:Stitched>
 <XMP-GSpherical:StitchingSoftware>Fusion Studio / GStreamer</XMP-GSpherical:StitchingSoftware>
 <XMP-GSpherical:ProjectionType>equirectangular</XMP-GSpherical:ProjectionType>
 <XMP-GSpherical:StereoMode>mono</XMP-GSpherical:StereoMode>
 <XMP-GSpherical:SourceCount>2</XMP-GSpherical:SourceCount>
 <XMP-GSpherical:InitialViewHeadingDegrees>0</XMP-GSpherical:InitialViewHeadingDegrees>
 <XMP-GSpherical:InitialViewPitchDegrees>0</XMP-GSpherical:InitialViewPitchDegrees>
 <XMP-GSpherical:InitialViewRollDegrees>0</XMP-GSpherical:InitialViewRollDegrees>
[...]
 <Track2:AudioFormat>mp4a</Track2:AudioFormat>
 <Track2:AudioChannels>2</Track2:AudioChannels>
 <Track2:AudioBitsPerSample>16</Track2:AudioBitsPerSample>
 <Track2:AudioSampleRate>48000</Track2:AudioSampleRate>
 <Track2:PurchaseFileFormat>mp4a</Track2:PurchaseFileFormat>
[...]
 <Track3:MediaDuration>16.02 s</Track3:MediaDuration>
 <Track3:HandlerClass>Media Handler</Track3:HandlerClass>
 <Track3:HandlerType>NRT Metadata</Track3:HandlerType>
 <Track3:HandlerDescription>GoPro MET</Track3:HandlerDescription>

```

`XMP-GSpherical` is video level data defined in Google's Spherical Video RFC](https://github.com/google/spatial-media/blob/master/docs/spherical-video-rfc.md).

Remember before I said video metadata usually contains tracks? Here's a real example of this. You can determine what each track and how each track should be handled using the `HandlerType` defined:

* `<Track1:XXXX>` = `<Track1:HandlerType>Video Track</Track1:HandlerType>` (video track data)
* `<Track2:XXXX>` = `<Track2:HandlerType>Audio Track</Track2:HandlerType>` (audio track data)
* `<Track3:XXXX>` = `<Track3:HandlerType>NRT Metadata</Track3:HandlerType>` (track where GPMF level data is embedded)

I am not sure of any examples where a 4th track is present, and not really sure what it would contain if there was one... perhaps someone can give me a steer on this?

The difference between Track1 and Track3 is, Track1 contains video level data from the camera sensor (e.g. `Track1:SourceImageWidth`, `Track1:XResolution`, `Track1:VideoFrameRate` etc.), whereas Track3 is the output of other sensors in the camera, like GPS information (in this case, printed in GPMF standard).

**Track3 Camera Metadata**

In this video, we know GPMF is the metadata standard used because it is defined in:

```
 <Track3:HandlerClass>Media Handler</Track3:HandlerClass>
 <Track3:HandlerType>NRT Metadata</Track3:HandlerType>
 <Track3:HandlerDescription>GoPro MET</Track3:HandlerDescription>
[...]
 <Track3:MetaFormat>gpmd</Track3:MetaFormat>
```

GoPro have documented the [GoPro Metadata Format here](https://github.com/gopro/gpmf-parser).

Let's take a look at what this actually looks like in our video, by looking at the first 1 second of telemetry:

```
 <Track3:SampleTime>0 s</Track3:SampleTime>
 <Track3:SampleDuration>1.00 s</Track3:SampleDuration>
 <Track3:DeviceName>Fusion</Track3:DeviceName>
 <Track3:TimeStamp>1066.344245</Track3:TimeStamp>
 <Track3:CameraTemperature>27.048828125 C</Track3:CameraTemperature>
 <Track3:Accelerometer>(Binary data 10226 bytes, use -b option to extract)</Track3:Accelerometer>
 <Track3:TimeStamp>1066.365138</Track3:TimeStamp>
 <Track3:CameraTemperature>27.048828125 C</Track3:CameraTemperature>
 <Track3:Gyroscope>(Binary data 179297 bytes, use -b option to extract)</Track3:Gyroscope>
 <Track3:Magnetometer>11.4000005722046 -4.59999990463257 7.30000019073486 11 -4.59999990463257 8.90000057220459 11 -4 8.10000038146973 11 -4 7.30000019073486 9.90000057220459 -2.90000009536743 7 9.90000057220459 -2.90000009536743 7 9.90000057220459 -2.90000009536743 7 9.90000057220459 -4.80000019073486 7.70000028610229 8.30000019073486 -4.70000028610229 8.5 8.30000019073486 -4.70000028610229 8.5 10.6000003814697 -4.70000028610229 7.30000019073486 9.5 -3.20000004768372 7 8.30000019073486 -2.40000009536743 8.90000057220459 8.30000019073486 -2.40000009536743 8.90000057220459 9.90000057220459 -3.90000009536743 8.60000038146973 11 -4.70000028610229 7.09999990463257 11 -4.70000028610229 7.09999990463257 13.3000001907349 -5 9.30000019073486 13.3000001907349 -5 9.30000019073486 12.6000003814697 -5.40000009536743 6.59999990463257 11.4000005722046 -5.70000028610229 9.40000057220459 13.3000001907349 -6.09999990463257 7.40000009536743 12.5 -7.20000028610229 5.80000019073486 13.6999998092651 -5.70000028610229 7 13.3000001907349 -4.5 8.19999980926514</Track3:Magnetometer>
 <Track3:GPSMeasureMode>3-Dimensional Measurement</Track3:GPSMeasureMode>
 <Track3:GPSDateTime>2020:04:13 15:37:22.444</Track3:GPSDateTime>
 <Track3:GPSHPositioningError>2.03</Track3:GPSHPositioningError>
 <Track3:GPSLatitude>51 deg 14&#39; 54.51&quot; N</Track3:GPSLatitude>
 <Track3:GPSLongitude>0 deg 46&#39; 56.80&quot; W</Track3:GPSLongitude>
 <Track3:GPSAltitude>157.641 m</Track3:GPSAltitude>
 <Track3:GPSSpeed>1.348</Track3:GPSSpeed>
 <Track3:GPSSpeed3D>1.28</Track3:GPSSpeed3D>
 <Track3:GPSLatitude>51 deg 14&#39; 54.52&quot; N</Track3:GPSLatitude>
 <Track3:GPSLongitude>0 deg 46&#39; 56.81&quot; W</Track3:GPSLongitude>
 <Track3:GPSAltitude>157.616 m</Track3:GPSAltitude>
 <Track3:GPSSpeed>1.57</Track3:GPSSpeed>
 <Track3:GPSSpeed3D>1.38</Track3:GPSSpeed3D>
 <Track3:GPSLatitude>51 deg 14&#39; 54.52&quot; N</Track3:GPSLatitude>
 <Track3:GPSLongitude>0 deg 46&#39; 56.81&quot; W</Track3:GPSLongitude>
 <Track3:GPSAltitude>157.627 m</Track3:GPSAltitude>
 <Track3:GPSSpeed>1.549</Track3:GPSSpeed>
 <Track3:GPSSpeed3D>1.6</Track3:GPSSpeed3D>
 <Track3:GPSLatitude>51 deg 14&#39; 54.52&quot; N</Track3:GPSLatitude>
 <Track3:GPSLongitude>0 deg 46&#39; 56.82&quot; W</Track3:GPSLongitude>
 <Track3:GPSAltitude>157.635 m</Track3:GPSAltitude>
 <Track3:GPSSpeed>1.527</Track3:GPSSpeed>
 <Track3:GPSSpeed3D>1.57</Track3:GPSSpeed3D>
[...]
 <Track3:ImageSensorGain>(Binary data 526 bytes, use -b option to extract)</Track3:ImageSensorGain>
 <Track3:TimeStamp>1066.333437</Track3:TimeStamp>
 <Track3:ExposureTimes>1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517 1/517</Track3:ExposureTimes>

```

In this first 1s sample, we get single measurements from the sensors in the camera like the `Track3:Accelerometer`, `Track3:Gyroscope` and `Track3:Magnetometer`.

The metadata prints 18 GPS position entries like so;

```
 <Track3:GPSLatitude>51 deg 14&#39; 54.51&quot; N</Track3:GPSLatitude>
 <Track3:GPSLongitude>0 deg 46&#39; 56.80&quot; W</Track3:GPSLongitude>
 <Track3:GPSAltitude>157.641 m</Track3:GPSAltitude>
 <Track3:GPSSpeed>1.348</Track3:GPSSpeed>
 <Track3:GPSSpeed3D>1.28</Track3:GPSSpeed3D>
```

We can also see each individual frame's `ExposureTimes` that makes up this second of video. I count 30 entries (e.g. `1/517`, which matches the video settings (30 FPS).

You might be thinking; but the camera was shooting at a rate of 30 FPS why are there not 30 GPS points.

Three things might be going on here;

1. GPS signal was lost for some of the frames so could not be reported.
2. the GPS chip cannot support such a high resolution. For example, almost all mobile devices, including all Apple devices, receive GPS at the rate of 1Hz (1 GPS measurement a second).
3. not all camera manufacturers write metadata for every single frame to reduce size and processing costs when this data is not really necessary. Think; "does the average consumer really need GPS data reported for 30 frames every second?". Traveling at 100 km/h you are traveling 27.777... m/s. That would get one frame every meter at 30FPS... but how many of you are you shooting imagery on foot at this speed? _Let me know, it sounds like fun!_

The rest of Track3 follows this format. Every 1s, 1 measurement for `Track3:Accelerometer`, `Track3:Gyroscope`, `Track3:Magnetometer` etc. is printed and every 1s, 18 GPS positions are printed.

**Update 2020-05-09**

[After reading the GPMF spec more closely it seems the GoPro GPS chip supports a resolution of 18Hz](https://github.com/gopro/gpmf-parser#gpmf-timing-and-clocks) (18.169 measurements every second) which explains why we see 18 GPS position entries every second.

## Help us Build Great Software

Unfortunately we don't have the budget to buy every single 360 camera to test the photos and videos they produce with our software.

Whilst having standards like EXIF, XMP and GPMD is very helpful, many manufacturers do things slightly differently (especially given the flexibility of fields in XMP data).

In order to make sure our [free, open-source software works for everyone](https://github.com/trek-view/), we need to test it using 360 image and video files produced by a range of cameras and manufacturers.

And that's why we need your help.

If you have a 360 camera and want to support our work, [please share samples from your camera with us by raising a new issue here with a link to the photo or video file](https://github.com/trek-view/360-camera-metadata/issues).

## Update 2021-08-06

If you'd like to read more about XMP namespaces, [read my latest introductory post here](/blog/2021/introduction-to-xmp-namspaces).

## Update 2021-08-20

[Here's a deeper look into the Camera Motion Metadata Spec (CAMM), an alternative to GPMD, here](/blog/2021/metadata-exif-xmp-360-video-files-camm-camera-motion-metadata-spec).