---
date: 2022-06-24
title: "Using GSpherical and GPano Metadata tags to adjust for roll, pitch and heading"
description: "Ensure your photos are loaded as you want them to be displayed"
categories: developers
tags: [ffmpeg, yaw, pitch, roll, equirectangular, video, mp4]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-06-24/
featured_image: /assets/images/blog/2022-06-24/
layout: post
published: true
---

In the last few posts I have talked about how to adjust for roll, pitch, yaw. and heading by modifying the video or image files.

Sometimes this is overkill as it is possible to achieve the same result using the metadata of a photo or video.

Many viewers use GPano (photo) and GSpherical metadata tags to render equirectangular content.

I have talked about the importance of setting `GPano:ProjectionType = equirectangular` and `GSpherical:ProjectionType = equirectangular` for photo and video files respectively to ensure 360 viewer controls are shown.

However, there are a number of other useful metadata tags in these specifications that can be used to adjust roll, pitch and yaw in the viewer.

## Adjusting the viewer using GPano for 360 images

You can see the full Google Photosphere (GPano) specification here: https://developers.google.com/streetview/spherical-metadata

In terms of roll, pitch and yaw the relevant tags are

* `GPano:PoseHeadingDegrees`
* `GPano:PosePitchDegrees`
* `GPano:PoseRollDegrees`
* `GPano:InitialViewHeadingDegrees`
* `GPano:InitialViewPitchDegrees`
* `GPano:InitialViewRollDegrees`

On the GoPro MAX in timelapse photo mode all of these values are set to 0. Frustratingly GoPro does not consider sensor data to update these values.

Here is an example to demonstrate...

```shell
exiftool -ee -X GSAQ3296.JPG
```

Which returns the following for these tags;

```xml
<XMP-GPano:PoseHeadingDegrees>0.0</XMP-GPano:PoseHeadingDegrees>
 <XMP-GPano:PosePitchDegrees>0.0</XMP-GPano:PosePitchDegrees>
 <XMP-GPano:PoseRollDegrees>0.0</XMP-GPano:PoseRollDegrees>
 <XMP-GPano:InitialViewHeadingDegrees>0.0</XMP-GPano:InitialViewHeadingDegrees>
 <XMP-GPano:InitialViewPitchDegrees>0.0</XMP-GPano:InitialViewPitchDegrees>
 <XMP-GPano:InitialViewRollDegrees>0.0</XMP-GPano:InitialViewRollDegrees>
```

And here is what this photo looks like in a photo viewer:

<iframe width="600" height="400" allowfullscreen style="border-style:none;" src="https://www.trekview.org/trekviewer.htm#panorama=https://www.trekview.org/assets/images/blog/2022-06-24/GSAQ3296.JPG&amp;autoLoad=true"></iframe>

Now, lets assume we know the actual roll, pitch and heading of the photo.

Let us say roll = 90, pitch = 80, and heading = 180.

Using exiftool to modify these values;

```shell
cp GSAQ3296.JPG GSAQ3296-pose-mod.JPG
exiftool -XMP-GPano:PoseHeadingDegrees=180 -XMP-GPano:PosePitchDegrees=80 -XMP-GPano:PoseRollDegrees=90 GSAQ3296-pose-mod.JPG
```

<iframe width="600" height="400" allowfullscreen style="border-style:none;" src="https://www.trekview.org/trekviewer.htm#panorama=https://www.trekview.org/assets/images/blog/2022-06-24/GSAQ3296-pose-mod.JPG&amp;autoLoad=true"></iframe>


```shell
cp GSAQ3296.JPG GSAQ3296-inview-mod.JPG
exiftool -XMP-GPano:InitialViewHeadingDegrees=180 -XMP-GPano:InitialViewPitchDegrees=80 -XMP-GPano:InitialViewRollDegrees=90 GSAQ3296-inview-mod.JPG
````

<iframe width="600" height="400" allowfullscreen style="border-style:none;" src="https://www.trekview.org/trekviewer.htm#panorama=https://www.trekview.org/assets/images/blog/2022-06-24/GSAQ3296-inview-mod.JPG&amp;autoLoad=true"></iframe>

