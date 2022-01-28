---
date: 2021-01-28
title: "Building a library of GoPro 360 camera test cases"
description: "A detailed list of all available GoPro MAX and Fusion modes."
categories: guides
tags: [GoPro, MAX, Fusion, HERO 10, gpmf, gpmd]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-01-28/trekview-guide-test-cases.png
featured_image: /assets/images/blog/2021-01-28/trekview-guide-test-cases-sm.png
layout: post
published: true
---

[In 2022 I did an introductory post on the GoPro Metadata Format (GPMF / GPMD) for video telemetry](/blog/2020/metadata-exif-xmp-360-video-files-gopro-gpmd).

As we've been working on Explorer, we've been learning lots about how different GoPro cameras write different metadata to the image and video files they product. 

## Beware of time

If the camera time is set incorrectly, many cameras will write this into the DateTimeOriginal fields.

[Here's a good example](https://github.com/trek-view/gopro-metadata/blob/main/hero10/hte-hero-pho-001/GOPR0056.xml).

```
<ExifIFD:DateTimeOriginal>2022:06:08 15:48:10</ExifIFD:DateTimeOriginal>
```

In this case, the date time on the camera has been set in the future.

The lesson here is to rely on GPS reported time, should it be available.

```
 <GPS:GPSTimeStamp>15:47:23</GPS:GPSTimeStamp>
 <GPS:GPSDateStamp>2022:01:12</GPS:GPSDateStamp>
```

In the above example, you can see the cameras clock was set almost 6 months ahead the actual time reported by the GPS.

This is not unique to GoPro cameras, but does affect them all.

If the camera has been setup with a phone (and uses phone time) it's not a problem, but of course, not everyone does this.

## The front (Fusion) image contains the GPS metadata

The Fusion creates two unstitched files (either .jpg's and .mp4's).

The front file and back files contains all the metadata for the capture settings, which will usually be different on each lens due to varying light levels on either side of the camera (e.g. shutter speed):

```
<ExifIFD:ShutterSpeedValue>1/1342</ExifIFD:ShutterSpeedValue>
```

If you're looing for GPS and IMU telemetry, this is in the file only. 

Here's an example of the metadata held in the [front photo](https://github.com/trek-view/gopro-metadata/blob/main/fusion/fus-360-pho-001u/GPFR0004.xml) and [back photo](https://github.com/trek-view/gopro-metadata/blob/main/fusion/fus-360-pho-001u/GPBK0004.xml).

For videos, you can see there is a significant difference between the [front video](https://github.com/trek-view/gopro-metadata/blob/main/fusion/fus-360-vid-001u/GPFR0002.xml) and [back video](https://github.com/trek-view/gopro-metadata/blob/main/fusion/fus-360-vid-001u/GPBK0002.xml), with the [GPMD telemetry stream](/blog/2020/metadata-exif-xmp-360-video-files-gopro-gpmd) (and keep in mind the sample used is a short video).

#### A note determining front and back images

Assuming GPS is enabled this is the only way to identify front and back images, as GoPro confusingly print the following data in both the back and front images:

```
<GoPro:DeviceName>Back Lens</GoPro:DeviceName>
<GoPro:DeviceName>Front Lens</GoPro:DeviceName>
```

## It's not always possible to tell the camera mode used

The GoPro filename prefixes make it possible to determine some modes used ([MAX](https://guides.trekview.org/explorer/developer-docs/sequences/capture/gopro-max-camera-modes), [Fusion](https://guides.trekview.org/explorer/developer-docs/sequences/capture/gopro-fusion-camera-modes), [HERO 10](https://guides.trekview.org/explorer/developer-docs/sequences/capture/gopro-hero-10-modes)) that is, assuming the files have not renamed.

Even so, that's not perfect.

For example, here's an example of a GoPro MAX;

* [360 video (raw), `GS018421.360`](https://github.com/trek-view/gopro-metadata/blob/main/max/max-360-vid-001u/GS018421.xml)
* [360 video, `GS018421.mp4`](https://github.com/trek-view/gopro-metadata/blob/main/max/max-360-vid-001s1/GS018421-5_6k-output.xml)
* [HERO video (.mp4), `GPAA8686.mp4`](https://github.com/trek-view/gopro-metadata/blob/main/max/max-hero-tlp-001/GPAA8686.xml)
* [360 timelapse video (raw), `GS018681.360`](https://github.com/trek-view/gopro-metadata/blob/main/max/max-360-tlp-001u/GS018681.xml)
* [360 timelapse video (stitched), `GS018681.mp4`](https://github.com/trek-view/gopro-metadata/blob/main/max/max-360-tlp-001s1/GS018681-5_6k-output.xml)
* [360 timelapse video timewarp mode (raw), `GS018469.360`](https://github.com/trek-view/gopro-metadata/blob/main/max/max-360-tlp-003u/GS018469.xml)
* [360 timelapse video timewarp mode (stitched), `GS018469.mp4`](https://github.com/trek-view/gopro-metadata/blob/main/max/max-360-tlp-003s1/GS018469-5_6k-output.xml)
* [HERO video, `GH018658.mp4`](https://github.com/trek-view/gopro-metadata/blob/main/max/max-hero-vid-001/GH018658.xml)
* [HERO video timelapse mode, `GH018706.mp4`](https://github.com/trek-view/gopro-metadata/blob/main/max/max-hero-tlp-011/GH018706.xml)

The difference between a GoPro MAX 360 video and timelapse video is not identifiable by filename prefix. All videos and timelapse video start with `GS` (equirectangular) and `GH` (HERO).

It's the same with the Fusion and HERO 10 too (although the prefixes are slightly different).

It is possible to use framerate values to identify timelapses slower than GoPro video modes (<23 FPS).

Although this is not perfect. Most timelapses are stored at 29.97 FPS (the same as 30 FPS video) mode:

```
<Track1:VideoFrameRate>29.97</Track1:VideoFrameRate>
```

It is possible to determine a timelapse (shot in timewarp mode) the `GoPro:Rate` tag. e.g.

```
<GoPro:Rate>2X</GoPro:Rate>
```

Where the value determines on the mode used (e.g. `AUTO`, `2X`, `5X`, `10X`, `15X`, `30X`).

However, for timelapses not shot in timewarp mode this tag contains the value

```
<GoPro:Rate>2_1SEC</GoPro:Rate>
```

Which is also reported in video files, so no use there.

You can however use the track handlers reported when normal timelapse mode is being used.

Using the MAX as an example, videos always have sound, and therefore an audio track:

```
<Track2:HandlerClass>Media Handler</Track2:HandlerClass>
<Track2:HandlerType>Audio Track</Track2:HandlerType>
```

Whereas timelapse videos have no sound, so no audio track will be present in the video metadata.

## You can determine the cameras image settings though

The GPMD contains useful information about the image settings used on the camera, for example if Protune was enabled

```
<GoPro:DigitalZoom>No</GoPro:DigitalZoom>
<GoPro:ProTune>On</GoPro:ProTune>
<GoPro:WhiteBalance>AUTO</GoPro:WhiteBalance>
<GoPro:Sharpness>HIGH</GoPro:Sharpness>
<GoPro:ColorMode>GOPRO</GoPro:ColorMode>
<GoPro:MaximumShutterAngle>AUTO</GoPro:MaximumShutterAngle>
<GoPro:AutoISOMax>1600</GoPro:AutoISOMax>
<GoPro:AutoISOMin>100</GoPro:AutoISOMin>
<GoPro:ExposureCompensation>0.0</GoPro:ExposureCompensation>
```

This can be useful to know should you want to make further modification to the imagery in stitching and post-processing (e.g. altering colour balance).

## Test cases

One of the most important parts of any software release is testing, making sure the app works as expected.

In order to do this, we've created content from each mode available on GoPro cameras; Fusion, MAX, and the HERO 10.

All our test cases for the above are released under CC BY 4.0 license.

[You can find the download links to all our samples (including the ones used in this post) in our Guides](https://guides.trekview.org/explorer/developer-docs/sequences/capture).

[Metadata samples and the camera user guides can also be found in our GoPro metadata repository on Github](https://github.com/trek-view/gopro-metadata).