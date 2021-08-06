---
date: 2021-08-20
title: "An Introduction to the Camera Motion Metadata (CAMM) standard"
description: "With the help of a 360 video shot using an Insta360 Pro2, I take a look at Google's CAMM video telemetry standard."
categories: developers
tags: [GPS, XMP, EXIF, CAMM, mp4, Insta360 Pro2, Insta360, exiftool, Camera Motion Metadata, Map the Paths]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-08-20/camm-acceleration-velocity-meta.jpg
featured_image: /assets/images/blog/2021-08-20/camm-acceleration-velocity-sm.jpg
layout: post
published: false
---

**With the help of a 360 video shot using an Insta360 Pro2, I take a look at Google's CAMM video telemetry standard.**

[Last year I did an introductory post on the GoPro Metadata Format (GPMF / GPMD) for video telemetry](/blog/2020/metadata-exif-xmp-360-video-files-gopro-gpmd).

[Although an open-standard](https://github.com/gopro/gpmf-parser), given it is maintained by GoPro, most camera manufacturers have decided to adopt a telemetry standard maintained by Google, [Camera Motion Metadata (CAMM)](https://developers.google.com/streetview/publish/camm-spec).

CAMM has been heavily adopted by 360 camera manufacturers as it is natively supported by Street View.

Using a real example of a Insta360 Pro2 360 .mp4, I'm going to use this post to explain more about the CAMM standard.

I'm going to be using the [open-source EXIF tool](https://exiftool.org/) to extract and normalise metadata.

_Note, if your file is encoded in some proprietary format it might not be [properly supported by EXIF tool](https://exiftool.org/#supported)._

There is a significant amount of data contained in the metadata of a video, for this post I've only included the most relevant data. Where I've deleted part of the output you'll see a `[...]`. 

For this example, I'll use a sample video shot earlier this year by Brian Redmond on the Insta360 Pro2. It was shot at at FPS in 8K. The file size is 4.02GB and runs for 2 minute 13 seconds.

<iframe width="560" height="315" src="https://www.youtube.com/embed/y3oHaGPzzK4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

If you want to follow along, [you can download the video I am using here](https://drive.google.com/file/d/1Jt9XIYM37iX2NQIXvgroA8ydfIvSziWc/view?usp=sharing).

### Camera Motion Metadata Spec Format (CAMM)

Like EXIF or XMP standards for static image (and video) metadata, telemetry metadata is usually written in a standardised way so that it can be properly understood by software replaying the video.

In the world of 360 cameras telemetry is generally reported in one of two standards GPMF (GoPro) or CAMM (Google). 

The Insta360 Pro2 writes telemetry metadata to videos in the [Camera Motion Metadata Spec Format](https://developers.google.com/streetview/publish/camm-spec) ([Insta360 unsurprisingly chose not to use the GoPro Metadata format, even if it is open source]((/blog/2020/metadata-exif-xmp-360-video-files-gopro-gpmd))).

Fortunately for us, [EXIF tool has the logic to understand this format in a good level of detail](https://exiftool.org/models.html).

**Extracting metadata at frame level**

CLI input: 

```
$ exiftool -ee -G3 -api LargeFileSupport=1 -X VID_20200420.mp4 > VID_20200420_track_metadata.txt
```

This command includes the following arguments:

* `-ee`: Extract embedded data from mp0 files (and others).
* `-G3`: Identify the originating document for extracted information. Embedded documents containing sub-documents are indicated with dashes in the family 3 group name. (eg. Doc2-3 is the 3rd sub-document of the 2nd embedded document.)
* `-X`: Use RDF/XML output format
* `-api LargeFileSupport=1`: for large files, large file support needs to be enabled

[Full reference here](https://exiftool.org/exiftool_pod.html).

I'll go through the entire output in parts, to make it easier to understand. Many lines are cropped `[...]` because the full output is over 150,000 lines).

**File level data**

```
[...]
 <File:FileType>MP4</File:FileType>
 <File:FileTypeExtension>mp4</File:FileTypeExtension>
 <File:MIMEType>video/mp4</File:MIMEType>
 <QuickTime:MajorBrand>MP4  Base Media v1 [IS0 14496-12:2003]</QuickTime:MajorBrand>
 <QuickTime:MinorVersion>0.2.0</QuickTime:MinorVersion>
[...]
```

This information is comparable to the EXIF/XMP data in a photo. It contains information about the file, like `<File:MIMEType>` or `<QuickTime:CreateDate>`.

**Video specific data**

```
[...]
 <Track1:SourceImageWidth>7680</Track1:SourceImageWidth>
 <Track1:SourceImageHeight>3840</Track1:SourceImageHeight>
 <Track1:XResolution>72</Track1:XResolution>
 <Track1:YResolution>72</Track1:YResolution>
 <Track1:BitDepth>24</Track1:BitDepth>
 <Track1:VideoFrameRate>5</Track1:VideoFrameRate>
 <XMP-GSpherical:Spherical>true</XMP-GSpherical:Spherical>
 <XMP-GSpherical:Stitched>true</XMP-GSpherical:Stitched>
 <XMP-GSpherical:ProjectionType>equirectangular</XMP-GSpherical:ProjectionType>
 <XMP-GSpherical:StereoMode>mono</XMP-GSpherical:StereoMode>
 <XMP-GSpherical:StitchingSoftware>Insta360</XMP-GSpherical:StitchingSoftware>
 <XMP-GSpherical:SourceCount>2</XMP-GSpherical:SourceCount>
[...]
 <Track2:TrackCreateDate>2020:04:02 12:43:20</Track2:TrackCreateDate>
 <Track2:TrackModifyDate>2020:04:02 12:43:20</Track2:TrackModifyDate>
 <Track2:TrackID>2</Track2:TrackID>
 <Track2:TrackDuration>0:02:13</Track2:TrackDuration>
[...]
 <Track3:HandlerType>Camera Metadata</Track3:HandlerType>
 <Track3:HandlerDescription>CameraMetadataMotionHandler</Track3:HandlerDescription>
 <Track3:OtherFormat>camm</Track3:OtherFormat>
 <Track3:SampleTime>0 s</Track3:SampleTime>
 <Track3:SampleDuration>0 s</Track3:SampleDuration>
 <Track3:AngularVelocity>0.0462660863995552 0.139929175376892 -0.204053655266762</Track3:AngularVelocity>
 <Track3:SampleTime>0 s</Track3:SampleTime>
 <Track3:SampleDuration>0.00 s</Track3:SampleDuration>
 <Track3:Acceleration>1.1484375 -0.0741699188947678 15.0469236373901</Track3:Acceleration>
[...]
```

I discussed [`XMP-GSpherical`](https://exiftool.org/TagNames/XMP.html#GSpherical) XMP tags in last weeks post](/blog/2021/turn-360-photos-into-360-video), [as defined in Google's Spherical Video RFC](https://github.com/google/spatial-media/blob/master/docs/spherical-video-rfc.md).

You would have also seen `<TrackN:XXXX>` values in last weeks post. Generally a video is split into 3 standard tracks (though only Track1, the video track, is required). You can determine how each track should be handled using the `HandlerType` defined:

* `<Track1:XXXX>` = `<Track1:HandlerType>Video Track</Track1:HandlerType>` (video track data)
* `<Track2:XXXX>` = `<Track2:HandlerType>Audio Track</Track2:HandlerType>` (audio track data)
* `<Track3:XXXX>` = `<Track3:HandlerType>Camera Metadata</Track3:HandlerType> ` (track where CAMM level data is embedded)

I am not sure of any examples where a 4th track is present, and not really sure what it would contain if there was one... perhaps someone can give me a steer on this?

The difference between Track1 and Track3 is, Track1 contains video level data from the camera sensor (e.g. `Track1:SourceImageWidth`, `Track1:XResolution`, `Track1:VideoFrameRate` etc.), whereas Track3 is the output of other sensors in the camera, [like the IMU](/blog/2020/camera-sensors-imu-accelerometer-gyroscope-magnetometer) (in this case, printed in CAMM standard).

**Track3 Camera Metadata**

In this video, we know CAMM is the metadata standard used because it is defined in:

```
 <Track3:HandlerType>Camera Metadata</Track3:HandlerType>
 <Track3:HandlerDescription>CameraMetadataMotionHandler</Track3:HandlerDescription>
 <Track3:OtherFormat>camm</Track3:OtherFormat>
```

Google have documented the [Camera Motion Metadata Spec here](https://developers.google.com/streetview/publish/camm-spec).

Let's take a look at what this actually looks like in our video, by looking at the first 0.3 seconds of telemetry:

```
 <Track3:SampleTime>0 s</Track3:SampleTime>
 <Track3:SampleDuration>0 s</Track3:SampleDuration>
 <Track3:AngularVelocity>0.0462660863995552 0.139929175376892 -0.204053655266762</Track3:AngularVelocity>
 <Track3:SampleTime>0 s</Track3:SampleTime>
 <Track3:SampleDuration>0.00 s</Track3:SampleDuration>
 <Track3:Acceleration>1.1484375 -0.0741699188947678 15.0469236373901</Track3:Acceleration>
 <Track3:SampleTime>0.00 s</Track3:SampleTime>
 <Track3:SampleDuration>0 s</Track3:SampleDuration>
 <Track3:AngularVelocity>0.0452018603682518 0.139929175376892 -0.22640235722065</Track3:AngularVelocity>
 <Track3:SampleTime>0.00 s</Track3:SampleTime>
 <Track3:SampleDuration>0.00 s</Track3:SampleDuration>
 <Track3:Acceleration>1.17714846134186 -0.203369140625 14.9918947219849</Track3:Acceleration>
 <Track3:SampleTime>0.01 s</Track3:SampleTime>
 <Track3:SampleDuration>0 s</Track3:SampleDuration>
 <Track3:AngularVelocity>0.0430734120309353 0.135672271251678 -0.242365717887878</Track3:AngularVelocity>
 <Track3:SampleTime>0.01 s</Track3:SampleTime>
 <Track3:SampleDuration>0.00 s</Track3:SampleDuration>
 <Track3:Acceleration>0.729736328125 -0.232080072164536 14.8674802780151</Track3:Acceleration>
 <Track3:SampleTime>0.01 s</Track3:SampleTime>
 <Track3:SampleDuration>0 s</Track3:SampleDuration>
 <Track3:AngularVelocity>0.0420091897249222 0.130351155996323 -0.257264852523804</Track3:AngularVelocity>
 <Track3:SampleTime>0.01 s</Track3:SampleTime>
 <Track3:SampleDuration>0.00 s</Track3:SampleDuration>
 <Track3:Acceleration>0.533544898033142 -0.105273440480232 14.9105472564697</Track3:Acceleration>
 <Track3:SampleTime>0.01 s</Track3:SampleTime>
 <Track3:SampleDuration>0 s</Track3:SampleDuration>
 <Track3:AngularVelocity>0.0441376380622387 0.123965807259083 -0.274292439222336</Track3:AngularVelocity>
 <Track3:SampleTime>0.01 s</Track3:SampleTime>
 <Track3:SampleDuration>0.00 s</Track3:SampleDuration>
 <Track3:Acceleration>0.763232409954071 -0.296679675579071 14.6641111373901</Track3:Acceleration>
 [...]
 <Track3:SampleTime>0.03 s</Track3:SampleTime>
 <Track3:SampleDuration>0.00 s</Track3:SampleDuration>
 <Track3:GPSDateTime>2020:04:02 09:43:22.2Z</Track3:GPSDateTime>
 <Track3:GPSMeasureMode>3-Dimensional Measurement</Track3:GPSMeasureMode>
 <Track3:GPSLatitude>50 deg 27&#39; 21.97&quot; N</Track3:GPSLatitude>
 <Track3:GPSLongitude>30 deg 28&#39; 47.39&quot; E</Track3:GPSLongitude>
 <Track3:GPSAltitude>146.8 m</Track3:GPSAltitude>
 <Track3:GPSHorizontalAccuracy>1.02999997138977</Track3:GPSHorizontalAccuracy>
 <Track3:GPSVerticalAccuracy>1.02999997138977</Track3:GPSVerticalAccuracy>
 <Track3:GPSVelocityEast>0.699336230754852</Track3:GPSVelocityEast>
 <Track3:GPSVelocityNorth>1.19965398311615</Track3:GPSVelocityNorth>
 <Track3:GPSVelocityUp>0</Track3:GPSVelocityUp>
 <Track3:GPSSpeedAccuracy>0</Track3:GPSSpeedAccuracy>
 ```

Breaking this down, we can see 2 measurements for `AngularVelocity` and `Acceleration` reported every 0.01 seconds.

```
 <Track3:SampleTime>0 s</Track3:SampleTime>
 <Track3:SampleDuration>0 s</Track3:SampleDuration>
 <Track3:AngularVelocity>0.0462660863995552 0.139929175376892 -0.204053655266762</Track3:AngularVelocity>
 <Track3:SampleTime>0 s</Track3:SampleTime>
 <Track3:SampleDuration>0.00 s</Track3:SampleDuration>
 <Track3:Acceleration>1.1484375 -0.0741699188947678 15.0469236373901</Track3:Acceleration>
```
<img class="img-fluid" src="/assets/images/blog/2021-08-20/camm-acceleration-velocity-meta.jpg" alt="Camera Motion Metadata Spec IMU" title="Camera Motion Metadata Spec IMU" />

As defined in the CAMM spec:

* `AngularVelocity`: Gyroscope signal in radians/seconds around XYZ axes of the camera. Rotation is positive in the counterclockwise direction.
* `Acceleration`: Accelerometer reading in meters/second^2 along XYZ axes of the camera.

Then at 0.03 seconds, we see a GPS position being printed.

```
 <Track3:SampleTime>0.03 s</Track3:SampleTime>
 <Track3:SampleDuration>0.00 s</Track3:SampleDuration>
 <Track3:GPSDateTime>2020:04:02 09:43:22.2Z</Track3:GPSDateTime>
 <Track3:GPSMeasureMode>3-Dimensional Measurement</Track3:GPSMeasureMode>
 <Track3:GPSLatitude>50 deg 27&#39; 21.97&quot; N</Track3:GPSLatitude>
[...]
```

<img class="img-fluid" src="/assets/images/blog/2021-08-20/camm-gps-sm.jpg" alt="Camera Motion Metadata Spec GPS" title="Camera Motion Metadata Spec GPS" />

At a minimum, CAMM requires latitude, longitude and altitude to be printed.

However, much more verbose GPS information can be included, as is found in the CAMM track from the Pro2 (e.g. `GPSHorizontalAccuracy`).

The rest of Track3 follows this format. Every 0.1s, 2 measurements for `AngularVelocity` and `Acceleration` are printed (20 per second), and every 1 second GPS information is printed.

[As I discovered earlier this year](/blog/2020/gps-101), not all sensors on the device can sample at such a high rate. For example, almost all mobile devices, including all Apple devices, receive GPS at the rate of 1Hz (1 GPS measurement a second).

## Help us Build Great Software

Unfortunately we don't have the budget to buy every single 360 camera to test the photos and videos they produce with our software.

Whilst having standards like EXIF, XMP CAMM and GPMD is very helpful, many manufacturers do things slightly differently (especially given the flexibility of fields in XMP data).

In order to make sure our [free, open-source software works for everyone](https://github.com/trek-view/), we need to test it using 360 image and video files produced by a range of cameras and manufacturers.

And that's why we need your help.

If you have a 360 camera and want to support our work, [please share samples from your camera with us by raising a new issue here with a link to the photo or video file](https://github.com/trek-view/360-camera-metadata/issues).